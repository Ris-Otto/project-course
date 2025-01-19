// @deno-types="npm:@types/react"
import React, { useReducer } from "react";
import { ObjectWithKeys, type NestedKeyOf } from "./Types.tsx";
/**
 * `type` is the property of the object you want to mutate
 * `payload` contains the value(s) for the property
 */

export type FormAction<TState extends ObjectWithKeys> = {
  type: keyof TState;
  payload: {};
};
/**
 * `type` is the property whose value is to be validated
 * `validator` is the callback used for validating
 * `payload` is the state of the reducer
 */

export type FormValidityAction<TState extends ObjectWithKeys> = {
  type: keyof TState;
  validator?: Validator<TState>;
  payload: TState;
};

export type ActionObject<TState, TAction> = {
  state: TState;
  set: React.Dispatch<TAction>;
};

export type DefaultAction<TState extends ObjectWithKeys> = {
  state: TState;
  set: React.Dispatch<FormAction<TState>>;
};
/**
 *
 * @param reducer the return value of the `useReducer`-hook
 * @returns an object containing the state and the reducer-function
 */

export function ObjReducer<TState, TAction>(
  reducer: [TState, React.Dispatch<TAction>],
): ActionObject<TState, TAction> {
  return { state: reducer[0], set: reducer[1] };
}

export function useObjReducer<TState extends ObjectWithKeys>(
  func: ReducerFunction<TState>,
  initialState: TState,
) {
  return ObjReducer(useReducer<Reducer<TState>>(func, initialState));
}

/**
 * @param func
 * @param initialState
 * @returns
 */
export function useObjValidator<
  TState extends ObjectWithKeys,
  TValidity extends { [key: string]: boolean },
>(func: typeof TValidate, initialState: FormValidityState<TValidity>) {
  return ObjReducer(
    useReducer<ValidityReducer<TState, TValidity>>(func, initialState),
  );
}
/**
 * Introduces type-safety to the useReducer hook
 *
 * `TState` is the state of the reducer, an interface or a type
 */

export type Reducer<TState extends ObjectWithKeys> = React.Reducer<
  TState,
  FormAction<TState>
>;

export type ValidityReducer<
  TState extends ObjectWithKeys,
  TValidity extends { [key: string]: boolean },
> = React.Reducer<FormValidityState<TValidity>, FormValidityAction<TState>>;

export type FormValidityState<TValidity extends { [key: string]: boolean }> = {
  errors: TValidity;
  isFormValid: boolean;
};
/**
 * The type of the `validator`-function in FormValidityAction
 */

export type Validator<TState extends ObjectWithKeys> = (
  payload: TState,
) => boolean;
/**
 * @param state The state of the reducer
 * @param action the action performed
 * @returns
 */

export function TReduce<TState extends ObjectWithKeys>(
  state: TState,
  action: FormAction<TState>,
): TState {
  return {
    ...state,
    [action.type]: action.payload,
  };
}

export type ReducerFunction<TState extends ObjectWithKeys> = (
  state: TState,
  action: FormAction<TState>,
) => TState;

/**
 * @param state
 * @param action
 * @returns
 */
export function TValidate<
  TState extends ObjectWithKeys,
  TValidity extends { [key: string]: boolean },
>(state: FormValidityState<TValidity>, action: FormValidityAction<TState>) {
  const stateIsValid = action.validator
    ? action.validator(action.payload)
    : true;
  const ret = {
    ...state,
    ...{
      errors: {
        ...state.errors,
        [action.type]: !stateIsValid,
      },

      isFormValid:
        stateIsValid && checkObjectValidity(state, action.type, stateIsValid),
    },
  };
  return ret;
}

/**
 * @param state
 * @param currentKey
 * @param actionValidity
 * @returns
 */
function checkObjectValidity<
  TValidity extends { [key: string]: boolean },
  TState extends ObjectWithKeys,
>(
  state: FormValidityState<TValidity>,
  currentKey: keyof TState,
  actionValidity: boolean,
) {
  if (!actionValidity) return false;
  const keys = Object.entries(state.errors);
  for (const [key, value] of keys) {
    if (key === currentKey) continue;
    if (value) return false;
  }
  return true;
}
