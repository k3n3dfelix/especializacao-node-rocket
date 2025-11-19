import { UsersRepository } from "../repositories/users.repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return { user };
  }
}
