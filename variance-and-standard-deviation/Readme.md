# 📊 Variance & Standard Deviation — Data Science Guide

A step-by-step visual guide to understanding **Variance** and **Standard Deviation** in the context of Data Science. Built as a standalone, interactive HTML file with no dependencies.

---

## 📁 File

| File | Description |
|------|-------------|
| `variance_std_explained.html` | Main interactive guide — open in any browser |

---

## 🚀 How to Use

1. Download `variance_std_explained.html`
2. Open it in any modern web browser (Chrome, Firefox, Edge, Safari)
3. No installation or internet connection required *(fonts load from Google Fonts if online)*

---

## 📚 Contents

The guide walks through 6 concepts step by step:

| Section | Topic |
|---------|-------|
| 01 | **Why Spread Matters** — Intuition with the archer analogy |
| 02 | **Variance** — Full 5-step calculation with a real dataset |
| 03 | **Standard Deviation** — Square root of variance, back to original units |
| 04 | **Population vs Sample** — N vs N−1, Bessel's correction explained |
| 05 | **Live Calculator** — Enter your own numbers, instant results |
| 06 | **Real-World Applications** — Finance, ML, medical research, A/B testing |

---

## 🔢 Formulas Covered

**Population Variance**
```
σ² = Σ (xᵢ − μ)² / N
```

**Sample Variance**
```
s² = Σ (xᵢ − x̄)² / (N − 1)
```

**Standard Deviation**
```
σ = √(σ²)
```

---

## 🐍 Python Equivalent

```python
import numpy as np

data = [72, 75, 80, 85, 88, 90]

mean        = np.mean(data)           # 81.67
variance    = np.var(data)            # 43.56  — population
std_dev     = np.std(data)            # 6.60   — population

s_variance  = np.var(data, ddof=1)    # 52.27  — sample
s_std_dev   = np.std(data, ddof=1)    # 7.23   — sample
```

---

## 🛠️ Built With

- Pure HTML, CSS, JavaScript — no frameworks
- [Google Fonts](https://fonts.google.com/) — DM Serif Display, JetBrains Mono, Outfit
- Dark theme UI with animated bar chart and live calculator

---

## 👤 Author

**Sim Vattanac**  
📧 [vattanacsim99@gmail.com](mailto:vattanacsim99@gmail.com)

---

© 2025 Sim Vattanac. All rights reserved.