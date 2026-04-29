
import { Card } from "@/components/ui/card";
import { ITransaction } from "@/types/finance.interface";

interface IProps {
  transactions?: ITransaction[];
}

export default function SummaryCards({ transactions }: IProps) {
  const income =
    transactions
      ?.filter((t) => t.type === "income")
      ?.reduce((sum, t) => sum + Number.parseFloat(String(t.amount || 0)), 0) ??
    0;

  const expense =
    transactions
      ?.filter((t) => t.type === "expense")
      ?.reduce((sum, t) => sum + Number.parseFloat(String(t.amount || 0)), 0) ??
    0;

  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 border border-border bg-card">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Total Income
        </p>
        <p className="text-3xl font-bold text-chart-4">${income?.toFixed(2)}</p>
      </Card>
      <Card className="p-6 border border-border bg-card">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Total Expenses
        </p>
        <p className="text-3xl font-bold text-destructive">
          ${expense?.toFixed(2)}
        </p>
      </Card>
      <Card className="p-6 border border-border bg-card">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Balance
        </p>
        <p
          className={`text-3xl font-bold ${
            balance >= 0 ? "text-chart-4" : "text-destructive"
          }`}
        >
          ${balance?.toFixed(2)}
        </p>
      </Card>
    </div>
  );
}
