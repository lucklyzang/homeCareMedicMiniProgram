<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" fontColor="#FFFFFF" backState='3000' bgColor="none" title="数据统计" @backClick="backTo">
				</nav-bar> 
		  </view>
			<image :src="loginBackgroundPng"></image>
		</view>
		<view class="data-statistics-box">
			<view class="tips">
				<text>温馨提示：本页面数据每五分钟更新一次</text>
			</view>
			<view class="top-area">
				<view class="date-case date-case-day" @click="dayDialogCutEvent" v-if="statisticalTypeIndex == 0">
					<text>{{ getNowFormatDateText(new Date(dayDateValue),3) }}</text>
					<u-icon name="calendar" color="rgba(0, 0, 0, 0.25)" size="20"></u-icon>
				</view>
				<view class="date-case-week" v-if="statisticalTypeIndex == 1">
					<u-icon name="arrow-left" size="30" color="#101010" @click="getCurrentWeek('minus')"></u-icon>
					<text>{{`${getNowFormatDateText(currentStartWeekDate,3)} - ${getNowFormatDateText(currentEndWeekDate,3)}`}}</text>
					<u-icon name="arrow-right" size="30" :color="isWeekPlusCanCilck ? '#101010' : '#c9c9c9'" @click="getCurrentWeek('plus')"></u-icon>
				</view>
				<view class="date-case" @click="monthDialogCutEvent" v-if="statisticalTypeIndex == 2">
					<text>{{ getNowFormatDateText(new Date(monthDateValue),1) }}</text>
					<u-icon name="calendar" color="rgba(0, 0, 0, 0.25)" size="20"></u-icon>
				</view>
				<view class="statistical-type-cut">
					<view class="statistical-type-list" :class="{'statisticalListStyle' : statisticalTypeIndex == index}" @click="statisticalTypeCut(item,index)" v-for="(item,index) in statisticalTypeList" :key="index">
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="proceeds-order-form" v-if="statisticalTypeIndex == 0">
					<view class="proceeds-statistical">
						<view class="proceeds-statistical-title">
							<text>总收款 (元)</text>
						</view>
						<view class="money-content">
							<text>{{ `￥${dayProceeds}` }}</text>
						</view>
					</view>
					<view class="order-form-statistical">
						<view class="order-form-statistical-title">
							<text>订单量</text>
						</view>
						<view class="order-form-content">
							<text>{{ `${dayOrderCount}单` }}</text>
						</view>
					</view>
				</view>
				<view class="proceeds-order-form" v-if="statisticalTypeIndex == 1">
					<view class="proceeds-statistical">
						<view class="proceeds-statistical-title">
							<text>总收款 (元)</text>
						</view>
						<view class="money-content">
							<text>{{ `￥${weekProceeds}` }}</text>
						</view>
						<view class="increase-rate">
							<text>{{ `较上周增长${weekProceedsIncrease}` }} </text>
						</view>
					</view>
					<view class="order-form-statistical">
						<view class="order-form-statistical-title">
							<text>订单量</text>
						</view>
						<view class="order-form-content">
							<text>{{ `${weekOrderCount}单` }}</text>
						</view>
						<view class="order-form-rate">
							<text>{{ `较上周增长${weekOrderCountIncrease}` }} </text>
						</view>
					</view>
				</view>
				<view class="proceeds-order-form" v-if="statisticalTypeIndex == 2">
					<view class="proceeds-statistical">
						<view class="proceeds-statistical-title">
							<text>总收款 (元)</text>
						</view>
						<view class="money-content">
							<text>{{ `￥${monthProceeds}` }}</text>
						</view>
						<view class="increase-rate">
							<text>{{ `较上月增长${monthProceedsIncrease}` }} </text>
						</view>
					</view>
					<view class="order-form-statistical">
						<view class="order-form-statistical-title">
							<text>订单量</text>
						</view>
						<view class="order-form-content">
							<text>{{ `${monthOrderCount}单` }}</text>
						</view>
						<view class="order-form-rate">
							<text>{{ `较上月增长${monthOrderCountIncrease}` }} </text>
						</view>
					</view>
				</view>
			</view>
			<view class="center-area" v-if="statisticalTypeIndex == 1">
				<view class="line-chart-title">
					<text>周报订单趋势图</text>
				</view>
				<view class="line-chart">
					<u-empty text="暂无数据" v-if="!weekChartData.isShow"></u-empty>
					<qiun-data-charts v-if="weekChartData.isShow" :inScrollView="true" :canvas2d="true" canvasId="hfdjskfhdjkfdtef123gh" type="area" :opts="orderMonthOpts" :ontouch="true" :chartData="weekChartData['data']" />
				</view>
			</view>
			<view class="center-area" v-if="statisticalTypeIndex == 2">
				<view class="line-chart-title">
					<text>月报订单趋势图</text>
				</view>
				<view class="line-chart">
					<u-empty text="暂无数据" v-if="!monthChartData.isShow"></u-empty>
					<qiun-data-charts v-if="monthChartData.isShow" :inScrollView="true" :canvas2d="true" canvasId="abcdahdskdhtef123gh" type="area" :opts="orderMonthOpts" :ontouch="true" :chartData="monthChartData['data']" />
				</view>
			</view>
			<view class="bottom-area" v-if="statisticalTypeIndex == 0">
				<view class="order-type-title">
					<text>订单数量统计</text>
				</view>
				<view class="doughnut-chart">
					<u-empty text="暂无数据" v-if="!dayChartOrderTypeData.isShow"></u-empty>
					<qiun-data-charts
						v-if="dayChartOrderTypeData.isShow"
						type="column"
						:canvas2d="true"
						canvasId="jgfpogjfgtef123gh"
						:opts="orderTypeMonthOpts"
						:chartData="dayChartOrderTypeData.data"
					/>
				</view>
			</view>
			<view class="bottom-area" v-if="statisticalTypeIndex == 1">
				<view class="order-type-title">
					<text>订单数量统计</text>
				</view>
				<view class="doughnut-chart">
					<u-empty text="暂无数据" v-if="!weekChartOrderTypeData.isShow"></u-empty>
					<qiun-data-charts
						v-if="weekChartOrderTypeData.isShow"
						type="column"
						:canvas2d="true"
						canvasId="abfhjgkflgffgf7878atef123gh"
						:opts="orderTypeMonthOpts"
						:chartData="weekChartOrderTypeData.data"
					/>
				</view>
			</view>
			<view class="bottom-area" v-if="statisticalTypeIndex == 2">
				<view class="order-type-title">
					<text>订单数量统计</text>
				</view>
				<view class="doughnut-chart">
					<u-empty text="暂无数据" v-if="!monthChartOrderTypeData.isShow"></u-empty>
					<qiun-data-charts
						v-if="monthChartOrderTypeData.isShow"
						type="column"
						:canvas2d="true"
						canvasId="abfddsdsdsdfsf7878atef123gh"
						:opts="orderTypeMonthOpts"
						:chartData="monthChartOrderTypeData.data"
					/>
				</view>
			</view>
		</view>
		<view class="day-date">
			<u-datetime-picker
				:show="dayDateShow"
				@close="dayDateShow = false"
				@cancel="dayDateShow = false"
				@confirm="dayDateSureEvent"
				v-model="dayDateValue"
				mode="date"
			></u-datetime-picker>
		</view>
		<view class="month-date">
			<u-datetime-picker
				:show="monthDateShow"
				@close="monthDateShow = false"
				@cancel="monthDateShow = false"
				@confirm="monthDateSureEvent"
				v-model="monthDateValue"
				mode="year-month"
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
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { getDayOrderStatistics, getWeekOrderStatistics, getMonthOrderStatistics} from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				isWeekPlusCanCilck: true,
				loginBackgroundPng: require("@/static/img/login-background.png"),
				dayDateShow: false,
				dayDateValue: Number(new Date()),
				currentStartWeekDate: '',
				currentEndWeekDate: '',
				initWeekDate: '',
				monthDateShow: false,
				monthDateValue: Number(new Date()),
				dayProceeds: '',
				dayOrderCount: '',
				weekProceeds: '',
				weekOrderCount: '',
				weekProceedsIncrease: '',
				weekOrderCountIncrease: '',
				monthProceeds: '',
				monthOrderCount: '',
				monthProceedsIncrease: '',
				monthOrderCountIncrease: '',
				statisticalTypeList: ['日统计','周统计','月统计'],
				statisticalTypeIndex: 0,
				weekMap: {},
				timer: null,
				timerTwo: null,
				dayChartOrderTypeData: {
					isShow: true,
					noData: false,
					data: {}
				},
				weekChartOrderTypeData: {
					isShow: true,
					noData: false,
					data: {}
				},
				monthChartOrderTypeData: {
					isShow: true,
					noData: false,
					data: {}
				},
				orderTypeMonthOpts: {
					color: ["#5A7BF4"],
					padding: [20,10,10,10],
					legend: { show: false },
					extra: {
						column: {
							type: "group",
							width: 35,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				},
				weekChartData: {
					isShow: true,
					noData: false,
					data: {}
				},
				monthChartData: {
					isShow: true,
					noData: false,
					data: {}
				},
				orderMonthOpts: {
					dataPointShapeType: 'hollow',
					dataLabel: false,
					color: ["#5A7BF4"],
					padding: [10,10,10,10],
					legend: { show: false },
					xAxis: {
						itemCount: 7,
						axisLine: false
					},
					yAxis: {
						gridType: "solid",
						dashLength: 2,
						splitNumber: 4,
						data: [
						]
					},
					extra: {
						tooltip: {
							showBox: false
						},
						area: {
							type: "curve",
							opacity: 1,
							addLine: true,
							width: 2,
							gradient: true,
							activeType: "hollow"
						}
					}
				}
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
		onShow () {
			this.getDayOrderStatisticsEvent({
				day: this.getNowFormatDate(new Date(this.dayDateValue),2),
				careId: this.userInfo.careId
			})
		},
		onUnload () {
			this.clearTimer()
		},
		methods: {
			...mapMutations([
			]),
			
			clearTimer () {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;    
				};
				if (this.timerTwo) {
					clearTimeout(this.timerTwo);
					this.timerTwo = null;   
				}
			},
			
			getServerData() {
				//模拟从服务器获取数据时的延时
				this.weekChartData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.weekChartOrderTypeData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.monthChartData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.monthChartOrderTypeData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.dayChartOrderTypeData = {
					isShow: true,
					noData: true,
					data: {}
				};
				setTimeout(() => {
					this.dayChartOrderTypeData['isShow'] = true;
					this.dayChartOrderTypeData['noData'] = false;
					this.weekChartData['isShow'] = true;
					this.weekChartData['noData'] = false;
					this.weekChartOrderTypeData['isShow'] = true;
					this.weekChartOrderTypeData['noData'] = false;
					this.monthChartData['isShow'] = true;
					this.monthChartData['noData'] = false;
					this.monthChartOrderTypeData['isShow'] = true;
					this.monthChartOrderTypeData['noData'] = false;
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						categories: ["周一","周二","周三","周四","周五","周六","周日"],
						series: [
							{
								data: [35,8,25,37,4,20,24]
							}
						]
					};
					this.monthChartData['data'] = JSON.parse(JSON.stringify(res));
					this.weekChartData['data'] = JSON.parse(JSON.stringify(res));
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let resThree = {
						categories: ["妈妈护理","宝宝护理","健康护理","特色护理"],
						series: [
							{
								name: '',
								data: [30,88,22,65]
							}
						]
					};
					this.monthChartOrderTypeData['data'] = JSON.parse(JSON.stringify(resThree));
					this.weekChartOrderTypeData['data'] = JSON.parse(JSON.stringify(resThree));
					this.dayChartOrderTypeData['data'] = JSON.parse(JSON.stringify(resThree));
				}, 500)
			},
			
			// 公共定时器(设定时间后执行一次)
			commonOneTimerMethods (fn,time) {
				clearInterval(this.timer);
				this.timer = null;
				this.timerTwo = setTimeout(this.commonTimerMethods(fn,time),1000*60*time);
			},
			
			// 公共定时器(设定时间循环执行)
			commonTimerMethods (fn,time) {
				this.timer = setInterval(fn,1000*60*time);
			},
			
			// 月日期选择框显示隐藏切换事件
			monthDialogCutEvent () {
				this.monthDateShow = true;
			},
			
			// 月开始时间确定事件
			monthDateSureEvent (value) {
				this.monthDateValue = value['value'];
				this.monthDateShow = false;
				this.getMonthOrderStatisticsEvent({
					day: this.getNowFormatDate(new Date(this.monthDateValue),3),
					careId: this.userInfo.careId
				})
			},
					
			// 获取上一周、下一周
			getCurrentWeek (type) {
				this.isWeekPlusCanCilck = true;
				if (type == 'plus') {
					// 当前周不能超过下周
					let temporaryDate = this.getNowFormatDate(new Date(),2);
					if (new Date(this.currentEndWeekDate).getTime() >= new Date(temporaryDate).getTime()) {
						this.isWeekPlusCanCilck = false;
						return 
					};
					let time = this.weekMap["next"]
					this.weekMap = this.getWeek(new Date(time));
					this.currentStartWeekDate = `${this.weekMap['syear']}-${this.weekMap["stext"]}`;
					this.currentEndWeekDate = `${this.weekMap['eyear']}-${this.weekMap["etext"]}`;
					this.initWeekDate = this.getNowFormatDateText(new Date(this.currentStartWeekDate),3);
					if (new Date(this.currentEndWeekDate).getTime() >= new Date(temporaryDate).getTime()) {
						this.isWeekPlusCanCilck = false
					};
				} else {
					let time = this.weekMap["last"]
					this.weekMap = this.getWeek(new Date(time));
					this.currentStartWeekDate = `${this.weekMap['syear']}-${this.weekMap["stext"]}`;
					this.currentEndWeekDate = `${this.weekMap['eyear']}-${this.weekMap["etext"]}`;
					this.initWeekDate = this.getNowFormatDateText(new Date(this.currentStartWeekDate),3);
				};
				// 获取周统计数据
				this.getWeekOrderStatisticsEvent({
					careId: this.userInfo.careId,
					startDate: this.currentStartWeekDate,
					endDate: this.currentEndWeekDate
				})
			},
			
			// 天日期选择框显示隐藏切换事件
			dayDialogCutEvent () {
				this.dayDateShow = true;
			},
			
			// 天开始时间确定事件
			dayDateSureEvent (value) {
				this.dayDateValue = value['value'];
				this.dayDateShow = false;
				this.getDayOrderStatisticsEvent({
					day: this.getNowFormatDate(new Date(this.dayDateValue),2),
					careId: this.userInfo.careId
				})
			},
			
			// 统计类型切换事件
			statisticalTypeCut (item,index) {
				this.statisticalTypeIndex = index;
				if (this.statisticalTypeIndex === 0) {
					// 获取日统计数据
					this.getDayOrderStatisticsEvent({
						day: this.getNowFormatDate(new Date(this.dayDateValue),2),
						careId: this.userInfo.careId
					})
				} else if (this.statisticalTypeIndex === 1) {
					this.weekMap = this.getWeek(new Date());
					this.currentStartWeekDate = `${this.weekMap['syear']}-${this.weekMap["stext"]}`;
					this.currentEndWeekDate = `${this.weekMap['eyear']}-${this.weekMap["etext"]}`;
					this.initWeekDate = this.getNowFormatDateText(new Date(this.currentStartWeekDate),3);
					let temporaryDate = this.getNowFormatDate(new Date(),3);
					if (new Date(this.currentEndWeekDate).getTime() >= new Date(temporaryDate).getTime()) {
						this.isWeekPlusCanCilck = false
					};
					// 获取周统计数据
					this.getWeekOrderStatisticsEvent({
						careId: this.userInfo.careId,
						startDate: this.currentStartWeekDate,
						endDate: this.currentEndWeekDate
					})
				} else if (this.statisticalTypeIndex === 2) {
					// 获取月统计数据
					this.getMonthOrderStatisticsEvent({
						day: this.getNowFormatDate(new Date(this.monthDateValue),3),
						careId: this.userInfo.careId
					})
				}
			},
			
			// 获取日统计数据
			getDayOrderStatisticsEvent(data) {
				this.dayChartOrderTypeData = {
					isShow: true,
					noData: true,
					data: {}
				};
				getDayOrderStatistics(data).then((res) => {
					// 设定时间后执行一次
					// clearInterval(this.timerTwo);
					// this.timerTwo = null;
					// this.commonOneTimerMethods(this.getDayOrderStatisticsEvent({
					// 	day: this.getNowFormatDate(new Date(this.dayDateValue),2),
					// 	careId: this.userInfo.careId
					// }),5);
					if ( res && res.data.code == 0) {
						this.dayProceeds =  res.data.data.totalAmount;
						this.dayOrderCount = res.data.data.orderAmount;
						if (res.data.data.orderTypeReport.length > 0) {
							this.dayChartOrderTypeData['isShow'] = true;
							this.dayChartOrderTypeData['noData'] = false;
							let temporaryData = {
								categories: [],
								series: [
									{
										name: '',
										data: []
									}
								]
							};
							for (let item of res.data.data.orderTypeReport) {
								temporaryData.categories.push(item.typeName);
								temporaryData.series[0]['data'].push(item.count)
							};
							this.dayChartOrderTypeData['data'] = JSON.parse(JSON.stringify(temporaryData));
						} else {
							this.dayChartOrderTypeData = {
								isShow: false,
								noData: true,
								data: {}
							}
						}
					} else {
						this.dayChartOrderTypeData = {
							isShow: false,
							noData: false,
							data: {}
						};
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
				})
				.catch((err) => {
					// 设定时间后执行一次
					// clearInterval(this.timerTwo);
					// this.timerTwo = null;
					// this.commonOneTimerMethods(this.getDayOrderStatisticsEvent({
					// 	day: this.getNowFormatDate(new Date(this.dayDateValue),2),
					// 	careId: this.userInfo.careId
					// }),5);
					this.dayChartOrderTypeData = {
						isShow: false,
						noData: false,
						data: {}
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 获取周统计数据
			getWeekOrderStatisticsEvent(data) {
				this.weekChartData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.weekChartOrderTypeData = {
					isShow: true,
					noData: true,
					data: {}
				};
				getWeekOrderStatistics(data).then((res) => {
					// 设定时间后执行一次
					// clearInterval(this.timerTwo);
					// this.timerTwo = null;
					// this.commonOneTimerMethods(this.getWeekOrderStatisticsEvent({
					// 	careId: this.userInfo.careId,
					// 	startDate: this.currentStartWeekDate,
					// 	endDate: this.currentEndWeekDate
					// }),5);
					if ( res && res.data.code == 0) {
						this.weekProceeds = res.data.data.totalAmount;
						this.weekOrderCount = res.data.data.orderAmount;
						this.weekProceedsIncrease =  res.data.data.hasOwnProperty("cashGrow") ? res.data.data.cashGrow : '';
						this.weekOrderCountIncrease = res.data.data.hasOwnProperty("orderGrow") ? res.data.data.orderGrow : '';
						if (res.data.data.orderTypeReport.length > 0) {
							this.weekChartOrderTypeData['isShow'] = true;
							this.weekChartOrderTypeData['noData'] = false;
							let temporaryData = {
								categories: [],
								series: [
									{
										name: '',
										data: []
									}
								]
							};
							for (let item of res.data.data.orderTypeReport) {
								temporaryData.categories.push(item.typeName);
								temporaryData.series[0]['data'].push(item.count)
							};
							this.weekChartOrderTypeData['data'] = JSON.parse(JSON.stringify(temporaryData));
						} else {
							this.weekChartOrderTypeData = {
								isShow: false,
								noData: true,
								data: {}
							}
						};
						if (res.data.data.weekOrderReport.length > 0) {
							this.weekChartData['isShow'] = true;
							this.weekChartData['noData'] = false;
							let temporaryData = {
								categories: [],
								series: [
									{
										data: []
									}
								]
							};
							for (let item of res.data.data.weekOrderReport) {
								temporaryData.categories.push(this.judgeWeek(item.createTime));
								temporaryData.series[0]['data'].push(item.count)
							};
							this.weekChartData['data'] = JSON.parse(JSON.stringify(temporaryData));
						} else {
							this.weekChartData = {
								isShow: false,
								noData: true,
								data: {}
							}
						}
					} else {
						this.weekChartData = {
							isShow: false,
							noData: false,
							data: {}
						};
						this.weekChartOrderTypeData = {
							isShow: false,
							noData: false,
							data: {}
						};
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					// 设定时间后执行一次
					// clearInterval(this.timerTwo);
					// this.timerTwo = null;
					// this.commonOneTimerMethods(this.getWeekOrderStatisticsEvent({
					// 	careId: this.userInfo.careId,
					// 	startDate: this.currentStartWeekDate,
					// 	endDate: this.currentEndWeekDate
					// }),5);
					this.weekChartData = {
						isShow: false,
						noData: false,
						data: {}
					};
					this.weekChartOrderTypeData = {
						isShow: false,
						noData: false,
						data: {}
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 获取月统计数据
			getMonthOrderStatisticsEvent(data) {
				this.monthChartData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.monthChartOrderTypeData = {
					isShow: true,
					noData: true,
					data: {}
				};
				getMonthOrderStatistics(data).then((res) => {
					// 设定时间后执行一次
					// clearInterval(this.timerTwo);
					// this.timerTwo = null;
					// this.commonOneTimerMethods(this.getMonthOrderStatisticsEvent({
					// 	day: this.getNowFormatDate(new Date(this.monthDateValue),3),
					// 	careId: this.userInfo.careId
					// }),5);
					if ( res && res.data.code == 0) {
						this.monthProceeds = res.data.data.totalAmount;
						this.monthOrderCount = res.data.data.orderAmount;
						this.monthProceedsIncrease = res.data.data.hasOwnProperty("cashGrow") ? res.data.data.cashGrow : '';
						this.monthOrderCountIncrease = res.data.data.hasOwnProperty("orderGrow") ? res.data.data.orderGrow : '';
						if (res.data.data.orderTypeReport.length > 0) {
							this.monthChartOrderTypeData['isShow'] = true;
							this.monthChartOrderTypeData['noData'] = false;
							let temporaryData = {
								categories: [],
								series: [
									{
										name: '',
										data: []
									}
								]
							};
							for (let item of res.data.data.orderTypeReport) {
								temporaryData.categories.push(item.typeName);
								temporaryData.series[0]['data'].push(item.count)
							};
							this.monthChartOrderTypeData['data'] = JSON.parse(JSON.stringify(temporaryData));
						} else {
							this.monthChartOrderTypeData = {
								isShow: false,
								noData: true,
								data: {}
							}
						};
						if (res.data.data.monthOrderReport.length > 0) {
							this.monthChartData['isShow'] = true;
							this.monthChartData['noData'] = false;
							let temporaryData = {
								categories: [],
								series: [
									{
										data: []
									}
								]
							};
							for (let item of res.data.data.monthOrderReport) {
								temporaryData.categories.push(this.transitionWeekText(item.week));
								temporaryData.series[0]['data'].push(item.count)
							};
							this.monthChartData['data'] = JSON.parse(JSON.stringify(temporaryData));
						} else {
							this.monthChartData = {
								isShow: false,
								noData: true,
								data: {}
							}
						}
					} else {
						this.monthChartData = {
							isShow: false,
							noData: false,
							data: {}
						};
						this.monthChartOrderTypeData = {
							isShow: false,
							noData: false,
							data: {}
						};
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
				})
				.catch((err) => {
					// 设定时间后执行一次
					// clearInterval(this.timerTwo);
					// this.timerTwo = null;
					// this.commonOneTimerMethods(this.getMonthOrderStatisticsEvent({
					// 	day: this.getNowFormatDate(new Date(this.monthDateValue),3),
					// 	careId: this.userInfo.careId
					// }),5);
					this.monthChartData = {
						isShow: false,
						noData: false,
						data: {}
					};
					this.monthChartOrderTypeData = {
						isShow: false,
						noData: false,
						data: {}
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 获取当前周
			getWeek (date) {
				let one_day = 86400000;
				let day = date.getDay();
				// 设置时间为当天的0点
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				date.setMilliseconds(0);
				let week_start_time = date.getTime() - (day - 1) * one_day;
				let week_end_time = date.getTime() + (7 - day) * one_day;
				let last = week_start_time - 2*24*60*60*1000;
				let next = week_end_time + 24*60*60*1000;
				let month1 = new Date(week_start_time).getMonth()+1;
				let month2 = new Date(week_end_time).getMonth()+1;
				let day1 = new Date(week_start_time).getDate();
				let day2 = new Date(week_end_time).getDate();
				if(month1<10){
					month1 = "0"+month1;
				};
				if(month2<10){
					month2 = "0"+month2;
				};
				if(day1<10){
					day1 = "0"+day1;
				};
				if(day2<10){
					day2 = "0" + day2;
				};
				let time1 = month1+"-"+day1;
				let time2 = month2+"-"+day2;
				let map = new Map();
				map["syear"] =  new Date(week_start_time).getFullYear(); // 当前周周一的年份
				map["eyear"] =  new Date(week_end_time).getFullYear(); // 当前周周天的年份
				map["stime"] = week_start_time; // 当前周周一零点的毫秒数
				map["etime"] = week_end_time; // 当前周周日零点的毫秒数
				map["stext"] = time1; // 当前周 周一的日期 mm.dd 如 03.14
				map["etext"] = time2; // 当前周 周日的日期 mm.dd 如 03.20
				map["last"] = last; // 上一周 周六零点的毫秒数
				map["next"] = next; // 下一周  周一零点的毫秒数
				map["text"] = time1+" "+time2;
				return map;
			},
			
			// 转换周(文字)
			transitionWeekText (day) {
				let currentDay = day.toString();
				switch (currentDay) {
					case '1':
						return "第一周"
						break;
					case '2':
						return "第二周"
						break;
					case '3':
						return "第三周"
						break;
					case '4':
						return "第四周"
						break;
					case '5':
						return "第五周"
						break
				}		
			},
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 1(只展示年月) 2(只展示月) 3(只展示年月日)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator = "年";
				let seperator1 = "月";
				let seperator2 = "日";
				let year = new Date(currentDate).getFullYear();
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 1) {
					currentdate = year + seperator + month + seperator1
				} else if (type == 2) {
					currentdate = month + seperator1
				} else if (type == 3) {
					currentdate = year + seperator + month + seperator1 + strDate + seperator2
				};
				return currentdate
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
			
			// 顶部导航返回事件
			backTo () {
				this.clearTimer();
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
		background: #F2F2F2;
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
					color: #fff !important;
					text {
						color: #fff !important;
					}
				}
			};
			> image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100px
			}
		};
		.data-statistics-box {
			flex: 1;
			overflow: auto;
			.tips {
				height: 30px;
				line-height: 30px;
				font-size: 12px;
				color: #787F8E;
				padding-left: 20px;
				box-sizing: border-box;
			};
			.top-area {
				background: #fff;
				padding: 20px 0;
				.date-case {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 6px;
					box-sizing: border-box;
					width: 240px;
					height: 40px;
					border: 1px solid #D9D9D9;
					border-radius: 4px;
					font-size: 14px;
					color: rgba(0, 0, 0, 0.65);
					margin-left: 20px
				};
				.date-case-week {
					display: flex;
					align-items: center;
					padding: 0 6px;
					box-sizing: border-box;
					width: 320px;
					height: 40px;
					border-radius: 4px;
					font-size: 14px;
					color: rgba(0, 0, 0, 0.65);
					margin-left: 4px;
					>text {
						display: inline-block;
						height: 40px;
						flex: 1;
						text-align: center;
						line-height: 40px;
						margin: 0 4px;
						&:nth-of-type(1) {
							border: 1px solid #D9D9D9;
						}
					}
				};
				.statistical-type-cut {
					height: 50px;
					margin: 20px 0;
					display: flex;
					align-items: center;
					border-radius: 3px;
					border: 1px solid #4944FE;
					.statistical-type-list {
						flex: 1;
						height: 45px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 14px;
						color: #101010;
						position: relative;
						&:nth-child(1) ::after{
							content: '';
							width: 1px;
							height: 20px;
							background: #e9e9e9;
							position: absolute;
							right: -1px;
							top: 50%;
							transform: translateY(-50%)
						};
						&:nth-child(2) ::after{
							content: '';
							width: 1px;
							height: 20px;
							background: #e9e9e9;
							position: absolute;
							right: -1px;
							top: 50%;
							transform: translateY(-50%)
						}
					};
					.statisticalListStyle {
						color: #fff !important;
						background: #0052D9 !important;
						border-radius: 2px !important;
					}
				};
				.proceeds-order-form {
					padding: 0 20px;
					box-sizing: border-box;
					display: flex;
					.proceeds-statistical {
						position: relative;
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding-right: 4px;
						box-sizing: border-box;
						.proceeds-statistical-title {
							font-size: 14px;
							color: #787F8E
						};
						.money-content {
							font-size: 24px;
							color: #101010;
							margin: 20px 0;
							word-break: break-all
						};
						.increase-rate {
							font-size: 14px;
							color: #787F8E;
						}
					};
					.proceeds-statistical ::after {
						content: '';
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 1px;
						height: 90px;
						background: #e9e9e9
					};
					.order-form-statistical {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding-left: 4px;
						box-sizing: border-box;
						.order-form-statistical-title {
							font-size: 14px;
							color: #787F8E
						};
						.order-form-content {
							font-size: 24px;
							color: #101010;
							margin: 20px 0;
							word-break: break-all
						};
						.order-form-rate {
							font-size: 14px;
							color: #787F8E;
						}
					}
				}
			};
			.center-area {
				background: #fff;
				padding: 20px 0;
				height: 288px;
				margin: 20px 0;
				display: flex;
				flex-direction: column;
				.line-chart-title {
					font-size: 16px;
					color: #787F8E;
					padding-left: 20px;
					box-sizing: border-box;
					margin-bottom: 10px
				};
				.line-chart {
					flex: 1;
					position: relative;
					::v-deep .u-empty {
					 	position: absolute;
					 	top: 40%;
					 	left: 50%;
					 	transform: translate(-50%,-50%)
					}
				}
			};
			.bottom-area {
				background: #fff;
				padding: 20px 0 40px 0;
				.order-type-title {
					font-size: 16px;
					color: #787F8E;
					padding-left: 20px;
					box-sizing: border-box;
				};
				.doughnut-chart {
					margin: 20px 0;
					min-height: 260px;
					position: relative;
					::v-deep .u-empty {
					 	position: absolute;
					 	top: 40%;
					 	left: 50%;
					 	transform: translate(-50%,-50%)
					}
				};
				.order-type-box {
					display: flex;
					justify-content: space-between;
					padding: 0 20px;
					box-sizing: border-box;
					.order-type-nurse {
						position: relative;
						padding-right: 10px;
						box-sizing: border-box;
						flex: 1;
						.deal-money {
							display: flex;
							margin-bottom: 10px;
							word-break: break-all;
							justify-content: center;
							.deal-money-left {
								font-size: 14px;
								color: #787F8E;
								margin-right: 8px
							};
							.deal-money-right {
								font-size: 14px;
								color: #787F8E;
								flex: 1
							}
						};
						.deal-count {
							display: flex;
							word-break: break-all;
							justify-content: center;
							.deal-count-left {
								font-size: 14px;
								color: #787F8E;
								margin-right: 8px
							};
							.deal-count-right {
								font-size: 14px;
								color: #787F8E;
								flex: 1
							}
						}
					};
					.order-type-nurse ::after {
						content: '';
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 1px;
						height: 80px;
						background: #e9e9e9
					};
					.order-type-chaperonage {
						position: relative;
						padding-left: 10px;
						box-sizing: border-box;
						flex: 1;
						.deal-money {
							display: flex;
							margin-bottom: 10px;
							word-break: break-all;
							justify-content: center;
							.deal-money-left {
								font-size: 14px;
								color: #787F8E;
								margin-right: 8px
							};
							.deal-money-right {
								font-size: 14px;
								color: #787F8E;
								flex: 1
							}
						};
						.deal-count {
							display: flex;
							word-break: break-all;
							justify-content: center;
							.deal-count-left {
								font-size: 14px;
								color: #787F8E;
								margin-right: 8px
							};
							.deal-count-right {
								font-size: 14px;
								color: #787F8E;
								flex: 1
							}
						}
					}
				}
			}
		}
	}
</style>
