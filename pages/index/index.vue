<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 报警弹框 -->
		<view class="call-police-dialog-box">
			<u-popup :show="callPoliceDialogShow" @close="callPoliceDialogShow = false" :closeable="true" mode="bottom" round="20" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="help-center-title">
					<text>求助中心</text>
				</view>
				<view class="help-center-content">
					<text>如遇突发情况，请立即进行报警。</text>
				</view>
				<view class="help-bottom-btn">
					<image src="@/static/img/call-police-dialog.png"></image>
				</view>
			</u-popup>
		</view>
		<!-- 报警按钮 -->
		<view class="call-police-box" @click="callPoliceDialogShow = true">
			<image src="@/static/img/call-police-btn.png"></image>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area">
			<image src="@/static/img/home-site.png"></image>
			<text>成都市武侯区三和街道</text>
		</view>
		<view class="banner-area-box">
			<u-swiper @click="swiperClickEvent" keyName="image"  indicator :list="bannerList"></u-swiper>
		</view>
		<view class="center-area">
			<view class="authentication-info-box">
				<view class="authentication-info-left">
					请先完成实名认证、证书认证、完善个人信息审核通过后才可接单
				</view>
				<view class="authentication-info-right">
					<text>去认证</text>
				</view>
			</view>
			<view class="real-time-order-form-title-box">
				<text>实时订单</text>
			</view>
			<view class="select-box">
				
			</view>
			<view class="real-time-order-form-list-box">
				<view class="real-time-order-form-list">
					<view class="real-time-order-form-list-top">
						<view class="real-time-order-form-list-top-left">
							<text>婴儿全身按摩</text>
						</view>
						<view class="real-time-order-form-list-top-right">
							<text>3分钟前</text>
						</view>
					</view>
					<view class="real-time-order-form-list-bottom">
						<view class="price-box">
							<image src="@/static/img/order-rmb.png"></image>
							<text>398.99</text>
						</view>
						<view class="site-box">
							<image src="@/static/img/order-site.png"></image>
							<text>环球中心1号门1栋1单元1楼101</text>
							<text>抢单</text>
						</view>
						<view class="date-box">
							<image src="@/static/img/order-date.png"></image>
							<text>06月14日（周三）上午8:00—9:00</text>
						</view>
					</view>
				</view>
				<view class="real-time-order-form-list">
					<view class="real-time-order-form-list-top">
						<view class="real-time-order-form-list-top-left">
							<text>婴儿全身按摩</text>
						</view>
						<view class="real-time-order-form-list-top-right">
							<text>3分钟前</text>
						</view>
					</view>
					<view class="real-time-order-form-list-bottom">
						<view class="price-box">
							<image src="@/static/img/order-rmb.png"></image>
							<text>398.99</text>
						</view>
						<view class="site-box">
							<image src="@/static/img/order-site.png"></image>
							<text>环球中心1号门1栋1单元1楼101</text>
							<text>抢单</text>
						</view>
						<view class="date-box">
							<image src="@/static/img/order-date.png"></image>
							<text>06月14日（周三）上午8:00—9:00</text>
						</view>
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
	import { getUserBannerList } from '@/api/user.js'
	import _ from 'lodash'
	export default {
		components: {
		},
		data() {
			return {
				infoText: '',
				bannerList: [],
				callPoliceDialogShow: false,
				showLoadingHint: false,
				isShowHomeNoData: false
			}
		},	
		onShow() {
			this.queryUserBannerList()
		},
		onHide () {
		},
		destroyed () {
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			}
		},
		methods: {
			...mapMutations([
			]),
			
			// 轮播图点击事件
			swiperClickEvent (index) {
				uni.navigateTo({
					url: '/messagePackage/pages/advertisingDetails/advertisingDetails'
				})
			},
			
			// 获取首页banner列表
			queryUserBannerList () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.bannerList = [];
				getUserBannerList().then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.bannerList.push({
									image: item.picUrl,
									title: item.title
								})
							}
						}
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
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
		padding-bottom: 0;
		::v-deep .u-popup {
			flex: none !important;
		};
		.call-police-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						padding: 20px 10px;
						box-sizing: border-box;
						.help-center-title {
							text-align: center;
							font-size: 20px;
							color: #101010;
							margin-bottom: 10px
						};
						.help-center-content {
							text-align: center;
							font-size: 14px;
							color: #101010;
							margin: 20px 0
						};
						.help-bottom-btn {
							text-align: center;
							image {
								height: 116px;
								width: 280px;
							}
						}
					}
				}
			}	
		};
		.call-police-box {
			position: fixed;
			z-index: 100;
			left: 0;
			bottom: 16vh;
			image {
				width: 73px;
				height: 43px
			}
		};
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		background: #fff;
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		};
		.uni-ec-canvas {
			width: 100%;
			height: 100px; 
			display: block;
		};
		.top-area {
			height: 50px;
			background: #5A7BF4;
			display: flex;
			align-items: center;
			padding: 10px;
			box-sizing: border-box;
			width: 100%;
			margin: 80px 0 10px 0;
			image {
				width: 24px;
				height: 24px;
				margin-right: 6px;
			};
			text {
				@include no-wrap;
				display: inline-block;
				flex: 1;
				font-size: 13px;
				color: #fff
			}
		};
		.banner-area-box {
			min-height: 135px;
		};
		.center-area {
			flex: 1;
			overflow: auto;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.authentication-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				height: 60px;
				.authentication-info-left {
					flex: 1;
					line-height: 20px;
					word-break: break-all;
					font-size: 14px;
					color: #E86F50;
					margin-right: 20px;
				};
				.authentication-info-right {
					background: #5064EB;
					width: 84px;
					height: 31px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 18px;
					text {
						font-size: 14px;
						color: #fff
					}
				}
			};
			.real-time-order-form-title-box {
				padding: 0 10px;
				box-sizing: border-box;
				margin-bottom: 10px;
				text {
					font-size: 14px;
					color: #101010
				}
			};
			.real-time-order-form-list-box {
				padding: 0 10px;
				box-sizing: border-box;
				.real-time-order-form-list {
					padding: 10px;
					box-sizing: border-box;
					border-radius: 9px;
					box-shadow: 0px 2px 6px 0px rgba(202, 200, 200, 0.46);
					margin-bottom: 10px;
					.real-time-order-form-list-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10px;
						.real-time-order-form-list-top-left {
							flex: 1;
							@include no-wrap;
							padding-right: 10px;
							box-sizing: border-box;
							text {
								font-size: 14px;
								color: #101010
							}
						};
						.real-time-order-form-list-top-right {
							text {
								font-size: 12px;
								color: #898C8C
							}
						}
					};
					.real-time-order-form-list-bottom {
						.price-box {
							display: flex;
							align-items: center;
							image {
								width: 12px;
								height: 17px;
								margin-right: 10px
							};
							text {
								flex: 1;
								display: inline-block;
								word-break: break-all;
								font-size: 16px;
								color: #FF0000
							}
						};
						.site-box {
							margin: 6px 0;
							display: flex;
							align-items: center;
							image {
								width: 16px;
								height: 16px;
								margin-right: 10px
							};
							> text {
								display: inline-block;
								&:nth-of-type(1) {
									flex: 1;
									font-size: 12px;
									color: #101010;
									word-break: break-all;
									padding-right: 4px;
									box-sizing: border-box
								};
								&:nth-of-type(2) {
									display: flex;
									align-items: center;
									justify-content: center;
									background: #D9DBE0;
									border-radius: 18px;
									width: 84px;
									height: 31px;
									font-size: 14px;
									color: #fff
								}
							}
						};
						.date-box {
							display: flex;
							align-items: center;
							image {
								width: 16px;
								height: 16px;
								margin-right: 10px
							};
							text {
								font-size: 12px;
								color: #101010;
								flex: 1;
								display: inline-block;
								word-break: break-all;
							}
						}
					}
				}	
			}
		}
	}
</style>



