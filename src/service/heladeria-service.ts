import type { Heladeria } from '../model/heladeria'
import { BACKEND_URL } from './constants'

async function httpRequest<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request)
  const body = await response.json()
  return body
}

export async function fetchHeladerias(nombreBuscar) {
  return httpRequest<Heladeria[]>(`${BACKEND_URL}/heladerias/${nombreBuscar}`)
}
