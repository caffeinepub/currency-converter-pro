import { useMutation, useQuery } from "@tanstack/react-query";
import type { Currency } from "../backend";
import { useActor } from "./useActor";

export function useGetCurrencies() {
  const { actor, isFetching } = useActor();

  return useQuery<Currency[]>({
    queryKey: ["currencies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCurrencies();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useConvert() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      fromCode,
      toCode,
      amount,
    }: {
      fromCode: string;
      toCode: string;
      amount: number;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.convert(fromCode, toCode, amount);
    },
  });
}
