<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {

}
</script>

<style>
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	font-size: 100%;
	font: inherit;
}
html,body {
	position: relative;
	width: 100%;
	height: 100%;
	font-size: 14px;
	overflow: hidden;
}
p, h1, h2, h3, h4, h5, h6 {
	margin: 0;
	padding: 0;
}
#app {
	position: relative;
	min-width: 900px;
	width: 100%;
	min-height: 800px;
	height: 100%;
	background: url(./assets/bg0.jpg) no-repeat;
	background-size: 100% 100%;
	background-position: 50% 50%;
}
</style>
