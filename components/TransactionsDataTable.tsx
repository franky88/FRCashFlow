"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionActions from "@/components/TransactionActions";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CashflowRecord } from "@/types/supabase";

interface TransactionsDataTableProps {
  records: CashflowRecord[];
  onUpdate: () => void;
}

export default function TransactionsDataTable({
  records,
  onUpdate,
}: TransactionsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Get unique categories
  const categories = Array.from(new Set(records.map((r) => r.category))).filter(
    Boolean
  );

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return (
          <div className="text-sm text-slate-600">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              type === "income"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {type === "income" ? "💰" : "💸"} {type}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm font-medium text-slate-700">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-transparent p-0 font-semibold"
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const type = row.original.type;
        return (
          <div
            className={`text-sm font-bold text-right ${
              type === "income" ? "text-green-600" : "text-red-600"
            }`}
          >
            {type === "income" ? "+" : "-"}₱{amount.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {row.getValue("note") || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <TransactionActions transaction={row.original} onUpdate={onUpdate} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);

      if (typeof value === "string") {
        return value.toLowerCase().includes(filterValue.toLowerCase());
      }

      if (columnId === "petty_cash_reference" && value) {
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      }

      return false;
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  function exportToCSV<T extends Record<string, unknown>>(
    filename: string,
    rows: T[]
  ): void {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]) as (keyof T)[];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const cell = row[header];
            return `"${String(cell ?? "").replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">
              {table.getFilteredRowModel().rows.length}
            </span>
            <span>of {records.length} transactions</span>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-indigo-50 hover:text-purple-600"
              onClick={() => {
                const currentData = table
                  .getFilteredRowModel()
                  .rows.map((r) => {
                    const { date, type, category, amount, note } = r.original;
                    return {
                      Date: new Date(date).toLocaleDateString("en-US"),
                      Type: type,
                      Category: category,
                      Amount: amount,
                      Note: note || "",
                    };
                  });
                exportToCSV("transactions.csv", currentData);
              }}
            >
              Download CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Global Search */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <Input
              placeholder="🔍 Search all columns..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full"
            />
            <Select
              value={
                (table.getColumn("type")?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("type")
                  ?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">💰 Income</SelectItem>
                <SelectItem value="expense">💸 Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                (table.getColumn("category")?.getFilterValue() as string) ??
                "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("category")
                  ?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="ml-auto flex gap-1 items-center">
              <span className="text-sm text-slate-600">Rows per page:</span>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-slate-50 hover:bg-slate-50"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-slate-700">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg
                        className="w-12 h-12 text-slate-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        {records.length === 0
                          ? "No transactions yet"
                          : "No matching transactions"}
                      </p>
                      <p className="text-xs">
                        {records.length === 0
                          ? "Add your first transaction to get started"
                          : "Try adjusting your search or filters"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-600">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
