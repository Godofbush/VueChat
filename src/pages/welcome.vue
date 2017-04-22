<template>
	<div class="welcome">
		<h1>欢迎使用 Vue Chat</h1>
		<router-link :to="router_links.register" tag="button" class="router-register">注册</router-link>
		<router-link :to="router_links.login" tag="button" class="router-login">登录</router-link>
	</div>
</template>

<script>
export default {
	created () {
		document.title = '欢迎页 | Vue Chat'
	},
	data () {
		return {
			router_links: {
				login: {
					path: '/login'
				},
				register: {
					path: '/register'
				}
			}
		}
	}
}
</script>

<style scoped>
h1 {
	font-size: 36px;
	margin-bottom: 30px;
}
.router-register, .router-login {
	display: block;
	border: 0;
	border-radius: 3px;
	width: 280px;
	height: 36px;
	margin: 12px auto auto;
	font-size: 14px;
	cursor: pointer;
}
.router-register {
	background-color: rgb(120, 120, 255);
	color: #fff;
}
.router-login {
	background-color: rgb(255, 255, 255);
	color: #333;
}
</style>