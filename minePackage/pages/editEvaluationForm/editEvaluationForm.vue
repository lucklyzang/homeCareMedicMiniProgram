<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view>
			<u-datetime-picker
				:show="dataDialogShow"
				v-model="dateValue"
				@close="dataDialogShow = false"
				@confirm="dateChangeEvent"
				@cancel="dataDialogShow = false"
				mode="date"
			></u-datetime-picker>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="初步评估单管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="evaluation-form-box">
			<view class="evaluation-form">
				<view class="evaluation-form-title">
					<text>{{ `${evaluationFormName}初步评估单` }}</text>
				</view>
				<view class="evaluation-form-content">
					<view class="hospital-area">
						<view class="hospital-title">
							<text>1、</text>
							<text>请选择分娩医院(必填)</text>
						</view>
						<view class="hospital-content">
							<view :class="{'hospitalListStyle':selectHospitalIndex == index}" class="hospital-list" @click="hospitalListClickEvent(item,index)" v-for="(item,index) in hospitalList">
								<text>{{ item }}</text>
							</view>
						</view>
						<view class="hospital-remark">
							<u--textarea height="40" v-model="hospitalRemarkValue" maxlength="50" :count="true"></u--textarea>
						</view>
					</view>
					<view class="hospital-area">
						<view class="hospital-title">
							<text>2、</text>
							<text>请选择产妇出院病区(必填)</text>
						</view>
						<view class="hospital-content">
							<view :class="{'hospitalListStyle':selecInpatientWard == index}" class="hospital-list" @click="inpatientWardClickEvent(item,index)" v-for="(item,index) in inpatientWardList">
								<text>{{ item }}</text>
							</view>
						</view>
					</view>
					<view class="birth-data-area">
						<view class="birth-data-title">
							<text>3、</text>
							<text>请选择孩子出生日期(必填)</text>
						</view>
						<view class="birth-data-content" @click="dateSelectEvent">
							<text>{{ selectBirthDate }}</text>
							<u-icon name="calendar" color="#BBBBBB" size="22"></u-icon>
						</view>
					</view>
					<view class="premature-delivery-area">
						<view class="premature-delivery-title">
							<text>4、</text>
							<text>足月产还是早产(必填)</text>
						</view>
						<view class="premature-delivery-content">
							<view :class="{'prematureDeliveryListStyle':selectPrematureDeliverylIndex == index}" class="premature-delivery-list" @click="prematureDeliveryClickEvent(item,index)" v-for="(item,index) in prematureDeliveryList">
								<text>{{ item }}</text>
							</view>
						</view>
					</view>
					<view class="weight-area">
						<view class="weight-title">
							<text>5、</text>
							<text>请填写孩子出生体重Kg(必填)</text>
						</view>
						<view class="weight-content">
							 <u--input
							    placeholder="请输入"
							    border="surround"
									type="number"
							    v-model="weightValue"
							  ></u--input>
						</view>
					</view>
					<view class="fracture-area">
						<view class="fracture-title">
							<text>6、</text>
							<text>孩子是否有骨折(必填)</text>
						</view>
						<view class="fracture-content">
							<view :class="{'fractureListStyle':selectFractureIndex == index}" class="fracture-list" @click="fractureClickEvent(item,index)" v-for="(item,index) in fractureList">
								<text>{{ item }}</text>
							</view>
						</view>
					</view>
					<view class="skin-damage-area">
						<view class="skin-damage-title">
							<text>7、</text>
							<text>孩子皮肤是否有破损(必填)</text>
						</view>
						<view class="skin-damage-content">
							<view :class="{'skinDamageListStyle':selectSkinDamageIndex == index}" class="skin-damage-list" @click="skinDamageClickEvent(item,index)" v-for="(item,index) in skinDamageList">
								<text>{{ item }}</text>
							</view>
						</view>
					</view>
					<view class="main-issue-area">
						<view class="main-issue-title">
							<text>8、</text>
							<text>主要问题/需求(必填)</text>
						</view>
						<view class="main-issue-content">
							<u--textarea v-model="mainIssueValue" maxlength="350" :count="true"></u--textarea>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="saveEvaluationformEvent">保存</text>
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
				deleteBlackIconPng: require("@/static/img/delete-black-icon.png"),
				infoText: '加载中',
				selectBirthDate: '请选择日期',
				hospitalRemarkValue: '',
				dataDialogShow: false,
				evaluationFormName: '',
				dateValue: Number(new Date()),
				selectHospitalIndex: 0,
				selecInpatientWard: 0,
				weightValue: '',
				mainIssueValue: '',
				inpatientWardList: ['产一科（妇儿中心总部)','产一科（妇儿中心总部)','产一科（妇儿中心总部)','其它'],
				hospitalList: ['成都市妇女儿童中心（总部)','成都市妇女儿童中心（东城根)','其它'],
				prematureDeliveryList: ['足月产','早产'],
				fractureList: ['无','有'],
				skinDamageList: ['无','有'],
				selectSkinDamageIndex: 0,
				selectFractureIndex: 0,
				selectPrematureDeliverylIndex: 0
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
		
		onLoad(option) {
			this.evaluationFormName = JSON.parse(option.parameter)['text']
		},
		
		methods: {
			...mapMutations([
			]),
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
									
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 医院点击事件
			hospitalListClickEvent (item,index) {
				this.selectHospitalIndex = index
			},
			
			// 病区点击事件
			inpatientWardClickEvent (item,index) {
				this.selecInpatientWard = index
			},
			
			// 出生日期选择事件
			dateSelectEvent () {
				this.dataDialogShow = true
			},
			
			// 日期选择弹框变化事件
			dateChangeEvent (value) {
				this.dataDialogShow = false;
				this.selectBirthDate = this.getNowFormatDate(new Date(value['value']),2)
			},
			
			// 是否足月产点击事件
			prematureDeliveryClickEvent (item,index) {
				this.selectPrematureDeliverylIndex = index
			},
			
			// 是否骨折点击事件
			fractureClickEvent (item,index) {
				this.selectFractureIndex = index
			},
			
			// 皮肤是否破损点击事件
			skinDamageClickEvent (item,index) {
				this.selectSkinDamageIndex = index
			},
			
			// 保存评估单事件
			saveEvaluationformEvent () {
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
		.evaluation-form-box {
			flex: 1;
			overflow: auto;
			padding: 10px 6px;
			box-sizing: border-box;
			.evaluation-form {
				.evaluation-form-title {
					height: 45px;
					display: flex;
					justify-content: center;
					align-items: center;
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
					background: #FC82A1;
					>text {
						font-size: 18px;
						color: #fff
					}
				};
				.evaluation-form-content {
					padding: 10px;
					box-sizing: border-box;
					background: #fff;
					.hospital-area {
						margin-bottom: 16px;
						.hospital-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.hospital-content {
							display: flex;
							flex-wrap: wrap;
							padding-left: 26px;
							box-sizing: border-box;
							.hospital-list {
								border: 1px solid #BBBBBB;
								border-radius: 4px;
								padding: 2px 8px;
								box-sizing: border-box;
								font-size: 14px;
								color: #BBBBBB;
								margin-right: 10px;
								margin-bottom: 6px;
							};
							.hospitalListStyle {
								border: 1px solid #FC82A1 !important;
								background: #FC82A1 !important;
								color: #fff !important
							}
						};
						.hospital-remark {
							padding-left: 26px;
							box-sizing: border-box;
							margin-top: 4px;
						}
					};
					.birth-data-area {
						margin-bottom: 16px;
						.birth-data-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.birth-data-content {
							display: flex;
							align-items: center;
							justify-content: space-between;
							height: 30px;
							border: 1px solid #BBBBBB;
							border-radius: 4px;
							box-sizing: border-box;
							padding: 0 4px;
							margin-left: 26px;
							>text {
								font-size: 14px;
								color: #BBBBBB
							}
						}
					};
					.premature-delivery-area {
						margin-bottom: 16px;
						.premature-delivery-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.premature-delivery-content {
							display: flex;
							flex-wrap: wrap;
							padding-left: 26px;
							box-sizing: border-box;
							.premature-delivery-list {
								border: 1px solid #BBBBBB;
								border-radius: 4px;
								padding: 2px 8px;
								box-sizing: border-box;
								font-size: 14px;
								color: #BBBBBB;
								margin-right: 10px;
								margin-bottom: 6px;
							};
							.prematureDeliveryListStyle {
								border: 1px solid #FC82A1 !important;
								background: #FC82A1 !important;
								color: #fff !important
							}
						}
					};
					.fracture-area {
						margin-bottom: 16px;
						.fracture-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.fracture-content {
							display: flex;
							flex-wrap: wrap;
							padding-left: 26px;
							box-sizing: border-box;
							.fracture-list {
								border: 1px solid #BBBBBB;
								border-radius: 4px;
								padding: 2px 12px;
								box-sizing: border-box;
								font-size: 14px;
								color: #BBBBBB;
								margin-right: 10px;
								margin-bottom: 6px;
							};
							.fractureListStyle {
								border: 1px solid #FC82A1 !important;
								background: #FC82A1 !important;
								color: #fff !important
							}
						}	
					};
					.skin-damage-area {
						margin-bottom: 16px;
						.skin-damage-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.skin-damage-content {
							display: flex;
							flex-wrap: wrap;
							padding-left: 26px;
							box-sizing: border-box;
							.skin-damage-list {
								border: 1px solid #BBBBBB;
								border-radius: 4px;
								padding: 2px 12px;
								box-sizing: border-box;
								font-size: 14px;
								color: #BBBBBB;
								margin-right: 10px;
								margin-bottom: 6px;
							};
							.skinDamageListStyle {
								border: 1px solid #FC82A1 !important;
								background: #FC82A1 !important;
								color: #fff !important
							}
						}	
					};
					.weight-area {
						margin-bottom: 16px;
						.weight-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.weight-content {
							padding-left: 26px;
							box-sizing: border-box;
						}
					};
					.main-issue-area {
						margin-bottom: 16px;
						.main-issue-title {
							margin-bottom: 10px;
							>text {
								font-size: 18px;
								color: #101010
							}
						};
						.main-issue-content {
							padding-left: 26px;
							box-sizing: border-box;
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
