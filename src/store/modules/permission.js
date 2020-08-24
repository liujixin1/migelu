import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, data) {
    let roles = data.roles;
    let act  = data.roleInfo.act_list
    let menuId = data.menuId;
    return new Promise(resolve => {
      let accessedRoutes = null;
      if (act =='all') {
        accessedRoutes = asyncRoutes || [];
      } else {
        let menu = menuList(menuId, asyncRoutes, asyncRoutes, roles[0]);
        accessedRoutes = filterAsyncRoutes(menu,roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
 
}
 //获取全部添加role菜单列表
 function menuList(arrId, menu, menus, roles) {
  arrId.forEach(id => {
    let nodeObj = function(id, menu) {
      menu.forEach(data => {
        if (data.id == id) {
          if (data.meta) {
            let bool = data.meta.role.find(res => {
              return res == roles;
            });
            if (!bool) {
              data.meta.role.push(roles);
            }
            if (data.parentId) {
              nodeObj(data.parentId, menus);
            }
          }
        }
        if (data.children && data.children.length) {
          nodeObj(id, data.children);
        }
      });
    };
    nodeObj(id, menu);
  });
  return menu;
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
