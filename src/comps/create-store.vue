<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()
</script>

<template>
	<Create
		:doValidate="state.validateStoreName"
		:doCreate="state.addStore"
		@oncreate="create"
		target="cклад"
	/>
</template>
