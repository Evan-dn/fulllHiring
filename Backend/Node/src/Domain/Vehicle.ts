import { randomUUID } from 'crypto'
import { Location, sameLocation } from './Location'

export type Vehicle = {
  readonly id: string
  readonly plateNumber: string
  readonly location?: Location
}

export const createVehicle = (plateNumber: string): Vehicle => ({ id: randomUUID(), plateNumber })

export const parkAt = (vehicle: Vehicle, location: Location): Vehicle => {
  if (vehicle.location && sameLocation(vehicle.location, location)) {
    throw new Error('Vehicle is already parked at this location')
  }
  return { ...vehicle, location }
}
