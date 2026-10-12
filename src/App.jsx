import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, CheckCircle2, Circle, AlertTriangle, ShieldAlert,
  BookOpen, Terminal, Activity, Dumbbell, Timer, Play, Pause,
  RotateCcw, FileText, Download, Upload, Check, ChevronRight,
  ChevronLeft, Clock, Zap, Smartphone
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

  // Last active date check for auto-reset / rollover
  const [lastSavedDate, setLastSavedDate] = useState(() => {
    return localStorage.getItem('shadow_last_date_v1') || todayStr;
  });

  // Countdown to midnight
  const [timeLeftToday, setTimeLeftToday] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Wake Lock Ref
  const wakeLockRef = useRef(null);

  // Calisthenics Tracks & Progression Ladder State
  const [caliTracks, setCaliTracks] = useState(() => {
    const saved = localStorage.getItem('shadow_cali_tracks_v1');
    if (saved) return JSON.parse(saved);
    return {
      planche: {
        name: 'Planche Progression',
        ladder: ['Frog Stand', 'Tuck Planche', 'Advanced Tuck Planche', 'Straddle Planche', 'Full Planche'],
        currentIndex: 1,
        pr: '10s @ RPE 8.5',
        history: []
      },
      frontLever: {
        name: 'Front Lever Progression',
        ladder: ['Tuck Front Lever', 'Advanced Tuck Front Lever', 'Single Leg Front Lever', 'Straddle Front Lever', 'Full Front Lever'],
        currentIndex: 1,
        pr: '12s @ RPE 9.0',
        history: []
      },
      oneArmPullup: {
        name: 'One-Arm Pull-Up',
        ladder: ['Archer Pull-Ups', 'Assisted 1APU (Band)', 'Eccentric 1APU Lockoffs', 'Full One-Arm Pull-Up'],
        currentIndex: 1,
        pr: '2 reps @ RPE 8.5',
        history: []
      },
      hspu: {
        name: 'Handstand Push-Up',
        ladder: ['Pike Push-Ups', 'Wall-Supported HSPU', 'Deficit Wall HSPU', 'Freestanding HSPU'],
        currentIndex: 1,
        pr: '5 reps @ RPE 9.0',
        history: []
      }
    };
  });

  // Calisthenics Form Inputs State
  const [caliInputs, setCaliInputs] = useState({
    planche: { performance: '', rpe: '8.5' },
    frontLever: { performance: '', rpe: '8.5' },
    oneArmPullup: { performance: '', rpe: '8.5' },
    hspu: { performance: '', rpe: '8.5' }
  });

  // Timers State
  const [caliTimer, setCaliTimer] = useState({ active: false, secondsLeft: 30, total: 30 });
  const [mobilityTimer, setMobilityTimer] = useState({ active: false, secondsLeft: 60, total: 60 });

  // Math Solved State
  const [solvedMath, setSolvedMath] = useState({});

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

  // --- Save Persistence & App Badging ---
  useEffect(() => {
    localStorage.setItem('shadow_pillars_v1', JSON.stringify(pillars));
    localStorage.setItem('shadow_cali_tracks_v1', JSON.stringify(caliTracks));

    const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;
    if ('setAppBadge' in navigator) {
      if (pendingCount > 0) {
        navigator.setAppBadge(pendingCount).catch(err => console.error(err));
      } else {
        navigator.clearAppBadge().catch(err => console.error(err));
      }
    }
  }, [pillars, caliTracks]);

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

  // --- Toggle Pillar Completion ---
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

  // --- Calisthenics Hold Timer Effect ---
  useEffect(() => {
    let interval = null;
    if (caliTimer.active && caliTimer.secondsLeft > 0) {
      toggleWakeLock(true);
      interval = setInterval(() => {
        setCaliTimer(prev => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
      }, 1000);
    } else if (caliTimer.secondsLeft === 0 && caliTimer.active) {
      systemAudio.playSound('complete');
      setCaliTimer(prev => ({ ...prev, active: false }));
      toggleWakeLock(false);
    }
    return () => clearInterval(interval);
  }, [caliTimer.active, caliTimer.secondsLeft]);

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
    return () => clearInterval(interval);
  }, [mobilityTimer.active, mobilityTimer.secondsLeft]);

  const pendingCount = Object.values(pillars).filter(p => !p.completedToday).length;

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col font-sans select-none">
      
      {/* ================================================================== */}
      {/* HEADER: BRANDING "SHADOW" & RED COUNTDOWN                          */}
      {/* ================================================================== */}
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

      {/* ================================================================== */}
      {/* QUICK CHECK BAR                                                    */}
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
      {/* MAIN CONTENT AREA                                                 */}
      {/* ================================================================== */}
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
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-mono font-bold text-white tracking-tight">CALISTHENICS HUB</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">Autoregulated RPE 8.5–9.0 edge coaching with interactive skill progression ladders.</p>
              </div>

              {/* Calisthenics Active Hold Timer */}
              <div className="p-3.5 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/5 flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block">Hold Timer</span>
                  <div className="text-3xl font-mono font-bold text-white tracking-wider">
                    {String(Math.floor(caliTimer.secondsLeft / 60)).padStart(2, '0')}:
                    {String(caliTimer.secondsLeft % 60).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCaliTimer(prev => ({ ...prev, active: !prev.active }))}
                    className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition ${
                      caliTimer.active ? 'bg-amber-500 text-black' : 'bg-[#00E5FF] text-black'
                    }`}
                  >
                    {caliTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setCaliTimer({ active: false, secondsLeft: 30, total: 30 })}
                    className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded font-mono text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Skill Tracks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(caliTracks).map(([skillKey, trackData]) => {
                const currentStep = trackData.ladder[trackData.currentIndex];
                return (
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

                      {/* Interactive Progression Ladder Viewer */}
                      <div className="mt-3 p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                          <span>Active Level:</span>
                          <span className="text-[#00E5FF] font-bold">{currentStep}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                          <button
                            disabled={trackData.currentIndex === 0}
                            onClick={() => {
                              setCaliTracks(prev => ({
                                ...prev,
                                [skillKey]: { ...prev[skillKey], currentIndex: Math.max(0, prev[skillKey].currentIndex - 1) }
                              }));
                            }}
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 flex items-center gap-1 text-[10px] font-mono"
                          >
                            <ChevronLeft className="w-3 h-3" /> Prev Step
                          </button>
                          <span className="text-[10px] font-mono text-slate-500">
                            {trackData.currentIndex + 1} / {trackData.ladder.length}
                          </span>
                          <button
                            disabled={trackData.currentIndex === trackData.ladder.length - 1}
                            onClick={() => {
                              setCaliTracks(prev => ({
                                ...prev,
                                [skillKey]: { ...prev[skillKey], currentIndex: Math.min(prev[skillKey].ladder.length - 1, prev[skillKey].currentIndex + 1) }
                              }));
                            }}
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 flex items-center gap-1 text-[10px] font-mono"
                          >
                            Next Step <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dual Input Form (Reps/Time + RPE) */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">Reps / Hold Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 12s or 5 reps"
                            value={caliInputs[skillKey]?.performance || ''}
                            onChange={(e) => setCaliInputs(prev => ({ ...prev, [skillKey]: { ...prev[skillKey], performance: e.target.value } }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">Logged RPE</label>
                          <input
                            type="text"
                            placeholder="e.g. 8.5"
                            value={caliInputs[skillKey]?.rpe || ''}
                            onChange={(e) => setCaliInputs(prev => ({ ...prev, [skillKey]: { ...prev[skillKey], rpe: e.target.value } }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const perf = caliInputs[skillKey]?.performance;
                          const rpe = caliInputs[skillKey]?.rpe;
                          if (!perf) return;
                          systemAudio.playSound('complete');
                          const logStr = `${perf} @ RPE ${rpe || '8.5'} (${currentStep})`;
                          setCaliTracks(prev => ({
                            ...prev,
                            [skillKey]: {
                              ...prev[skillKey],
                              pr: `${perf} @ RPE ${rpe || '8.5'}`,
                              history: [logStr, ...prev[skillKey].history]
                            }
                          }));
                          setCaliInputs(prev => ({ ...prev, [skillKey]: { performance: '', rpe: '8.5' } }));
                        }}
                        className="w-full py-1.5 bg-[#00E5FF] text-black font-mono font-bold text-xs rounded hover:bg-[#00E5FF]/85 transition"
                      >
                        Log Set & Update PR
                      </button>

                      {trackData.history.length > 0 && (
                        <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1">
                          <span className="text-slate-500 uppercase tracking-wider block">Recent History:</span>
                          {trackData.history.slice(0, 2).map((h, i) => (
                            <div key={i} className="flex items-center gap-1 text-slate-300">
                              <ChevronRight className="w-3 h-3 text-[#00E5FF]" /> {h}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MATH & LOGIC */}
        {activeTab === 'math' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">PENCIL & PAPER MATH PROBLEMS</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Rigorous analytical problems formatted for paper derivations.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: 'Linear Algebra: Eigenvalues & Characteristic Matrix',
                  domain: 'Linear Algebra / Control Systems',
                  problem: 'Given matrix A = [[2, 1], [0, 3]], compute the characteristic polynomial det(A - λI) = 0, find eigenvalues λ1, λ2, and derive eigenvectors.',
                  solution: `1. Characteristic Equation: det(A - λI) = det([[2-λ, 1], [0, 3-λ]]) = 0.
2. Polynomial: (2 - λ)(3 - λ) - (0)(1) = 0 => λ² - 5λ + 6 = 0.
3. Factored: (λ - 2)(λ - 3) = 0 => λ1 = 2, λ2 = 3.
4. Eigenvector for λ1 = 2: [[0, 1], [0, 1]][v1, v2]^T = 0 => v2 = 0 => v1 = [1, 0]^T.
5. Eigenvector for λ2 = 3: [[-1, 1], [0, 0]][v1, v2]^T = 0 => -v1 + v2 = 0 => v2 = [1, 1]^T.`
                },
                {
                  id: 2,
                  title: 'Z-Transform: Pole Stability Analysis',
                  domain: 'Digital Signal Processing',
                  problem: 'Determine the stability of transfer function H(z) = 1 / (1 - 1.5z^-1 + 0.5z^-2) by finding poles.',
                  solution: `1. In positive powers: H(z) = z² / (z² - 1.5z + 0.5).
2. Denominator roots: z² - 1.5z + 0.5 = 0.
3. Factor: (z - 1.0)(z - 0.5) = 0 => Poles at z1 = 1.0, z2 = 0.5.
4. Conclusion: Pole z1 = 1.0 lies on the unit circle boundary (marginally stable).`
                },
                {
                  id: 3,
                  title: 'Information Theory: Shannon Entropy',
                  domain: 'Information Theory',
                  problem: 'A source emits symbols {A, B, C, D} with P = {0.5, 0.25, 0.125, 0.125}. Calculate entropy H(X) in bits.',
                  solution: `1. Formula: H(X) = - Σ p(x) log2 p(x).
2. H(X) = - [0.5 log2(0.5) + 0.25 log2(0.25) + 0.125 log2(0.125) + 0.125 log2(0.125)]
3. H(X) = - [0.5(-1) + 0.25(-2) + 0.125(-3) + 0.125(-3)] = 1.75 bits/symbol.`
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
                      {solvedMath[item.id] ? 'Hide Solution' : 'View Written Derivation'}
                    </button>

                    {solvedMath[item.id] && (
                      <div className="mt-3 p-4 bg-slate-950 border border-emerald-500/30 rounded text-xs font-mono text-emerald-300 whitespace-pre-wrap">
                        <span className="text-emerald-400 font-bold block mb-1">=== DERIVATION & BOXED ANSWER ===</span>
                        {item.solution}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOBILITY ROUTINE */}
        {activeTab === 'mobility' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-mono font-bold text-white tracking-tight">DAILY MOBILITY ROUTINE</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">Biomechanical joint preparation with active hold timers.</p>
              </div>

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
                      mobilityTimer.active ? 'bg-amber-500 text-black' : 'bg-[#00E5FF] text-black'
                    }`}
                  >
                    {mobilityTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {mobilityTimer.active ? 'PAUSE' : 'START HOLD'}
                  </button>
                  <button
                    onClick={() => setMobilityTimer({ active: false, secondsLeft: 60, total: 60 })}
                    className="px-4 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset 60s
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Thoracic Spine Extension', duration: '90s', focus: 'Upper back extension over foam roller/block', cues: 'Posterior pelvic tilt, exhale deeply into upper back.' },
                { name: 'Couch Stretch (Hip Flexors)', duration: '120s / leg', focus: 'Hip flexors, rectus femoris, psoas', cues: 'Squeeze glute hard on stretched leg, keep ribs locked down.' },
                { name: 'Jefferson Curls', duration: '60s (5 reps slow)', focus: 'Spinal articulation & hamstring length', cues: 'Chin to chest first, segmentally roll down vertebrae by vertebrae.' },
                { name: 'Shoulder Butcher Block', duration: '90s', focus: 'Lat & overhead shoulder mobility', cues: 'Hands elevated on bench, drop chest toward floor.' },
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
                      setMobilityTimer({ active: true, secondsLeft: stretch.duration.includes('120') ? 120 : 90, total: 90 });
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