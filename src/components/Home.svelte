<script lang="ts">
  import { navigate } from 'svelte-routing'
  import type { Heladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'

  let heladerias: Heladeria[] = []
  let nombreBuscar = ''

  async function getHeladerias() {
    heladerias = await heladeriaService.buscarHeladerias(nombreBuscar)
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

<main>
  <div class="card ancho">
    <h1>Heladerias</h1>
    <label for="input-buscar">Buscar por nombre</label>
    <input type="text" name="input-buscar" id="input-buscar" bind:value={nombreBuscar} on:keypress={handleKeyPress} />
    <button on:click={getHeladerias}>Buscar</button>
    <label for="lista-resultados" />
    {#if heladerias.length != 0}
      <table>
        <thead>
          <th>Nombre</th>
          <th>Dueño</th>
        </thead>
        {#each heladerias as heladeria}
          <tr>
            <td>{heladeria.nombre}</td>
            <td>{heladeria.duenio.nombreCompleto}</td>
            <td
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
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  table {
    margin: 0 auto;
    border-spacing: 0 3px;
    padding: 1.5rem;
  }

  td {
    padding: 0 1rem;
  }

  tr:nth-child(even) {
    background-color: #ff749d;
  }
  tr:nth-child(odd) {
    background-color: #99cffa;
  }

  img {
    padding: 1rem 0;
    cursor: pointer;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
