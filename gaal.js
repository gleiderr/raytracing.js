export class Coordinate {
	constructor(...coords) {
		this.coords = coords;
	}

	get x() { return this.coords[0]; }
	get y() { return this.coords[1]; }
	get z() { return this.coords[2]; }

	/*
	Classe imutável.
	set x(x) { this.coords[0] = x; }
	set y(y) { this.coords[1] = x; }
	set z(z) { this.coords[2] = x; }*/
}