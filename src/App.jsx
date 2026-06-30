import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, X, Trash2, Edit2, Target, TrendingUp, Calendar, Wallet, CheckCircle2, Moon, Sun, PartyPopper } from 'lucide-react';

const PRESET_COLORS = [
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#10B981', name: 'Green' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#EF4444', name: 'Red' },
  { hex: '#8B5CF6', name: 'Purple' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#14B8A6', name: 'Teal' },
  { hex: '#F97316', name: 'Orange' }
];

const peso = (n) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const theme = (dark) => ({
  page: dark ? 'bg-slate-950' : 'bg-slate-50',
  card: dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100',
  modal: dark ? 'bg-slate-900' : 'bg-white',
  textPrimary: dark ? 'text-slate-100' : 'text-slate-900',
  textSecondary: dark ? 'text-slate-400' : 'text-slate-500',
  textMuted: dark ? 'text-slate-500' : 'text-slate-400',
  subtle: dark ? 'bg-slate-800' : 'bg-slate-50',
  subtleHover: dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
  iconBtn: dark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
  ring: dark ? '#1E293B' : '#F1F5F9',
  cancelBtn: dark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  border: dark ? 'border-slate-800' : 'border-slate-100'
});

const inputClass = (dark) => `w-full rounded-xl px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition border ${dark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'}`;

const Modal = ({ children, onClose, maxWidth = 'max-w-md', dark }) => (
  <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={`${dark ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[92vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Field = ({ label, children, dark }) => (
  <div>
    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
    {children}
  </div>
);

const Confetti = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
    const pieces = [];
    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        r: Math.random() * 7 + 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12
      });
    }
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.04;
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[60]" />;
};

const Celebration = ({ goal, onClose, dark }) => (
  <>
    <Confetti />
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[61]" onClick={onClose}>
      <div className={`${dark ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 text-center`} onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: goal.color + '20' }}>
          <PartyPopper size={34} style={{ color: goal.color }} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-slate-100' : 'text-slate-900'}`}>Goal Complete!</h2>
        <p className={`mb-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>You reached your target for</p>
        <p className="text-lg font-semibold mb-5" style={{ color: goal.color }}>{goal.name}</p>
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: goal.color + '15' }}>
          <div className="text-3xl font-bold" style={{ color: goal.color }}>{peso(goal.targetAmount)}</div>
          <div className={`text-sm mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>saved up. Well done!</div>
        </div>
        <button onClick={onClose} className="w-full text-white py-3 rounded-xl active:scale-[0.99] transition font-semibold shadow-sm" style={{ backgroundColor: goal.color }}>
          Awesome!
        </button>
      </div>
    </div>
  </>
);

const NewGoalForm = ({ onSave, onClose, dark }) => {
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalInitial, setGoalInitial] = useState('');
  const [goalHasDeadline, setGoalHasDeadline] = useState(false);
  const [goalColor, setGoalColor] = useState(PRESET_COLORS[0].hex);

  const handleSubmit = () => {
    if (!goalName || !goalTarget) { alert('Please fill in required fields'); return; }
    onSave({
      id: crypto.randomUUID(),
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      currentAmount: parseFloat(goalInitial) || 0,
      hasDeadline: goalHasDeadline,
      deadline: goalHasDeadline ? goalDeadline : null,
      color: goalColor,
      contributions: goalInitial
        ? [{ id: crypto.randomUUID(), amount: parseFloat(goalInitial), date: new Date().toISOString().split('T')[0], isInitial: true }]
        : [],
      createdAt: new Date().toISOString()
    });
  };

  const t = theme(dark);
  return (
    <Modal onClose={onClose} dark={dark}>
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>New Savings Goal</h2>
          <button type="button" onClick={onClose} className={`rounded-lg p-1 transition ${t.iconBtn}`}><X size={22} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Goal Name" dark={dark}>
            <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="e.g., New Phone" className={inputClass(dark)} />
          </Field>
          <Field label="Target Amount" dark={dark}>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-medium ${t.textSecondary}`}>₱</span>
              <input type="number" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} placeholder="1,000" min="0" step="0.01" className={inputClass(dark) + ' pl-8'} />
            </div>
          </Field>
          <div className={`rounded-xl p-3.5 ${t.subtle}`}>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={goalHasDeadline} onChange={(e) => setGoalHasDeadline(e.target.checked)} className="rounded w-4 h-4 accent-blue-600" />
              <span className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Set a deadline</span>
            </label>
            {goalHasDeadline && <input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} className={inputClass(dark) + ' mt-3'} />}
          </div>
          <Field label="Initial Amount (optional)" dark={dark}>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-medium ${t.textSecondary}`}>₱</span>
              <input type="number" value={goalInitial} onChange={(e) => setGoalInitial(e.target.value)} placeholder="0" min="0" step="0.01" className={inputClass(dark) + ' pl-8'} />
            </div>
          </Field>
          <Field label="Color" dark={dark}>
            <div className="flex gap-2.5 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button key={c.hex} type="button" onClick={() => setGoalColor(c.hex)} title={c.name}
                  className={`w-9 h-9 rounded-full transition transform hover:scale-110 ${goalColor === c.hex ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''} ${dark ? 'ring-offset-slate-900' : ''}`}
                  style={{ backgroundColor: c.hex }} />
              ))}
            </div>
          </Field>
          <button type="button" onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition font-semibold text-base shadow-sm shadow-blue-500/20">Create Goal</button>
        </div>
      </div>
    </Modal>
  );
};

const EditGoalModal = ({ goal, onSave, onClose, dark }) => {
  const [name, setName] = useState(goal?.name || '');
  const t = theme(dark);
  const handleSubmit = () => { if (!name.trim()) { alert('Goal name cannot be empty'); return; } onSave(name); };
  return (
    <Modal onClose={onClose} dark={dark}>
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Edit Goal Name</h2>
          <button type="button" onClick={onClose} className={`rounded-lg p-1 transition ${t.iconBtn}`}><X size={22} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Goal Name" dark={dark}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass(dark)} autoFocus />
          </Field>
          <button type="button" onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition font-semibold text-base shadow-sm shadow-blue-500/20">Save Changes</button>
        </div>
      </div>
    </Modal>
  );
};

const EditContributionModal = ({ contribution, onSave, onClose, dark }) => {
  const [amount, setAmount] = useState(contribution?.amount?.toString() || '');
  const [date, setDate] = useState(contribution?.date || '');
  const t = theme(dark);
  const handleSubmit = () => { if (!amount) { alert('Amount cannot be empty'); return; } onSave({ amount: parseFloat(amount), date }); };
  return (
    <Modal onClose={onClose} dark={dark}>
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Edit Contribution</h2>
          <button type="button" onClick={onClose} className={`rounded-lg p-1 transition ${t.iconBtn}`}><X size={22} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Amount" dark={dark}>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-medium ${t.textSecondary}`}>₱</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass(dark) + ' pl-8'} placeholder="50" min="0" step="0.01" />
            </div>
          </Field>
          <Field label="Date" dark={dark}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass(dark)} />
          </Field>
          <button type="button" onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition font-semibold text-base shadow-sm shadow-blue-500/20">Save Changes</button>
        </div>
      </div>
    </Modal>
  );
};

const AddSavingsModal = ({ goalColor, onSave, onClose, dark }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const t = theme(dark);
  const handleSubmit = () => { if (!amount) { alert('Please enter an amount'); return; } onSave({ amount: parseFloat(amount), date }); };
  return (
    <Modal onClose={onClose} dark={dark}>
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Add Savings</h2>
          <button type="button" onClick={onClose} className={`rounded-lg p-1 transition ${t.iconBtn}`}><X size={22} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Amount" dark={dark}>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-medium ${t.textSecondary}`}>₱</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass(dark) + ' pl-8 text-lg font-semibold'} placeholder="50" min="0" step="0.01" autoFocus />
            </div>
          </Field>
          <Field label="Date" dark={dark}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass(dark)} />
          </Field>
          <button type="button" onClick={handleSubmit} className="w-full text-white py-3 rounded-xl active:scale-[0.99] transition font-semibold text-base shadow-sm" style={{ backgroundColor: goalColor }}>Add Savings</button>
        </div>
      </div>
    </Modal>
  );
};

const ConfirmModal = ({ title, message, confirmLabel, onConfirm, onClose, dark }) => {
  const t = theme(dark);
  return (
    <Modal onClose={onClose} dark={dark}>
      <div className="p-5 sm:p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4"><Trash2 size={22} className="text-red-600" /></div>
        <h2 className={`text-xl font-bold mb-1.5 ${t.textPrimary}`}>{title}</h2>
        <p className={`mb-6 ${t.textSecondary}`}>{message}</p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className={`flex-1 py-2.5 rounded-xl transition font-semibold ${t.cancelBtn}`}>Cancel</button>
          <button type="button" onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition font-semibold shadow-sm shadow-red-500/20">{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
};

const ProgressRing = ({ goal, size = 'large', dark }) => {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isComplete = percentage >= 100;
  const radius = size === 'large' ? 80 : 34;
  const stroke = size === 'large' ? 14 : 7;
  const dim = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke={dark ? '#1E293B' : '#F1F5F9'} strokeWidth={stroke} />
        <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke={goal.color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        {isComplete ? <CheckCircle2 size={size === 'large' ? 36 : 18} style={{ color: goal.color }} />
          : <span className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-base'} ${dark ? 'text-slate-100' : 'text-slate-900'}`}>{Math.round(percentage)}%</span>}
      </div>
    </div>
  );
};

const CalendarView = ({ goal, onClose, onEditContribution, onDeleteContribution, dark }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const t = theme(dark);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const contributionsByDate = {};
  goal.contributions.forEach(c => { if (!contributionsByDate[c.date]) contributionsByDate[c.date] = []; contributionsByDate[c.date].push(c); });

  const monthlyTotal = goal.contributions.filter(c => { const d = new Date(c.date); return d.getFullYear() === year && d.getMonth() === month; }).reduce((s, c) => s + c.amount, 0);
  const getDayKey = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isToday = (day) => { const x = new Date(); return x.getFullYear() === year && x.getMonth() === month && x.getDate() === day; };
  const fullDate = (s) => new Date(s).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <Modal onClose={onClose} maxWidth="max-w-3xl" dark={dark}>
      <div className={`sticky top-0 ${t.modal} border-b ${t.border} p-4 sm:p-6 z-10`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg sm:text-xl font-bold ${t.textPrimary}`}>Contribution History</h2>
          <button type="button" onClick={onClose} className={`rounded-lg p-1 transition ${t.iconBtn}`}><X size={22} /></button>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); }} className={`p-2 rounded-lg transition ${t.subtleHover} ${t.textSecondary}`}><ArrowLeft size={18} /></button>
          <div className="text-center">
            <h3 className={`text-base sm:text-lg font-semibold ${t.textPrimary}`}>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: goal.color }}>This month: {peso(monthlyTotal)}</p>
          </div>
          <button onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); }} className={`p-2 rounded-lg transition rotate-180 ${t.subtleHover} ${t.textSecondary}`}><ArrowLeft size={18} /></button>
        </div>
        <div className="flex justify-center mt-2">
          <button onClick={() => { setCurrentDate(new Date()); setSelectedDay(null); }} className="text-xs sm:text-sm text-blue-500 hover:text-blue-400 font-medium">Jump to Today</button>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <div key={i} className={`text-center text-xs font-semibold py-1 ${t.textMuted}`}>
              <span className="hidden sm:inline">{d}</span><span className="sm:hidden">{d[0]}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={`e-${index}`} className="aspect-square" />;
            const dayKey = getDayKey(day);
            const dayContribs = contributionsByDate[dayKey] || [];
            const dayTotal = dayContribs.reduce((s, c) => s + c.amount, 0);
            const has = dayContribs.length > 0;
            const today = isToday(day);
            return (
              <button key={day} onClick={() => has && setSelectedDay({ key: dayKey, contributions: dayContribs, total: dayTotal })}
                className={`aspect-square border rounded-xl p-1 relative transition ${today ? 'border-2' : t.border} ${has ? 'cursor-pointer hover:shadow-md' : t.subtleHover}`}
                style={{ borderColor: today ? goal.color : undefined, backgroundColor: has ? goal.color + (dark ? '25' : '15') : undefined }}>
                <div className={`absolute top-1 left-1.5 text-xs font-semibold ${today ? '' : t.textSecondary}`} style={{ color: today ? goal.color : undefined }}>{day}</div>
                {has && (
                  <div className="absolute inset-0 flex items-center justify-center pt-2">
                    <div className="font-bold" style={{ color: goal.color }}>
                      <span className="hidden sm:inline text-sm">₱{dayTotal.toLocaleString()}</span>
                      <span className="sm:hidden text-[10px]">₱{dayTotal > 999 ? (dayTotal / 1000).toFixed(1) + 'k' : dayTotal.toFixed(0)}</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <Modal onClose={() => setSelectedDay(null)} dark={dark}>
          <div className="p-5 sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className={`text-lg font-bold ${t.textPrimary}`}>{fullDate(selectedDay.key)}</h3>
              <button type="button" onClick={() => setSelectedDay(null)} className={`rounded-lg p-1 transition ${t.iconBtn}`}><X size={20} /></button>
            </div>
            <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: goal.color + (dark ? '25' : '15') }}>
              <div className={`text-sm mb-0.5 ${t.textSecondary}`}>Total contributed</div>
              <div className="text-2xl font-bold" style={{ color: goal.color }}>{peso(selectedDay.total)}</div>
            </div>
            <div className="space-y-3">
              {selectedDay.contributions.map(contrib => (
                <div key={contrib.id} className={`p-4 rounded-xl ${t.subtle}`}>
                  <div className={`text-lg font-semibold ${t.textPrimary}`}>{peso(contrib.amount)}</div>
                  {contrib.isInitial && <div className={`text-xs mt-0.5 ${t.textSecondary}`}>Initial contribution</div>}
                  {!contrib.isInitial && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { onEditContribution(contrib); setSelectedDay(null); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"><Edit2 size={15} />Modify</button>
                      <button onClick={() => { onDeleteContribution(contrib.id); setSelectedDay(null); }} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"><Trash2 size={15} />Remove</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedDay(null)} className={`w-full mt-5 py-2.5 rounded-xl transition font-semibold ${t.cancelBtn}`}>Back</button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

const SavingsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showAddSavings, setShowAddSavings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingContribution, setEditingContribution] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [contributionToDelete, setContributionToDelete] = useState(null);
  const [celebrating, setCelebrating] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const t = theme(dark);

  const formatDate = (s) => { const d = new Date(s); return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`; };

  const loadData = async () => {
    try {
      if (window.storage) {
        const result = await window.storage.get('savings-goals');
        if (result && result.value) setGoals(JSON.parse(result.value));
        const dm = await window.storage.get('savings-dark');
        if (dm && dm.value) setDark(JSON.parse(dm.value));
      } else if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('savings-goals');
        if (saved) setGoals(JSON.parse(saved));
        const dm = localStorage.getItem('savings-dark');
        if (dm) setDark(JSON.parse(dm));
      }
    } catch (error) { console.error('Error loading data:', error); }
    setLoading(false);
  };

  const saveData = async (updatedGoals) => {
    setGoals(updatedGoals);
    try {
      if (window.storage) await window.storage.set('savings-goals', JSON.stringify(updatedGoals));
      else if (typeof localStorage !== 'undefined') localStorage.setItem('savings-goals', JSON.stringify(updatedGoals));
    } catch (error) { console.error('Error saving:', error); }
  };

  const toggleDark = async () => {
    const next = !dark;
    setDark(next);
    try {
      if (window.storage) await window.storage.set('savings-dark', JSON.stringify(next));
      else if (typeof localStorage !== 'undefined') localStorage.setItem('savings-dark', JSON.stringify(next));
    } catch (error) { console.error('Error saving theme:', error); }
  };

  const handleCreateGoal = (goal) => { saveData([...goals, goal]); setShowNewGoalForm(false); };

  const handleSaveGoalName = (newName) => {
    saveData(goals.map(g => g.id === editingGoal.id ? { ...g, name: newName } : g));
    setEditingGoal(null);
  };

  const handleAddSavings = ({ amount, date }) => {
    if (!selectedGoalId) return;
    const target = goals.find(g => g.id === selectedGoalId);
    const wasComplete = target.currentAmount >= target.targetAmount;
    const newAmount = target.currentAmount + amount;
    saveData(goals.map(g => g.id === selectedGoalId ? {
      ...g, currentAmount: newAmount,
      contributions: [...g.contributions, { id: crypto.randomUUID(), amount, date }]
    } : g));
    setShowAddSavings(false);
    if (!wasComplete && newAmount >= target.targetAmount) {
      setCelebrating({ ...target, currentAmount: newAmount });
    }
  };

  const handleSaveContribution = (data) => {
    const target = goals.find(g => g.id === selectedGoalId);
    const wasComplete = target.currentAmount >= target.targetAmount;
    const old = target.contributions.find(c => c.id === editingContribution.id);
    const newAmount = target.currentAmount + (data.amount - old.amount);
    saveData(goals.map(g => {
      if (g.id !== selectedGoalId) return g;
      return { ...g, currentAmount: newAmount, contributions: g.contributions.map(c => c.id === editingContribution.id ? { ...c, amount: data.amount, date: data.date } : c) };
    }));
    setEditingContribution(null);
    if (!wasComplete && newAmount >= target.targetAmount) {
      setCelebrating({ ...target, currentAmount: newAmount });
    }
  };

  const confirmDeleteContribution = () => {
    saveData(goals.map(g => {
      if (g.id !== selectedGoalId) return g;
      const c = g.contributions.find(x => x.id === contributionToDelete);
      return { ...g, currentAmount: g.currentAmount - c.amount, contributions: g.contributions.filter(x => x.id !== contributionToDelete) };
    }));
    setContributionToDelete(null);
  };

  const confirmDeleteGoal = () => {
    saveData(goals.filter(g => g.id !== goalToDelete));
    if (selectedGoalId === goalToDelete) { setSelectedGoalId(null); setCurrentView('dashboard'); }
    setGoalToDelete(null);
  };

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  const ThemeToggle = () => (
    <button onClick={toggleDark} className={`p-2.5 rounded-xl transition ${dark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`} title="Toggle theme">
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  const Dashboard = () => (
    <div className={`min-h-screen ${t.page} transition-colors`}>
      <div className="max-w-2xl lg:max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/30">
              <Wallet size={24} className="text-white" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold leading-tight ${t.textPrimary}`}>Savings Tracker</h1>
              <p className={`text-xs sm:text-sm ${t.textSecondary}`}>{goals.length} of 5 goals</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setShowNewGoalForm(true)} disabled={goals.length >= 5}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 sm:px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed transition font-semibold text-sm shadow-sm shadow-blue-500/20">
              <Plus size={18} /> <span className="hidden sm:inline">New Goal</span><span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {goals.length > 0 && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 mb-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-2 text-blue-100 text-sm mb-1"><TrendingUp size={16} /> Total Saved</div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{peso(totalSaved)}</div>
            <div className="text-blue-100 text-sm">of {peso(totalTarget)} across all goals</div>
            <div className="mt-4 h-2 bg-blue-500/40 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${totalTarget ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }} />
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${t.subtle}`}><Target size={32} className={t.textMuted} /></div>
            <p className={`text-lg font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>No savings goals yet</p>
            <p className={`text-sm mt-1 mb-6 ${t.textSecondary}`}>Create your first goal to start tracking</p>
            <button onClick={() => setShowNewGoalForm(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm shadow-blue-500/20"><Plus size={18} /> Create a Goal</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {goals.map(goal => {
              const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const complete = pct >= 100;
              return (
                <div key={goal.id} className={`rounded-2xl shadow-sm hover:shadow-md transition border overflow-hidden ${t.card}`}>
                  <div className="flex items-center gap-3 p-4">
                    <div onClick={() => { setSelectedGoalId(goal.id); setCurrentView('details'); }} className="flex items-center gap-3.5 flex-1 cursor-pointer min-w-0">
                      <ProgressRing goal={goal} size="small" dark={dark} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold truncate ${t.textPrimary}`}>{goal.name}</h3>
                          {complete && <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color + (dark ? '30' : '20'), color: goal.color }}>Done</span>}
                        </div>
                        <p className={`text-sm truncate ${t.textSecondary}`}>{peso(goal.currentAmount)} <span className={t.textMuted}>/</span> {peso(goal.targetAmount)}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setEditingGoal(goal); }} className={`p-2 rounded-lg transition ${dark ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}><Edit2 size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setGoalToDelete(goal.id); }} className={`p-2 rounded-lg transition ${dark ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <div className={dark ? 'h-1.5 bg-slate-800' : 'h-1.5 bg-slate-100'}>
                    <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNewGoalForm && <NewGoalForm onSave={handleCreateGoal} onClose={() => setShowNewGoalForm(false)} dark={dark} />}
      {editingGoal && <EditGoalModal key={editingGoal.id} goal={editingGoal} onSave={handleSaveGoalName} onClose={() => setEditingGoal(null)} dark={dark} />}
      {goalToDelete && <ConfirmModal title="Delete Goal" message="Are you sure you want to delete this goal? This action cannot be undone." confirmLabel="Delete" onConfirm={confirmDeleteGoal} onClose={() => setGoalToDelete(null)} dark={dark} />}
    </div>
  );

  const GoalDetails = () => {
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return null;
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
    const contribCount = goal.contributions.length;
    let daysLeft = null;
    if (goal.hasDeadline && goal.deadline) daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
      <div className={`min-h-screen ${t.page} transition-colors`}>
        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-center mb-5">
            <button type="button" onClick={() => { setCurrentView('dashboard'); setSelectedGoalId(null); }} className={`flex items-center gap-1.5 transition font-medium text-sm ${t.textSecondary} ${dark ? 'hover:text-slate-200' : 'hover:text-slate-900'}`}><ArrowLeft size={18} /> Back</button>
            <ThemeToggle />
          </div>

          <div className={`rounded-2xl shadow-sm border p-6 sm:p-8 mb-4 ${t.card}`}>
            <div className="flex flex-col items-center text-center">
              <h1 className={`text-xl sm:text-2xl font-bold mb-6 break-words ${t.textPrimary}`}>{goal.name}</h1>
              <ProgressRing goal={goal} size="large" dark={dark} />
              <div className="mt-5">
                <div className={`text-3xl font-bold ${t.textPrimary}`}>{peso(goal.currentAmount)}</div>
                <div className={`text-sm mt-0.5 ${t.textSecondary}`}>of {peso(goal.targetAmount)} goal</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className={`rounded-xl p-3.5 text-center ${t.subtle}`}>
                <div className={`text-xs mb-0.5 ${t.textSecondary}`}>Remaining</div>
                <div className={`font-bold ${t.textPrimary}`}>{peso(remaining)}</div>
              </div>
              <div className={`rounded-xl p-3.5 text-center ${t.subtle}`}>
                <div className={`text-xs mb-0.5 ${t.textSecondary}`}>Contributions</div>
                <div className={`font-bold ${t.textPrimary}`}>{contribCount}</div>
              </div>
            </div>

            {goal.hasDeadline && goal.deadline && (
              <div className={`flex items-center justify-center gap-2 mt-3 text-sm rounded-xl py-2.5 ${t.subtle} ${t.textSecondary}`}>
                <Calendar size={16} />
                <span>Deadline: {formatDate(goal.deadline)}</span>
                {daysLeft !== null && daysLeft >= 0 && <span className="font-medium" style={{ color: goal.color }}>({daysLeft} days left)</span>}
                {daysLeft !== null && daysLeft < 0 && <span className="font-medium text-red-500">(overdue)</span>}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
              <button type="button" onClick={() => setShowAddSavings(true)} className="flex-1 flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl active:scale-[0.99] transition font-semibold shadow-sm" style={{ backgroundColor: goal.color }}><Plus size={20} /> Add Savings</button>
              <button type="button" onClick={() => setShowCalendar(true)} className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl active:scale-[0.99] transition font-semibold ${t.cancelBtn}`}><Calendar size={20} /> History</button>
            </div>
          </div>
        </div>

        {showAddSavings && <AddSavingsModal goalColor={goal.color} onSave={handleAddSavings} onClose={() => setShowAddSavings(false)} dark={dark} />}
        {showCalendar && <CalendarView goal={goal} onClose={() => setShowCalendar(false)} onEditContribution={(c) => setEditingContribution(c)} onDeleteContribution={(id) => setContributionToDelete(id)} dark={dark} />}
        {editingContribution && <EditContributionModal key={editingContribution.id} contribution={editingContribution} onSave={handleSaveContribution} onClose={() => setEditingContribution(null)} dark={dark} />}
        {contributionToDelete && <ConfirmModal title="Delete Contribution" message="Are you sure you want to delete this contribution? This action cannot be undone." confirmLabel="Delete" onConfirm={confirmDeleteContribution} onClose={() => setContributionToDelete(null)} dark={dark} />}
      </div>
    );
  };

  if (loading) return <div className={`min-h-screen ${t.page} flex items-center justify-center`}><div className={t.textMuted}>Loading...</div></div>;

  return (
    <>
      {currentView === 'dashboard' ? <Dashboard /> : <GoalDetails />}
      {celebrating && <Celebration goal={celebrating} onClose={() => setCelebrating(null)} dark={dark} />}
    </>
  );
};

export default SavingsTracker;
