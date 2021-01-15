import crypto from "crypto";

export function hashMyValue(wordToHash: string, timesHashed: number, salt: string): string {
    for (let i = 0; i < timesHashed; i++)
        wordToHash = crypto.createHash("sha256").update(salt + wordToHash + process.env.pepper).digest("base64");

    return wordToHash;
}
