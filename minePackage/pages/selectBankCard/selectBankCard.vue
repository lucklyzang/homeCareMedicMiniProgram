<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="选择银行卡" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="select-bank-card-box">
			<view class="card-list" v-for="(item,index) in cardList" :key="index" @click="cardSelectedEvent(item,index)">
				<view class="card-top">
					<view class="card-top-left"></view>
					<view class="card-top-center">
						{{ item.cardName }}
					</view>
					<view class="card-top-right">
						<view class="select-circle" v-if="!item.checked"></view>
						<u-icon name="checkmark-circle-fill" v-else size="26" color="#26CF88"></u-icon>
					</view>
				</view>
				<view class="card-center">
					{{ item.cardNumber }}
				</view>
			</view>
		</view>
		<view class="add-bank-card-btn">
			<text @click="addBankCardEvent">添加银行卡</text>
		</view>
		<view class="sure-btn">
			<text>确定</text>
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
				cardList: [
					{
						cardName: '中国建设银行储蓄卡',
						cardNumber: '62178930483048394343',
						checked: false
					},
					{
						cardName: '中国农业银行储蓄卡',
						cardNumber: '2217893048304435454',
						checked: true
					}
				]
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
			
			// 银行卡卡片点击事件
			cardSelectedEvent(item,index) {
				this.cardList.forEach((el) => {
					el.checked = false
				});
				item.checked = !item.checked
			},
			
			// 添加银行卡事件
			addBankCardEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/bindBankCard/bindBankCard'
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
		.select-bank-card-box {
			flex: 1;
			overflow: auto;
			padding: 20px;
			box-sizing: border-box;
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
					};
					.card-top-right {
						width: 40px;
						height: 40px;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						.select-circle {
							width: 24px;
							height: 24px;
							background: #fff;
							border-radius: 50%
						}
					}
				};
				.card-center {
					margin-top: 20px;
					font-size: 18px;
					color: #fff;
					margin-left: 50px;
				}
			}
		};
		.add-bank-card-btn {
			height: 60px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			color: #1890FF
		};
		.sure-btn {
			width: 60%;
			height: 50px;
			margin: 0 auto;
			background: #1890FF;
			border-radius: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 16px;
			margin-bottom: 20px;
		}
	}
</style>
