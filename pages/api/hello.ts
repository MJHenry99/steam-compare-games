// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {connection} from "../../src/connection";

export default async (req, res) => {
  const sql = "SELECT * FROM testing";
  const [rows] = await connection.promise().query(sql);
  res.statusCode = 200
  res.json({ name: rows })
}
