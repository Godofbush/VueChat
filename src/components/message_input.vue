<template>
	<div class="message-input">
		<textarea v-model="msg"></textarea>
		<div class="input-bottom">
			<input type="file" name="file" id="file" @change="changeFile">
			<label for="file" class="file-label">图片</label>
			<button @click="sendMessage">发送</button>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			msg: ''
		}
	},
	methods: {
		sendMessage () {
			var msg = this.msg
			this.$emit('send-message', {
				type: 'text',
				msg: msg
			})
			this.msg = ''
		},
		changeFile (e) {
			var img = e.target.files[0]
			if (img.type.indexOf('image')!==-1) {
				var reader = new FileReader()
				reader.onload = (e) => {
					var dataURL = e.target.result
					this.$emit('send-message', {
						type: 'image',
						msg: dataURL
					})
				}
				reader.readAsDataURL(img)
			}
		}
	}
}
</script>

<style scoped>
.message-input {
	position: absolute;
	bottom: 0;
	width: 100%;
	padding-left: 260px;
	height: 160px;
	border-top: 1px solid #ccc;
}
textarea {
	width: 100%;
	height: 100%;
	border: 0;
	outline: none;
	padding: 8px 8px 32px;
	resize: none;
}
.input-bottom {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 32px;
	border-top: 1px solid #eee;
	background: #fff;
	padding-left: 260px;
}
button {
	position: absolute;
	right: 8px;
	top: 2px;
	bottom: 2px;
	height: auto;
	padding: 0 16px;
	border-radius: 3px;
	border: 1px solid #eee;
	background: #fff;
	color: #ccc;
	font-weight: 100;
	transition: all 0.5s;
}
button:hover {
	background: #fff;
	border-color: #bbb;
	color: #666;
}
#file {
	display: none;
}
.file-label {
	display: inline-block;
	padding: 0 6px;
	margin-left: 8px;
	line-height: 32px;
	height: 32px;
	font-size: 13px;
	color: #ccc;
	transition: all 0.5s;
	cursor: pointer;
}
.file-label:hover {
	color: #999;
}
</style>