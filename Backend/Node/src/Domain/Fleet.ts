import { randomUUID } from 'crypto'

export type Fleet = {
  readonly id: string
  readonly userId: string
  readonly vehicles: ReadonlySet<string>
}

export const createFleet = (userId: string): Fleet => ({
  id: randomUUID(),
  userId,
  vehicles: new Set()
})

export const addVehicle = (fleet: Fleet, plateNumber: string): Fleet => {
  if (fleet.vehicles.has(plateNumber)) {
    throw new Error(`Vehicle ${plateNumber} is already registered in this fleet`)
  }
  return { ...fleet, vehicles: new Set([...fleet.vehicles, plateNumber]) }
}

export const hasVehicle = (fleet: Fleet, plateNumber: string): boolean =>
  fleet.vehicles.has(plateNumber)
