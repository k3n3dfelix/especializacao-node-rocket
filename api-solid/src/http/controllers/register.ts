import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { RegisterUseCase } from "../../use-cases/register";
import { UserAlreadyExistsError } from "../../use-cases/errors/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const result = registerBodySchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send(result.error);
  }

  const { email, name, password } = result.data;

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    await registerUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;

  }

  return reply.status(201).send();
}
