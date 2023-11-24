<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='2000' bgColor="none" title="消息">
				</nav-bar> 
		  </view>
		</view>
		<view class="message-list-wrapper">
			<u-empty text="暂无消息" mode="list" v-if="isShowNoData"></u-empty>
			<view class="message-list" @click="enterMessageListEvent">
				<view class="message-photo">
					<u-image src="@/static/img/health-nurse.png" width="46" height="46">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="message-content">
					<view class="message-content-left">
						<view class="message-title">
							<text>资讯</text>
						</view>
						<view class="message-overview">
							<text>
								婚纱款式杀杀杀杀杀杀杀杀杀杀杀杀杀杀杀开发了大家附件是解放军封建士大夫
							</text>
						</view>
					</view>
					<view class="message-content-right">
						<view class="message-date">
							<text>1小时前</text>
						</view>
						<view class="message-number">
							<text>8</text>
						</view>
					</view>
				</view>
			</view>
			<view class="message-list">
				<view class="message-photo">
					<u-image src="@/static/img/health-nurse.png" width="46" height="46">
						 <template v-slot:loading>
						    <u-loading-icon color="red"></u-loading-icon>
						  </template>
					</u-image>
				</view>
				<view class="message-content">
					<view class="message-content-left">
						<view class="message-title">
							<text>公告</text>
						</view>
						<view class="message-overview">
							<text>
								婚纱款式杀杀杀杀杀杀杀
							</text>
						</view>
					</view>
					<view class="message-content-right">
						<view class="message-date">
							<text>1小时前</text>
						</view>
						<view class="message-number">
							<text>8</text>
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
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '',
				showLoadingHint: false,
				isShowNoData: false
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
			
			// 进入消息列表事件
			enterMessageListEvent () {
				uni.navigateTo({
					url: '/messagePackage/pages/message/index/index'
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
		.top-area-box {
			position: relative;
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
		.message-list-wrapper {
			width: 100%;
			flex: 1;
			overflow: auto;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.message-list {
				padding: 10px;
				box-sizing: border-box;
				display: flex;
				margin-bottom: 10px;
				align-items: center;
				justify-content: space-between;
				.message-photo {
					margin-right: 10px;
					::v-deep .u-image {
						// width: 46px !important;
						// height: 46px !important
					}
				};
				.message-content {
					flex: 1;
					width: 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.message-content-left {
						flex: 1;
						@include no-wrap();
						.message-title {
							@include no-wrap();
							margin-bottom: 10px;
							>text {
								width: 100%;
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						};
						.message-overview {
							@include no-wrap();
							>text {
								width: 100%;
								font-size: 14px;
								color: #898C8C;
							}	
						}
					};
					.message-content-right {
						.message-date {
							margin-bottom: 10px;
							>text {
								font-size: 14px;
								color: #8A8A8A
							}
						};
						.message-number {
							text-align: center;
							>text {
								width: 20px;
								height: 20px;
								color: #fff;
								text-align: center;
								line-height: 20px;
								font-size: 12px;
								display: inline-block;
								border-radius: 50%;
								background: #E86F50
							}
						}
					};
				}
			}
		}	
	}
</style>
