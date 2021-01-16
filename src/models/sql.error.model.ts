export interface ISQLError {
    code: string;
    errno: number;
    sqlState: string;
    sqlMessage: string;
}
