import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  // 1. Change State: Start with empty friends list
  const [friends, setFriends] = useState([]); 
  const [selectedFriends, setSelectedFriends] = useState([]); 
  const [isScanning, setIsScanning] = useState(false);

  // ⚠️ 2. CONFIG: Your Backend URL (Use Laptop IP!)
  const API_URL = "https://fairshare-backend-okf7.onrender.com";

  // 3. NEW: Fetch Real Friends on Load
  useEffect(() => {
    const fetchFriends = async () => {
        try {
            const res = await fetch(`${API_URL}/api/friends`);
            const data = await res.json();
            setFriends(data);
        } catch (error) {
            console.error("Failed to load friends", error);
        }
    };
    fetchFriends();
  }, []);

  // Calculation Logic
  const numericAmount = parseFloat(amount) || 0;
  const splitCount = selectedFriends.length + 1; // +1 includes YOU
  const splitAmount = (numericAmount / splitCount).toFixed(2);

  const toggleFriend = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAmount(data.total); 
        alert(`Scanned! Found total: $${data.total}`);
      } else {
        alert("Could not find a total on this receipt.");
      }
    } catch (error) {
      console.error("Scan failed:", error);
      alert("Failed to connect. Check IP Address.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = async () => {
    if (!amount || !description) {
        alert("Please enter an amount and description.");
        return;
    }

    const expenseData = {
      description,
      amount: numericAmount,
      paidBy: "You",
      splitBetween: selectedFriends, // Now contains real MongoDB IDs
      amountPerPerson: parseFloat(splitAmount)
    };
    
    try {
        const response = await fetch(`${API_URL}/api/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert("Expense Saved!");
            navigate('/'); // Go back home
        }
    } catch (error) {
        console.error(error);
        alert("Failed to save.");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-stone font-sans pb-24">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-stone/50 hover:text-stone bg-white rounded-full shadow-sm transition">
           <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Add Expense</h1>
      </div>

      <div className="px-6 space-y-6">
        
        {/* Amount Input */}
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-2">Amount</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-sage-600">₹</span>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white text-4xl font-bold text-stone pl-10 pr-4 py-6 rounded-3xl shadow-sm border border-transparent focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none transition-all placeholder:text-stone/20"
                />
            </div>
        </div>

        {/* Description */}
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-2">Description</label>
            <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dinner, Uber, Groceries..."
                className="w-full bg-white text-lg font-medium text-stone px-6 py-4 rounded-2xl shadow-sm border border-transparent focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
            />
        </div>

        {/* Scan Button */}
        <div className="relative overflow-hidden group">
            <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleScan}
                disabled={isScanning}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
            />
            <button 
                className={`w-full font-semibold py-4 rounded-2xl shadow-lg shadow-sage-500/20 flex items-center justify-center gap-3 transition-transform ${
                    isScanning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-sage-500 text-white group-active:scale-[0.98]'
                }`}
            >
                {isScanning ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Scanning...</span>
                    </>
                ) : (
                    <>
                        <Camera size={24} />
                        <span>Scan Receipt</span>
                    </>
                )}
            </button>
        </div>

        {/* Friends Selection (Dynamic) */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm font-semibold text-stone/60">Split with:</h3>
                {numericAmount > 0 && (
                    <span className="text-xs font-bold text-sage-600 bg-sage-100 px-2 py-1 rounded-lg">
                        ₹{splitAmount} / person
                    </span>
                )}
            </div>
            
            {friends.length === 0 ? (
                 <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                    No friends found. <br/> Go back and add some!
                 </div>
            ) : (
                <div className="space-y-3">
                    {friends.map(friend => {
                        // ⚠️ Note: MongoDB uses '_id', not 'id'
                        const isSelected = selectedFriends.includes(friend._id);
                        return (
                            <div 
                                key={friend._id}
                                onClick={() => toggleFriend(friend._id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                                    isSelected 
                                    ? 'bg-sage-100/50 border-sage-500 shadow-sm' 
                                    : 'bg-white border-transparent hover:border-sage-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isSelected ? 'bg-sage-500 text-white' : 'bg-stone/10 text-stone/60'}`}>
                                        {friend.avatar}
                                    </div>
                                    <div>
                                        <span className={`font-medium block ${isSelected ? 'text-stone' : 'text-stone/60'}`}>
                                            {friend.name}
                                        </span>
                                        {isSelected && numericAmount > 0 && (
                                            <span className="text-xs font-bold text-red-400">
                                                Owes you ₹{splitAmount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-sage-500 border-sage-500 text-white' : 'border-stone/20 text-transparent'}`}>
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-sage-100">
         <button 
            onClick={handleSave}
            className="w-full bg-stone text-white font-bold py-4 rounded-2xl shadow-xl shadow-stone/10 active:scale-[0.98] transition-transform"
         >
            Save Expense
         </button>
      </div>

    </div>
  );
};

export default AddExpense;