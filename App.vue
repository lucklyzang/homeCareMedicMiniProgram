<script>
import { mapGetters, mapMutations } from 'vuex'
import { createUserBootUpData } from '@/api/user.js'
export default {
	computed: {
		...mapGetters([
		])
	},
	onLaunch: function() {
	},
	onShow: function() {
		console.log('启动了');
		// 创建用户启动数据
		createUserBootUpData().then((res) => {
		})
		.catch((err) => {
		});
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
				if (res.hasUpdate) {
					// 下载新版本
					updateManager.onUpdateReady(function () {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用?',
							success(res) {
								if (res.confirm) {
									// 重启应用
									updateManager.applyUpdate()
								}
							}
						})
					});
					// 新版本下载失败
					updateManager.onUpdateFailed(function (res) {
					  uni.showModal({
						title: '已经有新版本了',
						content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开',
					  })
					})
				}
			})
		} else {
			uni.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
			})
		}
	},
	onHide: function() {
	}
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>

