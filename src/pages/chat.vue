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
		<change-room ref="changeRoom"
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
			socket.once('return data', (userInfo) => {
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
			// 警告信息
			socket.once('warnning', (data) => {
				if (data.msg==='roomExisted') {
					console.log('【警告】房间已存在')
					this.$refs.changeRoom.showWarnning('房间已存在')
				}
				this.removeServerListener('create room success')
			})
			socket.emit('create room', createData)
			socket.once('create room success', (joinData) => {
				console.log('创建房间成功', createData)
				// 房间创建完成随即进入房间
				this.joinRoom(joinData);
				this.removeServerListener('warnning')
			})
		},
		// 显示 change room 组建，加载其子组件
		joinRoomBoard () {
			this.isShowChangeRoomBoard = true // 显示 change room 组件
			this.changeType = 'enter'
		},
		// 与服务端通信，用于加入房间的事件
		joinRoom ( joinData ) {
			// 警告信息
			socket.once('warnning', (data) => {
				if (data.msg === 'roomUnexist') {
					console.log('【警告】房间不存在')
					this.$refs.changeRoom.showWarnning('房间不存在')
				}
				if (data.msg === 'alreadyInRoom') {
					console.log('【警告】已在房间中');
					this.$refs.changeRoom.showWarnning('已经在房间中')
				}
				this.removeServerListener('join room success')
			})
			socket.emit('join room', joinData)
			socket.once('join room success', (roomData) => {
				console.log('加入房间成功')
				this.isShowChangeRoomBoard = false
				this.username = roomData.username
				this.roomId = roomData.roomId
				this.quantity = roomData.quantity
				this.users = roomData.users
				this.sendMessage({
					type: 'system',
					msg: '您已加入 ' + this.roomId + '房间'
				})
				// 订阅别人加入房间事件
				socket.on('someone joined', (roomData) => {
					console.log('%s 加入了房间', roomData.username)
					this.quantity = roomData.quantity
					this.users = roomData.users

					this.sendMessage({
						type: 'system', 
						msg: roomData.username + ' 加入了房间'
					})
				})
				// 订阅别人离开房间事件
				socket.on('someone left', (roomData) => {
					console.log('%s 离开了房间', roomData.username)
					this.quantity = roomData.quantity
					this.users = roomData.users

					this.sendMessage({
						type: 'system', 
						msg: roomData.username + ' 离开了房间'
					})
				})
				// 订阅接受消息事件
				socket.on('send message', (msgData) => {
					if (msgData.target==='myself') {
						this.sendMessage(msgData)
					} else {
						this.sendMessage(msgData)
					}
				})
				this.removeServerListener('warnning')
			})
		},
		// 触发离开房间事件
		leaveRoom () {
			socket.emit('leave room')
			socket.once('leave room success', (roomData) => {
				console.log('离开房间成功')
				this.sendMessage({
					type: 'system',
					msg: '您已离开 ' + this.roomId + '房间'
				})
				this.roomId = '----'
				this.quantity = '-'
				this.users = []
				this.removeServerListener('someone joined')
				this.removeServerListener('someone left')
				this.removeServerListener('send message')
			})
		},
		// 删除不需要的监听器，释放内存，避免发生错误
		removeServerListener (listener) {
			var listenerName = listener
			if (socket.hasListeners(listenerName)) {
				socket.off(listenerName)
			}
		},
		logout () {

		},
		// 关闭 change room 面板
		closeChangeRoom () {
			this.isShowChangeRoomBoard = false;
			this.$refs.changeRoom.showWarnning('');
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
		commonMessageFactory (message, name, isSelf, dataType) {
			var div = document.createElement('div')
			var avatar = document.createElement('img')
			var spanName = document.createElement('span')
			var spanMsg = document.createElement('span')
			div.classList.add('common-message')
			if (isSelf) {
				avatar.classList.add('msg-avatar-self')
				spanName.classList.add('msg-name-self')
				spanMsg.classList.add('msg-msg-self')
			} else {
				avatar.classList.add('msg-avatar')
				spanName.classList.add('msg-name')
				spanMsg.classList.add('msg-msg')
			}
			avatar.setAttribute('src', require('../assets/avatar.jpg'))
			spanName.textContent = name
			div.appendChild(avatar)
			div.appendChild(spanName)
			// 类型选择
			if (dataType==='text') {
				spanMsg.textContent = message
				div.appendChild(spanMsg)
			} else if (dataType==='image') {
				var image = document.createElement('img')
				image.src = message
				if (isSelf) {
					image.classList.add('msg-img-self')
				} else {
					image.classList.add('msg-img')
				}
				div.appendChild(image)
			}
			return div
		},
		// 消息控制，将子组件发送的信息传入 sendMessage 方法
		msgHandler (data) {
			socket.emit('handle message', data)
		},
		// 发送消息
		sendMessage (data) {
			var type = data.type
			var dataType = data.dataType
			var message = data.msg
			var name = data.name
			var isSelf = data.target === 'myself'

			if (type==='system') {
				var msg = this.systemMessageFactory(message)
				this.$refs.messageBoard.sendMessage(msg)
			} else if (type==='common') {
				var msg = this.commonMessageFactory(message, name, isSelf, dataType)
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