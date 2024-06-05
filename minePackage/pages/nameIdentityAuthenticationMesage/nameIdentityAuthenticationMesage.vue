<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" fontColor="#FFFFFF" backState='3000' bgColor="none" title="实名认证" @backClick="backTo">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="identity-authentication-box">
			<view class="identity-authentication-text-message">
				<view class="name-message">
					<view class="name-message-left">
						姓名
					</view>
					<view class="name-message-right">
						{{ realNameMessage.name }}
					</view>
				</view>
				<view class="certificate-type">
					<view class="certificate-type-left">证件类型</view>
					<view class="certificate-type-right">中国居民身份证</view>
				</view>
				<view class="certificate-number">
					<view class="certificate-number-left">证件号码</view>
					<view class="certificate-number-right">{{ realNameMessage.cardNo }}</view>
				</view>
			</view>
			<view class="identity-authentication-image-front">
				<view class="identity-authentication-image-front-left">
					身份证正面
				</view>
				<view class="identity-authentication-image-front-right">
					<image :src="realNameMessage.front" mode=""></image>
				</view>
			</view>
			<view class="identity-authentication-image-front">
				<view class="identity-authentication-image-front-left">
					身份证反面
				</view>
				<view class="identity-authentication-image-front-right">
					<image :src="realNameMessage.front" mode=""></image>
				</view>
			</view>
			<view class="identity-authentication-image-front">
				<view class="identity-authentication-image-front-left">
					人脸识别
				</view>
				<view class="identity-authentication-image-front-right">
					<image :src="realNameMessage.face" mode=""></image>
				</view>
			</view>
		</view>
		<view class="back-previous-page-box">
			<text>返回主页</text>
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
	import { getRealNameMessage } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				realNameMessage: {
					name: '',
					cardNo: '',
					front: '',
					back: '',
					face: ''
				},
				loginBackgroundPng: require("@/static/img/login-background.png")
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
			this.getRealNameMessageEvent()
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 获取医护认证信息
			getRealNameMessageEvent () {
				this.showLoadingHint = true;
				getRealNameMessage().then((res) => {
					if ( res && res.data.code == 0) {
						this.realNameMessage = res.data.data
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
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
		background: #f5f5f5;
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
		.identity-authentication-box {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			.identity-authentication-text-message {
				height: 190px;
				background: #fff;
				border-radius: 8px;
				padding: 0 10px;
				box-sizing: border-box;
				.name-message {
					display: flex;
					align-items: center;
					height: 63px;
					@include bottom-border-1px(#EBEDF4);
					.name-message-left {
						width: 56px;
						margin-right: 20px;
						font-size: 14px;
						font-weight: 500;
						color: #101010;
					};
					.name-message-right {
						font-size: 14px;
						color: #BBBBBB;
						flex: 1
					}
				};
				.certificate-type {
					display: flex;
					align-items: center;
					height: 63px;
					@include bottom-border-1px(#EBEDF4);
					.certificate-type-left {
						width: 56px;
						margin-right: 20px;
						font-size: 14px;
						font-weight: 500;
						color: #101010;
					};
					.certificate-type-right {
						font-size: 14px;
						color: #BBBBBB;
						flex: 1
					}
				};
				.certificate-number {
					display: flex;
					align-items: center;
					height: 63px;
					.certificate-number-left {
						width: 56px;
						margin-right: 20px;
						font-size: 14px;
						font-weight: 500;
						color: #101010;
					};
					.certificate-number-right {
						font-size: 14px;
						color: #BBBBBB;
						flex: 1
					}
				}
			};
			.identity-authentication-image-front {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 10px;
				height: 96px;
				background: #fff;
				border-radius: 8px;
				padding: 0 14px;
				.identity-authentication-image-front-left {
					font-size: 14px;
					color: #101010;
					font-weight: 500;
				};
				.identity-authentication-image-front-right {
					width: 90px;
					height: 60px;
					image {
						width: 100%;
						height: 100%
					}
				}
			}
		};
		.back-previous-page-box {
			width: 100%;
			height: 120px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				width: 80%;
				height: 40px;
				line-height: 40px;
				text-align: center;
				background: #5064EB;
				border-radius: 2px;
				font-size: 14px;
				color: #fff;
				box-shadow: 0px 4px 4px 0 rgba(34, 34, 34, 0.25);
			}
		}
	}
</style>