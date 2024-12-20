<script setup>
	import {useState} from "../state"
	import Modal from "./modal.vue"
	
	var props = defineProps(["prompt"])
	var emit = defineEmits(["yes", "no"])
	
	var doYes = ()=> {
		emit("yes")
	}
	
	var doNo = ()=> {
		emit("no")
	}
	
</script>

<template>
	<Modal>
		<div>
			<div>{{ prompt }}</div>
			<div>
				<button @click="doYes">ДА</button>
				<button @click="doNo">НЕТ</button>
			</div>
		</div>
	</Modal>
</template>
