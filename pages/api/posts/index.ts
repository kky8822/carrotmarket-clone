import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { question },
      session: { user },
    } = req;

    const post = await client.post.create({
      data: {
        question,
        user: {
          connect: { id: user?.id },
        },
      },
    });

    res.json({
      ok: true,
      post,
    });
  } else if (req.method === "GET") {
    const posts = await client.post.findMany({
      include: {
        _count: {
          select: { wonderings: true, answers: true },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      posts,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
