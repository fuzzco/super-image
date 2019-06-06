All-in-one image component for Vue. [Demo](https://fuzzco.github.io/super-image/)

`npm i @fuzzco/super-image`

[Register component in Vue](https://vuejs.org/v2/guide/components-registration.html), then:

```html
<template>
    <main>
        <!-- place a square image in a 16:9 aspect ratio -->
        <super-image src="//placehold.it/300x300" aspect="56.25" />

        <!-- use raw HTML for contents -->
        <super-image :html="imgHtml" />
    </main>
</template>

<script>
    export default {
        data() {
            return {
                imgHtml: '<img src="//placehold.it/300x300">'
            }
        }
    }
</script>
```

## Options

| Prop          | Type              | Default     | Notes                                                                                                    |
| ------------- | ----------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `alt`         | String            | none        |                                                                                                          |
| `aspect`      | [String, Number]  | none        | Manually-defined aspect ratio of image. Overrides aspect ratio calculated by `width` and `height` props. |
| `color`       | String            | transparent |                                                                                                          |
| `fill-space`  | Boolean           | false       |                                                                                                          |
| `fit`         | String            | `cover`     | `cover` or `contain`.                                                                                    |
| `height`      | [String, Number]  | none        | Manually-defined height of image in px.                                                                  |
| `html`        | String            | none        | Raw HTML to drop into super-image wrapper.                                                               |
| `loop`        | Boolean           | true        |                                                                                                          |
| `poster`      | [String, Boolean] | none        |                                                                                                          |
| `respect-max` | Boolean           | false       |                                                                                                          |
| `src`         | String            | none        | Source URL.                                                                                              |
| `video-src`   | [String, Boolean] | none        |                                                                                                          |
| `width` }     | [String, Number]  | none        | Manually-defined width of image in px.                                                                   |

## Events

| Name    | Parameters             | Notes                                             |
| ------- | ---------------------- | ------------------------------------------------- |
| `ended` | `(event: video event)` | Event emitted by video (if provided) upon ending. |
