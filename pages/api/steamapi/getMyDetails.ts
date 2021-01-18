import axios from "axios";
import {onSteamApiFail, steamAPIUrl} from "../../../src/utils/steam.utils";
import {NextApiRequest, NextApiResponse} from "next";
import {IUser} from "../../../src/models/user.model";
import {ISteamPlayerModel} from "../../../src/models/steam.player.model";

interface ISteamResponse {
    response: {
        players: ISteamPlayerModel[]
    }
}


interface IReqParams {
    steamid?: string
}

export default async function getMyDetails(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {

        const {steamid}: IReqParams = req.query;

        if (!steamid) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing steamid"});
            return res;
        }


        const steamResponse = await axios.get(steamAPIUrl + `/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAMAPIKEY}&steamids=${req.query.steamid}&format=json`);

        if (steamResponse.status !== 200)
            return onSteamApiFail(res, steamResponse);

        const steamResponseData: ISteamResponse = steamResponse.data;

        if (steamResponseData.response.players.length < 1) {
            res.statusCode = 404;
            res.json({error: "Player not found"});
            return res;
        }

        const player: ISteamPlayerModel = steamResponseData.response.players[0];

        const user: IUser = {
            steamId: player.steamid,
            steamName: player.personaname,
            avatarUrl: player.avatarfull,
            profileUrl: player.profileurl

        };
        res.statusCode = 200;
        res.json({user: user});
    } else {
        res.statusCode = 405;
        res.json({error: "Response not found"});
        return res;
    }
}
