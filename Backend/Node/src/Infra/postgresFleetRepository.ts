import postgres from 'postgres'
import { Fleet } from '../Domain/Fleet'
import { FleetRepository } from '../Domain/FleetRepository'

type FleetRow = { id: string; user_id: string }
type PlateRow = { plate_number: string }

const toFleet = (row: FleetRow, plates: PlateRow[]): Fleet => ({
  id: row.id,
  userId: row.user_id,
  vehicles: new Set(plates.map((r) => r.plate_number))
})

export const postgresFleetRepository = (sql: postgres.Sql): FleetRepository => ({
  save: async (fleet: Fleet): Promise<void> => {
    await sql`
      INSERT INTO fleets (id, user_id) VALUES (${fleet.id}, ${fleet.userId})
      ON CONFLICT (id) DO UPDATE SET user_id = ${fleet.userId}
    `
    await sql`DELETE FROM fleet_vehicles WHERE fleet_id = ${fleet.id}`
    if (fleet.vehicles.size > 0) {
      const rows = [...fleet.vehicles].map(plate => ({ fleet_id: fleet.id, plate_number: plate }))
      await sql`INSERT INTO fleet_vehicles ${sql(rows)}`
    }
  },

  findById: async (id: string): Promise<Fleet | undefined> => {
    const [row] = await sql<FleetRow[]>`SELECT id, user_id FROM fleets WHERE id = ${id}`
    if (!row) return undefined
    const plates = await sql<PlateRow[]>`SELECT plate_number FROM fleet_vehicles WHERE fleet_id = ${id}`
    return toFleet(row, plates)
  }
})
