import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, constantRoutes, asyncRoutes, anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    buttons: [], //按钮权限
    routes: [], //菜单权限
    roles: [], //角色信息
    resultAsyncRoutes: [], //计算出来的异步路由
    resultAllRoutes: [], //需要展示的所有路由
    isHaveRoutes: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userInfo) => {
    state.buttons = userInfo.buttons
    state.routes = userInfo.routes
    state.roles = userInfo.roles
  },
  SET_RESULTASYNCROUTES: (state, routes) => {
    console.log(routes)
    state.resultAsyncRoutes = routes
    state.resultAllRoutes = constantRoutes.concat(routes,anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
    state.isHaveRoutes = true
  }
}


const computeRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    //利用递归获取可展示的路由
    if (routes.indexOf(item.name) !== -1) {
      if (item.children && item.children.length) {
        item.children =  computeRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
  
        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computeRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        location.reload(); // 刷新页面，重置路由
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

