<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-modal :show="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="护士资格证认证" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="real-name-authentication-box">
			<view class="real-name-authentication-step">
				<view class="real-name-authentication-step-top">
					<view class="circle-one" :class="{'stepStyle' : stepActive === 0 || stepActive === 1}"></view>
					<view class="line-one" :class="{'stepStyle' : stepActive === 0 || stepActive === 1}"></view>
					<view class="circle-two" :class="{'stepStyle' : stepActive === 1}"></view>
				</view>
				<view class="real-name-authentication-step-bottom">
					<view class="step-left" :class="{'stepStyle' : stepActive === 0 || stepActive === 1 }">完成护士资格认证</view>
					<view class="step-right" :class="{'stepStyle' : stepActive === 1 }">完成</view>
				</view>
			</view>
			<view class="step-one" v-if="stepActive === 0">
				<view class="real-name-authentication-upload">
					<view class="real-name-authentication-upload-title">
						<text>上传资格证照片</text>
					</view>
					<view class="real-name-authentication-upload-one">
						<view class="upload-before" v-if="frontImageBase64Arr.length == 0" @click="getImg('front')">
							<view class="upload-image">
								<image src="@/static/img/camera-white-icon.png"></image>
							</view>
							<view class="upload-text">
								<text>上传资格证正面</text>
							</view>
						</view>
						<view class="upload-after" v-else v-for="(item, index) in frontImageBase64Arr" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'front')"></u-icon>
						</view>
					</view>
					<view class="real-name-authentication-upload-one real-name-authentication-upload-two">
						<view class="upload-before" v-if="backImageBase64Arr.length == 0" @click="getImg('back')">
							<view class="upload-image">
								<image src="@/static/img/camera-white-icon.png"></image>
							</view>
							<view class="upload-text">
								<text>上传资格证反面</text>
							</view>
						</view>
						<view class="upload-after" v-else v-for="(item, index) in backImageBase64Arr" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'back')"></u-icon>
						</view>
					</view>
				</view>
				<view class="real-name-authentication-standard">
					<view class="real-name-authentication-standard-title">
						<text>上传标准</text>
					</view>
					<view class="real-name-authentication-standard-image">
						<view class="real-name-authentication-standard-one">
							<image src="@/static/img/app-logo.png"></image>
							<view class="text-explain">
								<image src="@/static/img/authentication-upload-demonstrate-correct.png"></image>
								<text>标准照片</text>
							</view>
						</view>
						<view class="real-name-authentication-standard-one real-name-authentication-standard-two">
							<image src="@/static/img/app-logo.png"></image>
							<view class="text-explain">
								<image src="@/static/img/authentication-upload-demonstrate-wrong.png"></image>
								<text>模糊照片</text>
							</view>
						</view>
						<view class="real-name-authentication-standard-one real-name-authentication-standard-three">
							<image src="@/static/img/app-logo.png"></image>
							<view class="text-explain">
								<image src="@/static/img/authentication-upload-demonstrate-wrong.png"></image>
								<text>闪光照片</text>
							</view>
						</view>
					</view>
					<view class="friendly-reminder">
						<text>温馨提示：照片不清晰会影响身份识别的审核</text>
					</view>
				</view>
			</view>
			<view class="step-three" v-if="stepActive === 1">
				<view class="authentication-success">
					<view class="step-two-content">
						<view class="image-area">
							<image src="@/static/img/real-name-authentication-success.png"></image>
						</view>
						<view class="step-two-explain-one">
							<text>恭喜你，护士资格证上传成功</text>
						</view>
						<view class="step-two-explain-two">
							<text>你提交的认证资料正在审核</text>
						</view>
						<view class="step-two-explain-three">
							<!-- <text>{{ authenticationName }}</text>
							<text> {{ `资格证: ${authenticationNum}` }}</text> -->
						</view>
					</view>
					<view class="step-two-btn" @click="perfectPersonalMessageEvent">
						<text>完善个人信息</text>
					</view>
				</view>	
			</view>
			<view class="step-btn-box" v-if="stepActive != 1">
				<view class="step-btn" @click="stepEvent">
					<text>下一步</text>
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
	import { createMedicalCareAptitude } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				stepActive: 0,
				text: '',
				content: '',
				frontImageFileArr: [],
				frontImageBase64Arr: [],
				authenticationName: '',
				authenticationNum:  '',
				backImageFileArr: [],
				backImageBase64Arr: [],
				frontImageOnlineArr: [],
				backImageOnlineArr: [],
				sureCancelShow: false,
				imgIndex: null,
				medicalCareAptitudeMessage: {}
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onLoad(options) {
			this.medicalCareAptitudeMessage = JSON.parse(options.transmitData)
		},
		methods: {
			...mapMutations([
			]),
			
			// 图片删除事件
			photoDelete(item, index, text) {
				this.text = text;
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 删除图片弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false
			},
			
			// 删除图片弹框确定按钮
			sureCancel() {
				if (this.text == 'front') {
					this.frontImageFileArr.splice(this.imgIndex, 1);
					this.frontImageBase64Arr.splice(this.imgIndex, 1)
				} else if (this.text == 'back') {
					this.backImageFileArr.splice(this.imgIndex, 1);
					this.backImageBase64Arr.splice(this.imgIndex, 1)
				};
				this.sureCancelShow = false
			},
			
			// 上传图片方法
			getImg(text) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							let url = res.tempFiles[imgI].path;
							//获取最后一个的位置
							let index = url.lastIndexOf(".");
							//获取后缀
							let jpgUrl = url.substr(index + 1);
							if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
								that.$refs.uToast.show({
									message: '只能上传jpg/png格式的图片!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							let isLt2M = res.tempFiles[imgI].size/1024/1024 < 5;
							if (!isLt2M) {
								that.$refs.uToast.show({
									message: '文件不能大于5MB!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							if (text == 'front') {
								that.frontImageFileArr.push(res.tempFiles[imgI]['path']);
							} else if (text == 'back') {
								that.backImageFileArr.push(res.tempFiles[imgI]['path']);
							};
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									if (text == 'front') {
										that.frontImageBase64Arr.push(base64);
									} else if (text == 'back') {
										that.backImageBase64Arr.push(base64);
									}
								}
							})
						}
					}
				})
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI,text) {
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
							if (text == 'front') {
								this.frontImageOnlineArr.push(temporaryData.data);
							} else if (text == 'back') {
								this.backImageOnlineArr.push(temporaryData.data);
							};
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
			
			// 护士资格认证事件
			createMedicalCareAptitudeEvent (data) {
				this.infoText = '护士资格认证中···';
				this.showLoadingHint = true;
				createMedicalCareAptitude(data).then((res) => {
					this.frontImageOnlineArr = [];
					this.backImageOnlineArr = [];
					if ( res && res.data.code == 0) {
						this.stepActive = 1;
						this.authenticationName = res.data.data.name;
						this.authenticationNum =  res.data.data.idCard;
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.frontImageOnlineArr = [];
					this.backImageOnlineArr = [];
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 下一步事件
			async stepEvent () {
				if (this.stepActive === 0) {
					if (this.frontImageFileArr.length == 0) {
						this.$refs.uToast.show({
							message: '请上传护士资格证正面图片',
							type: 'error',
							position: 'center'
						});
						return
					};
					if (this.backImageFileArr.length == 0) {
						this.$refs.uToast.show({
							message: '请上传护士资格证反面图片',
							type: 'error',
							position: 'center'
						});
						return
					};
					// 上传图片文件流到服务端(资格证正面)
					if (this.frontImageFileArr.length > 0) {
						for (let imgI of this.frontImageFileArr) {
							await this.uploadFileEvent(imgI,'front')
						}
					};
					// 上传图片文件流到服务端(资格证反面)
					if (this.backImageFileArr.length > 0) {
						for (let imgI of this.backImageFileArr) {
							await this.uploadFileEvent(imgI,'back')
						}
					};
					// 护士资格认证
					this.createMedicalCareAptitudeEvent({
						aptitudeId: this.medicalCareAptitudeMessage['id'],
						aptitudeName: this.medicalCareAptitudeMessage['name'],
						careId: this.userInfo.careId,
						imageFront: this.frontImageOnlineArr[0],
						imageBack: this.backImageOnlineArr[0]
					})
				}
			},
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 完善个人信息事件
			perfectPersonalMessageEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/perfectPersonalMessage/perfectPersonalMessage'
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
					color: #101010 !important;
					text {
						color: #101010 !important;
					}
				}
			}
		};
		.real-name-authentication-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-bottom: 10px;
			box-sizing: border-box;
			height: 0;
			overflow: auto;
			.real-name-authentication-step {
				background: #fff;
				padding: 20px 0;
				box-sizing: border-box;
				.real-name-authentication-step-top {
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					padding: 0 100px;
					box-sizing: border-box;
					.circle-one {
						width: 24px;
						height: 24px;
						border-radius: 50%;
						background: #E8E8E8
					};
					.line-one {
						flex: 1;
						height: 1px;
						background: #B7B6B6;
						margin: 0 6px
					};
					.circle-two {
						width: 24px;
						height: 24px;
						border-radius: 50%;
						background: #E8E8E8
					};
					.stepStyle {
						background: #F96958 !important;
					}
				};
				.real-name-authentication-step-bottom {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 50px;
					box-sizing: border-box;
					>view {
						flex: 1;
						text-align: center;
						font-size: 12px;
						color: #B7B6B6
					};
					.step-right {
						margin-left: 24px;
					};
					.stepTextStyle {
						color: #5064EB !important;
					}
				}
			};
			.step-one {
				padding: 10px;
				box-sizing: border-box;
				flex: 1;
				overflow: auto;
				.real-name-authentication-upload {
					.real-name-authentication-upload-title {
						font-size: 16px;
						color: #101010;
						text-align: center;
						margin-bottom: 10px;
					};
					.real-name-authentication-upload-one {
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 6px 0;
						box-sizing: border-box;
						.upload-before {
							display: flex;
							align-items: center;
							flex-direction: column;
							justify-content: center;
							width: 167px;
							border: 1px dashed #B7B6B6;
							border-radius: 5px;
							padding: 6px 0;
							box-sizing: border-box;
							.upload-image {
								display: flex;
								align-items: center;
								justify-content: center;
								background: rgba(0, 0, 0, 0.12);
								width: 50px;
								height: 50px;
								border-radius: 50%;
								margin-bottom: 6px;
								image {
									width: 24px;
									height: 24px
								}
							};
							.upload-text {
								font-size: 14px;
								color: #B7B6B6
							}
						};
						.upload-after {
							width: 80%;
							height: 100px;
							margin: 0 auto;
							display: inline-block;
							position: relative;
							::v-deep .u-icon__icon {
								position: absolute;
								top: -12px;
								right: 0
							};
							image {
								width: 100%;
								height: 100%
							}
						}
					};
					.real-name-authentication-upload-two {
						margin: 10px 0
					}
				};
				.real-name-authentication-standard {
					padding: 10px 20px;
					box-sizing: border-box;
					margin-top: 20px;
					background: #fff;
					.real-name-authentication-standard-title {
						font-size: 16px;
						color: #101010;
						margin-bottom: 14px
					}
					.real-name-authentication-standard-image {
						display: flex;
						>view {
							flex: 1;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							width: 0;
							>image {
								width: 100%;
								height: 80px;
								margin-bottom: 8px
							};
							>view {
								text-align: center;
								image {
									width: 20px;
									height: 20px;
									margin-right: 4px;
									vertical-align: middle
								};
								text {
									font-size: 12px;
									color: #747474;
									vertical-align: middle
								}
							}
						};
						.real-name-authentication-standard-two {
							margin: 0 20px
						}
					};
					.friendly-reminder {
						margin-top: 20px;
						text-align: center;
						font-size: 12px;
						color: #B7B6B6
					}
				}
			};
			.step-three {
				padding: 10px;
				box-sizing: border-box;
				flex: 1;
				.authentication-success {
					height: 100%;
					background: #fff;
					padding: 40px 0;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					.step-two-content {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						.image-area {
							width: 200px;
							height: 150px;
							display: flex;
							align-items: center;
							justify-content: center;
							image {
								width: 81px;
								height: 81px;
							}
						};
						.step-two-explain-one {
							font-size: 16px;
							color: #646464;
						};
						.step-two-explain-two {
							font-size: 12px;
							color: #ADACAD;
							margin: 20px 0;
						};
						.step-two-explain-three {
							width: 200px;
							height: 100px;
							background: #fff;
							border-radius: 2px;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							>text {
								font-size: 14px;
								color: #101010;
								&:nth-child(1) {
									margin-bottom: 10px;
								}
							}
						}
					};
					.step-two-btn {
						width: 80%;
						height: 40px;
						font-size: 14px;
						color: #fff;
						background: #5064EB;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			};
			.step-btn-box {
				height: 80px;
				display: flex;
				align-items: center;
				justify-content: center;
				.step-btn {
					width: 90%;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 46px;
					background: #5064EB;
					border-radius: 50px;
					font-size: 12px;
					color: #fff
				}
			}	
		}
	}
</style>
