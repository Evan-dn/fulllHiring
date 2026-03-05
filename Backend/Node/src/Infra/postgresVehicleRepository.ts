import postgres from 'postgres'
import { Vehicle } from '../Domain/Vehicle'
import { Location } from '../Domain/Location'
import { VehicleRepository } from '../Domain/VehicleRepository'

type VehicleRow = { id: string; plate_number: string; lat: number | null; lng: number | null; alt: number | null }

const toLocation = (row: VehicleRow): Location | undefined =>
  row.lat !== null && row.lng !== null
    ? { lat: row.lat, lng: row.lng, alt: row.alt ?? undefined }
    : undefined

const toVehicle = (row: VehicleRow): Vehicle => ({
  id: row.id,
  plateNumber: row.plate_number,
  location: toLocation(row),
})

export const postgresVehicleRepository = (sql: postgres.Sql): VehicleRepository => ({
  save: async (vehicle: Vehicle): Promise<void> => {
    const { id, plateNumber, location: loc } = vehicle
    await sql`
      INSERT INTO vehicles (id, plate_number, lat, lng, alt)
      VALUES (${id}, ${plateNumber}, ${loc?.lat ?? null}, ${loc?.lng ?? null}, ${loc?.alt ?? null})
      ON CONFLICT (id) DO UPDATE
        SET lat = ${loc?.lat ?? null}, lng = ${loc?.lng ?? null}, alt = ${loc?.alt ?? null}
    `
  },

  findByPlate: async (plateNumber: string): Promise<Vehicle | undefined> => {
    const [row] = await sql<VehicleRow[]>`SELECT id, plate_number, lat, lng, alt FROM vehicles WHERE plate_number = ${plateNumber}`
    return row ? toVehicle(row) : undefined
  }
})
