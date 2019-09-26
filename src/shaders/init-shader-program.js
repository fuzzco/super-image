//
// Initialize a shader program, so WebGL knows how to draw our data
//
export default function(gl, vertexShader, fragmentShader) {
    // Create the shader program
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(
            'Unable to initialize the shader program: ' +
                gl.getProgramInfoLog(shaderProgram)
        )
        return null
    }

    return shaderProgram
}
