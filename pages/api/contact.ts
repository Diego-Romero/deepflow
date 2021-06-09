import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";

type Response = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === "POST") {
    console.log(req.body);
    const db = getFirebaseAdmin().firestore();
    console.log(db);
    const doc = await db.collection("artists").get();
    return res.status(200).json({ message: "Email sent" });
  }
  return res.status(400).json({ message: "endpoint does not exist" });
};

export default handler;
