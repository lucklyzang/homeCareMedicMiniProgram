<template>
	<view class="content-box">
		<!-- 删除订单提示 -->
		<view class="delete-info">
			<u-modal :show="deleteShow" @confirm="deleteShow=false" @cancel="deleteShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :content="deleteInfoContent" :showCancelButton="true" title="是否删除订单">
			</u-modal>
		</view>
		<!-- 取消订单提示 -->
		<view class="cancel-info">
			<u-modal :show="cancelOrderFormShow" @cancel="cancelOrderFormShow=false" @confirm="cancelOrderFormShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="取消订单">
				<view class="slot-content">
					为保障医护因无效订单而错过有效接单，每日最多取消3次，超过3次后当日不可再发布订单，请谅解。<br/>
					今日剩余 3 次，确认取消订单吗？
				</view>
			</u-modal>
		</view>
		<!-- 申请退款提示 -->
		<view class="apply-refund-info">
			<u-modal :show="applyRefundShow" @confirm="applyRefundShow=false" @cancel="applyRefundShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="申请退款">
				<view class="slot-content">
					<u-textarea height="100" v-model="refundReason" placeholder="请填写申请退款理由" count ></u-textarea>
				</view>
			</u-modal>
		</view>
		<!-- 退出支付提示 -->
		<view class="quit-pay-info">
			<u-modal :show="quitPayShow" @confirm="quitPayShow=false" :buttonReverse="true" @cancel="quitPayShow=false" confirmText="确定" cancelText="取消" cancelColor="#838C97" confirmColor="#EB3E67" :showCancelButton="true" title="当前订单还未支付">
				<view class="slot-content">
					确定退出支付吗？
				</view>
			</u-modal>
		</view>
		<!-- 操作订单成功提示 -->
		<view class="have-delete-info">
			<u-modal :show="haveDeleteShow" @confirm="haveDeleteShow=false" confirmText="确定" confirmColor="#EB3E67" :content="haveDeleteInfoContent" title="">
			</u-modal>
		</view>
		<!-- 提醒派单提示 -->
		<view class="remind-send-orders-info">
			<u-modal :show="remindSendOrdersShow" @confirm="remindSendOrdersShow=false" confirmText="确定" confirmColor="#EB3E67">
				<view class="slot-content">
					<view>
						已提醒派单
					</view>
					<view>
						三分钟前已提醒了
					</view>
				</view>
			</u-modal>
		</view>
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="我的订单">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-tabs">
			<u-tabs :list="list" :current="current" @change="change"
				lineWidth="50"
				lineColor="#FF698C"
				:activeStyle="{
					color: '#FF698C'
				}"
				:inactiveStyle="{
					color: '#444444'
				}"
			></u-tabs>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 0">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
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
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-left">
						<text>剩余支付时间:</text>
						<text>14:59</text>
					</view>
					<view class="consumption-rental-right">
						<text>待付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-left">
						<text>联系护士</text>
					</view>
					<view class="btn-area-right">
						<text>取消订单</text>
						<text @click="editOrderFormEvent">修改订单</text>
						<text class="at-once-payment">立即付款</text>
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
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-left">
						<text>剩余支付时间:</text>
						<text>14:59</text>
					</view>
					<view class="consumption-rental-right">
						<text>待付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text @click="remindSendOrdersEvent">提醒派单</text>
						<text>修改订单</text>
						<text class="at-once-payment">立即付款</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 2">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list" @click="enterOrderDetailsEvent">
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
					</view>
				</view>
				<view class="consumption-rental">
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text>取消订单</text>
						<text>提醒派单</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 3">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>待出发</text>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-left">
						<text>联系护士</text>
					</view>
					<view class="btn-area-right">
						<text>取消订单</text>
					</view>
				</view>
			</view>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-left">
						<text>联系护士</text>
					</view>
					<view class="btn-area-right">
						<text>取消订单</text>
					</view>
				</view>
			</view>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>服务中</text>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-left">
						<text>联系护士</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 4">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>待评价</text>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text>再次预约</text>
						<text class="evaluate" @click="orderFormEvaluateEvent">评价</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-form-list-wrapper" v-show="current == 5">
			<u-empty text="暂无订单" mode="list" v-if="isShowNoData"></u-empty>
			<view class="order-form-list" @click="enterOrderDetailsEventOther">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>已退款</text>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text>删除订单</text>
						<text>再次预约</text>
					</view>
				</view>
			</view>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>已取消</text>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text>删除订单</text>
						<text>再次预约</text>
					</view>
				</view>
			</view>
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>退款中</text>
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
					<view class="consumption-rental-right">
						<text>实付总额:</text>
						<text>￥998.00</text>
					</view>
				</view>
				<view class="order-form-bottom">
					<view class="btn-area-right">
						<text>再次预约</text>
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
				deleteShow: false,
				haveDeleteShow: false,
				cancelOrderFormShow: false,
				quitPayShow: false,
				applyRefundShow: false,
				remindSendOrdersShow: false,
				refundReason: '',
				deleteInfoContent: '删除订单不可恢复，如有疑问请联系客服人员资讯',
				haveDeleteInfoContent: '已删除订单',
				isShowNoData: false,
				list: [
					{
						name: '全部',
						badge: {
							value: 5
						}
					}, 
					{
						name: '待付款'
					}, 
					{
						name: '派单中',
						badge: {
							value: 90
						}
					},
					{
						name: '服务中',
					},
					{
						name: '待评价'
					},
					{
						name: '取消|退款'
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
			
			// 提醒派单事件
			remindSendOrdersEvent () {
				this.remindSendOrdersShow = true
			},
			
			// 订单评价事件
			orderFormEvaluateEvent () {
				uni.navigateTo({
					url: '/orderFormPackage/pages/serviceEvaluate/serviceEvaluate'
				})
			},
			
			// 修改订单事件
			editOrderFormEvent () {
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderFormEdit/orderFormEdit'
				})
			},
			
			// 订单详情点击事件
			enterOrderDetailsEvent () {
				// 派单中
				// uni.navigateTo({
				// 	url: '/orderFormPackage/pages/orderForm/index/index'
				// })
				// 已完成
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderFormComplete/orderFormComplete'
				})
				// 待付款
				// uni.navigateTo({
				// 	url: '/orderFormPackage/pages/orderFormStayPayment/orderFormStayPayment'
				// });
				// 服务中
				// uni.navigateTo({
				// 	url: '/orderFormPackage/pages/orderFormInService/orderFormInService'
				// });
				// 待评价
				// uni.navigateTo({
				// 	url: '/orderFormPackage/pages/orderFormStayEvaluate/orderFormStayEvaluate'
				// })
			},
			
			// 订单详情点击事件(取消|退款)
			enterOrderDetailsEventOther () {
				uni.navigateTo({
					url: '/orderFormPackage/pages/orderFormCancelOrRefund/orderFormCancelOrRefund'
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
		::v-deep .u-popup__content{
			.u-modal {
				.u-modal__title {
					font-size: 16px !important;
					color: #101010 !important
				};
				.u-line {
					border: none !important
				};
				.u-modal__content {
					padding: 20px 10px 30px 10px !important;
					font-size: 14px !important;
					color: #898C8C !important
				};
				.u-modal__button-group {
					height: 50px;
					justify-content: center;
					.u-line {
						border: none !important
					};
					.u-modal__button-group__wrapper--cancel {
						flex: none !important;
						width: 100px !important;
						height: 34px !important;
						line-height: 34px !important;
						border-radius: 7px !important;
						border: 1px solid #FF698C !important;
						.u-modal__button-group__wrapper__text {
							font-size: 14px;
							color: #FF698C !important;
						}
					};
					.u-modal__button-group__wrapper--confirm {
						flex: none !important;
						width: 100px !important;
						height: 34px !important;
						line-height: 34px !important;
						border-radius: 7px !important;
						margin-right: 30px;
						background: #FF698C !important;
						border: none !important;
						.u-modal__button-group__wrapper__text {
							font-size: 14px;
							color: #fff !important;
						}
					}
				}
			}
		};
		.apply-refund-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.slot-content {
							width: 280px
						}
					}
				}
			}
		};
		.have-delete-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.u-modal__content {
							padding: 40px 10px !important;
							box-sizing: border-box;
							.u-modal__content__text {
								font-size: 18px !important;
								color: #101010 !important;
								text-align: center !important
							}
						};
						.u-modal__button-group {
							.u-modal__button-group__wrapper--confirm {
								margin-left: 0 !important
							}
						}
					}
				}
			}
		};
		.remind-send-orders-info {
			::v-deep .u-transition {
				.u-popup__content {
					.u-modal {
						.u-modal__content {
							padding: 40px 10px !important;
							box-sizing: border-box;
							.slot-content {
								>view {
									text-align: center;
									font-size: 18px !important;
									color: #101010 !important;
									&:first-child {
										margin-bottom: 6px
									}
								}
							}
						};
						.u-modal__button-group {
							.u-modal__button-group__wrapper--confirm {
								border-radius: 37px !important;
								margin-left: 0 !important;
								background: #EB3E67 !important
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
					color: #101010 !important;
					text {
						color: #101010 !important;
					}
				}
			}
		};
		.order-form-tabs {
			box-shadow: 0 2px 6px 0 rgba(202, 200, 200, 0.4);
			z-index: 1;
			::v-deep .u-tabs {
				.u-tabs__wrapper__scroll-view {
					.u-tabs__wrapper__nav__item {
						position: relative;
						.u-badge {
							position: absolute;
							top: 0;
							right: -6px;
							background: #fff !important;
							border: 1px solid #D84959;
							color: #D84959 !important;
							width: 16px !important;
							height: 16px !important;
							border-radius: 50%;
							display: inline-block;
							text-align: center;
							line-height: 16px;
							@include no-wrap
						};
						.u-badge--not-dot {
							padding: 0 !important
						}
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
							font-weight: bold;
							color: #FF0000;
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
							&:nth-child(1) {
								color: #777777;
								margin-right: 4px;
							};
							&:nth-child(2) {
								color: #F16C8C;
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
						.at-once-payment {
							color: #fff;
							background: #FF698C;
							border: none !important;
							margin-right: 0 !important;
						};
						.complete-service {
							color: #fff;
							background: #FF698C;
							border: none !important;
							margin-right: 0 !important;
						};
						.evaluate {
							color: #fff;
							background: #FF698C;
							border: none !important;
							margin-right: 0 !important;
						}
					}	
				}
			}
		}
	}
</style>
