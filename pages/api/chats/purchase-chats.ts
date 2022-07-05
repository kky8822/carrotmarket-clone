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
  } = req;

  const chatrooms = await client.chatroom.findMany({
    where: {
      purchaserId: user?.id,
    },
    include: {
      product: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      chats: {
        take: -1,
      },
    },
  });

  res.json({
    ok: true,
    chatrooms,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
