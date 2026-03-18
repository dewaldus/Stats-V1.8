export function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let c = 1;
  for (let i = 1; i <= k; i++) {
    c = c * (n - i + 1) / i;
  }
  return c;
}

export function normalPdf(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

export function normalCdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function normalInv(p: number, mu: number, sigma: number): number {
  if (p <= 0 || p >= 1) return NaN;
  // Approximation by Peter J. Acklam
  const a1 = -3.969683028665376e+01;
  const a2 =  2.209460984245205e+02;
  const a3 = -2.759285104469687e+02;
  const a4 =  1.383577518672690e+02;
  const a5 = -3.066479806614716e+01;
  const a6 =  2.506628277459239e+00;

  const b1 = -5.447609879822406e+01;
  const b2 =  1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 =  6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;

  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 =  4.374664141464968e+00;
  const c6 =  2.938163982698783e+00;

  const d1 =  7.784695709041462e-03;
  const d2 =  3.224671290700398e-01;
  const d3 =  2.445134137142996e+00;
  const d4 =  3.754408661907416e+00;

  const p_low = 0.02425;
  const p_high = 1 - p_low;
  let q, r, x;

  if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    x = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    x = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
         ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return x * sigma + mu;
}

export function binomialPmf(x: number, n: number, p: number): number {
  if (x < 0 || x > n || !Number.isInteger(x)) return 0;
  return combinations(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

export function binomialCdf(x: number, n: number, p: number): number {
  let sum = 0;
  for (let i = 0; i <= Math.floor(x); i++) {
    sum += binomialPmf(i, n, p);
  }
  return sum;
}

export function poissonPmf(x: number, lambda: number): number {
  if (x < 0 || !Number.isInteger(x)) return 0;
  return (Math.pow(lambda, x) * Math.exp(-lambda)) / factorial(x);
}

export function poissonCdf(x: number, lambda: number): number {
  let sum = 0;
  for (let i = 0; i <= Math.floor(x); i++) {
    sum += poissonPmf(i, lambda);
  }
  return sum;
}

export function hypergeomPmf(x: number, N: number, K: number, n: number): number {
  if (x < 0 || x > n || x > K || n - x > N - K || !Number.isInteger(x)) return 0;
  return (combinations(K, x) * combinations(N - K, n - x)) / combinations(N, n);
}

export function hypergeomCdf(x: number, N: number, K: number, n: number): number {
  let sum = 0;
  for (let i = 0; i <= Math.floor(x); i++) {
    sum += hypergeomPmf(i, N, K, n);
  }
  return sum;
}
