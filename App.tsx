
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
      
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Compact Official Header */}
        <div className="text-center mb-3 flex flex-col items-center animate-in fade-in duration-1000">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border-t border-white/20">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white">
              <span className="text-emerald-500 text-glow">FLASH</span> USDT 2026
            </h1>
          </div>
          <span className="text-[8px] font-black text-emerald-400/40 tracking-[0.6em] uppercase">ENTERPRISE CORE V1.4</span>
        </div>

        <div className="glass-panel w-full rounded-[32px] overflow-hidden relative border shadow-[0_40px_120px_rgba(0,0,0,1)] flex flex-col max-h-[82vh]">
          {/* Internal Navbar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-600/60"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <span className="text-[9px] font-black text-emerald-500/90 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 shadow-sm">
                {currentStep === Step.WELCOME ? 'ONLINE' : currentStep.replace('_', ' ')}
              </span>
            </div>
            
            {currentStep === Step.WELCOME && (
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-emerald-500 p-2 bg-emerald-500/10 rounded-xl active:scale-90 transition-all border border-emerald-500/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            )}
          </div>

          {/* Menu Drawer */}
          {menuOpen && currentStep === Step.WELCOME && (
            <div className="absolute inset-0 z-50 bg-black/98 animate-in slide-in-from-right duration-400">
              <div className="p-7 space-y-6 h-full flex flex-col">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-500">PROTOCOL TERMS</h3>
                  <button onClick={() => setMenuOpen(false)} className="text-zinc-600 p-1">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
                  <div className="p-5 bg-emerald-500/5 border-l-2 border-emerald-500 rounded-r-2xl border-y border-r border-white/5">
                    <p className="text-[11px] leading-relaxed text-zinc-100 font-bold uppercase tracking-tight">
                      Withdraw <span className="text-emerald-500">PROFIT ONLY</span> from <span className="text-emerald-500">FLASH USDT</span> on Quotex, Pocket Option, and other Brokers.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">AUTHORIZED NODES</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_SUPPORTED_NAMES.map(name => (
                        <div key={name} className="flex items-center gap-2 py-2.5 px-4 bg-white/5 rounded-xl text-zinc-300 border border-white/5 text-[9px] font-bold">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full"></div> {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <a href={TELEGRAM_SUPPORT} target="_blank" className="w-full py-4.5 bg-emerald-600 text-white text-center text-[11px] font-black tracking-[0.4em] uppercase rounded-2xl shadow-lg active:scale-95 transition-all">
                  CORE SUPPORT
                </a>
              </div>
            </div>
          )}

          {/* Content Area - Fixed height containment */}
          <div className="px-6 py-6 overflow-y-auto flex-1 scrollbar-hide flex flex-col justify-center">
            {currentStep === Step.WELCOME && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-[0.4em] uppercase rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    SYNC: ACTIVE
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                    <span className="text-emerald-500 italic">2026 OFFICIAL</span><br/>
                    <span className="opacity-90">START TERMINAL</span>
                  </h2>
                </div>

                <div className="w-full space-y-4">
                  <button 
                    onClick={() => setCurrentStep(Step.NETWORK)}
                    className="w-full py-7 btn-next text-white text-[14px] font-black tracking-[0.6em] uppercase rounded-[24px] shadow-[0_15px_40px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                  >
                    GET FLASH USDT
                  </button>
                  
                  <a 
                    href={TELEGRAM_SUPPORT} 
                    target="_blank" 
                    className="flex items-center justify-center gap-3 w-full py-4 border border-emerald-500/20 bg-emerald-500/5 rounded-[22px] text-[10px] font-black tracking-[0.5em] uppercase text-emerald-400 active:bg-emerald-500 active:text-black transition-all"
                  >
                    CUSTOMER SUPPORT
                  </a>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-center gap-5 opacity-70">
                  {EXCHANGE_LOGOS.slice(0, 4).map((l) => (
                    <img key={l.name} src={l.url} alt={l.name} className="h-5 filter brightness-110 grayscale hover:grayscale-0 transition-all" />
                  ))}
                </div>
              </div>
            )}

            {currentStep === Step.NETWORK && (
              <div className="space-y-6 animate-in slide-in-from-right-3 duration-500">
                <div className="text-center">
                  <h2 className="text-[11px] uppercase tracking-[0.1em] text-emerald-500 font-black leading-relaxed">
                    SELECT DESTINATION NETWORK
                  </h2>
                </div>
                <div className="grid gap-3">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setData({ ...data, network: n })}
                      className={`flex items-center justify-between p-5 border-2 rounded-[22px] transition-all active:scale-[0.98] ${
                        data.network?.id === n.id ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/5 bg-white/5'
                      }`}
                    >
                      <span className="text-[13px] font-black tracking-widest text-white">{n.name}</span>
                      <span className="text-[10px] mono font-bold text-zinc-500">{n.short}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={goBack} className="flex-1 py-4 btn-back rounded-[18px] text-[10px] font-black uppercase tracking-widest text-zinc-500">BACK</button>
                  <button 
                    disabled={!data.network}
                    onClick={() => setCurrentStep(Step.DETAILS)}
                    className="flex-[2] py-4 btn-next text-black text-[12px] font-black tracking-widest uppercase rounded-[18px] disabled:opacity-30"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.DETAILS && (
              <div className="space-y-6 animate-in slide-in-from-right-3 duration-500">
                <div className="text-center">
                  <h2 className="text-[11px] uppercase tracking-[0.1em] text-emerald-500 font-black leading-relaxed">
                    INJECTION DETAILS
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {PLANS.map((p) => (
                    <button
                      key={p.amount}
                      onClick={() => setData({ ...data, amount: p.amount, fee: p.fee })}
                      className={`p-4 border-2 rounded-[18px] transition-all text-center ${
                        data.amount === p.amount ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/5 text-zinc-500'
                      }`}
                    >
                      <div className="text-lg font-black tracking-tighter">{p.amount}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40">USDT$</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="text"
                      value={data.address}
                      onChange={(e) => setData({ ...data, address: e.target.value })}
                      placeholder={`Enter ${data.network?.short || 'crypto'} address...`}
                      className="w-full bg-black border border-white/10 h-16 px-6 mono text-[12px] text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl placeholder:text-zinc-800 transition-all shadow-inner"
                    />
                  </div>
                </div>
                {error && <div className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</div>}
                
                <div className="flex gap-3">
                  <button onClick={goBack} className="flex-1 py-4 btn-back rounded-[18px] text-[10px] font-black uppercase tracking-widest text-zinc-500">BACK</button>
                  <button 
                    onClick={validateDetails}
                    className="flex-[2] py-4 btn-next text-black text-[12px] font-black tracking-widest uppercase rounded-[18px] shadow-lg"
                  >
                    PROCEED
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.AUTH_CHOICE && (
              <div className="space-y-6 animate-in fade-in duration-500 py-4">
                <div className="text-center">
                  <h2 className="text-[13px] uppercase tracking-[0.4em] text-emerald-500 font-black text-glow">AUTHENTICATION</h2>
                </div>
                <div className="space-y-4 w-full">
                  <button 
                    onClick={() => handleAuthChoice('key')}
                    className="w-full py-6 bg-white/5 text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-[24px] border border-white/10 active:scale-95 shadow-lg"
                  >
                    USE SYSTEM KEY
                  </button>
                  <div className="flex items-center gap-6 py-2 opacity-20">
                    <div className="flex-1 h-[1px] bg-white"></div>
                    <span className="text-[11px] font-black text-white uppercase tracking-tighter">OR</span>
                    <div className="flex-1 h-[1px] bg-white"></div>
                  </div>
                  <button 
                    onClick={() => handleAuthChoice('pay')}
                    className="w-full py-6 bg-white text-black text-[11px] font-black tracking-[0.2em] uppercase rounded-[24px] shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
                  >
                    PAY SYSTEM FEE (${data.fee})
                  </button>
                  <button onClick={goBack} className="w-full py-2 text-zinc-700 font-black text-[9px] uppercase tracking-[0.5em] text-center hover:text-white transition-colors">GO BACK</button>
                </div>
              </div>
            )}

            {currentStep === Step.KEY_ENTRY && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-600 py-4">
                <h2 className="text-[12px] uppercase tracking-[0.4em] text-emerald-500 font-black text-center text-glow">SYSTEM KEY REQUIRED</h2>
                <div className="space-y-6">
                  <input 
                    type="password"
                    value={data.licenseKey}
                    onChange={(e) => setData({ ...data, licenseKey: e.target.value })}
                    placeholder="X-XXXX-XXXX-X"
                    className="w-full bg-black border border-white/10 h-20 text-center mono text-2xl tracking-[0.4em] text-emerald-500 focus:outline-none focus:border-emerald-500/50 rounded-[24px] shadow-2xl"
                  />
                  
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Unauthorized?</p>
                    <a 
                      href={TELEGRAM_SUPPORT} 
                      target="_blank" 
                      className="text-[12px] font-black text-emerald-500 uppercase tracking-widest underline underline-offset-4 decoration-emerald-500/40"
                    >
                      REQUEST SYSTEM KEY
                    </a>
                  </div>
                </div>

                {error && <div className="text-red-500 text-[11px] font-black uppercase text-center py-3 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}
                
                <div className="flex gap-3">
                  <button onClick={goBack} className="flex-1 py-4 btn-back rounded-[18px] text-[10px] font-black uppercase tracking-widest text-zinc-500">BACK</button>
                  <button 
                    onClick={verifyKey}
                    className="flex-[2] py-4 btn-next text-black text-[12px] font-black tracking-widest uppercase rounded-[18px] shadow-lg"
                  >
                    CONFIRM KEY
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.FEE_PAYMENT && (
              <div className="space-y-6 animate-in fade-in duration-600">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h2 className="text-[11px] uppercase tracking-[0.3em] text-emerald-500 font-black">PAYMENT HUB</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="mono text-[11px] text-white font-black">{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <div className="premium-card rounded-[28px] p-6 space-y-4 shadow-xl border-emerald-500/30 bg-black/60">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>VOLUME:</span>
                    <span className="text-white text-[16px] italic">{data.amount} <span className="text-emerald-500 text-[10px] not-italic ml-1">USDT$</span></span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>SYSTEM FEE:</span>
                    <span className="text-2xl text-emerald-400 tracking-tighter">${data.fee}.00</span>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-[10px] mono text-emerald-500 break-all font-black leading-tight bg-black/80 p-4 rounded-xl border border-white/10">
                      {data.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.slice(0, 4).map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setSelectedPayment(m)}
                      className={`p-3.5 border-2 rounded-xl font-black text-[9px] uppercase tracking-tighter transition-all ${
                        selectedPayment?.name === m.name ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-lg' : 'border-white/5 bg-white/5 text-zinc-600'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                {selectedPayment && (
                  <div className="p-5 bg-black/95 border border-emerald-500/40 rounded-[24px] space-y-4 animate-in slide-in-from-top-4 shadow-2xl">
                    <div className="bg-zinc-950 border border-white/10 p-4 mono text-[10px] text-white rounded-xl truncate font-bold">
                      {selectedPayment.address}
                    </div>
                    <button 
                      onClick={() => handleCopy(selectedPayment.address)}
                      className={`w-full py-4 font-black text-[11px] uppercase rounded-[18px] transition-all active:scale-95 ${copied ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-500 text-black hover:bg-emerald-400'}`}
                    >
                      {copied ? 'COPIED ✓' : 'COPY DEPOSIT ADDRESS'}
                    </button>
                    <p className="text-[8px] font-bold text-zinc-600 text-center uppercase tracking-widest opacity-80 leading-relaxed px-2">Verification is instant after 1 network confirmation.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={goBack} className="flex-1 py-4 btn-back rounded-[18px] text-[10px] font-black uppercase tracking-widest text-zinc-500">BACK</button>
                  <button 
                    onClick={() => setCurrentStep(Step.SUBMITTED)}
                    className="flex-[2] py-4 btn-next text-black text-[12px] font-black tracking-widest uppercase rounded-[18px] shadow-lg"
                  >
                    CONFIRM SENT
                  </button>
                </div>
              </div>
            )}

            {currentStep === Step.SUBMITTED && (
              <div className="p-8 text-center space-y-10 animate-in zoom-in-95 duration-800 flex flex-col items-center">
                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                  <div className="relative w-28 h-28 bg-emerald-500/10 border border-emerald-500/50 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                    <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-black tracking-[0.4em] uppercase text-white leading-none text-glow">TRANSMISSION</h2>
                  <div className="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                  <p className="text-zinc-500 text-[12px] font-bold leading-relaxed max-w-[240px] mx-auto tracking-wide uppercase">
                    NODE <span className="text-emerald-500 text-glow">#2026-ACTIVE</span><br/>
                    <span className="text-white font-black text-xl tracking-tighter">{data.amount}</span> <span className="text-emerald-500 font-black italic">FLASH USDT$</span> INITIALIZING...
                  </p>
                </div>
                <button onClick={() => window.location.reload()} className="text-zinc-800 hover:text-emerald-500 text-[10px] font-black tracking-[0.8em] uppercase transition-all pt-8 border-b border-transparent hover:border-emerald-500/40">
                  RESTART TERMINAL
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Footer Hub - Mature small caps */}
        <div className="mt-6 w-full flex flex-col items-center gap-5 animate-in fade-in duration-1200">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2.5 px-6">
            {['BINANCE', 'BYBIT', 'OKX', 'QUOTEX', 'TRUST WALLET', 'METAMASK'].map((name) => (
              <span key={name} className="text-[9px] font-black tracking-tight text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 uppercase shadow-sm">
                {name}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center pb-2">
            <div className="flex gap-10 opacity-10 text-[9px] uppercase tracking-[1.2em] font-black text-white mb-3">
              <span>SCAN</span>
              <span>NODE</span>
              <span>RELAY</span>
            </div>
            <p className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.6em] border-t border-white/5 pt-4">© 2026 FLASH USDT OFFICIAL ENTERPRISE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
