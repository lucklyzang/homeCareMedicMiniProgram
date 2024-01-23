<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 报警弹框 -->
		<view class="call-police-dialog-box">
			<u-popup :show="callPoliceDialogShow" @close="callPoliceDialogShow = false" :closeable="true" mode="bottom" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="help-center-title">
					<text>求助中心</text>
				</view>
				<view class="help-center-content">
					<text>如遇突发情况，请立即进行报警。</text>
				</view>
				<view class="help-bottom-btn" @click="callPoliceEvent">
					<image src="@/static/img/call-police-dialog.png"></image>
				</view>
			</u-popup>
		</view>
		<!-- 报警按钮 -->
		<view class="call-police-box" @click="callPoliceDialogShowEvent">
			<image src="@/static/img/call-police-btn.png"></image>
		</view>
		<!-- 选择提现方式弹框 -->
		<view class="withdrawal-method-dialog-box">
			<u-popup :show="withdrawalMethodDialogShow" @close="withdrawalMethodDialogShow = false" :closeable="true" mode="bottom" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="top-title">
					<text>选择提现方式</text>
				</view>
				<view class="center-content">
					<view class="sure-btn" @click="withdrawEvent('银行卡')">
						<text>银行卡提现</text>
					</view>
					<view class="cancel-btn" @click="withdrawEvent('支付宝')">
						<text>支付宝提现</text>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="个人中心">
				</nav-bar> 
			</view>
			<image :src="loginBackgroundPng"></image>
			<view class="user-info">
				<view class="user-photo" @click="enterPersonMessagePageEvent">
					<image :src="personPhotoSource"></image>
				</view>
				<view class="user-nickname">
					<view class="nick-name">
						<text>{{ niceNameValue }}</text>
					</view>
					<view class="has-auth" v-if="isAuth">
						<image :src="authenticationIconPng"></image>
						<text>已认证</text>
					</view>
					<view class="no-auth" v-if="!isAuth" @click="toAuthEvent">
						<text>去认证</text>
					</view>
				</view>
				<view class="qr-code" @click="qrCodeClickEvent">
					<image :src="qrCodeIconPng"></image>
				</view>
			</view>
			<view class="data-area-box" @click="enterDataStatisticsEvent">
				<view class="today-earnings">
					<text>今日收益</text>
					<text>{{ tradeStatistics.todayAmount }}</text>
				</view>
				<view class="classified-statistic">
					<view>
						<view>
							<image src="@/static/img/total-order-icon.png"></image>
							<text>{{ tradeStatistics.orderCount }}</text>
						</view>
						<view>
							<text>接单总数 (单)</text>
						</view>
					</view>
					<view>
						<view>
							<image src="@/static/img/accumulated-income-icon.png"></image>
							<text>{{ tradeStatistics.totalAmount }}</text>
						</view>
						<view>
							<text>累计收益 (元)</text>
						</view>
					</view>
					<view>
						<view>
							<image src="@/static/img/withdrawal-limit-icon.png"></image>
							<text>{{ tradeStatistics.canCash }}</text>
							<text @click.stop="withdrawalMethodDialogShow = true">提现</text>
						</view>
						<view>
							<text>可提现额度 (元)</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="switch-box">
			<text>派单开关</text>
			<u-switch v-model="isSendOrdersValue" @change="switchChange" activeColor="#5A7BF4"></u-switch>
		</view>
		<view class="bottom-area-box">
			<view v-for="(item,index) in bottomFunctionList" :key="index" @click="bottomFunctionClickEvent(item.name)">
				<view class="function-item-left">
					<image :src="item.iconImg"></image>
					<text>{{ item.name }}</text>
				</view>
				<view class="function-item-right">
					<u-icon name="arrow-right" color="#CCCCCC" size="20"></u-icon>
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
	import _ from 'lodash'
	import {
		setCache,
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { getUserMessage, createCallPolice, medicalCareReceive, tradeStatistics } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				qrCodeIconPng: require("@/static/img/qr-code-icon.png"),
				authenticationIconPng: require("@/static/img/authentication-icon.png"),
				loginBackgroundPng: require("@/static/img/login-background.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '开启中···',
				showLoadingHint: false,
				isSendOrdersValue: false,
				withdrawalMethodDialogShow: false,
				callPoliceDialogShow: false,
				showSupportStaffBox: false,
				personPhotoSource: '',
				niceNameValue: '张三',
				tradeStatistics: {
					todayAmount: 0,
					todayCount: 0,
					orderCount: 0,
					totalAmount: 0,
					canCash: 0
				},
				isAuth: false,
				latitude: '',
				longitude: '',
				bottomFunctionList: [
					{
						name: '我的账单',
						iconImg: require("@/static/img/my-bill.png")
					},
					{
						name: '身份认证',
						iconImg: require("@/static/img/authentication.png")
					},
					{
						name: '关于我们',
						iconImg: require("@/static/img/about-us.png")
					},
					{
						name: '帮助和反馈',
						iconImg: require("@/static/img/help-feedback.png")
					},
					{
						name: '设置中心',
						iconImg: require("@/static/img/set-center.png")
					}
				]
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo',
				'tradeStatisticsMessage'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			},
			depName() {
			},
			accountName() {
			}
		},
		onShow() {
			// 初次进入该页面时，查询用户基本信息
			if (!this.userBasicInfo || JSON.stringify(this.userBasicInfo) == '{}') {
				this.queryUserBasicMessage()
			} else {
				this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
				this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname;
				this.isSendOrdersValue = this.userBasicInfo.receive;
				this.isAuth = this.userBasicInfo.auth
			};
			// 回显交易数据
			if (JSON.stringify(this.tradeStatisticsMessage) != "{}") {
				this.tradeStatistics = this.tradeStatisticsMessage
			};
			// 查询交易数据
			this.queryTradeStatistics()
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo',
				'storeTradeStatisticsMessage'
			]),
			
			// 报警弹框弹出事件
			callPoliceDialogShowEvent () {
				this.isGetLocation();
				this.callPoliceDialogShow = true
			},
			
			// 提现事件
			withdrawEvent (text) {
				if (text == '银行卡') {
					uni.navigateTo({
						url: '/minePackage/pages/bankCardWithdraw/bankCardWithdraw'
					})
				} else if (text == '支付宝') {
					uni.navigateTo({
						url: '/minePackage/pages/alipayWithdraw/alipayWithdraw'
					})
				};
				this.withdrawalMethodDialogShow = false
			},
			
			isGetLocation(a = "scope.userLocation") { //检查当前是否已经授权访问scope属性
				let _this = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting[a]) { //每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
							_this.getAuthorizeInfo()
						} else {
							_this.getLocation()
						}
					}
				})
			},
			
			getAuthorizeInfo(a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				let _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
						_this.getLocation()
					}
				})
			},
			
			//获取当前所在位置的经纬度
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: (res) => {
						this.longitude = res.longitude;
						this.latitude = res.latitude
					},
					fail: (err) => {
						console.log('err',err)
					}
				})
			},
			
			// 查询交易统计
			queryTradeStatistics () {
				tradeStatistics().then((res) => {
					if ( res && res.data.code == 0) {
						let temporaryData = _.cloneDeep(res.data.data);
						temporaryData.orderCount = temporaryData.orderCount === 'NaN'  || !temporaryData.orderCount ? 0 : temporaryData.orderCount;
						temporaryData.todayAmount = temporaryData.todayAmount === 'NaN' || !temporaryData.todayAmount ? 0 : temporaryData.todayAmount;
						temporaryData.todayCount = temporaryData.todayCount === 'NaN' || !temporaryData.todayCount ? 0 : temporaryData.todayCount;
						temporaryData.totalAmount = temporaryData.totalAmount === 'NaN' || !temporaryData.totalAmount ? 0 : temporaryData.totalAmount;
						temporaryData.todayAmount = fenToYuan(temporaryData.todayAmount);
						temporaryData.totalAmount = fenToYuan(temporaryData.totalAmount);
						temporaryData.canCash = fenToYuan(temporaryData.canCash);
						this.storeTradeStatisticsMessage(temporaryData);
						this.tradeStatistics = this.tradeStatisticsMessage;
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 派单开关切换事件
			switchChange () {
				if (this.isSendOrdersValue) {
					this.infoText = '开启中···'
				} else {
					this.infoText = '关闭中···'
				};
				medicalCareReceive(!this.isSendOrdersValue ? 0 : 1).then((res) => {
					if ( res && res.data.code == 0) {
						// 修改存储的是否派单值
						let temporaryUserBasicInfo =  _.cloneDeep(this.userBasicInfo);
						temporaryUserBasicInfo['receive'] = this.isSendOrdersValue;
						this.changeUserBasicInfo(temporaryUserBasicInfo)
					} else {
						this.isSendOrdersValue = !this.isSendOrdersValue;
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.isSendOrdersValue = !this.isSendOrdersValue;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 头像点击事件
			enterPersonMessagePageEvent () {
				uni.navigateTo({
					url: '/generalSetPackage/pages/privateInfo/privateInfo'
				})
			},
			
			// 去认证事件
			toAuthEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/identityAuthenticationHome/identityAuthenticationHome'
				})
			},
			
			// 获取用户基本信息
			queryUserBasicMessage () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				getUserMessage().then((res) => {
					if ( res && res.data.code == 0) {
						this.changeUserBasicInfo(res.data.data);
						this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng :  this.userBasicInfo.avatar;
						this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname;
						this.isSendOrdersValue = this.userBasicInfo.receive;
						this.isAuth = this.userBasicInfo.auth
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
			
			// 报警事件
			callPoliceEvent () {
				this.showLoadingHint = true;
				this.infoText = '报警中...';
				createCallPolice({
				  userId: this.userInfo.userId,
					name: this.userBasicInfo.nickname,
					description: '',
					mobile: this.userBasicInfo.mobile,
					coordinate: this.longitude ? `${this.longitude},${this.latitude}` : '',
					status: 0,
					processor: 0,
					handleTime: '',
					handleResult: ''
				}).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '报警成功',
							type: 'success',
							position: 'center'
						})
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
					this.callPoliceDialogShow = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.callPoliceDialogShow = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 进入数据统计页面事件
			enterDataStatisticsEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/dataStatistics/dataStatistics'
				})
			},
			
			//客服弹框关闭事件
			closeSupportStaffBox () {
				this.showSupportStaffBox = false
			},
			
			// 二维码点击事件
			qrCodeClickEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/myQRcode/myQRcode'
				})
			},
			
			//底部功能区点击事件
			bottomFunctionClickEvent (name) {
				if (name == '关于我们') {
					uni.navigateTo({
						url: '/minePackage/pages/aboutUs/aboutUs'
					})
				} else if (name == '设置中心') {
					uni.navigateTo({
						url: '/minePackage/pages/setCenter/setCenter'
					})
				} else if (name == '身份认证') {
					uni.navigateTo({
						url: '/minePackage/pages/identityAuthenticationHome/identityAuthenticationHome'
					})
				} else if (name == '我的账单') {
					uni.navigateTo({
						url: '/minePackage/pages/myBill/myBill'
					})
				} else if (name == '帮助和反馈') {
					uni.navigateTo({
						url: '/minePackage/pages/helpCenter/helpCenter'
					})
				}
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
		.withdrawal-method-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 100%;
						padding: 30px 10px 20px 10px;
						border-radius: 0 !important;
						box-sizing: border-box;
						.u-popup__content__close {
							.uicon-close {
								color: #00070F !important;
								font-weight: bold !important
							}
						};
						.top-title {
							font-size: 20px;
							color: #101010;
							height: 40px;
							display: flex;
							justify-content: center;
							align-items: center
						};
						.center-content {
							margin-top: 40px;
							.sure-btn {
								width: 90%;
								margin: 0 auto;
								height: 44px;
								border-radius: 8px;
								display: flex;
								align-items: center;
								justify-content: center;
								background: #1890FF;
								font-size: 16px;
								color: #fff;
								margin-bottom: 20px
							};
							.cancel-btn {
								width: 90%;
								margin: 0 auto;
								height: 44px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 8px;
								background: #1890FF;
								border: 1px solid #D0D5DD;
								font-size: 16px;
								color: #fff;
							}
						}
					}
				}
			}	
		};
		.call-police-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 100%;
						border-radius: 0;
						border-top-left-radius: 20px;
						border-top-right-radius: 20px;
						padding: 20px 10px;
						box-sizing: border-box;
						.help-center-title {
							text-align: center;
							font-size: 20px;
							color: #101010;
							margin-bottom: 10px
						};
						.help-center-content {
							text-align: center;
							font-size: 14px;
							color: #101010;
							margin: 20px 0
						};
						.help-bottom-btn {
							text-align: center;
							image {
								height: 116px;
								width: 280px;
							}
						}
					}
				}
			}	
		};
		.call-police-box {
			position: fixed;
			left: -18px;;
			z-index: 100;
			bottom: 4vh;
			image {
				width: 55px;
				height: 55px
			}
		};
		::v-deep .u-popup {
			.u-popup__content {
				width: 90%;
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
							width: 106px;
							height: 129px
						};
						>text {
							font-size: 18px;
							color: #101010;
							&:nth-of-type(1) {
								margin: 10px 0;
							}
						}
					};
					.support-staff-bottom {
						display: flex;
						margin-top: 20px;
						.support-staff-left {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 24px;
								height: 24px;
								margin-bottom: 6px
							};
							>text {
								font-size: 14px;
								color: #4E9FD5
							}
						};
						.support-staff-right {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							>image {
								width: 24px;
								height: 24px;
								margin-bottom: 6px
							};
							>text {
								font-size: 14px;
								color: #4E9FD5
							}
						}
					}
				}
			}
		};
		.top-area-box {
			position: relative;
			width: 100%;
			height: 320px;
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
				height: 230px
			};
			.user-info {
				width: 94%;
				height: 250px;
				display: flex;
				align-items: center;
				color: #fff;
				font-size: 20px;
				margin: 0 auto;
				.user-photo {
					width: 70px;
					height: 70px;
					background: #fff;
					margin: 0 15px 0 15px;
					border-radius: 50%;
					z-index:1;
					image {
						width: 70px;
						height: 70px;
						border-radius: 50%;
					}
				}
			};
			.user-nickname {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				padding-right: 10px;
				box-sizing: border-box;
				z-index: 1;
				@include no-wrap;
				.nick-name {
					width: 100%;
					text {
						width: 100%;
						display: inline-block;
						@include no-wrap;
						font-size: 16px;
						color: #FFFFFF;
						font-weight: 400;
					}
				};
				.has-auth {
					width: 75px;
					height: 22px;
					background: #edc101;
					border-radius: 3px;
					margin-top: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					text {
						font-size: 10px;
						color: #fff
					};
					image {
						width: 15px;
						height: 15px;
						margin-right: 10px;
					}
				};
				.no-auth {
					width: 70px;
					height: 22px;
					background: #6486ff;
					border-radius: 3px;
					margin-top: 10px;
					display: flex;
					align-items: center;
					justify-content: center;
					text {
						font-size: 10px;
						color: #fff
					}
				}
			};
			.qr-code {
				height: 50px;
				z-index: 100;
				image {
					width: 24px;
					height: 24px
				}
			};
			.data-area-box {
				width: 94%;
				position: absolute;
				left: 3%;
				top: 180px;
				height: 130px;
				overflow: auto;
				background: #fff;
				margin: 0 auto;
				border-radius: 10px;
				padding: 14px 4px 14px 14px;
				box-sizing: border-box;
				box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.08);
				.today-earnings {
					display: flex;
					align-items: center;
					padding-left: 14px;
					box-sizing: border-box;
					height: 44px;
					background-image: linear-gradient(90deg, #F5F5F5 0%, #FFFFFF 100%);
					text {
						font-weight: bold;
						&:nth-child(1) {
							font-size: 13px;
							color: #333333;
							font-weight: 400;
							margin-right: 6px
						};
						&:nth-child(2) {
							font-size: 17px;
							color: #F92C20;
							font-weight: 600;
						}
					}
				};
				.classified-statistic {
					margin-top: 10px;
					display: flex;
					>view {
						flex: 1;
						display: flex;
						flex-direction: column;
						&:nth-child(3) {
							>view {
								&:nth-child(1) {
									>image {
										width: 15px;
										height: 15px;
										vertical-align: middle;
										margin-right: 4px;
									};
									>text {
										&:nth-child(3) {
											margin-left: 4px;
											font-size: 13px;
											color: #5064EB;
											vertical-align: bottom;
										}
									}
								};
								&:nth-child(2) {
									// padding-left: 10px;
								}
							}
						};
						>view {
							width: 100%;
							word-break: break-all;
							&:nth-child(1) {
								margin-bottom: 2px;
								>image {
									width: 15px;
									height: 15px;
									vertical-align: middle;
									margin-right: 4px;
								};
								>text {
									vertical-align: middle;
									font-size: 16px;
									color: #000000;
									font-weight: 400;
								}
							};
							&:nth-child(2) {
								padding-left: 19px;
								box-sizing: border-box;
								>text {
									font-size: 13px;
									color: #999999;
									font-weight: 400;
								}
							}
						}
					}
				}
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.switch-box {
			display: flex;
			align-items: center;
			width: 94%;
			margin: 0 auto;
			height: 50px;
			box-sizing: border-box;
			@include bottom-border-1px(#DCDCDC);
			>text {
				flex: 1;
				text-align: left;
				font-size: 14px;
				color: #333333;
				font-weight: 400;
			};
			::v-deep .u-switch{
			}
		};
		.bottom-area-box {
			width: 94%;
			margin: 0 auto;
			margin-top: 6px;
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: auto;
			>view {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#DCDCDC);
				.function-item-left {
					>image {
						width: 20px;
						height: 20px;
						margin-right: 6px;
						vertical-align: middle
					};
					>text {
						font-size: 14px;
						color: #333333;
						font-weight: 400;
						vertical-align: middle
					}
				};
				.function-item-right {
					
				}
			}
		}
	}
</style>
