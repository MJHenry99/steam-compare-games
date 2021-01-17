import axios from "axios";

//Kieran = 76561198055694097
//ME = 76561198088490664

export default async function createSteamIds(req, res) {
    const a = await axios.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=D59F320D4903D7B2883ED4AE89A60E68&steamids=76561198055694097&format=json");

    res.statusCode = 200
    res.json({ name: a.data })
}
