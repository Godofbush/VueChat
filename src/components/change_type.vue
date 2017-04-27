<template>
	<div>
		<p v-show="changeType==='enter'">请输入房间号，然后点击{{ theType }}房间以继续。</p>
		<p v-show="changeType==='create'">请输入房间号，然后点击{{ theType }}房间以继续。密码为空则表示不设密码。</p>

		<p class="notice">注意，房间号由四个数字组成，如：0001</p>
		<input type="text" name="roomid" v-model="roomId" placeholder="房间号">
		<input type="text" name="roompwd" v-model="roomPwd" placeholder="密码">
		<button @click="emitChangeType">{{ theType }}房间</button>
	</div>
</template>

<script>
export default {
	props: {
		changeType: {
			type: String,
			default: 'enter'
		}
	},
	data () {
		return {
			roomId: '',
			roomPwd: ''
		}
	},
	methods: {
		// 触发进入房间／创建房间的过渡事件
		emitChangeType () {
			if (this.changeType==='enter') {
				this.$emit('join-room', {
					roomId: this.roomId,
					roomPwd: this.roomPwd
				})
			} else if (this.changeType==='create') {
				this.$emit('create-room', {
					roomId: this.roomId,
					roomPwd: this.roomPwd
				})
			}
		}
	},
	computed: {
		theType () {
			if (this.changeType==='enter') {
				return '进入'
			} else {
				return '创建'
			}
		}
	}
}
</script>

<style scoped>

</style>