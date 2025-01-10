export class Result<T> {

    private readonly data?: T;
    public message: string;
    public code: ResultCode;

    constructor(response: ResponseData<T>) {
        this.data = response.data;
        this.message = response.message;
        this.code = response.code;
    }

    public isError() {
        return this.code === ResultCode.Error;
    }

    public isSuccess() {
        return this.code === ResultCode.Ok;
    }

    public isUnauthorized() {
        return this.code === ResultCode.Unauthorized;
    }

    public isNotFound() {
        return this.code === ResultCode.NotFound;
    }

    public isPermissionDenied() {
        return this.code === ResultCode.PermissionDenied;
    }

    /**
     * @throws an error if `data` is `undefined` or `null`
     */
    public get response(): T {
        if (this.data === undefined || this.data === null) {
            console.log(this);
            throw new Error(
                "Can't unwrap a null|undefined response. Only use when 'isSuccess()' is true."
            );
        }
        return this.data;
    }
}

export declare interface ResponseData<T> {
    data?: T;
    message: string;
    code: ResultCode;
}

export enum ResultCode {
    Ok = 10,
    PartialOk = 15,
    Unauthorized = 20,
    NotFound = 30,
    PermissionDenied = 40,
    Error = 50,
    RequestAborted = 100,
    ThirdPartyRequestAborted = 200,
}

export class Response<T> {
    private readonly data?: T;
    public message: string;
    public code: ResultCode;

    constructor(resultCode: ResultCode, message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.code = resultCode;
    }
}

export const Unauthorized = (message?:string) => new Response(ResultCode.Unauthorized, message ? message : "Not authorized", null);
export const NotFound = <T>(data?: T, message?:string) => new Response(ResultCode.NotFound, message ? message : `Not found`, data);
export const PermissionDenied = <T>(data?: T, message?:string) => new Response(ResultCode.PermissionDenied, message ? message : "Permission denied", data);
export const InternalError = <T>(data?: T, message?:string) => new Response(ResultCode.Error, message ? message : "Internal server error", data);
export const PartialOk = <T>(data?: T, message?:string) => new Response(ResultCode.PartialOk, message ? message : "Partial Ok", data);
export const Ok = <T>(data?: T, message?:string) => new Response(ResultCode.Ok, message ? message : "Ok", data);
export const Aborted = <T>(data?: T, message?:string) => new Response(ResultCode.RequestAborted, message ? message : "Request aborted or declined due to unforeseeable circumstances", data);
export const ThirdPartyAborted = <T>(data?: T, message?:string) => new Response(ResultCode.ThirdPartyRequestAborted, message ? message : "Request aborted or declined by third party", data);
