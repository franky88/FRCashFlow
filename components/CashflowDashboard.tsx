"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentUser from "./CurrentUser";
import CashflowCharts from "./CashFlowCharts";
import TransactionsDataTable from "./TransactionsDataTable";
import { CashflowRecord } from "@/types/supabase";

export default function CashflowDashboard({ userId }: { userId: string }) {
  const supabase = createClient();
  const [records, setRecords] = useState<CashflowRecord[]>([]);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [totals, setTotals] = useState<{ income: number; expense: number }>({
    income: 0,
    expense: 0,
  });

  const fetchRecords = useCallback(async () => {
    const { data, error } = await supabase
      .from("cashflow")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error(error);
    else {
      setRecords(data || []);
      calculateTotals(data || []);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  function calculateTotals(data: CashflowRecord[]) {
    const income = data
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const expense = data
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + Number(r.amount), 0);
    setTotals({ income, expense });
  }

  async function handleAddRecord(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("cashflow").insert([
      {
        user_id: userId,
        ...form,
        amount: Number(form.amount),
      },
    ]);

    if (!error) {
      setForm({
        type: "income",
        category: "",
        amount: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchRecords();
    } else {
      console.error(error);
    }
  }

  const balance = totals.income - totals.expense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Cashflow Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Track your income and expenses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CurrentUser />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="px-4">
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Balance
              </p>
              <p className="text-4xl font-bold mb-4">₱{balance.toFixed(2)}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-300"></div>
                  <span className="text-blue-50">Cash Flow</span>
                </div>
                <span
                  className={
                    balance >= 0
                      ? "text-green-300 font-semibold"
                      : "text-red-300 font-semibold"
                  }
                >
                  {balance >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs((balance / (totals.income || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Income</p>
              <p className="text-2xl font-bold text-green-600">
                ₱{totals.income.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                ₱{totals.expense.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Transaction Form */}
              <div className="lg:col-span-1">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Transaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddRecord} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Type
                        </Label>
                        <Select
                          value={form.type}
                          onValueChange={(v) => setForm({ ...form, type: v })}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">💰 Income</SelectItem>
                            <SelectItem value="expense">💸 Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Category
                        </Label>
                        <Input
                          placeholder="e.g. Food, Salary"
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Amount
                        </Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={form.amount}
                          onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                          }
                          className="mt-1.5"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Date
                        </Label>
                        <Input
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm({ ...form, date: e.target.value })
                          }
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700">
                          Note (Optional)
                        </Label>
                        <Input
                          placeholder="Add a note..."
                          value={form.note}
                          onChange={(e) =>
                            setForm({ ...form, note: e.target.value })
                          }
                          className="mt-1.5"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Add Transaction
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions Table */}
              <div className="lg:col-span-2">
                <TransactionsDataTable
                  records={records}
                  onUpdate={fetchRecords}
                />
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <CashflowCharts records={records} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
