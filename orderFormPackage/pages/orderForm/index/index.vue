<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<!-- 拨打电话弹框 -->
		<view class="call-phone-box">
			<u-popup :show="showCallPhoneBox" :safeAreaInsetBottom="false" :closeable="true" mode="center"  @close="closeCallPhoneBox">
				<view class="support-staff-content">
					<view class="support-staff-top">
							<image :src="serviceMessage.avatar"></image>
							<text>拨打患者虚拟电话</text>
							<text>{{ serviceMessage.serverPerson.mobile }}</text>
					</view>
					<view class="support-staff-bottom" @click="callNumber">
						<text>拨打电话</text>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 放大图片弹框 -->
		<view class="magnify-img-box">
			<u-popup :show="magnifyImgDialogShow" @close="magnifyImgDialogShow = false" :closeable="true" mode="center" round="6" :closeOnClickOverlay="true" :safeAreaInsetTop="true">
				<image :src="currentImgUrl" mode="widthFix"></image>
			</u-popup>
		</view>
		<!-- 订单相关服务操作弹框 -->
		<view class="order-form-details-dialog-box">
			<u-popup :show="orderFormDetailsDialogShow" @close="orderFormDetailsDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="true" :safeAreaInsetBottom="true">
				<view class="accept-order-date">
					<view class="accept-order-date-title">
						<text>接受服务订单时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(serviceMessage.acceptTime),4) }}</text>
					</view>
				</view>
				<view class="accept-order-date" v-if="serviceMessage.status >= 40 && serviceMessage.status <= 60">
					<view class="accept-order-date-title">
						<text>出发时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(serviceMessage.setOutTime),4) }}</text>
					</view>
				</view>
				<view class="accept-order-date" v-if="serviceMessage.status == 50 || serviceMessage.status == 60">
					<view class="accept-order-date-title">
						<text>开始服务时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(serviceMessage.startTime),4) }}</text>
					</view>
				</view>
				<view class="start-img" v-if="(serviceMessage.status == 50 || serviceMessage.status == 60) && serviceMessage.start">
					<image :src="serviceMessage.start" mode="widthFix"></image>
				</view>
				<view class="accept-order-date" v-if="serviceMessage.status == 60">
					<view class="accept-order-date-title">
						<text>完成服务时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>{{ getNowFormatDate(new Date(serviceMessage.completeTime),4) }}</text>
					</view>
				</view>
				<view class="start-img" v-if="serviceMessage.status == 60 && serviceMessage.complete">
					<image :src="serviceMessage.complete" mode="widthFix"></image>
				</view>
				<view class="btn-area" v-if="serviceMessage.status <= 50">
					<u-icon name="camera-fill" color="#fff" size="40" v-if="serviceMessage.status == 40" @click="startSureEvent"></u-icon>
					<u-icon name="camera-fill" color="#fff" size="40" v-if="serviceMessage.status == 50" @click="completeSureEvent"></u-icon>
					<text v-if="serviceMessage.status == 30" @click="departSureEvent">立即出发</text>
					<text v-if="serviceMessage.status == 40" @click="startSureEvent">开始服务</text>
					<text v-if="serviceMessage.status == 50" @click="completeSureEvent">完成服务</text>
					<text>{{ getNowFormatDate(new Date(),1) }}</text>
				</view>
				<view class="bottom-info-area" v-if="serviceMessage.status <= 50">
					<image src="@/static/img/view-order-form-details-bottom-icon-one.png"></image>
					<image src="@/static/img/view-order-form-details-bottom-icon-two.png"></image>
					<text>已进入服务范围</text>
					<text @click="realTimeGetLocation(true)">{{ locationText }}</text>
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
					<u--textarea v-if="showRefuseReasonInput" v-model="refuseReasonValue" :formatter="formatter" ref="textarea" maxlength="150" placeholder="请输入拒绝理由" autoHeight count ></u--textarea>
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
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="applay-time">
						<text>申请时间 :</text>
						<text v-if="serviceMessage.createTime">{{ getNowFormatDate(new Date(serviceMessage.createTime),4) }}</text>
					</view>
					<view v-if="serviceMessage.status != null" class="order-form-status" :class="{'serviceStyle' : serviceMessage.status == 50,'completeStyle' : serviceMessage.status == 60}">
						<text>{{ transitionOrderStatusTextOther(serviceMessage) }}</text>
					</view>
				</view>
				<view class="order-form-center">
					<view class="order-form-center-left">
						<u-image :src="serviceMessage.items[0]['picUrl']" width="88" height="88">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="order-form-center-right">
						<view class="order-form-title">
							<text>{{ serviceMessage.items[0]['spuName'] }}</text>
						</view>
						<view class="order-form-other-message">
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
								<text v-if="serviceMessage.serviceDate">{{ `${getNowFormatDateText(serviceMessage.serviceDate)} (${judgeWeek(serviceMessage.serviceDate)}) ${serviceMessage.serviceTime}` }}</text>
							</view>
						</view>
						<view class="evaluation-form">
							<text>初步评估单</text>
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
				<view class="price-list-content-wrapper">
					<view class="price-list-content">
						<view class="price-list-one">
							<text>{{ serviceMessage.items[0]['spuName'] }}</text>
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
							<view class="price-list-last-left">
								<text>实付款</text>
							</view>
							<view class="price-list-last-right">
								<text>￥</text>
								<text>{{`${serviceMessage.payPrice}`}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="patient-data-title-outer">
				<text>患者信息</text>
			</view>
			<view class="patient-data-wrapper">
				<view class="patient-data">
					<view class="patient-data-title">
						<text>患者资料</text>
					</view>
					<view class="patient-data-image">
						<view class="patient-data-image-list" v-for="(item,index) in serviceMessage.images" @click="magnifyImgEvent(item,index)">
							<u-image :src="item" width="100" mode="widthFix">
								 <template v-slot:loading>
										<u-loading-icon color="red"></u-loading-icon>
									</template>
							</u-image>
						</view>
					</view>
				</view>
				<view class="patient-data patient-remark-data">
					<view class="patient-data-title">
						<text>备注信息</text>
					</view>
					<view class="patient-remark-data-content">
						当哈利等哈昆德拉获得快乐和
					</view>
				</view>
				<view class="service-site">
					<view class="service-site-title">
						<view>
							<text>服务地点</text>
						</view>
						<view>
							<text>{{ serviceMessage.receiverDetailAddress }}</text>
							<text v-if="distance">{{ `(${distance})` }}</text>
						</view>
					</view>
					<view class="service-site-map-area">
						<map id="map" @tap="clickMapEvent" :longitude="longitude" :latitude="latitude" :scale="18" :markers="markers" show-location style="width: 100%; height: 300rpx;"></map>
					</view>
				</view>
				<view class="contact-patient" v-if="serviceMessage.status > 20 && serviceMessage.status < 60">
					<view class="contact-patient-title">
						<text>联系患者</text>
					</view>
					<view class="contact-patient-content">
						<view class="phone-box" @click="openPhoneDialogEvent">
							<image src="@/static/img/order-form-phone.png"></image>
							<text>拨打电话</text>
						</view>
						<view class="message-box" @click="relationProtectedPersonEvent(serviceMessage)">
							<image src="@/static/img/order-form-message.png"></image>
							<text>发送消息</text>
						</view>
					</view>
				</view>
			</view>
			<view class="order-flow-title">
				<text>订单流程</text>
			</view>
			<view class="order-flow">
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
			<view class="notice-title-outer">
				<text>须知</text>
			</view>
			<view class="notice-box">
				<view class="notice-content">
					<text v-if="!serviceMessage.notice">暂无</text>
					<rich-text v-else class="rich-content" :nodes="serviceMessage.notice"></rich-text>
				<!-- 	<view class="notice-list">
						1.啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
					<view class="notice-list">
						2.啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
					<view class="notice-list">
						3.啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view> -->
				</view>
			</view>
			<view class="order-message-top">
				<view class="order-message-title">
					<text>订单信息</text>
				</view>
			</view>
			<view class="order-message">
				<view class="order-message-content">
					<view class="order-message-one-special">
						<view class="order-message-one-special-left">
							<text>订单编号</text>
						</view>
						<view class="order-message-one-special-right">
							<text>{{ serviceMessage.no }}</text>
							<text  @click="copyContent(serviceMessage.no)">复制</text>
						</view>
					</view>
					<view class="order-message-one" v-if="serviceMessage.payNo">
						<text>交易号</text>
						<text>{{ serviceMessage.payNo }}</text>
					</view>
					<view class="order-message-one">
						<text>创建时间</text>
						<text>{{ getNowFormatDate(new Date(serviceMessage.createTime),4) }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.workerStatus != 0 && serviceMessage.payTime">
						<text>付款时间</text>
						<text>{{ getNowFormatDate(new Date(serviceMessage.payTime),4) }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.status >= 30 && serviceMessage.status != 70 && serviceMessage.status != 80">
						<text>派单时间</text>
						<text>{{ getNowFormatDate(new Date(serviceMessage.assignTime),4) }}</text>
					</view>
					<view class="order-message-one" v-if="serviceMessage.status == 60">
						<text>完成服务时间</text>
						<text>{{ getNowFormatDate(new Date(serviceMessage.completeTime),4) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="top-view-details">
			<view class="top-view-details-left">
				<view class="order-status-text">
					<text>订单状态</text>
				</view>
				<view class="service-status" :class="{'serviceStyle' : serviceMessage.status == 50,'completeStyle' : serviceMessage.status == 60}">
					<text>{{ transitionOrderStatusText(serviceMessage.status, serviceMessage) }}</text>
				</view>
			</view>
			<view class="btn-details" v-if="serviceMessage.status != 70 && serviceMessage.status != 80">
				<text class="refuse-btn" v-if="serviceMessage.status == 20" @click="refuseOrderFormEvent(serviceMessage)">拒绝订单</text>
				<text v-if="serviceMessage.status == 20" @click="acceptOrderFormEvent(serviceMessage)">接受订单</text>
				<text v-if="serviceMessage.status == 30" @click="departEvent(serviceMessage)">立即出发</text>
				<text v-if="serviceMessage.status == 40" @click="startEvent(serviceMessage)">开始服务</text>
				<text v-if="serviceMessage.status == 50" @click="completeEvent(serviceMessage)">完成服务</text>
				<text v-if="serviceMessage.status == 60" @click="clickDetailsEvent">点击详情</text>
			</view>
			<view class="refuse-reason" v-if="serviceMessage.status == 80">
				{{ serviceMessage.reason }}
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
	import { getTradeOrderPage, nurseDepart, startServer, completeServer, acceptTradeOrder, refuseTradeOrder, getOrderDetail, tradeOrderDistance } from '@/api/orderForm.js'
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
				magnifyImgDialogShow: false,
				currentImgUrl: '',
				currentFlow: null,
				showCallPhoneBox: false,
				orderFormDetailsDialogShow: false,
				refuseOrderFormDialogShow: false,
				refuseOrderFormSuccessDialogShow: false,
				acceptOrderFormSuccessDialogShow: false,
				checkReasonValue: '',
				currentSelectOrderMessage: {},
				refundReason: '',
				showRefuseReasonInput: false,
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
					},
					{
						name: '其他',
						disabled: false
					}
				],
				distance: '',
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
					reason: '',
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
					notice: '',
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
				},
				latitude: 39.909,// 默认纬度
				longitude: 116.39742,// 默认经度(北京天安门)
				markers: [
					{
						id: 123,
						latitude: 39.909,
						longitude: 116.39742,
						width: 40,
						height: 40,
						iconPath: 'https://hellouniapp.dcloud.net.cn/static/location.png',
						title: "服务地址"
					}
				],
				longitudeOther: '',
				latitudeOther: '',
				currentAddress: '',
				locationText: '重新定位',
				beforePageRoute: '',
				refuseReasonValue: '',
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
			this.serviceMessage.id = temporaryAddress.id;
			this.realTimeGetLocation(false);
			this.queryOrderDetail({id:temporaryAddress.id, type: 2})
		},
		
		methods: {
			...mapMutations([
			]),
			
			// 关闭拨打电话对话框
			closeCallPhoneBox () {
				this.showCallPhoneBox = false
			},
			
			// 打开电话弹框事件
			openPhoneDialogEvent () {
				this.showCallPhoneBox = true
			},
			
			// 拨打电话事件
			dialPhoneEvent () {
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.makePhoneCall']) {
							this.callNumber();
						} else {
							uni.authorize({
								scope: 'scope.makePhoneCall',
								success: () => {
									this.callNumber();
								},
								fail: () => {
									uni.openSetting({
										success: (res) => {
											if (res.authSetting['scope.makePhoneCall']) {
												this.callNumber()
											}
										}
									})
								}
							})
						}
					},
					fail:()=> {
						this.$refs.uToast.show({
							message: '获取用户设置失败',
							type: 'error',
							position: 'center'
						})
					}
				})
			},
			
			callNumber() {
				this.showCallPhoneBox = false;
				uni.makePhoneCall({
					phoneNumber: this.serviceMessage.serverPerson.mobile,
					success: () => {
						console.log('拨打电话成功！');
					},
					fail: () => {
						console.error('拨打电话失败！');
					}
				})
			},
			
			// 实时获取地理位置
			realTimeGetLocation (flag) {
				try {
					this.isGetLocation(flag)
				} catch(err) {
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'error',
						position: 'center'
					})
				}
			},
			
			isGetLocation(flag,a = "scope.userLocation") { //检查当前是否已经授权访问scope属性
				let _this = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting[a]) { //每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
							_this.getAuthorizeInfo(flag)
						} else {
							_this.getLocation(flag)
						}
					}
				})
			},
			
			getAuthorizeInfo(flag,a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				let _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
						_this.getLocation(flag)
					}
				})
			},
			
			//获取当前所在位置的经纬度
			getLocation(flag) {
				this.locationText = '定位中···';
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: (res) => {
						this.longitudeOther = res.longitude;
						this.latitudeOther = res.latitude;
						this.tradeOrderDistanceEvent(this.serviceMessage.id,`${this.latitudeOther},${this.longitudeOther}`)
						this.getLocationDetail(flag)
					},
					fail: (err) => {
						this.locationText = '重新定位';
						this.currentAddress = '无法获取位置信息！无法使用位置功能';
						this.$refs.uToast.show({
							message: '无法获取位置信息！无法使用位置功能',
							type: 'error',
							position: 'center'
						})
					}
				})
			},
			
			//根据经纬度获取详细的地址
			getLocationDetail (flag) {
				uni.request({
					header: {
						"Content-Type": "application/text"
					},
					url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + this.latitudeOther + ',' + this.longitudeOther +
						'&key=TVDBZ-TDILD-4ON4B-PFDZA-RNLKH-VVF6E',
					success:(res)=> {
						//成功获取到经纬度
						this.locationText = '重新定位';
						if (res.statusCode == 200) {
							this.showLoadingHint = false;
							if (res.data.result) {
								this.currentAddress = res.data.result.address;
								if (flag) {
									this.$refs.uToast.show({
										message: '已获取最新位置',
										type: 'success',
										position: 'bottom'
									})
								}
							} else {
								this.currentAddress = '获取地理位置异常';
								this.$refs.uToast.show({
									message: res.data.message,
									type: 'error',
									position: 'center'
								})
							}
						} else {
							this.currentAddress = '获取地理位置失败';
							if (flag) {
								this.$refs.uToast.show({
									message: '获取地理位置失败',
									type: 'error',
									position: 'center'
								})
							}
						}
					},
					fail: (err) => {
						this.locationText = '重新定位';
						this.currentAddress = '获取地理位置失败';
						this.$refs.uToast.show({
							message: `${err.errMsg}`,
							type: 'error',
							position: 'center'
						})
					}
				})
			},
			
			// 复制事件
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
			
			// 查看放大图片事件
			magnifyImgEvent (item,index) {
				this.magnifyImgDialogShow = true;
				this.currentImgUrl = item
			},
			
			// 点击地图事件
			clickMapEvent (address) {
				// 传递服务地址经纬度信息
				let mynavData = JSON.stringify({
					latitude: this.latitude,
					longitude: this.longitude,
				});
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderForm/orderFormMapEnlarge/orderFormMapEnlarge?transmitData='+mynavData
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
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
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
			
			// 拍照页面返回后的回调
			prevDateFun (id) {
				this.queryOrderDetail({id, type: 2})
			},
			
			// 给被护人发送消息事件
			relationProtectedPersonEvent (item) {
				uni.navigateTo({
					url: '/messagePackage/pages/chatInterface/chatInterface?transmitData='+item.id
				})
			},
				
				// 查询订单详情
				queryOrderDetail(data) {
					this.showLoadingHint = true;
					this.infoText = '加载中···';
					getOrderDetail(data).then((res) => {
						if ( res && res.data.code == 0) {
							if (res.data.data) {
								this.serviceMessage = res.data.data;
								if (this.serviceMessage.receiverDetailAddress) {
									this.getLocationDetailOrder(this.serviceMessage.receiverDetailAddress);
								};
								this.serviceMessage.payPrice = fenToYuan(this.serviceMessage.payPrice);
								this.currentFlow = this.transitionOrderFlowStatusText(this.serviceMessage.workerStatus,this.serviceMessage);
							}
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
							case '80' :
							return 0
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
				transitionOrderStatusTextOther(serviceMessage) {
					if (serviceMessage.status === null) { return };
					let temporaryWorkerStatus = serviceMessage.status.toString();
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
				
				// 转换订单状态
				transitionOrderStatusText(status,item) {
					if (status === null || item.status === null) {
						return
					};
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
						if (!item.commentStatus) {
							return '服务完成'
						} else {
							return '订单完成'
						}
						break;
						case '70' :
						return '已取消'
						break;
						case '80' :
						return '已拒绝订单'
						break;
					}	
				},
				
				// 计算距离
				tradeOrderDistanceEvent (id,center) {
					tradeOrderDistance({
						center,
						id
					}).then((res) => {
						if ( res && res.data.code == 0) {
							this.distance = res.data.data;
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
								position: 'center'
							})
						}
					})
					.catch((err) => {
						this.$refs.uToast.show({
							message: err.message,
							type: 'error',
							position: 'center'
						})
					})
				},
				
				//根据详细的地址获取经纬度
				getLocationDetailOrder (address) {
					uni.request({
						header: {
							"Content-Type": "application/text"
						},
						url: 'https://apis.map.qq.com/ws/geocoder/v1/?address=' + address +
														'&key=TVDBZ-TDILD-4ON4B-PFDZA-RNLKH-VVF6E',
						success:(res)=> {
							//成功获取到经纬度
							if (res.statusCode == 200) {
								if (res.data.result) {
									this.latitude = res.data.result.location.lat;
									this.longitude = res.data.result.location.lng;
									this.markers[0]['latitude'] = res.data.result.location.lat;
									this.markers[0]['longitude'] = res.data.result.location.lng
								} else {
									this.$refs.uToast.show({
										message: res.data.message,
										type: 'error',
										position: 'center'
									})
								}
							} else {
								uni.showToast({
									title: '获取经纬度失败，请重试',
									icon: "none"
								})
							}
						},
						fail: (err) => {
							this.$refs.uToast.show({
								message: `${err.errMsg}`,
								type: 'error',
								position: 'center'
							})
						}
					})
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
							this.queryOrderDetail({id:this.serviceMessage.id,type: 2});
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
							this.queryOrderDetail({id:this.serviceMessage.id, type: 2});
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
					if (n == '其他') {
						this.showRefuseReasonInput = true
					} else {
						this.showRefuseReasonInput = false
					}
					console.log('change', n);
				},
				
				// 拒绝订单事件
				refuseOrderFormEvent (item) {
					this.refuseOrderFormDialogShow = true
				},
				
				// 确定拒绝事件
				sureRefuseEvent () {
					if (this.showRefuseReasonInput) {
						if (this.refuseReasonValue === '') {
							this.$refs.uToast.show({
								message: '请输入拒绝理由',
								type: 'error',
								position: 'center'
							})
						} else {
							this.refuseOrderFormDialogShow = false;
							this.refuseTradeOrderEvent(this.currentSelectOrderMessage.id,this.refuseReasonValue)
						}
					} else {
						this.refuseOrderFormDialogShow = false;
						this.refuseTradeOrderEvent(this.currentSelectOrderMessage.id,this.checkReasonValue)
					}
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
							this.queryOrderDetail({id:this.serviceMessage.id, type: 2});
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
					this.orderFormDetailsDialogShow = false;
					let temporaryMessage = this.currentSelectOrderMessage;
					temporaryMessage['typeText'] = 'start';
					temporaryMessage['id'] = this.serviceMessage.id;
					temporaryMessage = JSON.stringify(this.currentSelectOrderMessage);
					uni.navigateTo({
						url: '/orderFormPackage/pages/serviceTakePhoto/serviceTakePhoto?transmitData='+temporaryMessage
					})
				},
				
				// 完成服务事件
				completeEvent(item) {
					this.orderFormDetailsDialogShow = true
				},
				
				// 完成服务确定事件
				completeSureEvent () {
					this.orderFormDetailsDialogShow = false;
					let temporaryMessage = this.currentSelectOrderMessage;
					temporaryMessage['typeText'] = 'end';
					temporaryMessage['id'] = this.serviceMessage.id;
					temporaryMessage = JSON.stringify(this.currentSelectOrderMessage);
					uni.navigateTo({
						url: '/orderFormPackage/pages/serviceTakePhoto/serviceTakePhoto?transmitData='+temporaryMessage
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
			z-index: 200000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
		.call-phone-box {
			::v-deep .u-popup {
				.u-popup__content {
					width: 80%;
					padding: 30px 10px 20px 10px;
					box-sizing: border-box;
					border-radius: 14px;
					.u-popup__content__close {
						.u-icon__icon {
							color: #101010 !important
						}
					};
					.support-staff-content {
						.support-staff-top {
							display: flex;
							flex-direction: column;
							align-items: center;
							>image {
								width: 100px;
								height: 100px;
								border-radius: 50%;
							};
							>text {
								font-size: 14px;
								color: #101010;
								&:nth-of-type(1) {
									margin: 14px 0;
								}
							}
						};
						.support-staff-bottom {
							display: flex;
							width: 80%;
							height: 38px;
							line-height: 38px;
							margin: 0 auto;
							justify-content: center;
							align-items: center;
							background: #1E86FD;
							border-radius: 7px;
							margin-top: 20px;
							font-size: 14px;
							color: #fff;
						}
					}
				}
			}
		};
		.magnify-img-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 98%;
						max-height: 90vh;
						overflow: auto;
						image {
							width: 100%;
						};
						.u-popup__content__close {
							.uicon-close {
								color: #00070F !important;
								font-weight: bold !important
							}
						}
					}	
				}
			}
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
						.start-img {
							padding-left: 20px;
							box-sizing: border-box;
							width: 100px;
							>image {
								width: 100px;
							}
						};
						.btn-area {
							width: 118px;
							height: 118px;
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
							font-size: 14px;
							>text {
								&:last-child {
									margin-top: 2px;
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
			padding: 0 10px;
			box-sizing: border-box;
			justify-content: space-between;
			align-items: center;
			.top-view-details-left {
				flex: 1;
				display: flex;
				align-items: center;
				.order-status-text {
					font-size: 13px;
					color: #333333;
					font-weight: 400;
					margin-right: 4px;
				};
				.service-status {
					margin-top: -1px;
					>text {
						font-size: 13px;
						color: #E86F50;
						font-weight: 500;
					};	
					.serviceStyle {
						color: #289E8E !important
					};
					.completeStyle {
						color: #020202 !important
					}
				};
			};
			.btn-details {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				>text {
					display: inline-block;
					width: 104px;
					height: 40px;
					text-align: center;
					line-height: 40px;
					font-size: 14px;
					color: #FFFFFF;
					text-align: center;
					font-weight: 400;
					background-image: linear-gradient(270deg, #5064EB 0%, #1A83FD 100%);
					box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.05);
					border-radius: 5px;
				};
				.refuse-btn {
					margin-right: 20px;
					background: #fff !important;
					color: #898C8C !important;
					border: 1px solid #BBBBBB !important
				}	
			};
			.refuse-reason {
				flex: 1;
				font-size: 13px;
				color: #999999;
				font-weight: 400;
				text-align: right;
				word-break: break-all;
				max-height: 60px;
				overflow: auto;
			}
		};
		.order-form-list-wrapper {
			flex: 1;
			background: #FAFAFA;
			overflow: auto;
			width: 100%;
			padding: 10px 0;
			box-sizing: border-box;
			position: relative;
			.order-form-list {
				background: #fff;
				.order-form-top {
					display: flex;
					align-items: center;
					height: 50px;
					@include bottom-border-1px(#DCDCDC);
					justify-content: space-between;
					padding: 0 8px 0 10px;
					box-sizing: border-box;
					.applay-time {
						flex: 1;
						@include no-wrap();
						>text {
							&:nth-child(1) {
								margin-right: 4px;
							};
							font-size: 12px;
							color: #999999;
							font-weight: 400;
						}
					};
					.order-form-status {
						>text {
							display: inline-block;
							padding: 0 0 0 4px;
							box-sizing: border-box;
							font-size: 14px;
							color: #FF7800;
							font-weight: 400;
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
					padding: 16px 8px 8px 8px;
					box-sizing: border-box;
					.order-form-center-left {
						margin-right: 10px;
						::v-deep .u-image {
						}
					};
					.order-form-center-right {
						flex: 1;
						.order-form-title {
							font-size: 16px;
							color: #000000;
							font-weight: 400;
						};
						.order-form-other-message {
							margin-top: 6px;
							background: #FAFAFA;
							padding: 4px;
							box-sizing: border;
							.brotected-person {
								margin-bottom: 6px;
								display: flex;
								justify-content: space-between;
								>text {
									display: inline-block;
									font-size: 13px;
									color: #333333;
									&:nth-child(1) {
										width: 60px;
										margin-right: 6px;
									};
									&:nth-child(2) {
										flex: 1;
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
									font-size: 13px;
									color: #333333;
									&:nth-child(1) {
										width: 60px;
										margin-right: 6px;
									};
									&:nth-child(2) {
										flex: 1;
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
									font-size: 13px;
									color: #333333;
									&:nth-child(1) {
										width: 60px;
										margin-right: 6px;
									};
									&:nth-child(2) {
										flex: 1;
										word-break: break-all
									}
								}
							}
						};
						.evaluation-form {
							margin-top: 10px;
							width: 98px;
							height: 30px;
							text-align: center;
							line-height: 30px;
							background: #5064EB;
							border-radius: 6px;
							font-size: 14px;
							color: #FFFFFF;
							font-weight: 500;
						}
					}
				}
			}
		};
		.price-list {
			.price-list-top {
				display: flex;
				align-items: center;
				height: 50px;
				justify-content: space-between;
				padding: 0 10px;
				box-sizing: border-box;
				.price-list-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 17px;
						color: #000000;
						font-weight: 500;
					}
				}
			};
			.price-list-content-wrapper {
				padding: 0 10px;
				box-sizing: border-box;
				.price-list-content {
					background: #fff;
					padding-top: 10px;
					box-sizing: border-box;
					.price-list-one {
						padding: 0 10px;
						box-sizing: border-box;
						display: flex;
						justify-content: space-between;
						margin-bottom: 10px;
						>text {
							display: inline-block;
							font-size: 14px;
							&:first-child {
								color: #666666;
								font-weight: 400;
								flex: 1;
								word-break: break-all
							};
							&:last-child {
								color: #333333;
								font-weight: 400;
							}
						}
					};
					.price-list-last {
						height: 40px;
						line-height: 40px;
						margin-bottom: 0 !important;
						@include top-border-1px(#DCDCDC);
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price-list-last-left {
						};
						.price-list-last-right {
							>text {
								&:first-child {
									font-size: 14px;
									color: #000000;
									font-weight: 400;
								}
								&:last-child {
									font-size: 17px;
									color: #000000;
									font-weight: 700;
								}
							}
						}
					}
				}
			}	
		};
		.patient-data-title-outer {
			height: 50px;
			display: flex;
			align-items: center;
			font-size: 17px;
			color: #000000;
			font-weight: 500;
			padding: 0 10px;
			box-sizing: border-box;
		};
		.patient-data-wrapper {
			padding: 0 10px;
			box-sizing: border-box;
			.patient-data {
				background: #fff;
				padding: 6px 16px;
				box-sizing: border-box;
				.patient-data-title {
					position: relative;
					border: none;
					&:after {
					  content: '';
					  position: absolute;
					  left: 0;
					  top: 50%;
						transform: translateY(-50%);
					  width: 3px;
					  height: 11px;
					  background-color: #5064EB;
					};
					padding-left: 8px;
					box-sizing: border;
					font-size: 14px;
					color: #666666;
					font-weight: 400;
					margin-bottom: 10px
				};
				.patient-data-image {
					display: flex;
					flex-wrap: wrap;
					.patient-data-image-list {
						width: 32%;
						margin-right: 2%;
						margin-bottom: 10px;
						&:nth-child(3n) {
							margin-right: 0 !important
						};
						::v-deep .u-image {
							height: auto !important
						}
					}
				}
			};
			.patient-remark-data {
				.patient-remark-data-content {
					color: #000000;
					font-weight: 400;
					word-break: break-all
				}
			};
			.service-site {
				background: #fff;
				padding: 6px 16px;
				box-sizing: border-box;
				.service-site-title {
					padding-left: 8px;
					box-sizing: border-box;
					display: flex;
					font-size: 14px;
					color: #3E4248;
					font-weight: bold;
					margin-bottom: 10px;
					>view {
						&:nth-child(1) {
							position: relative;
							border: none;
							height: 20px;
							margin-right: 4px;
							&:after {
							  content: '';
							  position: absolute;
							  left: -8px;
							  top: 50%;
								transform: translateY(-50%);
							  width: 3px;
							  height: 11px;
							  background-color: #5064EB;
							};
							>text {
								display: inline-block;
								font-size: 14px;
								color: #666666;
								font-weight: 400;
							}
						};
						&:nth-child(2) {
							flex: 1;
							text-align: right;
							word-break: break-all;
							>text {
								&:nth-child(1) {
									margin: 0 6px;
									font-size: 14px;
									color: #000000;
									font-weight: 400;
								};
								&:nth-child(2) {
									font-size: 14px;
									color: #000000;
									font-weight: 400;
								}
							}
						}
					}
				};
				.service-site-map-area {
				}
			};
			.contact-patient {
				background: #fff;
				padding: 6px 16px 20px 16px;
				box-sizing: border-box;
				.contact-patient-title {
					padding-left: 8px;
					box-sizing: border-box;
					display: flex;
					font-size: 14px;
					color: #666666;
					font-weight: 400;
					font-weight: bold;
					margin-bottom: 14px;
					position: relative;
					border: none;
					&:after {
					  content: '';
					  position: absolute;
					  left: 0;
					  top: 50%;
						transform: translateY(-50%);
					  width: 3px;
					  height: 11px;
					  background-color: #5064EB;
					}
				};
				.contact-patient-content {
					display: flex;
					.phone-box {
						margin-right: 10px;
						width: 105px;
						height: 30px;
						text-align: center;
						line-height: 30px;
						border-radius: 6px;
						border: 1px solid #5064EB;
						image {
							width: 15px;
							height: 15px;
							margin-right: 6px;
							vertical-align: middle
						};
						text {
							color: #5064EB;
							font-weight: 400;
							font-size: 14px;
							vertical-align: middle
						}
					};
					.message-box {
						width: 105px;
						height: 30px;
						text-align: center;
						line-height: 30px;
						border-radius: 6px;
						border: 1px solid #5064EB;
						image {
							width: 15px;
							height: 15px;
							margin-right: 6px;
							vertical-align: middle
						};
						text {
							color: #5064EB;
							font-weight: 400;
							font-size: 14px;
							vertical-align: middle
						}
					}
				}
			}
		};	
		.order-flow-title {
			height: 50px;
			display: flex;
			align-items: center;
			padding-left: 4px;
			box-sizing: border-box;
			font-size: 17px;
			color: #000000;
			font-weight: 500;
			padding: 0 10px;
			box-sizing: border-box;
		};
		.order-flow {
			height: 60px;
			padding: 0 10px;
			box-sizing: border-box;
			.order-flow-content {
				display: flex;
				align-items: center;
				height: 60px;
				background: #5064EB;
				::v-deep .u-steps {
					.u-steps-item {
						.u-steps-item__wrapper {
							background: transparent !important
						};
						.u-steps-item__content {
							.u-text {
								.u-text__value {
									font-size: 11px !important;
									color: #FFFFFF !important;
									font-weight: 400 !important;
								}
							}
						}
					}
				}
			}
		};
		.notice-title-outer {
			height: 50px;
			display: flex;
			align-items: center;
			font-size: 17px;
			color: #000000;
			font-weight: 500;
			padding: 0 10px;
			box-sizing: border-box;
		};
		.notice-box {
			padding: 0 10px;
			box-sizing: border-box;
			.notice-content {
				background: #fff;
				padding: 10px;
				box-sizing: border-box;
				.rich-content {
					font-size: 13px;
					color: #999999;
					letter-spacing: 0;
					text-align: justify;
					line-height: 18px;
					font-weight: 400;
					word-break: break-all;
				};
				.notice-list {
					font-size: 13px;
					color: #999999;
					letter-spacing: 0;
					text-align: justify;
					line-height: 18px;
					font-weight: 400;
					word-break: break-all;
					margin-bottom: 4px;
				}
			}
		};
		.order-message-top {
			.order-message-title {
				height: 50px;
				display: flex;
				align-items: center;
				font-size: 17px;
				color: #000000;
				font-weight: 500;
				padding: 0 10px;
				box-sizing: border-box;
			}
		};
		.order-message {
			padding: 0 10px;
			box-sizing: border-box;
			.order-message-content {
				background: #fff;
				padding: 10px;
				box-sizing: border-box;
				.order-message-one-special {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					.order-message-one-special-left {
						font-size: 14px;
						color: #666666;
						font-weight: 400;
					};
					.order-message-one-special-right {
						display: flex;
						flex: 1;
						justify-content: flex-end;
						>text {
							display: inline-block;
							font-size: 14px;
							color: #999999;
							text-align: right;
							font-weight: 400;
							&:first-child {
								flex: 1;
								margin-right: 4px;
								text-align: right;
								word-break: break-all
							};
							&:last-child {
								width: 40px;
								height: 18px;
								text-align: center;
								line-height: 18px;
								color: #666666;
								font-size: 12px;
								background: #F9F9F9;
								border: 1px solid rgba(204,204,204,1);
								border-radius: 4px;
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
						&:first-child {
							font-size: 14px;
							color: #666666;
							font-weight: 400;
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							font-size: 14px;
							color: #999999;
							text-align: right;
							font-weight: 400;
						}
					}
				}
			}
		}
	}
</style>
