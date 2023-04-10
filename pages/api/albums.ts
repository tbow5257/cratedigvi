import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, whippo_album } from "@prisma/client";

const prisma = new PrismaClient();

interface PaginationMetadata {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

interface PaginatedResponse<T> {
  metadata: PaginationMetadata;
  content: T;
}

export type AlbumsResponse = PaginatedResponse<whippo_album[]>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaginatedResponse<whippo_album[]> | { message: string }>
) {
  try {
    const { page = 1, size = 20 } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedSize = parseInt(size as string, 10);

    if (page && parseInt(page as string, 10) <= 0) {
      return res.status(400).json({
        message: "Invalid page parameter. Only positive numbers are allowed.",
      });
    }

    if (![20, 50].includes(parsedSize)) {
      return res.status(400).json({
        message: "Invalid size parameter. Only 20 or 50 are allowed.",
      });
    }

    const [total, albums] = await Promise.all([
      prisma.whippo_album.count(),
      prisma.whippo_album.findMany({
        skip: (parsedPage - 1) * parsedSize,
        take: parsedSize,
      }),
    ]);

    const totalPages = Math.ceil(total / parsedSize);
    const hasNextPage = parsedPage < totalPages;

    const metadata: PaginationMetadata = {
      page: parsedPage,
      perPage: parsedSize,
      total,
      totalPages,
      hasNextPage,
    };

    const response: PaginatedResponse<whippo_album[]> = {
      metadata,
      content: albums,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
