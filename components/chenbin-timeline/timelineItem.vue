<template>
	<view class="timelineItem">
		<view class="timeItem">
			<view class="leftTime">
				<view class="time">
					{{leftTime}}
				</view>
				<view class="scrutator" :class="{'scrutatorBoxStyle' : scrutator == '受查项目' }">
					<!-- <text>
						<u-icon name="man-add-fill"></u-icon>
					</text> -->
					<text :class="{'scrutatorStyle' : scrutator == '受查项目' }">
						{{scrutator}}
					</text>
				</view>
			</view>
			<view class="line">
				<view class="out" :style="{background: color == '' ? '' : color}">
					<view class="inner" :style="{background: color == '' ? '' : color}"></view>
				</view>
			</view>
			<view class="rightContent">
				<slot></slot>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			leftTime:{
				type:String,
				default:''
			},
			scrutator: {
				type:String,
				default:''
			},
			color:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped lang="less">
	.timelineItem {
		.timeItem {
			display: flex;
			.leftTime {
				padding: 0 10px;
				font-size: 16px;
				color:rgba(51,51,51,1);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.scrutator {
					text-align: center;
					color: #9a9a9a;
					text {
						max-width: 128px;
						margin-top: 2px;
						display: inline-block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					};
					.scrutatorStyle {
						color: #FF6712 !important
					}
				};
				.scrutatorBoxStyle {
					border: 1px solid #FF6712 !important
				}
			}
			.line {
				width: 1px;
				background:rgba(204,204,204,1);
				position: relative;
				.out {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					width: 20px;
					height: 20px;
					background : rgba(236,104,23,0.6);
					border-radius: 50%;
					.inner {
						width: 18px;
						height: 18px;
						background : rgba(236,104,23,1);
						border-radius: 50%;
					}
				}
			}
			.rightContent {
				flex: 1;
				padding: 0 5px;
				overflow: auto;
				margin-left: 10px;
				min-height: 50px;
			}
		}
	}
</style>
