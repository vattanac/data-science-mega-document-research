# 🌸 Why the Iris Dataset? — Interactive Data Science Guide

> A beautifully designed, self-contained HTML explainer for beginners in Data Science and Machine Learning — covering the Iris dataset from fundamentals to a working classifier, with dark/light mode and copy-ready code blocks.

---

## 📌 Overview

This project is a **single-file interactive HTML guide** that explains why the Iris dataset is the go-to starting point in Data Science. It is designed for students in introductory ML/DS courses (such as MSDE) who want a clear, visual, and step-by-step walkthrough — from understanding the data to running their first classifier in Python.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌙 Dark / ☀️ Light Mode | Smooth animated toggle with `localStorage` persistence and OS preference detection |
| 📋 Copy Code Buttons | One-click copy on all 3 Python code blocks with visual feedback |
| 📊 Step-by-Step Guide | 7 structured sections from data overview to model evaluation |
| 🎨 Modern UI Design | Warm editorial aesthetic using Playfair Display + DM Mono + DM Sans |
| 📱 Responsive Layout | Works on desktop, tablet, and mobile screens |
| ⚡ Zero Dependencies | Pure HTML + CSS + vanilla JS — no frameworks, no installs |

---

## 🗂️ Content Structure

```
Section 1 — What is the Iris Dataset?
  └── Feature table: sepal length/width, petal length/width, species

Section 2 — The Three Species
  └── Setosa 🌸 · Versicolor 🌿 · Virginica 💜 (stats + difficulty)

Section 3 — 7 Reasons Every Beginner Uses Iris
  └── Small & clean · Balanced · Visualizable · Built-in · Benchmark · etc.

Section 4 — Hands-On Python Example (3 code blocks)
  ├── Step A: Load data with pandas
  ├── Step B: Train/test split (80/20)
  └── Step C: Train KNN classifier → 100% accuracy

Section 5 — Understanding the Results
  └── Accuracy · Precision · Recall · F1-Score explained simply

Section 6 — The ML Pipeline
  └── Load → Explore → Split → Train → Predict → Evaluate

Section 7 — Comparison with Other Datasets
  └── Iris vs Titanic vs MNIST vs Boston Housing vs Diabetes
```

---

## 🚀 Getting Started

No installation required. Just open the file in any modern browser.

```bash
# Clone or download the file
open iris_dataset_explained.html
```

Or simply drag-and-drop `iris_dataset_explained.html` into your browser.

---

## 🐍 Python Code Inside

The guide contains three ready-to-run Python snippets using **scikit-learn**:

### Step A — Load Data
```python
from sklearn.datasets import load_iris
import pandas as pd

iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df['species'] = iris.target
print(df.head())
```

### Step B — Train/Test Split
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)
```

### Step C — Train KNN & Evaluate
```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2%}")
```

**Result:** `Accuracy: 100.00%` on the test set.

---

## 🎨 Design System

| Token | Light Mode | Dark Mode |
|---|---|---|
| Background | `#f7f3ee` | `#0f0e0c` |
| Card | `#ffffff` | `#1c1a17` |
| Ink (text) | `#1a1208` | `#f0ebe4` |
| Accent Gold | `#d4960a` | `#e8aa28` |
| Setosa Red | `#c94f2c` | `#e06a48` |
| Versicolor Green | `#2e7d5a` | `#3da373` |
| Virginica Blue | `#4a5fa8` | `#6b82c9` |

**Fonts:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) · [DM Mono](https://fonts.google.com/specimen/DM+Mono) · [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts

---

## 🧠 Concepts Covered

- What is a **dataset** and a **feature**
- What is **classification** (supervised learning)
- **Train/test split** — why we hold out data
- **K-Nearest Neighbors (KNN)** algorithm
- **Accuracy, Precision, Recall, F1-Score** — evaluation metrics
- The universal **ML pipeline** applicable to any project
- **Class imbalance** — why balanced data matters for beginners

---

## 📁 File Structure

```
iris_dataset_explained.html   ← Everything in one self-contained file
README.md                     ← This file
```

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties (CSS variables), grid, flexbox, animations
- **Vanilla JavaScript** — theme toggle, clipboard API, localStorage
- **Google Fonts** — Playfair Display, DM Mono, DM Sans

---

## 📋 Requirements

To run the Python code examples shown in the guide, you'll need:

```bash
pip install scikit-learn pandas
```

Python 3.7+ recommended.

---

## 📄 License & Copyright

© 2025 **Sim Vattanac** — All rights reserved.

📧 Contact: [vattanacsim99@gmail.com](mailto:vattanacsim99@gmail.com)

> The Iris dataset was originally introduced by Ronald A. Fisher in his 1936 paper *"The use of multiple measurements in taxonomic problems"*, Annals of Eugenics.

---

*Made for MSDE Cohort 4 learners 🎓*
