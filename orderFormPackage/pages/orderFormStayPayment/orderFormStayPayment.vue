<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>待付款</text>
					</view>
				</view>
				<view class="order-form-center">
					<view class="order-form-center-left">
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="order-form-center-right">
						<view class="brotected-person">
							<text>被护人</text>
							<text>燕双鹰 26岁</text>
						</view>
						<view class="service-address">
							<text>服务地址</text>
							<text>环球中心一号楼2单元403</text>
						</view>
						<view class="expectation-date">
							<text>期望时间</text>
							<text>06月14日 (星期二) 上午8：00-9：00</text>
						</view>
						<view class="evaluation-form">
							<text>初步评估单</text>
							<text>点击查看</text>
						</view>
					</view>
				</view>
			</view>
			<view class="price-list">
				<view class="price-list-top">
					<view class="price-list-title">
						<text>订单价格清单</text>
					</view>
				</view>
				<view class="price-list-content">
					<view class="price-list-one">
						<text>婴儿全身按摩</text>
						<text>￥998</text>
					</view>
					<view class="price-list-one price-list-two">
						<text>路程费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-three">
						<text>超时费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-four">
						<text>材料费用</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-five">
						<text>优惠</text>
						<text>￥0</text>
					</view>
					<view class="price-list-one price-list-last">
						<text>实付款</text>
						<text>￥998.00</text>
					</view>
				</view>
			</view>
			<view class="order-message">
				<view class="order-message-top">
					<view class="order-message-title">
						<text>订单信息</text>
					</view>
				</view>
				<view class="order-message-content">
					<view class="order-message-one-special">
						<view class="order-message-one-special-left">
							<text>订单编号:</text>
						</view>
						<view class="order-message-one-special-right">
							<text>asasa34343</text>
							<text  @click="copyContent(copyValue)">复制</text>
						</view>
					</view>
					<view class="order-message-one">
						<text>交易号:</text>
						<text>飒飒飒飒</text>
					</view>
					<view class="order-message-one">
						<text>创建时间:</text>
						<text>2012-01-10 12:45:23</text>
					</view>
				</view>
			</view>
			<view class="btn-area">
				<text>取消订单</text>
				<text>修改订单</text>
				<text class="at-once-payment">立即付款</text>
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
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '',
				copyValue: '复制测试',
				showLoadingHint: false
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
			},
			
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
		}
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 10px 0;
			box-sizing: border-box;
			position: relative;
			.order-form-list {
				padding: 0px 4px 8px 4px;
				background: #fff;
				box-sizing: border-box;
				margin-bottom: 10px;
				.order-form-top {
					display: flex;
					align-items: center;
					height: 50px;
					@include bottom-border-1px(#BBBBBB);
					justify-content: space-between;
					padding: 0 8px 0 10px;
					box-sizing: border-box;
					.order-form-title {
						flex: 1;
						@include no-wrap();
						>text {
							font-size: 16px;
							color: #444444;
							font-weight: bold
						}
					};
					.order-form-status {
						>text {
							display: inline-block;
							padding: 0 0 0 4px;
							box-sizing: border-box;
							font-size: 14px;
							color: #444444;
							font-weight: bold
						}
					}
				};
				.order-form-center {
					display: flex;
					justify-content: space-between;
					padding: 8px;
					box-sizing: border-box;
					.order-form-center-left {
						margin-right: 10px;
						::v-deep .u-image {
							// width: 88px !important;
							// height: 88px !important
						}
					};
					.order-form-center-right {
						padding-top: 10px;
						box-sizing: border-box;
						.brotected-person {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									word-break: break-all
								}
							}
						};
						.service-address {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									word-break: break-all
								}
							}
						};
						.expectation-date {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									word-break: break-all
								}
							}
						};
						.evaluation-form {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 66px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #3388FF;
									word-break: break-all
								}
							}
						}
					}
				}
			}
		};
		.price-list {
			background: #fff;
			margin-bottom: 10px;
			.price-list-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.price-list-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.price-list-content {
				padding: 6px 16px;
				box-sizing: border-box;
				.price-list-one {
					display: flex;
					justify-content: space-between;
					margin-bottom: 6px;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #3E4248;
						font-weight: bold;
						&:first-child {
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							
						}
					}
				};
				.price-list-last {
					>text {
						&:last-child {
							color: #E82050;
							font-size: 16px;
							font-weight: bold;
						}
					}
				}
			}
		};
		.order-message {
			background: #fff;
			margin-bottom: 10px;
			.order-message-top {
				display: flex;
				align-items: center;
				height: 50px;
				@include bottom-border-1px(#BBBBBB);
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				.order-message-title {
					flex: 1;
					@include no-wrap();
					>text {
						font-size: 16px;
						color: #444444;
						font-weight: bold
					}
				}
			};
			.order-message-content {
				padding: 6px 16px;
				box-sizing: border-box;
				.order-message-one-special {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					.order-message-one-special-left {
						font-size: 14px;
						font-weight: bold;
						color: #3E4248;
					};
					.order-message-one-special-right {
						display: flex;
						flex: 1;
						justify-content: flex-end;
						>text {
							display: inline-block;
							font-size: 14px;
							color: #3E4248;
							font-weight: bold;
							&:first-child {
								flex: 1;
								color: #B7B6B6;
								margin-right: 4px;
								text-align: right;
								word-break: break-all
							};
							&:last-child {
								color: #3E4248
							}
						}
					}
				};
				.order-message-one {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #3E4248;
						font-weight: bold;
						&:first-child {
							flex: 1;
							word-break: break-all
						};
						&:last-child {
							color: #B7B6B6
						}
					}
				}
			}
		};
		.btn-area {
			flex: 1;
			background: #fff;
			margin: 10px 0;
			padding: 0 10px;
			box-sizing: border-box;
			display: flex;
			height: 62px;
			align-items: center;
			justify-content: flex-end;
			>text {
				min-width: 78px;
				display: inline-block;
				height: 26px;
				padding: 0 12px;
				box-sizing: border-box;
				text-align: center;
				line-height: 26px;
				font-size: 13px;
				color: #5E5E5E;
				border: 1px solid #BBBBBB;
				border-radius: 22px;
				margin-right: 10px;
				&:last-child {
					margin-right: 0
				}
			};
			.at-once-payment {
				color: #fff;
				background: #FF698C;
				border: none !important;
				margin-right: 0 !important;
			};
		}
	}
</style>
