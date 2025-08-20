import { motion } from "framer-motion";
import type { ReactNode } from "react";
import logo from "../assets/images/VibeCheck_Logo.png";

interface SocialIconProps {
  href: string;
  icon: ReactNode;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-yellow-400/20 transition-all duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

export default function Footer() {
  return (
    <footer className="bg-indigo-900/15 text-[#AAAAAA] px-8 py-8 mt-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Brand section */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r rounded-md flex items-center justify-center">
            <img src={logo} alt="" />
          </div>
          <span className="text-sm">
            © 2025 VibeCheck. All rights reserved.
          </span>
        </div>

        {/* Description section */}
        <div className="text-sm text-center font-semibold md:text-left">
          VibeCheck matches your daily mood with music and quotes. Contact:{" "}
          <a
            href="mailto:omegamelese68@gmail.com"
            className="hover:text-yellow-400 transition-colors"
          >
            omegamelese68@gmail.com
          </a>
        </div>

        {/* Social icons section */}
        <div className="flex items-center gap-3 justify-center md:justify-end">
          <SocialIcon
            href="https://twitter.com/omelese19"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.954 4.569c-.885.392-1.83.656-2.825.775 
        1.014-.611 1.794-1.574 2.163-2.723-.951.564-2.005.974-3.127 
        1.195-.897-.959-2.178-1.555-3.594-1.555-2.717 
        0-4.924 2.208-4.924 4.924 0 .39.045.765.127 
        1.124-4.09-.205-7.719-2.166-10.148-5.144-.424.729-.667 
        1.577-.667 2.475 0 1.708.87 3.216 2.188 
        4.099-.807-.026-1.566-.248-2.229-.616v.061c0 
        2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 
        0-.626-.031-.928-.088.627 1.956 2.444 3.379 4.6 
        3.419-1.68 1.318-3.809 2.105-6.102 
        2.105-.396 0-.788-.023-1.175-.068 2.179 
        1.397 4.768 2.212 7.557 2.212 9.054 
        0 14-7.496 14-13.986 0-.213-.005-.425-.014-.636.961-.689 
        1.8-1.56 2.46-2.548z"
                />
              </svg>
            }
            label="Twitter"
          />

          <SocialIcon
            href="https://www.instagram.com/o_m_1197/"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 
        4.85.07 3.252.148 4.771 1.691 4.919 
        4.919.058 1.265.069 1.645.069 4.849 
        0 3.205-.012 3.584-.069 4.849-.149 
        3.225-1.664 4.771-4.919 
        4.919-1.266.058-1.644.07-4.85.07-3.204 
        0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 
        0-3.204.013-3.583.07-4.849.149-3.227 
        1.664-4.771 4.919-4.919 1.266-.057 
        1.645-.069 4.849-.069zm0 1.837c-3.144 
        0-3.507.012-4.737.07-2.6.119-3.803 
        1.326-3.922 3.922-.058 1.23-.069 
        1.593-.069 4.737s.012 3.507.07 
        4.737c.119 2.593 1.319 3.803 
        3.922 3.922 1.23.058 1.593.07 
        4.737.07s3.507-.012 4.737-.07c2.594-.119 
        3.803-1.326 3.922-3.922.058-1.23.07-1.593.07-4.737s-.012-3.507-.07-4.737c-.119-2.593-1.326-3.803-3.922-3.922-1.23-.058-1.593-.07-4.737-.07zm0 
        3.905a6.095 6.095 0 1 1 0 
        12.19 6.095 6.095 0 0 1 0-12.19zm0 
        10.053a3.958 3.958 0 1 0 0-7.916 3.958 
        3.958 0 0 0 0 7.916zm6.406-11.845a1.44 
        1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 
        2.881 0z"
                />
              </svg>
            }
            label="Instagram"
          />

          <SocialIcon
            href="https://www.linkedin.com/in/omega-melese"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 0h-14c-2.761 0-5 2.239-5 
        5v14c0 2.761 2.239 5 5 
        5h14c2.762 0 5-2.239 
        5-5v-14c0-2.761-2.238-5-5-5zm-11 
        19h-3v-11h3v11zm-1.5-12.268c-.966 
        0-1.75-.79-1.75-1.764s.784-1.764 
        1.75-1.764 1.75.79 
        1.75 1.764-.783 1.764-1.75 
        1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 
        0v5.604h-3v-11h3v1.765c1.396-2.586 
        7-2.777 7 2.476v6.759z"
                />
              </svg>
            }
            label="LinkedIn"
          />
        </div>
      </div>
    </footer>
  );
}
