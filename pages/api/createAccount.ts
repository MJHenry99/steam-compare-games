import * as crypto from "crypto";
import type {NextApiRequest, NextApiResponse} from 'next'
import {hashMyValue} from "../../src/utils/encrypting.utils";

interface ICreateAccountReqQueries {
    username?: string;
    password?: string;
}

export default async function createAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        const {username, password} = req.query as ICreateAccountReqQueries;

        if (username) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing username"});
            return res;
        }

        if (password) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing password"});
            return res;
        }


        const salt = crypto.randomBytes(32).toString("base64");
        const hashedPassword = hashMyValue(password, 5, salt);
        res.statusCode = 200;
        res.json({success: "Account Created with username " + username});
    } else {
        res.statusCode = 405;
        res.json({error: "Response not found"});
    }
    return res;
}
