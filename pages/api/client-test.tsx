import { NextApiRequest, NextApiResponse } from "next/types";
import client from "../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await client.user.create({
    data: {
      email: "kky8822@naver.com",
      name: "kky8833",
    },
  });

  res.json({
    ok: true,
  });
}
