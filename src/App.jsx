import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Trash2, Edit2 } from 'lucide-react';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

/* =========================
   EDIT GOAL MODAL (FIXED)
========================= */
const EditGoalModal = ({ goal, onSave, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(goal.name);
  }, [goal]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Goal Name</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={() => name.trim() && onSave(name)}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ===============================
   EDIT CONTRIBUTION MODAL (FIXED)
================================ */
const EditContributionModal = ({ contribution, onSave, onClose }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setAmount(String(contribution.amount));
    setDate(contribution.date);
  }, [contribution]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Contribution</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={() => onSave({ amount: parseFloat(amount), date })}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

/* =========================
   MAIN APP
========================= */
const SavingsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const [editingGoal, setEditingGoal] = useState(null);
  const [editingContribution, setEditingContribution] = useState(null);

  const saveData = (data) => setGoals(data);

  const handleSaveGoalName = (name) => {
    saveData(
      goals.map(g =>
        g.id === editingGoal.id ? { ...g, name } : g
      )
    );
    setEditingGoal(null);
  };

  const handleSaveContribution = (updated) => {
    saveData(
      goals.map(goal => {
        if (goal.id !== selectedGoalId) return goal;

        const old = goal.contributions.find(c => c.id === editingContribution.id);
        const diff = updated.amount - old.amount;

        return {
          ...goal,
          currentAmount: goal.currentAmount + diff,
          contributions: goal.contributions.map(c =>
            c.id === old.id ? { ...c, ...updated } : c
          )
        };
      })
    );

    setEditingContribution(null);
  };

  return (
    <>
      {editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          onSave={handleSaveGoalName}
          onClose={() => setEditingGoal(null)}
        />
      )}

      {editingContribution && (
        <EditContributionModal
          contribution={editingContribution}
          onSave={handleSaveContribution}
          onClose={() => setEditingContribution(null)}
        />
      )}

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Savings Tracker</h1>

        {goals.map(goal => (
          <div key={goal.id} className="flex justify-between p-4 bg-white rounded shadow mb-2">
            <span>{goal.name}</span>
            <button onClick={() => setEditingGoal(goal)}>
              <Edit2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SavingsTracker;
