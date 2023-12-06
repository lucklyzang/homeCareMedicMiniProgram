<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="设置中心" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="set-center-content">
			<view class="update-phone-number" @click="updatePhoneNumberEvent">
				<view class="update-phone-number-left">
					<text>更换手机号</text>
				</view>
				<view class="update-phone-number-right">
					<text>15669106075</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="new-message-inform">
				<view class="new-message-inform-left">
					<text>新消息通知</text>
				</view>
				<view class="new-message-inform-right">
					<u-switch v-model="isNewMessageInformValue" activeColor="#88BFFF"></u-switch>
				</view>
			</view>
			<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>微信绑定</text>
				</view>
				<view class="weixin-binding-right">
					<text>未绑定</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>支付宝绑定</text>
				</view>
				<view class="weixin-binding-right">
					<text>未绑定</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>清除缓存</text>
				</view>
				<view class="weixin-binding-right">
					<text>5.8M</text>
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
			<view class="weixin-binding">
				<view class="weixin-binding-left">
					<text>检查更新</text>
				</view>
				<view class="weixin-binding-right">
					<u-icon name="arrow-right" color="#C6C9CC" size="18"></u-icon>
				</view>
			</view>
		</view>
		<view class="quit-login-btn-box">
			<view class="quit-login-btn">
				<text>退出登录</text>
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
				isNewMessageInformValue: true
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
			
			// 更换手机号事件
			updatePhoneNumberEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/updatePhoneNumber/updatePhoneNumber'
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
		.set-center-content {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			.update-phone-number {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.update-phone-number-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.update-phone-number-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						font-size: 16px;
						color: #999999;
						margin-right: 6px;
					}
				}
			};
			.new-message-inform {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.new-message-inform-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.new-message-inform-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center
				}
			};
			.weixin-binding {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 73px;
				@include bottom-border-1px(#BBBBBB);
				.weixin-binding-left {
					padding-right: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #1C222A
				};
				.weixin-binding-right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					>text {
						font-size: 16px;
						color: #1C222A;
						margin-right: 6px;
					}
				}
			}
		};
		.quit-login-btn-box {
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			.quit-login-btn {
				width: 70%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 46px;
				border: 1px solid #E86F50;
				border-radius: 8px;
				font-size: 12px;
				color: #E86F50
			}
		}
	}
</style>
