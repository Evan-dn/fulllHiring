import 'dotenv/config'
import { World, IWorldOptions, setWorldConstructor, BeforeAll, AfterAll, Before } from '@cucumber/cucumber'
import postgres from 'postgres'
import { FleetRepository } from '../../src/Domain/FleetRepository'
import { VehicleRepository } from '../../src/Domain/VehicleRepository'
import { inMemoryFleetRepository } from '../../src/Infra/inMemoryFleetRepository'
import { inMemoryVehicleRepository } from '../../src/Infra/inMemoryVehicleRepository'
import { postgresFleetRepository } from '../../src/Infra/postgresFleetRepository'
import { postgresVehicleRepository } from '../../src/Infra/postgresVehicleRepository'
import { makeWithTransaction } from '../../src/Infra/postgresTransaction'
import { initSchema } from '../../src/Infra/schema'
import { createFleetHandler } from '../../src/App/createFleet'
import { registerVehicleHandler } from '../../src/App/registerVehicle'
import { parkVehicleHandler } from '../../src/App/parkVehicle'
import { Location } from '../../src/Domain/Location'

let sharedSql: postgres.Sql | undefined

BeforeAll(async () => {
  if (!process.env.USE_DB) return
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) throw new Error('DATABASE_URL is required for the sql profile')
  sharedSql = postgres(dbUrl)
  await initSchema(sharedSql)
})

Before({ tags: '@critical' }, async () => {
  if (!sharedSql) return
  await sharedSql`TRUNCATE fleet_vehicles, fleets, vehicles CASCADE`
})

AfterAll(async () => {
  await sharedSql?.end()
})

const buildContext = (useDb: boolean) => {
  if (useDb) {
    if (!sharedSql) throw new Error('DATABASE_URL is required for the sql profile')
    const fleetRepo = postgresFleetRepository(sharedSql)
    const vehicleRepo = postgresVehicleRepository(sharedSql)
    return { fleetRepo, vehicleRepo, withTransaction: makeWithTransaction(sharedSql) }
  }
  return {
    fleetRepo: inMemoryFleetRepository(),
    vehicleRepo: inMemoryVehicleRepository(),
    withTransaction: undefined,
  }
}

export class FleetWorld extends World {
  readonly fleetRepo: FleetRepository
  readonly vehicleRepo: VehicleRepository

  myFleetId!: string
  otherFleetId!: string
  vehiclePlate!: string
  location!: Location
  lastError?: Error

  readonly createFleet: (userId: string) => Promise<string>
  readonly registerVehicle: (fleetId: string, plateNumber: string) => Promise<void>
  readonly parkVehicle: (fleetId: string, plateNumber: string, lat: number, lng: number, alt?: number) => Promise<void>

  constructor(options: IWorldOptions) {
    super(options);
    const { fleetRepo, vehicleRepo, withTransaction } = buildContext(options.parameters?.useDb === true)
    this.fleetRepo = fleetRepo
    this.vehicleRepo = vehicleRepo
    this.createFleet = createFleetHandler(this.fleetRepo)
    this.registerVehicle = registerVehicleHandler(this.fleetRepo, this.vehicleRepo, withTransaction)
    this.parkVehicle = parkVehicleHandler(this.fleetRepo, this.vehicleRepo)
  }
}

setWorldConstructor(FleetWorld)
