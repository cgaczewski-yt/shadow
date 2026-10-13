import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, CheckCircle2, Circle, AlertTriangle, ShieldAlert,
  BookOpen, Terminal, Activity, Dumbbell, Timer, Play, Pause,
  RotateCcw, FileText, Download, Upload, Check, ChevronRight,
  ChevronLeft, Clock, Zap, Smartphone, RefreshCw, Layers, Sliders, ChevronDown, ChevronUp, Filter, Search, Award
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
    neck: true, upper_back: true, lower_back: true, legs: true, arms: true
  });
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(12);
  const [activeRoutine, setActiveRoutine] = useState([]);
  const [mobilityTimer, setMobilityTimer] = useState({ active: false, secondsLeft: 60, total: 60, currentStretchName: '' });

  // Gym Exercises Module State
  const [gymLibrary, setGymLibrary] = useState([]);
  const [gymSelectedParts, setGymSelectedParts] = useState({
    chest: true, back: true, triceps: true, bicep: true, legs: true, core: true
  });
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [gymSearchQuery, setGymSearchQuery] = useState('');
  const [gymStopwatch, setGymStopwatch] = useState({ active: false, seconds: 0, activeExercise: '' });

  // Gym Set & PR Logs State
  const [gymLogs, setGymLogs] = useState(() => {
    const saved = localStorage.getItem('shadow_gym_logs_v1');
    return saved ? JSON.parse(saved) : {};
  });
  const [gymLogInputs, setGymLogInputs] = useState({});

  // Calisthenics HUD Timer & Mode State
  const [caliTimerMode, setCaliTimerMode] = useState('timer');
  const [caliTimer, setCaliTimer] = useState({ active: false, seconds: 30, initialSeconds: 30, activeSkill: '' });
  const [manualInputSec, setManualInputSec] = useState('30');
  const [selectedCaliSkill, setSelectedCaliSkill] = useState('planche');

  // Supporting Strength Exercises State
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
    ]
  });

  const [expandedSupporting, setExpandedSupporting] = useState({});

  // Calisthenics Tracks State
  const [caliTracks, setCaliTracks] = useState(() => {
    const saved = localStorage.getItem('shadow_cali_tracks_v2');
    if (saved) return JSON.parse(saved);
    return {
      planche: { name: 'Planche Progression', category: 'Push / Isometrics', ladder: ['Frog Stand', 'Tuck Planche', 'Advanced Tuck Planche', 'Straddle Planche', 'Full Planche'], currentIndex: 1, pr: '10s @ RPE 8.5', history: [] },
      frontLever: { name: 'Front Lever Progression', category: 'Pull / Isometrics', ladder: ['Tuck Front Lever', 'Advanced Tuck Front Lever', 'Single Leg Front Lever', 'Straddle Front Lever', 'Full Front Lever'], currentIndex: 1, pr: '12s @ RPE 9.0', history: [] }
    };
  });

  const [caliInputs, setCaliInputs] = useState({ performance: '', rpe: '8.5' });

  // Persistent Storage Sync
  useEffect(() => {
    localStorage.setItem('shadow_pillars_v1', JSON.stringify(pillars));
    localStorage.setItem('shadow_cali_tracks_v2', JSON.stringify(caliTracks));
    localStorage.setItem('shadow_gym_logs_v1', JSON.stringify(gymLogs));
  }, [pillars, caliTracks, gymLogs]);

  // --- Robust Gym Exercises Markdown Fetcher ---
  useEffect(() => {
    async function fetchGymData() {
      const baseUrl = import.meta.env.BASE_URL || './';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const candidatePaths = [
        `${cleanBase}gym/gym_exercises.md`,
        `${cleanBase}gym_exercises.md`,
        `./gym/gym_exercises.md`,
        `./gym_exercises.md`
      ];

      let rawText = null;
      for (const path of candidatePaths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            rawText = await res.text();
            break;
          }
        } catch (e) {
          // ignore failed attempts
        }
      }

      if (!rawText) {
        console.warn('Unable to load gym_exercises.md from candidate paths.');
        return;
      }

      const rawBlocks = rawText.split(/(?=##\s+Exercise:)/gi).filter(b => b.trim().length > 0);

      const parsed = rawBlocks.map(block => {
        const getSection = (regex) => {
          const match = block.match(regex);
          return match ? match[1].trim() : '';
        };

        const lines = block.trim().split('\n');
        const nameMatch = lines[0].match(/##\s+Exercise:\s*(.+)/i);
        const name = nameMatch ? nameMatch[1].trim() : 'Exercise';

        const bodyPart = getSection(/###\s*Body\s*Part:\s*(.+)/i).toLowerCase() || 'chest';
        const equipment = getSection(/###\s*Equipment:\s*(.+)/i) || 'Barbell';
        const description = getSection(/###\s*Description:\s*(.+)/i) || '';
        const cues = getSection(/###\s*Cues:\s*(.+)/i) || '';

        return { name, bodyPart, equipment, description, cues };
      }).filter(item => item.name && item.bodyPart);

      setGymLibrary(parsed);
    }

    fetchGymData();
  }, []);

  // --- Filtered Gym Exercises ---
  const filteredGymExercises = gymLibrary.filter(ex => {
    const matchesPart = !!gymSelectedParts[ex.bodyPart];
    const matchesEquip = selectedEquipment === 'ALL' || ex.equipment.toLowerCase().includes(selectedEquipment.toLowerCase());
    const matchesSearch = gymSearchQuery.trim() === '' ||
      ex.name.toLowerCase().includes(gymSearchQuery.toLowerCase()) ||
      ex.bodyPart.toLowerCase().includes(gymSearchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(gymSearchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(gymSearchQuery.toLowerCase());
    return matchesPart && matchesEquip && matchesSearch;
  });

  // --- Gym PR / Set Logging Handler ---
  const handleLogGymSet = (exerciseName) => {
    const inputs = gymLogInputs[exerciseName] || {};
    const weight = inputs.weight || '';
    const reps = inputs.reps || '';

    if (!weight && !reps) return;

    systemAudio.playSound('complete');

    const logEntry = {
      date: todayStr,
      weight: weight ? `${weight} lbs` : 'Bodyweight',
      reps: reps ? `${reps} reps` : '0 reps',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGymLogs(prev => {
      const existing = prev[exerciseName] || { pr: 'None', history: [] };

      const currentWeightNum = parseFloat(weight) || 0;
      const existingWeightNum = parseFloat(existing.pr.replace(/[^0-9.]/g, '')) || 0;

      let newPr = existing.pr;
      if (currentWeightNum >= existingWeightNum) {
        newPr = `${weight} lbs x ${reps} reps`;
      } else if (existing.pr === 'None') {
        newPr = `${weight} lbs x ${reps} reps`;
      }

      return {
        ...prev,
        [exerciseName]: {
          pr: newPr,
          history: [logEntry, ...(existing.history || [])]
        }
      };
    });

    setGymLogInputs(prev => ({
      ...prev,
      [exerciseName]: { weight: '', reps: '' }
    }));
  };

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

          const getSection = (marker) => {
            const idx = block.indexOf(marker);
            if (idx === -1) return '';
            const start = idx + marker.length;
            const rest = block.substring(start);
            const nextIdx = rest.search(/###|\n\n/);
            return (nextIdx === -1 ? rest : rest.substring(0, nextIdx)).trim();
          };

          const lines = block.trim().split('\n');
          const name = lines[0] ? lines[0].replace(/^##\s+Stretch:\s*/, '').trim() : 'Stretch';
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

  // --- Gym Stopwatch Interval Effect ---
  useEffect(() => {
    let interval = null;
    if (gymStopwatch.active) {
      toggleWakeLock(true);
      interval = setInterval(() => {
        setGymStopwatch(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    } else {
      toggleWakeLock(false);
    }
    return () => clearInterval(interval);
  }, [gymStopwatch.active]);

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

  const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;
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
              { id: 'gym', label: 'Gym Workouts', icon: Dumbbell },
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

        {/* GYM WORKOUTS TAB */}
        {activeTab === 'gym' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">GYM EXERCISES & WORKOUTS</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Search, filter, and track working sets and personal records for resistance exercises.</p>
            </div>

            {/* STICKY GYM STOPWATCH HUD */}
            <div className="sticky top-[165px] md:top-[80px] z-40 p-4 rounded-xl border border-[#00E5FF]/40 bg-[#09090B]/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">
                  {gymStopwatch.activeExercise ? `${gymStopwatch.activeExercise}` : 'Gym Session Stopwatch'}
                </span>
                <div className="text-3xl md:text-5xl font-mono font-bold text-white tracking-wider">
                  {String(Math.floor(gymStopwatch.seconds / 60)).padStart(2, '0')}:
                  {String(gymStopwatch.seconds % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGymStopwatch(prev => ({ ...prev, active: !prev.active }))}
                  className={`px-5 py-2 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition ${
                    gymStopwatch.active ? 'bg-amber-500 text-black' : 'bg-[#00E5FF] text-black'
                  }`}
                >
                  {gymStopwatch.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {gymStopwatch.active ? 'PAUSE' : 'START TIMER'}
                </button>
                <button
                  onClick={() => setGymStopwatch({ active: false, seconds: 0, activeExercise: '' })}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* FILTER & SEARCH CONTROLS */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> Body Part Selection
                </span>

                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-300">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                    <input
                      type="text"
                      placeholder="Search exercises..."
                      value={gymSearchQuery}
                      onChange={(e) => setGymSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <select
                      value={selectedEquipment}
                      onChange={(e) => setSelectedEquipment(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="ALL">All Equipment</option>
                      <option value="Barbell">Barbell</option>
                      <option value="Dumbbells">Dumbbells</option>
                      <option value="Cable Machine">Cable Machine</option>
                      <option value="Bench">Bench</option>
                      <option value="Squat Rack">Squat Rack</option>
                      <option value="Pull-Up Bar">Pull-Up Bar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Body Part Selection Toggles */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'chest', label: 'Chest' },
                  { key: 'back', label: 'Back' },
                  { key: 'triceps', label: 'Triceps' },
                  { key: 'bicep', label: 'Bicep' },
                  { key: 'legs', label: 'Legs' },
                  { key: 'core', label: 'Core' }
                ].map(part => {
                  const isChecked = !!gymSelectedParts[part.key];
                  return (
                    <button
                      key={part.key}
                      onClick={() => {
                        setGymSelectedParts(prev => ({ ...prev, [part.key]: !isChecked }));
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
                <span>Showing <span className="text-white font-bold">{filteredGymExercises.length} Exercises</span></span>
                {gymSearchQuery && (
                  <button onClick={() => setGymSearchQuery('')} className="text-[#00E5FF] hover:underline">
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {/* EXERCISE CARDS GRID WITH WEIGHT/REP LOGGING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGymExercises.length > 0 ? (
                filteredGymExercises.map((ex, i) => {
                  const logData = gymLogs[ex.name] || { pr: 'None', history: [] };
                  const inputs = gymLogInputs[ex.name] || { weight: '', reps: '' };

                  return (
                    <div key={i} className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                            <span className="text-xs text-[#00E5FF] border border-[#00E5FF]/30 px-1.5 py-0.2 rounded bg-cyan-950/40 uppercase">
                              {ex.bodyPart}
                            </span>
                            {ex.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-xs font-mono border border-amber-500/30">
                            {ex.equipment}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 font-mono">{ex.description}</p>

                        <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800/80">
                          <span className="text-[#FFB100]">Form Cue:</span> {ex.cues}
                        </div>

                        {/* PR DISPLAY BADGE */}
                        <div className="flex items-center justify-between px-3 py-1.5 rounded bg-cyan-950/30 border border-[#00E5FF]/20 text-xs font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-[#00E5FF]" /> Best Recorded PR:
                          </span>
                          <span className="text-[#00E5FF] font-bold">{logData.pr}</span>
                        </div>
                      </div>

                      {/* WEIGHT & REP INPUT SECTION */}
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Weight (lbs)</label>
                            <input
                              type="number"
                              placeholder="e.g. 185"
                              value={inputs.weight || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGymLogInputs(prev => ({
                                  ...prev,
                                  [ex.name]: { ...(prev[ex.name] || {}), weight: val }
                                }));
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Reps</label>
                            <input
                              type="number"
                              placeholder="e.g. 8"
                              value={inputs.reps || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGymLogInputs(prev => ({
                                  ...prev,
                                  [ex.name]: { ...(prev[ex.name] || {}), reps: val }
                                }));
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              systemAudio.playSound('beep');
                              setGymStopwatch({ active: true, seconds: 0, activeExercise: ex.name });
                            }}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-[#00E5FF] rounded font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#00E5FF]/20"
                          >
                            <Timer className="w-3.5 h-3.5" /> Rest Timer
                          </button>

                          <button
                            onClick={() => handleLogGymSet(ex.name)}
                            className="flex-1 py-2 bg-[#00E5FF] hover:bg-[#00E5FF]/85 text-black rounded font-mono text-xs font-bold transition flex items-center justify-center gap-1"
                          >
                            Log Set & PR
                          </button>
                        </div>

                        {/* SESSION HISTORY */}
                        {logData.history && logData.history.length > 0 && (
                          <div className="pt-2 space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Recent Sets:</span>
                            {logData.history.slice(0, 3).map((entry, idx) => (
                              <div key={idx} className="text-[11px] font-mono text-slate-300 flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded">
                                <span className="text-[#00E5FF]">{entry.weight} × {entry.reps}</span>
                                <span className="text-slate-500 text-[10px]">{entry.date} at {entry.timestamp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 p-8 text-center font-mono text-xs text-slate-500 bg-slate-900/40 rounded border border-slate-800">
                  No matching exercises found. Make sure <code className="text-cyan-400">public/gym/gym_exercises.md</code> exists and contains valid markdown blocks.
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALISTHENICS HUB */}
        {activeTab === 'calisthenics' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">CALISTHENICS HUB</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Select from advanced skills to track progressions and training sets.</p>
            </div>

            {/* STICKY CALISTHENICS TIMER / STOPWATCH HUD */}
            <div className="sticky top-[165px] md:top-[80px] z-40 p-4 rounded-xl border border-[#00E5FF]/40 bg-[#09090B]/95 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">
                      {caliTimer.activeSkill ? `${caliTimer.activeSkill} Hold` : (caliTimerMode === 'timer' ? 'Active Countdown Timer' : 'Active Stopwatch')}
                    </span>
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

            {/* DROPDOWN MENU FOR CALISTHENICS SKILLS */}
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
                <p className="text-xs text-slate-400 font-mono mt-1">1 problem selected per day from your repository.</p>
              </div>
            </div>
          </div>
        )}

        {/* MOBILITY ROUTINE */}
        {activeTab === 'mobility' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">MOBILITY ROUTINE GENERATOR</h2>
            </div>
          </div>
        )}

        {/* GIT SYNC ENGINE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">GIT REPOSITORY & ENGINE</h2>
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