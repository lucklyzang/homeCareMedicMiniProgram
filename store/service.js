import { getDefaultServiceState } from '@/common/js/resetStore/resetStore.js'
import { setCache, getCache } from '@/common/js/utils'
export default {
  state: getDefaultServiceState(),
  getters:{
		timeMessage: state => state.timeMessage,
		ossMessage: state => state.ossMessage,
		editServiceOrderFormSureChooseMessage: (state) => {
			state.editServiceOrderFormSureChooseMessage = getCache('editServiceOrderFormSureChooseMessage') ? getCache('editServiceOrderFormSureChooseMessage') : {};
			return state.editServiceOrderFormSureChooseMessage
		}
  },
  mutations:{
		changeTimeMessage (state, playLoad) {
			state.timeMessage = playLoad
		},
		changeOssMessage (state, playLoad) {
			state.ossMessage = playLoad
		},
		// 保存订单修改页面选择的信息
		storeEditServiceOrderFormSureChooseMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('editServiceOrderFormSureChooseMessage', playLoad);
				state.editServiceOrderFormSureChooseMessage = playLoad
			}
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