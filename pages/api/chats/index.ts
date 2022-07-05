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
      session: { user },
      body: { productId },
    } = req;

    const chatroom = await client.chatroom.create({
      data: {
        product: {
          connect: {
            id: +productId.toString(),
          },
        },
      },
    });

    res.json({
      ok: true,
      chatroomId: chatroom.id,
    });
  } else if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const chatrooms = await client.chatroom.findMany({
      where: {
        purchaserId: user?.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        chats: {
          take: 1,
        },
      },
    });

    res.json({
      ok: true,
      chatrooms,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
