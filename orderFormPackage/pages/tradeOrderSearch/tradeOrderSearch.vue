<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 删除全部搜索记录提示 -->
		<view class="delete-info">
			<u-modal :show="deleteSearchShow" @confirm="deleteSearchSureEvent" @cancel="deleteSearchShow=false" confirmText="确定" cancelColor="#838C97" confirmColor="#5064EB" :showCancelButton="true" title="删除全部搜索记录后无法恢复,确定删除?">
			</u-modal>
		</view>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" color="#fff" backState='3000' bgColor="none" title="搜索">
					<template #left>
						<u-icon name="arrow-left" color="#fff" size="22" @click="backTo"></u-icon>
					</template>
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="search-input-content">
			<view class="search-box">
				<u-search @blur="searchInputBlurEvent"  @focus="searchInputFocusEvent" v-model="searchValue" placeholder="搜索我的订单" bgColor="#fff" searchIconColor="#CCCCCC" :actionStyle="{color: '#fff',padding: '4px 10px',background: '#5064EB',borderRadius: '6px',fontSize: '14px'}" @change="searchInputEvent" @custom="searchEvent" :clearabled="true" :showAction="true"></u-search>
			</view>
		</view>
		<view class="search-history-content">
			<view class="search-history-box">
				<view class="search-history-title">
					<view class="search-history-title-left">
						<text>历史记录</text>
					</view>
					<view class="search-history-title-right" @click="deleteHistorySearchEvent" v-if="searchHistoryList.length > 0">
						<u-icon name="trash" color="#BBBBBB" size="22"></u-icon>
					</view>
				</view>
				<view class="search-history-item-content">
					<view class="search-history-list" :key="index" v-for="(item,index) in searchHistoryList" @click="searchItemClickEvent(item,index,'history')">
						<text>{{ item }}</text>
						<!-- <u-icon name="close" color="#101010" size="18" @click.native.stop="deleteSingleEvent(item,index)"></u-icon> -->
					</view>
					<view class="no-data-box" v-if="searchHistoryList.length == 0">
						<u-empty mode="history" iconSize="60">  
						</u-empty>
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
	import store from '@/store'
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { getSearchPhrase, deleteHisOne, deleteHisAll } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				deleteSearchShow: false,
				infoText: '加载中',
				searchValue: '',
				searchHistoryList: [],
				loginBackgroundPng: require("@/static/img/login-background.png")
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
		onLoad() {
			this.getSearchPhraseEvent()
		},
		onReady() {
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo',
				'saveTradeorderSearchMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 保存订单搜索信息
			saveTradeorderSearchMessageEvent (text) {
				let pages = getCurrentPages();//当前页
				let beforePageRoute = pages[pages.length - 1].route;//上个页面路径;
				this.saveTradeorderSearchMessage({
					tradeOrderContent: text,
					currentPageRoute: beforePageRoute
				})
			},
			
			// 搜索框失焦事件
			searchInputBlurEvent () {
			},
			
			// 搜索框获焦事件
			searchInputFocusEvent () {
			},
			
			// 搜索框值变化事件
			searchInputEvent () {
				
			},
			
			// 搜索事件
			searchEvent () {
				if (this.searchValue === '') {
					this.$refs.uToast.show({
						message: '搜索内容不能为空',
						type: 'error',
						position: 'center'
					});
					return
				};
				this.saveTradeorderSearchMessageEvent(this.searchValue);
				uni.switchTab({
					url: '/pages/orderForm/orderForm'
				})
			},
			
			// 删除单个搜索记录事件
			deleteSingleEvent (item,index) {
				deleteHisOne(this.current === 0 ? 1 : this.current === 1 ? 3 : 2,{name: item}).then((res) => {
					if ( res && res.data.data) {
						this.searchHistoryList.splice(index,1)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}	
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 删除全部历史搜索记录弹框事件
			deleteHistorySearchEvent () {
				this.deleteSearchShow = true
			},
			
			// 删除全部历史搜索记录弹框确定事件
			deleteSearchSureEvent () {
				deleteHisAll().then((res) => {
					if ( res && res.data.data) {
						this.deleteSearchShow = false;
						this.searchHistoryList = []
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}	
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 查询搜索词组事件
			getSearchPhraseEvent() {
				getSearchPhrase().then((res) => {
					if ( res && res.data.code == 0) {
						this.searchHistoryList = res.data.data;
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}	
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 快捷搜索事件
			searchItemClickEvent(item,index) {
				this.searchValue = item;
				this.saveTradeorderSearchMessageEvent(this.searchValue);
				uni.switchTab({
					url: '/pages/orderForm/orderForm'
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
		background: #f5f5f5;
		::v-deep .u-popup {
			flex: none !important
		};
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
				.header_content {
					align-items: center !important;
					.header_left_box {
						.u-icon {
							margin-left: 4px
						}
					};
					.header_title_center {
						left: 350rpx !important;
						color: #fff !important;
						text {
							color: #fff !important;
						}
					}
				}
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100px
			}
		};
		.search-input-content {
			padding: 10px 10px 0 10px;
			box-sizing: border-box;
			.search-box {
				height: 60px;
				display: flex;
				align-items: center;
			}
		};
		.search-history-content {
			flex: 1;
			overflow: auto;
			padding: 0 10px 10px 10px;
			box-sizing: border-box;
			.search-history-box {
				.search-history-title {
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14px;
					.search-history-title-left {
						font-size: 14px;
						color: #000000;
						font-weight: 400;
					};
					.search-history-title-right {};
				};
				.search-history-item-content {
					display: flex;
					flex-wrap: wrap;
					.search-history-list {
						position: relative;
						padding: 3px 16px;
						box-sizing: border-box;
						margin-right: 10px;
						margin-bottom: 8px;
						background: #E4DFDF;
						border-radius: 30px;
						font-size: 14px;
						color: #101010;
						::v-deep {
							.uicon-close {
								position: absolute;
								top: -8px !important;
								right: -8px !important;
							}
						}
					};
					.no-data-box {
						width: 100%;
					}
				}
			}
		}
	}
</style>
