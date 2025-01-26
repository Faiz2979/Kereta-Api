// create data gerbong

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.method", req.method);
    if (req.method === "POST") {
        try {
            const { noKursi, gerbongId } = req.body;

            if (!noKursi || !gerbongId) {
                return res.status(400).json({ message: "noKursi and gerbongId are required" });
            }

            const newKursi = await prisma.kursi.create({
                data: {
                    noKursi,
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
