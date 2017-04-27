<template>
	<div>
		<div class="user-board">
			<div class="user-info">
				<img :src="avatar">
				<p>
					<span>{{ username }}</span>
				</p>
			</div>
			<div class="room-info">
				<p>房间号：<span>{{ roomId }}</span></p>
				<p>房间人数：<span>{{ quantity }}</span></p>
			</div>
			<div class="utils">
				<div>
					<button @click="createRoomBoard">创建房间</button>
					<button @click="joinRoomBoard">进入房间</button>
					<button @click="leaveRoom">离开房间</button>
					<button @click="logout">注销</button>
				</div>
			</div>
			<div class="room-members">
				<ul>
					<li v-for="(value, key) in users">{{ key + ': ' + value }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		username: {
			type: String,
			default: 'Superman'
		},
		roomId: {
			type: String,
			default: 'loading...'
		},
		quantity: {
			type: [Number, String],
			default: '-'
		},
		users: {
			type: Array,
			default: function() {
				return [
					'超人',
					'超人他爸',
					'超人他爷爷',
					'蝙蝠侠',
					'蝙蝠侠他爸',
				]
			}
		}
	},
	data () {
		return {
			avatar: require('../assets/avatar.jpg'),
		}
	},
	methods: {
		// 显示创建房间面板事件
		createRoomBoard () {
			this.$emit('create-room-board')
		},
		// 显示进入房间面板事件
		joinRoomBoard () {
			this.$emit('join-room-board')
		},
		leaveRoom () {
			this.$emit('leave-room')
		},
		logout () {
			this.$emit('logout')
		}
	}
}
</script>

<style scoped>
.user-board {
	position: absolute;
	width: 260px;
	height: 100%;
	background: #2e3238;
	overflow: hidden;
	z-index: 999;
}
.user-info {
	width: 100%;
	line-height: 48px;
	padding: 12px;
	font-size: 16px;
	color: #ccc;
}
.user-info img {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	position: absolute;
}
.user-info span {
	margin-left: 8px;
}
.user-info p {
	position: relative;
	display: inline-block;
	width: 100%;
	padding-left: 48px;
	vertical-align: middle;
	line-height: 24px;
}
.arrow {
	position: absolute;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	vertical-align: middle;
	font-size: 0;
	border-top: 6px solid #ccc;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	cursor: pointer;
}
.room-info {
	font-size: 12px;
	padding-left: 19px;
	color: rgb(100, 255, 255);
	font-weight: 200;
	margin-top: -5px;
}
.room-info p {
	display: inline-block;
	width: 8em;
	line-height: 1.5;
}
.room-info p:last-child {
	margin-left: 1em;
}
.utils {
	border-bottom: 1px solid #222;
	padding-left: 14px;
	padding-right: 14px;
	padding-bottom: 10px;
}
.utils div {
	position: relative;
}
.utils button {
	border: 0;
	font-size: 12px;
	color: #999;
	background: transparent;
	cursor: pointer;
	transition: all 0.5s;
	outline: none;
	margin: 0;
	padding: 0 5px;
}
.utils button:hover {
	color: #ccc;
}
.utils button:last-child {
	position: absolute;
	right: 0;
}
.room-members {
	height: 100%;
	overflow-x: hidden;
	overflow-y: scroll;
	color: #ccc;
	font-weight: 200;
	padding: 12px;
}
.room-members::-webkit-scrollbar {
	display: none;
}
.room-members li {

}
</style>