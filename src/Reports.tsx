import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Boxes,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Package,
  Printer,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  WalletCards,
  Wrench,
} from "lucide-react";

type Range = "Today" | "This Week" | "This Month" | "This Year" | "Custom";
type ReportType =
  | "Sales Reports"
  | "Repair Reports"
  | "Inventory Reports"
  | "Purchase Reports"
  | "Payment Reports"
  | "Expense Reports";
const lkr = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
const chartSets: Record<Range, { labels: string[]; revenue: number[]; expenses: number[] }> = {
  Today: {
    labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],
    revenue: [18, 32, 24, 45, 38, 29],
    expenses: [6, 12, 8, 18, 11, 9],
  },
  "This Week": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    revenue: [220, 285, 240, 318, 356, 294],
    expenses: [118, 132, 105, 146, 162, 129],
  },
  "This Month": {
    labels: ["W1", "W2", "W3", "W4", "W5"],
    revenue: [1160, 1320, 1480, 1690, 1210],
    expenses: [670, 720, 810, 860, 630],
  },
  "This Year": {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    revenue: [4200, 4750, 5310, 5880, 6420, 7040],
    expenses: [2310, 2540, 2790, 3050, 3280, 3510],
  },
  Custom: {
    labels: ["01 May", "06 May", "12 May", "18 May", "24 May"],
    revenue: [640, 920, 1140, 1380, 1680],
    expenses: [310, 480, 590, 710, 820],
  },
};
const reportData: Record<ReportType, { headers: string[]; rows: (string | number)[][] }> = {
  "Sales Reports": {
    headers: ["Date", "Invoice ID", "Customer", "Description", "Amount", "Status"],
    rows: [
      ["24 May 2024", "INV-2099", "Nimal Perera", "Repair invoice", 40000, "Partially Paid"],
      ["24 May 2024", "INV-2098", "Fathima Rizna", "Full vehicle service", 54900, "Paid"],
      ["23 May 2024", "INV-2096", "Chamika Dias", "Direct parts sale", 21000, "Paid"],
      ["22 May 2024", "INV-2094", "Tharindu Wijesinghe", "Direct parts sale", 17700, "Draft"],
    ],
  },
  "Repair Reports": {
    headers: ["Date", "Job ID", "Customer", "Description", "Amount", "Status"],
    rows: [
      [
        "24 May 2024",
        "JOB-1048",
        "Nimal Perera",
        "Engine diagnostic & tune-up",
        42500,
        "In Progress",
      ],
      ["24 May 2024", "JOB-1047", "Sachini Fernando", "A/C system inspection", 18000, "Inspection"],
      ["22 May 2024", "JOB-1044", "Fathima Rizna", "Full engine service", 54900, "Completed"],
    ],
  },
  "Inventory Reports": {
    headers: ["Date", "Part Code", "Item", "Description", "Amount", "Status"],
    rows: [
      ["24 May 2024", "SP-NGK-IFR", "Iridium Spark Plug", "4 units used", 17000, "Issued"],
      ["24 May 2024", "TOF-041", "Toyota Oil Filter", "Low stock alert", 8400, "Low Stock"],
      ["22 May 2024", "TYR-MC-090", "Motorcycle Tyre", "6 units purchased", 63000, "Received"],
    ],
  },
  "Purchase Reports": {
    headers: ["Date", "Purchase ID", "Supplier", "Description", "Amount", "Status"],
    rows: [
      ["24 May 2024", "PUR-0542", "Japan Auto Traders", "12 spare parts", 221500, "Partial"],
      ["22 May 2024", "PUR-0541", "Lanka Tyre House", "8 tyre items", 186500, "Paid"],
      ["20 May 2024", "PUR-0540", "United Motors Lanka", "16 lubricant items", 300000, "Unpaid"],
    ],
  },
  "Payment Reports": {
    headers: ["Date", "Payment ID", "Customer", "Description", "Amount", "Status"],
    rows: [
      ["24 May 2024", "PAY-0842", "Nimal Perera", "Cash — INV-2099", 25000, "Completed"],
      ["24 May 2024", "PAY-0841", "Fathima Rizna", "Card — INV-2098", 54900, "Completed"],
      ["24 May 2024", "PAY-0840", "Lanka Fresh Foods", "Transfer — INV-2097", 15000, "Completed"],
    ],
  },
  "Expense Reports": {
    headers: ["Date", "Expense ID", "Paid To", "Description", "Amount", "Status"],
    rows: [
      [
        "24 May 2024",
        "EXP-0382",
        "Ceylon Electricity Board",
        "Workshop electricity",
        48500,
        "Paid",
      ],
      ["23 May 2024", "EXP-0381", "Tool Mart Lanka", "Mechanic tools", 76200, "Paid"],
      ["20 May 2024", "EXP-0380", "Garage Staff Payroll", "Salary advance", 285000, "Paid"],
    ],
  },
};
const parts = [
  ["Engine Oil 5W-30", 84],
  ["Oil Filters", 68],
  ["Brake Pads", 54],
  ["Spark Plugs", 46],
  ["Air Filters", 39],
];
const services = [
  ["General Service", 34, "#2563eb"],
  ["Engine Repair", 24, "#7c3aed"],
  ["Electrical", 18, "#0891b2"],
  ["A/C Service", 14, "#f59e0b"],
  ["Other", 10, "#94a3b8"],
];

export default function Reports({ notify }: { notify: (m: string) => void }) {
  const [range, setRange] = useState<Range>("This Month"),
    [active, setActive] = useState<ReportType>("Sales Reports"),
    [exportOpen, setExportOpen] = useState(false),
    [customOpen, setCustomOpen] = useState(false),
    [metric, setMetric] = useState<"Revenue" | "Expenses" | "Both">("Both");
  const chart = chartSets[range],
    max = Math.max(...chart.revenue, ...chart.expenses) * 1.15;
  const figures = useMemo(
    () =>
      range === "Today"
        ? { rev: 147400, exp: 48500, jobs: 12, parts: 23, out: 132500 }
        : range === "This Year"
          ? { rev: 48500000, exp: 28600000, jobs: 1482, parts: 3840, out: 132500 }
          : { rev: 6850000, exp: 3210000, jobs: 148, parts: 426, out: 132500 },
    [range],
  );
  const net = figures.rev - figures.exp;
  const exportReport = (type: string) => {
    setExportOpen(false);
    notify(`${active} exported as ${type}`);
  };
  return (
    <main className="dashboard repair-page reports-page">
      <div className="repair-header reports-header">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Monitor garage performance, trends and detailed operational records.</p>
        </div>
        <div className="report-controls">
          <div className="report-range">
            <CalendarDays size={15} />
            <select
              value={range}
              onChange={(e) => {
                const value = e.target.value as Range;
                setRange(value);
                setCustomOpen(value === "Custom");
              }}
            >
              {["Today", "This Week", "This Month", "This Year", "Custom"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <ChevronDown size={13} />
          </div>
          <div className="menu-anchor">
            <button className="export-button" onClick={() => setExportOpen(!exportOpen)}>
              <Download size={15} /> Export Report <ChevronDown size={13} />
            </button>
            {exportOpen && (
              <div className="dropdown report-export">
                <button onClick={() => exportReport("PDF")}>
                  <FileText size={15} /> Export PDF
                </button>
                <button onClick={() => exportReport("Excel")}>
                  <FileSpreadsheet size={15} /> Export Excel
                </button>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    window.print();
                  }}
                >
                  <Printer size={15} /> Print Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {customOpen && (
        <section className="custom-range">
          <span>Custom reporting period</span>
          <label>
            From
            <input type="date" defaultValue="2024-05-01" />
          </label>
          <label>
            To
            <input type="date" defaultValue="2024-05-24" />
          </label>
          <button
            onClick={() => {
              setCustomOpen(false);
              notify("Custom date range applied");
            }}
          >
            Apply Range
          </button>
        </section>
      )}
      <section className="report-summary">
        {[
          [
            "Total Revenue",
            lkr(figures.rev),
            "+12.8% vs previous period",
            CircleDollarSign,
            "blue",
            "up",
          ],
          [
            "Total Expenses",
            lkr(figures.exp),
            "+4.2% vs previous period",
            WalletCards,
            "red",
            "down",
          ],
          [
            "Net Profit",
            lkr(net),
            `${((net / figures.rev) * 100).toFixed(1)}% margin`,
            TrendingUp,
            "green",
            "up",
          ],
          ["Total Repairs", figures.jobs, "Completed and active jobs", Wrench, "violet", ""],
          ["Parts Sold", figures.parts, "New and reconditioned units", Package, "cyan", ""],
          [
            "Outstanding Payments",
            lkr(figures.out),
            "Across customer invoices",
            CreditCard,
            "orange",
            "",
          ],
        ].map(([a, b, c, I, t, trend]) => {
          const Icon = I as typeof CircleDollarSign;
          return (
            <article key={a as string}>
              <span className={t as string}>
                <Icon size={19} />
              </span>
              <div>
                <small>{a as string}</small>
                <strong>{b as string | number}</strong>
                <p className={trend as string}>
                  {trend === "up" ? (
                    <ArrowUp size={11} />
                  ) : trend === "down" ? (
                    <ArrowDown size={11} />
                  ) : null}
                  {c as string}
                </p>
              </div>
            </article>
          );
        })}
      </section>
      <section className="report-chart-grid">
        <article className="panel report-line-panel">
          <div className="panel-header">
            <div>
              <h3>Revenue vs Expenses</h3>
              <p>Financial performance for {range.toLowerCase()}</p>
            </div>
            <div className="segmented">
              {(["Both", "Revenue", "Expenses"] as const).map((x) => (
                <button
                  className={metric === x ? "active" : ""}
                  onClick={() => setMetric(x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="report-legend">
            {metric !== "Expenses" && (
              <span>
                <i className="revenue" />
                Revenue
              </span>
            )}
            {metric !== "Revenue" && (
              <span>
                <i className="expenses" />
                Expenses
              </span>
            )}
            <strong>Values in LKR thousands</strong>
          </div>
          <TrendChart chart={chart} max={max} metric={metric} />
        </article>
        <article className="panel profit-panel">
          <div className="panel-header">
            <div>
              <h3>Monthly Profit</h3>
              <p>Net profit trend in LKR</p>
            </div>
          </div>
          <div className="profit-bars">
            {[
              ["Jan", 1280],
              ["Feb", 1420],
              ["Mar", 1510],
              ["Apr", 1680],
              ["May", 1820],
              ["Jun", 2100],
            ].map(([m, v]) => (
              <div key={m as string}>
                <span
                  title={lkr((v as number) * 1000)}
                  style={{ height: `${((v as number) / 2100) * 150}px` }}
                >
                  <i>{v}K</i>
                </span>
                <small>{m}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="report-secondary-grid">
        <article className="panel status-chart">
          <div className="panel-header">
            <div>
              <h3>Repair Jobs by Status</h3>
              <p>Current workflow distribution</p>
            </div>
          </div>
          <div className="status-chart-body">
            <div className="report-donut">
              <span>
                <b>43</b>
                <small>Total Jobs</small>
              </span>
            </div>
            <div>
              {[
                ["In Progress", 18, "#2563eb"],
                ["Completed", 12, "#10b981"],
                ["Waiting", 7, "#f59e0b"],
                ["Inspection", 4, "#8b5cf6"],
                ["Other", 2, "#94a3b8"],
              ].map(([a, b, c]) => (
                <p key={a as string}>
                  <i style={{ background: c as string }} />
                  {a as string}
                  <b>{b as number}</b>
                </p>
              ))}
            </div>
          </div>
        </article>
        <article className="panel parts-chart">
          <div className="panel-header">
            <div>
              <h3>Most Used Spare Parts</h3>
              <p>Units issued during this period</p>
            </div>
          </div>
          <div>
            {parts.map(([name, value], i) => (
              <div key={name as string}>
                <span>{i + 1}</span>
                <b>{name as string}</b>
                <i>
                  <em style={{ width: `${value as number}%` }} />
                </i>
                <strong>{value as number}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="panel service-chart">
          <div className="panel-header">
            <div>
              <h3>Revenue by Service Type</h3>
              <p>Share of service revenue</p>
            </div>
          </div>
          <div className="service-chart-body">
            <div className="service-donut" />
            <div>
              {services.map(([name, value, color]) => (
                <p key={name as string}>
                  <i style={{ background: color as string }} />
                  {name as string}
                  <b>{value as number}%</b>
                </p>
              ))}
            </div>
          </div>
        </article>
      </section>
      <section className="panel report-detail">
        <div className="report-tabs">
          {(Object.keys(reportData) as ReportType[]).map((x, i) => {
            const icons = [ReceiptText, Wrench, Boxes, ShoppingCart, CreditCard, WalletCards];
            const Icon = icons[i];
            return (
              <button className={active === x ? "active" : ""} onClick={() => setActive(x)} key={x}>
                <Icon size={14} />
                {x}
              </button>
            );
          })}
        </div>
        <div className="repair-table-heading">
          <div>
            <h3>{active}</h3>
            <p>Detailed records for {range.toLowerCase()}</p>
          </div>
          <button onClick={() => exportReport("Excel")}>
            <FileSpreadsheet size={14} /> Export Table
          </button>
        </div>
        <div className="table-scroll">
          <table className="customer-history-table report-table">
            <thead>
              <tr>
                {reportData[active].headers.map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData[active].rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      {j === 1 ? (
                        <button className="inventory-code">{cell}</button>
                      ) : j === 4 ? (
                        <b>{typeof cell === "number" ? lkr(cell) : cell}</b>
                      ) : j === 5 ? (
                        <span
                          className={`entity-status ${String(cell).toLowerCase().replace(/ /g, "-")}`}
                        >
                          <i />
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="report-table-footer">
          <span>{reportData[active].rows.length} records shown</span>
          <b>
            Total:{" "}
            {lkr(
              reportData[active].rows.reduce(
                (s, r) => s + (typeof r[4] === "number" ? r[4] : 0),
                0,
              ),
            )}
          </b>
        </div>
      </section>
    </main>
  );
}
function TrendChart({
  chart,
  max,
  metric,
}: {
  chart: { labels: string[]; revenue: number[]; expenses: number[] };
  max: number;
  metric: string;
}) {
  const points = (values: number[]) =>
    values.map((v, i) => [42 + (i * 610) / (values.length - 1), 190 - (v / max) * 150]);
  const path = (p: number[][]) => p.map(([x, y], i) => `${i ? "L" : "M"} ${x},${y}`).join(" ");
  const rev = points(chart.revenue),
    exp = points(chart.expenses);
  return (
    <div className="report-svg">
      <svg viewBox="0 0 690 225" role="img" aria-label="Revenue and expenses trend">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="42"
            x2="652"
            y1={40 + i * 37.5}
            y2={40 + i * 37.5}
            stroke="#e7ebf1"
            strokeDasharray="4 5"
          />
        ))}
        {metric !== "Expenses" && (
          <>
            <path d={path(rev)} fill="none" stroke="#2563eb" strokeWidth="3" />
            {rev.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="white" stroke="#2563eb" strokeWidth="3">
                  <title>{lkr(chart.revenue[i] * 1000)}</title>
                </circle>
              </g>
            ))}
          </>
        )}
        {metric !== "Revenue" && (
          <>
            <path d={path(exp)} fill="none" stroke="#ef4444" strokeWidth="3" />
            {exp.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#ef4444" strokeWidth="2">
                <title>{lkr(chart.expenses[i] * 1000)}</title>
              </circle>
            ))}
          </>
        )}
        {chart.labels.map((x, i) => (
          <text key={x} x={42 + (i * 610) / (chart.labels.length - 1)} y="215" textAnchor="middle">
            {x}
          </text>
        ))}
      </svg>
    </div>
  );
}
