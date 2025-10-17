"use client";

import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { CashflowRecord } from "@/types/supabase";

interface TransactionActionsProps {
  transaction: CashflowRecord;
  onUpdate: () => void;
}

export default function TransactionActions({
  transaction,
  onUpdate,
}: TransactionActionsProps) {
  const supabase = createClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount.toString(),
    date: transaction.date,
    note: transaction.note || "",
  });

  async function handleUpdate() {
    setIsLoading(true);
    const { error } = await supabase
      .from("cashflow")
      .update({
        type: editForm.type,
        category: editForm.category,
        amount: Number(editForm.amount),
        date: editForm.date,
        note: editForm.note,
      })
      .eq("id", transaction.id);

    setIsLoading(false);

    if (!error) {
      setIsEditOpen(false);
      onUpdate();
    } else {
      console.error(error);
      alert("Failed to update transaction");
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    const { error } = await supabase
      .from("cashflow")
      .delete()
      .eq("id", transaction.id);

    setIsLoading(false);

    if (!error) {
      setIsDeleteOpen(false);
      onUpdate();
    } else {
      console.error(error);
      alert("Failed to delete transaction");
    }
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditOpen(true)}
          className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-purple-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Type</Label>
              <Select
                value={editForm.type}
                onValueChange={(v) => setEditForm({ ...editForm, type: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
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
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
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
                step="0.01"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">Date</Label>
              <Input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">
                Note (Optional)
              </Label>
              <Input
                value={editForm.note}
                onChange={(e) =>
                  setEditForm({ ...editForm, note: e.target.value })
                }
                className="mt-1.5"
                placeholder="Add a note..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isLoading}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-600">Type:</span>
              <span className="font-medium">{transaction.type}</span>

              <span className="text-slate-600">Category:</span>
              <span className="font-medium">{transaction.category}</span>

              <span className="text-slate-600">Amount:</span>
              <span className="font-medium">
                ₱{transaction.amount.toFixed(2)}
              </span>

              <span className="text-slate-600">Date:</span>
              <span className="font-medium">{transaction.date}</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
