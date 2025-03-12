// @deno-types="npm:@types/axios"
import axios from "axios";
import {
  type ResponseData,
  Result,
  ResultCode,
} from "../../../Shared/Result.ts";
import { toast } from "react-toastify";
import { Method } from "../utilities/Types.tsx";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const fileInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "multipart/form-data",
    "transfer-encoding": "chunked",
  },
});

export async function postFileRequest<
  TResponse,
>(path: string, data?: any): Promise<Result<TResponse>> {
  const response = await fileInstance.post<ResponseData<TResponse>>(
    path,
    data,
    { withCredentials: true },
  );
  return new Result(response.data);
}

export async function postRequest<
  TResponse,
>(path: string, data?: Record<string, {}>): Promise<Result<TResponse>> {
  const response = await instance.post<ResponseData<TResponse>>(
    path,
    data,
    { withCredentials: true },
  );
  return new Result(response.data);
}

export function getImage(path?: string) {
  return `http://localhost:8000/uploads/${path}`;
}

export async function getRequest<TResponse>(
  path: string,
): Promise<Result<TResponse>> {
  const response = await instance.get<ResponseData<TResponse>>(path, {
    withCredentials: true,
  });
  return new Result(response.data);
}

export async function requestAndToast<TResponse>(
  method: Method,
  path: string,
  data?: Record<string, {}>,
): Promise<Result<TResponse>> {
  switch (method) {
    case Method.GET:
      const getresponse = await getRequest<TResponse>(path);
      toastResponse(getresponse);
      return getresponse;
    case Method.POST:
      const postresponse = await postRequest<TResponse>(path, data);
      toastResponse(postresponse);
      return postresponse;
  }
}

function toastResponse<T>(result: Result<T>) {
  const { code, message } = result;
  switch (code) {
    case ResultCode.Ok:
      toast.success(message ? message : "Success");
      break;
    case ResultCode.Error:
      toast.error(message ? message : "Something went wrong");
      break;
    case ResultCode.NotFound:
      toast.error(message ? message : "Not found");
      break;
    case ResultCode.PartialOk:
      toast.success(message ? message : "Success");
      break;
    case ResultCode.PermissionDenied:
      toast.error(message ? message : "Denied");
      break;
    case ResultCode.RequestAborted:
      toast.warning(message ? message : "Aborted");
      break;
    case ResultCode.ThirdPartyRequestAborted:
      toast.warning(message ? message : "Aborted");
      break;
    case ResultCode.Unauthorized:
      toast.warning(message ? message : "Denied");
      break;
  }
}
