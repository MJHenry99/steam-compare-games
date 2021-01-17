
export default class NoUserError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
