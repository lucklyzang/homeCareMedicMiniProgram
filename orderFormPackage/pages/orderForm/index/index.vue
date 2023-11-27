<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 订单详情弹框 -->
		<view class="order-form-details-dialog-box">
			<u-popup :show="orderFormDetailsDialogShow" @close="orderFormDetailsDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="accept-order-date">
					<view class="accept-order-date-title">
						<text>接受服务订单时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>2023-09-12 14:23:23</text>
					</view>
				</view>
				<view class="accept-order-date">
					<view class="accept-order-date-title">
						<text>出发时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>2023-09-12 14:23:23</text>
					</view>
				</view>
				<view class="accept-order-date">
					<view class="accept-order-date-title">
						<text>开始服务时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>2023-09-12 14:23:23</text>
					</view>
				</view>
				<view class="accept-order-date">
					<view class="accept-order-date-title">
						<text>完成服务时间</text>
					</view>
					<view class="accept-order-date-content">
						<text>2023-09-12 14:23:23</text>
					</view>
				</view>
			</u-popup>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="top-view-details">
			<view class="service-status">
				<text>服务完成</text>
			</view>
			<view class="btn-details" @click="orderFormDetailsDialogShow = true">
				<text>点击详情</text>
			</view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>派单中</text>
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
			<view class="patient-data">
				<view class="patient-data-title">
					<text>患者资料</text>
				</view>
				<view class="patient-data-image">
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
					<u-image src="@/static/img/health-nurse.png" width="63" height="63">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
			</view>
			<view class="service-site">
				<view class="service-site-title">
					<text>服务地点</text>
					<text>环球中心1号门1栋1单元1楼1011</text>
					<text>11.2km</text>
				</view>
				<view class="service-site-map-area">
				</view>
			</view>
			<view class="order-flow">
				<view class="order-flow-title">
					<text>订单流程</text>
				</view>
				<view class="order-flow-content">
					<u-steps current="4" dot inactiveColor="rgba(255, 255, 255, 0.5)" activeColor="#fff">
						<u-steps-item title="已支付"></u-steps-item>
						<u-steps-item title="派单中"></u-steps-item>
						<u-steps-item title="待出发"></u-steps-item>
						<u-steps-item title="待服务"></u-steps-item>
						<u-steps-item title="服务中"></u-steps-item>
						<u-steps-item title="待评价"></u-steps-item>
						<u-steps-item title="已完成"></u-steps-item>
					</u-steps>
				</view>
			</view>
			<view class="contact-patient">
				<view class="contact-patient-title">
					<text>联系患者</text>
				</view>
				<view class="contact-patient-content">
					<view class="phone-box">
						<image src="@/static/img/order-form-phone.png"></image>
						<text>拨打电话</text>
					</view>
					<view class="message-box">
						<image src="@/static/img/order-form-message.png"></image>
						<text>发送消息</text>
					</view>
				</view>
			</view>
			<view class="notice-box">
				<view class="notice-title">
					<text>须知</text>
				</view>
				<view class="notice-content">
					<view class="notice-list">
						1、啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
					<view class="notice-list">
						2、啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
					</view>
					<view class="notice-list">
						3、啥稍稍杀手评价啊三篇u就飒飒飒飒飒飒
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
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '',
				showLoadingHint: false,
				orderFormDetailsDialogShow: false
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
		.order-form-details-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						width: 92%;
						padding: 30px 10px 20px 10px;
						box-sizing: border-box;
						.u-popup__content__close {
							.uicon-close {
								color: #00070F !important;
								font-weight: bold !important
							}
						};
						.accept-order-date {
							margin-bottom: 19px;
							padding-left: 20px;
							box-sizing: border-box;
							.accept-order-date-title {
								font-size: 14px;
								color: #101010;
								margin-bottom: 4px
							};
							.accept-order-date-content {
								font-size: 14px;
								color: #101010
							}
						}
					}
				}
			}	
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
		.top-view-details {
			height: 100px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.service-status {
				font-size: 18px;
				color: #E86F50;
				margin-bottom: 10px;
			};
			.btn-details {
				width: 172px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #1983FD;
				border-radius: 18px;
				font-size: 14px;
				color: #fff;
			}
		};
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
									color: #5064EB;
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
									color: #5064EB;
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
									color: #5064EB;
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
		.patient-data {
			background: #fff;
			margin: 10px 0;
			padding: 6px 16px;
			box-sizing: border-box;
			.patient-data-title {
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px
			};
			.patient-data-image {
				display: flex;
				flex-wrap: wrap;
				.u-transition {
					width: 32%;
					margin-right: 2%;
					margin-bottom: 10px;
					&:nth-child(3n) {
						margin-right: 0 !important
					};
					::v-deep .u-image {
						width: 100% !important
					}
				}	
			}
		};
		.service-site {
			background: #fff;
			margin-bottom: 10px;
			padding: 6px 16px;
			box-sizing: border-box;
			.service-site-title {
				display: flex;
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px;
				>text {
					display: inline-block;
					&:nth-child(2) {
						flex: 1;
						margin: 0 10px;
						font-size: 12px;
						margin-top: 2px;
						color: #000000;
						word-break: break-all
					};
					&:nth-child(3) {
						font-size: 12px;
						margin-top: 2px;
						color: #000000
					}
				}
			};
			.service-site-map-area {}
		};
		.order-flow {
			height: 113px;
			background: #5064EB;
			margin-bottom: 10px;
			padding: 6px 16px 10px 16px;
			box-sizing: border-box;
			.order-flow-title {
				padding-left: 4px;
				box-sizing: border-box;
				font-size: 14px;
				color: #fff;
				margin-bottom: 20px
			};
			.order-flow-content {
				::v-deep .u-steps {
					.u-steps-item {
						.u-steps-item__wrapper {
							background: transparent !important
						};
						.u-steps-item__content {
							.u-text {
								.u-text__value {
									color: #fff !important
								}
							}
						}
					}
				}
			}
		};
		.contact-patient {
			background: #fff;
			margin-bottom: 10px;
			padding: 6px 16px;
			box-sizing: border-box;
			.contact-patient-title {
				display: flex;
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px;
			};
			.contact-patient-content {
				display: flex;
				.phone-box {
					flex: 1;
					image {
						width: 24px;
						height: 24px;
						margin-right: 10px;
						vertical-align: middle
					};
					text {
						color: #5064EB;
						font-size: 16px;
						vertical-align: middle
					}
				};
				.message-box {
					flex: 1;
					image {
						width: 24px;
						height: 24px;
						margin-right: 10px;
						vertical-align: middle
					};
					text {
						color: #5064EB;
						font-size: 16px;
						vertical-align: middle
					}
				};
			}
		};
		.notice-box {
			background: #fff;
			padding: 6px 16px;
			box-sizing: border-box;
			.notice-title {
				font-size: 14px;
				color: #3E4248;
				margin-bottom: 10px;
			};
			.notice-content {
				.notice-list {
					font-size: 12px;
					color: #222222;
					word-break: break-all;
					margin-bottom: 4px;
				}
			}
		}
	}
</style>
