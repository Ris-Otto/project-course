export class Result<T> {

    private readonly data?: T;
    public message: string;
    public code: ResultCode;

    constructor(resultCode: ResultCode, message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.code = resultCode;
    }

    public isError() {
        return this.code === Code.Error;
    }

    public isSuccess() {
        return this.code === Code.Ok;
    }

    public isUnauthorized() {
        return this.code === Code.Unauthorized;
    }

    public isNotFound() {
        return this.code === Code.NotFound;
    }

    public isPermissionDenied() {
        return this.code === Code.PermissionDenied;
    }

    /**
     * @throws an error if `data` is `undefined` or `null`
     */
    public get response(): T {
        if (this.data === undefined || this.data === null) {
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
    resultCode: ResultCode;
}

export const Code = {
    Ok: 10,
    Unauthorized: 20,
    NotFound: 30,
    PermissionDenied: 40,
    Error: 50,
} as const;

type ResultCode = (typeof Code)[keyof typeof Code];

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

export const Unauthorized = <T>(data?: T, message?:string) => new Response(Code.Unauthorized, message ? message : "Not authorized", data);
export const NotFound = <T>(data?: T, message?:string) => new Response(Code.NotFound, message ? message : `${typeof data} not found`, data);
export const PermissionDenied = <T>(data?: T, message?:string) => new Response(Code.PermissionDenied, message ? message : "Permission denied", data);
export const InternalError = <T>(data?: T, message?:string) => new Response(Code.Error, message ? message : "Internal server error", data);
export const Ok = <T>(data: T, message?:string) => new Response(Code.Ok, message ? message : "Ok", data);
