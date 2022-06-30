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
      body: { question, latitude, longitude },
      session: { user },
    } = req;

    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
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
    const { latitude, longitude } = req.query;
    const posts = await client.post.findMany({
      select: {
        question: true,
        createdAt: true,
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { wonderings: true, answers: true },
        },
      },
      where: {
        latitude: {
          gte: +latitude.toString() - 0.01,
          lte: +latitude.toString() + 0.01,
        },
        longitude: {
          gte: +longitude.toString() - 0.01,
          lte: +longitude.toString() + 0.01,
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
