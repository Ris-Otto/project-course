// @deno-types="npm:@types/axios"
import axios from 'axios';
import {ResponseData, Result} from "../../../Shared/Result.ts";



const instance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "Bearer": "test"
    }
})


export async function postRequest<
    TResponse,
    TData extends Record<string, {}>
>(path: string, data: TData): Promise<Result<TResponse>> {
    const response = await instance.post<ResponseData<TResponse>>(
        path,
        data,
        { withCredentials: true }
    );
    return new Result(response.data);
}

export async function getRequest<TResponse>(
    path: string
): Promise<Result<TResponse>> {
    const response = await instance.get<ResponseData<TResponse>>(path, { withCredentials: true });
    return new Result(response.data);
}