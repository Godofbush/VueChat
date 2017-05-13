<template>
	<div class="register-board">
		<h1>注册</h1>
		<p class="notice">{{ notice }}</p>
		<input type="text" name="username" v-model="username" placeholder="请输入用户名">
		<input type="password" name="password" v-model="password" placeholder="请输入密码">
		<input type="password" name="password" placeholder="重复密码">
		<button @click="register">提交注册</button>
		<router-link :to="router_links.welcome" tag="a">取消</router-link>

		<notice v-show="isSuccess">
			<div class="registerSuccess">
				<p>注册成功</p>
				<router-link :to="{path: '../login'}" tag="button">确定</router-link>
			</div>
		</notice>
	</div>
</template>

<script>
import Notice from '@/components/notice'
export default {
	components: {
		Notice
	},
	created () {
		document.title = '注册 | Vue Chat'
	},
	data () {
		return {
			username: '',
			password: '',
			router_links: {
				welcome: {
					path: '/welcome'
				}
			},
			notice: '',
			isSuccess: false
		}
	},
	methods: {
		register () {
			var xmlhttp = new XMLHttpRequest()
			var data = {
				username: '',
				password: ''
			}
			data.username = this.username
			data.password = this.password
			xmlhttp.onreadystatechange = () => {
				if (xmlhttp.readyState==4) {
					if (xmlhttp.status==200) {
						var state = xmlhttp.response
						switch (state) {
							case 'OK':
								this.isSuccess = true
								this.notice = ''
								this.username = ''
								this.password = ''
								console.log('注册成功')
								break
							case 'repeat':
								this.notice = '用户名已存在'
								console.log('用户名重复')
								break
							case 'error':
								console.log('错误')
								break
							default:
						}
					}
				}
			}
			xmlhttp.open('POST', 'http://localhost:8080/register', true)
			xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			xmlhttp.send('username='+data.username+'&'+'password='+data.password)
		}
	}
}
</script>

<style scoped>
.register-board {
	/*margin: 0 auto;*/
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
.registerSuccess > p {
	font-size: 28px;
}
.registerSuccess > button {
	width: 100px;
	font-weight: 200;
}
.registerSuccess > a:hover {
	background-color: rgb(80, 80, 255);
}
</style>