<template>
	<view class="content-box">
		<!-- 订单服务操作弹框 -->
		<view class="order-form-details-dialog-box">
			<u-popup :show="orderFormDetailsDialogShow" @close="orderFormDetailsDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="accept-order-date">
					<view class="accept-order-date-title">
						<text>接受服务订单时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(currentSelectOrderMessage.acceptTime),4) }}</text>
					</view>
				</view>
				<view class="accept-order-date" v-if="currentSelectOrderMessage.status >= 40 && currentSelectOrderMessage.status <= 60">
					<view class="accept-order-date-title">
						<text>出发时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(currentSelectOrderMessage.setOutTime),4) }}</text>
					</view>
				</view>
				<view class="accept-order-date" v-if="currentSelectOrderMessage.status == 50 || currentSelectOrderMessage.status == 60">
					<view class="accept-order-date-title">
						<text>开始服务时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(currentSelectOrderMessage.startTime),4) }}</text>
					</view>
				</view>
				<view class="accept-order-date" v-if="currentSelectOrderMessage.status == 60">
					<view class="accept-order-date-title">
						<text>完成服务时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(currentSelectOrderMessage.completeTime),4) }}</text>
					</view>
				</view>
				<view class="btn-area" v-if="currentSelectOrderMessage.status <= 50">
					<text v-if="currentSelectOrderMessage.status == 30" @click="departSureEvent">立即出发</text>
					<text v-if="currentSelectOrderMessage.status == 40" @click="startSureEvent">开始服务</text>
					<text v-if="currentSelectOrderMessage.status == 50" @click="completeSureEvent">完成服务</text>
					<text>{{ getNowFormatDate(new Date(),1) }}</text>
				</view>
				<view class="bottom-info-area" v-if="currentSelectOrderMessage.status <= 50">
					<image src="@/static/img/view-order-form-details-bottom-icon-one.png"></image>
					<image src="@/static/img/view-order-form-details-bottom-icon-two.png"></image>
					<text>已进入服务范围</text>
					<text>重新定位</text>
				</view>
			</u-popup>
		</view>
		<!-- 拒绝订单原因弹框 -->
		<view class="refuse-order-form-dialog-box">
			<u-popup :show="refuseOrderFormDialogShow" @close="refuseOrderFormDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="top-title">
					<text>选择拒绝原因</text>
				</view>
				<view class="center-content">
					<u-radio-group
							v-model="checkReasonValue"
							placement="column"
							shape="square"
							@change="checkboxReasonChange"
						>
							<u-radio
								:customStyle="{marginBottom: '8px'}"
								v-for="(item, index) in checkboxReasonList"
								:key="index"
								:label="item.name"
								:name="item.name"
							>
							</u-radio>
					</u-radio-group>
				</view>
				<view class="bottom-btn">
					<view class="sure-btn" @click="sureRefuseEvent">
						<text>确定</text>
					</view>
					<view class="cancel-btn" @click="refuseOrderFormDialogShow = false">
						<text>取消</text>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 拒绝成功弹框 -->
		<view class="refuse-order-form-success-dialog-box">
			<u-popup :show="refuseOrderFormSuccessDialogShow" @close="refuseOrderFormSuccessDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<image src="@/static/img/refuse-order-form-success.png"></image>
				<view class="operation-success-title">
					<text>操作成功</text>
				</view>
				<view class="operation-success-content">
					<text>已成功拒绝订单，请到详情中查看</text>
				</view>
				<view class="operation-success-btn" @click="refuseOrderFormSuccessDialogShow = false">
					<text>确定</text>
				</view>
			</u-popup>
		</view>
		<!-- 接单成功弹框 -->
		<view class="accept-order-form-success-dialog-box">
			<u-popup :show="acceptOrderFormSuccessDialogShow" @close="acceptOrderFormSuccessDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<image src="@/static/img/accept-order-form-success.png"></image>
				<view class="accept-success-title">
					<text>接单成功</text>
				</view>
				<view class="operation-success-btn" @click="acceptOrderFormSuccessDialogShow = false">
					<text>确定</text>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast" />
		<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="我的订单">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="order-form-tabs">
			<u-tabs :list="list" :current="current" @change="change"
				lineWidth="50"
				lineColor="#5064EB"
				:activeStyle="{
					color: '#5064EB'
				}"
				:inactiveStyle="{
					color: '#444444'
				}"
			></u-tabs>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 0">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="order-form-title">
							<text>{{ item.items[0]['spuName'] }}</text>
						</view>
						<view class="order-form-status">
							<text>{{ transitionOrderStatusText(item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="88" height="88">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="brotected-person">
								<text>被护人</text>
								<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
							</view>
							<view class="service-address">
								<text>服务地址</text>
								<text>{{ item.receiverDetailAddress }}</text>
							</view>
							<view class="expectation-date">
								<text>期望时间</text>
								<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-left">
							<text>申请时间:</text>
							<text>{{ getNowFormatDate(new Date(item.createTime),4) }}</text>
						</view>
						<view class="consumption-rental-right">
							<text>￥:</text>
							<text>{{ `${item.payPrice}` }}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-left">
							<text v-if="item.status > 20 && item.status < 60">联系被护人</text>
						</view>
						<view class="btn-area-right">
							<text v-if="item.status == 20" @click.stop="refuseOrderFormEvent(item)">拒绝订单</text>
							<text class="accept-payment" v-if="item.status == 20" @click.stop="acceptOrderFormEvent(item)">接受订单</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 1">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="order-form-title">
							<text>{{ item.items[0]['spuName'] }}</text>
						</view>
						<view class="order-form-status" :class="{'serviceStyle' : item.status == 50}">
							<text>{{ transitionOrderStatusText(item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="88" height="88">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="brotected-person">
								<text>被护人</text>
								<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
							</view>
							<view class="service-address">
								<text>服务地址</text>
								<text>{{ item.receiverDetailAddress }}</text>
							</view>
							<view class="expectation-date">
								<text>期望时间</text>
								<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-left">
							<text>申请时间:</text>
							<text>{{ getNowFormatDate(new Date(item.createTime),4) }}</text>
						</view>
						<view class="consumption-rental-right">
							<text>￥:</text>
							<text>{{ `${item.payPrice}` }}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-left">
							<text v-if="item.status > 20 && item.status < 60">联系被护人</text>
						</view>
						<view class="btn-area-right">
							<text class="accept-payment" v-if="item.status == 30" @click.stop="departEvent(item)">立即出发</text>
							<text class="accept-payment" v-if="item.status == 40" @click.stop="startEvent(item)">开始服务</text>
							<text class="accept-payment" v-if="item.status == 50" @click.stop="completeEvent(item)">完成服务</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 2">
			<u-empty text="您还没有相关订单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="order-form-list" v-for="(item,index) in fullTradeList" :key="index" @click="enterOrderDetailsEvent(item)">
					<view class="order-form-top">
						<view class="order-form-title">
							<text>{{ item.items[0]['spuName'] }}</text>
						</view>
						<view class="order-form-status" :class="{'serviceStyle' : item.status == 50,'completeStyle' : item.status == 60}">
							<text>{{ transitionOrderStatusText(item) }}</text>
						</view>
					</view>
					<view class="order-form-center">
						<view class="order-form-center-left">
							<u-image :src="item.items[0]['picUrl']" width="88" height="88">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
						<view class="order-form-center-right">
							<view class="brotected-person">
								<text>被护人</text>
								<text>{{ `${item.servicePerson.name} ${item.servicePerson.age}岁` }}</text>
							</view>
							<view class="service-address">
								<text>服务地址</text>
								<text>{{ item.receiverDetailAddress }}</text>
							</view>
							<view class="expectation-date">
								<text>期望时间</text>
								<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
							</view>
						</view>
					</view>
					<view class="consumption-rental">
						<view class="consumption-rental-left">
							<text>申请时间:</text>
							<text>{{ getNowFormatDate(new Date(item.createTime),4) }}</text>
						</view>
						<view class="consumption-rental-right">
							<text>￥:</text>
							<text>{{ `${item.payPrice}` }}</text>
						</view>
					</view>
					<view class="order-form-bottom">
						<view class="btn-area-left">
							<text v-if="item.status > 20 && item.status < 60">联系被护人</text>
						</view>
						<view class="btn-area-right">
							<text v-if="item.status == 20" @click.stop="refuseOrderFormEvent(item)">拒绝订单</text>
							<text class="accept-payment" v-if="item.status == 20" @click.stop="acceptOrderFormEvent(item)">接受订单</text>
							<text class="accept-payment" v-if="item.status == 30" @click.stop="departEvent(item)">立即出发</text>
							<text class="accept-payment" v-if="item.status == 40" @click.stop="startEvent(item)">开始服务</text>
							<text class="accept-payment" v-if="item.status == 50" @click.stop="completeEvent(item)">完成服务</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { getTradeOrderPage, nurseDepart, startServer, completeServer, acceptTradeOrder, refuseTradeOrder } from '@/api/orderForm.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				loginBackgroundPng: require("@/static/img/login-background.png"),
				infoText: '加载中···',
				showLoadingHint: false,
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				status: 'nomore',
				tradeList: [],
				fullTradeList: [],
				orderFormDetailsDialogShow: false,
				refuseOrderFormDialogShow: false,
				refuseOrderFormSuccessDialogShow: false,
				acceptOrderFormSuccessDialogShow: false,
				checkReasonValue: '',
				currentSelectOrderMessage: {},
				refundReason: '',
				isShowNoData: false,
				checkboxReasonList: [
					{
						name: '专业知识太强做不到',
						disabled: false
					},
					{
						name: '距离太远时间来不及了',
						disabled: false
					},
					{
						name: '晚上有约会',
						disabled: false
					}
				],
				list: [
					{
						name: '待处理',
					},
					{
						name: '服务中',
					},
					{
						name: '全部',
					}
				],
				current: 0
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo',
				'editServiceOrderFormSureChooseMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			if (this.editServiceOrderFormSureChooseMessage.hasOwnProperty('current')) {
				this.current = this.editServiceOrderFormSureChooseMessage.current;
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					status: this.transitionOrderStatus(this.editServiceOrderFormSureChooseMessage.current)
				},true)
			}	else {
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					status: 0
				},true)
			}
		},
		methods: {
			...mapMutations([
				'storeEditServiceOrderFormSureChooseMessage'
			]),
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 2(只展示月)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator1 = "月";
				let seperator2 = "日";
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 2) {
					currentdate = month + seperator1
				} else {
					currentdate = month + seperator1 + strDate + seperator2
				};
				return currentdate
			},
			
			// 判断周几
			judgeWeek (currentDate) {
				let date = new Date(currentDate);
				let day = date.getDay();
				switch (day) {
					case 0:
						return "周日"
						break;
					case 1:
						return "周一"
						break;
					case 2:
						return "周二"
						break;
					case 3:
						return "周三"
						break;
					case 4:
						return "周四"
						break;
					case 5:
						return "周五"
						break;
					case 6:
						return "周六"
						break
					}
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryTradeOrderPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						status: this.transitionOrderStatus(this.current)
					},false)
				}
			},
			
			// 查询交易订单
			queryTradeOrderPage(data,flag) {
				this.tradeList = [];
				this.isShowNoData = false;
				if (flag) {
					this.fullTradeList = [];
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getTradeOrderPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						// 将当前存储的订单切换类型重置为0
						let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
						temporaryEditServiceOrderFormSureChooseMessage['current'] = 0;
						this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
						this.totalCount = res.data.data.total;
						this.tradeList = res.data.data.list;
						// 切换到待评价订单时只展示待评价的订单(已评价和已完成订单状态都是3)
						if (res.data.data.list.length > 0) {
							if (this.current == 4) {
								this.tradeList = this.tradeList.filter((item) => { return item.commentStatus == false })
							};
							this.tradeList.forEach((item) => {
								return item.payPrice = fenToYuan(item.payPrice)
							});
						};
						this.fullTradeList = this.fullTradeList.concat(this.tradeList);
						if (this.fullTradeList.length == 0) {
							this.isShowNoData = true
						} else {
							this.isShowNoData = false
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false;
					} else {
						let totalPage = Math.ceil(this.totalCount/this.pageSize);
						if (this.currentPage >= totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore';
						}	
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false;
					} else {
						this.status = 'loadmore'
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 订单类型切换事件
			change(index) {
				this.current = index.index;
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoData = false;
				this.fullTradeList = [];
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					status: this.transitionOrderStatus(this.current)
				},true)
			},
			
			// 变更查询订单状态参数
			transitionOrderStatus(status) {
				switch(status) {
				  case 0 :
					return 0
					break;
				  case 1 :
					return 1
					break;
				  case 2 :
					return ''
					break
				}
			},
			
			// 转换订单状态
			transitionOrderStatusText(item) {
				let temporaryWorkerStatus = item.status.toString();
				// 待处理类型的订单下包含2子状态(20-待接单 30-待出发)
				if (this.current == 0) {
					switch(temporaryWorkerStatus) {
						case '20' :
						return '待接单'
						break;
						case '30' :
						return '待出发'
						break
					}	
				};
				// 服务中类型的订单下包含2个子状态(40-待服务 50-服务中)
				if (this.current == 1) {
					switch(temporaryWorkerStatus) {
						case '40' :
						return '待服务'
						break;
						case '50' :
						return '服务中'
						break;
					}	
				};
				switch(temporaryWorkerStatus) {
					case '20' :
					return '待接单'
					break;
					case '30' :
					return '待出发'
					break;
					case '40' :
					return '待服务'
					break;
					case '50' :
					return '服务中'
					break;
					case '60' :
					return '已完成'
					break;
					case '70' :
					return '已取消'
					break;
					case '80' :
					return '已拒绝'
					break;
				}	
			},
			
			// 接受订单事件
			acceptOrderFormEvent(item) {
				this.infoText = '订单接受中···';
				this.showLoadingHint = true;
				acceptTradeOrder(item.id).then((res) => {
					if ( res && res.data.code == 0) {
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.acceptOrderFormSuccessDialogShow = true;
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 拒绝订单事件
			refuseTradeOrderEvent(id,reason) {
				this.infoText = '订单拒绝中···';
				this.showLoadingHint = true;
				refuseTradeOrder(id,reason).then((res) => {
					if ( res && res.data.code == 0) {
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.refuseOrderFormSuccessDialogShow = true;
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 选择原因弹框值变化事件
			checkboxReasonChange (n) {
				console.log('change');
			},
			
			// 拒绝订单事件
			refuseOrderFormEvent (item) {
				this.refuseOrderFormDialogShow = true;
				this.currentSelectOrderMessage = item
			},
			
			// 确定拒绝事件
			sureRefuseEvent () {
				this.refuseOrderFormDialogShow = false;
				this.refuseTradeOrderEvent(this.currentSelectOrderMessage.id,this.checkReasonValue)
			},
			
			// 立即出发事件
			departEvent(item) {
				this.orderFormDetailsDialogShow = true;
				this.currentSelectOrderMessage = item;
			},
			
			// 立即出发确定事件
			departSureEvent () {
				this.infoText = '出发中···';
				this.showLoadingHint = true;
				nurseDepart(this.currentSelectOrderMessage.id).then((res) => {
					if ( res && res.data.code == 0) {
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.orderFormDetailsDialogShow = false;
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.orderFormDetailsDialogShow = false;
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 开始服务事件
			startEvent(item) {
				this.orderFormDetailsDialogShow = true;
				this.currentSelectOrderMessage = item;
			},
			
			// 开始服务确定事件
			startSureEvent () {
				this.infoText = '开始服务中···';
				this.showLoadingHint = true;
				startServer(this.currentSelectOrderMessage.id).then((res) => {
					if ( res && res.data.code == 0) {
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.orderFormDetailsDialogShow = false;
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.orderFormDetailsDialogShow = false;
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 完成服务事件
			completeEvent(item) {
				this.orderFormDetailsDialogShow = true;
				this.currentSelectOrderMessage = item;
			},
			
			// 完成服务确定事件
			completeSureEvent () {
				this.infoText = '完成服务中···';
				this.showLoadingHint = true;
				completeServer(this.currentSelectOrderMessage.id).then((res) => {
					if ( res && res.data.code == 0) {
						this.currentPageNum = 1;
						this.totalCount = 0;
						this.status = 'nomore';
						this.isShowNoData = false;
						this.fullTradeList = [];
						this.queryTradeOrderPage({
							pageNo: this.currentPageNum,
							pageSize: this.pageSize,
							status: this.transitionOrderStatus(this.current)
						},true)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.orderFormDetailsDialogShow = false;
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.orderFormDetailsDialogShow = false;
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 订单详情点击事件
			enterOrderDetailsEvent (item) {
				// 传递该订单详情及当前切换的订单类型的信息
				let temporaryEditServiceOrderFormSureChooseMessage = this.editServiceOrderFormSureChooseMessage;
				temporaryEditServiceOrderFormSureChooseMessage['orderMessage'] = item;
				temporaryEditServiceOrderFormSureChooseMessage['current'] = this.current;
				this.storeEditServiceOrderFormSureChooseMessage(temporaryEditServiceOrderFormSureChooseMessage);
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderForm/index/index?transmitData='+mynavData
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	.content-box {
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 20000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
			.order-form-details-dialog-box {
				::v-deep .u-popup {
					flex: none !important;
					.u-transition {
						.u-popup__content {
							width: 92%;
							padding: 30px 10px 20px 10px;
							box-sizing: border-box;
							.u-popup__content__close {
								.uicon-close {
									color: #00070F !important;
									font-weight: bold !important
								}
							};
							.accept-order-date {
								margin-bottom: 19px;
								padding-left: 20px;
								box-sizing: border-box;
								.accept-order-date-title {
									font-size: 14px;
									color: #101010;
									margin-bottom: 4px
								};
								.accept-order-date-content {
									font-size: 14px;
									color: #101010
								}
							};
							.btn-area {
								width: 118px;
								height: 108px;
								margin: 0 auto;
								margin-top: 10px;
								margin-bottom: 20px;
								border-radius: 50%;
								background: #5064EB;
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: center;
								color: #fff;
								font-size: 18px;
								>text {
									&:nth-child(2) {
										margin-top: 6px;
										font-size: 12px;
									}
								}
							};
							.bottom-info-area {
								text-align: center;
								>image {
									width: 24px;
									height: 24px;
									vertical-align: middle;
									&:nth-child(2) {
										margin-left: 6px;
										margin-right: 4px;
									}
								};
								text {
									vertical-align: middle;
									&:nth-of-type(1) {
										color: #101010;
										font-size: 14px;
									};
									&:nth-of-type(2) {
										color: #4095E5;
										font-size: 14px;
									}
								}
							}
						}
					}
				}	
			};
		.refuse-order-form-success-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 92%;
						padding: 30px 10px 20px 10px;
						box-sizing: border-box;
						.u-popup__content__close {
							.uicon-close {
								color: #00070F !important;
								font-weight: bold !important
							}
						};
						image {
							width: 78px;
							height: 78px;
							margin: 0 auto;
							margin-top: 50px;
							margin-bottom: 30px;
						};
						.operation-success-title {
							text-align: center;
							font-size: 18px;
							color: #101010
						};
						.operation-success-content {
							text-align: center;
							font-size: 14px;
							color: #A0A0A0;
							margin: 20px 0
						};
						.operation-success-btn {
							width: 90%;
							margin: 0 auto;
							margin-bottom: 30px;
							height: 44px;
							border-radius: 8px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #4263EB;
							font-size: 16px;
							color: #fff;
							margin-bottom: 50px
						}
					}
				}
			}	
		};
		.accept-order-form-success-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 92%;
						padding: 30px 10px 20px 10px;
						box-sizing: border-box;
						.u-popup__content__close {
							.uicon-close {
								color: #00070F !important;
								font-weight: bold !important
							}
						};
						image {
							width: 100px;
							height: 100px;
							margin: 0 auto;
							margin-top: 50px;
							margin-bottom: 30px;
						};
						.accept-success-title {
							text-align: center;
							font-size: 18px;
							color: #101010;
							margin-bottom: 30px;
						};
						.operation-success-btn {
							width: 90%;
							margin: 0 auto;
							margin-bottom: 30px;
							height: 44px;
							border-radius: 8px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #4263EB;
							font-size: 16px;
							color: #fff;
							margin-bottom: 50px
						}
					}
				}
			}	
		};
		.refuse-order-form-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 92%;
						padding: 30px 10px 20px 10px;
						box-sizing: border-box;
						.u-popup__content__close {
							.uicon-close {
								color: #00070F !important;
								font-weight: bold !important
							}
						};
						.top-title {
							font-size: 18px;
							color: #101010;
							height: 40px;
							display: flex;
							justify-content: center;
							align-items: center
						};
						.center-content {
							margin: 20px 0
						};
						.bottom-btn {
							.sure-btn {
								width: 90%;
								margin: 0 auto;
								height: 44px;
								border-radius: 8px;
								display: flex;
								align-items: center;
								justify-content: center;
								background: #4263EB;
								font-size: 16px;
								color: #fff;
								margin-bottom: 10px
							};
							.cancel-btn {
								width: 90%;
								margin: 0 auto;
								height: 44px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 8px;
								border: 1px solid #D0D5DD;
								font-size: 16px;
								color: #585B60
							}
						}
					}
				}
			}	
		};
		@include content-wrapper;
		.top-area-box {
			position: relative;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				.header_title_center {
					color: #fff !important;
					text {
						color: #fff !important;
					}
				}
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100px
			}
		};
		.order-form-tabs {
			box-shadow: 0 2px 6px 0 rgba(202, 200, 200, 0.4);
			z-index: 1;
			::v-deep .u-tabs {
				.u-tabs__wrapper__scroll-view {
					.u-tabs__wrapper__nav__item {
						position: relative;
						flex: 1;
					}
				}
			}
		};
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 10px 6px;
			box-sizing: border-box;
			position: relative;
			.scroll-view {
				height: 100%
			};
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.order-form-list {
				border-radius: 7px;
				padding: 0px 4px 8px 4px;
				background: #fff;
				box-sizing: border-box;
				margin-bottom: 10px;
				box-shadow: 0px 1px 4px 0px rgba(137, 140, 140, 0.24);
				.order-form-top {
					display: flex;
					align-items: center;
					height: 50px;
					@include bottom-border-1px(#BBBBBB);
					justify-content: space-between;
					padding: 0 8px 0 10px;
					box-sizing: border-box;
					.order-form-title {
						flex: 1;
						@include no-wrap();
						>text {
							font-size: 16px;
							color: #444444;
							font-weight: bold
						}
					};
					.order-form-status {
						>text {
							display: inline-block;
							padding: 0 0 0 4px;
							box-sizing: border-box;
							font-size: 14px;
							color: #E86F50;
							font-weight: bold
						};
						.serviceStyle {
							color: #289E8E !important
						};
						.completeStyle {
							color: #020202 !important
						}
					}
				};
				.order-form-center {
					display: flex;
					justify-content: space-between;
					padding: 8px;
					box-sizing: border-box;
					.order-form-center-left {
						margin-right: 10px;
						::v-deep .u-image {
						}
					};
					.order-form-center-right {
						padding-top: 10px;
						box-sizing: border-box;
						.brotected-person {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #5064EB;
									word-break: break-all
								}
							}
						};
						.service-address {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #5064EB;
									word-break: break-all
								}
							}
						};
						.expectation-date {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #5064EB;
									word-break: break-all
								}
							}
						}
					}
				};
				.consumption-rental {
					padding: 0 8px 20px 8px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.consumption-rental-left {
						>text {
							display: inline-block;
							font-size: 13px;
							color: #505050;
							&:nth-child(1) {
								margin-right: 4px
							};
							&:nth-child(2) {
							}
						}
					};
					.consumption-rental-right {
						flex: 1;
						display: flex;
						width: 0;
						justify-content: flex-end;
						>text {
							display: inline-block;
							font-size: 12px;
							color: #505050;
							&:nth-child(1) {
								color: #5C5C5C;
								margin-right: 4px;
							};
							&:nth-child(2) {
								color: #E82050;
								font-weight: bold;
								word-break: break-all
							}
						}
					}
				};
				.order-form-bottom {
					height: 30px;
					display: flex;
					padding: 0 8px;
					box-sizing: border-box;
					justify-content: space-between;
					align-items: center;
					.btn-area-left {
						display: flex;
						>text {
							min-width: 78px;
							display: inline-block;
							height: 26px;
							padding: 0 12px;
							box-sizing: border-box;
							text-align: center;
							line-height: 26px;
							font-size: 13px;
							color: #fff;
							background: #289E8E;
							border-radius: 22px
						}
					};
					.btn-area-right {
						flex: 1;
						display: flex;
						justify-content: flex-end;
						>text {
							min-width: 78px;
							display: inline-block;
							height: 26px;
							padding: 0 12px;
							box-sizing: border-box;
							text-align: center;
							line-height: 26px;
							font-size: 13px;
							color: #5E5E5E;
							border: 1px solid #BBBBBB;
							border-radius: 22px;
							margin-right: 10px;
							&:last-child {
								margin-right: 0
							}
						};
						.accept-payment {
							color: #fff;
							background: #1983FD;
							border: none !important;
							margin-right: 0 !important;
						}
					}	
				}
			}
		}
	}
</style>
