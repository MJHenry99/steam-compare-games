import axios, {AxiosInstance} from "axios";
import SteamRequestError from "../errors/steam.request.error";
import {IUser} from "../models/user";

export default class ApiService {
    private _axios: AxiosInstance;

    constructor() {
        this._axios = axios.create(
            {
                baseURL: process.env.API_URL,
                timeout: 30000,
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        )
    }

    async getUsersDetails(steamId: string): Promise<IUser> {
       const response = await this._axios.get(`/api/steamapi/getMyDetails?steamid=${steamId}`);

       if (response.status === 400) {
           throw new SteamRequestError();
       } else if (response.status === 200) {
           return response.data.user;
       } else {
           throw new Error("Something went wrong. Code = " + response.status);
       }
    }

    async getFriendDetails(steamId: string): Promise<IUser[]> {
        const response = await this._axios.get(`/api/steamapi/getFriends?steamid=${steamId}`);

        if (response.status === 400) {
            throw new SteamRequestError();
        } else if (response.status === 200) {
            return response.data.friends;
        } else {
            throw new Error("Something went wrong. Code = " + response.status);
        }
    }
}
