import type { Heladeria } from '../model/heladeria'
import { BACKEND_URL } from './constants'
import type { Duenio } from '../model/duenio'
import type { GustoObject } from '../model/heladeria'

async function httpRequest<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request)

  if (!response.ok) {
    const errorMessage = await response.text()
    throw `Ocurrió un error - ${response.status}: ${errorMessage}`
  }

  return response.json()
}

async function customRequest<T>(route: string, body: Object, method: string = 'POST') {
  return httpRequest<T>(
    new Request(`${BACKEND_URL}${route}`, {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

async function buscarHeladerias(nombreBuscar: string) {
  return httpRequest<Heladeria[]>(`${BACKEND_URL}/heladerias/buscar/${nombreBuscar}`)
}

async function fetchById(heladeriaId: number) {
  return httpRequest<Heladeria>(`${BACKEND_URL}/heladerias/id/${heladeriaId}`)
}

async function fetchDuenios() {
  return httpRequest<Duenio[]>(`${BACKEND_URL}/duenios/`)
}

async function crearDuenio(nombreCompleto: string) {
  return customRequest<Duenio>('/duenios/crear', { nombreCompleto })
}

async function deleteGustos(heladeriaId: number, gusto: GustoObject) {
  return customRequest<Heladeria>(`/heladerias/${heladeriaId}/eliminarGustos`, { [gusto.nombre]: null }, 'DELETE')
}

export default { buscarHeladerias, fetchById, fetchDuenios, crearDuenio, deleteGustos }
