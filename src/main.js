// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})


var xmlhttp = new XMLHttpRequest()

xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState==4) {
		if (xmlhttp.status==200) {
			var state = xmlhttp.response
			console.log(state)
			switch (state) {
				case 'chat':
					console.log(document.location.pathname)
					if (document.location.pathname!='/chat') {
						router.push({path: '/chat'})
					}
					break
				case 'index':
					console.log(document.location.pathname)
					if (document.location.pathname!='/' && document.location.pathname!='/welcome') {
						router.push('/')
					}
					break
				default:
			}
		}
	}
}

var data = {
	username: ''
}
if (document.cookie) {
	console.log(document.cookie)
	document.cookie.split(';').forEach(function(val) {
		var cookieVal = val.split('=')
		data[cookieVal[0]] = cookieVal[1]
	})
	console.log(data.myAccount)
	xmlhttp.open('POST', '/checkLogin', true)
	xmlhttp.setRequestHeader('Content-type', 'x-www-form-urlencoded')
	xmlhttp.send()
} else {
	console.log(document.location.pathname)
	if (document.location.pathname=='/chat') {
		router.push({path: '/'})
	}
}

