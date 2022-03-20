// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import rbacRouter from './router'
import store from './store/'
import i18n from './locales'
import Router from 'vue-router'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

import initBootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission'
import './utils/filter'
import './global.less'
import './public-path'
import actions from '@/shared/actions'

Vue.config.productionTip = false
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

let instance = null
let router = null
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

function render(props = {}) {
  const { container } = props
  if (props.name) {
    actions.setActions(props)
    router = new Router({
      mode: 'history',
      routes: []
    })
  } else router = rbacRouter
  instance = new Vue({
    router,
    store,
    i18n,
    mounted () {
      if (window.__POWERED_BY_QIANKUN__) {
        store
        .dispatch('GetInfo')
        .then(res => {
          store.dispatch('GenerateRoutes', res).then(() => {
            router.addRoutes(store.getters.addRouters)
          })
        })
      }
    },
    created: initBootstrap,
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#main-app') : '#main-app')
}

export async function bootstrap () {}
export async function mount (props) {
  render(props)
}
export async function unmount () {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
