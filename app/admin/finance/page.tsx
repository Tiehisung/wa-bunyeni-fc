'use client'

import ClientFinance from "./ClientFinance";
 
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useGetTransactionsQuery,
  useGetTransactionsSummaryQuery,
} from "@/services/transaction.endpoint";
import { useSearchParams } from "next/navigation";

const FinancePage = () => {
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();
  console.log(paramsString);

  const {
    data: transactionsData,
    isLoading,
    error,
    isFetching,
  } = useGetTransactionsQuery({});

  const { data: transactionsSummary, isLoading: loadingSummary } =
    useGetTransactionsSummaryQuery({ groupBy: "category" });
  console.log(loadingSummary);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Loader message="Loading financial data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load financial data:{" "}
            {(error as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <ClientFinance
        transactionsData={transactionsData}
        financialSummary={transactionsSummary}
      />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
};

export default FinancePage;
