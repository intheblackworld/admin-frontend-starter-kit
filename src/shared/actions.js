function emptyAction () {
  console.warn('Current execute action is empty!')
}

const actions = {
  actions: {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  },
  setActions (actions) {
    this.actions = actions
  },
  onGlobalStateChange (...args) {
    return this.actions.onGlobalStateChange(...args)
  },
  tGlobalState (...args) {
    return this.actions.setGlobalState(...args)
  }
}

export default actions
