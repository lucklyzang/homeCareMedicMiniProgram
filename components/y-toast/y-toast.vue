<template>
  <view class="y-toast">
    <view class="y-toast-overlay" @touchmove.stop.prevent="moveHandle" v-if="isShow">
      <view class="y-toast__content" v-if="tmpConfig.icon">
        <view class="loading" v-if="tmpConfig.type === 'loading'">
          <img :src="passedPng" />
        </view>
        <view class="toast-icon" v-else-if="tmpConfig.type === 'success'">
          <img :src="passedPng" />
        </view>
        <view class="toast-icon" v-else-if="tmpConfig.type === 'warning'">
          <img :src="exclamationPointPng" />
        </view>
        <view class="toast-icon" v-else>
          <img :src="exclamationPointPng" />
        </view>
        <text class="y-toast__content__text">
          {{ tmpConfig.message }}
        </text>
      </view>
      <view v-if="!tmpConfig.icon" class="toastText" :style="Tstyle">
        <text class="y-toast__content__text">
          {{ tmpConfig.message }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * <y-toast ref="ytoast"></y-toast> this.$refs['ytoast'].show({ message: '提示语', type: 'warning' })
 * toast 消息提示
 * @description 此组件表现形式类似uni的uni.showToastAPI，但也有不同的地方。
 * @property {Boolean}			loading		是否加载中 （默认 false ）
 * @property {String | Number}	message		显示的文字内容
 * @property {String}			icon		是否显示icon
 * @property {String}			type		主题类型 success
 * @property {Boolean}			show		是否显示该组件 （默认 false）
 * @property {String | Number}  duration	展示时间，单位ms （默认 2000 ）
 * @property {Function}			complete	执行完后的回调函数
 *
 */
export default {
  name: 'y-toast',
  props: ['Tstyle'], //Tstyle 修改弹窗样式
  data() {
    return {
			exclamationPointPng: require("@/static/img/exclamation-point.png"),
			passedPng: require("@/static/img/passed.png"),
      isShow: false,
      timer: null, // 定时器
      config: {
        message: '加载中...', // 显示文本
        type: 'success', // 主题类型，success，error， warning ,loading
        duration: 2000, // 显示的时间，毫秒
        icon: true, // 显示的图标
        complete: null, // 执行完后的回调函数
        loading: false, // 是否加载中状态
      },
      tmpConfig: {}, // 将用户配置和内置配置合并后的临时配置变量
    }
  },
  methods: {
    // 禁止弹窗滚动
    moveHandle() {
      return false
    },
    // 显示toast组件，由父组件通过this.$refs.xxx.show(options)形式调用
    show(options) {
      // 不将结果合并到this.config变量，避免多次调用y-toast，前后的配置造成混乱
      Object.assign(this.$data.config, this.$options.data().config)
      this.tmpConfig = Object.assign(this.config, options)
      // 清除定时器
      this.clearTimer()
      this.isShow = true
      if (this.tmpConfig.type != 'loading') {
        this.timer = setTimeout(() => {
          // 倒计时结束，清除定时器，隐藏toast组件
          this.clearTimer()
          // 判断是否存在callback方法，如果存在就执行
          typeof this.tmpConfig.complete === 'function' && this.tmpConfig.complete()
        }, this.tmpConfig.duration)
      }
    },
    // 隐藏toast组件，由父组件通过this.$refs.xxx.hide()形式调用
    hide() {
      this.clearTimer()
    },
    clearTimer() {
      this.isShow = false
      // 清除定时器
      clearTimeout(this.timer)
      this.timer = null
    },
  },
  beforeUnmount() {
    this.clearTimer()
  },
}
</script>

<style lang="scss" scoped>
.y-toast {
  position: relative;
  .y-toast__content__text {
    font-size: 28rpx;
    color: #101010;
    letter-spacing: 0;
    text-align: center;
    line-height: 1.2;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .y-toast-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
  }
  .y-toast__content {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    height: 45*2rpx;
    min-width: 134 * 2rpx;
    .loading {
      height: 64rpx;
      width: 64rpx;
      margin-bottom: 18 * 2rpx;
      img {
        width: 100%;
        height: 100%;
        animation: fedenum 1s infinite;
      }
    }
    .toast-icon {
      height: 42rpx;
      width: 42rpx;
			margin-right: 8*2rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .toastText {
    padding: 16rpx 20rpx;
    background: rgba(0, 0, 0, 0.66);
    max-width: 660rpx;
    .y-toast__content__text {
      font-size: 28rpx;
      color: #101010 !important;
      letter-spacing: 0;
      text-align: center;
      line-height: 1.2;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding: 0 20rpx;
    }
  }
  @keyframes fedenum {
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>