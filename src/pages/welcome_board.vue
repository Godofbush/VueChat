<template>
	<div class="welcome-board">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	
}
</script>

<style>
.welcome-board {
	position: absolute;
	top: 30%;
	left: 50%;
	transform: translateX(-50%);
	color: #fff;
}
</style>