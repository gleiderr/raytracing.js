import {Gaal} from './gaal.js';

const ϵ = 1e-3;
const prod = (a, b) => a * b;
const sum = (a, b) => a + b;
const sub = (a, b) => a - b;

class Sphere {
	constructor(c, r) {
		this.c = c;
		this.r = r;
		this.ρa = 0.05; //Taxa luz ambiente
		this.ρe = 0; //Taxa de emissão
		this.ρd = 1; //Taxa luz difusa
		this.color = [1, 1, 1];
	}

	intersection(R) {
		let w = Gaal.zip(sub, this.c, R.p);

		let a = 1;
		let b = -2 * Gaal.dotprod(R.u, w);
		let c = Gaal.dotprod(w, w) - Math.pow(this.r, 2);

		let delta = Math.pow(b, 2) - 4 * a * c;
		
		if(delta < 0) return { t: Number.MAX_VALUE };

		let t_plus  = (-b + Math.sqrt(delta))/2;
		if(t_plus < 0) return { t: Number.MAX_VALUE };

		let t_minus = (-b - Math.sqrt(delta))/2;

		let t = t_minus > ϵ ? t_minus : t_plus;
		let inside = (t_minus < ϵ && t_plus > ϵ);

		return {t, inside};
	}

	normal(p) {
		return Gaal.normalize(Gaal.zip(sub, p, this.c));
	}

	brdf(R, t, deep) {
		//A vector n that is perpendicular to the surface and directed outwards from the surface
		let p = Gaal.zip(sum, R.p, Gaal.prod(t, R.u));
		let n = this.normal(p);
		//vector ~v that points in the direction of the viewer
		//let v = 
		//A vector ~r that indicates the direction of pure reflection of the light vector
		//let r =
		//vector ~h that is midway between ~ℓ and ~v
		//let h = 

		//Radiosidade ambiente
		let Ia = Gaal.zip(prod, this.color, [1, 1, 1]); //cor [1, 1, 1] deve ser atribuída à cena
		    Ia = Gaal.prod(this.ρa, Ia);

		//Radiosidade emissiva
		let Ie = [0, 0, 0];
		if(this.ρe) {
			/*let d = Gaal.norm(v);*/
			let cosϴ = Math.max(0, Gaal.dotprod(n, Gaal.prod(-1, R.u)));
			Ie = Gaal.prod(this.ρe * cosϴ/* / Math.pow(d, 2)*/, this.color);
		}

		//Iterar para cada objeto da cena
		let Id = [0, 0, 0];
		for(let object of objects) {
			if (object == this) continue;
			//A vector l that points towards the light source.
			let ℓ = Gaal.zip(sub, object.c, p);
			    ℓ = Gaal.normalize(ℓ);

		 	let cosϴ = Math.max(0, Gaal.dotprod(n, ℓ));

		 	if(!cosϴ) continue;

			let Ld = trace(new Ray(p, ℓ), deep + 1, object); //Intensidade da luz. Diferente da apostila de David Mount //Parâmetro da fonte emissora
		 	
		 	if(!Ld[0] && !Ld[1] && !Ld[2]) continue;
		 	
		 	Id = Gaal.zip(sum, Id, Gaal.prod((this.ρd * cosϴ)/Math.pow(t, 2), Ld));
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

		return Gaal.zip(sum, Ia, Id, Ie);
	}
}

class Ray {
	constructor(p, u, t = Number.MAX_VALUE) {
		this.p = p;
		this.u = u;
		this.t = t;
	}
}

let objects = [
	new Sphere([5, 4, 15], 1),
	new Sphere([-1, 3, 12], 1),
	new Sphere([-3, -3, 10], 1),
	new Sphere([2, -2, 17], 1),
	new Sphere([0, 0, 12], .3),
];

objects[4].ρe = 120; //Taxa de emissão

export function setupScenery(scenery) {
	let s = {...scenery};

	s.ϴy = Math.PI * s.fovy / 180; //field of view
	s.h = 2 * Math.tan(s.ϴy/2);
	s.w = s.h * s.width / s.height;
	
	s.view = Gaal.normalize(Gaal.zip(sub, s.at, s.eye));

	s.Vvz = Gaal.prod(-1, s.view);
	s.Vvx = Gaal.crossprod(s.view, s.up);
	s.Vvy = Gaal.crossprod(s.Vvz, s.Vvx);

	return s;
}

/* Given the camera setup and the image size, generate a ray Rij from the eye passing through the center of each pixel (i, j) 
of your image window (See Fig. 62.) Call trace(R) and assign the color returned to this pixel.*/
export function rayTrace(scenery, setpixel, print) {
	let R = [];
	for(let r = 0; r < scenery.height; r++) {
		R[r] = [];
		for(let c = 0; c < scenery.width; c++) {
			let ay = -scenery.h*(r/scenery.height - 1/2);
			let ax = -scenery.w*(c/scenery.width - 1/2);
			
			let p = Gaal.zip(sum, 
							scenery.eye, 
							Gaal.prod(ax, scenery.Vvx), 
							Gaal.prod(ay, scenery.Vvy), 
							Gaal.prod(-1, scenery.Vvz));
			let u = Gaal.normalize(Gaal.zip(sub, p, scenery.eye));
			R[r][c] = new Ray(scenery.eye, u, Number.MAX_VALUE);
			
			//setpixel(c, r, /*rgb*/ trace(R[r][c]));
			setTimeout(() => setpixel(c, r, /*rgb*/ trace(R[r][c], 0)), 0);
		}
	}

	if(print) print();
}

// /* Shoot R into the scene and let X be the first object hit and p be the point of contact with this object. */
function trace(R, deep, target = null) {
	if (deep == 5) return [0, 0, 0];
	let {obj, t} = intersection(R);

	if (target && target != obj) return [0, 0, 0];

	if (t == Number.MAX_VALUE) return [0, 0, 0];

	return obj.brdf(R, t, deep);
}

function intersection(R) {
	//let obj be the first object hit and p be the point of contact with this object.
	let current_obj = null;
	let current_t = Number.MAX_VALUE;

	for(let obj of objects) {
		let { t, inside } = obj.intersection(R);
		if(t < current_t && t > ϵ) {
			current_t = t;
			current_obj = obj;
		}
	}

	return {obj: current_obj, t: current_t};
}