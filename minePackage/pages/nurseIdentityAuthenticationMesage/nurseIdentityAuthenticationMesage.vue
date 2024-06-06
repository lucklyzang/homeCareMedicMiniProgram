<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" fontColor="#FFFFFF" backState='3000' bgColor="none" :title="medicalCareAptitudeMessage.remark" @backClick="backTo">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="identity-authentication-box">
			<view class="identity-authentication-image-front">
				<view class="identity-authentication-image-front-left">
					资格证正面
				</view>
				<view class="identity-authentication-image-front-right">
					<text v-if="medicalCareAptitudeMessage.passed == 'APPLYING'">审核中</text>
					<image :src="careaptitudeMessage.imageFront" mode=""></image>
				</view>
			</view>
			<view class="identity-authentication-image-front">
				<view class="identity-authentication-image-front-left">
					资格证反面
				</view>
				<view class="identity-authentication-image-front-right">
					<text v-if="medicalCareAptitudeMessage.passed == 'APPLYING'">审核中</text>
					<image :src="careaptitudeMessage.imageBack" mode=""></image>
				</view>
			</view>
		</view>
		<view class="back-previous-page-box">
			<text :class="{'textStyle' : medicalCareAptitudeMessage.passed == 'APPLYING' }" @click="againUploadEvent">重新上传资格证</text>
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
	import { getCareaptitudeMessage } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				loginBackgroundPng: require("@/static/img/login-background.png"),
				careaptitudeMessage: {
					imageFront: '',
					imageBack: ''
				},
				medicalCareAptitudeMessage: {}
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
		onLoad(options) {
			this.medicalCareAptitudeMessage = JSON.parse(options.transmitData);
			this.getCareaptitudeMessageEvent()
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 重新上传资格证事件
			againUploadEvent () {
				if (this.medicalCareAptitudeMessage.passed == 'APPLYING') {
					return
				};
				let mynavData = JSON.stringify(this.medicalCareAptitudeMessage);
				if (this.medicalCareAptitudeMessage.remark == '护士资格证') {
					uni.navigateTo({
						url: '/minePackage/pages/nurseQualificationAuthentication/nurseQualificationAuthentication?transmitData='+mynavData
					})
				}	else if (this.medicalCareAptitudeMessage.remark == '护理资格证') {
					uni.navigateTo({
						url: '/minePackage/pages/careQualificationAuthentication/careQualificationAuthentication?transmitData='+mynavData
					})
				} else {
					uni.navigateTo({
						url: '/minePackage/pages/otherQualificationAuthentication/otherQualificationAuthentication?transmitData='+mynavData
					})
				}
			},
			
			// 获取医护资质信息
			getCareaptitudeMessageEvent () {
				this.showLoadingHint = true;
				console.log('护士信息',this.medicalCareAptitudeMessage.id);
				getCareaptitudeMessage(this.medicalCareAptitudeMessage.id).then((res) => {
					if ( res && res.data.code == 0) {
						this.careaptitudeMessage = res.data.data
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
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
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
		.identity-authentication-box {
			flex: 1;
			overflow: auto;
			padding: 0 10px 10px 10px;
			box-sizing: border-box;
			.identity-authentication-image-front {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 10px;
				height: 96px;
				background: #fff;
				border-radius: 8px;
				padding: 0 14px;
				.identity-authentication-image-front-left {
					font-size: 14px;
					color: #101010;
					font-weight: 500;
				};
				.identity-authentication-image-front-right {
					width: 90px;
					height: 60px;
					position: relative;
					image {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
					};
					>text {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
						font-size: 14px;
						color: #fff;
						z-index: 1;
					}
				}
			}
		};
		.back-previous-page-box {
			width: 100%;
			height: 120px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				width: 80%;
				height: 40px;
				line-height: 40px;
				text-align: center;
				background: #5064EB;
				border-radius: 2px;
				font-size: 14px;
				color: #fff;
				box-shadow: 0px 4px 4px 0 rgba(34, 34, 34, 0.25);
			};
			.textStyle {
				background: rgba(80, 100, 235, 0.7) !important;
			}
		}
	}
</style>
