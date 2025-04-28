import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

import { scrapeAndSave } from "../services/scraper";
const prisma = new PrismaClient();

export async function shareRoutes(share: FastifyInstance) {
  share.get("/share", async (request, reply) => {
    try {
      const { url } = request.query as { url: string };
  
      const result = await scrapeAndSave(url);
  
      const shareableLink = await prisma.share.create({
        data: {
          name: result.title,
          price: result.price,
          rating: result.rating,
          image: result.image,
          url: result.url,
        }
      })
  
      reply.send({ shareableLink })
    } catch (error) {
      throw new Error("Failed to scrape: " + error)
    }
  });

  share.get("/shared/all", async (request, reply) => {
    try {
      const data = await prisma.share.findMany();
  
      reply.send(data)
    } catch (error) {
      throw new Error("Failed to get shared links: " + error)
    }
  });
  
  share.get("/shared/:id", async (request, reply) => {
    try {
      const { id }: any = request.params

      const data = await prisma.share.findUnique({
        where: {
          id,
        },
      })
      
      reply.send(data);
    } catch (error) {
      throw new Error("Failed to get shared by ID: " + error)
    }
  })

  share.delete("/shared/:id", async (request, reply) => {
    try {
      const { id }: any = request.params

      await prisma.share.delete({
        where: {
          id,
        },
      })
      
      reply.send("Deleted content with ID: " + id);
    } catch (error) {
      throw new Error("Failed to get shared by ID: " + error)
    }
  })

  // [------------------------------------------------------------------]
  // [CAUTION] - ONLY FOR DEVELOPMENT TESTING - DO NOT SEND TO PRODUCTION
  // WITHOUT DELETING '/shared/deleteAll'
  // [------------------------------------------------------------------]
  share.delete("/shared/deleteAll", async (request, reply) => {
    try{
      await prisma.share.deleteMany()

      reply.send("Deleted every content inside share");
    } catch (error) {
      throw new Error("Failed to delete all: " + error)
    }
  })
}
