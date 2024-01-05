<template>
	<view class="content-box">
		<view class="success-top-box">
			<view class="img-area">
				<u-icon name="checkmark-circle-fill" size="100" color="#26CF88"></u-icon>
			</view>
			<view class="success-text-area">
				<text>提现成功</text>
			</view>
			<view class="explain-text-area">
				<text>预计2小时到账</text>
			</view>
		</view>
		<view class="success-center-box">
			<view class="success-center-top">
				<view class="success-center-top-left">
					<text>提现金额</text>
				</view>
				<view class="success-center-top-right">￥1000</view>
			</view>
			<view class="success-center-bottom">
				<view class="success-center-bottom-left">
					<text>提现方式</text>
				</view>
				<view class="success-center-bottom-right">中国建设银行储蓄卡</view>
			</view>
		</view>
		<view class="sure-btn" @click="completeEvent">
			<text>完成</text>
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
				infoText: '加载中'
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
			
			// 完成事件
			completeEvent () {
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
		background: #fff;
		.success-top-box {
			position: relative;
			background: #fff;
			width: 100%;
			height: 50vh;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			flex-direction: column;
			.img-area {
				margin-top: 40px;
			};
			.success-text-area {
				margin: 20px 0;
				color: #4DB4FF;
				font-size: 12px;
			};
			.explain-text-area {
				color: #999999;
				font-size: 14px;
			}
		};
		.success-center-box {
			padding: 20px;
			box-sizing: border-box;
			color: #999999;
			font-size: 14px;
			.success-center-top {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.success-center-top-left {};
				.success-center-top-right {
					text-align: right;
					flex: 1;
					padding-left: 10px;
					box-sizing: border-box;
				}
			};
			.success-center-bottom {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.success-center-bottom-left {};
				.success-center-bottom-right {
					text-align: right;
					flex: 1;
					padding-left: 10px;
					box-sizing: border-box;
				}
			}
		};
		.sure-btn {
			width: 80%;
			height: 50px;
			margin: 0 auto;
			background: #5064EB;
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 16px;
			margin-bottom: 20px;
		}
	}
</style>
