var http = require('http');
var express = require('express');
var IO = require('socket.io');
var cookieParser = require('cookie-parser')

var app = express();
var server = http.createServer(app);
app.use(express.static('../dist'));
app.use(cookieParser())
server.listen(8011, function() {
	console.log('server started! port 8011');
});

/* Mongodb begin ============================================================== */
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var mongourl = 'mongodb://localhost:27017/vuechat';
/* Mongodb end ============================================================== */

var querystring = require('querystring')
// 注册处理
app.post('/register', function(req, res) {
	var postData = ''
	req.on('data', function(chunk) {
		postData+=chunk
	})
	req.on('end', function() {
		var data = querystring.parse(postData)
		var state = ''

		MongoClient.connect(mongourl, function(err, db) {
			if (err) {
				console.log(err)
			}
			var connection = db.collection('document')
			connection.findOne({"username":data.username}).then(function(value) {
				if (value==null) {
					connection.insertOne(data, function(err, r) {
						assert.equal(null, err)
						assert.equal(1, r.insertedCount)
					})
					state = 'OK'
				} else {
					state = 'repeat'
				}
				res.send(state)
				db.close()
			}, function(err){
				console.log('err: ', err)
				state = 'error'
				res.send(state)
				db.close()
			})
		})

	})
})
// 登录处理
app.post('/login', function(req, res) {
	var postData = ''
	req.on('data', function(chunk) {
		postData+=chunk
	})
	req.on('end', function() {
		var data = querystring.parse(postData)
		var state = ''

		MongoClient.connect(mongourl, function(err, db) {
			if (err) {
				console.log(err)
			}
			var connection = db.collection('document')
			connection.findOne({"username":data.username}).then(function(value) {
				if (value==null) {
					state = 'noexist'
				} else if (value.password!=data.password) {
					state = 'wrongpassword'
				} else {
					state = 'success'
					res.cookie('myAccount', {username:data.username, password:data.password, last_time:Date.now()}, { expires: new Date(Date.now() + 60000), httpOnly: true})
					console.log('设置了cookie')
				}

				res.send(state)
				db.close()
			}, function(err) {
				console.log('err: ', err)
				state = 'error'
				res.send(state)
				db.close()
			})
		})
	})
})

app.get('*', function(req, res) {
	if (req.cookies.myAccount!={} && req.cookies.myAccount) {
		var cookie = req.cookies.myAccount;
		MongoClient.connect(mongourl, function(err, db) {
			if (err) {
				console.log(err)
			}
			var connection = db.collection('document')
			connection.findOne({"username":cookie.username}).then(function(value) {
				console.log('cookie: ', cookie)
				if (value.password==cookie.password) {
					console.log('已登录')
					res.cookie('isEnterred', true)
				} 
				if (req.path=='/' || req.path=='/welcome') {
					res.end()
				} else {
					res.redirect('/')
				}
				db.close()
			}, function(err) {
				console.log(err)
				if (req.path=='/' || req.path=='/welcome') {
					res.send('done')
				} else {
					res.redirect('/')
				}
				db.close()
			})
		})
	} else {
		console.log('未登录')
		if (req.path=='/' || req.path=='/welcome') {
			res.end()
		} else {
			res.redirect('/')
		}
	}
})

// begin
var io = IO(server);
var room_info = {};  // 维护一个全局对象，用来存储房间信息
var rooms = [];      // 用于存储当前存在的所有房间的房间号
var timeouts = {};     // 释放房间计时器
io.on('connection', function (socket) {
	var userInfo = {
		username: ''
	};
	var room_id_before = '';

	// 登录
	socket.on('login', function ( loginData ) {
		userInfo.username = loginData.username;
		socket.emit('login success');
	})

	// 登录后获取数据
	socket.on('fetch data', function () {
		socket.emit('return data', userInfo);
	})

	// 创建房间
	socket.on('create room', function ( createData ) {
		var room_id = createData.roomId;
		var id = 'R' + room_id;
		var pwd = createData.roomPwd;

		// 此处验证密码

		createRoom(room_id, pwd, function() {
			rooms.push(id);
			socket.emit('create room success', {
				roomId: room_id,
				roomPwd: pwd
			});
			console.log('房间%s创建完成', room_id);
		}, function (err) {
			console.log('【警告】房间 %s 创建失败', room_id);
			if(err==='roomExisted') {
				console.log('【警告】房间 %s 已存在', room_id);
				socket.emit('warnning', {msg: 'roomExisted'})
			}
		});
	});

	// 加入房间
	socket.on('join room', function(joinData) {
		var room_id = joinData.roomId;
		var pwd = joinData.roomPwd;

		var id = 'R' + room_id;
		var id_before = 'R' + room_id_before;

		// 检查是否房间不存在
		if (!room_info[id]) {
			console.log('【警告】房间 %s 不存在', room_id);
			socket.emit('warnning', { msg: 'roomUnexist' });
			return
		}
		// 检查是否用户已经在该房间中
		if (id_before == id) {
			console.log('【警告】已在房间 %s 中', room_id);
			socket.emit('warnning', { msg: 'alreadyInRoom' });
			return
		}

		joinRoom(userInfo.username, room_id, pwd, function() {
			console.log('=======================================');
			console.log('来自用户 %s 的操作', userInfo.username);
			console.log('加入房间 %s 成功', room_id);
			console.log('当前房间信息：', room_info[id]);
			console.log('=======================================');
			socket.emit('join room success', {
				username: userInfo.username,
				roomId: room_id,
				users: room_info[id].users,
				quantity: room_info[id].quantity
			});
			socket.to(id).broadcast.emit('someone joined', {
				username: userInfo.username,
				roomId: room_id,
				users: room_info[id].users,
				quantity: room_info[id].quantity
			});
			// 如果用户已存在房间中，则还需离开原来的房间
			if (room_id_before) {
				leaveRoom(userInfo.username, room_id_before, function() {
					console.log('离开房间 %s 成功', room_id_before)
				})
			}
			// 更新房间号
			room_id_before = room_id;
		});
	});

	// 离开房间
	socket.on('leave room', function() {
		var id = 'R' + room_id_before;
		leaveRoom(userInfo.username, room_id_before, function() {
			console.log('离开房间 %s 成功', room_id_before);
			socket.emit('leave room success', {
				username: userInfo.username,
				roomId: room_id_before,
				users: room_info[id].users,
				quantity: room_info[id].quantity
			});
			socket.to(id).broadcast.emit('someone left', {
				username: userInfo.username,
				roomId: room_id_before,
				users: room_info[id].users,
				quantity: room_info[id].quantity
			});
			room_id_before = '';
		})
	})

	// 创建房间方法
	var createRoom = function ( roomId, pwd , success, fail) {
		var id = 'R' + roomId;
		if (room_info[id]) {
			if (fail) { return fail('roomExisted'); };
		}
		// 创建房间信息对象，并写入 room_info
		room_info[id] = {
			id: roomId,
			users: [],
			quantity: 0,
			password: {
				isSet: false,
				content: ''
			}
		}
		// 设置房间密码
		if (pwd) {
			room_info[id].password.isSet = true;
			room_info[id].password.content = pwd;
		}

		console.log('房间创建完成，房间号：', roomId);
		if (success) { return success(); };
	}

	// 加入房间方法
	var joinRoom = function ( username, roomId, pwd, success ) {
		var room_id = roomId;
		var id = 'R' + room_id;
		var id_before = 'R' + room_id_before;
		var flag = false;

		// 存在用户加入房间，则清除释放计时器
		clearTimeout(timeouts[id]);
		delete timeouts[id];

		if (room_info[id].password.isSet) {
			flag = (room_info[id].password.content===pwd) ? true : false;
		} else {
			flag = true;
		}
		if (!flag) { return }
		socket.join(id);
		room_info[id].users.push(username);
		room_info[id].quantity+=1;

		if (success) { return success(); }
	}

	// 离开房间方法
	var leaveRoom = function ( username, roomId, success ) {
		var room_id = roomId;

		var id = 'R' + room_id;
		socket.leave(id);
		room_info[id].users.splice(room_info[id].users.indexOf(username), 1);
		room_info[id].quantity--;

		// 如果房间没人，则过3分钟自动释放
		if (room_info[id].quantity==0) {
			releaseRoom(room_id)
		}

		if (success) { return success(); }
	}

	// 释放房间方法
	var releaseRoom = function ( roomId ) {
		var room_id = roomId;
		var id = 'R' + room_id;
		timeouts[id] = setTimeout(function(){
			delete room_info[id];
			console.log('房间 %s 已释放', room_id);
			clearTimeout(timeouts[id]);
			delete timeouts[id];
		}, 10000)
	}

	// 发送消息
	socket.on('handle message', function (data) {
		var type = data.type;
		var msg = data.msg;

		var id = 'R' + room_id_before;
		if (type === 'text') {
			var trimedMsg = msg.trim();
		} else if (type === 'image') {
			var trimedMsg = msg;
		}
		socket.emit('send message', {
			type: 'common',
			dataType: type,
			msg: trimedMsg,
			name: userInfo.username,
			target: 'myself'
		})
		socket.to(id).broadcast.emit('send message', {
			type: 'common',
			dataType: type,
			msg: trimedMsg,
			name: userInfo.username
		})
	})

});
