
import { FastifyRequest, FastifyReply }  from 'fastify';
import { prisma } from './lib/prisma';
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    password_hash: z.string().min(6),
  });

  const result = registerBodySchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send(result.error);
  }

  const { email, name, password, password_hash } = result.data;

  await prisma.user.create({
    data: {
      name,
      email,
      password,
      password_hash,
    },
  });

  return reply.status(201).send();
}