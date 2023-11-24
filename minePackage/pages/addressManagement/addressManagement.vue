<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" :text="infoText" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="地址管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="address-list-box">
			<!-- <view class="image-box">
				<image :src="noAddressManagementPng"></image>
			</view> -->
			<view class="address-list">
				<view class="address-list-top">
					<view class="site">
						<image :src="addressBlackIconPng"></image>
						<text>地址:</text>
						<text>山东省济南市大苏打</text>
					</view>
					<view class="detail-site">
						<text>详细地址:</text>
						<text>山东省济南市大苏打山东省济南市大苏打山东省济南市大苏打山东省济南市大苏打</text>
					</view>
				</view>
				<view class="line"></view>
				<view class="address-list-bottom">
					<view class="list-bottom-left">
						<u-checkbox-group 
								v-model="checked"
								 @change="checkboxChange"
								shape="circle">
							<u-checkbox :disabled="true" activeColor="#11D183" size="18" iconSize="12" name="1"></u-checkbox>
						</u-checkbox-group>
						<text>默认地址</text>
					</view>
					<view class="list-bottom-right">
						<image :src="editBlackIconPng" @click="editAddressEvent"></image>
						<image :src="deleteBlackIconPng" @click="deleteAddressEvent"></image>
					</view>
				</view>
			</view>
			<view class="address-list">
				<view class="address-list-top">
					<view class="site">
						<image :src="addressBlackIconPng"></image>
						<text>地址:</text>
						<text>山东省济南市大苏打</text>
					</view>
					<view class="detail-site">
						<text>详细地址:</text>
						<text>山东省济南市大苏打山东省济南市大苏打山东省济南市大苏打山东省济南市大苏打</text>
					</view>
				</view>
				<view class="line"></view>
				<view class="address-list-bottom">
					<view class="list-bottom-left">
						<u-checkbox-group 
								v-model="checked"
								 @change="checkboxChange"
								shape="circle">
							<u-checkbox :disabled="true" activeColor="#11D183" size="18" iconSize="12" name="2"></u-checkbox>
						</u-checkbox-group>
						<text>默认地址</text>
					</view>
					<view class="list-bottom-right">
						<image :src="editBlackIconPng"></image>
						<image :src="deleteBlackIconPng"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="addSiteEvent">添加地址</text>
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
				count: 1,
				value: 1,
				noAddressManagementPng: require("@/static/img/no-address-management.png"),
				addressBlackIconPng: require("@/static/img/address-black-icon.png"),
				editBlackIconPng: require("@/static/img/edit-black-icon.png"),
				deleteBlackIconPng: require("@/static/img/delete-black-icon.png"),
				infoText: '加载中',
				checked: ['1']
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
			
			checkboxChange(n) {
				console.log('change', n);
			},
			
			// 编辑地址事件
			editAddressEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/editAddress/editAddress'
				})
			},
			
			// 删除地址事件
			deleteAddressEvent () {},
			
			// 添加地址事件
			addSiteEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/addAddress/addAddress'
				})
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
		.address-list-box {
			flex: 1;
			overflow: auto;
			padding: 10px 6px;
			box-sizing: border-box;
			.image-box {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				>image {
					width: 348px;
					height: 348px
				}
			};
			.address-list {
				padding: 10px 0 0 0;
				box-sizing: border-box;
				border: 1px solid #BBBBBB;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 10px;
				.address-list-top {
					padding: 0 6px;
					box-sizing: border-box;
					.site {
						word-break: break-all;
						>image {
							width: 24px;
							height: 32px;
							vertical-align: middle;
							margin-right: 4px;
						};
						>text {
							font-size: 14px;
							color: #101010;
							&:nth-of-type(1) {
								margin-right: 6px
							}
						}
					};
					.detail-site {
						padding-left: 28px;
						box-sizing: border-box;
						word-break: break-all;
						margin-bottom: 8px;
						>text {
							font-size: 14px;
							color: #101010;
							&:nth-child(1) {
								margin-right: 6px
							}
						}
					}
				};
				.line {
					width: 99%;
					height: 1px;
					background: #C8C8C8;
					margin: 0 auto;
				};
				.address-list-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 40px;
					padding: 0 6px;
					box-sizing: border-box;
					.list-bottom-left {
						display: flex;
						>text {
							&:nth-of-type(1) {
								margin-left: 4px;
								font-size: 14px;
								color: #686868
							}
						}
					};
					.list-bottom-right {
						display: flex;
						>image {
							width: 24px;
							height: 32px;
							&:nth-child(1) {
								margin-right: 10px
							}
						}
					}
				}
			};
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
