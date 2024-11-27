import { Result } from "../../../Shared/Result.ts";

export type SuspenseConsumer<T> = {
  read(): Result<T>;
};
