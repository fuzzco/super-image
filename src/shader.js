import Phenomenon from 'phenomenon'

export default function(vm) {
    // save the user-defined vertex & fragment shaders
    const fragmentSrc = vm.$slots.default[0].elm.innerHTML
    const vertexSrc = vm.vertexSrc
    const canvas = vm.$el.querySelector('canvas')

    // Boot up phenomenon...
    const settings = Object.assign(
        {
            devicePixelRatio: window.devicePixelRatio
        },
        vm.shaderOptions ? vm.shaderOptions.settings || {} : {}
    )
    const options = Object.assign(
        {
            canvas,
            settings
        },
        vm.shaderOptions
    )
    vm.phenomenon = new Phenomenon(options)

    // Add default instance
    const uniforms = Object.assign(
        {
            uTime: {
                type: 'float',
                value: 1.0
            },
            uResolution: {
                type: 'vec2',
                value: [canvas.width, canvas.height]
            }
        },
        vm.uniforms
    )

    const render = uniforms => {
        if (uniforms.uTime) {
            uniforms.uTime.value += 1 / 60 //* vm.timescale
        }

        const loadedCanvas = vm.$el.querySelector('canvas')
        if (uniforms.uResolution && loadedCanvas) {
            uniforms.uResolution.value = [
                loadedCanvas.width,
                loadedCanvas.height
            ]
        }
        // update passed uniforms each frame
        if (vm.uniforms) {
            Object.keys(vm.uniforms)
                .filter(Boolean)
                .forEach(u => {
                    uniforms[u].value = vm.uniforms[u].value
                })
        }
        // allow custom render function to be passed as prop
        if (vm.onShaderUpdate && vm.alive) {
            vm.onShaderUpdate(uniforms)
        }
    }

    vm.phenomenon.add('super-image-default', {
        vertex: vertexSrc,
        fragment: fragmentSrc,
        uniforms,
        mode: 4,
        onRender: p => render(p.uniforms),
        geometry: {
            vertices: [
                { x: -100.0, y: 100.0, z: 0.0 },
                { x: -100.0, y: -100.0, z: 0.0 },
                { x: 100.0, y: 100.0, z: 0.0 },
                { x: 100.0, y: -100.0, z: 0.0 },
                { x: -100.0, y: -100.0, z: 0.0 },
                { x: 100.0, y: 100.0, z: 0.0 }
            ]
        }
    })

    vm.$emit('phenomenon-started', vm.phenomenon)
}
