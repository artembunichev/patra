<script setup>
	import {useState} from "../state"
	import Hider from "./hider.vue"
	
	var state = useState()
	
	/*
		`id` prop is a one of keys of `state.hiderStates`.
	*/
	var props=defineProps(["id", "title"])
	
	var onToggle = (value)=> {
		state.hiderStates[props.id] = value
	}
	
</script>

<template>
	<Hider
		:isShown="state.hiderStates[props.id]"
		:title="title"
		@toggle="onToggle"
	>
		<slot />
	</Hider>
</template>
