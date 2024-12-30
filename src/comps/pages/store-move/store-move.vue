<script setup>
	import {useState} from "../../../state"
	import {ref} from "vue"
	
	var state=useState()
	
	/*`from` and `to` are store names.*/
	var from = ref("")
	var to = ref("")
	
	var move = ()=> {
		var isSuccess = (
			state.moveAllFromStore(from.value, to.value)
		)
		
		if (isSuccess) {
			showDoneMsg()
			from.value = ""
			to.value = ""
		}
	}
	
	var isDoneMsgShown = ref(false)
	var isDoneMsgFrom = ref("")
	var isDoneMsgTo = ref("")
	
	var showDoneMsg = ()=> {
		isDoneMsgShown.value = true
		isDoneMsgFrom.value = from.value
		isDoneMsgTo.value = to.value
	}
</script>

<template>
	<div class="title">Перемещение по складам</div>
	
	<div v-if="state.stores.length > 1">
		<span>Переместить все детали со склада</span>
		<select v-model="from">
			<option v-for="store in state.stores" :value="store">
				{{ store }}
			</option>
		</select>
		<span>на склад</span>
		<select v-model="to">
			<option v-for="store in state.stores" :value="store">
				{{ store }}
			</option>
		</select>
		<button @click="move">Переместить</button>
		<div
			v-if="isDoneMsgShown"
			class="done-msg"
		>
			Все товары со склада {{isDoneMsgFrom}}
			успешно перенесены на склад {{isDoneMsgTo}}
		</div>
	</div>
	<div v-else-if="state.stores.length === 1">
		Создан только один склад - перемещать некуда.
	</div>
	<div v-else>
		Не создано ни одного склада - перемещать некуда.
	</div>
</template>
