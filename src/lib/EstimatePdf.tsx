import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { ClientInfo, EstimateResult, WizardSelections } from "@/types/estimate";
import { formatMonths, formatPHP } from "@/lib/formatters";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#17150f" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  brand: { fontSize: 13, fontWeight: 700, maxWidth: 260 },
  brandSub: { fontSize: 8, fontStyle: "italic", color: "#6f6857", marginTop: 2 },
  reportMeta: { textAlign: "right", fontSize: 8, color: "#6f6857" },
  h1: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginTop: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#dad5c4", paddingBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  label: { color: "#6f6857" },
  value: { fontWeight: 700 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  gridItem: { width: "50%", paddingHorizontal: 6, marginBottom: 10 },
  statBox: { backgroundColor: "#f7f6f1", borderRadius: 8, padding: 10 },
  statLabel: { fontSize: 8, color: "#6f6857", marginBottom: 3 },
  statValue: { fontSize: 14, fontWeight: 700 },
  bullet: { flexDirection: "row", marginBottom: 4 },
  bulletDot: { width: 10, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#dad5c4", paddingTop: 10 },
  footerText: { fontSize: 7, color: "#8f8770" },
  signatureBox: { marginTop: 30, flexDirection: "row", justifyContent: "space-between" },
  signatureLine: { width: "45%", borderTopWidth: 1, borderTopColor: "#17150f", paddingTop: 4, fontSize: 8, color: "#6f6857" },
});

interface EstimatePdfProps {
  selections: WizardSelections;
  estimate: EstimateResult;
  client?: ClientInfo | null;
  reportId: string;
  qrDataUrl: string;
  logoDataUrl?: string | null;
}

export function EstimatePdf({ selections, estimate, client, reportId, qrDataUrl, logoDataUrl }: EstimatePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {logoDataUrl && <Image src={logoDataUrl} style={{ width: 32, height: 32 }} />}
            <View>
              <Text style={styles.brand}>ARCHIUNITE DESIGN & CONSTRUCTION</Text>
              <Text style={styles.brandSub}>"Together, let us share and build your story."</Text>
            </View>
          </View>
          <View style={styles.reportMeta}>
            <Text>Report ID: {reportId}</Text>
            <Text>Generated: {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</Text>
          </View>
        </View>

        <Text style={styles.h1}>Project Cost Estimate</Text>
        <Text style={{ color: "#6f6857", marginBottom: 10 }}>
          Prepared for {client?.name || "Prospective Client"}
          {client?.email ? ` · ${client.email}` : ""}
        </Text>

        <Text style={styles.sectionTitle}>Project Overview</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{selections.category}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Project Type</Text>
          <Text style={styles.value}>{selections.projectType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>
            {selections.location.city}, {selections.location.province}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Floor Area</Text>
          <Text style={styles.value}>{selections.floorArea} sqm</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quality Standard</Text>
          <Text style={styles.value}>{selections.quality}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Floors</Text>
          <Text style={styles.value}>{selections.building.floors}</Text>
        </View>

        <Text style={styles.sectionTitle}>Cost Summary</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ESTIMATED TOTAL INVESTMENT</Text>
              <Text style={styles.statValue}>{formatPHP(estimate.totalInvestment)}</Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CONSTRUCTION COST</Text>
              <Text style={styles.statValue}>{formatPHP(estimate.constructionCost)}</Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>PROJECT TIMELINE</Text>
              <Text style={styles.statValue}>{formatMonths(estimate.timelineMonths)}</Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BUDGET CATEGORY</Text>
              <Text style={styles.statValue}>{estimate.budgetCategory}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Professional Fee Breakdown</Text>
        {estimate.professionalFees.map((f) => (
          <View style={styles.row} key={f.label}>
            <Text style={styles.label}>{f.label}</Text>
            <Text style={styles.value}>{formatPHP(f.amount)}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>AI Recommendations</Text>
        {estimate.recommendations.slice(0, 8).map((r) => (
          <View style={styles.bullet} key={r}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{r}</Text>
          </View>
        ))}

        <View style={styles.signatureBox}>
          <Text style={styles.signatureLine}>Client Signature / Date</Text>
          <Text style={styles.signatureLine}>Archiunite Design & Construction Representative / Date</Text>
        </View>

        <Text style={{ marginTop: 16, fontSize: 7, color: "#8f8770", lineHeight: 1.5 }}>
          This document is a preliminary, AI-assisted estimate for planning purposes only. Figures are indicative and subject to
          detailed Bill of Quantities, site conditions, and final design. Not a binding quotation.
        </Text>

        <View style={styles.footer} fixed>
          <Image src={qrDataUrl} style={{ width: 34, height: 34 }} />
          <Text style={styles.footerText}>Prepared by Archiunite Design & Construction · archiunite.com · Report {reportId}</Text>
        </View>
      </Page>
    </Document>
  );
}
