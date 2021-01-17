import axios from "axios";

interface steamNewsResponseData {
    appnews: {
        appid: number;
        newsitems: [object];
    }
}

export default async function steamNews(req, res) {

    const a = await axios.get("http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=730&format=json");
    const b: steamNewsResponseData = a.data;

    const json = {};
    for (let i = 0; i < b.appnews.newsitems.length; i++) {
        json[i] = b.appnews.newsitems[i];
    }

    res.statusCode = 200
    res.json({ name: json })
}
