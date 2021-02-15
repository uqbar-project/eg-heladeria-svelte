import type { Duenio } from './duenio'

export type Heladeria = {
  id: number
  nombre: string
  tipoHeladeria: TipoHeladeria
  gustos: Gustos
  duenio: Duenio
}

export const tiposHeladeria = ['ECONOMICA', 'ARTESANAL', 'INDUSTRIAL'] as const

type TipoHeladeria = typeof tiposHeladeria[number]

export type Gustos = { [nombre: string]: number }
