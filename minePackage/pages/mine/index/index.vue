<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="初步评估单管理" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="evaluation-form-box">
			<!-- <view class="image-box">
				<image :src="noProtectedPersonsPng"></image>
			</view> -->
			<view class="evaluation-form-list">
				<view class="evaluation-form-list-left">
					<view class="evaluation-form-title">
						<text>名称:</text>
						<text>宝宝黄疸检测</text>
					</view>
					<view class="patient-information">
						<view class="patient-information-left">
							<text>患者姓名:</text>
							<text>李云龙</text>
						</view>
						<view class="patient-information-right">
							<text>患者年龄:</text>
							<text>5个月</text>
						</view>
					</view>
				</view>
				<view class="evaluation-form-list-right">
					<image :src="editBlackIconPng" @click="editEvaluationFormEvent"></image>
					<image :src="deleteBlackIconPng" @click="deleteEvaluationFormEvent"></image>
				</view>
			</view>
			<view class="evaluation-form-list">
				<view class="evaluation-form-list-left">
					<view class="evaluation-form-title">
						<text>名称:</text>
						<text>宝宝黄疸检测</text>
					</view>
					<view class="patient-information">
						<view class="patient-information-left">
							<text>患者姓名:</text>
							<text>李云龙</text>
						</view>
						<view class="patient-information-right">
							<text>患者年龄:</text>
							<text>5个月</text>
						</view>
					</view>
				</view>
				<view class="evaluation-form-list-right">
					<image :src="editBlackIconPng"></image>
					<image :src="deleteBlackIconPng"></image>
				</view>
			</view>
		</view>
		<view class="add-btn">
			<text @click="addEvaluationformEvent">新增评估单</text>
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
			
			// 编辑评估单事件
			editEvaluationFormEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/editEvaluationForm/editEvaluationForm'
				})
			},
			
			// 删除评估单事件
			deleteEvaluationFormEvent () {
				
			},
			
			// 新增评估单事件
			addEvaluationformEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/evaluationFormList/evaluationFormList'
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
		.evaluation-form-box {
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
					width: 334px;
					height: 334px
				}
			};
			.evaluation-form-list {
				padding: 10px 10px 30px 10px;
				box-shadow: 0px 2px 6px 0 rgba(137, 140, 140, 0.61);
				box-sizing: border-box;
				border: 1px solid #BBBBBB;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 10px;
				display: flex;
				justify-content: space-between;
				.evaluation-form-list-left {
					flex: 1;
					width: 0;
					display: flex;
					flex-direction: column;
					.evaluation-form-title {
						margin-bottom: 6px;
						>text {
							font-size: 14px;
							color: #101010;
							&:first-child {
								margin-right: 4px;
							}
						}
					};
					.patient-information {
						display: flex;
						.patient-information-left {
							margin-right: 10px;
							>text {
								font-size: 14px;
								color: #101010;
								&:first-child {
									margin-right: 4px;
								}
							}
						};
						.patient-information-right {
							>text {
								font-size: 14px;
								color: #101010;
								&:first-child {
									margin-right: 4px;
								}
							}
						}
					}
				};
				.evaluation-form-list-right {
					display: flex;
					align-items: center;
					>image {
						width: 24px;
						height: 32px;
						&:nth-child(1) {
							margin-right: 6px;
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
