import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("req.method", req.method);
  if (req.method === "POST") {
    try {
      const { username, password, role, nama, alamat, telp, nik } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await prisma.users.create({
        data: {
          username,
          password,
          role,
        },
      });

      if (role === "admin") {
        await prisma.petugas.create({
          data: {
            nama,
            alamat,
            telp,
            userId: user.id,
          },
        });
      } else if (role === "pelanggan") {
        await prisma.pelanggan.create({
          data: {
            nama,
            alamat,
            telp,
            nik,
            userId: user.id,
          },
        });
      }

      return res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };