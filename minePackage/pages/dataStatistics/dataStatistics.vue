<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
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
				<view class="date-case" @click="dateDialogCutEvent">
					<text>{{ getNowFormatDate(new Date(startDateValue),3) }}</text>
					<u-icon name="calendar" color="rgba(0, 0, 0, 0.25)" size="20"></u-icon>
				</view>
				<view class="statistical-type-cut">
					<view class="statistical-type-list" :class="{'statisticalListStyle' : statisticalTypeIndex == index}" @click="statisticalTypeCut(item,index)" v-for="(item,index) in statisticalTypeList" :key="index">
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="proceeds-order-form">
					<view class="proceeds-statistical">
						<view class="proceeds-statistical-title">
							<text>总收款 (元)</text>
						</view>
						<view class="money-content">
							<text>￥ 685.00</text>
						</view>
						<view class="increase-rate">
							<text>较上月增长23%</text>
						</view>
					</view>
					<view class="order-form-statistical">
						<view class="order-form-statistical-title">
							<text>订单量</text>
						</view>
						<view class="order-form-content">
							<text>2500单</text>
						</view>
						<view class="order-form-rate">
							<text>较上月增长10%</text>
						</view>
					</view>
				</view>
			</view>
			<view class="center-area">
				<view class="line-chart-title">
					<text>月报订单趋势图</text>
				</view>
				<view class="line-chart">
					<u-empty text="暂无数据" v-if="!monthChartData.isShow"></u-empty>
					<qiun-data-charts v-if="monthChartData.isShow" :inScrollView="true" :canvas2d="true" canvasId="abcdatef123gh" type="area" :opts="orderMonthOpts" :ontouch="true" :chartData="monthChartData['data']" />
				</view>
			</view>
			<view class="bottom-area">
				<view class="order-type-title">
					<text>订单类型占比</text>
				</view>
				<view class="doughnut-chart">
					<view class="doughnut-chart-left">
						<view class="nurse-doughnut-chart">
							<u-empty text="暂无数据" v-if="!nurseMonthData.isShow"></u-empty>
							<qiun-data-charts
								v-if="nurseMonthData.isShow"
								type="arcbar"
								:canvas2d="true"
								canvasId="abfddf97sf7878atef123gh"
								:opts="nurseMonthOpts"
								:chartData="nurseMonthData.data"
							/>
						</view>
						<view class="nurse-doughnut-title">
							<text>上门护理</text>
						</view>
					</view>
					<view class="doughnut-chart-right">
						<view class="chaperonage-doughnut-chart">
							<u-empty text="暂无数据" v-if="!chaperonageMonthData.isShow"></u-empty>
							<qiun-data-charts
								v-if="chaperonageMonthData.isShow"
								type="arcbar"
								:canvas2d="true" 
								canvasId="abcddsdsdsf7878atef123gh"
								:opts="chaperonageMonthOpts"
								:chartData="chaperonageMonthData.data"
							/>
						</view>
						<view class="chaperonage-doughnut-title">
							<text>陪诊陪护</text>
						</view>
					</view>
				</view>
				<view class="order-type-box">
					<view class="order-type-nurse">
						<view class="deal-money">
							<view class="deal-money-left">
								<text>交易金额</text>
							</view>
							<view class="deal-money-right">
								<text>￥4321.00</text>
							</view>
						</view>
						<view class="deal-count">
							<view class="deal-count-left">
								<text>交易笔数</text>
							</view>
							<view class="deal-count-right">
								<text>453笔</text>
							</view>
						</view>
					</view>
					<view class="order-type-chaperonage">
						<view class="deal-money">
							<view class="deal-money-left">
								<text>交易金额</text>
							</view>
							<view class="deal-money-right">
								<text>￥4321.00</text>
							</view>
						</view>
						<view class="deal-count">
							<view class="deal-count-left">
								<text>交易笔数</text>
							</view>
							<view class="deal-count-right">
								<text>453笔</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="start-date">
			<u-datetime-picker
				:show="startDateShow"
				@close="startDateShow = false"
				@cancel="startDateShow = false"
				@confirm="startDateSureEvent"
				v-model="startDateValue"
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				loginBackgroundPng: require("@/static/img/login-background.png"),
				startDateShow: false,
				startDateValue: Number(new Date()),
				statisticalTypeList: ['日统计','周统计','月统计'],
				statisticalTypeIndex: 0,
				nurseMonthData: {
					isShow: true,
					noData: false,
					data: {}
				},
				nurseMonthOpts: {
					color: ["#3926C8"],
					padding: undefined,
					title: {
						name: "￥43231.00",
						fontSize: 14,
						color: "#3926C8"
					},
					subtitle: {
						name: ""
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 8,
							backgroundColor: "#E9E9E9",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2
						}
					}
				},
				chaperonageMonthData: {
					isShow: true,
					noData: false,
					data: {}
				},
				chaperonageMonthOpts: {
					color: ["#33DB3D"],
					padding: undefined,
					title: {
						name: "￥43231.00",
						fontSize: 14,
						color: "#33DB3D"
					},
					subtitle: {
						name: ""
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 8,
							backgroundColor: "#E9E9E9",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2
						}
					}
				},
				monthChartData: {
					isShow: true,
					noData: false,
					data: {}
				},
				orderMonthOpts: {
					dataPointShapeType: 'hollow',
					dataLabel: false,
					color: ["#5064EB"],
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
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onReady () {
			this.getServerData()
		},
		methods: {
			...mapMutations([
			]),
			
			getServerData() {
				//模拟从服务器获取数据时的延时
				this.monthChartData = {
					isShow: true,
					noData: true,
					data: {}
				};
				this.nurseMonthData = {
					isShow: true,
					noData: true,
					data: {}
				},
				this.chaperonageChartData = {
					isShow: true,
					noData: true,
					data: {}
				},
				setTimeout(() => {
					this.monthChartData['isShow'] = true;
					this.monthChartData['noData'] = false;
					this.nurseMonthData['isShow'] = true;
					this.nurseMonthData['noData'] = false;
					this.chaperonageChartData['isShow'] = true;
					this.chaperonageChartData['noData'] = false;
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
					let resTwo = {
						series: [
							{
								name: "正确率",
								color: "#3926C8",
								data: 0.8
							}
						]
					};
					this.nurseMonthData['data'] = JSON.parse(JSON.stringify(resTwo));
					let resThree = {
						series: [
							{
								name: "正确率",
								color: "#33DB3D",
								data: 0.2
							}
						]
					};
					this.chaperonageMonthData['data'] = JSON.parse(JSON.stringify(resThree));
				}, 500)
			},
					
			// 日期选择框显示隐藏切换事件
			dateDialogCutEvent () {
				this.startDateShow = true
			},
			
			// 开始时间确定事件
			startDateSureEvent (value) {
				this.startDateValue = value['value'];
				this.startDateShow = false
			},
			
			// 统计类型切换事件
			statisticalTypeCut (item,index) {
				this.statisticalTypeIndex = index
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
		background: #F2F2F2;
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
					display: flex;
					justify-content: space-between;
					.doughnut-chart-left {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.nurse-doughnut-chart {
							width: 30%;
							height: 120px;
							position: relative;
							::v-deep .u-empty {
							 	position: absolute;
							 	top: 40%;
							 	left: 50%;
							 	transform: translate(-50%,-50%)
							}
						};
						.nurse-doughnut-title {
							margin-top: 10px;
							font-size: 16px;
							color: #3926C8;
						}
					};
					.doughnut-chart-right {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.chaperonage-doughnut-chart {
							width: 30%;
							height: 120px;
							position: relative;
							::v-deep .u-empty {
							 	position: absolute;
							 	top: 40%;
							 	left: 50%;
							 	transform: translate(-50%,-50%)
							}
						};
						.chaperonage-doughnut-title {
							margin-top: 10px;
							font-size: 16px;
							color: #33DB3D;
						}
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
