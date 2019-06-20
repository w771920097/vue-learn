import { http } from '../../../app'
import _ from 'lodash'

// 定义action type
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGIN_OSS = 'USER_LOGIN_OSS'
export const USER_LOGIN_WID = 'USER_LOGIN_WID'
export const USER_LOGOUT = 'USER_LOGOUT'
export const FETCH_MAIN_MENU = 'FETCH_MAIN_MENU'

// 智慧云眼 菜单
export const FETCH_CLOUD_EYE_MENU = 'FETCH_CLOUD_EYE_MENU'
export const FETCH_MENU_BY_ENAME = 'FETCH_MENU_BY_ENAME'

// orgId
export const FETCH_ORG_PATH_BY_ORG_ID = 'FETCH_ORG_PATH_BY_ORG_ID'
export const FETCH_ORGS_BY_PARENT_ID = 'FETCH_ORGS_BY_PARENT_ID'
export const FETCH_SUBMENUlIST_BY_PARENT_ID = 'FETCH_SUBMENUlIST_BY_PARENT_ID'

// app config
export const GET_APP_CONFIG = 'GET_APP_CONFIG'
// map 相关
export const TRANSFORM_ORG_TO_LONLAT = 'TRANSFORM_ORG_TO_LONLAT'
export const TRANSFORM_LONLAT_TO_ORG = 'TRANSFORM_LONLAT_TO_ORG'

//获取 服务器 时间戳
export const GET_TIMESTAMP = 'GET_TIMESTAMP'
//获取视频流
export const GET_PREVIEW = 'GET_PREVIEW'

// 指定对应api
export const api = {
  [USER_LOGIN]: '/login.action',
  [USER_LOGOUT]: '/logout.action',
  [FETCH_MAIN_MENU]: '/menu/listMenus.action',
  [FETCH_CLOUD_EYE_MENU]: '/menu/listChildrenMenusByParentId.action',
  [FETCH_ORG_PATH_BY_ORG_ID]: '/sysadmin/orgManage/getOrgArrayByOrgId.action',
  [FETCH_ORGS_BY_PARENT_ID]: '/sysadmin/orgManage/ajaxOrgsForExtTree.action',
  [FETCH_SUBMENUlIST_BY_PARENT_ID]: '/menuManage/subMenusListByParentId',
  [USER_LOGIN_OSS]: '/externallogin.action',
  [USER_LOGIN_WID]: '/token/login.action',
  [FETCH_MENU_BY_ENAME]: '/menu/menusByEname.action',
  [GET_APP_CONFIG]: '/address/addressForGis/getAddressForGis',
  // map
  [TRANSFORM_ORG_TO_LONLAT]: '/points/findPointsListByRegionName/findOrgInfoByOrgId',
  [TRANSFORM_LONLAT_TO_ORG]: '/points/findPointsListByRegionName/getOrgInfoByLatAndLng',
  //获取 服务器 时间戳
  [GET_TIMESTAMP]: '/getTimestamp',
  [GET_PREVIEW]: '/shinyMeshScreenManage/getPreviewUrl',
}

// 初始化store对象
const state = {
  userInfo: {},
  token: '',
  remberInfo: {
    username: '',
    password: '',
  },
  mainMenu: [],
  currentCMenu: [{
    parentId: 0,
    menus: [],
  }],
  menuMap: {},
  config: {},
  currentMenuGroup: [],
  enterType: 'byLogin',
}

// 异步操作放到action handler里
const actions = {
  doLogin({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      http
        .post(api[USER_LOGIN], JSON.stringify(payload))
        .then(rst => {
          if (rst.success) {
            commit('SET_USERINFO', rst.user)
            commit('SET_TOKEN', rst.token)
            dispatch('getAppConfig')
            commit('updateEnterType', 'byLogin')
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          console.log(error)
          reject()
        })
    })
  },
  doLoginSso({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      http
        .get(api[USER_LOGIN_OSS], payload)
        .then(rst => {
          if (rst.success) {
            commit('SET_USERINFO', rst.user)
            commit('SET_TOKEN', rst.token)
            dispatch('getAppConfig')
            commit('updateEnterType', 'byLogin')
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  doLoginWid({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      http
        .post(api[USER_LOGIN_WID], payload)
        .then(rst => {
          if (rst.success) {
            commit('SET_USERINFO', rst.user)
            commit('SET_TOKEN', rst.token)
            dispatch('getAppConfig')
            commit('updateEnterType', 'byLogin')
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  doLogout({ commit }, payload) {
    return new Promise((resolve, reject) => {
      http
        .get(api[USER_LOGOUT], JSON.stringify(payload), { timeout: 6000 })
        .then(rst => {
          if (rst.success) {
            commit('SET_USERINFO', {})
            commit('SET_TOKEN', '')
            commit('updateEnterType', 'byLogin')
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  clearUserInfo({ commit }, cb) {
    commit('SET_USERINFO', {})
    commit('SET_TOKEN', '')
    commit('updateEnterType', 'byLogin')
    cb && cb()
  },
  updateRember({ commit }, payload) {
    commit('SET_REMBERINFO', payload)
  },
  fetchMenu({ commit }, payload) {
    return new Promise((resolve, reject) => {
      http.get(api[FETCH_MAIN_MENU], payload)
        .then(rst => {
          if (rst.success) {
            commit(FETCH_MAIN_MENU, rst.data)
            resolve(rst.data)
          } else {
            reject(rst.msg)
          }
        })
    })
  },
  fetchSecondMenu({ commit, dispatch }, { params, parentId, parentName }) {
    return new Promise((resolve, reject) => {
      http.get(api[FETCH_CLOUD_EYE_MENU], params)
        .then(rst => {
          if (rst.success) {
            resolve(rst.data)
            const rstMenu = []
            rst.data.forEach(menu => {
              if (menu.permissionType === 1) {
                if (menu.normalUrl) { // 无子项
                  const temp = {
                    id: menu.id,
                    des: menu.cname,
                    icon: menu.ename,
                    path: menu.normalUrl,
                    exUrl: menu.leaderUrl || '',
                  }
                  commit('recordMenu', { [menu.normalUrl]: temp })
                  rstMenu.push(temp)
                } else {
                  const temp = {
                    id: menu.id,
                    des: menu.cname,
                    icon: menu.ename,
                    exUrl: menu.leaderUrl || '',
                  }
                  rstMenu.push(temp)
                  const params = {}
                  params['parentId'] = menu.id
                  dispatch('fetchSecondMenu', { params, parentId: menu.id, parentName: menu.cname })
                }
              }
            })

            commit(FETCH_CLOUD_EYE_MENU, { menus: rstMenu, parentId, parentName })
          } else {
            reject(rst.msg)
          }
        })
        .catch(e => console.log(e))
    })
  },
  fetchOrgs({ state }, params) {// eslint-disable-line
    return new Promise((resolve, reject) => {
      http.get(api[FETCH_ORGS_BY_PARENT_ID], { ...params }, { timeout: 10000 })
        .then(rst => {
          if (rst.success) {
            resolve(rst)

          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchOrgPath({ state }, params) {// eslint-disable-line
    return new Promise((resolve, reject) => {
      http.get(api[FETCH_ORG_PATH_BY_ORG_ID], params)
        .then(rst => {
          if (rst.success) {
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getOrgArrayById({ dispatch, state }, id) {
    const { userInfo: { organization }} = state
    return new Promise((resolve, reject) => {
      dispatch('fetchOrgPath', { orgId: id })
        .then(({ data: orgIds }) => {
          const orgArr = [organization.parentOrg.id || '', ...orgIds]
          const resArr = []
          orgArr.forEach(org => {
            resArr.push(dispatch('fetchOrgs', { orgId: org }))
          })
          Promise.all(resArr)
            .then(datas => {
              const orgs = []
              const path = []
              const selected = []
              datas.forEach(({ data: rows }, index) => {
                const dataIndex = _.findIndex(rows, { id: orgArr[index + 1] })
                if (rows[dataIndex]) {
                  orgs.push(rows[dataIndex].id)
                  const parentId = orgArr[index + 1]
                  parentId && path.push(_.findIndex(rows, { id: parentId }))
                }
              })

              const cells = []
              datas.forEach(({ data: rows }) => {
                const temp = []
                rows.forEach(itm => {
                  if (itm.cls === 'folder' && itm.level > 0) {
                    const mate = {
                      value: itm.id,
                      label: itm.name,
                      children: [],
                      orgCode: itm.code,
                      level: itm.level,
                      loading: false,
                    }
                    temp.push(mate)
                    orgs.includes(itm.id) && selected.push(mate)
                  } else {
                    const mate = {
                      value: itm.id,
                      orgCode: itm.code,
                      label: itm.name,
                      level: itm.level,
                    }
                    temp.push(mate)
                    orgs.includes(itm.id) && selected.push(mate)
                  }
                })
                cells.push(temp)
              })

              const loop = (parent, i) => {
                if (cells[i + 1].length > 0) {
                  parent[path[i]].children = cells[i + 1]
                  if (i < path.length - 1) {
                    loop(parent[path[i]].children, i + 1)
                  }
                }
              }
              const [tree] = cells
              if (cells.length > 1) {
                loop(tree, 0)
              }
              resolve({ tree, orgs, selected })
            })


        })
        .catch(e => reject(e))
    })
  },
  getAppConfig({ state, commit }, params) {// eslint-disable-line
    return new Promise((resolve, reject) => {
      http.get(api[GET_APP_CONFIG], params)
        .then(rst => {
          if (rst.success) {
            resolve(rst)
            commit('setConf', rst.data)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getLonlatByOrgId({ state }, orgId) {// eslint-disable-line
    return new Promise((resolve, reject) => {// eslint-disable-line
      // resolve({ 'msg': '操作成功', 'code': 0, 'data': { 'minLat': 30.194456, 'centerY2': '30.22803647', 'remark': '上城区', 'zoom': 2, 'maxLon': 120.209724, 'maxLat2': 30.260532, 'id': 21277, 'maxLon2': 120.209724, 'organization': { 'orgType': { 'internalId': 0, 'id': 1, 'displaySeq': 0 }, 'parentOrg': { 'id': 139854, 'maxCode': 0 }, 'departmentNo': '330102', 'id': 142096, 'maxCode': 105, 'simplePinyin': 'scq', 'createDate': '2019-03-08T07:32:10', 'fullPinyin': 'shangchengqu', 'orgName': '上城区', 'subCount': 100, 'createUser': 'admin', 'orgInternalCode': '1.1.10.10.', 'seq': 1, 'subCountFun': 0, 'orgLevel': { 'internalId': 0, 'id': 8, 'displaySeq': 0 }}, 'centerY': '30.22803647', 'minLon': 120.133965, 'gisType': '3D', 'centerX': '120.17106311', 'points': 'MULTIPOLYGON(((120.135958358413 30.1951418586414,120.135958358413 30.2088747687976,120.137331649429 30.1944552131335,120.136645003921 30.1944552131335,120.136645003921 30.1958285041492,120.135958358413 30.1951418586414)),((120.162737533218 30.2020083137195,120.136645003921 30.1951418586414,120.16205088771 30.2026949592273,120.161364242202 30.2013216682117,120.161364242202 30.2013216682117,120.136645003921 30.1951418586414,120.162737533218 30.2020083137195)),((120.164232402 30.260472344,120.153220695 30.260531533,120.157803051 30.253601754,120.149897186 30.243403513,120.149360495 30.237818273,120.155244868 30.233269403,120.155344951 30.226211982,120.150012502 30.218084022,120.148564423 30.219996314,120.142576669 30.214782696,120.134793096 30.215794107,120.138737884 30.207823974,120.133967126 30.206514943,120.134626667 30.195352661,120.16196937 30.202458822,120.200921828 30.224085133,120.209726484 30.232198035,120.192901048 30.245079127,120.181423874 30.248801823,120.183499487 30.260157956,120.164232402 30.260472344)))', 'minLat2': 30.194456, 'centerX2': '120.17106311', 'createDate': '2019-03-08T07:32:10', 'minLon2': 120.133965, 'points2': 'MULTIPOLYGON(((120.135958358413 30.1951418586414,120.135958358413 30.2088747687976,120.137331649429 30.1944552131335,120.136645003921 30.1944552131335,120.136645003921 30.1958285041492,120.135958358413 30.1951418586414)),((120.162737533218 30.2020083137195,120.136645003921 30.1951418586414,120.16205088771 30.2026949592273,120.161364242202 30.2013216682117,120.161364242202 30.2013216682117,120.136645003921 30.1951418586414,120.162737533218 30.2020083137195)),((120.164232402 30.260472344,120.153220695 30.260531533,120.157803051 30.253601754,120.149897186 30.243403513,120.149360495 30.237818273,120.155244868 30.233269403,120.155344951 30.226211982,120.150012502 30.218084022,120.148564423 30.219996314,120.142576669 30.214782696,120.134793096 30.215794107,120.138737884 30.207823974,120.133967126 30.206514943,120.134626667 30.195352661,120.16196937 30.202458822,120.200921828 30.224085133,120.209726484 30.232198035,120.192901048 30.245079127,120.181423874 30.248801823,120.183499487 30.260157956,120.164232402 30.260472344)))', 'createUser': 'admin', 'maxLat': 30.260532, 'orgInternalCode': '1.1.10.10.', 'updateUser': 'admin' }, 'success': true })
      http.get(api[TRANSFORM_ORG_TO_LONLAT], { orgId }, { timeout: 100000 })
        .then(rst => {
          if (rst.success) {
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getOrgInfoByLanlat({ state }, { lat, lon }) {// eslint-disable-line
    return new Promise((resolve, reject) => {// eslint-disable-line
      http.get(api[TRANSFORM_LONLAT_TO_ORG], { lat, lon })
        .then(rst => {
          if (rst.success) {
            resolve(rst)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getTimestamp({ state }) {// eslint-disable-line
    return new Promise((resolve, reject) => {// eslint-disable-line
      http.get(api[GET_TIMESTAMP])
        .then(rst => {
          if (rst.success) {
            resolve(rst.data)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getPreview({ commit }, params) { // eslint-disable-line
    return new Promise((resolve, reject) => {
      http
        .get(api[GET_PREVIEW], params, { timeout: 200000 })
        .then(rst => {
          if (rst.success) {
            resolve(rst.data)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error.message)
        })
    })
  },
  fetchFirstMenu({ commit }, payload) {
    return new Promise((resolve, reject) => {
      http.get(api[FETCH_SUBMENUlIST_BY_PARENT_ID], payload)
        .then(rst => {
          if (rst.success) {
            commit('FETCH_FIRST_MENU', rst.data)
            resolve(rst.data)
          } else {
            reject(rst.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
        .then(e => console.log(e))
    })
  },
}

// 根据commit更新store
const mutations = {
  updateEnterType(state, type) {
    state.enterType = type
  },
  SET_USERINFO(state, info) {
    state.userInfo = info
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_REMBERINFO(state, info) {
    state.remberInfo = info
  },
  FETCH_MAIN_MENU(state, menu) {
    state.mainMenu = menu
    state.currentCMenu = [{
      parentId: 0,
      menus: [],
    }]
    state.menuMap = {}
  },
  FETCH_CLOUD_EYE_MENU(state, { parentId, menus, parentName }) {
    const { currentCMenu } = state
    const index = _.findIndex(currentCMenu, { parentId })
    if (index >= 0) {
      currentCMenu[index] = { parentId, menus, parentName }
    } else {
      currentCMenu.push({ parentId, menus, parentName })
    }
    state.currentCMenu = _.compact(currentCMenu)
  },
  recordMenu(state, menu) {
    state.menuMap = {
      ...state.menuMap,
      ...menu,
    }
  },
  setPermission(state, { path, permission }) {
    const { menuMap } = state
    menuMap[path] = {
      ...menuMap[path],
      permission,
    }
    state.menuMap = menuMap
  },
  setConf(state, conf) {
    state.config = conf
  },
  FETCH_FIRST_MENU(state, menu) {
    state.currentMenuGroup = menu
  },
}

const getters = {
  lastUserInfo(state) {
    return state.remberInfo
  },
  userToken(state) {
    return state.token
  },
  userInfo(state) {
    return state.userInfo
  },
  mainMenu(state) {
    return state.mainMenu
  },
  currentMenu(state) {
    return state.currentCMenu
  },
  menuMap(state) {
    return state.menuMap
  },
  permission(state) {
    return state.menuMap
  },
  conf(state) {
    return state.config
  },
  currentMenuGroup() {
    return state.currentMenuGroup
  },
  enterType(state) {
    return state.enterType
  },
}

// 导出vuex模块
export default {
  // 模块开启命名空间
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
