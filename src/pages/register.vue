<template>
	<div class="register-board">
		<h1>注册</h1>
		<input type="text" name="username" placeholder="请输入用户名">
		<input type="password" name="password" placeholder="请输入密码">
		<input type="password" name="password" placeholder="重复密码">
		<button>提交注册</button>
		<router-link :to="router_links.welcome" tag="a">取消</router-link>
	</div>
</template>

<script>
export default {
	created () {
		document.title = '注册 | Vue Chat'
	},
	data () {
		return {
			router_links: {
				welcome: {
					path: '/welcome'
				}
			}
		}
	}
}
</script>

<style scoped>
.register-board {
	width: 300px;
	padding: 30px 20px 50px;
	background-color: rgb(255, 255, 255);
	color: #333;
	text-align: center;
	border-top: 5px solid rgb(100, 100, 255);
	box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}
h1 {
	font-size: 18px;
}
input {
	display: block;
	width: 90%;
	margin: 12px auto auto;
	line-height: 34px;
	font-size: 16px;
	padding-left: 5px;
	padding-right: 5px;
	outline: none;
	font-weight: 200;
	border: 1px solid #ccc;
}
input:focus {
	border: 1px solid rgb(160, 160, 255);
}
button {
	display: block;
	width: 90%;
	margin: 12px auto auto;
	height: 36px;
	cursor: pointer;
	border: 0;
	background: rgb(100, 100, 255);
	color: #fff;
	outline: none;
}
button:hover {
	background: rgb(80, 80, 255);
}
a {
	display: block;
	margin-top: 10px;
	font-size: 12px;
	color: rgb(255, 80, 80);
	text-decoration: none;
}
</style>