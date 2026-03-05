import { createFleet, addVehicle, hasVehicle } from '../Fleet'

describe('Fleet', () => {
  it('creates a fleet with a unique id and no vehicles', () => {
    const a = createFleet('user-1')
    const b = createFleet('user-1')
    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
    expect(a.userId).toBe('user-1')
    expect(a.vehicles.size).toBe(0)
  })

  it('adds a vehicle and returns a new fleet', () => {
    const fleet = createFleet('user-1')
    const updated = addVehicle(fleet, 'AB-123-CD')
    expect(hasVehicle(updated, 'AB-123-CD')).toBe(true)
  })

  it('does not mutate the original fleet', () => {
    const fleet = createFleet('user-1')
    addVehicle(fleet, 'AB-123-CD')
    expect(hasVehicle(fleet, 'AB-123-CD')).toBe(false)
  })

  it('throws if vehicle is already registered in the fleet', () => {
    const fleet = addVehicle(createFleet('user-1'), 'AB-123-CD')
    expect(() => addVehicle(fleet, 'AB-123-CD')).toThrow('already registered in this fleet')
  })
})
