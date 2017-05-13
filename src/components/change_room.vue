<template>
	<div class="note-wrap">
		<div class="note-cover" v-show="isShow" @click="closeMyself"></div>
		<transition name="drop">
			<div class="note-board" v-show="isShow">
				<div class="close" @click="closeMyself">x</div>
				<change-type :change-type="changeType"
					@join-room="joinRoom" 
					@create-room="createRoom">
				</change-type>
				<p class="note-warnning">{{ warnning }}</p>
			</div>
		</transition>
	</div>
</template>

<script>
import ChangeType from '@/components/change_type'
export default {
	components: {
		ChangeType
	},
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		changeType: {
			type: String,
			default: 'enter'
		}
	},
	data () {
		return {
			warnning: ''
		}
	},
	methods: {
		closeMyself () {
			this.$emit('close-myself')
		},
		// 触发进入房间的事件
		joinRoom ( joinData ) {
			this.$emit('join-room', joinData)
		},
		// 触发创建房间的事件
		createRoom ( createData ) {
			this.$emit('create-room', createData)
		},
		// 警告
		showWarnning ( data ) {
			this.warnning = data
		}
	}
}
</script>

<style>
.note-cover {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	z-index: 999;
}
.note-board {
	position: absolute;
	top: 30%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	padding: 30px 20px;
	width: 520px;
	background: #fff;
	font-size: 13px;
	color: #333;
	z-index: 9999;
}
p {
	line-height: 1.5;
}
input {
	outline: none;
	margin-top: 10px;
	padding: 5px;
	height: 33px;
	border: 1px solid #ccc;
	color: #333;
}
input:focus {
	border-color: rgb(100, 100, 255);
}
button {
	outline: none;
	border: 0;
	background: rgb(100, 100, 255);
	color: #fff;
	padding: 5px 8px;
	height: 33px;
	cursor: pointer;
}
button:hover {
	background: rgb(80, 80, 255);
}
.notice {
	font-size: 12px;
	color: rgb(255, 100, 100);
}
.close {
	position: absolute;
	right: 10px;
	top: 5px;
	color: #333;
	font-size: 14px;
	cursor: pointer;
}
.note-warnning {
	margin-top: 8px;
	height: 1.5rem;
	line-height: 1.5;
	color: rgb(255, 80, 80);
}

.drop-enter-active, .drop-leave {
	transition: all 0.5s;
}
.drop-enter, .drop-leave-active {
	top: 0;
}
</style>