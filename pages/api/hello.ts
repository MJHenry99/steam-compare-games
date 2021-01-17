// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {dbConnection} from "../../src/database.connection";
import {DateTime} from "luxon";
import axios from "axios";

export default async (req, res) => {

  console.log(req.body["openid.identity"]);

  res.statusCode = 200
  res.json({ data: "null" })
}
