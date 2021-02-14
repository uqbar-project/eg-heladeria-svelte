<script lang="ts">
  import { onMount } from 'svelte'
  import type { Heladeria } from '../model/heladeria'
  import { tiposHeladeria } from '../model/heladeria'
  import heladeriaService from '../service/heladeria-service'

  export let id: number
  let heladeria: Heladeria

  async function getHeladeria() {
    heladeria = await heladeriaService.fetchById(id)
  }

  onMount(getHeladeria)
</script>

<div>
  {#if heladeria}
    <label for="nombre">nombre</label>
    <input bind:value={heladeria.nombre} id="nombre" type="text" />

    {#each tiposHeladeria as tipoHeladeria}
      <input
        bind:group={heladeria.tipoHeladeria}
        value={tipoHeladeria}
        type="radio"
        id={tipoHeladeria}
        name="tipoHeladeria"
      />
      <span for={tipoHeladeria}>{tipoHeladeria}</span>
    {/each}

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
