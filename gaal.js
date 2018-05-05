export class Gaal {
	static crossprod([v1, v2, v3], [w1, w2, w3]) {
		let u1 =   v2*w3 - v3*w2;
		let u2 = -(v1*w3 - v3*w1);
		let u3 =   v1*w2 - v2*w1;
		return [u1, u2, u3];
	}

	static dotprod(v1, v2) {
		let p = 0;
		for(let i = 0; i < v1.length; i++) p += v1[i] * v2[i];
		return p;
	}

	static norm(v) {
		let n = v.reduce((a, b) => a + b*b , 0);
		//console.log('norm', Math.sqrt(n));
		return Math.sqrt(n);
	}

	static normalize(v) {
		let norm = Gaal.norm(v);
		//console.log('normalize', v.map(x => x / norm))
		return v.map(x => x / norm);
	}

	static plus(...vs) {
		let w = [...vs[0]];
		for(let j = 1; j < vs.length; j++) {
			//debugger;
			for(let i = 0; i < w.length; i++) w[i] += vs[j][i];
			//console.log(w);
		}
		return w;
	}

	static prod(n, v) {
		//console.log('prod', v.map(x => x * n));
		return v.map(x => x * n);
	}

	static sub(v1, v2) {
		let v3 = [];
		for(var i = 0; i < v1.length; i++) v3[i] = v1[i] - v2[i];
		//console.log('sub', v3);
		return v3;
	}

	static zip(f, ...vs) {
		let w = [...vs[0]];
		for(let i = 1; i < vs.length; i++){
			for(let j = 0; j < w.length; j++) {
				w[j] = f(w[j], vs[i][j]);
			}
		}
		return w;
	}

}