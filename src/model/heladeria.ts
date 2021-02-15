import type { Duenio } from './duenio'

export type Heladeria = {
  id: number
  nombre: string
  tipoHeladeria: TipoHeladeria
  gustos: Gusto
  duenio: Duenio
}

export const tiposHeladeria = ['ECONOMICA', 'ARTESANAL', 'INDUSTRIAL'] as const

type TipoHeladeria = typeof tiposHeladeria[number]

export type Gusto = Map<string, number>

export type GustoObject = {
  nombre: string
  dificultad: number
}
