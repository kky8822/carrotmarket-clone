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
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isFav = Boolean(
    await client.record.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
        kind: "Fav",
      },
      select: { id: true },
    })
  );
  res.json({
    ok: true,
    product,
    isFav,
    relatedProducts,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
