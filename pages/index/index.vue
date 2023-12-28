<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 筛选弹框 -->
		<view class="screen-dialog-box">
			<u-popup :show="screenDialogShow" @close="screenDialogCloseEvent" mode="right" :closeOnClickOverlay="true" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
				<view class="screen-top">
					<view class="service-category">
						<view class="service-category-title">
							<text>服务类别</text>
						</view>
						<view class="service-category-content">
							<view class="service-category-list" :class="{'serviceCategoryListStyle': item.selected == true }" @click="serviceCategoryItemClickEvent(item,index)" v-for="(item,index) in serviceCategoryList" :key="index">
								<text>{{ item.content }}</text>
							</view>
						</view>
					</view>
					<view class="service-category service-project">
						<view class="service-category-title">
							<text>服务项目</text>
						</view>
						<view class="service-category-content">
							<view class="service-category-list" :class="{'serviceProjectListStyle': item.selected == true }" @click="serviceProjectItemClickEvent(item,index)" v-for="(item,index) in serviceProjectList" :key="index">
								<text>{{ item.content }}</text>
							</view>
						</view>
					</view>
					<view class="distance-section">
						<view class="distance-section-title">
							<text>距离区间 (km)</text>
						</view>
						<view class="distance-section-content">
							<view class="distance-section-left">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最近距离"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="minDistanceValue"
								></u--input>
							</view>
							<view class="distance-section-center"></view>
							<view class="distance-section-left distance-section-right">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最远距离"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="maxDistanceValue"
								></u--input>
							</view>
						</view>
					</view>
					<view class="distance-section price-section">
						<view class="distance-section-title">
							<text>价格区间 (元)</text>
						</view>
						<view class="distance-section-content">
							<view class="distance-section-left">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最低价格"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="minPriceValue"
								></u--input>
							</view>
							<view class="distance-section-center"></view>
							<view class="distance-section-left distance-section-right">
								<u--input
									placeholderStyle="color:#BBBBBB;font-size:12px"
									placeholder="自定义最高价格"
									fontSize="12px"
									color="#333"
									type="number"
									border="none"
									v-model="maxPriceValue"
								></u--input>
							</view>
						</view>
					</view>
				</view>
				<view class="screen-bottom">
					<view class="screen-bottom-left" @click="screenResetEvent">
						<text>重置</text>
					</view>
					<view class="screen-bottom-right" @click="screenSureEvent">
						<text>确定</text>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 报警弹框 -->
		<view class="call-police-dialog-box">
			<u-popup :show="callPoliceDialogShow" @close="callPoliceDialogShow = false" :closeable="true" mode="bottom" :closeOnClickOverlay="false" :safeAreaInsetBottom="true">
				<view class="help-center-title">
					<text>求助中心</text>
				</view>
				<view class="help-center-content">
					<text>如遇突发情况，请立即进行报警。</text>
				</view>
				<view class="help-bottom-btn" @click="callPoliceEvent">
					<image src="@/static/img/call-police-dialog.png"></image>
				</view>
			</u-popup>
		</view>
		<!-- 报警按钮 -->
		<view class="call-police-box" @click="callPoliceDialogShowEvent">
			<image src="@/static/img/call-police-btn.png"></image>
		</view>
		<view class="top-area">
			<image src="@/static/img/home-site.png"></image>
			<text>成都市武侯区三和街道</text>
		</view>
		<view class="loading-box" v-if="showLoadingHint">
			<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
		</view>
		<view class="banner-area-box">
			<u-swiper @click="swiperClickEvent" keyName="image"  indicator :list="bannerList"></u-swiper>
		</view>
		<view class="center-area">
			<view class="authentication-info-box">
				<view class="authentication-info-left">
					请先完成实名认证、证书认证、完善个人信息审核通过后才可接单
				</view>
				<view class="authentication-info-right" @click="identityAuthenticationEvent">
					<text>去认证</text>
				</view>
			</view>
			<view class="select-box">
				<view class="smart-sort">
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
				<view class="service-category" v-if="isShowServiceCategory">
					<w-select
							style="margin-left:10px;"
							:multiple="true"
							v-model='serviceCategoryValue'
							defaultValue="服务类别"
							:list='serviceCategoryList'
							valueName='content' 
							keyName="id"
							@dropDownCutHide="serviceCategoryHide"
							@change='serviceCategoryChange'
						>
					</w-select>
				</view>
				<view class="service-project" v-if="isShowServiceProject">
					<w-select
							style="margin-left:10px;" 
							:multiple="true"
							v-model='serviceProjectValue'
							defaultValue="服务项目"
							:list='serviceProjectList'
							valueName='content' 
							keyName="id"
							@dropDownCutHide="serviceServiceHide"
							@change='serviceProjectChange'
						>
					</w-select>
				</view>
				<view class="screen-box" @click="screenEvent">
					<text>筛选</text>
					<image src="@/static/img/screen-icon.png"></image>
				</view>
			</view>
			<view class="real-time-order-form-title-box">
				<text>实时订单</text>
			</view>
			<view class="real-time-order-form-list-box">
				<u-empty text="暂无实时订单" mode="list" v-if="isShowNoData"></u-empty>
				<scroll-view class="scroll-view" scroll-y="true"  @scrolltolower="scrolltolower">
					<view class="real-time-order-form-list" v-for="(item,index) in fullTradeList" :key="index">
						<view class="real-time-order-form-list-top">
							<view class="real-time-order-form-list-top-left">
								<text>{{ item.items[0]['spuName'] }}</text>
							</view>
							<view class="real-time-order-form-list-top-right">
								<text>{{ item.realTime }}</text>
							</view>
						</view>
						<view class="real-time-order-form-list-bottom">
							<view class="price-box">
								<image src="@/static/img/order-rmb.png"></image>
								<text>{{ `${item.payPrice}` }}</text>
							</view>
							<view class="site-box">
								<image src="@/static/img/order-site.png"></image>
								<text>{{ item.receiverDetailAddress }}</text>
								<text>抢单</text>
							</view>
							<view class="date-box">
								<image src="@/static/img/order-date.png"></image>
								<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" v-if="fullTradeList.length > 0" />
				</scroll-view>	
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
		fenToYuan,
		formatMsgTime
	} from '@/common/js/utils'
	import { getUserBannerList, createCallPolice, medicalCareHasAuth } from '@/api/user.js'
	import { getRealtimeTradeOrderPage } from '@/api/orderForm.js'
	import _ from 'lodash'
	import wSelect from '@/components/w-select/w-select.vue'
	export default {
		components: {
			wSelect
		},
		data() {
			return {
				infoText: '加载中···',
				currentPageNum: 1,
				pageSize: 20,
				totalCount: 0,
				status: 'nomore',
				isShowNoData: false,
				tradeList: [],
				fullTradeList: [],
				bannerList: [],
				callPoliceDialogShow: false,
				isShowScreenIcon: false,
				screenDialogShow: false,
				showLoadingHint: false,
				isShowHomeNoData: false,
				canAcceptOrder: false,
				serviceCategoryIndex: null,
				serviceProjectIndex: null,
				minDistanceValue: '',
				maxDistanceValue: '',
				minPriceValue: '',
				maxPriceValue: '',
				smartSortValue: "",
				longitude: '',
				latitude: '',
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
				isShowServiceCategory: true,
				serviceCategoryValue: [],
				serviceCategoryList: [
					{
						id: 1,
						content: '母婴护理',
						selected: false
					}, 
					{
						id: 2,
						content: '宝宝护理',
						selected: false
					},
					{
						id: 3,
						content: '慢病护理',
						selected: false
					}, 
					{
						id: 4,
						content: '基本护理',
						selected: false
					}
				],
				isShowServiceProject: true,
				serviceProjectValue: [],
				serviceProjectList: [
					{
						id: 1,
						content: '打针',
						selected: false
					}, 
					{
						id: 2,
						content: '喂奶',
						selected: false
					},
					{
						id: 3,
						content: '通乳',
						selected: false
					}, 
					{
						id: 4,
						content: '洗澡',
						selected: false
					}
				],
				temporaryCategoriesArr: [],
				temporarySpuIdsArr: []
			}
		},	
		onShow() {
			this.queryUserBannerList({position: 1});
			this.queryMedicalCareHasAuth();
			this.queryTradeOrderPage({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize,
				categories: this.temporaryCategoriesArr,
				spuIds: this.temporarySpuIdsArr,
				minPrice: this.minPriceValue,
				maxPrice: this.maxPriceValue
			},true)
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			}
		},
		methods: {
			...mapMutations([
			]),
			
			// 轮播图点击事件
			swiperClickEvent (index) {
				uni.navigateTo({
					url: '/messagePackage/pages/advertisingDetails/advertisingDetails'
				})
			},
			
			// 身份认证事件
			identityAuthenticationEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/identityAuthenticationHome/identityAuthenticationHome'
				})
			},
			
			// 服务类别点击事件
			serviceCategoryItemClickEvent (item,index) {
				this.serviceCategoryList[index]['selected'] = !this.serviceCategoryList[index]['selected']
			},
			
			// 服务项目点击事件
			serviceProjectItemClickEvent (item,index) {
				this.serviceProjectList[index]['selected'] = !this.serviceProjectList[index]['selected']
			},
			
			// 服务项目下拉框隐藏事件
			serviceServiceHide () {
				this.temporaryCategoriesArr = [];
				this.temporarySpuIdsArr = [];
				if (this.serviceProjectValue.length > 0) {
					for (let item of this.serviceProjectValue) {
						this.temporarySpuIdsArr.push(item.id)
					};
					if (this.serviceCategoryValue.length > 0) {
						for (let item of this.serviceCategoryValue) {
							this.temporaryCategoriesArr.push(item.id)
						}
					}
				};
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoData = false;
				this.fullTradeList = [];
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					categories: this.temporaryCategoriesArr,
					spuIds: this.temporarySpuIdsArr,
					minPrice: this.minPriceValue,
					maxPrice: this.maxPriceValue
				},true)
			},
			
			// 服务类别下拉框隐藏事件
			serviceCategoryHide () {
				this.temporaryCategoriesArr = [];
				this.temporarySpuIdsArr = [];
				if (this.serviceCategoryValue.length > 0) {
					for (let item of this.serviceCategoryValue) {
						this.temporaryCategoriesArr.push(item.id)
					};
					if (this.serviceProjectValue.length > 0) {
						for (let item of this.serviceProjectValue) {
							this.temporarySpuIdsArr.push(item.id)
						}
					}
				};
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoData = false;
				this.fullTradeList = [];
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					categories: this.temporaryCategoriesArr,
					spuIds: this.temporarySpuIdsArr,
					minPrice: this.minPriceValue,
					maxPrice: this.maxPriceValue
				},true)
			},
			
			// 筛选弹框显示事件
			screenEvent () {
				this.screenDialogShow = !this.screenDialogShow;
				
			},
			
			// 筛选弹框关闭事件
			screenDialogCloseEvent () {
				this.screenDialogShow = false
			},
			
			// 筛选重置事件
			screenResetEvent () {
				this.minDistanceValue = '';
				this.maxDistanceValue = '';
				this.minPriceValue = '';
				this.maxPriceValue = '';
				this.isShowServiceCategory = false;
				this.isShowServiceProject = false;
				setTimeout(() => {
					this.isShowServiceCategory = true;
					this.isShowServiceProject = true;
				},200);
				this.serviceProjectValue = [];
				this.serviceCategoryValue = [];
				this.serviceCategoryList.forEach((item) => {
					if (item.selected) {
						item.selected = false
					}
				});
				this.serviceProjectList.forEach((item) => {
					if (item.selected) {
						item.selected = false
					}
				})
			},
			
			// 筛选确定事件
			screenSureEvent () {
				if (this.minDistanceValue) {
					if (this.maxDistanceValue == '') {
						this.$refs.uToast.show({
							message: '最远距离不能为空',
							type: 'error',
							position: 'center'
						});
						return
					}
				};
				if (this.maxDistanceValue) {
					if (this.minDistanceValue == '') {
						this.$refs.uToast.show({
							message: '最近距离不能为空',
							type: 'error',
							position: 'center'
						});
						return
					}
				};
				if (this.minPriceValue) {
					if (this.maxPriceValue == '') {
						this.$refs.uToast.show({
							message: '最高价格不能为空',
							type: 'error',
							position: 'center'
						});
						return
					}
				};
				if (this.maxPriceValue) {
					if (this.minPriceValue == '') {
						this.$refs.uToast.show({
							message: '最低价格不能为空',
							type: 'error',
							position: 'center'
						});
						return
					}
				};
				if (this.minDistanceValue > this.maxDistanceValue) {
					this.$refs.uToast.show({
						message: '最近距离不能大于最远距离',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (this.minPriceValue > this.maxPriceValue) {
					this.$refs.uToast.show({
						message: '最低价格不能大于最高价格',
						type: 'error',
						position: 'center'
					});
					return
				};
				this.screenDialogShow = false;
				this.temporaryCategoriesArr = [];
				this.temporarySpuIdsArr = [];
				let selectServiceCategoryList = this.serviceCategoryList.filter((item) => { return item.selected == true });
				let selectServiceProjectList = this.serviceProjectList.filter((item) => { return item.selected == true });
				this.serviceProjectValue = [];
				this.serviceCategoryValue = [];
				if (selectServiceCategoryList.length > 0) {
					for (let item of selectServiceCategoryList) {
						this.temporaryCategoriesArr.push(item.id);
						this.serviceCategoryValue.push({
							id: item.id,
							content: item.content,
							selected: item.selected
						})
					};
					this.isShowServiceCategory = false;
					setTimeout(() => {
						this.isShowServiceCategory = true;
					},200)
				};
				if (selectServiceProjectList.length > 0) {	
					for (let item of selectServiceProjectList) {
						this.temporarySpuIdsArr.push(item.id);
						this.serviceProjectValue.push({
							id: item.id,
							content: item.content,
							selected: item.selected
						})
					};
					this.isShowServiceProject = false;
					setTimeout(() => {
						this.isShowServiceProject = true;
					},200)
				};	
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoData = false;
				this.fullTradeList = [];
				this.queryTradeOrderPage({
					pageNo: this.currentPageNum,
					pageSize: this.pageSize,
					categories: this.temporaryCategoriesArr,
					spuIds: this.temporarySpuIdsArr,
					minPrice: this.minPriceValue,
					maxPrice: this.maxPriceValue
				},true)
			},
			
			// 智能排序下拉框值改变事件
			smartSortChange(e) {
				console.log(e)
			},
			
			// 服务类别下拉框值改变事件
			serviceCategoryChange(e) {
				console.log('服务类别', e, this.serviceCategoryValue)
			},
			
			// 服务项目下拉框值改变事件
			serviceProjectChange(e) {
				console.log(e)
			},
			
			// 格式化时间(带中文)
			getNowFormatDateText(currentDate,type) {
				// type: 2(只展示月)
				let currentdate;
				let strDate = new Date(currentDate).getDate();
				let seperator1 = "月";
				let seperator2 = "日";
				let month = new Date(currentDate).getMonth() + 1;
				let hour = new Date(currentDate).getHours();
				if (type == 2) {
					currentdate = month + seperator1
				} else {
					currentdate = month + seperator1 + strDate + seperator2
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
			
			scrolltolower () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPageNum >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPageNum = this.currentPageNum + 1;
					this.queryTradeOrderPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						categories: this.temporaryCategoriesArr,
						spuIds: this.temporarySpuIdsArr,
						minPrice: this.minPriceValue,
						maxPrice: this.maxPriceValue
					},false)
				}
			},
			
			// 查询实时交易订单
			queryTradeOrderPage(data,flag) {
				this.tradeList = [];
				this.isShowNoData = false;
				if (flag) {
					this.fullTradeList = [];
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				getRealtimeTradeOrderPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.totalCount = res.data.data.total;
						this.tradeList = res.data.data.list;
						// 切换到待评价订单时只展示待评价的订单(已评价和已完成订单状态都是3)
						if (res.data.data.list.length > 0) {
							if (this.current == 4) {
								this.tradeList = this.tradeList.filter((item) => { return item.commentStatus == false })
							};
							this.tradeList.forEach((item) => {
								item.payPrice = fenToYuan(item.payPrice);
								item.realTime = formatMsgTime(this.getNowFormatDate(new Date(item.createTime),4))
							})
						};
						this.fullTradeList = this.fullTradeList.concat(this.tradeList);
						if (this.fullTradeList.length == 0) {
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
			
			// 报警事件
			callPoliceEvent () {
				this.showLoadingHint = true;
				this.infoText = '报警中...';
				createCallPolice({
				  userId: this.userInfo.userId,
					name: !this.userBasicInfo.nickname ? '' : this.userBasicInfo.nickname,
					description: '',
					mobile: !this.userBasicInfo.mobile ? '' : this.userBasicInfo.mobile,
					coordinate: this.longitude ? `${this.longitude},${this.latitude}` : '',
					status: 0,
					processor: 0,
					handleTime: '',
					handleResult: ''
				}).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '报警成功',
							type: 'success',
							position: 'center'
						})
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
					this.callPoliceDialogShow = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.callPoliceDialogShow = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 查询医护是否可以接单
			queryMedicalCareHasAuth () {
				this.showLoadingHint = true;
				medicalCareHasAuth().then((res) => {
					if ( res && res.data.code == 0) {
						this.canAcceptOrder = res.data.data.can
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 获取首页banner列表
			queryUserBannerList (data) {
				this.bannerList = [];
				getUserBannerList(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.bannerList.push({
									image: item.picUrl,
									title: ''
								})
							}
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// 报警弹框弹出事件
			callPoliceDialogShowEvent () {
				this.isGetLocation();
				this.callPoliceDialogShow = true
			},
			
			isGetLocation(a = "scope.userLocation") { //检查当前是否已经授权访问scope属性
				var _this = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting[a]) { //每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
							_this.getAuthorizeInfo()
						} else {
							_this.getLocation()
						}
					}
				})
			},
			
			getAuthorizeInfo(a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				var _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
						_this.getLocation()
					}
				})
			},
			
			//获取当前所在位置的经纬度
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						console.log('经纬度地址',res);
						this.longitude = res.longitude;
						this.latitude = res.latitude
					},
					fail: (err) => {
						console.log('err',err)
					}
				})
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
		padding-bottom: 0;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
		.screen-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					width: 80%;
					.u-popup__content {
						padding: 20px;
						.screen-top {
							flex: 1;
							overflow: auto;
							.service-category {
								margin-bottom: 14px;
								.service-category-title {
									font-size: 12px;
									color: #666666;
									margin-bottom: 10px;
								};
								.service-category-content {
									display: flex;
									flex-wrap: wrap;
									.service-category-list {
										display: flex;
										align-items: center;
										justify-content: center;
										margin: 0 10px 10px 0;
										background: #EEEEEE;
										border-radius: 4px;
										padding: 4px 10px;
										box-sizing: border-box;
										font-size: 12px;
										color: #333333;
									};
									.serviceCategoryListStyle {
										background: rgba(80, 100, 235, 0.65) !important;
										color: #fff;
									}
								}
							};
							.service-project {
								margin-bottom: 14px;
								.service-category-list {
									padding: 4px 20px !important;
								};
								.service-category-content {
									.serviceProjectListStyle {
										background: rgba(80, 100, 235, 0.65) !important;
										color: #fff;
									}
								}
							};
							.distance-section {
								margin-bottom: 20px;
								.distance-section-title {
									font-size: 12px;
									color: #666666;
									margin-bottom: 10px;
								};
								.distance-section-content {
									display: flex;
									align-items: center;
									.distance-section-left {
										.u-input {
											background: #F1F1F1 !important;
											border-radius: 20px !important;
											padding: 0 10px !important;
											box-sizing: border-box !important;
										}
									};
									.distance-section-center {
										width: 24px;
										height: 1px;
										background: #BBBBBB;
										margin: 0 10px;
									}
								}
							};
							.price-section {
								margin-bottom: 0 !important
							}
						};
						.screen-bottom {
							width: 100%;
							height: 80px;
							display: flex;
							align-items: flex-end;
							justify-content: flex-end;
							.screen-bottom-left {
								height: 34px;
								width: 95px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-top-left-radius: 20px;
								border-bottom-left-radius: 20px;
								font-size: 17px;
								color: #5064EB;
								border: 1px solid #5064EB;
								box-sizing: border-box;
								font-weight: bold
							};
							.screen-bottom-right {
								height: 34px;
								width: 95px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-top-right-radius: 20px;
								border-bottom-right-radius: 20px;
								background: #5064EB;
								font-size: 17px;
								color: #fff;
								font-weight: bold
							}
						}
					}
				}
			}	
		};
		.call-police-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					.u-popup__content {
						border-radius: 0;
						border-top-left-radius: 20px;
						border-top-right-radius: 20px;
						padding: 20px 10px;
						box-sizing: border-box;
						.help-center-title {
							text-align: center;
							font-size: 20px;
							color: #101010;
							margin-bottom: 10px
						};
						.help-center-content {
							text-align: center;
							font-size: 14px;
							color: #101010;
							margin: 20px 0
						};
						.help-bottom-btn {
							text-align: center;
							image {
								height: 116px;
								width: 280px;
							}
						}
					}
				}
			}	
		};
		.call-police-box {
			position: fixed;
			z-index: 100;
			left: 0;
			bottom: 4vh;
			image {
				width: 73px;
				height: 43px
			}
		};
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		background: #fff;
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		};
		.uni-ec-canvas {
			width: 100%;
			height: 100px; 
			display: block;
		};
		.top-area {
			height: 120px;
			background: #5A7BF4;
			display: flex;
			align-items: center;
			padding: 10px;
			box-sizing: border-box;
			width: 100%;
			margin: 0 0 10px 0;
			image {
				width: 24px;
				height: 24px;
				margin-right: 6px;
			};
			text {
				@include no-wrap;
				display: inline-block;
				flex: 1;
				font-size: 13px;
				color: #fff
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.banner-area-box {
			min-height: 135px;
		};
		.center-area {
			flex: 1;
			display: flex;
			flex-direction: column;
			height: 0;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.authentication-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 12px;
				box-sizing: border-box;
				height: 60px;
				.authentication-info-left {
					flex: 1;
					line-height: 20px;
					word-break: break-all;
					font-size: 14px;
					color: #E86F50;
					margin-right: 20px;
				};
				.authentication-info-right {
					background: #5064EB;
					width: 84px;
					height: 31px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 18px;
					text {
						font-size: 14px;
						color: #fff
					}
				}
			};
			.select-box {
				display: flex;
				.smart-sort {
					::v-deep .w-select {
						.select-wrap {
							justify-content: flex-start !important;
							input {
								width: 52px;
								box-sizing: border-box;
								flex: none !important
							}
						}
					}
				};
				>view {
					flex: 1;
					width: 25%;
					display: flex;
					align-content: center;
					::v-deep .w-select {
						.select-wrap {
							border: none !important;
							width: 100% !important;
							input {
								color: #454A58 !important;
								font-size: 12px !important
							};
							.input-placeholder {
								color: #454A58;
								font-size: 12px;
							};
							.uni-input {
								color: #454A58 !important;
								font-size: 12px !important
							}
						}
					}
				};
				.screen-box {
					flex: none !important;
					width: 60px;
					margin-left: 10px;
					display: flex;
					align-items: center;
					>text {
						display: inline-block;
						font-size: 12px;
						color: #454A58;
						margin-right: 6px;
					};
					image {
						width: 12px;
						height: 12px;
						margin-top: -1px;
					}
				}
			};
			.real-time-order-form-title-box {
				padding: 0 10px;
				box-sizing: border-box;
				margin: 10px 0;
				text {
					font-size: 14px;
					color: #101010
				}
			};
			.real-time-order-form-list-box {
				flex: 1;
				overflow: auto;
				padding: 0 10px;
				box-sizing: border-box;
				position: relative;
				.scroll-view {
					height: 100%
				};
				::v-deep .u-empty {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%)
				};
				.real-time-order-form-list {
					padding: 10px;
					box-sizing: border-box;
					border-radius: 9px;
					box-shadow: 0px 2px 6px 0px rgba(202, 200, 200, 0.46);
					margin-bottom: 10px;
					.real-time-order-form-list-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10px;
						.real-time-order-form-list-top-left {
							flex: 1;
							@include no-wrap;
							padding-right: 10px;
							box-sizing: border-box;
							text {
								font-size: 14px;
								color: #101010
							}
						};
						.real-time-order-form-list-top-right {
							text {
								font-size: 12px;
								color: #898C8C
							}
						}
					};
					.real-time-order-form-list-bottom {
						.price-box {
							display: flex;
							align-items: center;
							image {
								width: 12px;
								height: 17px;
								margin-right: 10px
							};
							text {
								flex: 1;
								display: inline-block;
								word-break: break-all;
								font-size: 16px;
								color: #FF0000
							}
						};
						.site-box {
							margin: 6px 0;
							display: flex;
							align-items: center;
							image {
								width: 16px;
								height: 16px;
								margin-right: 10px
							};
							> text {
								display: inline-block;
								&:nth-of-type(1) {
									flex: 1;
									font-size: 12px;
									color: #101010;
									word-break: break-all;
									padding-right: 4px;
									box-sizing: border-box
								};
								&:nth-of-type(2) {
									display: flex;
									align-items: center;
									justify-content: center;
									background: #D9DBE0;
									border-radius: 18px;
									width: 84px;
									height: 31px;
									font-size: 14px;
									color: #fff
								}
							}
						};
						.date-box {
							display: flex;
							align-items: center;
							image {
								width: 16px;
								height: 16px;
								margin-right: 10px
							};
							text {
								font-size: 12px;
								color: #101010;
								flex: 1;
								display: inline-block;
								word-break: break-all;
							}
						}
					}
				}	
			}
		}
	}
</style>



