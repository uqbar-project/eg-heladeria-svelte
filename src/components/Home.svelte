<script lang="ts">
  import type { Heladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'

  let heladerias: Heladeria[] = []
  let nombreBuscar: string = ''

  async function getHeladerias() {
    heladerias = await heladeriaService.buscarHeladerias(nombreBuscar)
  }
</script>

<main>
  <h1>Heladerias</h1>
  <h3>Buscar por nombre</h3>
  <input
    type="text"
    name="input-buscar"
    id="input-buscar"
    bind:value={nombreBuscar}
  />
  <button on:click={getHeladerias}>Buscar</button>
  <label for="lista-resultados" />
  <table>
    <tr>
      <th>Nombre</th>
      <th>Dueño</th>
    </tr>
    {#each heladerias as heladeria}
      <tr>
        <td>{heladeria.nombre}</td>
        <td>{heladeria.duenio.nombreCompleto}</td>
      </tr>
    {/each}
  </table>
  <button>Editar heladeria</button>
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
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
