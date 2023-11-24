// 设备信息store的初始值
export function getDefaultServiceState() {
    return {
			timeMessage: {},
			ossMessage: {}
		}	
};

// 登录信息store的初始值
export function getDefaultLoginState() {
	return {
		userInfo: {},
		token: null, //请求token,
		isLogin: false,
		overDueWay: false,
		userBasicInfo: null
	}	
};