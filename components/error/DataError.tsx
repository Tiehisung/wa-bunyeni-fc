'use client'

import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../buttons/Button";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error";
import { Glassmorphic } from "../Glasmorphic/BasicGlassmorphic";
import { useRouter } from "next/navigation";

interface Props {
  message: any;
  onRefetch?: () => void;
  isRefreshing?: boolean;
  allowBack?: boolean;
}
const DataErrorAlert = ({
  message,
  onRefetch,
  isRefreshing,
  allowBack,
}: Props) => {
  const router = useRouter();

  const handleReloading = () => {
    if (onRefetch) {
      onRefetch();
    } else router.refresh();
  };
  return (
    <Glassmorphic className="container mx-auto my-5" shadow={false}>
      <Alert variant="destructive">
        <AlertTitle>{getErrorMessage(message)}</AlertTitle>
        <AlertDescription className="flex items-center justify-start">
          {allowBack && (
            <Button onClick={() => router.back()} variant={"ghost"}>
              <ArrowLeft className="  h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleReloading}
            className="  "
            size={"icon"}
            variant={"outline"}
          >
            <RefreshCcw
              className={cn(" h-4 w-4", isRefreshing ? "animate-spin" : "")}
            />
          </Button>
        </AlertDescription>
      </Alert>
    </Glassmorphic>
  );
};

export default DataErrorAlert;
