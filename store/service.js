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
		},
		tradeStatisticsMessage: (state) => {
			state.tradeStatisticsMessage = getCache('tradeStatisticsMessage') ? getCache('tradeStatisticsMessage') : {};
			return state.tradeStatisticsMessage
		},
		selectedBankMessage: (state) => {
			state.selectedBankMessage = getCache('selectedBankMessage') ? getCache('selectedBankMessage') : {};
			return state.selectedBankMessage
		},
		selectBannerMessage: state => state.selectBannerMessage
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
		// 保存我的页面交易数据统计信息
		storeTradeStatisticsMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('tradeStatisticsMessage', playLoad);
				state.tradeStatisticsMessage = playLoad
			}
		},
		// 保存选中的银行卡信息
		storeSelectedBankMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('selectedBankMessage', playLoad);
				state.selectedBankMessage = playLoad
			}
		},
		//重置设备的状态
		resetServiceInfoState(state) {
				Object.assign(state, getDefaultServiceState())
		},
		//保存选中的首页banner信息
		changeSelectBannerMessage (state, playLoad) {
			state.selectBannerMessage = playLoad
		}
  },
  actions: {
		resetServiceState({ commit }) {
				commit('resetServiceInfoState')
		}
	}
}