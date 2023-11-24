import { setCache, getCache } from '@/common/js/utils'
import { getDefaultLoginState } from '@/common/js/resetStore/resetStore.js'
export default {	
	state: getDefaultLoginState(),
	getters: {
		 userInfo:(state) => {
			state.userInfo = getCache('userInfo') ? getCache('userInfo') : {};
			return state.userInfo
		},
		isLogin: (state) => {
			state.isLogin = getCache('isLogin') ? getCache('isLogin') === 'false' ? false : true : false;
			return state.isLogin
		},
		token:(state) => {
			state.token = getCache('token') ? getCache('token') : null;
			return state.token
		},
		userBasicInfo:(state) => {
			state.userInfo = getCache('userBasicInfo') ? getCache('userBasicInfo') : {};
			return state.userBasicInfo
		},
		overDueWay: state => state.overDueWay
	},
	mutations: {
		storeUserInfo(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('userInfo', playLoad);
				state.userInfo = playLoad
			}
		},
		// 存储用户基本信息
		changeUserBasicInfo(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('userBasicInfo',playLoad);
				state.userBasicInfo = playLoad
			}
		},
		// 修改token状态
		changeToken(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('token', playLoad);
				state.token = playLoad
			}
		},
		// 修改是否登录状态
		changeIsLogin(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('isLogin', playLoad);
				state.isLogin = playLoad
			}
		},
		// 修改过期方式
		changeOverDueWay(state, playLoad) {
			state.overDueWay = playLoad
		},
		//重置登录信息的状态
		resetLoginInfoState(state) {
				Object.assign(state, getDefaultLoginState())
		}
	},
	actions: {
		resetLoginState({ commit }) {
			commit('resetLoginInfoState')
		}
	}
}
