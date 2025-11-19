import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymUseCaseRequest {
  userLatitude: string;
  userLongitude: string;
}

interface FetchNearbyGymUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymUseCaseRequest): Promise<FetchNearbyGymUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: Number(userLatitude),
      longitude: Number(userLongitude),
    });
    return { gyms };
  }
}
