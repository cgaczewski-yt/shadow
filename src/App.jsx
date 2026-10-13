import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, CheckCircle2, Circle, AlertTriangle, ShieldAlert,
  BookOpen, Terminal, Activity, Dumbbell, Timer, Play, Pause,
  RotateCcw, FileText, Download, Upload, Check, ChevronRight,
  ChevronLeft, Clock, Zap, Smartphone, RefreshCw, Layers, Sliders, ChevronDown, ChevronUp
} from 'lucide-react';

/* ============================================================================
   iOS Audio Session Manager (Bypasses Silent/Ringer Switch)
   ============================================================================ */
class SystemAudio {
  constructor() {
    this.audioCtx = null;
  }
  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      const unlock = () => {
        this.audioCtx.resume().then(() => {
          document.removeEventListener('touchstart', unlock);
          document.removeEventListener('click', unlock);
        });
      };
      document.addEventListener('touchstart', unlock, { once: true });
      document.addEventListener('click', unlock, { once: true });
    }
  }
  playSound(type = 'beep') {
    this.init();
    try {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type === 'complete' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(type === 'complete' ? 880 : 440, this.audioCtx.currentTime);
      if (type === 'complete') {
        osc.frequency.exponentialRampToValueAtTime(1760, this.audioCtx.currentTime + 0.15);
      }
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}
const systemAudio = new SystemAudio();

export default function App() {
  // --- Local Timezone Date Helper ---
  const getLocalDateString = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();

  // --- State Initialization ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Pillars State
  const [pillars, setPillars] = useState(() => {
    const saved = localStorage.getItem('shadow_pillars_v1');
    if (saved) return JSON.parse(saved);
    return {
      workout: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      reading: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      creativity: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      math: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      mobility: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
    };
  });

  const [lastSavedDate, setLastSavedDate] = useState(() => {
    return localStorage.getItem('shadow_last_date_v1') || todayStr;
  });

  const [timeLeftToday, setTimeLeftToday] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const wakeLockRef = useRef(null);

  // Math Problem Set State
  const [mathProblems, setMathProblems] = useState([]);
  const [currentMathIndex, setCurrentMathIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [mathLoading, setMathLoading] = useState(true);

  // Mobility Module State
  const [mobilityLibrary, setMobilityLibrary] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState({
    neck: true,
    upper_back: true,
    lower_back: true,
    legs: true,
    arms: true
  });
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(12);
  const [activeRoutine, setActiveRoutine] = useState([]);
  const [mobilityTimer, setMobilityTimer] = useState({ active: false, secondsLeft: 60, total: 60, currentStretchName: '' });

  // Calisthenics HUD Timer & Mode State
  const [caliTimerMode, setCaliTimerMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [caliTimer, setCaliTimer] = useState({ active: false, seconds: 30, initialSeconds: 30, activeSkill: '' });
  const [manualInputSec, setManualInputSec] = useState('30');
  const [selectedCaliSkill, setSelectedCaliSkill] = useState('planche');

  // Supporting Strength Exercises & Expansion State
  const [supportingExercises, setSupportingExercises] = useState({
    planche: [
      "Pseudo Planche Lean Holds: Straight-arm protraction with maximum forward shoulder lean.",
      "Hollow Body Rocks: Core anti-extension stability and pelvic tilt conditioning.",
      "Scapular Protraction Push-Ups: Serratus anterior isolating push-ups with locked elbows at full extension.",
      "Dumbbell Zanetti Presses: Forward shoulder raises lying prone to condition the anterior deltoids and biceps tendon."
    ],
    frontLever: [
      "Dragon Flags: Anti-extension posterior core strength and lower back stability.",
      "Straight-Arm Lat Pulldowns: Straight-arm lat tension and scapular depressor conditioning.",
      "Weighted Inverted Rows: Mid-back and posterior deltoid hypertrophy under heavy horizontal load.",
      "Hanging Leg Raises / L-Sits: Hip flexor compression and lower abdominal strength."
    ],
    backLever: [
      "German Hangs: Bicep tendon and shoulder anterior capsule loaded flexibility.",
      "Skin the Cat: Active shoulder girdle rotation under load.",
      "Scapular Pull-Ups: Lat activation and active hang strength.",
      "Reverse Hyperextensions: Lower back and glute posterior chain endurance."
    ],
    humanFlag: [
      "Side Plank Hip Abduction: Oblique and lateral core stabilizer endurance.",
      "Vertical Flag Negatives: Unilateral shoulder adduction eccentric control.",
      "Dumbbell Side Bends: Oblique hypertrophy and spinal lateral flexion strength.",
      "Windshield Wipers: Core rotational torque and anti-rotation stability."
    ],
    oneArmPullup: [
      "One-Arm Lockoffs (90° & Top): Isometric bicep and brachialis strength at the sticking point.",
      "Weighted Pull-Ups: Heavy bilateral lat strength foundation to build raw pulling capacity.",
      "One-Arm Scapular Pull-Ups: Unilateral scapular depressor strength from a dead hang.",
      "Bicep Hammer Curls: Elbow flexor and brachioradialis strengthening for elbow health under unilateral torque."
    ],
    hspu: [
      "Overhead Dumbbell / Barbell Press: Heavy deltoid and triceps vertical pressing power.",
      "Pike Push-Up Deficit Shrugs: Scapular elevation and trapezius strength at lockout.",
      "Wall-Supported Handstand Holds: Overhead scapular stability and shoulder endurance.",
      "Triceps Overhead Extension: Long-head triceps isolation to strengthen elbow extension."
    ],
    muscleUp: [
      "Explosive Chest-to-Bar Pull-Ups: High pull power and transition velocity.",
      "Straight-Bar Dips: Transition and pushout strength endurance.",
      "Jumping Ring Muscle-Ups: Practicing the fluid turnover trajectory under reduced load.",
      "L-Sit Pull-Ups: Core tension during vertical pulling mechanics."
    ],
    ironCross: [
      "Ring Turn-Out Support Holds: Pectoral and rotator cuff stabilizer strength.",
      "Cross Pull-Downs with Bands: Isolating the adductor torque required for the cross.",
      "Rings Bulgarian Dips: Deep chest and triceps ring pressing power.",
      "Weighted Ring Push-Ups: Pectoral and serratus pressing foundation."
    ],
    maltese: [
      "Wide-Arm Planche Leans: Anterior deltoid lateral torque conditioning.",
      "Incline Maltese Band Pulls: Scaled horizontal abduction strength.",
      "Weighted Dips with Forward Lean: Lower pectoral and shoulder girdle strength.",
      "Straight-Arm Cable Flyes: Isolated pectoral tension throughout the range of motion."
    ],
    vSit: [
      "Pike Compression Lifts: Hip flexor and rectus abdominis shortening strength.",
      "L-Sit Flutter Kicks: Lower abdominal endurance under static hip flexion.",
      "Parallette Press-Ups: Deep compression pressing power.",
      "Seated Leg Lifts over Objects: Active hip flexor height and control."
    ],
    lSitPress: [
      "Puck Lifts in L-Sit: Triceps and compression separation strength.",
      "Straddle Compression Pulses: Inner thigh and hip flexor active flexibility.",
      "Wall-Supported Press Negatives: Controlled eccentric lowering from handstand to L-sit.",
      "Pike Push-Ups: Overhead and shoulder pressing strength."
    ],
    frontLeverRow: [
      "Weighted Inverted Rows: Heavy mid-back and rhomboid loading.",
      "Tuck Front Lever Pulls: Dynamic latissimus engagement.",
      "Straight-Arm Pullovers: Lat and serratus dynamic power.",
      "Barbell Pendlay Rows: Raw explosive pulling power."
    ],
    planchePushup: [
      "Pseudo Planche Push-Ups: Bent-arm pushing mechanics with forward lean.",
      "Decline Push-Ups: Upper chest and anterior deltoid overload.",
      "Hollow Body Push-Ups: Core rigidity during pressing.",
      "Triceps Diamond Push-Ups: Elbow extension strength."
    ],
    archerPullup: [
      "Unilateral Side-to-Side Pull-Ups: Shifting load dynamically across the upper body.",
      "Assisted One-Arm Negatives: Eccentric unilateral pulling strength.",
      "Wide Grip Pull-Ups: Lat width and upper back recruitment.",
      "Bicep Concentration Curls: Elbow flexor isolation."
    ],
    pistolSquat: [
      "Box Pistol Squats: Depth and knee tracking control.",
      "Cossack Squats: Lateral leg mobility and unilateral ankle stability.",
      "Bulgarian Split Squats: Single-leg quad and glute hypertrophy.",
      "Calf Raises: Ankle plantarflexion strength."
    ],
    nordicCurl: [
      "Romanian Deadlifts: Hamstring posterior chain loading.",
      "Glute-Ham Raises: Knee flexion strength and hip extension integration.",
      "Swiss Ball Hamstring Curls: High-rep hamstring endurance.",
      "Good Mornings: Erector spinae and hip hinge strength."
    ],
    dragonFlag: [
      "Hanging Leg Raises: Lower abdominal compression.",
      "Reverse Crunches on Incline: Lower spine articulation and core strength.",
      "Plank Body Saws: Anti-extension core stability.",
      "Hollow Body Holds: Isometric core endurance."
    ],
    frontLeverRaise: [
      "Straight-Arm Scapular Pulls: Lat depressor strength.",
      "Inverted Hang Pull-Overs: Full range lat and teres major conditioning.",
      "Weighted Pull-Ups: Raw pulling strength.",
      "Chest-to-Bar Pull-Ups: Upper back peak contraction."
    ],
    ringDips: [
      "Weighted Dips: Chest and triceps pressing foundation.",
      "Ring Support Holds: Scapular depression and elbow lockout stability.",
      "Bulgarian Ring Push-Ups: Pectoral stabilization.",
      "Triceps Pushdowns: Isolation strength."
    ],
    freestandingHS: [
      "Wall Handstand Shoulder Shrugs: Trapezius and serratus elevation.",
      "Bail-Out Cartwheel Practice: Safety and spatial awareness.",
      "Crow Pose / Frog Stand: Balance and wrist conditioning.",
      "Plank to Pike Transitions: Shoulder mobility and core integration."
    ],
    oneArmPushup: [
      "Archer Push-Ups: Unilateral pressing bias.",
      "Decline One-Arm Push-Ups: Increased pressing load.",
      "Weighted Push-Ups: Pectoral and triceps overload.",
      "Plank Shoulder Taps: Anti-rotation core stability."
    ],
    deg90HSPU: [
      "Freestanding HSPU Negatives: Controlled eccentric vertical descent.",
      "Weighted Pike Push-Ups: Overload vertical pressing.",
      "Press to Handstand: Transition strength from floor to vertical.",
      "Handstand Pirouettes: Overhead balance adjustments."
    ],
    ringRollouts: [
      "Ab Wheel Rollouts: Anti-extension core overload.",
      "Long-Lever Planks: Deep transverse abdominis engagement.",
      "Hanging Windshield Wipers: Oblique rotational strength.",
      "Dead Bugs: Core coordination and stability."
    ],
    frontLeverPulls: [
      "Weighted Inverted Rows: Mid-back pulling power.",
      "Chest-to-Bar Pull-Ups: Upper range of motion pulling.",
      "Straight-Arm Lat Pulldowns: Latissimus dorsi isolation.",
      "Face Pulls: Rear delt and external rotator health."
    ],
    declinePikeHSPU: [
      "Elevated Feet Pike Push-Ups: High-angle shoulder pressing.",
      "Dumbbell Z-Press: Sitting overhead pressing with zero leg drive.",
      "Wall Handstand Push-Ups: Full vertical range of motion.",
      "Lateral Raises: Deltoid hypertrophy."
    ]
  });

  const [expandedSupporting, setExpandedSupporting] = useState({
    planche: false,
    frontLever: false,
    backLever: false,
    humanFlag: false,
    oneArmPullup: false,
    hspu: false,
    muscleUp: false,
    ironCross: false,
    maltese: false,
    vSit: false,
    lSitPress: false,
    frontLeverRow: false,
    planchePushup: false,
    archerPullup: false,
    pistolSquat: false,
    nordicCurl: false,
    dragonFlag: false,
    frontLeverRaise: false,
    ringDips: false,
    freestandingHS: false,
    oneArmPushup: false,
    deg90HSPU: false,
    ringRollouts: false,
    frontLeverPulls: false,
    declinePikeHSPU: false
  });

  // KaTeX Renderer Trigger
  useEffect(() => {
    if (activeTab === 'math' && window.renderMathInElement) {
      const mathContainer = document.getElementById('math-quest-container');
      if (mathContainer) {
        window.renderMathInElement(mathContainer, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
    }
  }, [activeTab, currentMathIndex, showSolution, mathLoading]);

  // Calisthenics Tracks State (All 25 Skills)
  const [caliTracks, setCaliTracks] = useState(() => {
    const saved = localStorage.getItem('shadow_cali_tracks_v2');
    if (saved) return JSON.parse(saved);
    return {
      planche: { name: 'Planche Progression', category: 'Push / Isometrics', ladder: ['Frog Stand', 'Tuck Planche', 'Advanced Tuck Planche', 'Straddle Planche', 'Full Planche'], currentIndex: 1, pr: '10s @ RPE 8.5', history: [] },
      frontLever: { name: 'Front Lever Progression', category: 'Pull / Isometrics', ladder: ['Tuck Front Lever', 'Advanced Tuck Front Lever', 'Single Leg Front Lever', 'Straddle Front Lever', 'Full Front Lever'], currentIndex: 1, pr: '12s @ RPE 9.0', history: [] },
      backLever: { name: 'Back Lever Progression', category: 'Pull / Isometrics', ladder: ['Tuck Back Lever', 'Advanced Tuck Back Lever', 'Straddle Back Lever', 'Full Back Lever'], currentIndex: 1, pr: '15s @ RPE 8.0', history: [] },
      humanFlag: { name: 'Human Flag Progression', category: 'Lateral Core / Isometrics', ladder: ['Vertical Flag Hold', 'Tuck Human Flag', 'Straddle Human Flag', 'Full Human Flag'], currentIndex: 1, pr: '8s @ RPE 9.0', history: [] },
      oneArmPullup: { name: 'One-Arm Pull-Up', category: 'Pull / Unilateral', ladder: ['Archer Pull-Ups', 'Assisted 1APU (Band)', 'Eccentric 1APU Lockoffs', 'Full One-Arm Pull-Up'], currentIndex: 1, pr: '2 reps @ RPE 8.5', history: [] },
      hspu: { name: 'Handstand Push-Up', category: 'Push / Vertical', ladder: ['Pike Push-Ups', 'Wall-Supported HSPU', 'Deficit Wall HSPU', 'Freestanding HSPU'], currentIndex: 1, pr: '5 reps @ RPE 9.0', history: [] },
      muscleUp: { name: 'Muscle-Up (Bar/Ring)', category: 'Explosive / Transition', ladder: ['High Chest Pull-ups', 'Jumping Muscle-Ups', 'Strict Bar Muscle-Up', 'Strict Ring Muscle-Up'], currentIndex: 2, pr: '3 reps @ RPE 8.0', history: [] },
      ironCross: { name: 'Iron Cross (Rings)', category: 'Rings / Isometrics', ladder: ['Cross Band Pulls', 'Cross Lockoffs (Feet Down)', 'Cross Negatives', 'Full Iron Cross'], currentIndex: 0, pr: '5s @ RPE 9.5', history: [] },
      maltese: { name: 'Maltese Cross', category: 'Rings / Isometrics', ladder: ['Incline Maltese Hold', 'Floor Maltese Press', 'Maltese Negatives', 'Full Maltese'], currentIndex: 0, pr: '3s @ RPE 9.5', history: [] },
      vSit: { name: 'V-Sit / Manna', category: 'Compression / Core', ladder: ['Tuck L-Sit', 'Full L-Sit', 'V-Sit (45 deg)', 'Manna Progression'], currentIndex: 1, pr: '12s @ RPE 8.0', history: [] },
      lSitPress: { name: 'Press to Handstand', category: 'Balance / Compression', ladder: ['Puck Press Negatives', 'Straddle Press from Floor', 'L-Sit Press to Handstand', 'Stallion Press'], currentIndex: 0, pr: '1 rep @ RPE 9.0', history: [] },
      frontLeverRow: { name: 'Front Lever Touch Rows', category: 'Pull / Hypertrophy', ladder: ['Tuck FL Rows', 'Adv Tuck FL Rows', 'Straddle FL Touch Rows', 'Full FL Touch Rows'], currentIndex: 1, pr: '6 reps @ RPE 8.5', history: [] },
      planchePushup: { name: 'Planche Push-Ups', category: 'Push / Hypertrophy', ladder: ['Planche Lean Push-ups', 'Tuck Planche Push-ups', 'Adv Tuck Planche Push-ups', 'Straddle Planche Push-ups'], currentIndex: 0, pr: '8 reps @ RPE 8.5', history: [] },
      archerPullup: { name: 'Archer Pull-Ups & Push-Ups', category: 'Unilateral Strength', ladder: ['Assisted Archer Pulls', 'Strict Archer Pull-Ups', 'Weighted Archer Pull-Ups', 'One-Arm Archer'], currentIndex: 1, pr: '8 reps @ RPE 8.0', history: [] },
      pistolSquat: { name: 'Pistol Squat Progression', category: 'Legs / Unilateral', ladder: ['Box Pistol Squats', 'Counterbalance Pistols', 'Full Pistol Squats', 'Weighted Pistol Squats'], currentIndex: 2, pr: '10 reps @ RPE 8.0', history: [] },
      nordicCurl: { name: 'Nordic Hamstring Curl', category: 'Legs / Posterior Chain', ladder: ['Band-Assisted Nordics', 'Eccentric Nordics (5s)', 'Full Nordic Curls', 'Weighted Nordics'], currentIndex: 1, pr: '5 reps @ RPE 9.0', history: [] },
      dragonFlag: { name: 'Dragon Flag', category: 'Core / Posterior Chain', ladder: ['Tuck Dragon Flag', 'Straddle Dragon Flag', 'Full Straight Dragon Flag', 'Weighted Dragon Flag'], currentIndex: 1, pr: '8 reps @ RPE 8.5', history: [] },
      frontLeverRaise: { name: 'Front Lever Raises (Bevels)', category: 'Pull / Dynamic', ladder: ['Tuck FL Raises', 'Adv Tuck FL Raises', 'Straddle FL Raises', 'Full FL Raises'], currentIndex: 0, pr: '4 reps @ RPE 9.0', history: [] },
      ringDips: { name: 'Ring Dips (Strict & Weighted)', category: 'Push / Dips', ladder: ['Support Hold (Rings)', 'Strict Ring Dips', 'Deep Ring Dips', 'Weighted Ring Dips'], currentIndex: 1, pr: '12 reps @ RPE 8.0', history: [] },
      freestandingHS: { name: 'Freestanding Handstand', category: 'Balance / Skill', ladder: ['Chest-to-Wall Hold', 'Kick-up Balance Drills', 'Freestanding Hold (30s)', 'Handstand Walk'], currentIndex: 1, pr: '25s @ RPE 8.0', history: [] },
      oneArmPushup: { name: 'One-Arm Push-Up', category: 'Push / Unilateral', ladder: ['Elevated OAPU', 'Floor OAPU (Feet Wide)', 'Strict OAPU (Feet Together)', 'Deficit OAPU'], currentIndex: 1, pr: '10 reps @ RPE 8.0', history: [] },
      deg90HSPU: { name: '90-Degree Handstand Push-Up', category: 'Push / Advanced', ladder: ['Pike 90-Deg Press', 'Wall 90-Deg HSPU', 'Negative 90-Deg HSPU', 'Full 90-Deg HSPU'], currentIndex: 0, pr: '2 reps @ RPE 9.5', history: [] },
      ringRollouts: { name: 'Ring Ab Rollouts', category: 'Core / Anti-Extension', ladder: ['Incline Ring Rollouts', 'Floor Kneeling Rollouts', 'Standing Rollouts (Knees)', 'Full Standing Ring Rollouts'], currentIndex: 1, pr: '10 reps @ RPE 8.5', history: [] },
      frontLeverPulls: { name: 'Front Lever Pulls', category: 'Pull / Power', ladder: ['Inverted Pulls', 'Tuck FL Pulls', 'Adv Tuck FL Pulls', 'Full FL Pulls'], currentIndex: 1, pr: '8 reps @ RPE 8.5', history: [] },
      declinePikeHSPU: { name: 'Decline Pike HSPU', category: 'Push / Vertical', ladder: ['Pike Push-ups', 'Elevated Feet Pike', 'Box HSPU', 'Decline Deficit HSPU'], currentIndex: 1, pr: '8 reps @ RPE 8.5', history: [] }
    };
  });

  const [caliInputs, setCaliInputs] = useState({
    performance: '',
    rpe: '8.5'
  });

  // --- Fetch Mobility Markdown Library ---
  useEffect(() => {
    async function fetchMobilityData() {
      try {
        const baseUrl = import.meta.env.BASE_URL || './';
        const response = await fetch(`${baseUrl}stretches/daily_mobility.md`);
        if (!response.ok) return;
        const text = await response.text();
        const rawBlocks = text.split(/(?=##\s+Stretch:)/g).filter(b => b.trim().length > 0);

        const parsed = rawBlocks.map(block => {
          if (!block.includes('### Body Part')) return null;

          const lines = block.trim().split('\n');
          const name = lines[0] ? lines[0].replace(/^##\s+Stretch:\s*/, '').trim() : 'Stretch';

          const getSection = (marker) => {
            const idx = block.indexOf(marker);
            if (idx === -1) return '';
            const start = idx + marker.length;
            const rest = block.substring(start);
            const nextIdx = rest.search(/###|\n\n/);
            return (nextIdx === -1 ? rest : rest.substring(0, nextIdx)).trim();
          };

          const bodyPart = getSection('### Body Part').toLowerCase() || 'legs';
          const defaultTime = getSection('### Default Time') || '60s';
          const focus = getSection('### Focus') || '';
          const cues = getSection('### Cues') || '';

          const timeInSeconds = parseInt(defaultTime.replace(/\D/g, ''), 10) || 60;

          return { name, bodyPart, defaultTime, timeInSeconds, focus, cues };
        }).filter(Boolean);

        setMobilityLibrary(parsed);
        generateRoutine(parsed, { neck: true, upper_back: true, lower_back: true, legs: true, arms: true }, 12);
      } catch (err) {
        console.warn('Error reading daily_mobility.md:', err);
      }
    }
    fetchMobilityData();
  }, []);

  // --- Generate Random Routine Based on Target Parts & Duration ---
  const generateRoutine = (library = mobilityLibrary, activeParts = selectedBodyParts, targetMinutes = targetDurationMinutes) => {
    const enabledTags = Object.keys(activeParts).filter(k => activeParts[k]);
    if (enabledTags.length === 0 || library.length === 0) {
      setActiveRoutine([]);
      return;
    }

    const matchingPool = library.filter(s => enabledTags.includes(s.bodyPart));
    if (matchingPool.length === 0) {
      setActiveRoutine([]);
      return;
    }

    const targetSec = targetMinutes * 60;
    let selected = [];
    let currentSec = 0;

    const shuffled = [...matchingPool].sort(() => 0.5 - Math.random());

    let i = 0;
    while (currentSec < targetSec && selected.length < 12) {
      const item = shuffled[i % shuffled.length];
      selected.push(item);
      currentSec += item.timeInSeconds;
      i++;
    }

    setActiveRoutine(selected);
  };

  // --- Fetch Math Problems Markdown ---
  useEffect(() => {
    async function fetchMathProblems() {
      try {
        const baseUrl = import.meta.env.BASE_URL || './';
        const response = await fetch(`${baseUrl}math/paper_problem_sets.md`);
        if (!response.ok) return;
        const text = await response.text();
        const rawBlocks = text.split(/(?=##\s+Problem)/g).filter(b => b.trim().length > 0);

        const parsed = rawBlocks.map((block, idx) => {
          const lines = block.trim().split('\n');
          const titleLine = lines.find(l => l.startsWith('## ')) || lines[0] || `Problem ${idx + 1}`;
          const title = titleLine.replace(/^##\s*/, '').trim();

          const getSection = (startMarker, endMarkers) => {
            const startIndex = block.indexOf(startMarker);
            if (startIndex === -1) return '';
            const contentStart = startIndex + startMarker.length;
            let endIndex = block.length;
            for (const em of endMarkers) {
              const emIndex = block.indexOf(em, contentStart);
              if (emIndex !== -1 && emIndex < endIndex) {
                endIndex = emIndex;
              }
            }
            return block.substring(contentStart, endIndex).trim();
          };

          const category = getSection('### Category', ['### Concept', '### Statement', '### Paper Derivation & Solution']);
          const concept = getSection('### Concept', ['### Statement', '### Paper Derivation & Solution']);
          const statement = getSection('### Statement', ['### Paper Derivation & Solution']);
          const solution = getSection('### Paper Derivation & Solution', []);

          return {
            id: idx + 1,
            title: title,
            domain: category || 'Engineering Math',
            concept: concept || '',
            problem: statement || block,
            solution: solution || 'Derivation available on scratchpad.'
          };
        }).filter(p => p.problem.length > 0);

        if (parsed.length > 0) {
          setMathProblems(parsed);
          const dateSeed = parseInt(todayStr.replace(/-/g, ''), 10);
          const dailyIndex = dateSeed % parsed.length;
          setCurrentMathIndex(dailyIndex);
        }
      } catch (err) {
        console.warn('Error fetching paper_problem_sets.md:', err);
      } finally {
        setMathLoading(false);
      }
    }
    fetchMathProblems();
  }, [todayStr]);

  const handleRegenerateProblem = () => {
    systemAudio.playSound('beep');
    setShowSolution(false);
    if (mathProblems.length === 0) return;
    let nextIndex = currentMathIndex;
    if (mathProblems.length > 1) {
      while (nextIndex === currentMathIndex) {
        nextIndex = Math.floor(Math.random() * mathProblems.length);
      }
    }
    setCurrentMathIndex(nextIndex);
  };

  // --- Auto Date Rollover Effect ---
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const night = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = night.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeftToday({ hours, minutes, seconds });
      }

      const currentLocalDate = getLocalDateString(now);
      if (currentLocalDate !== lastSavedDate) {
        setPillars(prev => {
          const updated = {};
          Object.keys(prev).forEach(key => {
            const p = prev[key];
            let misses = p.consecutiveMisses;
            if (!p.completedToday && p.lastCompleted !== lastSavedDate) {
              misses += 1;
            }
            let status = 'ACTIVE';
            let streak = p.streak;
            if (misses === 1) status = 'WARNING';
            else if (misses === 2) status = 'CRITICAL';
            else if (misses >= 3) {
              status = 'BROKEN';
              streak = 0;
            }
            updated[key] = {
              ...p,
              consecutiveMisses: misses,
              status,
              streak,
              completedToday: false
            };
          });
          return updated;
        });
        setLastSavedDate(currentLocalDate);
        localStorage.setItem('shadow_last_date_v1', currentLocalDate);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [lastSavedDate]);

  useEffect(() => {
    localStorage.setItem('shadow_pillars_v1', JSON.stringify(pillars));
    localStorage.setItem('shadow_cali_tracks_v2', JSON.stringify(caliTracks));

    const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;
    if ('setAppBadge' in navigator) {
      if (pendingCount > 0) {
        navigator.setAppBadge(pendingCount).catch(err => console.error(err));
      } else {
        navigator.clearAppBadge().catch(err => console.error(err));
      }
    }
  }, [pillars, caliTracks]);

  const toggleWakeLock = async (enable) => {
    if ('wakeLock' in navigator) {
      try {
        if (enable && !wakeLockRef.current) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } else if (!enable && wakeLockRef.current) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      } catch (err) {
        console.warn('Wake Lock error:', err);
      }
    }
  };

  const togglePillar = (key) => {
    systemAudio.playSound('complete');
    setPillars(prev => {
      const p = prev[key];
      const nextCompleted = !p.completedToday;
      let newStreak = p.streak;
      let newMisses = p.consecutiveMisses;
      let newStatus = p.status;

      if (nextCompleted) {
        newStreak += 1;
        newMisses = 0;
        newStatus = 'ACTIVE';
      } else {
        newStreak = Math.max(0, newStreak - 1);
      }

      return {
        ...prev,
        [key]: {
          ...p,
          completedToday: nextCompleted,
          streak: newStreak,
          consecutiveMisses: newMisses,
          status: newStatus,
          lastCompleted: nextCompleted ? todayStr : p.lastCompleted
        }
      };
    });
  };

  // --- Calisthenics Timer / Stopwatch Interval ---
  useEffect(() => {
    let interval = null;

    if (caliTimer.active) {
      toggleWakeLock(true);
      interval = setInterval(() => {
        setCaliTimer(prev => {
          if (caliTimerMode === 'timer') {
            if (prev.seconds <= 1) {
              systemAudio.playSound('complete');
              toggleWakeLock(false);
              return { ...prev, seconds: 0, active: false };
            }
            return { ...prev, seconds: prev.seconds - 1 };
          } else {
            return { ...prev, seconds: prev.seconds + 1 };
          }
        });
      }, 1000);
    } else {
      toggleWakeLock(false);
    }

    return () => clearInterval(interval);
  }, [caliTimer.active, caliTimerMode]);

  // Mobility Timer Interval
  useEffect(() => {
    let interval = null;
    if (mobilityTimer.active && mobilityTimer.secondsLeft > 0) {
      toggleWakeLock(true);
      interval = setInterval(() => {
        setMobilityTimer(prev => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
      }, 1000);
    } else if (mobilityTimer.secondsLeft === 0 && mobilityTimer.active) {
      systemAudio.playSound('complete');
      setMobilityTimer(prev => ({ ...prev, active: false }));
      toggleWakeLock(false);
    }
    return () => clearInterval(interval);
  }, [mobilityTimer.active, mobilityTimer.secondsLeft]);

  const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;
  const currentProblem = mathProblems[currentMathIndex];
  const activeTrack = caliTracks[selectedCaliSkill];
  const activeSupporting = supportingExercises[selectedCaliSkill] || [];
  const isExpanded = expandedSupporting[selectedCaliSkill] || false;
  const currentStep = activeTrack ? activeTrack.ladder[activeTrack.currentIndex] : '';

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col font-sans select-none">
      
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#09090B]/90 backdrop-blur sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00E5FF] rounded-full animate-pulse glow-cyan" />
              <h1 className="font-mono font-bold tracking-widest text-xl text-white">SHADOW</h1>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono">
              <Smartphone className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-slate-400">Badge:</span>
              <span className={pendingCount > 0 ? "text-[#FFB100] font-bold" : "text-emerald-400 font-bold"}>
                {pendingCount} pending
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-red-950/30 border border-red-500/30 rounded-md font-mono text-xs">
            <Clock className="w-4 h-4 text-[#FF2A5F] animate-pulse" />
            <span className="text-slate-400">RESET IN:</span>
            <span className="text-[#FF2A5F] font-bold text-sm">
              {String(timeLeftToday.hours).padStart(2, '0')}:
              {String(timeLeftToday.minutes).padStart(2, '0')}:
              {String(timeLeftToday.seconds).padStart(2, '0')}
            </span>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'calisthenics', label: 'Calisthenics Hub', icon: Dumbbell },
              { id: 'math', label: 'Math & Logic', icon: Terminal },
              { id: 'mobility', label: 'Mobility Routine', icon: Flame },
              { id: 'architecture', label: 'Git Sync Engine', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { systemAudio.playSound('beep'); setActiveTab(tab.id); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#00E5FF] text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* QUICK CHECK BAR */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-[#FFB100]" /> Quick Check:
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(pillars).map(([key, data]) => {
              const labelMap = { workout: 'Workout', reading: 'Reading', creativity: 'Creativity', math: 'Math', mobility: 'Mobility' };
              return (
                <button
                  key={key}
                  onClick={() => togglePillar(key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-mono transition-all ${
                    data.completedToday
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {data.completedToday ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{labelMap[key]}</span>
                  <span className="text-[10px] bg-slate-950 px-1.5 py-0.2 rounded text-[#00E5FF]">🔥{data.streak}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 flex-1">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">EXECUTION DASHBOARD</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Local Date: {todayStr} | 3-Day Decay Grace Model Active</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pillars).map(([key, data]) => {
                const titleMap = {
                  workout: { name: 'Workout / Calisthenics', icon: Dumbbell },
                  reading: { name: 'Reading & Study', icon: BookOpen },
                  creativity: { name: 'Creativity & Hardware', icon: Terminal },
                  math: { name: 'Math & Deep Work', icon: Zap },
                  mobility: { name: 'Stretching & Mobility', icon: Flame }
                };
                const info = titleMap[key];
                const Icon = info.icon;

                const statusColor =
                  data.status === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                  data.status === 'WARNING' ? 'border-amber-500/30 text-[#FFB100] bg-amber-500/5' :
                  data.status === 'CRITICAL' ? 'border-amber-600/50 text-amber-500 bg-amber-600/10' :
                  'border-red-500/40 text-[#FF2A5F] bg-red-500/10';

                return (
                  <div key={key} className={`p-4 rounded-lg border bg-slate-900/50 flex flex-col justify-between gap-4 transition-all ${statusColor}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[#00E5FF]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-mono font-bold text-sm text-white">{info.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Status: {data.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-2xl font-bold text-white flex items-center justify-end gap-1">
                          <Flame className="w-5 h-5 text-[#FFB100] fill-[#FFB100]" />
                          {data.streak}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Streak Level</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Consecutive Misses:</span>
                        <span className={data.consecutiveMisses > 0 ? "text-[#FFB100] font-bold" : "text-emerald-400"}>
                          {data.consecutiveMisses} / 3 days
                        </span>
                      </div>
                      <button
                        onClick={() => togglePillar(key)}
                        className={`w-full py-2 rounded font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                          data.completedToday
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-[#00E5FF] text-black hover:bg-[#00E5FF]/85'
                        }`}
                      >
                        {data.completedToday ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        {data.completedToday ? 'COMPLETED TODAY' : 'CHECK OFF QUEST'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CALISTHENICS HUB */}
        {activeTab === 'calisthenics' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">CALISTHENICS HUB</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Select from 25 advanced skills to track progressions, supporting strength exercises, and training sets.</p>
            </div>

            {/* STICKY CALISTHENICS TIMER / STOPWATCH HUD WITH MANUAL TIME INPUT */}
            <div className="sticky top-[165px] md:top-[80px] z-40 p-4 rounded-xl border border-[#00E5FF]/40 bg-[#09090B]/95 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">
                      {caliTimer.activeSkill ? `${caliTimer.activeSkill} Hold` : (caliTimerMode === 'timer' ? 'Active Countdown Timer' : 'Active Stopwatch')}
                    </span>

                    {/* Mode Toggle Switch */}
                    <button
                      onClick={() => {
                        const newMode = caliTimerMode === 'timer' ? 'stopwatch' : 'timer';
                        setCaliTimerMode(newMode);
                        setCaliTimer({ active: false, seconds: newMode === 'timer' ? 30 : 0, initialSeconds: 30, activeSkill: '' });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-[#00E5FF]"
                    >
                      {caliTimerMode === 'timer' ? 'Switch to Stopwatch' : 'Switch to Timer'}
                    </button>
                  </div>

                  <div className="text-3xl md:text-4xl font-mono font-bold text-white tracking-wider">
                    {String(Math.floor(caliTimer.seconds / 60)).padStart(2, '0')}:
                    {String(caliTimer.seconds % 60).padStart(2, '0')}
                  </div>
                </div>

                {/* Manual Time Input (Only visible in timer mode) */}
                {caliTimerMode === 'timer' && (
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400">Set (s):</span>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={manualInputSec}
                      onChange={(e) => setManualInputSec(e.target.value)}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white text-center focus:outline-none focus:border-[#00E5FF]"
                    />
                    <button
                      onClick={() => {
                        const val = parseInt(manualInputSec, 10) || 30;
                        setCaliTimer({ active: false, seconds: val, initialSeconds: val, activeSkill: '' });
                        systemAudio.playSound('beep');
                      }}
                      className="px-2 py-1 bg-[#00E5FF] text-black font-mono font-bold text-[10px] rounded hover:bg-[#00E5FF]/85"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => setCaliTimer(prev => ({ ...prev, active: !prev.active }))}
                  className={`px-5 py-2 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition ${
                    caliTimer.active ? 'bg-amber-500 text-black' : 'bg-[#00E5FF] text-black'
                  }`}
                >
                  {caliTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {caliTimer.active ? 'PAUSE' : 'START'}
                </button>
                <button
                  onClick={() => setCaliTimer({ active: false, seconds: caliTimerMode === 'timer' ? caliTimer.initialSeconds : 0, initialSeconds: caliTimer.initialSeconds, activeSkill: '' })}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* DROPDOWN MENU FOR 25 CALISTHENICS SKILLS */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full">
                <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-wider whitespace-nowrap font-bold">Select Skill:</span>
                <select
                  value={selectedCaliSkill}
                  onChange={(e) => setSelectedCaliSkill(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  {Object.entries(caliTracks).map(([key, track]) => (
                    <option key={key} value={key}>
                      {track.name} ({track.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FOCUSED SKILL CARD */}
            {activeTrack && (
              <div className="max-w-3xl mx-auto p-6 rounded-lg border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-6 shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">Category: {activeTrack.category}</span>
                      <h3 className="font-mono font-bold text-lg text-white flex items-center gap-2 mt-0.5">
                        <Dumbbell className="w-5 h-5 text-[#00E5FF]" />
                        {activeTrack.name}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded bg-cyan-950/40 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold">
                      PR: {activeTrack.pr}
                    </span>
                  </div>

                  {/* Progression Step Selector */}
                  <div className="mt-4 p-4 bg-slate-950 rounded border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Active Level Progression:</span>
                      <span className="text-[#00E5FF] font-bold text-sm">{currentStep}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        disabled={activeTrack.currentIndex === 0}
                        onClick={() => {
                          setCaliTracks(prev => ({
                            ...prev,
                            [selectedCaliSkill]: { ...prev[selectedCaliSkill], currentIndex: Math.max(0, prev[selectedCaliSkill].currentIndex - 1) }
                          }));
                        }}
                        className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 flex items-center gap-1 text-xs font-mono"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Level
                      </button>
                      <span className="text-xs font-mono text-slate-500">
                        Level {activeTrack.currentIndex + 1} of {activeTrack.ladder.length}
                      </span>
                      <button
                        disabled={activeTrack.currentIndex === activeTrack.ladder.length - 1}
                        onClick={() => {
                          setCaliTracks(prev => ({
                            ...prev,
                            [selectedCaliSkill]: { ...prev[selectedCaliSkill], currentIndex: Math.min(activeTrack.ladder.length - 1, prev[selectedCaliSkill].currentIndex + 1) }
                          }));
                        }}
                        className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 flex items-center gap-1 text-xs font-mono"
                      >
                        Next Level <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Supporting Strength Exercises Section */}
                  {activeSupporting.length > 0 && (
                    <div className="mt-4 rounded border border-slate-800 bg-slate-950/90 overflow-hidden">
                      <button
                        onClick={() => setExpandedSupporting(prev => ({ ...prev, [selectedCaliSkill]: !prev[selectedCaliSkill] }))}
                        className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-[#FFB100] hover:bg-slate-900 transition"
                      >
                        <span className="font-bold flex items-center gap-2">
                          <span>⚡ Supporting Strength Exercises</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/30">
                            {activeSupporting.length} exercises
                          </span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-2 space-y-2 border-t border-slate-800/80">
                          {activeSupporting.map((item, idx) => (
                            <div key={idx} className="text-xs font-mono text-slate-300 flex items-start gap-2">
                              <span className="text-[#00E5FF] font-bold">•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">Reps / Hold Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 12s or 5 reps"
                        value={caliInputs.performance}
                        onChange={(e) => setCaliInputs(prev => ({ ...prev, performance: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-slate-400 block mb-1">Logged RPE</label>
                      <input
                        type="text"
                        placeholder="e.g. 8.5"
                        value={caliInputs.rpe}
                        onChange={(e) => setCaliInputs(prev => ({ ...prev, rpe: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        systemAudio.playSound('beep');
                        setCaliTimer({ active: true, seconds: 30, initialSeconds: 30, activeSkill: activeTrack.name });
                      }}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-[#00E5FF] font-mono font-bold text-xs rounded border border-[#00E5FF]/30 transition flex items-center justify-center gap-1.5"
                    >
                      <Timer className="w-4 h-4" /> Start Hold Timer (30s)
                    </button>
                    <button
                      onClick={() => {
                        const perf = caliInputs.performance;
                        const rpe = caliInputs.rpe;
                        if (!perf) return;
                        systemAudio.playSound('complete');
                        const logStr = `${perf} @ RPE ${rpe || '8.5'} (${currentStep})`;
                        setCaliTracks(prev => ({
                          ...prev,
                          [selectedCaliSkill]: {
                            ...prev[selectedCaliSkill],
                            pr: `${perf} @ RPE ${rpe || '8.5'}`,
                            history: [logStr, ...prev[selectedCaliSkill].history]
                          }
                        }));
                        setCaliInputs({ performance: '', rpe: '8.5' });
                      }}
                      className="flex-1 py-2.5 bg-[#00E5FF] text-black font-mono font-bold text-xs rounded hover:bg-[#00E5FF]/85 transition"
                    >
                      Log Set & Update PR
                    </button>
                  </div>

                  {activeTrack.history.length > 0 && (
                    <div className="text-xs font-mono text-slate-400 space-y-1.5 pt-2">
                      <span className="text-slate-500 uppercase tracking-wider block font-bold">Recent Session History:</span>
                      {activeTrack.history.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-300">
                          <ChevronRight className="w-3.5 h-3.5 text-[#00E5FF]" /> {h}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MATH & LOGIC */}
        {activeTab === 'math' && (
          <div id="math-quest-container" className="space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-mono font-bold text-white tracking-tight">DAILY MATH & LOGIC QUEST</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">1 problem selected per day from your 300-problem repository.</p>
              </div>

              <button
                onClick={handleRegenerateProblem}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-[#00E5FF]/40 text-[#00E5FF] rounded font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,229,255,0.1)]"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Random Problem
              </button>
            </div>

            {mathLoading ? (
              <div className="p-8 text-center font-mono text-xs text-slate-400 bg-slate-900/50 rounded-lg border border-slate-800">
                Loading problem set from paper_problem_sets.md...
              </div>
            ) : currentProblem ? (
              <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-mono px-2.5 py-1 bg-cyan-950 text-[#00E5FF] border border-[#00E5FF]/30 rounded">
                    {currentProblem.domain}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Problem #{currentProblem.id} of {mathProblems.length}
                  </span>
                </div>

                <h3 className="font-mono font-bold text-lg text-white">{currentProblem.title}</h3>

                {currentProblem.concept && (
                  <div className="text-xs font-mono text-amber-400 bg-amber-950/20 border border-amber-500/20 px-3 py-1.5 rounded">
                    <span className="font-bold">Concept:</span> {currentProblem.concept}
                  </div>
                )}

                <div className="text-sm font-mono text-slate-200 bg-slate-950 p-4 rounded border border-slate-800/90 whitespace-pre-wrap leading-relaxed">
                  {currentProblem.problem}
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="self-start px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs transition flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-[#00E5FF]" />
                    {showSolution ? 'Hide Derivation & Solution' : 'View Written Derivation & Solution'}
                  </button>

                  {showSolution && (
                    <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      <span className="text-emerald-400 font-bold block mb-2">=== STEP-BY-STEP DERIVATION ===</span>
                      {currentProblem.solution}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center font-mono text-xs text-red-400 bg-slate-900/50 rounded-lg border border-slate-800">
                No problems found in paper_problem_sets.md. Please ensure the file is in `public/math/`.
              </div>
            )}
          </div>
        )}

        {/* MOBILITY ROUTINE */}
        {activeTab === 'mobility' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">MOBILITY ROUTINE GENERATOR</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                10–15 min full-body or targeted routines pulled dynamically from daily_mobility.md.
              </p>
            </div>

            {/* STICKY ACTIVE TIMER HUD */}
            <div className="sticky top-[165px] md:top-[80px] z-40 p-4 rounded-xl border border-[#00E5FF]/40 bg-[#09090B]/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">
                  {mobilityTimer.currentStretchName || 'Active Hold Timer'}
                </span>
                <div className="text-3xl md:text-5xl font-mono font-bold text-white tracking-wider">
                  {Math.floor(mobilityTimer.secondsLeft / 60)}:
                  {String(mobilityTimer.secondsLeft % 60).padStart(2, '0')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobilityTimer(prev => ({ ...prev, active: !prev.active }))}
                  className={`px-4 py-2 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition ${
                    mobilityTimer.active ? 'bg-amber-500 text-black' : 'bg-[#00E5FF] text-black'
                  }`}
                >
                  {mobilityTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {mobilityTimer.active ? 'PAUSE' : 'START HOLD'}
                </button>
                <button
                  onClick={() => setMobilityTimer({ active: false, secondsLeft: 60, total: 60, currentStretchName: '' })}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Target Area Controls */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> Routine Customizer
                </span>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <span>Target Time:</span>
                  {[5, 10, 12, 15].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        setTargetDurationMinutes(mins);
                        generateRoutine(mobilityLibrary, selectedBodyParts, mins);
                      }}
                      className={`px-2.5 py-1 rounded border ${
                        targetDurationMinutes === mins
                          ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF]'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Part Selection Toggles */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'neck', label: 'Neck' },
                  { key: 'upper_back', label: 'Upper Back' },
                  { key: 'lower_back', label: 'Lower Back' },
                  { key: 'legs', label: 'Legs' },
                  { key: 'arms', label: 'Arms / Shoulders' }
                ].map(part => {
                  const isChecked = selectedBodyParts[part.key];
                  return (
                    <button
                      key={part.key}
                      onClick={() => {
                        const updated = { ...selectedBodyParts, [part.key]: !isChecked };
                        setSelectedBodyParts(updated);
                        generateRoutine(mobilityLibrary, updated, targetDurationMinutes);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs border transition ${
                        isChecked
                          ? 'bg-cyan-950/60 text-[#00E5FF] border-[#00E5FF]/40 font-bold'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{part.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-xs text-slate-400">
                <span>
                  Estimated Routine Length: <span className="text-white font-bold">{activeRoutine.reduce((acc, curr) => acc + curr.timeInSeconds, 0) / 60} mins</span> ({activeRoutine.length} exercises)
                </span>
                <button
                  onClick={() => generateRoutine(mobilityLibrary, selectedBodyParts, targetDurationMinutes)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[#00E5FF] rounded flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-roll Routine
                </button>
              </div>
            </div>

            {/* Generated Routine Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRoutine.length > 0 ? (
                activeRoutine.map((stretch, i) => (
                  <div key={i} className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                          <span className="text-xs text-[#00E5FF] border border-[#00E5FF]/30 px-1.5 py-0.2 rounded bg-cyan-950/40 uppercase">
                            {stretch.bodyPart.replace('_', ' ')}
                          </span>
                          {stretch.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[#00E5FF] text-xs font-mono">
                          {stretch.defaultTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1"><span className="text-slate-300">Target:</span> {stretch.focus}</p>
                      <p className="text-xs text-slate-300 font-mono mt-2 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                        <span className="text-[#FFB100]">Form Cue:</span> {stretch.cues}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        systemAudio.playSound('beep');
                        setMobilityTimer({
                          active: true,
                          secondsLeft: stretch.timeInSeconds,
                          total: stretch.timeInSeconds,
                          currentStretchName: stretch.name
                        });
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-[#00E5FF] hover:text-black text-slate-200 rounded font-mono text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Timer className="w-3.5 h-3.5" /> Start {stretch.defaultTime} Timer
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-8 text-center font-mono text-xs text-slate-500 bg-slate-900/40 rounded border border-slate-800">
                  Select at least one body part tag above to generate a mobility routine.
                </div>
              )}
            </div>
          </div>
        )}

        {/* GIT SYNC ENGINE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">GIT REPOSITORY & ENGINE</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Architecture details for static runtime execution on GitHub Pages.</p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-4 font-mono text-xs text-slate-300">
              <p>
                The web application executes entirely client-side on GitHub Pages. Complex domain knowledge files are processed seamlessly in memory without exposing raw Markdown tables.
              </p>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs font-mono text-slate-500">
        SHADOW // EMBEDDED ATHLETE HUD • GITHUB PAGES
      </footer>
    </div>
  );
}