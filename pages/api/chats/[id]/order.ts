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
      query: { id },
    } = req;

    const product = await client.product.findFirst({
      where: {
        chatrooms: {
          some: {
            id: +id.toString(),
          },
        },
      },
    });

    const alreadyExist = await client.order.findFirst({
      where: {
        purchaserId: user?.id,
        productId: product?.id,
      },
    });

    if (alreadyExist) {
      res.json({
        ok: true,
        order: alreadyExist,
      });
    } else {
      const now = new Date();
      const closingTime = new Date(now);
      closingTime.setDate(now.getDate() + 7);

      const order = await client.order.create({
        data: {
          closingTime,
          product: {
            connect: { id: product?.id },
          },
          purchaser: {
            connect: { id: user?.id },
          },
        },
      });
      res.json({
        ok: true,
        order,
      });
    }
  } else if (req.method === "GET") {
    const {
      session: { user },
      query: { id },
    } = req;

    const product = await client.product.findFirst({
      where: {
        chatrooms: {
          some: {
            id: +id.toString(),
          },
        },
      },
    });

    const order = await client.order.findFirst({
      where: {
        OR: [{ purchaserId: user?.id }, { product: { userId: user?.id } }],
        productId: product?.id,
      },
    });

    const orderExist = Boolean(order);

    res.json({
      ok: true,
      order,
      orderExist,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
