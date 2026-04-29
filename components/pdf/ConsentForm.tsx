'use client'

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { IPlayer } from "@/types/player.interface";
import { formatDate } from "@/lib/timeAndDate";
import { COMBOBOX } from "../ComboBox";
import { DIALOG } from "../Dialog";
import { MdOutlineDownload, MdOutlinePreview } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { H,   } from "../Element";
import { TEAM } from "@/data/team";
import { Button } from "../buttons/Button";

// Styles
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
  },
  sectionBorder: {
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
  signatureLine: {
    marginTop: 20,
    marginBottom: 10,
  },
});

// Props
interface PlayerConsentFormProps {
  player?: IPlayer;
}

// Component
export default function PlayerConsentForm({ player }: PlayerConsentFormProps) {
  const fullName = `${player?.firstName} ${player?.lastName}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>PLAYER PARTICIPATION & CONSENT FORM</Text>
        <View style={styles.sectionBorder}>
          <View style={styles.row}>
            <Image
              src={TEAM.logo}
              style={{
                width: 90,
                height: 90,
                borderRadius: 99999996,
                marginBottom: 10,
              }}
            />

            {player?.avatar && (
              <Image
                src={player?.avatar}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              />
            )}
          </View>
        </View>

        {/* Program Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Overview</Text>
          <Text>
            Konjiehi FC is dedicated to developing young talent from the
            Konjiehi community. The youth program trains student players after
            school and during free time to nurture their skills for future
            benefit.
          </Text>
          <Text style={{ marginTop: 5 }}>
            Parent/guardian consent is critical as trainings can sometimes
            involve risks, including time commitment outside home hours and
            possible injuries.
          </Text>
        </View>

        {/* Player Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>
              {formatDate(player?.dob, "March 2, 2025")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Provisional Position:</Text>
            <Text style={styles.value}>{player?.position ?? "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jersey Number:</Text>
            <Text style={styles.value}>{player?.number}</Text>
          </View>
        </View>

        {/* Parent/Guardian Info */}
        {player?.manager && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Parent / Guardian Information
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>
                {player?.manager?.fullname ?? "—"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Relationship:</Text>
              <Text style={styles.value}>Manager</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{player?.manager?.phone ?? "—"}</Text>
            </View>
          </View>
        )}

        {/* Consent Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consent Statement</Text>
          <Text>
            By signing below, I, the parent/guardian of the player named in this
            form, give full consent for my child to participate in Konjiehi FC's
            youth program. I understand the risks involved and agree to support
            the program's schedules and rules.
          </Text>
        </View>

        {/* Signature Lines */}
        <View style={{ marginTop: 30 }}>
          <Text style={styles.signatureLine}>
            Player Signature: ________________________________________________
          </Text>
          <Text style={styles.signatureLine}>
            Parent/Guardian Signature: _______________________________________
          </Text>
          <Text style={styles.signatureLine}>
            Coach/Manager Signature: _________________________________________
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export function ConsentForm({ players }: { players?: IPlayer[] }) {
  const [selectedPlayer, setSelectedPlayer] = React.useState<
    IPlayer | undefined
  >(undefined);

  if (!players || players.length === 0) {
    return <div>No player data available.</div>;
  }
  return (
    <section className=" gap-4 pb-20">
     
      <H>Player/Guardian Consent Form</H>
      <br />
      <div>
        <COMBOBOX
          options={
            players?.map((p) => ({
              label: `${p.firstName} ${p?.lastName}`,
              value: `${p.firstName} ${p?.lastName}`,
            })) ?? []
          }
          onChange={(opt) =>
            setSelectedPlayer(
              players?.find(
                (p) => `${p.firstName} ${p?.lastName}` === opt.value,
              ),
            )
          }
          placeholder="Search Player"
          className="w-full min-w-44 text-center"
        />

        <section className="flex items-center gap-6 mt-4">
          <DIALOG
            trigger={
              <>
                <MdOutlinePreview size={24} /> Preview
              </>
            }
            className="min-w-[80vw]"
          >
            <PDFViewer width="100%" height={800}>
              <PlayerConsentForm player={selectedPlayer} />
            </PDFViewer>
          </DIALOG>

          <PDFDownloadLink
            document={<PlayerConsentForm player={selectedPlayer} />}
            fileName={`${selectedPlayer?.firstName}-${selectedPlayer?.lastName}-consent.pdf`}
          >
            {({ loading, error }) => {
              if (error)
                return (
                  <span className="text-destructive">
                    Error: {error.message}
                  </span>
                );
              return loading ? (
                <VscLoading className="animate-spin" />
              ) : (
                <Button className="p-1.5 rounded _shrink flex items-center gap-1 ">
                  <MdOutlineDownload size={24} />
                  Download
                </Button>
              );
            }}
          </PDFDownloadLink>
        </section>
      </div>
    </section>
  );
}
