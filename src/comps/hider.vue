<script setup>
	import {useState} from "../state"
	import {ref} from "@vue/reactivity"
	
	var props=defineProps(["isShown", "title"])
	var emit = defineEmits(["toggle"])
	
	function onToggle() {
		emit("toggle", !props.isShown)
	}
	
</script>

<template>
	<div>
		{{ props.title }}
		<button @click="onToggle">Hide</button>
		<div v-if="props.isShown">
			<slot />
		</div>
	</div>
</template>
