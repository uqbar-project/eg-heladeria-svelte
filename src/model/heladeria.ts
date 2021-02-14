import type { Duenio } from './duenio'

export type Heladeria = {
  id: number
  nombre: string
  tipoHeladeria: TipoHeladeria
  duenio: Duenio
}

export const tiposHeladeria = ['ECONOMICA', 'ARTESANAL', 'INDUSTRIAL'] as const

type TipoHeladeria = typeof tiposHeladeria[number]

export type Gusto = {
  nombre: string
  dificultad: number
}
