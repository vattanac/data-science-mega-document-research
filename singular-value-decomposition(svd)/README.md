# Singular Value Decomposition (SVD) — Study Guide

> A complete step-by-step learning resource on SVD, based on MIT 18.065 (Prof. Gilbert Strang).  
> Includes a polished Word document and an interactive HTML explainer.

---

## 📁 Files

| File | Description |
|------|-------------|
| `SVD_Lecture_MIT18065.docx` | Structured Word document — 10 sections, summary table, math notation, header/footer |
| `SVD_Explainer.html` | Interactive HTML guide — dark/light mode, live calculator, step-by-step proofs |

---

## 📖 What's Covered

1. **Why SVD?** — limitations of eigenvalues for rectangular matrices
2. **Core Formula** — A = UΣVᵀ, the three components explained
3. **Derivation** — AᵀA trick, eigenvectors, orthogonality proof
4. **Worked Example** — full hand-computed SVD of a 2×2 matrix
5. **Geometry** — rotation → stretch → rotation interpretation
6. **Full vs Compact SVD** — Eckart–Young best approximation theorem
7. **Polar Decomposition** — A = S·Q (symmetric × orthogonal)
8. **PCA Connection** — how SVD powers dimensionality reduction
9. **Practical Computation** — why not to form AᵀA, algorithm complexity
10. **Interactive Demo** — live 2×2 SVD calculator (HTML only)

---

## 🚀 Usage

### HTML Guide
Open `SVD_Explainer.html` directly in any modern browser — no server or dependencies needed.

```bash
# macOS
open SVD_Explainer.html

# Windows
start SVD_Explainer.html

# Linux
xdg-open SVD_Explainer.html
```

**Features:**
- Left sidebar navigation with active section tracking
- Dark / Light mode toggle (preference saved in localStorage)
- Scroll progress bar
- Copy buttons on all code blocks
- Live SVD calculator — type matrix entries, see σ₁, σ₂, rank, condition number instantly
- Geometry canvas showing unit circle → ellipse transformation
- Fully responsive (mobile-friendly)

### Word Document
Open `SVD_Lecture_MIT18065.docx` in Microsoft Word, LibreOffice Writer, or Google Docs.

---

## 🔢 Key Formulas

```
A = U Σ Vᵀ          (SVD factorization)

Avᵢ = σᵢ uᵢ         (core relationship)

AᵀA = V Λ Vᵀ        (find V and σ via eigendecomposition)

uᵢ = Avᵢ / σᵢ       (compute U from V)

Aₖ = Σᵢ₌₁ᵏ σᵢ uᵢ vᵢᵀ  (best rank-k approximation)
```

---

## 🐍 Quick Python Example

```python
import numpy as np

A = np.array([[3, 0],
              [4, 5]], dtype=float)

U, sigma, Vt = np.linalg.svd(A, full_matrices=False)

print("Singular values:", sigma)   # [6.708  2.236]
print("U =\n", U)
print("Vt =\n", Vt)

# Reconstruct
A_back = (U * sigma) @ Vt
print("Reconstructed:\n", A_back)  # ≈ [[3, 0], [4, 5]]
```

---

## 📚 Source

Based on the MIT 18.065 lecture transcript by **Prof. Gilbert Strang**.  
Available free at [MIT OpenCourseWare](https://ocw.mit.edu) under a Creative Commons license.

---

## 👤 Author

**Sim Vattanac**  
✉️ [vattanacsim99@gmail.com](mailto:vattanacsim99@gmail.com)  
© 2026 Sim Vattanac — All rights reserved.
