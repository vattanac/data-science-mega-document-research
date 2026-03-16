# 📊 Expected Value vs Mean — Data Science Explainer

A standalone, interactive HTML explainer that teaches the difference between **Expected Value** and **Mean (Average)** in the context of Data Science — with live simulations, real-world examples, and visual comparisons.

---

## 📁 File

| File | Description |
|------|-------------|
| `expected_value_vs_mean.html` | Single self-contained HTML page. No dependencies, no build step — open directly in any browser. |

---

## ✨ Features

- **6 structured sections** covering concept, examples, and applications
- **Dice simulation** — roll 1 to 1,000 times and watch the mean converge to the Expected Value (Law of Large Numbers)
- **Insurance premium calculator** — interactive sliders to adjust risk probabilities and see how Expected Value changes in real time
- **Side-by-side comparison table** of when to use Mean vs Expected Value in data science
- **Real-world use cases** — ML, Reinforcement Learning, A/B Testing, Credit Risk, Recommendation Systems
- **Dark theme UI** — clean, professional design with no external dependencies

---

## 🧠 Concepts Covered

### Mean (x̄)
```
x̄ = (x₁ + x₂ + ... + xₙ) / n
```
- Summarizes **observed / collected** data
- All values treated equally
- Describes the **past**
- Used in: EDA, statistics, feature engineering

### Expected Value E[X]
```
E[X] = Σ xᵢ · P(xᵢ)
```
- Predicts the average outcome using **probabilities**
- Each value weighted by its probability
- Predicts the **future**
- Used in: ML loss functions, risk modeling, reinforcement learning

### Law of Large Numbers
> As sample size → ∞, the sample **mean** converges to the **Expected Value**.

---

## 📌 Examples Included

1. **Dice Example** — Compute E[X] = 3.5 step by step, then simulate rolling to verify with the mean
2. **Insurance Example** — Calculate expected payout per customer to determine minimum premium price
3. **Interactive Calculator** — Adjust accident probabilities and observe Expected Value updating live

---

## 🚀 How to Use

1. Download `expected_value_vs_mean.html`
2. Open it in any modern browser (Chrome, Firefox, Edge, Safari)
3. No internet connection required — fully self-contained

---

## 🛠 Built With

- Pure HTML5, CSS3, and Vanilla JavaScript
- No frameworks, no libraries, no build tools
- Google Fonts: DM Serif Display + DM Sans + JetBrains Mono

---

## 📬 Contact

**© 2025 Sim Vattanac**  
Email: [vattanacsim99@gmail.com](mailto:vattanacsim99@gmail.com)