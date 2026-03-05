import { Vehicle } from './Vehicle'

export type VehicleRepository = {
  save: (vehicle: Vehicle) => Promise<void>
  findByPlate: (plateNumber: string) => Promise<Vehicle | undefined>
}
