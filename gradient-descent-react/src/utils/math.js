// ── Gradient Descent Math Utilities ──

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Target function: f(x) = x⁴ − 3x³ + 2
export const f = (x) => x * x * x * x - 3 * x * x * x + 2;
export const df = (x) => 4 * x * x * x - 9 * x * x;

// Rosenbrock function
export const rosenbrock = (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2;
export const dRosenX = (x, y) => -2 * (1 - x) + 200 * (y - x * x) * (-2 * x);
export const dRosenY = (x, y) => 200 * (y - x * x);

// Optimizer step functions
export const optimizerStep = {
  sgd: (state, lr) => {
    const g = df(state.x);
    state.x = clamp(state.x - lr * g, -1.5, 4);
    return state;
  },

  momentum: (state, lr) => {
    const g = df(state.x);
    state.v = 0.9 * state.v + g;
    state.x = clamp(state.x - lr * state.v, -1.5, 4);
    return state;
  },

  rmsprop: (state, lr) => {
    const g = df(state.x);
    state.eg2 = 0.9 * state.eg2 + 0.1 * g * g;
    state.x = clamp(state.x - (lr / Math.sqrt(state.eg2 + 1e-8)) * g, -1.5, 4);
    return state;
  },

  adam: (state, lr) => {
    const g = df(state.x);
    state.t++;
    state.m = 0.9 * state.m + 0.1 * g;
    state.v = 0.999 * state.v + 0.001 * g * g;
    const mhat = state.m / (1 - Math.pow(0.9, state.t));
    const vhat = state.v / (1 - Math.pow(0.999, state.t));
    state.x = clamp(state.x - (lr / Math.sqrt(vhat + 1e-8)) * mhat, -1.5, 4);
    return state;
  },
};

export const createOptimizerState = (x0 = -0.5) => ({
  sgd: { x: x0, history: [{ x: x0, y: f(x0) }], loss: [f(x0)] },
  momentum: { x: x0, v: 0, history: [{ x: x0, y: f(x0) }], loss: [f(x0)] },
  rmsprop: { x: x0, eg2: 0, history: [{ x: x0, y: f(x0) }], loss: [f(x0)] },
  adam: { x: x0, m: 0, v: 0, t: 0, history: [{ x: x0, y: f(x0) }], loss: [f(x0)] },
});

export const OPTIMIZER_COLORS = {
  sgd: '#6c5ce7',
  momentum: '#00cec9',
  rmsprop: '#fd79a8',
  adam: '#ffeaa7',
};

export const OPTIMIZER_NAMES = {
  sgd: 'SGD',
  momentum: 'Momentum',
  rmsprop: 'RMSProp',
  adam: 'Adam',
};
