import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 1,
  },
  table: {
    display: "table",
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#1e293b",
    color: "#fff",
    fontWeight: "bold",
  },
  tableCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 11,
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    // Remove flexGrow/flexBasis for fixed width
  },
  cellType: { width: "22%", textAlign: "left" },
  cellStatus: { width: "18%", textAlign: "center" },
  cellProduct: { width: "20%", textAlign: "left" },
  cellPrice: { width: "18%", textAlign: "right" },
  cellDate: { width: "22%", textAlign: "center", borderRight: 0 },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#1e293b",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  lastCell: {
    borderRight: 0,
  },
  oddRow: {
    backgroundColor: "#f1f5f9",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  noData: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 12,
    padding: 16,
    flexGrow: 1,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const formatPrice = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "-";
  return value;
};

const safeString = (value) => {
  if (value === undefined || value === null) return "-";
  if (typeof value === "object") return "-";
  return String(value);
};

const TransactionsTablePDF = ({ transactions = [] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Transactions Report</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerCell, styles.cellType]}>Type</Text>
          <Text style={[styles.tableCell, styles.headerCell, styles.cellStatus]}>Status</Text>
          <Text style={[styles.tableCell, styles.headerCell, styles.cellProduct]}>Product</Text>
          <Text style={[styles.tableCell, styles.headerCell, styles.cellPrice]}>Total Price</Text>
          <Text style={[styles.tableCell, styles.headerCell, styles.cellDate, styles.lastCell]}>Date</Text>
        </View>
        {/* Table Rows */}
        {Array.isArray(transactions) && transactions.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={styles.noData}>No Transactions Found</Text>
          </View>
        ) : (
          Array.isArray(transactions) &&
          transactions.map((t, idx) => {
            const type = safeString(t.transactionType);
            const status = safeString(t.transactionStatus);
            const product = t.product && t.product.name ? safeString(t.product.name) : "-";
            const price = formatPrice(t.totalPrice);
            const date = t.createdAt ? safeString(formatDate(t.createdAt)) : "-";
            const rowStyle = idx % 2 === 0 ? styles.evenRow : styles.oddRow;

            return (
              <View style={[styles.tableRow, rowStyle]} key={t.id || idx}>
                <Text style={[styles.tableCell, styles.cellType]}>{type}</Text>
                <Text style={[styles.tableCell, styles.cellStatus]}>{status}</Text>
                <Text style={[styles.tableCell, styles.cellProduct]}>{product}</Text>
                <Text style={[styles.tableCell, styles.cellPrice]}>{price}</Text>
                <Text style={[styles.tableCell, styles.cellDate, styles.lastCell]}>{date}</Text>
              </View>
            );
          })
        )}
      </View>
    </Page>
  </Document>
);

export default TransactionsTablePDF;