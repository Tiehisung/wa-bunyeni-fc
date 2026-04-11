"use client";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { IPlayer } from "@/types/player.interface";
import { PrimaryCollapsible } from "../Collapsible";
import { formatDate } from "@/lib/timeAndDate";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Optional: Register custom fonts

// Font.register({
//   family: "Inter",
//   fonts: [
//     {
//       src: "/fonts/Inter-Regular.ttf",
//       fontWeight: 400,
//     },
//     {
//       src: "/fonts/Inter-Medium.ttf",
//       fontWeight: 500,
//     },
//     {
//       src: "/fonts/Inter-SemiBold.ttf",
//       fontWeight: 600,
//     },
//     {
//       src: "/fonts/Inter-Bold.ttf",
//       fontWeight: 700,
//     },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    fontSize: 11,
    color: "#1a1a1a",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: 700,
  },
  section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1px solid #E0E0E0",
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 600,
    color: "#213743",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    width: "35%",
  },
  value: {
    fontSize: 11,
    width: "65%",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginBottom: 10,
  },
});

// Adjust this interface to match your actual TypeScript shape
interface PlayerSigningFormProps {
  player?: IPlayer;
}

export default function PlayerSigningDocument({
  player,
}: PlayerSigningFormProps) {
  const fullName = `${player?.firstName} ${player?.lastName}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>PLAYER SIGNING FORM</Text>

        {player?.avatar && <Image src={player?.avatar} style={styles.avatar} />}

        {/* Player Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{fullName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>
              {formatDate(player?.dob, "dd/mm/yyyy")}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Height:</Text>
            <Text style={styles.value}>
              {player?.height ? player?.height + "cm" : "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Position:</Text>
            <Text style={styles.value}>{player?.position ?? "N/A"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jersey Number:</Text>
            <Text style={styles.value}>{player?.number}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{player?.phone}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{player?.email ?? "N/A"}</Text>
          </View>
        </View>

        {/* Manager Info */}
        {player?.manager && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guardian / Manager Info</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>
                {player?.manager?.fullname ?? "N/A"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>
                {player?.manager?.phone ?? "N/A"}
              </Text>
            </View>

             
          </View>
        )}

        {/* Club Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club Registration Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Date Signed:</Text>
            <Text style={styles.value}>{player?.dateSigned}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Captaincy:</Text>
            <Text style={styles.value}>{player?.captaincy ?? "None"}</Text>
          </View>
        </View>

        {/* Additional Info */}
        {player?.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text>{player?.about}</Text>
          </View>
        )}

        {player?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Description</Text>
            <Text>{player?.description}</Text>
          </View>
        )}

        {/* Signature Section */}
        <View style={{ marginTop: 40 }}>
          <Text style={styles.sectionTitle}>Signatures</Text>

          <View style={{ marginTop: 30 }}>
            <Text>Player Signature: _______________________________</Text>
            <Text style={{ marginTop: 20 }}>
              Manager Signature: _______________________________
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function DownloadPlayerForm({ player }: { player?: IPlayer }) {
  if (!player) {
    return <div>No player data available.</div>;
  }

  return (
    <div className="">
      <PDFDownloadLink
        document={<PlayerSigningDocument player={player as IPlayer} />}
        fileName={`${player?.firstName}-${player?.lastName}-signing-form.pdf`}
        className="_primaryBtn w-fit"
      >
        {({ loading, error }) => (
          <div>
            {loading ? "Generating PDF..." : "Download Player Signing Form"}

            {error && <p>{error.message}</p>}
          </div>
        )}
      </PDFDownloadLink>

      <PrimaryCollapsible header={{ label: "Preview" }}>
        <PDFViewer width="100%" height="800">
          <PlayerSigningDocument player={player as IPlayer} />
        </PDFViewer>
      </PrimaryCollapsible>
    </div>
  );
}
