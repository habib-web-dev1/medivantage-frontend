"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ShieldCheck, Cpu, ArrowUpRight, HelpCircle, Layers, CheckCircle, Database, PhoneCall, Zap, UserCheck } from 'lucide-react';
import { useAppState } from './layout';
import SymptomEngineModal from '../components/SymptomEngineModal';

export default function LandingPage() {
  const { login } = useAppState();
  const [isEngineOpen, setIsEngineOpen] = useState(false);

  return (
    <div className="relative overflow-hidden w-full">
      {/* SECTION 1: HYPER-UI HERO ENGINE */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-medical-50/30 via-transparent to-transparent dark:from-medical-950/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medical-500/10 dark:bg-medical-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 border border-medical-500/30 bg-medical-500/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-medical-500 animate-spin" />
            <span className="text-xs font-bold tracking-widest uppercase text-medical-600 dark:text-medical-400">Clinical Logic Engine V1.2 Active</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            AI-Driven Diagnostics,<br />
            <span className="bg-gradient-to-r from-medical-500 via-sky-400 to-indigo-500 bg-clip-text text-transparent">Human-Centered Care.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            Bridge the hazardous operational space between ambiguous web search self-diagnosis and empirical medical science consultation instantly.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => setIsEngineOpen(true)} className="px-8 py-4 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-2xl font-bold shadow-xl shadow-medical-500/20 hover:shadow-medical-500/30 hover:scale-[1.02] active:scale-[0.98] transition duration-200 text-sm tracking-wider uppercase">
              Launch Diagnostic Engine
            </button>
            <a href="#architecture" className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm tracking-wider uppercase transition">
              Explore Core Tech
            </a>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: LIVE METRIC STRATIFICATION COUNTERS */}
      <section className="py-16 border-y border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slateCustom-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "99.4%", l: "Engine Accuracy Target" },
            { v: "240ms", l: "Pathology Verification Latency" },
            { v: "14K+", l: "Structured Database Records" },
            { v: "Zero", l: "Uncertified Telehealth Endpoints" }
          ].map((m, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-medical-500 tracking-tight">{m.v}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: THE TRI-PARTITE ECOSYSTEM GRID */}
      <section id="ecosystem" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Three Interconnected Dimensions</h2>
          <p className="text-slate-500 dark:text-slate-400">A decentralized interaction framework serving all clinical nodes with unique customized access rights.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { r: "Patients", title: "Empowered Diagnostics", desc: "Access the multi-step symptom configuration compiler to get instantaneous match parameters and instantly schedule certified practitioner visits.", color: "border-medical-500/30" },
            { r: "Doctors", title: "Algorithmic Prioritization", desc: "Review aggregated symptom diagnostic matching probability datasets instantly before video interface connection occurs.", color: "border-purple-500/30" },
            { r: "Administrators", title: "Structural Controls", desc: "Oversee systemic compliance, authenticate clinical verification logs, manage inventory databases, and review disease trajectory analytics.", color: "border-amber-500/30" }
          ].map((role, i) => (
            <div key={i} className={`p-8 bg-white dark:bg-slate-900 border ${role.color} rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none flex flex-col justify-between`}>
              <div>
                <span className="text-xs font-black tracking-widest text-medical-500 uppercase">{role.r}</span>
                <h3 className="text-xl font-bold mt-2 mb-4">{role.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{role.desc}</p>
              </div>
              <button onClick={() => login(i === 0 ? 'patient' : i === 1 ? 'doctor' : 'admin')} className="mt-8 flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-medical-500 hover:text-white transition group">
                <span className="text-xs font-bold uppercase tracking-wider">Launch Simulation Context</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-200" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: THE SYMPTOM PROBABILITY THEORY EXPOSITION */}
      <section id="architecture" className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Cpu className="w-12 h-12 text-medical-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black tracking-tight mb-4">The Logic Engine Paradigm</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Unlike generative chat layers prone to hallucination, MediVantage executes hard cross-referencing intersections against strict disease collections using structured set cardinality models.
          </p>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 inline-block text-left shadow-inner max-w-xl w-full">
            <span className="text-xs font-mono block text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 font-bold">ALGORITHMIC MATCH MODEL EQUATION</span>
            <div className="text-lg font-mono text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl my-2 text-medical-500 font-bold">
              $$P = \frac{|S_{\text{input}} \cap S_{\text{disease}}|}{\|S_{\text{disease}}\|} \times 100$$
            </div>
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed mt-2">
              Where $S_{\text{input}}$ represents the clean token set entered by the patient and $S_{\text{disease}}$ models the static validation criteria set stored inside the MongoDB cluster.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: SYSTEM SECURITY LAYER SPECIFICATION */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-6">Cryptographic Defense Framework</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Medical records require dynamic perimeter defenses. MediVantage implements an immutable standard dual-token infrastructure: short-lived memory Access Tokens joined with hardware-secured HttpOnly persistence Refresh cookies.
          </p>
          <div className="space-y-3 font-medium text-sm">
            <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-emerald-500" /> Standard BcryptJS hashing using 12 cryptographic salt iterations.</div>
            <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-emerald-500" /> Next.js Middleware handling structural edge verification.</div>
            <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-emerald-500" /> Complete cross-site scripting (XSS) extraction prevention layers.</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 font-mono text-xs text-slate-300 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 right-3 flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          </div>
          <p className="text-slate-500 mb-2">// Edge Protection Protocol Middleware execution wrapper</p>
          <p className="text-cyan-400">export function <span className="text-yellow-300">middleware</span>(req: NextRequest) &#123;</p>
          <p className="pl-4 text-purple-400">const <span className="text-slate-300">token</span> = req.cookies.get(<span className="text-amber-300">"refreshToken"</span>);</p>
          <p className="pl-4 text-purple-400">const <span className="text-slate-300">role</span> = decodeTokenSecurityScope(token);</p>
          <p className="pl-4 text-pink-400">if (req.nextUrl.pathname.startsWith(<span className="text-amber-300">"/admin"</span>) && role !== <span className="text-amber-300">"admin"</span>) &#123;</p>
          <p className="pl-8 text-red-400">return NextResponse.redirect(<span className="text-amber-300">"/unauthorized_gateway"</span>);</p>
          <p className="pl-4">&#125;</p>
          <p className="text-cyan-400">&#125;</p>
        </div>
      </section>

      {/* SECTION 6: COMMERCE PHARMACEUTICAL MATRIX */}
      <section className="py-20 bg-slate-50 dark:bg-slateCustom-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Layers className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black tracking-tight mb-4">Integrated Medical Commerce Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Browse structured, deeply cross-referenced categorical indices with deep-linked analytical views outlining active counter-indications, usage precautions, and pricing matrices.
          </p>
        </div>
      </section>

      {/* SECTION 7: REAL-TIME WEBSOCKET REACTION TIMELINE */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 space-y-4">
          <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl items-start">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl font-bold text-xs">14:02</div>
            <div>
              <h4 className="font-bold text-sm">System Node Connection Established</h4>
              <p className="text-xs text-slate-400 mt-1">Socket.io pipeline handshake success for client session.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-medical-500/30 bg-medical-500/5 rounded-2xl items-start">
            <div className="p-2 bg-medical-500/10 text-medical-500 rounded-xl font-bold text-xs">14:05</div>
            <div>
              <h4 className="font-bold text-sm text-medical-500">Live Consultation Clearance Payload Broadcast</h4>
              <p className="text-xs text-slate-400 mt-1">Dr. Jenkins altered state parameter to: APPROVED. Broadcast triggered to target Patient.</p>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-6">Persistent Live Event Socket Pipeline</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminate structural checking lags. When operational parameter state metrics transform inside the doctor interface node, notification payloads instantly fire via persistent WebSocket links directly to client navigation headers.
          </p>
        </div>
      </section>

      {/* SECTION 8: EXTENSIBLE DATA MATRIX STORAGE GRAPH */}
      <section className="py-20 bg-slate-100 dark:bg-slateCustom-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Database className="w-12 h-12 text-sky-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black tracking-tight mb-4">Mongoose Polymorphic Schema Framework</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Engineered using deeply decoupled database structures allowing flexible extensions while maintaining explicit validation patterns via Zod middleware interceptors.
          </p>
        </div>
      </section>

      {/* SECTION 9: HELPDESK CRITICAL DISPATCH ACCELERATOR */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-800 border border-slate-800 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent_45%)]" />
          <PhoneCall className="w-12 h-12 text-medical-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black tracking-tight mb-4">Critical Telehealth Redirection Link</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm">
            When match values suggest a high probability of severe health incidents, the symptom modal locks standard booking routes and surfaces emergency dispatch links.
          </p>
          <button onClick={() => setIsEngineOpen(true)} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition text-xs uppercase tracking-wider">
            Execute Safety Assessment Run
          </button>
        </div>
      </section>

      {/* SECTION 10: STRATEGIC COMPLIANCE DISCLOSURE FOOTER */}
      <section className="py-12 bg-slate-200/50 dark:bg-slateCustom-950 text-slate-400 text-center text-xs font-mono border-t border-slate-200 dark:border-slate-800/60">
        <p className="max-w-2xl mx-auto px-4 leading-relaxed">
          MediVantage AI utilizes algorithmic proximity classification formulas. This is a technical validation blueprint demonstrating secure, modern role-based orchestration systems.
        </p>
      </section>

      {/* MODAL MOUNT CONTROLLER */}
      <SymptomEngineModal isOpen={isEngineOpen} onClose={() => setIsEngineOpen(false)} />
    </div>
  );
}