<script setup>
	import {useState} from "../../../state"
	import {signify} from "../../../lib/num"
	var state = useState()
</script>

<template>
	<div v-if="state.hist.length > 0">
		<div>История</div>
		<div
			v-for="entry in state.histReversed"
			class="item-block"
		>
			<div>{{entry.when}}</div>
			<div>{{entry.itemName}} ({{entry.store}}) {{signify(entry.diff)}}</div>
		</div>
	</div>
	<div v-else>
		Пока история пуста...
	</div>
</template>

<style scoped>
	.item-block {
		border: 1px solid #000;
		margin-bottom: 6px;
	}
</style>
