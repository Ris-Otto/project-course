export function Except<T extends { [key: string]: {} }, K extends keyof T>(obj: T, key: K): Omit<T, K> {
    const {[key]: _, ...ret} = obj;
    return ret;
}