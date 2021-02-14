import type { Heladeria } from '../model/heladeria'
import { BACKEND_URL } from './constants'

async function httpRequest<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request)
  const body = await response.json()
  return body
}

async function buscarHeladerias(nombreBuscar: string) {
  return httpRequest<Heladeria[]>(`${BACKEND_URL}/heladerias/buscar/${nombreBuscar}`)
}

export default { buscarHeladerias }