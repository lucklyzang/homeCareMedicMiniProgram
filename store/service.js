import { getDefaultServiceState } from '@/common/js/resetStore/resetStore.js'
import { setCache, getCache } from '@/common/js/utils'
export default {
  state: getDefaultServiceState(),
  getters:{
		timeMessage: state => state.timeMessage,
		ossMessage: state => state.ossMessage
  },
  mutations:{
		changeTimeMessage (state, playLoad) {
			state.timeMessage = playLoad
		},
		changeOssMessage (state, playLoad) {
			state.ossMessage = playLoad
		},
		//重置设备的状态
		resetServiceInfoState(state) {
				Object.assign(state, getDefaultServiceState())
		}
  },
  actions: {
		resetServiceState({ commit }) {
				commit('resetServiceInfoState')
		}
	}
}