import { Result } from "../../../Shared/Result.ts";
// @deno-types="npm:@types/react"
import React, { SetStateAction, createContext } from "react";

export type SuspenseConsumer<T> = {
  read(): Result<T>;
  invalidate: boolean;
};

export type StateHandler<T> = React.Dispatch<SetStateAction<T>>;
// deno-lint-ignore no-explicit-any
export type ObjectWithKeys = { [key: string]: ObjectWithKeys | any };

export type Pricing = {
  id: number;
  currency: string;
  type: number;
  amount: number;
};

export type Bio = {
  id: number;
  description: string;
};

export type Event = {
  id: number;
  name: string;
  age: number;
  start: Date;
  end: Date;
};

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

declare type RequireFieldsProps = {
  children: React.ReactNode;
};

export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export declare type UnderwaveEnumeration<
  TKey extends string | number,
  TValue extends string | number | symbol,
> = {
  entries: Record<TKey, TValue>;
  ["enumName"]: string;
};

declare type TValidatedContext = {
  validated: boolean;
};

//This context is used for Underwave.From children
//and checks if the form has been validated (i.e. the user tried to submit the form)
//Naturally it can be used in other places as well, if you like.
export const ValidatedContext = createContext<TValidatedContext>({
  validated: false,
});

export const matchLeadingAndTrailingZeroes = /^0+(?!\.)|(?:\.|(\..*?))0+$/g;

/**
 * Mainly used for `Form`-fields that make use of a UnderwaveEnumeration.
 * Many Underwave-objects used for enumeration have extra keys, which are either used in development, are obsolete or may be used for upcoming updates.
 * The function, at present, is quite firmly coupled with the current enumeration system, which uses `const enumeration = {...kvPairs} as const;` for enumerating.
 * @param k the key to evaluate
 * @param keysToExclude an array of keys to be excluded from an object
 * @returns `true` if the supplied key should be excluded from the enumeration, `false` otherwise
 */
export function keyIsExcluded<
  T extends Record<string | number, string | number>,
>(k: keyof T, keysToExclude?: Array<keyof T>) {
  return (
    keysToExclude &&
    (keysToExclude.includes(k) || keysToExclude.includes(Number(k)))
  );
}

export const RequiredFieldContext = React.createContext<{ required: boolean }>({
  required: false,
});

export function RequireFields(props: RequireFieldsProps) {
  return (
    <RequiredFieldContext.Provider value={{ required: true }}>
      {props.children}
    </RequiredFieldContext.Provider>
  );
}

/**
 * Usage:
 *
 * `const myVar = "a";`
 *
 * `console.log(nameof({myVar}));`
 *
 * Used when declaring State-fields, so that the underlying form can capture the variables with their given names
 * in case you want to use the FormData from the form and not a custom object when submitting
 * @param obj An object containing the variable to return the name of
 * @returns A string containing the given name of the variable contained in `obj`
 */
export const nameof = (obj: object) => Object.keys(obj)[0];

/**
 *
 * @returns
 */
export function handleStateType<TState extends unknown>(
  newState: TState,
  parseAsDecimal?: boolean,
): TState {
  try {
    const dn = parseAsDecimal
      ? parseDecimalNumber(newState)
      : parseInt(newState as string, 10);
    if (!isNaN(Number(dn))) {
      const ret = Number(dn) as TState;
      return ret;
    }
  } catch {
    return newState as TState;
  }

  return newState as TState;
}

function parseDecimalNumber<TState extends unknown>(val: TState) {
  const r = String(val).replace(",", ".");
  const a = r.replace(matchLeadingAndTrailingZeroes, "$1");
  try {
    const n = Number(a);
    if (!isNaN(parseFloat(r)) && isFinite(n)) {
      return n;
    }
  } catch {
    return NaN;
  }
  return NaN;
}

/**
 * An extension of Object.entries
 * @returns `Object.entries()` with variable type preserved
 */
export function ObjectEntries<T extends object>(t: T): Entries<T>[] {
  return Object.entries(t) as Entries<T>[];
}

export const locs = {
  0: "My venue",
  1: "Other location",
};
export const locsEnum: UnderwaveEnumeration<number, string> = {
  entries: locs,
  enumName: "Location",
};

export const paymentMethods = [
  { value: 0b000, label: "Free" },
  { value: 0b001, label: "Cash" },
  { value: 0b010, label: "Digital wallet" },
  { value: 0b100, label: "Card" },
];
