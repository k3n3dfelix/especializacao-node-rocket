import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersrepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {

     it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersrepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
    });

    expect(user.id).toEqual(expect.any(String));
   
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersrepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
    });

    const isPasswordCorrectlyHashed = await compare(
      "securepassword",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
    console.log("user.password_hash", user.password_hash);
  });

  it("should not be able to register with an existing email", async () => {
    const usersRepository = new InMemoryUsersrepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "jhondoe@example.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "securepassword",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email,
        password: "securepassword",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
