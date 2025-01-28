// create data gerbong

import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
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

            const { nomorKursi, gerbongId } = req.body;

            if (!nomorKursi || !gerbongId) {
                return res.status(400).json({ message: "noKursi and gerbongId are required" });
            }

            const newKursi = await prisma.kursi.create({
                data: {
                    nomorKursi,
                    gerbongId: parseInt(gerbongId, 10),
                },
            });

            return res.status(201).json(newKursi);
        } catch (error) {
            return res.status(500).json({ message: "Error creating kursi", error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
