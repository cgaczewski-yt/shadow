---
domain: Paper & Pencil Engineering Math
notation: LaTeX ($...$ inline, $$...$$ display)
---

# Paper & Pencil Problem Sets

## Problem 1: Linear Algebra & Matrix Diagonalization

### Category
Linear Algebra / Dynamic Systems

### Concept
Characteristic Polynomial, Eigenvalues, and Matrix Powers

### Statement
Given the 2-by-2 state transition matrix $A$:
$$A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$$

Compute $A^n$ in closed form for any integer $n \ge 1$ using paper-and-pencil matrix diagonalization ($A = P D P^{-1}$).

### Paper Derivation & Solution

#### Step 1: Find Eigenvalues
Set $\det(A - \lambda I) = 0$:
$$\det \begin{pmatrix} 4 - \lambda & 1 \\ 2 & 3 - \lambda \end{pmatrix} = (4 - \lambda)(3 - \lambda) - 2 = 0$$
$$\lambda^2 - 7\lambda + 12 - 2 = \lambda^2 - 7\lambda + 10 = 0$$
$$.(\lambda - 5)(\lambda - 2) = 0 \implies \lambda_1 = 5, \quad \lambda_2 = 2$$

#### Step 2: Calculate Eigenvectors
For $\lambda_1 = 5$:
$$(A - 5I)v_1 = \begin{pmatrix} -1 & 1 \\ 2 & -2 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} \implies -x + y = 0 \implies v_1 = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$$

For $\lambda_2 = 2$:
$$(A - 2I)v_2 = \begin{pmatrix} 2 & 1 \\ 2 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} \implies 2x + y = 0 \implies v_2 = \begin{pmatrix} 1 \\ -2 \end{pmatrix}$$

#### Step 3: Form Eigenvector Matrix $P$ and Invert
$$P = \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix}, \quad \det(P) = -2 - 1 = -3$$
$$P^{-1} = -\frac{1}{3} \begin{pmatrix} -2 & -1 \\ -1 & 1 \end{pmatrix} = \frac{1}{3} \begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}$$

#### Step 4: Compute Closed-Form Matrix Power
$$A^n = P D^n P^{-1} = \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix} \begin{pmatrix} 5^n & 0 \\ 0 & 2^n \end{pmatrix} \left( \frac{1}{3} \begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix} \right)$$
$$A^n = \frac{1}{3} \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix} \begin{pmatrix} 2 \cdot 5^n & 5^n \\ 2^n & -2^n \end{pmatrix}$$
$$A^n = \frac{1}{3} \begin{pmatrix} 2 \cdot 5^n + 2^n & 5^n - 2^n \\ 2 \cdot 5^n - 2 \cdot 2^n & 5^n + 2 \cdot 2^n \end{pmatrix}$$

---

## Problem 2: Signal Processing & Z-Transform Stability

### Category
Digital Signal Processing (DSP) / Linear Systems

### Concept
Z-Transform Pole Analysis & Region of Convergence (ROC)

### Statement
A discrete-time linear time-invariant (LTI) system has impulse response $h[n] = (0.5)^n u[n] + (-2)^n u[-n-1]$.
Determine the Z-transform $H(z)$, locate its poles/zeros, and state whether the system is BIBO stable.

### Paper Derivation & Solution

#### Step 1: Transform $h_1[n] = (0.5)^n u[n]$
$$H_1(z) = \sum_{n=0}^{\infty} (0.5 z^{-1})^n = \frac{1}{1 - 0.5 z^{-1}}, \quad \text{ROC}_1: |z| > 0.5$$

#### Step 2: Transform $h_2[n] = (-2)^n u[-n-1]$
Using standard pair $\mathcal{Z}\{-a^n u[-n-1]\} = \frac{1}{1 - a z^{-1}}$ with $|z| < |a|$:
$$H_2(z) = -\frac{1}{1 - (-2)z^{-1}} = -\frac{1}{1 + 2 z^{-1}}, \quad \text{ROC}_2: |z| < 2$$

#### Step 3: Combine Expressions and Intersect ROC
$$H(z) = \frac{1}{1 - 0.5 z^{-1}} - \frac{1}{1 + 2 z^{-1}} = \frac{(1 + 2 z^{-1}) - (1 - 0.5 z^{-1})}{(1 - 0.5 z^{-1})(1 + 2 z^{-1})} = \frac{2.5 z^{-1}}{(1 - 0.5 z^{-1})(1 + 2 z^{-1})}$$

Over-all Region of Convergence is $\text{ROC} = \text{ROC}_1 \cap \text{ROC}_2$:
$$\text{ROC}: 0.5 < |z| < 2$$

#### Step 4: System Stability Verification
A system is Bounded-Input Bounded-Output (BIBO) stable if and only if the ROC contains the unit circle $|z| = 1$.
Since $0.5 < 1 < 2$, the unit circle lies entirely inside the ROC.
**Conclusion:** The system is **BIBO Stable**.

---

## Problem 3: Information Theory & Huffman Coding

### Category
Information Theory

### Concept
Entropy, Variable-Length Coding, and Optimal Prefix Codes

### Statement
An embedded serial bus transmits symbols from an alphabet $\mathcal{S} = \{A, B, C, D\}$ with probabilities $P(A) = 0.4$, $P(B) = 0.35$, $P(C) = 0.15$, $P(D) = 0.10$.
1. Compute the Shannon Entropy $H(S)$.
2. Construct a binary Huffman code on paper.
3. Calculate the average code length $L$ and coding efficiency $\eta$.

### Paper Derivation & Solution

#### Step 1: Compute Shannon Entropy $H(S)$
$$H(S) = - \sum_{i} P(s_i) \log_2 P(s_i)$$
$$H(S) = -(0.4 \log_2 0.4 + 0.35 \log_2 0.35 + 0.15 \log_2 0.15 + 0.10 \log_2 0.10)$$
$$H(S) \approx -(0.4(-1.322) + 0.35(-1.515) + 0.15(-2.737) + 0.10(-3.322))$$
$$H(S) \approx -(-0.5288 - 0.5303 - 0.4106 - 0.3322) = 1.8019 \text{ bits/symbol}$$

#### Step 2: Build Huffman Tree
1. Combine smallest probabilities: $C (0.15) + D (0.10) \rightarrow [CD] (0.25)$.
2. Next smallest: $[CD] (0.25) + B (0.35) \rightarrow [CDB] (0.60)$.
3. Final combination: $[CDB] (0.60) + A (0.40) \rightarrow \text{Root } (1.00)$.

#### Bit Assignments
- $A \rightarrow 0$ (Length = 1)
- $B \rightarrow 10$ (Length = 2)
- $C \rightarrow 110$ (Length = 3)
- $D \rightarrow 111$ (Length = 3)

#### Step 3: Average Code Length & Efficiency
$$L = 0.4(1) + 0.35(2) + 0.15(3) + 0.10(3) = 0.4 + 0.7 + 0.45 + 0.30 = 1.85 \text{ bits/symbol}$$
$$\text{Efficiency } \eta = \frac{H(S)}{L} = \frac{1.8019}{1.85} \approx 97.4\%$$
