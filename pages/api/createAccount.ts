import * as crypto from "crypto";
import type {NextApiRequest, NextApiResponse} from 'next'
import {hashMyValue} from "../../src/utils/encrypting.utils";
import {dbConnection} from "../../src/database.connection";
import {SQLDuplicateKeyErrorCode} from "../../src/errors/sql/sql.error.codes";
import SqlError from "../../src/errors/sql/sql.error";

interface ICreateAccountReqQueries {
    username?: string;
    password?: string;
    auth?: string;
}

export default async function createAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        const {username, password, auth} = req.body as ICreateAccountReqQueries;

        if (!username) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing username"});
            return res;
        }

        if (!password) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing password"});
            return res;
        }

        if (!auth) {
            res.statusCode = 400;
            res.json({missing_parameter: "Missing auth"});
            return res;
        }
        try {

            const getValidAuthSql = `SELECT * FROM \`expectedusers\` WHERE \`user\` = '${auth}'`;

            const [authRows] = await dbConnection.promise().query(getValidAuthSql).catch((error) => {
                throw new SqlError(error)
            });

            if (authRows.length != 1) {
                res.statusCode = 400;
                res.json({invalid_property: "auth"});
                return res;
            }

            const salt = crypto.randomBytes(32).toString("base64");
            const hashedPassword = hashMyValue(password, 5, salt);

            const insertNewAccountSql = `INSERT INTO \`accounts\` (\`username\`, \`password\`, \`salt\`, \`name\`, \`id\`) VALUES ('${username}', '${hashedPassword}', '${salt}', '${authRows[0].name}', NULL);`

            await dbConnection.promise().query(insertNewAccountSql).catch((error) => {
                throw new SqlError(error)
            });

            res.statusCode = 200;
            res.json({success: "Account Created with username " + username});
        } catch (error) {
            if (error instanceof SqlError) {
                if (error.sqlError.errno === SQLDuplicateKeyErrorCode) {
                    res.statusCode = 400;
                    res.json({success: "Account already exists with username " + username});
                    return res;
                } else  {
                    console.log(error)
                }
            } else {
                console.log(error);
                res.statusCode = 500;
                res.json({Error: "Something went wrong!"});
                return res;
            }
        }
    } else {
        res.statusCode = 405;
        res.json({error: "Response not found"});
        return res;
    }
    return res;
}
