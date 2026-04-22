'use client'

import { useState } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { PrimarySelect } from "@/components/select/Select";
import { Label } from "@/components/ui/label";
import { DateTimeInput, Input } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import { toast } from "sonner";
import { shortText } from "@/lib";
import { fireEscape } from "@/hooks/Esc";

import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/services/transaction.endpoint";
import {
  EExpenseCategory,
  EIncomeCategory,
  ETransactionType,
  ITransaction,
} from "@/types/finance.interface";

// Enums

const CATEGORIES = {
  income: Object.keys(EIncomeCategory).map((k) => ({
    label: k.replace(/_/g, " ").toLowerCase(),
    value: EIncomeCategory[k as keyof typeof EIncomeCategory],
  })),
  expense: Object.keys(EExpenseCategory).map((k) => ({
    label: k.replace(/_/g, " ").toLowerCase(),
    value: EExpenseCategory[k as keyof typeof EExpenseCategory],
  })),
};

// Zod validation schema
const transactionSchema = z.object({
  type: z.enum([ETransactionType.INCOME, ETransactionType.EXPENSE]),
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(100),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)) && new Date(val) <= new Date(), {
      message: "Date must be valid and not in the future",
    }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: ITransaction;
}

export default function TransactionForm({ transaction }: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormData>,
    defaultValues: {
      type: transaction?.type || ETransactionType.EXPENSE,
      amount: transaction?.amount || 0,
      category: transaction?.category || EExpenseCategory.EQUIPMENT,
      description: transaction?.description || "",
      date:
        transaction?.date?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
    },
  });

  const currentType = watch("type");

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setIsLoading(true);

      let result;
      if (transaction) {
        result = await updateTransaction({
          _id: transaction._id,
          ...data,
        }).unwrap();
      } else {
        result = await createTransaction({
          ...data,
        }).unwrap();
      }

      if (result.success) {
        toast.success(result.message);
        reset({
          type: ETransactionType.EXPENSE,
          amount: 0,
          category: EExpenseCategory.EQUIPMENT,
          description: "",
          date: new Date().toISOString().split("T")[0],
        });

        if (transaction) {
          fireEscape();
        }
       
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to save transaction!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 border border-border bg-card">
      <h2 className="text-xl font-bold text-foreground mb-6">
        {transaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Selection */}
        <div className="flex gap-3">
          {[ETransactionType.INCOME, ETransactionType.EXPENSE].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setValue("type", t);
                setValue(
                  "category",
                  t === ETransactionType.INCOME
                    ? EIncomeCategory.DONATIONS
                    : EExpenseCategory.EQUIPMENT,
                );
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors uppercase ${
                currentType === t
                  ? t === ETransactionType.INCOME
                    ? "bg-chart-4 text-primary-foreground"
                    : "bg-destructive text-white"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Amount */}
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Amount"
              error={errors.amount?.message}
              type="number"
              others={{ step: "0.50" }}
              placeholder="$"
            />
          )}
        />

        {/* Category */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div>
              <Label className="_label mb-3">Category</Label>
              <PrimarySelect
                value={field.value}
                onChange={field.onChange}
                options={CATEGORIES[currentType]}
                error={shortText(errors.category?.message as string)}
              />
            </div>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Description"
              error={errors.description?.message}
              placeholder="What is this for?"
            />
          )}
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DateTimeInput
              {...field}
              label="Date"
              type="date"
              error={errors.date?.message}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          waiting={isLoading}
          primaryText={transaction ? "Edit Transaction" : "Add Transaction"}
          waitingText={transaction ? "Editing..." : "Adding..."}
          type="submit"
          className="_primaryBtn justify-center w-full"
        />
      </form>
    </Card>
  );
}
