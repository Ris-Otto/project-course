import axios from 'axios';
import {ResponseData, Result} from "../../../Shared models/Result.ts";

export async function postRequest<
    TResponse,
    TData extends { [key: string]: {} }
>(path: string, data: TData): Promise<Result<TResponse>> {
    const response = await axios.post<ResponseData<TResponse>>(
        path,
        data
    );
    return new Result(response.data);
}

export async function getRequest<TResponse>(
    path: string
): Promise<Result<TResponse>> {
    const response = await axios.get<ResponseData<TResponse>>(path);
    return new Result(response.data);
}