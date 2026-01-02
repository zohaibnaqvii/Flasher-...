
import React, { useState, useEffect, useRef } from 'react';
import { Step, TransactionData, PaymentMethod } from './types';
import { NETWORKS, PLANS, PAYMENT_METHODS, EXCHANGE_LOGOS, LICENSE_KEY_VALID, TELEGRAM_SUPPORT, ALL_SUPPORTED_NAMES } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.WELCOME);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<TransactionData>({
    network: null,
    amount: '',
    fee: '',
    address: '',
    licenseKey: ''
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentStep === Step.FEE_PAYMENT && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuthChoice = (choice: 'key' | 'pay') => {
    setError(null);
    if (choice === 'key') setCurrentStep(Step.KEY_ENTRY);
    else setCurrentStep(Step.FEE_PAYMENT);
  };

  const verifyKey = () => {
    if (data.licenseKey.trim() === LICENSE_KEY_VALID) {
      setCurrentStep(Step.SUBMITTED);
    } else {
      setError("FAILED: INVALID SYSTEM KEY");
    }
  };

  const validateDetails = () => {
    if (!data.amount) return setError("Select injection amount.");
    if (data.address.trim().length < 10) return setError("Enter a valid target address.");
    setError(null);
    setCurrentStep(Step.AUTH_CHOICE);
  };

  const goBack = () => {
    setError(null);
    if (currentStep === Step.NETWORK) setCurrentStep(Step.WELCOME);
    else if (currentStep === Step.DETAILS) setCurrentStep(Step.NETWORK);
    else if (currentStep === Step.AUTH_CHOICE) setCurrentStep(Step.DETAILS);
    else if (currentStep === Step.KEY_ENTRY) setCurrentStep(Step.AUTH_CHOICE);
    else if (currentStep === Step.FEE_PAYMENT) setCurrentStep(Step.AUTH_CHOICE);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 relative bg-black overflow-hidden select-none">
      <div className="hero-gradient"></div>
      <div className="scanlines"></div>
      
      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Tight Official Header */}
        <div className="text-center mb-2 flex flex-col items-center animate-in fade-in duration-700">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] border-t border-white/20">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight uppercase text-white">
              <span className="text-emerald-500 text-glow">FLASH</span> USDT 2026
            </h1>
          </div>
          <span className="text-[7px] font-bold text-emerald-400/30 tracking-[0.5em] uppercase">SECURE ENTERPRISE RELAY</span>
        </div>

        <div className="glass-panel w-full rounded-[28px] overflow-hidden relative border shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col max-h-[80vh]">
          {/* Internal Navbar */}
          <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
              </div>
              <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 shadow-sm">
                {currentStep === Step.WELCOME ? 'READY' : currentStep.replace('_', ' ')}
              </span>
            </div>
            
            {currentStep === Step.WELCOME && (
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-emerald-500 p-1.5 bg-emerald-500/10 rounded-lg active:scale-90 transition-all border border-emerald-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            )}
          </div>

          {/* Menu Drawer */}
          {menuOpen && currentStep === Step.WELCOME && (
            <div className="absolute inset-0 z-50 bg-black/98 animate-in slide-in-from-right duration-400">
              <div className="p-6 space-y-5 h-full flex flex-col">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-500">SYSTEM PROTOCOL</h3>
                  <button onClick={() => setMenuOpen(false)} className="text-zinc-600 p-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                  <div className="p-4 bg-emerald-500/5 border-l-2 border-emerald-500 rounded-r-xl border-y border-r border-white/5">
                    <p className="text-[10px] leading-relaxed text-zinc-300 font-semibold uppercase tracking-tight">
                      WITHDRAW <span className="text-emerald-500">PROFIT ONLY</span> VIA <span className="text-emerald-500">FLASH USDT</span> ON SUPPORTED BROKERS.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-700">CONNECTED NODES</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_SUPPORTED_NAMES.map(name => (
                        <div key={name} className="flex items-center gap-1.5 py-2 px-3 bg-white/5 rounded-lg text-zinc-400 border border-white/5 text-[8px] font-semibold">
                          <div className="w-1 h-1 bg-emerald-500/50 rounded-full"></div> {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <a href={TELEGRAM_SUPPORT} target="_blank" className="w-full py-3.5 bg-emerald-700 text-white text-center text-[10px] font-bold tracking-[0.3em] uppercase rounded-xl shadow-lg active:scale-95 transition-all">
                  CORE SUPPORT
                </a>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="px-5 py-5 overflow-y-auto flex-1 scrollbar-hide flex flex-col justify-center">
            {currentStep === Step.WELCOME && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-[0.3em] uppercase rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    RELAY: ACTIVE
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white leading-tight uppercase">
                    <span className="text-emerald-500 italic">2026 EDITION</span><br/>
                    <span className="opacity-90">START TERMINAL</span>
                  </h2>
                </div>

                <div className="w-full space-y-3">
                  <button 
                    onClick={() => setCurrentStep(Step.NETWORK)}
                    className="w-full py-5 btn-next text-white text-[12px] font-bold tracking-[0.5em] uppercase rounded-[20px] shadow-[0_10px_30px_rgba(16,185,129,0.25)] active:scale-95 transition-all"
                  >
                    GET FLASH USDT
                  </button>
                  
                  <a 
                    href={TELEGRAM_SUPPORT} 
                    target="_blank" 
                    className="flex items-center justify-center gap-2 w-full py-3 border border-emerald-500/10 bg-emerald-500/5 rounded-[18px] text-[9px] font-bold tracking-[0.3em] uppercase text-emerald-400 active:bg-emerald-500 active:text-black transition-all"
                  >
                    SUPPORT CENTER
                  </a>
                </div>

                <div className="pt-2 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                  {EXCHANGE_LOGOS.slice(0, 4).map((l) => (
                    <img key={l.name} src={l.url} alt={l.name} className="h-4 w-auto object-contain" />
                  ))}
                </div>
              </div>
            )}

            {currentStep === Step.NETWORK && (
              <div className="space-y-5 animate-in slide-in-from-right-3 duration-400">
                <div className="text-center">
                  <h2 className="text-[9px] uppercase tracking-[0.1em] text-emerald-500 font-bold">
                    SELECT DESTINATION NETWORK
                  </h2>
                </div>
                <div className="grid gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setData({ ...data, network: n })}
                      className={`flex items-center justify-between p-4 border rounded-[18px] transition-all active:scale-[0.98] ${
                        data.network?.id === n.id ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/5 bg-white/5'
                      }`}
                    >
                      <span className="text-[11px] font-bold tracking-widest text-white">{n.name}</span>
                      <span className="text-[9px] mono font-bold text-zinc-600">{n.short}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={goBack} className="flex-1 py-3.5 btn-back rounded-xl text-[9px] font-bold uppercase tracking-widest text-zinc-600">BACK</button>
                  <button 
                    disabled={!data.network}
                    onClick={() => setCurrentStep(Step.DETAILS)}
                    className="flex-[2] py-3.5 btn-next text-black text-[10px] font-bold tracking-widest uppercase rounded-xl disabled:opacity-30"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.DETAILS && (
              <div className="space-y-5 animate-in slide-in-from-right-3 duration-400">
                <div className="text-center">
                  <h2 className="text-[9px] uppercase tracking-[0.1em] text-emerald-500 font-bold">
                    INJECTION VOLUME
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {PLANS.map((p) => (
                    <button
                      key={p.amount}
                      onClick={() => setData({ ...data, amount: p.amount, fee: p.fee })}
                      className={`p-3 border rounded-xl transition-all text-center ${
                        data.amount === p.amount ? 'border-emerald-500/50 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/5 text-zinc-600'
                      }`}
                    >
                      <div className="text-base font-bold tracking-tight">{p.amount}</div>
                      <div className="text-[7px] font-bold uppercase tracking-widest opacity-40">USDT$</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="relative group">
                    <input 
                      type="text"
                      value={data.address}
                      onChange={(e) => setData({ ...data, address: e.target.value })}
                      placeholder={`Enter target wallet address...`}
                      className="w-full bg-black border border-white/10 h-12 px-5 mono text-[10px] text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl placeholder:text-zinc-800 transition-all shadow-inner"
                    />
                  </div>
                </div>
                {error && <div className="text-red-500 text-[9px] font-bold uppercase text-center bg-red-500/5 py-2 rounded-lg border border-red-500/10">{error}</div>}
                
                <div className="flex gap-2">
                  <button onClick={goBack} className="flex-1 py-3.5 btn-back rounded-xl text-[9px] font-bold uppercase tracking-widest text-zinc-600">BACK</button>
                  <button 
                    onClick={validateDetails}
                    className="flex-[2] py-3.5 btn-next text-black text-[10px] font-bold tracking-widest uppercase rounded-xl shadow-lg"
                  >
                    PROCEED
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.AUTH_CHOICE && (
              <div className="space-y-5 animate-in fade-in duration-400 flex flex-col items-center">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-emerald-500 font-bold text-glow">AUTHENTICATION</h2>
                <div className="space-y-3 w-full">
                  <button 
                    onClick={() => handleAuthChoice('key')}
                    className="w-full py-5 bg-white/5 text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl border border-white/10 active:scale-95 shadow-lg"
                  >
                    USE SYSTEM KEY
                  </button>
                  <div className="flex items-center gap-4 py-1 opacity-20">
                    <div className="flex-1 h-[1px] bg-white"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter italic">OR</span>
                    <div className="flex-1 h-[1px] bg-white"></div>
                  </div>
                  <button 
                    onClick={() => handleAuthChoice('pay')}
                    className="w-full py-5 bg-white text-black text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl shadow-[0_5px_20px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
                  >
                    PAY RELAY FEE (${data.fee})
                  </button>
                  <button onClick={goBack} className="w-full py-2 text-zinc-700 font-bold text-[8px] uppercase tracking-[0.3em] text-center hover:text-white transition-colors">GO BACK</button>
                </div>
              </div>
            )}

            {currentStep === Step.KEY_ENTRY && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-emerald-500 font-bold text-center text-glow">CORE AUTHORIZATION</h2>
                <div className="space-y-4">
                  <input 
                    type="password"
                    value={data.licenseKey}
                    onChange={(e) => setData({ ...data, licenseKey: e.target.value })}
                    placeholder="X-XXXX-XXXX-X"
                    className="w-full bg-black border border-white/10 h-14 text-center mono text-xl tracking-[0.3em] text-emerald-500 focus:outline-none focus:border-emerald-500/50 rounded-xl shadow-2xl"
                  />
                  
                  <div className="text-center space-y-1">
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">NO SYSTEM KEY?</p>
                    <a 
                      href={TELEGRAM_SUPPORT} 
                      target="_blank" 
                      className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest underline underline-offset-4 decoration-emerald-500/40"
                    >
                      CONTACT SUPPORT
                    </a>
                  </div>
                </div>

                {error && <div className="text-red-500 text-[9px] font-bold uppercase text-center py-2 bg-red-500/5 rounded-lg border border-red-500/10">{error}</div>}
                
                <div className="flex gap-2">
                  <button onClick={goBack} className="flex-1 py-3.5 btn-back rounded-xl text-[9px] font-bold uppercase tracking-widest text-zinc-600">BACK</button>
                  <button 
                    onClick={verifyKey}
                    className="flex-[2] py-3.5 btn-next text-black text-[10px] font-bold tracking-widest uppercase rounded-xl shadow-lg"
                  >
                    CONFIRM KEY
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.FEE_PAYMENT && (
              <div className="space-y-5 animate-in fade-in duration-400">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <h2 className="text-[9px] uppercase tracking-[0.2em] text-emerald-500 font-bold">PAYMENT PORTAL</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="mono text-[10px] text-white font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <div className="premium-card rounded-2xl p-4 space-y-3 shadow-xl border-emerald-500/20 bg-black/60">
                  <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>INJECTION VOL:</span>
                    <span className="text-white text-sm italic">{data.amount} <span className="text-emerald-500 text-[8px] not-italic ml-0.5">USDT$</span></span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>RELAY FEE:</span>
                    <span className="text-xl text-emerald-400 tracking-tighter">${data.fee}.00</span>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[8px] mono text-emerald-500/80 break-all font-bold leading-tight bg-black/80 p-2 rounded-lg border border-white/5">
                      {data.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {PAYMENT_METHODS.slice(0, 4).map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setSelectedPayment(m)}
                      className={`p-2.5 border rounded-lg font-bold text-[8px] uppercase tracking-tighter transition-all ${
                        selectedPayment?.name === m.name ? 'border-emerald-500/50 bg-emerald-500/20 text-white shadow-md' : 'border-white/5 bg-white/5 text-zinc-600'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                {selectedPayment && (
                  <div className="p-4 bg-black/95 border border-emerald-500/30 rounded-xl space-y-3 animate-in slide-in-from-top-3 shadow-xl">
                    <div className="bg-zinc-950 border border-white/10 p-3 mono text-[8px] text-white rounded-lg truncate font-bold">
                      {selectedPayment.address}
                    </div>
                    <button 
                      onClick={() => handleCopy(selectedPayment.address)}
                      className={`w-full py-3 font-bold text-[9px] uppercase rounded-lg transition-all active:scale-95 ${copied ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-500 text-black'}`}
                    >
                      {copied ? 'COPIED ✓' : 'COPY DEPOSIT ADDRESS'}
                    </button>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button onClick={goBack} className="flex-1 py-3.5 btn-back rounded-xl text-[9px] font-bold uppercase tracking-widest text-zinc-600">BACK</button>
                  <button 
                    onClick={() => setCurrentStep(Step.SUBMITTED)}
                    className="flex-[2] py-3.5 btn-next text-black text-[10px] font-bold tracking-widest uppercase rounded-xl shadow-lg"
                  >
                    CONFIRM SENT
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.SUBMITTED && (
              <div className="p-5 text-center space-y-8 animate-in zoom-in-95 duration-700 flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
                  <div className="relative w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-lg font-bold tracking-[0.3em] uppercase text-white leading-none text-glow">TRANSMISSION</h2>
                  <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full"></div>
                  <p className="text-zinc-500 text-[10px] font-bold leading-relaxed max-w-[200px] mx-auto tracking-wide uppercase">
                    NODE <span className="text-emerald-500">#2026-LIVE</span><br/>
                    <span className="text-white font-bold text-lg tracking-tighter">{data.amount}</span> <span className="text-emerald-500 italic">FLASH USDT$</span> INITIALIZING...
                  </p>
                </div>
                <button onClick={() => window.location.reload()} className="text-zinc-800 hover:text-emerald-500 text-[8px] font-bold tracking-[0.5em] uppercase transition-all pt-4 border-b border-transparent hover:border-emerald-500/20">
                  RESTART TERMINAL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tight Global Footer */}
        <div className="mt-4 w-full flex flex-col items-center gap-3 animate-in fade-in duration-1000">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 px-4 opacity-40">
            {['BINANCE', 'OKX', 'BYBIT', 'TRUST WALLET'].map((name) => (
              <span key={name} className="text-[7px] font-bold tracking-tight text-white border border-white/5 px-2 py-0.5 rounded uppercase">
                {name}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <p className="text-zinc-800 text-[7px] font-bold uppercase tracking-[0.4em] border-t border-white/5 pt-2">© 2026 FLASH USDT ENTERPRISE SYSTEM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
