import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password,email, nik, nama, alamat, telp } = req.body;

    // Validasi input
    if (!username || !password || !nik || !nama) {
      return res.status(400).json({ message: "Username, password, NIK, and name are required" });
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

    const existingPelanggan = await prisma.pelanggan.findFirst({
      where: {
        OR: [
          { nik },
        ],
      },
    });

    if (existingUser || existingPelanggan) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Buat User terlebih dahulu
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: "pelanggan",
      },
    });

    // Buat Pelanggan dengan `userId`
    await prisma.pelanggan.create({
      data: {
        nik,
        nama,
        alamat,
        telp,
        userId: user.id,
      },
    });

    return res.status(201).json({
      message: "Pelanggan registered successfully",
      user: {
        username: user.username,
        role: "pelanggan",
        nama,
        alamat,
      },
    });

  } catch (error) {
    console.error("Error:aaa", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
