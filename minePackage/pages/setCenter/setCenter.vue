<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="modalShow" :title="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="设置中心" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="set-center-content">
			<view class="update-phone-number" @click="updatePhoneNumberEvent">
				<view class="update-phone-number-left">
					<text>更换手机号</text>
				</view>
				<view class="update-phone-number-right">
					<text>{{ phoneNumberValue }}</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<!-- <view class="new-message-inform">
				<view class="new-message-inform-left">
					<text>新消息通知</text>
				</view>
				<view class="new-message-inform-right">
					<u-switch @change="switchChange" v-model="isNewMessageInformValue" activeColor="#88BFFF"></u-switch>
				</view>
			</view> -->
		<!-- 	<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>微信绑定</text>
				</view>
				<view class="weixin-binding-right">
					<text>未绑定</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>支付宝绑定</text>
				</view>
				<view class="weixin-binding-right">
					<text>未绑定</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="clera-storage">
				<view class="clera-storage-left">
					<text>清除缓存</text>
				</view>
				<view class="clera-storage-right">
					<text>{{ `${currentSize}M` }}</text>
					<text @click="clearCacheEvent">清除缓存</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="weixin-binding" @click="examineUpdate">
				<view class="weixin-binding-left">
					<text>检查更新</text>
				</view>
				<view class="weixin-binding-right">
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view> -->
		</view>
		<view class="quit-login-btn-box">
			<view class="quit-login-btn" @click="logOutEvent" :class="{'quitLoginBtnStyle' : showLoadingHint }">
				<text> {{ showLoadingHint ? '登出中···' : '退出登录' }}</text>
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import _ from 'lodash'
	import { userSignOut } from '@/api/login.js'
	import { medicalCareMessageNotice } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				isNewMessageInformValue: true,
				modalShow: false,
				phoneNumberValue: '',
				modalContent: '',
				currentSize: ''
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
		onShow() {
			this.getStorageInfoSyncEvent();
			this.phoneNumberValue = !this.userBasicInfo || JSON.stringify(this.userBasicInfo) == '{}' ? '' : this.userBasicInfo.mobile;
			this.isNewMessageInformValue = !this.userBasicInfo || JSON.stringify(this.userBasicInfo) == '{}' ? true : this.userBasicInfo.notice;
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 顶部导航返回事件
			backTo () {
				this.changeUserBasicInfo({});
				uni.navigateBack()
			},
			
			// 退出登录事件
			logOutEvent () {
				this.modalShow = true;
				this.modalContent = '确认退出登录?'
			},
			
			// 是否退出登录弹框确定事件
			sureCancel () {
				this.modalContent = '';
				this.modalShow = false;
				this.infoText = '';
				this.showLoadingHint = true;
				userSignOut().then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '退出登录成功!',
							type: 'success',
							position: 'bottom'
						});
						// 清空store和localStorage
						this.$store.dispatch('resetLoginState');
						removeAllLocalStorage();
						uni.redirectTo({
							url: '/pages/login/login'
						})
					} else {
					 this.modalShow = true;
					 this.modalContent = res.data.msg
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = `${err.message}`
				})
			},
			
			// 获取应用缓存大小事件
			getStorageInfoSyncEvent () {
				this.currentSize = uni.getStorageInfoSync()['currentSize']/1000
			},
			
			// 清除缓存事件
			clearCacheEvent () {
				uni.showLoading({
				  title: '正在清除缓存'
				});
				uni.clearStorageSync();
				uni.hideLoading();
				uni.showToast({
				  title: '缓存已清除',
				  icon: 'success'
				});
				this.getStorageInfoSyncEvent()
			},
			
			// 新消息通知开关切换事件
			switchChange () {
				if (this.isNewMessageInformValue) {
					this.infoText = '开启中···'
				} else {
					this.infoText = '关闭中···'
				};
				medicalCareMessageNotice(!this.isNewMessageInformValue ? 0 : 1).then((res) => {
					if ( res && res.data.code == 0) {
						// 修改存储的是否接收新消息值
						let temporaryUserBasicInfo =  _.cloneDeep(this.userBasicInfo);
						temporaryUserBasicInfo['notice'] = this.isNewMessageInformValue;
						this.changeUserBasicInfo(temporaryUserBasicInfo)
					} else {
						this.isNewMessageInformValue = !this.isNewMessageInformValue;
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.isNewMessageInformValue = !this.isNewMessageInformValue;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 是否退出登录弹框取消事件
			cancelSure () {
				this.modalShow = false
			},
			
			// 检查更新
			examineUpdate () {
				if (uni.canIUse('getUpdateManager')) {
					const updateManager = uni.getUpdateManager();
					updateManager.onCheckForUpdate(function (res) {
						if (res.hasUpdate) {
							// 下载新版本
							updateManager.onUpdateReady(function () {
								uni.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用?',
									success(res) {
										if (res.confirm) {
											// 重启应用
											updateManager.applyUpdate()
										}
									}
								})
							});
							// 新版本下载失败
							updateManager.onUpdateFailed(function (res) {
							  uni.showModal({
									title: '已经有新版本了',
									content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开！',
							  })
							})
						} else {
							uni.showModal({
								title: '提示',
								content: '当前已是最新版本，无需更新！',
							})
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试！',
					})
				}
			},
			
			// 更换手机号事件
			updatePhoneNumberEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/updatePhoneOldCode/updatePhoneOldCode'
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
		@include content-wrapper;
		background: #fff;
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
		.top-area-box {
			position: relative;
			background: #fff;
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
		.set-center-content {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			.update-phone-number {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.update-phone-number-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.update-phone-number-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						font-size: 16px;
						color: #999999;
						margin-right: 6px;
					}
				}
			};
			.new-message-inform {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.new-message-inform-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.new-message-inform-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center
				}
			};
			.clera-storage {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.clera-storage-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.clera-storage-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						font-size: 16px;
						color: #1C222A;
						margin-right: 6px;
						&:nth-child(2) {
							font-size: 12px;
							color: #ffffff;
							display: inline-block;
							width: 65px;
							height: 24px;
							text-align: center;
							line-height: 24px;
							background: #88bfff;
							border-radius: 4px;
						}
					}
				}
			};
			.weixin-binding {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.weixin-binding-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.weixin-binding-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						font-size: 16px;
						color: #1C222A;
						margin-right: 6px;
					}
				}
			}
		};
		.quit-login-btn-box {
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			.quit-login-btn {
				width: 70%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 46px;
				border: 1px solid #E86F50;
				border-radius: 8px;
				font-size: 12px;
				color: #E86F50
			};
			.quitLoginBtnStyle {
				opacity: 0.5;
			}
		}
	}
</style>
