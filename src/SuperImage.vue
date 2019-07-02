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
        }
    },
    data() {
        return {
            loading: true,
            imageWidth: 0,
            imageHeight: 0
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

        const img = new Image()
        img.src = this.src

        // define loading complete handler
        const onComplete = async () => {
            await this.$nextTick()
            this.loading = false

            // update stats
            this.imageWidth = img.width
            this.imageHeight = img.height
        }

        // image was already in cache,
        // handle complete immediately
        if (img.complete) {
            onComplete()
        } else {
            // wait for image to load...
            imagesLoaded(img, onComplete)
        }

        this.setMediaClass()
    },
    methods: {
        setMediaClass() {
            // give the "media" class to whatever we are rendering (img or video)
            if (!this.$el || !this.$el.querySelector) return
            this.$nextTick(() => {
                const media = this.$el.querySelector('.image-sizer > *')
                if (media) media.classList.add('media')
            })
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
        imageTag() {
            const fallback = `<img src="${this.src}" alt="${this.alt || ' '}">`
            if (this.html) return this.html
            else return fallback
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
        }
    }
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

    // loading state
    &.image-loading.has-image .image-sizer {
        opacity: 0;
    }
}
</style>
