import { addVehicle } from '../Domain/Fleet'
import { createVehicle } from '../Domain/Vehicle'
import { FleetRepository } from '../Domain/FleetRepository'
import { VehicleRepository } from '../Domain/VehicleRepository'

type WithTransaction = <T>(
  fn: (fleetRepo: FleetRepository, vehicleRepo: VehicleRepository) => Promise<T>
) => Promise<T>

export const registerVehicleHandler =
  (fleetRepo: FleetRepository, vehicleRepo: VehicleRepository, withTransaction?: WithTransaction) =>
  async (fleetId: string, plateNumber: string): Promise<void> => {
    const run = async (fr: FleetRepository, vr: VehicleRepository) => {
      const fleet = await fr.findById(fleetId)
      if (!fleet) throw new Error(`Fleet ${fleetId} not found`)

      await fr.save(addVehicle(fleet, plateNumber))

      if (!await vr.findByPlate(plateNumber)) {
        await vr.save(createVehicle(plateNumber))
      }
    }

    await (withTransaction ? withTransaction(run) : run(fleetRepo, vehicleRepo))
  }
