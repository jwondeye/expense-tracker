import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const API = "https://expense-tracker-backend-qytm.onrender.com";
const COLORS = ["#3b82f6", "#fb7185", "#22c55e", "#facc15", "#a855f7"];

export default function App() {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);
  const [budget, setBudget] = useState(500);

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    total_spent: 0,
    by_category: {},
  });

  const [categories, setCategories] = useState(["food", "gas"]);
  const [newCategory, setNewCategory] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  // -------------------------
  // FETCH DATA (FIXED)
  // -------------------------
  const fetchData = async () => {
    const expRes = await fetch(
      `${API}/expenses?month=${month}&year=${year}`
    );
    const expData = await expRes.json();
    setExpenses(expData);

    const sumRes = await fetch(
      `${API}/expenses/summary?month=${month}&year=${year}`
    );
    const sumData = await sumRes.json();

    console.log("SUMMARY RESPONSE:", sumData); // 👈 DEBUG PROOF

    setSummary({
      total_spent: sumData.total_spent || 0,
      by_category: sumData.by_category || {},
    });
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  // -------------------------
  // ACTIONS
  // -------------------------
  const addExpense = async () => {
    if (!form.amount || !form.category || !form.date) return;

    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });

    setForm({ amount: "", category: "", description: "", date: "" });
    fetchData();
  };

  const deleteExpense = async (id) => {
  await fetch(`${API}/expenses/${id}`, {
    method: "DELETE",
  });

  // refresh expenses after delete
  fetchData();
};


  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.toLowerCase())) return;

    setCategories([...categories, newCategory.toLowerCase()]);
    setNewCategory("");
  };

  // -------------------------
  // PIE DATA (GUARANTEED)
  // -------------------------
  const pieData = Object.entries(summary.by_category).map(
    ([name, value]) => ({ name, value })
  );

  // -------------------------
  // STYLES
  // -------------------------
  const page = {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#fff",
    padding: "32px",
    fontFamily: "system-ui",
  };

  const input = {
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    padding: "6px",
  };

  return (
    <div style={page}>
      <h1>Expense Tracker</h1>

      {/* Month / Year */}
      <div>
        Month{" "}
        <input type="number" value={month} onChange={e => setMonth(+e.target.value)} style={input} />
        {" "}
        Year{" "}
        <input type="number" value={year} onChange={e => setYear(+e.target.value)} style={input} />
      </div>

     {/* Budget */}
<div
  style={{
    border: `2px solid ${
      summary.total_spent > budget ? "#ef4444" : "#22c55e"
    }`,
    background:
      summary.total_spent > budget ? "#3f1d1d" : "transparent",
    padding: 12,
    marginTop: 12,
    borderRadius: 6,
  }}
>
  Monthly Budget: $
  <input
    value={budget}
    onChange={(e) => setBudget(+e.target.value)}
    style={input}
  />
  <div>Total Spent: ${summary.total_spent}</div>
</div>


      {/* Add Expense */}
      <div style={{ marginTop: 16 }}>
        <input placeholder="Amount" value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })} style={input} />
        {" "}
        <select value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })} style={input}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {" "}
        <input placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} style={input} />
        {" "}
        <input type="date" value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })} style={input} />
        {" "}
        <button onClick={addExpense}>Add</button>
      </div>

      {/* Add Category */}
      <div style={{ marginTop: 10 }}>
        <input placeholder="New category" value={newCategory}
          onChange={e => setNewCategory(e.target.value)} style={input} />
        {" "}
        <button onClick={addCategory}>Add Category</button>
      </div>

      {/* Chart + Table */}
      <h2 style={{ marginTop: 30 }}>Spending Breakdown</h2>

      <div style={{ display: "flex", gap: 40 }}>
        {/* PIE — NOW IT WILL SHOW */}
        {pieData.length > 0 ? (
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <div style={{
            width: 300,
            height: 300,
            border: "1px dashed #444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            No data yet
          </div>
        )}

        {/* TABLE */}
        <table border="1" cellPadding="8" style={{ borderColor: "#333" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
  {expenses.map(e => (
    <tr key={e.id}>
      <td>{e.date}</td>
      <td>{e.category}</td>
      <td>{e.description}</td>
      <td>${e.amount}</td>
      <td>
        <button
          onClick={() => deleteExpense(e.id)}
          style={{ color: "red" }}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}
