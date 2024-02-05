<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="支付宝提现" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="withdraw-box">
			<view class="add-bank-area">
				<view class="add-bank-top">
					<text>尚未绑定支付宝</text>
				</view>
				<view class="add-bank-bottom" @click="alipayAuthorizationEvent">
					<text>点击支付宝授权</text>
				</view>
			</view>
			<view class="checke-bank-area">
				<view class="checke-bank-left">
					<u-icon name="zhifubao-circle-fill" color="#2979ff" size="56"></u-icon>
				</view>
				<view class="checke-bank-right">
					<view class="checke-bank-right-top">支付宝账号</view>
					<view class="checke-bank-right-bottom">1253691549</view>
				</view>
			</view>
			<view class="withdraw-money-alipay-area">
				<text @click="withdrawEvent">提现到银行卡</text>
			</view>
			<view class="withdraw-money-area">
				<view class="withdraw-money-top">
					<text>今日可提现3次</text>
				</view>
				<view class="withdraw-money-center">
					<view class="withdraw-money-center-left">
						<text>￥</text>
					</view>
					<view class="withdraw-money-center-right">
						<u--input
							placeholder="请输入提现金额"
							border="bottom"
							:color="isbeyondCash ? 'red':''"
							type="digit"
							@blur="moneyValueBlurEvent"
							v-model="moneyValue"
							clearable
						></u--input>
					</view>
				</view>
				<view class="withdraw-money-bottom">
					<view class="withdraw-money-bottom-left">
						<text>{{ `可提现金额¥${canCash}` }}</text>
					</view>
					<view class="withdraw-money-bottom-right" @click="allWithdrawEvent">
						<text>全部提现</text>
					</view>
				</view>
			</view>
			<view class="sure-withdraw-money-btn-area" @click="sureWithdrawEvent">
				<text>2小时到账,确认提现</text>
			</view>
			<view class="withdraw-money-explain">
				<view class="withdraw-money-explain-title">
					<text>提现须知</text>
				</view>
				<view class="withdraw-money-explain-content">
					<view class="withdraw-money-explain-content-one">
						1.请务必核对您的银行账号及用户名是否有误，以免账号输入错误等问题,影响您提现。
					</view>
					<view class="withdraw-money-explain-content-one">
						2.由于和第三方支付平台的合约规定,在本站流动的资金(充值和提现)均需向第三方交纳一定金额的手续费。
					</view>
					<view class="withdraw-money-explain-content-one">
						3.如果您充值的金额用于购物，则该手续费由洋觅网为您承担。
					</view>
					<view class="withdraw-money-explain-content-one">
						4.不购物直接提现，增加手续费用,本站会收取您提现金额0.9%的手续费。
					</view>
					<view class="withdraw-money-explain-content-one">
						5.提现到账时间3-7个工作日,请耐心等待。如超过7个工作日仍未到账请联系客服。
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
				infoText: '加载中',
				moneyValue: '',
				canCash: '',
				isbeyondCash: false
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo',
				'tradeStatisticsMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		watch: {
			moneyValue: {
				handler(newName, oldName) {
					if (!newName) {
						this.isbeyondCash = false;
						return;
					};
					if (newName > parseInt(this.canCash)) {
						this.isbeyondCash = true
					} else {
						this.isbeyondCash = false
					}
				},
				immediate: true,
				deep: true
			}
		},
		onShow() {
			this.canCash = this.tradeStatisticsMessage.canCash
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 提现到银行卡
			withdrawEvent (text) {
				uni.navigateTo({
					url: '/minePackage/pages/bankCardWithdraw/bankCardWithdraw'
				})
			},
			
			// 全部提现事件
			allWithdrawEvent () {
				this.isbeyondCash = false;
				this.moneyValue = parseInt(this.canCash)
			},
			
			// 支付宝授权事件
			alipayAuthorizationEvent () {},
			
			// 提现金额输入框失焦事件
			moneyValueBlurEvent () {
				if (!this.moneyValue && this.moneyValue !== 0) {
					return
				} else {
					if (this.moneyValue[0] == '.') {
						return
					};
					if (this.moneyValue > parseInt(this.canCash)) {
						this.isbeyondCash = true
					} else {
						this.isbeyondCash = false
					}
				}	
			},
			
			// 确认提现事件
			sureWithdrawEvent () {
				if (!this.moneyValue && this.moneyValue !== 0) {
					this.$refs.uToast.show({
						message: '请输入提现金额',
						type: 'error',
						position: 'center'
					});
					return
				} else {
					if (this.moneyValue[0] == '.') {
						this.$refs.uToast.show({
							message: '请输入正确的提现金额',
							type: 'error',
							position: 'center'
						});
						return
					};
					if (this.moneyValue > parseInt(this.canCash)) {
						this.$refs.uToast.show({
							message: '超出可提现金额上限,请修改提现金额',
							type: 'error',
							position: 'center'
						});
						return
					}
				};
				uni.navigateTo({
					url: '/minePackage/pages/withdrawSuccess/withdrawSuccess'
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
		.withdraw-box {
			flex: 1;
			overflow: auto;
			background: #F2F2F2;
			.add-bank-area {
				width: 100%;
				height: 160px;
				background: #fff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top: 20px;
				.add-bank-top {
					font-size: 14px;
					color: #101010;
					margin-bottom: 25px;
				};
				.add-bank-bottom {
					width: 140px;
					height: 36px;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #1864FF;
					border-radius: 50px;
					font-size: 16px;
					color: #fff;
				}
			};
			.checke-bank-area {
				display: flex;
				align-items: center;
				height: 128px;
				margin-top: 20px;
				background: #fff;
				padding: 0 10px;
				box-sizing: border-box;
				.checke-bank-left {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 20px;
				};
				.checke-bank-right {
					flex: 1;
					display: flex;
					flex-direction: column;
					font-size: 18px;
					color: #101010;
					.checke-bank-right-top {
						font-size: 18px;
						color: #101010;
						margin-bottom: 6px;
					};
					.checke-bank-right-bottom {
						font-size: 18px;
						color: #101010;
					};
				}
			};
			.withdraw-money-alipay-area {
				width: 100%;
				height: 40px;
				padding: 0 10px;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size: 14px;
				color: #3D8DFF;
			};
			.withdraw-money-area {
				background: #fff;
				padding: 10px;
				box-sizing: border-box;
				.withdraw-money-top {
					font-size: 14px;
					color: #999999;
				};
				.withdraw-money-center {
					display: flex;
					margin: 20px 0;
					align-items: center;
					.withdraw-money-center-left {
						font-size: 36px;
						color: #000000;
						margin-right: 20px;
					};
					.withdraw-money-center-right {
						flex: 1;
					}
				};
				.withdraw-money-bottom {
					display: flex;
					margin-top: 20px;
					align-items: center;
					justify-content: space-between;
					.withdraw-money-bottom-left {
						font-size: 14px;
						color: #999999;
					};
					.withdraw-money-bottom-right {
						font-size: 14px;
						color: #3D8DFF;
					}
				}
			};
			.sure-withdraw-money-btn-area {
				width: 80%;
				height: 44px;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #F8A0A0;
				border-radius: 4px;
				color: #fff;
				font-size: 16px;
				margin-top: 30px;
				margin-bottom: 30px;
			};
			.withdraw-money-explain {
				.withdraw-money-explain-title {
					font-size: 16px;
					color: #333333;
					margin-bottom: 8px;
					margin-left: 6px;
				};
				.withdraw-money-explain-content {
					.withdraw-money-explain-content-one {
						margin-bottom: 6px;
						color: #999999;
						font-size: 16px;
						word-break: break-all;
						line-height: 20px;
					}
				}
			}
		}
	}
</style>
