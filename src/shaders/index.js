import prepCanvas from './prep-canvas'
import initShaderProgram from './init-shader-program'

export default (canvas, vertexSrc, fragmentSrc) => {
    // prepare the canvas
    prepCanvas(canvas)

    const gl = canvas.getContext('webgl')

    initShaderProgram(gl, vertexSrc, fragmentSrc)
}
