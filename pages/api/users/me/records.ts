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
    query: { kind },
  } = req;

  const records = await client.record.findMany({
    where: {
      userId: user?.id,
      kind,
    },
    include: {
      product: {
        select: {
          id: true,
          image: true,
          name: true,
          price: true,
          records: {
            where: {
              kind: "Fav",
            },
            select: { id: true },
          },
        },
      },
    },
  });
  res.json({
    ok: true,
    records,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
