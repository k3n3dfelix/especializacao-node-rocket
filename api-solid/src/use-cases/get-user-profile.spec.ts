import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersrepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersrepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersrepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user Profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      password_hash: await hash("securepassword", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to authenticate with wrong password", async () => {
    expect(() =>
      sut.execute({ userId: "non-existing-user-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
