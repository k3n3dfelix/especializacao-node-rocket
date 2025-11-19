import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsrepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsrepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "./checkin";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-checkins-error";
import { MaxdistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsrepository;
let gymsRepository: InMemoryGymsrepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsrepository();
    gymsRepository = new InMemoryGymsrepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-1",
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not be able to check in", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.64011091,
    });
    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.64011091,
    });
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));
    await expect(
      sut.execute({
        userId: "user-1",
        gymId: "gym-1",
        userLatitude: -27.2092052,
        userLongitude: -49.64011091,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 24, 8, 0, 0));

    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.64011091,
    });

    vi.setSystemTime(new Date(2023, 0, 25, 8, 0, 0));
    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.64011091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-2",
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    });

    expect(() =>
      sut.execute({
        userId: "user-1",
        gymId: "gym-2",
        userLatitude: -27.2092052,
        userLongitude: -49.64011091,
      })
    ).rejects.toBeInstanceOf(MaxdistanceError);
  });
});
