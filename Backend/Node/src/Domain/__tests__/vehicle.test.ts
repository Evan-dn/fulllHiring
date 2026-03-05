import { createVehicle, parkAt } from '../Vehicle'

describe('Vehicle', () => {
  it('creates a vehicle with no location', () => {
    const v = createVehicle('AB-123-CD')
    expect(v.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(v.plateNumber).toBe('AB-123-CD')
    expect(v.location).toBeUndefined()
  })

  it('parks a vehicle and returns a new vehicle', () => {
    const parked = parkAt(createVehicle('AB-123-CD'), { lat: 48.8566, lng: 2.3522 })
    expect(parked.location).toEqual({ lat: 48.8566, lng: 2.3522, alt: undefined })
  })

  it('does not mutate the original vehicle', () => {
    const v = createVehicle('AB-123-CD')
    parkAt(v, { lat: 48.8566, lng: 2.3522 })
    expect(v.location).toBeUndefined()
  })

  it('throws if already parked at the same location', () => {
    const v = parkAt(createVehicle('AB-123-CD'), { lat: 48.8566, lng: 2.3522 })
    expect(() => parkAt(v, { lat: 48.8566, lng: 2.3522 })).toThrow('already parked at this location')
  })

  it('allows moving to a different location', () => {
    const v = parkAt(createVehicle('AB-123-CD'), { lat: 48.8566, lng: 2.3522 })
    const moved = parkAt(v, { lat: 51.5074, lng: -0.1278 })
    expect(moved.location).toEqual({ lat: 51.5074, lng: -0.1278, alt: undefined })
  })
})
