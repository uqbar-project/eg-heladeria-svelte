<script lang="ts">
  import { onMount } from 'svelte'
  import type { Duenio } from '../model/duenio'
  import type { Gustos, Heladeria } from '../model/heladeria'
  import { tiposHeladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'

  export let id: number
  let heladeriaOriginal: Heladeria
  let heladeria: Heladeria
  let listaDuenios: Duenio[]
  let nombreNuevoDuenio: string
  let nombreNuevoGusto: string
  let dificultadNuevoGusto: number

  async function getHeladeria() {
    heladeria = await heladeriaService.fetchById(id)
    heladeriaOriginal = { ...heladeria }
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

  async function eliminarGusto(gusto: Gustos) {
    heladeria = await heladeriaService.deleteGustos(heladeria.id, gusto)
  }

  async function agregarGusto() {
    heladeria = await heladeriaService.agregarGustos(heladeria.id, { [nombreNuevoGusto]: dificultadNuevoGusto })
  }

  async function actualizarHeladeria() {
    heladeria = await heladeriaService.actualizar(heladeria)
    heladeriaOriginal = { ...heladeria }
  }

  $: hayCambiosPendientes =
    heladeria &&
    (heladeriaOriginal.nombre != heladeria.nombre ||
      heladeriaOriginal.tipoHeladeria != heladeria.tipoHeladeria ||
      heladeriaOriginal.duenio.id != heladeria.duenio.id)

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
        <option selected={duenio.id === heladeria.duenio.id} value={duenio}>
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

      {#each Object.entries(heladeria.gustos) as [nombre, dificultad]}
        <tr>
          <td>{nombre}</td>
          <td>{dificultad}</td>
          <td><button on:click={() => eliminarGusto({ [nombre]: dificultad })}>eliminar</button></td>
        </tr>
      {/each}
    </table>
    <label for="nuevoGusto">Nuevo gusto</label>
    <input type="text" id="nuevoGusto" bind:value={nombreNuevoGusto} />
    <label for="dificultad">Dificultad</label>
    <input type="number" id="dificultad" bind:value={dificultadNuevoGusto} />
    <button on:click={agregarGusto} disabled={!nombreNuevoGusto || !dificultadNuevoGusto}>Agregar gusto</button>

    <button on:click={actualizarHeladeria} disabled={!hayCambiosPendientes}>Actualizar heladeria</button>
  {/if}
</div>

<style>
</style>
