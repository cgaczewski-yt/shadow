import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, CheckCircle2, Circle, AlertTriangle, ShieldAlert,
  BookOpen, Terminal, Activity, Dumbbell, Timer, Play, Pause,
  RotateCcw, FileText, Download, Upload, Check, ChevronRight,
  Clock, Zap, Volume2, Smartphone
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
  const [simulatedDate, setSimulatedDate] = useState(todayStr);
  
  // Pillars State
  const [pillars, setPillars] = useState(() => {
    const saved = localStorage.getItem('system_pillars_v3');
    if (saved) return JSON.parse(saved);
    return {
      workout: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      reading: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      creativity: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      math: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
      mobility: { streak: 0, consecutiveMisses: 0, status: 'ACTIVE', lastCompleted: null, completedToday: false },
    };
  });

  // Last active date check for auto-reset / rollover
  const [lastSavedDate, setLastSavedDate] = useState(() => {
    return localStorage.getItem('system_last_date_v3') || todayStr;
  });

  // Countdown to midnight
  const [timeLeftToday, setTimeLeftToday] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Wake Lock Ref
  const wakeLockRef = useRef(null);

  // Markdown Content State
  const [markdownData, setMarkdownData] = useState({
    calisthenics: '',
    math: '',
    mobility: '',
    loading: true,
    error: null
  });

  // Calisthenics Hub State
  const [caliTracks, setCaliTracks] = useState(() => {
    const saved = localStorage.getItem('system_cali_tracks_v3');
    if (saved) return JSON.parse(saved);
    return {
      planche: { name: 'Planche Progression', currentTrack: 'Tuck Planche Hold', pr: '10s @ RPE 8.5', history: [] },
      frontLever: { name: 'Front Lever Progression', currentTrack: 'Advanced Tuck Hold', pr: '12s @ RPE 9.0', history: [] },
      oneArmPullup: { name: 'One-Arm Pull-Up', currentTrack: 'Assisted 1APU (Band)', pr: '2 reps @ RPE 8.5', history: [] },
      hspu: { name: 'Handstand Push-Up', currentTrack: 'Wall-Supported HSPU', pr: '5 reps @ RPE 9.0', history: [] }
    };
  });

  // Math Solved State
  const [solvedMath, setSolvedMath] = useState({});

  // Mobility Timer State
  const [mobilityTimer, setMobilityTimer] = useState({ active: false, secondsLeft: 60, total: 60, currentStretch: 'Thoracic Extension' });

  // --- Auto Date Rollover & Midnight Countdown Effect ---
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

      // Check if day changed in local timezone
      const currentLocalDate = getLocalDateString(now);
      if (currentLocalDate !== lastSavedDate) {
        // Auto-reset daily completed flags for a new day
        setPillars(prev => {
          const updated = {};
          Object.keys(prev).forEach(key => {
            const p = prev[key];
            // Evaluate consecutive misses if yesterday was missed
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
        localStorage.setItem('system_last_date_v3', currentLocalDate);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [lastSavedDate]);

  // --- Save Persistence & App Badging ---
  useEffect(() => {
    localStorage.setItem('system_pillars_v3', JSON.stringify(pillars));
    localStorage.setItem('system_cali_tracks_v3', JSON.stringify(caliTracks));

    // Calculate pending quests for App Badge API
    const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;
    if ('setAppBadge' in navigator) {
      if (pendingCount > 0) {
        navigator.setAppBadge(pendingCount).catch(err => console.error(err));
      } else {
        navigator.clearAppBadge().catch(err => console.error(err));
      }
    }
  }, [pillars, caliTracks]);

  // --- Fetch Markdown Lookup Tables ---
  useEffect(() => {
    async function loadMarkdownFiles() {
      try {
        const [resCali, resMath, resMob] = await Promise.all([
          fetch('./progressions/calisthenics_progressions.md').catch(() => ({ text: () => '# Calisthenics Progressions\n- Tuck Planche (10s target)\n- Advanced Tuck (8s target)' })),
          fetch('./math/paper_problem_sets.md').catch(() => ({ text: () => '# Math Problem Sets\n1. Linear Algebra Eigenvalues\n2. Z-Transform Stability' })),
          fetch('./stretches/daily_mobility.md').catch(() => ({ text: () => '# Daily Mobility\n- Thoracic Spine Extension (60s)\n- Couch Stretch (90s)' }))
        ]);

        const caliText = await resCali.text();
        const mathText = await resMath.text();
        const mobText = await resMob.text();

        setMarkdownData({
          calisthenics: caliText,
          math: mathText,
          mobility: mobText,
          loading: false,
          error: null
        });
      } catch (err) {
        setMarkdownData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    }
    loadMarkdownFiles();
  }, []);

  // --- Screen Wake Lock Management ---
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

  // --- Toggle Pillar Completion (Zero-Effort Quick Check) ---
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

  // --- Mobility Timer Effect ---
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
    return () => {
      clearInterval(interval);
      if (!mobilityTimer.active) toggleWakeLock(false);
    };
  }, [mobilityTimer.active, mobilityTimer.secondsLeft]);

  // Total pending quests count
  const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col font-sans select-none">
      
      {/* ================================================================== */}
      {/* TOP HUD HEADER & RED END-OF-DAY COUNTDOWN BAR                      */}
      {/* ================================================================== */}
      <header className="border-b border-slate-800 bg-[#09090B]/90 backdrop-blur sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Logo & Status */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00E5FF] rounded-full animate-pulse glow-cyan" />
              <h1 className="font-mono font-bold tracking-wider text-lg text-white">THE SYSTEM <span className="text-[#00E5FF] text-xs px-2 py-0.5 bg-[#00E5FF]/10 rounded border border-[#00E5FF]/30">v3.5 HUD</span></h1>
            </div>

            {/* Badge Indicator for iOS PWA */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono">
              <Smartphone className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-slate-400">Badge:</span>
              <span className={pendingCount > 0 ? "text-[#FFB100] font-bold" : "text-emerald-400 font-bold"}>
                {pendingCount} pending
              </span>
            </div>
          </div>

          {/* Red Countdown Timer (Remaining Time Today) */}
          <div className="flex items-center gap-2 px-3 py-1 bg-red-950/30 border border-red-500/30 rounded-md font-mono text-xs">
            <Clock className="w-4 h-4 text-[#FF2A5F] animate-pulse" />
            <span className="text-slate-400">RESET IN:</span>
            <span className="text-[#FF2A5F] font-bold text-sm">
              {String(timeLeftToday.hours).padStart(2, '0')}:
              {String(timeLeftToday.minutes).padStart(2, '0')}:
              {String(timeLeftToday.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Navigation Tabs */}
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

      {/* ================================================================== */}
      {/* ZERO-EFFORT TOP-LEVEL QUICK CHECK BAR (STICKY)                     */}
      {/* ================================================================== */}
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

      {/* ================================================================== */}
      {/* MAIN CONTENT VIEW CONTAINER                                        */}
      {/* ================================================================== */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 flex-1">

        {/* ---------------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD                                                 */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-mono font-bold text-white tracking-tight">EXECUTION DASHBOARD</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">Local Date: {simulatedDate} | 3-Day Decay Grace Model Active</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulatedDate(d => {
                    const next = new Date(d);
                    next.setDate(next.getDate() + 1);
                    return getLocalDateString(next);
                  })}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded font-mono text-xs text-slate-300 transition"
                >
                  +1 Day Sim
                </button>
                <button
                  onClick={() => setSimulatedDate(d => {
                    const next = new Date(d);
                    next.setDate(next.getDate() + 3);
                    return getLocalDateString(next);
                  })}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 rounded font-mono text-xs text-red-400 transition"
                >
                  +3 Days (Trigger Decay)
                </button>
              </div>
            </div>

            {/* Pillar Cards Grid */}
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

        {/* ---------------------------------------------------------------- */}
        {/* TAB 2: CALISTHENICS HUB (PARALLEL TRACKS & PRS)                  */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'calisthenics' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">CALISTHENICS HUB & AUTO-REGULATED EDGE COACHING</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Targeting RPE 8.5–9.0 edge capacity across parallel isometric & dynamic tracks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(caliTracks).map(([skillKey, trackData]) => (
                <div key={skillKey} className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-mono font-bold text-base text-white flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-[#00E5FF]" />
                        {trackData.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded bg-cyan-950/40 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono">
                        PR: {trackData.pr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">Current Track: <span className="text-white font-bold">{trackData.currentTrack}</span></p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Log attempt (e.g., 14s @ RPE 8.5)"
                        id={`input-${skillKey}`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                      <button
                        onClick={() => {
                          const val = document.getElementById(`input-${skillKey}`).value;
                          if (!val) return;
                          systemAudio.playSound('complete');
                          setCaliTracks(prev => ({
                            ...prev,
                            [skillKey]: {
                              ...prev[skillKey],
                              pr: val,
                              history: [val, ...prev[skillKey].history]
                            }
                          }));
                          document.getElementById(`input-$ {skillKey}`).value = '';
                        }}
                        className="px-4 py-1.5 bg-[#00E5FF] text-black font-mono font-bold text-xs rounded hover:bg-[#00E5FF]/85 transition"
                      >
                        Log PR
                      </button>
                    </div>

                    {trackData.history.length > 0 && (
                      <div className="text-[11px] font-mono text-slate-400 space-y-1">
                        <span className="text-slate-500 uppercase tracking-wider block">Recent Logs:</span>
                        {trackData.history.slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-slate-300">
                            <ChevronRight className="w-3 h-3 text-[#00E5FF]" /> {h}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Markdown Viewer for Progressions */}
            <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/40">
              <h3 className="font-mono font-bold text-sm text-[#00E5FF] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Loaded Progression Markdown Lookup Table
              </h3>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded border border-slate-800 max-h-60 overflow-y-auto">
                {markdownData.loading ? 'Fetching static Markdown...' : markdownData.calisthenics}
              </pre>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 3: MATH & LOGIC (PENCIL & PAPER SOLVABLE)                     */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'math' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">PENCIL & PAPER MATH & ENGINEERING PROBLEMS</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Rigorous analytical problem sets with step-by-step written derivations and solutions.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: 'Linear Algebra: Eigenvalues & Characteristic Matrix',
                  domain: 'Linear Algebra / Control Systems',
                  problem: 'Given the system matrix $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$, compute the characteristic polynomial $\\det(A - \\lambda I) = 0$, find the eigenvalues $\\lambda_1, \\lambda_2$, and determine the corresponding eigenvectors.',
                  solution: `1. Set up characteristic equation: det(A - λI) = det([2-λ, 1; 0, 3-λ]) = 0.
2. Expand determinant: (2 - λ)(3 - λ) - (1)(0) = 0 => λ² - 5λ + 6 = 0.
3. Factor polynomial: (λ - 2)(λ - 3) = 0 => Eigenvalues: λ₁ = 2, λ₂ = 3.
4. For λ₁ = 2: [0 1; 0 1][v1; v2] = 0 => v₂ = 0 => Eigenvector v₁ = [1, 0]^T.
5. For λ₂ = 3: [-1 1; 0 0][v1; v2] = 0 => -v₁ + v₂ = 0 => Eigenvector v₂ = [1, 1]^T.`
                },
                {
                  id: 2,
                  title: 'Z-Transform: Pole Stability Analysis',
                  domain: 'Digital Signal Processing',
                  problem: 'Determine the stability of the discrete-time transfer function $H(z) = \\frac{1}{1 - 1.5z^{-1} + 0.5z^{-2}}$ by finding its poles and checking unit circle confinement.',
                  solution: `1. Rewrite in positive powers of z: H(z) = z² / (z² - 1.5z + 0.5).
2. Find roots of denominator: z² - 1.5z + 0.5 = 0.
3. Apply quadratic formula: z = (1.5 ± √(2.25 - 2)) / 2 = (1.5 ± 0.5) / 2.
4. Poles are at z₁ = 1.0 and z₂ = 0.5.
5. Conclusion: Since pole z₁ = 1.0 lies on the unit circle boundary, the system is marginally stable (BIBO unstable for unbounded inputs).`
                },
                {
                  id: 3,
                  title: 'Information Theory: Huffman Entropy & Source Coding',
                  domain: 'Information Theory',
                  problem: 'A discrete memoryless source emits symbols {A, B, C, D} with probabilities P = {0.5, 0.25, 0.125, 0.125}. Calculate the Shannon entropy H(X) in bits per symbol.',
                  solution: `1. Formula: H(X) = - Σ p(x) log₂ p(x).
2. H(X) = - [0.5 log₂(0.5) + 0.25 log₂(0.25) + 0.125 log₂(0.125) + 0.125 log₂(0.125)]
3. H(X) = - [0.5(-1) + 0.25(-2) + 0.125(-3) + 0.125(-3)]
4. H(X) = - [-0.5 - 0.5 - 0.375 - 0.375] = 1.75 bits/symbol.`
                }
              ].map(item => (
                <div key={item.id} className="p-5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-[#00E5FF] border border-[#00E5FF]/30 rounded">
                      {item.domain}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Problem #{item.id}</span>
                  </div>
                  <h3 className="font-mono font-bold text-base text-white">{item.title}</h3>
                  <p className="text-sm font-mono text-slate-300 bg-slate-950 p-3 rounded border border-slate-800/80">
                    {item.problem}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setSolvedMath(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs transition flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#00E5FF]" />
                      {solvedMath[item.id] ? 'Hide Pencil & Paper Derivation' : 'View Pencil & Paper Derivation'}
                    </button>

                    {solvedMath[item.id] && (
                      <div className="mt-3 p-4 bg-slate-950 border border-emerald-500/30 rounded text-xs font-mono text-emerald-300 whitespace-pre-wrap">
                        <span className="text-emerald-400 font-bold block mb-1">=== STEP-BY-STEP SOLUTION & BOXED ANSWER ===</span>
                        {item.solution}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 4: MOBILITY ROUTINE (LARGER TIMERS & BIO-MECHANICS)           */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'mobility' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-mono font-bold text-white tracking-tight">DAILY FULL-BODY MOBILITY & STRETCHING</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">Biomechanical joint preparation with active oversized timers.</p>
              </div>

              {/* Active Oversized Timer HUD */}
              <div className="p-4 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/5 flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">Active Hold Timer</span>
                  <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-wider">
                    {Math.floor(mobilityTimer.secondsLeft / 60)}:
                    {String(mobilityTimer.secondsLeft % 60).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setMobilityTimer(prev => ({ ...prev, active: !prev.active }))}
                    className={`px-4 py-2 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition ${
                      mobilityTimer.active ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-[#00E5FF] text-black hover:bg-[#00E5FF]/85'
                    }`}
                  >
                    {mobilityTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {mobilityTimer.active ? 'PAUSE' : 'START HOLD'}
                  </button>
                  <button
                    onClick={() => setMobilityTimer(prev => ({ ...prev, secondsLeft: 60, active: false }))}
                    className="px-4 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs transition flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset 60s
                  </button>
                </div>
              </div>
            </div>

            {/* Stretch Routine List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Thoracic Spine Extension', duration: '90s', focus: 'Upper back extension over foam roller/block', cues: 'Posterior pelvic tilt, exhale deeply into upper back.' },
                { name: 'Couch Stretch (Hip Flexors)', duration: '120s / leg', focus: 'Hip flexors, rectus femoris, psoas', cues: 'Squeeze glute hard on stretched leg, keep ribs locked down.' },
                { name: 'Jefferson Curls', duration: '60s (5 reps slow)', focus: 'Spinal articulation & hamstring length', cues: 'Chin to chest first, segmentally roll down vertebrae by vertebrae with light load.' },
                { name: 'Shoulder Butcher Block', duration: '90s', focus: 'Lat & overhead shoulder mobility', cues: 'Hands elevated on bench, drop chest toward floor while bracing core.' },
                { name: 'Wrist Flexor & Extensor Prep', duration: '60s', focus: 'Wrist joint conditioning for planche/handstand', cues: 'Palms forward/out, lean gently over wrists with locked elbows.' }
              ].map((stretch, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-mono font-bold text-sm text-white">{stretch.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[#00E5FF] text-xs font-mono">{stretch.duration}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono"><span className="text-slate-300">Target:</span> {stretch.focus}</p>
                    <p className="text-xs text-slate-300 font-mono mt-2 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                      <span className="text-[#FFB100]">Form Cue:</span> {stretch.cues}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMobilityTimer({ active: true, secondsLeft: stretch.duration.includes('120') ? 120 : 90, total: 90, currentStretch: stretch.name });
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-[#00E5FF] hover:text-black text-slate-200 rounded font-mono text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Timer className="w-3.5 h-3.5" /> Start {stretch.duration} Timer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 5: GIT SYNC & ARCHITECTURE                                   */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">GIT REPOSITORY & MARKDOWN SYNC ENGINE</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Architecture details for static runtime fetching on GitHub Pages.</p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-4 font-mono text-xs text-slate-300">
              <p>
                The web application executes entirely client-side on GitHub Pages. Complex domain knowledge files (`calisthenics_progressions.md`, `paper_problem_sets.md`, `daily_mobility.md`) are stored in the public directory and fetched asynchronously at runtime.
              </p>
              <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
                <div className="text-[#00E5FF] font-bold">Fetch Architecture Mapping:</div>
                <div>- Progressions: <span className="text-white">./progressions/calisthenics_progressions.md</span></div>
                <div>- Math Problems: <span className="text-white">./math/paper_problem_sets.md</span></div>
                <div>- Mobility Routine: <span className="text-white">./stretches/daily_mobility.md</span></div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs font-mono text-slate-500">
        THE SYSTEM // EMBEDDED ATHLETE HUD • RUNNING ON GITHUB PAGES STATIC SPA
      </footer>
    </div>
  );
}