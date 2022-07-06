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
    query: { id },
  } = req;

  const chatroom = await client.chatroom.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      product: {
        select: {
          id: true,
          userId: true,
          orders: {
            select: {
              id: true,
            },
          },
        },
      },
      purchaser: {
        select: {
          id: true,
        },
      },
    },
  });

  if (
    user?.id !== chatroom?.product.userId ||
    chatroom?.product.orders.length === 0
  ) {
    res.json({
      ok: false,
    });
  } else {
    await client.order.update({
      where: {
        id: chatroom?.product.orders[0].id,
      },
      data: {
        accept: true,
      },
    });
    res.json({
      ok: true,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
