<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="authentication-box">
			<image src="@/static/img/face-recognition.png"></image>
			<view class="facial-authentication-text">
				刷脸认证
			</view>
			<view class="authentication-explain">
				当前功能必须实名本人才能使用，请确认本人操作。
			</view>
		</view>
		<view class="unbind-btn-box">
			<view class="unbind-btn" @click="authenticationEvent">
				<text>验证</text>
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
	import { getCareBankCardList } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				isShowNoData: true,
				isHidden: false,
				currentBankInfo: {
					cardNo: '',
					bank: ''
				}
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo',
				'selectedBankMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onLoad(options) {
			this.currentBankInfo = JSON.parse(options.transmitData)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 认证事件
			authenticationEvent () {
				// 传递当前银行卡信息
				let mynavData = JSON.stringify(this.currentBankInfo);
				uni.navigateTo({
					url: '/minePackage/pages/myBankCardDetails/myBankCardDetails?transmitData='+mynavData
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
		.authentication-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 50px 40px 0 40px;
			box-sizing: border-box;
			>image {
				width: 54px;
				height: 54px;
			};
			.facial-authentication-text {
				font-size: 20px;
				color: #000000;
				font-weight: 400;
				margin: 20px 0;
			};
			.authentication-explain {
				font-size: 14px;
				color: #000000;
			}
		};
		.unbind-btn-box {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100px;
			.unbind-btn {
				width: 80%;
				border-radius: 30px;
				background: #5064EB;
				height: 50px;
				text-align: center;
				line-height: 50px;
				>text {
					font-size: 16px;
					color: #fff;
				}
			}
		}
	}
</style>