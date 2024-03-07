<template>
	<view class="chat">
		<u-toast ref="uToast" />
    <!-- 顶部标题 -->
    <view class="topTabbar">
      <!-- 返回图标 -->
      <u-icon class="icon" name="arrow-left" size="20px" color="#000" @click="goback()"></u-icon>
			<!-- 消息条数 -->
		<!-- 	<view class="message-count" @click="goback()">
				{{ `消息(${messageCount})` }}
			</view> -->
      <!-- 聊天对象名称 -->
      <view class="text">{{ fromName }}</view>
    </view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<scroll-view :style="{height: `${windowHeight-inputHeight - 180}rpx`}"
			id="scrollview"
			@scrolltoupper="scrolltoupper"
			upper-threshold="0"
			scroll-y="true" 
			:scroll-top="scrollTop"
			:scroll-anchoring="true"
			class="scroll-view"
		>
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">
				<u-loadmore :status="status"  :loading-text="loadingText"  :loadmore-text="loadmoreText" :nomore-text="nomoreText"  v-if="fullMsgList.length > 0" />
				<!-- 聊天记录 -->
				<view v-for="(item,index) in fullMsgList" :key="index">
					<view class="send-time-box" v-if="item.me">
						<view class="send-time">
							{{ getNowFormatDate(new Date(item.createTime),4) }}
						</view>
					</view>
					<!-- 自己发的消息 -->
					<view class="item self" v-if="item.me">
						<!-- 文字内容 -->
						<view class="content right">
							<text>{{ item.content }}</text>
							<u-icon name="error-circle-fill" size="20" color="red" v-if="item.status == 'fail'"></u-icon>
						</view>
						<!-- 头像 -->
						<image class="avatar" :src="item.fromAvatar">
						</image>
					</view>
					<view class="send-time-box" v-if="!item.me">
						<view class="send-time">
							{{ getNowFormatDate(new Date(item.createTime),4) }}
						</view>
					</view>
					<!-- 好友发的消息 -->
					<view class="item Ai" v-if="!item.me">
						<!-- 头像 -->     
						<image class="avatar" :src="item.fromAvatar">
						</image>
						<!-- 文字内容 -->
						<view class="content left">
							{{item.content}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
			<view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
        <view class="uni-textarea">
          <textarea v-model="chatMsg"
            maxlength="300"
						autoHeight
            confirm-type="send"
            @confirm="handleSend"
            placeholder="快来聊天吧~"
            :show-confirm-bar="false"
            :adjust-position="false"
            @linechange="sendHeight"
            @focus="focus" @blur="blur">
						</textarea>
        </view>
				<button @click="handleSend" class="send-btn">发送</button>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { getUserChatPage, getUserMessage } from '@/api/user.js'
	import { getTradeOrderUserCareInfo } from '@/api/orderForm.js'
	import store from '@/store'
	export default{
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				showLoadingHint: false,
				infoText: '加载中···',
				loadingText: '加载中···',
				loadmoreText: '下拉加载更多',
				nomoreText: '没有更多聊天记录了',
				messageCount: 12,
				//键盘高度
				keyboardHeight:0,
				//底部消息发送高度
				bottomHeight: 0,
				// 列表高度
				scrollHeight: 0,
				//滚动距离
				scrollTop: 0,
				userId:'',
				//发送的消息
				chatMsg:"",
				// 定时器
				timer: null,
				fromId: '',
				fromName: '',
				userAvatar: '',
				msgList: [],
				fullMsgList:[],
				status: 'nomore',
				currentPage: 1,
				pageSize: 15,
				totalCount: 0,
				beforePageRoute: '',
				personPhotoSource: ''
			}
		},
		updated(){},
		computed: {
			...mapGetters([
				'userInfo',
				'socketOpen',
				'userBasicInfo'
			]),
			windowHeight() {
			  return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
			},
			// 键盘弹起来的高度+发送框高度
			inputHeight(){
				return this.bottomHeight+this.keyboardHeight
			}
		},
		
		onShow() {
			// 获取用户基本信息
			getUserMessage().then((res) => {
				if ( res && res.data.code == 0) {
					this.changeUserBasicInfo(res.data.data);
					this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng :  this.userBasicInfo.avatar;
				} else {
					this.$refs.uToast.show({
						title: res.data.msg,
						type: 'error',
						position: 'bottom'
					})
				}
			})
			.catch((err) => {
				this.$refs.uToast.show({
					title: err.message,
					type: 'error',
					position: 'bottom'
				})
			})
		},
		
		onLoad(options) {
			this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
			let pages = getCurrentPages();//当前页
			this.beforePageRoute = pages[pages.length - 2].route;//上个页面路径
			// 从聊天列表进入时不用查医护信息
			if (this.beforePageRoute == 'pages/message/message') {
				this.fromId = JSON.parse(options.transmitData).fromId;
				this.fromName = JSON.parse(options.transmitData).fromName;
				this.userAvatar = JSON.parse(options.transmitData).avatar;
				this.queryChatPageList({
					pageNo: this.currentPage,
					pageSize: this.pageSize,
					fromId: this.fromId
				},true)
			} else {
				this.getTradeOrderUserCareInfoEvent({orderId: options.transmitData})
			};
			
			// socket初始化
			this.init();
	 
			// 定时器，定时判断socket有没有掉线
			// this.timer = setInterval(() => {
			// 	this.isSocketConnct()
			// }, 2000);

			uni.onKeyboardHeightChange(res => {
				//这里正常来讲代码直接写
				//this.keyboardHeight=this.rpxTopx(res.height)就行了
				//但是之前界面ui设计聊天框的高度有点高,为了不让键盘和聊天输入框之间距离差太大所以我改动了一下。
				this.keyboardHeight = this.rpxTopx(res.height)
				if(this.keyboardHeight<0)this.keyboardHeight = 0
			})
		},
		
		onUnload(){
			uni.offKeyboardHeightChange(() =>{});
			// 关闭定时器
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null
			};
			// 关闭Socket
			this.closeSocket()
		},
		
		methods: {
			...mapMutations([
				'changeSocketOpen',
				'changeUserBasicInfo'
			]),
			
      goback() {
        uni.navigateBack()
      },
			
			focus(){
				this.scrollToBottom()
			},
			
			blur(){
				this.scrollToBottom()
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 查询要联系的患者信息(从订单界面进入此页面)
			getTradeOrderUserCareInfoEvent (data) {
				this.showLoadingHint = true;
				getTradeOrderUserCareInfo(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.fromName = res.data.data.userName;
						this.fromId = res.data.data.userId;
						this.userAvatar = res.data.data.userAvatar;
						this.queryChatPageList({
							pageNo: this.currentPage,
							pageSize: this.pageSize,
							fromId: this.fromId
						},true)
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
			
			// px转换成rpx
			rpxTopx(px){
				let deviceWidth = uni.getSystemInfoSync().windowWidth;
				let rpx = ( 750 / deviceWidth ) * Number(px);
				return Math.floor(rpx)
			},
			
			// 监视聊天发送栏高度
			sendHeight(){
				setTimeout(()=>{
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect();
					query.exec(res =>{
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				},10)
			},
			
			// 发送消息(socket)
			sendSocketMessage(msg) {
				let that = this;
				try {
				 const messageContent = JSON.stringify({
						text: msg, // 消息内容
						toUserId: this.fromId, // 接受者用户 ID
						userType: 1  // 用户类型 发送给APP端用户 为1， 发送给管理的为 2
					});
					const jsonMessage = JSON.stringify({
						type: 'chat-message-send', // 消息类型 固定
						content: messageContent   //  消息内容
					});
					if (this.socketOpen) {
						uni.sendSocketMessage({
							data: jsonMessage,
							success: (res) => {
								console.log('发送成功',res);
								setTimeout(() => {
									that.sendMessageHandle(msg)
								}, 300)
							},
							fail: (err) => {
								// 发送失败处理
								this.$refs.uToast.show({
									message: err,
									type: 'error',
									position: 'center'
								})
							}
						});
					} else {
						// Socket没有开启，重新连接并重新发送消息
						this.init();
						setTimeout(() => {
							this.sendSocketMessage(jsonMessage)
						},300)
					}
				} catch (err) {
					this.$refs.uToast.show({
						message: err,
						type: 'error',
						position: 'center'
					})
				}
			},
	 
			// 判断是否连接
			isSocketConnct() {
				console.log('判断是否连接');
				if (!this.socketOpen) {
					this.init()
				}
			},
	 
			// 初始化
			init() {
				this.connect();
				this.openSocket();
				this.onclose();
				this.onSocketMessage()
			},
	 
			// 建立连接
			connect() {
				uni.connectSocket({
					url: `wss://dev.nurse.blinktech.cn/nurse/infra/ws?token=${store.getters.token}`,
					success: (res) => {
						console.log('成功',res)
					},
					fail: (err) => {
						console.log('失败',err)
					}
				})
			},
	 
			// 监听关闭
			onclose() {
				let that = this;
				uni.onSocketClose((res) => {
					that.changeSocketOpen(false);
				})
			},
	 
			// 关闭
			closeSocket() {
				uni.closeSocket({
					success:() => {
						console.log("退出成功")
					}
				})
			},
	 
			// 打开Soceket
			openSocket() {
				let that = this;
				uni.onSocketOpen((res) => {
					that.changeSocketOpen(true);
					console.log('打开Soceket');
				})
			},
	 
			// 接收事件
			onSocketMessage() {
				let that = this;
				uni.onSocketMessage((res) => {
					let obj = JSON.parse(res.data)
					that.onMessageHandle(obj)
				})
			},
	 
			// 接收到事件后处理的方法
			onMessageHandle(obj) {
				if (obj.type == 'chat-message-receive') {
					if (!obj.hasOwnProperty('content')) {
						return
					};
					this.fullMsgList.push({
						content: JSON.parse(obj.content)['text'],
						createTime: new Date().getTime(),
						fromAvatar: this.userAvatar,
						fromId: JSON.parse(obj.content)['formUserId'],
						me: false,
						status: 'success',
						read: false,
						toId: this.userInfo.userId
					});
					this.scrollToBottom()
				} else {
					if (!obj.hasOwnProperty('content')) {
						let temporaryIndex = this.fullMsgList.findIndex((item) => { return item.content == this.chatMsg });
						if (temporaryIndex != -1) {
							this.fullMsgList[temporaryIndex]['status'] = 'fail'
						}
					}
				}
			},
	 
			// 发送消息后处理的方法
			sendMessageHandle(msg) {
				console.log('发送成功了',msg);
			},
			
			scrolltoupper () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPage >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPage = this.currentPage + 1;
					this.queryChatPageList({
						pageNo: this.currentPage,
						pageSize: this.pageSize,
						fromId: this.fromId
					},false)
				}
			},
			
			// 获取当前消息分页信息
			async queryChatPageList (data,flag) {
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				this.msgList = [];
				getUserChatPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (JSON.stringify(res.data.data) == '{}') {
							this.isShowNoData = true;
							this.showLoadingHint = false;
							return
						};
						this.totalCount = res.data.data.total;
						this.msgList = res.data.data.list;
						let reverseMsgList = this.msgList.reverse();
						this.fullMsgList = [...reverseMsgList,...this.fullMsgList];
						this.$nextTick(async () => {
							const query = uni.createSelectorQuery().in(this);
							query.select('.chat-body')
							.boundingClientRect(data => {
								// data.height 为已经渲染的聊天列表内容高度
								// this.scrollHeight 为上一次聊天列表内容高度, 如果当前为第一次, 那么this.scrollHeight应该为0
								// 设置滚动条的高度
								this.scrollTop = data.height - this.scrollHeight;
								// (注意: 如果在模板中, upper-threshold设置的值不为0, 为50, 那么可以加上该值), 如:
								// this.scrollTop = data.height - this.scrollHeight + 50
								// 将本次列表渲染后的内容高度记录下来, 方便下次加载时使用
								this.scrollHeight = data.height
							}).exec()
						});
						if (this.fullMsgList.length == 0) {
							this.isShowNoData = true;
						}
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
				
			// 滚动至聊天底部
			scrollToBottom(e) {
				setTimeout(()=>{
					let query = uni.createSelectorQuery().in(this);
					query.select('#scrollview').boundingClientRect();
					query.select('#msglistview').boundingClientRect();
					query.exec((res) =>{
						if(res[1].height > res[0].height){
							this.scrollTop = this.rpxTopx(res[1].height - res[0].height)
						}
					})
				},15)
			},
			
			// 发送消息
			handleSend() {
				//如果消息为空
				if(this.chatMsg.match(/^[ ]*$/) || this.chatMsg == ''){
					this.$refs.uToast.show({
						message: '不能发送空白消息',
						type: 'default',
						position: 'center'
					})
				} else {
					let obj = {
						content: this.chatMsg,
						createTime: new Date().getTime(),
						fromAvatar: this.personPhotoSource,
						status: 'sending',
						me: true
					};
					this.sendSocketMessage(this.chatMsg);
					this.msgList.push(obj);
					this.fullMsgList = this.fullMsgList.concat(this.msgList);
					this.chatMsg = '';
					this.scrollToBottom()
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	$chatContentbgc: #1E86FD;
	$sendBtnbgc: #4F7DF5;
	view,button,text,input,textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	};
	/* 聊天消息 */
	.chat {
		position: relative;
		::v-deep .u-popup {
			flex: none !important
		};
    .topTabbar {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			display: flex;
			margin-top: 80rpx;
			padding-right: 190rpx;
			box-sizing: border-box;
			position: relative;
			.icon {
				margin: 0 4rpx 0 20rpx;
			};
			.message-count {
				font-size: 14px;
			};
			.text {
				text-align: center;
				width: 200px;
				padding: 0 10px;
				box-sizing: border-box;
				font-size: 16px;
				font-weight: 700;
				flex: 1;
				@include no-wrap;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			};
			.button {
				width: 10%;
				margin: auto 20rpx auto 0rpx;
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.scroll-view {
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			};
			// background-color: orange;
			background-color: #F6F6F6;
			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				// background-color:skyblue;
				.send-time-box {
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					.send-time {
						margin: 0 auto;
						text-align: center;
						padding: 3px 6px;
						box-sizing: border-box;
						color: #fff;
						font-size: 12px;
						border-radius: 12px;
						background: #CECECE;
					}
				};
				.self {
					justify-content: flex-end;
				};
				.item {
					display: flex;
					padding: 23rpx 30rpx;
					// background-color: greenyellow;
					.right {
						background-color: $chatContentbgc;
						color: #fff !important;
					};
					.left {
						background-color: #FFFFFF;
						color: #101010 !important;
					};
          // 聊天消息的三角形
					.right::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						left: 100%;
						top: 10px;
						border: 12rpx solid transparent;
						border-left: 12rpx solid $chatContentbgc;
					};
					.left::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						top: 10px;
						right: 100%;
						border: 12rpx solid transparent;
						border-right: 12rpx solid #FFFFFF;
					};
					.content {
						position: relative;
						max-width: 486rpx;
						border-radius: 8rpx;
						word-wrap: break-word;
						padding: 22rpx 22rpx;
						margin: 0 24rpx;
						border-radius: 5px;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
						::v-deep .u-icon {
							position: absolute;
							top: 50%;
							left: -44rpx;
							transform: translateY(-50%)
						}
					};
					.avatar {
						display: flex;
						justify-content: center;
						width: 78rpx;
						height: 78rpx;
						background: $sendBtnbgc;
						border-radius: 50rpx;
						overflow: hidden;
						image {
							align-self: center;
						}
					}
				}
			}
		};
		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			height: 100rpx;
			background: #F4F5F7;
			transition: all 0.1s ease;
			.send-msg {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				padding: 16rpx 30rpx;
				width: 100%;
				min-height: 177rpx;
				position: fixed;
				bottom: 0;
				background: #fff;
				transition: all 0.1s ease;
			};
			.uni-textarea {
				padding-bottom: 70rpx;  
				textarea {
					width: 537rpx;
					min-height: 75rpx;
					max-height: 500rpx;
					background: #f1f1f1;
					border-radius: 40rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: #333333;
					line-height: 74rpx;
					padding: 5rpx 8rpx;
          text-indent: 30rpx;
				}
			};    
			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 76rpx;
				margin-left: 25rpx;
				width: 120rpx;
				height: 75rpx;
				background: #ed5a65;
				border-radius: 50rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 28rpx;
			}
		}
	}
</style>