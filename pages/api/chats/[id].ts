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

  const chats = await client.chat.findMany({
    where: {
      chatroomId: +id.toString(),
      userId: user?.id,
    },
  });

  res.json({
    ok: true,
    chats,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
