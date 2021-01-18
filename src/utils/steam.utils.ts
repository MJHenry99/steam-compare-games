import {AxiosResponse} from "axios";
import type {NextApiResponse} from "next";

export function onSteamApiFail(res: NextApiResponse, axiosResponse: AxiosResponse): NextApiResponse {
    res.statusCode = 400
    res.json({error: "Something went wrong with steam request"})
    console.log(axiosResponse.status + "   " + axiosResponse.statusText + "    " + axiosResponse.data);
    return res;
}


export interface IDBSteamIds {
    steamid64: string
}

export const steamAPIUrl = "http://api.steampowered.com"

export const loginWithSteamQueryKeyword = "openid.identity";

export const diff = function (array: number[], array2: number[]) {
    let ret = [];
    array2.sort();
    array.sort();
    for (let i = 0; i < array2.length; i += 1) {
        if (array.indexOf(array2[i]) > -1) {
            ret.push(array2[i]);
        }
    }
    return ret;
};
