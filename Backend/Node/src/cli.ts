import 'dotenv/config'
import postgres from 'postgres'
import { createFleetHandler } from './App/createFleet'
import { registerVehicleHandler } from './App/registerVehicle'
import { parkVehicleHandler } from './App/parkVehicle'
import { postgresFleetRepository } from './Infra/postgresFleetRepository'
import { postgresVehicleRepository } from './Infra/postgresVehicleRepository'
import { makeWithTransaction } from './Infra/postgresTransaction'
import { initSchema } from './Infra/schema'

const usage = `Usage:
  fleet create <userId>
  fleet register-vehicle <fleetId> <vehiclePlateNumber>
  fleet localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]`

class UsageError extends Error {}

const fail = (msg: string): never => { throw new UsageError(msg) }

const parseCoord = (value: string, name: string): number => {
  const n = parseFloat(value)
  if (isNaN(n)) fail(`${name} must be a valid number, got "${value}"`)
  return n
}

type Command =
  | { type: 'create'; userId: string }
  | { type: 'register-vehicle'; fleetId: string; plateNumber: string }
  | { type: 'localize-vehicle'; fleetId: string; plateNumber: string; lat: string; lng: string; alt?: string }

const parseCommand = (): Command => {
  const [, , command, ...args] = process.argv
  switch (command) {
    case 'create': {
      const [userId] = args
      if (!userId) fail('missing <userId>')
      return { type: 'create', userId }
    }
    case 'register-vehicle': {
      const [fleetId, plateNumber] = args
      if (!fleetId || !plateNumber) fail('missing <fleetId> or <vehiclePlateNumber>')
      return { type: 'register-vehicle', fleetId, plateNumber }
    }
    case 'localize-vehicle': {
      const [fleetId, plateNumber, lat, lng, alt] = args
      if (!fleetId || !plateNumber || !lat || !lng) fail('missing required arguments')
      return { type: 'localize-vehicle', fleetId, plateNumber, lat, lng, alt }
    }
    default:
      return fail(`unknown command "${command}"`)
  }
}

const main = async () => {
  const cmd = parseCommand()

  const dbUrl = process.env.DATABASE_URL ?? fail('DATABASE_URL is not set. Copy .env.example to .env and fill in your credentials.')

  const sql = postgres(dbUrl)
  try {
    await initSchema(sql)
    const fleetRepo = postgresFleetRepository(sql)
    const vehicleRepo = postgresVehicleRepository(sql)
    const createFleet = createFleetHandler(fleetRepo)
    const registerVehicle = registerVehicleHandler(fleetRepo, vehicleRepo, makeWithTransaction(sql))
    const parkVehicle = parkVehicleHandler(fleetRepo, vehicleRepo)

    switch (cmd.type) {
      case 'create': {
        const id = await createFleet(cmd.userId)
        console.log(id)
        break
      }
      case 'register-vehicle': {
        await registerVehicle(cmd.fleetId, cmd.plateNumber)
        console.log(`Vehicle ${cmd.plateNumber} registered in fleet ${cmd.fleetId}`)
        break
      }
      case 'localize-vehicle': {
        const { fleetId, plateNumber, lat, lng, alt } = cmd
        await parkVehicle(fleetId, plateNumber, parseCoord(lat, 'lat'), parseCoord(lng, 'lng'), alt ? parseCoord(alt, 'alt') : undefined)
        console.log(`Vehicle ${plateNumber} parked at (${lat}, ${lng}${alt ? `, ${alt}` : ''})`)
        break
      }
    }
  } finally {
    await sql.end()
  }
}

main().catch((e) => {
  if (e instanceof UsageError) {
    console.error(`Error: ${e.message}\n\n${usage}`)
  } else {
    console.error(`Error: ${e instanceof Error ? e.message : String(e)}`)
  }
  process.exit(1)
})
