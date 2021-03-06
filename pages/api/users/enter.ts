import twilio from "twilio";
import mg from "mailgun-js";
import type { NextApiRequest, NextApiResponse } from "next/types";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, phone } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });

  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MS_SID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}`,
    // });
  } else if (email) {
    // const email = await mg({
    //   apiKey: process.env.MG_APIKEY!,
    //   domain: process.env.MG_DOMAIN!,
    // })
    //   .messages()
    //   .send({
    //     from: "kky8822@gmail.com",
    //     to: "kky8822@gmail.com",
    //     subject: "Your Carrot Market Verification Email",
    //     text: `Your token is ${payload}`,
    //     html: `<strong>Your token is ${payload}</strong>`,
    //   });
    // console.log(email);
  }

  /* if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      console.log("found it");
    }
    if (!user) {
      console.log("Did not find, will create");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,
      },
    });
    if (user) {
      console.log("found it");
    }
    if (!user) {
      console.log("Did not find, will create");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
    console.log(user);
  } */

  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
