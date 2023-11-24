<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的医护" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="specialist-content-area">
			<view class="search-box">
				<u-search bgColor="#fff" :actionStyle="{color: '#FF698C',fontSize: '16px'}" @change="searchInputEvent" @search="searchEvent" :clearabled="true" :showAction="true"></u-search>
			</view>
			<view class="specialist-list-box">
				<view class="nurse-practitioner-list" @click="viewSpecialistDetailsEvent">
					<view class="nurse-practitioner-list-top">
						<text>从业10年以上</text>
					</view>
					<view class="nurse-practitioner-list-left">
						<u-image src="@/static/img/health-nurse.png" width="63" height="63">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
					</view>
					<view class="nurse-practitioner-list-right">
						<view class="nurse-practitioner-name">
							<text>张颖</text>
							<text>主管护师</text>
						</view>
						<view class="hospital-name">
							<text>成都市妇女儿童中心医院 (东城根)</text>
						</view>
						<view class="rate">
							<u-rate :count="count" v-model="rateValue" active-color="#E86F50"></u-rate>
							<text>5.0</text>
						</view>
						<view class="nurse-practitioner-performance">
							<view class="nurse-practitioner-performance-message">
								<view class="nurse-practitioner-performance-left">
									<text>帮助</text>
									<text>3456</text>
									<text>人</text>
								</view>
								<view class="nurse-practitioner-performance-right">
									<text>服务</text>
									<text>345</text>
									<text>小时</text>
								</view>
							</view>	
						</view>
						<view class="good-territory">
							<text>乳腺疏通</text>
							<text>黄疸检测</text>
						</view>
					</view>
				</view>
				<view class="nurse-practitioner-list">
					<view class="nurse-practitioner-list-top">
						<text>从业10年以上</text>
					</view>
					<view class="nurse-practitioner-list-left">
						<u-image src="@/static/img/health-nurse.png" width="63" height="63">
							 <template v-slot:loading>
									<u-loading-icon color="red"></u-loading-icon>
								</template>
						</u-image>
					</view>
					<view class="nurse-practitioner-list-right">
						<view class="nurse-practitioner-name">
							<text>张颖</text>
							<text>主管护师</text>
						</view>
						<view class="hospital-name">
							<text>成都市妇女儿童中心医院 (东城根)</text>
						</view>
						<view class="rate">
							<u-rate :count="count" v-model="rateValue" active-color="#E86F50"></u-rate>
							<text>5.0</text>
						</view>
						<view class="nurse-practitioner-performance">
							<view class="nurse-practitioner-performance-message">
								<view class="nurse-practitioner-performance-left">
									<text>帮助</text>
									<text>3456</text>
									<text>人</text>
								</view>
								<view class="nurse-practitioner-performance-right">
									<text>服务</text>
									<text>345</text>
									<text>小时</text>
								</view>
							</view>	
						</view>
						<view class="good-territory">
							<text>乳腺疏通</text>
							<text>黄疸检测</text>
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
				count: 5,
				rateValue: 5,
				jaundiceDetectionServicePng: require("@/static/img/jaundice-detection-service.png"),
				infoText: '加载中',
				current: 0,
				listTabsName: [
					{
						name: '服务详情'
					},
				  {
				  	name: '预约须知'
				  },
					{
						name: '用户评价'
					}
				]          
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
			
			// 查看护师详情事件
			viewSpecialistDetailsEvent () {
				uni.navigateTo({
					url: '/servicePackage/pages/specialistDetails/specialistDetails'
				})
			},
			
			// 搜索事件
			searchEvent () {},
			
			// 搜索框值变化事件
			searchInputEvent () {}
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
		background: #f5f5f5;
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
		.specialist-content-area {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			.search-box {
				padding: 0 10px;
				box-sizing: border-box;
				height: 60px;
				display: flex;
				align-items: center;
			};
			.specialist-list-box {
				flex: 1;
				width: 96%;
				margin: 0 auto;
				overflow: auto;
				.nurse-practitioner-list {
					padding: 30px 6px 20px 6px;
					box-sizing: border-box;
					background: #fff;
					border-radius: 8px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
					box-shadow: 0px 1px 2px 0px rgba(202, 200, 200, 0.46);
					margin-bottom: 10px;
					.nurse-practitioner-list-top {
						position: absolute;
						top: 0;
						right: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 111px;
						height: 26px;
						background: linear-gradient(to right, #ffa7c0, #FC4278);
						box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.4);
						>text {
							font-size: 12px;
							color: #fff
						}
					};
					.nurse-practitioner-list-left {
						width: 73px;
						height: 73px;
						margin-right: 10px;
						border-radius: 50%;
						::v-deep .u-image {
							width: 73px !important;
							height: 73px !important
						}
					};
					.nurse-practitioner-list-right {
						flex: 1;
						.nurse-practitioner-name {
							display: flex;
							align-items: center;
							>text {
								&:nth-child(1) {
									font-size: 16px;
									color: #101010;
									margin-right: 10px;
									font-weight: bold
								};
								&:nth-child(2) {
									font-size: 12px;
									color: #101010;
									margin-top: 4px;
								}
							}
						};
						.hospital-name {
							margin-top: 4px;
							>text {
								word-break: break-all;
								font-size: 12px;
								color: #898C8C;
							}
						};
						.rate {
							display: flex;
							margin-top: 4px;
							>text {
								font-size: 12px;
								&:nth-of-type(1) {
									color: #E86F50;
									font-weight: bold;
									margin-left: 4px
								}
							}
						};
						.nurse-practitioner-performance {
							margin-top: 4px;
							display: flex;
							.nurse-practitioner-performance-message {
								display: flex;
								justify-content: space-between;
								.nurse-practitioner-performance-left {
									margin-right: 20px;
									>text {
										font-size: 12px;
										&:nth-child(1) {
											color: rgba(16, 16, 16, 0.35);
										};
										&:nth-child(2) {
											font-weight: bold;
											color: #101010;
										};
										&:nth-child(3) {
											color: rgba(16, 16, 16, 0.35);
										}
									}
								};
								.nurse-practitioner-performance-right {
									>text {
										font-size: 12px;
										&:nth-child(1) {
											color: rgba(16, 16, 16, 0.35);
										};
										&:nth-child(2) {
											font-weight: bold;
											color: #101010;
										};
										&:nth-child(3) {
											color: rgba(16, 16, 16, 0.35);
										}
									}
								}
							}
						};
						.good-territory {
							margin-top: 4px;
							>text {
								font-size: 12px;
								color: #fff;
								display: inline-block;
								width: 57px;
								height: 19px;
								text-align: center;
								line-height: 19px;
								background: #FEB8B7;
								border-radius: 3px;
								&:nth-child(1) {
									margin-right: 6px
								}
							}
						}
					}
				}
			}
		}
	}
</style>
