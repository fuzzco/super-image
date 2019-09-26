export default function(gl, type, source) {
    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    const shader = gl.createShader(type)

    // Send the source to the shader object

    gl.shaderSource(shader, source)

    // Compile the shader program

    gl.compileShader(shader)

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            'An error occurred compiling the shaders: ' +
                gl.getShaderInfoLog(shader)
        )
        gl.deleteShader(shader)
        return null
    }

    return shader
}