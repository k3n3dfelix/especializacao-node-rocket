import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersrepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { InMemoryGymsrepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsrepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsrepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it.only("should be able to create gym", async () => {
    const { gym } = await sut.execute({
        title: "JavaScript Gym",
        description: "Gym for JavaScript lovers",
        phone: "1234567890",
        latitude: -27.2092052,
        longitude: -49.6401091,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
