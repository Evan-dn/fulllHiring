import postgres from 'postgres'

export const initSchema = async (sql: postgres.Sql): Promise<void> => {
  await sql`
    CREATE TABLE IF NOT EXISTS fleets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS fleet_vehicles (
      fleet_id TEXT NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
      plate_number TEXT NOT NULL,
      PRIMARY KEY (fleet_id, plate_number)
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      plate_number TEXT NOT NULL UNIQUE,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      alt DOUBLE PRECISION
    )
  `
}
