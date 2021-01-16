// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {dbConnection} from "../../src/database.connection";
import {DateTime} from "luxon";

export default async (req, res) => {

  const lastRanSql = `SELECT MAX(timestamp) FROM \`getgamesruntimes\``;
  const [val] = await dbConnection.promise().query(lastRanSql);
  const lastRan = val[0]["MAX(timestamp)"]

  if (lastRan) {
    // console.log(DateTime.fromMillis(lastRan).minus({hours: 4}))
    const a = DateTime.fromMillis(lastRan).minus({hours: 24})
    console.log(a.diffNow("hours").hours)
  }


  res.statusCode = 200;
  res.json({ value: lastRan })
  return res;
}
