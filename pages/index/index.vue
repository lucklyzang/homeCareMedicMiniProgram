<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<!-- 触发订阅消息弹框 -->
		<view class="subscription-dialog-box trigger-subscription-dialog-box">
			<u-modal :show="showTriggerPopup" mode="center" @confirm="triggerConfirmHandle" @cancel="showTriggerPopup = false" confirmText="确定" cancelText="取消" cancelColor="#838C97" confirmColor="#5a7bf4" content="为了获取更好的使用体验,您是否需要订阅相关消息提醒?" :showCancelButton="true" title="订阅提示">
			</u-modal>
		</view>
		<!-- 订阅消息提醒开启询问弹框 -->
		<view class="subscription-dialog-box">
			<u-modal :show="showPopup" mode="center" @confirm="confirmHandle" @cancel="cancelHandle" :confirmText="confirmText" :cancelText="cancelText" cancelColor="#838C97" confirmColor="#5a7bf4" :content="content" :showCancelButton="true" title="设置提示">
			</u-modal>
		</view>
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
			<text>{{ currentAddress }}</text>
		</view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="banner-area-box">
			<u-swiper indicatorMode="dot" @click="swiperClickEvent" keyName="image"  indicator :list="bannerList"></u-swiper>
		</view>
		<view class="center-area">
			<view class="authentication-info-box" v-if="!canAcceptOrder">
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
							style="padding-left: 10px;box-sizing: border-box;"
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
							style="padding-left: 10px;box-sizing: border-box;"
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
					<image src="@/static/img/screen-icon.png"></image>
					<text>筛选</text>
				</view>
			</view>
			<view class="real-time-order-form-title-box">
				<text>实时订单</text>
			</view>
			<view class="real-time-order-form-list-box" v-if="canAcceptOrder">
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
						<view class="real-time-order-form-list-center">
							<view class="site-box">
								<image src="@/static/img/blue-circle-icon.png"></image>
								<text>{{ item.receiverDetailAddress }}</text>
							</view>
							<view class="date-box">
								<image src="@/static/img/blue-circle-icon.png"></image>
								<text>{{ `${getNowFormatDateText(item.serviceDate)} (${judgeWeek(item.serviceDate)}) ${item.serviceTime}` }}</text>
							</view>
						</view>
						<view class="real-time-order-form-list-bottom">
							<view class="price-box">
								<text>￥</text>
								<text>{{ `${item.nursePrice}` }}</text>
							</view>
							<view class="btn-box" @click="robOrderEvent">
								<text>抢单</text>
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
	import { getSubscribeTemplateList, createSubscribe } from '@/api/login.js'
	import { getUserBannerList, createCallPolice, medicalCareHasAuth, getServiceProductCategory, getServiceProductSimpleList } from '@/api/user.js'
	import { getRealtimeTradeOrderPage } from '@/api/orderForm.js'
	import _ from 'lodash'
	import wSelect from '@/components/w-select/w-select.vue'
	export default {
		components: {
			wSelect
		},
		data() {
			return {
				showTriggerPopup: false, // 触发订阅消息弹框显示
				showPopup: false, // 订阅消息提醒开启询问弹框显示
				content: '为了接收消息提醒,是否需要打开接收消息设置?', // 弹框提示内容，
				confirmText: '开启消息提醒',
				cancelText: '不需要',
				tmplId: [],
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
						id: 0,
						content: '智能排序'
					}, 
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
				serviceCategoryList: [],
				isShowServiceProject: true,
				serviceProjectValue: [],
				serviceProjectList: [],
				temporaryCategoriesArr: [],
				temporarySpuIdsArr: [],
				currentAddress: '获取位置中···',
				userCode: '',
				isCanRequestSubscribeMessage: true
			}
		},	
		onShow() {
			this.queryUserBannerList({position: 2});
			this.queryHomeProductCategory();
			this.queryServiceProductSimpleList();
			this.queryMedicalCareHasAuth();
			this.queryTradeOrderPage({
				pageNo: this.currentPageNum,
				pageSize: this.pageSize,
				categories: this.temporaryCategoriesArr,
				spuIds: this.temporarySpuIdsArr,
				minPrice: !this.minPriceValue ? '' : Math.floor((this.minPriceValue*100)),
				maxPrice: !this.maxPriceValue ? '' : Math.floor((this.maxPriceValue*100))
			},true);
			// 获取当前所在位置
			try {
				this.isGetLocation()
			} catch(err) {
				this.$refs.uToast.show({
					message: `${err}`,
					type: 'error',
					position: 'center'
				})
			}
		},
		
		onLoad () {
			this.getUserCode();
			this.getSubscribeTemplateListEvent()
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
				'changeSelectBannerMessage'
			]),
			
			// 抢单事件
			robOrderEvent () {
				this.$refs.uToast.show({
					message: '抢单功能暂未开放，敬请期待',
					position: 'center'
				})
			},
			
			// 获取用户登录凭证
			getUserCode () {
				// 获取用户code
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.userCode = loginRes.code;
						console.log(that.userCode);
	　　　　}
				})
			},
			
			// 获取订阅消息模板列表
			getSubscribeTemplateListEvent() {
				this.showLoadingHint = true;
				this.tmplId = [];
				getSubscribeTemplateList(0).then((res) => {
					if ( res && res.data.code == 0) {
						for (let item of res.data.data) {
							this.tmplId.push(item.templateId);
						};
						if (this.tmplId.length > 0) {
							this.showTriggerPopup = true
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 创建订阅
			createSubscribeEvent(data) {
				this.showLoadingHint = true;
				createSubscribe(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '订阅成功!',
							type: 'success',
							position: 'center'
						})
					} else {
						this.$refs.uToast.show({
							message: '订阅失败!',
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						title: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			
			// 订阅消息代码
			// 判断消息订阅总开关是否打开
			triggerConfirmHandle () {
				this.showTriggerPopup = false;
				uni.getSetting({
					withSubscriptions: true,
					success:(res)=> {
						if (!res.subscriptionsSetting.mainSwitch) { // 订阅消息的总开关,如果是关着的,引导用户去打开
							this.showPopup = true;
						} else { // 如果开着，则继续向下打开弹窗，获取用户授权
							this.messageSubscription()
						}
					},
					fail:()=> {
						this.messageSubscription() // 如果失败，也打开弹窗，获取用户授权
					}
				})
			},
			
			// 弹窗点订阅，开启消息订阅提醒
			confirmHandle() {
				if (this.confirmText == '确定') {
					this.messageSubscription()
					return
				};
				uni.openSetting({
					withSubscriptions: true,
					complete:(res)=> {
						uni.getSetting({
							withSubscriptions: true,
							success:(res)=> {
								if (res.subscriptionsSetting.mainSwitch) { // 订阅消息的总开关,如果是开着的
									this.content = '再次点击确定,弹出即可完成订阅';
									this.cancelText = '取消';
									this.confirmText = '确定';
								} else {
									this.showPopup = false;
								}
							},
							fail:(err)=> {
								this.$refs.uToast.show({
									message: err.errMsg,
									type: 'error',
									position: 'bottom'
								})
							}
						})
					}
				})
			},
			
			// 弹窗点不订阅
			cancelHandle() {
				this.showPopup = false;
			},
			
			// 订阅申请弹出,只允许点击弹出
			// res['**************************'] == 'accept';
			messageSubscription() {
				this.showPopup = false;
				this.content = '为了获取更好的使用体验,您是否需要订阅相关消息提醒?' // 弹框提示内容
				this.confirmText = '开启消息提醒';
				this.cancelText = '不需要';
				if (this.isCanRequestSubscribeMessage) {
					this.isCanRequestSubscribeMessage = false;
					uni.requestSubscribeMessage({
						tmplIds: this.tmplId,
						success: (res) => {
							setTimeout(()=> {
								this.isCanRequestSubscribeMessage = true;
							}, 1000);
							let temporaryTemIdArr = [];
							for (let key in res) {
								if (res[key] == "accept") {
									uni.showToast({
										title: '已允许消息推送'
									});
									temporaryTemIdArr.push(key)
								}
							};
							// 创建订阅
							this.createSubscribeEvent({
								templateIdList: temporaryTemIdArr,
								code: this.userCode,
								type: 0
							})
						},
						fail: (err) => {
							setTimeout(()=> {
								this.isCanRequestSubscribeMessage = true;
							}, 1000);
							this.$refs.uToast.show({
								message: err.errMsg,
								type: 'error',
								position: 'bottom'
							})
						}
					})
				}	
			},
			
			// 轮播图点击事件
			swiperClickEvent (index) {
				// 传递轮播图信息
				let mynavData = {};
				mynavData['index'] = index;
				mynavData['content'] = this.bannerList;
				this.changeSelectBannerMessage(mynavData);
				uni.navigateTo({
					url: '/messagePackage/pages/advertisingDetails/advertisingDetails'
				})
			},
			
			// 查询首页服务类别
			queryHomeProductCategory() {
				this.showLoadingHint = true;
				this.serviceCategoryList = [];
				getServiceProductCategory().then((res) => {
					if ( res && res.data.code == 0) {
						let productTypeList = res.data.data.filter((item) => { return item.parentId == 0 });
						for (let item of productTypeList) {
							this.serviceCategoryList.push({
								id: item.id,
								content: item.name,
								parentId: item.parentId,
								selected: false
							})
						};
						if (res.data.data.length == 0) {
						}
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
			
			// 查询首页服务项目
			queryServiceProductSimpleList() {
				this.showLoadingHint = true;
				this.serviceProjectList = [];
				getServiceProductSimpleList().then((res) => {
					if ( res && res.data.code == 0) {
						let productTypeList = res.data.data;
						for (let item of productTypeList) {
							this.serviceProjectList.push({
								id: item.id,
								content: item.name,
								selected: false
							})
						};
						if (res.data.data.length == 0) {
						}
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
			
			// 身份认证事件
			identityAuthenticationEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/identityAuthenticationHome/identityAuthenticationHome'
				})
			},
			
			// 服务类别点击事件
			serviceCategoryItemClickEvent (item,index) {
				this.$set(this.serviceCategoryList[index],'selected',!this.serviceCategoryList[index]['selected']);
				this.$forceUpdate()
			},
			
			// 服务项目点击事件
			serviceProjectItemClickEvent (item,index) {
				this.$set(this.serviceProjectList[index],'selected',!this.serviceProjectList[index]['selected']);
				this.$forceUpdate()
			},
			
			// 服务项目下拉框隐藏事件
			serviceServiceHide () {
				this.serviceProjectList.forEach((item,index) => {
					this.$set(this.serviceProjectList[index],'selected',false);
					this.$forceUpdate()
				});
				this.serviceProjectValue.forEach((item) => {
					let temporaryIndex = this.serviceProjectList.findIndex((innerItem) => { return  innerItem.id == item.id});
					if (temporaryIndex != -1) {
						this.$set(this.serviceProjectList[temporaryIndex],'selected',true);
						this.$forceUpdate()
					}
				});
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
					minPrice: !this.minPriceValue ? '' : Math.floor((this.minPriceValue*100)),
					maxPrice: !this.maxPriceValue ? '' : Math.floor((this.maxPriceValue*100))
				},true)
			},
			
			// 服务类别下拉框隐藏事件
			serviceCategoryHide () {
				this.serviceCategoryList.forEach((item,index) => {
					this.$set(this.serviceCategoryList[index],'selected',false);
					this.$forceUpdate()
				});
				this.serviceCategoryValue.forEach((item) => {
					let temporaryIndex = this.serviceCategoryList.findIndex((innerItem) => { return  innerItem.id == item.id});
					if (temporaryIndex != -1) {
						this.$set(this.serviceCategoryList[temporaryIndex],'selected',true);
						this.$forceUpdate()
					}
				});
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
					minPrice: !this.minPriceValue ? '' : Math.floor((this.minPriceValue*100)),
					maxPrice: !this.maxPriceValue ? '' : Math.floor((this.maxPriceValue*100))
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
				if (Number(this.minDistanceValue) > Number(this.maxDistanceValue)) {
					this.$refs.uToast.show({
						message: '最近距离不能大于最远距离',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (Number(this.minPriceValue) > Number(this.maxPriceValue)) {
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
					minPrice: !this.minPriceValue ? '' : Math.floor((this.minPriceValue*100)),
					maxPrice: !this.maxPriceValue ? '' : Math.floor((this.maxPriceValue*100))
				},true)
			},
			
			// 智能排序下拉框值改变事件
			smartSortChange(e) {
				this.currentPageNum = 1;
				this.totalCount = 0;
				this.status = 'nomore';
				this.isShowNoData = false;
				this.fullTradeList = [];
				if (e.content == '价格优先') {
					this.queryTradeOrderPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						first: 2
					},true)
				} else if (e.content == '距离优先') {
					this.queryTradeOrderPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize,
						first: 1
					},true)
				} else if (e.content == '智能排序') {
					this.queryTradeOrderPage({
						pageNo: this.currentPageNum,
						pageSize: this.pageSize
					},true)
				}
			},
			
			// 服务类别下拉框值改变事件
			serviceCategoryChange(e) {
				console.log('服务类别', e, this.serviceCategoryValue);
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
						minPrice: !this.minPriceValue ? '' : Math.floor((this.minPriceValue*100)),
						maxPrice: !this.maxPriceValue ? '' : Math.floor((this.maxPriceValue*100))
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
								item.nursePrice = fenToYuan(item.nursePrice);
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
					};
					this.showLoadingHint = false;
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
			
			// 获取首页banner列表
			queryUserBannerList (data) {
				this.bannerList = [];
				getUserBannerList(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.bannerList.push({
									image: item.picUrl,
									title: '',
									content: item.content
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
				let _this = this;
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
				let _this = this;
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
					isHighAccuracy: true,
					success: (res) => {
						console.log('经纬度地址',res);
						this.longitude = res.longitude;
						this.latitude = res.latitude;
						this.getLocationDetail()
					},
					fail: (err) => {
						this.currentAddress = '无法获取位置信息！无法使用位置功能';
						this.$refs.uToast.show({
							message: '无法获取位置信息！无法使用位置功能',
							type: 'error',
							position: 'center'
						})
					}
				})
			},
			
			//根据经纬度获取详细的地址
			getLocationDetail () {
				uni.request({
					header: {
						"Content-Type": "application/text"
					},
					url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + this.latitude + ',' + this.longitude +
													'&key=TVDBZ-TDILD-4ON4B-PFDZA-RNLKH-VVF6E',
					success:(res)=> {
						//成功获取到经纬度
						if (res.statusCode == 200) {
							if (res.data.result) {
								this.currentAddress = res.data.result.address;
							} else {
								this.currentAddress = '获取地理位置异常';
								this.$refs.uToast.show({
									message: res.data.message,
									type: 'error',
									position: 'center'
								})
							}
						} else {
							this.currentAddress = '获取地理位置失败';
							this.$refs.uToast.show({
								message: '获取地理位置失败',
								type: 'error',
								position: 'center'
							})
						}
					},
					fail: (err) => {
						this.currentAddress = '获取地理位置失败';
						this.$refs.uToast.show({
							message: `${err.errMsg}`,
							type: 'error',
							position: 'center'
						})
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
		background: #FAFAFA !important;
		padding-bottom: 0;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
		.subscription-dialog-box {
			::v-deep .u-popup__content{
				.u-modal {
					.u-modal__title {
						font-size: 16px !important;
						color: #101010 !important
					};
					.u-line {
						border: none !important
					};
					.u-modal__content {
						text-align: center;
						padding: 20px 10px 30px 10px !important;
						font-size: 14px !important;
						color: #898C8C !important
					};
					.u-modal__button-group {
						height: 50px;
						justify-content: center;
						.u-line {
							border: none !important
						};
						.u-modal__button-group__wrapper--cancel {
							flex: none !important;
							width: 110px !important;
							height: 34px !important;
							line-height: 34px !important;
							border-radius: 7px !important;
							border: 1px solid #5a7bf4 !important;
							margin-right: 30px;
							.u-modal__button-group__wrapper__text {
								font-size: 14px;
								color: #5a7bf4 !important;
							}
						};
						.u-modal__button-group__wrapper--confirm {
							flex: none !important;
							width: 110px !important;
							height: 34px !important;
							line-height: 34px !important;
							border-radius: 7px !important;
							background: #5a7bf4 !important;
							border: none !important;
							.u-modal__button-group__wrapper__text {
								font-size: 14px;
								color: #fff !important;
							}
						}
					}
				}
			}	
		};
		.screen-dialog-box {
			::v-deep .u-popup {
				flex: none !important;
				.u-transition {
					width: 80%;
					z-index: 1000 !important;
					.u-popup__content {
						height: 0;
						padding: 20px;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						.screen-top {
							flex: 1;
							overflow: auto;
							.service-category {
								margin-bottom: 14px;
								.service-category-title {
									font-size: 14px;
									color: #000000;
									font-weight: 600;
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
									font-size: 14px;
									color: #000000;
									font-weight: 600;
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
							height: 60px;
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
			left: -18px;;
			z-index: 100;
			bottom: 4vh;
			image {
				width: 55px;
				height: 55px
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
			image {
				width: 16px;
				height: 16px;
				margin-right: 6px;
			};
			text {
				@include no-wrap;
				display: inline-block;
				width: 65%;
				font-size: 14px;
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
			width: 100%;
			padding: 8px;
			box-sizing: border-box;
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
				align-items: center;
				height: 44px;
				background: #fff;
				padding: 0 8px;
				box-sizing: border-box;
				@include bottom-border-1px(#b2b2b2);
				.smart-sort {
					position: relative;
					border: none;
					&:after {
						content: '';
						height: 20px;
						width: 1px;
						background: #ebebeb;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
					}
				};
				.service-category {
					position: relative;
					border: none;
					&:after {
						content: '';
						height: 20px;
						width: 1px;
						background: #ebebeb;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
					}
				};
				.service-project {
					position: relative;
					border: none;
					&:after {
						content: '';
						height: 20px;
						width: 1px;
						background: #ebebeb;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
					}
				};
				.smart-sort {
					width: 26%;
					flex: none !important;
					::v-deep .w-select {
						margin-left: 0 !important;
						.select-wrap {
							justify-content: flex-start !important;
							input {
								width: 60px;
								padding: 0;
								box-sizing: border-box;
								flex: none !important
							};
							.w-select-arrow {
								display: inline-block;
								margin: 3px 4px 0;
								width: 0;
								height: 0;
								border: 5px solid transparent;
								border-top-color: #60646F;
								transition: all 0.3s;
								margin-top: 6px;
							};
							.w-select-arrow-up {
								display: inline-block;
								margin: 3px 4px 0;
								width: 0;
								height: 0;
								border: 5px solid transparent;
								border-bottom-color: #60646F;
								transition: all 0.3s;
								margin-top: -6px;
							}
						}
					};
					w-select {
						margin-left: 0 !important;
						.select-wrap {
							justify-content: flex-start !important;
							input {
								width: 60px;
								box-sizing: border-box;
								flex: none !important
							};
							.w-select-arrow {
								display: inline-block;
								margin: 3px 4px 0;
								width: 0;
								height: 0;
								border: 5px solid transparent;
								border-top-color: #60646F;
								transition: all 0.3s;
								margin-top: 6px;
							};
							.w-select-arrow-up {
								display: inline-block;
								margin: 3px 4px 0;
								width: 0;
								height: 0;
								border: 5px solid transparent;
								border-bottom-color: #60646F;
								transition: all 0.3s;
								margin-top: -6px;
							}
						}
					}
				};
				>view {
					position: relative;
					flex: 1;
					width: 0;
					display: flex;
					align-content: center;
					::v-deep .w-select {
						width: 100%;
						.select-wrap {
							justify-content: center !important;
							border: none !important;
							width: 100% !important;
							input {
								font-size: 14px !important;
								color: #666666 !important;
								font-weight: 400;
							};
							.input-placeholder {
								font-size: 14px !important;
								color: #666666 !important;
							};
							.uni-input {
								font-size: 14px !important;
								color: #666666 !important;
								font-weight: 400;
							};
							.select-content {
								max-width: 70%;
								.select-content-item-default {
									font-size: 14px !important;
									color: #666666 !important;
									font-weight: 400;
									width: 100%;
									@include no-wrap;
								};
								.select-content-item {
									font-size: 14px !important;
									color: #666666 !important;
									font-weight: 400;
									width: 100%;
									@include no-wrap;
								}
							}
						}
					};
					::v-deep w-select {
						width: 100%;
						.select-wrap {
							justify-content: center !important;
							border: none !important;
							width: 100% !important;
							input {
								font-size: 14px !important;
								color: #666666 !important;
								font-weight: 400;
							};
							.input-placeholder {
								font-size: 14px !important;
								color: #666666 !important;
							};
							.uni-input {
								font-size: 14px !important;
								color: #666666 !important;
								font-weight: 400;
							};
							.select-content {
								max-width: 70%;
								.select-content-item-default {
									font-size: 14px !important;
									color: #666666 !important;
									font-weight: 400;
									width: 100%;
									@include no-wrap;
								};
								.select-content-item {
									font-size: 14px !important;
									color: #666666 !important;
									font-weight: 400;
									width: 100%;
									@include no-wrap;
								}
							}
						}
					}
				};
				.screen-box {
					flex: none !important;
					width: 60px;
					display: flex;
					align-items: center;
					justify-content: flex-end !important;
					>text {
						display: inline-block;
						font-size: 14px;
						color: #333333;
						font-weight: 400;
					};
					image {
						margin-right: 6px;
						width: 14px;
						height: 14px;
						margin-top: -1px;
					}
				}
			};
			.real-time-order-form-title-box {
				padding: 0 8px;
				box-sizing: border-box;
				margin: 10px 0;
				text {
					font-size: 17px;
					color: #000000;
					font-weight: 500;
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
					background: #fff;
					margin-bottom: 10px;
					.real-time-order-form-list-top {
						display: flex;
						justify-content: space-between;
						.real-time-order-form-list-top-left {
							flex: 1;
							@include no-wrap;
							padding-right: 10px;
							box-sizing: border-box;
							text {
								font-size: 16px;
								color: #000000;
								text-align: justify;
								font-weight: 400;
							}
						};
						.real-time-order-form-list-top-right {
							text {
								font-size: 14px;
								color: #FF7800;
								text-align: justify;
								font-weight: 400;
							}
						}
					};
					.real-time-order-form-list-center {
						margin: 10px 0;
						background: #FAFAFA;
						padding: 6px;
						box-sizing: border-box;
						.site-box {
							margin-bottom: 6px;
							display: flex;
							align-items: center;
							image {
								width: 6px;
								height: 6px;
								margin-right: 4px;
							};
							text {
								font-size: 13px;
								color: #333333;
								font-weight: 400;
								flex: 1;
								display: inline-block;
								word-break: break-all;
							}
						};
						.date-box {
							display: flex;
							align-items: center;
							image {
								width: 6px;
								height: 6px;
								margin-right: 4px;
							};
							text {
								font-size: 13px;
								color: #333333;
								font-weight: 400;
								flex: 1;
								display: inline-block;
								word-break: break-all;
							}
						}
					};
					.real-time-order-form-list-bottom {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.price-box {
							display: flex;
							align-items: center;
							image {
								width: 12px;
								height: 17px;
								margin-right: 10px
							};
							text {
								&:nth-child(1) {
									font-size: 12px;
									color: #F92C20;
									text-align: justify;
									font-weight: 500;
									margin-right: 2px;
									margin-top: 2px;
								};
								&:nth-child(2) {
									flex: 1;
									display: inline-block;
									word-break: break-all;
									font-size: 17px;
									color: #FF0000
								}
							}
						};
						.btn-box {
							display: flex;
							align-items: center;
							justify-content: center;
							background: #D9DBE0;
							border-radius: 6px;
							width: 84px;
							height: 31px;
							font-size: 14px;
							color: #fff
						}
					}
				}	
			}
		}
	}
</style>



