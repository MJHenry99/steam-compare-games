import {IUser} from "../models/user";
import {BehaviorSubject} from "rxjs";

const currentUser = new BehaviorSubject<IUser | null | undefined>(undefined);

export const $currentUser = currentUser.asObservable();


export function logout() {
    currentUser.next(null);
}
