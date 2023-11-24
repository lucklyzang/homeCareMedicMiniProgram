<template>
	<view class="content-box">
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单评价" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="success-content">
				<view class="success-icon">
					<u-icon name="checkbox-mark" size="30" color="#fff"></u-icon>
				</view>
				<view class="success-text">
					评价成功!
				</view>
			</view>
		</view>
		<view class="submit-area">
			<text>返回订单</text>
			<text>再来一单</text>
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
		::v-deep .u-popup {
			flex: none !important
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
		}
		.order-form-list-wrapper {
			flex: 1;
			background: #F8F8F8;
			overflow: auto;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.success-content {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 120px;
				.success-icon {
					width: 70px;
					height: 70px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #33CC99;
				};
				.success-text {
					font-size: 20px;
					color: #101010;
					margin-top: 20px;
				}
			}
		};
		.submit-area {
			background: #F8F8F8;
			width: 100%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				display: inline-block;
				width: 40%;
				height: 44px;
				text-align: center;
				line-height: 44px;
				border-radius: 5px;
				font-size: 14px;
				&:first-child {
					color: #fff;
					background: #CAC8C8;
					margin-right: 10px
				};
				&:last-child {
					color: #fff;
					background: #EB3E67;
				}
			}
		}
	}
</style>
