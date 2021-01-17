import {IUser} from "../models/user";
import {BehaviorSubject} from "rxjs";
import ApiService from "../services/api.service";
import {removeSteamId} from "../services/auth.service";
import NoUserError from "../errors/no.user.error";

const currentUser = new BehaviorSubject<IUser | null | undefined>(undefined);
let user: IUser | null;
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
    user = null;
}

export async function login(steamid: string) {
    const newUser: IUser | null = await getAxios().getUsersDetails(steamid)
        .catch((error) => {
            console.log(error);
            return null;
        });
    if (newUser) {
        currentUser.next(newUser);
        user = newUser;
    } else {
        logout();
    }
}

export async function getFriendsDetails(): Promise<IUser[] | null> {
    if (!user) {
        throw new NoUserError();
    }

    const friends: IUser[] | null = await getAxios().getFriendDetails(user.steamId)
        .catch((error) => {
            console.log(error);
            return null;
        });

    return friends;
}
