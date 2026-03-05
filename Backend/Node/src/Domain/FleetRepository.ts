import { Fleet } from './Fleet'

export type FleetRepository = {
  save: (fleet: Fleet) => Promise<void>
  findById: (id: string) => Promise<Fleet | undefined>
}
