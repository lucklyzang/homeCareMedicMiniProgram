<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="广告详情" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="advertising-details-box">
			<rich-text :nodes="currentContent"></rich-text>
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
				infoText: '加载中',
				currentContent: ''
			}
		},
		computed: {
			...mapGetters([
				'userBasicInfo',
				'selectBannerMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onLoad() {
			this.currentContent = this.selectBannerMessage['content'][this.selectBannerMessage.index]['content'];
			this.currentContent = this.currentContent.replace(/\<img/gi, '<img class="mystyle"');
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
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #f5f5f5;
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
		.advertising-details-box {
			flex: 1;
			width: 96%;
			margin: 0 auto;
			padding: 10px 0 20px 0;
			box-sizing: border-box;
			overflow: auto;
			.mystyle {
				width: 100%;
				display: block;
			}
		}
	}
</style>
