export type Location = {
  lat: number
  lng: number
  alt?: number
}

export const sameLocation = (a: Location, b: Location): boolean =>
  a.lat === b.lat && a.lng === b.lng && a.alt === b.alt
