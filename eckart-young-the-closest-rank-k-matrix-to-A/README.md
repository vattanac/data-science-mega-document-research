# 📐 PCA & SVD — Interactive Study Guide

> A visual, step-by-step guide to Principal Component Analysis and Singular Value Decomposition, based on MIT OpenCourseWare 18.065 by Prof. Gilbert Strang.

---

## 📁 Project Files

| File | Type | Description |
|------|------|-------------|
| `PCA_SVD_Guide.html` | HTML | Interactive web guide with sidebar, examples, and live demo |
| `MIT_PCA_Lecture_Notes.docx` | Word | Formatted lecture notes document |
| `README.md` | Markdown | This file |

---

## 🌐 HTML Guide — `PCA_SVD_Guide.html`

A fully self-contained single-file web application. Open it directly in any modern browser — no server or dependencies needed.

### Features

- **Fixed left sidebar** with section navigation and active-link highlighting
- **Scroll progress bar** at the top of the page
- **8 sections** covering the full PCA pipeline step by step
- **Worked numerical examples** with real data tables (Height & Age dataset)
- **Syntax-highlighted Python code blocks** with one-click copy buttons
- **Interactive variance chart** — drag a slider to see how many components explain X% of variance (rendered on HTML5 Canvas)
- **SVG diagram** comparing PCA vs Least Squares error directions
- **Dark theme** with purple/teal accent palette
- **Responsive layout** (collapses sidebar on mobile)
- **Scroll-to-top button**

### Sections

| # | Section | Content |
|---|---------|---------|
| 01 | What is PCA? | Motivation, key concepts, Prof. Strang's quote |
| 02 | SVD Foundation | Formula breakdown, rank-1 pieces, Python code |
| 03 | Eckart-Young Theorem | Best rank-k approximation proof and counter-example |
| 04 | Matrix Norms | L2, Frobenius, Nuclear norms — table with intuitions |
| 05 | Step 1 — Center Data | Worked example: subtract row mean, verify sums to 0 |
| 06 | Step 2 — Covariance Matrix | S = ÃÃᵀ/(n−1), numerical computation |
| 07 | Step 3 — Apply SVD | Find principal components, full Python pipeline |
| 08 | PCA vs Regression | Side-by-side comparison, SVG diagram |
| 09 | Real Applications | Netflix, MRI, Amazon, Eigenfaces, Genomics |

---

## 📄 Word Document — `MIT_PCA_Lecture_Notes.docx`

A polished Word document with:

- Styled headings (navy/blue color scheme)
- Theorem callout box (Eckart-Young)
- Comparison tables for norms and PCA vs Least Squares
- Header and footer with page numbers
- Source attribution to MIT OpenCourseWare

---

## 🧮 Key Concepts Covered

### Singular Value Decomposition (SVD)

Any matrix A decomposes as:

```
A = σ₁u₁v₁ᵀ + σ₂u₂v₂ᵀ + ··· + σᵣuᵣvᵣᵀ
```

where σ₁ ≥ σ₂ ≥ ··· ≥ 0 are singular values, u's and v's are orthonormal vectors.

### Eckart-Young Theorem

For any rank-k matrix B:

```
‖A − Aₖ‖ ≤ ‖A − B‖
```

Aₖ (first k SVD pieces) is the best rank-k approximation under the L2, Frobenius, and Nuclear norms.

### PCA Pipeline

```
1. Center:   Ã = A − mean(rows)
2. SVD:      Ã = U Σ Vᵀ
3. Choose k: keep top k where Σσᵢ²/Σσⱼ² ≥ threshold
4. Project:  Z = Vₖᵀ Ã
```

### Matrix Norms

| Norm | Formula | Key Use |
|------|---------|---------|
| L2 (Spectral) | `‖A‖₂ = σ₁` | Largest singular value |
| Frobenius | `‖A‖_F = √(Σσᵢ²)` | Variance explained in PCA |
| Nuclear | `‖A‖_* = Σσᵢ` | Matrix completion (Netflix, MRI) |

---

## 🐍 Quick Start (Python)

```python
import numpy as np

# Data matrix: rows = features, columns = samples
A = np.array([
    [160, 170, 175, 180, 165],  # heights (cm)
    [ 20,  25,  30,  35,  22],  # ages (years)
])

# Step 1: Center
A_c = A - A.mean(axis=1, keepdims=True)

# Step 2: SVD
U, sigma, Vt = np.linalg.svd(A_c, full_matrices=False)

# Step 3: Explained variance
explained = sigma**2 / np.sum(sigma**2)
print("Explained variance ratio:", explained.round(3))
# [0.924  0.076] → PC1 explains 92.4%

# Step 4: Project onto PC1
Z = Vt[:1] @ A_c  # shape: (1, n_samples)
```

---

## 📚 Source

Based on **MIT OpenCourseWare 18.065** — *Matrix Methods in Data Analysis, Signal Processing, and Machine Learning*  
Lecture by **Professor Gilbert Strang**, Massachusetts Institute of Technology  
Licensed under [Creative Commons](https://ocw.mit.edu) · Visit [ocw.mit.edu](https://ocw.mit.edu)

---

## 👤 Author

**© 2026 Sim Vattanac** · All rights reserved  
📧 [vattanacsim99@gmail.com](mailto:vattanacsim99@gmail.com)
