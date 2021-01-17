import {IUser} from "../models/user";
import {BehaviorSubject} from "rxjs";
import ApiService from "../services/api.service";
import {removeSteamId} from "../services/auth.service";

const currentUser = new BehaviorSubject<IUser | null | undefined>(undefined);
let apiService: ApiService | null;

export function getAxios(): ApiService {
    if (!apiService) {
        apiService = new ApiService();
    }
    return apiService;
}


export const $currentUser = currentUser.asObservable();


export function logout() {
    removeSteamId();
    currentUser.next(null);
}

export async function login(steamid: string) {
    const newUser: IUser | null = await getAxios().getUsersDetails(steamid).catch((error) => {
        console.log(error);
        return null;
    });
    if (newUser) {
        currentUser.next(newUser);
    } else {
        logout();
    }
}
