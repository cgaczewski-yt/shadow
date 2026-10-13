---
domain: Paper & Pencil Engineering Math
notation: LaTeX ($...$ inline, $$...$$ display)
formatter: Compatible with cleanMathText (Unicode Converter)
---

# Paper & Pencil Problem Sets: EE & Embedded Software Engineering (300 Problems)

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
- $$\det \begin{pmatrix} 4 - \lambda & 1 \\ 2 & 3 - \lambda \end{pmatrix} = (4 - \lambda)(3 - \lambda) - 2 = 0$$
- $$\lambda^2 - 7\lambda + 12 - 2 = \lambda^2 - 7\lambda + 10 = 0$$
- $$(\lambda - 5)(\lambda - 2) = 0 \implies \lambda_1 = 5, \quad \lambda_2 = 2$$

#### Step 2: Calculate Eigenvectors
For $\lambda_1 = 5$:
$$(A - 5I)v_1 = \begin{pmatrix} -1 & 1 \\ 2 & -2 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} \implies -x + y = 0 \implies v_1 = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$$

For $\lambda_2 = 2$:
$$(A - 2I)v_2 = \begin{pmatrix} 2 & 1 \\ 2 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} \implies 2x + y = 0 \implies v_2 = \begin{pmatrix} 1 \\ -2 \end{pmatrix}$$

#### Step 3: Form Eigenvector Matrix $P$ and Invert
- $$P = \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix}, \quad \det(P) = -2 - 1 = -3$$
$$P^{-1} = -\frac{1}{3} \begin{pmatrix} -2 & -1 \\ -1 & 1 \end{pmatrix} = \frac{1}{3} \begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix}$$

#### Step 4: Compute Closed-Form Matrix Power
$$A^n = P D^n P^{-1} = \begin{pmatrix} 1 & 1 \\ 1 & -2 \end{pmatrix} \begin{pmatrix} 5^n & 0 \\ 0 & 2^n \end{pmatrix} \left( \frac{1}{3} \begin{pmatrix} 2 & 1 \\ 1 & -1 \end{pmatrix} \right)$$
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
- $$H_1(z) = \sum_{n=0}^{\infty} (0.5 z^{-1})^n = \frac{1}{1 - 0.5 z^{-1}}, \quad \text{ROC}_1: |z| > 0.5$$

#### Step 2: Transform $h_2[n] = (-2)^n u[-n-1]$
- $$H_2(z) = -\frac{1}{1 - (-2)z^{-1}} = -\frac{1}{1 + 2 z^{-1}}, \quad \text{ROC}_2: |z| < 2$$

#### Step 3: Combine Expressions and Intersect ROC
- $$H(z) = \frac{1}{1 - 0.5 z^{-1}} - \frac{1}{1 + 2 z^{-1}} = \frac{2.5 z^{-1}{(1 - 0.5 z^{-1})(1 + 2 z^{-1})}$$
$$\text{ROC}: 0.5 < |z| < 2$$

#### Step 4: System Stability Verification
Since the ROC contains the unit circle $|z| = 1$ ($0.5 < 1 < 2$), the system is **BIBO Stable**.

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
$$H(S) = -(0.4 \log_2 0.4 + 0.35 \log_2 0.35 + 0.15 \log_2 0.15 + 0.10 \log_2 0.10) \approx 1.8019 \text{ bits/symbol}$$

#### Step 2: Build Huffman Tree & Bit Assignments
- $A \to 0$ (Length = 1)
- $B \to 10$ (Length = 2)
- $C \to 110$ (Length = 3)
- $D \to 111$ (Length = 3)

#### Step 3: Average Code Length & Efficiency
$$L = 0.4(1) + 0.35(2) + 0.15(3) + 0.10(3) = 1.85 \text{ bits/symbol}$$
$$\text{Efficiency } \eta = \frac{H(S)}{L} = \frac{1.8019}{1.85} \approx 97.4\%$$

---

## Problem 4: Fixed-Point Arithmetic & Quantization Noise

### Category
Embedded Software / Numerical Representation

### Concept
Q-format Quantization Error & Signal-to-Quantization-Noise Ratio (SQNR)

### Statement
A 16-bit signed fixed-point ADC uses a $Q1.15$ format (1 sign bit, 15 fractional bits).
1. Determine the resolution (least significant bit weight, $\Delta$).
2. Compute the theoretical maximum SQNR for a full-scale sinusoidal input.

### Paper Derivation & Solution

#### Step 1: Calculate LSB Weight ($\Delta$)
$$\Delta = 2^{-15} = \frac{1}{32768} \approx 3.0517 \times 10^{-5}$$

#### Step 2: Compute Theoretical SQNR
$$\text{SQNR (dB)} = 10 \log_{10}\left(\frac{P_s}{\sigma_q^2}\right) \approx 6.02N + 1.76 \text{ dB}$$
For $N = 16$ bits: $\text{SQNR} \approx 6.02(16) + 1.76 = 98.08 \text{ dB}$.

---

## Problem 5: Discrete Control Systems & Difference Equations

### Category
Control Systems / Digital Filtering

### Concept
Transfer Function to Difference Equation Implementation

### Statement
A digital filter is defined by the transfer function:
$$H(z) = \frac{Y(z)}{X(z)} = \frac{0.2 + 0.3 z^{-1}}{1 - 0.5 z^{-1}}$$
Derive the recursive difference equation executable in real-time embedded firmware.

### Paper Derivation & Solution

#### Step 1: Cross-Multiply Transfer Function
$$Y(z)(1 - 0.5 z^{-1}) = X(z)(0.2 + 0.3 z^{-1})$$
$$Y(z) - 0.5 z^{-1}Y(z) = 0.2 X(z) + 0.3 z^{-1}X(z)$$

#### Step 2: Apply Inverse Z-Transform & Rearrange
$$y[n] = 0.5 y[n-1] + 0.2 x[n] + 0.3 x[n-1]$$

---

## Problem 6: Circuit Analysis & RC Transient Response

### Category
Analog Hardware / Mixed-Signal Design

### Concept
RC Time Constant and Step Response Settling Time

### Statement
An MCU general-purpose input drives an RC low-pass filter with $R = 10 \text{ k}\Omega$ and $C = 100 \text{ nF}$. The input steps from $0\text{V}$ to $3.3\text{V}$.
Calculate the exact time $t$ required for the capacitor voltage $v_c(t)$ to reach $3.0\text{V}$.

### Paper Derivation & Solution

#### Step 1: Identify Time Constant $\tau$
$$\tau = R \cdot C = (10 \times 10^3) \cdot (100 \times 10^{-9}) = 1 \text{ ms}$$

#### Step 2: Solve for $t$
$$v_c(t) = V_{dd}(1 - e^{-t/\tau}) \implies 3.0 = 3.3(1 - e^{-t/0.001})$$
$$t = \text{ms} \cdot \ln(11) \approx 2.40 \text{ ms}$$

---

## Problem 7: CRC Error Detection Mathematics

### Category
Embedded Communications / Network Protocols

### Concept
Polynomial Division over $\text{GF}(2)$ for CRC Generation

### Statement
Using generator polynomial $G(x) = x^3 + x + 1$ (`1011`), compute the 3-bit CRC checksum for message $M(x) = x^7 + x^6$ (`11000000`).

### Paper Derivation & Solution

#### Step 1: Modulo-2 Division
- Append 3 zeros: `11000000000`
- Perform XOR long division against divisor `1011`.
- Remainder obtained: `101`.
- Transmitted frame: `11000000101`.

---

## Problem 8: Bitwise Manipulation & Two's Complement

### Category
Embedded Software / Low-Level Bit Operations

### Concept
Sign Extension and Arithmetic Bit Shifts

### Statement
In an 8-bit embedded system, given a signed negative integer stored as `0xFA`, compute its decimal value and the hex result after an arithmetic right shift by 2 bits ($\gg 2$).

### Paper Derivation & Solution

#### Step 1: Convert Hex to Decimal
`0xFA` = `1111 1010` $\implies$ Decimal value is $-6$.

#### Step 2: Apply Arithmetic Right Shift by 2
`1111 1010` $\gg 2 \implies$ `1111 1110` (`0xFE`), decimal value $-2$.

---

## Problem 9: Sampling Theory & Aliasing

### Category
Digital Signal Processing / ADC Sampling

### Concept
Nyquist-Shannon Sampling Theorem & Image Frequencies

### Statement
An analog sensor signal contains $f_{\text{in}} = 35 \text{ kHz}$. The ADC samples at $f_s = 50 \text{ kHz}$.
Determine the apparent alias frequency.

### Paper Derivation & Solution

#### Step 1: Apply Aliasing Formula
$$f_{\text{alias}} = |f_{\text{in}} - k \cdot f_s| = |35 \text{ kHz} - 50 \text{ kHz}| = 15 \text{ kHz}$$

---

## Problem 10: Clock Jitter & Phase Noise

### Category
High-Speed Digital / Timing Analysis

### Concept
Period Jitter Accumulation in Synchronous Interfaces

### Statement
An SPI clock has $f = 50 \text{ MHz}$ ($T = 20 \text{ ns}$) and RMS period jitter $\sigma_j = 50 \text{ ps}$.
Calculate cumulative RMS timing jitter after $N = 100$ cycles.

### Paper Derivation & Solution

#### Step 1: Calculate Total Jitter
$$\sigma_{j,\text{total}} = \sqrt{N} \cdot \sigma_j = \sqrt{100} \cdot 50 \text{ ps} = 500 \text{ ps}$$

---

## Problem 11: Linear Algebra & Coordinate Rotation

### Category
Embedded Motion Control / Sensor Processing

### Concept
2D Rotation Matrix Transformations

### Statement
Rotate vector $v = \begin{pmatrix} 3 \\ 4 \end{pmatrix}$ by $\theta = 30^\circ$ using matrix $R(\theta)$.

### Paper Derivation & Solution

#### Step 1: Apply Matrix Multiplication
$$v_{\text{global}} = \begin{pmatrix} \cos 30^\circ & -\sin 30^\circ \\ \sin 30^\circ & \cos 30^\circ \end{pmatrix} \begin{pmatrix} 3 \\ 4 \end{pmatrix}$$
$$v_{\text{global}} = \begin{pmatrix} \frac{3\sqrt{3} - 4}{2} \\ \frac{3 + 4\sqrt{3}}{2} \end{pmatrix}$$

---

## Problem 12: Digital Filters & Frequency Response

### Category
DSP / Filter Design

### Concept
Magnitude Response of Moving Average Filter

### Statement
A 4-tap moving average filter has difference equation $y[n] = \frac{1}{4}(x[n] + x[n-1] + x[n-2] + x[n-3])$.
Compute DC gain and gain at Nyquist frequency ($f = f_s / 2$).

### Paper Derivation & Solution

#### Step 1: Evaluate Frequency Response
- DC Gain ($\omega = 0$): $H(e^{j0}) = \frac{1 + 1 + 1 + 1}{4} = 1.0$
- Nyquist Gain ($\omega = \pi$): $H(e^{j\pi}) = \frac{1 - 1 + 1 - 1}{4} = 0$

---

## Problem 13: Power Electronics & PWM Duty Cycle

### Category
Power Electronics / Embedded Motor Control

### Concept
Buck Converter Output Voltage & Duty Cycle Math

### Statement
A buck DC-DC converter operates with $V_{\text{in}} = 12\text{V}$ and $V_{\text{out}} = 3.3\text{V}$. Calculate the required duty cycle $D$.

### Paper Derivation & Solution

#### Step 1: Calculate Duty Cycle
$$D = \frac{V_{\text{out}}}{V_{\text{in}}} = \frac{3.3}{12} = 0.275 \text{ (or } 27.5\%)$$

---

## Problem 14: Sensor Fusion & Weighted Average Variance

### Category
Embedded Systems / Sensor Fusion

### Concept
Variance Minimization and Sensor Merging

### Statement
Sensor 1 has $\sigma_1^2 = 4$, Sensor 2 has $\sigma_2^2 = 1$. Calculate optimal weights $w_1$ and $w_2$ subject to $w_1 + w_2 = 1$.

### Paper Derivation & Solution

#### Step 1: Minimize Combined Variance
$$w_1 = \frac{\sigma_2^2}{\sigma_1^2 + \sigma_2^2} = \frac{1}{4 + 1} = 0.25 \implies w_2 = 0.75$$

---

## Problem 15: Boolean Algebra & Gate Minimization

### Category
Embedded Logic / FPGA Design

### Concept
Boolean Simplification via Algebraic Identities

### Statement
Simplify: $F = \bar{A}BC + AB\bar{C} + ABC + AB\bar{C}$

### Paper Derivation & Solution

#### Step 1: Apply Laws
$$F = BC(\bar{A} + A) + AB\bar{C} = BC + AB\bar{C}$$

---

## Problem 16: Discrete PID Controller Tuning

### Category
Embedded Control Systems

### Concept
Positional vs. Velocity Form Discrete PID Equations

### Statement
Given $K_p = 2.0$, $K_i = 0.5$, $K_d = 0.1$, and $T_s = 0.01\text{ s}$, write the positional PID update equation.

### Paper Derivation & Solution

#### Step 1: Construct Update Equation
$$u[n] = 2.0 e[n] + 0.005 \sum_{k=0}^n e[k] + 10.0 (e[n] - e[n-1])$$

---

## Problem 17: Operational Amplifiers & Signal Conditioning

### Category
Analog Hardware / Sensor Interfaces

### Concept
Non-Inverting Op-Amp Gain

### Statement
Non-inverting op-amp with $R_f = 47 \text{ k}\Omega$ and $R_{\text{in}} = 10 \text{ k}\Omega$. Calculate $A_v$ for $v_{\text{in}} = 0.5\text{V}$.

### Paper Derivation & Solution

#### Step 1: Compute Gain and Output
$$A_v = 1 + \frac{47}{10} = 5.7 \implies V_{\text{out}} = 5.7 \cdot 0.5 = 2.85\text{V}$$

---

## Problem 18: Probability & Bit Error Rate (BER)

### Category
Embedded Communications / Reliability

### Concept
Binomial Probability of Packet Transmission Errors

### Statement
Bit error probability $p = 0.01$, packet size $N = 100$. Find probability of zero errors.

### Paper Derivation & Solution

#### Step 1: Calculate Probability
$$P(X = 0) = (1 - 0.01)^{100} = (0.99)^{100} \approx e^{-1} \approx 0.3679$$

---

## Problem 19: Numerical Methods & Newton-Raphson Firmware

### Category
Embedded Software / Numerical Algorithms

### Concept
Square Root Iteration via Newton-Raphson Method

### Statement
Derive Newton-Raphson formula for $\sqrt{S}$ and perform 2 iterations for $S = 10$, $x_0 = 3.0$.

### Paper Derivation & Solution

#### Step 1: Iteration Formula & Steps
$$x_{n+1} = \frac{1}{2}\left(x_n + \frac{S}{x_n}\right)$$
- $x_1 = 3.1667$
- $x_2 = 3.1623$

---

## Problem 20: Transmission Lines & Signal Integrity

### Category
High-Speed PCB Design / Signal Integrity

### Concept
Reflection Coefficient and Characteristic Impedance

### Statement
Microstrip line $Z_0 = 50 \, \Omega$ terminates into $Z_L = 150 \, \Omega$. Calculate $\Gamma$.

### Paper Derivation & Solution

#### Step 1: Compute Reflection Coefficient
$$\Gamma = \frac{Z_L - Z_0}{Z_L + Z_0} = \frac{150 - 50}{150 + 50} = 0.5$$

*(Note: The full 300-problem series spans across Linear Algebra, DSP, Fixed-Point Arithmetic, Control Systems, Power Electronics, Communication Protocols, and Embedded Software following this exact cleaner-compatible LaTeX markup).*