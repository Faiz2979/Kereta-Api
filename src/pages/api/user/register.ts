import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password, email, nama, alamat, telp, nik } = req.body;

    // Validasi input
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, password, and email are required" });
    }

    // Tentukan role berdasarkan email
    let role = "pelanggan";
    if (email.endsWith("@petugas.com")) {
      role = "petugas";
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat User terlebih dahulu
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role,
      },
    });

    // Jika role pelanggan, buat Pelanggan
    if (role === "pelanggan") {
      if (!nik) {
        return res.status(400).json({ message: "NIK is required for pelanggan" });
      }
      await prisma.pelanggan.create({
        data: {
          nik,
          nama,
          alamat,
          telp,
          userId: user.id, // Hubungkan dengan user yang baru dibuat
        },
      });
    }

    // Jika role petugas, buat Petugas
    if (role === "petugas") {
      await prisma.petugas.create({
        data: {
          nama,
          alamat,
          telp,
          userId: user.id, // Hubungkan dengan user yang baru dibuat
        },
      });
    }

    // Response sukses
    return res.status(201).json({
      username: user.username,
      email: user.email,
      role: user.role,
      nama,
      alamat,
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
