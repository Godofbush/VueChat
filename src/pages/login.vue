<template>
	<div>
		<div class="login-board">
			<h1>登录</h1>
			<p class="notice">{{notice}}</p>
			<input type="text" name="username" v-model="username" placeholder="请输入用户名">
			<input type="password" name="password" v-model="password" placeholder="请输入密码">
			<button @click="login">登录</button>
			<router-link :to="router_links.welcome" tag="a">取消</router-link>
		</div>
	</div>
</template>

<script>
export default {
	created () {
		document.title = '登录 | Vue Chat';
	},
	data () {
		return {
			router_links: {
				welcome: {
					path: '/welcome'
				}
			},
			username: '',
			password: '',
			notice: ''
		}
	},
	methods: {
		// 登录跳转
		login () {
			var xmlhttp = new XMLHttpRequest()
			xmlhttp.onreadystatechange = () => {
				if (xmlhttp.readyState==4) {
					if (xmlhttp.status==200) {
						var state = xmlhttp.responseText
						console.log(state)
						switch (state) {
							case 'success':
								socket.emit('login', {
									username: this.username,
									password: this.password
								});
								socket.on('login success', () => {
									this.$router.push({ path: '/chat' })
								})
							case 'noexist':
								this.notice = '用户名或密码错误'
							case 'wrongpassword':
								this.notice = '用户名或密码错误'
							default:
						}
					}
				}
			}
			xmlhttp.open('POST', 'http://localhost:8080/login', true)
			xmlhttp.setRequestHeader('Content-type', 'x-www-form-urlencoded')
			xmlhttp.send('username='+this.username+'&'+'password='+this.password)

		}
	}
}
</script>

<style scoped>
.login-board {
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
	margin: 0 auto 12px;
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
.notice {
	margin-top: 12px;
	color: rgb(255, 100, 100);
	text-align: left;
	padding-left: 14px;
}
</style>