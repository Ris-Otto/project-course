// @deno-types="npm:@types/axios"
import axios from "axios";
import { ResponseData, Result } from "../../../Shared/Result.ts";

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
>(path: string, data?: Record<string, {}>): Promise<Result<TResponse>> {
  try {
    const response = await fileInstance.post<ResponseData<TResponse>>(
      path,
      data,
      { withCredentials: true },
    );
    return new Result(response.data);
  } catch {
    return new Result(null);
  }
}

export async function postRequest<
  TResponse,
>(path: string, data?: Record<string, {}>): Promise<Result<TResponse>> {
  try {
    const response = await instance.post<ResponseData<TResponse>>(
      path,
      data,
      { withCredentials: true },
    );
    return new Result(response.data);
  } catch {
    return new Result(null);
  }
}

export async function getRequest<TResponse>(
  path: string,
): Promise<Result<TResponse>> {
  const response = await instance.get<ResponseData<TResponse>>(path, {
    withCredentials: true,
  });
  return new Result(response.data);
}
