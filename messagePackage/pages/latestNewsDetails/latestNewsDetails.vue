<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="最新资讯" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="message-content-wrapper">
			最新资讯详情
			<u-empty text="暂无消息" mode="list" v-if="isShowNoData"></u-empty>
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
		.message-content-wrapper {
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: column;
			padding: 0 16px 16px 16px;
			box-sizing: border-box;
			position: relative;
			 ::v-deep .u-empty {
			 	position: absolute;
			 	top: 50%;
			 	left: 50%;
			 	transform: translate(-50%,-50%)
			 }
		}	
	}
</style>
