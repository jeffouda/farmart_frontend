import React from "react";
import { Icon } from "@iconify/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Beef,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative bg-slate-950 pt-24 pb-12 px-6 md:px-20 lg:px-32 w-full overflow-hidden border-t border-white/5">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">
          {/* BRAND COLUMN */}
          <div className="w-full lg:w-1/3">
            <div className="flex items-center gap-4 mb-8">
              {/* Using a Beef icon in place of the image to ensure visibility if logo.jpg is missing */}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20 transition-all duration-500 hover:rotate-6">
                      <Icon icon="noto:cow" className="w-9 h-9" />
                
              </div>
              <span className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Farm<span className="text-green-600">Art</span>
              </span>
            </div>

            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
              The leading digital exchange for healthy, traceable livestock. We
              bridge the gap between quality-focused farmers and professional
              buyers worldwide.
            </p>

            {/* SOCIALS - Swapped indigo for Green 600 */}
            <div className="flex gap-4">
              {[
                { Icon: Facebook, link: "https://facebook.com" },
                { Icon: Twitter, link: "https://twitter.com" },
                { Icon: Instagram, link: "https://instagram.com" },
                { Icon: Linkedin, link: "https://linkedin.com" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:bg-green-600 hover:text-white hover:border-green-600 hover:-translate-y-1 transition-all duration-300">
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* NAVIGATION COLUMNS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 w-full lg:w-auto">
            <div>
              <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 italic">
                Marketplace
              </h3>
              <ul className="flex flex-col gap-4">
                {[
                  "Browse Animals",
                  "How It Works",
                  "Pricing",
                  "Vet Support",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                      className="group flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-green-500 transition-colors">
                      {item}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 italic">
                Resources
              </h3>
              <ul className="flex flex-col gap-4">
                {[
                  "About FarmArt",
                  "Contact Us",
                  "Terms of Trade",
                  "Privacy Policy",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 font-bold text-sm hover:text-green-500 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
            &copy; {currentYear} FarmArt • Engineered for the Modern Rancher
          </p>
         
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;
