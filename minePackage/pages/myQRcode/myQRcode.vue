<template>
	<view class="content-box">
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的二维码" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="my-qr-code-box">
			<view class="qr-code-content-box">
				<view class="qr-code-photo">
					<image :src="personPhotoSource"></image>
				</view>
				<view class="qr-code-content">
					<image :src="qrCodeIconPng"></image>
					<text>{{ niceNameValue }}</text>
					<text>{{ `${defaultOrganizationValue}${defaultProfessionalTitleValue}` }}</text>
				</view>
			</view>
			<view class="operate-box">
				<view class="share-box">
					<view class="image-box">
						<image :src="shareWhiteIconPng"></image>
					</view>
					<view class="share-text">
						<text>分享</text>
					</view>
				</view>
				<view class="administration-box">
					<view class="image-box">
						<image :src="saveWhiteIconPng"></image>
					</view>
					<view class="save-text">
						<text>保存相册</text>
					</view>
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
	import { getUserDictData } from '@/api/login.js'
	import { getMedicalCareDetails, getOrganizationList } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				qrCodeIconPng: require("@/static/img/qr-code-black-icon.png"),
				shareWhiteIconPng: require("@/static/img/share-white.png"),
				saveWhiteIconPng: require("@/static/img/save-white.png"),
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				defaultProfessionalTitleValue: '',
				professionalTitleValue: '',
				professionalTitleList: [],
				defaultOrganizationValue: '',
				organizationValue: '',
				organizationList: [],
				niceNameValue: '',
				personPhotoSource: '',
				infoText: '加载中'
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
			// 查询医护详细信息
			this.getMedicalCareDetailsEvent()
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 获取医护详细信息
			getMedicalCareDetailsEvent () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.nurseMessageLoadComplete = false;
				getMedicalCareDetails().then((res) => {
					if ( res && res.data.code == 0) {
						// 查询组织机构信息
						this.getOrganizationListEvent();
						// 查询职称信息
						this.getUserDictDataEvent();
						this.personPhotoSource = !res.data.data.avatar ? this.defaultPersonPhotoIconPng : res.data.data.avatar;
						this.niceNameValue = res.data.data.name;
						this.professionalTitleValue = res.data.data.title ? res.data.data.title.toString() : '';
						this.organizationValue = res.data.data.organization ? res.data.data.organization.toString() : '';
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.nurseMessageLoadComplete = true;
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.nurseMessageLoadComplete = true;
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 获取组织机构信息
			getOrganizationListEvent () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.organizationList = [];
				getOrganizationList().then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.organizationList.push({
									id: item.id.toString(),
									content: item.name
								})
							};
							let temporaryMessageArr = this.organizationList.filter((innerItem) => { return innerItem.id == this.organizationValue });
							if (temporaryMessageArr.length > 0) {
								this.defaultOrganizationValue = temporaryMessageArr[0]['content']
							} else {
								this.defaultOrganizationValue = '请选择您挂靠的机构'
							}
						}
					}
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
			
			//获取护师职称数据
			getUserDictDataEvent () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.professionalTitleList = [];
				getUserDictData({type: 'technical_title'}).then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.professionalTitleList.push({
									id: item.value,
									content: item.label
								})
							};
							let temporaryMessageArr = this.professionalTitleList.filter((innerItem) => { return innerItem.id == this.professionalTitleValue });
							if (temporaryMessageArr.length > 0) {
								this.defaultProfessionalTitleValue = temporaryMessageArr[0]['content']
							} else {
								this.defaultProfessionalTitleValue = "请选择您的职称"
							}
						}
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
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
		.my-qr-code-box {
			flex: 1;
			overflow: auto;
			padding: 50px 30px 10px 30px;
			box-sizing: border-box;
			.qr-code-content-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				padding-bottom: 50px;
				background: rgba(80, 100, 235, 0.06);
				border-radius: 10px;
				.qr-code-photo {
					width: 90px;
					height: 90px;
					border-radius: 50%;
					transform: translateY(-50%);
					image {
						border-radius: 50%;
						width: 90px;
						height: 90px
					}
				};
				.qr-code-content {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					image {
						width: 193px;
						height: 193px
					};
					>text {
						&:nth-of-type(1) {
							margin: 20px 0;
							font-size: 28px;
							color: #898C8C
						};
						&:nth-of-type(2) {
							font-size: 13px;
							color: #3E4249
						}
					}
				}
			};
			.operate-box {
				height: 150px;
				display: flex;
				justify-content: center;
				align-items: center;
				.share-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.share-text {
						text {
							font-size: 14px;
							color: #101010
						}
					};
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #5064EB;
						image {
							width: 32px;
							height: 32px
						}
					}
				};
				.administration-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.save-text {
						text {
							font-size: 14px;
							color: #101010
						}
					};
					.image-box {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10px;
						width: 57px;
						height: 57px;
						border-radius: 50%;
						background: #5064EB;
						image {
							width: 32px;
							height: 32px
						}
					}
				}
			}
		}
	}
</style>
