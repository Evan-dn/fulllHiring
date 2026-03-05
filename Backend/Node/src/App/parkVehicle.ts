import { hasVehicle } from '../Domain/Fleet'
import { parkAt } from '../Domain/Vehicle'
import { FleetRepository } from '../Domain/FleetRepository'
import { VehicleRepository } from '../Domain/VehicleRepository'

export const parkVehicleHandler =
  (fleetRepo: FleetRepository, vehicleRepo: VehicleRepository) =>
  async (fleetId: string, plateNumber: string, lat: number, lng: number, alt?: number): Promise<void> => {
    const fleet = await fleetRepo.findById(fleetId)
    if (!fleet) throw new Error(`Fleet ${fleetId} not found`)
    if (!hasVehicle(fleet, plateNumber)) throw new Error(`Vehicle ${plateNumber} is not registered in fleet ${fleetId}`)

    const vehicle = await vehicleRepo.findByPlate(plateNumber)
    if (!vehicle) throw new Error(`Vehicle ${plateNumber} not found`)

    await vehicleRepo.save(parkAt(vehicle, { lat, lng, alt }))
  }
