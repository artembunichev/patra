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
		<button
			class="icon-btn"
			@click="onToggle"
		>
			<img
				:class="props.isShown ? 'uncollapse' : 'collapse'"
				src="../icons/arrow-down.svg"
			/>
		</button>
		<div v-if="props.isShown">
			<slot />
		</div>
	</div>
</template>
