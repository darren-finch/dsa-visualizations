import "./p5.min.js"
import Dijkstra from "./dijkstra.js"

// let algorithm = new Dijkstra()

window.setup = () => {
	const canvas = createCanvas(1000, 1000)
	canvas.parent("canvas-holder")
}

window.draw = () => {
	background(240)
}
