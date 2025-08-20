// src/components/Navbar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../assets/images/VibeCheck_Logo.png";
import { supabase } from "../lib/supabaseClient";

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    window.location.reload();
  }
}

export default function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentPath = location.pathname;

  // Dynamic nav links based on current page
  const navLinks = [];
  if (currentPath === "/dashboard") {
    navLinks.push({ name: "Tracker", path: "/tracker" });
  } else if (currentPath === "/tracker") {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
  } else if (currentPath === "/settings") {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
    navLinks.push({ name: "Tracker", path: "/tracker" });
  }

  return (
    <nav className="border-b-white text-white px-4 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="flex flex-row gap-2">
        <img src={logo} alt="VibeCheck" className="w-8 h-8" />
        <Link to="/" className="text-2xl font-bold tracking-wide">
          VibeCheck
        </Link>
      </div>

      {/* Right section: nav links (desktop) + profile */}
      <div className="flex items-center gap-4">
        {/* Show nav links beside profile on md+ */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-purple-400 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
          >
            <span className="text-lg">👤</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
              {/* On mobile, also show the nav links here */}
              <div className="md:hidden">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-3 py-2 hover:bg-gray-700 rounded-md"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-md text-red-400"
                onClick={signOutUser}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
