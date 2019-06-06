<template>
    <main class="demo">
        <h2 class="title">super-image</h2>

        <super-image src="//placehold.it/300x300" respect-max aspect="56.25" />
        <p>Square image forced to aspect ratio</p>

        <super-image :html="imgHtml" width="300" respect-max height="300" />
        <p>Raw HTML and auto-calculated aspect ratio</p>

        <!-- fit wrapper -->
        <div class="resizable">
            <div class="container">
                <super-image src="//placehold.it/300x300" fill-space />
            </div>
        </div>
        <p>Resizable with fill-space</p>

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
            respectMax: true,
            imgHtml:
                '<img src="//placehold.it/300x300" width="300" height="300">'
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

    .resizable {
        resize: both;
        width: 100px;
        height: 100px;
        position: relative;
        overflow: scroll;
        margin: 50px auto 0;
        padding: 10px;
        background: tomato;

        .container {
            position: relative;
            width: 100%;
            height: 100%;
        }
    }

    .controls {
        padding: 30px;
        background: rgba(#efefef, 0.4);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;

        button {
            font-size: inherit;
        }
    }

    & > * {
        margin-top: 50px;
    }
    & > p {
        margin-top: 20px;
    }
    .controls {
        margin-top: 0;
    }
}
</style>
