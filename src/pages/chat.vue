<template>
	<div>
		<div class="chat-board">
			<user-board
				@create-room-board="createRoomBoard" 
				@join-room-board="joinRoomBoard" 
				@leave-room="leaveRoom" 
				@logout="logout" 
				:username="username" 
				:room-id="roomId"
				:quantity="quantity" 
				:users="users">		
			</user-board>
			<message-board ref="messageBoard"></message-board>
			<message-input @send-message="msgHandler"></message-input>
		</div>
		<change-room 
			@close-myself="closeChangeRoom" 
			@create-room="createRoom" 
			@join-room="joinRoom"
			:is-show="isShowChangeRoomBoard" 
			:change-type="changeType">
		</change-room>
		<footer>
			<p>Copyright © 2017 ZhuYan. All Rights Reserved.</p>
		</footer>
	</div>
</template>

<script>
import UserBoard from '@/components/user_board'
import MessageBoard from '@/components/message_board'
import MessageInput from '@/components/message_input'
import ChangeRoom from '@/components/change_room'
export default {
	components: {
		UserBoard,
		MessageBoard,
		MessageInput,
		ChangeRoom
	},
	data () {
		return {
			username: 'Superman',
			roomId: '----',
			quantity: '-',
			users: [],
			isShowChangeRoomBoard: false,
			changeType: ''
		}
	},
	created () {
		this.fetchData()
	},
	methods: {
		// 获取用户数据
		fetchData () {
			socket.emit('fetch data')
			socket.on('return data', (userInfo) => {
				this.username = userInfo.username
			})
		},
		// 显示 change room 组建，加载其子组件
		createRoomBoard () {
			this.isShowChangeRoomBoard = true // 显示 change room 组件
			this.changeType = 'create'
		},
		// 与服务端通信，用于创建房间的事件
		createRoom ( createData ) {
			socket.emit('create room', createData)
			socket.on('create room success', (joinData) => {
				console.log('创建房间成功', createData)
				// 房间创建完成随即进入房间
				this.joinRoom(joinData);
			})
		},
		// 显示 change room 组建，加载其子组件
		joinRoomBoard () {
			this.isShowChangeRoomBoard = true // 显示 change room 组件
			this.changeType = 'enter'
		},
		// 与服务端通信，用于加入房间的事件
		joinRoom ( joinData ) {
			socket.emit('join room', joinData)
			socket.on('join room success', (roomData) => {
				console.log('加入房间成功')
				this.isShowChangeRoomBoard = false
				this.username = roomData.username
				this.roomId = roomData.roomId
				this.quantity = roomData.quantity
				this.users = roomData.users
				// 订阅别人加入房间事件
				socket.on('someone joined', (roomData) => {
					console.log('%s 加入了房间', roomData.username)
					this.quantity = roomData.quantity
					this.users = roomData.users

					this.sendMessage('system', roomData.username + ' 加入了房间')
				})
				// 订阅别人离开房间事件
				socket.on('someone left', (roomData) => {
					console.log('%s 离开了房间', roomData.username)
					this.quantity = roomData.quantity
					this.users = roomData.users

					this.sendMessage('system', roomData.username + ' 离开了房间')
				})
				// 订阅接受消息事件
				socket.on('send message', (msgData) => {
					if (msgData.target==='myself') {
						this.sendMessage(msgData.type, msgData.msg, msgData.name, true)
					} else {
						this.sendMessage(msgData.type, msgData.msg, msgData.name, false)
					}
				})
			})
		},
		// 触发离开房间事件
		leaveRoom () {
			socket.emit('leave room')
			socket.on('leave room success', (roomData) => {
				console.log('离开房间成功')
				this.roomId = '----'
				this.quantity = '-'
				this.users = []
			})
		},
		logout () {

		},
		// 关闭 change room 面板
		closeChangeRoom () {
			this.isShowChangeRoomBoard = false;
		},
		// 系统消息工厂方法
		systemMessageFactory (message) {
			var div = document.createElement('div')
			var span = document.createElement('span')
			div.classList.add('message-notice')
			span.classList.add('system-message')
			span.textContent = message
			div.appendChild(span)
			return div
		},
		// 普通消息工厂方法
		commonMessageFactory (message, name, isSelf) {
			var div = document.createElement('div')
			var img = document.createElement('img')
			var spanName = document.createElement('span')
			var spanMsg = document.createElement('span')
			// var spanArrow = document.createElement('span')
			div.classList.add('common-message')
			if (isSelf) {
				img.classList.add('msg-img-self')
				spanName.classList.add('msg-name-self')
				spanMsg.classList.add('msg-msg-self')
				// spanArrow.classListadd('msg-arrow-self')
			} else {
				img.classList.add('msg-img')
				spanName.classList.add('msg-name')
				spanMsg.classList.add('msg-msg')
				// spanArrow.classListadd('msg-arrow')
			}
			img.setAttribute('src', require('../assets/avatar.jpg'))
			spanName.textContent = name
			spanMsg.textContent = message
			div.appendChild(img)
			div.appendChild(spanName)
			div.appendChild(spanMsg)
			return div
		},
		// 消息控制，将子组件发送的信息传入 sendMessage 方法
		msgHandler (msg) {
			socket.emit('handle message', msg)
		},
		// 发送消息
		sendMessage (type, message, name, isSelf) {
			if (type==='system') {
				var msg = this.systemMessageFactory(message)
				this.$refs.messageBoard.sendMessage(msg)
			} else {
				var msg = this.commonMessageFactory(message, name, isSelf)
				this.$refs.messageBoard.sendMessage(msg)
			}
		}
	}
}
</script>

<style scoped>
.chat-board {
	position: absolute;
	top: 10%;
	left: 50%;
	transform: translateX(-50%);
	width: 900px;
	height: 640px;
	box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
	border-radius: 3px;
	overflow: hidden;
}
footer {
	position: absolute;
	bottom: 2%;
	left: 50%;
	transform: translateX(-50%);
	font-size: 12px;
	color: #ddd;
	font-weight: 200;
}
</style>