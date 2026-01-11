import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Trash2, Edit2 } from 'lucide-react';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const SavingsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showAddSavings, setShowAddSavings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showEditContribution, setShowEditContribution] = useState(false);
  const [showDeleteContribution, setShowDeleteContribution] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [contributionToEdit, setContributionToEdit] = useState(null);
  const [contributionToDelete, setContributionToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    hasDeadline: false,
    deadline: '',
    initialAmount: '',
    color: PRESET_COLORS[0]
  });

  // Add savings state
  const [savingsForm, setSavingsForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Edit goal name state
  const [editGoalName, setEditGoalName] = useState('');

  // Edit contribution state
  const [editContributionForm, setEditContributionForm] = useState({
    amount: '',
    date: ''
  });

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
    try {
      if (window.storage) {
        const result = await window.storage.get('savings-goals');
        if (result && result.value) {
          setGoals(JSON.parse(result.value));
        }
      }
    } catch (error) {
      console.log('No existing data:', error);
    }
    setLoading(false);
  };

  const saveData = async (updatedGoals) => {
    try {
      if (window.storage) {
        await window.storage.set('savings-goals', JSON.stringify(updatedGoals));
      }
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error saving:', error);
      setGoals(updatedGoals);
    }
  };

  const resetNewGoalForm = () => {
    setNewGoal({
      name: '',
      targetAmount: '',
      hasDeadline: false,
      deadline: '',
      initialAmount: '',
      color: PRESET_COLORS[0]
    });
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      alert('Please fill in required fields');
      return;
    }

    const goal = {
      id: crypto.randomUUID(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.initialAmount) || 0,
      hasDeadline: newGoal.hasDeadline,
      deadline: newGoal.hasDeadline ? newGoal.deadline : null,
      color: newGoal.color,
      contributions: newGoal.initialAmount
        ? [{
            id: crypto.randomUUID(),
            amount: parseFloat(newGoal.initialAmount),
            date: new Date().toISOString().split('T')[0],
            isInitial: true
          }]
        : [],
      createdAt: new Date().toISOString()
    };

    saveData([...goals, goal]);
    resetNewGoalForm();
    setShowNewGoalForm(false);
  };

  const handleEditGoalName = () => {
    if (!editGoalName.trim()) {
      alert('Goal name cannot be empty');
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalToEdit) {
        return { ...goal, name: editGoalName };
      }
      return goal;
    });

    saveData(updatedGoals);
    setShowEditGoal(false);
    setGoalToEdit(null);
    setEditGoalName('');
  };

  const handleAddSavings = () => {
    if (!savingsForm.amount || !selectedGoalId) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + parseFloat(savingsForm.amount),
          contributions: [
            ...goal.contributions,
            {
              id: crypto.randomUUID(),
              amount: parseFloat(savingsForm.amount),
              date: savingsForm.date
            }
          ]
        };
      }
      return goal;
    });

    saveData(updatedGoals);
    setSavingsForm({
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddSavings(false);
  };

  const handleEditContribution = () => {
    if (!editContributionForm.amount) {
      alert('Amount cannot be empty');
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoalId) {
        const oldContribution = goal.contributions.find(c => c.id === contributionToEdit);
        const amountDifference = parseFloat(editContributionForm.amount) - oldContribution.amount;
        
        return {
          ...goal,
          currentAmount: goal.currentAmount + amountDifference,
          contributions: goal.contributions.map(c => {
            if (c.id === contributionToEdit) {
              return {
                ...c,
                amount: parseFloat(editContributionForm.amount),
                date: editContributionForm.date
              };
            }
            return c;
          })
        };
      }
      return goal;
    });

    saveData(updatedGoals);
    setShowEditContribution(false);
    setContributionToEdit(null);
    setEditContributionForm({ amount: '', date: '' });
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
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={size === 'small' ? '12' : '16'}
          />
          <circle
            cx={radius * 1.25}
            cy={radius * 1.25}
            r={radius}
            fill="none"
            stroke={goal.color}
            strokeWidth={size === 'small' ? '12' : '16'}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <text
            x={radius * 1.25}
            y={radius * 1.25}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-semibold transform rotate-90"
            style={{ transformOrigin: `${radius * 1.25}px ${radius * 1.25}px` }}
            fontSize={size === 'small' ? '20' : '32'}
            fill="#1E293B"
          >
            {Math.round(percentage)}%
          </text>
        </svg>
        
        <div className="mt-3 text-center">
          <div className={`${size === 'small' ? 'text-sm' : 'text-lg'} font-medium text-gray-700`}>
            ₱{goal.currentAmount.toFixed(2)} / ₱{goal.targetAmount.toFixed(2)}
          </div>
          {isComplete && (
            <div className="text-xs text-green-600 font-medium mt-1">Complete!</div>
          )}
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Savings Tracker</h1>
          <button
            onClick={() => setShowNewGoalForm(true)}
            disabled={goals.length >= 5}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <Plus size={20} /> New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No savings goals yet.</p>
            <p className="text-sm mt-2">Click "New Goal" to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center justify-between"
              >
                <div 
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setCurrentView('details');
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-semibold text-lg text-center">{goal.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGoalToEdit(goal.id);
                      setEditGoalName(goal.name);
                      setShowEditGoal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGoalToDelete(goal.id);
                      setShowDeleteConfirm(true);
                    }}
                    className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewGoalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">New Savings Goal</h2>
              <button onClick={() => setShowNewGoalForm(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="e.g., New Phone"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (₱)
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
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
                    checked={newGoal.hasDeadline}
                    onChange={e => setNewGoal({...newGoal, hasDeadline: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Set Deadline</span>
                </label>
                {newGoal.hasDeadline && (
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Amount (₱) (optional)
                </label>
                <input
                  type="number"
                  value={newGoal.initialAmount}
                  onChange={e => setNewGoal({...newGoal, initialAmount: e.target.value})}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewGoal({...newGoal, color: color})}
                      className={`w-10 h-10 rounded-full transition ${
                        newGoal.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateGoal}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Goal Name</h2>
              <button onClick={() => {
                setShowEditGoal(false);
                setGoalToEdit(null);
                setEditGoalName('');
              }}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={editGoalName}
                  onChange={e => setEditGoalName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleEditGoalName}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Goal</h2>
              <p className="text-gray-600">Are you sure you want to delete this goal? This action cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setGoalToDelete(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGoal}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const GoalDetails = () => {
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return null;

    const contributionsByMonth = {};
    goal.contributions.forEach(contrib => {
      const date = new Date(contrib.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!contributionsByMonth[monthKey]) {
        contributionsByMonth[monthKey] = [];
      }
      contributionsByMonth[monthKey].push(contrib);
    });

    const sortedContributions = [...goal.contributions].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setSelectedGoalId(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{goal.name}</h1>
            
            <div className="flex justify-center mb-6">
              <PieChart goal={goal} size="large" />
            </div>

            {goal.hasDeadline && goal.deadline && (
              <div className="text-center text-sm text-gray-600 mb-4">
                Deadline: {formatDate(goal.deadline)}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setShowAddSavings(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Add Savings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contribution History</h2>
            
            {sortedContributions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No contributions yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedContributions.map(contrib => (
                  <div key={contrib.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        ₱{contrib.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(contrib.date)}
                        {contrib.isInitial && <span className="ml-2 text-xs">(Initial)</span>}
                      </div>
                    </div>
                    {!contrib.isInitial && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setContributionToEdit(contrib.id);
                            setEditContributionForm({
                              amount: contrib.amount.toString(),
                              date: contrib.date
                            });
                            setShowEditContribution(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setContributionToDelete(contrib.id);
                            setShowDeleteContribution(true);
                          }}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {Object.keys(contributionsByMonth).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Summary</h2>
              <div className="space-y-3">
                {Object.entries(contributionsByMonth)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([month, contribs]) => {
                    const total = contribs.reduce((sum, c) => sum + c.amount, 0);
                    const date = new Date(month + '-01');
                    return (
                      <div key={month} className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div className="font-medium text-gray-900">
                          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-gray-700">
                          ₱{total.toFixed(2)}
                          <span className="text-sm text-gray-500 ml-2">
                            ({contribs.length} {contribs.length === 1 ? 'contribution' : 'contributions'})
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {showAddSavings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Savings</h2>
                <button onClick={() => setShowAddSavings(false)}>
                  <X size={20} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₱)
                  </label>
                  <input
                    type="number"
                    value={savingsForm.amount}
                    onChange={e => setSavingsForm({...savingsForm, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={savingsForm.date}
                    onChange={e => setSavingsForm({...savingsForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleAddSavings}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Savings
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditContribution && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Contribution</h2>
                <button onClick={() => {
                  setShowEditContribution(false);
                  setContributionToEdit(null);
                  setEditContributionForm({ amount: '', date: '' });
                }}>
                  <X size={20} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₱)
                  </label>
                  <input
                    type="number"
                    value={editContributionForm.amount}
                    onChange={e => setEditContributionForm({...editContributionForm, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editContributionForm.date}
                    onChange={e => setEditContributionForm({...editContributionForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleEditContribution}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteContribution && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Contribution</h2>
                <p className="text-gray-600">Are you sure you want to delete this contribution? This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteContribution(false);
                    setContributionToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteContribution}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>;
  }

  return currentView === 'dashboard' ? <Dashboard /> : <GoalDetails />;
};

export default SavingsTracker;