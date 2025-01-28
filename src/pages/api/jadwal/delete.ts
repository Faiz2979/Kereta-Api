import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";
const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const prisma = new PrismaClient();

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== "DELETE") {
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
    await prisma.jadwal.delete({
      where: { id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}