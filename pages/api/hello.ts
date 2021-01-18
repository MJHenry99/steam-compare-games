// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {dbConnection} from "../../src/database.connection";
import {DateTime} from "luxon";
import axios from "axios";

export default async (req, res) => {

  const a = await axios.get(`http://store.steampowered.com/api/appdetails?appids=${req.query.appId}&cc=gb&l=en`);

  res.statusCode = 200
  res.json({ NOTHING: a.data })
}
