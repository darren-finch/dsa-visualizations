class GridSquare {
	distanceFromStart = Number.MAX_SAFE_INTEGER
	path = false
	visited = false
	seen = false

	constructor(row, col, size) {
		this.row = row
		this.col = col
		this.size = size
	}

	draw = (color) => {
		stroke(0)
		fill(...color)
		rect(this.col * this.size, this.row * this.size, this.size - 1, this.size - 1)
	}
}

export default class Dijkstra {
	i = 0
	gridSize = 20
	rows = 0
	cols = 0
	grid = null
	seenGridSquares = []
	visitedGridSquares = []
	path = []

	setup = () => {
		this.rows = Math.floor(height / this.gridSize)
		this.cols = Math.floor(width / this.gridSize)
		this.grid = new Array(this.rows).fill(null).map((row) => new Array(this.cols))

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.grid[row][col] = new GridSquare(row, col, this.gridSize)
			}
		}

		this.seenGridSquares.push(this.grid[0][0])
	}

	_getNeighbors(gridSquare) {
		const neighbors = []

		if (0 < gridSquare.col && !this.grid[gridSquare.row][gridSquare.col - 1].seen) {
			neighbors.push(this.grid[gridSquare.row][gridSquare.col - 1])
		}
		if (0 < gridSquare.row && !this.grid[gridSquare.row - 1][gridSquare.col].seen) {
			neighbors.push(this.grid[gridSquare.row - 1][gridSquare.col])
		}
		if (gridSquare.col < this.cols - 1 && !this.grid[gridSquare.row][gridSquare.col + 1].seen) {
			neighbors.push(this.grid[gridSquare.row][gridSquare.col + 1])
		}
		if (gridSquare.row < this.rows - 1 && !this.grid[gridSquare.row + 1][gridSquare.col].seen) {
			neighbors.push(this.grid[gridSquare.row + 1][gridSquare.col])
		}

		return neighbors
	}

	draw = () => {
		if (0 < this.seenGridSquares.length) {
			let curGridSquare = this.seenGridSquares[0]
			for (let gridSquare of this.seenGridSquares) {
				if (gridSquare.distanceFromStart < curGridSquare.distanceFromStart) {
					curGridSquare = gridSquare
				}
			}

			for (let neighbor of this._getNeighbors(curGridSquare)) {
				this.grid[neighbor.row][neighbor.col].seen = true

				const distanceFromStartWIthCurGridSquareAsPrevSquare = curGridSquare.distanceFromStart + 1
				if (distanceFromStartWIthCurGridSquareAsPrevSquare < neighbor.distanceFromStart) {
					this.grid[neighbor.row][neighbor.col].distanceFromStart =
						distanceFromStartWIthCurGridSquareAsPrevSquare
				}

				this.seenGridSquares.push(neighbor)
			}

			// Remove current square from the seen grid squares list and add it to the visited list
			this.seenGridSquares.splice(this.seenGridSquares.indexOf(curGridSquare), 1)
			curGridSquare.visited = true
		}

		background(230)

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const gridSquare = this.grid[row][col]
				if (gridSquare.visited) {
					gridSquare.draw([0, 255, 255])
				} else if (gridSquare.seen) {
					gridSquare.draw([0, 255, 0])
				} else {
					gridSquare.draw([255])
				}
			}
		}

		// Draw path
	}
}
