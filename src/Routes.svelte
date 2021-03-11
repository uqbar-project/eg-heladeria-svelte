<script>
  import { Route, Router } from 'svelte-routing'
  import Home from './components/Home.svelte'
  import EditarHeladeria from './components/EditarHeladeria.svelte'
  import { SvelteToast } from '@zerodevx/svelte-toast'

  export let url = ''
</script>

<main>
  <Router {url}>
    <Route path="/" component={Home} />
    <Route path="editar-heladeria/:id" component={EditarHeladeria} />
    </Router>
    <SvelteToast />
</main>
