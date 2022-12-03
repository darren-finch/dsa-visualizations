import "./p5.min.js"
import { algorithms } from "./visualizations/algorithms/index.js"

let algorithm = algorithms[0]

window.setup = () => {
	const canvas = createCanvas(1000, 1000)
	canvas.parent("canvas-holder")
	algorithm.setupCanvas()
}

window.draw = () => {
	background(240)
	algorithm.draw()
}

window.algorithm = algorithm
