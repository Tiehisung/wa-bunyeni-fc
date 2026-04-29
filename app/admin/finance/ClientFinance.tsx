import {   ITransaction, ITransactionsSummary } from "@/types/finance.interface";
import DashboardHeader from "../../../components/Element";
import SummaryCards from "./SummaryCards";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import { IQueryResponse } from "@/types";

interface IProps {
  financialSummary?: IQueryResponse<ITransactionsSummary>;
  transactionsData?: IQueryResponse<ITransaction[]>;
}

export default function ClientFinance({ transactionsData }: IProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="Finance Tracker"
        subtitle="Monitor your income and expenses"
      />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SummaryCards transactions={transactionsData?.data} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={transactionsData} />
          </div>
        </div>
      </main>
    </div>
  );
}
