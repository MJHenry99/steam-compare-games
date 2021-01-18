import {IUser} from "../models/user.model";
import {BehaviorSubject} from "rxjs";
import ApiService from "../services/api.service";
import {removeSteamId} from "../services/auth.service";
import NoUserError from "../errors/no.user.error";
import NoSteamIdsError from "../errors/no.steam.ids.error";
import {ISteamGamesDetails} from "../models/steam.game.details";
import {ISteamPlayerModel} from "../models/steam.player.model";

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

    if (friends) {
        friends.sort(((a, b) => a.steamName > b.steamName ? 1 : a.steamName < b.steamName ? -1 : 0));
    }

    return friends;
}

export async function getSharedGames(steamIds: string[]): Promise<ISteamGamesDetails[]> {
    if (!steamIds || steamIds.length < 1) {
        throw new NoSteamIdsError();
    }

    const sharedGames: ISteamGamesDetails[] | null = await getAxios().getSharedGames(steamIds);

    if (sharedGames) {
        sharedGames.sort(((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    }

    return sharedGames;
}
