import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (!product) return;

  const alreadyExists = await client.record.findFirst({
    where: {
      productId: +id.toString(),
      userId: user?.id,
      kind: "Fav",
    },
  });
  if (alreadyExists) {
    await client.record.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.record.create({
      data: {
        kind: "Fav",
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
