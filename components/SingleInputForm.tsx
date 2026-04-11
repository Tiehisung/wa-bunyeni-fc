import { CSSProperties, useEffect, useState } from "react";
import { Button } from "./buttons/Button";
import { Input } from "./input/Inputs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiConfig } from "@/lib/configs";
import { fireEscape } from "@/hooks/Esc";
import { useUpdateSearchParams } from "@/hooks/params";
import { TButtonVariant } from "./ui/button";
import { getErrorMessage } from "@/lib/error";

interface IProps {
  className?: string;
  variant?: TButtonVariant
  primaryText?: string;
  loadingText?: string;
  uri: string;
  method: "PUT" | "POST" | "DELETE" | "GET";
  body?: unknown;
  escapeOnEnd?: boolean;
  styles?: CSSProperties;
  title: string;
  fieldName: string;
  useParam?: boolean;
}

export function SingleInputForm(props: IProps) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const { setParam } = useUpdateSearchParams();
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (props.useParam && input) setParam(props?.fieldName ?? "input", input);
  }, [input, props.useParam, props.fieldName, setParam]);

  const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setWaiting(true);
      const response = await fetch(
        props.uri?.startsWith(apiConfig.base)
          ? props.uri
          : props.uri?.startsWith("/")
            ? `${apiConfig.base}${props.uri}`
            : `${apiConfig.base}/${props.uri}`,
        {
          method: props.method ?? "PUT",
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
          body: JSON.stringify({
            ...(props.body ?? {}),
            
            [props.fieldName ?? "input"]: input,
          }),
        },
      );
      const results = await response.json();
      toast.info(results.message);
      setWaiting(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setWaiting(false);
      // Use navigate(0) as a soft refresh instead of router.refresh()
      navigate(0);
      if (props.escapeOnEnd) fireEscape();
    }
  };

  return (
    <form
      className="w-2xs grid gap-2.5 _card mt-16 bg-card"
      onSubmit={handleAction}
    >
      <p className="_label mb-3">{props.title}</p>
      <Input
        name="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="grow"
        placeholder="New Role"
      />

      <Button
        primaryText={props.primaryText}
        waiting={waiting}
        waitingText={props?.loadingText ?? "Saving..."}
        className="w-full justify-center"
        variant={props?.variant}
      />
    </form>
  );
}
