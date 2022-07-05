import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { productId },
  } = req;

  const alreadExist = await client.chatroom.findFirst({
    where: {
      productId: +productId.toString(),
      purchaserId: user?.id,
    },
  });

  if (alreadExist) {
    res.json({
      ok: true,
      chatroomId: alreadExist.id,
    });
  } else {
    const chatroom = await client.chatroom.create({
      data: {
        product: {
          connect: {
            id: +productId.toString(),
          },
        },
        purchaser: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      chatroomId: chatroom.id,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
