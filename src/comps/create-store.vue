<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()
</script>

<template>
	<Create
		:doValidate="state.validateStoreName"
		:doCreate="state.addStore"
		target="cклад"
	/>
</template>
