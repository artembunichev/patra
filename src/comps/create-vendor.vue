<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()	
</script>

<template>
	<Create
		:doValidate="state.validateVendorName"
		:doCreate="state.addVendor"
		@oncreate="create"
		target="поставщика"
	/>
</template>
