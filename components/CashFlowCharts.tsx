"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CashflowRecord } from "@/types/supabase";

interface CashflowChartsProps {
  records: CashflowRecord[];
}

export default function CashflowCharts({ records }: CashflowChartsProps) {
  // Calculate data for charts
  const chartData = useMemo(() => {
    // 1. Category breakdown (Pie Chart)
    const categoryTotals: { [key: string]: number } = {};
    records.forEach((record) => {
      if (record.type === "expense") {
        categoryTotals[record.category] =
          (categoryTotals[record.category] || 0) + Number(record.amount);
      }
    });

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories

    // 2. Monthly trend (Line Chart)
    const monthlyData: {
      [key: string]: { income: number; expense: number; month: string };
    } = {};

    records.forEach((record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, month: monthName };
      }

      if (record.type === "income") {
        monthlyData[monthKey].income += Number(record.amount);
      } else {
        monthlyData[monthKey].expense += Number(record.amount);
      }
    });

    const trendData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((item) => ({
        month: item.month,
        income: Number(item.income.toFixed(2)),
        expense: Number(item.expense.toFixed(2)),
        balance: Number((item.income - item.expense).toFixed(2)),
      }));

    // 3. Income vs Expense (Bar Chart)
    const incomeTotal = records
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const expenseTotal = records
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const comparisonData = [
      { name: "Income", amount: Number(incomeTotal.toFixed(2)) },
      { name: "Expense", amount: Number(expenseTotal.toFixed(2)) },
    ];

    // 4. Recent activity (Last 7 days)
    const last7Days: { [key: string]: { income: number; expense: number } } =
      {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      last7Days[dateKey] = { income: 0, expense: 0 };
    }

    records.forEach((record) => {
      if (last7Days[record.date]) {
        if (record.type === "income") {
          last7Days[record.date].income += Number(record.amount);
        } else {
          last7Days[record.date].expense += Number(record.amount);
        }
      }
    });

    const weeklyData = Object.entries(last7Days).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      income: Number(data.income.toFixed(2)),
      expense: Number(data.expense.toFixed(2)),
    }));

    return {
      categoryData,
      trendData,
      comparisonData,
      weeklyData,
    };
  }, [records]);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div className="space-y-6">
      {/* Income vs Expense Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Income vs Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `₱${value.toFixed(2)}`}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {chartData.comparisonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Income" ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown by Category */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Top Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₱${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="text-sm font-medium">No expense data yet</p>
                  <p className="text-xs mt-1">
                    Add expenses to see category breakdown
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `₱${value.toFixed(2)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                  name="Expense"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-sm font-medium">No trend data yet</p>
                <p className="text-xs mt-1">
                  Add transactions to see monthly trends
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last 7 Days Activity */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Last 7 Days Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => `₱${value.toFixed(2)}`}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                name="Expense"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
