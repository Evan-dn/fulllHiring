import { createFleetHandler } from '../createFleet'
import { registerVehicleHandler } from '../registerVehicle'
import { parkVehicleHandler } from '../parkVehicle'
import { inMemoryFleetRepository } from '../../Infra/inMemoryFleetRepository'
import { inMemoryVehicleRepository } from '../../Infra/inMemoryVehicleRepository'

const setup = async () => {
  const fleetRepo = inMemoryFleetRepository()
  const vehicleRepo = inMemoryVehicleRepository()
  const fleetId = await createFleetHandler(fleetRepo)('user-1')
  await registerVehicleHandler(fleetRepo, vehicleRepo)(fleetId, 'AB-123-CD')
  const parkVehicle = parkVehicleHandler(fleetRepo, vehicleRepo)
  return { vehicleRepo, fleetId, parkVehicle }
}

describe('parkVehicleHandler', () => {
  it('parks a vehicle at a location', async () => {
    const { vehicleRepo, fleetId, parkVehicle } = await setup()
    await parkVehicle(fleetId, 'AB-123-CD', 48.8566, 2.3522)
    expect((await vehicleRepo.findByPlate('AB-123-CD'))?.location).toEqual({
      lat: 48.8566,
      lng: 2.3522,
      alt: undefined,
    })
  })

  it('updates the location when moved', async () => {
    const { vehicleRepo, fleetId, parkVehicle } = await setup()
    await parkVehicle(fleetId, 'AB-123-CD', 48.8566, 2.3522)
    await parkVehicle(fleetId, 'AB-123-CD', 51.5074, -0.1278)
    expect((await vehicleRepo.findByPlate('AB-123-CD'))?.location?.lat).toBe(51.5074)
  })

  it('throws if fleet does not exist', async () => {
    const { parkVehicle } = await setup()
    await expect(parkVehicle('unknown', 'AB-123-CD', 48.8566, 2.3522)).rejects.toThrow('Fleet unknown not found')
  })

  it('throws if vehicle is not registered in the fleet', async () => {
    const { fleetId, parkVehicle } = await setup()
    await expect(parkVehicle(fleetId, 'XX-999-ZZ', 48.8566, 2.3522)).rejects.toThrow('not registered in fleet')
  })

  it('throws if already parked at the same location', async () => {
    const { fleetId, parkVehicle } = await setup()
    await parkVehicle(fleetId, 'AB-123-CD', 48.8566, 2.3522)
    await expect(parkVehicle(fleetId, 'AB-123-CD', 48.8566, 2.3522)).rejects.toThrow('already parked at this location')
  })
})
