"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddNewTransactionProps {
  userId: string;
  fetchRecords: () => void;
}

const AddNewTransaction = ({
  userId,
  fetchRecords,
}: AddNewTransactionProps) => {
  const supabase = createClient();
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [open, setOpen] = useState(false);

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
      setOpen(false);
    } else {
      console.error(error);
    }
  }
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="p-0 hover:bg-indigo-50 hover:text-purple-600"
      >
        <Plus className="h-4 w-4" /> Transaction
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Add Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Type</Label>
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
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="mt-1.5"
                step="0.01"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            >
              Add Transaction
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewTransaction;
