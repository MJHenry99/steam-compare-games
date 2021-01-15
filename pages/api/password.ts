import * as crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function password(req: NextApiRequest, res: NextApiResponse) {
    const a = crypto.randomBytes(32).toString("base64");
    console.log(a)
    console.log(crypto.createHash("sha256").update(a+"poop"+process.env.pepper).digest("base64"))
    console.log(req.query)
    console.log(process.env.pepper)
    res.statusCode = 200
    res.json({ name: "DONE" })
}
