import React, { useEffect, useState } from 'react';
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState('');
  
  const API_URL = "https://fairshare-backend-okf7.onrender.com/api/friends";

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setFriends(data);
  };

  const addFriend = async () => {
    if (!newFriendName.trim()) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFriendName })
    });
    
    setNewFriendName('');
    fetchFriends(); // Refresh list
  };

  return (
    <div className="min-h-screen bg-cream text-stone font-sans pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-stone/50 hover:text-stone bg-white rounded-full shadow-sm transition">
           <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">My Friends</h1>
      </div>

      <div className="px-6">
        {/* Add Friend Input */}
        <div className="flex gap-2 mb-8">
            <input 
                type="text" 
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Enter friend's name..."
                className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
            <button 
                onClick={addFriend}
                className="bg-sage-500 text-white p-3 rounded-xl shadow-lg shadow-sage-500/20 active:scale-95 transition"
            >
                <UserPlus size={24} />
            </button>
        </div>

        {/* Friends List */}
        <h3 className="text-sm font-semibold text-stone/60 mb-4 uppercase tracking-wider">Your Group ({friends.length})</h3>
        
        <div className="space-y-3">
            {friends.map(friend => (
                <div key={friend._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center font-bold text-lg">
                        {friend.avatar}
                    </div>
                    <span className="font-medium text-lg text-stone">{friend.name}</span>
                </div>
            ))}
            
            {friends.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    No friends yet. Add some above!
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Friends;