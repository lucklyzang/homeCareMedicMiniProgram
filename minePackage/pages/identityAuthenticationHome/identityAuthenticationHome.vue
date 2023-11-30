<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="身份认证" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="identity-authentication-box">
			<view class="real-name-authentication" @click="realNameAuthenticationEvent">
				<view class="real-name-authentication-left">
					<view class="image-box">
						<image src="@/static/img/real-name-authentication-icon.png"></image>
					</view>
					<view class="authentication-text">
						<text>实名认证</text>
					</view>
				</view>
				<view class="real-name-authentication-right">
					<text>未实名</text>
				</view>
			</view>
			<view class="certificate-authentication-title">
				<text>证书认证</text>
			</view>
			<view class="certificate-authentication" @click="nurseQualificationAuthenticationEvent">
				<view class="certificate-authentication-left">
					<view class="image-box">
						<image src="@/static/img/nurse-certification-icon.png"></image>
					</view>
					<view class="authentication-text">
						<text>护士资格证</text>
					</view>
				</view>
				<view class="certificate-authentication-right">
					<text>未认证</text>
				</view>
			</view>
			<view class="certificate-have-authentication">
				<view class="certificate-have-authentication-left">
					<view class="image-box">
						<image src="@/static/img/nurse-certification-icon.png"></image>
					</view>
					<view class="authentication-text">
						<text>护士资格证</text>
					</view>
				</view>
				<view class="certificate-have-authentication-right">
					<image src="@/static/img/have-authentication-icon.png"></image>
					<text>已认证</text>
				</view>
			</view>
			<view class="complete-personal-information-title">
				<text>完善个人信息</text>
			</view>
			<view class="complete-personal-information" @click="perfectPersonalMessageEvent">
				<view class="complete-personal-information-left">
					<view class="image-box">
						<image src="@/static/img/personal-information-icon.png"></image>
					</view>
					<view class="personal-information-text">
						<text>个人信息</text>
					</view>
				</view>
				<view class="complete-personal-information-right">
					<text>未完善</text>
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
			
			// 实名认证事件
			realNameAuthenticationEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/realNameAuthentication/realNameAuthentication'
				})
			},
			
			// 护士资格认证事件
			nurseQualificationAuthenticationEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/nurseQualificationAuthentication/nurseQualificationAuthentication'
				})
			},
			
			// 完善个人信息事件
			perfectPersonalMessageEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/perfectPersonalMessage/perfectPersonalMessage'
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
		.identity-authentication-box {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			.real-name-authentication {
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				height: 116px;
				border-radius: 9px;
				background: linear-gradient(to right, #509EFD, #6C72FF);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.real-name-authentication-left {
					display: flex;
					align-items: center;
					flex: 1;
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #fff;
						image {
							width: 24px;
							height: 24px;
						}
					};
					.authentication-text {
						font-size: 18px;
						color: #fff;
					}
				};
				.real-name-authentication-right {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color: #fff;
					width: 57px;
					height: 57px;
					border-radius: 50%;
					background: rgba(80, 100, 235, 0.75);
				}
			};
			.certificate-authentication-title {
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #101010;
			};
			.certificate-authentication {
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				height: 116px;
				border-radius: 9px;
				background: linear-gradient(to right, #509EFD, #6C72FF);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.certificate-authentication-left {
					display: flex;
					align-items: center;
					flex: 1;
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #fff;
						image {
							width: 24px;
							height: 24px;
						}
					};
					.authentication-text {
						font-size: 18px;
						color: #fff;
					}
				};
				.certificate-authentication-right {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color: #fff;
					width: 57px;
					height: 57px;
					border-radius: 50%;
					background: rgba(80, 100, 235, 0.75);
				}
			};
			.certificate-have-authentication {
				width: 100%;
				padding: 0 20px;
				margin-top: 14px;
				box-sizing: border-box;
				height: 116px;
				border-radius: 9px;
				background: linear-gradient(to right, #509EFD, #6C72FF);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.certificate-have-authentication-left {
					display: flex;
					align-items: center;
					flex: 1;
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #fff;
						image {
							width: 24px;
							height: 24px;
						}
					};
					.authentication-text {
						font-size: 18px;
						color: #fff;
					}
				};
				.certificate-have-authentication-right {
					image {
						width: 38px;
						height: 38px;
						margin-right: 4px;
						vertical-align: middle
					};
					text {
						font-size: 14px;
						color: #E8CB51;
						vertical-align: middle
					}
				}
			};
			.complete-personal-information-title {
				height: 80px;
				line-height: 80px;
				font-size: 14px;
				color: #101010;
			};
			.complete-personal-information {
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				height: 116px;
				border-radius: 9px;
				background: linear-gradient(to right, #509EFD, #6C72FF);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.complete-personal-information-left {
					display: flex;
					align-items: center;
					flex: 1;
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #fff;
						image {
							width: 24px;
							height: 24px;
						}
					};
					.personal-information-text {
						font-size: 18px;
						color: #fff;
					}
				};
				.complete-personal-information-right {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color: #fff;
					width: 57px;
					height: 57px;
					border-radius: 50%;
					background: rgba(80, 100, 235, 0.75);
				}
			}
		}
	}
</style>
