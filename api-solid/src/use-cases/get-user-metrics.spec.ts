import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsrepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-chek-ins-history";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsrepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsrepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should  be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    await checkInsRepository.create({
      gym_id: "gym-2",
      user_id: "user-1",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    });

    expect(checkInsCount).toEqual(2);
  });
});
