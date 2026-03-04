import { useCallback } from "react";

export interface ConversionParams {
  from?: string;
  to?: string;
  amount?: string;
}

export function useQueryParams() {
  const getParams = useCallback((): ConversionParams => {
    const params = new URLSearchParams(window.location.search);
    return {
      from: params.get("from") || undefined,
      to: params.get("to") || undefined,
      amount: params.get("amount") || undefined,
    };
  }, []);

  const setParams = useCallback((params: ConversionParams) => {
    const url = new URL(window.location.href);
    if (params.from) url.searchParams.set("from", params.from);
    if (params.to) url.searchParams.set("to", params.to);
    if (params.amount) url.searchParams.set("amount", params.amount);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const buildShareUrl = useCallback((params: ConversionParams): string => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (params.from) url.searchParams.set("from", params.from);
    if (params.to) url.searchParams.set("to", params.to);
    if (params.amount) url.searchParams.set("amount", params.amount);
    return url.toString();
  }, []);

  return { getParams, setParams, buildShareUrl };
}
