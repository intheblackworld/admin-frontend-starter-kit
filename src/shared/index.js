const shared = {
  getToken() {
    return localStorage.getItem('token') || ''
  },
  setToken(token) {
    localStorage.setItem('token', token)
  }
}

const sharedModule = {
  overloadShared(shared) {
    sharedModule.shared = shared
  },
  getShared() {
    return shared
  }
}

export default sharedModule
