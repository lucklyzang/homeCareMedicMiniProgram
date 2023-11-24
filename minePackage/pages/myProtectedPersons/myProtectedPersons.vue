<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="被护人" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="protected-persons-box">
			<!-- <view class="image-box">
				<image :src="noProtectedPersonsPng"></image>
			</view> -->
			<view class="protected-persons-list">
				<view class="protected-persons-top">
					<view class="protected-persons-top-left">
						<view class="person-message">
							<text>燕双鹰</text>
							<text>男</text>
							<text>26岁</text>
						</view>
						<view class="check-status">
							<text>已通过审核</text>
						</view>
					</view>
					<view class="protected-persons-top-right">
						<image :src="editBlackIconPng"></image>
						<image :src="deleteBlackIconPng"></image>
					</view>
				</view>
				<view class="protected-persons-center">
					<text>点击进行实名</text>
				</view>
				<view class="protected-persons-bottom">
					<view class="id-number">
						<text>身份证</text>
						<text>232732473824793434y</text>
					</view>
					<view class="contact-way">
						<text>联系方式</text>
						<text>232732471321</text>
					</view>
					<view class="emergency-contact">
						<text>紧急联系人</text>
						<text>232732471321</text>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="addProtectedPersonsEvent">新增被护人</text>
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
				count: 1,
				value: 1,
				noProtectedPersonsPng: require("@/static/img/no-protected-persons.png"),
				editBlackIconPng: require("@/static/img/edit-black-icon.png"),
				deleteBlackIconPng: require("@/static/img/delete-black-icon.png"),
				infoText: '加载中',
				checked: ['1']
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
			
			checkboxChange(n) {
				console.log('change', n);
			},
			
			// 添加被护人事件
			addProtectedPersonsEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/addProtectedPersons/addProtectedPersons'
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
		background: #f1f1f1;
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
					color: #101010 !important;
					text {
						color: #101010 !important;
					}
				}
			}
		};
		.protected-persons-box {
			flex: 1;
			overflow: auto;
			padding: 10px 6px;
			box-sizing: border-box;
			.image-box {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				>image {
					width: 334px;
					height: 334px
				}
			};
			.protected-persons-list {
				padding: 10px;
				box-shadow: 0px 2px 6px 0 rgba(137, 140, 140, 0.61);
				box-sizing: border-box;
				border: 1px solid #BBBBBB;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 10px;
				.protected-persons-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.protected-persons-top-left {
						flex: 1;
						width: 0;
						display: flex;
						align-items: center;
						.person-message {
							>text {
								&:nth-child(1) {
									font-size: 18px;
									color: #101010
								};
								&:nth-child(2) {
									font-size: 14px;
									color: #101010;
									margin: 0 6px
								};
								&:nth-child(3) {
									font-size: 14px;
									color: #101010
								}
							}
						};
						.check-status {
							height: 20px;
							line-height: 20px;
							padding: 0 10px;
							box-sizing: border-box;
							background: rgba(147, 210, 243, 0.29);
							border-radius: 3px;
							font-size: 12px;
							color: #289E8E;
							margin-left: 10px;
							margin-top: 4px;
						}
					};
					.protected-persons-top-right {
						>image {
							width: 24px;
							height: 32px;
							&:first-child {
								margin-right: 10px
							}
						}
					}
				};
				.protected-persons-center {
					>text {
						display: inline-block;
						height: 20px;
						margin: 10px 0;
						line-height: 20px;
						padding: 0 10px;
						box-sizing: border-box;
						background: rgba(147, 210, 243, 0.29);
						font-size: 14px;
						color: #4095E5;
						margin-top: 4px
					}
				};
				.protected-persons-bottom {
					>view {
						&:nth-child(2) {
							margin: 10px 0;
						};
						display: flex;
						justify-content: space-between;
						>text {
							&:nth-child(1) {
								font-size: 14px;
								color: #757575;
							};
							&:nth-child(2) {
								flex: 1;
								text-align: right
							}
						}
					}
				}
			}
		};
		.add-btn {
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			>text {
				width: 94%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				font-size: 18px;
				color: #FFFFFF;
				background: #F16C8C;
				border-radius: 10px;
			}
		}
	}
</style>
