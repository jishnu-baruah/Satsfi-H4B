export interface Transaction {
  id: string
  type: string
  asset: string
  amount: string
  value: string
  status: string
  timestamp: string
  hash: string
  vault?: string
  apy?: number
  ltv?: number
  fee: string
  error?: string
}

export const exportToCSV = (transactions: Transaction[], filename = "transactions") => {
  const headers = [
    "ID",
    "Type",
    "Asset",
    "Amount",
    "Value",
    "Status",
    "Date",
    "Hash",
    "Vault",
    "APY",
    "LTV",
    "Fee",
    "Error",
  ]

  const csvContent = [
    headers.join(","),
    ...transactions.map((tx) =>
      [
        tx.id,
        tx.type,
        tx.asset,
        tx.amount.replace(/,/g, ""),
        tx.value.replace(/[$,]/g, ""),
        tx.status,
        new Date(tx.timestamp).toISOString(),
        tx.hash,
        tx.vault || "",
        tx.apy || "",
        tx.ltv || "",
        tx.fee.replace(/[$,]/g, ""),
        tx.error || "",
      ]
        .map((field) => `"${field}"`)
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToJSON = (transactions: Transaction[], filename = "transactions") => {
  const jsonContent = JSON.stringify(transactions, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
