import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Edit2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { IEPGoal, SkillMastery } from '../types';
import {
  getAllIEPGoals,
  createIEPGoal,
  updateIEPGoal,
  deleteIEPGoal,
  getGoalsAtRisk,
  getAchievedGoals,
  getGoalsOnTrack,
  linkSkillToGoal,
  unlinkSkillFromGoal,
  updateGoalProgress
} from '../utils/iepGoalTracker';
import { getAllMastery } from '../utils/masteryTracker';
import { useStore } from '../store';

export function IEPGoalsDashboard() {
  const { setCurrentView } = useStore();
  const [goals, setGoals] = useState<IEPGoal[]>([]);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IEPGoal | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    description: '',
    category: 'reading' as 'reading' | 'math' | 'science' | 'behavior',
    targetDate: '',
    measurementType: 'accuracy' as 'accuracy' | 'frequency' | 'duration',
    baselineData: 0,
    targetValue: 80,
    notes: '',
    relatedSkills: [] as string[]
  });

  useEffect(() => {
    loadGoals();
    loadSkills();
  }, []);

  const loadGoals = async () => {
    const allGoals = await getAllIEPGoals();
    setGoals(allGoals);
  };

  const loadSkills = async () => {
    const allSkills = await getAllMastery();
    setSkills(allSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGoal) {
      await updateIEPGoal(editingGoal.id, {
        ...formData,
        targetDate: new Date(formData.targetDate)
      });
    } else {
      await createIEPGoal({
        ...formData,
        targetDate: new Date(formData.targetDate),
        currentProgress: 0
      });
    }

    resetForm();
    loadGoals();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      category: 'reading',
      targetDate: '',
      measurementType: 'accuracy',
      baselineData: 0,
      targetValue: 80,
      notes: '',
      relatedSkills: []
    });
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleEdit = (goal: IEPGoal) => {
    setEditingGoal(goal);
    setFormData({
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate.toISOString().split('T')[0],
      measurementType: goal.measurementType,
      baselineData: goal.baselineData,
      targetValue: goal.targetValue,
      notes: goal.notes || '',
      relatedSkills: goal.relatedSkills
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteIEPGoal(goalId);
      loadGoals();
    }
  };

  const handleToggleSkill = async (goalId: string, skillId: string, isLinked: boolean) => {
    if (isLinked) {
      await unlinkSkillFromGoal(goalId, skillId);
    } else {
      await linkSkillToGoal(goalId, skillId);
    }
    loadGoals();
  };

  const handleRefreshProgress = async () => {
    for (const goal of goals) {
      await updateGoalProgress(goal.id);
    }
    loadGoals();
  };

  const getGoalStatus = (goal: IEPGoal) => {
    const now = new Date();
    if (goal.currentProgress >= 100) return 'achieved';

    const timeElapsed = now.getTime() - goal.createdAt.getTime();
    const totalTime = goal.targetDate.getTime() - goal.createdAt.getTime();
    const expectedProgress = (timeElapsed / totalTime) * 100;

    if (goal.currentProgress < expectedProgress - 20) return 'at-risk';
    return 'on-track';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'on-track':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'at-risk':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="w-5 h-5" />;
      case 'on-track':
        return <Clock className="w-5 h-5" />;
      case 'at-risk':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filterCategory !== 'all' && goal.category !== filterCategory) return false;
    if (filterStatus !== 'all') {
      const status = getGoalStatus(goal);
      if (filterStatus !== status) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-3 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              ←
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Target className="w-10 h-10 text-purple-600" />
                IEP Goals
              </h1>
              <p className="text-gray-600 mt-1">Track and manage IEP goals and progress</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="reading">Reading</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="behavior">Behavior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="achieved">Achieved</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>
            <button
              onClick={handleRefreshProgress}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh Progress
            </button>
          </div>
        </div>

        {/* Goal Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {editingGoal ? 'Edit Goal' : 'Create New IEP Goal'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Goal Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      rows={3}
                      required
                      placeholder="E.g., Student will read CVC words with 80% accuracy..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        required
                      >
                        <option value="reading">Reading</option>
                        <option value="math">Math</option>
                        <option value="science">Science</option>
                        <option value="behavior">Behavior</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Date *
                      </label>
                      <input
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Measurement Type *
                      </label>
                      <select
                        value={formData.measurementType}
                        onChange={(e) => setFormData({ ...formData, measurementType: e.target.value as any })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        required
                      >
                        <option value="accuracy">Accuracy (%)</option>
                        <option value="frequency">Frequency (#)</option>
                        <option value="duration">Duration (min)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Baseline Data
                      </label>
                      <input
                        type="number"
                        value={formData.baselineData}
                        onChange={(e) => setFormData({ ...formData, baselineData: Number(e.target.value) })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Value
                      </label>
                      <input
                        type="number"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      rows={2}
                      placeholder="Additional notes or accommodations..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Target className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                {goals.length === 0
                  ? 'No IEP goals yet. Create your first goal to get started!'
                  : 'No goals match your filters.'}
              </p>
            </div>
          ) : (
            filteredGoals.map((goal) => {
              const status = getGoalStatus(goal);
              return (
                <div
                  key={goal.id}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-l-8 ${getStatusColor(status).split(' ')[1]}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)} flex items-center gap-2`}>
                          {getStatusIcon(status)}
                          {status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          {goal.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {goal.description}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Target Date:</strong> {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Measurement:</strong> {goal.measurementType} ({goal.baselineData} → {goal.targetValue})
                        </p>
                        {goal.notes && (
                          <p>
                            <strong>Notes:</strong> {goal.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-800">
                        {Math.round(goal.currentProgress)}%
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          status === 'achieved'
                            ? 'bg-green-500'
                            : status === 'on-track'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, goal.currentProgress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Related Skills */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Related Skills ({goal.relatedSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .filter(s => goal.relatedSkills.includes(s.id))
                        .map(skill => (
                          <span
                            key={skill.id}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill.skillName}
                            <button
                              onClick={() => handleToggleSkill(goal.id, skill.id, true)}
                              className="text-purple-900 hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
