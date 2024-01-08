<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="身份认证" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="identity-authentication-box">
			<view class="real-name-authentication" @click="realNameAuthenticationEvent">
				<view class="real-name-authentication-left">
					<view class="image-box">
						<image src="@/static/img/real-name-authentication-icon.png"></image>
					</view>
					<view class="authentication-text">
						<text>实名认证</text>
					</view>
				</view>
				<view class="real-name-authentication-right" v-if="!realname">
					<text>未实名</text>
				</view>
				<view class="real-name-authentication-right-real-name" v-else>
					<text>已实名</text>
				</view>
			</view>
			<view class="certificate-authentication-title">
				<text>证书认证</text>
			</view>
				<view class="certificate-authentication-list-box">
					<view class="certificate-authentication-list" v-for="(item,index) in medicalCareAptitudeList" :key="index">
						<view class="certificate-authentication" v-if="item.passed == 'NO'" @click="nurseQualificationAuthenticationEvent(item,index)">
							<view class="certificate-authentication-left">
								<view class="image-box">
									<image :src="item.picUrl"></image>
								</view>
								<view class="authentication-text">
									<text>{{ item.name }}</text>
								</view>
							</view>
							<view class="certificate-authentication-right">
								<text>未认证</text>
							</view>
						</view>
						<view class="certificate-have-authentication" v-if="item.passed == 'OPEN' || item.passed == 'APPLYING'">
							<view class="certificate-have-authentication-left">
								<view class="image-box">
									<image :src="item.picUrl"></image>
								</view>
								<view class="authentication-text">
									<text>{{ item.name }}</text>
								</view>
							</view>
							<view class="certificate-have-authentication-right">
								<image src="@/static/img/have-authentication-icon.png" v-if="item.passed == 'OPEN'"></image>
								<text>{{ item.passed == 'OPEN' ? '已认证' : '审核中'}}</text>
							</view>
						</view>
					</view>	
				</view>		
			<view class="complete-personal-information-title">
				<text>完善个人信息</text>
			</view>
			<view class="complete-personal-information" @click="perfectPersonalMessageEvent">
				<view class="complete-personal-information-left">
					<view class="image-box">
						<image :src="personPhotoSource"></image>
					</view>
					<view class="personal-information-text">
						<text>个人信息</text>
					</view>
				</view>
				<view class="complete-personal-information-right" v-if="!perfect">
					<text>未完善</text>
				</view>
				<view class="complete-personal-information-right-perfect" v-else>
					<text>已完善</text>
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
	import { getMedicalCareAptitudeList, getUserMessage } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				personPhotoSource: '',
				realname: false,
				perfect: false,
				aptitude: false,
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				medicalCareAptitudeList: []
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
			this.getMedicalCareAptitudeListEvent();
			this.queryUserBasicMessage();
			if (this.userBasicInfo && JSON.stringify(this.userBasicInfo) != '{}') {
				this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
				this.realname = this.userBasicInfo.realname == 'YES' ? true : false;
				this.perfect = this.userBasicInfo.perfect == 'YES' ? true : false;
				this.aptitude = this.userBasicInfo.aptitude == 'YES' ? true : false
			}
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 获得医护资质列表
			getMedicalCareAptitudeListEvent () {
				this.showLoadingHint = true;
				getMedicalCareAptitudeList().then((res) => {
					if ( res && res.data.code == 0) {
						this.medicalCareAptitudeList = res.data.data
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
			
			// 获取用户基本信息
			queryUserBasicMessage () {
				this.showLoadingHint = true;
				getUserMessage().then((res) => {
					if ( res && res.data.code == 0) {
						this.changeUserBasicInfo(res.data.data);
						this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
						this.realname = this.userBasicInfo.realname == 'YES' ? true : false;
						this.perfect = this.userBasicInfo.perfect == 'YES' ? true : false;
						this.aptitude = this.userBasicInfo.aptitude == 'YES' ? true : false
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
			
			// 实名认证事件
			realNameAuthenticationEvent () {
				if (this.realname) { return };
				uni.navigateTo({
					url: '/minePackage/pages/realNameAuthentication/realNameAuthentication'
				})
			},
			
			// 护士资格认证事件
			nurseQualificationAuthenticationEvent (item,index) {
				let mynavData = JSON.stringify(item);
				if (item.name == '护士资格证') {
					uni.navigateTo({
						url: '/minePackage/pages/nurseQualificationAuthentication/nurseQualificationAuthentication?transmitData='+mynavData
					})
				}	else if (item.name == '护理资格证') {
					uni.navigateTo({
						url: '/minePackage/pages/careQualificationAuthentication/careQualificationAuthentication?transmitData='+mynavData
					})
				} else {
					uni.navigateTo({
						url: '/minePackage/pages/otherQualificationAuthentication/otherQualificationAuthentication?transmitData='+mynavData
					})
				}
			},
			
			// 完善个人信息事件
			perfectPersonalMessageEvent () {
				// if (this.perfect) { return };
				uni.navigateTo({
					url: '/minePackage/pages/perfectPersonalMessage/perfectPersonalMessage'
				})
			},
			
			// 顶部导航返回事件
			backTo () {
				this.changeUserBasicInfo({});
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
		.identity-authentication-box {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			.real-name-authentication {
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				height: 116px;
				border-radius: 9px;
				background: linear-gradient(to right, #509EFD, #6C72FF);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.real-name-authentication-left {
					display: flex;
					align-items: center;
					flex: 1;
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #fff;
						image {
							width: 24px;
							height: 24px;
						}
					};
					.authentication-text {
						font-size: 18px;
						color: #fff;
					}
				};
				.real-name-authentication-right {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color: #fff;
					width: 57px;
					height: 57px;
					border-radius: 50%;
					background: rgba(80, 100, 235, 0.75);
				};
				.real-name-authentication-right-real-name {
					font-size: 14px;
					color: #E8CB51;
				}
			};
			.certificate-authentication-title {
				height: 60px;
				line-height: 60px;
				font-size: 14px;
				color: #101010;
			};
			.certificate-authentication-list-box {
				.certificate-authentication-list {
					.certificate-authentication {
						width: 100%;
						padding: 0 20px;
						box-sizing: border-box;
						margin-top: 14px;
						height: 116px;
						border-radius: 9px;
						background: linear-gradient(to right, #509EFD, #6C72FF);
						display: flex;
						align-items: center;
						justify-content: space-between;
						.certificate-authentication-left {
							display: flex;
							align-items: center;
							flex: 1;
							.image-box {
								display: flex;
								align-items: center;
								justify-content: center;
								margin-right: 20px;
								width: 57px;
								height: 57px;
								border-radius: 50%;
								background: #fff;
								image {
									width: 24px;
									height: 24px;
								}
							};
							.authentication-text {
								font-size: 18px;
								color: #fff;
							}
						};
						.certificate-authentication-right {
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 14px;
							color: #fff;
							width: 57px;
							height: 57px;
							border-radius: 50%;
							background: rgba(80, 100, 235, 0.75);
						}
					};
					.certificate-have-authentication {
						width: 100%;
						padding: 0 20px;
						margin-top: 14px;
						box-sizing: border-box;
						height: 116px;
						border-radius: 9px;
						background: linear-gradient(to right, #509EFD, #6C72FF);
						display: flex;
						align-items: center;
						justify-content: space-between;
						.certificate-have-authentication-left {
							display: flex;
							align-items: center;
							flex: 1;
							.image-box {
								display: flex;
								align-items: center;
								justify-content: center;
								margin-right: 20px;
								width: 57px;
								height: 57px;
								border-radius: 50%;
								background: #fff;
								image {
									width: 24px;
									height: 24px;
								}
							};
							.authentication-text {
								font-size: 18px;
								color: #fff;
							}
						};
						.certificate-have-authentication-right {
							image {
								width: 38px;
								height: 38px;
								margin-right: 4px;
								vertical-align: middle
							};
							text {
								font-size: 14px;
								color: #E8CB51;
								vertical-align: middle
							}
						}
					}
				}	
			};		
			.complete-personal-information-title {
				height: 80px;
				line-height: 80px;
				font-size: 14px;
				color: #101010;
			};
			.complete-personal-information {
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				height: 116px;
				border-radius: 9px;
				background: linear-gradient(to right, #509EFD, #6C72FF);
				display: flex;
				align-items: center;
				justify-content: space-between;
				.complete-personal-information-left {
					display: flex;
					align-items: center;
					flex: 1;
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #fff;
						image {
							width: 24px;
							height: 24px;
						}
					};
					.personal-information-text {
						font-size: 18px;
						color: #fff;
					}
				};
				.complete-personal-information-right {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color: #fff;
					width: 57px;
					height: 57px;
					border-radius: 50%;
					background: rgba(80, 100, 235, 0.75);
				};
				.complete-personal-information-right-perfect {
					font-size: 14px;
					color: #E8CB51;
				}
			}
		}
	}
</style>
