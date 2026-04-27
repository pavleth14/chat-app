import React, { useState } from "react";

function SignUpModal({ isOpen, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!firstName || !password) return;

    if (password.length < 8) {
      alert("Password mora imati 8+ karaktera");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          userName,
          password,
          role
        })
      });

      if (!res.ok) throw new Error();

      alert("User created ✅");

      // reset
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");

      onClose();
    } catch (err) {
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-zinc-900 w-full max-w-lg rounded-2xl p-8 relative border border-zinc-700">

        {/* Close dugme */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
          />

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
          />

          {/* Role */}
          <div className="flex gap-4 text-white">
            <label>
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              /> User
            </label>

            <label>
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              /> Admin
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default SignUpModal;