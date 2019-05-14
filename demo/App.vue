<template>
    <main class="demo">
        <h2 class="title">super-image</h2>

        <!-- new key forces a reload on prop change -->
        <super-image
            :src="`//placehold.it/${width}x${height}`"
            :width="width"
            :height="height"
            :respect-max="respectMax"
            :key="Date.now()"
        />

        <div class="controls">
            <button @click="randomSize">Randomize <code>src</code> prop</button>
            <div>
                <input type="checkbox" v-model="respectMax" id="respectMax" />
                <label for="respectMax"><code>respect-max</code></label>
            </div>
        </div>
    </main>
</template>

<script>
import superImage from '../src/SuperImage'

export default {
    components: {
        'super-image': superImage
    },
    data() {
        return {
            width: 500,
            height: 500,
            respectMax: true
        }
    },
    computed: {
        cmpWidth() {
            return this.width
        },
        cmpHeight() {
            return this.height
        }
    },
    methods: {
        randomSize() {
            this.width = Math.floor(Math.random() * 800)
            this.height = Math.floor(Math.random() * 800)
        }
    }
}
</script>

<style lang="scss">
.demo {
    font-family: Helvetica, sans-serif;
    text-align: center;

    max-width: 700px;
    margin: auto;

    .super-image {
        margin: 0 auto;
    }
    .controls {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 30px;
        background: rgba(#efefef, 0.4);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;

        button {
            font-size: inherit;
        }
    }
}
</style>
