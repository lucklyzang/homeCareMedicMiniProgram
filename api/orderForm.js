import request from '@/api/request';
import Qs from 'qs'

// 获取订单分页
export function getTradeOrderPage(data) {
  return request({
    url: '/app-api/trade/order/page-care',
    method: 'get',
		params: data
  })
};

// 获取订单详情
export function getOrderDetail(data) {
  return request({
    url: '/app-api/trade/order/get-detail',
    method: 'get',
		params: data
  })
};

// 获取首页实时订单
export function getRealtimeTradeOrderPage(data) {
  return request({
    url: '/app-api/trade/order/real-time',
    method: 'get',
		params: data,
		paramsSerializer: function (params) {
			return Qs.stringify(params, { arrayFormat: "repeat" });  
		}
  })
};

// 护士出发
export function nurseDepart(id) {
  return request({
    url: `/app-api/trade/order/set-out?id=${id}`,
    method: 'put'
  })
};

// 开始服务
export function startServer(data) {
  return request({
    url: '/app-api/trade/order/start',
    method: 'put',
		data
  })
};

// 完成服务
export function completeServer(data) {
  return request({
    url: '/app-api/trade/order/complete',
    method: 'put',
		data
  })
};

// 接受订单
export function acceptTradeOrder(id) {
  return request({
    url: `/app-api/trade/order/accept?id=${id}`,
    method: 'put'
  })
};

// 拒绝订单
export function refuseTradeOrder(id,reason) {
  return request({
    url: `/app-api/trade/order/refuse?id=${id}&reason=${reason}`,
    method: 'put'
  })
};