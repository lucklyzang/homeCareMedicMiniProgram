import axios from 'axios-miniprogram'
import store from '@/store'
import Qs from 'qs'
import { setCache, getCache, removeAllLocalStorage } from '@/common/js/utils'
const instance = axios.create({
	// 生产域名 https://blinktech.cn/nblink
	// 开发域名 https://blink.blinktech.cn/nblink
	// 准生产域名 https://ver.blinktech.cn/nblink
	// 测试域名 https://show.blinktech.cn/nblink
  baseURL: 'https://blink.blinktech.cn/radar',
	retry: 3, // 网络请求异常后，重试次数 
	retryDelay: 1000, // 每次重试间隔时间
	timeout: 30000,
  headers: {
    // common: {    
    //   'Accept': 'application/json, test/plain,'
    // }
    // post: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    // }
  }
});

// 计算是否快要过期
const isTokenExpired = () => {
    const expireTime = new Date(store.getters.userInfo['expiresTime']).getTime();
    const timeDifference = expireTime - Date.now();
    if (expireTime && timeDifference < 60000) {
        return true
    };
    return false
};

// 是否正在刷新的标记 -- 防止重复发出刷新token接口--节流阀
let isRefreshing = false;

// 失效后同时发送请求的容器 -- 缓存接口
let subscribers = [];

// 刷新 token 后, 将缓存的接口重新请求一次
function onAccessTokenFetched(newToken) {
	subscribers.forEach((callback) => {
			callback(newToken)
	});
	// 清空缓存接口
	subscribers = []
};

// 添加缓存接口
function addSubscriber(callback) {
    subscribers.push(callback)
};

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
	config.headers['tenant-id'] = 1;
  if (config['url'] == 'auth/login') {
  	config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  };
	// 请求头添加token
	if (store.getters.token) {
	  config.headers['Authorization'] = `Bearer ${store.getters.token}`
	};
	if (isTokenExpired() && store.getters.userInfo['refreshToken'] && store.getters.isLogin) {
	 // 如果token快过期了
	 if (!isRefreshing) { // 控制重复获取token
			 isRefreshing = true;
			 axios({
				headers: {
					'tenant-id': 1
				},
				baseURL: 'https://blink.blinktech.cn/radar',
				method: 'post',
				url: `app-api/member/auth/refresh-token?refreshToken=${store.getters.userInfo['refreshToken']}`
			 }).then(res => {
				if (res && res.data.code === 0) {
					isRefreshing = false;
					const result = res.data.data;
					// token存储到vuex
					if (result) {
						// token信息存入store
						store.commit('changeToken',result.accessToken);
						// 登录用户信息存入store
						store.commit('storeUserInfo',result);
						onAccessTokenFetched(result.accessToken)
					}
				} else {
					// 清空store和localStorage
					removeAllLocalStorage();
					store.dispatch('resetServiceState');
					store.dispatch('resetLoginState');
					uni.redirectTo({
						url: '/pages/login/login'
					}); // 失败就跳转登陆
					isRefreshing = true
				}
			}).catch((err) => {
				// 清空store和localStorage
				removeAllLocalStorage();
				store.dispatch('resetServiceState');
				store.dispatch('resetLoginState');
				uni.redirectTo({
					url: '/pages/login/login'
				}); // 失败就跳转登陆
				isRefreshing = true
			})
	};
	// 将其他接口缓存起来 -- 这个Promise函数很关键
	const retryRequest = new Promise((resolve) => {
		// 这里是将其他接口缓存起来的关键, 返回Promise并且让其状态一直为等待状态,
		// 只有当token刷新成功后, 就会调用通过addSubscriber函数添加的缓存接口,
		// 此时, Promise的状态就会变成resolve
		addSubscriber((newToken) => {
			// 表示用新的token去替换掉原来的token
			config.headers['Authorization'] = `Bearer ${newToken}`;
			// 替换掉url -- 因为baseURL会扩展请求url
			config.url = config.url.replace(config.baseURL, '');
			// 返回重新封装的config, 就会将新配置去发送请求
			resolve(config)
		})
	});
	return retryRequest
 };
 return config;
}, function (error) {
  //处理请求错误
  return Promise.reject(error.response);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
	if (response.headers['token']) {
		store.commit('changeToken', response.headers['token']);
		setCache('token', response.headers['token'])
	};
	if (response.data.code == '401') {
		// 清空store和localStorage
		removeAllLocalStorage();
		store.dispatch('resetServiceState');
		store.dispatch('resetLoginState');
		if (!store.getters.overDueWay) { 
			uni.showToast({
				title: 'token已过期,请重新登录!',
				duration: 1000
			});
			setTimeout(() => {
				uni.redirectTo({
				 url: '/pages/login/login'
				})
			},2000);
		 } else {
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}
	};
	return response
}, function (error) {
	if (Object.prototype.toString.call(error.response) === '[object Object]') {
		if (error.response.hasOwnProperty('status')) {
			if (error.response.status === 401) {
				// 清空store和localStorage
				removeAllLocalStorage();
				store.dispatch('resetServiceState');
				store.dispatch('resetLoginState');
				if (!store.getters.overDueWay) { 
					uni.showToast({
						title: 'token已过期,请重新登录!',
						duration: 1000
					});
					setTimeout(() => {
						uni.redirectTo({
						 url: '/pages/login/login'
						})
					},2000);
				 } else {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
			}
		}
	};		
  // 处理响应错误
	var config = error.config;
	// 判断是否配置了重试
	if(!config || !config.retry) {
		if (Object.prototype.toString.call(error.response) === '[object Object]') {
			if (error.response.hasOwnProperty('data')) {
				if (error.response.data.hasOwnProperty('msg')) {
					return Promise.reject(error.response.data.msg)
				} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
					return Promise.reject(error.response.data)
				}
			} else {
				return Promise.reject(error.response)
			}
		}	else {
			return Promise.reject(error)
		}
	};
	if(!config.shouldRetry || typeof config.shouldRetry != 'function') {
		if (Object.prototype.toString.call(error.response) === '[object Object]') {
			if (error.response.hasOwnProperty('data')) {
				if (error.response.data.hasOwnProperty('msg')) {
					return Promise.reject(error.response.data.msg)
				} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
					return Promise.reject(error.response.data)
				}
			} else {
				return Promise.reject(error.response)
			}
		}	else {
			return Promise.reject(error)
		}
	};
	//判断是否满足重试条件
	if(!config.shouldRetry(error)) {
		if (Object.prototype.toString.call(error.response) === '[object Object]') {
			if (error.response.hasOwnProperty('data')) {
				if (error.response.data.hasOwnProperty('msg')) {
					return Promise.reject(error.response.data.msg)
				} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
					return Promise.reject(error.response.data)
				}
			} else {
				return Promise.reject(error.response)
			}
		}	else {
			return Promise.reject(error)
		}
	};
	// 设置重置次数，默认为0
	config.__retryCount = config.__retryCount || 0;
	// 判断是否超过了重试次数
	 if(config.__retryCount > config.retry) {
		 if (Object.prototype.toString.call(error.response) === '[object Object]') {
		 	if (error.response.hasOwnProperty('data')) {
		 		if (error.response.data.hasOwnProperty('msg')) {
		 			return Promise.reject(error.response.data.msg)
		 		} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
		 			return Promise.reject(error.response.data)
		 		}
		 	} else {
		 		return Promise.reject(error.response)
		 	}
		 }	else {
		 	return Promise.reject(error)
		 }
	 };
	//重试次数自增
	config.__retryCount += 1;
	//延时处理
	var backoff = new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, config.retryDelay || 1);
	});
	//重新发起axios请求
	return backoff.then(function() {
		return service(config);
	})
});

export default instance