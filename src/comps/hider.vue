<script setup>
	import {useState} from "../state"
	import {ref} from "@vue/reactivity"
	
	var props=defineProps(["isInitiallyShown", "title"])
	
	var isShown = ref(props.isInitiallyShown ?? false)
	var title = props.title
	
	function toggle() {
		isShown.value = !isShown.value
	}
	
</script>

<template>
	<div>
		{{ title }}
		<button @click="toggle">Hide</button>
		<div v-if="isShown">
			<slot></slot>
		</div>
	</div>
</template>
