<template>
	<view class="content-box">
		<u-overlay :show="isShowDateDropDown"></u-overlay>
		<u-toast ref="uToast" />
		<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="我的账单" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="my-bill-top-box">
			<view class="all-time-title" @click="dateDownUpEvent">
				<text>全部时间</text>
				<u-icon :name="!isShowDateDropDown ? 'arrow-down-fill' : 'arrow-up-fill'" color="#81838F" size="15"></u-icon>
			</view>
			<view class="date-drop-down" v-if="isShowDateDropDown">
				<view class="top-cut-btn">
					<view class="cut-month" :class="{'cutMonthStyle' : currentTypeIndex == index}" @click.stop="dateChooseEvent(item,index)" v-for="(item,index) in chooseTypeList" :key="index">
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="dropdown-area" v-if="currentTypeIndex == 0">
					<xfl-select
						:list="monthList"
						:clearable="false"
						:showItemNum="8"
						 @change="monthChange"
						placeholder = "请选择时间"
						:selectHideType="'hideAll'"
						:initValue="initValue"
					>
					</xfl-select>
				</view>
				<view class="time-quantum-area" v-if="currentTypeIndex == 1">
					<view class="time-quantum-title">
						<text>请选择查询开始时间和结束时间</text>
					</view>
					<view class="time-quantum-content">
						<view class="time-quantum-start" @click="timeQuantumStartEvent">
							<text>{{ getNowFormatDate(new Date(startDateValue),2) }}</text>
							<u-icon :name="!startDateShow ? 'arrow-down' : 'arrow-up'" color="#BBBBBB" size="10"></u-icon>
						</view>
						<view class="time-quantum-end" @click="timeQuantumEndEvent">
							<text>{{ getNowFormatDate(new Date(endDateValue),2) }}</text>
							<u-icon :name="!endDateShow ? 'arrow-down' : 'arrow-up'" color="#BBBBBB" size="10"></u-icon>
						</view>
					</view>
				</view>
				<view class="bottom-btn">
					<view class="bottom-reset" @click.stop="resetEvent">
						<text>重置</text>
					</view>
					<view class="bottom-sure" @click.stop="sureEvent">
						<text>确定</text>
					</view>
				</view>
			</view>
		</view>
		<view class="my-bill-bottom-box">
			<u-empty text="您还没有相关账单" mode="list" v-if="isShowNoData"></u-empty>
			<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
				<view class="my-bill-out-list" v-for="(item,index) in fullBillList" :key="index">
					<view class="my-bill-title">
						<text>{{ item.month }}</text>
					</view>
					<view class="my-bill-list" v-for="(innerItem,innerIndex) in item.list" :key="innerIndex" @click="enterBillDetailsEvent(innerItem)">
						<view class="my-bill-list-left">
							<view class="week-text">
								<text>{{ judgeWeek(innerItem.createTime) }}</text>
							</view>
							<view class="date-text">
								<text>{{ getNowFormatDate(new Date(innerItem.createTime),5) }}</text>
							</view>
						</view>
						<view class="my-bill-list-center">
							<view class="my-bill-list-center-top">
								<text>{{ innerItem.occurType === 'IN' ? '订单到账' : innerItem.occurType === 'OUT' ? '余额提现' : '未知类型' }}</text>
							</view>
							<view class="my-bill-list-center-bottom" v-if="innerItem.occurType === 'OUT'">
								<text>{{ `提现到${innerItem.cashBank}储蓄卡 (${cutLastSomeChars(innerItem.cashCard,4)})` }}</text>
							</view>
						</view>
						<view class="my-bill-list-right">
							<text>{{ innerItem.occurType === 'IN' ? '+' : innerItem.occurType === 'OUT' ? '-' : '' }}</text>
							<text>{{ `${innerItem.amount}元` }}</text>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="fullBillList.length > 0" />
			</scroll-view>
		</view>
		<view class="start-date">
			<u-datetime-picker
				:show="startDateShow"
				@close="startDateShow = false"
				@cancel="startDateShow = false"
				@confirm="startDateSureEvent"
				v-model="startDateValue"
				mode="date"
			></u-datetime-picker>
		</view>
		<view class="end-date">
			<u-datetime-picker
				:show="endDateShow"
				@close="endDateShow = false"
				@cancel="endDateShow = false"
				@confirm="endDateSureEvent"
				v-model="endDateValue"
				mode="date"
			></u-datetime-picker>
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
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { nurseBillPage } from '@/api/user.js'
	import xflSelect from '@/components/xfl-select/xfl-select.vue'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar,
			xflSelect
		},
		data() {
			return {
				infoText: '加载中···',
				showLoadingHint: false,
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				status: 'nomore',
				isShowNoData: false,
				billList: [],
				fullBillList: [],
				isShowDateDropDown: false,
				currentTypeIndex: 0,
				chooseTypeList: ['按月选择','按时间段选择'],
				monthList: [
					{id: 1,value: '一月'},
					{id: 2,value: '二月'},
					{id: 3,value: '三月'},
					{id: 4,value: '四月'},
					{id: 5,value: '五月'},
					{id: 6,value: '六月'},
					{id: 7,value: '七月'},
					{id: 8,value: '八月'},
					{id: 9,value: '九月'},
					{id: 10,value: '十月'},
					{id: 11,value: '十一月'},
					{id: 12,value: '十二月'}
				],
				initValue: new Date().getMonth(),
				startDateShow: false,
				startDateValue: Number(new Date()),
				currentSelectDate: this.getNowFormatDate(new Date(),3),
				endDateShow: false,
				endDateValue: Number(new Date())
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
		onLoad() {
			this.queryNurseBillPage({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize,
				start: this.joinFullDate(this.currentSelectDate,'start'),
				end: this.joinFullDate(this.currentSelectDate,'end')
			},true)
		},
		methods: {
			...mapMutations([
			]),
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryNurseBillPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						start: this.currentTypeIndex === 0 ? this.joinFullDate(this.currentSelectDate,'start') : this.getNowFormatDate(new Date(this.startDateValue),2),
						end: this.currentTypeIndex === 0 ? this.joinFullDate(this.currentSelectDate,'end') : this.getNowFormatDate(new Date(this.endDateValue),2)
					},false)
				}
			},
			
			// 截取字符串指定后几位
			cutLastSomeChars (str,count) {
				if (!str || str.length == 0) {
					return
				};
				const lastSomeChars = str.substr(str.length - count);
				return lastSomeChars
			},
			
			// 拼接完整日期
			joinFullDate (date,type) {
				let currentYear = new Date(date).getFullYear();
				let month = new Date(date).getMonth();
				let day = this.getMonthDay(currentYear,month);
				let temporaryMonth = month + 1 <= 9 ? '0' + (month + 1) : (month + 1);
				let temporaryDay = day <= 9 ? '0' + day : day;
				if (type === 'start') {
					return `${currentYear}-${temporaryMonth}-01`
				} else {
					return `${currentYear}-${temporaryMonth}-${temporaryDay}`
				}
			},
			
			// 查询护士账单
			queryNurseBillPage(data,flag) {
				this.billList = [];
				this.isShowNoData = false;
				if (flag) {
					this.fullBillList = [];
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				nurseBillPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.billList = res.data.data.list;
						if (res.data.data.list.length > 0) {
							this.billList.forEach((item) => {
								item.list.forEach((innerItem) => {
									innerItem.amount = fenToYuan(innerItem.amount)
								})
							})
						};
						this.fullBillList = this.fullBillList.concat(this.billList);
						if (this.fullBillList.length == 0) {
							this.isShowNoData = true
						} else {
							this.isShowNoData = false
						};
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false;
					} else {
						let totalPage = Math.ceil(this.totalCount/this.pageSize);
						if (this.currentPage >= totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore';
						}	
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false;
					} else {
						this.status = 'loadmore'
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 进入账单详情事件
			enterBillDetailsEvent (innerItem) {
				let mynavData = JSON.stringify(innerItem);
				uni.navigateTo({
					url: '/minePackage/pages/myBillDetails/myBillDetails?transmitData='+mynavData
				})
			},
			
			// 日期细分选择框切换事件
			dateDownUpEvent () {
				this.isShowDateDropDown = !this.isShowDateDropDown
			},
			
			// 日期类型切换事件
			dateChooseEvent (item,index) {
				this.currentTypeIndex = index
			},
			
			// 月选择下拉选择确定事件
			monthChange (val) {
				this.initValue = val.orignItem.value;
				let temporaryMonth = val['orignItem'].id > 9 ? val['orignItem'].id : `0${val['orignItem'].id}`;
				let temporaryDate = `${new Date().getFullYear()}-${temporaryMonth}`;
				this.currentSelectDate = this.getNowFormatDate(new Date (temporaryDate),3)
			},
			
			// 获取某月的天数
			getMonthDay(year, month) {
			  let days = new Date(year, month + 1, 0).getDate();
				if (days <= 9) {
					days = '0'+ days
				};
			  return days
			},
			
			// 时间选择重置事件
			resetEvent () {
				if (this.currentTypeIndex == 0) {
					this.initValue = 0
				} else if (this.currentTypeIndex == 1) {
					this.endDateShow = false;
					this.endDateValue = Number(new Date())
					this.startDateShow = false;
					this.startDateValue = Number(new Date())
				}
			},
			
			// 时间选择确定事件
			sureEvent () {
				if (this.currentTypeIndex === 0) {
					this.queryNurseBillPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						start: this.joinFullDate(this.currentSelectDate,'start'),
						end: this.joinFullDate(this.currentSelectDate,'end')
					},true)
				} else {
					if (this.startDateValue > this.endDateValue) {
						this.$refs.uToast.show({
							message: '开始日期不能大于结束日期!',
							type: 'error',
							position: 'center'
						});
						return
					};
					this.queryNurseBillPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						start: this.getNowFormatDate(new Date(this.startDateValue),2),
						end: this.getNowFormatDate(new Date(this.endDateValue),2)
					},true)
				};
				this.isShowDateDropDown = false
			},
			
			// 开始时间确定事件
			startDateSureEvent (value) {
				this.startDateValue = value['value'];
				if (this.startDateValue > this.endDateValue) {
					this.$refs.uToast.show({
						message: '开始日期不能大于结束日期!',
						type: 'error',
						position: 'center'
					});
					return
				};
				this.startDateShow = false
			},
			
			// 结束时间确定事件
			endDateSureEvent (value) {
				this.endDateValue = value['value'];
				if (this.startDateValue > this.endDateValue) {
					this.$refs.uToast.show({
						message: '结束日期不能小于开始日期!',
						type: 'error',
						position: 'center'
					});
					return;
				};
				this.endDateShow = false
			},
			
			// 时间段开始时间弹框切换事件
			timeQuantumStartEvent () {
				this.endDateShow = false;
				this.startDateShow = !this.startDateShow
			},
			
			// 时间段结束时间弹框切换事件
			timeQuantumEndEvent () {
				this.startDateShow = false;
				this.endDateShow = !this.endDateShow
			},
			
			// 判断周几
			judgeWeek (currentDate) {
			let date = new Date(currentDate);
			let day = date.getDay();
			switch (day) {
				case 0:
					return "周日"
					break;
				case 1:
					return "周一"
					break;
				case 2:
					return "周二"
					break;
				case 3:
					return "周三"
					break;
				case 4:
					return "周四"
					break;
				case 5:
					return "周五"
					break;
				case 6:
					return "周六"
					break
				}
			},
			
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
		::v-deep .u-transition {
			z-index: 1 !important;
			.u-toast__content {
			}
		};
		.top-area-box {
			z-index: 10;
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
		.my-bill-top-box {
			z-index: 10;
			height: 55px;
			padding: 26px;
			background: #F8F8F8;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			.all-time-title {
				display: flex;
				>text {
					font-size: 16px;
					color: #101010;
					margin-right: 4px
				}
			};
			.date-drop-down {
				padding: 14px 22px;
				box-sizing: border-box;
				position: absolute;
				top: 55px;
				left: 0;
				width: 100%;
				background: #fff;
				.top-cut-btn {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.cut-month {
						width: 48%;
						height: 42px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						color: #101010;
						border-radius: 30px;
						border: 1px solid #BBBBBB;
						box-sizing: border-box
					};
					.cutMonthStyle {
						background: #5064EB !important;
						color: #fff !important;
						border: none !important
					}
				};
				.dropdown-area {
					margin: 16px 0;
					::v-deep .show-box {
						.list {
							color: #101010;
							.item.active {
								color: #5064EB !important
							}
						};
						.list-container {
							.popper__arrow {
								display: none !important;
							}
						};
						.placeholder {
							color: #0E2442 !important
						};
						.right-arrow {
							color: #0E2442 !important
						}
					};
					::v-deep .show-box.active {
						border: 1px solid #BBBBBB;
					};
					::v-deep .list-container {
						transform: none !important;
						top: 48px
					}
				};
				.time-quantum-area {
					margin: 16px 0;
					.time-quantum-title {
						font-size: 14px;
						color: #101010;
						margin-bottom: 14px
					};
					.time-quantum-content {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.time-quantum-start {
							width: 44%;
							height: 38px;
							padding: 0 4px;
							box-sizing: border-box;
							border: 1px solid #BBBBBB;
							border-radius: 4px;
							background: #F3F3F3;
							display: flex;
							align-items: center;
							justify-content: space-between;
							>text {
								font-size: 18px;
								color: #101010;
							}
						};
						.time-quantum-end {
							width: 44%;
							height: 38px;
							padding: 0 4px;
							box-sizing: border-box;
							border: 1px solid #BBBBBB;
							border-radius: 4px;
							background: #F3F3F3;
							display: flex;
							align-items: center;
							justify-content: space-between;
							>text {
								font-size: 18px;
								color: #101010;
							}
						}
					}
				};
				.bottom-btn {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.bottom-reset {
						width: 48%;
						height: 42px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						color: #81838F;
						border-radius: 4px;
						border: 1px solid #BBBBBB;
						box-sizing: border-box
					};
					.bottom-sure {
						width: 48%;
						height: 42px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						color: #fff;
						border-radius: 4px;
						background: #5064EB !important
					}
				}
			}
		};
		.my-bill-bottom-box {
			flex: 1;
			padding: 10px;
			overflow: auto;
			box-sizing: border-box;
			position: relative;
			 ::v-deep .u-empty {
			 	position: absolute;
			 	top: 50%;
			 	left: 50%;
			 	transform: translate(-50%,-50%)
			 };
			 .scroll-view {
					height: 100%
			 };
			.my-bill-out-list {
				.my-bill-title {
					height: 34px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 14px;
					color: #101010;
				};
				.my-bill-list {
					display: flex;
					align-items: center;
					margin-bottom: 10px;
					padding: 12px 10px;
					box-sizing: border-box;
					box-shadow: 0px 2px 6px 0px #EFEFEF;
					.my-bill-list-left {
						.week-text {
							font-size: 14px;
							color: #101010;
							margin-bottom: 4px
						};
						.date-text {
							font-size: 14px;
							color: #101010;
						}
					};
					.my-bill-list-center {
						flex: 1;
						margin: 0 0 0 16px;
						.my-bill-list-center-top {
							font-size: 14px;
							color: #101010;
							margin-bottom: 16px;
						};
						.my-bill-list-center-bottom {
							font-size: 14px;
							color: #8A8A8A;
						}
					};
					.my-bill-list-right {
						font-size: 18px;
						color: #333333;
					}
				}
			}
		}
	}
</style>
