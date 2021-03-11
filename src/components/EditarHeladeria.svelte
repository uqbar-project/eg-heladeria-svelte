<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import type { Duenio } from '../model/duenio'
  import type { Gustos, Heladeria } from '../model/heladeria'
  import { tiposHeladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'
  import { toast } from '../service/toast'

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
    try {
      const nuevoDuenio = await heladeriaService.crearDuenio(nombreNuevoDuenio)
      listaDuenios = [...listaDuenios, nuevoDuenio]
      nombreNuevoDuenio = ''
      heladeria.duenio = nuevoDuenio
      toast.success(`Se creó a '${nuevoDuenio.nombreCompleto}'`)
    } catch (error) {
      toast.error(error)
    }
  }

  async function eliminarGusto(gusto: Gustos) {
    try {
      const { gustos } = await heladeriaService.deleteGustos(heladeria.id, gusto)
      heladeria.gustos = gustos
      toast.success(`Gusto '${Object.keys(gusto)[0]}' eliminado!`)
    } catch (error) {
      toast.error(error)
    }
  }

  async function agregarGusto() {
    try {
      const { gustos } = await heladeriaService.agregarGustos(heladeria.id, {
        [nombreNuevoGusto]: dificultadNuevoGusto,
      })
      toast.success(`Gusto '${nombreNuevoGusto}' agregado!`)
      heladeria.gustos = gustos
      nombreNuevoGusto = ''
      dificultadNuevoGusto = null
    } catch (error) {
      toast.error(error)
    }
  }

  async function actualizarHeladeria() {
    try {
      heladeria = await heladeriaService.actualizar(heladeria)
      heladeriaOriginal = { ...heladeria }
      toast.success(`Heladería actualizada!`)
    } catch (error) {
      toast.error(error)
    }
  }

  $: hayCambiosPendientes =
    heladeria &&
    (heladeriaOriginal.nombre != heladeria.nombre ||
      heladeriaOriginal.tipoHeladeria != heladeria.tipoHeladeria ||
      heladeriaOriginal.duenio.id != heladeria.duenio.id)

  onMount(async () => {
    try {
      await getHeladeria()
      await getDuenios()
    } catch (error) {
      toast.error(error)
    }
  })
</script>

<div class="card ancho">
  {#if heladeria && listaDuenios}
    <h1 title={heladeria.nombre} class="titulo centrado full-ancho">Editar {heladeria.nombre}</h1>
    <h2 class="full-ancho">Datos</h2>
    <div id="datos-principales" class="contenedor vertical">
      <div>
        <label for="nombre">Nombre</label>
        <input maxlength="30" bind:value={heladeria.nombre} id="nombre" type="text" />
      </div>
      <div>
        <div class="tipos-heladeria">
          {#each tiposHeladeria as tipoHeladeria}
            <input bind:group={heladeria.tipoHeladeria} value={tipoHeladeria} type="radio" id={tipoHeladeria} />
            <label class="radio-label" for={tipoHeladeria}>{tipoHeladeria}</label> <br />
          {/each}
        </div>
      </div>
    </div>
    <div class="contenedor vertical">
      <div>
        <label for="duenio">Dueño</label>
        <select title={heladeria.duenio.nombreCompleto} bind:value={heladeria.duenio} id="duenio">
          {#each listaDuenios as duenio}
            <option selected={duenio.id === heladeria.duenio.id} value={duenio}>
              {duenio.nombreCompleto}
            </option>
          {/each}
        </select>
      </div>
      <div>
        <label for="nuevoDuenio">Nuevo dueño</label>
        <input maxlength="100" type="text" id="nuevoDuenio" bind:value={nombreNuevoDuenio} />
        <button class="boton-agregar" on:click={agregarDuenio} disabled={!nombreNuevoDuenio}>Agregar</button>
      </div>
    </div>

    <h2 class="full-ancho">Gustos</h2>
    <div class="contenedor">
      <table>
        <tr>
          <th class="columna-gusto">Gusto</th>
          <th>Dificultad</th>
          <th />
        </tr>

        {#each Object.entries(heladeria.gustos) as [nombre, dificultad]}
          <tr>
            <td title={nombre}>{nombre}</td>
            <td class="td-dificultad">{dificultad}</td>
            <td class="td-eliminar"
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
    </div>
    <div>
      <label for="nuevoGusto">Nuevo gusto</label>
      <input maxlength="50" type="text" id="nuevoGusto" bind:value={nombreNuevoGusto} />
      <label for="dificultad">Dificultad</label>
      <input type="number" id="dificultad" min="1" max="10" bind:value={dificultadNuevoGusto} />
      <button class="boton-agregar" on:click={agregarGusto} disabled={!nombreNuevoGusto || !dificultadNuevoGusto}
        >Agregar gusto</button
      >
    </div>

    <div class="botonera full-ancho">
      <button class="boton-actualizar" on:click={actualizarHeladeria} disabled={!hayCambiosPendientes}
        >Actualizar heladeria</button
      >
      <button on:click={() => navigate('/')}>Volver</button>
    </div>
  {/if}
</div>

<style>
  .radio-label {
    display: inline;
    margin-right: 1rem;
  }

  .card {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 4rem;
    padding: 1rem 2rem;
  }

  .titulo {
    margin-bottom: 0;
  }

  .full-ancho {
    grid-column: 1/3;
  }

  th {
    text-align: left;
  }

  .columna-gusto {
    width: 60%;
  }

  .td-dificultad {
    text-align: center;
  }

  .td-eliminar {
    text-align: right;
    padding-right: 0;
  }

  .boton-agregar {
    background-color: var(--color-primario);
  }
  .boton-agregar:disabled {
    background-color: var(--disabled-primario);
  }
  .boton-actualizar:enabled {
    background-color: var(--color-secundario);
  }
  .boton-actualizar:disabled {
    background-color: var(--disabled-secundario);
  }

  h2 {
    margin: 0;
  }

  @media (max-width: 540px) {
    .card {
      display: flex;
      flex-direction: column;
    }
  }
</style>
