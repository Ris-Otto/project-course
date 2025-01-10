import paths from "../../../Shared/paths.ts";
import { postRequest } from "./APITemplate.ts";
import { UserPayload } from "../../../Shared/Types.ts";
import { Result } from "../../../Shared/Result.ts";

export const checkToken = async (): Promise<Result<UserPayload>> => {
  return await postRequest(paths.auth);
};

export const logout = async (): Promise<Result<void>> => {
  return await postRequest(paths.user.logout);
};
