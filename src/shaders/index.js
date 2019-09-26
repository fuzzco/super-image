import prepCanvas from './prep-canvas'
import loadShader from './load-shader'
import initShaderProgram from './init-shader-program'
import initBuffers from './init-buffers'
import drawScene from './draw-scene'

export default (canvas, vertexSrc, fragmentSrc) => {
    // prepare the canvas and save GL context
    const gl = prepCanvas(canvas)

    // compile shaders
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSrc)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

    // prep the shader program
    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader)

    // save program info so far
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(
                shaderProgram,
                'aVertexPosition'
            )
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(
                shaderProgram,
                'uProjectionMatrix'
            ),
            modelViewMatrix: gl.getUniformLocation(
                shaderProgram,
                'uModelViewMatrix'
            )
        }
    }

    // save the fullscreen plane vertex buffers
    const buffers = initBuffers(gl)

    // draw scene!
    drawScene(gl, programInfo, buffers)
}
