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
