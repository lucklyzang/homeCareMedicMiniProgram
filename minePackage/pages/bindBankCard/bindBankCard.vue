<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="绑定银行卡" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="bind-bank-card-box">
			<view class="form-area">
				<u--form
					labelPosition="left"
					:model="modelBankCard"
					ref="uForm">
						<u-form-item
							label="持卡人姓名"
							labelWidth="120px"
							borderBottom
						>
							<u--input
								v-model="modelBankCard.formInfo.cardName"
								placeholder="请输入持卡人姓名"
								border="none"
							></u--input>
						</u-form-item>
						<u-form-item
							label="卡号"
							labelWidth="120px"
							borderBottom
						>
							<u--input
								type="number"
								v-model="modelBankCard.formInfo.cardNum"
								placeholder="请输入卡号"
								border="none"
							></u--input>
						</u-form-item>
						<u-form-item
							label="归属银行"
							labelWidth="120px"
							borderBottom
							@click="showAffiliationBankDialog = true"
						>
							<u--input
								v-model="modelBankCard.formInfo.affiliationBank"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择归属银行"
								border="none"
							></u--input>
							<u-icon
								slot="right"
								name="arrow-right"
							></u-icon>
						</u-form-item>
						<u-form-item
							label="身份证号码"
							labelWidth="120px"
							borderBottom
						>
							<u--input
								type="idcard"
								v-model="modelBankCard.formInfo.idCardNum"
								placeholder="请输入身份证号码"
								border="none"
							></u--input>
						</u-form-item>
						<u-form-item
							label="预留手机号"
							labelWidth="120px"
							borderBottom
						>
							<u--input
								type="number"
								v-model="modelBankCard.formInfo.mobile"
								placeholder="请输入手机号码"
								border="none"
							></u--input>
						</u-form-item>
						<u-form-item
							label="验证码"
							labelWidth="120px"
							borderBottom
						>
							<u--input
								v-model="modelBankCard.formInfo.phoneCode"
								placeholder="请输入验证码"
								border="none"
								type="number"
							></u--input>
							<template slot="right">
								<text v-if="showGetVerificationCode" @click="$noMultipleClicks(getVerificationCodeEvent)">获取验证码</text>
								<text v-if="!showGetVerificationCode" class="count">{{count}}s后重新获取</text>
							</template>
						</u-form-item>
					</u--form>
					<u-action-sheet
						:show="showAffiliationBankDialog"
						:actions="actions"
						title="请选择归属银行"
						@close="showAffiliationBankDialog = false"
						@select="affiliationBankSelect"
					>
					</u-action-sheet>
			</view>
			<view class="form-btn-info-text">
				<u-checkbox-group v-model="isReadAgreeChecked">
					<u-checkbox
						v-for="(item, index) in checkboxList"
						:key="index"
						:label="item.name"
						:name="item.name"
						active-color="#1890FF">
					</u-checkbox>
				</u-checkbox-group>
				<text>《服务协议》</text>
			</view>
			<view class="sure-btn" @click="bindSureEvent">
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
	import { createCareBankCard } from '@/api/user.js'
	import { sendPhoneCode } from '@/api/login.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '绑定中···',
				showAffiliationBankDialog: false,
				noClick: true,
				isClickGetCode: false,
				showGetVerificationCode: true,
				timer: null,
				count: '',
				isReadAgreeChecked: [],
				checkboxList: [
					{
						name: '阅读并同意',
						disabled: false
					}
				],
				modelBankCard: {
					formInfo: {
						cardName: '',
						cardNum: '',
						idCardNum: '',
						mobile: '',
						phoneCode: '',
						affiliationBank: ''
					}
				},
				actions: [
					{
						name: '中国建设银行',
					},
					{
						name: '中国交通银行',
					},
					{
						name: '中国农业银行'
					}
				]
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
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			affiliationBankSelect(e) {
				this.modelBankCard.formInfo.affiliationBank = e.name
			},
			
			// 获取验证码事件
			getVerificationCodeEvent () {
				if (!this.modelBankCard.formInfo.mobile) {
					this.$refs.uToast.show({
						message: '请输入手机号码!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.modelBankCard.formInfo.mobile)) {
					this.$refs.uToast.show({
						message: '手机号格式有误,请重新输入!',
						type: 'error',
						position: 'bottom'
					});
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
					}, 1000);
					this.isClickGetCode = true;
					this.sendCodeEvent()
				}
			},
			
			// 发送验证码事件
			sendCodeEvent () {
				if (!this.modelBankCard.formInfo.mobile) {
					this.$refs.uToast.show({
						message: '请输入手机号',
						type: 'erroe',
						position: 'bottom'
					});
					return
				};
				let loginMessage = {
				  mobile: this.modelBankCard.formInfo.mobile,
					scene: 2
				};
				this.showLoadingHint = true;
				sendPhoneCode(loginMessage).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data == true) {
							this.$refs.uToast.show({
								message: '发送成功!',
								type: 'success',
								position: 'bottom'
							})
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
								position: 'bottom'
							})
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
						message: `${err}`,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 绑定银行卡接口
			createCareBankCardEvent (data) {
				this.infoText = '绑定中···';
				this.showLoadingHint = true;
				createCareBankCard(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data == 0) {
							this.$refs.uToast.show({
								message: '绑定成功',
								type: 'success',
								position: 'center'
							});
							uni.navigateBack()
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
			
			// 绑定事件
			bindSureEvent () {
				if (!this.modelBankCard.formInfo.cardName) {
					this.$refs.uToast.show({
						message: '请输入持卡人姓名',
						type: 'erroe',
						position: 'center'
					});
					return
				};
				if (!this.modelBankCard.formInfo.cardNum) {
					this.$refs.uToast.show({
						message: '请输入银行卡号',
						type: 'erroe',
						position: 'center'
					});
					return
				};
				if (!this.modelBankCard.formInfo.affiliationBank) {
					this.$refs.uToast.show({
						message: '请选择归属银行',
						type: 'erroe',
						position: 'center'
					});
					return
				};
				if (!this.modelBankCard.formInfo.idCardNum) {
					this.$refs.uToast.show({
						message: '请输入身份证号码',
						type: 'erroe',
						position: 'bottom'
					});
					return
				};
				if (!this.modelBankCard.formInfo.mobile) {
					this.$refs.uToast.show({
						message: '请输入预留手机号',
						type: 'erroe',
						position: 'bottom'
					});
					return
				};
				let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!regIdCard.test(this.modelBankCard.formInfo.idCardNum)) {
					if (this.modelBankCard.formInfo.idCardNum) {
						this.$refs.uToast.show({
							message: '身份证格式格式有误,请重新输入!',
							type: 'error',
							position: 'center'
						});
						return
					}  
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.modelBankCard.formInfo.mobile)) {
					this.$refs.uToast.show({
						message: '手机号格式有误,请重新输入!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				if (this.isReadAgreeChecked.length == 0) {
					this.$refs.uToast.show({
						message: '请勾选阅读并同意《服务协议》!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				// 绑定银行卡
				this.createCareBankCardEvent({
					careId: this.userInfo.careId,
					name: this.modelBankCard.formInfo.cardName,
					cardNo: this.modelBankCard.formInfo.cardNum,
					bank: this.modelBankCard.formInfo.affiliationBank,
					idCard: this.modelBankCard.formInfo.idCardNum,
					mobile: this.modelBankCard.formInfo.mobile,
					defaultStatus: true
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
		.bind-bank-card-box {
			flex: 1;
			overflow: auto;
			.form-area {
				padding: 20px;
				box-sizing: border-box;
				::v-deep .u-form {
					.u-form-item {
						.u-form-item--right__content__icon {
							font-size: 14px;
							color: #289E8E
						};
						.item__body__right__content__icon {
							font-size: 14px;
							color: #289E8E
						}
					};
					.u-form-item {
						.item__body__right__content__icon {
							font-size: 14px;
							color: #289E8E
						}
					}
				}	
			};
			.form-btn-info-text {
				padding: 0 20px;
				box-sizing: border-box;
				align-items: center;
				align-items: center;
				display: flex;
				::v-deep .u-checkbox-group {
					.u-checkbox {
						.u-checkbox__icon-wrap {
							width: 16px !important;
							height: 15px !important
						}
					}
				};
				>text {
					color: #1890FF;
					font-size: 14px;
					margin-top: -1px;
				}
			};
			.sure-btn {
				width: 70%;
				height: 50px;
				margin: 0 auto;
				margin-top: 40px;
				background: #5064EB;
				border-radius: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 16px;
			}
		}
	}
</style>
