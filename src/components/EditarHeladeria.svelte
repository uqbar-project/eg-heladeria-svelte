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
      toast.push(`Duenio creado!`)
    } catch (error) {
      toast.error(error)
    }
  }

  async function eliminarGusto(gusto: Gustos) {
    try {
      const { gustos } = await heladeriaService.deleteGustos(heladeria.id, gusto)
      heladeria.gustos = gustos
      toast.push(`Gusto eliminado!`)
    } catch (error) {
      toast.error(error)
    }
  }

  async function agregarGusto() {
    try {
      const { gustos } = await heladeriaService.agregarGustos(heladeria.id, {
        [nombreNuevoGusto]: dificultadNuevoGusto,
      })
      toast.push(`Gusto agregado!`)
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
      toast.push(`Heladería actualizada!`)
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
      toast.removeLastToast()
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
    <div id="datos-principales">
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
    <div>
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
    <div>
      <table>
        <tr>
          <th class="columna-gusto">Gusto</th>
          <th>Dificultad</th>
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
        >Agregar</button
      >
    </div>

    <div class="botonera full-ancho">
      <button class="boton-actualizar" on:click={actualizarHeladeria} disabled={!hayCambiosPendientes}
        >Actualizar</button
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

  input,
  select {
    margin-bottom: 1rem;
  }

  input[type='radio'] {
    width: auto;
  }

  .card {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 3rem;
    padding: 1rem 2rem;
  }

  .titulo {
    margin-bottom: 0;
  }

  label {
    margin-bottom: 0.3rem;
  }

  .full-ancho {
    grid-column: 1/3;
  }

  table {
    font-size: 0.9rem;
  }

  .td-dificultad,
  .td-eliminar {
    text-align: center;
  }

  .columna-gusto {
    text-align: left;
  }

  .boton-agregar {
    background-color: var(--color-secundario);
    /* width: auto; */
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
  .boton-agregar:disabled {
    background-color: var(--disabled-secundario);
  }
  .boton-actualizar:enabled {
    background-color: var(--color-primario);
  }
  .boton-actualizar:disabled {
    background-color: var(--disabled-primario);
  }

  h2 {
    margin: 0;
  }

  @media (max-width: 540px) {
    .botonera button {
      margin-bottom: 1rem;
      max-width: 100%;
    }

    .card {
      display: flex;
      flex-direction: column;
    }
  }
</style>
