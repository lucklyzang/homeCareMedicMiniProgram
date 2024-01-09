<template>
	<view class="my-map">
		<u-divider text="地图展示"></u-divider>
		<map id="map" :longitude="longitude" :latitude="latitude" :scale="18" :markers="markers" show-location style="width: 100%; height: 100%;" class="myMap_map">
			<cover-image class="my-map-cover-view" @click="backEvent" src="@/static/img/map-back.png">
			</cover-image>
		</map>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				latitude: 39.909,
				longitude: 116.39742,
				markers: [{
					id: 123,
					latitude: 39.909,
					longitude: 116.39742,
					width: 40,
					height: 40,
					iconPath: 'https://hellouniapp.dcloud.net.cn/static/location.png',
					title: "提示"
				}]
			}
		},
		
		methods: {
			backEvent () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.my-map {
		width:100%;
		height: 100vh;
		position: relative;
		.my-map-cover-view {
			width: 34px;
			height: 34px;
			position: absolute;
			top: 10px;
			left: 20px;
			border-radius: 50%;
			background: transparent;
			display: flex;
			align-items: center;
			justify-content: center;
			::v-deep .u-icon {
				z-index: 100
			}
		}
	}
</style>