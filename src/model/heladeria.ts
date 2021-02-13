import type { Duenio } from './duenio'

export type Heladeria = {
  id: number
  nombre: string
  tipoHeladeria: TipoHeladeria
  duenio: Duenio
}

export type TipoHeladeria = 'ECONOMICA' | 'ARTESANAL' | 'INDUSTRIAL'

export type Gusto = {
  dificultad: number
}
