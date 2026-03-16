# 📊 KDD Process — Interactive Data Mining Guide

> An interactive, step-by-step visual explanation of the **Knowledge Discovery in Databases (KDD)** process, built as a single self-contained HTML file.

---

## 📌 Overview

This project is an educational, interactive web page that explains the **KDD (Knowledge Discovery in Databases)** process — the foundational framework for Data Mining in Data Science.

Each of the 6 stages is explained with:
- Clear definitions
- Real-world examples using a **Supermarket transaction dataset**
- Interactive data tables, charts, code snippets, and visualizations
- A clickable pipeline navigator to jump between steps

---

## 🗂️ Project Structure

```
kdd_process.html       # Single self-contained HTML file (no dependencies)
README.md              # This file
```

---

## 🚀 How to Use

1. Download `kdd_process.html`
2. Open it in any modern web browser (Chrome, Firefox, Edge, Safari)
3. No installation, no server, no internet required — it runs fully offline

> **Tip:** Click any bubble in the pipeline at the top to jump directly to that step.

---

## 🔄 The 6 KDD Steps Covered

| # | Step | Description | Example |
|---|------|-------------|---------|
| 1 | 🗄️ **Data Selection** | Choose relevant data from your sources | POS transaction logs (2.4M rows) |
| 2 | 🧹 **Preprocessing** | Clean missing values, duplicates, outliers | Fix NULLs, remove duplicate rows |
| 3 | ⚙️ **Transformation** | Reshape data into algorithm-ready format | Item-basket binary matrix |
| 4 | ⛏️ **Data Mining** | Apply algorithms to discover patterns | Apriori rules, Decision Tree, K-Means |
| 5 | 💡 **Interpretation** | Evaluate and filter useful patterns | Beer→Chips lift=3.2 ✓ |
| 6 | 📢 **Knowledge Use** | Apply knowledge to real decisions | Product placement, targeted marketing |

---

## ✨ Features

- **Interactive pipeline** — clickable step navigator with progress bar
- **Live K-Means scatter plot** — renders dynamically on Step 4
- **Before/After data tables** — shows raw vs. cleaned data
- **Association rules display** — with confidence & lift metrics
- **Decision tree visualization** — customer classification logic
- **Bar chart clusters** — customer segment breakdown
- **Fully responsive** — works on desktop and mobile
- **Zero dependencies** — no frameworks, no npm, no build tools

---

## 🛠️ Built With

- **HTML5** — structure and content
- **CSS3** — custom variables, animations, grid/flexbox layout
- **Vanilla JavaScript** — interactivity and dynamic rendering
- **Google Fonts** — Syne, DM Mono, Lora typefaces
- **Inline SVG** — all icons drawn as vector graphics

---

## 🎓 Academic Context

This project was created as part of the **MSDE (Master of Science in Data Science and Engineering)** program — Cohort 4.

**Topic:** Data Mining — KDD Process  
**Dataset used in examples:** Supermarket Point-of-Sale (POS) transactions  
**Algorithms demonstrated:** Apriori, CART Decision Tree, K-Means Clustering

---

## 📄 License

© 2025 **Sim Vattanac** · All Rights Reserved

This project is for educational purposes. Unauthorized commercial use or redistribution without permission is prohibited.

---

## 📬 Contact

**Sim Vattanac**  
✉️ [vattanacsim99@gmail.com](mailto:vattanacsim99@gmail.com)
