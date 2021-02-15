<script lang="ts">
  import { onMount } from 'svelte'
  import type { Duenio } from '../model/duenio'
  import type { Gustos, Heladeria } from '../model/heladeria'
  import { tiposHeladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'

  export let id: number
  let heladeria: Heladeria
  let listaDuenios: Duenio[]
  let nombreNuevoDuenio: string

  async function getHeladeria() {
    heladeria = await heladeriaService.fetchById(id)
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

      {#each Object.entries(heladeria.gustos) as [nombre, dificultad]}
        <tr>
          <td>{nombre}</td>
          <td>{dificultad}</td>
          <td><button on:click={() => eliminarGusto({ [nombre]: dificultad })}>eliminar</button></td>
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
