import {Gaal} from './gaal.js';

const epsilon = 1e-3;

class Sphere {
	constructor(c, r, color) {
		this.c = c;
		this.r = r;
		this.color = color;
	}

	intersection(R) {
		let u = R.u;
		let w = Gaal.sub(this.c, R.p);

		let a = 1;
		let b = -2 * Gaal.dotprod(u, w);
		let c = Gaal.dotprod(w, w) - Math.pow(this.r, 2);

		let delta = Math.pow(b, 2) - 4 * a * c;
		
		if(delta < 0) return { t: Number.MAX_VALUE };
		
		let t_minus = (-b - Math.sqrt(delta))/2;
		let t_plus  = (-b + Math.sqrt(delta))/2;

		if(t_plus < 0) return { t: Number.MAX_VALUE };

		let t = t_minus > epsilon ? t_minus : t_plus;
		let inside = (t_minus < epsilon && t_plus > epsilon);

		return {t, inside};
	}

	normal(p) {
		return Gaal.normalize(Gaal.sub(p, this.c));
	}
}

class Ray {
	constructor(p, u, t) {
		this.p = p;
		this.u = u;
		this.t = t;
	}
}

/* Given the camera setup and the image size, generate a ray Rij from the eye passing through the center of each pixel (i, j) of your image window (See Fig. 62.) Call trace(R) and assign the color returned to this pixel.*/
export function rayTrace(width, heigth, setpixel) {
	//console.log(Gaal.norm([3, 4]));
	let eye = [0, 0, 0]; //denote the eye point,
	let at = [0, 0, 1]; // denote the center point at which the camera is looking,
	let up = [0, 1, 0]; // denote the “up vector”
	
	let fovy = 60;
	let teta_y = Math.PI * fovy / 180;

	let alpha = width / heigth;

	let h = 2 * Math.tan(teta_y/2);
	let w = h * alpha;

	let view = Gaal.normalize(Gaal.sub(at, eye));

	let Vvz = Gaal.prod(-1, view);
	let Vvx = Gaal.crossprod(view, up);
	let Vvy = Gaal.crossprod(Vvz, Vvx);
	//console.log(Vvz, Vvx, Vvy);
	
	let p = [], u = [], R = [];
	for(let r = 0; r < heigth; r++) {
		p[r] = []; u[r] = []; R[r] = [];
		for(let c = 0; c < width; c++) {
			let ay = -h*(r/heigth - 1/2);
			let ax = -w*(c/width - 1/2);
			//if(c == 0) debugger;
			p[r][c] = Gaal.plus(eye, Gaal.prod(ax, Vvx), Gaal.prod(ay, Vvy), Gaal.prod(-1, Vvz));
			u[r][c] = Gaal.normalize(Gaal.sub(p[r][c], eye));
			R[r][c] = new Ray(eye, u[r][c], Number.MAX_VALUE);

			//setpixel(c, r, c == r ? {r: 0, g: 0, b: 0} : {r: 255, g: 255, b: 255})
			//requestAnimationFrame(callback: FrameRequestCallback)
			setpixel(c, r, /*rgb*/ trace(R[r][c]));
		}
	}
}

let objects = [
	new Sphere([5, 4, 15], 1, [1, 1, 1]),
	new Sphere([-1, 3, 13], 1, [1, 1, 1]),
	new Sphere([-3, -3, 10], 1, [1, 1, 1]),
	new Sphere([4, -2, 25], 1, [1, 1, 1]),
];

let lights = [
	[0, 0, 12],
];

// /* Shoot R into the scene and let X be the first object hit and p be the point of contact with this object. */
function trace(R) {
	/*let current_obj = null;
	let current_t = Number.MAX_VALUE;

	for(let obj of objects) {
		let { t, inside } = obj.intersection(R);
		if(t < current_t) {
			current_t = t;
			current_obj = obj;
		}
	}*/

	let {obj, t} = intersection(R);

	if (t == Number.MAX_VALUE) return [0, 0, 0];

	const prod = (a, b) => a * b;
	const sum = (a, b) => a + b;
	const sub = (a, b) => a - b;

	//A vector n that is perpendicular to the surface and directed outwards from the surface
	//debugger;
	let p = Gaal.zip(sum, R.p, Gaal.prod(t, R.u));
	let n = obj.normal(p);
	//vector ~v that points in the direction of the viewer
	//let v = 
	//A vector ~r that indicates the direction of pure reflection of the light vector
	//let r =
	//vector ~h that is midway between ~ℓ and ~v
	//let h = 

	let ρ_a = 0.08; //Parâmetro a ser incluído a cada superfície, não à cena
	let L_a = [1, 1, 1];
	let Ia = Gaal.prod(ρ_a, Gaal.zip(prod, L_a, obj.color));

	// Iterar trecho para cada fonte luminosa
	let Id;
	for(let light of lights) {
		//A vector l that points towards the light source.
		let ℓ = Gaal.zip(sub, light, p);
		    ℓ = Gaal.normalize(ℓ);
		let ρ_d = 1; //Parâmetro a ser incluído a cada superfície, não à cena
		let L_d = [1, 1, 1];
		let cosϴ = Math.max(0, Gaal.dotprod(n, ℓ));
		Id = Gaal.prod(ρ_d * cosϴ, L_d);
		Id = Gaal.zip(prod, Id, obj.color);
	}

	// if(X.reflective) {
	// 	//compute the reflection ray Rr of R at p
	// 	Cr = trace(Rr);
	// }
	// if(X.transparent) {
	// 	//compute the transmission (refraction) ray Rt of R at p
	// 	if(inside) /*...*/ ;
	// 	Ct = trace(Rt);
	// }

	// for (light of lights) {
	// 	Cl += trace(Rl);
	// }

	return Gaal.zip(sum, Ia, Id);
}

function intersection(R) {
	//let obj be the first object hit and p be the point of contact with this object.
	let current_obj = null;
	let current_t = Number.MAX_VALUE;

	for(let obj of objects) {
		let { t, inside } = obj.intersection(R);
		if(t < current_t) {
			current_t = t;
			current_obj = obj;
		}
	}

	return {obj: current_obj, t: current_t};
}