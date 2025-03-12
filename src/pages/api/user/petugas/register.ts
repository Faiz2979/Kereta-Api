import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password, nama, alamat, telp } = req.body;

    // Validasi input
    if (!username || !password || !nama) {
      return res.status(400).json({ message: "Username, password, and name are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

        // Validasi apakah sudah ada user dengan username atau email yang sama
        const existingUser = await prisma.users.findFirst({
          where: {
            OR: [
              { username },
            ],
          },
        });

    
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }

    // Buat User
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: "petugas",
      },
    });

    // Buat Petugas dengan `userId`
    await prisma.petugas.create({
      data: {
        nama,
        alamat,
        telp,
        userId: user.id,
      },
    });

    return res.status(201).json({
      message: "Petugas registered successfully",
      user: {
        username: user.username,
        role: "petugas",
        nama,
        alamat,
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
