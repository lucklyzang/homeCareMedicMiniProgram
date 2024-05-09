<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
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
			<view class="collect-article-box">
				<u-empty text="暂无收藏文章" v-if="isArticleShowNoHomeNoData"></u-empty>
				<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="informationScrolltolower">
					<view class="content-list"  v-for="(item,index) in fullInformationList" :key="index" @click="enterLatestNewsDetailsEvent(item)">
						<view class="content-list-top">
							<view class="list-top-left">
								<u-image :src="!item.image ? defaultPersonPhotoIconPng : item.image" width="70" height="70">
									 <template v-slot:loading>
											<u-loading-icon color="red"></u-loading-icon>
										</template>
								</u-image>
							</view>
							<view class="list-top-right">
								{{ item.title }}
							</view>
						</view>
						<view class="content-list-bottom">
							<view class="list-bottom-left">
								<text>{{ item.articleType == 0 ? '最新资讯' : '其它' }}</text>
								<text>{{ item.realTime }}</text>
							</view>
							<view class="list-bottom-right" @click.stop="deleteInformationFavoriteEvent(item,index)">
								<u-icon name="heart-fill" color="#5064EB" size="30"></u-icon>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" v-if="fullInformationList.length > 0" />
				</scroll-view>	
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
		removeAllLocalStorage,
		fenToYuan,
		formatMsgTime
	} from '@/common/js/utils'
	import { deleteInformationFavorite, myCollectInformationList } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				infoText: '加载中···',
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				isShowNoHomeNoData: false,
				isArticleShowNoHomeNoData: false,
				status: 'nomore',
				informationList: [],
				fullInformationList: [],
				showLoadingHint: false
			}
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
			},
			depName() {
			},
			accountName() {
			}
		},
		
		onLoad() {
			this.queryMyCollectInformationList({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize
			},true)
		},
		
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 收藏文章滚动
			informationScrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryMyCollectInformationList({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize
					},false)
				}
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 查询我的收藏文章formatMsgTime(this.getNowFormatDate(new Date(item.createTime),4))
			queryMyCollectInformationList(data,flag) {
				this.informationList = [];
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				myCollectInformationList(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.informationList = res.data.data.list;
						this.informationList.forEach((item) => {
							item.realTime = this.disposeArticleCollectDate(item.createTime)
						});
						this.fullInformationList = this.fullInformationList.concat(this.informationList);
						if (this.fullInformationList.length == 0) {
							this.isArticleShowNoHomeNoData = true
						} else {
							this.isArticleShowNoHomeNoData = false
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
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 取消资讯收藏事件
			deleteInformationFavoriteEvent (item,index) {
				this.showLoadingHint = true;
				this.infoText = '取消收藏中···';
				deleteInformationFavorite({id: item.articleId }).then((res) => {
					if ( res && res.data.code == 0) {
						this.fullInformationList.splice(index,1);
						if (this.fullInformationList.length == 0) {
							this.isArticleShowNoHomeNoData = true
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 进入最新资讯详情事件
			enterLatestNewsDetailsEvent (item) {
				// 传递资讯详情内容
				let temporaryMessage = {
					id: item.articleId,
					createTime: item.createTime
				};
				let mynavData = encodeURIComponent(JSON.stringify(temporaryMessage));
				uni.navigateTo({
					url: '/messagePackage/pages/latestNewsDetails/latestNewsDetails?transmitData='+mynavData
				})
			},
			
			// 进入服务详情事件
			enterServiceDetailsEvent (item) {
				uni.navigateTo({
					url: '/servicePackage/pages/service/index/index?transmitData='+item
				})
			},
			
			// 处理收藏文章收藏日期
			disposeArticleCollectDate (date) {
				if (!date) { return };
				let collectDate = this.getNowFormatDate(new Date(date),2);
				let currentDate = this.getNowFormatDate(new Date(),2);
				if (collectDate == currentDate) {
					return '今天'
				} else if (new Date(date).getFullYear() == new Date().getFullYear()) {
					return this.getNowFormatDateText(date,3)
				} else {
					return this.getNowFormatDateText(date,1)
				}
			},
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 1(展示年月日) 2(只展示月) 3(只展示月日)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator1 = "月";
				let seperator2 = "日";
				let seperator3 = "年";
				let year = new Date(currentDate).getFullYear();
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 2) {
					currentdate = month + seperator1
				} else if (type == 3){
					currentdate = month + seperator1 + strDate + seperator2
				} else if (type == 1){
					currentdate = year + seperator3 + month + seperator1 + strDate + seperator2
				};
				return currentdate
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
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
		position: relative;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 20000;
		};
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
			.collect-article-box {
				flex: 1;
				padding: 10px;
				box-sizing: border-box;
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
							height: 60px;
							display: flex;
							align-items: center;
							color: #101010;
							@include no-wrap-line(3)
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
