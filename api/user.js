import request from '@/api/request';
import Qs from 'qs'

// 获的banner列表
export function getUserBannerList(data) {
  return request({
    url: '/app-api/promotion/banner/list',
    method: 'get',
		params: data
  })
};


// 获取商品分类(服务类别首页筛选)
export function getServiceProductCategory() {
  return request({
    url: '/app-api/product/category/list',
    method: 'get'
  })
}

// 获取商品分类(服务项目首页筛选)
export function getServiceProductSimpleList() {
  return request({
    url: '/app-api/product/spu/get-simple-list',
    method: 'get'
  })
}

// 获取医护信息(当前登录医护)
export function getUserMessage() {
  return request({
    url: '/app-api/hospital/medical-care/info',
    method: 'get'
  })
};

// 修改用户信息
export function updateUserMessage(data) {
  return request({
    url: '/app-api/member/user/update',
    method: 'post',
		data
  })
};

// 修改用户头像
export function updateUserAvatar(data) {
  return request({
    url: '/app-api/member/user/update-avatar',
    method: 'post',
		data
  })
};

// 新增手机号
export function addMobile(data) {
  return request({
    url: '/app-api/member/user/add-mobile',
    method: 'post',
		data
  })
};

// 修改手机号
export function updateMobile(data) {
  return request({
    url: '/app-api/member/user/update-mobile',
    method: 'put',
		data
  })
};

// 删除手机号
export function deleteMobile(data) {
  return request({
    url: '/app-api/member/user/delete-mobile',
    method: 'delete',
		data
  })
};

// 创建报警信息
export function createCallPolice(data) {
  return request({
    url: '/app-api/hospital/call-police/create',
    method: 'post',
		data
  })
};

// 创建资讯收藏
export function createInformationFavorite(data) {
  return request({
    url: '/app-api/promotion/information/add/collect',
    method: 'post',
		data
  })
}

// 取消资讯收藏
export function deleteInformationFavorite(data) {
  return request({
    url: '/app-api/promotion/information/delete/collect',
    method: 'post',
		data
  })
}

// 获取我的收藏列表
export function myCollectInformationList(data) {
  return request({
    url: '/app-api/promotion/information/page/favorites',
    method: 'get',
		params: data
  })
}

// 医护实名认证
export function medicalCareRealName(data) {
  return request({
    url: '/app-api/hospital/medical-care/real-name',
    method: 'put',
		data
  })
};

// 医护信息完善
export function medicalCarePerfect(data) {
  return request({
    url: '/app-api/hospital/medical-care/perfect',
    method: 'put',
		data
  })
};

// 获得医护资质
export function getMedicalCareAptitude(data) {
  return request({
    url: '/app-api/hospital/care-aptitude/get',
    method: 'post',
		data
  })
};

// 获得医护资质列表
export function getMedicalCareAptitudeList(data) {
  return request({
    url: '/app-api/hospital/aptitude/list',
    method: 'get'
  })
};

// 获得组织机构列表
export function getOrganizationList(data) {
  return request({
    url: '/app-api/system/organization/list',
    method: 'get'
  })
};

// 查询医护详细信息
export function getMedicalCareDetails(data) {
  return request({
    url: '/app-api/hospital/medical-care/detail',
    method: 'get'
  })
};

// 创建医护资质
export function createMedicalCareAptitude(data) {
  return request({
    url: '/app-api/hospital/care-aptitude/create',
    method: 'post',
		data
  })
};

// 更新医护资质
export function updateMedicalCareAptitude(data) {
  return request({
    url: '/app-api/hospital/care-aptitude/update',
    method: 'put',
		data
  })
};

// 是否接收派单
export function medicalCareReceive(receive) {
  return request({
    url: `/app-api/hospital/medical-care/receive?receive=${receive}`,
    method: 'put'
  })
};

// 查询医护是否可以接单
export function medicalCareHasAuth(receive) {
  return request({
    url: '/app-api/hospital/medical-care/has-auth',
    method: 'get'
  })
};


// 创建意见反馈
export function createFeedback(data) {
  return request({
    url: '/app-api/hospital/feedback/create',
    method: 'post',
		data
  })
};

// 更新意见反馈
export function updateFeedback(data) {
  return request({
    url: '/app-api/hospital/feedback/update',
    method: 'put',
		data
  })
};

// 查询交易统计数据
export function tradeStatistics(receive) {
  return request({
    url: '/app-api/statistics/trade/trend/summary',
    method: 'get'
  })
};

// 标记站内信为已读(通知)
export function updateNotifymessageRead(ids) {
  return request({
    url: `/app-api/system/notify-message/update-read?ids=${ids}`,
    method: 'put'
  })
}

// 查询通知概要
export function notifyMessageSummary() {
  return request({
    url: '/app-api/system/notify-message/summary',
    method: 'get'
  })
}

// 获得我的通知信息分页
export function notifyMessageSummaryPage(data) {
  return request({
    url: '/app-api/system/notify-message/my-page',
    method: 'get',
		params: data
  })
}

// 标记公告为已读
export function updateNotifyRead(id) {
  return request({
    url: `/app-api/system/notice/update-read?id=${id}`,
    method: 'put'
  })
}

// 查询公告概要
export function notifySummary(data) {
  return request({
    url: '/app-api/system/notice/summary',
    method: 'get',
		params: data
  })
}

// 获得公告信息分页
export function notifySummaryPage(data) {
  return request({
    url: '/app-api/system/notice/page',
    method: 'get',
		params: data
  })
}

// 获取最新一条未读资讯
export function latestNews(data) {
  return request({
    url: '/app-api/promotion/information/get/latest/summary',
    method: 'get',
		params: data
  })
}

// 获取资讯分页
export function newsPage(data) {
  return request({
    url: '/app-api/promotion/information/page',
    method: 'get',
		params: data
  })
}

// 资讯标记已读
export function updateNewsRead(data) {
  return request({
    url: '/app-api/promotion/information/update/read',
    method: 'put',
		data
  })
}

// 近期账单
export function recentNurseBill() {
  return request({
    url: '/app-api/trade/nurse-bill/recent',
    method: 'get'
  })
}

// 账单分页
export function nurseBillPage(data) {
  return request({
    url: '/app-api/trade/nurse-bill/page',
    method: 'get',
		params: data
  })
}

// 创建提现银行卡
export function createCareBankCard(data) {
  return request({
    url: '/app-api/hospital/care-bank-card/create',
    method: 'post',
		data
  })
};

// 获得提现银行卡列表
export function getCareBankCardList(data) {
  return request({
    url: '/app-api/hospital/care-bank-card/list',
    method: 'get',
		params: data
  })
};

// 获取交易日数据
export function getDayOrderStatistics(data) {
  return request({
    url: '/app-api/statistics/order/day',
    method: 'get',
		params: data
  })
};

// 获取交易周数据
export function getWeekOrderStatistics(data) {
  return request({
    url: '/app-api/statistics/order/week',
    method: 'get',
		params: data
  })
};

// 获取交易月数据
export function getMonthOrderStatistics(data) {
  return request({
    url: '/app-api/statistics/order/month',
    method: 'get',
		params: data
  })
};

// 获取资讯详情
export function getNewsDetails(data) {
  return request({
    url: '/app-api/promotion/information/getDetails',
    method: 'get',
		params: data
  })
}

// 获取帮助中心列表
export function getsystemHelpCenter(data) {
  return request({
    url: '/app-api/system/help-center/page',
    method: 'get',
		params: data
  })
}