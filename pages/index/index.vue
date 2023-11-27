<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 筛选弹框 -->
		<view class="screen-dialog-box">
			<u-popup :show="screenDialogShow" @close="screenDialogShow = false" mode="right" :closeOnClickOverlay="false" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
				<view class="screen-top">
					<view class="service-category">
						<view class="service-category-title">
							<text>服务类别</text>
						</view>
						<view class="service-category-content">
							<view class="service-category-list" :class="{'serviceCategoryListStyle': serviceCategoryIndex === index }" @click="serviceCategoryItemClickEvent(item,index)" v-for="(item,index) in serviceCategoryList" :key="index">
								<text>{{ item.content }}</text>
							</view>
						</view>
					</view>
					<view class="service-category service-project">
						<view class="service-category-title">
							<text>服务项目</text>
						</view>
						<view class="service-category-content">
							<view class="service-category-list" :class="{'serviceProjectListStyle': serviceProjectIndex === index }" @click="serviceProjectItemClickEvent(item,index)" v-for="(item,index) in serviceProjectList" :key="index">
								<text>{{ item.content }}</text>
							</view>
						</view>
					</view>
					<view class="distance-section">
						<view class="distance-section-title">
							<text>距离区间 (km)</text>
						</view>
						<view class="distance-section-content">
							<view class="distance-section-left">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最近距离"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="minDistanceValue"
								></u--input>
							</view>
							<view class="distance-section-center"></view>
							<view class="distance-section-left distance-section-right">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最远距离"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="maxDistanceValue"
								></u--input>
							</view>
						</view>
					</view>
					<view class="distance-section price-section">
						<view class="distance-section-title">
							<text>价格区间 (元)</text>
						</view>
						<view class="distance-section-content">
							<view class="distance-section-left">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最低价格"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="minPriceValue"
								></u--input>
							</view>
							<view class="distance-section-center"></view>
							<view class="distance-section-left distance-section-right">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最高价格"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="maxPriceValue"
								></u--input>
							</view>
						</view>
					</view>
				</view>
				<view class="screen-bottom">
					<view class="screen-bottom-left" @click="screenResetEvent">
						<text>重置</text>
					</view>
					<view class="screen-bottom-right" @click="screenSureEvent">
						<text>确定</text>
					</view>
				</view>
			</u-popup>
		</view>
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
			<view class="select-box">
				<view class="smart-sort">
					<w-select
							style="margin-left:10px;" 
							v-model='smartSortValue'
							defaultValue="智能排序"
							:list='smartSortList'
							valueName='content' 
							keyName="id"
							@change='smartSortChange'
						>
					</w-select>
				</view>
				<view class="service-category">
					<w-select
							style="margin-left:10px;"
							:multiple="true"
							v-model='serviceCategoryValue'
							defaultValue="服务类别"
							:list='serviceCategoryList'
							valueName='content' 
							keyName="id"
							@change='serviceCategoryChange'
						>
					</w-select>
				</view>
				<view class="service-project">
					<w-select
							style="margin-left:10px;" 
							:multiple="true"
							v-model='serviceProjectValue'
							defaultValue="服务项目"
							:list='serviceProjectList'
							valueName='content' 
							keyName="id"
							@change='serviceProjectChange'
						>
					</w-select>
				</view>
				<view class="screen-box" @click="screenEvent">
					<text>筛选</text>
					<text  :class="isShowScreenIcon ? 'w-select-arrow-up' : ''" class="w-select-arrow">
					</text>
				</view>
			</view>
			<view class="real-time-order-form-title-box">
				<text>实时订单</text>
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
	import wSelect from '@/components/w-select/w-select.vue'
	export default {
		components: {
			wSelect
		},
		data() {
			return {
				infoText: '',
				bannerList: [],
				callPoliceDialogShow: false,
				isShowScreenIcon: false,
				screenDialogShow: false,
				showLoadingHint: false,
				isShowHomeNoData: false,
				serviceCategoryIndex: null,
				serviceProjectIndex: null,
				minDistanceValue: '',
				maxDistanceValue: '',
				minPriceValue: '',
				maxPriceValue: '',
				smartSortValue: "",
				smartSortList: [
					{
						id: 1,
						content: '距离优先'
					}, 
					{
						id: 2,
						content: '价格优先'
					}
				],
				serviceCategoryValue: [],
				serviceCategoryList: [
					{
						id: 1,
						content: '目婴护理'
					}, 
					{
						id: 2,
						content: '宝宝护理'
					},
					{
						id: 3,
						content: '慢病护理'
					}, 
					{
						id: 4,
						content: '基本护理'
					}
				],
				serviceProjectValue: [],
				serviceProjectList: [
					{
						id: 1,
						content: '打针'
					}, 
					{
						id: 2,
						content: '喂奶'
					},
					{
						id: 3,
						content: '通乳'
					}, 
					{
						id: 4,
						content: '洗澡'
					}
				]
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
			
			// 服务类别点击事件
			serviceCategoryItemClickEvent (item,index) {
				this.serviceCategoryIndex = index
			},
			
			// 服务项目点击事件
			serviceProjectItemClickEvent (item,index) {
				this.serviceProjectIndex = index
			},
			
			// 筛选弹框显示事件
			screenEvent () {
				this.screenDialogShow = !this.screenDialogShow;
				if (this.screenDialogShow) {
					this.isShowScreenIcon = true
				} else {
					this.isShowScreenIcon = false
				}
			},
			
			// 筛选重置事件
			screenResetEvent () {
				this.screenDialogShow = false;
				this.isShowScreenIcon = false
			},
			
			// 筛选确定事件
			screenSureEvent () {
				this.screenDialogShow = false;
				this.isShowScreenIcon = false
			},
			
			// 智能排序下拉框值改变事件
			smartSortChange(e) {
				console.log(e)
			},
			
			// 服务类别下拉框值改变事件
			serviceCategoryChange(e) {
				console.log(e)
			},
			
			// 服务项目下拉框值改变事件
			serviceProjectChange(e) {
				console.log(e)
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
		.screen-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					width: 80%;
					.u-popup__content {
						padding: 20px;
						.screen-top {
							flex: 1;
							overflow: auto;
							.service-category {
								margin-bottom: 14px;
								.service-category-title {
									font-size: 12px;
									color: #666666;
									margin-bottom: 10px;
								};
								.service-category-content {
									display: flex;
									flex-wrap: wrap;
									.service-category-list {
										display: flex;
										align-items: center;
										justify-content: center;
										margin: 0 10px 10px 0;
										background: #EEEEEE;
										border-radius: 4px;
										padding: 4px 10px;
										box-sizing: border-box;
										font-size: 12px;
										color: #333333;
									};
									.serviceCategoryListStyle {
										background: rgba(80, 100, 235, 0.65) !important;
										color: #fff;
									}
								}
							};
							.service-project {
								margin-bottom: 14px;
								.service-category-list {
									padding: 4px 20px !important;
								};
								.service-category-content {
									.serviceProjectListStyle {
										background: rgba(80, 100, 235, 0.65) !important;
										color: #fff;
									}
								}
							};
							.distance-section {
								margin-bottom: 20px;
								.distance-section-title {
									font-size: 12px;
									color: #666666;
									margin-bottom: 10px;
								};
								.distance-section-content {
									display: flex;
									align-items: center;
									.distance-section-left {
										.u-input {
											background: #F1F1F1 !important;
											border-radius: 20px !important;
											padding: 0 10px !important;
											box-sizing: border-box !important;
										}
									};
									.distance-section-center {
										width: 24px;
										height: 1px;
										background: #BBBBBB;
										margin: 0 10px;
									}
								}
							};
							.price-section {
								margin-bottom: 0 !important
							}
						};
						.screen-bottom {
							width: 100%;
							height: 80px;
							display: flex;
							align-items: flex-end;
							justify-content: flex-end;
							.screen-bottom-left {
								height: 34px;
								width: 95px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-top-left-radius: 20px;
								border-bottom-left-radius: 20px;
								font-size: 17px;
								color: #5064EB;
								border: 1px solid #5064EB;
								box-sizing: border-box;
								font-weight: bold
							};
							.screen-bottom-right {
								height: 34px;
								width: 95px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-top-right-radius: 20px;
								border-bottom-right-radius: 20px;
								background: #5064EB;
								font-size: 17px;
								color: #fff;
								font-weight: bold
							}
						}
					}
				}
			}	
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
			.select-box {
				display: flex;
				>view {
					flex: 1;
					width: 25%;
					display: flex;
					align-content: center;
					::v-deep .w-select {
						.select-wrap {
							border: none !important;
							width: 100% !important;
							input {
								color: #454A58 !important;
								font-size: 12px !important
							};
							.input-placeholder {
								color: #454A58;
								font-size: 12px;
							};
							.uni-input {
								color: #454A58 !important;
								font-size: 12px !important
							}
						}
					}
				};
				.screen-box {
					margin-left: 10px;
					display: flex;
					align-items: center;
					>text {
						display: inline-block;
						&:first-child {
							font-size: 12px;
							color: #454A58;
							flex: 1
						}
					};
					.w-select-arrow {
						display: inline-block;
						margin: 3px 10px 0;
						width: 0;
						height: 0;
						border: 5px solid transparent;
						border-top-color: #60646F;
						transition: all 0.3s;
						transform: translateY(20%);
					}
					.w-select-arrow-up {
						 display: inline-block;
						 margin: 3px 10px 0;
						 width: 0;
						 height: 0;
						 border: 5px solid transparent;
						 border-bottom-color: #60646F;
						 transition: all 0.3s;
						 transform: translateY(20%);
					}
				}
			};
			.real-time-order-form-title-box {
				padding: 0 10px;
				box-sizing: border-box;
				margin: 10px 0;
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



