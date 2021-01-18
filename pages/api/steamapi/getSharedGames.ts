import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {diff, onSteamApiFail, steamAPIUrl} from "../../../src/utils/steam.utils";
import {ISteamGamesDetails} from "../../../src/models/steam.game.details";

interface IReqParams {
    steamids?: string;
}

interface ISteamResponse {
    response: {
        game_count: number;
        games: ISteamGamesDetails[]
    };
}

export default async function getSharedGames(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {

        const {steamids}: IReqParams = req.query;


        if (!steamids || steamids.split(",").length < 1) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing steamids"});
            return res;
        }

        const steamIdsArray: string[] = steamids.split(",")
        console.log(steamIdsArray)


        let games: ISteamGamesDetails[];
        let appIds: number[];

        for (let i = 0; i < steamIdsArray.length; i++) {

            const steamResponse = await axios.get(steamAPIUrl + `/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAMAPIKEY}&steamid=${steamIdsArray[i]}&format=json&include_appinfo=1`/*&include_played_free_games=1*/);

            const steamResponseData: ISteamResponse = steamResponse.data;

            if (steamResponse.status !== 200) {
                onSteamApiFail(res, steamResponse);
                break;
            }


            const gameIds: number[] = [];
            const steamGames: ISteamGamesDetails[] = [];
            for (let ii = 0; ii < steamResponseData.response.games.length; ii++) {
                gameIds.push(steamResponseData.response.games[ii].appid);
                steamGames.push({
                    appid: steamResponseData.response.games[ii].appid,
                    name: steamResponseData.response.games[ii].name,
                    img_logo_url: steamResponseData.response.games[ii].img_logo_url,
                    img_icon_url: steamResponseData.response.games[ii].img_icon_url
                })
            }

            if (!appIds) {
                appIds = gameIds;
                console.log(appIds);
                games = steamGames;
            } else {
                const localArray: number[] = appIds;
                appIds = diff(localArray, gameIds);
                console.log(appIds);
            }

        }

        games.sort(((a, b) => a.appid > b.appid ? 1 : a.appid < b.appid ? -1 : 0));
        appIds.sort(((a, b) => a > b ? 1 : a < b ? -1 : 0));

        const finalGames: ISteamGamesDetails[] = [];
        for (let i = 0; i < games.length; i++) {

            const locate = appIds.indexOf(games[i].appid)

            if (locate > -1) {

                finalGames.push({
                    appid: games[i].appid,
                    name: games[i].name,
                    img_icon_url: games[i].img_icon_url,
                    img_logo_url: games[i].img_logo_url
                })
            }
        }

        res.statusCode = 200;
        res.json({games: finalGames});
        return res;


    } else {
        res.statusCode = 405;
        res.json({error: "Response not found"});
        return res;
    }
}
