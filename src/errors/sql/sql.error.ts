import {ISQLError} from "../../models/sql.error.model";

export default class SqlError extends Error {
    constructor(public sqlError: ISQLError) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
