import postgres from 'postgres'
import { FleetRepository } from '../Domain/FleetRepository'
import { VehicleRepository } from '../Domain/VehicleRepository'
import { postgresFleetRepository } from './postgresFleetRepository'
import { postgresVehicleRepository } from './postgresVehicleRepository'

export const makeWithTransaction =
  (sql: postgres.Sql) =>
  <T>(fn: (fleetRepo: FleetRepository, vehicleRepo: VehicleRepository) => Promise<T>): Promise<T> =>
    sql.begin(tx => fn(
      postgresFleetRepository(tx as unknown as postgres.Sql),
      postgresVehicleRepository(tx as unknown as postgres.Sql),
    )) as Promise<T>
