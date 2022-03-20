<template>
  <keep-alive :exclude="excludeRouterNames">
    <router-view :key="$route.path"/>
  </keep-alive>
</template>

<script>
import { excludeAliveRouterNames } from '@/utils/util'
export default {
  name: 'RouteView',
  data () {
    return {
      excludeRouterNames: excludeAliveRouterNames(this.$store.getters.addRouters).join()
    }
  }
}
</script>

<style scoped>

</style>
