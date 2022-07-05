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
      session: { user },
      query: { id },
    } = req;

    const chats = await client.chat.findMany({
      where: {
        chatroomId: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      chats,
    });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body,
      query: { id },
    } = req;

    const chat = await client.chat.create({
      data: {
        message: body.chat,
        chatroom: {
          connect: {
            id: +id.toString(),
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      chat,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
