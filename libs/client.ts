import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

client.user.create({
  data: {
    email: "kky8822@gmail.com",
  },
});
