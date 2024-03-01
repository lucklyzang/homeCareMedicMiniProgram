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
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="消息">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
			<view class="tab-box">
				<view class="tab-item" :class="{'tabItemStyle': tabIndex == index}" v-for="(item,index) in tabList" :key="index" @click="tabCutEvent(item,index)">
					<text>{{ item }}</text>
				</view>
			</view>
		</view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="message-list-wrapper" v-if="tabIndex === 0">
			<u-empty text="暂无聊天消息" mode="list" v-if="isNoChat"></u-empty>
			<view class="message-list" v-for="(item,index) in chatList"  @click="enterChatInterface(item)" :key="index">
				<view class="message-photo">
					<u-image :src="item.avatar" width="35" height="35">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="message-content">
					<view class="message-content-left">
						<view class="message-title">
							<text>{{ item.fromName }}</text>
						</view>
						<view class="message-overview">
							<text>
								{{ item.content }}
							</text>
						</view>
					</view>
					<view class="message-content-right">
						<view class="message-date">
							<text>{{ getNowFormatDate(new Date(item.lastTime),4) }}</text>
						</view>
						<view class="message-number" v-if="item.count > 0">
							<text>{{ item.count }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="message-list-wrapper" v-else>
			<u-empty text="暂无消息" mode="list" v-if="isShowNoData"></u-empty>
			<view class="message-list" @click="enterMessageListEvent('资讯')" v-if="haveLatestNewInfo == true">
				<view class="message-photo">
					<u-image src="@/static/img/latest-news-icon.png" width="35" height="35">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="message-content">
					<view class="message-content-left">
						<view class="message-title">
							<text>资讯</text>
						</view>
						<view class="message-overview">
							<text>
								{{ latestNewsSummary.title }}
							</text>
						</view>
					</view>
					<view class="message-content-right">
						<view class="message-date">
							<text>{{ getNowFormatDate(new Date(latestNewsSummary.createTime),2) }}</text>
						</view>
						<view class="message-number" v-if="latestNewsSummary.unReadCount > 0">
							<text>{{ latestNewsSummary.unReadCount }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="message-list" @click="enterMessageListEvent('通知')" v-if="haveNotifyMessageSummaryInfo == true">
				<view class="message-photo">
					<u-image src="@/static/img/inform-icon.png" width="35" height="35">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="message-content">
					<view class="message-content-left">
						<view class="message-title">
							<text>通知消息</text>
						</view>
						<view class="message-overview">
							<text>
								{{ notifyMessageSummary.title }}
							</text>
						</view>
					</view>
					<view class="message-content-right">
						<view class="message-date">
							<text>{{ getNowFormatDate(new Date(notifyMessageSummary.time),2) }}</text>
						</view>
						<view class="message-number" v-if="notifyMessageSummary.notRead > 0">
							<text>{{ notifyMessageSummary.notRead }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="message-list" @click="enterMessageListEvent('公告')" v-if="haveNotifySummaryInfo == true">
				<view class="message-photo">
					<u-image src="@/static/img/inform-icon.png" width="35" height="35">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="message-content">
					<view class="message-content-left">
						<view class="message-title">
							<text>公告消息</text>
						</view>
						<view class="message-overview">
							<text>
								{{ notifySummary.title }}
							</text>
						</view>
					</view>
					<view class="message-content-right">
						<view class="message-date">
							<text>{{ getNowFormatDate(new Date(notifySummary.time),2) }}</text>
						</view>
						<view class="message-number" v-if="notifySummary.notRead > 0">
							<text>{{ notifySummary.notRead }}</text>
						</view>
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { notifyMessageSummary, notifySummary, latestNews, getUserChatList, chatMessageRead, createCallPolice } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				loginBackgroundPng: require("@/static/img/login-background.png"),
				infoText: '',
				showLoadingHint: false,
				tabIndex: 0,
				isNoChat: false,
				chatList: [],
				tabList: ['聊天消息','系统消息'],
				latestNewsSummary: {
					unReadCount: '',
					title: '',
					createTime: ''
				},
				notifyMessageSummary: {
					notRead: '',
					title: '',
					time: ''
				},
				haveNotifyMessageSummaryInfo: false,
				haveNotifySummaryInfo: false,
				haveLatestNewInfo: false,
				notifySummary: {
					notRead: '',
					title: '',
					time: ''
				},
				isShowNoData: false,
				callPoliceDialogShow: false,
				latitude: '',
				longitude: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			if (this.tabIndex == 0) {
				this.getUserChatListEvent()
			} else {
				this.queryLatestNews({terminal: 'NURSE'});
				this.queryNotifySummary();
				this.queryNotifyMessageSummary()
			};
			// 获取当前所在位置
			try {
				this.isGetLocation()
			} catch(err) {
				this.$refs.uToast.show({
					message: `${err}`,
					type: 'error',
					position: 'center'
				})
			}
		},
		methods: {
			...mapMutations([
			]),
			
			// 报警弹框弹出事件
			callPoliceDialogShowEvent () {
				this.isGetLocation();
				this.callPoliceDialogShow = true
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
			
			// tab切换事件
			tabCutEvent (item,index) {
				this.tabIndex = index;
				if (this.tabIndex == 1) {
					this.queryLatestNews({terminal: 'NURSE'});
					this.queryNotifySummary();
					this.queryNotifyMessageSummary();
				} else if (this.tabIndex == 0) {
					this.getUserChatListEvent();
					// uni.navigateTo({
					// 	url: '/messagePackage/pages/chatInterface/chatInterface'
					// })
				}
			},
			
			
			// 进入聊天界面事件
			enterChatInterface (item) {
				this.chatMessageReadEvent(item.fromId);
				let transmitParameter = JSON.stringify(item);
				uni.navigateTo({
					url: '/messagePackage/pages/chatInterface/chatInterface?transmitData='+transmitParameter
				})
			},
			
			// 查询聊天列表
			getUserChatListEvent () {
				this.showLoadingHint = true;
				getUserChatList().then((res) => {
					if ( res && res.data.code == 0) {
						if (!res.data.data || res.data.data.length == 0) {
							this.isNoChat = true;
						} else {
							this.isNoChat = false;
							this.chatList = res.data.data;
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 更新消息为已读
			chatMessageReadEvent (data) {
				chatMessageRead(data).then((res) => {
					if ( res && res.data.code == 0) {
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
			
			// 查询最新一条未读资讯
			queryLatestNews (data) {
				this.showLoadingHint = true;
				this.haveLatestNewInfo = false;
				latestNews(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (JSON.stringify(res.data.data) == "{}") {
							this.haveLatestNewInfo = false;
						} else {
							this.haveLatestNewInfo = true;
							this.latestNewsSummary = res.data.data;
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 查询通知摘要
			queryNotifyMessageSummary () {
				this.showLoadingHint = true;
				this.haveNotifyMessageSummaryInfo = false;
				notifyMessageSummary().then((res) => {
					if ( res && res.data.code == 0) {
						if (!res.data.data) {
							this.haveNotifyMessageSummaryInfo = false;
						} else {
							this.haveNotifyMessageSummaryInfo = true;
							this.notifyMessageSummary = res.data.data;
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 查询公告摘要
			queryNotifySummary () {
				this.showLoadingHint = true;
				this.haveNotifySummaryInfo = false;
				notifySummary({terminal:'NURSE'}).then((res) => {
					if ( res && res.data.code == 0) {
						if (!res.data.data) {
							this.haveNotifySummaryInfo = false;
						} else {
							this.haveNotifySummaryInfo = true;
							this.notifySummary = res.data.data;
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 进入消息列表事件
			enterMessageListEvent (text) {
				if (text == '资讯') {
					uni.navigateTo({
						url: '/messagePackage/pages/message/index/index'
					})
				} else if (text == '通知') {
					uni.navigateTo({
						url: '/messagePackage/pages/notifyMessageList/notifyMessageList'
					})
				} else if (text == '公告') {
					uni.navigateTo({
						url: '/messagePackage/pages/notifyList/notifyList'
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
		.top-area-box {
			position: relative;
			width: 100%;
			height: 130px;
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
			.tab-box {
				position: absolute;
				bottom: -1px;
				left: 0;
				width: 100%;
				height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				.tab-item {
					width: 100px;
					height: 30px;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 14px;
					color: #FFFFFF;
					margin-right: 10px;
					&:last-child {
						margin-right: 0 !important
					}
				};
				.tabItemStyle {
					color: #5064EB !important;
					background: #fff !important;
					border-top-left-radius: 7px !important;
					border-top-right-radius: 7px !important;
				}
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 130px
			};
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.message-list-wrapper {
			width: 100%;
			flex: 1;
			overflow: auto;
			position: relative;
			margin-top: 10px;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.message-list {
				padding: 10px;
				box-sizing: border-box;
				display: flex;
				margin-bottom: 10px;
				align-items: center;
				justify-content: space-between;
				.message-photo {
					margin-right: 10px;
					::v-deep .u-image {
						// width: 46px !important;
						// height: 46px !important
					}
				};
				.message-content {
					flex: 1;
					width: 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.message-content-left {
						flex: 1;
						@include no-wrap();
						.message-title {
							@include no-wrap();
							margin-bottom: 10px;
							>text {
								width: 100%;
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						};
						.message-overview {
							@include no-wrap();
							>text {
								width: 100%;
								font-size: 14px;
								color: #898C8C;
							}	
						}
					};
					.message-content-right {
						.message-date {
							margin-bottom: 10px;
							>text {
								font-size: 14px;
								color: #8A8A8A
							}
						};
						.message-number {
							text-align: right;
							>text {
								width: 21px;
								height: 21px;
								color: #fff;
								text-align: center;
								line-height: 21px;
								font-size: 12px;
								display: inline-block;
								border-radius: 50%;
								background: #E86F50;
								padding: 0 2px;
								box-sizing: border-box;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
								box-sizing: border-box;
							}
						}
					}
				}
			}
		}	
	}
</style>
