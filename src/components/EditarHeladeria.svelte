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

<div class="card contenido">
  {#if heladeria && listaDuenios}
    <h2 title={heladeria.nombre} class="titulo centrado full-ancho">Editar {heladeria.nombre}</h2>
    <section id="datos-principales">
      <h3 class="titulo-seccion">Datos</h3>
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
    </section>
    <section>
      <h3 class="titulo-seccion">Dueño</h3>
      <label for="duenio">Dueño</label>
      <select title={heladeria.duenio.nombreCompleto} bind:value={heladeria.duenio} id="duenio">
        {#each listaDuenios as duenio}
          <option selected={duenio.id === heladeria.duenio.id} value={duenio}>
            {duenio.nombreCompleto}
          </option>
        {/each}
      </select>
      <div>
        <label for="nuevoDuenio">Nuevo dueño</label>
        <input maxlength="100" type="text" id="nuevoDuenio" bind:value={nombreNuevoDuenio} />
        <button class="boton-agregar" on:click={agregarDuenio} disabled={!nombreNuevoDuenio}>Agregar</button>
      </div>
    </section>

    <section>
      <h3 class="titulo-seccion">Gustos</h3>
      <div class="tabla-gustos-container">
        <table>
          <tr>
            <th class="columna-gusto">Gusto</th>
            <th>Dificultad</th>
          </tr>

          {#each Object.entries(heladeria.gustos) as [nombre, dificultad]}
            <tr>
              <td title={nombre}>{nombre}</td>
              <td>{dificultad}</td>
              <td>
                <img
                  src="../assets/trash.svg"
                  height="20px"
                  alt="eliminar"
                  on:click={() => eliminarGusto({ [nombre]: dificultad })}
                />
              </td>
            </tr>
          {/each}
        </table>
      </div>
    </section>
    <section>
      <h3 class="titulo-seccion">Agregar gusto</h3>
      <label for="nuevoGusto">Nombre</label>
      <input maxlength="50" type="text" id="nuevoGusto" bind:value={nombreNuevoGusto} />
      <label for="dificultad">Dificultad</label>
      <input type="number" id="dificultad" min="1" max="10" bind:value={dificultadNuevoGusto} />
      <button class="boton-agregar" on:click={agregarGusto} disabled={!nombreNuevoGusto || !dificultadNuevoGusto}
        >Agregar</button
      >
    </section>

    <section class="botonera full-ancho">
      <button on:click={() => navigate('/')}>Volver</button>
      <button class="boton-actualizar" on:click={actualizarHeladeria} disabled={!hayCambiosPendientes}
        >Actualizar</button
      >
    </section>
  {/if}
</div>

<style>
  .tabla-gustos-container {
    max-height: 19rem;
    overflow: auto;
  }

  .radio-label {
    display: inline;
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
    gap: 2rem 4rem;
    padding: 1rem 2rem;
  }

  .titulo {
    font-size: 2rem;
    margin-bottom: 0;
  }

  label {
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
  }

  .full-ancho {
    grid-column: 1/3;
  }

  .titulo-seccion {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  table {
    font-size: 0.9rem;
  }

  td:nth-child(2),
  td:nth-child(3) {
    text-align: center;
  }

  .columna-gusto {
    text-align: left;
  }

  .boton-agregar {
    background-color: var(--color-secundario);
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .boton-agregar:disabled {
    background-color: var(--disabled-secundario);
  }

  .boton-actualizar {
    background-color: var(--color-primario);
  }

  .boton-actualizar:disabled {
    background-color: var(--disabled-primario);
  }

  .botonera {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    gap: 1rem;
  }

  @media (max-width: 540px) {
    .botonera button {
      margin-bottom: 1rem;
    }

    .card {
      display: flex;
      flex-direction: column;
    }
  }
</style>
