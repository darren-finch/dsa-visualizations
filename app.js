const padding = 15;

function setup() {
	createCanvas(400, 400);
}

function draw() {
	background(230);

	const arrayElement = new VisualArrayElement();
	arrayElement.data = "Darren";
	arrayElement.x = 100;
	arrayElement.y = 100;
	arrayElement.draw();
}

function VisualArrayElement() {
	this.data = "0";
	this.x = 0;
	this.y = 0;
	this._width = textWidth(this.data);
	this._height = textAscent(this.data);
	this.width = textWidth(this.data);
	this.height = textAscent(this.data);
	this.draw = function () {
		this.width = textWidth(this.data);
		this.height = textAscent(this.data);
		fill("red");
		rect(this.x, this.y, this.width + 2 * padding, this.height + 2 * padding);
		fill("white");
		text(this.data, this.x + padding, this.y + padding);
	};
}
