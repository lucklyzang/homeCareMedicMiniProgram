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

// 获取用户基本信息
export function getUserMessage() {
  return request({
    url: '/app-api/member/user/get',
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

// 创建医护资质
export function createMedicalCareAptitude(data) {
  return request({
    url: '/app-api/hospital/care-aptitude/create',
    method: 'post',
		data
  })
};

// 更新医护资质
export function uodateMedicalCareAptitude(data) {
  return request({
    url: '/app-api/hospital/care-aptitude/update',
    method: 'put',
		data
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