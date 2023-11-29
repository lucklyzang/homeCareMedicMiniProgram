<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的二维码" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="my-qr-code-box">
			<view class="qr-code-content-box">
				<view class="qr-code-photo">
					<image :src="defaultPersonPhotoIconPng"></image>
				</view>
				<view class="qr-code-content">
					<image :src="qrCodeIconPng"></image>
					<text>旗木卡卡西</text>
					<text>成都市妇女儿童中心医院副主任护师</text>
				</view>
			</view>
			<view class="operate-box">
				<view class="share-box">
					<view class="image-box">
						<image :src="shareWhiteIconPng"></image>
					</view>
					<view class="share-text">
						<text>分享</text>
					</view>
				</view>
				<view class="administration-box">
					<view class="image-box">
						<image :src="saveWhiteIconPng"></image>
					</view>
					<view class="save-text">
						<text>保存相册</text>
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
				qrCodeIconPng: require("@/static/img/qr-code-black-icon.png"),
				shareWhiteIconPng: require("@/static/img/share-white.png"),
				saveWhiteIconPng: require("@/static/img/save-white.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
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
		.my-qr-code-box {
			flex: 1;
			overflow: auto;
			padding: 50px 30px 10px 30px;
			box-sizing: border-box;
			.qr-code-content-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-bottom: 50px;
				background: rgba(80, 100, 235, 0.06);
				border-radius: 10px;
				.qr-code-photo {
					transform: translateY(-50%);
					image {
						width: 90px;
						height: 90px
					}
				};
				.qr-code-content {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					image {
						width: 193px;
						height: 193px
					};
					>text {
						&:nth-of-type(1) {
							margin: 20px 0;
							font-size: 28px;
							color: #898C8C
						};
						&:nth-of-type(2) {
							font-size: 13px;
							color: #3E4249
						}
					}
				}
			};
			.operate-box {
				height: 150px;
				display: flex;
				justify-content: center;
				align-items: center;
				.share-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.share-text {
						text {
							font-size: 14px;
							color: #101010
						}
					};
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #5064EB;
						image {
							width: 32px;
							height: 32px
						}
					}
				};
				.administration-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.save-text {
						text {
							font-size: 14px;
							color: #101010
						}
					};
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #5064EB;
						image {
							width: 32px;
							height: 32px
						}
					}
				}
			}
		}
	}
</style>
