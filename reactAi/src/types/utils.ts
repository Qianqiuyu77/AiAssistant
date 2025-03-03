export interface IResponse<T = null> {
    data: T;
    msg: string;
}