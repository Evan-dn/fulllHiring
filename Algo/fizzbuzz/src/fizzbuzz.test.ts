import { fizzbuzz } from './fizzbuzz'

describe('fizzbuzz', () => {
  it('should return the correct sequence for n=15', () => {
    expect(fizzbuzz(15)).toEqual([
      '1', '2', 'Fizz', '4', 'Buzz',
      'Fizz', '7', '8', 'Fizz', 'Buzz',
      '11', 'Fizz', '13', '14', 'FizzBuzz',
    ])
  })

  it('should throw an error if n is not a positive integer', () => {
    expect(() => fizzbuzz(0)).toThrow('n must be positive integer')
    expect(() => fizzbuzz(-5)).toThrow('n must be positive integer')
  })
})
