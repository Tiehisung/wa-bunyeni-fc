// scripts/migrate-users-to-fans.ts
import connectDB from "@/config/db.config";
import  FanModel  from "@/models/fans";
import UserModel from "@/models/user";
import { EFanBadge } from "@/types/fan.interface";

// Helper function to calculate engagement score from user data
function calculateEngagementScore(user: any): number {
  const contributions = user.contributions || {};
  let score = 0;

  // Comments scoring (max 30)
  if (contributions.comments >= 100) score += 30;
  else if (contributions.comments >= 50) score += 21;
  else if (contributions.comments >= 20) score += 15;
  else if (contributions.comments >= 10) score += 10;
  else if (contributions.comments >= 5) score += 5;
  else if (contributions.comments >= 1) score += 2;

  // Shares scoring (max 25)
  if (contributions.shares >= 50) score += 25;
  else if (contributions.shares >= 25) score += 18;
  else if (contributions.shares >= 10) score += 12;
  else if (contributions.shares >= 5) score += 8;
  else if (contributions.shares >= 1) score += 3;

  // Reactions scoring (max 20)
  if (contributions.reactions >= 200) score += 20;
  else if (contributions.reactions >= 100) score += 14;
  else if (contributions.reactions >= 50) score += 10;
  else if (contributions.reactions >= 20) score += 7;
  else if (contributions.reactions >= 10) score += 4;
  else if (contributions.reactions >= 1) score += 2;

  // Match attendance scoring (max 15)
  if (contributions.matchAttendance >= 20) score += 15;
  else if (contributions.matchAttendance >= 10) score += 11;
  else if (contributions.matchAttendance >= 5) score += 7;
  else if (contributions.matchAttendance >= 2) score += 4;
  else if (contributions.matchAttendance >= 1) score += 2;

  // Galleries scoring (max 10)
  if (contributions.galleries >= 10) score += 10;
  else if (contributions.galleries >= 5) score += 7;
  else if (contributions.galleries >= 3) score += 4;
  else if (contributions.galleries >= 1) score += 2;

  return Math.min(100, Math.round(score));
}

// Helper function to determine badges from user data
function determineBadges(user: any): EFanBadge[] {
  const badges: EFanBadge[] = [];
  const points = user.fanPoints || 0;
  const contributions = user.contributions || {};
  const fanSince = user.fanSince ? new Date(user.fanSince) : new Date();
  const daysSinceJoin = Math.floor(
    (Date.now() - fanSince.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Super Fan badge (1000+ points)
  if (points >= 1000) {
    badges.push(EFanBadge.SUPER_FAN);
  }

  // Comment Champion badge (100+ comments)
  if (contributions.comments >= 100) {
    badges.push(EFanBadge.COMMENT_CHAMPION);
  }

  // Match Day Regular badge (10+ matches)
  if (contributions.matchAttendance >= 10) {
    badges.push(EFanBadge.MATCH_DAY_REGULAR);
  }

  // Social Butterfly badge (50+ shares)
  if (contributions.shares >= 50) {
    badges.push(EFanBadge.SOCIAL_BUTTERFLY);
  }

  // Reaction Master badge (200+ reactions)
  if (contributions.reactions >= 200) {
    badges.push(EFanBadge.REACTION_MASTER);
  }

  // Gallery Contributor badge (5+ galleries)
  if (contributions.galleries >= 5) {
    badges.push(EFanBadge.GALLERY_CONTRIBUTOR);
  }

  // Early Bird badge (joined within first 30 days of fan system)
  if (daysSinceJoin <= 30) {
    badges.push(EFanBadge.EARLY_BIRD);
  }

  // Dedicated Fan badge (active for 1+ year)
  if (daysSinceJoin >= 365) {
    badges.push(EFanBadge.DEDICATED_FAN);
  }

  return badges;
}

// Main migration function
export async function migrateUsersToFans() {
  await connectDB();
  // Find all users
  const users = await UserModel.find({});
  console.log(`📊 Found ${users.length} total users\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    try {
      // Check if fan profile already exists
      let existingFan = await FanModel.findOne({ user: user._id });

      // Prepare fan data from user's existing fields
      const fanData = {
        user: user._id,
        points: user.fanPoints || 0,
        badges: user.fanBadges || [],
        engagementScore: user.engagementScore || calculateEngagementScore(user),
        contributions: {
          comments: user.contributions?.comments || 0,
          shares: user.contributions?.shares || 0,
          reactions: user.contributions?.reactions || 0,
          matchAttendance: user.contributions?.matchAttendance || 0,
          galleries: user.contributions?.galleries || 0,
          newsViews: user.contributions?.newsViews || 0,
        },
        fanSince: user.fanSince || new Date(),
        lastActive: user.lastActive || user.createdAt || new Date(),
        isActive: user.isActive !== false,
        preferences: {
          notifications: true,
        },
      };

      // Calculate and add badges based on existing data
      const badges = determineBadges(user);
      if (badges.length > 0) {
        fanData.badges = [...new Set([...fanData.badges, ...badges])];
      }

      if (existingFan) {
        // Update existing fan profile (for users who already have one)
        const updatedFan = await FanModel.findByIdAndUpdate(
          existingFan._id,
          { $set: fanData },
          { new: true },
        );
        updated++;
        console.log(
          `✅ Updated fan profile for: ${user.email || user.name} (ID: ${user._id})`,
        );
      } else {
        // Create new fan profile
        const newFan = await FanModel.create(fanData);
        created++;
        console.log(
          `✨ Created fan profile for: ${user.email || user.name} (ID: ${user._id})`,
        );
      }

      // Link fan profile to user (if not already linked)
      if (!user.fanProfile) {
        const fan = await FanModel.findOne({ userId: user._id });
        if (fan) {
          await UserModel.findByIdAndUpdate(user._id, { fanProfile: fan._id });
        }
      }
    } catch (error) {
      errors++;
      console.error(
        `❌ Failed to migrate user ${user.email || user.name}:`,
        error,
      );
    }

    // Progress indicator
    if ((created + updated + skipped + errors) % 10 === 0) {
      console.log(`📈 Progress: ${created + updated} processed...`);
    }
  }

  // Calculate ranks after all fans are created/updated
  console.log("\n🏆 Updating fan ranks...");

  const allFans = await FanModel.find({ isActive: true }).sort({ points: -1 });
  let batch = [];

  for (let i = 0; i < allFans.length; i++) {
    batch.push({
      updateOne: {
        filter: { _id: allFans[i]._id },
        update: { $set: { rank: i + 1 } },
      },
    });

    // Execute batch every 100 updates
    if (batch.length === 100 || i === allFans.length - 1) {
      await FanModel.bulkWrite(batch);
      batch = [];
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 MIGRATION COMPLETE");
  console.log("=".repeat(50));
  console.log(`✨ New fan profiles created: ${created}`);
  console.log(`🔄 Existing profiles updated: ${updated}`);
  console.log(`⏭️ Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`🏆 Ranks calculated for ${allFans.length} fans`);
  console.log("=".repeat(50));

  return allFans;

  //   process.exit(0);
}
