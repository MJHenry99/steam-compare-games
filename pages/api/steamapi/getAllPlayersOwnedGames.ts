import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {dbConnection} from "../../../src/database.connection";
import {IDBSteamIds, onSteamApiFail} from "../../../src/utils/steam.utils";
import {DateTime} from "luxon";

interface ISteamGamesOwnedSteamApiResponse {
    response: {
        game_count: number;
        games: ISteamGamesDetailsSteamApi[];
    };
}

interface ISteamGamesDetailsSteamApi {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
    has_community_visible_stats: boolean;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
}

export default async function getAllPlayersOwnedGames(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {

        const lastRanSql = `SELECT MAX(timestamp) FROM \`getgamesruntimes\``;
        const [val] = await dbConnection.promise().query(lastRanSql);
        const lastRan = val[0]["MAX(timestamp)"]

        if (lastRan && DateTime.fromMillis(lastRan).diffNow("hours").hours > -24 ){
            res.statusCode = 302
            res.json({value: "Not needed to run yet"})
            return res;
        }



        const getAllSteamIdsSql = `SELECT \`steamid64\` FROM \`steamids\``;
        const [dbResponse] = await dbConnection.promise().query(getAllSteamIdsSql);
        const steamIdsArray: IDBSteamIds[] = dbResponse;

        if (steamIdsArray.length < 1) {
            res.statusCode = 404;
            res.json({error: "No steamIDs in the db"});
            return res;
        }

        for (let i = 0; i < steamIdsArray.length; i++) {
            const steamApiResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAMAPIKEY}&steamid=${steamIdsArray[i].steamid64}&format=json&include_appinfo=1&include_played_free_games=true`);

            if (steamApiResponse.status !== 200) {
                continue;
            }

            await dbConnection.promise().query(`DELETE FROM \`games\` WHERE \`steamid64\` = '${steamIdsArray[i].steamid64}'`);
            const gamesReceived: ISteamGamesDetailsSteamApi[] = (steamApiResponse.data as ISteamGamesOwnedSteamApiResponse).response.games;

            let insertValuesForSQLQuery = "";
            for (let ii = 0; ii < gamesReceived.length; ii++) {

                if (ii > 0)
                    insertValuesForSQLQuery += ", ";

                const search = "'"
                const replacer = new RegExp(search, 'g')
                const gameName = gamesReceived[ii].name.replace(replacer, "\\'")

                insertValuesForSQLQuery += `(NULL, '${steamIdsArray[i].steamid64}', '${gameName}', '${gamesReceived[ii].appid}', '${gamesReceived[ii].playtime_forever}')`;
            }
            const insertGameSql = `INSERT INTO \`games\` (\`id\`, \`steamid64\`, \`GameName\`, \`GameAppId\`, \`TimePlayed\`) VALUES ${insertValuesForSQLQuery};`;
            await dbConnection.promise().query(insertGameSql);
        }

        // const insertGameSql = `INSERT INTO \`games\` (\`steamid64\`, \`imageIconUrl\`, \`GameName\`, \`GameAppId\`, \`TimePlayed\`, \`id\`) VALUES ('3', 'a', 'a', '1', '1'), ('3', 'a', 'a', '1', '1');`;

        const recordLastRanSql = `INSERT INTO \`getgamesruntimes\` (\`id\`, \`timestamp\`) VALUES (NULL, '${DateTime.utc().toMillis()}');`;
        await dbConnection.promise().query(recordLastRanSql);
        res.statusCode = 200;
        res.json({success: "Got all games for all ids"});
        return res;
    } else {
        res.statusCode = 405;
        res.json({error: "Nothing found"});
        return res;
    }

}
