<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import actions from '@/shared/actions'
import { SIDEBAR_TYPE } from '@/store/mutation-types'
export default {
  name: 'BlankLayout',
  provide () {
    return {
      handleCollapse: (collapsed) => {
        actions.tGlobalState({ collapsed })
        this.$store.commit(SIDEBAR_TYPE, collapsed)
      }
    }
  }
}
</script>

<style scoped>

</style>
