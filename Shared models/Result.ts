export class Response<T> {

    private data?: T;
    public message?: string;
    public resultCode: ResultCode;

    constructor(value: ResponseData<T>) {
        this.data = value.data;
        this.message = value.message;
        this.resultCode = value.resultCode;
    }

    public isError() {
        return this.resultCode === Result.Error;
    }

    public isSuccess() {
        return this.resultCode === Result.Ok;
    }

    public isUnauthorized() {
        return this.resultCode === Result.Unauthorized;
    }

    public isNotFound() {
        return this.resultCode === Result.NotFound;
    }

    public isPermissionDenied() {
        return this.resultCode === Result.PermissionDenied;
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

export const Result = {
    Ok: 10,
    Unauthorized: 20,
    NotFound: 30,
    PermissionDenied: 40,
    Error: 50,
} as const;

type ResultCode = (typeof Result)[keyof typeof Result];