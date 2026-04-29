 "use client";



import { PrimaryCollapsible } from "@/components/Collapsible";
import { Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ChartsSection() {
  const matchesData = [
    { date: "Jan 15", wins: 2, draws: 1, losses: 0 },
    { date: "Jan 22", wins: 3, draws: 0, losses: 1 },
    { date: "Jan 29", wins: 2, draws: 1, losses: 1 },
    { date: "Feb 5", wins: 3, draws: 1, losses: 0 },
    { date: "Feb 12", wins: 2, draws: 2, losses: 0 },
  ];

  const matchStats = [
    { name: "Goals", value: 45, color: "#ef4444" },
    { name: "Matches", value: 28, color: "#3b82f6" },
    { name: "Clean Sheets", value: 12, color: "#10b981" },
  ];
  return (
    <div>
      <PrimaryCollapsible
        header={{
          icon: <Clock />,
          label: <div className="text-xl font-semibold">SEASON PERFORMANCE</div>,
          className: "ring",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Performance */}
          <div className="lg:col-span-2">
            <p className="mb-5 _p">Wins, Draws, and Losses over time</p>

            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={matchesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="wins" fill="#10b981" name="Wins" />
                  <Bar dataKey="draws" fill="#f59e0b" name="Draws" />
                  <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Distribution */}
          <div className="">
            <h1 className="text-xl font-black">STATS BREAKDOWN</h1>

            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={matchStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {matchStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </PrimaryCollapsible>
    </div>
  );
}
