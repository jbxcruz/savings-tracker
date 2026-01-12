import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Trash2, Edit2 } from 'lucide-react';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const NewGoalForm = ({ onSave, onClose }) => {
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalInitial, setGoalInitial] = useState('');
  const [goalHasDeadline, setGoalHasDeadline] = useState(false);
  const [goalColor, setGoalColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = () => {
    if (!goalName || !goalTarget) {
      alert('Please fill in required fields');
      return;
    }

    const goal = {
      id: crypto.randomUUID(),
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      currentAmount: parseFloat(goalInitial) || 0,
      hasDeadline: goalHasDeadline,
      deadline: goalHasDeadline ? goalDeadline : null,
      color: goalColor,
      contributions: goalInitial
        ? [{
            id: crypto.randomUUID(),
            amount: parseFloat(goalInitial),
            date: new Date().toISOString().split('T')[0],
            isInitial: true
          }]
        : [],
      createdAt: new Date().toISOString()
    };

    onSave(goal);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">New Savings Goal</h2>
          <button type="button" onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g., New Phone"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₱)</label>
            <input
              type="number"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={goalHasDeadline}
                onChange={(e) => setGoalHasDeadline(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Set Deadline</span>
            </label>
            {goalHasDeadline && (
              <input
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Amount (₱) (optional)</label>
            <input
              type="number"
              value={goalInitial}
              onChange={(e) => setGoalInitial(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setGoalColor(color)}
                  className={`w-10 h-10 rounded-full transition ${
                    goalColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
};

const EditGoalModal = ({ goal, onSave, onClose }) => {
  const [name, setName] = useState(goal?.name || '');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Goal name cannot be empty');
      return;
    }
    onSave(name);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Goal Name</h2>
          <button type="button" onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const EditContributionModal = ({ contribution, onSave, onClose }) => {
  const [amount, setAmount] = useState(contribution?.amount?.toString() || '');
  const [date, setDate] = useState(contribution?.date || '');

  const handleSubmit = () => {
    if (!amount) {
      alert('Amount cannot be empty');
      return;
    }
    onSave({ amount: parseFloat(amount), date });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Contribution</h2>
          <button type="button" onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AddSavingsModal = ({ onSave, onClose }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    onSave({ amount: parseFloat(amount), date });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Savings</h2>
          <button type="button" onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Savings
          </button>
        </div>
      </div>
    </div>
  );
};

const SavingsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showAddSavings, setShowAddSavings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingContribution, setEditingContribution] = useState(null);
  const [showDeleteContribution, setShowDeleteContribution] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [contributionToDelete, setContributionToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const loadData = async () => {
    console.log('loadData called');
    
    try {
      if (window.storage) {
        // Use Claude's storage API
        console.log('Using window.storage');
        const result = await window.storage.get('savings-goals');
        
        if (result && result.value) {
          const loadedGoals = JSON.parse(result.value);
          console.log('Loaded goals from window.storage:', loadedGoals);
          setGoals(loadedGoals);
        }
      } else if (typeof localStorage !== 'undefined') {
        // Fallback to localStorage
        console.log('Using localStorage');
        const saved = localStorage.getItem('savings-goals');
        if (saved) {
          const loadedGoals = JSON.parse(saved);
          console.log('Loaded goals from localStorage:', loadedGoals);
          setGoals(loadedGoals);
        }
      } else {
        console.log('No storage available');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const saveData = async (updatedGoals) => {
    console.log('saveData called with:', updatedGoals);
    
    setGoals(updatedGoals);
    
    try {
      if (window.storage) {
        // Use Claude's storage API
        console.log('Saving to window.storage');
        await window.storage.set('savings-goals', JSON.stringify(updatedGoals));
        console.log('Saved to window.storage successfully');
      } else if (typeof localStorage !== 'undefined') {
        // Fallback to localStorage
        console.log('Saving to localStorage');
        localStorage.setItem('savings-goals', JSON.stringify(updatedGoals));
        console.log('Saved to localStorage successfully');
      } else {
        console.log('No storage available for saving');
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleCreateGoal = (goal) => {
    saveData([...goals, goal]);
    setShowNewGoalForm(false);
  };

  const handleSaveGoalName = (newName) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === editingGoal.id) {
        return { ...goal, name: newName };
      }
      return goal;
    });
    saveData(updatedGoals);
    setEditingGoal(null);
  };

  const handleAddSavings = ({ amount, date }) => {
    if (!selectedGoalId) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoalId) {
        const newCurrentAmount = goal.currentAmount + amount;
        const isNowComplete = newCurrentAmount >= goal.targetAmount && goal.currentAmount < goal.targetAmount;
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          name: isNowComplete && !goal.name.includes('(Completed)') 
            ? `${goal.name} (Completed)` 
            : goal.name,
          contributions: [
            ...goal.contributions,
            {
              id: crypto.randomUUID(),
              amount: amount,
              date: date
            }
          ]
        };
      }
      return goal;
    });

    saveData(updatedGoals);
    setShowAddSavings(false);
  };

  const handleSaveContribution = (updatedData) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoalId) {
        const oldContribution = goal.contributions.find(c => c.id === editingContribution.id);
        const amountDifference = updatedData.amount - oldContribution.amount;
        
        return {
          ...goal,
          currentAmount: goal.currentAmount + amountDifference,
          contributions: goal.contributions.map(c => {
            if (c.id === editingContribution.id) {
              return {
                ...c,
                amount: updatedData.amount,
                date: updatedData.date
              };
            }
            return c;
          })
        };
      }
      return goal;
    });

    saveData(updatedGoals);
    setEditingContribution(null);
  };

  const confirmDeleteContribution = () => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoalId) {
        const contribToDelete = goal.contributions.find(c => c.id === contributionToDelete);
        return {
          ...goal,
          currentAmount: goal.currentAmount - contribToDelete.amount,
          contributions: goal.contributions.filter(c => c.id !== contributionToDelete)
        };
      }
      return goal;
    });

    saveData(updatedGoals);
    setShowDeleteContribution(false);
    setContributionToDelete(null);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      const updatedGoals = goals.filter(g => g.id !== goalToDelete);
      saveData(updatedGoals);
      setShowDeleteConfirm(false);
      setGoalToDelete(null);
      if (selectedGoalId === goalToDelete) {
        setSelectedGoalId(null);
        setCurrentView('dashboard');
      }
    }
  };

  const PieChart = ({ goal, size = 'small' }) => {
    const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const isComplete = percentage >= 100;
    
    const radius = size === 'small' ? 50 : 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <svg width={radius * 2.5} height={radius * 2.5} className="transform -rotate-90">
          <circle cx={radius * 1.25} cy={radius * 1.25} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={size === 'small' ? '12' : '16'} />
          <circle cx={radius * 1.25} cy={radius * 1.25} r={radius} fill="none" stroke={goal.color} strokeWidth={size === 'small' ? '12' : '16'} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
          <text x={radius * 1.25} y={radius * 1.25} textAnchor="middle" dominantBaseline="middle" className="font-semibold transform rotate-90" style={{ transformOrigin: `${radius * 1.25}px ${radius * 1.25}px` }} fontSize={size === 'small' ? '20' : '32'} fill="#1E293B">{Math.round(percentage)}%</text>
        </svg>
        <div className="mt-3 text-center">
          <div className={`${size === 'small' ? 'text-sm' : 'text-lg'} font-medium text-gray-700`}>₱{goal.currentAmount.toFixed(2)} / ₱{goal.targetAmount.toFixed(2)}</div>
          {isComplete && <div className="text-xs text-green-600 font-medium mt-1">Complete!</div>}
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Savings Tracker</h1>
          <button onClick={() => setShowNewGoalForm(true)} disabled={goals.length >= 5} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"><Plus size={20} /> New Goal</button>
        </div>
        {goals.length === 0 ? (
          <div className="text-center py-16 text-gray-500"><p className="text-lg">No savings goals yet.</p><p className="text-sm mt-2">Click "New Goal" to get started!</p></div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center justify-between">
                <div onClick={() => { setSelectedGoalId(goal.id); setCurrentView('details'); }} className="flex-1 cursor-pointer"><h3 className="font-semibold text-lg text-center">{goal.name}</h3></div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setEditingGoal(goal); }} className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition"><Edit2 size={20} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setGoalToDelete(goal.id); setShowDeleteConfirm(true); }} className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showNewGoalForm && <NewGoalForm onSave={handleCreateGoal} onClose={() => setShowNewGoalForm(false)} />}
      {editingGoal && <EditGoalModal key={editingGoal.id} goal={editingGoal} onSave={handleSaveGoalName} onClose={() => setEditingGoal(null)} />}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="mb-4"><h2 className="text-xl font-bold text-gray-900 mb-2">Delete Goal</h2><p className="text-gray-600">Are you sure you want to delete this goal? This action cannot be undone.</p></div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowDeleteConfirm(false); setGoalToDelete(null); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
              <button type="button" onClick={confirmDeleteGoal} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const GoalDetails = () => {
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return null;

    const sortedContributions = [...goal.contributions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group contributions by month
    const contributionsByMonth = {};
    goal.contributions.forEach(contrib => {
      const date = new Date(contrib.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!contributionsByMonth[monthKey]) {
        contributionsByMonth[monthKey] = [];
      }
      contributionsByMonth[monthKey].push(contrib);
    });

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button type="button" onClick={() => { setCurrentView('dashboard'); setSelectedGoalId(null); }} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"><ArrowLeft size={20} />Back to Dashboard</button>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{goal.name}</h1>
            <div className="flex justify-center mb-6"><PieChart goal={goal} size="large" /></div>
            {goal.hasDeadline && goal.deadline && <div className="text-center text-sm text-gray-600 mb-4">Deadline: {formatDate(goal.deadline)}</div>}
            <div className="flex justify-center"><button type="button" onClick={() => setShowAddSavings(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={20} />Add Savings</button></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contribution History</h2>
              {sortedContributions.length === 0 ? <p className="text-gray-500 text-center py-8">No contributions yet.</p> : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedContributions.map(contrib => (
                    <div key={contrib.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <div className="font-medium text-gray-900">₱{contrib.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{formatDate(contrib.date)}{contrib.isInitial && <span className="ml-2 text-xs">(Initial)</span>}</div>
                      </div>
                      {!contrib.isInitial && (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setEditingContribution(contrib)} className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition"><Edit2 size={18} /></button>
                          <button type="button" onClick={() => { setContributionToDelete(contrib.id); setShowDeleteContribution(true); }} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"><Trash2 size={18} /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Summary</h2>
              {Object.keys(contributionsByMonth).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No contributions yet.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(contributionsByMonth)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([month, contribs]) => {
                      const total = contribs.reduce((sum, c) => sum + c.amount, 0);
                      const date = new Date(month + '-01');
                      return (
                        <div key={month} className="border-b border-gray-100 pb-3">
                          <div className="font-medium text-gray-900">
                            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-gray-700 mt-1">
                            ₱{total.toFixed(2)}
                            <span className="text-sm text-gray-500 ml-2">
                              ({contribs.length} {contribs.length === 1 ? 'contribution' : 'contributions'})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
        {showAddSavings && <AddSavingsModal onSave={handleAddSavings} onClose={() => setShowAddSavings(false)} />}
        {editingContribution && <EditContributionModal key={editingContribution.id} contribution={editingContribution} onSave={handleSaveContribution} onClose={() => setEditingContribution(null)} />}
        {showDeleteContribution && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="mb-4"><h2 className="text-xl font-bold text-gray-900 mb-2">Delete Contribution</h2><p className="text-gray-600">Are you sure you want to delete this contribution? This action cannot be undone.</p></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowDeleteContribution(false); setContributionToDelete(null); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
                <button type="button" onClick={confirmDeleteContribution} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;

  return currentView === 'dashboard' ? <Dashboard /> : <GoalDetails />;
};

export default SavingsTracker;