import { Result } from "../../../Shared/Result.ts";
// @deno-types="npm:@types/react"
import React, { SetStateAction } from "react";

export type SuspenseConsumer<T> = {
  read(): Result<T>;
};

export type StateHandler<T> = React.Dispatch<SetStateAction<T>>;
