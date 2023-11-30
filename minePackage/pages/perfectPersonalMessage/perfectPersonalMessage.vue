<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="完善个人信息" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="personal-message-box">
			<view class="personal-message-top">
				<view class="personal-photo">
					<image :src="defaultPersonPhotoIconPng"></image>
				</view>
				<view class="account-number">
					<view class="account-number-left">
						<text>账号</text>
					</view>
					<view class="account-number-right">
						<text>15669106075</text>
					</view>
				</view>
				<view class="person-name">
					<view class="person-name-left">
						<text>姓名</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="请输入姓名"
							fontSize="14px"
							color="#979797"
							v-model="personNameValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name id-card-number">
					<view class="person-name-left">
						<text>身份证号</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="请输入身份证号"
							fontSize="14px"
							color="#979797"
							v-model="idCardValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name gender-box">
					<view class="person-name-left">
						<text>性别</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="请输入性别"
							fontSize="14px"
							color="#979797"
							v-model="genderValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name birthday-box">
					<view class="person-name-left">
						<text>生日</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="请输入生日"
							fontSize="14px"
							color="#979797"
							v-model="birthdayValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name age-box">
					<view class="person-name-left">
						<text>年龄</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="请输入年龄"
							fontSize="14px"
							color="#979797"
							v-model="ageValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="emergency-contact-number">
					<view class="emergency-contact-number-left">
						<text>*</text>
						<text>紧急联系人方式</text>
					</view>
					<view class="emergency-contact-number-right">
						<u--input
							placeholder="请输入紧急联系人方式"
							fontSize="14px"
							color="#979797"
							v-model="emergencyContactNumberValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="professional-title">
					<view class="professional-title-left">
						<text>*</text>
						<text>职称</text>
					</view>
					<view class="professional-title-right">
						<w-select
								style="margin-left:10px;" 
								v-model='smartSortValue'
								defaultValue="智能排序"
								:list='smartSortList'
								valueName='content' 
								keyName="id"
								@change='smartSortChange'
							>
						</w-select>
					</view>
				</view>
				<view class="professional-title organization-box">
					<view class="professional-title-left">
						<text>*</text>
						<text>机构</text>
					</view>
					<view class="professional-title-right">
						<w-select
								style="margin-left:10px;"
								v-model='serviceCategoryValue'
								defaultValue="服务类别"
								:list='serviceCategoryList'
								valueName='content' 
								keyName="id"
								@change='serviceCategoryChange'
							>
						</w-select>
					</view>
				</view>
				<view class="emergency-contact-number service-quantity">
					<view class="emergency-contact-number-left">
						<text>*</text>
						<text>服务量 (人)</text>
					</view>
					<view class="emergency-contact-number-right">
						<u--input
							placeholder="请输入服务量"
							fontSize="14px"
							color="#979797"
							v-model="serviceQuantityValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="service-duration">
					<view class="service-duration-left">
						<text>*</text>
						<text>服务时长 (小时)</text>
					</view>
					<view class="service-duration-right">
						<u--input
							placeholder="请输入服务时长"
							fontSize="14px"
							color="#979797"
							v-model="serviceDurationValue"
							border="none"
						></u--input>
					</view>
				</view>
			</view>
			<view class="personal-message-bottom">
				<view class="intro-title">
					<text>个人简介</text>
				</view>
				<view class="intro-content">
					<u--textarea v-model="introValue" height="100" border="none" :count="true" maxlength="150" placeholder="个人名片简介（150字），例如：从事产科临床工作二十余年，母乳喂养咨询工作多年，有丰富的母婴护理及母乳喂养实践经验。对母乳喂养问题处理、哺乳期乳房问题、早产儿喂养等均有深入研究。" ></u--textarea>
				</view>
			</view>
		</view>
		<view class="save-btn-box">
			<view class="save-btn">
				<text>保存</text>
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
	import wSelect from '@/components/w-select/w-select.vue'
	export default {
		components: {
			navBar,
			wSelect
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				personNameValue: '',
				idCardValue: '',
				genderValue: '',
				birthdayValue: '',
				ageValue: '',
				professionalTitleValue: '',
				emergencyContactNumberValue: '',
				serviceQuantityValue: '',
				serviceDurationValue: '',
				introValue: '',
				smartSortValue: "",
				smartSortList: [
					{
						id: 1,
						content: '距离优先'
					}, 
					{
						id: 2,
						content: '价格优先'
					}
				],
				serviceCategoryValue: '',
				serviceCategoryList: [
					{
						id: 1,
						content: '目婴护理'
					}, 
					{
						id: 2,
						content: '宝宝护理'
					},
					{
						id: 3,
						content: '慢病护理'
					}, 
					{
						id: 4,
						content: '基本护理'
					}
				],
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png")
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
			
			// 智能排序下拉框值改变事件
			smartSortChange(e) {
				console.log(e)
			},
			
			// 服务类别下拉框值改变事件
			serviceCategoryChange(e) {
				console.log(e)
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
		background: #F9F9F9;
		.top-area-box {
			position: relative;
			background: #F9F9F9;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #F9F9F9;
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
		.personal-message-box {
			flex: 1;
			overflow: auto;
			padding: 10px;
			box-sizing: border-box;
			background: #fff;
			.personal-message-top {
				.personal-photo {
					width: 100%;
					height: 120px;
					display: flex;
					align-items: center;
					justify-content: center;
					image {
						width: 100px;
						height: 100px;
					}
				};
				.account-number {
					display: flex;
					align-items: center;
					padding: 8px 0;
					box-sizing: border-box;
					.account-number-left {
						font-size: 16px;
						color: #101010;
						font-weight: bold;
						width: 100px;
					};
					.account-number-right {
						flex: 1;
						font-size: 14px;
						color: #979797
					}
				};
				.person-name {
					display: flex;
					align-items: center;
					padding: 8px 0;
					box-sizing: border-box;
					@include bottom-border-1px(#BBBBBB);
					.person-name-left {
						font-size: 16px;
						color: #101010;
						width: 100px;
						font-weight: bold
					};
					.person-name-right {
						flex: 1;
						font-size: 14px;
						color: #979797
					}
				};
				.emergency-contact-number {
					display: flex;
					align-items: center;
					padding: 8px 0;
					box-sizing: border-box;
					@include bottom-border-1px(#BBBBBB);
					.emergency-contact-number-left {
						>text {
							&:first-child {
								color: red;
								margin-right: 6px;
							};
							&:last-child {
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.emergency-contact-number-right {
						flex: 1;
						padding-left: 20px;
						box-sizing: border-box;
						font-size: 14px;
						color: #979797
					}
				};
				.professional-title {
					display: flex;
					align-items: center;
					padding: 8px 0;
					box-sizing: border-box;
					border-bottom: 6px solid #f6f6f6;
					.professional-title-left {
						width: 100px;
						>text {
							&:first-child {
								color: red;
								margin-right: 6px;
							};
							&:last-child {
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.professional-title-right {
						flex: 1;
						font-size: 14px;
						color: #979797;
						::v-deep .w-select {
							--select-border: none;
							margin-left: 0 !important;
							.select-wrap-active {
								border: none
							};
							.select-wrap {
								width: 100%;
								.uni-input-placeholder {
									font-size: 14px !important;
									color: #979797 !important
								};
								input {
									font-size: 14px !important;
									color: #979797 !important
								};
								.select-content-item {
									font-size: 14px !important;
									color: #979797 !important
								}
							}	
						}
					}
				};
				.service-duration {
					display: flex;
					align-items: center;
					padding: 8px 0;
					box-sizing: border-box;
					.service-duration-left {
						>text {
							&:first-child {
								color: red;
								margin-right: 6px;
							};
							&:last-child {
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.service-duration-right {
						flex: 1;
						padding-left: 20px;
						box-sizing: border-box;
						font-size: 14px;
						color: #979797
					}
				}
			};
			.personal-message-bottom {
				padding: 10px;
				box-sizing: border-box;
				background: #f6f6f6;
				.intro-title {
					padding-left: 10px;
					box-sizing: border-box;
					font-size: 16px;
					color: #101010
				};
				.intro-content {
					margin-top: 10px;
				}
			}
		};
		.save-btn-box {
			height: 80px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.save-btn {
				width: 190px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #5064EB;
				border-radius: 30px;
				color: #fff;
				font-size: 14px
			}
		}
	}
</style>
