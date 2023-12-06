<template>
	<view class="content-box">
		<!-- 选择提现方式弹框 -->
		<view class="withdrawal-method-dialog-box">
			<u-popup :show="withdrawalMethodDialogShow" @close="withdrawalMethodDialogShow = false" :closeable="true" mode="bottom" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="top-title">
					<text>选择提现方式</text>
				</view>
				<view class="center-content">
					<view class="sure-btn">
						<text>银行卡提现</text>
					</view>
					<view class="cancel-btn">
						<text>支付宝提现</text>
					</view>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的账单" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="my-bill-top-box">
			<view class="today-earnings">
				<view class="today-earnings-left">
					<text>今日收益</text>
					<text>568.00</text>
				</view>
				<view class="today-earnings-right" @click="withdrawalMethodDialogShow = true">
					<text>去提现</text>
					<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
				</view>
			</view>
			<view class="classified-statistic">
				<view>
					<view>
						<text>接单总数</text>
					</view>
					<view>
						<text>50</text>
						<text>单</text>
					</view>
				</view>
				<view>
					<view>
						<text>累计收益</text>
					</view>
					<view>
						<text>50</text>
						<text>元</text>
					</view>
				</view>
				<view>
					<view>
						<text>可提现额度</text>
					</view>
					<view>
						<text>50</text>
						<text>元</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-bill-bottom-box">
			<view class="my-bill-title">
				<view class="my-bill-title-left">
					<text>近期账单</text>
				</view>
				<view class="my-bill-title-right" @click="viewAllRecordEvent">
					<text>查看全部记录</text>
				</view>
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
				withdrawalMethodDialogShow: false,
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
			},
			
			// 查看全部记录事件
			viewAllRecordEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/myAllBillRecord/myAllBillRecord'
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
			height: 187px;
			padding: 26px;
			box-sizing: border-box;
			background: #5064EB;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.today-earnings {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.today-earnings-left {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					text {
						font-weight: bold;
						&:nth-child(1) {
							font-size: 13px;
							color: #fff;
							margin-bottom: 4px
						};
						&:nth-child(2) {
							font-size: 13px;
							color: #fff
						}
					}
				};
				.today-earnings-right	{
					display: flex;
					>text {
						font-size: 28px;
						color: #fff;
						margin-right: 4px
					}
				}
			};
			.classified-statistic {
				flex: 1;
				display: flex;
				align-items: flex-end;
				>view {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					>view {
						width: 100%;
						padding: 0 4px;
						box-sizing: border-box;
						word-break: break-all;
						&:nth-child(1) {
							margin-bottom: 6px;
							font-size: 13px;
							color: #fff
						};
						&:nth-child(2) {
							>text {
								font-size: 13px;
								color: #fff
							}
						}
					}
				}
			}
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
				.my-bill-title-left {
					width: 74px;
					height: 34px;
					font-size: 14px;
					color: #101010;
					display: flex;
					justify-content: center;
					align-items: center;
					border-left: 4px solid #3D8DFF
				};
				.my-bill-title-right {
					font-size: 14px;
					color: #101010;
				}
			};
			.my-bill-list-box {
				margin-top: 26px;
				.my-bill-list {
					display: flex;
					align-items: center;
					margin-bottom: 30px;
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
