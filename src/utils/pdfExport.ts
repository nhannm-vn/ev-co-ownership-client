import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'

export interface FinancialReportData {
  groupName: string
  totalIncome: number
  totalExpense: number
  operatingBalance: number
  depositReserveBalance: number
  netBalance: number
}

export const exportFinancialReportToPDF = (
  data: FinancialReportData[],
  options?: {
    fundType?: string
    dateRange?: { from: string | null; to: string | null }
    title?: string
  }
) => {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Financial Reports', pageWidth / 2, 20, { align: 'center' })

  // Subtitle with filters
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  let subtitle = 'All Groups'
  if (options?.fundType && options.fundType !== 'ALL') {
    subtitle += ` - ${options.fundType}`
  }
  if (options?.dateRange?.from && options?.dateRange?.to) {
    const from = dayjs(options.dateRange.from).format('DD/MM/YYYY')
    const to = dayjs(options.dateRange.to).format('DD/MM/YYYY')
    subtitle += ` (${from} - ${to})`
  }
  doc.text(subtitle, pageWidth / 2, 28, { align: 'center' })

  // Generated date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Generated: ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`, pageWidth / 2, 35, { align: 'center' })

  // Table data
  const tableData = data.map((row) => [
    row.groupName,
    formatCurrency(row.totalIncome),
    formatCurrency(row.totalExpense),
    formatCurrency(row.operatingBalance),
    formatCurrency(row.depositReserveBalance),
    formatCurrency(row.netBalance)
  ])

  // Calculate totals
  const totals = data.reduce(
    (acc, row) => ({
      totalIncome: acc.totalIncome + row.totalIncome,
      totalExpense: acc.totalExpense + row.totalExpense,
      operatingBalance: acc.operatingBalance + row.operatingBalance,
      depositReserveBalance: acc.depositReserveBalance + row.depositReserveBalance,
      netBalance: acc.netBalance + row.netBalance
    }),
    {
      totalIncome: 0,
      totalExpense: 0,
      operatingBalance: 0,
      depositReserveBalance: 0,
      netBalance: 0
    }
  )

  // Add totals row
  tableData.push([
    'TOTAL',
    formatCurrency(totals.totalIncome),
    formatCurrency(totals.totalExpense),
    formatCurrency(totals.operatingBalance),
    formatCurrency(totals.depositReserveBalance),
    formatCurrency(totals.netBalance)
  ])

  // Create table
  autoTable(doc, {
    startY: 42,
    head: [['Group Name', 'Total Income', 'Total Expense', 'Operating Balance', 'Deposit Reserve', 'Net Balance']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [34, 139, 34], // Green
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 255, 245]
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { halign: 'right', cellWidth: 35 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 35 },
      5: { halign: 'right', cellWidth: 35 }
    },
    footStyles: {
      fillColor: [34, 139, 34],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    margin: { top: 42, left: 10, right: 10 }
  })

  // Add summary section
  const finalY = (doc as any).lastAutoTable?.finalY || 100
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 10, finalY + 15)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Groups: ${data.length}`, 10, finalY + 22)
  doc.text(`Total Income: ${formatCurrency(totals.totalIncome)}`, 10, finalY + 28)
  doc.text(`Total Expense: ${formatCurrency(totals.totalExpense)}`, 10, finalY + 34)
  doc.text(`Net Balance: ${formatCurrency(totals.netBalance)}`, 10, finalY + 40)

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('EV Co-ownership & Cost-sharing System', pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Save PDF
  const timestamp = dayjs().format('YYYYMMDD_HHmmss')
  const filename = `financial_reports_${timestamp}.pdf`
  doc.save(filename)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount)
}

