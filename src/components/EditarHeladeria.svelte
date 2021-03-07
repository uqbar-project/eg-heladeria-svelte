<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
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
    const { gustos } = await heladeriaService.deleteGustos(heladeria.id, gusto)
    heladeria.gustos = gustos
  }

  async function agregarGusto() {
    const { gustos } = await heladeriaService.agregarGustos(heladeria.id, { [nombreNuevoGusto]: dificultadNuevoGusto })
    heladeria.gustos = gustos
    nombreNuevoGusto = ''
    dificultadNuevoGusto = null
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

<div class="card ancho">
  {#if heladeria && listaDuenios}
    <h1>Editar {heladeria.nombre}</h1>
    <div id="datos-principales" class="contenedor">
      <div>
        <label for="nombre">Nombre</label>
        <input bind:value={heladeria.nombre} id="nombre" type="text" />
        <div class="tipos-heladeria">
          {#each tiposHeladeria as tipoHeladeria}
            <input bind:group={heladeria.tipoHeladeria} value={tipoHeladeria} type="radio" id={tipoHeladeria} />
            <label class="radio-label" for={tipoHeladeria}>{tipoHeladeria}</label> <br />
          {/each}
        </div>
      </div>
      <div class="contenedor vertical">
        <div>
          <label for="duenio">Dueño</label>
          <select bind:value={heladeria.duenio} id="duenio">
            {#each listaDuenios as duenio}
              <option selected={duenio.id === heladeria.duenio.id} value={duenio}>
                {duenio.nombreCompleto}
              </option>
            {/each}
          </select>
        </div>
        <div>
          <label for="nuevoDuenio">Nuevo dueño</label>
          <input type="text" id="nuevoDuenio" bind:value={nombreNuevoDuenio} />
          <button on:click={agregarDuenio} disabled={!nombreNuevoDuenio}>Agregar</button>
        </div>
      </div>
    </div>

    <div id="gustos" class="contenedor">
      <table>
        <tr>
          <th>Gusto</th>
          <th>Dificultad</th>
        </tr>

        {#each Object.entries(heladeria.gustos) as [nombre, dificultad]}
          <tr>
            <td>{nombre}</td>
            <td class="centrado">{dificultad}</td>
            <td
              ><img
                src="../assets/trash.svg"
                height="20px"
                alt="eliminar"
                on:click={() => eliminarGusto({ [nombre]: dificultad })}
              /></td
            >
          </tr>
        {/each}
      </table>
      <div>
        <label for="nuevoGusto">Nuevo gusto</label>
        <input type="text" id="nuevoGusto" bind:value={nombreNuevoGusto} />
        <label for="dificultad">Dificultad</label>
        <input type="number" id="dificultad" min="1" max="10" bind:value={dificultadNuevoGusto} />
        <button on:click={agregarGusto} disabled={!nombreNuevoGusto || !dificultadNuevoGusto}>Agregar gusto</button>
      </div>
    </div>

    <div class="botonera">
      <button on:click={actualizarHeladeria} disabled={!hayCambiosPendientes}>Actualizar heladeria</button>
      <button on:click={() => navigate('/')}>Volver</button>
    </div>
  {/if}
</div>

<style>
  .radio-label {
    display: inline;
    margin-right: 1rem;
  }
</style>
