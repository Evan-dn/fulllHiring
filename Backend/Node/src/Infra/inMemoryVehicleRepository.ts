import { Vehicle } from '../Domain/Vehicle'
import { VehicleRepository } from '../Domain/VehicleRepository'

export const inMemoryVehicleRepository = (): VehicleRepository => {
  const store = new Map<string, Vehicle>()
  return {
    save: async (vehicle) => { store.set(vehicle.plateNumber, vehicle) },
    findByPlate: async (plateNumber) => store.get(plateNumber)
  }
}
