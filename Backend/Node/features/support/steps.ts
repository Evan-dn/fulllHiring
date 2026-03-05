import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert'
import { FleetWorld } from './world'

Given('my fleet', async function (this: FleetWorld) {
  this.myFleetId = await this.createFleet('user-1')
})

Given('a vehicle', function (this: FleetWorld) {
  this.vehiclePlate = 'AB-123-CD'
})

Given('the fleet of another user', async function (this: FleetWorld) {
  this.otherFleetId = await this.createFleet('user-2')
})

Given('I have registered this vehicle into my fleet', async function (this: FleetWorld) {
  await this.registerVehicle(this.myFleetId, this.vehiclePlate)
})

Given("this vehicle has been registered into the other user's fleet", async function (this: FleetWorld) {
  await this.registerVehicle(this.otherFleetId, this.vehiclePlate)
})

Given('a location', function (this: FleetWorld) {
  this.location = { lat: 48.8566, lng: 2.3522 }
})

Given('my vehicle has been parked into this location', async function (this: FleetWorld) {
  await this.parkVehicle(this.myFleetId, this.vehiclePlate, this.location.lat, this.location.lng, this.location.alt)
})

When('I register this vehicle into my fleet', async function (this: FleetWorld) {
  await this.registerVehicle(this.myFleetId, this.vehiclePlate)
})

When('I try to register this vehicle into my fleet', async function (this: FleetWorld) {
  try {
    await this.registerVehicle(this.myFleetId, this.vehiclePlate)
  } catch (e) {
    this.lastError = e as Error
  }
})

When('I park my vehicle at this location', async function (this: FleetWorld) {
  await this.parkVehicle(this.myFleetId, this.vehiclePlate, this.location.lat, this.location.lng, this.location.alt)
})

When('I try to park my vehicle at this location', async function (this: FleetWorld) {
  try {
    await this.parkVehicle(this.myFleetId, this.vehiclePlate, this.location.lat, this.location.lng, this.location.alt)
  } catch (e) {
    this.lastError = e as Error
  }
})

Then('this vehicle should be part of my vehicle fleet', async function (this: FleetWorld) {
  const fleet = await this.fleetRepo.findById(this.myFleetId)
  assert.ok(fleet?.vehicles.has(this.vehiclePlate), `Vehicle ${this.vehiclePlate} not found in fleet`)
})

Then('I should be informed that this vehicle has already been registered into my fleet', function (this: FleetWorld) {
  assert.ok(this.lastError, 'Expected an error but none was thrown')
})

Then('the known location of my vehicle should verify this location', async function (this: FleetWorld) {
  const vehicle = await this.vehicleRepo.findByPlate(this.vehiclePlate)
  const loc = vehicle?.location
  assert.ok(loc, 'Vehicle has no location')
  assert.strictEqual(loc.lat, this.location.lat)
  assert.strictEqual(loc.lng, this.location.lng)
  assert.strictEqual(loc.alt, this.location.alt)
})

Then('I should be informed that my vehicle is already parked at this location', function (this: FleetWorld) {
  assert.ok(this.lastError, 'Expected an error but none was thrown')
})
