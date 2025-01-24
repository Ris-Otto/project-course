import React from "react";
import Select from "react-select";

export function Listable() {}

export function Searchable<T extends ObjectWithKeys>({
  array,
  children,
}: {
  array: T[];
  children?: React.ReactNode;
}) {
  const options = array.map((item, i) => {
    return { value: i, label: item["name"] };
  });
  return <Select options={options} isSearchable />;
}
