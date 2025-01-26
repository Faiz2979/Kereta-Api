
// delete kereta by id

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    // console.log("req.method", req.method);
    if (req.method === "DELETE") {
        try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const kursi = await prisma.kursi.delete({
            where: {
                id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10),
            },
        });

        return res.status(201).json({ kursi });
        } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "An unknown error occurred" });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}