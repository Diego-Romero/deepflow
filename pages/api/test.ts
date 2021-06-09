import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseAdmin } from "next-firebase-auth";

type Response = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const db = getFirebaseAdmin().firestore();
  // console.log(db);
  const snapshot = await db.collection("mail").get();
  snapshot.forEach((doc) => console.log(`${doc.id} => ${doc.data()}`));
  return res.status(200).json({ message: "testing" });
};

export default handler;
