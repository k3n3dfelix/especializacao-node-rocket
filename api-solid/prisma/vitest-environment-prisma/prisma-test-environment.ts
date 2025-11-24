import { execSync } from "node:child_process";
import { randomUUID } from "crypto";
import "dotenv/config";
import { Environment } from "vitest/environments";
import { prisma } from "@/lib/prisma";

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL env variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);
  return url.toString();
}

export default <Environment>{
  name: "prisma-test-environment",
  transformMode: "ssr",
  async setup() {
    // Cria o banco de teste
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma db push')

    return {
      async teardown() {
        // Apaga o banco de teste
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);

        await prisma.$disconnect();
      },
    };
  },
};
