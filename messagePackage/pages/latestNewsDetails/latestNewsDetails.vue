<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="最新资讯" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="message-title-wrapper">
			<view class="message-title-left">
				<view class="message-title-left-top">
					{{ detailsMessage.title }}
				</view>
				<view class="message-title-left-bottom">
					<text>{{ detailsMessage.author }}</text>
					<text>{{ getNowFormatDate(new Date(detailsMessage.createTime),4) }}</text>
					<!-- <text>{{ detailsMessage.nursePosition }}</text> -->
				</view>
			</view>
			<view class="message-title-right">
				<u-icon v-if="!isProductFavorite" name="heart-fill" color="#d8d8d8" size="24" @click="collectInformationEvent"></u-icon>
				<u-icon v-else name="heart-fill" color="#FC4579" size="36" @click="collectInformationEvent"></u-icon>
			</view>
		</view>
		<view class="message-content-wrapper">
			<rich-text :nodes="detailsMessage.description"></rich-text>
			<u-empty text="暂无资讯" mode="list" v-if="isShowNoData"></u-empty>
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
	import { getNewsDetails,createInformationFavorite,deleteInformationFavorite } from '@/api/user.js'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '加载中···',
				showLoadingHint: false,
				status: 'nomore',
				isShowNoData: false,
				isProductFavorite: false,
				detailsMessage: {
					description: ''
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
			let temporaryAddress = JSON.parse(decodeURIComponent(options.transmitData));
			this.detailsMessage = temporaryAddress;
			this.getNewsDetailsEvent(this.detailsMessage.id)
		},	
		methods: {
			...mapMutations([
			]),

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
			},
			
			// 获取资讯详情
			getNewsDetailsEvent(id) {
				this.showLoadingHint = true
				this.infoText = '';
				getNewsDetails({id}).then((res) => {
					if ( res && res.data.code == 0) {
						this.detailsMessage = res.data.data;
						this.isProductFavorite = res.data.data['isFavorites'];
						if (this.detailsMessage.hasOwnProperty('description')) {
							this.detailsMessage.description = this.detailsMessage.description.replace(/\<img/gi, '<img class="mystyle"');
							this.detailsMessage.description = this.detailsMessage.description.replace(/\<p/gi, '<p class="pstyle"');
							this.detailsMessage.description = this.detailsMessage.description.replace(/\<div/gi, '<div class="dstyle"')
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
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
			
			// 创建资讯收藏
			createInformationFavoriteEvent() {
				this.showLoadingHint = true;
				this.infoText = '收藏中···';
				createInformationFavorite({id: this.detailsMessage.id }).then((res) => {
					if ( res && res.data.code == 0) {
						this.isProductFavorite = true
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
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
			
			// 取消资讯收藏事件
			deleteInformationFavoriteEvent (item,index) {
				this.showLoadingHint = true;
				this.infoText = '取消收藏中···';
				deleteInformationFavorite({id: this.detailsMessage.id }).then((res) => {
					if ( res && res.data.code == 0) {
						this.isProductFavorite = false
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
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
			
			// 收藏/取消收藏服务事件
			collectInformationEvent () {
				if (this.isProductFavorite) {
					this.deleteInformationFavoriteEvent()
				} else {
					this.createInformationFavoriteEvent()
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
			background: #f5f5f5;
			::v-deep .nav {
				width: 100%;
				background: #f5f5f5;
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
		.message-title-wrapper {
			padding: 10px 16px 16px 16px;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.message-title-left {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.message-title-left-top {
					font-size: 22px;
					color: #000000;
					font-weight: 600;
					word-break: break-all;
					margin-bottom: 20px;
				};
				.message-title-left-bottom {
					word-break: break-all;
					>text {
						font-size: 14px;
						color: #BCB3BC;
						&:nth-child(2) {
							margin: 0 20px;
						}
					}
				};
			};
			.message-title-right {}
		};
		.message-content-wrapper {
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: column;
			padding: 16px;
			box-sizing: border-box;
			position: relative;
			.mystyle {
				width: 100%;
				display: block;
			};
			.pstyle {
				width: 100%;
				word-break: break-all;
			};
			.dstyle {
				width: 100%;
				word-break: break-all;
			};
			::v-deep .u-empty {
			 	position: absolute;
			 	top: 50%;
			 	left: 50%;
			 	transform: translate(-50%,-50%)
			 }
		}	
	}
</style>
