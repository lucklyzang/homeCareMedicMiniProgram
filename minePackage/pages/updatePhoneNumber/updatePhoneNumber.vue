<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="更换手机号" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="update-phone-number-content">
			<view class="old-phone-number">
				<text>你当前手机号码为:</text>
				<text>15669106064</text>
			</view>
			<view class="form-box">
				<view class="phone-number">
					<view class="phone-number-left" @click.native="uFormItemLabelClickEvent">
						<text>{{ selectCountryCode.label }}</text>
						<u-icon name="arrow-up" size="16" color="#C6C9CC" v-if="isShowcountryCodeBox"></u-icon>
						<u-icon name="arrow-down" size="16" color="#C6C9CC" v-if="!isShowcountryCodeBox"></u-icon>
						<view class="country-code-box" v-if="isShowcountryCodeBox">
							<view class="country-code-list" :class="{'countryCodeListStyle':selectCountryCodeIndex === index}" @click.stop="countryCodeItemClickEvent(item,index)" v-for="(item,index) in countryCodeList" :key="index">
								<text>{{ item.label }}</text>
							</view>
						</view>
					</view>
					<view class="phone-number-right">
						<u--input
							placeholder="请输入手机号码"
							border="none"
							v-model="phoneNumberValue"
						></u--input>
					</view>
				</view>
				<view class="verification-code">
					<view class="verification-code-left">
						<text>验证码</text>
					</view>
					<view class="verification-code-center">
						<u--input
							placeholder="请输入验证码"
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
		<view class="update-success" v-if="false">
			<image src="@/static/img/uodate-phone-success.png"></image>
			<text>更换成功!</text>
		</view>
		<view class="sure-btn-box">
			<view class="sure-btn">
				<text>确定</text>
			</view>
		</view>
		<view class="back-btn-box" v-if="false">
			<view class="back-btn">
				<text>返回</text>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
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
				if (!this.phoneNumberValue) {
					this.$refs.uToast.show({
						message: '请输入手机号码!',
						type: 'warning',
						position: 'bottom'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.phoneNumberValue)) {
					this.$refs.uToast.show({
						message: '手机号格式有误,请重新输入!',
						type: 'error',
						position: 'bottom'
					})
					return
				};
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
					}, 1000)
				}
			},
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
			.phone-number {
				height: 60px;
				padding: 0 10px;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				align-items: center;
				position: relative;
				.phone-number-left {
					width: 100px;
					display: flex;
					align-items: center;
					>text {
						color: #101010;
						font-size: 14px;
						margin-right: 4px;
						vertical-align: middle;
					};
					::v-deep .u-icon {
						margin-top: 4px;
					};
					.country-code-box {
						position: absolute;
						top: 62px;
						left: 0;
						width: 150px;
						border-radius: 4px;
						border: 1px solid #dcdfe6;
						overflow: auto;
						max-height: 170px;
						background-color: #fff;
						box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
						padding: 5px 0;
						z-index: 100;
						.country-code-list {
							height: 30px;
							display: flex;
							align-items: center;
							font-size: 14px;
							padding-left: 6px;
							box-sizing: border-box;
							color: #101010
						};
						.countryCodeListStyle {
							background: #f5f7fa !important;
							color: #11D183 !important
						}
					}
				};
				.phone-number-right {}
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
		.update-success {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			image {
				width: 66px;
				height: 66px;
			};
			>text {
				margin-top: 30px;
				font-size: 16px;
				color: #101010
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
		};
		.back-btn-box {
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			.back-btn {
				width: 70%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 50px;
				background: #5064EB;
				border-radius: 8px;
				font-size: 18px;
				color: #fff
			}
		}
	}
</style>
