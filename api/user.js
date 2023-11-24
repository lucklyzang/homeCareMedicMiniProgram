import request from '@/api/request';
import Qs from 'qs'

// 获的banner列表
export function getUserBannerList() {
  return request({
    url: '/app-api/radar/banner/list',
    method: 'get'
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

// 获取用户房间
export function getUserRoom() {
  return request({
    url: '/app-api/member/room/get',
    method: 'get'
  })
};

// 获取用户房间列表
export function getUserRoomList(data) {
  return request({
    url: '/app-api/member/room/list',
    method: 'get',
		params: data
  })
};

// 获取预设房间
export function getUserPresetsRoomList() {
  return request({
    url: '/app-api/member/room/presets-room',
    method: 'get'
  })
};

// 创建用户房间
export function createUserRoom(data) {
  return request({
    url: '/app-api/member/room/create',
    method: 'post',
		data
  })
};

// 更新用户房间
export function updateUserRoom(data) {
  return request({
    url: '/app-api/member/room/update',
    method: 'put',
		data
  })
};

// 删除用户房间
export function deleteUserRoom(data) {
  return request({
    url: '/app-api/member/room/delete',
    method: 'delete',
		params: data
  })
};

// 获取用户家庭
export function getUserFamily() {
  return request({
    url: '/app-api/member/family/get',
    method: 'get'
  })
};

// 获取用户家庭列表
export function getUserFamilyList() {
  return request({
    url: '/app-api/member/family/list',
    method: 'get'
  })
};

// 创建用户家庭
export function createUserFamily(data) {
  return request({
    url: '/app-api/member/family/create',
    method: 'post',
		data
  })
};

// 更新用户家庭
export function updateUserFamily(data) {
  return request({
    url: '/app-api/member/family/update',
    method: 'put',
		data
  })
};

// 删除用户家庭
export function deleteUserFamily(data) {
  return request({
    url: '/app-api/member/family/delete',
    method: 'delete',
		params: data
  })
};

// 新增手机号
export function addMobile(data) {
  return request({
    url: '/app-api/member/family/add-mobile',
    method: 'post',
		data
  })
};

// 修改手机号
export function updateMobile(data) {
  return request({
    url: '/app-api/member/family/update-mobile',
    method: 'put',
		data
  })
};

// 删除手机号
export function deleteMobile(data) {
  return request({
    url: '/app-api/member/family/delete-mobile',
    method: 'delete',
		data
  })
};

// 获取用户设备数量
export function getUserDeviceCount() {
  return request({
    url: '/app-api/member/device-user/device-count',
    method: 'get'
  })
};

// 获取用户设备信息
export function getUserDeviceMessage(data) {
  return request({
    url: '/app-api/member/device-user/devices',
    method: 'get',
		params: data
  })
};

// 获取用户设备和房间列表
export function getUserRoomDevices(data) {
  return request({
    url: '/app-api/member/device-user/room-devices',
    method: 'get',
		params: data
  })
};

// 创建设备和用户绑定
export function createUserDeviceBind(data) {
  return request({
    url: '/app-api/member/device-user/create',
    method: 'post',
		data
  })
};

// 更新设备和用户绑定
export function updateUserDeviceBind(data) {
  return request({
    url: '/app-api/member/device-user/update',
    method: 'put',
		data
  })
};

// 删除设备和用户绑定
export function deleteUserDeviceBind(data) {
  return request({
    url: '/app-api/member/device-user/delete',
    method: 'delete',
		params: data
  })
};

// 获取设备和用户绑定
export function getUserDeviceBind() {
  return request({
    url: '/app-api/member/device-user/get',
    method: 'get'
  })
};

// 创建用户启动数据
export function createUserBootUpData() {
  return request({
    url: '/app-api/member/boot-up/create',
    method: 'post'
  })
};

// 创建页面访问数据
export function createVisitPageData(data) {
  return request({
    url: '/app-api/member/visit-page/create',
    method: 'post',
		data
  })
};

// 退出页面
export function exitPageData(id) {
  return request({
    url: `/app-api/member/visit-page/exit?id=${id}`,
    method: 'post'
  })
};