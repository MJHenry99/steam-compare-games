
export default class SteamRequestError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
