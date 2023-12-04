<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" fontColor="#FFFFFF" backState='3000' bgColor="none" title="帮助中心" @backClick="backTo">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="top-cut-area">
			<view class="top-cut-list" :class="{'topCutListStyle': topCutIndex == index}" v-for="(item,index) in topCutList" :key="index" @click="topCutEvent(item,index)">
				<text>{{ item }}</text>
			</view>
		</view>
		<view class="common-problem-box">
		 <u-collapse
				@change="change"
				@close="close"
				@open="open"
			>
				<u-collapse-item
					title="怎么申请发票"
					name="Docs guide"
				>
					<text class="u-collapse-content">购买后可以在「我的账户」-「购买订单」中直接填写开票信息申请发票。</text>
				</u-collapse-item>
				<u-collapse-item
					title="用不来"
					name="Docs guide"
				>
					<text class="u-collapse-content">购买后可以在「我的账户」-「购买订单」中直接填写开票信息申请发票。</text>
				</u-collapse-item>
				<u-collapse-item
					title="如何联系人工客服"
					name="Docs guide"
				>
					<text class="u-collapse-content">购买后可以在「我的账户」-「购买订单」中直接填写开票信息申请发票。</text>
				</u-collapse-item>
				<u-collapse-item
					title="怎么绑定手机号"
					name="Docs guide"
				>
					<text class="u-collapse-content">购买后可以在「我的账户」-「购买订单」中直接填写开票信息申请发票。</text>
				</u-collapse-item>
				<u-collapse-item
					title="第三方登录"
					name="Docs guide"
				>
					<text class="u-collapse-content">购买后可以在「我的账户」-「购买订单」中直接填写开票信息申请发票。</text>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view class="feedback-btn-box">
			<view class="feedback-btn" @click="feedbackEvent">
				<text>意见反馈</text>
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
				loginBackgroundPng: require("@/static/img/login-background.png"),
				topCutList: ['常见问题','使用技巧'],
				topCutIndex: 0
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
			
			// 顶部tab切换事件
			topCutEvent (item,index) {
				this.topCutIndex = index
			},
			
			open(e) {
				// console.log('open', e)
			},
			
			close(e) {
				// console.log('close', e)
			},
			
			change(e) {
				// console.log('change', e)
			},
			
			//意见反馈事件
			feedbackEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/feedback/feedback'
				})
			},
			
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
		background: #F2F2F2;
		.top-area-box {
			position: relative;
			background: #F8F8F8;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #F8F8F8;
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
		.top-cut-area {
			height: 70px;
			background: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			.top-cut-list {
				width: 100px;
				height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 13px;
				color: #3D8DFF;
				border: 1px solid #3D8DFF;
				box-sizing: border-box;
				&:nth-child(1) {
					border-top-left-radius: 4px;
					border-bottom-left-radius: 4px;
				}
				&:nth-child(2) {
					border-top-right-radius: 4px;
					border-bottom-right-radius: 4px;
				}
			};
			.topCutListStyle {
				color: #fff !important;
				background: #5064EB !important;
				border: none !important
			}
		};
		.common-problem-box {
			flex: 1;
			overflow: auto;
			::v-deep .u-collapse {
				.u-collapse-item {
					background: #fff;
					.u-cell__body {
						font-size: 14px;
						color: #101010;
						font-weight: bold
					};
					.u-collapse-item__content__text {
						font-size: 14px;
						color: #101010
					}
				}
			}
		};
		.feedback-btn-box {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100px;
			.feedback-btn {
				width: 80%;
				height: 46px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #5064EB;
				border-radius: 6px;
				color: #fff;
				font-size: 15px
			}
		}
	}
</style>
