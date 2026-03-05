import { Fleet } from '../Domain/Fleet'
import { FleetRepository } from '../Domain/FleetRepository'

export const inMemoryFleetRepository = (): FleetRepository => {
  const store = new Map<string, Fleet>()
  return {
    save: async (fleet) => { store.set(fleet.id, fleet) },
    findById: async (id) => store.get(id)
  }
}
