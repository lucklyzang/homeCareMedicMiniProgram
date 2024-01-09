<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="sureCancelShow" title="确定删除此图片?" :showCancelButton="true" @confirm="sureCancel" @cancel="cancelSure"></u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" fontColor="#FFFFFF" backState='3000' bgColor="none" title="意见反馈" @backClick="backTo">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="feedback-content-box" v-if="!isFeedbackSuccess">
			<view class="feedback-category">
				<view class="feedback-category-title">
					<text>反馈类别</text>
				</view>
				<view class="feedback-category-content">
					<view class="feedback-category-list" :class="{'feedbackCategoryStyle' : feedbackCategoryIndex === index}" @click="feedbackCategoryClickEvent(item,index)" v-for="(item,index) in feedbackCategoryList">
						<text>{{ item.label }}</text>
					</view>
				</view>
			</view>
			<view class="problem-description">
				<view class="problem-description-title">
					<text>问题描述(必填)</text>
				</view>
				<view class="problem-description-content">
					<u--textarea v-model="problemDescriptionValue" placeholder="请填写15字以上描述，以便我们更好地为您提供帮助~" ></u--textarea>
				</view>
			</view>
			<view class="upload-pictures">
				<view class="upload-pictures-title">
					<text>上传图片 (最多3张)</text>
				</view>
				<view class="upload-pictures-content">
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
			<view class="contact-information">
				<view class="contact-information-title">
					<text>联系方式(必填)</text>
				</view>
				<view class="contact-information-content">
					<u--input
						placeholder="请填写您的手机号码，我们的客服人员会给您反馈处理结果"
						border="surround"
						type="number"
						v-model="contactInformationValue"
					></u--input>
				</view>
			</view>
		</view>
		<view class="feedback-btn-box" v-if="!isFeedbackSuccess">
			<view class="feedback-btn" @click="submitEvent">
				<text>提交</text>
			</view>
		</view>
		<view class="feedback-success-box" v-if="isFeedbackSuccess">
			<view class="feedback-success-title">
				<text>提交成功</text>
			</view>
			<view class="feedback-success-image">
				<image src="@/static/img/view-order-form-details-bottom-icon-two.png"></image>
			</view>
			<view class="feedback-success-btn" @click="backTo">
				<text>确定</text>
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
	import store from '@/store'
	import { createFeedback } from '@/api/user.js'
	import { getUserDictData } from '@/api/login.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '提交中···',
				isFeedbackSuccess: false,
				loginBackgroundPng: require("@/static/img/login-background.png"),
				topCutList: ['常见问题','使用技巧'],
				topCutIndex: 0,
				feedbackCategoryList: [],
				problemDescriptionValue: '',
				contactInformationValue: '',
				feedbackCategoryIndex: null,
				feedbackCategory: {},
				sureCancelShow: false,
				imgArr: [],
				imgFileArr: [],
				imgOnlinePathArr: [],
				imgIndex: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			this.getUserDictDataEvent()
		},
		methods: {
			...mapMutations([
			]),
			
			// 反馈类别点击事件
			feedbackCategoryClickEvent (item,index) {
				this.feedbackCategoryIndex = index;
				this.feedbackCategory = item
			},
			
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgFileArr.splice(this.imgIndex, 1);
				this.imgArr.splice(this.imgIndex, 1)
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
			
			// 获取反馈类型字典数据
			getUserDictDataEvent () {
				this.infoText = '加载中···';
				this.showLoadingHint = true;
				this.feedbackCategoryList = [];
				getUserDictData({type: 'feedback_type'}).then((res) => {
					if ( res && res.data.code == 0) {
						this.feedbackCategoryList = res.data.data
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
				})
			},
			
			// 提交事件
			async submitEvent () {
				if (this.feedbackCategoryIndex === null) {
					this.$refs.uToast.show({
						message: '请选择反馈类别',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!this.problemDescriptionValue) {
					this.$refs.uToast.show({
						message: '请输入问题描述',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!this.contactInformationValue) {
					this.$refs.uToast.show({
						message: '请输入联系方式',
						type: 'error',
						position: 'center'
					});
					return
				};
				// 上传图片文件流到服务端
				if (this.imgFileArr.length > 0) {
					for (let imgI of this.imgFileArr) {
						await this.uploadFileEvent(imgI)
					}
				};
				this.createFeedbackEvent({
					userId: this.userInfo.userId,
					type: this.feedbackCategory.id,
					description: this.problemDescriptionValue,
					images: this.imgOnlinePathArr,
					mobile: this.contactInformationValue,
					status: 0,
					processor: '',
					handleTime: '',
					handleResult: ''
				})
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				return new Promise((resolve, reject) => {
					uni.uploadFile({
					 url: 'https://dev.nurse.blinktech.cn/nurse/app-api/infra/file/upload',
					 filePath: imgI,
					 name: 'file',
					 header: {
						'content-type': 'multipart/form-data',
						'Authorization': `Bearer ${store.getters.token}`
					 },
					 success: (res) => {
						if (res.statusCode == 200) {
							let temporaryData = JSON.parse(res.data);
							this.imgOnlinePathArr.push(temporaryData.data);
							resolve()
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '上传图片失败',
								type: 'error',
								position: 'center'
							});
							reject()
						}
					 },
					 fail: (err) => {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: err,
							type: 'error',
							position: 'center'
						});
						reject()
					 }
					})
				})
			},
			
			// 意见反馈事件
			createFeedbackEvent(data) {
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				createFeedback(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.isFeedbackSuccess = true
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
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
			
			
			// 选择图片方法
			getImg() {
				if (this.imgArr.length >= 3) {
					this.$refs.uToast.show({
						message: '最多只能上传3张图片',
						type: 'error',
						position: 'center'
					});
					return
				};
				let that = this;
				uni.chooseImage({
					count: 3,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.imgFileArr.push(res.tempFiles[imgI]['path']);
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
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
		.feedback-content-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			height: 0;
			overflow: auto;
			.feedback-category {
				padding: 14px;
				box-sizing: border-box;
				background: #fff;
				margin-bottom: 10px;
				.feedback-category-title {
					font-size: 14px;
					color: #101010;
					margin-bottom: 14px;
				};
				.feedback-category-content {
					display: flex;
					flex-wrap: wrap;
					.feedback-category-list {
						padding: 10px 20px;
						box-sizing: border;
						margin-right: 10px;
						margin-bottom: 10px;
						height: 43px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						color: #5064EB;
						border: 1px solid #5064EB;
						border-radius: 7px;
						box-sizing: border-box
					};
					.feedbackCategoryStyle {
						color: #fff !important;
						background: #5064EB !important
					}
				}
			};
			.problem-description {
				padding: 14px;
				box-sizing: border-box;
				background: #fff;
				margin-bottom: 10px;
				.problem-description-title {
					font-size: 14px;
					color: #101010;
					margin-bottom: 14px;
				};
				.problem-description-content {
					
				}
			};
			.upload-pictures {
				padding: 14px;
				box-sizing: border-box;
				background: #fff;
				margin-bottom: 10px;
				.upload-pictures-title {
					font-size: 14px;
					color: #101010;
					margin-bottom: 14px;
				};
				.upload-pictures-content {
					background: #fff;
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
									border: 1px dashed #B2B2B2;
									border-radius: 10px;
									box-sizing: border-box
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
			.contact-information {
				padding: 14px;
				box-sizing: border-box;
				background: #fff;
				.contact-information-title {
					font-size: 14px;
					color: #101010;
					margin-bottom: 14px;
				};
				.contact-information-content {
					
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
		};
		.feedback-success-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.feedback-success-title {
				color: #101010;
				font-size: 28px
			};
			.feedback-success-image {
				margin: 100px 0;
				image {
					width: 80px;
					height: 80px
				}
			};
			.feedback-success-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				color: #101010;
				font-size: 18px;
				width: 140px;
				height: 44px;
				border: 1px solid #BBBBBB;
				background: #fff;
				border-radius: 4px;
			}
		}
	}
</style>
