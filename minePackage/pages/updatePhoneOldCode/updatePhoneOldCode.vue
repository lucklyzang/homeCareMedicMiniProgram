<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="更换手机号" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="update-phone-number-content">
			<view class="old-phone-number">
				<text>你当前手机号码为:</text>
				<text>{{ phoneNumberValue  }}</text>
			</view>
			<view class="form-box">
				<view class="verification-code">
					<view class="verification-code-left">
						<text>验证码</text>
					</view>
					<view class="verification-code-center">
						<u--input
							placeholder="请输入验证码"
							type="number"
							border="none"
							v-model="verificationCodeValue"
						></u--input>
					</view>
					<view class="verification-code-right">
						<text class="text-one" v-if="showGetVerificationCode" @click="$noMultipleClicks(getVerificationCodeEvent)">获取验证码</text>
						<text class="text-two" v-if="!showGetVerificationCode">{{count}}s后重新获取</text>
					</view>
				</view>
			</view>
		</view>
		<view class="sure-btn-box">
			<view class="sure-btn" @click="sureEvent">
				<text>下一步</text>
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
	import { sendPhoneCode } from '@/api/login.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '更换中···',
				phoneNumberValue: '',
				noClick: true,
				verificationCodeValue: '',
				isShowcountryCodeBox: false,
				showGetVerificationCode: true,
				count: '',
				countryCodeList: [
					{label: '中国大陆', value: '+86'},
	        {label: '中国香港', value: '+852'},
	        {label: '中国台湾', value: '+886'},
	        {label: '美国', value: '+1'},
	        {label: '日本', value: '+81'}
				],
				selectCountryCode: {label: '中国大陆', value: '+86'},
				selectCountryCodeIndex: 0
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
			this.phoneNumberValue = !this.userBasicInfo || JSON.stringify(this.userBasicInfo) == '{}' ? '' : this.userBasicInfo.mobile
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 手机国际区号区域点击事件
			uFormItemLabelClickEvent () {
				this.isShowcountryCodeBox = !this.isShowcountryCodeBox
			},
			
			// 手机国际区号列点击事件
			countryCodeItemClickEvent (item,index) {
				this.selectCountryCode = item;
				this.selectCountryCodeIndex = index;
				this.isShowcountryCodeBox = !this.isShowcountryCodeBox
			},
			
			// 获取验证码事件
			getVerificationCodeEvent () {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.showGetVerificationCode = false;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.showGetVerificationCode = true;
							clearInterval(this.timer);
							this.timer = null
						}
					}, 1000);
					this.sendCodeEvent()
				}
			},
			
			// 发送验证码事件
			sendCodeEvent () {
				let loginMessage = {
				  mobile: this.phoneNumberValue,
					scene: 2
				};
				this.showLoadingHint = true;
				sendPhoneCode(loginMessage).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data == true) {
							this.$refs.uToast.show({
								message: '验证码已发送至您的手机，请查收',
								type: 'success',
								position: 'center'
							})
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
								position: 'center'
							})
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
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
			
			// 确定事件
			sureEvent () {
				if (!this.verificationCodeValue) {
					this.$refs.uToast.show({
						message: '验证码不能为空!',
						type: 'error',
						position: 'center'
					});
					return
				};
				// 传递通知详情内容
				let mynavData = JSON.stringify({
					oldMobile: this.phoneNumberValue,
					oldCode: this.verificationCodeValue
				});
				uni.navigateTo({
					url: '/minePackage/pages/updatePhoneNumber/updatePhoneNumber?transmitData='+mynavData
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
		background: #F5F5F5;
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
		.update-phone-number-content {
			flex: 1;
			overflow: auto;
			padding: 20px;
			box-sizing: border-box;
			.old-phone-number {
				margin-bottom: 20px;
				>text {
					color: #101010;
					font-size: 16px;
					&:nth-child(1) {
						margin-right: 4px
					}
				}
			};
			.verification-code {
				margin-top: 20px;
				height: 60px;
				padding: 0 10px;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				align-items: center;
				.verification-code-left {
					width: 100px;
					display: flex;
					align-items: center;
					>text {
						color: #101010;
						font-size: 14px;
					}
				};
				.verification-code-center {
					flex: 1
				};
				.verification-code-right {
					.text-one {
						margin-left: 6px;
						color: #101010;
						font-size: 14px;
						width: 82px;
						height: 29px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 5px;
						border: 1px solid #D9D9D9;
					};
					.text-two {
						margin-left: 6px;
						color: red;
						font-size: 12px
					}
				}
			}
		};
		.sure-btn-box {
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			.sure-btn {
				width: 70%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 58px;
				background: #5064EB;
				border-radius: 10px;
				font-size: 16px;
				color: #fff
			}
		}
	}
</style>
