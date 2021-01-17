import axios from "axios";
import {onSteamApiFail, steamAPIUrl} from "../../../src/utils/steam.utils";
import {NextApiRequest, NextApiResponse} from "next";
import {IUser} from "../../../src/models/user.model";
import {ISteamPlayerModel} from "../../../src/models/steam.player.model";

interface ISteamResponse {
    friendslist: {
        friends: ISteamFriendResponse[]
    }
}

interface ISteamFriendResponse {
    steamid: string;
    relationship: string;
    friend_sience: number;
}

interface IReqParams {
    steamid?: string
}

export default async function getFriendsDetails(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {

            const {steamid}: IReqParams = req.query;

            if (!steamid) {
                res.statusCode = 400;
                res.json({missing_parameter: "Missing steamid"});
                return res;
            }

            const steamResponse = await axios.get(steamAPIUrl + `/ISteamUser/GetFriendList/v0001/?key=${process.env.STEAMAPIKEY}&steamid=${steamid}&relationship=friend`);

            if (steamResponse.status !== 200)
                return onSteamApiFail(res, steamResponse);

            const steamResponseData: ISteamResponse = steamResponse.data;

            const steamFriends: ISteamFriendResponse[] = steamResponseData.friendslist.friends

            if (steamFriends.length < 1) {
                res.statusCode = 204;
                res.json({message: "No friends"});
                return res;
            }

            let steamIdsCommaSeparated: string = steamFriends[0].steamid;

            for (let i = 1; i < steamFriends.length; i++)
                steamIdsCommaSeparated += `,${steamFriends[i].steamid}`;

            const friendDetailsResponse = await axios.get(steamAPIUrl + `/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAMAPIKEY}&steamids=${steamIdsCommaSeparated}&format=json`);

            if (friendDetailsResponse.status !== 200)
                return onSteamApiFail(res, friendDetailsResponse);

            const friendDetailsResponseData = friendDetailsResponse.data;

            const players: ISteamPlayerModel[] = friendDetailsResponseData.response.players;

            if (players.length < 1) {
                res.statusCode = 404;
                res.json({error: "No players found"});
                return res;
            }

            const friends: IUser[] = []

            for (let i = 0; i < players.length; i++) {
                friends.push({
                    steamId: players[i].steamid,
                    steamName: players[i].personaname,
                    avatarUrl: players[i].avatar,
                    profileUrl: players[i].profileurl
                });
            }


            res.statusCode = 200;
            res.json({friends: friends});
        } else {
            res.statusCode = 405;
            res.json({error: "Response not found"});
            return res;
        }
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.json({error: "Something went wrong"});
        return res;
    }
}
