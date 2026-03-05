import { createFleet } from '../Domain/Fleet'
import { FleetRepository } from '../Domain/FleetRepository'

export const createFleetHandler =
  (repo: FleetRepository) =>
  async (userId: string): Promise<string> => {
    const fleet = createFleet(userId)
    await repo.save(fleet)
    return fleet.id
  }
