<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="关于我们" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="about-us-box">
			<view class="about-us-content-box">
				<view class="about-us-photo">
					<image src="@/static/img/app-logo.png"></image>
				</view>
				<view class="about-us-content">
					<view class="about-us-title">
						<text>关于守护家APP</text>
					</view>
					<view class="brief-introduction-box">
						<view>
							<text>一、简介</text>
						</view>
						<view>
							和打击力度哈里斯都害怕发哈开始了防护和活动开始lads良好的萨拉好的
						</view>
					</view>
					<view class="rule-box">
						<view>
							<text>二、规则</text>
						</view>
						<view>
							和打击力度哈里斯都害怕发哈开始了防护和活动开始lads良好的萨拉好的
						</view>
					</view>
				</view>
			</view>
			<view class="contact-us-box">
				<view class="contact-us-title">
					<text>联系我们</text>
				</view>
				<view class="contact-us-content">
					<view>
						<text>联系电话: </text>
						<text>0123-88888888</text>
					</view>
					<view>
						<text>联系地址: </text>
						<text>成都市青羊区XXXXX</text>
					</view>
					<view>
						<text>电子邮箱: </text>
						<text>123456789@163.com</text>
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
		.about-us-box {
			flex: 1;
			overflow: auto;
			padding: 80px 30px 10px 30px;
			box-sizing: border-box;
			background: linear-gradient(to bottom, rgba(80, 100, 235, 0.3), rgba(96, 162, 255, 0.05));
			.about-us-content-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-bottom: 50px;
				background: #fff;
				border-radius: 10px;
				padding: 20px;
				box-sizing: border-box;
				.about-us-photo {
					margin-top: -47px;
					image {
						width: 90px;
						height: 90px
					}
				};
				.about-us-content {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.about-us-title {
						font-size: 16px;
						color: #101010;
						margin: 10px 0 20px 0
					};
					.brief-introduction-box {
						font-size: 14px;
						color: #101010;
						>view {
							&:nth-child(1) {
								margin-bottom: 4px;
							};
							&:nth-child(2) {
								text-align: justify;
								word-break: break-all;
								line-height: 20px
							}
						}
					};
					.rule-box {
						font-size: 14px;
						color: #101010;
						margin-top: 10px;
						>view {
							&:nth-child(1) {
								margin-bottom: 4px;
							};
							&:nth-child(2) {
								text-align: justify;
								word-break: break-all;
								line-height: 20px
							}
						}
					}
				}
			};
			.contact-us-box {
				background: #fff;
				border-radius: 8px;
				padding: 10px 20px 10px 20px;
				box-sizing: border-box;
				margin-top: 10px;
				.contact-us-title {
					text-align: center;
					font-size: 16px;
					color: #101010;
					margin-bottom: 10px
				};
				.contact-us-content {
					>view {
						font-size: 14px;
						color: #101010;
						word-break: break-all;
						&:nth-child(2) {
							margin: 10px 0
						}
					}
				}
			}
		}
	}
</style>
