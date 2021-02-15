<script lang="ts">
  import { onMount } from 'svelte'
  import type { Duenio } from '../model/duenio'
  import type { Gusto, GustoObject, Heladeria } from '../model/heladeria'
  import { tiposHeladeria } from '../model/heladeria'
  import Routes from '../Routes.svelte'
  import heladeriaService from '../service/heladeria-service'
  import Home from './Home.svelte'

  export let id: number
  let heladeria: Heladeria
  let listaDuenios: Duenio[]
  let nombreNuevoDuenio: string

  async function getHeladeria() {
    heladeria = await heladeriaService.fetchById(id)
  }

  function mapToList(): GustoObject[] {
    return Object.entries(heladeria.gustos).map(([nombre, dificultad]: [string, number]) => ({ nombre, dificultad }))
  }

  async function getDuenios() {
    listaDuenios = await heladeriaService.fetchDuenios()
  }

  async function agregarDuenio() {
    const nuevoDuenio = await heladeriaService.crearDuenio(nombreNuevoDuenio)
    listaDuenios = [...listaDuenios, nuevoDuenio]
    nombreNuevoDuenio = ''
    heladeria.duenio = nuevoDuenio
  }

  async function eliminarGusto(gustoSeleccionado: GustoObject) {
    heladeria = await heladeriaService.deleteGustos(heladeria.id, gustoSeleccionado)
    console.log(heladeria)
  }

  onMount(async () => {
    await getHeladeria()
    await getDuenios()
  })
</script>

<div>
  {#if heladeria && listaDuenios}
    <label for="nombre">Nombre</label>
    <input bind:value={heladeria.nombre} id="nombre" type="text" />

    {#each tiposHeladeria as tipoHeladeria}
      <input bind:group={heladeria.tipoHeladeria} value={tipoHeladeria} type="radio" id={tipoHeladeria} />
      <span for={tipoHeladeria}>{tipoHeladeria}</span>
    {/each}

    <label for="duenio">Dueño</label>
    <select bind:value={heladeria.duenio} id="duenio">
      {#each listaDuenios as duenio}
        <option value={duenio}>
          {duenio.nombreCompleto}
        </option>
      {/each}
    </select>

    <input type="text" id="nuevoDuenio" bind:value={nombreNuevoDuenio} />
    <button on:click={agregarDuenio} disabled={!nombreNuevoDuenio}>Agregar dueño</button>

    <table>
      <tr>
        <th>Gusto</th>
        <th>Dificultad</th>
      </tr>
      {#each mapToList() as gusto}
        <tr>
          <td>{gusto.nombre}</td>
          <td>{gusto.dificultad}</td>
          <td><button on:click={() => eliminarGusto(gusto)}>eliminar</button></td>
        </tr>
      {/each}
    </table>

    <div>
      {heladeria.id}
      {heladeria.nombre}
      {heladeria.tipoHeladeria}
      {heladeria.duenio.nombreCompleto}
    </div>
  {/if}
</div>

<style>
</style>
