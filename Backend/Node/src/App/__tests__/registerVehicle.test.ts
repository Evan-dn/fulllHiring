import { createFleetHandler } from '../createFleet'
import { registerVehicleHandler } from '../registerVehicle'
import { inMemoryFleetRepository } from '../../Infra/inMemoryFleetRepository'
import { inMemoryVehicleRepository } from '../../Infra/inMemoryVehicleRepository'

const setup = () => {
  const fleetRepo = inMemoryFleetRepository()
  const vehicleRepo = inMemoryVehicleRepository()
  const createFleet = createFleetHandler(fleetRepo)
  const registerVehicle = registerVehicleHandler(fleetRepo, vehicleRepo)
  return { fleetRepo, vehicleRepo, createFleet, registerVehicle }
}

describe('registerVehicleHandler', () => {
  it('registers a vehicle into the fleet', async () => {
    const { fleetRepo, createFleet, registerVehicle } = setup()
    const fleetId = await createFleet('user-1')
    await registerVehicle(fleetId, 'AB-123-CD')
    expect((await fleetRepo.findById(fleetId))?.vehicles.has('AB-123-CD')).toBe(true)
  })

  it('creates the vehicle entity', async () => {
    const { vehicleRepo, createFleet, registerVehicle } = setup()
    const fleetId = await createFleet('user-1')
    await registerVehicle(fleetId, 'AB-123-CD')
    expect(await vehicleRepo.findByPlate('AB-123-CD')).toBeDefined()
  })

  it('throws if fleet does not exist', async () => {
    const { registerVehicle } = setup()
    await expect(registerVehicle('unknown-fleet', 'AB-123-CD')).rejects.toThrow('Fleet unknown-fleet not found')
  })

  it('throws if vehicle is already registered in the fleet', async () => {
    const { createFleet, registerVehicle } = setup()
    const fleetId = await createFleet('user-1')
    await registerVehicle(fleetId, 'AB-123-CD')
    await expect(registerVehicle(fleetId, 'AB-123-CD')).rejects.toThrow('already registered in this fleet')
  })

  it('allows the same vehicle in different fleets', async () => {
    const { fleetRepo, createFleet, registerVehicle } = setup()
    const [fleet1, fleet2] = await Promise.all([createFleet('user-1'), createFleet('user-2')])
    await registerVehicle(fleet1, 'AB-123-CD')
    await registerVehicle(fleet2, 'AB-123-CD')
    expect((await fleetRepo.findById(fleet1))?.vehicles.has('AB-123-CD')).toBe(true)
    expect((await fleetRepo.findById(fleet2))?.vehicles.has('AB-123-CD')).toBe(true)
  })

})
