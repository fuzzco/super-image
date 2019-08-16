<template>
    <div :class="classes" :style="outerStyles">
        <div v-if="videoSrc" class="image-sizer" :style="sizerStyles">
            <video
                @ended="$emit('ended', $event)"
                :poster="parsedPoster"
                :src="videoSrc"
                :loop="loop"
                playsinline
                autoplay
                muted
            />
        </div>
        <div
            v-else-if="src || html"
            class="image-sizer"
            :style="sizerStyles"
            v-html="imageTag || ''"
        />
        <slot />
    </div>
</template>

<script>
let imagesLoaded
let Phenomenon

export default {
    name: 'super-image',
    props: {
        html: String,
        src: String,
        height: [String, Number],
        width: [String, Number],
        aspect: [String, Number],
        'video-src': [String, Boolean],
        color: {
            type: String,
            default: 'transparent'
        },
        alt: {
            type: String,
            default: ''
        },
        'respect-max': {
            type: Boolean,
            default: false
        },
        'fill-space': {
            type: Boolean,
            default: false
        },
        fit: {
            type: String,
            default: 'cover'
        },
        poster: {
            type: [String, Boolean],
            default: ''
        },
        loop: {
            type: Boolean,
            default: true
        },
        useCanvas: {
            type: Boolean,
            default: false
        },
        noImageAfterCanvas: {
            type: Boolean,
            default: false
        },
        useShader: {
            type: Boolean,
            default: false
        },
        uniforms: {
            type: Object,
            default: () => {}
        },
        onShaderUpdate: {
            type: Function,
            default: () => () => {}
        }
    },
    data() {
        return {
            loading: true,
            imageWidth: 0,
            imageHeight: 0,
            img: null,
            alive: true
        }
    },
    watch: {
        imageTag() {
            this.setMediaClass()
        }
    },
    async mounted() {
        if (!imagesLoaded) imagesLoaded = require('imagesloaded')

        // ignore if our src is undefined
        if (!this.src) return

        this.img = new Image()
        this.img.src = this.src

        // define loading complete handler
        const onComplete = async () => {
            await this.$nextTick()
            this.loading = false

            // update stats
            this.imageWidth = this.img.width
            this.imageHeight = this.img.height

            // update canvas
            if (this.useCanvas || this.useShader) {
                await this.$nextTick()
                this.refreshCanvas()
            }
        }

        // image was already in cache,
        // handle complete immediately
        if (this.img.complete) {
            onComplete()
        } else {
            // wait for image to load...
            imagesLoaded(this.img, onComplete)
        }

        this.setMediaClass()
    },
    methods: {
        setMediaClass() {
            // give the "media" class to whatever we are rendering (img, video, or canvas)
            if (!this.$el || !this.$el.querySelector) return
            this.$nextTick(() => {
                const media = this.$el.querySelector('.image-sizer > *')
                if (media) media.classList.add('media')
            })
        },
        refreshCanvas() {
            const canvas = this.$el.querySelector('canvas')

            // cancel if no canvas
            if (!canvas) return

            // set to image size
            canvas.width = this.parsedWidth
            canvas.height = this.parsedHeight

            if (!this.useShader) {
                // if just canvas (or missing a fragment shader),
                // draw the image and be done
                const ctx = canvas.getContext('2d')
                ctx.drawImage(this.img, 0, 0)
            } else {
                // otherwise, boot up phenomenon...
                if (!Phenomenon) {
                    Phenomenon = require('phenomenon').default
                }

                // ...save the fragment shader...
                let fragment = this.$slots.default[0].elm.innerHTML

                // ...prep the uniforms...
                // (include time and resolution as default uniforms)
                const startingUniforms = {
                    uTime: {
                        type: 'float',
                        value: 1.0
                    },
                    uResolution: {
                        type: 'vec2',
                        value: [canvas.width, canvas.height]
                    },
                    uSampler: {
                        type: 'texture2D',
                        value: this.img
                    },
                    ...this.uniforms
                }

                // ...build the render function...
                const render = uniforms => {
                    if (uniforms.uTime) {
                        // (if you want timescaling, add it here - this is ~60fps)
                        uniforms.uTime.value += 0.01666
                    }
                    if (uniforms.uResolution && canvas) {
                        uniforms.uResolution.value = [
                            canvas.width,
                            canvas.height
                        ]
                    }
                    // update passed uniforms each frame
                    if (this.uniforms) {
                        Object.keys(this.uniforms)
                            .filter(Boolean)
                            .forEach(u => {
                                uniforms[u].value = this.uniforms[u].value
                            })
                    }
                    // allow custom render function to be passed as prop
                    if (this.render && this.alive) {
                        this.render(uniforms)
                    }
                }

                console.log(fragment)

                // and build the shader
                buildShader(
                    Phenomenon,
                    fragment,
                    startingUniforms,
                    render,
                    canvas
                )
            }
        }
    },
    computed: {
        aspectPadding() {
            // default to defined aspect, or calculate
            let calculatedAspect = null
            if (this.parsedHeight && this.parsedWidth) {
                calculatedAspect = (this.parsedHeight / this.parsedWidth) * 100
            }
            return parseInt(this.aspect) || calculatedAspect || 56.25
        },
        classes() {
            return [
                'super-image',
                `fit-${this.fit}`,
                { 'image-loading': this.loading },
                { 'image-loaded': !this.loading },
                { 'fill-space': this.fillSpace },
                { 'has-video': this.videoSrc },
                { 'has-image': this.src }
            ]
        },
        fallbackHtml() {
            return `<img src="${this.src}" alt="${this.alt || ' '}">`
        },
        imageTag() {
            if (this.html) return this.html
            else if (this.useCanvas || this.useShader) return this.cmpCanvas
            else return this.fallbackHtml
        },
        outerStyles() {
            const styles = {}

            // set max dims if needed
            if (this['respect-max']) {
                styles['max-width'] = `${this.parsedWidth}px`
                styles['max-height'] = `${this.parsedHeight}px`
            }

            // add color bg if needed
            if (this.color && this.color !== 'transparent') {
                styles['background-color'] = this.color
            }

            return styles
        },
        parsedPoster() {
            if (this.poster === null) return ''
            return this.poster && this.poster.length ? this.poster : this.src
        },
        parsedWidth() {
            // default to defined width
            if (this.width) return parseInt(this.width)
            return this.imageWidth
        },
        parsedHeight() {
            // default to defined height
            if (this.height) return parseInt(this.height)
            return this.imageHeight
        },
        sizerStyles() {
            if (!this.fillSpace) {
                return {
                    paddingBottom: `${this.aspectPadding}%`
                }
            }
            return {}
        },
        cmpCanvas() {
            let output = `<canvas
                class="super-image-canvas"
                width="${this.parsedWidth}px"
                height="${this.parsedWidth}px"></canvas>`

            if (!this.noImageAfterCanvas) {
                output += this.fallbackHtml
            }
            return output
        }
    },
    beforeDestroy() {
        this.alive = false
    }
}

// This is a modified version of the phenomenon-px package
// The main difference is that you need to pass in the Phenomenon class
const min = -2
const max = 2

const buildShader = function(Phenom, fragment, uniforms, render, canvas) {
    new Phenom({ canvas, position: { x: 0, y: 0, z: 100 } }).add(Date.now(), {
        vertex: `
      attribute vec3 aPosition;
      uniform mat4 uProjectionMatrix;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      void main(){
        gl_Position = uProjectionMatrix * uModelMatrix * uViewMatrix * vec4(aPosition, 1.0);
      }
    `,
        fragment,
        uniforms,
        mode: 4,
        onRender: p => render(p.uniforms),
        geometry: {
            vertices: [
                { x: min, y: min, z: 0 },
                { x: min, y: max, z: 0 },
                { x: max, y: min, z: 0 },
                { x: max, y: max, z: 0 },
                { x: min, y: max, z: 0 },
                { x: max, y: min, z: 0 }
            ]
        }
    })
}
</script>

<style lang="scss">
.super-image {
    position: relative;
    width: 100%;

    // sizer
    .image-sizer {
        transition: opacity 0.6s ease;
        position: relative;
        overflow: hidden;
    }
    .image-sizer > * {
        position: absolute;
        object-fit: cover;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    // when set to contain
    &.fit-contain .image-sizer > * {
        object-fit: contain;
    }

    // fill-space state
    &.fill-space {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
    }
    &.fill-space .image-sizer {
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    // hide canvas overlay
    .super-image-canvas + img {
        opacity: 0;
        pointer-events: none;
    }

    // loading state
    &.image-loading.has-image .image-sizer {
        opacity: 0;
    }
}
</style>
