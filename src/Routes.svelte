<script>
  import { Route, Router } from 'svelte-routing'
  import Home from './components/Home.svelte'

  export let url = ''
</script>

<Router {url}>
  <Route path="/" component={Home} />
</Router>
