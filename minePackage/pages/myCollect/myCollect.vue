<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="收藏">
					<template #left>
						<u-icon name="arrow-left" color="#fff" size="22" @click="backTo"></u-icon>
					</template>
				</nav-bar> 
			</view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="collect-content-box">
			<view class="tabs-box">
				<view class="tabs-list" :class="{'tabsListStyle' : curentIndex === index}" v-for="(item,index) in tabsList" :key="index" @click="tabsCutEvent(item,index)">
					<text>{{ item }}</text>
					<text>(2)</text>
				</view>
			</view>
			<view class="collect-service-box" v-if="curentIndex === 0">
				<view class="content-list">
					<view class="content-list-left">
						<u-image src="@/static/img/health-nurse.png" width="70" height="70">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="content-list-right">
						<view class="service-introduce">
							<view class="service-name">
								<text>婴儿黄疸测定</text>
							</view>
							<view class="service-price">
								<text>￥158</text>
							</view>
						</view>
						<view class="collect-icon">
							<u-icon name="heart-fill" color="#FC4579" size="34"></u-icon>
						</view>
					</view>
				</view>
				<view class="content-list">
					<view class="content-list-left">
						<u-image src="@/static/img/health-nurse.png" width="70" height="70">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="content-list-right">
						<view class="service-introduce">
							<view class="service-name">
								<text>婴儿黄疸测定</text>
							</view>
							<view class="service-price">
								<text>￥158</text>
							</view>
						</view>
						<view class="collect-icon">
							<u-icon name="heart-fill" color="#FC4579" size="34"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="collect-article-box" v-if="curentIndex === 1">
				<view class="content-list">
					<view class="content-list-top">
						<view class="list-top-left">
							<u-image src="@/static/img/health-nurse.png" width="70" height="70">
								 <template v-slot:loading>
								    <u-loading-icon color="red"></u-loading-icon>
								  </template>
							</u-image>
						</view>
						<view class="list-top-right">
							这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题
						</view>
					</view>
					<view class="content-list-bottom">
						<view class="list-bottom-left">
							<text>成都</text>
							<text>一天前</text>
						</view>
						<view class="list-bottom-right">
							<u-icon name="heart-fill" color="#FC4579" size="30"></u-icon>
						</view>
					</view>
				</view>
				<view class="content-list">
					<view class="content-list-top">
						<view class="list-top-left">
							<u-image src="@/static/img/health-nurse.png" width="70" height="70">
								 <template v-slot:loading>
								    <u-loading-icon color="red"></u-loading-icon>
								  </template>
							</u-image>
						</view>
						<view class="list-top-right">
							这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题
						</view>
					</view>
					<view class="content-list-bottom">
						<view class="list-bottom-left">
							<text>成都</text>
							<text>一天前</text>
						</view>
						<view class="list-bottom-right">
							<u-icon name="heart-fill" color="#FC4579" size="30"></u-icon>
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
	import {} from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				infoText: '',
				curentIndex: 0,
				tabsList: ['服务','文章'],
				showLoadingHint: false
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			},
			depName() {
			},
			accountName() {
			}
		},
		
		onShow() {
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo',
				'changeEnterFamilyManagementPageSource'
			]),
			
			// tab切换事件
			tabsCutEvent (item,index) {
				this.curentIndex = index
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
		background: #f5f5f5;
		.top-area-box {
			position: relative;
			width: 100%;
			height: 230px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				.header_left_box {
					.u-icon {
						margin-left: 4px
					}
				};
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
				height: 230px
			}
		};
		.collect-content-box {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			margin-top: -130px;
			background: #fff;
			z-index: 10;
			.tabs-box {
				height: 60px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20px;
				box-sizing: border-box;
				.tabs-list {
					flex: 1;
					height: 32px;
					text-align: center;
					line-height: 32px;
					margin-right: 30px;
					border-radius: 5px;
					border: 1px solid #FF5F83;
					font-size: 14px;
					color: #FF5F83;
					>text {
						&:last-child {
							font-size: 12px;
						}
					};
					&:last-child {
						margin-right: 0 !important
					}
				};
				.tabsListStyle {
					background: #FF5F83 !important;
					color: #fff !important;
					border: none !important
				}
			};
			.collect-service-box {
				flex: 1;
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				overflow: auto;
				.content-list {
					display: flex;
					padding: 14px 0;
					box-sizing: border-box;
					align-items: center;
					justify-content: space-between;
					@include bottom-border-1px(rgba(157, 156, 156, 0.8));
					.content-list-left {
						::v-deep .u-image {
							// width: 70px !important;
							// height: 70px !important
						}
					};
					.content-list-right {
						margin-left: 10px;
						padding-right: 10px;
						box-sizing: border-box;
						flex: 1;
						width: 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.service-introduce {
							flex: 1;
							@include no-wrap;
							.service-name {
								>text {
									@include no-wrap;
									width: 100%;
									display: inline-block;
									font-size: 14px;
									margin-bottom: 20px;
									color: #101010;
									font-weight: bold
								}
							};
							.service-price {
								>text {
									font-size: 14px;
									color: #E86F50;
								}
							}
						};
						.collect-icon {}
					}
				}
			};
			.collect-article-box {
				flex: 1;
				padding: 0 10px 10px 10px;
				box-sizing: border-box;
				overflow: auto;
				.content-list {
					padding: 10px 12px 6px 12px;
					box-sizing: border-box;
					box-shadow: 0px 1px 4px 0px rgba(137, 140, 140, 0.24);
					margin-bottom: 10px;
					.content-list-top {
						display: flex;
						.list-top-left {
							margin-right: 8px
						};
						.list-top-right {
							flex: 1;
							font-size: 16px;
							height: 70px;
							display: flex;
							align-items: center;
							color: #101010;
							@include no-wrap-line(2)
						}
					};
					.content-list-bottom {
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.list-bottom-left {
							flex: 1;
							color: #B4B2B3;
							font-size: 14px;
							padding-right: 4px;
							box-sizing: border-box;
							display: flex;
							width: 0;
							>text {
								display: inline-block;
								&:first-child {
									margin-right: 10px;
									@include no-wrap;
									max-width: 80%;
								}
							}
						};
						.list-bottom-right {
							
						}
					}
				}
			}
		}
	}
</style>
