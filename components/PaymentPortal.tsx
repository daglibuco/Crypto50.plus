
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, X, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { addCredits } from '../services/crmService';

interface PaymentPortalProps {
  planName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentPortal: React.FC<PaymentPortalProps> = ({ planName, amount, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setStep('success');
      // Add credits based on plan
      if (planName.includes('50 Credits')) addCredits(50);
      else if (planName.includes('100 Credits')) addCredits(100);
      else if (planName.includes('200 Credits')) addCredits(200);
      else if (planName.includes('Primary')) addCredits(50); // Membership base credits
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="bg-white rounded-[4rem] w-full max-w-xl p-16 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg border-4 border-white">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Payment Confirmed</h2>
          <p className="text-xl text-slate-500 font-medium mb-12">Your account has been upgraded and credits have been synchronized.</p>
          <button 
            onClick={onSuccess}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            Enter Member Portal <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="bg-white rounded-[4rem] w-full max-w-md p-16 text-center shadow-2xl">
          <RefreshCw className="w-24 h-24 text-blue-600 animate-spin mx-auto mb-10" />
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Securing Transaction...</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Connecting to Stripe Secure Gateway</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-slate-50 p-8 border-b-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md">
                <CreditCard className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Checkout</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{planName}</p>
             </div>
          </div>
          <button onClick={onCancel} className="p-3 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handlePay} className="p-10 space-y-6">
           <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
              <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">Total Amount Due</div>
              <div className="text-5xl font-black tracking-tighter">CHF {amount.toFixed(2)}</div>
           </div>

           <div className="space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Number</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input 
                      type="text" 
                      required 
                      placeholder="**** **** **** ****" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-mono text-lg"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="MM/YY" 
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-mono text-lg"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value.substring(0, 5))}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CVC</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="***" 
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-mono text-lg text-center"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    />
                 </div>
              </div>
           </div>

           <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                Complete Payment <ArrowRight className="w-5 h-5" />
              </button>
           </div>

           <div className="flex items-center justify-center gap-2 pt-4">
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secured by SSL & Stripe Gateway</span>
           </div>
        </form>
      </div>
    </div>
  );
};
