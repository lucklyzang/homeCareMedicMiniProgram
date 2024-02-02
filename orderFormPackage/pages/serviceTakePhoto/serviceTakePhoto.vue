<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="拍照" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="photo-area" v-if="!takePhotoComplete">
			<camera :device-position="devicePosition" :flash="flashStatus" @error="error" style="width: 100%; height: 65vh;"></camera>
			<view class="operation-area">
				<view class="left-flash" @click="flashEvent">
					<image src="@/static/img/flash-icon.png" ></image>
				</view>
				<view class="thak-photo"  @click="takePhoto">
					<image src="@/static/img/take-photo-icon.png" ></image>
				</view>
				<view class="reversal-lens" @click="reversalLensEvent">
					<image src="@/static/img/reversal-lens-icon.png" ></image>
				</view>
			</view>
		</view>
		<view class="image-area" v-if="takePhotoComplete">
			<view class="image-box">
				<image mode="widthFix" :src="src"></image>
			</view>
			<view class="operation-area">
				<view class="cancel-btn" @click="cancelEvent">
					<text>取消</text>
				</view>
				<view class="upload-btn" @click="uploadEvent">
					<text>上传</text>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
	import navBar from "@/components/zhouWei-navBar"
	import { startServer, completeServer } from '@/api/orderForm.js'
	import store from '@/store'
	export default {
		components: {
			navBar
		},
		
		data() {
			return {
				src:"",
				infoText: '',
				showLoadingHint: false,
				flashStatus: 'off',
				devicePosition: 'back',
				takePhotoComplete: false,
				currentSelectOrderMessage: {},
				onlineArr: []
			}
		},
		
		onLoad (options) {
			this.currentSelectOrderMessage = JSON.parse(options.transmitData);
			console.log('信息',this.currentSelectOrderMessage);
		},
		
		methods: {
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 照片上传取消事件
			cancelEvent () {
				this.src = '';
				this.onlineArr = [];
				this.takePhotoComplete = false;
			},
			
			// 照片上传确认事件
			uploadEvent () {
				if (this.currentSelectOrderMessage['typeText'] == 'start') {
					this.startSureEvent()
				} else if (this.currentSelectOrderMessage['typeText'] == 'end') {
					this.completeSureEvent()
				}
			},
			
			// 闪光灯切换事件
			flashEvent () {
				if (this.flashStatus == 'off') {
					this.flashStatus = 'on'
				} else if (this.flashStatus == 'on') {
					this.flashStatus = 'off'
				}
			},
			
			// 拍照事件
			takePhoto() {
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'normal',
					success: (res) => {
						console.log('图片',res);
						this.src = res.tempImagePath;
						this.takePhotoComplete = true;
					},
					error(e) {
						console.log(e.detail)
					}
				})
			},
			
			//镜头反转事件
			reversalLensEvent () {
				if (this.devicePosition == 'back') {
					this.devicePosition = 'front'
				} else if (this.devicePosition == 'front') {
					this.devicePosition = 'back'
				}
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				this.onlineArr = [];
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
							this.onlineArr.push(temporaryData.data);
							resolve()
						} else {
							this.onlineArr = [];
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
						this.onlineArr = [];
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
			
			// 开始服务确定事件
			async startSureEvent () {
				if (!this.src) {
					this.$refs.uToast.show({
						message: '拍照图片不能为空',
						type: 'error',
						position: 'center'
					});
					return
				};
				// 上传图片文件流到服务端
				await this.uploadFileEvent(this.src);
				this.infoText = '开始服务中···';
				this.showLoadingHint = true;
				startServer({
					id: this.currentSelectOrderMessage.id,
					file: this.onlineArr[0]
				}).then((res) => {
					if ( res && res.data.code == 0) {
						let pages = getCurrentPages(); // 当前页页⾯实例
						let nowPage = pages[pages.length - 1]; //当前页⾯实例
						let prevPage = pages[pages.length - 2]; // 上一页面实例
						prevPage.$vm.prevDateFun(this.currentSelectOrderMessage.id);
						this.backTo()
					} else {
						this.onlineArr = [];
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.onlineArr = [];
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 完成服务确定事件
			async completeSureEvent () {
				if (!this.src) {
					this.$refs.uToast.show({
						message: '拍照图片不能为空',
						type: 'error',
						position: 'center'
					});
					return
				};
				// 上传图片文件流到服务端
				await this.uploadFileEvent(this.src);
				this.infoText = '完成服务中···';
				this.showLoadingHint = true;
				completeServer({
					id: this.currentSelectOrderMessage.id,
					file: this.onlineArr[0]
				}).then((res) => {
					if ( res && res.data.code == 0) {
						let pages = getCurrentPages(); // 当前页页⾯实例
						let nowPage = pages[pages.length - 1]; //当前页⾯实例
						let prevPage = pages[pages.length - 2]; // 上一页面实例
						prevPage.$vm.prevDateFun(this.currentSelectOrderMessage.id);
						this.backTo()
					} else {
						this.onlineArr = [];
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.onlineArr = [];
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
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
		position: relative;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 200000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
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
		};
		.photo-area {
			flex: 1;
			.operation-area {
				height: 120px;
				display: flex;
				align-items: center;
				justify-content: center;
				.left-flash {
					width: 24px;
					height: 24px;
					image {
						width: 24px;
						height: 24px;
					}
				};
				.thak-photo {
					width: 72px;
					height: 72px;
					margin: 0 60px;
					image {
						width: 72px;
						height: 72px;
					}
				};
				.reversal-lens {
					width: 24px;
					height: 24px;
					image {
						width: 24px;
						height: 24px;
					}
				}
			}
		};
		.image-area {
			flex: 1;
			.image-box {
				width: 100%;
				height: 65vh;
				>image {
					width: 100%;
					height: 100%;
				}
			};
			.operation-area {
				height: 80px;
				display: flex;
				align-items: center;
				justify-content: center;
				.cancel-btn {
					width: 106px;
					height: 40px;
					border: 1px solid #BBBBBB;
					border-radius: 4px;
					color: #101010;
					font-size: 14px;
					display: flex;
					align-items: center;
					justify-content: center;
				};
				.upload-btn {
					width: 106px;
					height: 40px;
					background: #5064EB;
					border-radius: 4px;
					color: #fff;
					font-size: 14px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 40px;
				}
			}
		}
	}
</style>