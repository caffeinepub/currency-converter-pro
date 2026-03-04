import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Currency {
    code: string;
    name: string;
    rateToUSD: number;
    symbol: string;
}
export interface backendInterface {
    convert(fromCode: string, toCode: string, amount: number): Promise<number>;
    getCurrencies(): Promise<Array<Currency>>;
}
