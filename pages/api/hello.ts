// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {dbConnection} from "../../src/database.connection";

export default async (req, res) => {
  const sql = "SELECT * FROM testing";
  const [rows] = await dbConnection.promise().query(sql);
  res.statusCode = 200
  res.json({ name: rows })
}
