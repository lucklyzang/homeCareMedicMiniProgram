<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="账单详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="bill-box">
			<view class="bill-details-box">
				<view class="bill-details-top">
					<view class="bill-avatar">
						<image :src="personPhotoSource"></image>
					</view>
					<view class="bill-explain">
						<text>{{ billMessage.occurType === 'IN' ? '到账' : billMessage.occurType === 'OUT' ? '提现' : '未知' }}</text>
						<text>{{ `-来自${niceNameValue}` }}</text>
					</view>
					<view class="bill-money">
						<text>{{ billMessage.occurType === 'IN' ? '+' : billMessage.occurType === 'OUT' ? '-' : '' }}</text>
						<text>{{ `${billMessage.amount}元` }}</text>
					</view>
				</view>
				<view class="bill-details-bottom">
					<view class="bill-bottom-line-one">
						<view class="bill-bottom-left">
							<text>当前状态</text>
						</view>
						<view class="bill-bottom-right">
							<text>{{ billStatusTransition(billMessage.cashStatus) }}</text>
						</view>
					</view>
					<view class="bill-bottom-line-one">
						<view class="bill-bottom-left">
							<text>转账说明</text>
						</view>
						<view class="bill-bottom-right">
							<text>{{ billMessage.occurType === 'IN' ? '订单到账' : billMessage.occurType === 'OUT' ? '余额提现' : '未知类型' }}</text>
						</view>
					</view>
					<view class="bill-bottom-line-one"  v-if="billMessage.occurType === 'OUT'">
						<view class="bill-bottom-left">
							<text>提现时间</text>
						</view>
						<view class="bill-bottom-right">
							<text>{{ getNowFormatDate(new Date(billMessage.cashTime),4) }}</text>
						</view>
					</view>
					<view class="bill-bottom-line-one">
						<view class="bill-bottom-left">
							<text>创建时间</text>
						</view>
						<view class="bill-bottom-right">
							<text>{{ getNowFormatDate(new Date(billMessage.createTime),4) }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bill-bottom-box"></view>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				personPhotoSource: '',
				niceNameValue: '张三',
				billMessage: {}
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
		onShow () {
			this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
			this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname;
		},
		onLoad(options) {
			if ( options.transmitData === '{}') {
				return
			};
			this.billMessage = JSON.parse(options.transmitData);
			this.billMessage.amount = fenToYuan(this.billMessage.amount);
			console.log('账单详情信息',this.billMessage)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 账单状态转换
			billStatusTransition (status) {
				let temporaryStatus = status.toString();
				switch (temporaryStatus) {
					case '0':
						return "未提现"
						break;
					case '10':
						return "已提现"
						break;
					case '20':
						return "提现成功"
						break;
					case '30':
						return "提现失败"
						break;
					case '40':
						return "订单取消"
						break;
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
		background: #efefef;
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
		.bill-box {
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: column;
			height: 0;
			.bill-details-box {
				flex: 1;
				padding: 20px;
				box-sizing: border-box;
				background: #fff;
				.bill-details-top {
					@include bottom-border-1px(#dddddd);
					padding: 0 0 40px 0;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.bill-avatar {
						width: 63px;
						height: 63px;
						background: #fff;
						border-radius: 50%;
						z-index:1;
						image {
							width: 63px;
							height: 63px;
							border-radius: 50%;
						}
					};
					.bill-explain {
						font-size: 14px;
						color: #101010;
						margin: 10px 0 20px 0;
					};
					.bill-money {
						font-size: 20px;
						color: #101010;
						font-weight: bold;
					}
				};
				.bill-details-bottom {
					.bill-bottom-line-one {
						margin-top: 20px;
						display: flex;
						.bill-bottom-left {
							margin-right: 20px;
							font-size: 12px;
							color: #a2a2a2
						};
						.bill-bottom-right {
							flex: 1;
							word-break: break-all;
							font-size: 12px;
							color: #101010
						}
					}
				}
			};
			.bill-bottom-box {
				height: 300px;
			}
		}
	}
</style>
