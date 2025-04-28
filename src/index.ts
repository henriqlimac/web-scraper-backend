import Fastify from "fastify";
import dotenv from "dotenv";

import cors from "@fastify/cors";

import { shareRoutes } from "./routes/sharedRoutes"

dotenv.config();

const app = Fastify();

app.register(cors, {
  origin: 'http://localhost:5173',
});

app.register(shareRoutes)

app.listen({ port: Number(process.env.PORT) });
