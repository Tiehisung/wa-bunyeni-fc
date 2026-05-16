import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const sourceURI = process.env.MDB_URI as string;
const targetURI =
  "mongodb+srv://isoskode_db_user:Neutral1.@cluster0.gv0ivjs.mongodb.net/bunyenifc?appName=Cluster0";

/**
 * Migrate entire database from one project cluster to another
 * @returns
 */

export async function transferCollections() {
  const sourceClient = new MongoClient(sourceURI);
  const targetClient = new MongoClient(targetURI);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDB = sourceClient.db("bunyenifc");
    const targetDB = targetClient.db("bunyenifc");

    const collections = await sourceDB.listCollections().toArray();
    const summary: Record<string, number> = {};

    for (const { name } of collections) {
      const data = await sourceDB.collection(name).find({}).toArray();

      if (data.length > 0) {
        await targetDB.collection(name).deleteMany({}); // optional: clear old data
        await targetDB.collection(name).insertMany(data);
        summary[name] = data.length;
        console.log(`✅ Migrated ${data.length} documents from ${name}`);
      }
    }

    return {
      ok: true,
      message: "🎉 Migration complete!",
      migratedCollections: summary,
    };
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return { ok: false, error: error.message };
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}
