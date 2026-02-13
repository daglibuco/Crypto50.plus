
import React from 'react';
import { Mail, MessageCircle, Shield, FileText, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              Crypto50<span className="text-blue-500">.plus</span>
              <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A service by <strong className="text-white">CREDEMA AG</strong>
            </p>
            <address className="not-italic text-sm text-slate-400 leading-relaxed">
              Neuhofstrasse 5A<br />
              6340 Baar (ZG)<br />
              Switzerland
            </address>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal & Information</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                  <FileText className="w-4 h-4" /> Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                  <Shield className="w-4 h-4" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                  <Info className="w-4 h-4" /> Impressum
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Actions */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Get in Touch</h4>
            <div className="space-y-4">
              <a 
                href="mailto:Crypto50plus@gmail.com" 
                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors group"
              >
                <div className="bg-blue-600 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Email Us</div>
                  <div className="text-white font-medium">Crypto50plus@gmail.com</div>
                </div>
              </a>

              <a 
                href="https://wa.me/41794533437" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors group"
              >
                <div className="bg-green-600 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">WhatsApp Support</div>
                  <div className="text-white font-medium">+41 79 453 34 37</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Crypto50.plus by CREDEMA AG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
