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
    useMemo
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
  type UnderwaveEnumeration, StateHandler,
} from "./Types.tsx";
import { type DefaultAction } from "./Reducer.ts";
import type { NavigateFunction } from "react-router-dom";
import { checkToken, logout } from "../api/auth.ts";
import { getRequest } from "../api/APITemplate.ts";
import {Theme} from "../theme.ts";

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

  .field {
    background-color: ${({ theme }) => theme.semiLightCream};

    color: ${({ theme }) => theme.brownText};

    &:disabled {
      border-color: ${({ theme }) => theme.darkCream};
      color: grey;
    }

    border-color: ${({ theme }) => theme.redBrown};
  }

  .underwave-toggle {
    border-color: ${({ theme }) => theme.redBrown} !important;
  }
`;
export const StyledHeaderField = styled.div<{
  color: string;
  disabled?: boolean;
}>`
  .underwave-form-label {
      font-family: futura-pt-bold, sans-serif;
      font-weight: bold;
      font-style: normal;
    color: ${({ color, theme, disabled }) =>
      disabled ? "grey" : color ? color : theme.teal};
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
  .field {
    background-color: ${({ theme }) => theme.semiLightCream};
    border-color: ${({ theme }) => theme.darkCream};
    color: ${({ theme }) => theme.brownText};
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
    header?: string;
    notes?: React.ReactNode;
    required?: boolean;
    as?: React.ElementType;
    color?: string;
    empty?: boolean;
    disabled?: boolean;
  };

declare type DynamicListProps<T extends ObjectWithKeys> =
  UnderwaveHeaderProps<ElementType> & {
    array: T[];
    name: string;
    setArray: React.Dispatch<SetStateAction<T[]>>
    pattern: RegExp;
    noDisable?: boolean;
    template: Partial<T>;
    requiredKeys?: (keyof T)[];
    showEmptyOnly?: boolean;
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
  color,
  showEmptyOnly,
  disabled
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
      ret = ret && temp;
    }
    return ret;
  }

  const t = useMemo(() => new Theme(), []);

  useEffect(() => {
    if (arrStates.length === 0)
      add(template);
  }, [arrStates]);

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
        color={color}
        disabled={disabled}
      />
      <div className="mb-3">
        {arrStates.map((a, idx) => {
          if (showEmptyOnly) {
            if (idx !== arrStates.length - 1) {
              return null;
            }
          }
          const isDisabled = idx !== arrStates.length - 1;
          return (
            <div key={idx}>
              <InputGroup className="indented-input">
                {idx !== arrStates.length - 1 ? (
                  <Row>
                    <Col>
                      <Button
                        hidden={disabled}
                        className="add-remove-button"
                        variant="danger"
                        style={{backgroundColor: t.orange}}
                        onClick={() => remove(idx)}
                      >
                        -
                      </Button>
                    </Col>
                  </Row>
                ) : null}

                <div className="input-fields-container">
                  {ObjectEntries(a).map(([k, v]) => {
                    if(!(k in template) ) return null;
                    return (
                      <Row key={k}>
                        <Col>
                          <FormControl
                            className="field"
                            placeholder={cfl(k)}
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
                            disabled={!noDisable && isDisabled || disabled}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </div>
                {idx === arrStates.length - 1 ? (
                  <Col>
                    <Button
                      hidden={disabled}
                      className="add-remove-button"
                      onClick={() => add(template)}
                      disabled={!testPatternAgainstRequiredKeys(a, pattern)}
                      style={{backgroundColor: t.teal }}
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
  color,
  disabled,
}: UnderwaveHeaderProps<ElementType>) {
  const Component = as ?? defaultElement;

  return (
    <StyledHeaderField color={color} disabled={disabled}>
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
      {children ? (
        <>
          <br />
          <BOOTSTRAP_FORM.Text>{children}</BOOTSTRAP_FORM.Text>
        </>
      ) : null}
    </>
  );
}

// deno-lint-ignore ban-types
declare interface UnderwaveStandaloneFieldBaseProps<TState extends {}>
  extends UnderwaveHeaderProps<React.ElementType> {
  state: TState;
  type?: string;
  setState?: Dispatch<SetStateAction<TState>>;
  required?: boolean;
  feedback?: React.ReactNode;
  pattern?: string;
  name?: string;
  className?: string;
}

// deno-lint-ignore ban-types
declare interface UnderwaveStandaloneFieldProps<TState extends {}>
  extends UnderwaveStandaloneFieldBaseProps<TState> {
  validator?: (value: string | number) => boolean;
  restrictor?: (
    previousValue: string | number,
    value: string | number,
  ) => string | number;
  onChange?: React.ChangeEventHandler<FormControlElement>;
  disabled?: boolean;
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

function DefaultStandaloneField<TState extends {}>({
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
  color,
  className,
  onChange,
  disabled,
  empty,
}: UnderwaveStandaloneFieldProps<TState>) {
  const context = useContext(RequiredFieldContext);
  const vContext = useContext(ValidatedContext);

  const [previousState, setPreviousState] = useState<TState>("");
  const defaultControlRegex = ".{1,}";
  const temp = new RegExp(pattern ? pattern : defaultControlRegex);
  function isValid(value: string) {
    const ret = temp.test(value);
    return ret || !required;
  }
  function restrict(previousValue: TState, value: TState) {
    if (restrictor !== undefined) {
      return restrictor(previousValue, value);
    }
    return value;
  }

  function validate(value: string | number) {
    if (validator !== undefined) {
      return validator(value);
    }
    return true;
  }
  return (
    <StyledUnderwaveField className={className}>
      {header || empty ? (
        <UnderwaveHeader
          empty={empty}
          header={header}
          notes={notes}
          required={context.required || required}
          as={as}
          color={color}
          disabled={disabled || !(setState || onChange)}
        />
      ) : null}
      <Form.Group className="mb-3">
        <Form.Control
          name={name}
          className="rounded-corners field"
          data-lpignore="true"
          autoComplete={type}
          type={type ? type : "text"}
          required={context.required || required}
          value={state}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          onChange={
            onChange
              ? onChange
              : (event) => {
                  if (!setState) return;
                  event.preventDefault();
                  setPreviousState(state);
                  setState(restrict(previousState, event.target.value));
                }
          }
          pattern={pattern}
          isInvalid={
            vContext.validated && !isValid(String(state)) && validate(state)
          }
          isValid={false}
          disabled={disabled || !(setState || onChange)}
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
  color,
  disabled,
}: StateDropdownFieldProps<TState, TDropdownValues>) {
  const context = useContext(RequiredFieldContext);
  const vContext = useContext(ValidatedContext);

  return (
    <StyledUnderwaveField>
      {header ? (
        <UnderwaveHeader
          header={header}
          notes={notes}
          required={context.required || required}
          as={as}
          color={color}
          disabled={disabled}
        />
      ) : null}
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
  color,
  disabled,
    type
}: EnumeratedField<TState, TDropdownValues>) {
  const context = useContext(RequiredFieldContext);
  const vContext = useContext(ValidatedContext);

  function handleStateType(newState: string | number): TState {
    if (Number(newState) >= 0) {
      return Number(newState) as unknown as TState;
    }
    return newState as unknown as TState;
  }

  return (
    <StyledUnderwaveField>
      {header ? (
        <UnderwaveHeader
          header={header}
          notes={notes}
          required={context.required || required}
          as={as}
          color={color}
          disabled={disabled}
        />
      ) : null}
      {ObjectEntries(template.entries).map(([k, v], idx) => {
        if (keyIsExcluded(k, exceptKeys)) return null;
        return (
          <FormCheck
            className="underwave-toggle mb-3"
            name={name}
            key={idx}
            type={type ? type : "radio"}
            value={state}
            label={type ? undefined : v}
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
  TDropdownValues extends UnderwaveEnumeration<TState, any>,
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
  color,
  disabled,
}: EnumeratedField<TState, TDropdownValues>) {
  function handleStateType(newState: number | string): TState {
    if (Number(newState) >= 0) {
      return Number(newState) as unknown as TState;
    }
    return newState as unknown as TState;
  }

  return (
    <StyledUnderwaveField>
      {header ? (
        <UnderwaveHeader
          header={header}
          notes={notes}
          required={required}
          as={as}
          color={color}
          disabled={disabled}
        />
      ) : null}
      <ButtonGroup className="mb-3">
        {ObjectEntries(template.entries).map(([k, v], idx) => {
          if (keyIsExcluded(k, exceptKeys)) return null;
          return (
            <ToggleButton
              className="underwave-toggle"
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
  disabled,
  onChange
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
          header ? (
            <UnderwaveHeader
              header={header}
              notes={notes}
              required={context.required || required}
              as={as}
              color={color}
              disabled={disabled || !(setState || onChange)}
            />
          ) : undefined
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

export function cfl(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// deno-lint-ignore ban-types
function TextArea<TState extends {}>(
  props: UnderwaveStandaloneFieldProps<TState>,
) {
  const {
    header,
    state,
    setState,
    notes,
    required,
    pattern,
    name,
    as,
    validator,
    restrictor,
    color,
    onChange,
    disabled,
  } = props;

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
        color={color}
        disabled={disabled || !(setState || onChange)}
      />
      <Form.Control
        name={name}
        className="rounded-corners field"
        data-lpignore="true"
        type={"text"}
        as="textarea"
        required={context.required || required}
        value={state}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.preventDefault();
        }}
        onChange={(event) => {
          if (!setState) return;
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
        disabled={disabled || !(setState || onChange)}
      />
    </StyledUnderwaveField>
  );
}

async function handleLogout(navigate: NavigateFunction) {
  const ret = await logout();
  if (ret.isSuccess()) {
    navigate("/home");
  }
}

export function convertToDateTimeLocalString(date: Date){
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function handleSetPricingType(
    e: MultiValue<{
      value: number;
      label: string;
    }>,
    spm: StateHandler<number>
) {
  let bits: number = 0b000;

  for (const bit of e) {
    bits = bits | bit.value;
  }
  spm(bits);
}

export function debounceApiCall(
    func: (
        ...args: [
          string,
          (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
        ]
    ) => void,
    wait: number
) {
  let timeout: ReturnType<typeof setInterval> | null;
  return function executedFunction(
      ...args: [
        string,
        (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
      ]
  ) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const Toggle = StateToggleButtonField;
export const Radio = StateRadioButtonField;
export const Control = DefaultStandaloneField;
export const Select = StateDropdownField;
export const Check = StateCheckField;
export { TextArea, handleLogout };
