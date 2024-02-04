<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="银行卡提现" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="withdraw-box">
			<view class="add-bank-area" v-if="cardList.length == 0">
				<view class="add-bank-top">
					<text>尚未添加银行卡</text>
				</view>
				<view class="add-bank-bottom" @click="addBankCardEvent">
					<text>点击添加</text>
				</view>
			</view>
			<view class="checke-bank-area" v-else>
				<view class="checke-bank-left">
					<view class="circle-outer">
						<view class="circle-inner">
						</view>
					</view>
				</view>
				<view class="checke-bank-center">
					<view class="checke-bank-center-top">
						{{ selectedBankMessage.bank }}
					</view>
					<view class="checke-bank-center-bottom">
						{{ selectedBankMessage.cardNo }}
					</view>
				</view>
				<view class="checke-bank-right" @click="changeBankCardEvent">
					<text>更换</text>
					<u-icon name="arrow-right" color="#101010" size="22"></u-icon>
				</view>
			</view>
			<view class="withdraw-money-alipay-area">
				<text @click="withdrawEvent">提现到支付宝</text>
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
							type="digit"
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
				<text>确认提现</text>
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
	import { getCareBankCardList } from '@/api/user.js'
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
				cardList: [],
				canCash: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo',
				'selectedBankMessage',
				'tradeStatisticsMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			this.getCareBankCardListEvent();
			this.canCash = this.tradeStatisticsMessage.canCash
		},
		methods: {
			...mapMutations([
				'storeSelectedBankMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 全部提现事件
			allWithdrawEvent () {
				this.moneyValue = this.canCash
			},
			
			// 添加银行卡事件
			addBankCardEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/bindBankCard/bindBankCard'
				})
			},
			
			// 获取提现银行卡列表
			getCareBankCardListEvent () {
				this.cardList = [];
				getCareBankCardList({careId : this.userInfo.careId}).then((res) => {
					if ( res && res.data.code == 0) {
						this.cardList = res.data.data;
						if (JSON.stringify(this.selectedBankMessage) == '{}') {
							let temporaryMessage = this.cardList.filter((item) => { return item.defaultStatus == true})[0]
							this.storeSelectedBankMessage(temporaryMessage)
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
				})
				.catch((err) => {
				})
			},
			
			// 更换银行卡事件
			changeBankCardEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/selectBankCard/selectBankCard'
				})
			},
			
			// 提现到支付宝
			withdrawEvent (text) {
				uni.navigateTo({
					url: '/minePackage/pages/alipayWithdraw/alipayWithdraw'
				})
			},
			
			// 确认提现事件
			sureWithdrawEvent () {
				if (!this.moneyValue && this.moneyValue !== 0) {
					this.$refs.uToast.show({
						message: '请输入提现金额',
						type: 'error',
						position: 'bottom'
					});
					return
				} else {
					if (this.moneyValue <= 0) {
						this.$refs.uToast.show({
							message: '提现金额必须大于0',
							type: 'error',
							position: 'bottom'
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
					width: 115px;
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
					.circle-outer {
						width: 25px;
						height: 25px;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid #5064EB;
						.circle-inner {
							width: 14px;
							height: 14px;
							border-radius: 50%;
							background: #5064EB
						}
					}
				};
				.checke-bank-center {
					margin: 0 15px;
					flex: 1;
					.checke-bank-center-top {
						font-size: 18px;
						color: #101010;
						margin-bottom: 8px
					};
					.checke-bank-center-bottom {
						font-size: 18px;
						color: #101010
					}
				};
				.checke-bank-right {
					display: flex;
					font-size: 18px;
					color: #101010
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
