<template>
	<div class="message-input" @click="focusPre">
		<pre contenteditable="true" @click="setLastEditRange" @keyup="setLastEditRange"></pre>
		<div class="input-bottom">
			<input type="file" name="file" id="file" @change="changeFile">
			<label for="file" class="file-label">图片</label>
			<div class="faces">
				<span @click="displayFaces=true">表情</span>
				<transition name="faces-fade" @enter="whenFacesEnter">
					<div class="faces-drop-down" v-show="displayFaces" tabindex="-1" @blur="displayFaces=false">
						<img v-for="img in imgs" :data-code="img.code" :src="img.src" @click="insertImage">
					</div>
				</transition>
			</div>
			<button @click="sendMessage">发送</button>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			msgs: [],
			imgs: [],
			displayFaces: false,
			lastEditRange: null
		}
	},
	created: function() {
		var imgIndex = [2, 5, 6, 10, 11, 14, 19, 20, 21, 26, 38, 44, 97, 98, 99]
		var name = ''
		imgIndex.forEach((el, index)=>{
			switch (el.toString().length) {
				case 1: 
					name = '00' + el.toString() + '@2x'
					break
				case 2:
					name = '0' + el.toString() + '@2x'
					break
				case 3:
					name = el.toString() + '@2x'
					break
				default:
					name = null
			}
			if (name) {
				this.imgs.push({
					code: name,
					src: require('../assets/face/'+name+'.png')
				})
			} else {
				console.log('图片名错误')
			}
		})
	},
	methods: {
		sendMessage () {
			var pre = this.$el.querySelector('pre')

			Array.prototype.forEach.call(pre.querySelectorAll('img'), (el) => {
				var code = el.getAttribute('data-code')
				el.setAttribute('src', require('../assets/face/' + code + '.gif'))
			})

			this.msgs.push(pre.innerHTML)
			this.$emit('send-message', {
				type: 'text',
				msg: this.msgs.pop()
			})
			pre.innerHTML = ''
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
		},
		whenFacesEnter () {
			this.$el.querySelector('.faces-drop-down').focus()
		},
		setLastEditRange (e) {
			this.lastEditRange = window.getSelection().getRangeAt(0)
		},
		insertImage (e) {
			var pre = this.$el.querySelector('pre')
			pre.focus()
			var selection = window.getSelection()
			var lastEditRange = this.lastEditRange
			if (lastEditRange) {
				selection.removeAllRanges()
				selection.addRange(lastEditRange)
			}
			document.execCommand('insertImage', null, e.target.getAttribute('src'))


			if (pre.childNodes.length>0) {
				var child = pre.childNodes[selection.anchorOffset-1]
				child.style.width = '18px'
				child.setAttribute('data-code', e.target.getAttribute('data-code'))
			}

		},
		focusPre (e) {
			if (e.target == e.currentTarget) {
				this.$el.querySelector('pre').focus()
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
	background-color: #fff;
	cursor: text;
}
pre {
	width: 100%;
	max-height: 100%;
	border: 0;
	outline: none;
	padding: 8px 8px 32px;
	overflow-x: hidden;
	overflow-y: auto;
}
pre img {
	width: 13px;
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
	cursor: default;
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
.file-label, .faces {
	position: relative;
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
	.file-label:hover, .faces:hover {
		color: #999;
	}
.faces-drop-down {
	position: absolute;
	bottom: 36px;
	left: 0;
	background-color: #fff;
	border: 1px solid #eee;
	box-shadow: 1px 3px 50px rgba(0, 0, 0, 0.08);
	border-radius: 5px;
	padding: 8px;
	cursor: default;
	width: 291px;
	outline: none;
}
	.faces-drop-down::after {
		content: '';
		position: absolute;
		left: 16px;
		bottom: -6px;
		width: 10px;
		height: 10px;
		border-right: 1px solid #eee; 
		border-bottom: 1px solid #eee;
		background-color: #fff;
		transform: rotate(45deg);
	}
.faces-drop-down img {
	display: inline-block;
	width: 33px;
	cursor: pointer;
	margin: 3px;
}
.faces-fade-enter-active, .faces-fade-leave {
	transition: opacity .5s;
}
.faces-fade-enter, .faces-fade-leave-active {
	opacity: 0;
}
</style>