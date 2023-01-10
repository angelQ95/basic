<script setup lang="ts">
import isCesium from './cesium';
import { onMounted } from 'vue';

onMounted(() => {
	const isCesimExmp = new isCesium('cesium-box');
});
</script>

<template>
	<div id="cesium-box"></div>
</template>

<style scoped>
#cesium-box {
	width: 100%;
	height: 100%;
	border-radius: 5px;
	overflow: hidden;
}
</style>