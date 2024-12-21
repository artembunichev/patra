<template>
	<Teleport to="body">
		<div class="modal">
			<div class="modal-block">
				<slot />
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
	.modal {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #00000083;
	}
	.modal-block {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 450px;
		height: 200px;
		padding: 25px;
		background-color: #ffffff;
		border-radius: 10px;
	}
</style>
