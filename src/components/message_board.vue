<template>
	<div class="message-wrap">
		<div class="message-board" id="message-board"></div>
	</div>
</template>

<script>
export default {
	methods: {
		sendMessage(message) {
			var msgBoard = document.getElementById('message-board')
			var flag = false;
			if (msgBoard.scrollHeight-msgBoard.scrollTop<560) {
				flag = true;
			}
			msgBoard.appendChild(message)
			console.log(msgBoard.scrollHeight)
			console.log(msgBoard.scrollTop)
			if (flag) {
				msgBoard.scrollTop = msgBoard.scrollHeight
			}
		}
	}
}
</script>

<style>
.message-wrap {
	width: 100%;
	padding-left: 260px;
	height: 100%;
	padding-bottom: 160px;
	background: #eee;
	box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
}
.message-board {
	width: 100%;
	height: 100%;
	padding: 12px 20px;
	overflow-x: hidden;
	overflow-y: scroll;
}
.message-notice {
	text-align: center;
	margin-top: 12px;
}
.system-message {
	display: inline-block;
	color: #fff;
	background: rgba(0, 0, 0, 0.2);
	padding: 2px 8px;
	font-size: 12px;
	font-weight: 100;
	border-radius: 5px;
}
.common-message {
	position: relative;
	text-align: left;
	margin-top: 12px;
}
.common-message::after, .common-message::before {
	content: '';
	display: block;
	clear: both;
}
.msg-img, .msg-img-self {
	width: 38px;
	height: 38px;
	border-radius: 3px;
}
.msg-name, .msg-name-self {
	display: inline-block;
	width: 542px;
	transform: translateY(-2px);
	color: #666;
	font-size: 12px;
	font-weight: 200;
}
.msg-msg, .msg-msg-self {
	position: relative;
	display: inline-block;
	padding: 8px;
	border-radius: 4px;
	border: 1px solid #ddd;
	max-width: 368px;
	min-width: 38px;
	min-height: 38px;
}
.msg-img {
	float: left;
}
.msg-img-self {
	float: right;
}
.msg-name {
	padding-left: 8px;
	float: left;
}
.msg-name-self {
	padding-right: 8px;
	float: right;
	text-align: right;
}
.msg-msg {
	float: left;
	transform: translateX(8px);
	background: #fcfcfc;
}
.msg-msg-self {
	float: right;
	transform: translateX(-8px);
	background: rgb(0, 215, 0);
}
.msg-msg::after, .msg-msg-self::after {
	content: '';
	display: inline-block;
	width: 5px;
	height: 5px;
	border: 1px solid #ddd;
	border-left-color: transparent;
	border-bottom-color: transparent;
	transform-origin: 0 0;
	position: absolute;
}
.msg-msg-self::after {
	transform: rotate(45deg) translateY(-50%);
	right: -5px;
	top: 15px;
	background: rgb(0, 215, 0);
}
.msg-msg::after {
	transform: rotate(-135deg) translateY(-50%);
	left: 2px;
	top: 19px;
	background: #fcfcfc;
}
</style>