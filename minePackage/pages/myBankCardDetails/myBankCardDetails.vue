<template>
	<view class="content-box">
		<!-- 显示完整卡号弹窗 -->
		<view class="remind-send-orders-info">
			<u-modal :show="isShowCardNoDialog" :showConfirmButton="false">
				<view class="slot-content">
					<view>
						<text>完整卡号</text>
						<u-icon name="close" size="22" color="#101010" @click="isShowCardNoDialog = false"></u-icon>
					</view>
					<view>
						<text>{{ currentBankInfo.cardNo }}</text>
						<image @click="copyContent(currentBankInfo.cardNo)" src="@/static/img/copy-icon.png"></image>
					</view>
				</view>
			</u-modal>
		</view>
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="银行卡" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="select-bank-card-box">
			<view class="card-list">
				<view class="card-top">
					<view class="card-top-left"></view>
					<view class="card-top-center">
						{{ currentBankInfo.bank }}
					</view>
				</view>
				<view class="card-center">
					<view class="card-center-left">
						{{ currentBankInfo.cardNo }}
					</view>
					<view class="card-center-right">
						<u-icon name="eye-fill" color="#fff"></u-icon>
						<text @click="viewFullCardNoEvent">完整卡号</text>
					</view>
				</view>
			</view>
			<view class="bill-area">
				<view class="bill-top">
					<text>账单</text>
					<u-icon @click="isHidden = !isHidden" :name="isHidden ? 'eye-off' : 'eye-fill'" size="18" color="#000000"></u-icon>
				</view>
				<view class="bill-bottom">
					<view class="bill-bottom-left">
						<view class="income-text">
							本月收入
						</view>
						<view class="income-number">
							{{ isHidden ? '*' : '+554' }}
						</view>
					</view>
					<view class="bill-bottom-right">
						<view class="withdraw-text">
							本月提现
						</view>
						<view class="withdraw-number">
							{{ isHidden ? '*' : '+254' }}
						</view>
					</view>
				</view>
			</view>
			<view class="unbind-btn">
				<text>解绑</text>
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
				isShowCardNoDialog: false,
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
			
			// 查看完整卡号事件
			viewFullCardNoEvent () {
				this.isShowCardNoDialog = true
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
		.remind-send-orders-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.u-modal__content {
							padding: 20px 10px !important;
							box-sizing: border-box;
							.slot-content {
								width: 100%;
								>view {
									&:first-child {
										display: flex;
										align-items: center;
										justify-content: space-between;
										margin-bottom: 20px;
										>text {
											display: inline-block;
											flex: 1;
											text-align: center;
											font-size: 14px;
											color: #000000
										}
									};
									&:last-child {
										display: flex;
										align-items: center;
										justify-content: center;
										word-break: break-all;
										>text {
											display: inline-block;
											flex: 1;
											text-align: center;
											font-size: 14px;
											color: #000000;
											margin-right: 10px;
										};
										>image {
											width: 20px;
											height: 20px;
										}
									}
								}
							}
						}
					}
				}
			}
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
		.select-bank-card-box {
			flex: 1;
			overflow: auto;
			padding: 20px;
			box-sizing: border-box;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.card-list {
				width: 100%;
				height: 130px;
				padding: 10px 20px;
				box-sizing: border-box;
				border-radius: 10px;
				margin-bottom: 20px;
				background-image: linear-gradient(to bottom,#2D7ED4, #489AE6);
				.card-top {
					display: flex;
					align-items: center;
					.card-top-left {
						width: 40px;
					};
					.card-top-center {
						flex: 1;
						margin-left: 10px;
						font-size: 18px;
						color: #fff
					}
				};
				.card-center {
					margin-top: 20px;
					margin-left: 50px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					word-break: break-all;
					.card-center-left {
						font-size: 18px;
						color: #fff;
						flex: 1;
					};
					.card-center-right {
						width: 80px;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 4px 6px;
						box-sizing: border-box;
						border-radius: 6px;
						background: rgba(255, 255, 255, 0.37);
						>text {
							font-size: 12px;
							color: #fff;
						}
					}
				}
			};
			.bill-area {
				border-radius: 7px;
				background: #fff;
				height: 164px;
				margin-bottom: 20px;
				.bill-top {
					padding-left: 20px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					height: 50px;
					border-bottom: 1px dashed #BBBBBB;
					>text {
						font-size: 16px;
						color: #000000;
						margin-right: 2px;
					}
				};
				.bill-bottom {
					display: flex;
					padding: 20px 0 0 20px;
					box-sizing: border-box;
					.bill-bottom-left {
						flex: 1;
						.income-text {
							font-size: 14px;
							color: #747679;
							margin-bottom: 10px;
						};
						.income-number {
							font-size: 20px;
							color: #000000;
							font-weight: 400;
						}
					};
					.bill-bottom-right {
						flex: 1;
						.withdraw-text {
							font-size: 14px;
							color: #747679;
							margin-bottom: 10px;
						};
						.withdraw-number {
							font-size: 20px;
							color: #000000;
							font-weight: 400;
						}
					}
				}
			};
			.unbind-btn {
				border-radius: 7px;
				background: #fff;
				height: 53px;
				text-align: center;
				line-height: 53px;
				>text {
					font-size: 16px;
					color: #000000;
				}
			}
		}
	}
</style>