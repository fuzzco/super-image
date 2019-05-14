<template>
    <main class="class">
        <h1>Test</h1>
        <super-image src="//placehold.it/500x500" />
    </main>
</template>

<script>
import superImage from '../src/SuperImage'

export default {
    components: {
        'super-image': superImage
    }
}
</script>

<style lang="scss">
.class {
}
</style>
