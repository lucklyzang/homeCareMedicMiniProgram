<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-modal :show="sureCancelShow" title="确定删除此图片?" :showCancelButton="true" @confirm="sureCancel" @cancel="cancelSure"></u-modal>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="订单评价" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="order-form-list-wrapper">
			<view class="order-form-list">
				<view class="order-form-top">
					<view class="order-form-title">
						<text>婴儿全身按摩</text>
					</view>
					<view class="order-form-status">
						<text>实付总金额</text>
						<text>￥999</text>
					</view>
				</view>
				<view class="order-form-center">
					<view class="order-form-center-left">
						<u-image src="@/static/img/health-nurse.png" width="88" height="88">
							 <template v-slot:loading>
							    <u-loading-icon color="red"></u-loading-icon>
							  </template>
						</u-image>
					</view>
					<view class="order-form-center-right">
						<view class="brotected-person">
							<text>被护人</text>
							<text>燕双鹰 26岁</text>
						</view>
						<view class="service-address">
							<text>服务地址</text>
							<text>环球中心一号楼2单元403</text>
						</view>
						<view class="expectation-date">
							<text>期望时间</text>
							<text>06月14日 (星期二) 上午8：00-9：00</text>
						</view>
					</view>
				</view>
			</view>
			<view class="order-form-evaluate-content">
				<view class="service-attitude">
					<view class="service-attitude-title">
						<text>服务态度</text>
					</view>
					<view class="service-attitude-score">
						<u-rate active-color="#F2A15F" size="30" :count="serviceAttitudeCount" v-model="serviceAttitudeValue"></u-rate>
					</view>
				</view>
				<view class="service-attitude">
					<view class="service-attitude-title">
						<text>服务速度</text>
					</view>
					<view class="service-attitude-score">
						<u-rate active-color="#F2A15F" size="30" :count="serviceAttitudeCount" v-model="serviceSpeedValue"></u-rate>
					</view>
				</view>
				<view class="service-attitude">
					<view class="service-attitude-title">
						<text>专业程度</text>
					</view>
					<view class="service-attitude-score">
						<u-rate active-color="#F2A15F" size="30" :count="serviceAttitudeCount" v-model="majorLevelValue"></u-rate>
					</view>
				</view>
			</view>
			<view class="textarea-wrapper">
				<u--textarea v-model="evaluateValue" maxlength="150" height="140" placeholder="请填写你的评价内容 (150字)" count ></u--textarea>
			</view>
			<view class="upload-photo-area">
				<view>
					<view v-for="(item, index) in imgArr" :key='index'>
						<image :src="item" mode="aspectFit"></image>
						<u-icon name="close" size="20" color="#000000" @click="photoDelete(item,index)">></u-icon>
					</view>
					<view @click="getImg">
						<u-icon name="plus" size="30"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-area">
			<text @click="submitEvent">提交</text>
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
				serviceAttitudeCount: 5,
				serviceAttitudeValue: '',
				sureCancelShow: false,
				imgArr: [],
				temporaryImgPathArr: [],
				imgIndex: '',
				serviceSpeedValue: '',
				majorLevelValue: '',
				evaluateValue: ''
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
			
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgArr.splice(this.imgIndex, 1);
				this.temporaryImgPathArr.splice(this.imgIndex, 1)
			},
			
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false;
			},
			
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 选择图片方法
			getImg() {
				var that = this
				uni.chooseImage({
					count: 4,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						that.temporaryImgPathArr = that.temporaryImgPathArr.concat(res.tempFilePaths);
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.srcImage = res.tempFilePaths[imgI];
							uni.getFileSystemManager().readFile({
								filePath: that.srcImage,
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.imgArr.push(base64);
								}
							})
						}
					}
				})
			},
			
			// 提交评价事件
			submitEvent () {
				uni.navigateTo({
					url: '/orderFormPackage/pages/serviceEvaluateFeedback/serviceEvaluateFeedback'
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
		::v-deep .u-popup {
			flex: none !important
		};
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
		}
		.order-form-list-wrapper {
			flex: 1;
			background: #f5f5f5;
			overflow: auto;
			width: 100%;
			padding: 6px 0 10px 0;
			box-sizing: border-box;
			position: relative;
			.order-form-list {
				padding: 0px 4px 8px 4px;
				background: #fff;
				box-sizing: border-box;
				.order-form-top {
					display: flex;
					align-items: center;
					height: 30px;
					justify-content: space-between;
					padding: 0 8px 0 10px;
					box-sizing: border-box;
					.order-form-title {
						flex: 1;
						@include no-wrap();
						>text {
							font-size: 13px;
							color: #444444
						}
					};
					.order-form-status {
						>text {
							display: inline-block;
							padding: 0 0 0 4px;
							box-sizing: border-box;
							font-size: 14px;
							color: #3E4248;
							font-weight: bold;
							&:last-child {
								font-size: 12px;
								color: #F76025;
								margin-left: 10px
							}
						}
					}
				};
				.order-form-center {
					display: flex;
					justify-content: space-between;
					padding: 0 8px;
					box-sizing: border-box;
					.order-form-center-left {
						margin-right: 10px;
						::v-deep .u-image {
							// width: 88px !important;
							// height: 88px !important
						}
					};
					.order-form-center-right {
						padding-top: 10px;
						box-sizing: border-box;
						.brotected-person {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									text-align: right;
									word-break: break-all
								}
							}
						};
						.service-address {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									text-align: right;
									word-break: break-all
								}
							}
						};
						.expectation-date {
							margin-bottom: 6px;
							display: flex;
							justify-content: space-between;
							>text {
								display: inline-block;
								font-size: 12px;
								&:nth-child(1) {
									width: 60px;
									color: #777777;
									margin-right: 6px;
								};
								&:nth-child(2) {
									flex: 1;
									color: #F16C8C;
									text-align: right;
									word-break: break-all
								}
							}
						}
					}
				}
			};
			.order-form-evaluate-content {
				padding: 6px 10px 10px 10px;
				background: #fff;
				box-sizing: border-box;
				border-top: 1px solid #f5f5f5;
				.service-attitude {
					display: flex;
					justify-content: space-between;
					margin-top: 6px;
					align-items: center;
					.service-attitude-title {
						>text {
							font-size: 16px;
							color: #3E4248;
							font-weight: bold;
						}
					};
					.service-attitude-score {
						flex: 1;
						padding-left: 20px;
						box-sizing: border-box;
					}
				};
				.evaluate-text {
					padding: 4px 6px;
					margin-top: 20px;
					box-sizing: border-box;
					word-break: break-all;
					border: 1px solid #BBBBBB
				};
				.evaluate-picture {
					margin-top: 20px;
					display: flex;
					flex-wrap: wrap;
					::v-deep .u-transition {
						width: 32% !important;
						height: 88px !important;
						margin-right: 2%;
						margin-bottom: 10px;
						&:nth-child(3n+3) {
							margin-right: 0 !important
						};
						.u-image {
							.uni-image {
								width: 100% !important
							}
						}
					}
				}
			};
			.textarea-wrapper {
				padding: 6px 10px 10px 10px;
				background: #fff;
				box-sizing: border-box;
			};
			.upload-photo-area {
				padding: 6px 10px 10px 10px;
				background: #fff;
				box-sizing: border-box;
				>view {
					&:nth-child(1) {
						width: 100%;
						font-size: 34px;
						display: flex;
						flex-wrap: wrap;
						>view {
							width: 32%;
							height: 100px;
							display: flex;
							align-items: center;
							justify-content: center;
							vertical-align: top;
							margin-right: 2%;
							margin-top: 2%;
							position: relative;
							.u-icon {
								position: absolute;
								top: 0;
								right: 0
							};
							&:nth-child(1) {
								margin-top: 0;
							};
							&:nth-child(2) {
								margin-top: 0;
							};
							&:nth-child(3) {
								margin-top: 0;
							};
							&:nth-child(3n+3) {
								margin-right: 0;
							};
							&:last-child {
								.u-icon {
									position: relative !important; 
								};
								background: rgba(119, 119, 119, 0.2);
							};
							image {
								width: 100%;
								height: 100%
							}
						}
					}
				}
			}
		};
		.submit-area {
			width: 90%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				display: inline-block;
				width: 100%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				background: #EB3E67;
				border-radius: 5px;
				font-size: 14px;
				color: #fff;
			}
		}
	}
</style>
