import { createFleetHandler } from '../createFleet'
import { inMemoryFleetRepository } from '../../Infra/inMemoryFleetRepository'

describe('createFleetHandler', () => {
  it('returns a fleet id', async () => {
    const repo = inMemoryFleetRepository()
    const fleetId = await createFleetHandler(repo)('user-1')
    expect(fleetId).toBeTruthy()
  })

  it('persists the fleet', async () => {
    const repo = inMemoryFleetRepository()
    const fleetId = await createFleetHandler(repo)('user-1')
    expect((await repo.findById(fleetId))?.userId).toBe('user-1')
  })

  it('creates distinct fleets for the same user', async () => {
    const repo = inMemoryFleetRepository()
    const create = createFleetHandler(repo)
    const [id1, id2] = await Promise.all([create('user-1'), create('user-1')])
    expect(id1).not.toBe(id2)
  })
})
