import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, secretKey);
    const user = await prisma.users.findUnique({
    where: { id: decoded.userId },
    });
    if (!user || user.role !== 'petugas') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = req.body;
    const updateData = {};
    if (updates.keretaId !== undefined) updateData.keretaId = updates.keretaId;
    if (updates.waktuBerangkat !== undefined) updateData.waktuBerangkat = updates.waktuBerangkat;
    if (updates.waktuTiba !== undefined) updateData.waktuTiba = updates.waktuTiba;
    if (updates.stasiunBerangkat !== undefined) updateData.stasiunBerangkat = updates.stasiunBerangkat;
    if (updates.stasiunTiba !== undefined) updateData.stasiunTiba = updates.stasiunTiba;
    if (updates.asalKeberangkatan !== undefined) updateData.asalKeberangkatan = updates.asalKeberangkatan;
    if (updates.tujuanKeberangkatan !== undefined) updateData.tujuanKeberangkatan = updates.tujuanKeberangkatan;
    if (updates.tanggalBerangkat !== undefined) {
      const tanggalBerangkat = new Date(updates.tanggalBerangkat);
      if (!isNaN(tanggalBerangkat)) {
        updateData.tanggalBerangkat = tanggalBerangkat;
      } else {
        return res.status(400).json({ message: "Invalid tanggalBerangkat format" });
      }
    }
    if (updates.tanggalKedatangan !== undefined) {
      const tanggalKedatangan = new Date(updates.tanggalKedatangan);
      if (!isNaN(tanggalKedatangan)) {
        updateData.tanggalKedatangan = tanggalKedatangan;
      } else {
        return res.status(400).json({ message: "Invalid tanggalKedatangan format" });
      }
    }
    if (updates.harga !== undefined) updateData.harga = updates.harga;
    if (updates.kuota !== undefined) updateData.kuota = updates.kuota;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const jadwal = await prisma.jadwal.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(jadwal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}