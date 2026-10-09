import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Activity, Check, X, 
  Brain, Dumbbell, BookOpen, Wrench, 
  ChevronDown, ChevronUp, ShieldAlert, 
  Flame, Award, Calendar, RefreshCw, 
  Download, Upload, CheckCircle2, Circle, 
  Play, RotateCcw, FastForward, Cpu, 
  Target, Sparkles, Layers, Eye, EyeOff,
  GitBranch, FileText, ExternalLink, HelpCircle,
  Clock, AlignLeft, ShieldCheck, Zap
} from 'lucide-react';

const COLORS = {
  bg: '#09090B',
  surface: '#121215',
  surfaceBorder: '#27272A',
  cyan: '#00E5FF',
  amber: '#FFB100',
  crimson: '#FF2A5F',
  zinc: '#71717A',
  zincDark: '#18181B'
};

// Date utilities
const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const addDaysToStr = (dateStr, days) => {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
};

const getDaysDifference = (fromDateStr, toDateStr) => {
  if (!fromDateStr || !toDateStr) return 0;
  const d1 = new Date(fromDateStr + 'T00:00:00Z');
  const d2 = new Date(toDateStr + 'T00:00:00Z');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 3600 * 24));
};

const PENCIL_PAPER_MATH = [
  {
    id: 'math-la-1',
    category: 'Linear Algebra',
    title: 'Matrix Eigenvalues & Characteristic Polynomial',
    difficulty: 'PENCIL & PAPER',
    estimatedTime: '8-10 mins',
    concept: 'Characteristic Equation Det(A - λI) = 0 & Trace/Determinant Verification',
    problemStatement: `Given the $2 \\times 2$ state matrix $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$:
1. Compute the characteristic polynomial $p(\\lambda) = \\det(A - \\lambda I)$ by hand.
2. Solve for eigenvalues $\\lambda_1$ and $\\lambda_2$.
3. Compute eigenvectors $v_1$ and $v_2$.
4. Verify using trace property $\\text{Tr}(A) = \\lambda_1 + \\lambda_2$ and determinant property $\\det(A) = \\lambda_1 \\cdot \\lambda_2$.`,
    stepByStepDerivation: [
      {
        step: 'Step 1: Set up Characteristic Matrix',
        content: `$$A - \\lambda I = \\begin{pmatrix} 4 - \\lambda & 1 \\\\ 2 & 3 - \\lambda \\end{pmatrix}$$`
      },
      {
        step: 'Step 2: Evaluate Determinant',
        content: `$$\\det(A - \\lambda I) = (4 - \\lambda)(3 - \\lambda) - (1)(2) = 12 - 7\\lambda + \\lambda^2 - 2 = \\lambda^2 - 7\\lambda + 10$$`
      },
      {
        step: 'Step 3: Solve Roots of Quadratic Equation',
        content: `$$\\lambda^2 - 7\\lambda + 10 = 0 \\implies (\\lambda - 5)(\\lambda - 2) = 0$$
Eigenvalues: **\\lambda_1 = 5**, **\\lambda_2 = 2**`
      },
      {
        step: 'Step 4: Compute Eigenvectors',
        content: `For $\\lambda_1 = 5$:
$$\\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix} \\implies -x_1 + x_2 = 0 \\implies v_1 = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$$

For $\\lambda_2 = 2$:
$$\\begin{pmatrix} 2 & 1 \\\\ 2 & 1 \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix} \\implies 2x_1 + x_2 = 0 \\implies v_2 = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$$`
      },
      {
        step: 'Step 5: Sanity Checks (Trace & Determinant)',
        content: `- $\\text{Tr}(A) = 4 + 3 = 7$. Check: $\\lambda_1 + \\lambda_2 = 5 + 2 = 7$. (VERIFIED)
- $\\det(A) = (4)(3) - (1)(2) = 10$. Check: $\\lambda_1 \\cdot \\lambda_2 = (5)(2) = 10$. (VERIFIED)`
      }
    ],
    finalAnswer: 'Eigenvalues: λ₁ = 5, λ₂ = 2. Eigenvectors: v₁ = [1, 1]^T, v₂ = [1, -2]^T.'
  },
  {
    id: 'math-[#2]',
    category: 'Signal Processing',
    title: 'Z-Transform Pole Stability & Difference Equation',
    difficulty: 'PENCIL & PAPER',
    estimatedTime: '6-8 mins',
    concept: 'BIBO Stability Check via Unit Circle Radius |z| < 1',
    problemStatement: `A continuous discrete-time IIR filter is described by the linear difference equation:
$$y[n] - 0.5 y[n-1] + 0.06 y[n-2] = x[n]$$
1. Take the Z-transform to find system transfer function $H(z) = \\frac{Y(z)}{X(z)}$.
2. Find the poles $z_1, z_2$ by solving the characteristic polynomial.
3. Determine whether the system is Bounded-Input Bounded-Output (BIBO) stable by calculating $|z_1|$ and $|z_2|$.`,
    stepByStepDerivation: [
      {
        step: 'Step 1: Apply Z-Transform Properties',
        content: `Applying time-shift property $\\mathcal{Z}\\{y[n-k]\\} = z^{-k} Y(z)$:
$$Y(z) - 0.5 z^{-1} Y(z) + 0.06 z^{-2} Y(z) = X(z)$$
$$Y(z) \\left(1 - 0.5 z^{-1} + 0.06 z^{-2}\\right) = X(z)$$`
      },
      {
        step: 'Step 2: Formulate Transfer Function H(z)',
        content: `$$H(z) = \\frac{1}{1 - 0.5 z^{-1} + 0.06 z^{-2}} = \\frac{z^2}{z^2 - 0.5 z + 0.06}$$`
      },
      {
        step: 'Step 3: Solve Characteristic Polynomial for Poles',
        content: `$$z^2 - 0.5 z + 0.06 = 0$$
Factoring: $(z - 0.3)(z - 0.2) = 0$
Poles: **z₁ = 0.3**, **z₂ = 0.2**`
      },
      {
        step: 'Step 4: Check BIBO Stability Criterion',
        content: `A discrete system is BIBO stable if and only if all poles lie strictly inside the unit circle ($|z_i| < 1$).
- $|z_1| = |0.3| = 0.3 < 1$
- $|z_2| = |0.2| = 0.2 < 1$
Therefore, the system is **STABLE**.`
      }
    ],
    finalAnswer: 'Transfer Function: H(z) = z² / (z² - 0.5z + 0.06). Poles: z₁ = 0.3, z₂ = 0.2. BIBO System: STABLE.'
  },
  {
    id: 'math-info-1',
    category: 'Information Theory',
    title: 'Shannon Entropy & Huffman Code Bit Savings',
    difficulty: 'PENCIL & PAPER',
    estimatedTime: '10 mins',
    concept: 'Source Entropy Bounds H(X) & Lossless Compression',
    problemStatement: `An embedded microcontroller transmits 4 unique state codes with probabilities:
- $P(S_1) = 1/2$
- $P(S_2) = 1/4$
- $P(S_3) = 1/8$
- $P(S_4) = 1/8$

1. Compute the Shannon Entropy $H(X) = -\\sum P(s_i) \\log_2 P(s_i)$ in bits/symbol.
2. Construct an optimal prefix-free Huffman Code by hand on paper.
3. Calculate expected code length $L = \\sum P(s_i) l_i$ and verify efficiency $L = H(X)$.`,
    stepByStepDerivation: [
      {
        step: 'Step 1: Calculate Shannon Entropy H(X)',
        content: `$$H(X) = - \\left[ \\frac{1}{2} \\log_2\\left(\\frac{1}{2}\\right) + \\frac{1}{4} \\log_2\\left(\\frac{1}{4}\\right) + \\frac{1}{8} \\log_2\\left(\\frac{1}{8}\\right) + \\frac{1}{8} \\log_2\\left(\\frac{1}{8}\\right) \\right]$$
$$H(X) = - \\left[ \\frac{1}{2}(-1) + \\frac{1}{4}(-2) + \\frac{1}{8}(-3) + \\frac{1}{8}(-3) \\right]$$
$$H(X) = \\frac{1}{2} + \\frac{2}{4} + \\frac{3}{8} + \\frac{3}{8} = 0.5 + 0.5 + 0.375 + 0.375 = 1.75 \\text{ bits/symbol}$$`
      },
      {
        step: 'Step 2: Construct Huffman Binary Tree',
        content: `Combine smallest probabilities:
1. Merge $S_3 (1/8)$ and $S_4 (1/8) \\rightarrow Node_{34} (1/4)$.
2. Merge $S_2 (1/4)$ and $Node_{34} (1/4) \\rightarrow Node_{234} (1/2)$.
3. Merge $S_1 (1/2)$ and $Node_{234} (1/2) \\rightarrow Root (1.0)$.

Code Assignments:
- $S_1$: \`0\` (length $l_1 = 1$)
- $S_2$: \`10\` (length $l_2 = 2$)
- $S_3$: \`110\` (length $l_3 = 3$)
- $S_4$: \`111\` (length $l_4 = 3$)`
      },
      {
        step: 'Step 3: Compute Expected Code Length L',
        content: `$$L = \\left(\\frac{1}{2} \\times 1\\right) + \\left(\\frac{1}{4} \\times 2\\right) + \\left(\\frac{1}{8} \\times 3\\right) + \\left(\\frac{1}{8} \\times 3\\right)$$
$$L = 0.5 + 0.5 + 0.375 + 0.375 = 1.75 \\text{ bits/symbol}$$
Since $L = H(X) = 1.75$, the Huffman code achieves **100% theoretical coding efficiency**!`
      }
    ],
    finalAnswer: 'Entropy H(X) = 1.75 bits/symbol. Optimal Huffman Assignment: S₁=0, S₂=10, S₃=110, S₄=111. Average Length L = 1.75 bits/symbol.'
  },
  {
    id: 'math-bool-1',
    category: 'Boolean Algebra',
    title: 'Karnaugh Map Minimization & Shannon Decomposition',
    difficulty: 'PENCIL & PAPER',
    estimatedTime: '5-7 mins',
    concept: 'Majority Logic Simplification & Shannon Expansion w.r.t Variable A',
    problemStatement: `Given the 3-variable logic function:
$$f(A, B, C) = A B + A \\bar{B} C + \\bar{A} B C$$
1. Simplify $f(A, B, C)$ manually using Boolean algebra laws.
2. Perform Shannon's Expansion theorem with respect to variable $A$:
$$f(A, B, C) = A f(1, B, C) + \\bar{A} f(0, B, C)$$`,
    stepByStepDerivation: [
      {
        step: 'Step 1: Algebraic Simplification',
        content: `Factor variable $A$ out of first two terms:
$$f(A, B, C) = A(B + \\bar{B}C) + \\bar{A}BC$$
Apply Distributive/Absorption Law $(X + \\bar{X}Y = X + Y)$:
$$B + \\bar{B}C = B + C$$
$$f(A, B, C) = A(B + C) + \\bar{A}BC = AB + AC + \\bar{A}BC$$
Factor $C$:
$$f(A, B, C) = AB + C(A + \\bar{A}B) = AB + C(A + B) = AB + AC + BC$$
This is the canonical 3-input **Majority Function**!`
      },
      {
        step: 'Step 2: Perform Shannon Expansion w.r.t A',
        content: `Evaluate $f(1, B, C)$ by substituting $A = 1$:
$$f(1, B, C) = (1)B + (1)C + BC = B + C + BC = B + C$$

Evaluate $f(0, B, C)$ by substituting $A = 0$:
$$f(0, B, C) = (0)B + (0)C + BC = BC$$

Assemble Shannon Expansion:
$$f(A, B, C) = A(B + C) + \\bar{A}(BC)$$`
      }
    ],
    finalAnswer: 'Minimal Sum-of-Products: f(A,B,C) = AB + AC + BC. Shannon Expansion wrt A: A(B + C) + A\'(BC).'
  },
  {
    id: 'math-mod-1',
    category: 'Discrete Recurrences',
    title: 'Modular Recurrence & Pisano Periodicity',
    difficulty: 'PENCIL & PAPER',
    estimatedTime: '8 mins',
    concept: 'Linear Congruential Recurrence x_{n+1} ≡ 3 x_n + 5 (mod 11)',
    problemStatement: `Consider the pseudo-random generator recurrence relation:
$$x_{n+1} \\equiv (3 x_n + 5) \\pmod{11}$$
With seed value $x_0 = 2$.
1. Compute state values $x_1, x_2, x_3, x_4, x_5$ by pencil and paper.
2. Identify when the state repeats and state the cycle length (period $P$).`,
    stepByStepDerivation: [
      {
        step: 'Step 1: Manual Step-by-Step Modular Calculations',
        content: `- $x_0 = 2$
- $x_1 = (3(2) + 5) \\pmod{11} = 11 \\pmod{11} = \\mathbf{0}$
- $x_2 = (3(0) + 5) \\pmod{11} = 5 \\pmod{11} = \\mathbf{5}$
- $x_3 = (3(5) + 5) \\pmod{11} = 20 \\pmod{11} = \\mathbf{9}$
- $x_4 = (3(9) + 5) \\pmod{11} = 32 \\pmod{11} = \\mathbf{10}$
- $x_5 = (3(10) + 5) \\pmod{11} = 35 \\pmod{11} = \\mathbf{2}$`
      },
      {
        step: 'Step 2: Verify Repetition & State Cycle',
        content: `Notice that $x_5 = 2 = x_0$. Because the system is deterministic, the sequence now repeats indefinitely:
$$\\text{Sequence}: \\{2, 0, 5, 9, 10, 2, 0, 5, 9, 10, \\dots\\}$$
The period length is **P = 5**.`
      }
    ],
    finalAnswer: 'State values: x₁=0, x₂=5, x₃=9, x₄=10, x₅=2. Cycle period P = 5.'
  }
];

const ENHANCED_MOBILITY_ROUTINE = [
  {
    id: 'mob-thoracic',
    name: 'Thoracic Spine Extension',
    target: 'Mid-Thoracic Articulation & Anterior Shoulder Decompression',
    holdSeconds: 45,
    setup: 'Position yoga block or hard foam roller directly beneath lower scapulae. Classp hands gently behind head to support cervical spine. Plant feet flat on floor.',
    formCues: [
      'POSTERIOR TILT: Squeeze glutes and tuck pelvis to lock lower lumbar spine flat (prevent lower back hyperextension).',
      'RIBCAGE CONTROL: Keep lower ribs pulled down; arch exclusively through mid-thoracic spine.',
      'EXHALE FOCUS: Exhale slowly for 6 seconds as you lower shoulders toward floor; hold bottom position for 2s.'
    ],
    breathing: '6s Slow Exhale on extension / 4s Inhale at top',
    targetMuscles: 'Thoracic Vertabrae T4-T8, Pectoralis Minor, Anterior Deltoids'
  },
  {
    id: 'mob-couch',
    name: 'Couch Stretch (Rectus Femoris & Psoas)',
    target: 'Hip Flexor Mobilization & Anterior Pelvic Tilt Correction',
    holdSeconds: 60,
    setup: 'Back knee jammed against wall corner; rear shin flat vertical against wall. Front foot stepped out into a 90-degree lunge position.',
    formCues: [
      'GLUTE ENGAGEMENT: Squeeze glute on rear leg with 100% force. This forces hip into extension.',
      'POSTERIOR PELVIC TILT: Roll hips back (tailbone tucked under). Do not allow lower back to arch to fake mobility.',
      'TORSO ELEVATION: Slowly bring torso upright while maintaining max rear glute contraction.'
    ],
    breathing: 'Cadence: 4s Inhale / 4s Hold / 6s Exhale',
    targetMuscles: 'Rectus Femoris, Iliopsoas, Tensor Fasciae Latae (TFL)'
  },
  {
    id: 'mob-jefferson',
    name: 'Jefferson Curl (Spinal Segmental Articulation)',
    target: 'Posterior Chain Lengthening & Dural Sheath Decompression',
    holdSeconds: 30,
    setup: 'Stand on elevated box or parallette. Hold light kettlebell/dumbbell (8-12kg) with straight arms.',
    formCues: [
      'VERTEBRA BY VERTEBRA: Tuck chin firmly to chest. Roll spine down one individual vertebra at a time.',
      'KNEE LOCK: Keep knees 100% locked out straight. Keep weight shifted onto mid-foot/toes.',
      'ACTIVE EXTENSION: Pull hips upward at bottom position to stretch hamstrings under load.'
    ],
    breathing: 'Continuous fluid breathing; do not hold breath under load',
    targetMuscles: 'Erector Spinae, Hamstrings, Thoracolumbar Fascia, Calves'
  },
  {
    id: 'mob-butcher',
    name: 'Shoulder Butcher\'s Block',
    target: 'Latissimus Dorsi & Long Head Triceps Extension for Overhead Mobility',
    holdSeconds: 45,
    setup: 'Kneel facing bench or parallette. Place elbows on bench width of shoulders, holding a wooden dowel or palms together behind head.',
    formCues: [
      'PELVIS NEUTRAL: Keep knees under hips and core braced to prevent swayback lower spine.',
      'CHEST DEPRESSION: Sink chest and head down between shoulders while pulling hands back toward shoulder blades.',
      'ELBOW DRIVE: Press elbows down firmly into bench surface (10% active contraction).'
    ],
    breathing: 'Deep diaphragmatic breathing into upper back',
    targetMuscles: 'Latissimus Dorsi, Triceps Long Head, T-Spine Extension'
  },
  {
    id: 'mob-wrist',
    name: 'Wrist & Forearm Flexor Conditioning',
    target: 'Tendon Adaptation for Planche & Handstand Load Tolerance',
    holdSeconds: 40,
    setup: 'Quadruped position on floor. Turn hands so fingers point backward toward knees with palms flat on floor.',
    formCues: [
      'ELBOW LOCK: Lock elbows completely straight; turn elbow pits forward.',
      'PALM PRESSURE: Press finger pads and palm heels firmly into floor surface.',
      'LEAN BACK: Slowly lean hips back toward heels while keeping palm heels flat.'
    ],
    breathing: 'Slow relaxed nasal breathing',
    targetMuscles: 'Flexor Carpi Radialis, Flexor Digitorum Profundus, Forearm Complex'
  },
  {
    id: 'mob-ankle',
    name: 'Ankle Dorsiflexion Wall Lean',
    target: 'Talocrural Joint Mobility & Achilles Tendon Stiffness',
    holdSeconds: 45,
    setup: 'Stand 4-5 inches away from wall in staggered stance. Front toes pointing straight ahead.',
    formCues: [
      'HEEL DOWN: Keep front heel glued to floor. Drive knee straight forward over 2nd/3rd toe toward wall.',
      'NO KNEE VALGUS: Do not allow front knee to collapse inward.',
      'ACTIVE PULL: Actively pull top of foot up toward shin using tibialis anterior.'
    ],
    breathing: 'Deep exhale on knee forward excursion',
    targetMuscles: 'Soleus, Gastrocnemius, Tibialis Anterior, Talocrural Joint'
  },
  {
    id: 'mob-wall-slides',
    name: 'Scapular Wall Slides (Wall Angels)',
    target: 'Serratus Anterior & Lower Trapezius Activation for Overhead Stability',
    holdSeconds: 40,
    setup: 'Stand with upper back, head, and buttocks flat against wall. Feet 4 inches away from wall.',
    formCues: [
      'FLATTEN LUMBAR: Press lower back flat against wall (zero gap between lumbar and wall).',
      'CONTACT POINTS: Keep elbows, wrists, and backs of hands pressed flat into wall.',
      'SLIDE CONTROL: Slowly slide arms upward from W shape to V shape without allowing wrists or lower back to lift off wall.'
    ],
    breathing: 'Exhale while sliding up / Inhale returning down',
    targetMuscles: 'Serratus Anterior, Lower Trapezius, Infraspinatus'
  }
];

const CALISTHENICS_SKILLS = {
  planche: {
    name: 'Planche',
    description: 'Straight-arm anterior shoulder power, scapular protraction & core anti-extension leverage.',
    tracks: {
      static: {
        name: 'Isometric Hold Track',
        unit: 'seconds',
        tiers: [
          { level: 0, name: 'Tuck Planche', target: 12 },
          { level: 1, name: 'Advanced Tuck Planche', target: 12 },
          { level: 2, name: 'Straddle Planche', target: 10 },
          { level: 3, name: 'Full Planche', target: 8 }
        ]
      },
      dynamic: {
        name: 'Dynamic Press Track',
        unit: 'reps',
        tiers: [
          { level: 0, name: 'Planche Lean Push-ups', target: 12 },
          { level: 1, name: 'Tuck Planche Press Negative', target: 8 },
          { level: 2, name: 'Adv Tuck Planche Push-ups', target: 6 },
          { level: 3, name: 'Straddle Planche Press-to-Handstand', target: 5 }
        ]
      }
    }
  },
  front_lever: {
    name: 'Front Lever',
    description: 'Straight-arm lat depression, posterior chain horizontal hold & scapular retraction.',
    tracks: {
      static: {
        name: 'Isometric Hold Track',
        unit: 'seconds',
        tiers: [
          { level: 0, name: 'Tuck Front Lever', target: 12 },
          { level: 1, name: 'Advanced Tuck Front Lever', target: 12 },
          { level: 2, name: 'Single-Leg / Straddle Front Lever', target: 10 },
          { level: 3, name: 'Full Front Lever', target: 8 }
        ]
      },
      dynamic: {
        name: 'Lever Pull & Row Track',
        unit: 'reps',
        tiers: [
          { level: 0, name: 'Tuck FL Pulls to Horizontal', target: 10 },
          { level: 1, name: 'Adv Tuck FL Rows', target: 8 },
          { level: 2, name: 'Straddle FL Touch Rows', target: 6 },
          { level: 3, name: 'Full FL Pull to Inverted Hang', target: 5 }
        ]
      }
    }
  },
  oap: {
    name: 'One-Arm Pull-up (OAP)',
    description: 'Unilateral vertical pulling strength & single-arm scapular depression control.',
    tracks: {
      eccentric: {
        name: 'Assisted & Eccentric Track',
        unit: 'reps',
        tiers: [
          { level: 0, name: 'Archer Pull-ups', target: 10 },
          { level: 1, name: 'Band-Assisted OAP', target: 8 },
          { level: 2, name: 'Slow Negatives (8s eccentric)', target: 5 },
          { level: 3, name: 'Strict One-Arm Pull-up', target: 3 }
        ]
      },
      power: {
        name: 'Weighted & Explosive Track',
        unit: 'reps',
        tiers: [
          { level: 0, name: 'Weighted Pull-ups (+35% BW)', target: 8 },
          { level: 1, name: 'Weighted Pull-ups (+50% BW)', target: 5 },
          { level: 2, name: 'High Explosive Pull-ups to Chest', target: 8 },
          { level: 3, name: 'One-Arm Scapular High Pulls', target: 6 }
        ]
      }
    }
  },
  hspu: {
    name: 'Handstand Push-up (HSPU)',
    description: 'Vertical overhead pressing, handstand balance & hollow-body shoulder mobility.',
    tracks: {
      freestanding: {
        name: 'Vertical Balance Track',
        unit: 'reps',
        tiers: [
          { level: 0, name: 'Elevated Pike Push-ups', target: 12 },
          { level: 1, name: 'Chest-to-Wall HSPU', target: 10 },
          { level: 2, name: 'Freestanding HSPU (Wall Transition)', target: 6 },
          { level: 3, name: 'Clean Freestanding HSPU', target: 5 }
        ]
      },
      deficit: {
        name: 'Parallette Deficit Track',
        unit: 'reps',
        tiers: [
          { level: 0, name: 'Floor Headstand Push-ups', target: 10 },
          { level: 1, name: 'Wall Deficit HSPU (2-inch block)', target: 8 },
          { level: 2, name: 'Deep Parallette Wall HSPU', target: 6 },
          { level: 3, name: 'Deep Freestanding Parallette HSPU', target: 4 }
        ]
      }
    }
  }
};

const SAMPLE_REPO_MARKDOWNS = {
  '/progressions/planche.md': `---
title: Planche Progression Table
domain: Calisthenics
last_updated: 2026-10-01
---

# Planche Progression Matrix

| Level | Progression Name | Target Hold / Reps | Target RPE | Primary Focus |
|---|---|---|---|---|
| L0 | Tuck Planche | 12s hold | 8.0 | Scapular Protraction |
| L1 | Adv Tuck Planche | 12s hold | 8.5 | Straight Arm Extension |
| L2 | Straddle Planche | 10s hold | 9.0 | Hip Abduction & Core |
| L3 | Full Planche | 8s hold | 9.0 | Maximum Leverage |
`,
  '/math/problems.md': `---
title: High-Yield Math Problems
domain: Mathematics
type: Paper & Pencil Solvable
---

# Problem Lookup Table

- **LA-1**: Matrix Eigenvalues & Characteristic Polynomial
- **SP-1**: Z-Transform Pole Stability & Difference Equation
- **IT-1**: Shannon Entropy & Huffman Coding
- **BA-1**: Karnaugh Map Minimization & Shannon Expansion
- **DR-1**: Modular Recurrence & Pisano Periodicity
`,
  '/stretches/routine.md': `---
title: Daily Full-Body Mobility Routine
duration: 15 minutes
focus: Joint Articulation & Tendon Prep
---

# Stretch Checklist
1. Thoracic Spine Extension (45s)
2. Couch Stretch (60s)
3. Jefferson Curl (30s)
4. Shoulder Butcher's Block (45s)
5. Wrist & Forearm Flexor Prep (40s)
6. Ankle Dorsiflexion Wall Lean (45s)
7. Scapular Wall Slides (40s)
`
};

export default function App() {
  const [simulatedDate, setSimulatedDate] = useState(() => getTodayStr());
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | calisthenics | math | mobility | markdown_sync | data
  
  // Pillars State
  const [pillars, setPillars] = useState(() => {
    const saved = localStorage.getItem('system_v35_pillars');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      workout: { id: 'workout', name: 'Workout / Physical', lastCompletedDate: null, streak: 0, icon: 'Dumbbell' },
      reading: { id: 'reading', name: 'Reading & Theory', lastCompletedDate: null, streak: 0, icon: 'BookOpen' },
      creativity: { id: 'creativity', name: 'Creativity & Hardware', lastCompletedDate: null, streak: 0, icon: 'Wrench' },
      math: { id: 'math', name: 'Math & Deep Work', lastCompletedDate: null, streak: 0, icon: 'Brain' },
      mobility: { id: 'mobility', name: 'Daily Full-Body Mobility', lastCompletedDate: null, streak: 0, icon: 'Activity' }
    };
  });

  // Calisthenics PRs & Active Tiers State
  const [calisthenicsState, setCalisthenicsState] = useState(() => {
    const saved = localStorage.getItem('system_v35_calisthenics');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      tiers: {
        planche_static: 0, planche_dynamic: 0,
        front_lever_static: 0, front_lever_dynamic: 0,
        oap_eccentric: 0, oap_power: 0,
        hspu_freestanding: 0, hspu_deficit: 0
      },
      prs: {}
    };
  });

  // Math Problem Mastered Status State
  const [problemStatus, setProblemStatus] = useState(() => {
    const saved = localStorage.getItem('system_v35_math_status');
    return saved ? JSON.parse(saved) : {};
  });

  // Mobility Checklist State
  const [mobilityChecks, setMobilityChecks] = useState(() => {
    const saved = localStorage.getItem('system_v35_mobility_checks');
    return saved ? JSON.parse(saved) : {};
  });

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  // Synchronize to LocalStorage
  useEffect(() => {
    localStorage.setItem('system_v35_pillars', JSON.stringify(pillars));
  }, [pillars]);

  useEffect(() => {
    localStorage.setItem('system_v35_calisthenics', JSON.stringify(calisthenicsState));
  }, [calisthenicsState]);

  useEffect(() => {
    localStorage.setItem('system_v35_math_status', JSON.stringify(problemStatus));
  }, [problemStatus]);

  useEffect(() => {
    localStorage.setItem('system_v35_mobility_checks', JSON.stringify(mobilityChecks));
  }, [mobilityChecks]);

  const showNotification = (msg, type = 'cyan') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const computePillarStatus = (pillar) => {
    if (!pillar.lastCompletedDate) {
      return { status: 'UNSTARTED', misses: 0, effectiveStreak: 0, label: 'INITIAL', color: COLORS.zinc };
    }

    const diff = getDaysDifference(pillar.lastCompletedDate, simulatedDate);

    if (diff <= 0) {
      return { status: 'COMPLETED_TODAY', misses: 0, effectiveStreak: pillar.streak, label: 'COMPLETED TODAY', color: COLORS.cyan };
    }

    const missedDays = diff - 1;

    if (missedDays === 0) {
      return { status: 'PENDING_TODAY', misses: 0, effectiveStreak: pillar.streak, label: 'PENDING TODAY', color: COLORS.cyan };
    }

    if (missedDays === 1) {
      return { status: 'GRACE_1', misses: 1, effectiveStreak: pillar.streak, label: 'WARNING (GRACE 1)', color: COLORS.amber };
    }

    if (missedDays === 2) {
      return { status: 'GRACE_2', misses: 2, effectiveStreak: pillar.streak, label: 'CRITICAL (GRACE 2)', color: COLORS.crimson };
    }

    // 3 or more missed days -> Streak broken!
    return { status: 'BROKEN', misses: missedDays, effectiveStreak: 0, label: 'STREAK BROKEN (3-DAY RESET)', color: COLORS.crimson };
  };

  const handleCompletePillar = (pillarId) => {
    setPillars(prev => {
      const p = prev[pillarId];
      const statusInfo = computePillarStatus(p);

      let newStreak = p.streak;
      if (statusInfo.status === 'COMPLETED_TODAY') {
        showNotification(`${p.name} already marked complete for ${simulatedDate}.`, 'amber');
        return prev;
      }

      if (statusInfo.status === 'BROKEN' || statusInfo.status === 'UNSTARTED') {
        newStreak = 1;
      } else {
        newStreak = p.streak + 1;
      }

      showNotification(`✓ ${p.name} completed! Streak: ${newStreak} days.`, 'cyan');

      return {
        ...prev,
        [pillarId]: {
          ...p,
          lastCompletedDate: simulatedDate,
          streak: newStreak
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E4E4E7] font-mono p-3 sm:p-6 md:p-8 flex flex-col selection:bg-[#00E5FF] selection:text-[#09090B]">
      
      {/* HUD Header */}
      <header className="border-b border-[#27272A] pb-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#00E5FF] animate-ping" />
              <h1 className="text-2xl sm:text-4xl font-black tracking-wider uppercase text-[#00E5FF] flex items-center gap-2">
                <Terminal className="w-7 h-7 sm:w-9 sm:h-9 text-[#00E5FF]" />
                The System HUD
              </h1>
            </div>
            <p className="text-xs tracking-[0.2em] text-[#71717A] mt-1 uppercase">
              ATHLETE & EMBEDDED SYSTEM OPERATING HUD // v3.5
            </p>
          </div>

          {/* Date Simulation Controls */}
          <div className="bg-[#121215] border border-[#27272A] p-3 flex flex-wrap items-center gap-3 rounded-none">
            <div className="flex items-center gap-2 text-xs text-[#00E5FF]">
              <Calendar className="w-4 h-4" />
              <span className="text-[#71717A]">SYSTEM DATE:</span>
              <span className="font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 border border-[#00E5FF]/30">{simulatedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setSimulatedDate(prev => addDaysToStr(prev, 1))}
                className="flex items-center gap-1 text-[11px] bg-[#18181B] hover:bg-[#00E5FF] hover:text-[#09090B] text-[#00E5FF] border border-[#00E5FF]/40 px-2 py-1 transition-all uppercase font-bold"
                title="Advance date by 1 day to test streak grace periods"
              >
                +1 Day
              </button>
              <button 
                onClick={() => setSimulatedDate(prev => addDaysToStr(prev, 3))}
                className="flex items-center gap-1 text-[11px] bg-[#18181B] hover:bg-[#FF2A5F] hover:text-[#09090B] text-[#FF2A5F] border border-[#FF2A5F]/40 px-2 py-1 transition-all uppercase font-bold"
                title="Advance by 3 days (triggers 3-day decay / streak break)"
              >
                <FastForward className="w-3 h-3" /> +3 Days (Trigger Reset)
              </button>
              <button 
                onClick={() => setSimulatedDate(getTodayStr())}
                className="text-[11px] bg-[#18181B] hover:bg-white hover:text-[#09090B] text-[#71717A] border border-[#27272A] px-2 py-1 transition-all uppercase"
                title="Reset to Actual Calendar Date"
              >
                Real Today
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#27272A]">
          {[
            { id: 'dashboard', label: 'Dashboard (Streaks)', icon: Activity },
            { id: 'calisthenics', label: 'Calisthenics Hub & PRs', icon: Dumbbell },
            { id: 'math', label: 'Paper & Pencil Math', icon: Brain },
            { id: 'mobility', label: 'Biomechanical Mobility', icon: Sparkles },
            { id: 'markdown_sync', label: 'Git Repo Sync (.md)', icon: GitBranch },
            { id: 'data', label: 'System Data (JSON)', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                  isActive 
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]' 
                    : 'bg-[#121215] text-[#71717A] border-[#27272A] hover:text-[#E4E4E7] hover:border-[#71717A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Persistent Notification Toast */}
      {notification && (
        <div className="mb-6 p-3 bg-[#121215] border border-[#00E5FF] text-[#00E5FF] flex items-center justify-between text-xs font-bold uppercase tracking-widest animate-bounce">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-[#121215] border border-[#27272A] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#00E5FF] uppercase flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FFB100]" />
                Multi-Domain Automated 3-Day Grace Streak Engine
              </h2>
              <p className="text-xs text-[#71717A] mt-1">
                Progression rule: <strong className="text-[#00E5FF]">1-2 Consecutive Misses = Grace State</strong> (Streak length preserved). <strong className="text-[#FF2A5F]">3 Missed Days = Hard Reset to 0</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.values(pillars).map(pillar => {
              const statusInfo = computePillarStatus(pillar);
              const isDoneToday = statusInfo.status === 'COMPLETED_TODAY';

              return (
                <div 
                  key={pillar.id}
                  className="bg-[#121215] border p-5 transition-all relative overflow-hidden"
                  style={{ borderColor: statusInfo.color }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#18181B] border border-[#27272A]">
                        {pillar.id === 'workout' && <Dumbbell className="w-6 h-6 text-[#00E5FF]" />}
                        {pillar.id === 'reading' && <BookOpen className="w-6 h-6 text-[#00E5FF]" />}
                        {pillar.id === 'creativity' && <Wrench className="w-6 h-6 text-[#00E5FF]" />}
                        {pillar.id === 'math' && <Brain className="w-6 h-6 text-[#00E5FF]" />}
                        {pillar.id === 'mobility' && <Activity className="w-6 h-6 text-[#00E5FF]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold uppercase tracking-wider">{pillar.name}</h3>
                          <span 
                            className="text-[10px] px-2 py-0.5 border font-bold uppercase tracking-wider"
                            style={{ 
                              borderColor: statusInfo.color, 
                              color: statusInfo.color, 
                              backgroundColor: `${statusInfo.color}15` 
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 mt-2 text-xs">
                          <div>
                            <span className="text-[#71717A]">ACTIVE STREAK: </span>
                            <span className="font-bold text-lg text-[#00E5FF]">{statusInfo.effectiveStreak} days</span>
                          </div>
                          <div>
                            <span className="text-[#71717A]">LAST LOGGED: </span>
                            <span className="font-mono text-[#E4E4E7]">
                              {pillar.lastCompletedDate || 'Never'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCompletePillar(pillar.id)}
                        disabled={isDoneToday}
                        className={`w-full md:w-auto px-6 py-3 border font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                          isDoneToday 
                            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF] cursor-not-allowed opacity-80' 
                            : 'bg-[#00E5FF] text-[#09090B] border-[#00E5FF] hover:bg-white hover:border-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isDoneToday ? 'Completed Today' : 'Mark Complete For Today'}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {}
      {activeTab === 'calisthenics' && (
        <CalisthenicsModule 
          state={calisthenicsState} 
          setState={setCalisthenicsState} 
          simulatedDate={simulatedDate}
          showNotification={showNotification}
        />
      )}

      {}
      {activeTab === 'math' && (
        <PencilPaperMathModule 
          status={problemStatus} 
          setStatus={setProblemStatus}
          showNotification={showNotification}
        />
      )}

      {}
      {activeTab === 'mobility' && (
        <EnhancedMobilityModule 
          checks={mobilityChecks} 
          setChecks={setMobilityChecks}
          onCompleteAll={() => handleCompletePillar('mobility')}
        />
      )}

      {}
      {activeTab === 'markdown_sync' && (
        <MarkdownSyncModule />
      )}

      {}
      {activeTab === 'data' && (
        <DataModule 
          pillars={pillars}
          calisthenics={calisthenicsState}
          mathStatus={problemStatus}
          mobilityChecks={mobilityChecks}
          simulatedDate={simulatedDate}
          onRestore={(data) => {
            if (data.pillars) setPillars(data.pillars);
            if (data.calisthenics) setCalisthenicsState(data.calisthenics);
            if (data.mathStatus) setProblemStatus(data.mathStatus);
            if (data.mobilityChecks) setMobilityChecks(data.mobilityChecks);
            showNotification('System restored from JSON data payload.', 'cyan');
          }}
        />
      )}

    </div>
  );
}

function CalisthenicsModule({ state, setState, simulatedDate, showNotification }) {
  const [selectedSkill, setSelectedSkill] = useState('planche');
  const [selectedTrack, setSelectedTrack] = useState('static');
  
  const [performanceValue, setPerformanceValue] = useState('');
  const [rpeValue, setRpeValue] = useState('8.5');

  const activeSkillObj = CALISTHENICS_SKILLS[selectedSkill];
  const activeTrackObj = activeSkillObj.tracks[selectedTrack] || Object.values(activeSkillObj.tracks)[0];
  const trackKey = `${selectedSkill}_${selectedTrack}`;
  
  const currentTierIndex = state.tiers[trackKey] || 0;
  const currentTier = activeTrackObj.tiers[currentTierIndex];
  const currentPR = state.prs[trackKey] || null;

  const handleLogSession = (e) => {
    e.preventDefault();
    const val = parseFloat(performanceValue);
    const rpe = parseFloat(rpeValue);

    if (isNaN(val) || isNaN(rpe)) {
      showNotification('Invalid numeric entry.', 'crimson');
      return;
    }

    let isPR = false;
    if (!currentPR || val > currentPR.value) {
      isPR = true;
    }

    const newPRs = {
      ...state.prs,
      [trackKey]: {
        value: isPR ? val : currentPR.value,
        rpe: isPR ? rpe : currentPR.rpe,
        tierName: currentTier.name,
        date: simulatedDate
      }
    };

    let newTierIdx = currentTierIndex;
    let advancementMsg = '';

    if (val >= currentTier.target && rpe <= 8.5) {
      if (currentTierIndex < activeTrackObj.tiers.length - 1) {
        newTierIdx = currentTierIndex + 1;
        advancementMsg = ` 🚀 PROMOTION ELIGIBLE! Advanced to ${activeTrackObj.tiers[newTierIdx].name}.`;
      } else {
        advancementMsg = ' 👑 MAXIMUM DIRECTIVE TIER ACHIEVED!';
      }
    } else if (rpe >= 9.0) {
      advancementMsg = ' ⚠️ RPE Edge Limit Reached. Maintaining tier for tendon/connective tissue adaptation.';
    } else {
      advancementMsg = ' Session logged. Maintain target progression.';
    }

    setState(prev => ({
      ...prev,
      tiers: { ...prev.tiers, [trackKey]: newTierIdx },
      prs: newPRs
    }));

    showNotification(`${isPR ? '🔥 NEW ALL-TIME PR!' : ''}${advancementMsg}`, isPR ? 'cyan' : 'amber');
    setPerformanceValue('');
  };

  return (
    <div className="space-y-6">
      
      {/* Skill Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.keys(CALISTHENICS_SKILLS).map(skillKey => {
          const sk = CALISTHENICS_SKILLS[skillKey];
          return (
            <button
              key={skillKey}
              onClick={() => {
                setSelectedSkill(skillKey);
                setSelectedTrack(Object.keys(sk.tracks)[0]);
              }}
              className={`p-3 text-left border transition-all ${
                selectedSkill === skillKey 
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]' 
                  : 'border-[#27272A] bg-[#121215] text-[#71717A] hover:border-[#71717A]'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider">{sk.name}</div>
            </button>
          );
        })}
      </div>

      {/* Main Skill Dashboard */}
      <div className="bg-[#121215] border border-[#27272A] p-6">
        <div className="border-b border-[#27272A] pb-4 mb-6">
          <h2 className="text-2xl font-black text-[#00E5FF] uppercase tracking-wider">
            {activeSkillObj.name} Skill Tree
          </h2>
          <p className="text-xs text-[#71717A] mt-1">{activeSkillObj.description}</p>
        </div>

        {/* Parallel Track Selector */}
        <div className="flex gap-3 mb-6">
          {Object.keys(activeSkillObj.tracks).map(tKey => {
            const trk = activeSkillObj.tracks[tKey];
            const isSel = selectedTrack === tKey;
            return (
              <button
                key={tKey}
                onClick={() => setSelectedTrack(tKey)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  isSel 
                    ? 'bg-[#00E5FF] text-[#09090B] border-[#00E5FF]' 
                    : 'bg-[#18181B] text-[#71717A] border-[#27272A] hover:text-[#E4E4E7]'
                }`}
              >
                {trk.name}
              </button>
            );
          })}
        </div>

        {/* PR & Current Tier Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* All-time PR Card */}
          <div className="bg-[#18181B] border border-[#00E5FF]/40 p-5 relative">
            <div className="absolute top-0 right-0 bg-[#00E5FF] text-[#09090B] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3" /> All-Time PR
            </div>
            <p className="text-[10px] text-[#71717A] uppercase tracking-widest mb-1">BEST ATTEMPT RECORD ({activeTrackObj.name})</p>
            
            {currentPR ? (
              <div>
                <div className="text-3xl font-black text-[#00E5FF]">
                  {currentPR.value} <span className="text-sm font-normal text-[#71717A]">{activeTrackObj.unit}</span>
                </div>
                <div className="mt-3 text-xs space-y-1 text-[#71717A]">
                  <div>Tier Achieved: <strong className="text-[#E4E4E7]">{currentPR.tierName}</strong></div>
                  <div>RPE Logged: <strong className="text-[#FFB100]">{currentPR.rpe}</strong></div>
                  <div>Date Recorded: <span className="font-mono text-[#00E5FF]">{currentPR.date}</span></div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#71717A] italic py-4">No PR attempt logged yet for this track. Log your first set below!</div>
            )}
          </div>

          {/* Current Prescribed Target */}
          <div className="bg-[#18181B] border border-[#27272A] p-5">
            <p className="text-[10px] text-[#71717A] uppercase tracking-widest mb-1">AUTOREGULATED ACTIVE TARGET</p>
            <div className="text-xl font-bold text-[#E4E4E7] uppercase">{currentTier.name}</div>
            <div className="mt-4 flex gap-4">
              <div className="border border-[#27272A] p-2 flex-1 bg-[#121215]">
                <p className="text-[9px] text-[#71717A] uppercase">Prescribed Volume</p>
                <p className="text-lg font-bold text-[#00E5FF]">{currentTier.target} {activeTrackObj.unit}</p>
              </div>
              <div className="border border-[#FFB100]/30 p-2 flex-1 bg-[#FFB100]/5">
                <p className="text-[9px] text-[#FFB100] uppercase">Edge RPE Window</p>
                <p className="text-lg font-bold text-[#FFB100]">8.5 – 9.0</p>
              </div>
            </div>
          </div>

        </div>

        {/* Session Log Form */}
        <form onSubmit={handleLogSession} className="bg-[#18181B] border border-[#27272A] p-5">
          <h3 className="text-xs font-bold uppercase text-[#00E5FF] tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" /> Log {currentTier.name} Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[10px] uppercase text-[#71717A] mb-1">
                Achieved ({activeTrackObj.unit})
              </label>
              <input 
                type="number"
                step="0.5"
                required
                value={performanceValue}
                onChange={e => setPerformanceValue(e.target.value)}
                placeholder={`Target: ${currentTier.target}`}
                className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#00E5FF] text-[#E4E4E7] p-2.5 text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#71717A] mb-1">
                Logged RPE Effort
              </label>
              <select
                value={rpeValue}
                onChange={e => setRpeValue(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#00E5FF] text-[#E4E4E7] p-2.5 text-xs font-mono outline-none"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0].map(r => (
                  <option key={r} value={r}>RPE {r.toFixed(1)} {r >= 9 ? '(Maximum Edge)' : r <= 8 ? '(Submaximal)' : ''}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#00E5FF] hover:bg-white text-[#09090B] font-bold p-2.5 text-xs uppercase tracking-wider transition-all"
            >
              Log & Autoregulate
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

function PencilPaperMathModule({ status, setStatus, showNotification }) {
  const [expandedId, setExpandedId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'Linear Algebra', 'Signal Processing', 'Information Theory', 'Boolean Algebra', 'Discrete Recurrences'];

  const filteredProblems = categoryFilter === 'ALL' 
    ? PENCIL_PAPER_MATH 
    : PENCIL_PAPER_MATH.filter(p => p.category === categoryFilter);

  const toggleMastered = (id) => {
    setStatus(prev => {
      const isMastered = !prev[id];
      showNotification(isMastered ? 'Problem status updated: MASTERED' : 'Problem reset to pending.', 'cyan');
      return { ...prev, [id]: isMastered };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
              categoryFilter === cat 
                ? 'bg-[#00E5FF] text-[#09090B] border-[#00E5FF]' 
                : 'bg-[#121215] text-[#71717A] border-[#27272A] hover:text-[#E4E4E7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Problem Cards */}
      <div className="space-y-4">
        {filteredProblems.map(prob => {
          const isMastered = !!status[prob.id];
          const isExpanded = expandedId === prob.id;

          return (
            <div 
              key={prob.id}
              className={`bg-[#121215] border transition-all ${
                isMastered ? 'border-[#00E5FF]/40' : 'border-[#27272A]'
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 border border-[#00E5FF]/30 text-[#00E5FF] bg-[#00E5FF]/5 uppercase font-bold">
                      {prob.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 border border-[#FFB100]/30 text-[#FFB100] uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {prob.estimatedTime}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleMastered(prob.id)}
                    className={`text-xs font-bold uppercase px-3 py-1 border flex items-center gap-1.5 transition-all ${
                      isMastered 
                        ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]' 
                        : 'bg-[#18181B] text-[#71717A] border-[#27272A] hover:text-[#E4E4E7]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isMastered ? 'Solved & Verified' : 'Mark Solved'}
                  </button>
                </div>

                <h3 className="text-lg font-bold text-[#E4E4E7] mb-1">{prob.title}</h3>
                <p className="text-xs text-[#00E5FF] font-semibold mb-3">Concept: {prob.concept}</p>

                {/* Pencil & Paper Problem Statement Box */}
                <div className="bg-[#09090B] border border-[#27272A] p-4 text-xs font-mono text-[#E4E4E7] leading-relaxed whitespace-pre-wrap mb-4">
                  <span className="text-[#FFB100] font-bold block mb-2 uppercase">📝 Pencil & Paper Problem Directive:</span>
                  {prob.problemStatement}
                </div>

                {/* Solution Toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : prob.id)}
                  className="text-xs font-bold text-[#00E5FF] hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {isExpanded ? 'Hide Step-by-Step Written Derivation' : 'Show Step-by-Step Written Derivation'}
                </button>

                {/* Step-by-Step Breakdown */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#27272A] space-y-4">
                    <div className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">
                      Handwritten Mathematical Derivation Steps
                    </div>

                    {prob.stepByStepDerivation.map((stepItem, idx) => (
                      <div key={idx} className="bg-[#09090B] border border-[#27272A] p-4 text-xs font-mono">
                        <div className="text-[#FFB100] font-bold mb-2 uppercase">{stepItem.step}</div>
                        <div className="text-[#E4E4E7] leading-relaxed whitespace-pre-wrap">{stepItem.content}</div>
                      </div>
                    ))}

                    {/* Final Answer Check Box */}
                    <div className="bg-[#00E5FF]/10 border border-[#00E5FF] p-4 text-xs font-mono">
                      <div className="text-[#00E5FF] font-bold uppercase mb-1">✓ Boxed Final Numerical/Symbolic Answer:</div>
                      <div className="text-white font-bold">{prob.finalAnswer}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

function EnhancedMobilityModule({ checks, setChecks, onCompleteAll }) {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval = null;
    if (activeTimer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeTimer) {
      setActiveTimer(null);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timeLeft]);

  const toggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startTimer = (id, seconds) => {
    setActiveTimer(id);
    setTimeLeft(seconds);
  };

  const allCompleted = ENHANCED_MOBILITY_ROUTINE.every(item => checks[item.id]);

  return (
    <div className="space-y-6">
      
      <div className="bg-[#121215] border border-[#27272A] p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#00E5FF] uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00E5FF]" /> Daily Biomechanical Mobility Protocol
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            Joint articulation, pelvic alignment, and tendon strain tolerance.
          </p>
        </div>

        <button
          onClick={onCompleteAll}
          disabled={!allCompleted}
          className={`px-6 py-3 border text-xs font-bold uppercase tracking-wider transition-all ${
            allCompleted 
              ? 'bg-[#00E5FF] text-[#09090B] border-[#00E5FF] hover:bg-white' 
              : 'bg-[#18181B] text-[#71717A] border-[#27272A] cursor-not-allowed opacity-50'
          }`}
        >
          Check Off Mobility Pillar
        </button>
      </div>

      <div className="space-y-4">
        {ENHANCED_MOBILITY_ROUTINE.map(item => {
          const isChecked = !!checks[item.id];
          const isTimerRunning = activeTimer === item.id;

          return (
            <div 
              key={item.id}
              className={`bg-[#121215] border p-5 transition-all ${
                isChecked ? 'border-[#00E5FF]/40 bg-[#00E5FF]/5' : 'border-[#27272A]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => toggleCheck(item.id)}
                    className="mt-1 text-[#00E5FF]"
                  >
                    {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-[#71717A]" />}
                  </button>
                  <div>
                    <h3 className={`font-bold text-base ${isChecked ? 'line-through text-[#71717A]' : 'text-[#E4E4E7]'}`}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#00E5FF]">{item.target}</p>
                    <p className="text-[11px] text-[#71717A] mt-1">Target Muscle Focus: <strong className="text-[#E4E4E7]">{item.targetMuscles}</strong></p>
                  </div>
                </div>

                {/* Countdown Timer Button */}
                <div className="flex items-center gap-2">
                  {isTimerRunning ? (
                    <div className="flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF] px-4 py-2 text-xs text-[#00E5FF] font-bold">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>HOLD TIMER: {timeLeft}s</span>
                      <button onClick={() => setActiveTimer(null)} className="ml-2 text-white hover:text-[#00E5FF]">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTimer(item.id, item.holdSeconds)}
                      className="flex items-center gap-1.5 text-xs bg-[#18181B] hover:bg-[#00E5FF] hover:text-[#09090B] text-[#00E5FF] border border-[#00E5FF]/30 px-4 py-2 transition-all font-bold uppercase"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Timer ({item.holdSeconds}s)
                    </button>
                  )}
                </div>
              </div>

              {/* Setup Instructions & Biomechanical Cues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#09090B] p-4 border border-[#27272A]">
                <div>
                  <span className="text-[#FFB100] font-bold block mb-1 uppercase">🛠️ Biomechanical Setup:</span>
                  <p className="text-[#71717A] leading-relaxed">{item.setup}</p>
                  <span className="text-[#00E5FF] font-bold block mt-3 mb-1 uppercase">🫁 Breathing Cadence:</span>
                  <p className="text-[#E4E4E7]">{item.breathing}</p>
                </div>

                <div>
                  <span className="text-[#00E5FF] font-bold block mb-1 uppercase">🎯 Key Execution Cues:</span>
                  <ul className="space-y-1.5 text-[#E4E4E7]">
                    {item.formCues.map((cue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#00E5FF]">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

function MarkdownSyncModule() {
  const [selectedFile, setSelectedFile] = useState('/progressions/planche.md');
  const [rawMarkdown, setRawMarkdown] = useState(SAMPLE_REPO_MARKDOWNS['/progressions/planche.md']);

  const handleSelectFile = (filepath) => {
    setSelectedFile(filepath);
    setRawMarkdown(SAMPLE_REPO_MARKDOWNS[filepath] || '# File Not Found');
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Explanation Banner */}
      <div className="bg-[#121215] border border-[#00E5FF] p-6">
        <div className="flex items-center gap-3 text-[#00E5FF] font-bold text-lg mb-2 uppercase tracking-wider">
          <GitBranch className="w-6 h-6" /> Static Git Repository Fetch Architecture
        </div>
        <p className="text-xs text-[#E4E4E7] leading-relaxed mb-4">
          When hosted on <strong>GitHub Pages / GitLab Pages</strong>, this SPA performs asynchronous runtime <code className="bg-[#18181B] px-1.5 py-0.5 text-[#00E5FF]">fetch()</code> calls directly against Markdown (<code className="text-[#00E5FF]">.md</code>) files checked into your repository.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-[#09090B] border border-[#27272A] p-3">
            <span className="text-[#00E5FF] font-bold block mb-1">1. Git Repository Storage</span>
            <span className="text-[#71717A]">Files stored directly as static assets inside repo subdirectories (e.g., <code className="text-[#E4E4E7]">/progressions/*.md</code>).</span>
          </div>

          <div className="bg-[#09090B] border border-[#27272A] p-3">
            <span className="text-[#FFB100] font-bold block mb-1">2. Runtime Async Fetch</span>
            <span className="text-[#71717A]">App fetches lookup tables dynamically on startup without needing a server or database.</span>
          </div>

          <div className="bg-[#09090B] border border-[#27272A] p-3">
            <span className="text-[#00E5FF] font-bold block mb-1">3. Frontmatter Lookup</span>
            <span className="text-[#71717A]">Frontmatter metadata & indexable markdown matrices parse automatically to update RPE targets.</span>
          </div>
        </div>
      </div>

      {/* Repo File Explorer Simulation */}
      <div className="bg-[#121215] border border-[#27272A] p-6">
        <h3 className="text-sm font-bold text-[#E4E4E7] uppercase mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#00E5FF]" /> Simulated Repository File Tree
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(SAMPLE_REPO_MARKDOWNS).map(filepath => (
            <button
              key={filepath}
              onClick={() => handleSelectFile(filepath)}
              className={`px-3 py-2 text-xs font-mono border transition-all flex items-center gap-2 ${
                selectedFile === filepath 
                  ? 'bg-[#00E5FF] text-[#09090B] border-[#00E5FF] font-bold' 
                  : 'bg-[#18181B] text-[#71717A] border-[#27272A] hover:text-[#E4E4E7]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> {filepath}
            </button>
          ))}
        </div>

        {/* Markdown Source Preview */}
        <div className="bg-[#09090B] border border-[#27272A] p-4 text-xs font-mono text-[#E4E4E7]">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-2 mb-3 text-[#71717A]">
            <span>FETCH PATH: <strong className="text-[#00E5FF]">{selectedFile}</strong></span>
            <span className="text-[10px] bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 border border-[#00E5FF]/30">STATUS: 200 OK</span>
          </div>

          <pre className="overflow-x-auto text-[#00E5FF] leading-relaxed">
            {rawMarkdown}
          </pre>
        </div>
      </div>

    </div>
  );
}

function DataModule({ pillars, calisthenics, mathStatus, mobilityChecks, simulatedDate, onRestore }) {
  const [jsonInput, setJsonInput] = useState('');

  const exportData = () => {
    const fullBackup = {
      pillars,
      calisthenics,
      mathStatus,
      mobilityChecks,
      backupDate: simulatedDate
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `THE_SYSTEM_BACKUP_${simulatedDate}.json`;
    a.click();
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      onRestore(parsed);
      setJsonInput('');
    } catch(e) {
      alert('Invalid JSON formatting.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#121215] border border-[#27272A] p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#00E5FF] uppercase flex items-center gap-2">
          <Download className="w-5 h-5" /> Export System Telemetry Payload
        </h2>
        <p className="text-xs text-[#71717A]">
          Download state parameters (streaks, PR attempts, solved math problems, daily mobility checks) as JSON to commit directly into your personal repository.
        </p>

        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="bg-[#00E5FF] hover:bg-white text-[#09090B] font-bold px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download JSON Backup
          </button>
        </div>
      </div>

      <div className="bg-[#121215] border border-[#27272A] p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#E4E4E7] uppercase flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#00E5FF]" /> Restore State From JSON Payload
        </h3>
        <textarea
          rows={6}
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder="Paste state JSON snippet here..."
          className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#00E5FF] p-3 text-xs font-mono text-[#E4E4E7] outline-none"
        />
        <button
          onClick={handleImport}
          className="bg-[#18181B] hover:bg-[#00E5FF] hover:text-[#09090B] text-[#00E5FF] border border-[#00E5FF]/40 font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all"
        >
          Import JSON State
        </button>
      </div>
    </div>
  );
}
