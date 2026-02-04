import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  Plus,
  Activity,
  User,
  Receipt,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalOwedToYou, setTotalOwedToYou] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


 const API_URL = 'https://fairshare-backend-okf7.onrender.com/api/expenses';

  useEffect(() => {
    fetchExpenses();
  }, []);

  const deleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;

    try {
      
      await fetch(`https://fairshare-backend-okf7.onrender.com/api/expenses/${id}`, {
        method: "DELETE",
      });
      fetchExpenses(); // Refresh list
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const fetchExpenses = async () => {
    try {
       console.log("FETCHING FROM:", API_URL); 
      const response = await fetch(API_URL);
      const data = await response.json();

      setExpenses(data);

      // Calculate Total: Sum of (Amount Per Person * Number of Friends involved)
      const total = data.reduce((acc, curr) => {
        // If you paid $30 and split with 2 friends (3 people total),
        // each owes $10. So you are owed $20.
        const friendsCount = curr.splitBetween.length;
        const amountOwed = curr.amountPerPerson * friendsCount;
        return acc + amountOwed;
      }, 0);

      setTotalOwedToYou(total);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-stone font-sans pb-24">
      {/* 1. Header Section */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <button className="p-2 bg-sage-100 rounded-full text-sage-600 hover:bg-sage-200 transition">
            <Activity size={20} />
          </button>
        </div>

        {/* 2. The "Sage" Balance Card (Dynamic Data) */}
        <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-6 text-white shadow-lg shadow-sage-500/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <p className="text-sage-100 text-sm font-medium mb-1">
                Total Owed to You
              </p>
              {loading ? (
                <div className="animate-pulse h-10 w-32 bg-white/20 mx-auto rounded"></div>
              ) : (
                <h2 className="text-4xl font-bold tracking-tight">
                  ₹
                  {totalOwedToYou.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div>
                <p className="text-sage-100 text-xs uppercase tracking-wider">
                  Your Expenses
                </p>
                <p className="text-xl font-semibold mt-1">{expenses.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sage-100 text-xs uppercase tracking-wider">
                  You owe
                </p>
                <p className="text-xl font-semibold mt-1 text-red-100">₹0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity List */}
      <div className="px-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Scans
        </h3>

        {loading ? (
          <p className="text-center text-gray-400 mt-10">
            Loading transactions...
          </p>
        ) : expenses.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">No expenses yet.</p>
            <p className="text-sm text-sage-500 mt-2">
              Tap + to scan a receipt!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                {/* Inside expenses.map, update the row to include the delete button */}
                <div
                  key={expense._id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 block">
                        {expense.description}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-sage-600 block">
                        + ₹
                        {(
                          expense.amountPerPerson * expense.splitBetween.length
                        ).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Total: ₹{expense.amount}
                      </span>
                    </div>
                    {/* NEW DELETE BUTTON */}
                    <button
                      onClick={() => deleteExpense(expense._id)}
                      className="text-gray-300 hover:text-red-400 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Navigation (Static for now) */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-gray-200/50 p-1 flex justify-between items-center z-50 border border-white/50">
        <NavButton icon={<Home size={24} />} active />
        <button
          onClick={() => navigate("/friends")}
          className="p-4 rounded-xl text-gray-400 hover:text-sage-600 transition-colors"
        >
          <Users size={24} />
        </button>

        {/* Note: In a real app, this button would use React Router to navigate */}
        <div className="-mt-8">
          <button
            onClick={() => navigate("/add")}
            className="bg-sage-500 hover:bg-sage-600 text-white p-4 rounded-full shadow-lg shadow-sage-500/40 transition-transform active:scale-95"
          >
            <Plus size={28} />
          </button>
        </div>

        <NavButton icon={<Activity size={24} />} />
        <button
          onClick={() => navigate("/friends")}
          className="p-4 rounded-xl text-gray-400 hover:text-sage-600 transition-colors"
        >
          <Users size={24} />
        </button>
      </div>
    </div>
  );
};

const NavButton = ({ icon, active }) => (
  <button
    className={`p-4 rounded-xl transition-colors ${active ? "text-sage-600" : "text-gray-400 hover:text-gray-600"}`}
  >
    {icon}
  </button>
);

export default Dashboard;
