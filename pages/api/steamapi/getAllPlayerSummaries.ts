import axios from "axios";
import type {NextApiRequest, NextApiResponse} from 'next'
import {IDBSteamIds, onSteamApiFail} from "../../../src/utils/steam.utils";
import {dbConnection} from "../../../src/database.connection";

//Kieran = 76561198055694097
//ME = 76561198088490664

interface IGetAllPlayerSummariesSteamResponse {
    response: {
        players: [IPlayerSummary];
    };
}

interface IPlayerSummary {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    "personaname": string;
    "profileurl": string;
    "avatar": string;
    "avatarmedium": string;
    "avatarfull": string;
    "avatarhash": string;
    "lastlogoff": string;
    "personastate": number;
    "realname": string;
    "primaryclanid": string;
    "timecreated": number;
    "personastateflags": number;
    "loccountrycode": string;
    "locstatecode": string;
}

interface IPlayerSummariesResponse {
    steamid: string;
    username: string;
    profileUrl: string;
    avatar: string;
}

export default async function getAllPlayerSummaries(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {

        const getAllSteamIdsSql = `SELECT \`steamid64\` FROM \`steamids\``;
        const [steamIdsArray] = await dbConnection.promise().query(getAllSteamIdsSql) as [[IDBSteamIds]];

        if (steamIdsArray.length < 1) {
            res.statusCode = 404;
            res.json({error: "No steamIDs in the db"});
            return res;
        }

        let commaSeparatedSteamIds = steamIdsArray[0].steamid64;

        for (let i = 1; i < steamIdsArray.length; i++) {
            commaSeparatedSteamIds += "," + steamIdsArray[i].steamid64;
        }


        const steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAMAPIKEY}&steamids=${commaSeparatedSteamIds}&format=json`);

        if (steamResponse.status !== 200) {
            return onSteamApiFail(res, steamResponse);
        }

        console.log(steamResponse.data)

        const players: IPlayerSummary[] = (steamResponse.data as IGetAllPlayerSummariesSteamResponse).response.players;

        const responseJson: IPlayerSummariesResponse[] = [];
        for (let i = 0; i < players.length; i++) {
            responseJson[i] = {
                steamid: players[i].steamid,
                avatar: players[i].avatarfull,
                profileUrl: players[i].profileurl,
                username: players[i].personaname
            };
        }

        res.statusCode = 200;
        res.json({players: responseJson});
        return res;
    } else {
        res.statusCode = 405;
        res.json({error: "Response not found"});
        return res;
    }
}
