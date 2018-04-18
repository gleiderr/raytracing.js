//import {Coordinate} from './gaal.js'

const epsilon = 1e-3;

class Sphere {
	constructor(c, r) {
		this.c = c;
		this.r = r;
	}

	intersection(R) {
		let a = 1;
		let b = -2*gaal.dotprod(u, w);
		let c = gaal.dotprod(w, w) - Math.pow(this.r, 2);

		let delta = Math.pow(b, 2) - 4 * a * c;
		
		if(delta < 0) return { t: 0 };
		
		let t_minus = (-b - Math.sqrt(delta))/2;
		let t_plus  = (-b + Math.sqrt(delta))/2;

		let t = t_minus > epsilon ? t_minus : t_plus;
		let inside = (t_minus < epsilon && t_plus > epsilon);

		return {t, inside};
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
	/*let eye = new Coordinate(0, 0, 0); //denote the eye point,
	let at = new Coordinate(0, 0, -1); // denote the center point at which the camera is looking,
	let up = new Coordinate(0, 1, 0); // denote the “up vector”
	
	let fovy = 60;
	let teta_y = Math.PI * fovy / 180;

	let alpha = width / heigth;

	let h = 2 * Math.tan(teta_y/2);
	let w = h * alpha;

	let view = gaal.normalize(gaal.sub(at, eye));

	let Vvz = gaal.prod(-1, view);
	let Vvx = gaal.crossprod(view, up);
	let Vvy = gaal.crossprod(Vvz, Vvx);
	
	let p = [[]], u = [[]], R = [[]];*/
	for(let r = 0; r < heigth; r++) {
		for(let c = 0; c < width; c++) {
			/*let ay = -h*(r/heigth - 1/2);
			let ax =  w*(c/width - 1/2);

			p[r][c] = gaal.plus(eye, gaal.prod(ax, Vvx), gaal.prod(ay, Vvy), gaal.prod(-1, Vvz));
			u[r][c] = gaal.normalize(gaal.sub(p[r][c], eye));
			R[r][c] = new Ray(eye, t, u[r][c]);*/

			setpixel(c, r, c == r ? {r: 0, g: 0, b: 0} : {r: 255, g: 255, b: 255})
			//setpixel(c, r, /*rgb*/ trace(R));
		}
	}
}

// /* Shoot R into the scene and let X be the first object hit and p be the point of contact with this object. */
function trace(R) {
	//let X be the first object hit and p be the point of contact with this object.
	for(obj in objects) {
		let {t, normal, object, inside} = intersection();
	}

	if(X.reflective) {
		//compute the reflection ray Rr of R at p
		Cr = trace(Rr);
	}
	if(X.transparent) {
		//compute the transmission (refraction) ray Rt of R at p
		if(inside) /*...*/ ;
		Ct = trace(Rt);
	}

	for (light of lights) {
		Cl += trace(Rl);
	}

	return Cr + Ct + Cl;
}