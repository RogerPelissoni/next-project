import { ReactNode } from "react";
import { CoreLoadingSpinner } from "@/core/components/CoreLoadingSpinner";
import { CoreErrorMessage } from "@/core/components/CoreErrorMessage";

interface CoreScreenWrapperProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  children: (data: T) => ReactNode;
  validateData?: (data: T | null) => boolean;
}

export function CoreScreenWrapper<T>({ data, loading, error, children, validateData }: CoreScreenWrapperProps<T>) {
  if (loading) {
    return <CoreLoadingSpinner />;
  }

  const isDataValid = validateData ? validateData(data) : !!data;

  if (!isDataValid) {
    return <CoreErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }

  return <>{children(data!)}</>;
}
