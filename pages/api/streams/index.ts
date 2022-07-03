import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;
    const skip = (+page.toString() - 1) * 10;
    const streams = await client.stream.findMany({
      take: 10,
      skip,
      select: {
        id: true,
        name: true,
      },
    });

    res.json({
      ok: true,
      streams,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    console.log(name, price, description, user);

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: { id: user?.id },
        },
      },
    });

    res.json({
      ok: true,
      stream,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
