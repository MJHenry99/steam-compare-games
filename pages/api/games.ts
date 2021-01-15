import axios from "axios";

//Kieran = 76561198055694097
//ME = 76561198088490664

export default async function games(req, res) {
    const a = await axios.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=D59F320D4903D7B2883ED4AE89A60E68&steamid=76561198055694097&format=json&include_appinfo=1&include_played_free_games=1");

    res.statusCode = 200
    res.json({ name: a.data })
}
