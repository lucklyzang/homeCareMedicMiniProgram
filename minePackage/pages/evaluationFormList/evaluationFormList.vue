<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="初步评估单管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="evaluation-form-box">
			<!-- <view class="image-box">
				<image :src="noProtectedPersonsPng"></image>
			</view> -->
			<u-index-list :indexList="indexList" activeColor="#FF5F83">
				<template v-for="(item, index) in itemArr">
					<u-index-item :key="index">
						<u-index-anchor :text="indexList[index]"></u-index-anchor>
						<view class="list" v-for="(item1, index1) in item" :key="index1" @click="evaluationFormClickEvent(item1, index1)">
							<view class="list__item">
								<text class="list__item__user-name">{{ item1.text }}</text>
							</view>
							<u-line></u-line>
						</view>
					</u-index-item>
				</template>
			</u-index-list>
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
	
	import PinyinUtils from '@/common/js/pingyinUtils'
	import navBar from "@/components/zhouWei-navBar"
	const indexList = () => {
		const indexList = [];
		const charCodeOfA = 'A'.charCodeAt(0);
		// indexList.push("↑")
		// indexList.push("☆")
		for (let i = 0; i < 26; i++) {
			indexList.push(String.fromCharCode(charCodeOfA + i))
		};
		// indexList.push('#')
		return indexList
	};
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				indexList: indexList()
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
			itemArr() {
				return this.indexList.map(item => {
					const arr = []
					for (let i = 0; i < 10; i++) {
						arr.push({
							text: item
						})
					};
					return arr
				})
			}
		},
		onShow() {
			console.log('dsa',PinyinUtils.chineseToPinYinFirst('点'))
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 评估单点击事件
			evaluationFormClickEvent (item,index) {
				uni.navigateTo({
					url: '/minePackage/pages/createEvaluationForm/createEvaluationForm?parameter='+ JSON.stringify(item)
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
		background: #fff;
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
		.evaluation-form-box {
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
			.list {
				&__item {
					@include flex;
					padding: 6px 12px;
					align-items: center;
					&__user-name {
						font-size: 14px;
						word-break: break-all;
						color: #101010;
					}
				}
			}
		}
	}
</style>
