<template>
	<view class="content-box">
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="地址管理" @backClick="backTo">
				</nav-bar> 
			</view>
		</view>
		<view class="map_wrap">
			<map id="mapSelected" style="width: 100%; height: 100vh;" :latitude="latitude" :longitude="longitude" :markers="covers" :controls="controls" :scale="18" @controltap="controltap" @tap="clickMap" 
			@regionchange="regionchange">
			</map>
		</view>
	</view>	
</template>
 
<script>
import navBar from "@/components/zhouWei-navBar"
export default {
		components: {
			navBar
		},
    data() {
			return {
				title: 'map',
				latitude: 39.909,// 默认纬度
				longitude: 116.39742,// 默认经度(北京天安门)
				covers: [{
					id: 110, 
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: 'https://hellouniapp.dcloud.net.cn/static/location.png',
					width: "20",
					height: "20"
				}],
				controls: [{ // 控件
					id: 99,
					position: { // 控件位置
						left: 160,
						top: 120
					},
					iconPath: 'https://hellouniapp.dcloud.net.cn/static/location.png' // 控件图标
				}],
				address_info :"",
				address_info_recomd:"",
				address :""
			}
    },
		
    onLoad() {
      this.isGetLocation()
    },
		
    methods: {
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			isGetLocation(a = "scope.userLocation") { //检查当前是否已经授权访问scope属性
				var _this = this;
				uni.getSetting({
					success(res) {
						console.log(res)
						if (!res.authSetting[a]) { //每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
								_this.getAuthorizeInfo()
						} else {
								//方式一
								_this.getLocationInfo();
								// 方式二
								// _this.getLocation();
						}
					}
				})
			},
			
			getAuthorizeInfo(a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				var _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
							//方式一
							// _this.getLocationInfo();
							// 方式二
							_this.getLocation();
					}
				})
			},
			
			//点击地图时
			clickMap(e){
					console.log("点击地图时:"+e);
					this.latitude=e.detail.latitude;
					this.longitude = e.detail.longitude;
			},
			
			getLocationInfo () {
				//直接调用即可
				uni.chooseLocation({
					success: (res) => {
						console.log(res,'详细地址')
						if(res.errMsg == "chooseLocation:ok"){
							this.address_info = res.name + res.address;
							this.latitude= res.latitude;
							this.longitude = res.longitude;
							let pages = getCurrentPages(); // 当前页页⾯实例
							let nowPage = pages[pages.length - 1]; //当前页⾯实例
							let prevPage = pages[pages.length - 2]; // 上一页面实例
							prevPage.$vm.prevDateFun(res);
							uni.navigateBack({
								delta: 1
							})
						}
					}
				})
			},
			
			//获取当前所在位置的经纬度
			getLocation() {
				uni.getLocation({
						type: 'gcj02',
						success: (res) => {
							console.log(res)
							this.latitude = res.latitude.toString()
							this.longitude = res.longitude.toString()						
							// 获取地理位置详情信息
							this.getLocationDetail()
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
													'&key=XOXBZ-MZWWD-CDX4H-PONXN-UA5PJ-D7FJN',
					success:(re)=> {
						//成功获取到经纬度
						console.log(re)
						if (re.statusCode == 200) {
							this.address_info_recomd = re.data.result.formatted_addresses.recommend;
							this.address_info = re.data.result.address_reference.town.title + re.data.result.address_reference.street.title + re.data.result.address_reference.landmark_l2.title;
							this.address = re.data.result.address
						} else {
							uni.showToast({
								title: '获取地理位置失败，请重试',
								icon: "none"
							})
						}
					}
				})
			},
			
			// 在地图渲染更新完成时触发
			regionchange (e) {
				console.log(e)
				if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
					this.mapCtx = uni.createMapContext("mapSelected"); // 创建map的上下文对象, 从而操控map组件
					this.mapCtx.getCenterLocation({
						success: (res) => {
							this.latitude = res.latitude;
							this.longitude = res.longitude;
							this.getLocationDetail()
						}
					})
				}
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
		}
	}	
</style>