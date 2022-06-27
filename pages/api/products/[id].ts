import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.query;
  const product = await client.product.findUnique({
    where: { id: +id.toString() },
    include: {
      user: {
        select: {
          name: true,
          id: true,
          avatar: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    product,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
