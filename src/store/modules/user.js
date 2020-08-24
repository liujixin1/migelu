import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: '',
  loginId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name

  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar

  },
  SET_ROLES: (state, roles) => {
    state.roles = roles

  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, securityCode, sid } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password,verify_code:securityCode,sid:sid }).then(response => {
        const { token } = response.data;
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.data.admin_info;
        let menu_list = JSON.parse(response.data.admin_info.roleInfo.menu_list);
        data.menuId = menu_list.menuId;
        data.roles = [];
        data.roles.push(response.data.admin_info.role_id);
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, nickname } = data;
        // roles must be a non-empty array
        if (roles == '' || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', nickname)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        console.log('err')
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
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

