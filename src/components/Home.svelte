<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import type { Heladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'
  import { toast } from '../service/toast'

  let heladerias: Heladeria[] = []
  let nombreBuscar = ''

  onMount(() => {
    toast.removeLastToast()
    getHeladerias()
  })

  async function getHeladerias() {
    try {
      heladerias = await heladeriaService.buscarHeladerias(nombreBuscar)
      toast.removeLastToast()
      if (heladerias.length == 0) {
        toast.push(`No se encontraron heladerias`)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  function editarHeladeria(heladeria: Heladeria) {
    navigate(`/editar-heladeria/${heladeria.id}`)
  }

  function handleKeyPress(event) {
    if (event.code === 'Enter') {
      getHeladerias()
    }
  }
</script>

<div class="card contenido centrado">
  <h1 class="titulo centrado">Heladerias</h1>
  <div>
    <input
      type="text"
      name="input-buscar"
      placeholder="Buscar por nombre"
      id="input-buscar"
      bind:value={nombreBuscar}
      on:keypress={handleKeyPress}
    />
    <button on:click={getHeladerias}>Buscar</button>
    <label for="lista-resultados" />
    {#if heladerias.length != 0}
      <table>
        <thead>
          <th>Nombre</th>
          <th>Dueño</th>
          <th class="columna-editar" />
        </thead>
        {#each heladerias as heladeria}
          <tr>
            <td title={heladeria.nombre}>{heladeria.nombre}</td>
            <td title={heladeria.duenio.nombreCompleto}>{heladeria.duenio.nombreCompleto}</td>
            <td class="editar"
              ><img
                height="25px"
                alt="edit"
                src="assets/edit-icon.svg"
                on:click={() => editarHeladeria(heladeria)}
              /></td
            >
          </tr>
        {/each}
      </table>
    {/if}
  </div>
</div>

<style>
  table {
    margin: 0.5rem auto;
    /* border-spacing: 1rem 1rem; */
  }

  td {
    padding: 1rem;
  }

  td {
    /* border-radius: 15px; */
  }

  tr:nth-child(even) {
    background-color: var(--color-primario);
  }

  tr:nth-child(odd) {
    background-color: var(--color-secundario);
  }

  button {
    width: auto;
  }

  input {
    height: 2.5rem;
    padding-left: 1rem;
  }

  .columna-editar {
    width: 20%;
  }

  @media (max-width: 540px) {
    input {
      width: auto;
    }
  }
</style>
