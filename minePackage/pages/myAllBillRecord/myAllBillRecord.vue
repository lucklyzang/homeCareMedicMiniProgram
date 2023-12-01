<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的账单" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="my-bill-top-box">
		</view>
		<view class="my-bill-bottom-box">
			<view class="my-bill-title">
				<text>2023年3月</text>
			</view>
			<view class="my-bill-list-box">
				<view class="my-bill-list">
					<view class="my-bill-list-left">
						<view class="week-text">
							<text>周三</text>
						</view>
						<view class="date-text">
							<text>07/15</text>
						</view>
					</view>
					<view class="my-bill-list-center">
						<view class="my-bill-list-center-top">
							<text>余额提现</text>
						</view>
						<view class="my-bill-list-center-bottom">
							<text>提现到招商银行储蓄卡（9527）</text>
						</view>
					</view>
					<view class="my-bill-list-right">
						<text>-</text>
						<text>1500.00元</text>
					</view>
				</view>
				<view class="my-bill-list">
					<view class="my-bill-list-left">
						<view class="week-text">
							<text>周三</text>
						</view>
						<view class="date-text">
							<text>07/15</text>
						</view>
					</view>
					<view class="my-bill-list-center">
						<view class="my-bill-list-center-top">
							<text>余额提现</text>
						</view>
						<view class="my-bill-list-center-bottom">
							<text>提现到招商银行储蓄卡（9527）</text>
						</view>
					</view>
					<view class="my-bill-list-right">
						<text>-</text>
						<text>1500.00元</text>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中'
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
		},
		methods: {
			...mapMutations([
			]),
			
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
		background: #fff;
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
		.my-bill-top-box {
			height: 80px;
			padding: 26px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between
		};
		.my-bill-bottom-box {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			.my-bill-title {
				height: 34px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 14px;
				color: #101010;
			};
			.my-bill-list-box {
				margin-top: 6px;
				.my-bill-list {
					display: flex;
					align-items: center;
					margin-bottom: 10px;
					padding: 12px 10px;
					box-sizing: border-box;
					box-shadow: 0px 2px 6px 0px #EFEFEF;
					.my-bill-list-left {
						.week-text {
							font-size: 14px;
							color: #101010;
							margin-bottom: 4px
						};
						.date-text {
							font-size: 14px;
							color: #101010;
						}
					};
					.my-bill-list-center {
						flex: 1;
						margin: 0 0 0 16px;
						.my-bill-list-center-top {
							font-size: 14px;
							color: #101010;
							margin-bottom: 16px;
						};
						.my-bill-list-center-bottom {
							font-size: 14px;
							color: #8A8A8A;
						}
					};
					.my-bill-list-right {
						font-size: 18px;
						color: #333333;
					}
				}
			}
		}
	}
</style>
