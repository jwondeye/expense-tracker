import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#fb7185"];

export default function Tracker() {
  const { user } = useAuth();

  // 🔐 User-scoped expenses
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(`expenses-${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  const saveExpenses = (next) => {
    setExpenses(next);
    localStorage.setItem(`expenses-${user.email}`, JSON.stringify(next));
  };

  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Categories
  const [categories, setCategories] = useState(["gas", "food"]);
  const [category, setCategory] = useState("gas");
  const [newCategory, setNewCategory] = useState("");

  // Month / year
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);

  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  // Budgets (stored as STRING → avoids leading-zero bug)
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem(`budgets-${user.email}`);
    return saved ? JSON.parse(saved) : {};
  });

  const saveBudgets = (next) => {
    setBudgets(next);
    localStorage.setItem(`budgets-${user.email}`, JSON.stringify(next));
  };

  const monthlyBudget = budgets[monthKey] ?? "";

  const setMonthlyBudget = (value) => {
    const cleaned = value === "" ? "" : String(Number(value));
    saveBudgets({ ...budgets, [monthKey]: cleaned });
  };

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
  });

  const totalSpent = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const numericBudget = Number(monthlyBudget) || 0;
  const overBudget = numericBudget > 0 && totalSpent > numericBudget;

  // Pie data
  const categoryTotals = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: categoryTotals[key],
  }));

  // Actions
  const addExpense = () => {
    if (!amount || !category || !date) return;

    saveExpenses([
      ...expenses,
      {
        id: Date.now(),
        amount: Number(amount),
        category,
        description,
        date,
      },
    ]);

    setAmount("");
    setDescription("");
    setDate("");
  };

  const deleteExpense = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const addCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setCategory(newCategory);
    setNewCategory("");
  };

  return (
    <div className="tracker-page">
      <div className="container">
        <h1>Expense Tracker</h1>

        <div className="row">
          <input value={month} onChange={(e) => setMonth(e.target.value)} />
          <input value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        <div className={`budget-box ${overBudget ? "over-budget" : ""}`}>
          <strong>
            Monthly Budget: $
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              style={{ width: 100, marginLeft: 8 }}
            />
          </strong>

          <div>Total Spent: ${totalSpent}</div>

          <div
            style={{
              marginTop: 10,
              height: 10,
              borderRadius: 6,
              background: "#222",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${
                  numericBudget > 0
                    ? Math.min((totalSpent / numericBudget) * 100, 100)
                    : 0
                }%`,
                background: overBudget ? "#ef4444" : "#22c55e",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div className="row">
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <button onClick={addExpense}>Add Expense</button>
        </div>

        <div className="row">
          <input
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={addCategory}>Add Category</button>
        </div>

        <h2>Spending Breakdown</h2>

        <div className="dashboard">
          <PieChart width={300} height={320}>
            <Pie data={pieData} dataKey="value" outerRadius={120} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td>{e.category}</td>
                  <td>{e.description}</td>
                  <td>${e.amount}</td>
                  <td>
                    <button onClick={() => deleteExpense(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
