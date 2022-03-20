import Drawer from 'ant-design-vue/es/drawer'
import { mapGetters } from 'vuex'
export default (Vue) => {
  function drawer (component, componentProps, modalProps) {
    const _vm = this
    modalProps = modalProps || {}
    if (!_vm || !_vm._isVue) {
      return
    }
    let drawerDiv = document.querySelector('body>div[type=drawer]')
    if (!drawerDiv) {
      drawerDiv = document.createElement('div')
      drawerDiv.setAttribute('type', 'drawer')
      document.body.appendChild(drawerDiv)
    }
    const drawerInstance = new Vue({
      data () {
        return {
          visible: true
        }
      },
      computed: {
        ...mapGetters(['sideCollapsed']),
        barWidth () {
          return `calc(100% - ${this.sideCollapsed ? 80 : 256}px)`
        }
      },
      router: _vm.$router,
      store: _vm.$store,
      mounted () {
        componentProps.handleCollapse(!0)
        this.$on('close', (v) => {
          this.handleClose()
        })
      },
      methods: {
        handleClose () {
          componentProps.handleCollapse(!1)
          this.visible = false
          this.$refs._component.$emit('close')
          this.$refs._component.$emit('cancel')
          setTimeout(() => {
            drawerInstance.$destroy()
          }, 1000)
        }
      },
      render: function (h) {
        const that = this
        const modalModel = modalProps && modalProps.model
        if (modalModel) {
          delete modalProps.model
        }
        const ModalProps = Object.assign({}, modalModel && { model: modalModel } || {}, {
          attrs: Object.assign({}, {
            ...(modalProps.attrs || modalProps)
          }, {
            width: this.barWidth,
            visible: this.visible
          }),
          on: Object.assign({}, {
            ...(modalProps.on || modalProps)
          }, {
            close: () => {
              that.handleClose()
            }
          })
        })
        const componentModel = componentProps && componentProps.model
        if (componentModel) {
          delete componentProps.model
        }
        const ComponentProps = Object.assign({}, componentModel && { model: componentModel } || {}, {
          ref: '_component',
          attrs: Object.assign({}, {
            ...((componentProps && componentProps.attrs) || componentProps)
          }),
          on: Object.assign({}, {
            ...((componentProps && componentProps.on) || componentProps)
          })
        })
        return h(Drawer, ModalProps, [h(component, ComponentProps)])
      }
    }).$mount(drawerDiv)
  }

  Object.defineProperty(Vue.prototype, '$drawer', {
    get: () => {
      return function () {
        drawer.apply(this, arguments)
      }
    }
  })
}
