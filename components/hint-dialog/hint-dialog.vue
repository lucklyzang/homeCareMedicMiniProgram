<template>
	<view class="contain">
		<view class="contain-content">
			<u-icon name="checkmark-circle" :size="iconSize" :color="iconColor"></u-icon>
			<text :style="{'color':iconColor}">{{dialogText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "hintDialog",
		props: {
			dialogText: {
				type: String,
				default: '已评价'
			},
			iconSize: {
				type: Number,
				default: 120
			},
			iconColor: {
				type: String,
				default: "#1864FF"
			},
			durationTime: {
				type: Number,
				default: 2000
			}
		},
		data () {
			return {
				isMsg: ''
			}
		},
		mounted () {
			this.isMsg = this.dialogText;
			console.log(this.isMsg);
			this.isShow();
		},
		methods: {
			isShow () {
			if (this.isMsg) {
			  setTimeout(() => {
				this.$emit('setTipMsg')
			  }, 2000);
			}
		  }
		}
	};
</script>

<style lang="scss" scoped>
	.contain {
		position: fixed;
		width: 80px;
		height: 120px;
		top: 50%;
		left: 50%;
		z-index: 20000;
		transform: translate(-50%,-50%);
		.contain-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			>text {
				margin-top: 10px;
				font-weight: bold
			}
		}
	}
</style>

