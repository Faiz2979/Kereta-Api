import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("req.method", req.method);
  if (req.method === "POST") {
    try {
      const { username, password, email, nama, alamat, telp, nik } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }

      let role = "pelanggan";
      if (email.endsWith("@petugas.com")) {
        role = "petugas";
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          email: email,
          role,
          nama,
          alamat,
          telp,
          nik
        }
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}