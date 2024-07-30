<template>
	<view class="container">
		<!-- 隐私政策概要内容弹框 -->
		<view class="privacy-policy-box">
			<u-popup :show="privacyPolicyBoxShow" mode="bottom" border-radius="30" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
					<view class="privacy-policy-title">
						<text>
							护享家隐私政策概要
						</text>
					</view>
					<view class="privacy-policy-content">
						<text>
							欢迎您使用护享家小程序。您可以使用本小程序以实现智能设备的控制、共享功能。我们将严格遵守相关法律法规和隐私政策以保护您的个人信息。为提供基本服务,需要联网以及调用您的如下权限或功能,以搜集必要的个人信息:
						</text>
					</view>
					<view class="privilege-box">
						<text>
							必要权限(用于本小程序的基本服务和功能)
						</text>
					</view>
					<view class="account-box">
						<text>
							账号信息(必选)用于本小程序内使用米家账号快速登陆的功能
						</text>
					</view>
					<view class="info-title">
						<text>
							请阅读并同意
						</text>
						<text>用户协议</text>
						<text>与</text>
						<text>
							隐私政策
						</text>
					</view>
					<view class="btn-box">
						<button @click="quitEvent">退出</button>
						<button @click="agreeContinueEvent">同意并继续</button>
					</view>
			</u-popup>
		</view>
		<!-- 微信授权弹框 -->
		<view class="weixin-authorization-info-box">
			<u-popup v-model="weixinAuthorizationInfoBoxShow" mode="bottom" :safe-area-inset-bottom="true" height="414px">
				<view class="weixin-top-area">
					<view class="weixin-top-area-left">
						<image :src="logoSmallIcon"></image>
						<text>护享家</text>
					</view>
					<view class="weixin-top-area-right">
						<u-icon name="info-circle" size="24" color="#dbdbdb"></u-icon>
					</view>
				</view>
				<view class="account-info-area">
					<text>申请获取并验证你的手机号</text>
					<text>登录并关联守护家账号</text>
				</view>
				<view class="phone-number-area">
					<text>15669106075</text>
					<text>微信绑定号码</text>
				</view>
				<view class="not-allow-area">
					<text>不允许</text>
				</view>
				<view class="other-phone-number-area">
					<text>使用其他号码</text>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modalShow" :title="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<view class="container-content">
			<view class="top-area-box">
				<image :src="loginBackgroundPng"></image>
				<view class="title">
					<view>
						<u-icon name="arrow-left" color="#fff" size="24" @click="backTo" v-if="isForgetPassword || isSetPassword"></u-icon>
						<text>
							{{ isForgetPassword ? '忘记密码' : isSetPassword ? '设置密码' : isPasswordLogin ? '密 码 登 录' : '验 证 码 登 录 / 注 册' }}
						</text>
					</view>
					<view>
						<image src="@/static/img/app-logo.png"></image>
					</view>
					<view>
						<text>护&nbsp;&nbsp;享&nbsp;&nbsp;家</text>
					</view>
				</view>
			</view>
			<view class="skip-box" v-if="isSetPassword">
				<text @click="skipEvent">跳过</text>
			</view>
			<view class="form-box">
				<u-form :model="form" ref="uForm">
					<u-form-item  v-if="!isSetPassword" borderBottom label="+86" :label-style="{'font-size':'12px','color': '#B5B5B5'}">
						<u-input @blur="blurEvent" border="none" v-model="form.username" placeholder="请输入手机号" type="number" />
					</u-form-item>
					<u-form-item borderBottom v-if="(isPasswordLogin && !isForgetPassword) || isSetPassword">
						<u-input v-model="form.password" border="none" placeholder="请输入密码" type="password"/>
					</u-form-item>
					<u-form-item borderBottom v-if="(!isPasswordLogin || isForgetPassword) && !isSetPassword">
						<u-input v-model="form.verificationCode" border="none" placeholder="请输入验证码" type="number"/>
						<template slot="right">
							<text v-if="showGetVerificationCode" @click="$noMultipleClicks(getVerificationCodeEvent)">获取验证码</text>
							<text v-if="!showGetVerificationCode" class="count">{{count}}s后重新获取</text>
						</template>
					</u-form-item>
					<u-form-item v-if="isForgetPassword" borderBottom>
						<u-input v-model="form.newPassword" border="none" placeholder="请输入新密码" type="password"/>
					</u-form-item>
					<u-form-item v-if="isForgetPassword" borderBottom> 
						<u-input v-model="form.againPassword" border="none" placeholder="再次输入新密码" type="password"/>
					</u-form-item>
				</u-form>
				<view class="form-bottom-info-text" v-if="!isForgetPassword && !isSetPassword">
					<text class="info-left" @click="loginMethodEvent">{{ isPasswordLogin ? '验证码登录/注册' : '密码登录' }}</text>
					<text v-if="isPasswordLogin" class="info-right" @click="forgetPasswordEvent">忘记密码</text>
				</view>
			</view>
			<view class="form-btn" v-if="!isForgetPassword && !isSetPassword">
				<button :class="{'uniButtonStyle' : showLoadingHint}" @click="$noMultipleClicks(sure)">{{  showLoadingHint && !isClickGetCode ? isPasswordLogin ? '登录中···' : '登 录/注 册中···' : isPasswordLogin ? '登 录' : '登 录/注 册' }}</button>
				<view class="form-btn-info-text">
					<u-checkbox-group v-model="isReadAgreeChecked">
						<u-checkbox 
							shape="circle" 
							v-for="(item, index) in checkboxList"
							:key="index"
							:label="item.name"
							:name="item.name"
							active-color="#289E8E">
						</u-checkbox>
					</u-checkbox-group>
					<text>《协议链接》</text>
				</view>
			</view>
			<view class="enter-home-btn" v-if="isForgetPassword || isSetPassword">
				<button :class="{'uniButtonStyle' : showLoadingHint}" @click="$noMultipleClicks(resetPasswordEvent)">{{ showLoadingHint && !isClickGetCode ? isForgetPassword ? '密码重置中···' : '密码设置中···' : isForgetPassword ? '确认' : '进入首页' }}</button>
			</view>
      <view class="weixin-login" v-if="!isForgetPassword && !isSetPassword">
        <u-divider border-color="#DBDBDB" color="#919191" text="其他登录方式"></u-divider>
        <view class="image-wrapper" @click="weixinLoginEvent">
					<button  width="100%" open-type="getPhoneNumber" @getphonenumber="bindPhone">
						<image src="/static/img/weixin.png">
					</button>
        </view>
      </view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import {logIn, getUserDictData, logInByCode, weixinMiniAppLogin, sendPhoneCode, resetPassword, setPassword } from '@/api/login.js'
	import { setCache, getCache, removeCache, removeAllLocalStorage } from '@/common/js/utils'
	import store from '@/store'
	export default {
	components: {
	 },
		data() {
			return {
				loginBackgroundPng: require("@/static/img/login-background.png"),
				logoSmallIcon: require("@/static/img/logo-small-icon.png"),
				noClick: true,
				userCode: '',
				checkboxList: [
					{
						name: '阅读并同意协议',
						disabled: false
					}
				],
				form: {
					username: '',
					password: '',
					verificationCode: '',
					newPassword: '',
					againPassword: ''
				},
				familyMemberList: [],
				initValue: '',
				fullFamilyMemberList: [],
				showGetVerificationCode: true,
				isSetPassword: false,
				isPasswordLogin: false,
				isForgetPassword: false,
				count: '',
				privacyPolicyBoxShow: false,
				weixinAuthorizationInfoBoxShow: false,
				timer: null,
				isReadAgreeChecked: ['阅读并同意协议'],
				showLoadingHint: false,
				modalShow: false,
				isClickGetCode: false,
				modalContent: ''
			}
		},
		
		onShow () {
			// 清空store和localStorage
			removeAllLocalStorage();
			store.dispatch('resetServiceState');
			store.dispatch('resetLoginState');
		},
		
		onHide () {
		},
		
		destroyed () {
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		mounted () {
			this.form.username = getCache('userName') ? getCache('userName') : '';
			this.form.password = getCache('userPassword') ? getCache('userPassword') : ''
		},
		methods: {
			...mapMutations([
				'storeUserInfo',
				'changeOverDueWay',
				'changeToken',
				'changeIsLogin',
				'changeNurseRankDictData'
			]),
			
			// 返回事件
			backTo () {
				if (this.isForgetPassword) {
					this.isPasswordLogin = true;
					this.isSetPassword = false;
					this.isForgetPassword = false;
					this.form.verificationCode = '';
				} else if (this.isSetPassword) {
					this.isPasswordLogin = false;
					this.isSetPassword = false;
					this.isForgetPassword = false;
					this.form.verificationCode = ''
				}
			},
			
			// 输入框(账号/手机号)失去焦点事件
			blurEvent (value) {
				if (!value) return;
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(value)) {
					this.$refs.uToast.show({
						message: '请输入正确的手机号!',
						type: 'error',
						position: 'bottom'
					})
				}
			},
			
			// 登录方式点击事件
			loginMethodEvent () {
				this.isPasswordLogin = !this.isPasswordLogin;
				this.form.username = '';
				this.form.password = '';
				this.form.verificationCode = ''
			},
			
			// 忘记密码事件
			forgetPasswordEvent () {
				this.isSetPassword = false;
				this.isForgetPassword = true;
				this.form.username = '';
				this.form.password = '';
				this.form.verificationCode = '';
				this.form.newPassword = '';
				this.showGetVerificationCode = true;
				clearInterval(this.timer);
				this.timer = null
			},
			
			// 获取验证码事件
			getVerificationCodeEvent () {
				if (!this.form.username) {
					this.$refs.uToast.show({
						message: '请输入手机号码!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.form.username)) {
					this.$refs.uToast.show({
						message: '请输入正确的手机号!',
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
			
			// 退出隐私政策概要弹框事件
			quitEvent () {
				wx.exitMiniProgram({
					success: function () {
					}	
				}); 
				this.privacyPolicyBoxShow = false
			},
			
			// 同意并继续事件
			agreeContinueEvent () {
				this.privacyPolicyBoxShow = false
			},
				 
			// 登录事件
			sure () {
				if (this.isPasswordLogin) {
					this.accountLogin()
				} else {
					this.codeLogin()
				}
			},
			
			// 手机号密码登录
			accountLogin () {
				if ( this.showLoadingHint ) {
					return
				}; 
				if (!this.form.username) {
					this.$refs.uToast.show({
						message: '请输入手机号',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.form.username)) {
					this.$refs.uToast.show({
						message: '请输入正确的手机号!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				if (!this.form.password) {
					this.$refs.uToast.show({
						message: '请输入密码',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				if (this.isReadAgreeChecked.length == 0) {
					this.$refs.uToast.show({
						message: '请阅读并同意协议!',
						type: 'error',
						position: 'bottom'
					});
					return
				};	  
				let loginMessage = {
				  mobile: this.form.username,
				  password: this.form.password,
					loginType: 1
				};
				this.showLoadingHint = true;
				logIn(loginMessage).then((res) => {
					if (res && res.data.code == 0) {
						this.changeOverDueWay(false);
						setCache('storeOverDueWay',false);
						setCache('isLogin', true);
						// token信息存入store
						this.changeToken(res.data.data.accessToken);
						// 登录用户信息存入store
						this.storeUserInfo(res.data.data);
						this.changeIsLogin(true);
						uni.switchTab({
							url: '/pages/index/index'
						});
						this.getUserDictDataEvent()
					} else {
					 this.modalShow = true;
					 this.modalContent = res.data.msg
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = `${err}`
				})
			},
			
			// 微信一键登录
			weixinMiniAppLoginEvent (data) {
				this.showLoadingHint = true;
				weixinMiniAppLogin(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 0) {
						this.changeOverDueWay(false);
						setCache('storeOverDueWay',false);
						setCache('isLogin', true);
						// token信息存入store
						this.changeToken(res.data.data.accessToken);
						// 登录用户信息存入store
						this.storeUserInfo(res.data.data);
						this.changeIsLogin(true);
						uni.switchTab({
							url: '/pages/index/index'
						});
						this.getUserDictDataEvent()
					} else {
					 this.modalShow = true;
					 this.modalContent = res.data.msg
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = `${err}`
				})
			},
			
			// 手机号验证码登录
			codeLogin () {
				if ( this.showLoadingHint ) {
					return
				};
				if (!this.form.username) {
					this.$refs.uToast.show({
						message: '请输入手机号',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.form.username)) {
					this.$refs.uToast.show({
						message: '请输入正确的手机号!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				if (!this.form.verificationCode) {
					this.$refs.uToast.show({
						message: '请输入验证码',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				if (this.isReadAgreeChecked.length == 0) {
					this.$refs.uToast.show({
						message: '请阅读并同意协议!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let loginMessage = {
				  mobile: this.form.username,
				  code: this.form.verificationCode,
					loginType: 1
				};
				this.showLoadingHint = true;
				logInByCode(loginMessage).then((res) => {
					if (res && res.data.code == 0) {
						this.changeOverDueWay(false);
						setCache('storeOverDueWay',false);
						setCache('isLogin', true);
						// token信息存入store
						this.changeToken(res.data.data.accessToken);
						// 登录用户信息存入store
						this.storeUserInfo(res.data.data);
						// 注册成功后进入设置密码环节
						if (!this.isPasswordLogin) {
							// 第一次手机号验证码登录时，跳到密码设置界面
							if (res.data.data.first) {
								this.isSetPassword = true;
								this.form.password = ''
							} else {
								this.changeIsLogin(true);
								uni.switchTab({
									url: '/pages/index/index'
								});
								this.getUserDictDataEvent()
							}
						}
					} else {
					 this.modalShow = true;
					 this.modalContent = res.data.msg
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = `${err}`
				})
			},
			
			// 发送验证码事件
			sendCodeEvent () {
				if (!this.form.username) {
					this.$refs.uToast.show({
						message: '请输入手机号',
						type: 'erroe',
						position: 'bottom'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.form.username)) {
					this.$refs.uToast.show({
						message: '请输入正确的手机号!',
						type: 'error',
						position: 'bottom'
					});
					return
				};
				let loginMessage = {
				  mobile: this.form.username,
					scene: this.isForgetPassword ? 4 : 1
				};
				this.showLoadingHint = true;
				sendPhoneCode(loginMessage).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data == true) {
							this.$refs.uToast.show({
								message: '验证码已发送至您的手机，请查收!',
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
					 this.modalShow = true;
					 this.modalContent = res.data.msg
					};
					this.isClickGetCode = false;
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.isClickGetCode = false;
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = `${err}`
				})
			},
			
			// 跳过事件
			skipEvent () {
				uni.switchTab({
					url: '/pages/index/index'
				});
				this.getUserDictDataEvent()
			},
			
			// 密码重置和设置密码事件
			resetPasswordEvent () {
				if (this.showLoadingHint) {
					return
				};
				// 密码重置
				if (this.isForgetPassword) {
					if (!this.form.username) {
						this.$refs.uToast.show({
							message: '请输入手机号',
							type: 'error',
							position: 'bottom'
						});
						return
					};
					if (!this.form.verificationCode) {
						this.$refs.uToast.show({
							message: '请输入验证码',
							type: 'error',
							position: 'bottom'
						});
						return
					};
					if (this.form.newPassword != this.form.againPassword) {
						this.$refs.uToast.show({
							message: '两次密码输入不一致!',
							type: 'error',
							position: 'bottom'
						});
						return
					};
					let loginMessage = {
						password: this.form.newPassword,
						code: this.form.verificationCode,
						type: 1,
					  mobile: this.form.username
					};
					this.showLoadingHint = true;
					resetPassword(loginMessage).then((res) => {
						if ( res && res.data.code == 0) {
							this.$refs.uToast.show({
								message: '密码重置成功!',
								type: 'success',
								position: 'bottom'
							});
							this.form = {
								username: '',
								password: '',
								verificationCode: '',
								newPassword: '',
								againPassword: ''
							};
							this.showGetVerificationCode = true;
							this.isSetPassword =  false;
							this.isPasswordLogin = true;
							this.isForgetPassword =  false;
						} else {
						 this.modalShow = true;
						 this.modalContent = `${res.data.msg}`
						};
						this.showLoadingHint = false;
					})
					.catch((err) => {
						this.showLoadingHint = false;
						this.modalShow = true;
						this.modalContent = `${err}`
					})
				} else {
					// 设置密码
					if (!this.form.password) {
						this.$refs.uToast.show({
							message: '请输入密码',
							type: 'error',
							position: 'bottom'
						});
						return
					};
					if (!this.isPasswordLogin && this.isSetPassword) {
						this.showLoadingHint = true;
						let loginMessage = {
							password: this.form.password
						};
						this.showLoadingHint = true;
						setPassword(loginMessage).then((res) => {
							if ( res && (res.data.code == 0 || res.data.code == 401) ) {
								this.$refs.uToast.show({
									message: '密码设置成功!',
									type: 'success',
									position: 'bottom'
								});
								this.changeIsLogin(true);
								uni.switchTab({
									url: '/pages/index/index'
								});
								this.getUserDictDataEvent()
							} else {
							 this.modalShow = true;
							 this.modalContent = `${res.data.msg}`
							};
							this.showLoadingHint = false;
						})
						.catch((err) => {
							this.showLoadingHint = false;
							this.modalShow = true;
							this.modalContent = `${err}`
						})
					}
				}
			},
      
      // 微信授权登录事件
      weixinLoginEvent () {
        // this.weixinAuthorizationInfoBoxShow = true
				// 获取用户code
				let that = this;
				uni.login({
					provider: 'weixin', //使用微信登录
					success: function(loginRes) {
						that.userCode = loginRes.code
　　　　　 }
				})
      },
			
			// 绑定手机号码
			bindPhone(e) { 
				// 用户同意
				console.log(e);
				if (e.detail.code) {
					this.weixinMiniAppLoginEvent({
						phoneCode: e.detail.code,
						loginCode: this.userCode,
						loginType: 1
					})
				} else {
					this.$refs.uToast.show({
						message: `${e.detail.errMsg}`,
						type: 'error',
						position: 'bottom'
					})
				}
			},
			
			// 获取护师职称数据
			getUserDictDataEvent () {
				getUserDictData({type: 'technical_title'}).then((res) => {
					if ( res && res.data.code == 0) {
						this.changeNurseRankDictData(res.data.data)
					}
				})
				.catch((err) => {
				})
			},
			
			// 弹框确定事件
			sureCancel () {
				this.modalShow = false
			},
			
			// 弹框取消事件
			cancelSure () {
				this.modalShow = false
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100vh;
	};
	.container {
		@include content-wrapper;
		font-size: 14px;
		::v-deep .u-popup {
			flex: none !important;
		};
		.privacy-policy-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						padding: 20px 10px;
						box-sizing: border-box;
						.privacy-policy-title {
							font-size: 18px;
							color: #101010;
							font-weight: bold;
							margin-bottom: 10px
						};
						.privacy-policy-content {
							text-align: justify;
							margin-bottom: 10px;
							line-height: 26px;
							font-size: 14px
						};
						.privilege-box {
							margin-bottom: 10px;
							line-height: 26px;
							font-size: 14px
						};
						.account-box {
							text-align: justify;
							margin-bottom: 10px;
							line-height: 26px;
							font-size: 14px
						};
						.info-title {
							margin-bottom: 10px;
							font-size: 14px;
							text {
								&:first-child {
									color: #101010;
									font-weight: bold;
								};
								&:nth-child(2) {
									color: #0079FF;
									font-weight: bold;
								};
								&:nth-child(3) {
									color: #101010;
									font-weight: bold;
								};
								&:nth-child(4) {
									color: #0079FF;
									font-weight: bold;
								}
							}
						};
						.btn-box {
							margin: 0 auto;
							margin-top: 40px;
							display: flex;
							justify-content: space-between;
							width: 90%;
							button {
								width: 110px;
								font-size: 16px;
								color: #000000;
								background: #fff;
								border: 1px solid #BBBBBB;
								height: 36px;
								text-align: center;
								line-height: 36px;
								border-radius: 10px;
								&:last-child {
									color: #289E8E
								}
							}
						}
					}
				}
			}	
		};
		.weixin-authorization-info-box {
			::v-deep .u-transition {
				.u-popup__content {
					padding: 10px 20px;
					box-sizing: border-box;
					background: #fff;
					.uni-scroll-view-content {
						display: flex;
						flex-direction: column;
					}
						.weixin-top-area {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.weixin-top-area-left {
								display: flex;
								align-items: center;
								>image {
									width: 31px;
									height: 31px;
									margin-right: 6px
								};
								>text {
									font-size: 14px;
									color: #101010
								}
							};
							.weixin-top-area-right {}
						};
						.account-info-area {
							margin-top: 20px;
							display: flex;
							flex-direction: column;
							>text {
								&:first-child {
									font-size: 16px;
									color: #101010;
									font-weight: bold;
								};
								&:last-child {
									margin-top: 8px;
									font-size: 12px;
									color: #adadad
								}
							}
						};
						.phone-number-area {
							margin-top: 20px;
							background: #ffffd6;
							border: 2px solid #ffd17c;
							width: 100%;
							height: 58px;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							font-size: 10px;
							color: #4c4c4c;
							>text {
								&:first-child {
									font-size: 14px;
									margin-bottom: 2px;
								};
								&:last-child {
									color: #cdcdcd
								}
							}
						};
						.not-allow-area {
							margin-top: 10px;
							background: #ffffd6;
							border: 2px solid #ffd17c;
							width: 100%;
							height: 58px;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 14px;
							color: #4c4c4c;
						};
						.other-phone-number-area {
							width: 100%;
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 12px;
							height: 150px;
							color: #3a3ab7
						}
					}
			}		
		};
		/deep/ .u-model {
			position: relative;
			box-sizing: border-box;
			overflow: auto !important;
			.u-model__content {
				.slot-content {
					height: 300px;
					.show-box {
						.list-container {
							top: 0;
							.list {
								.item {
									color: #a8a8a8
								};
								.active {
									color: #01a6ff;
								}
							}
						}
					}
				}
			};
			.u-model__footer__button {
				&:last-child {
					color: #289E8E !important
				}
			}
		};
		.container-content {
			flex: 1;
			background: #fff;
			position: relative;
			.top-area-box {
				position: relative;
				width: 100%;
				height: 30vh;
				> image {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 30vh
				};
				.title {
					width: 100%;
					display: flex;
					justify-content: center;
					flex-direction: column;
					align-items: center;
					color: black;
					font-size: 26px;
					padding-top: 44px;
					box-sizing: border-box;
				  color: #fff;
				  font-weight: bold;
				  >view {
						z-index: 1000;
						&:first-child {
							position: relative;
							width: 100%;
							height: 44px;
							line-height: 44px;
							text-align: center;
							box-sizing: border-box;
							font-size: 18px;
							.u-icon {
								position: absolute;
								top: 50%;
								transform: translateY(-50%);
								left: 10px;
							}
						};
						&:nth-child(2) {
							width: 80px;
							height: 80px;
							margin: 20px 0 10px 0;
							 image {
								 width: 100%;
								 height: 100%
							 }
						};
						&:last-child {
							font-size: 18px
						}
					}
				}
			};
			.skip-box {
				width: 80%;
				margin: 0 auto;
				margin-top: 40px;
				text-align: right;
				font-size: 22px;
				color: #101010
			};
			.form-box {
        width: 80%;
        margin: 0 auto;
				margin-top: 40px;
				display: flex;
				flex-direction: column;
				position: relative;
				::v-deep .u-form {
					.u-form-item {
						.u-form-item--right__content__icon {
							font-size: 14px;
							color: #289E8E
						};
						.u-line {
							border-bottom: 1px solid #BBBBBB !important
						};
						.item__body__right__content__icon {
							font-size: 14px;
							color: #289E8E
						};
						.uni-input-placeholder {
							color: #101010 !important;
							font-size: 14px !important
						}
					};
					.u-form-item {
						margin-bottom: 20px;
						.u-line {
							border-bottom: 1px solid #BBBBBB !important
						};
						.u-input {
							background: #fff;
						};
						.item__body__right__content__icon {
							font-size: 14px;
							color: #289E8E
						};
						.uni-input-placeholder {
							color: #101010 !important;
							font-size: 14px !important
						}
					};
					.u-border-bottom:after {
						border-bottom-color: #989898 !important
					}
				};
				.form-bottom-info-text {
					width: 100%;
					display: flex;
					height: 40px;
					align-items: center;
					justify-content: space-between;
					>text {
						font-size: 12px;
						color: #B5B5B5
					}
				}
			};
			.form-btn {
        width: 80%;
        margin: 0 auto;
        margin-top: 50px;
				button {
					font-size: 16px;
					color: #fff;
					background: #5064EB;
					height: 46px;
					line-height: 46px;
          border-radius: 10px;
				};
				.uniButtonStyle {
					opacity: 0.5;
				};
				.form-btn-info-text {
					margin-top: 8px;
					align-items: center;
					align-items: center;
					display: flex;
					justify-content: flex-end;
					::v-deep .u-checkbox-group {
						.u-checkbox {
							.u-checkbox__icon-wrap {
								width: 15px !important;
								height: 15px !important
							}
						}
					};
					>text {
						color: #0097E6;
						font-size: 12px;
						margin-top: -1px;
					}
				}
			};
			.enter-home-btn {
				width: 80%;
				margin: 0 auto;
				margin-top: 50px;
				button {
					font-size: 16px;
					color: #fff;
					background: #5064EB;
					height: 46px;
					line-height: 46px;
				  border-radius: 10px;
				};
				.uniButtonStyle {
					opacity: 0.5;
				}
			};
      .weixin-login {
        width: 80%;
        margin: 0 auto;
        margin-top: 90px;
				::v-deep .u-divider {
					.u-divider-line {
						width: 150px !important
					};
					.u-divider-text {
						font-size: 14px
					}
				};
        .image-wrapper {
          width: 40px;
          height: 24px;
          margin: 0 auto;
					margin-top: 10px;
					uni-button {
						width: 40px;
						background: #fff;
						image {
						  width: 24px;
							height: 24px
						}
					};
					uni-button:after {
						border: none
					};
					button {
						width: 40px;
						background: #fff;
						image {
						  width: 24px;
							height: 24px
						}
					};
					button:after {
						border: none
					}
        }
      }
		}
	}
</style>
