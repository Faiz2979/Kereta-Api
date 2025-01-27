import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const jadwal = await prisma.jadwal.findMany();
        return res.status(200).json(jadwal);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching jadwal", error });
    }
}
