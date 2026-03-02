export function fizzbuzz(n: number): string[] {
  if (n < 1) throw new Error('n must be positive integer')

  return Array.from({ length: n }, (_, i) => {
    const num = i + 1
    if (num % 15 === 0) return 'FizzBuzz'
    if (num % 3 === 0) return 'Fizz'
    if (num % 5 === 0) return 'Buzz'

    return String(num)
  })
}
