<template>
	<div>
		<div class="wrapper"></div>
		<transition name="drop">
			<div class="notice-container">
				<slot></slot>
			</div>
		</transition>
	</div>
</template>

<script>
export default {}
</script>

<style scope>
.wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
}
.notice-container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 500px;
	min-height: 36px;
	background-color: #fff;
	padding: 20px 20px 36px;
	box-shadow: 5px 12px 50px rgba(0, 0, 0, 0.2);
	opacity: 1;
}
.drop-enter-active, .drop-leave {
	transition: all 0.5s;
	opacity: 1;
}
.drop-enter, .drop-leave-active {
	opacity: 0;
}
</style>