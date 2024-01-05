<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="公告消息" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="message-list-wrapper">
			<u-empty text="暂无公告消息" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="message-list" v-for="(item,index) in fullNoticeList" :key="index">
					<text >
						{{ getNowFormatDate(new Date(item.time),4) }}
					</text>
					<view class="message-inner-list" v-for="(innerItem,innerIndex) in item.list" :key="innerIndex" @click="enterLatestNewsDetailsEvent(item,innerItem)">
						<view class="message-inner-list-top">
							<text>{{ innerItem.title }}</text>
						</view>
						<view class="message-inner-list-bottom">
							<rich-text :nodes="innerItem.content"></rich-text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullNoticeList.length > 0" />
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import navBar from "@/components/zhouWei-navBar"
	import { notifySummaryPage, updateNotifyRead } from '@/api/user.js'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '',
				showLoadingHint: false,
				infoText: '加载中···',
				currentPage: 1,
				pageSize: 15,
				totalCount: 0,
				noReadNum: 0,
				readedNum: 0,
				status: 'nomore',
				noticeList: [],
				fullNoticeList: [],
				isShowNoData: false
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
		onLoad() {
			this.queryNotifySummaryPageList({
				pageNo: this.currentPage,
				pageSize: this.pageSize,
				terminal: 'NURSE'
			},true)
		},
		methods: {
			...mapMutations([
			]),
			
			// 进入通知详情事件
			enterLatestNewsDetailsEvent (item,innerItem) {
				this.updateNotifyReadEvent(innerItem.id);
				// 传递通知详情内容
				let mynavData = encodeURIComponent(JSON.stringify(innerItem));
				uni.navigateTo({
					url: '/messagePackage/pages/notifyListDetails/notifyListDetails?transmitData='+mynavData
				})
			},
			
			// 获取通知列表
			queryNotifySummaryPageList (data,flag) {
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				this.noticeList = [];
				notifySummaryPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (JSON.stringify(res.data.data) == '{}') {
							this.isShowNoData = true;
							this.showLoadingHint = false;
							return
						};
						this.totalCount = res.data.data.total;
						this.noticeList = res.data.data.list;
						this.fullNoticeList = this.fullNoticeList.concat(this.noticeList);
						if (this.fullNoticeList.length == 0) {
							this.isShowNoData = true;
						} else {
							// this.noReadNum = 0;
							// this.readedNum = 0;
							// this.fullNoticeList.forEach((item) => {
							// 	let noReadSum = 0;
							// 	noReadSum = item.respVOS.filter((innerItem) => {
							// 		return innerItem.status == 0
							// 	}).length;
							// 	this.noReadNum += noReadSum;
							// 	let readSum = 0;
							// 	readSum = item.respVOS.filter((innerItem) => {
							// 		return innerItem.status == 1
							// 	}).length;
							// 	this.readedNum += readSum
							// })
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
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
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 更新通知为已读
			updateNotifyReadEvent(id) {
				this.showLoadingHint = true
				this.infoText = '';
				updateNotifyRead(id).then((res) => {
					if ( res && res.data.code == 0) {
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPage >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPage = this.currentPage + 1;
					this.queryNotifySummaryPageList({
						pageNo: this.currentPage,
						pageSize: this.pageSize,
						terminal: 'NURSE'
					},false)
				}
			},
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
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
		.message-list-wrapper {
			background: #FAFAFA;
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: column;
			padding: 16px 16px 16px 16px;
			box-sizing: border-box;
			position: relative;
			 ::v-deep .u-empty {
			 	position: absolute;
			 	top: 50%;
			 	left: 50%;
			 	transform: translate(-50%,-50%)
			 };
			 .scroll-view {
					height: 100%
			 };
			.message-list {
				text-align: center;
				>text {
					display: inline-block;
					height: 25px;
					font-size: 12px;
					width: 135px;
					background: rgba(187, 187, 187, 0.43);
					text-align: center;
					border-radius: 15px;
					color: #fff;
					line-height: 25px;
				};
				margin-bottom: 20px;
				.message-inner-list {
					background: #fff;
					margin-top: 15px;
					padding: 0 6px 10px 6px;
					box-sizing: border-box;
					box-shadow: 0px 2px 6px 0 rgba(92, 133, 136, 0.29);
					border-radius: 8px;
					position: relative;
					.message-inner-list-top {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 6px;
						box-sizing: border-box;
						@include bottom-border-1px(#BBBBBB);
						>text {
							color: #101010;
							font-size: 16px;
							vertical-align: middle
						}
					};
					.message-inner-list-bottom {
						padding: 0 6px 0 6px;
						box-sizing: border-box;
						color: #888888;
						font-size: 14px;
						margin-top: 10px;
						text-align: justify
					}
				}
			}
		}	
	}
</style>
