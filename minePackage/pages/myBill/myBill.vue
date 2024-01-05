<template>
	<view class="content-box">
		<!-- 选择提现方式弹框 -->
		<view class="withdrawal-method-dialog-box">
			<u-popup :show="withdrawalMethodDialogShow" @close="withdrawalMethodDialogShow = false" :closeable="true" mode="bottom" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="top-title">
					<text>选择提现方式</text>
				</view>
				<view class="center-content">
					<view class="sure-btn" @click="withdrawEvent('银行卡')">
						<text>银行卡提现</text>
					</view>
					<view class="cancel-btn" @click="withdrawEvent('支付宝')">
						<text>支付宝提现</text>
					</view>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
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
					<text>{{ tradeStatistics.todayAmount }}</text>
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
						<text>{{ tradeStatistics.orderCount }}</text>
						<text>单</text>
					</view>
				</view>
				<view>
					<view>
						<text>累计收益</text>
					</view>
					<view>
						<text>{{ tradeStatistics.totalAmount }}</text>
						<text>元</text>
					</view>
				</view>
				<view>
					<view>
						<text>可提现额度</text>
					</view>
					<view>
						<text>{{ tradeStatistics.canCash }}</text>
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
				<u-empty text="您还没有近期账单" mode="list" v-if="isShowNoData"></u-empty>
				<view class="my-bill-list" v-for="(item,index) in recentNurseBillList" :key="index" @click="enterBillDetailsEvent(item)">
					<view class="my-bill-list-left">
						<view class="week-text">
							<text>{{ judgeWeek(item.cashTime) }}</text>
						</view>
						<view class="date-text">
							<text>{{ getNowFormatDate(new Date(item.cashTime),5) }}</text>
						</view>
					</view>
					<view class="my-bill-list-center">
						<view class="my-bill-list-center-top">
							<text>{{ item.occurType === 'IN' ? '订单到账' : item.occurType === 'OUT' ? '余额提现' : '未知类型' }}</text>
						</view>
						<view class="my-bill-list-center-bottom" v-if="item.occurType === 'OUT'">
							<text>{{ `提现到${item.cashBank}储蓄卡 (${cutLastSomeChars(item.cashCard,4)})` }}</text>
						</view>
					</view>
					<view class="my-bill-list-right">
						<text>{{ item.occurType === 'IN' ? '+' : item.occurType === 'OUT' ? '-' : '' }}</text>
						<text>{{ `${item.amount}元` }}</text>
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
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { recentNurseBill } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				withdrawalMethodDialogShow: false,
				infoText: '加载中···',
				isShowNoData: false,
				tradeStatistics: {
					todayAmount: 0,
					todayCount: 0,
					orderCount: 0,
					totalAmount: 0,
					canCash: 0
				},
				recentNurseBillList: []
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
		onLoad() {
			this.tradeStatistics = this.tradeStatisticsMessage;
			this.getRecentNurseBill()
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 提现事件
			withdrawEvent (text) {
				if (text == '银行卡') {
					uni.navigateTo({
						url: '/minePackage/pages/bankCardWithdraw/bankCardWithdraw'
					})
				} else if (text == '支付宝') {
					uni.navigateTo({
						url: '/minePackage/pages/alipayWithdraw/alipayWithdraw'
					})
				};
				this.withdrawalMethodDialogShow = false
			},
			
			// 判断周几
			judgeWeek (currentDate) {
				let date = new Date(currentDate);
				let day = date.getDay();
				switch (day) {
					case 0:
						return "周日"
						break;
					case 1:
						return "周一"
						break;
					case 2:
						return "周二"
						break;
					case 3:
						return "周三"
						break;
					case 4:
						return "周四"
						break;
					case 5:
						return "周五"
						break;
					case 6:
						return "周六"
						break
					}
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 截取字符串指定后几位
			cutLastSomeChars (str,count) {
				if (!str || str.length == 0) {
					return
				};
				const lastSomeChars = str.substr(str.length - count);
				return lastSomeChars
			},
			
			// 进入账单详情事件
			enterBillDetailsEvent (item) {
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/minePackage/pages/myBillDetails/myBillDetails?transmitData='+mynavData
				})
			},
			
			// 查询近期账单
			getRecentNurseBill() {
				this.showLoadingHint = true;
				this.infoText = '加载中···';
				this.isShowNoData = false;
				recentNurseBill().then((res) => {
					if ( res && res.data.code == 0) {
						this.recentNurseBillList = res.data.data;
						this.recentNurseBillList.push(
								{
									amount: 1000,
									occurType: "OUT",
									cashTime: "2023-10-12 14:34:56",
									cashCard: "12343437548938",
									cashBank: "中国建设银行",
									cashStatus: "10",
									createTime: "2021-05-11 12:44:16"
								},
								{
									amount: 1509,
									occurType: "IN",
									cashTime: "2021-06-11 13:14:11",
									cashCard: "42343437567483267",
									cashBank: "中国工商银行",
									cashStatus: "0",
									createTime: "2024-11-11 18:40:06"
								}
						);
						this.recentNurseBillList.forEach((item) => {
							item.amount = fenToYuan(item.amount)
						});
						if (this.recentNurseBillList.length == 0) {
							this.isShowNoData = true
						} else {
							this.isShowNoData = false
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
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
			padding: 10px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			height: 0;
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
				position: relative;
				flex: 1;
				overflow: auto;
				::v-deep .u-empty {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%)
				};
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
