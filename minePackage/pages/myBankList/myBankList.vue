<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="银行卡" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="select-bank-card-box">
			<u-empty text="您还没有绑定银行卡" mode="list" v-if="isShowNoData"></u-empty>
			<view class="card-list" v-for="(item,index) in cardList" :key="item.id" @click="cardSelectedEvent(item,index)">
				<view class="card-top">
					<view class="card-top-left"></view>
					<view class="card-top-center">
						{{ item.bank }}
					</view>
				</view>
				<view class="card-center">
					{{ item.cardNo }}
				</view>
			</view>
		</view>
		<view class="add-bank-card-btn">
			<text @click="addBankCardEvent">添加银行卡</text>
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
	import { getCareBankCardList } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				isShowNoData: true,
				cardList: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo',
				'selectedBankMessage'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow() {
			this.getCareBankCardListEvent()
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 银行卡卡片点击事件
			cardSelectedEvent(item,index) {
				// 传递当前银行卡信息
				let mynavData = JSON.stringify(item);
				uni.navigateTo({
					url: '/minePackage/pages/facialAuthentication/facialAuthentication?transmitData='+mynavData
				})
			},
			
			// 获取提现银行卡列表
			getCareBankCardListEvent () {
				this.infoText = '加载中···';
				this.showLoadingHint = true;
				this.isShowNoData = false;
				this.cardList = [];
				getCareBankCardList({careId : this.userInfo.careId}).then((res) => {
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							this.cardList = res.data.data;
							this.cardList.forEach((item) => { item.checked = false});
							// 回显选中的银行卡
							if (JSON.stringify(this.selectedBankMessage) != '{}') {
								let temporaryId = this.selectedBankMessage['id'];
								let temporaryIndex = this.cardList.findIndex((item) => { return item.id == temporaryId});
								if (temporaryIndex != -1) {
									this.$set(this.cardList[temporaryIndex],'checked',true);
									this.$forceUpdate();
								}
							} else {
								let temporaryMessage = this.cardList.filter((item) => { return item.defaultStatus == true})[0];
								let temporaryId = temporaryMessage['id'];
								let temporaryIndex = this.cardList.findIndex((item) => { return item.id == temporaryId});
								if (temporaryIndex != -1) {
									this.$set(this.cardList[temporaryIndex],'checked',true);
									this.$forceUpdate();
								}
							}
						} else {
							this.isShowNoData = true
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false
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
			
			// 添加银行卡事件
			addBankCardEvent () {
				uni.navigateTo({
					url: '/minePackage/pages/bindBankCard/bindBankCard'
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
		background: #fff;
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
			background: #fff;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #fff;
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
		.select-bank-card-box {
			flex: 1;
			overflow: auto;
			padding: 20px;
			box-sizing: border-box;
			position: relative;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.card-list {
				width: 100%;
				height: 130px;
				padding: 10px 20px;
				box-sizing: border-box;
				border-radius: 10px;
				margin-bottom: 20px;
				background-image: linear-gradient(to bottom,#2D7ED4, #489AE6);
				.card-top {
					display: flex;
					align-items: center;
					.card-top-left {
						width: 40px;
					};
					.card-top-center {
						flex: 1;
						margin-left: 10px;
						font-size: 18px;
						color: #fff
					}
				};
				.card-center {
					margin-top: 20px;
					font-size: 18px;
					color: #fff;
					margin-left: 50px;
				}
			}
		};
		.add-bank-card-btn {
			height: 60px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			color: #1890FF
		}
	}
</style>