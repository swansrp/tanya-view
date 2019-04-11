export const login = (context, userInfo) => {
  context.getRequest('/login', {
    name: userInfo.name,
    pw: userInfo.pw
  }).then(resp => {
    if (resp && resp.status === 200) {
      let data = resp.data
      context.$store.commit('login', data.data)
      let path = context.$route.query.redirect
      console.log(path)
      context.$router.replace({path: path === '/' || path === undefined ? '/home' : path})
    }
  })
}

export const logoff = (context) => {
  context.getRequest('/logoff')
    .then(resp => {
      if (resp && resp.status === 200) {
        context.$store.commit('logout')
        context.$router.replace('/')
      }
    })
}
