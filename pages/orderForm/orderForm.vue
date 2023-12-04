<template>
	<view class="content-box">
		<!-- 拒绝订单原因弹框 -->
		<view class="refuse-order-form-dialog-box">
			<u-popup :show="refuseOrderFormDialogShow" @close="refuseOrderFormDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="top-title">
					<text>选择拒绝原因</text>
				</view>
				<view class="center-content">
					 <u-checkbox-group
							v-model="checkReasonValue"
							placement="column"
							@change="checkboxReasonChange"
						>
							<u-checkbox
								:customStyle="{marginBottom: '8px'}"
								v-for="(item, index) in checkboxReasonList"
								:key="index"
								:label="item.name"
								:name="item.name"
							>
							</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="bottom-btn">
					<view class="sure-btn" @click="sureRefuseEvent">
						<text>确定</text>
					</view>
					<view class="cancel-btn" @click="refuseOrderFormDialogShow = false">
						<text>取消</text>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 拒绝成功弹框 -->
		<view class="refuse-order-form-success-dialog-box">
			<u-popup :show="refuseOrderFormSuccessDialogShow" @close="refuseOrderFormSuccessDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<image src="@/static/img/refuse-order-form-success.png"></image>
				<view class="operation-success-title">
					<text>操作成功</text>
				</view>
				<view class="operation-success-content">
					<text>已成功拒绝订单，请到详情中查看</text>
				</view>
				<view class="operation-success-btn" @click="refuseOrderFormSuccessDialogShow = false">
					<text>确定</text>
				</view>
			</u-popup>
		</view>
		<!-- 接单成功弹框 -->
		<view class="accept-order-form-success-dialog-box">
			<u-popup :show="acceptOrderFormSuccessDialogShow" @close="acceptOrderFormSuccessDialogShow = false" :closeable="true" mode="center" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<image src="@/static/img/accept-order-form-success.png"></image>
				<view class="accept-success-title">
					<text>接单成功</text>
				</view>
				<view class="operation-success-btn" @click="acceptOrderFormSuccessDialogShow = false">
					<text>确定</text>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="我的订单">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="order-form-tabs">
			<u-tabs :list="list" :current="current" @change="change"
				lineWidth="50"
				lineColor="#5064EB"
				:activeStyle="{
					color: '#5064EB'
				}"
				:inactiveStyle="{
					color: '#444444'
				}"
			></u-tabs>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 0">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list" @click="enterOrderDetailsEvent">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>待接单</text>
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
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-left">
						<text>申请时间:</text>
						<text>2023-05-45 12:23:45</text>
					</view>
					<view class="consumption-rental-right">
						<text>￥:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-left">
						<text>联系被护人</text>
					</view>
					<view class="btn-area-right">
						<text @click.stop="refuseOrderFormEvent">拒绝订单</text>
						<text class="accept-payment" @click.stop="acceptOrderFormEvent">接受订单</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 1">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>待服务</text>
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
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-left">
						<text>申请时间:</text>
						<text>2023-05-45 12:23:45</text>
					</view>
					<view class="consumption-rental-right">
						<text>￥:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-left">
						<text>联系被护人</text>
					</view>
					<view class="btn-area-right">
						<text class="accept-payment">开始服务</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 2">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text class="completeStyle">已完成</text>
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
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-left">
						<text>申请时间:</text>
						<text>2023-05-45 12:23:45</text>
					</view>
					<view class="consumption-rental-right">
						<text>￥:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text>取消订单</text>
						<text class="at-once-payment">查看详情</text>
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
				loginBackgroundPng: require("@/static/img/login-background.png"),
				infoText: '',
				showLoadingHint: false,
				deleteShow: false,
				haveDeleteShow: false,
				cancelOrderFormShow: false,
				quitPayShow: false,
				applyRefundShow: false,
				remindSendOrdersShow: false,
				refuseOrderFormDialogShow: false,
				refuseOrderFormSuccessDialogShow: false,
				acceptOrderFormSuccessDialogShow: false,
				checkReasonValue: [],
				refundReason: '',
				deleteInfoContent: '删除订单不可恢复，如有疑问请联系客服人员资讯',
				haveDeleteInfoContent: '已删除订单',
				isShowNoData: false,
				checkboxReasonList: [
					{
						name: '专业知识太强做不到',
						disabled: false
					},
					{
						name: '距离太远时间来不及了',
						disabled: false
					},
					{
						name: '晚上有约会',
						disabled: false
					}
				],
				list: [
					{
						name: '待处理',
					},
					{
						name: '服务中',
					},
					{
						name: '全部',
					}
				],
				current: 0
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
			
			// 订单类型切换事件
			change(index) {
				this.current = index.index
			},
			
			// 选择原因弹框值变化事件
			checkboxReasonChange (n) {
				console.log('change', n);
			},
			
			// 拒绝订单事件
			refuseOrderFormEvent () {
				this.refuseOrderFormDialogShow = true
			},
			
			// 接受订单事件
			acceptOrderFormEvent () {
				this.acceptOrderFormSuccessDialogShow = true
			},
			
			// 确定拒绝事件
			sureRefuseEvent () {
				this.refuseOrderFormDialogShow = false;
				this.refuseOrderFormSuccessDialogShow = true
			},
			
			// 订单详情点击事件
			enterOrderDetailsEvent () {
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderForm/index/index'
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
		.refuse-order-form-success-dialog-box {
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
						image {
							width: 78px;
							height: 78px;
							margin: 0 auto;
							margin-top: 50px;
							margin-bottom: 30px;
						};
						.operation-success-title {
							text-align: center;
							font-size: 18px;
							color: #101010
						};
						.operation-success-content {
							text-align: center;
							font-size: 14px;
							color: #A0A0A0;
							margin: 20px 0
						};
						.operation-success-btn {
							width: 90%;
							margin: 0 auto;
							margin-bottom: 30px;
							height: 44px;
							border-radius: 8px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #4263EB;
							font-size: 16px;
							color: #fff;
							margin-bottom: 50px
						}
					}
				}
			}	
		};
		.accept-order-form-success-dialog-box {
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
						image {
							width: 100px;
							height: 100px;
							margin: 0 auto;
							margin-top: 50px;
							margin-bottom: 30px;
						};
						.accept-success-title {
							text-align: center;
							font-size: 18px;
							color: #101010;
							margin-bottom: 30px;
						};
						.operation-success-btn {
							width: 90%;
							margin: 0 auto;
							margin-bottom: 30px;
							height: 44px;
							border-radius: 8px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #4263EB;
							font-size: 16px;
							color: #fff;
							margin-bottom: 50px
						}
					}
				}
			}	
		};
		.refuse-order-form-dialog-box {
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
						.top-title {
							font-size: 18px;
							color: #101010;
							height: 40px;
							display: flex;
							justify-content: center;
							align-items: center
						};
						.center-content {
							margin: 20px 0
						};
						.bottom-btn {
							.sure-btn {
								width: 90%;
								margin: 0 auto;
								height: 44px;
								border-radius: 8px;
								display: flex;
								align-items: center;
								justify-content: center;
								background: #4263EB;
								font-size: 16px;
								color: #fff;
								margin-bottom: 10px
							};
							.cancel-btn {
								width: 90%;
								margin: 0 auto;
								height: 44px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 8px;
								border: 1px solid #D0D5DD;
								font-size: 16px;
								color: #585B60
							}
						}
					}
				}
			}	
		};
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
		.order-form-tabs {
			box-shadow: 0 2px 6px 0 rgba(202, 200, 200, 0.4);
			z-index: 1;
			::v-deep .u-tabs {
				.u-tabs__wrapper__scroll-view {
					.u-tabs__wrapper__nav__item {
						position: relative;
						flex: 1;
					}
				}
			}
		};
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 10px 6px;
			box-sizing: border-box;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.order-form-list {
				border-radius: 7px;
				padding: 0px 4px 8px 4px;
				background: #fff;
				box-sizing: border-box;
				margin-bottom: 10px;
				box-shadow: 0px 1px 4px 0px rgba(137, 140, 140, 0.24);
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
							color: #E86F50;
							font-weight: bold
						};
						.serviceStyle {
							color: #289E8E !important
						};
						.completeStyle {
							color: #020202 !important
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
						}
					}
				};
				.consumption-rental {
					padding: 0 8px 20px 8px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.consumption-rental-left {
						>text {
							display: inline-block;
							font-size: 13px;
							color: #505050;
							&:nth-child(1) {
								margin-right: 4px
							};
							&:nth-child(2) {
							}
						}
					};
					.consumption-rental-right {
						flex: 1;
						display: flex;
						width: 0;
						justify-content: flex-end;
						>text {
							display: inline-block;
							font-size: 12px;
							color: #505050;
							&:nth-child(1) {
								color: #5C5C5C;
								margin-right: 4px;
							};
							&:nth-child(2) {
								color: #E82050;
								font-weight: bold;
								word-break: break-all
							}
						}
					}
				};
				.order-form-bottom {
					height: 30px;
					display: flex;
					padding: 0 8px;
					box-sizing: border-box;
					justify-content: space-between;
					align-items: center;
					.btn-area-left {
						display: flex;
						>text {
							min-width: 78px;
							display: inline-block;
							height: 26px;
							padding: 0 12px;
							box-sizing: border-box;
							text-align: center;
							line-height: 26px;
							font-size: 13px;
							color: #fff;
							background: #289E8E;
							border-radius: 22px
						}
					};
					.btn-area-right {
						flex: 1;
						display: flex;
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
						.accept-payment {
							color: #fff;
							background: #1983FD;
							border: none !important;
							margin-right: 0 !important;
						}
					}	
				}
			}
		}
	}
</style>
