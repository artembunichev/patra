<script setup>
	import Modal from "./modal.vue"
	
	var props = defineProps(["text"])
	var emit = defineEmits(["close"])
	
	var onClose = ()=> {
		emit("close")
	}
	
</script>

<template>
	<Modal>
		<div>
			<div class="title">Ошибка!</div>
			<div>{{ props.text }}</div>
			<div>
				<button @click="onClose">ОК</button>
			</div>
		</div>
	</Modal>
</template>


<style scoped>
	.title {
		font-size: 48px;
		font-weight: bold;
		color: red;
	}
</style>
