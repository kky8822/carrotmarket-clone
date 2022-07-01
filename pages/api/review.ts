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

  const reviews = await client.review.findMany({
    where: { createdForId: user?.id },
    include: {
      createdBy: true,
    },
  });

  res.json({
    ok: true,
    reviews,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
