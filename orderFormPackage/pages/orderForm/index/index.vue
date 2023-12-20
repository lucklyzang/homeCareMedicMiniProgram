<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<!-- 订单相关服务操作弹框 -->
		<view class="order-form-details-dialog-box">
			<u-popup :show="orderFormDetailsDialogShow" @close="orderFormDetailsDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="accept-order-date">
						<view class="accept-order-date-title">
							<text>接受服务订单时间</text>
						</view>
						<view class="accept-order-date-content">
							<text>{{ serviceMessage.acceptTime }}</text>
						</view>
					</view>
					<view class="accept-order-date" v-if="serviceMessage.status >= 40 && serviceMessage.status <= 60">
						<view class="accept-order-date-title">
							<text>出发时间</text>
						</view>
						<view class="accept-order-date-content">
							<text>{{ serviceMessage.setOutTime }}</text>
						</view>
					</view>
					<view class="accept-order-date" v-if="serviceMessage.status == 50 || serviceMessage.status == 60">
						<view class="accept-order-date-title">
							<text>开始服务时间</text>
						</view>
						<view class="accept-order-date-content">
							<text>{{ serviceMessage.startTime }}</text>
						</view>
					</view>
					<view class="accept-order-date" v-if="serviceMessage.status == 60">
						<view class="accept-order-date-title">
							<text>完成服务时间</text>
						</view>
						<view class="accept-order-date-content">
							<text>{{ completeTime.startTime }}</text>
						</view>
					</view>
					<view class="btn-area">
						<text v-if="serviceMessage.status == 30" @click="departSureEvent">立即出发</text>
						<text v-if="serviceMessage.status == 40" @click="startSureEvent">开始服务</text>
						<text v-if="serviceMessage.status == 50" @click="completeSureEvent">完成服务</text>
						<text>14:23:23</text>
					</view>
					<view class="bottom-info-area">
						<image src="@/static/img/view-order-form-details-bottom-icon-one.png"></image>
						<image src="@/static/img/view-order-form-details-bottom-icon-two.png"></image>
						<text>已进入服务范围</text>
						<text>重新定位</text>
					</view>
				</u-popup>
			</u-popup>
		</view>
		<!-- 拒绝订单原因弹框 -->
		<view class="refuse-order-form-dialog-box">
			<u-popup :show="refuseOrderFormDialogShow" @close="refuseOrderFormDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="top-title">
					<text>选择拒绝原因</text>
				</view>
				<view class="center-content">
					 <u-checkbox-group
							v-model="checkReasonValue"
							placement="column"
							@change="checkboxReasonChange"
						>
							<u-checkbox
								:customStyle="{marginBottom: '8px'}"
								v-for="(item, index) in checkboxReasonList"
								:key="index"
								:label="item.name"
								:name="item.name"
							>
							</u-checkbox>
					</u-checkbox-group>
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
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="top-view-details">
			<view class="service-status" :class="{'serviceStyle' : serviceMessage.status == 50,'completeStyle' : serviceMessage.status == 60}">
				<text>{{ transitionOrderStatusText(serviceMessage.status, serviceMessage) }}</text>
			</view>
			<view class="btn-details" v-if="serviceMessage.status != 70 && serviceMessage.status != 80">
				<text class="refuse-btn" v-if="serviceMessage.status == 20" @click="refuseOrderFormEvent(serviceMessage)">拒绝订单</text>
				<text v-if="serviceMessage.status == 20" @click="acceptOrderFormEvent(serviceMessage)">接受订单</text>
				<text v-if="serviceMessage.status == 30" @click="departEvent(serviceMessage)">立即出发</text>
				<text v-if="serviceMessage.status == 40" @click="startEvent(serviceMessage)">开始服务</text>
				<text v-if="serviceMessage.status == 50" @click="completeEvent(serviceMessage)">完成服务</text>
				<text v-if="serviceMessage.status == 60" @click="clickDetailsEvent">点击详情</text>
			</view>
			<view class="" v-else>
				晚上有约会
			</view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>{{ serviceMessage.items[0]['spuName'] }}</text>
					</view>
				</view>
				<view class="order-form-center">
					<view class="order-form-center-left">
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="order-form-center-right">
						<view class="brotected-person">
							<text>被护人</text>
							<text>{{ `${serviceMessage.serverPerson.name} ${serviceMessage.serverPerson.age}岁` }}</text>
						</view>
						<view class="service-address">
							<text>服务地址</text>
							<text>{{ serviceMessage.receiverDetailAddress }}</text>
						</view>
						<view class="expectation-date">
							<text>期望时间</text>
							<text>{{ `${getNowFormatDateText(serviceMessage.serviceDate)} (${judgeWeek(serviceMessage.serviceDate)}) ${serviceMessage.serviceTime}` }}</text>
						</view>
						<view class="evaluation-form">
							<text>初步评估单</text>
							<text>点击查看</text>
						</view>
					</view>
				</view>
			</view>
			<view class="price-list">
				<view class="price-list-top">
					<view class="price-list-title">
						<text>订单价格清单</text>
					</view>
				</view>
				<view class="price-list-content">
					<view class="price-list-one">
						<text>婴儿全身按摩</text>
						<text>{{`￥${serviceMessage.payPrice}`}}</text>
					</view>
					<view class="price-list-one price-list-two">
						<text>路程费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-three">
						<text>超时费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-four">
						<text>材料费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-five">
						<text>优惠</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-last">
						<text>实付款</text>
						<text>{{`￥${serviceMessage.payPrice}`}}</text>
					</view>
				</view>
			</view>
			<view class="patient-data">
				<view class="patient-data-title">
					<text>患者资料</text>
				</view>
				<view class="patient-data-image">
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
			</view>
			<view class="service-site">
				<view class="service-site-title">
					<text>服务地点</text>
					<text>环球中心1号门1栋1单元1楼1011</text>
					<text>11.2km</text>
				</view>
				<view class="service-site-map-area">
				</view>
			</view>
			<view class="order-flow">
				<view class="order-flow-title">
					<text>订单流程</text>
				</view>
				<view class="order-flow-content">
					<u-steps :current="currentFlow" dot inactiveColor="rgba(255, 255, 255, 0.5)" activeColor="#fff">
						<u-steps-item title="已支付"></u-steps-item>
						<u-steps-item title="待接单"></u-steps-item>
						<u-steps-item title="待服务"></u-steps-item>
						<u-steps-item title="服务中"></u-steps-item>
						<u-steps-item title="待评价"></u-steps-item>
						<u-steps-item title="订单完成"></u-steps-item>
					</u-steps>
				</view>
			</view>
			<view class="contact-patient">
				<view class="contact-patient-title">
					<text>联系患者</text>
				</view>
				<view class="contact-patient-content">
					<view class="phone-box">
						<image src="@/static/img/order-form-phone.png"></image>
						<text>拨打电话</text>
					</view>
					<view class="message-box">
						<image src="@/static/img/order-form-message.png"></image>
						<text>发送消息</text>
					</view>
				</view>
			</view>
			<view class="notice-box">
				<view class="notice-title">
					<text>须知</text>
				</view>
				<view class="notice-content">
					<view class="notice-list">
						1、啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
					<view class="notice-list">
						2、啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
					<view class="notice-list">
						3、啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
				</view>
			</view>
			<view class="order-message">
				<view class="order-message-top">
					<view class="order-message-title">
						<text>订单信息</text>
					</view>
				</view>
				<view class="order-message-content">
					<view class="order-message-one-special">
						<view class="order-message-one-special-left">
							<text>订单编号:</text>
						</view>
						<view class="order-message-one-special-right">
							<text>{{ serviceMessage.no }}</text>
							<text  @click="copyContent(copyValue)">复制</text>
						</view>
					</view>
					<view class="order-message-one" v-if="serviceMessage.payNo">
						<text>交易号:</text>
						<text>{{ serviceMessage.payNo }}</text>
					</view>
					<view class="order-message-one">
						<text>创建时间:</text>
						<text>{{ serviceMessage.createTime }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.workerStatus != 0 && serviceMessage.payTime">
						<text>付款时间:</text>
						<text>{{ serviceMessage.payTime }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.status >= 30 && serviceMessage.status != 70">
						<text>派单时间:</text>
						<text>{{ serviceMessage.assignTime }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.status == 60">
						<text>完成服务时间:</text>
						<text>{{ serviceMessage.completeTime }}</text>
					</view>
				</view>
			</view>
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
	import { getTradeOrderPage, nurseDepart, startServer, completeServer, acceptTradeOrder, refuseTradeOrder, getOrderDetail } from '@/api/orderForm.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '',
				showLoadingHint: false,
				orderFormDetailsDialogShow: false,
				currentFlow: null,
				orderFormDetailsDialogShow: false,
				refuseOrderFormDialogShow: false,
				refuseOrderFormSuccessDialogShow: false,
				acceptOrderFormSuccessDialogShow: false,
				checkReasonValue: [],
				currentSelectOrderMessage: {},
				refundReason: '',
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
				serviceMessage: {
					id: '',
					no: '',
					createTime: '',
					userRemark: '',
					status: null,
					workerStatus: null,
					refundStatus: '',
					productCount: '',
					finishTime: '',
					cancelTime: '',
					commentStatus: true,
					payStatus: true,
					payOrderId: '',
					payTime: '',
					payExpireTime: '',
					payChannelCode: '',
					payChannelName: '',
					totalPrice: '',
					discountPrice: '',
					deliveryPrice: '',
					adjustPrice: '',
					payPrice: '',
					payNo: '',
					receiverAreaName: '',
					receiverDetailAddress: '',
					couponId: '',
					couponPrice: '',
					pointPrice: '',
					items: [
						{
							id: '',
							orderId: '',
							spuId: '',
							spuName: '',
							skuId: '',
							properties: [
								{
									propertyId: '',
									propertyName: '',
									valueId: '',
									valueName: ''
								}
							],
							picUrl: '',
							count: '',
							commentStatus: true,
							price: '',
							payPrice: '',
							afterSaleId: '',
							afterSaleStatus: ''
						}
					],
					careId: 0,
					serviceDate: '',
					serviceTime: '',
					serverPerson: {
						id: 0,
						memberId: 0,
						name: '',
						mobile: '',
						critical: '',
						birthday: '',
						sex: '',
						age: 0,
						medicalRecord: [],
						special: [],
						status: ''
					},
					images: [],
					assignType: '',
					assignTime: '',
					acceptTime: '',
					setOutTime: '',
					startTime: '',
					completeTime: '',
					aptitudes: [],
					commentRespVO: {
						scores: 0,
						attitudeScores: 0,
						speedScores: 0,
						specialityScores: 0,
						content: ''
					}
				}
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let temporaryAddress = JSON.parse(options.transmitData);
			this.serviceMessage = temporaryAddress;
			this.queryOrderDetail({id:this.serviceMessage.id})
		},
		
		
		methods: {
			...mapMutations([
			]),
			
			copyContent(data) {
				uni.setClipboardData({
					data,
					success: () => {
						uni.getClipboardData({ 
							success: (res) => {
								uni.showToast({
										title: "复制成功"
								})
							}
						})
					}
				})
			},
			
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
				
				// 查询订单详情
				queryOrderDetail(data) {
					this.showLoadingHint = true;
					this.infoText = '加载中···';
					getOrderDetail(data).then((res) => {
						if ( res && res.data.code == 0) {
							this.serviceMessage = res.data.data;
							this.serviceMessage.payPrice = fenToYuan(this.serviceMessage.payPrice);
							this.currentFlow = this.transitionOrderFlowStatusText(this.serviceMessage.workerStatus,this.serviceMessage);
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
				
				// 转换订单流程状态
				transitionOrderFlowStatusText(status,item) {
					let temporaryStatus = status.toString();
					let temporaryWorkerStatus = item.status.toString();
					// 服务完成前类型的订单下包含若干个子状态(10-待分配 20-待接单 30-待出发 40-待服务 50-服务中)
					if (temporaryStatus == 1 || temporaryStatus == 2) {
						switch(temporaryWorkerStatus) {
							case '10' :
							return 0
							break;
							case '20' :
							return 1
							break;
							case '30' :
							return 2
							break;
							case '40' :
							return 2
							break;
							case '50' :
							return 3
							break;
						}	
					} else {
						switch(temporaryStatus) {
							case '1' :
							return 0
							break;
							case '2' :
							if (temporaryWorkerStatus == '20') {
								return 1
							} else if (temporaryWorkerStatus == '30') {
								return 2
							} else if (temporaryWorkerStatus == '40') {
								return 2
							} else if (temporaryWorkerStatus == '50') {
								return 3
							}
							break;
							case '3' :
							if (!item.commentStatus) {
								return 4
							} else {
								return 5
							}
							break
						}
					}
				},
				
				// 转换订单状态
				transitionOrderStatusText(status,item) {
					let temporaryStatus = status.toString();
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
						return '已拒绝订单'
						break;
					}	
				},
				
				// 点击详情事件
				clickDetailsEvent () {
					this.orderFormDetailsDialogShow = true
				},
				
				// 接受订单事件
				acceptOrderFormEvent(item) {
					this.infoText = '订单接受中···';
					this.showLoadingHint = true;
					acceptTradeOrder(item.id).then((res) => {
						if ( res && res.data.code == 0) {
							this.acceptOrderFormSuccessDialogShow = true;
							this.queryOrderDetail({id:this.serviceMessage.id});
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
							this.refuseOrderFormSuccessDialogShow = true;
							this.queryOrderDetail({id:this.serviceMessage.id});
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
					console.log('change', n);
				},
				
				// 拒绝订单事件
				refuseOrderFormEvent (item) {
					this.refuseOrderFormDialogShow = true
				},
				
				// 确定拒绝事件
				sureRefuseEvent () {
					this.refuseOrderFormDialogShow = false;
					this.refuseTradeOrderEvent(this.serviceMessage.id,'')
				},
				
				// 立即出发事件
				departEvent(item) {
					this.orderFormDetailsDialogShow = true
				},
				
				// 立即出发确定事件
				departSureEvent () {
					this.infoText = '出发中···';
					this.showLoadingHint = true;
					nurseDepart(this.serviceMessage.id).then((res) => {
						if ( res && res.data.code == 0) {
							this.queryOrderDetail({id:this.serviceMessage.id});
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
					this.orderFormDetailsDialogShow = true
				},
				
				// 开始服务确定事件
				startSureEvent () {
					this.infoText = '开始服务中···';
					this.showLoadingHint = true;
					startServer(this.serviceMessage.id).then((res) => {
						if ( res && res.data.code == 0) {
							this.queryOrderDetail({id:this.serviceMessage.id});
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
					this.orderFormDetailsDialogShow = true
				},
				
				// 完成服务确定事件
				completeSureEvent () {
					this.infoText = '完成服务中···';
					this.showLoadingHint = true;
					completeServer(this.serviceMessage.id).then((res) => {
						if ( res && res.data.code == 0) {
							this.queryOrderDetail({id:this.serviceMessage.id});
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
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
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
		@include content-wrapper;
		position: relative;
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
					color: #101010 !important;
					text {
						color: #101010 !important;
					}
				}
			}
		};
		.top-view-details {
			height: 100px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.service-status {
				>text {
					font-size: 18px;
					color: #E86F50;
					margin-bottom: 10px;
				};	
				.serviceStyle {
					color: #289E8E !important
				};
				.completeStyle {
					color: #020202 !important
				}
			};
			.btn-details {
				>text {
					display: inline-block;
					width: 172px;
					height: 40px;
					text-align: center;
					line-height: 40px;
					background: #1983FD;
					border-radius: 18px;
					font-size: 14px;
					color: #fff;
				};
				.refuse-btn {
					margin-right: 20px;
					background: #fff !important;
					color: #898C8C !important;
					border: 1px solid #BBBBBB !important
				}	
			}
		};
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 10px 0;
			box-sizing: border-box;
			position: relative;
			.order-form-list {
				padding: 0px 4px 8px 4px;
				background: #fff;
				box-sizing: border-box;
				margin-bottom: 10px;
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
							// width: 88px !important;
							// height: 88px !important
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
						};
						.evaluation-form {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 66px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #3388FF;
									word-break: break-all
								}
							}
						}
					}
				}
			}
		};
		.price-list {
			background: #fff;
			margin-bottom: 10px;
			.price-list-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.price-list-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.price-list-content {
				padding: 6px 16px;
				box-sizing: border-box;
				.price-list-one {
					display: flex;
					justify-content: space-between;
					margin-bottom: 6px;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #3E4248;
						font-weight: bold;
						&:first-child {
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							
						}
					}
				};
				.price-list-last {
					>text {
						&:last-child {
							color: #E82050;
							font-size: 16px;
							font-weight: bold;
						}
					}
				}
			}
		};
		.patient-data {
			background: #fff;
			margin: 10px 0;
			padding: 6px 16px;
			box-sizing: border-box;
			.patient-data-title {
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px
			};
			.patient-data-image {
				display: flex;
				flex-wrap: wrap;
				.u-transition {
					width: 32%;
					margin-right: 2%;
					margin-bottom: 10px;
					&:nth-child(3n) {
						margin-right: 0 !important
					};
					::v-deep .u-image {
						width: 100% !important
					}
				}	
			}
		};
		.service-site {
			background: #fff;
			margin-bottom: 10px;
			padding: 6px 16px;
			box-sizing: border-box;
			.service-site-title {
				display: flex;
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px;
				>text {
					display: inline-block;
					&:nth-child(2) {
						flex: 1;
						margin: 0 10px;
						font-size: 12px;
						margin-top: 2px;
						color: #000000;
						word-break: break-all
					};
					&:nth-child(3) {
						font-size: 12px;
						margin-top: 2px;
						color: #000000
					}
				}
			};
			.service-site-map-area {}
		};
		.order-flow {
			height: 113px;
			background: #5064EB;
			margin-bottom: 10px;
			padding: 6px 16px 10px 16px;
			box-sizing: border-box;
			.order-flow-title {
				padding-left: 4px;
				box-sizing: border-box;
				font-size: 14px;
				color: #fff;
				margin-bottom: 20px
			};
			.order-flow-content {
				::v-deep .u-steps {
					.u-steps-item {
						.u-steps-item__wrapper {
							background: transparent !important
						};
						.u-steps-item__content {
							.u-text {
								.u-text__value {
									color: #fff !important
								}
							}
						}
					}
				}
			}
		};
		.contact-patient {
			background: #fff;
			margin-bottom: 10px;
			padding: 6px 16px;
			box-sizing: border-box;
			.contact-patient-title {
				display: flex;
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px;
			};
			.contact-patient-content {
				display: flex;
				.phone-box {
					flex: 1;
					image {
						width: 24px;
						height: 24px;
						margin-right: 10px;
						vertical-align: middle
					};
					text {
						color: #5064EB;
						font-size: 16px;
						vertical-align: middle
					}
				};
				.message-box {
					flex: 1;
					image {
						width: 24px;
						height: 24px;
						margin-right: 10px;
						vertical-align: middle
					};
					text {
						color: #5064EB;
						font-size: 16px;
						vertical-align: middle
					}
				};
			}
		};
		.notice-box {
			background: #fff;
			padding: 6px 16px;
			box-sizing: border-box;
			.notice-title {
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px;
			};
			.notice-content {
				.notice-list {
					font-size: 12px;
					color: #222222;
					word-break: break-all;
					margin-bottom: 4px;
				}
			}
		};
		.order-message {
			background: #fff;
			margin-bottom: 10px;
			.order-message-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.order-message-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.order-message-content {
				padding: 6px 16px;
				box-sizing: border-box;
				.order-message-one-special {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					.order-message-one-special-left {
						font-size: 14px;
						font-weight: bold;
						color: #3E4248;
					};
					.order-message-one-special-right {
						display: flex;
						flex: 1;
						justify-content: flex-end;
						>text {
							display: inline-block;
							font-size: 14px;
							color: #3E4248;
							font-weight: bold;
							&:first-child {
								flex: 1;
								color: #B7B6B6;
								margin-right: 4px;
								text-align: right;
								word-break: break-all
							};
							&:last-child {
								color: #3E4248
							}
						}
					}
				};
				.order-message-one {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #3E4248;
						font-weight: bold;
						&:first-child {
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							color: #B7B6B6
						}
					}
				}
			}
		}
	}
</style>
