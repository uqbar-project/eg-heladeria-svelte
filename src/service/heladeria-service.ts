import type { Duenio } from '../model/duenio'
import type { Gustos, Heladeria } from '../model/heladeria'
import { BACKEND_URL } from './constants'

async function httpRequest<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request)
  const responseJson = await response.json()

  if (!response.ok) {
    throw responseJson
  }

  return responseJson
}

async function customRequest<T>(route: string, body: Partial<T>, method = 'POST') {
  return httpRequest<T>(
    new Request(`${BACKEND_URL}${route}`, {
      method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

async function buscarHeladerias(nombre: string): Promise<Heladeria[]> {
  const params = new URLSearchParams({
    nombre,
  })
  return httpRequest<Heladeria[]>(`${BACKEND_URL}/heladerias/buscar?${params}`)
}

async function fetchById(heladeriaId: number): Promise<Heladeria> {
  return httpRequest<Heladeria>(`${BACKEND_URL}/heladerias/id/${heladeriaId}`)
}

async function fetchDuenios(): Promise<Duenio[]> {
  return httpRequest<Duenio[]>(`${BACKEND_URL}/duenios`)
}

async function crearDuenio(nombreCompleto: string): Promise<Duenio> {
  return customRequest<Duenio>('/duenios', { nombreCompleto })
}

async function deleteGustos(heladeriaId: number, gusto: Gustos): Promise<Heladeria> {
  return customRequest<Heladeria>(`/heladerias/${heladeriaId}/gustos`, gusto, 'DELETE')
}

async function agregarGustos(heladeriaId: number, gusto: Gustos): Promise<Heladeria> {
  return customRequest<Heladeria>(`/heladerias/${heladeriaId}/gustos`, gusto)
}

async function actualizar(heladeria: Heladeria): Promise<Heladeria> {
  return customRequest<Heladeria>(`/heladerias/${heladeria.id}`, heladeria, 'PATCH')
}

export default { buscarHeladerias, fetchById, fetchDuenios, crearDuenio, deleteGustos, agregarGustos, actualizar }
