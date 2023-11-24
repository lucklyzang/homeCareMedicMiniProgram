<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal :show="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="添加被护人" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="protected-persons-box">
			<view class="basic-information">
				<view class="basic-information-title">
					<text>基本信息</text>
				</view>
				<view class="basic-information-content">
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>被护人姓名</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入被护人姓名"
								inputAlign="right"
								border="none"
								v-model="protectedPersonsNameValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>身份证号</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入患者身份证证件号"
								inputAlign="right"
								border="none"
								v-model="idNumberValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>联系方式</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入联系方式"
								inputAlign="right"
								border="none"
								v-model="contactWayValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name protected-persons-name-other">
						<view class="protected-persons-name-left">
							<text>出生日期</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								inputAlign="right"
								border="none"
								v-model="birthDateValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name protected-persons-name-other">
						<view class="protected-persons-name-left">
							<text>年龄</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								inputAlign="right"
								border="none"
								v-model="ageValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name protected-persons-name-other">
						<view class="protected-persons-name-left">
							<text>性别</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								inputAlign="right"
								border="none"
								v-model="sexValue"
							></u--input>
						</view>
					</view>
					<view class="protected-persons-name">
						<view class="protected-persons-name-left">
							<text>*</text>
							<text>紧急联系人</text>
						</view>
						<view class="protected-persons-name-input">
							<u--input
								placeholder="请输入联系方式"
								inputAlign="right"
								border="none"
								v-model="emergencyContactValue"
							></u--input>
						</view>
					</view>
				</view>
			</view>
			<view class="upload-attachment">
				<view class="upload-attachment-title">
					<text>上传相关附件</text>
				</view>
				<view class="upload-attachment-content">
					<view class="medicare-card-area">
						<view class="medicare-card-top">
							<text>医保卡</text>
						</view>
						<view class="medicare-card-bottom" v-if="medicareCardImgArr.length > 0">
							<view v-for="(item, index) in medicareCardImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'医保卡')"></u-icon>
							</view>
							<view>
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('医保卡')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="medicareCardImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('医保卡')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
					<view class="medical-record-data-area">
						<view class="medicare-card-top">
							<text>病历资料</text>
						</view>
						<view class="medicare-card-bottom" v-if="medicalRecordDataImgArr.length > 0">
							<view v-for="(item, index) in medicalRecordDataImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'病历资料')"></u-icon>
							</view>
							<view>
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('病历资料')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="medicalRecordDataImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('病历资料')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
					<view class="special-circumstances-area">
						<view class="medicare-card-top">
							<text>特殊情况</text>
						</view>
						<view class="medicare-card-bottom" v-if="specialCircumstancesImgArr.length > 0">
							<view v-for="(item, index) in specialCircumstancesImgArr" :key='index'>
								<image :src="item" mode="aspectFit"></image>
								<u-icon name="close" color="#2979ff" size="28" @click="photoDelete(item,index,'特殊情况')"></u-icon>
							</view>
							<view>
								<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('特殊情况')"/>
							</view>
						</view>
						<view class="medicare-cara-init" v-if="specialCircumstancesImgArr.length == 0">
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg('特殊情况')"/>
							<text>只能上传jpg/png文件，且不超过5M</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="saveProtectedPersonsEvent">保存被护人</text>
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
				noProtectedPersonsPng: require("@/static/img/no-protected-persons.png"),
				infoText: '加载中',
				protectedPersonsNameValue: '',
				idNumberValue: '',
				contactWayValue: '',
				emergencyContactValue: '',
				birthDateValue: '',
				ageValue: '',
				sexValue: '',
				sureCancelShow: false,
				imgIndex: '',
				content: '',
				medicareCardImgArr: [],
				temporaryMedicareCardImgArr: [],
				medicalRecordDataImgArr: [],
				temporaryMedicalRecordDataImgArr: [],
				specialCircumstancesImgArr: [],
				temporarySpecialCircumstancesImgArr: [],
				text: ''
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
			
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false
			},
			
			// 弹框确定按钮
			sureCancel() {
				if (this.text == '医保卡') {
					this.medicareCardImgArr.splice(this.imgIndex, 1);
					this.temporaryMedicareCardImgArr.splice(this.imgIndex, 1);
				} else if (this.text == '病历资料') {
					this.medicalRecordDataImgArr.splice(this.imgIndex, 1);
					this.temporaryMedicalRecordDataImgArr.splice(this.imgIndex, 1);
				} else if (this.text == '特殊情况') {
					this.specialCircumstancesImgArr.splice(this.imgIndex, 1);
					this.temporarySpecialCircumstancesImgArr.splice(this.imgIndex, 1);
				};
				this.sureCancelShow = false
			},
			
			// 图片删除事件
			photoDelete(item, index, text) {
				this.text = text;
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			// 选择图片方法
			getImg(text) {
				var that = this;
				uni.chooseImage({
					count: 4,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						if (text == '医保卡') {
							that.temporaryMedicareCardImgArr = that.temporaryMedicareCardImgArr.concat(res.tempFilePaths);
						} else if (text == '病历资料') {
							that.temporaryMedicalRecordDataImgArr = that.temporaryMedicalRecordDataImgArr.concat(res.tempFilePaths);
						} else if (text == '特殊情况') {
							that.temporarySpecialCircumstancesImgArr = that.temporarySpecialCircumstancesImgArr.concat(res.tempFilePaths);
						};
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.srcImage = res.tempFilePaths[imgI];
							uni.getFileSystemManager().readFile({
								filePath: that.srcImage,
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									if (text == '医保卡') {
										that.medicareCardImgArr.push(base64);
									} else if (text == '病历资料') {
										that.medicalRecordDataImgArr.push(base64);
									} else if (text == '特殊情况') {
										that.specialCircumstancesImgArr.push(base64);
									}
								}
							})
						}
					}
				})
			},
			
			// 保存被护人事件
			saveProtectedPersonsEvent () {
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
		background: #f1f1f1;
		::v-deep .u-popup {
			flex: none !important
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
		.protected-persons-box {
			flex: 1;
			overflow: auto;
			padding: 0 0 10px 0;
			box-sizing: border-box;
			.basic-information {
				.basic-information-title {
					height: 30px;
					line-height: 30px;
					padding-left: 14px;
					box-sizing: border-box;
					>text {
						font-size: 14px;
						color: #101010
					}
				};
				.basic-information-content {
					.protected-persons-name-other {
						.protected-persons-name-left {
							>text {
								&:nth-child(1) {
									padding-left: 10px !important;
									font-size: 14px;
									color: #101010 !important
								}
							}
						}	
					};
					.protected-persons-name {
						margin-bottom: 2px;
						padding: 0 4px;
						box-sizing: border-box;
						height: 43px;
						background: #fff;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.protected-persons-name-left {
							>text {
								&:nth-child(1) {
									color: red;
									margin-right: 2px
								};
								&:nth-child(2) {
									font-size: 14px;
									color: #101010
								};
							}
						};
						.protected-persons-name-input {
							flex: 1;
							margin-left: 10px;
						}
					}
				}
			};
			.upload-attachment {
				padding: 0 10px;
				box-sizing: border-box;
				.upload-attachment-title {
					height: 30px;
					line-height: 30px;
					>text {
						font-size: 14px;
						color: #101010
					}
				};
				.upload-attachment-content {
					>view {
						border-radius: 5px;
						background: #fff;
						margin-bottom: 10px;
						padding: 4px 6px;
						box-sizing: border-box;
						.medicare-card-top {
							>text {
								font-size: 12px;
								color: #101010
							}
						};
						.medicare-card-bottom {
							margin-top: 6px;
							width: 100%;
							font-size: 34px;
							>view {
								width: 32%;
								height: 100px;
								display: inline-block;
								vertical-align: top;
								margin-right: 2%;
								margin-top: 2%;
								position: relative;
								&:nth-child(1) {
									margin-top: 0;
								};
								&:nth-child(2) {
									margin-top: 0;
								};
								&:nth-child(3) {
									margin-top: 0;
								};
								&:nth-child(3n+3) {
									margin-right: 0;
								};
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
						.medicare-cara-init {
							display: flex;
							justify-content: center;
							flex-direction: column;
							align-items: center;
							>image {
								width: 64px;
								height: 64px;
							};
							>text {
								margin-top: 4px;
								font-size: 12px;
								color: #101010
							}
						}
					}
				}
			}
		};
		.add-btn {
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			>text {
				width: 94%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				font-size: 18px;
				color: #FFFFFF;
				background: #F16C8C;
				border-radius: 10px;
			}
		}
	}
</style>
