//@deno-types=npm:@types/react
import React, {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  Dispatch,
  useContext,
  useMemo,
} from "react";
import {
  Button,
  FormControl,
  InputGroup,
  Col,
  Form,
  FormCheck,
  ToggleButton,
  Form as BOOTSTRAP_FORM,
  ButtonGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { styled } from "styled-components";

import {} from "react-bootstrap";
import {
  handleStateType,
  keyIsExcluded,
  ObjectEntries,
  RequiredFieldContext,
  ValidatedContext,
  type ObjectWithKeys,
  type UnderwaveEnumeration,
} from "./Types.tsx";
import { TReduce, useObjReducer, type DefaultAction } from "./Reducer.ts";
import isEqual from "lodash/isEqual";
import {
  regExpLiteral,
  updateExpression,
} from "../../../../../AppData/Local/deno/npm/registry.npmjs.org/@babel/types/7.25.6/lib/index-legacy.d.ts";

export function ToCurrencySymbol(currency: string) {
  switch (currency) {
    case "eur":
      return "€";
    default:
      return "€";
  }
}

export function PricingTypeToString(type: number | string) {
  //"0: Cash, 1: Wallet, 2: Card",
  switch (type) {
    case 0:
      return "Cash";
    case 1:
      return "Wallet";
    case 2:
      return "Card";
    case "0":
      return "Cash";
    case "1":
      return "Wallet";
    case "2":
      return "Card";
    default:
      throw new Error("Unknown type " + type);
  }
}

export function ExtractHoursMinutes(date: Date) {
  const hours = date.toLocaleString("default", { hour: "2-digit" });
  const minutes = date.toLocaleString("default", { minute: "2-digit" });

  return `${hours}:${minutes}`;
}

/**
 * Get the payment method labels for a given value.
 * @param {number} value - The value to check (from 1 to 7).
 * @returns {string[]} - The labels of the matched payment methods.
 */
export function resolveBitmask(
  value: number,
  bitmask: readonly { value: number; label: string }[],
): string {
  return bitmask
    .filter((method) => (value & method.value) !== 0) // Check which bits are set
    .map((method) => method.label)
    .toString()
    .replace(/,/g, " & "); // Return the labels of the matched methods
}

export const StyledUnderwaveField = styled.div`
  .invalid {
    border: 1px solid #ff0000;
  }

  .rounded-corners {
    border-bottom-left-radius: 6px !important;
    border-bottom-right-radius: 6px !important;
    border-top-left-radius: 6px !important;
    border-top-right-radius: 6px !important;
  }
`;
export const StyledHeaderField = styled.div`
  .underwave-form-label {
    font-weight: bold;
    color: ${({ theme }) => theme.orange};
    margin-bottom: 1px;
    letter-spacing: 1px;
  }
`;

export const StyledDynamicList = styled.div`
  .indented-input {
    display: flex; /* Aligns the button and form fields horizontally */
    align-items: stretch; /* Stretches the items vertically */
  }

  .input-fields-container {
    display: flex;
    flex-direction: column; /* Stack input fields vertically */
    flex-grow: 1; /* Allow the input fields to take up available space */
  }

  .add-remove-button {
    min-width: 3rem;
    text-align: center;
    display: flex;
    align-items: center; /* Centers button content vertically */
    justify-content: center; /* Centers button content horizontally */
    height: 100%; /* Makes the button take up the full height of the input group */
    flex-grow: 10; /* Ensures the button grows to fill the remaining vertical space */
  }

  .input-group {
    display: flex; /* Use flexbox layout */
    align-items: stretch; /* Ensures all children stretch vertically */
  }

  .input-group .form-control {
    flex-grow: 0; /* Allows form controls to fill available space */
  }
`;

//#region typedef

//Only used in `PolymorphicProps`
type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

/**
 * Used in UnderwaveHeader to allow for differing types of headers without needing to supply
 * a whole Element with children
 */
type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & PolymorphicAsProp<E>
>;

const defaultElement = "div";

export declare type UnderwaveHeaderProps<E extends ElementType> =
  PolymorphicProps<E> & {
    header: string;
    notes?: React.ReactNode;
    required?: boolean;
    as?: React.ElementType;
  };

declare type DynamicListProps<T extends ObjectWithKeys> =
  UnderwaveHeaderProps<ElementType> & {
    array: string[] | T[];
    name: string;
    setArray: React.Dispatch<SetStateAction<string[] | T[]>>;
    pattern: RegExp;
    noDisable?: boolean;
    template: T;
    requiredKeys?: (keyof T)[];
  };

//#endregion

export function DynamicListForm<T extends ObjectWithKeys>({
  header,
  array,
  setArray,
  pattern,
  notes,
  required,
  as,
  noDisable,
  template,
  requiredKeys,
}: DynamicListProps<T>) {
  //An internal array that keeps track of how long the array should be for the user to be able to input a value
  const { arrStates, add, update, remove } = useStateArrayFactory(array);

  function testPatternAgainstRequiredKeys<T extends ObjectWithKeys>(
    obj: T,
    regex: RegExp,
  ) {
    const keys = requiredKeys ? requiredKeys : [Object.keys(obj)[0]];
    let ret: boolean = true;
    for (const key of keys) {
      const temp = regex.test(obj[key]);
      ret = ret & temp;
    }
    return ret;
  }

  useEffect(() => {
    add(template);
  }, []);

  useEffect(() => {
    setArray(arrStates);
  }, [arrStates]);

  return (
    <StyledDynamicList>
      <UnderwaveHeader
        header={header}
        notes={notes}
        required={required}
        as={as}
      />
      <div className="mb-3">
        {arrStates.map((a, idx) => {
          const isDisabled = idx !== arrStates.length - 1;
          return (
            <div key={idx}>
              <InputGroup className="indented-input mt-3">
                {idx !== arrStates.length - 1 ? (
                  <Row>
                    <Col>
                      <Button
                        className="add-remove-button"
                        variant="danger"
                        onClick={() => remove(idx)}
                      >
                        -
                      </Button>
                    </Col>
                  </Row>
                ) : null}

                <div className="input-fields-container">
                  {ObjectEntries(a).map(([k, v]) => {
                    return (
                      <Row key={k}>
                        <Col>
                          <FormControl
                            placeholder={k}
                            type="text"
                            name={`${header}_${idx}`}
                            id={`dynamic-list-${idx}`}
                            value={v}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              update(
                                idx,
                                k as keyof typeof item,
                                e.target.value,
                              );
                            }}
                            onKeyDown={(
                              event: KeyboardEvent<HTMLInputElement>,
                            ) => {
                              if (
                                event.key === "Enter" &&
                                idx === arrStates.length - 1 &&
                                testPatternAgainstRequiredKeys(a, pattern)
                              ) {
                                add(template);
                                return;
                              }
                              if (event.key === "Backspace") {
                                if (
                                  idx === arrStates.length - 1 &&
                                  v.length === 0
                                )
                                  remove(idx - 1);
                              }
                            }}
                            disabled={!noDisable && isDisabled}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </div>
                {idx === arrStates.length - 1 ? (
                  <Col>
                    <Button
                      className="add-remove-button"
                      onClick={() => add(template)}
                      disabled={!testPatternAgainstRequiredKeys(a, pattern)}
                    >
                      +
                    </Button>
                  </Col>
                ) : null}
              </InputGroup>
            </div>
          );
        })}
      </div>
    </StyledDynamicList>
  );
}

/**
 * Creates a list with one empty element represented as a {@link FormControl} component.
 *
 * The list will automatically be populated and extended if the last item in the array is filled in and properly formatted. The 'Enter' key and '+' button function in a similar manner.
 *
 * The fields in the array will never be listed as `invalid` since the array is only populated if a properly formatted value is present in the field.
 *
 * @param array The in which values are to be saved
 * @param setArray Its corresponding {@link React.SetStateAction<T>}
 * @param pattern The RegExp pattern to be used for validating field input
 * @param header {@link UnderwaveHeaderProps}
 * @param notes {@link UnderwaveHeaderProps}
 * @param required {@link UnderwaveHeaderProps}
 * @param as {@link UnderwaveHeaderProps}
 * @returns
 */

export function UnderwaveHeader({
  header,
  notes,
  required,
  as,
}: UnderwaveHeaderProps<ElementType>) {
  const Component = as ?? defaultElement;

  return (
    <StyledHeaderField>
      <BOOTSTRAP_FORM.Label className="underwave-form-label">
        <Component>
          {header}
          {required ? ` (*)` : null}
        </Component>
      </BOOTSTRAP_FORM.Label>
      <UnderwaveSubHeader>{notes}</UnderwaveSubHeader>
    </StyledHeaderField>
  );
}

export declare type UnderwaveSubHeaderProps = {
  children?: React.ReactNode;
};

export function UnderwaveSubHeader({ children }: UnderwaveSubHeaderProps) {
  return (
    <>
      <br />
      <BOOTSTRAP_FORM.Text>{children}</BOOTSTRAP_FORM.Text>
    </>
  );
}

declare interface UnderwaveStandaloneFieldBaseProps<
  TState extends string | number | boolean,
> extends UnderwaveHeaderProps<React.ElementType> {
  state: TState;
  type?: string;
  setState: Dispatch<SetStateAction<TState>>;
  required?: boolean;
  feedback?: React.ReactNode;
  pattern?: string;
  name?: string;
  className?: string;
}

declare interface UnderwaveStandaloneFieldProps<
  TState extends string | number | boolean,
> extends UnderwaveStandaloneFieldBaseProps<TState> {
  validator?: (value: string | number) => boolean;
  restrictor?: (
    previousValue: string | number,
    value: string | number,
  ) => string | number;
}

declare interface EnumeratedField<
  TState extends number | string,
  // deno-lint-ignore no-explicit-any
  TEnum extends UnderwaveEnumeration<string | number, any>,
> extends UnderwaveStandaloneFieldBaseProps<TState> {
  enumName?: string;
  template: TEnum;
  // deno-lint-ignore no-explicit-any
  exceptKeys?: Array<keyof Record<TState, any>>;
}

declare interface StateDropdownFieldProps<
  TState extends number | string,
  // deno-lint-ignore no-explicit-any
  TDropdownValues extends UnderwaveEnumeration<TState, any>,
> extends EnumeratedField<TState, TDropdownValues> {
  staticDropdownTitle?: string;
  placeholder?: boolean;
}

function DefaultStandaloneField<TState extends string | number>({
  header,
  state,
  setState,
  type,
  notes,
  required,
  feedback,
  pattern,
  name,
  as,
  validator,
  restrictor,
}: UnderwaveStandaloneFieldProps<TState>) {
  const context = useContext(RequiredFieldContext);
  const vContext = useContext(ValidatedContext);

  const [previousState, setPreviousState] = useState<string | number>("");
  const defaultControlRegex = ".{1,}";
  const temp = new RegExp(pattern ? pattern : defaultControlRegex);
  function isValid(value: string) {
    const ret = temp.test(value);
    return ret || !required;
  }
  function restrict(previousValue: string | number, value: string | number) {
    if (restrictor !== undefined) {
      return restrictor(previousValue, value) as TState;
    }
    return value as TState;
  }

  function validate(value: string | number) {
    if (validator !== undefined) {
      return validator(value);
    }
    return true;
  }
  return (
    <StyledUnderwaveField>
      <UnderwaveHeader
        header={header}
        notes={notes}
        required={context.required || required}
        as={as}
      />
      <Form.Group as={Col} className="mt-3 mb-3">
        <Form.Control
          name={name}
          className="rounded-corners"
          data-lpignore="true"
          autoComplete={type}
          type={type ? type : "text"}
          required={context.required || required}
          value={state}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          onChange={(event) => {
            event.preventDefault();
            setPreviousState(state);
            setState(
              restrict(previousState, handleStateType(event.target.value)),
            );
          }}
          pattern={pattern}
          isInvalid={
            vContext.validated && !isValid(String(state)) && validate(state)
          }
          isValid={false}
        />
        <Form.Control.Feedback type="invalid">
          {feedback ? feedback : "Please fill out this field"}
        </Form.Control.Feedback>
      </Form.Group>
    </StyledUnderwaveField>
  );
}

function StateDropdownField<
  TState extends string | number,
  TDropdownValues extends UnderwaveEnumeration<
    TState,
    string | number | symbol
  >,
>({
  header,
  state,
  setState,
  notes,
  template,
  exceptKeys,
  name,
  as,
  required,
  placeholder,
}: StateDropdownFieldProps<TState, TDropdownValues>) {
  return (
    <StyledUnderwaveField>
      <UnderwaveHeader
        header={header}
        notes={notes}
        as={as}
        required={required}
      />
      <div className={notes ? "mb-3 mt-3" : "mb-3"}>
        <Form.Select
          name={name}
          style={{
            display: "inline-block",
            width: "auto",
          }}
          value={state}
        >
          <>
            {placeholder ? (
              <option
                key="blankChoice"
                hidden
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.preventDefault();
                }}
                value={undefined}
              >
                {name}
              </option>
            ) : null}
            {ObjectEntries(template.entries).map(([k, v], idx) => {
              if (keyIsExcluded(k, exceptKeys)) return null;
              return (
                <option
                  key={idx}
                  onClick={() =>
                    setState(handleStateType(k as unknown as TState))
                  }
                  value={k}
                >
                  {String(v)}
                </option>
              );
            })}
          </>
        </Form.Select>
      </div>
    </StyledUnderwaveField>
  );
}

function StateRadioButtonField<
  TState extends string | number,
  TDropdownValues extends UnderwaveEnumeration<TState, string | number>,
>({
  state,
  header,
  setState,
  notes,
  template,
  exceptKeys,
  name,
  as,
  required,
}: EnumeratedField<TState, TDropdownValues>) {
  function handleStateType(newState: string | number): TState {
    if (Number(newState) >= 0) {
      return Number(newState) as unknown as TState;
    }
    return newState as unknown as TState;
  }

  return (
    <StyledUnderwaveField>
      <UnderwaveHeader
        header={header}
        notes={notes}
        as={as}
        required={required}
      />
      {ObjectEntries(template.entries).map(([k, v], idx) => {
        if (keyIsExcluded(k, exceptKeys)) return null;
        return (
          <FormCheck
            name={name}
            className="mb-3"
            key={idx}
            type="radio"
            value={state}
            label={v}
            checked={handleStateType(k) === state}
            onChange={() => setState(handleStateType(k))}
          />
        );
      })}
    </StyledUnderwaveField>
  );
}

function StateToggleButtonField<
  TState extends number,
  TDropdownValues extends UnderwaveEnumeration<TState, string>,
>({
  state,
  header,
  setState,
  notes,
  template,
  exceptKeys,
  name,
  as,
  required,
}: EnumeratedField<TState, TDropdownValues>) {
  function handleStateType(newState: number | string): TState {
    if (Number(newState) >= 0) {
      return Number(newState) as unknown as TState;
    }
    return newState as unknown as TState;
  }

  return (
    <StyledUnderwaveField>
      <UnderwaveHeader
        header={header}
        notes={notes}
        as={as}
        required={required}
      />
      <ButtonGroup className="mb-3">
        {ObjectEntries(template.entries).map(([k, v], idx) => {
          if (keyIsExcluded(k, exceptKeys)) return null;
          return (
            <ToggleButton
              key={idx}
              id={`toggle-button-${template.enumName}-${idx}`}
              type="checkbox"
              value={state}
              name={name}
              variant={
                handleStateType(k) === state ? "check" : "outline-success"
              }
              checked={handleStateType(k) === state}
              onClick={() => setState(handleStateType(k))}
            >
              {v}
            </ToggleButton>
          );
        })}
      </ButtonGroup>
    </StyledUnderwaveField>
  );
}

function StateCheckField<TState extends boolean>({
  header,
  state,
  setState,
  required,
  feedback,
  name,
  as,
  className,
}: UnderwaveStandaloneFieldBaseProps<TState>) {
  const context = useContext(RequiredFieldContext);
  return (
    <StyledUnderwaveField>
      <Form.Check
        className={className}
        type={"checkbox"}
        checked={state}
        name={name}
        label={
          <UnderwaveHeader
            header={header}
            required={context.required ? context.required : required}
            as={as}
          />
        }
        required={context.required ? context.required : required}
        onChange={() => setState(!state as TState)}
      />
      <Form.Control.Feedback type="invalid">
        {feedback ? feedback : "Please fill out this field"}
      </Form.Control.Feedback>
    </StyledUnderwaveField>
  );
}

export function SetStateActionFactory<T extends ObjectWithKeys>(
  action: DefaultAction<T>,
  // deno-lint-ignore no-explicit-any
): (key: keyof T) => StateHandler<any> {
  const entries = ObjectEntries(action.state);
  // deno-lint-ignore no-explicit-any
  let ret: { [key in keyof T]: StateHandler<any> } | null = null;
  for (const [k, v] of entries) {
    if (!ret)
      ret = {
        [k]: (r: SetStateAction<typeof v>) => {
          if (typeof r === "function") {
            action.set({ type: k, payload: r(v) });
          } else {
            action.set({ type: k, payload: r });
          }
        },
      };
    else
      ret = {
        ...ret,
        [k]: (r: SetStateAction<typeof v>) => {
          if (typeof r === "function") {
            action.set({ type: k, payload: r(v) });
          } else {
            action.set({ type: k, payload: r });
          }
        },
      };
  }

  return (key: keyof T) => {
    return ret[key];
  };
}

export function UseStateFactory<T extends ObjectWithKeys>(
  obj: T,
): (key: keyof T) => {
  [key in keyof T]: [T[keyof T], StateHandler<T[keyof T]>];
} {
  const entries = ObjectEntries(obj);
  let ret: { [key in keyof T]: [T[keyof T], StateHandler<T[keyof T]>] } | null =
    null;
  for (const [k, v] of entries) {
    if (!ret)
      ret = {
        [k]: useState(v),
      };
    else
      ret = {
        ...ret,
        [k]: useState(v),
      };
  }
  return (key: keyof T) => {
    return ret[key];
  };
}

export function useStateArrayFactory<T extends ObjectWithKeys>(
  arr: T[],
): {
  arrStates: T[];
  add: (obj: T) => void;
  update: (index: number, key: keyof T, value: T[keyof T]) => void;
  remove: (index: number) => void;
} {
  const [arrStates, setArrStates] = useState<T[]>(arr);

  const add = (obj: T) => {
    setArrStates((prev) => [...prev, obj]);
  };

  const update = (index: number, key: keyof T, value: T[keyof T]) => {
    setArrStates((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  };

  const remove = (index: number) => {
    setArrStates((prev) => prev.filter((_, i) => i !== index));
  };

  return { arrStates, add, update, remove };
}

export function compareArrays<T extends ObjectWithKeys>(
  original: T[],
  updated: T[],
) {
  const added: T[] = [];
  const removed: T[] = [];
  const modified: T[] = [];
  added.push(
    ...updated.filter(
      (currItem) =>
        !original.some((prevItem) => prevItem.name === currItem.name), // Compare by name or other unique identifier
    ),
  );

  // Find removed objects
  removed.push(
    ...original.filter(
      (prevItem) =>
        !updated.some((currItem) => currItem.name === prevItem.name), // Compare by name or other unique identifier
    ),
  );

  // Find modified objects
  modified.push(
    ...updated.filter((currItem) =>
      original.some(
        (prevItem) =>
          prevItem.name === currItem.name && prevItem.role !== currItem.role, // Compare properties
      ),
    ),
  );

  return { added, removed, modified };
}

export const Toggle = StateToggleButtonField;
export const Radio = StateRadioButtonField;
export const Control = DefaultStandaloneField;
export const Select = StateDropdownField;
export const Check = StateCheckField;
