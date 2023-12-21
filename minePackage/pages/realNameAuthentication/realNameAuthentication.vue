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
				<nav-bar :home="false" backState='3000' bgColor="none" title="实名认证" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="real-name-authentication-box">
			<view class="real-name-authentication-step">
				<view class="real-name-authentication-step-top">
					<view class="circle-one" :class="{'stepStyle' : stepActive === 0 || stepActive === 1 || stepActive === 2 }"></view>
					<view class="line-one" :class="{'stepStyle' : stepActive === 0 || stepActive === 1 || stepActive === 2 }"></view>
					<view class="circle-two" :class="{'stepStyle' : stepActive === 1 || stepActive === 2 }"></view>
					<view class="line-two" :class="{'stepStyle' : stepActive === 1 || stepActive === 2 }"></view>
					<view class="circle-three" :class="{'stepStyle' : stepActive === 2 }"></view>
				</view>
				<view class="real-name-authentication-step-bottom">
					<view class="step-left" :class="{'stepStyle' : stepActive === 0 || stepActive === 1 || stepActive === 2 }">完成实名认证</view>
					<view class="step-center" :class="{'stepStyle' : stepActive === 1 || stepActive === 2 }">完成影像认证</view>
					<view class="step-right" :class="{'stepStyle' : stepActive === 2 }">完成</view>
				</view>
			</view>
			<view class="step-one" v-if="stepActive === 0 ">
				<view class="real-name-authentication-upload">
					<view class="real-name-authentication-upload-title">
						<text>上传身份证照片</text>
					</view>
					<view class="real-name-authentication-upload-one">
						<view class="upload-before" v-if="frontImageBase64Arr.length == 0" @click="getImg('front')">
							<view class="upload-image">
								<image src="@/static/img/camera-white-icon.png"></image>
							</view>
							<view class="upload-text">
								<text>上传身份证正面</text>
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
								<text>上传身份证反面</text>
							</view>
						</view>
						<view class="upload-after" v-else v-for="(item, index) in backImageBase64Arr" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'back')"></u-icon>
						</view>
					</view>
					<view class="real-name-authentication-upload-one real-name-authentication-upload-three">
						<view class="upload-before" v-if="handImageBase64Arr.length == 0" @click="getImg('hand')">
							<view class="upload-image">
								<image src="@/static/img/camera-white-icon.png"></image>
							</view>
							<view class="upload-text">
								<text>上传手持身份证</text>
							</view>
						</view>
						<view class="upload-after" v-else v-for="(item, index) in handImageBase64Arr" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'hand')"></u-icon>
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
			<view class="step-two" v-if="stepActive === 1">
				<view class="image-authentication">
					<view class="step-two-content">
						<view class="image-area">
							<view class="bk-black">
								<view class="bk-white">
									<image src="@/static/img/image-authentication-person-icon.png"></image>
								</view>
							</view>
						</view>
						<view class="step-two-explain-one">
							<text>只有实名认证用户才能接单</text>
						</view>
						<view class="step-two-explain-two">
							<text>本过程需要您本人亲自完成，仅需要1分钟</text>
						</view>
						<view class="step-two-explain-three">
							<text>您提交的资料将仅用于实名认证审核</text>
						</view>
					</view>
					<view class="step-two-btn">
						<text>立即认证</text>
					</view>
				</view>	
			</view>
			<view class="step-three" v-if="stepActive === 2">
				<view class="authentication-success">
					<view class="step-two-content">
						<view class="image-area">
							<image src="@/static/img/real-name-authentication-success.png"></image>
						</view>
						<view class="step-two-explain-one">
							<text>恭喜你，个人实名认证成功</text>
						</view>
						<view class="step-two-explain-two">
							<text>你提交的认证资料已通过审核</text>
						</view>
						<view class="step-two-explain-three">
							<text>杨大坤</text>
							<text>身份证：3**********0</text>
						</view>
					</view>
					<view class="step-two-btn" @click="backTo">
						<text>返回认证页</text>
					</view>
				</view>	
			</view>
			<view class="step-btn-box" v-if="stepActive != 2">
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
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { medicalCareRealName } from '@/api/user.js'
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
				frontImageFileArr: [],
				backImageFileArr: [],
				handImageFileArr: [],
				frontImageBase64Arr: [],
				backImageBase64Arr: [],
				handImageBase64Arr: [],
				text: '',
				content: '',
				sureCancelShow: false,
				imgIndex: null
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
		onShow() {
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
				} else if (this.text == 'hand') {
					this.handImageFileArr.splice(this.imgIndex, 1);
					this.handImageBase64Arr.splice(this.imgIndex, 1)
				};
				this.sureCancelShow = false
			},
			
			// 上传图片方法
			getImg(text) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							if (text == 'front') {
								that.frontImageFileArr.push(res.tempFiles[imgI]['path']);
							} else if (text == 'back') {
								that.backImageFileArr.push(res.tempFiles[imgI]['path']);
							} else if (text == 'hand') {
								that.handImageFileArr.push(res.tempFiles[imgI]['path']);
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
									} else if (text == 'hand') {
										that.handImageBase64Arr.push(base64);
									}
								}
							})
						}
					}
				})
			},
			
			// 实名认证事件
			medicalCareRealNameEvent (data) {
				this.infoText = '实名认证中···';
				this.showLoadingHint = true;
				medicalCareRealName(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.stepActive = 1
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
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 下一步事件
			stepEvent () {
				if (this.stepActive === 0) {
					if (this.frontImageFileArr.length == 0) {
						this.$refs.uToast.show({
							message: '请上传身份证正面图片',
							type: 'error',
							position: 'center'
						});
						return
					};
					if (this.backImageFileArr.length == 0) {
						this.$refs.uToast.show({
							message: '请上传身份证反面图片',
							type: 'error',
							position: 'center'
						});
						return
					};
					if (this.handImageFileArr.length == 0) {
						this.$refs.uToast.show({
							message: '请上传手持身份证图片',
							type: 'error',
							position: 'center'
						});
						return
					};
					// 实名认证
					this.medicalCareRealNameEvent({
						id: this.userInfo.careId,
						front: this.frontImageFileArr[0],
						back: this.backImageFileArr[0],
						hand: this.handImageFileArr[0]
					})
				} else if (this.stepActive === 1) {
					
				}
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
					padding: 0 50px;
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
					.line-two {
						flex: 1;
						height: 1px;
						background: #B7B6B6;
						margin: 0 6px
					};
					.circle-three {
						width: 24px;
						height: 24px;
						border-radius: 50%;
						background: #E8E8E8
					};
					.stepStyle {
						background: #5064EB !important;
					}
				};
				.real-name-authentication-step-bottom {
					display: flex;
					align-items: center;
					justify-content: center;
					>view {
						flex: 1;
						text-align: center;
						font-size: 12px;
						color: #B7B6B6
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
			.step-two {
				padding: 10px;
				box-sizing: border-box;
				flex: 1;
				.image-authentication {
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
							width: 130px;
							height: 160px;
							border: 1px solid #BBBBBB;
							display: flex;
							align-items: center;
							justify-content: center;
							.bk-black {
								width: 100px;
								height: 130px;
								background: #BBBBBB;
								display: flex;
								align-items: center;
								justify-content: center;
								.bk-white {
									width: 75px;
									height: 95px;
									background: #fff;
									display: flex;
									align-items: center;
									justify-content: center;
									image {
										width: 50px;
										height: 75px;
									}
								}
							}
						};
						.step-two-explain-one {
							font-size: 12px;
							color: #101010;
							margin-top: 20px;
						};
						.step-two-explain-two {
							font-size: 12px;
							color: #101010;
							margin: 20px 0;
						};
						.step-two-explain-three {
							font-size: 12px;
							color: #BBBBBB;
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
							height: 70px;
							background: #F2F2F2;
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
