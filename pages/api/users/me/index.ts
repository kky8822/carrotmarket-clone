import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });

    res.json({
      ok: true,
      profile,
    });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { name, email, phone },
    } = req;
    console.log(name, email, phone);
    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
    });
    if (name && name !== currentUser?.name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }
    if (email && email !== currentUser?.email) {
      const alreadExists = await client.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (alreadExists) {
        res.json({
          ok: false,
          error: "Email already taken",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadExists = await client.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        },
      });
      if (alreadExists) {
        res.json({
          ok: false,
          error: "Phone already taken",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
    }
    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
