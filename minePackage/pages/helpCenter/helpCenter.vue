<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" fontColor="#FFFFFF" backState='3000' bgColor="none" title="帮助中心" @backClick="backTo">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-cut-area">
			<view class="top-cut-list" :class="{'topCutListStyle': topCutIndex == index}" v-for="(item,index) in topCutList" :key="index" @click="topCutEvent(item,index)">
				<text>{{ item }}</text>
			</view>
		</view>
		<view class="common-problem-box" v-if="topCutIndex === 0">
			<u-empty text="暂无数据" v-if="isShowNoHomeNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolowerIssue">
				<u-collapse
						@change="change"
						@close="close"
						@open="open"
					>
						<u-collapse-item
							v-for="(item,index) in fullIssueList" :key="index"
							:title="item.title"
							name="Docs guide"
						>
							<text class="u-collapse-content">{{ item.description }}</text>
						</u-collapse-item>
				</u-collapse>
				<u-loadmore :status="status"  v-if="fullIssueList.length > 0" />
			</scroll-view>
		</view>
		<view class="common-problem-box" v-else>
			<u-empty text="暂无数据" v-if="isShowNoHomeNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolowerUseSkill">
				<u-collapse
						@change="change"
						@close="close"
						@open="open"
					>
						<u-collapse-item
							v-for="(item,index) in fullUserSkillList" :key="index"
							:title="item.title"
							name="Docs guide"
						>
							<text class="u-collapse-content">{{ item.description }}</text>
						</u-collapse-item>
				</u-collapse>
				<u-loadmore :status="status"  v-if="fullUserSkillList.length > 0" />
			</scroll-view>
		</view>
		<view class="feedback-btn-box">
			<view class="feedback-btn" @click="feedbackEvent">
				<text>意见反馈</text>
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
	import { getsystemHelpCenter } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				status: 'nomore',
				issueList: [],
				fullIssueList: [],
				userSkillList: [],
				fullUserSkillList: [],
				loginBackgroundPng: require("@/static/img/login-background.png"),
				topCutList: ['常见问题','使用技巧'],
				topCutIndex: 0
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
			this.queryIssueListEvent({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize,
				type: 0,
				status: 0
			},true)
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部tab切换事件
			topCutEvent (item,index) {
				this.topCutIndex = index;
				this.currentPageNum = 1;
				if (this.topCutIndex === 0) {
					this.queryIssueListEvent({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						type: 0,
						status: 0
					},true)
				} else if (this.topCutIndex === 1) {
					this.queryIssueListEvent({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						type: 1,
						status: 0
					},true)
				}
			},
			
			open(e) {
				// console.log('open', e)
			},
			
			close(e) {
				// console.log('close', e)
			},
			
			change(e) {
				// console.log('change', e)
			},
			
			// 监听常见问题列表滚动
			scrolltolowerIssue () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryIssueListEvent({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						type: 0,
						status: 0
					},false)
				}
			},
			
			// 监听使用技巧列表滚动
			scrolltolowerUseSkill () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryIssueListEvent({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						type: 1,
						status: 0
					},false)
				}
			},
			
			// 查询问题列表和使用技巧
			queryIssueListEvent(data,flag) {
				this.isShowNoHomeNoData = false;
				if (this.topCutIndex === 0) {
					this.issueList = [];
				} else if (this.topCutIndex === 1) {
					this.userSkillList = [];
				}; 
				if (flag) {
					if (this.topCutIndex === 0) {
						this.fullIssueList = [];
					} else if (this.topCutIndex === 1) {
						this.fullUserSkillList = [];
					};
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getsystemHelpCenter(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						if (this.topCutIndex === 0) {
							this.issueList = res.data.data.list;
							this.fullIssueList = this.fullIssueList.concat(this.issueList);
							if (this.fullIssueList.length == 0) {
								this.isShowNoHomeNoData = true
							} else {
								this.isShowNoHomeNoData = false
							}
						} else if (this.topCutIndex === 1) {
							this.userSkillList = res.data.data.list;
							this.fullUserSkillList = this.fullUserSkillList.concat(this.userSkillList);
							if (this.fullUserSkillList.length == 0) {
								this.isShowNoHomeNoData = true
							} else {
								this.isShowNoHomeNoData = false
							}
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false;
					} else {
						let totalPage = Math.ceil(this.totalCount/this.pageSize);
						if (this.currentPage >= totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore';
						}	
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false;
					} else {
						this.status = 'loadmore'
					};
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			//意见反馈事件
			feedbackEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/feedback/feedback'
				})
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
		background: #F2F2F2;
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
				height: 100px
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.top-cut-area {
			height: 70px;
			background: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			.top-cut-list {
				width: 100px;
				height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 13px;
				color: #3D8DFF;
				border: 1px solid #3D8DFF;
				box-sizing: border-box;
				&:nth-child(1) {
					border-top-left-radius: 4px;
					border-bottom-left-radius: 4px;
				}
				&:nth-child(2) {
					border-top-right-radius: 4px;
					border-bottom-right-radius: 4px;
				}
			};
			.topCutListStyle {
				color: #fff !important;
				background: #5064EB !important;
				border: none !important
			}
		};
		.common-problem-box {
			flex: 1;
			overflow: auto;
			.scroll-view {
				height: 100%
			};
			::v-deep .u-empty {
			 	position: absolute;
			 	top: 50%;
			 	left: 50%;
			 	transform: translate(-50%,-50%)
			 };
			::v-deep .u-collapse {
				.u-collapse-item {
					background: #fff;
					.u-cell__body {
						font-size: 14px;
						color: #101010;
						font-weight: bold
					};
					.u-collapse-item__content__text {
						font-size: 14px;
						color: #101010
					}
				}
			}
		};
		.feedback-btn-box {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100px;
			.feedback-btn {
				width: 80%;
				height: 46px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #5064EB;
				border-radius: 6px;
				color: #fff;
				font-size: 15px
			}
		}
	}
</style>
