import React from "react";
import Select from "react-select";
import { ObjectWithKeys } from "../../utilities/Types.tsx";
import type { Filter } from "../Event/Event.tsx";

export function Listable() {}

declare type SearchableProps<T extends ObjectWithKeys> = {
  array: T[];
  children?: React.ReactNode;
};

export function Searchable<T extends ObjectWithKeys>({
  array,
  children,
}: SearchableProps) {
  const options = array.map((item, i) => {
    return { value: i, label: item["name"] };
  });
  return <Select options={options} isSearchable />;
}

declare type FilterProps<T extends ObjectWithKeys> = {
  template: T;
  list: T[];
  filteredList: T[];
  filters: Filter;
  filterCallback: (original: T[], filtered: T[], filter: Filter) => void;
};

export function Filter<T extends ObjectWithKeys>({
  template,
  list,
  filteredList,
  filters,
  filterCallback,
}: FilterProps<T>) {
  return <div></div>;
}
