<template>
	<view class="content-box">
		<u-toast ref="uToast" />
		<u-overlay :show="showLoadingHint"></u-overlay>
		<u-loading-icon :show="showLoadingHint" color="#fff" textColor="#fff" :text="infoText" size="20" textSize="18"></u-loading-icon>
		<view v-if="nurseMessageLoadComplete">
			<u-datetime-picker
				:show="workingSeniorityDialogShow"
				v-model="workingSeniorityValue"
				@confirm="workingSeniorityConfirm"
				@cancel="workingSeniorityDialogShow = false"
				mode="date"
			></u-datetime-picker>
		</view>
		<view class="top-area-box">
			<view class="nav">
				<nav-bar :home="false" backState='3000' bgColor="none" title="完善个人信息" @backClick="backTo">
				</nav-bar> 
		  </view>
		</view>
		<view class="personal-message-box">
			<view class="personal-message-top">
				<view class="personal-photo">
					<image :src="personPhotoSource" @click="getImg"></image>
				</view>
				<view class="account-number">
					<view class="account-number-left">
						<text>账号</text>
					</view>
					<view class="account-number-right">
						<text>{{ !userBasicInfo || JSON.stringify(userBasicInfo) == '{}' ? '' : userBasicInfo.mobile  }}</text>
					</view>
				</view>
				<view class="person-name">
					<view class="person-name-left">
						<text>姓名</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="请输入姓名"
							fontSize="14px"
							disabledColor="#fff"
							disabled
							color="#979797"
							v-model="personNameValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name id-card-number">
					<view class="person-name-left">
						<text>身份证号</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="身份证号"
							@blur="idcardBlurEvent"
							disabled
							disabledColor="#fff"
							fontSize="14px"
							color="#979797"
							readonly
							v-model="idCardValue"
							border="none"
							type="idcard"
						></u--input>
					</view>
				</view>
				<view class="person-name gender-box">
					<view class="person-name-left">
						<text>性别</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="性别"
							disabled
							disabledColor="#fff"
							fontSize="14px"
							color="#979797"
							v-model="genderValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name birthday-box">
					<view class="person-name-left">
						<text>生日</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="生日"
							disabled
							disabledColor="#fff"
							fontSize="14px"
							color="#979797"
							v-model="birthdayValue"
							border="none"
						></u--input>
					</view>
				</view>
				<view class="person-name age-box">
					<view class="person-name-left">
						<text>年龄</text>
					</view>
					<view class="person-name-right">
						<u--input
							placeholder="年龄"
							disabled
							disabledColor="#fff"
							fontSize="14px"
							color="#979797"
							v-model="ageValue"
							border="none"
							type="number"
						></u--input>
					</view>
				</view>
				<view class="no-authentication-box" v-if="perfect != 'YES'">
					<text>还未进行实名认证</text>
					<text>去认证</text>
				</view>
				<view class="professional-title">
					<view class="professional-title-left professional-title-left-other">
						<text>职称</text>
					</view>
					<view class="professional-title-right" v-if="nurseMessageLoadComplete">
						<w-select
								style="margin-left:10px;"
								:defaultValue="defaultProfessionalTitleValue"
								v-model='professionalTitleValue'
								:list='professionalTitleList'
								valueName='content'
								:isCutShow="false"
								keyName="id"
								@change='professionalTitleChange'
							>
						</w-select>
					</view>
				</view>
				<view class="professional-title organization-box">
					<view class="professional-title-left professional-title-left-other">
						<text>机构</text>
					</view>
					<view class="professional-title-right" v-if="nurseMessageLoadComplete">
						<w-select
								style="margin-left:10px;"
								:defaultValue="defaultOrganizationValue"
								v-model='organizationValue'
								:isCutShow="false"
								:list='organizationList'
								valueName='content' 
								keyName="id"
								@change='organizationChange'
							>
						</w-select>
					</view>
				</view>
				<view class="emergency-contact-number">
					<view class="emergency-contact-number-left">
						<text>*</text>
						<text>紧急联系人方式</text>
					</view>
					<view class="emergency-contact-number-right">
						<u--input
							placeholder="请输入紧急联系人方式"
							fontSize="14px"
							color="#979797"
							v-model="emergencyContactNumberValue"
							border="none"
							type="number"
						></u--input>
					</view>
				</view>
				<view class="professional-title organization-box">
					<view class="professional-title-left">
						<text>*</text>
						<text>从业时间</text>
					</view>
					<view class="working-seniority" @click="workingSeniorityChooseEvent">
						 <view class="working-seniority-left">
							 {{ workingSeniorityDefaultValue }}
						 </view>
						 <view class="working-seniority-right">
							 <u-icon name="calendar" size="20" color="#C1C1C1"></u-icon>
						 </view>
					</view>
				</view>
				<view class="emergency-contact-number service-quantity">
					<view class="emergency-contact-number-left">
						<text>*</text>
						<text>服务量 (人)</text>
					</view>
					<view class="emergency-contact-number-right">
						<u--input
							placeholder="请输入您从业至今护理人数(大概)"
							fontSize="14px"
							color="#979797"
							v-model="serviceQuantityValue"
							border="none"
							type="number"
						></u--input>
					</view>
				</view>
				<view class="service-duration">
					<view class="service-duration-left">
						<text>*</text>
						<text>服务时长 (小时)</text>
					</view>
					<view class="service-duration-right">
						<u--input
							placeholder="请输入您从业至今护理服务时长(大概)"
							fontSize="14px"
							color="#979797"
							v-model="serviceDurationValue"
							border="none"
							type="number"
						></u--input>
					</view>
				</view>
				<view class="service-point">
					<view class="service-point-left">
						<text>服务特长</text>
					</view>
					<view class="service-point-right" @click="servicePointRightClickEvent">
						<view class="service-point-content">{{ selectServicePoint }}</view>
						<u-icon :name="isShowServicePointDropDown ? 'arrow-down' : 'arrow-up'"></u-icon>
						<view class="service-point-drop-down-wrapper" v-if="isShowServicePointDropDown">
							<view class="service-point-drop-down-list" v-for="(item,index) in serviceProjectList" :key="index" :class="{'servicePointDropdownListStyle':item.selected}" @click.stop="servicePointItemClickEvent(item,index)">
								<text :class="{'checkTextStyle':item.selected}">{{ item.content }}</text>
								<u-icon name="checkmark" color="#3B9DF9" size="20" v-if="item.selected"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="personal-message-bottom">
				<view class="intro-title">
					<text>个人简介</text>
				</view>
				<view class="intro-content">
					<u--textarea v-model="introValue" height="100" :formatter="formatter" ref="textarea" border="none" :count="true" maxlength="150" placeholder="个人名片简介（150字），例如：从事产科临床工作二十余年，母乳喂养咨询工作多年，有丰富的母婴护理及母乳喂养实践经验。对母乳喂养问题处理、哺乳期乳房问题、早产儿喂养等均有深入研究。" ></u--textarea>
				</view>
			</view>
		</view>
		<view class="save-btn-box">
			<view class="save-btn" @click="saveEvent">
				<text>保存</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import store from '@/store'
	import {
		setCache,
		removeAllLocalStorage,
		IdCard
	} from '@/common/js/utils'
	import { getUserDictData } from '@/api/login.js'
	import { getUserMessage ,medicalCarePerfect, getMedicalCareDetails, getOrganizationList, getServiceProductSimpleList } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	import wSelect from '@/components/w-select/w-select.vue'
	export default {
		components: {
			navBar,
			wSelect
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '保存中···',
				isShowServicePointDropDown: false,
				selectServicePoint: '请选择服务特长',
				workingSeniorityDefaultValue: '请选择从业时间',
				workingSeniorityDialogShow: false,
				workingSeniorityValue: Number(new Date()),
				perfect: '',
				personNameValue: '—',
				idCardValue: '—',
				genderValue: '—',
				birthdayValue: '—',
				ageValue: '—',
				emergencyContactNumberValue: '',
				serviceQuantityValue: '',
				serviceDurationValue: '',
				introValue: '',
				professionalTitleValue: "",
				defaultProfessionalTitleValue: "— (请联系管理员填写)",
				professionalTitleList: [],
				organizationValue: '',
				defaultOrganizationValue: '— (请联系管理员填写)',
				organizationList: [],
				personPhotoSource: '',
				personPhotoFile: '',
				photoImageOnlinePath: '',
				personPhotoBase64: '',
				serviceProjectList: [],
				nurseMessageLoadComplete: false,
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png")
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			}
		},
		onShow () {
			// 查询医护详细信息
			this.getMedicalCareDetailsEvent()
		},
		onReady() {
			this.$refs.textarea.setFormatter(this.formatter)
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 个人简介过滤空格函数
			formatter(value) {
				return value.replace(/\s*/g,"")
			},
			
			// 服务特长下拉框切换事件
			servicePointRightClickEvent () {
				this.isShowServicePointDropDown = !this.isShowServicePointDropDown
			},
			
			// 服务特长项点击事件
			servicePointItemClickEvent (item,index) {
				if (!item.selected) {
					if (this.serviceProjectList.filter((el) => { return el.selected == true }).length >= 4) {
						this.$refs.uToast.show({
							message: '不能超出4项服务特长!',
							type: 'error',
							position: 'bottom'
						});
						return
					}
				};	
				item.selected = !item.selected;
				let temporarySelectServicePointList = this.serviceProjectList.filter((el) => { return el.selected == true });
				let temporarySelectServicePoint = [];
				for ( let elItem of temporarySelectServicePointList) {
					temporarySelectServicePoint.push(elItem.content)
				};
				if (temporarySelectServicePoint.length == 0) {
					this.selectServicePoint = '请选择服务特长'
				} else {
					this.selectServicePoint = temporarySelectServicePoint.join(';');
				}
			},
			
			// 获取服务特长
			queryServiceProductSimpleList() {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.serviceProjectList = [];
				getServiceProductSimpleList().then((res) => {
					if ( res && res.data.code == 0) {
						let productTypeList = res.data.data;
						for (let item of productTypeList) {
							this.serviceProjectList.push({
								id: item.id,
								content: item.name,
								selected: false
							})
						};
						let temporarySelectServicePointArr = '';
						if (this.selectServicePoint != '请选择服务特长') {
							let temporarySelectServicePointArr = this.selectServicePoint.split(';');
							for (let item of temporarySelectServicePointArr) {
								this.serviceProjectList.forEach((el) => {
									if (el.content == item) {
										el.selected = true
									}
								})
							}
						};
						if (res.data.data.length == 0) {
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 获取医护详细信息
			getMedicalCareDetailsEvent () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.nurseMessageLoadComplete = false;
				getMedicalCareDetails().then((res) => {
					if ( res && res.data.code == 0) {
						// 查询组织机构信息
						this.getOrganizationListEvent();
						// 查询职称信息
						this.getUserDictDataEvent();
						// 查询服务特长
						this.queryServiceProductSimpleList();
						this.personPhotoSource = !res.data.data.avatar ? this.defaultPersonPhotoIconPng : res.data.data.avatar;
						this.photoImageOnlinePath = !res.data.data.avatar ? '' : res.data.data.avatar;
						if (res.data.data.perfect != 'YES') {
							this.personNameValue = '—';
							this.idCardValue = '—';
							this.genderValue = '—';
							this.birthdayValue = '—';
							this.ageValue = '—';
						} else {
							this.personNameValue = res.data.data.name;
							this.idCardValue = res.data.data.idCard;
							this.genderValue = res.data.data.sex == 1 ? '男' : res.data.data.sex == 2 ? '女' : '';
							this.birthdayValue = res.data.data.birthday;
							this.ageValue = res.data.data.age;
						};
						this.emergencyContactNumberValue = res.data.data.critical;
						this.selectServicePoint = res.data.data.genius.length == 0 ? '请选择服务特长' : res.data.data.genius.join(';');
						this.professionalTitleValue = res.data.data.title ? res.data.data.title.toString() : '';
						this.organizationValue = res.data.data.organization ? res.data.data.organization.toString() : '';
						this.workingSeniorityDefaultValue = !res.data.data.practiceTime ? '请选择从业时间' : this.getNowFormatDate(new Date(res.data.data.practiceTime),2);
						this.workingSeniorityValue = !res.data.data.practiceTime ? Number(new Date()) : Number(new Date(res.data.data.practiceTime));
						this.serviceQuantityValue = res.data.data.quantity;
						this.serviceDurationValue = res.data.data.timeLength;
						this.introValue =  res.data.data.introduction;
						this.perfect = res.data.data.perfect
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					this.nurseMessageLoadComplete = true;
					this.showLoadingHint = false
				})
				.catch((err) => {
					this.nurseMessageLoadComplete = true;
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 身份证号输入框失去焦点事件
			idcardBlurEvent () {
				let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!regIdCard.test(this.idCardValue)) {
					if (this.idCardValue) {
						this.$refs.uToast.show({
							message: '身份证格式格式有误,请重新输入!',
							type: 'error',
							position: 'center'
						});
						this.birthdayValue = '—';
						this.genderValue = '—';
						this.ageValue = '—'
					}  
				} else {
					this.birthdayValue = IdCard(this.idCardValue,1);
					this.genderValue = IdCard(this.idCardValue,2);
					this.ageValue = IdCard(this.idCardValue,3)
				}
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 从业时间弹框隐藏显示事件
			workingSeniorityChooseEvent () {
				this.workingSeniorityDialogShow = true
			},
			
			// 从业时间选择变化事件
			workingSeniorityConfirm (value) {
				this.workingSeniorityDialogShow = false;
				this.workingSeniorityDefaultValue = this.getNowFormatDate(new Date(value.value),2)
			},
			
			// 职称下拉框值改变事件
			professionalTitleChange(e) {
				console.log('职称',e, this.professionalTitleValue)
			},
			
			// 机构下拉框值改变事件
			organizationChange(e) {
				console.log('机构',e, this.organizationValue)
			},
			
			// 获取组织机构信息
			getOrganizationListEvent () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.organizationList = [];
				getOrganizationList().then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.organizationList.push({
									id: item.id.toString(),
									content: item.name
								})
							};
							let temporaryMessageArr = this.organizationList.filter((innerItem) => { return innerItem.id == this.organizationValue });
							if (temporaryMessageArr.length > 0) {
								this.defaultOrganizationValue = temporaryMessageArr[0]['content']
							} else {
								this.defaultOrganizationValue = '— (请联系管理员填写)'
							}
						}
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			//获取护师职称数据
			getUserDictDataEvent () {
				this.showLoadingHint = true;
				this.infoText = '加载中...';
				this.professionalTitleList = [];
				getUserDictData({type: 'technical_title'}).then((res) => {
					this.showLoadingHint = false;
					if ( res && res.data.code == 0) {
						if (res.data.data.length > 0) {
							for (let item of res.data.data) {
								this.professionalTitleList.push({
									id: item.value,
									content: item.label
								})
							};
							let temporaryMessageArr = this.professionalTitleList.filter((innerItem) => { return innerItem.id == this.professionalTitleValue });
							if (temporaryMessageArr.length > 0) {
								this.defaultProfessionalTitleValue = temporaryMessageArr[0]['content']
							} else {
								this.defaultProfessionalTitleValue = "— (请联系管理员填写)"
							}
						}
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 保存事件
			async saveEvent () {
				if (!this.emergencyContactNumberValue) {
					this.$refs.uToast.show({
						message: '请输入紧急联系人方式',
						type: 'error',
						position: 'center'
					});
					return
				};
				// if (!this.professionalTitleValue && this.professionalTitleValue !== 0) {
				// 	this.$refs.uToast.show({
				// 		message: '请选择您的职称',
				// 		type: 'error',
				// 		position: 'center'
				// 	});
				// 	return
				// };
				// if (!this.organizationValue && this.organizationValue !== 0) {
				// 	this.$refs.uToast.show({
				// 		message: '请选择您挂靠的机构',
				// 		type: 'error',
				// 		position: 'center'
				// 	});
				// 	return
				// };
				if (this.workingSeniorityDefaultValue == '请选择从业时间') {
					this.$refs.uToast.show({
						message: '请选择从业时间',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!this.serviceQuantityValue) {
					this.$refs.uToast.show({
						message: '请输入服务量',
						type: 'error',
						position: 'center'
					});
					return
				};
				if (!this.serviceDurationValue) {
					this.$refs.uToast.show({
						message: '请输入从业时长',
						type: 'error',
						position: 'center'
					});
					return
				};
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.emergencyContactNumberValue)) {
					this.$refs.uToast.show({
						message: '输入紧急联系人方式有误，请核对后重新输入!',
						type: 'error',
						position: 'center'
					});
					return
				};
				let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!regIdCard.test(this.idCardValue)) {
					if (this.idCardValue) {
						this.$refs.uToast.show({
							message: '身份证格式格式有误,请重新输入!',
							type: 'error',
							position: 'center'
						});
						return
					}  
				};
				// 上传图片文件流到服务端(头像)
				if (this.personPhotoFile) {
					if (this.personPhotoFile.indexOf('http://') == -1 || this.personPhotoFile.indexOf('https://') == -1) {
						await this.uploadFileEvent(this.personPhotoFile)
					}
				};	
				this.medicalCarePerfectEvent({
					id: this.userInfo.careId,
					name: this.personNameValue == '—' ? '' : this.personNameValue,
					idCard: this.idCardValue == '—' ? '' : this.idCardValue,
					birthday: this.birthdayValue == '—' ? '' : this.birthdayValue,
					sex: this.genderValue == '—' ? '' : this.genderValue == '男' ? 1 : 2,
					critical: this.emergencyContactNumberValue,
					title: this.professionalTitleValue,
					organization: this.organizationValue,
					quantity: this.serviceQuantityValue,
					timeLength: this.serviceDurationValue,
					practiceTime: this.workingSeniorityDefaultValue == '请选择从业时间' ? '' : this.workingSeniorityDefaultValue,
					genius: this.selectServicePoint == '请选择服务特长' ? [] : this.selectServicePoint.split(';'),
					introduction: this.introValue,
					avatar: !this.photoImageOnlinePath ? '' : this.photoImageOnlinePath,
					email: ""
				})
			},
			
			// 上传图片方法
			getImg() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							let url = res.tempFiles[imgI].path;
							//获取最后一个的位置
							let index = url.lastIndexOf(".");
							//获取后缀
							let jpgUrl = url.substr(index + 1);
							if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
								that.$refs.uToast.show({
									message: '只可上传jpg或png格式的图片!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							let isLt2M = res.tempFiles[imgI].size/1024/1024 < 10;
							if (!isLt2M) {
								that.$refs.uToast.show({
									message: '图片必须小于10MB!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							that.personPhotoFile = res.tempFiles[imgI]['path'];
							uni.getFileSystemManager().readFile({
								filePath: res.tempFilePaths[imgI],
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.personPhotoBase64 = base64;
									that.personPhotoSource = that.personPhotoBase64;
								}
							})
						}
					}
				})
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI) {
				this.infoText = '上传中···';
				this.showLoadingHint = true;
				return new Promise((resolve, reject) => {
					uni.uploadFile({
					 url: 'https://dev.nurse.blinktech.cn/nurse/app-api/infra/file/upload',
					 filePath: imgI,
					 name: 'file',
					 header: {
						'content-type': 'multipart/form-data',
						'Authorization': `Bearer ${store.getters.token}`
					 },
					 success: (res) => {
						if (res.statusCode == 200 && JSON.parse(res.data).code == 0) {
							let temporaryData = JSON.parse(res.data);
							this.photoImageOnlinePath = temporaryData.data;
							resolve()
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '上传图片失败',
								type: 'error',
								position: 'center'
							});
							reject()
						}
					 },
					 fail: (err) => {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: err.errMsg,
							type: 'error',
							duration: 5000,
							position: 'center'
						});
						reject()
					 }
					})
				})
			},
			
			// 完善个人信息事件
			medicalCarePerfectEvent (data) {
				this.infoText = '保存中···';
				this.showLoadingHint = true;
				medicalCarePerfect(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.$refs.uToast.show({
							message: '信息完善成功',
							type: 'success',
							position: 'center'
						});
						uni.navigateBack()
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
		background: #F9F9F9;
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
			background: #F9F9F9;
			width: 100%;
			height: 100px;
			::v-deep .nav {
				width: 100%;
				background: #F9F9F9;
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
		.personal-message-box {
			flex: 1;
			overflow: auto;
			padding: 10px 0;
			box-sizing: border-box;
			background: #fff;
			.personal-message-top {
				.personal-photo {
					width: 100%;
					height: 120px;
					display: flex;
					align-items: center;
					justify-content: center;
					image {
						width: 100px;
						height: 100px;
						border-radius: 50%;
					}
				};
				.account-number {
					display: flex;
					align-items: center;
					padding: 8px 10px;
					box-sizing: border-box;
					.account-number-left {
						font-size: 16px;
						color: #101010;
						font-weight: bold;
						width: 100px;
					};
					.account-number-right {
						flex: 1;
						font-size: 14px;
						color: #979797
					}
				};
				.no-authentication-box {
					height: 46px;
					background: #F9F9F9;
					display: flex;
					justify-content: center;
					align-items: center;
					border-bottom: 1px solid #e6e6e6;
					>text {
						display: inline-block;
						&:first-child {
							font-size: 14px;
							color: #979797;
							margin-right: 20px;
						};
						&:last-child {
							width: 84px;
							height: 31px;
							font-size: 14px;
							color: #fff;
							background: #5064EB;
							border-radius: 18px;
							line-height: 31px;
							text-align: center
						}
					}
				};
				.person-name {
					display: flex;
					align-items: center;
					padding: 8px 10px;
					box-sizing: border-box;
					@include bottom-border-1px(#BBBBBB);
					.person-name-left {
						font-size: 16px;
						color: #101010;
						width: 100px;
						font-weight: bold
					};
					.person-name-right {
						flex: 1;
						font-size: 14px;
						color: #979797
					}
				};
				.emergency-contact-number {
					display: flex;
					align-items: center;
					padding: 8px 10px;
					box-sizing: border-box;
					@include bottom-border-1px(#BBBBBB);
					.emergency-contact-number-left {
						>text {
							&:first-child {
								color: red;
								margin-right: 6px;
							};
							&:last-child {
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.emergency-contact-number-right {
						flex: 1;
						padding-left: 20px;
						box-sizing: border-box;
						font-size: 14px;
						color: #979797
					}
				};
				.professional-title {
					display: flex;
					align-items: center;
					padding: 8px 10px;
					box-sizing: border-box;
					border-bottom: 6px solid #f6f6f6;
					.professional-title-left {
						width: 100px;
						>text {
							&:first-child {
								color: red;
								margin-right: 6px;
							};
							&:last-child {
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.professional-title-left-other {
						width: 100px;
						>text {
							font-size: 16px;
							color: #101010;
							font-weight: bold
						}
					};
					.professional-title-right {
						flex: 1;
						font-size: 14px;
						color: #979797;
						display: flex;
						::v-deep .w-select {
							width: 100%;
							--select-border: none;
							margin-left: 0 !important;
							.select-wrap-active {
								border: none
							};
							.select-wrap {
								width: 100%;
								// .select-options {
								// 	top: 46px;
								// 	bottom: none !important
								// };
								.w-select-arrow {
									display: none;
								};
								.uni-input-placeholder {
									font-size: 14px !important;
									color: #979797 !important
								};
								input {
									font-size: 14px !important;
									color: #979797 !important
								};
								.select-content-item {
									font-size: 14px !important;
									color: #979797 !important
								}
							}	
						};
						::v-deep w-select {
							width: 100%;
							--select-border: none;
							margin-left: 0 !important;
							.select-wrap-active {
								border: none
							};
							.select-wrap {
								width: 100%;
								// .select-options {
								// 	top: 46px;
								// 	bottom: none !important
								// };
								.uni-input-placeholder {
									font-size: 14px !important;
									color: #979797 !important
								};
								input {
									font-size: 14px !important;
									color: #979797 !important
								};
								.select-content-item {
									font-size: 14px !important;
									color: #979797 !important
								}
							}	
						}
					};
					.working-seniority {
						flex: 1;
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 30px;
						padding: 4px;
						box-sizing: border-box;
						border: 1px solid #D9D9D9;
						border-radius: 3px;
						.working-seniority-left {
							font-size: 14px;
							color: #979797;
							flex: 1;
							padding-right: 10px;
							box-sizing: border-box
						}
					}
				};
				.service-duration {
					display: flex;
					align-items: center;
					padding: 8px 10px;
					box-sizing: border-box;
					@include bottom-border-1px(#BBBBBB);
					.service-duration-left {
						>text {
							&:first-child {
								color: red;
								margin-right: 6px;
							};
							&:last-child {
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.service-duration-right {
						flex: 1;
						padding-left: 20px;
						box-sizing: border-box;
						font-size: 14px;
						color: #979797
					}
				};
				.service-point {
					display: flex;
					align-items: center;
					padding: 8px 10px;
					box-sizing: border-box;
					@include bottom-border-1px(#BBBBBB);
					.service-point-left {
						margin-right: 20px;
						>text {
							&:first-child {
								padding-left: 14px;
								box-sizing: border-box;
								font-size: 16px;
								color: #101010;
								font-weight: bold
							}
						}
					};
					.service-point-right {
						flex: 1;
						position: relative;
						width: 0;
						margin-left: 20px;
						font-size: 14px;
						color: #979797;
						display: flex;
						align-items: center;
						.service-point-content {
							flex: 1;
							font-size: 14px;
							color: #979797;
							@include no-wrap;
						};
						.service-point-drop-down-wrapper {
							position: absolute;
							z-index: 100;
							top: 28px;
							left: 0;
							width: 100%;
							padding: 6px 4px;
							box-sizing: border-box;
							max-height: 154px;
							overflow-y: auto;
							background: #fff;
							border-radius: 7px;
							box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
							.service-point-drop-down-list {
								height: 25px;
								padding: 0 2px;
								box-sizing: border-box;
								width: 100%;
								display: flex;
								margin-bottom: 2px;
								>text {
									flex: 1;
									@include no-wrap;
									font-size: 14px;
									color: #BBBBBB;
								};
								.checkTextStyle {
									color: #3B9DF9 !important
								}
							};
							.servicePointDropdownListStyle {
								background: #F5F7FA
							}
						}
					}
				}
			};
			.personal-message-bottom {
				padding: 10px;
				box-sizing: border-box;
				background: #f6f6f6;
				.intro-title {
					padding-left: 14px;
					box-sizing: border-box;
					font-size: 16px;
					color: #101010;
					font-weight: bold;
				};
				.intro-content {
					margin-top: 10px;
					::v-deep .u-textarea {
						padding: 9px 14px !important;
					}
				}
			}
		};
		.save-btn-box {
			height: 80px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.save-btn {
				width: 190px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #5064EB;
				border-radius: 30px;
				color: #fff;
				font-size: 14px
			}
		}
	}
</style>
