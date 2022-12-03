import MinHeap from "../data-structures/min-heap.js"

class GridSquare {
	shortestDistanceFromStart = Number.MAX_SAFE_INTEGER
	prevGridSquareOnShortestPathToStart = null
	visited = false
	isObstacle = false
	isPath = false
	weight = 0

	constructor(row, col, size) {
		this.row = row
		this.col = col
		this.size = size
	}

	draw = () => {
		stroke(0)
		if (this.isPath) {
			fill(0, 255 - this.weight, 255 - this.weight)
		} else if (this.isObstacle) {
			fill(0, 0, 0)
		} else if (this.visited) {
			fill(255 - this.weight, 255 - this.weight, 0)
		} else {
			fill(255 - this.weight)
		}
		rect(this.col * this.size, this.row * this.size, this.size - 1, this.size - 1)
	}
}

export default class Dijkstra {
	gridSize = 20
	rows = 0
	cols = 0
	grid = null
	startRow = 0
	startCol = 0
	endRow = 0
	endCol = 0
	curGridSquare = null
	neighborsPriorityQueue = new MinHeap()
	obstacleThreshold = 150 // Sets the point at which the weight of the node makes it become an obstacle (on a scale from 0 to 255)
	noiseScale = 0.3

	setupCanvas() {
		this.rows = Math.floor(height / this.gridSize)
		this.cols = Math.floor(width / this.gridSize)
		this.startRow = Math.floor(Math.random() * this.rows)
		this.startCol = Math.floor(Math.random() * this.cols)
		this.endRow = this.rows - 1
		this.endCol = this.cols - 1
		this.grid = new Array(this.rows).fill(null).map((row) => new Array(this.cols))

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const gridSquare = new GridSquare(row, col, this.gridSize)

				const noiseVal = noise(row * this.noiseScale, col * this.noiseScale) * 255

				if (this.obstacleThreshold <= noiseVal) {
					gridSquare.isObstacle = true
				}

				gridSquare.weight = noiseVal

				if (row === this.startRow && col === this.startCol) {
					gridSquare.shortestDistanceFromStart = 0
					gridSquare.weight = 0
					gridSquare.isObstacle = false
				}

				this.grid[row][col] = gridSquare
			}
		}

		this.curGridSquare = this.grid[this.startRow][this.startCol]
	}

	_getNeighbors(gridSquare) {
		const neighbors = []

		const up = 0 < gridSquare.row ? this.grid[gridSquare.row - 1][gridSquare.col] : null
		const right = gridSquare.col < this.cols - 1 ? this.grid[gridSquare.row][gridSquare.col + 1] : null
		const down = gridSquare.row < this.rows - 1 ? this.grid[gridSquare.row + 1][gridSquare.col] : null
		const left = 0 < gridSquare.col ? this.grid[gridSquare.row][gridSquare.col - 1] : null

		if (up && !up.visited && !up.isObstacle) {
			neighbors.push(up)
		}
		if (right && !right.visited && !right.isObstacle) {
			neighbors.push(right)
		}
		if (down && !down.visited && !down.isObstacle) {
			neighbors.push(down)
		}
		if (left && !left.visited && !left.isObstacle) {
			neighbors.push(left)
		}

		return neighbors
	}

	draw() {
		this.dijkstraNextStep()

		background(230)

		this._drawGrid()
		this._drawPath()
	}

	dijkstraNextStep() {
		//As a protection if there is no path to the destination grid square.
		if (this.curGridSquare !== null) {
			if (!(this.curGridSquare.row === this.endRow && this.curGridSquare.col === this.endCol)) {
				const neighbors = this._getNeighbors(this.curGridSquare)

				for (let neighbor of neighbors) {
					const newPossibleDistanceFromStartForNeighbor =
						this.curGridSquare.shortestDistanceFromStart + neighbor.weight
					if (newPossibleDistanceFromStartForNeighbor < neighbor.shortestDistanceFromStart) {
						neighbor.shortestDistanceFromStart = newPossibleDistanceFromStartForNeighbor
						neighbor.prevGridSquareOnShortestPathToStart = this.curGridSquare
						this.neighborsPriorityQueue.enqueue(neighbor, newPossibleDistanceFromStartForNeighbor)
					}
				}

				this.curGridSquare.visited = true

				// The next grid square will be the unvisited grid square with the minimum distance from the start
				let temp = this.neighborsPriorityQueue.dequeue()
				this.curGridSquare = temp ? temp.val : null
			}
		}
	}

	_drawGrid() {
		// Draw all the grid squares without any knowledge of the path
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const gridSquare = this.grid[row][col]
				gridSquare.isPath = false // Because it will be set when we draw the path
				gridSquare.draw()
			}
		}
	}

	_drawPath() {
		// Draw path starting from the current grid square, going all the way back to the start
		let curGridSquareOnPathToCurGridSquare = this.curGridSquare
		while (curGridSquareOnPathToCurGridSquare !== null) {
			curGridSquareOnPathToCurGridSquare.isPath = true
			curGridSquareOnPathToCurGridSquare.draw()
			curGridSquareOnPathToCurGridSquare = curGridSquareOnPathToCurGridSquare.prevGridSquareOnShortestPathToStart
		}
	}
}
