import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.method", req.method);
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const kereta = await prisma.kereta.findUnique({
                where: { id: Number(id) },
            });

            if (!kereta) {
                return res.status(404).json({ message: "Kereta not found" });
            }

            return res.status(200).json({ kereta });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "An unknown error occurred" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}