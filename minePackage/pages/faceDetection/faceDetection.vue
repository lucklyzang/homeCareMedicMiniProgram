<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="人脸检测" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="camera-box">
			<view class="camera-bg-box">
				<camera class="camera" device-position="front" flash="off" resolution="low"></camera>
			</view>
			<view v-show="tipsText" class="camera-tip">{{ tipsText }}</view>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '上传中···',
				tipsText: ''
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
			let that = this;
			// 初始化相机引擎
			that.initData()
		},
		methods: {
			...mapMutations([
			]),
			
			// 初始化相机引擎
			initData() {
				let that = this;
				// 1、初始化人脸识别
				wx.initFaceDetect();
				// 2、创建 camera 上下文 CameraContext 对象
				that.cameraEngine = wx.createCameraContext();
				// 3、获取 Camera 实时帧数据
				const listener = that.cameraEngine.onCameraFrame(frame => {
					// 4、人脸识别，使用前需要通过 wx.initFaceDetect 进行一次初始化，推荐使用相机接口返回的帧数据
					wx.faceDetect({
						frameBuffer: frame.data,
						width: frame.width,
						height: frame.height,
						enablePoint: true,
						enableConf: true,
						enableAngle: true,
						enableMultiFace: true,
						success: faceData => {
							let face = faceData.faceInfo[0];
							//人脸位置校验
							var centerWidth = 150;
							var centerHeight = 150;
	 
							if (faceData.x == -1 || faceData.y == -1) {
								that.tipsText = '检测不到人';
							}
	 
							if (faceData.faceInfo.length > 1) {
								that.tipsText = '请保证只有一个人';
							} else {
								const { pitch, roll, yaw } = face.angleArray;
								const standard = 0.3;
	 
								if (Math.abs(pitch) >= standard || Math.abs(roll) >= standard || Math.abs(yaw) >= standard) {
									that.tipsText = '请平视摄像头';
								} else if (
									face.x < (frame.width - centerWidth) / 2 ||
									face.x > (frame.width - centerWidth) / 2 + centerWidth ||
									face.y < (frame.height - centerHeight) / 2 ||
									face.y > (frame.height - centerHeight) / 2 + centerHeight
								) {
									this.tipsText = '请将人脸对准中心位置';
								} else if (
									face.confArray.global <= 0.8 ||
									face.confArray.leftEye <= 0.8 ||
									face.confArray.mouth <= 0.8 ||
									face.confArray.nose <= 0.8 ||
									face.confArray.rightEye <= 0.8
								) {
									that.tipsText = '请勿遮挡五官';
								} else {
									listener.stop();
									that.tipsText = '即将拍照，请保持！';
									setTimeout(function() {
										that.handleTakePhotoClick();
									}, 3000);
									return;
									let time = 3;
									that.tipsText = time + '秒后拍照，请保持！';
									let timer3 = setInterval(function() {
										time--;
										if (time <= 0) {
											clearInterval(timer3);
											// 拍照
											return that.handleTakePhotoClick();
										} else {
											that.tipsText = time + '秒后拍照，请保持！';
										}
									}, 1000);
								}
							}
						},
						fail: err => {
							if (err.x == -1 || err.y == -1) {
								that.tipsText = '检测不到人';
							} else {
								that.tipsText = err.errMsg || '网络错误，请退出页面重试';
							}
						}
					})
				})
				// 5、开始监听帧数据
				listener.start();
			},
			
			// 拍照
			handleTakePhotoClick() {
				this.tipsText = '拍照中...';
				// 检测是否授权相机
				uni.getSetting({
					success: res => {
						if (!res.authSetting['scope.camera']) {
							this.isAuthCamera = false;
							uni.openSetting({
								success: res => {
									if (res.authSetting['scope.camera']) {
										this.isAuthCamera = true;
									}
								}
							})
						}
					}
				});
	 
				this.cameraEngine.takePhoto({
					quality: 'low',
					success: ({ tempImagePath }) => {
						this.tipsText = '';
						// 调用后端人脸识别接口
						this.uploadFileEvent(tempImagePath)
					}
				})
			},
			
			// 上传人脸资料到服务器
			uploadFileEvent (imgI) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				uni.uploadFile({
				 url: 'https://dev.nurse.blinktech.cn/nurse/app-api/hospital/medical-care/face-auth',
				 filePath: imgI,
				 name: 'file',
				 header: {
					'content-type': 'multipart/form-data',
					'Authorization': `Bearer ${store.getters.token}`
				 },
				 success: (res) => {
					this.showLoadingHint = false;
					if (res.statusCode == 200) {
						let temporaryData = JSON.parse(res.data);
						if ( res && temporaryData.code == 0) {
							if ( res && temporaryData.data.passed == true) {
								let pages = getCurrentPages(); // 当前页页⾯实例
								let nowPage = pages[pages.length -1]; //当前页⾯实例
								let prevPage = pages[pages.length -2]; // 上一页面实例
								prevPage.$vm.prevDateFun(); // 调用上一页 定义的方法
								uni.navigateBack()
							} else {
								this.initData();
								this.$refs.uToast.show({
									message: `${temporaryData.data.message}`,
									type: 'error',
									position: 'center'
								})
							}
						}	else {
							this.initData();
							this.$refs.uToast.show({
								message: `${temporaryData.msg}`,
								type: 'error',
								position: 'center'
							})
						}
					} else {
						this.initData();
						this.$refs.uToast.show({
							message: '上传失败',
							type: 'error',
							position: 'center'
						})
					}
				 },
				 fail: (err) => {
					this.initData();
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'error',
						position: 'center'
					})
				 }
				})
			},
			
			// 上传人脸资料
			// medicalCareFaceAuthEvent (data) {
			// 	this.showLoadingHint = true;
			// 	medicalCareFaceAuth(data).then((res) => {
			// 		if ( res && res.data.data.passed == true) {
			// 			let pages = getCurrentPages(); // 当前页页⾯实例
			// 			let nowPage = pages[pages.length -1]; //当前页⾯实例
			// 			let prevPage = pages[pages.length -2]; // 上一页面实例
			// 			prevPage.$vm.prevDateFun(); // 调用上一页 定义的方法
			// 			uni.navigateBack()
			// 		} else {
			// 			this.$refs.uToast.show({
			// 				message: '人脸认证未通过',
			// 				type: 'error',
			// 				position: 'center'
			// 			})
			// 		};
			// 		this.showLoadingHint = false
			// 	})
			// 	.catch((err) => {
			// 		this.showLoadingHint = false;
			// 		this.$refs.uToast.show({
			// 			message: err,
			// 			type: 'error',
			// 			position: 'center'
			// 		})
			// 	})
			// },
			
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
			background: #fff;
			width: 100%;
			height: 100px;
			z-index: 1000000;
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
		.camera-box {
			position: relative;
			width: 100%;
			height: 100%;
			.camera-bg-box {
				position: relative;
				width: 100%;
				height: 100%;
				overflow: hidden;
				&::after {
					content: '';
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translateX(-50%) translateY(-50%);
					border-radius: 100%;
					width: 650rpx;
					height: 650rpx;
					// border: 1000rpx solid white;
					border: 1000rpx solid rgba(0, 0, 0, 0.5);
				};
				.camera {
					width: 100%;
					height: 100%;
					border-top: 200rpx solid  black;
					border-bottom: 200rpx solid  black;
					box-sizing: border-box;
				}
			};
			.camera-tip {
				position: absolute;
				bottom: 220rpx;
				left: 50%;
				transform: translateX(-50%);
				color: white;
			}
		}
	}
</style>
