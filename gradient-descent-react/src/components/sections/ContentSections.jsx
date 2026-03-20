import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

/* ═══════════════════════════════════════════════════════════════
   INTUITION
   ═══════════════════════════════════════════════════════════════ */
export function Intuition() {
  return (
    <ScrollReveal id="intuition">
      <h2><span className="sec-icon">🧠</span> Build Intuition Before Any Math</h2>
      <p className="lead">The mountain analogy is all you need to understand optimization forever.</p>
      <div className="card">
        <h3>The Mountain Analogy</h3>
        <p>Imagine you're blindfolded on a mountainside. Your only goal: reach the valley floor. You can't see, but you <strong>can feel the slope beneath your feet</strong>. At each step, you feel the steepest downhill direction and take a step that way. That's gradient descent.</p>
        <ul>
          <li><strong>Your position</strong> = the current values of the model's parameters (weights)</li>
          <li><strong>The altitude</strong> = the value of the loss function (error)</li>
          <li><strong>The slope you feel</strong> = the gradient (partial derivatives) of the loss</li>
          <li><strong>Your step size</strong> = the learning rate (α)</li>
        </ul>
        <p style={{ marginTop: 12 }}>The gradient gives you the direction of steepest <em>ascent</em>. So you walk in the <strong>opposite direction</strong> — the direction of steepest descent — to minimize the loss.</p>
      </div>
      <div className="callout">
        <div className="callout-icon">💡</div>
        <div>
          <p><strong>The Truth Most People Miss:</strong> Gradient descent doesn't guarantee finding the global minimum. In deep learning's non-convex landscape, it finds <em>local minima</em> — which, remarkably, are nearly as good as global minima in over-parameterized networks (thousands of parameters smooth the landscape).</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATHEMATICS
   ═══════════════════════════════════════════════════════════════ */
export function Mathematics() {
  return (
    <ScrollReveal id="math">
      <h2><span className="sec-icon">📐</span> The Update Rule Explained</h2>
      <p className="lead">Six steps that power every neural network in production today.</p>
      <div className="card">
        <h3>The Core Formula</h3>
        <p>Given a loss function <strong>J(θ)</strong> parameterized by <strong>θ</strong>:</p>
        <div className="math-block">θ<sub>t+1</sub> = θ<sub>t</sub> − α · ∇<sub>θ</sub> J(θ<sub>t</sub>)</div>
        <ul>
          <li><strong>θ<sub>t</sub></strong> — parameter vector at time step t</li>
          <li><strong>α</strong> — learning rate (step size)</li>
          <li><strong>∇<sub>θ</sub> J(θ<sub>t</sub>)</strong> — gradient of the loss w.r.t. θ</li>
        </ul>
        <h4>Six Steps</h4>
        {[
          'Initialize θ₀ randomly (Xavier/He initialization)',
          'Forward pass: ŷ = f(x; θ) — compute predictions',
          'Compute loss: J(θ) = L(ŷ, y) — measure how wrong we are',
          'Backward pass: ∇θJ via backpropagation',
          'Update: θ ← θ − α · ∇θJ — take a step downhill',
          'Repeat until convergence'
        ].map((text, i) => (
          <div className="step-row" key={i}>
            <div className="step-num">{i + 1}</div>
            <div className="step-content"><p>{text}</p></div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Worked Example: Linear Regression</h3>
        <p>Model: <strong>ŷ = wx + b</strong> &nbsp;|&nbsp; Data: (1,2), (2,4), (3,6) &nbsp;|&nbsp; w=0.5, b=0.1, α=0.01</p>
        <div className="math-block">
          J(w,b) = (1/n) · Σ(ŷᵢ − yᵢ)²<br />
          ∂J/∂w = (2/n) · Σ(ŷᵢ − yᵢ) · xᵢ<br />
          ∂J/∂b = (2/n) · Σ(ŷᵢ − yᵢ)
        </div>
        <div className="math-block">
          ∂J/∂w = −13.6 → w<sub>new</sub> = 0.5 + 0.136 = <strong style={{ color: 'var(--accent3)' }}>0.636</strong><br />
          ∂J/∂b = −5.8 → b<sub>new</sub> = 0.1 + 0.058 = <strong style={{ color: 'var(--accent3)' }}>0.158</strong>
        </div>
        <p>After one step, w moved from 0.5 toward the true value of 2.</p>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEARNING RATE
   ═══════════════════════════════════════════════════════════════ */
export function LearningRate() {
  return (
    <ScrollReveal id="learning-rate">
      <h2><span className="sec-icon">⚡</span> Learning Rate — The Most Critical Choice</h2>
      <p className="lead">Too small and you waste days. Too large and everything explodes.</p>
      <div className="grid-2">
        <div className="card">
          <h3>🐢 Too Small (α = 0.0001)</h3>
          <p>Convergence painfully slow. Gets stuck in shallow local minima. Wastes compute.</p>
          <span className="tag tag-pink">Slow Convergence</span>
        </div>
        <div className="card">
          <h3>🏎️ Too Large (α = 10)</h3>
          <p>Overshoots, oscillates wildly, or diverges completely. Loss goes to infinity.</p>
          <span className="tag tag-pink">Divergence Risk</span>
        </div>
      </div>
      <div className="card">
        <h3>Scheduling Strategies</h3>
        <ul>
          <li><strong>Step Decay:</strong> α = α₀ × 0.1 every 30 epochs</li>
          <li><strong>Cosine Annealing:</strong> α<sub>t</sub> = α<sub>min</sub> + ½(α<sub>max</sub> − α<sub>min</sub>)(1 + cos(πt/T))</li>
          <li><strong>Warmup + Decay:</strong> Linear warmup then cosine decay — Transformer standard.</li>
          <li><strong>Cyclical LR:</strong> Oscillate α between bounds. Helps escape saddle points.</li>
          <li><strong>1cycle Policy:</strong> Ramp up then ramp down. "Super-convergence" in ~10× fewer epochs.</li>
        </ul>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VARIANTS
   ═══════════════════════════════════════════════════════════════ */
export function Variants() {
  const variants = [
    {
      id: 'batch', title: 'Batch Gradient Descent', icon: '📦',
      algo: 'for epoch: g = (1/n) Σ∇L → θ = θ − α·g',
      pros: ['Stable convergence', 'Clean gradient estimates', 'Guaranteed convergence (convex)'],
      cons: ['Slow for large datasets', 'Full dataset must fit in RAM', 'Gets stuck in local minima'],
    },
    {
      id: 'sgd', title: 'Stochastic GD (SGD)', icon: '🎲',
      algo: 'for each sample i: g = ∇L(xᵢ) → θ = θ − α·g',
      pros: ['Fast updates', 'Escapes local minima via noise', 'Online learning possible', 'Low memory'],
      cons: ['High variance in updates', 'Noisy loss curve', 'May overshoot and oscillate'],
    },
    {
      id: 'minibatch', title: 'Mini-Batch GD (Industry Standard)', icon: '🧩',
      algo: 'for each batch B: g = (1/|B|) Σ∇L → θ = θ − α·g',
      pros: ['Best of both worlds', 'GPU-friendly (parallelism)', 'Good generalization from noise'],
      cons: ['Batch size is a hyperparameter', 'Still some gradient noise'],
      note: 'Batch sizes: 32, 64, 128, 256 — powers of 2 for GPU alignment. This is what everyone uses.'
    },
  ];

  return (
    <ScrollReveal id="variants">
      <h2><span className="sec-icon">🔀</span> Three Flavors of Gradient Descent</h2>
      <p className="lead">From full-batch to stochastic — each with trade-offs.</p>
      {variants.map((v) => (
        <div className="card" key={v.id} id={v.id}>
          <h3>{v.icon} {v.title}</h3>
          <div className="math-block">{v.algo}</div>
          <div className="pros-cons">
            <div className="pros">
              <h5>✅ Advantages</h5>
              <ul>{v.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="cons">
              <h5>❌ Disadvantages</h5>
              <ul>{v.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
          {v.note && <p style={{ marginTop: 12, fontSize: '.88rem', color: 'var(--accent3)' }}>{v.note}</p>}
        </div>
      ))}
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADVANCED OPTIMIZERS
   ═══════════════════════════════════════════════════════════════ */
export function AdvancedOptimizers() {
  return (
    <ScrollReveal id="optimizers">
      <h2><span className="sec-icon">🚀</span> From Momentum to Adam & Beyond</h2>
      <p className="lead">Modern optimizers that power every LLM in production.</p>

      <div className="card" id="momentum">
        <h3>🚀 SGD + Momentum</h3>
        <div className="math-block">
          v<sub>t</sub> = β · v<sub>t−1</sub> + ∇J(θ<sub>t</sub>) &nbsp;&nbsp; β = 0.9<br />
          θ<sub>t+1</sub> = θ<sub>t</sub> − α · v<sub>t</sub>
        </div>
        <p>β (typically 0.9) accumulates past gradients exponentially. Dampens oscillations in ravines, accelerates convergence in consistent gradient directions.</p>
        <h4>Nesterov Accelerated Gradient (NAG)</h4>
        <div className="math-block">
          v<sub>t</sub> = β · v<sub>t−1</sub> + ∇J(θ<sub>t</sub> − α·β·v<sub>t−1</sub>) &nbsp;&nbsp;<em>(look ahead first!)</em>
        </div>
        <p>Standard momentum computes gradient at current position. Nesterov's insight: compute gradient at the "look-ahead" position. This anticipation prevents overshooting. NAG trained ResNet, VGG, and most ImageNet winners.</p>
      </div>

      <div className="card" id="adagrad">
        <h3>🎯 AdaGrad</h3>
        <div className="math-block">
          G<sub>t</sub> = G<sub>t−1</sub> + (∇J)²<br />
          θ<sub>t+1</sub> = θ<sub>t</sub> − (α / √(G<sub>t</sub> + ε)) · ∇J
        </div>
        <p>Per-parameter adaptive learning rates — features that appear rarely get larger updates.</p>
        <div className="callout callout-warn">
          <div className="callout-icon">⚠️</div>
          <div><p><strong>Critical flaw:</strong> G<sub>t</sub> grows monotonically forever → learning rate shrinks to zero → training stalls completely.</p></div>
        </div>
      </div>

      <div className="card" id="rmsprop">
        <h3>📊 RMSProp</h3>
        <div className="math-block">
          E[g²]<sub>t</sub> = γ · E[g²]<sub>t−1</sub> + (1−γ) · g²<sub>t</sub> &nbsp;&nbsp; γ=0.9<br />
          θ<sub>t+1</sub> = θ<sub>t</sub> − (α / √(E[g²]<sub>t</sub> + ε)) · g<sub>t</sub>
        </div>
        <p>Hinton's fix for AdaGrad — uses exponential moving average so old gradients fade. Proposed in a Coursera lecture, never formally published!</p>
      </div>

      <div className="card" id="adam">
        <h3>👑 Adam — The King of Optimizers</h3>
        <div className="math-block">
          m<sub>t</sub> = β₁·m<sub>t−1</sub> + (1−β₁)·g<sub>t</sub> &nbsp;&nbsp;<em>(momentum)</em><br />
          v<sub>t</sub> = β₂·v<sub>t−1</sub> + (1−β₂)·g²<sub>t</sub> &nbsp;&nbsp;<em>(RMSProp)</em><br />
          m̂<sub>t</sub> = m<sub>t</sub> / (1−β₁ᵗ) &nbsp;;&nbsp; v̂<sub>t</sub> = v<sub>t</sub> / (1−β₂ᵗ) &nbsp;&nbsp;<em>(bias correction)</em><br />
          θ<sub>t+1</sub> = θ<sub>t</sub> − α · m̂<sub>t</sub> / (√v̂<sub>t</sub> + ε)
        </div>
        <p>Defaults: α=0.001, β₁=0.9, β₂=0.999, ε=10⁻⁸. Combines the best of Momentum and RMSProp.</p>
      </div>

      <div className="card" id="adamw">
        <h3>🔧 AdamW — Decoupled Weight Decay</h3>
        <div className="math-block">θ<sub>t+1</sub> = θ<sub>t</sub> − α · (m̂<sub>t</sub> / (√v̂<sub>t</sub> + ε) + λ · θ<sub>t</sub>)</div>
        <p>Default optimizer for Transformers (GPT, BERT, LLaMA). The key insight: decouple weight decay from the adaptive gradient updates.</p>
      </div>

      <div className="grid-2">
        <div className="card" id="lion">
          <h3>🦁 Lion</h3>
          <p>Sign-based momentum. Uses only the sign of gradients, not magnitudes — dramatically reduces memory. Competitive with Adam at fraction of the memory cost.</p>
          <span className="tag tag-purple">Memory Efficient</span>
        </div>
        <div className="card" id="sophia">
          <h3>🧠 Sophia</h3>
          <p>Second-order optimizer — 2× faster than Adam for LLM pre-training by approximating diagonal Hessian information cheaply.</p>
          <span className="tag tag-yellow">Second-Order</span>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ESSENTIAL TECHNIQUES (NEW)
   ═══════════════════════════════════════════════════════════════ */
export function EssentialTechniques() {
  return (
    <ScrollReveal id="techniques">
      <h2><span className="sec-icon">🛠️</span> Essential Techniques</h2>
      <p className="lead">Critical techniques that make the difference between a model that trains and one that doesn't.</p>

      <div className="card">
        <h3>📏 Feature Scaling</h3>
        <p>Without scaling, gradients are dominated by large-magnitude features. The loss landscape becomes an elongated ellipse, making GD oscillate. Always normalize to zero mean, unit variance. This single step can speed up training 10×.</p>
        <div className="math-block">x̂ = (x − μ) / σ</div>
      </div>

      <div className="card">
        <h3>📊 Batch Normalization</h3>
        <p>Normalize activations within each layer during training. Reduces internal covariate shift, allows higher learning rates, and acts as regularization. Used in nearly every modern CNN.</p>
        <div className="math-block">BN(x) = γ · (x − μ<sub>B</sub>) / √(σ²<sub>B</sub> + ε) + β</div>
      </div>

      <div className="card">
        <h3>📦 Gradient Accumulation</h3>
        <p>Can't fit batch size 256 in GPU memory? Run 8 forward passes with batch 32, accumulate gradients, then update once. Same math, less memory. Essential for training large models on consumer GPUs.</p>
        <div className="math-block">
          g<sub>acc</sub> += ∇L(batch<sub>i</sub>) / N<sub>acc</sub><br />
          θ = θ − α · g<sub>acc</sub> &nbsp;&nbsp;<em>(every N<sub>acc</sub> steps)</em>
        </div>
      </div>

      <div className="card">
        <h3>✂️ Gradient Clipping</h3>
        <p>When gradients explode (common in RNNs and Transformers), clipping rescales the gradient vector so its norm never exceeds a threshold. Without it, a single bad batch can destroy your model.</p>
        <div className="math-block">
          if ‖g‖ {'>'} max_norm:<br />
          &nbsp;&nbsp;g = g × (max_norm / ‖g‖)
        </div>
        <p>Rule of thumb: <strong>max_norm = 1.0</strong> for Transformers, <strong>5.0</strong> for RNNs.</p>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PYTORCH CODE (NEW)
   ═══════════════════════════════════════════════════════════════ */
export function PyTorchCode() {
  const [activeTab, setActiveTab] = useState('optimizers');

  const tabs = {
    optimizers: {
      label: 'Optimizers',
      code: `import torch
import torch.optim as optim
model = MyModel()

# ── SGD ──
optimizer = optim.SGD(model.parameters(), lr=0.01)

# ── SGD + Momentum ──
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# ── SGD + Nesterov ──
optimizer = optim.SGD(model.parameters(), lr=0.01,
                      momentum=0.9, nesterov=True)

# ── Adam ──
optimizer = optim.Adam(model.parameters(), lr=1e-3,
                       betas=(0.9, 0.999))

# ── AdamW (recommended for Transformers) ──
optimizer = optim.AdamW(model.parameters(), lr=3e-4,
                        weight_decay=0.01)

# ── RMSProp ──
optimizer = optim.RMSprop(model.parameters(), lr=1e-3, alpha=0.9)

# ── Adagrad ──
optimizer = optim.Adagrad(model.parameters(), lr=0.01)`
    },
    schedules: {
      label: 'LR Schedules',
      code: `from torch.optim.lr_scheduler import (
    StepLR, CosineAnnealingLR, OneCycleLR,
    CosineAnnealingWarmRestarts, LinearLR, SequentialLR
)

# ── Step Decay ──
scheduler = StepLR(optimizer, step_size=30, gamma=0.1)

# ── Cosine Annealing ──
scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)

# ── Warmup + Cosine (Transformer standard) ──
warmup = LinearLR(optimizer, start_factor=0.01, total_iters=10)
cosine = CosineAnnealingLR(optimizer, T_max=90)
scheduler = SequentialLR(optimizer, [warmup, cosine],
                         milestones=[10])

# ── 1cycle Policy (super-convergence) ──
scheduler = OneCycleLR(optimizer, max_lr=0.01, total_steps=1000)

# ── Cosine Warm Restarts (SGDR) ──
scheduler = CosineAnnealingWarmRestarts(optimizer,
                                        T_0=10, T_mult=2)`
    },
    training: {
      label: 'Training Loop',
      code: `import torch
import torch.nn as nn

model = MyModel().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(
    model.parameters(), lr=3e-4, weight_decay=0.01)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
    optimizer, T_max=num_epochs)

for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    for inputs, targets in train_loader:
        inputs, targets = inputs.to(device), targets.to(device)
        outputs = model(inputs)
        loss = criterion(outputs, targets)

        optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(
            model.parameters(), max_norm=1.0)
        optimizer.step()
        running_loss += loss.item()

    scheduler.step()
    avg_loss = running_loss / len(train_loader)
    print(f"Epoch {epoch+1}: loss={avg_loss:.4f}")`
    },
    tricks: {
      label: 'Pro Tricks',
      code: `# ── Gradient Accumulation ──
accumulation_steps = 4
for i, (inputs, targets) in enumerate(train_loader):
    loss = criterion(model(inputs.to(device)),
                     targets.to(device)) / accumulation_steps
    loss.backward()
    if (i + 1) % accumulation_steps == 0:
        torch.nn.utils.clip_grad_norm_(
            model.parameters(), max_norm=1.0)
        optimizer.step()
        optimizer.zero_grad()

# ── Monitor Gradient Norms ──
total_norm = sum(p.grad.data.norm(2).item() ** 2
                 for p in model.parameters()
                 if p.grad is not None) ** 0.5
print(f"Gradient norm: {total_norm:.4f}")

# ── Mixed Precision (2x faster, half memory) ──
scaler = torch.cuda.amp.GradScaler()
with torch.cuda.amp.autocast():
    outputs = model(inputs)
    loss = criterion(outputs, targets)
scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()`
    }
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
  };

  return (
    <ScrollReveal id="code">
      <h2><span className="sec-icon">💻</span> Real PyTorch Code</h2>
      <p className="lead">Copy-paste ready implementations for every optimizer and technique.</p>
      <div className="card">
        <div className="code-tabs">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              className={`code-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="code-block-wrapper">
          <button
            className="btn btn-outline copy-btn"
            onClick={() => copyCode(tabs[activeTab].code)}
          >
            📋 Copy
          </button>
          <pre className="code-block"><code>{tabs[activeTab].code}</code></pre>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHALLENGES (expanded)
   ═══════════════════════════════════════════════════════════════ */
export function Challenges() {
  const items = [
    { title: 'Local Minima', text: 'Non-convex surfaces have many. In high dimensions, most are nearly as good as global — over-parameterized networks smooth the landscape.' },
    { title: 'Saddle Points', text: 'Zero gradient but not a minimum. More common than local minima in high dims. Momentum and adaptive methods escape them.' },
    { title: 'Vanishing Gradients', text: 'Deep networks lose gradient signal through layers. Fix: ResNets (skip connections), BatchNorm, gradient clipping, ReLU.' },
    { title: 'Exploding Gradients', text: 'Gradient norms grow exponentially (common in RNNs). Loss jumps to NaN. Fix: gradient clipping, He/Xavier init, LSTM/GRU gates.' },
    { title: 'Plateaus', text: 'Flat regions where gradient ≈ 0. Training stalls for many epochs. LR warmup + cosine decay + patience helps.' },
    { title: 'Ill-Conditioned Curvature', text: 'Steep ravines cause oscillation. The condition number of the Hessian determines how elongated the loss landscape is.' },
  ];

  return (
    <ScrollReveal id="challenges">
      <h2><span className="sec-icon">⚠️</span> Common Pitfalls & How to Fix Them</h2>
      <div className="grid-2">
        {items.map((item, i) => (
          <div className="card" key={i}><h3>{item.title}</h3><p>{item.text}</p></div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>Exploding Gradients — In Detail</h3>
        <div className="math-block">
          ∂L/∂W₁ = ∂L/∂Wₙ × Wₙ × Wₙ₋₁ × ... × W₂<br />
          If ‖Wᵢ‖ {'>'} 1 → product explodes exponentially
        </div>
        <p>Signs: loss spikes, NaN in weights, gradient norm {'>'} 1000.</p>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>The Sharp vs Flat Minima Debate</h3>
        <p>Sharp minima generalize poorly — small perturbations cause large loss increases. Flat minima are robust. This is why:</p>
        <ul>
          <li><strong>Smaller batch sizes</strong> → more noise → flatter minima → better generalization</li>
          <li><strong>Large batch sizes</strong> → less noise → sharp minima → overfit</li>
          <li><strong>SAM optimizer</strong> (2020) explicitly seeks flat minima by optimizing worst-case loss</li>
        </ul>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TIPS
   ═══════════════════════════════════════════════════════════════ */
export function Tips() {
  const tips = [
    'Start with AdamW (lr=3e-4). It works for almost everything.',
    'Warmup the first 5–10% of training steps (especially Transformers).',
    'Gradient clipping with max_norm=1.0 prevents explosions.',
    'Monitor gradient norms — they reveal training health. Spikes = instability.',
    'Run an LR range test: slowly increase lr, plot loss vs lr. Pick steepest descent.',
    'Smaller batch sizes = better generalization (implicit regularization).',
    'Weight decay λ=0.01–0.1 with AdamW. Always use it.',
  ];
  return (
    <ScrollReveal id="tips">
      <h2><span className="sec-icon">💡</span> Tips From the Trenches</h2>
      <div className="card">
        {tips.map((tip, i) => (
          <div className="step-row" key={i}>
            <div className="step-num">{i + 1}</div>
            <div className="step-content"><p>{tip}</p></div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HISTORY
   ═══════════════════════════════════════════════════════════════ */
export function History() {
  const events = [
    { year: '1847', title: 'Cauchy — Method of Steepest Descent', text: 'The original gradient descent algorithm.' },
    { year: '1951', title: 'Robbins & Monro — SGD', text: 'Theoretical foundation for stochastic approximation.' },
    { year: '1964', title: 'Polyak — Heavy Ball (Momentum)', text: 'Accelerate convergence with velocity.' },
    { year: '1983', title: 'Nesterov — Accelerated Gradient', text: '"Look-ahead" momentum with optimal rates.' },
    { year: '1986', title: 'Rumelhart, Hinton, Williams — Backprop', text: 'Efficient gradient computation for neural nets.' },
    { year: '2011', title: 'Duchi et al. — AdaGrad', text: 'Per-parameter adaptive learning rates.' },
    { year: '2012', title: 'Hinton — RMSProp', text: 'Fixed AdaGrad — proposed in a Coursera lecture.' },
    { year: '2014', title: 'Kingma & Ba — Adam', text: 'Momentum + adaptive LR + bias correction.' },
    { year: '2019', title: 'Loshchilov & Hutter — AdamW + LAMB', text: 'Decoupled weight decay. Batch 64K+ scaling.' },
    { year: '2023+', title: 'Lion, Sophia, Muon', text: 'Sign-based, 2nd-order, matrix-free optimizers.' },
  ];
  return (
    <ScrollReveal id="history">
      <h2><span className="sec-icon">📜</span> The Evolution of Optimization</h2>
      <div className="card">
        <div className="timeline">
          {events.map((e, i) => (
            <div className="timeline-item" key={i}>
              <div className="year">{e.year}</div>
              <h4>{e.title}</h4>
              <p>{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPARISON TABLE
   ═══════════════════════════════════════════════════════════════ */
export function ComparisonTable() {
  const rows = [
    ['Batch GD', '1847', '—', '—', 'Low', 'Small convex problems'],
    ['SGD', '1951', '—', '—', 'Low', 'Online learning'],
    ['SGD + Momentum', '1964', '—', '✓', '1×', 'CNNs (ResNet, etc.)'],
    ['AdaGrad', '2011', '✓', '—', '1×', 'Sparse / NLP'],
    ['RMSProp', '2012', '✓', '—', '1×', 'RNNs'],
    ['Adam', '2014', '✓', '✓', '2×', 'Default / General'],
    ['AdamW', '2019', '✓', '✓', '2×', 'Transformers (GPT, BERT)'],
    ['Lion', '2023', 'Sign', '✓', '1×', 'Memory-constrained'],
    ['Sophia', '2023', '2nd-order', '✓', '2×', 'LLM pre-training speed'],
  ];
  return (
    <ScrollReveal id="comparison">
      <h2><span className="sec-icon">📋</span> Optimizer Comparison Table</h2>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="comp-table">
          <thead>
            <tr>
              <th>Optimizer</th><th>Year</th><th>Adaptive LR</th><th>Momentum</th><th>Memory</th><th>Best For</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{j === 0 ? <strong>{c}</strong> : c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollReveal>
  );
}
