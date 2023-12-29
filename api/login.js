import request from '@/api/request';

// 账号密码登录
export function logIn(data) {
	return request({
	    url: '/app-api/member/auth/login',
	    method: 'post',
	    data
	  })
}

// 账号验证码登录
export function logInByCode(data) {
	return request({
	    url: '/app-api/member/auth/sms-login',
	    method: 'post',
	    data
	  })
}

// 发送手机验证码
export function sendPhoneCode(data) {
	return request({
	    url: '/app-api/member/auth/send-sms-code',
	    method: 'post',
	    data
	  })
}

// 重置密码
export function resetPassword(data) {
	return request({
	    url: '/app-api/member/user/reset-password',
	    method: 'put',
	    data
	  })
}

// 设置密码
export function setPassword(data) {
	return request({
	    url: '/app-api/member/user/set-password',
	    method: 'post',
	    data
	  })
}

// 用户退出登录
export function userSignOut() {
  return request({
    url: '/app-api/member/auth/logout',
    method: 'post'
  })
};

// 微信登录
export function weixinLogIn(code) {
	return request({
	    url: `login/wx/${code}`,
	    method: 'get'
	})
}

// 微信小程序一键登录
export function weixinMiniAppLogin(data) {
	return request({
	    url: '/app-api/member/auth/weixin-mini-app-login',
	    method: 'post',
			data
	})
}

// 根据字典类型查询字典数据信息
export function getUserDictData(data) {
  return request({
    url: '/app-api/system/dict-data/type',
    method: 'get',
		params: data
  })
}
