import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";


function Signup() {
  document.title = "Customer Signup";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
    const [userName, setUsername] = useState("");


  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  // ref za redirect na login
  const loginLinkRef = useRef(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!firstName  || !password) return;

    setLoading(true);

    if(password.length < 8) {
      alert('Kratak password');
      setLoading(false);
      return;
    }

    if(userName.length < 8) {
      alert('Kratak password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, password,role,userName }),
      });

      if (!response.ok) throw new Error("Registration failed");

      alert("Registration successful! You can now log in.");
      setFirstName("");
      setLastName("");
      setUsername(""); // <-- reset
      setPassword("");

      // redirect na login preko Link
      if (loginLinkRef.current) {
        loginLinkRef.current.click();
      }
    } catch (err) {
      console.error(err);
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-800">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 px-8 py-12 text-center border-b border-zinc-700">
          <h1 className="text-4xl font-bold text-white mb-3">Sign Up</h1>
          <p className="text-zinc-400 text-lg">Create an account to access support</p>
        </div>

        {/* Signup form */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSignup} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Last Name (optional)
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>
              <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Username (optional)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your last name"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>

          

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg placeholder-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-semibold py-5 rounded-2xl text-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Signing up...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
        <div>
  <label className="block text-sm font-medium text-zinc-400 mb-2">
    Select Role *
  </label>

  <div className="flex gap-6 bg-zinc-800 p-4 rounded-2xl border border-zinc-700">

    <label className="flex items-center gap-2 cursor-pointer text-white">
      <input
        type="radio"
        value="user"
        checked={role === "user"}
        onChange={(e) => setRole(e.target.value)}
        className="accent-indigo-500"
      />
      User
    </label>

    <label className="flex items-center gap-2 cursor-pointer text-white">
      <input
        type="radio"
        value="admin"
        checked={role === "admin"}
        onChange={(e) => setRole(e.target.value)}
        className="accent-indigo-500"
      />
      Admin
    </label>

  </div>
</div>

        {/* Footer */}
        <div className="text-center pb-8 text-zinc-500 text-sm space-y-2">
          <p>Your data is secure and will not be shared.</p>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 hover:text-indigo-400 underline"
            >
              Log in here
            </Link>
          </p>
        </div>

        {/* skriveni link za automatski redirect */}
        <Link to="/login" ref={loginLinkRef} style={{ display: "none" }}>
          login
        </Link>

      </div>
    </div>
  );
}

export default Signup;