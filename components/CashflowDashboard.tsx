"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentUser from "./CurrentUser";
import CashflowCharts from "./CashFlowCharts";
import TransactionsDataTable from "./TransactionsDataTable";
import { CashflowRecord } from "@/types/supabase";
import AddNewTransaction from "./AddNewTransaction";

export default function CashflowDashboard({ userId }: { userId: string }) {
  const supabase = createClient();
  const [records, setRecords] = useState<CashflowRecord[]>([]);

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
          <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
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
          <TabsList className="grid grid-cols-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-1 rounded-xl mb-1 h-14">
            <TabsTrigger
              value="transactions"
              className="py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between px-4 py-2 bg-white mb-2 rounded-xl">
                  <div className="">
                    <h3 className="font-bold px-2">Transactions</h3>
                  </div>

                  <AddNewTransaction
                    userId={userId}
                    fetchRecords={fetchRecords}
                  />
                </div>
                <Suspense fallback={<div>Loading data...</div>}>
                  <TransactionsDataTable
                    records={records}
                    onUpdate={fetchRecords}
                  />
                </Suspense>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-2">
            <CashflowCharts records={records} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
