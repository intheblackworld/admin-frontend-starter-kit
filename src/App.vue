<template>
  <a-config-provider :locale="locale">
    <div id="main-app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  computed: {
    locale () {
      const { title } = this.$route.meta
      !window.__POWERED_BY_QIANKUN__ && title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
