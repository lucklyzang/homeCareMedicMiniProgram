// 登录信息store的初始值
export function getDefaultLoginState() {
	return {
		userInfo: {},
		token: null, //请求token,
		isLogin: false,
		overDueWay: false,
		userBasicInfo: null,
		nurseRankDictData: [],
		socketOpen: false
	}	
};

// 服务store的初始值
export function getDefaultServiceState() {
	return {
		serviceOrderFormSureChooseMessage: {},
		editServiceOrderFormSureChooseMessage: {},
		tradeStatisticsMessage: {},
		tradeorderSearchMessage: {},
		selectedBankMessage: {},
		selectBannerMessage: {}
	}	
};