<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="最新资讯" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="message-list-wrapper">
			<u-empty text="暂无消息" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="message-list" @click="enterLatestNewsDetailsEvent">
					<text>
						2023-05-35 14:21
					</text>
					<view class="message-inner-list">
						<view class="message-inner-list-top">
								<text>(建议收藏) 宝宝早日割包皮的好处</text>
						</view>
						<view class="message-inner-list-bottom">
							<text>对方身上都是活动开始了的教案设计很久很久很久很久很久很久</text>
						</view>
					</view>
				</view>
				<view class="message-list">
					<text>
						2023-05-35 14:21
					</text>
					<view class="message-inner-list">
						<view class="message-inner-list-top">
								<text>(建议收藏) 宝宝早日割包皮的好处</text>
						</view>
						<view class="message-inner-list-bottom">
							<text>对方身上都是活动开始了的教案设计很久很久很久很久很久很久</text>
						</view>
					</view>
				</view>
				<!-- <u-loadmore :status="status" v-if="fullNoticeList.length > 0"/> -->
			</scroll-view>
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
				status: 'nomore',
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
			
			// 进入最新资讯详情事件
			enterLatestNewsDetailsEvent () {
				uni.navigateTo({
					url: '/messagePackage/pages/latestNewsDetails/latestNewsDetails'
				})
			},
			
			scrolltolower () {
				// let totalPage = Math.ceil(this.totalCount/this.pageSize);
				// if (this.currentPage >= totalPage) {
				// 	this.status = 'nomore'
				// } else {
				// 	this.status = 'loadmore';
				// 	this.currentPage = this.currentPage + 1;
				// 	this.queryDeviceNoticeList({
				// 		pageNo: this.currentPage,
				// 		pageSize: this.pageSize,
				// 		familyId: this.initValueId == 'null' ? '' : this.initValueId
				// 	},false)
				// }
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
			background: #FAFAFA;
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: column;
			padding: 16px 16px 16px 16px;
			box-sizing: border-box;
			position: relative;
			 ::v-deep .u-empty {
			 	position: absolute;
			 	top: 50%;
			 	left: 50%;
			 	transform: translate(-50%,-50%)
			 };
			 .scroll-view {
					height: 100%
			 };
			.message-list {
				text-align: center;
				>text {
					display: inline-block;
					height: 25px;
					font-size: 12px;
					width: 125px;
					background: rgba(187, 187, 187, 0.43);
					text-align: center;
					border-radius: 15px;
					color: #fff;
					line-height: 25px;
				};
				margin-bottom: 20px;
				.message-inner-list {
					background: #fff;
					margin-top: 15px;
					padding: 0 6px 10px 6px;
					box-sizing: border-box;
					box-shadow: 0px 2px 6px 0 rgba(92, 133, 136, 0.29);
					border-radius: 8px;
					position: relative;
					.message-inner-list-top {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 6px 0 6px;
						box-sizing: border-box;
						height: 46px;
						@include bottom-border-1px(#BBBBBB);
						>text {
							color: #101010;
							font-size: 16px;
							vertical-align: middle
						}
					};
					.message-inner-list-bottom {
						padding: 0 6px 0 6px;
						box-sizing: border-box;
						color: #888888;
						font-size: 14px;
						margin-top: 10px;
						text-align: justify
					}
				}
			}
		}	
	}
</style>
