import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";
import antiArnaqueImg from './assets/anti-arnaque.svg';
import toutesMarquesImg from './assets/toutes-marques.svg';
import indicesImg from './assets/indices-detailles.svg';
import historiqueImg from './assets/historique-personnel.svg';
import resultatImg from './assets/resultat-express.svg';
import rapportImg from './assets/rapport-pdf.svg';


const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --cream:#F7F4EF;--cream2:#EDE9E1;--cream3:#E0DAD0;
    --ink:#1A1814;--ink2:#2E2B26;--ink-soft:#6B6560;--ink-faint:#A8A39C;
    --accent:#C4A882;--accent2:#8B6F4E;
    --success:#3D7A5C;--danger:#9B3A3A;--warn:#8B6F2E;
    --border:rgba(26,24,20,0.1);--border2:rgba(26,24,20,0.06);
    --shadow:0 1px 3px rgba(26,24,20,0.06),0 4px 16px rgba(26,24,20,0.04);
    --shadow-lg:0 8px 32px rgba(26,24,20,0.10);
  }
  html{scroll-behavior:smooth;font-size:14px}
  body{background:var(--cream);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:300;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:var(--cream)}
  ::-webkit-scrollbar-thumb{background:var(--accent);border-radius:2px}

  .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:56px;background:rgba(247,244,239,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border2)}
  .nav-logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink);cursor:pointer}
  .nav-center{display:none;gap:28px}
  .nav-link{font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-soft);cursor:pointer;transition:color 0.2s;font-weight:400}
  .nav-link:hover{color:var(--ink)}
  .nav-actions{display:flex;gap:8px;align-items:center}

  .btn{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;padding:9px 20px;border-radius:2px;cursor:pointer;border:none;transition:all 0.25s;white-space:nowrap}
  .btn-ghost{background:transparent;color:var(--ink-soft);border:1px solid var(--border)}
  .btn-ghost:hover{color:var(--ink);border-color:var(--ink)}
  .btn-primary{background:var(--ink);color:var(--cream);border:1px solid var(--ink)}
  .btn-primary:hover{background:var(--ink2)}
  .btn-outline{background:transparent;color:var(--ink);border:1px solid var(--ink)}
  .btn-outline:hover{background:var(--ink);color:var(--cream)}
  .btn-lg{padding:11px 28px;font-size:11px}
  .btn-cream{background:var(--cream);color:var(--ink);border:1px solid var(--cream)}
  .btn-cream:hover{background:var(--cream2)}

  /* ── HERO AMÉLIORÉ ── */
  .hero{min-height:100vh;padding:100px 24px 60px;display:grid;grid-template-rows:1fr auto;position:relative;overflow:hidden;background:var(--cream)}
  .hero-noise{position:absolute;inset:0;opacity:0.025;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px}
  .hero-glow{position:absolute;top:-20%;right:-10%;width:600px;height:600px;background:radial-gradient(ellipse,rgba(196,168,130,0.12) 0%,transparent 70%);pointer-events:none;animation:heroGlow 8s ease-in-out infinite alternate}
  @keyframes heroGlow{from{transform:translate(0,0) scale(1)}to{transform:translate(-30px,20px) scale(1.1)}}
  .hero-inner{display:flex;flex-direction:column;justify-content:center;position:relative}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent2);margin-bottom:28px;font-weight:400;animation:fadeUp 0.8s ease both}
  .hero-eyebrow::before{content:'';display:inline-block;width:24px;height:1px;background:var(--accent2)}
  .hero h1{font-family:'Syne',sans-serif;font-size:clamp(36px,8vw,72px);font-weight:800;line-height:0.98;letter-spacing:-0.03em;color:var(--ink);margin-bottom:24px;max-width:680px;animation:fadeUp 0.8s 0.1s ease both}
  .hero h1 em{font-style:italic;color:var(--accent2)}
  .hero-sub{font-size:14px;color:var(--ink-soft);line-height:1.7;max-width:420px;margin-bottom:36px;font-weight:300;animation:fadeUp 0.8s 0.2s ease both}
  .hero-ctas{display:flex;gap:10px;flex-wrap:wrap;animation:fadeUp 0.8s 0.3s ease both}
  .hero-trust{display:flex;align-items:center;gap:12px;margin-top:20px;animation:fadeUp 0.8s 0.4s ease both}
  .hero-trust-avatars{display:flex}
  .hero-trust-avatar{width:28px;height:28px;border-radius:50%;background:var(--ink);border:2px solid var(--cream);color:var(--cream);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-left:-8px}
  .hero-trust-avatar:first-child{margin-left:0}
  .hero-trust-text{font-size:11px;color:var(--ink-faint);font-weight:300}
  .hero-trust-text strong{color:var(--ink-soft);font-weight:400}
  .hero-bottom{display:flex;gap:40px;padding-top:48px;border-top:1px solid var(--border);margin-top:48px;animation:fadeUp 0.8s 0.5s ease both}
  .stat-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--ink);line-height:1}
  .stat-label{font-size:10px;color:var(--ink-faint);letter-spacing:0.15em;text-transform:uppercase;margin-top:4px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

  .divider{height:1px;background:var(--border);margin:0 24px}
  .section{padding:64px 24px}
  .section-eyebrow{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:36px;display:flex;align-items:center;gap:16px}
  .section-eyebrow::after{content:'';flex:1;height:1px;background:var(--border)}
  .section-title{font-family:'Syne',sans-serif;font-size:clamp(24px,4vw,40px);font-weight:800;line-height:1.05;letter-spacing:-0.02em;color:var(--ink);margin-bottom:36px;max-width:560px}
  .section-title em{font-style:italic;color:var(--accent2)}

  .process-list{border-top:1px solid var(--border)}
  .process-item{display:grid;grid-template-columns:48px 1fr;gap:20px;padding:22px 0;border-bottom:1px solid var(--border)}
  .process-num{font-family:'DM Mono',monospace;font-size:11px;font-weight:300;color:var(--ink-faint);letter-spacing:0.1em;padding-top:3px}
  .process-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:6px;letter-spacing:-0.01em}
  .process-desc{font-size:13px;color:var(--ink-soft);line-height:1.7;font-weight:300}

  .photo-features{display:grid;grid-template-columns:1fr;gap:2px;background:var(--border2)}
  .photo-feat{overflow:hidden;position:relative}
  .photo-feat-img{width:100%;height:200px;object-fit:cover;display:block;transition:transform 0.6s ease;filter:brightness(0.92) saturate(0.9)}
  .photo-feat:hover .photo-feat-img{transform:scale(1.03);filter:brightness(1) saturate(1)}
  .photo-feat-body{padding:20px 18px;background:var(--cream)}
  .photo-feat-icon{font-size:16px;margin-bottom:8px;opacity:0.6}
  .photo-feat-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--ink);margin-bottom:5px}
  .photo-feat-desc{font-size:12px;color:var(--ink-soft);line-height:1.65;font-weight:300}

  .marquee-wrap{overflow:hidden;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--cream2)}
  .marquee-track{display:flex;gap:0;animation:marquee 22s linear infinite;width:max-content}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .marquee-item{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);padding:0 24px;white-space:nowrap}
  .marquee-dot{color:var(--accent)}

  .refdb-section{padding:64px 24px;background:var(--cream2)}
  .refdb-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
 .refdb-card{background:var(--cream);border:1px solid var(--border);border-radius:6px;padding:22px 20px;transition:all 0.25s}
.refdb-card:hover{border-color:var(--accent2);box-shadow:var(--shadow)}
  .refdb-thumb{width:40px;height:40px;border-radius:3px;object-fit:cover;background:var(--cream2);flex-shrink:0;border:1px solid var(--border)}
  .refdb-brand{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--ink);margin-bottom:4px;letter-spacing:-0.01em}
  .refdb-type{font-size:10px;color:var(--ink-faint);font-weight:300;margin-bottom:5px}
  .refdb-tags{display:flex;gap:3px;flex-wrap:wrap}
  .refdb-tag{font-size:9px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:2px 6px;border-radius:2px}
  .refdb-tag.authentic{background:rgba(61,122,92,0.1);color:var(--success)}
  .refdb-tag.fake{background:rgba(155,58,58,0.1);color:var(--danger)}
  .refdb-tag.locked{background:rgba(201,168,76,0.1);color:#A8832A}
  .refdb-count{font-size:11px;color:var(--ink-faint);margin-top:20px;text-align:center;font-weight:300}

  .community-section{padding:64px 24px;background:var(--cream)}
  .expert-grid{display:grid;grid-template-columns:1fr;gap:10px}
  .expert-card{background:var(--cream2);border:1px solid var(--border);border-radius:4px;padding:18px}
  .expert-header{display:flex;gap:10px;align-items:center;margin-bottom:10px}
  .expert-avatar{width:36px;height:36px;border-radius:50%;background:var(--ink);color:var(--cream);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .expert-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--ink)}
  .expert-role{font-size:11px;color:var(--ink-faint);font-weight:300}
  .expert-badge{font-size:9px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:3px 7px;border-radius:2px;background:rgba(61,122,92,0.1);color:var(--success);margin-left:auto}
  .expert-text{font-size:13px;color:var(--ink-soft);line-height:1.65;font-weight:300;font-style:italic}
  .expert-brand{font-size:10px;color:var(--ink-faint);margin-top:8px;letter-spacing:0.08em;text-transform:uppercase}
  .community-cta{text-align:center;margin-top:24px;font-size:12px;color:var(--ink-soft);font-weight:300}
  .community-cta span{color:var(--ink);border-bottom:1px solid var(--border);cursor:pointer}

  .pricing-section{padding:64px 24px;background:var(--cream)}
  .pricing-grid{display:grid;grid-template-columns:1fr;gap:14px}
  .pricing-card{border:1px solid var(--border);border-radius:6px;padding:24px 20px;background:var(--cream);position:relative;transition:all 0.3s;overflow:hidden}
  .pricing-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
  .pricing-card.bronze{border-color:#A0714A;background:linear-gradient(160deg,#1C1410 0%,#120E0A 100%);color:var(--cream)}
  .pricing-card.bronze::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(180,120,60,0.18) 0%,transparent 70%);pointer-events:none}
  .pricing-card.bronze .pricing-plan{color:#C4855A}
  .pricing-card.bronze .pricing-desc{color:rgba(247,244,239,0.5)}
  .pricing-card.bronze .pricing-feature{color:rgba(247,244,239,0.85);border-bottom-color:rgba(160,113,74,0.15)}
  .pricing-card.silver{border-color:#8E9BAE;background:linear-gradient(160deg,#141618 0%,#0D0F11 100%);color:var(--cream)}
  .pricing-card.silver::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(180,195,215,0.15) 0%,transparent 70%);pointer-events:none}
  .pricing-card.silver .pricing-plan{color:#A8BACE}
  .pricing-card.silver .pricing-desc{color:rgba(247,244,239,0.5)}
  .pricing-card.silver .pricing-feature{color:rgba(247,244,239,0.85);border-bottom-color:rgba(142,155,174,0.15)}
  .pricing-card.gold{border-color:#C9A84C;background:linear-gradient(160deg,#1A1610 0%,#0F0E0B 100%);color:var(--cream)}
  .pricing-card.gold::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(201,168,76,0.15) 0%,transparent 70%);pointer-events:none}
  .pricing-card.gold .pricing-plan{color:#C9A84C}
  .pricing-card.gold .pricing-desc{color:rgba(247,244,239,0.5)}
  .pricing-card.gold .pricing-feature{color:rgba(247,244,239,0.85);border-bottom-color:rgba(201,168,76,0.12)}
  .pricing-badge{position:absolute;top:-10px;left:20px;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:3px 10px;border-radius:20px;font-family:'Space Grotesk',sans-serif}
  .pricing-badge.silver-b{background:linear-gradient(135deg,#8E9BAE,#C0D0E0);color:#0D0F11}
  .pricing-badge.gold-b{background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0F0E0B}
  .pricing-lock{font-size:16px;margin-bottom:12px}
  .pricing-plan{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:8px;color:var(--ink-soft)}
  .pricing-price{font-family:'Syne',sans-serif;font-weight:800;line-height:1;letter-spacing:-0.03em;margin-bottom:4px}
  .pricing-price .amount{font-size:36px}
  .pricing-price .period{font-size:13px;font-weight:400;opacity:0.45}
  .pricing-desc{font-size:12px;color:var(--ink-soft);margin:12px 0 18px;line-height:1.65;font-weight:300;min-height:44px}
  .pricing-features{margin-bottom:22px}
  .pricing-feature{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border2);font-size:12px;color:var(--ink);font-weight:300;line-height:1.5}
  .pricing-feature:last-child{border-bottom:none}
  .pricing-feature-icon{flex-shrink:0;font-size:11px;margin-top:1px}
  .pricing-cta{width:100%;padding:11px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:500;border-radius:3px;cursor:pointer;transition:all 0.2s;font-family:'Space Grotesk',sans-serif}
  .pricing-cta.light{background:transparent;color:var(--ink);border:1px solid var(--ink)}
  .pricing-cta.light:hover{background:var(--ink);color:var(--cream)}
  .pricing-cta.bronze-btn{background:linear-gradient(135deg,#A0714A,#C4855A,#7A5235);color:#FFF8F0;border-color:transparent;font-weight:600;box-shadow:0 4px 16px rgba(160,113,74,0.35)}
  .pricing-cta.bronze-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(160,113,74,0.5)}
  .pricing-cta.silver-btn{background:linear-gradient(135deg,#8E9BAE,#C0D0E0,#6E7D8E);color:#0D0F11;border-color:transparent;font-weight:700;box-shadow:0 4px 20px rgba(142,155,174,0.35)}
  .pricing-cta.silver-btn:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(142,155,174,0.5)}
  .pricing-cta.gold-btn{background:linear-gradient(135deg,#C9A84C,#E8C96A,#A8832A);color:#0F0E0B;border-color:transparent;font-weight:700;box-shadow:0 4px 20px rgba(201,168,76,0.3)}
  .pricing-cta.gold-btn:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(201,168,76,0.45)}
  .pricing-free{text-align:center;margin-top:16px;font-size:11px;color:var(--ink-faint);font-weight:300}
  .pricing-free span{color:var(--ink);border-bottom:1px solid var(--border);cursor:pointer}

  .cta-section{padding:72px 24px;text-align:center;background:var(--ink);position:relative;overflow:hidden}
  .cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(196,168,130,0.08) 0%,transparent 70%);pointer-events:none}
  .cta-section h2{font-family:'Syne',sans-serif;font-size:clamp(28px,6vw,52px);font-weight:800;line-height:1.05;color:var(--cream);margin-bottom:12px;position:relative;letter-spacing:-0.02em}
  .cta-section h2 em{font-style:italic;color:var(--accent)}
  .cta-section p{font-size:13px;color:rgba(247,244,239,0.5);margin-bottom:32px;position:relative;font-weight:300}

  footer{background:var(--ink2);padding:40px 24px 28px}
  .footer-logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--cream);letter-spacing:0.1em;text-transform:uppercase}
  .footer-tagline{font-size:12px;color:rgba(247,244,239,0.35);margin-top:6px;font-weight:300}
  .footer-legal{border-top:1px solid rgba(247,244,239,0.08);padding-top:24px;margin-top:32px;font-size:11px;color:rgba(247,244,239,0.28);line-height:1.8;font-weight:300}

  .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:80px 24px 40px;background:var(--cream)}
  .auth-card{width:100%;max-width:380px;background:var(--cream);border:1px solid var(--border);border-radius:4px;padding:32px 28px;box-shadow:var(--shadow-lg)}
  .back-btn{background:none;border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--ink);font-size:12px;font-family:'Space Grotesk',sans-serif;margin-bottom:24px;display:flex;align-items:center;gap:6px;padding:8px 14px;font-weight:500;letter-spacing:0.08em;transition:all 0.2s}
  .back-btn:hover{border-color:var(--ink)}
  .auth-logo{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--ink);margin-bottom:24px;letter-spacing:0.12em;text-transform:uppercase}
  .auth-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:5px;letter-spacing:-0.02em}
  .auth-sub{font-size:12px;color:var(--ink-soft);margin-bottom:28px;font-weight:300}
  .field{margin-bottom:18px}
  .field label{display:block;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:8px;font-weight:400}
  .field input{width:100%;background:transparent;border:none;border-bottom:1px solid var(--border);padding:10px 0;color:var(--ink);font-size:14px;font-family:'Space Grotesk',sans-serif;font-weight:300;transition:border-color 0.2s;outline:none}
  .field input:focus{border-bottom-color:var(--ink)}
  .field input::placeholder{color:var(--ink-faint)}
  .auth-switch{text-align:center;margin-top:20px;font-size:12px;color:var(--ink-soft);font-weight:300}
  .auth-switch span{color:var(--ink);cursor:pointer;border-bottom:1px solid var(--ink)}
  .err{background:rgba(155,58,58,0.06);border-left:2px solid var(--danger);color:var(--danger);padding:10px 14px;font-size:12px;margin-bottom:16px;font-weight:300}

  .dashboard{padding:72px 0 40px;min-height:100vh;background:var(--cream)}
  .dash-header{padding:28px 24px 0;margin-bottom:20px}
  .dash-greeting{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--ink);line-height:1.1;letter-spacing:-0.02em}
  .dash-greeting em{font-style:italic;color:var(--accent2)}
  .dash-sub{font-size:12px;color:var(--ink-soft);margin-top:5px;font-weight:300}
  .tabs{display:flex;border-bottom:1px solid var(--border);padding:0 24px}
  .tab{padding:12px 0;margin-right:28px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;color:var(--ink-faint);border-bottom:1px solid transparent;margin-bottom:-1px;transition:all 0.2s;font-weight:400}
  .tab.active{color:var(--ink);border-bottom-color:var(--ink)}
  .tab-content{padding:24px}

  .scan-card{background:var(--cream);border:1px solid var(--border);border-radius:4px;padding:20px;margin-bottom:16px}
  .scan-label{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:20px;font-weight:400}
  .upload-zone{border:1px dashed var(--cream3);border-radius:4px;padding:32px 20px;text-align:center;cursor:pointer;transition:all 0.25s;position:relative;background:var(--cream2)}
  .upload-zone:hover,.upload-zone.drag{border-color:var(--accent);background:rgba(196,168,130,0.06)}
  .upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .upload-icon{font-size:24px;margin-bottom:12px;opacity:0.5}
  .upload-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:5px}
  .upload-hint{font-size:11px;color:var(--ink-faint);font-weight:300}
  .preview-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:14px}
  .preview-img{position:relative;aspect-ratio:1;border-radius:3px;overflow:hidden;background:var(--cream2)}
  .preview-img img{width:100%;height:100%;object-fit:cover}
  .preview-rm{position:absolute;top:4px;right:4px;background:rgba(26,24,20,0.6);border:none;color:var(--cream);width:18px;height:18px;border-radius:50%;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center}
  .field textarea{width:100%;background:transparent;border:none;border-bottom:1px solid var(--border);padding:10px 0;color:var(--ink);font-size:13px;font-family:'Space Grotesk',sans-serif;font-weight:300;resize:none;min-height:64px;outline:none;transition:border-color 0.2s}
  .field textarea:focus{border-bottom-color:var(--ink)}
  .field textarea::placeholder{color:var(--ink-faint)}

  .loading-wrap{text-align:center;padding:56px 24px}
  .loader{width:32px;height:32px;border:1px solid var(--border);border-top-color:var(--ink);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .loading-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:5px}
  .loading-step{font-size:11px;color:var(--ink-faint);letter-spacing:0.1em;animation:breathe 2.4s ease-in-out infinite}
  @keyframes breathe{0%,100%{opacity:0.3}50%{opacity:1}}

  .result-card{border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-bottom:14px;background:var(--cream)}
  .result-header{padding:20px 22px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
  .result-header.authentic{border-top:2px solid var(--success)}
  .result-header.fake{border-top:2px solid var(--danger)}
  .result-header.uncertain{border-top:2px solid var(--warn)}
  .result-brand{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:8px;letter-spacing:-0.01em}
  .verdict-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:400}
  .verdict-pill.authentic{background:rgba(61,122,92,0.08);color:var(--success)}
  .verdict-pill.fake{background:rgba(155,58,58,0.08);color:var(--danger)}
  .verdict-pill.uncertain{background:rgba(139,111,46,0.08);color:var(--warn)}
  .score-block{text-align:right;flex-shrink:0}
  .score-num{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;line-height:1;letter-spacing:-0.02em}
  .score-num.authentic{color:var(--success)}
  .score-num.fake{color:var(--danger)}
  .score-num.uncertain{color:var(--warn)}
  .score-pct{font-size:9px;color:var(--ink-faint);letter-spacing:0.1em;text-transform:uppercase}
  .result-divider{height:1px;background:var(--border);margin:0 22px}
  .result-body{padding:20px 22px}
  .result-summary{font-size:13px;color:var(--ink-soft);line-height:1.75;margin-bottom:20px;font-weight:300}
  .issues-label{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:12px;font-weight:400}
  .issue-row{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border2)}
  .issue-row:last-child{border-bottom:none}
  .issue-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:5px}
  .issue-dot.ok{background:var(--success)}
  .issue-dot.issue{background:var(--danger)}
  .issue-zone{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:2px;font-weight:400}
  .issue-desc{font-size:12px;color:var(--ink);line-height:1.6;font-weight:300}
  .advice-box{background:var(--cream2);border-radius:3px;padding:14px 16px;margin-top:16px;font-size:12px;color:var(--ink-soft);line-height:1.7;font-weight:300}
  .advice-box strong{color:var(--ink);font-weight:400}
  .pdf-btn{display:inline-flex;align-items:center;gap:7px;background:var(--ink);color:var(--cream);border:none;border-radius:3px;padding:9px 18px;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;margin-top:14px}
  .pdf-btn:hover{background:var(--ink2)}

  .history-empty{text-align:center;padding:56px 24px}
  .history-empty-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:7px}
  .history-empty-sub{font-size:12px;color:var(--ink-faint);font-weight:300}
  .history-row{display:flex;gap:14px;align-items:center;padding:16px 0;border-bottom:1px solid var(--border2);cursor:pointer;transition:opacity 0.2s}
  .history-row:hover{opacity:0.7}
  .history-thumb{width:44px;height:44px;border-radius:3px;object-fit:cover;background:var(--cream2);flex-shrink:0;border:1px solid var(--border)}
  .history-brand{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:var(--ink);margin-bottom:2px}
  .history-meta{font-size:11px;color:var(--ink-faint);font-weight:300}
  .verdict-tag{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;padding:3px 9px;border-radius:2px;flex-shrink:0;font-weight:400}
  .verdict-tag.authentic{background:rgba(61,122,92,0.08);color:var(--success)}
  .verdict-tag.fake{background:rgba(155,58,58,0.08);color:var(--danger)}
  .verdict-tag.uncertain{background:rgba(139,111,46,0.08);color:var(--warn)}

  .account-menu-wrap{position:relative}
  .account-btn{display:flex;align-items:center;gap:7px;background:transparent;border:1px solid var(--border);border-radius:2px;padding:7px 12px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink);transition:all 0.2s}
  .account-btn:hover{border-color:var(--ink)}
  .account-avatar{width:20px;height:20px;border-radius:50%;background:var(--ink);color:var(--cream);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif}
  .account-dropdown{position:absolute;top:calc(100% + 7px);right:0;background:var(--cream);border:1px solid var(--border);border-radius:4px;min-width:210px;box-shadow:var(--shadow-lg);z-index:200;overflow:hidden}
  .dropdown-header{padding:14px 16px;border-bottom:1px solid var(--border2)}
  .dropdown-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--ink)}
  .dropdown-email{font-size:11px;color:var(--ink-faint);margin-top:1px}
  .dropdown-item{display:flex;align-items:center;gap:10px;padding:11px 16px;font-size:12px;color:var(--ink-soft);cursor:pointer;transition:background 0.15s;border:none;background:none;width:100%;text-align:left;font-family:'Space Grotesk',sans-serif;font-weight:300}
  .dropdown-item:hover{background:var(--cream2);color:var(--ink)}
  .dropdown-item.danger{color:var(--danger)}
  .dropdown-item.danger:hover{background:rgba(155,58,58,0.06)}
  .dropdown-sep{height:1px;background:var(--border2);margin:3px 0}

  .overlay{position:fixed;inset:0;background:rgba(26,24,20,0.6);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
  .modal{background:var(--cream);border:1px solid var(--border);border-radius:4px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg)}
  .modal-head{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid var(--border)}
  .modal-head-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--ink);letter-spacing:0.02em}
  .modal-close{background:none;border:none;font-size:18px;color:var(--ink-faint);cursor:pointer}
  .modal-close:hover{color:var(--ink)}
  .modal-body{padding:22px}

  .share-url-box{display:flex;gap:8px;align-items:center;background:var(--cream2);border:1px solid var(--border);border-radius:3px;padding:10px 14px;margin-bottom:14px}
  .share-url{flex:1;font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-soft);word-break:break-all}
  .share-copy-btn{flex-shrink:0;background:var(--ink);color:var(--cream);border:none;border-radius:2px;padding:6px 12px;font-size:10px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;transition:background 0.2s}
  .share-copy-btn:hover{background:var(--ink2)}
  .share-copy-btn.copied{background:var(--success)}
  .share-methods{display:grid;grid-template-columns:1fr 1fr;gap:7px}
  .share-method{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border:1px solid var(--border);border-radius:3px;cursor:pointer;background:transparent;font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);transition:all 0.2s}
  .share-method:hover{background:var(--cream2);color:var(--ink);border-color:var(--ink)}
  .share-method-icon{font-size:18px}

  .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--ink);color:var(--cream);padding:10px 22px;border-radius:3px;font-size:12px;font-weight:400;z-index:999;transition:transform 0.3s ease;font-family:'Space Grotesk',sans-serif;white-space:nowrap;box-shadow:var(--shadow-lg)}
  .toast.show{transform:translateX(-50%) translateY(0)}

  .cgu-page{padding:90px 24px 60px;min-height:100vh;background:var(--cream);max-width:720px;margin:0 auto}
  .cgu-title{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--ink);margin-bottom:6px;letter-spacing:-0.02em}
  .cgu-date{font-size:11px;color:var(--ink-faint);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:48px;font-weight:300}
  .cgu-section{margin-bottom:36px}
  .cgu-h2{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:10px;letter-spacing:-0.01em;padding-bottom:8px;border-bottom:1px solid var(--border)}
  .cgu-p{font-size:13px;color:var(--ink-soft);line-height:1.8;font-weight:300;margin-bottom:10px}
  .cgu-p strong{color:var(--ink);font-weight:500}
  .cgu-list{font-size:13px;color:var(--ink-soft);line-height:1.8;font-weight:300;padding-left:18px;margin-bottom:10px}
  .cgu-list li{margin-bottom:4px}
  .footer-links{display:flex;gap:16px;margin-top:8px;flex-wrap:wrap}
  .footer-link{font-size:11px;color:rgba(247,244,239,0.4);cursor:pointer;transition:color 0.2s;font-weight:300}
  .footer-link:hover{color:rgba(247,244,239,0.7)}

  /* ── COMMENT ÇA MARCHE ── */
  .how-page{padding:90px 24px 80px;min-height:100vh;background:var(--cream)}
  .how-hero{margin-bottom:56px}
  .how-hero-eyebrow{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent2);margin-bottom:16px;font-weight:400;display:flex;align-items:center;gap:10px}
  .how-hero-eyebrow::before{content:'';display:inline-block;width:20px;height:1px;background:var(--accent2)}
  .how-hero h1{font-family:'Syne',sans-serif;font-size:clamp(28px,6vw,52px);font-weight:800;line-height:1.02;letter-spacing:-0.03em;color:var(--ink);margin-bottom:16px}
  .how-hero h1 em{font-style:italic;color:var(--accent2)}
  .how-hero-sub{font-size:14px;color:var(--ink-soft);line-height:1.7;max-width:480px;font-weight:300}
  .how-steps{display:flex;flex-direction:column;gap:2px;margin-bottom:56px}
  .how-step{display:grid;grid-template-columns:56px 1fr;background:var(--cream);border:1px solid var(--border);border-radius:4px;overflow:hidden;transition:box-shadow 0.25s}
  .how-step:hover{box-shadow:var(--shadow-lg)}
  .how-step-num{background:var(--ink);color:var(--cream);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:12px;font-weight:300;letter-spacing:0.08em;writing-mode:vertical-lr;padding:20px 0}
  .how-step-body{padding:22px 20px}
  .how-step-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--ink);margin-bottom:8px;letter-spacing:-0.01em}
  .how-step-desc{font-size:13px;color:var(--ink-soft);line-height:1.7;font-weight:300;margin-bottom:12px}
  .how-step-tips{display:flex;flex-direction:column;gap:5px}
  .how-step-tip{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--ink-soft);font-weight:300}
  .how-step-tip::before{content:'→';color:var(--accent2);flex-shrink:0;font-size:11px;margin-top:1px}
  .how-zones{background:var(--cream2);border-radius:6px;padding:24px;margin-bottom:56px}
  .how-zones-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--ink);margin-bottom:16px;letter-spacing:-0.01em}
  .how-zones-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .how-zone-card{background:var(--cream);border:1px solid var(--border);border-radius:3px;padding:12px 14px}
  .how-zone-icon{font-size:18px;margin-bottom:6px}
  .how-zone-name{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--ink);margin-bottom:3px}
  .how-zone-desc{font-size:11px;color:var(--ink-faint);line-height:1.5;font-weight:300}
  .how-faq{margin-bottom:40px}
  .how-faq-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:20px;letter-spacing:-0.02em}
  .how-faq-item{border-bottom:1px solid var(--border);padding:16px 0;cursor:pointer}
  .how-faq-q{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:500;color:var(--ink)}
  .how-faq-chevron{font-size:10px;color:var(--ink-faint);transition:transform 0.2s}
  .how-faq-chevron.open{transform:rotate(180deg)}
  .how-faq-a{font-size:12px;color:var(--ink-soft);line-height:1.7;font-weight:300;padding-top:10px}

  /* ── CONTACT ── */
  .contact-page{padding:90px 24px 80px;min-height:100vh;background:var(--cream);max-width:560px;margin:0 auto}
  .contact-title{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--ink);margin-bottom:6px;letter-spacing:-0.02em}
  .contact-sub{font-size:13px;color:var(--ink-soft);margin-bottom:40px;font-weight:300;line-height:1.7}
  .contact-methods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:36px}
  .contact-method{background:var(--cream2);border:1px solid var(--border);border-radius:4px;padding:16px;display:flex;flex-direction:column;gap:6px}
  .contact-method-icon{font-size:20px}
  .contact-method-label{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-faint);font-weight:400}
  .contact-method-val{font-size:13px;color:var(--ink);font-weight:400}
  .contact-form-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:20px;letter-spacing:-0.01em}
  .contact-select{width:100%;background:transparent;border:none;border-bottom:1px solid var(--border);padding:10px 0;color:var(--ink);font-size:14px;font-family:'Space Grotesk',sans-serif;font-weight:300;outline:none;cursor:pointer;appearance:none;transition:border-color 0.2s}
  .contact-select:focus{border-bottom-color:var(--ink)}
  .contact-success{background:rgba(61,122,92,0.06);border-left:2px solid var(--success);color:var(--success);padding:14px 16px;font-size:13px;font-weight:300;border-radius:2px}

  /* ── PARRAINAGE ── */
  .referral-page{padding:90px 24px 80px;min-height:100vh;background:var(--cream)}
  .referral-hero{text-align:center;margin-bottom:48px}
  .referral-hero-icon{font-size:48px;margin-bottom:16px}
  .referral-hero h1{font-family:'Syne',sans-serif;font-size:clamp(26px,5vw,44px);font-weight:800;color:var(--ink);letter-spacing:-0.03em;margin-bottom:12px;line-height:1.05}
  .referral-hero h1 em{font-style:italic;color:var(--accent2)}
  .referral-hero-sub{font-size:13px;color:var(--ink-soft);font-weight:300;line-height:1.7;max-width:400px;margin:0 auto}
  .referral-how{display:flex;flex-direction:column;gap:2px;margin-bottom:36px}
  .referral-step{display:flex;gap:16px;align-items:flex-start;padding:18px;background:var(--cream2);border:1px solid var(--border);border-radius:4px}
  .referral-step-num{width:32px;height:32px;border-radius:50%;background:var(--ink);color:var(--cream);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .referral-step-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--ink);margin-bottom:3px}
  .referral-step-desc{font-size:12px;color:var(--ink-soft);font-weight:300;line-height:1.6}
  .referral-rewards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:36px}
  .referral-reward{background:var(--ink);color:var(--cream);border-radius:4px;padding:20px 16px;text-align:center;position:relative;overflow:hidden}
  .referral-reward::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(196,168,130,0.12) 0%,transparent 70%)}
  .referral-reward-count{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--accent);line-height:1;margin-bottom:4px;position:relative}
  .referral-reward-label{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(247,244,239,0.5);position:relative}
  .referral-reward-desc{font-size:12px;color:rgba(247,244,239,0.7);margin-top:8px;font-weight:300;line-height:1.5;position:relative}
  .referral-box{background:var(--cream2);border:1px solid var(--border);border-radius:6px;padding:24px;margin-bottom:24px}
  .referral-box-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--ink);margin-bottom:16px}
  .referral-code-wrap{display:flex;gap:8px;align-items:center;background:var(--cream);border:1px solid var(--border);border-radius:3px;padding:12px 16px;margin-bottom:12px}
  .referral-code{flex:1;font-family:'DM Mono',monospace;font-size:16px;font-weight:400;color:var(--ink);letter-spacing:0.1em}
  .referral-copy-btn{background:var(--ink);color:var(--cream);border:none;border-radius:2px;padding:8px 14px;font-size:10px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.2s;flex-shrink:0}
  .referral-copy-btn:hover{background:var(--ink2)}
  .referral-copy-btn.copied{background:var(--success)}
  .referral-share-btns{display:grid;grid-template-columns:1fr 1fr;gap:7px}
  .referral-share-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border:1px solid var(--border);border-radius:3px;cursor:pointer;background:transparent;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);transition:all 0.2s}
  .referral-share-btn:hover{background:var(--cream);border-color:var(--ink);color:var(--ink)}
  .referral-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:24px}
  .referral-stat{text-align:center;padding:16px 10px;background:var(--cream2);border:1px solid var(--border);border-radius:4px}
  .referral-stat-val{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:var(--ink);line-height:1;margin-bottom:4px}
  .referral-stat-label{font-size:10px;color:var(--ink-faint);letter-spacing:0.1em;text-transform:uppercase;font-weight:300}
  .referral-need-account{text-align:center;padding:48px 24px;background:var(--cream2);border:1px solid var(--border);border-radius:6px}
  .referral-need-account-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:8px}
  .referral-need-account-sub{font-size:13px;color:var(--ink-soft);font-weight:300;margin-bottom:20px}

  @media(min-width:640px){
    .nav{padding:0 36px}
    .nav-center{display:flex}
    .hero{padding:100px 36px 72px}
    .section{padding:80px 36px}
    .divider{margin:0 36px}
    .photo-features{grid-template-columns:repeat(2,1fr)}
    .photo-feat-img{height:220px}
    .refdb-grid{grid-template-columns:repeat(3,1fr)}
    .expert-grid{grid-template-columns:repeat(2,1fr)}
    .refdb-section{padding:80px 36px}
    .community-section{padding:80px 36px}
    .pricing-grid{grid-template-columns:repeat(2,1fr)}
    .pricing-section{padding:80px 36px}
    .cta-section{padding:80px 36px}
    footer{padding:48px 36px 32px}
    .dash-header{padding:32px 36px 0}
    .tabs{padding:0 36px}
    .tab-content{padding:28px 36px}
    .scan-card{padding:26px}
    .how-page{padding:90px 36px 80px}
    .how-zones-grid{grid-template-columns:repeat(4,1fr)}
    .how-step{grid-template-columns:64px 1fr}
    .referral-page{padding:90px 36px 80px}
    .referral-how{flex-direction:row}
    .referral-step{flex-direction:column;flex:1}
  }
  @media(min-width:900px){
    .photo-features{grid-template-columns:repeat(3,1fr)}
    .refdb-grid{grid-template-columns:repeat(4,1fr)}
    .pricing-grid{grid-template-columns:repeat(4,1fr)}
  }
`;

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const getUsers = () => JSON.parse(localStorage.getItem("lw_users") || "{}");
const saveUsers = u => localStorage.setItem("lw_users", JSON.stringify(u));
const getSession = () => localStorage.getItem("lw_session") || null;
const setSession = e => localStorage.setItem("lw_session", e);
const clearSession = () => localStorage.removeItem("lw_session");
const getHistory = email => (getUsers()[email]?.history || []);
const addHistory = (email, item) => {
  const u = getUsers();
  if (!u[email]) return;
  u[email].history = [item, ...(u[email].history || [])].slice(0, 50);
  saveUsers(u);
};
const toBase64 = file => new Promise((res, rej) => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX_DIM = 1280;
      let { width, height } = img;
      if (width > height && width > MAX_DIM) {
        height = Math.round(height * (MAX_DIM / width));
        width = MAX_DIM;
      } else if (height > MAX_DIM) {
        width = Math.round(width * (MAX_DIM / height));
        height = MAX_DIM;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      res({ data: dataUrl.split(",")[1], type: "image/jpeg", url: dataUrl });
    };
    img.onerror = rej;
    img.src = reader.result;
  };
  reader.onerror = rej;
  reader.readAsDataURL(file);
});
const getReferralCode = email => {
  if (!email) return null;
  const u = getUsers();
  if (!u[email].referralCode) {
    u[email].referralCode = "LW-" + email.split("@")[0].toUpperCase().slice(0, 6) + Math.floor(Math.random() * 900 + 100);
    saveUsers(u);
  }
  return u[email].referralCode;
};
const getReferralStats = email => {
  const u = getUsers();
  return u[email]?.referralStats || { invited: 0, joined: 0, scansEarned: 0 };
};

// ─── API ──────────────────────────────────────────────────────────────────────
async function scanProduct(images, description) {
  const res = await fetch("/api/scan-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images, description })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur API");
  return data;
}

function exportPDF(result) {
  const label = result.verdict === "authentic" ? "AUTHENTIQUE" : result.verdict === "fake" ? "CONTREFAÇON" : "INCERTAIN";
  const color = result.verdict === "authentic" ? "#3D7A5C" : result.verdict === "fake" ? "#9B3A3A" : "#8B6F2E";
  const issueRows = (result.issues || []).map(function(i) {
    return "<tr><td style='padding:8px 12px;border-bottom:1px solid #f0ede8;font-size:12px;color:#6B6560;text-transform:uppercase;width:100px'>"
      + i.zone + "</td><td style='padding:8px 12px;border-bottom:1px solid #f0ede8;font-size:13px;color:#1A1814'>"
      + (i.type === "ok" ? "✓ " : "✗ ") + i.description + "</td></tr>";
  }).join("");
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><style>"
    + "body{font-family:'Helvetica Neue',sans-serif;background:#F7F4EF;color:#1A1814;padding:48px;max-width:680px;margin:0 auto}"
    + ".sub{font-size:11px;color:#A8A39C;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:28px}"
    + ".brand{font-size:22px;font-weight:600;margin-bottom:8px}"
    + ".verdict{display:inline-block;padding:5px 14px;border-radius:3px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;background:" + color + "22;color:" + color + ";margin-bottom:8px}"
    + ".score{font-size:44px;font-weight:300;color:" + color + ";line-height:1;margin-bottom:16px}"
    + ".summary{font-size:14px;color:#6B6560;line-height:1.7;margin-bottom:24px}"
    + "table{width:100%;border-collapse:collapse;margin-bottom:20px}"
    + ".advice{background:#EDE9E1;padding:14px 16px;border-radius:3px;font-size:13px;color:#6B6560;line-height:1.7;margin-bottom:24px}"
    + ".footer{padding-top:18px;border-top:1px solid #E0DAD0;font-size:11px;color:#A8A39C}"
    + "</style></head><body>"
    + "<div class='sub'>Rapport d'authentification — LegitWear</div>"
    + "<div class='brand'>" + result.brand + " — " + result.product_type + "</div>"
    + "<div class='verdict'>" + label + "</div><br/>"
    + "<div class='score'>" + result.score + "<span style='font-size:16px'>%</span></div>"
    + "<div class='summary'>" + result.summary + "</div>"
    + "<table>" + issueRows + "</table>"
    + (result.advice ? "<div class='advice'><strong>Conseil :</strong> " + result.advice + "</div>" : "")
    + "<div class='footer'>Généré par LegitWear · " + dateStr + " · Service indicatif, non contractuel.</div>"
    + "</body></html>";
  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); setTimeout(function() { win.print(); }, 400); }
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ user, onLogin, onSignup, onLogout, onDashboard, onHome, onShare, onSwitchAccount, onHow, onContact, onReferral }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const users = getUsers();
  const name = user ? (users[user]?.name || user.split("@")[0]) : "";
  const initial = name.charAt(0).toUpperCase();
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={onHome}>LegitWear</div>
      <div className="nav-center">
        <span className="nav-link" onClick={onHome}>Accueil</span>
        <span className="nav-link" onClick={onHow}>Comment ça marche</span>
        <span className="nav-link" onClick={onContact}>Contact</span>
        <span className="nav-link" onClick={onShare}>Partager</span>
      </div>
      <div className="nav-actions">
        {user ? (
          <div className="account-menu-wrap" ref={menuRef}>
            <button className="account-btn" onClick={() => setMenuOpen(o => !o)}>
              <div className="account-avatar">{initial}</div>
              {name}
              <span style={{fontSize:8,opacity:0.5}}>▼</span>
            </button>
            {menuOpen && (
              <div className="account-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-name">{name}</div>
                  <div className="dropdown-email">{user}</div>
                </div>
                <button className="dropdown-item" onClick={() => { setMenuOpen(false); onDashboard(); }}>🔍 Mon espace</button>
                <button className="dropdown-item" onClick={() => { setMenuOpen(false); onReferral(); }}>🎁 Parrainer un ami</button>
             <div className="tab" onClick={() => window.open("https://billing.stripe.com/p/login/28E14pdqs72o3IPdOieAg00", "_blank")}>💳 Mon abonnement</div>  <button className="dropdown-item" onClick={() => { setMenuOpen(false); onShare(); }}>🔗 Partager</button>
                <div className="dropdown-sep" />
                <button className="dropdown-item" onClick={() => { setMenuOpen(false); onSwitchAccount(); }}>↔️ Changer de compte</button>
                <button className="dropdown-item danger" onClick={() => { setMenuOpen(false); onLogout(); }}>→ Se déconnecter</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={onLogin}>Connexion</button>
            <button className="btn btn-primary" onClick={onSignup}>Commencer</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
const BRANDS = ["Nike","Adidas","Supreme","Stone Island","Off-White","Balenciaga","Louis Vuitton","Gucci","Jordan","Palace","Carhartt WIP","Stüssy","Moncler","The North Face","Arc'teryx","Ami Paris","Bottega Veneta","Prada"];

function Landing({ onLogin, onSignup, onShare, onCheckout, onCGU, onHow, onContact }) {
  const marqueeItems = [...BRANDS, ...BRANDS];
  return (
    <>
      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-eyebrow">Authentification par intelligence artificielle</div>
          <h1>Authentique<br />ou <em>contrefaçon</em> ?<br />La réponse express.</h1>
          <p className="hero-sub">Uploadez les photos de votre article. Notre IA analyse chaque détail — logo, coutures, étiquettes, matière — et vous rend un verdict clair avec explication.</p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={onSignup}>Lancer une analyse</button>
            <button className="btn btn-outline btn-lg" onClick={onHow}>Comment ça marche</button>
            <button className="btn btn-ghost btn-lg" onClick={onLogin}>Se connecter</button>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-avatars">
              {["KM","SL","TR","AL"].map((i,idx) => <div className="hero-trust-avatar" key={idx}>{i}</div>)}
            </div>
            <div className="hero-trust-text"><strong>+2 400 articles</strong> analysés ce mois</div>
          </div>
        </div>
        <div className="hero-bottom">
          {[["< 10s","Analyse IA"],["6","Photos max"],["∞","Marques"]].map(([v,l]) => (
            <div key={l}><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {marqueeItems.map((b, i) => (
            <span className="marquee-item" key={i}>{b}{i < marqueeItems.length - 1 && <span className="marquee-dot"> · </span>}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="section-eyebrow">Processus</div>
        <div className="section-title">Simple,<br /><em>rapide</em>, fiable.</div>
        <div className="process-list">
          {[
            { n:"01", t:"Photographiez l'article", d:"3 à 6 photos : logo, couture, étiquette, semelle. Plus les détails sont nets, plus l'analyse est précise." },
            { n:"02", t:"L'IA analyse tout", d:"Notre IA examine chaque pixel : typographie, alignements, qualité de finition, cohérence des matières." },
            { n:"03", t:"Verdict et explication", d:"Authentique, contrefaçon ou incertain — avec un score de confiance et le détail de chaque indice analysé." },
          ].map(s => (
            <div className="process-item" key={s.n}>
              <div className="process-num">{s.n}</div>
              <div><div className="process-title">{s.t}</div><div className="process-desc">{s.d}</div></div>
            </div>
          ))}
        </div>
        <div style={{marginTop:28}}>
          <button className="btn btn-outline" onClick={onHow}>En savoir plus →</button>
        </div>
      </section>

      <div className="divider" />

      <section className="section" style={{background:"var(--cream2)"}}>
        <div className="section-eyebrow">Fonctionnalités</div>
        <div className="section-title">Conçu pour les<br /><em>vrais acheteurs.</em></div>
        <div className="photo-features">
          {[
{ img: antiArnaqueImg, icon:"🛡", t:"Anti-arnaque", d:"Évitez les fakes sur Vinted, Vestiaire Collective, eBay ou Leboncoin avant d'acheter." },
{ img: indicesImg, icon:"🔍", t:"Indices détaillés", d:"Chaque point analysé est expliqué — vous comprenez pourquoi, pas juste ce que." },
{ img: resultatImg, icon:"⚡", t:"Résultat express", d:"Moins de 10 secondes pour un verdict complet, 24h/24." },
{ img: toutesMarquesImg, icon:"🧠", t:"Toutes les marques", d:"Streetwear, luxe, sneakers — Nike, Jordan, LV, Gucci, Supreme, Stone Island..." },
{ img: historiqueImg, icon:"📁", t:"Historique personnel", d:"Retrouvez tous vos scans passés, organisés et consultables à tout moment." },
{ img: rapportImg, icon:"📄", t:"Rapport PDF", d:"Exportez un rapport complet après chaque scan — idéal pour les pros." },
          ].map(f => (
            <div className="photo-feat" key={f.t}>
              <img className="photo-feat-img" src={f.img} alt={f.t} loading="lazy" />
              <div className="photo-feat-body">
                <div className="photo-feat-icon">{f.icon}</div>
                <div className="photo-feat-title">{f.t}</div>
                <div className="photo-feat-desc">{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="refdb-section">
        <div className="section-eyebrow">Base de données</div>
        <div className="section-title" style={{marginBottom:28}}>Des milliers de<br /><em>références vérifiées.</em></div>
        <div className="refdb-grid">
         {[
  { brand:"Nike", type:"Air Jordan 4", tags:["authentic","fake"] },
  { brand:"Supreme", type:"Box Logo Hoodie", tags:["authentic","fake"] },
  { brand:"Stone Island", type:"Patch Badge", tags:["authentic","fake"] },
  { brand:"Jordan", type:"Air Jordan 1", tags:["authentic","fake"] },
  { brand:"Louis Vuitton", type:"Monogram", tags:["locked"] },
  { brand:"Gucci", type:"GG Canvas", tags:["locked"] },
  { brand:"Balenciaga", type:"Triple S", tags:["locked"] },
  { brand:"Off-White", type:"Arrow Tee", tags:["locked"] },
].map((r, i) => (
  <div className="refdb-card" key={i}>
    <div>
      <div className="refdb-brand">{r.brand}</div>
      <div className="refdb-type">{r.type}</div>
      <div className="refdb-tags">
        {r.tags.includes("authentic") && <span className="refdb-tag authentic">✓ Vrai</span>}
        {r.tags.includes("fake") && <span className="refdb-tag fake">✗ Fake</span>}
        {r.tags.includes("locked") && <span className="refdb-tag locked">🔒 Pro</span>}
      </div>
    </div>
  </div>
))}
        </div>
        <div className="refdb-count">+2 400 références · Mis à jour chaque semaine · Accès complet dès le plan Pro</div>
      </section>

      <section className="community-section">
        <div className="section-eyebrow">Communauté</div>
        <div className="section-title" style={{marginBottom:28}}>L'avis des<br /><em>experts.</em></div>
        <div className="expert-grid">
          {[
            { init:"KM", name:"Karim M.", role:"Reseller — 300+ ventes/an", badge:"Expert vérifié", text:"J'ai évité 3 fakes en une semaine. Le scan sur la couture du logo Supreme était parfait, exactement ce que j'aurais vérifié à la main.", brand:"Spécialiste Supreme & Jordan" },
            { init:"SL", name:"Sofia L.", role:"Acheteuse Vinted régulière", badge:"Membre Pro", text:"J'ai failli acheter un Stone Island à 180€ qui était faux. LegitWear l'a détecté en 8 secondes grâce au badge mal cousu.", brand:"Streetwear & luxe accessible" },
            { init:"TR", name:"Thomas R.", role:"Sneaker collector", badge:"Expert vérifié", text:"La précision sur les Air Jordan est bluffante. Il détecte des détails que même les vendeurs ne voient pas.", brand:"Spécialiste Nike & Adidas" },
            { init:"AL", name:"Aya L.", role:"Personal shopper", badge:"Membre Premium", text:"Je l'utilise pour mes clients avant chaque achat. Le rapport PDF que j'envoie avec mes recommandations, c'est un vrai plus pro.", brand:"Luxe & streetwear haut de gamme" },
          ].map((e, i) => (
            <div className="expert-card" key={i}>
              <div className="expert-header">
                <div className="expert-avatar">{e.init}</div>
                <div><div className="expert-name">{e.name}</div><div className="expert-role">{e.role}</div></div>
                <div className="expert-badge">{e.badge}</div>
              </div>
              <div className="expert-text">"{e.text}"</div>
              <div className="expert-brand">{e.brand}</div>
            </div>
          ))}
        </div>
        <div className="community-cta">Tu veux rejoindre la communauté ? <span onClick={onSignup}>Créer un compte</span></div>
      </section>

      <section className="pricing-section">
        <div className="section-eyebrow">Tarifs</div>
        <div className="section-title" style={{marginBottom:36}}>Simple,<br /><em>transparent.</em></div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-lock">🆓</div>
            <div className="pricing-plan">Gratuit</div>
            <div className="pricing-price"><span className="amount">0</span><span className="period"> €/mois</span></div>
            <div className="pricing-desc">Pour découvrir LegitWear sans engagement.</div>
            <div className="pricing-features">
              {[["✓","3 scans par mois"],["✓","Verdict simple"],["✓","1 indice par scan"],["—","Historique"],["—","Rapport PDF"],["—","Indices détaillés"]].map(([ic,tx],i) => (
                <div className="pricing-feature" key={i} style={{opacity:ic==="—"?0.35:1}}>
                  <span className="pricing-feature-icon">{ic}</span><span>{tx}</span>
                </div>
              ))}
            </div>
            <button className="pricing-cta light" onClick={onSignup}>Commencer gratuitement</button>
          </div>
          <div className="pricing-card bronze">
            <div className="pricing-lock">🥉</div>
            <div className="pricing-plan">Starter</div>
            <div className="pricing-price"><span className="amount">9,99</span><span style={{fontSize:16,fontWeight:400,verticalAlign:"super",marginLeft:2}}>€</span><span className="period">/mois</span></div>
            <div className="pricing-desc">Pour débuter et vérifier tes achats occasionnels.</div>
            <div className="pricing-features">
              {[["✓","20 scans par mois"],["✓","Verdict + score"],["✓","2 indices par scan"],["✓","Historique 30 jours"],["✓","Toutes les marques"],["—","Rapport PDF"]].map(([ic,tx],i) => (
                <div className="pricing-feature" key={i} style={{opacity:ic==="—"?0.35:1}}>
                  <span className="pricing-feature-icon">{ic}</span><span>{tx}</span>
                </div>
              ))}
            </div>
            <button className="pricing-cta bronze-btn" onClick={() => onCheckout("starter")}>Commencer — 7j offerts</button>
          </div>
          <div className="pricing-card silver" style={{position:"relative"}}>
            <div className="pricing-badge silver-b">Le plus populaire</div>
            <div className="pricing-lock" style={{marginTop:16}}>🥈</div>
            <div className="pricing-plan">Pro</div>
            <div className="pricing-price"><span className="amount">14,99</span><span style={{fontSize:16,fontWeight:400,verticalAlign:"super",marginLeft:2}}>€</span><span className="period">/mois</span></div>
            <div className="pricing-desc">Pour les resellers et acheteurs réguliers.</div>
            <div className="pricing-features">
              {[["✓","Scans illimités"],["✓","Verdict + score"],["✓","Indices complets"],["✓","Historique illimité"],["✓","Rapport PDF"],["—","Accès prioritaire"]].map(([ic,tx],i) => (
                <div className="pricing-feature" key={i} style={{opacity:ic==="—"?0.35:1}}>
                  <span className="pricing-feature-icon">{ic}</span><span>{tx}</span>
                </div>
              ))}
            </div>
            <button className="pricing-cta silver-btn" onClick={() => onCheckout("pro")}>Choisir Pro — 7j offerts</button>
          </div>
          <div className="pricing-card gold" style={{position:"relative"}}>
            <div className="pricing-badge gold-b">✦ Exclusif</div>
            <div className="pricing-lock" style={{marginTop:16}}>👑</div>
            <div className="pricing-plan">Premium</div>
            <div className="pricing-price"><span className="amount">19,99</span><span style={{fontSize:16,fontWeight:400,verticalAlign:"super",marginLeft:2}}>€</span><span className="period">/mois</span></div>
            <div className="pricing-desc">L'expérience ultime. Pour ceux qui ne transigent pas.</div>
            <div className="pricing-features">
              {[["✓","Scans illimités"],["✓","Verdict + score"],["✓","Indices complets"],["✓","Historique illimité"],["✓","Rapport PDF"],["✓","Accès prioritaire IA"]].map(([ic,tx],i) => (
                <div className="pricing-feature" key={i}>
                  <span className="pricing-feature-icon">{ic}</span><span>{tx}</span>
                </div>
              ))}
            </div>
            <button className="pricing-cta gold-btn" onClick={() => onCheckout("premium")}>Choisir Premium — 7j offerts</button>
          </div>
        </div>
        <div className="pricing-free">Essai gratuit 7 jours — <span onClick={onSignup}>commencer sans carte bancaire</span></div>
      </section>

      <section className="cta-section">
        <h2>Prêt à scanner<br />votre <em>premier article</em> ?</h2>
        <p>Compte gratuit, résultats instantanés.</p>
        <button className="btn btn-cream btn-lg" onClick={onSignup}>Créer un compte gratuit</button>
      </section>

      <footer>
        <div className="footer-logo">LegitWear</div>
        <div className="footer-tagline">La vérité sur ce que tu portes.</div>
        <div className="footer-links">
          <span className="footer-link" onClick={() => { window.scrollTo(0,0); }}>Accueil</span>
          <span className="footer-link" onClick={onHow}>Comment ça marche</span>
          <span className="footer-link" onClick={onContact}>Contact</span>
          <span className="footer-link" onClick={onCGU}>CGU</span>
        </div>
        <div className="footer-legal">
          © 2026 LegitWear — Service indicatif<br /><br />
          <strong style={{color:"rgba(247,244,239,0.45)"}}>Mentions légales :</strong> LegitWear est un outil d'aide à la décision basé sur l'intelligence artificielle. Les résultats fournis sont indicatifs et non contractuels. En aucun cas LegitWear ou son créateur ne pourra être tenu responsable des décisions d'achat ou de vente prises sur la base des analyses fournies. Cet outil ne remplace pas l'expertise d'un professionnel certifié. LegitWear n'est affilié à aucune marque mentionnée. Toutes les marques citées appartiennent à leurs propriétaires respectifs.
        </div>
      </footer>
    </>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowPage({ onBack, onSignup }) {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q:"LegitWear peut-il se tromper ?", a:"Oui. L'IA est très précise mais non infaillible. Le score de confiance indique le niveau de certitude. En cas de doute (score < 70%), consultez un expert physique." },
    { q:"Quelles photos envoyer pour un meilleur résultat ?", a:"Logo en gros plan, couture interne, étiquette de taille, semelle (pour les sneakers), packaging si disponible. Évitez les photos floues ou trop sombres." },
    { q:"Mes photos sont-elles conservées ?", a:"Non. Les photos sont analysées en temps réel et ne sont pas stockées sur nos serveurs. Seul le résultat de l'analyse est sauvegardé dans votre historique." },
    { q:"Combien de temps prend une analyse ?", a:"Moins de 10 secondes en général. Le temps peut varier selon la qualité des photos et la complexité de l'article." },
    { q:"LegitWear fonctionne pour toutes les marques ?", a:"Oui, l'IA analyse tout type de vêtement ou accessoire. Les marques streetwear et luxe les plus connues donnent les meilleurs résultats car notre base de données en contient davantage." },
  ];
  return (
    <div className="how-page">
      <button className="back-btn" onClick={onBack}>← Retour</button>
      <div className="how-hero">
        <div className="how-hero-eyebrow">Guide d'utilisation</div>
        <h1>Comment ça<br /><em>marche</em> ?</h1>
        <p className="how-hero-sub">LegitWear utilise l'intelligence artificielle pour analyser vos articles en quelques secondes. Voici comment obtenir le meilleur résultat.</p>
      </div>

      <div className="how-steps">
        {[
          {
            n:"01", t:"Créez votre compte", d:"Gratuit, sans carte bancaire. Votre compte vous permet d'accéder à l'analyse IA et de conserver votre historique de scans.",
            tips:["Choisissez un email valide pour recevoir vos rapports","L'inscription prend moins de 30 secondes"]
          },
          {
            n:"02", t:"Photographiez l'article", d:"La qualité des photos est la clé. Plus elles sont nettes et détaillées, plus le verdict sera précis.",
            tips:["Photographiez sur fond neutre (blanc ou gris)","Utilisez la lumière naturelle de préférence","Cadrez serré sur les éléments clés","Évitez les photos filtrées ou retouchées"]
          },
          {
            n:"03", t:"Uploadez jusqu'à 6 photos", d:"Ajoutez les zones les plus importantes : logo, coutures, étiquettes, semelle, packaging. Plus vous ajoutez de photos, plus l'analyse est complète.",
            tips:["Logo : zoom maximum sur la typographie","Étiquette : intérieure et extérieure","Coutures : propreté et régularité","Semelle : textures et inscriptions"]
          },
          {
            n:"04", t:"Obtenez votre verdict", d:"En moins de 10 secondes, l'IA analyse chaque zone et vous retourne un verdict détaillé avec score de confiance et explications point par point.",
            tips:["Score > 85% : haute confiance","Score 60-85% : résultat probable","Score < 60% : consultez un expert"]
          },
        ].map(s => (
          <div className="how-step" key={s.n}>
            <div className="how-step-num">{s.n}</div>
            <div className="how-step-body">
              <div className="how-step-title">{s.t}</div>
              <div className="how-step-desc">{s.d}</div>
              <div className="how-step-tips">
                {s.tips.map((tip, i) => <div className="how-step-tip" key={i}>{tip}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="how-zones">
        <div className="how-zones-title">Les zones analysées par l'IA</div>
        <div className="how-zones-grid">
          {[
            { icon:"🔤", name:"Logo & typographie", desc:"Police, espacement, couleurs, proportions" },
            { icon:"🧵", name:"Coutures", desc:"Régularité, couleur du fil, finition" },
            { icon:"🏷", name:"Étiquettes", desc:"Texte, matières, code-barres, positionnement" },
            { icon:"👟", name:"Semelle", desc:"Texture, inscriptions, qualité du moulage" },
            { icon:"🎨", name:"Matières", desc:"Qualité du tissu, grammage, rendu visuel" },
            { icon:"📦", name:"Packaging", desc:"Boîte, papiers de soie, accessoires inclus" },
            { icon:"🔩", name:"Fermetures", desc:"Zips, boutons, rivets et leur qualité" },
            { icon:"📐", name:"Proportions", desc:"Dimensions générales et symétrie" },
          ].map((z, i) => (
            <div className="how-zone-card" key={i}>
              <div className="how-zone-icon">{z.icon}</div>
              <div className="how-zone-name">{z.name}</div>
              <div className="how-zone-desc">{z.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="how-faq">
        <div className="how-faq-title">Questions fréquentes</div>
        {faqs.map((f, i) => (
          <div className="how-faq-item" key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
            <div className="how-faq-q">
              {f.q}
              <span className={"how-faq-chevron" + (openFaq === i ? " open" : "")}>▼</span>
            </div>
            {openFaq === i && <div className="how-faq-a">{f.a}</div>}
          </div>
        ))}
      </div>

      <div style={{textAlign:"center",paddingTop:16}}>
        <button className="btn btn-primary btn-lg" onClick={onSignup}>Lancer ma première analyse</button>
      </div>
    </div>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function ContactPage({ onBack }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    if (!email || !message) return;
    setSent(true);
  };
  return (
    <div className="contact-page">
      <button className="back-btn" onClick={onBack}>← Retour</button>
      <div className="cgu-title">Nous contacter</div>
      <div className="contact-sub">Une question, un problème ou une suggestion ? On vous répond dans les 24h.</div>

      <div className="contact-methods">
        <div className="contact-method">
          <div className="contact-method-icon">✉️</div>
          <div className="contact-method-label">Email</div>
          <div className="contact-method-val">support@legitwear.app</div>
        </div>
        <div className="contact-method">
          <div className="contact-method-icon">⏱</div>
          <div className="contact-method-label">Délai de réponse</div>
          <div className="contact-method-val">Sous 24h ouvrées</div>
        </div>
      </div>

      {sent ? (
        <div className="contact-success">
          ✓ Message envoyé ! On vous répondra dans les 24h à l'adresse indiquée.
        </div>
      ) : (
        <>
          <div className="contact-form-title">Envoyer un message</div>
          <div className="field">
            <label>Votre email</label>
            <input type="email" placeholder="vous@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Sujet</label>
            <select className="contact-select" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">Choisir un sujet…</option>
              <option value="bug">Problème technique / bug</option>
              <option value="scan">Question sur une analyse</option>
              <option value="billing">Abonnement / facturation</option>
              <option value="suggestion">Suggestion d'amélioration</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div className="field">
            <label>Message</label>
            <textarea placeholder="Décrivez votre demande en détail…" value={message} onChange={e => setMessage(e.target.value)} style={{minHeight:120}} />
          </div>
          <button className="btn btn-primary btn-lg" style={{width:"100%"}} onClick={send} disabled={!email || !message}>
            Envoyer le message
          </button>
          <div style={{fontSize:11,color:"var(--ink-faint)",marginTop:12,textAlign:"center",fontWeight:300}}>
            En envoyant ce message, vous acceptez notre politique de confidentialité.
          </div>
        </>
      )}
    </div>
  );
}

// ─── PARRAINAGE ───────────────────────────────────────────────────────────────
function ReferralPage({ user, onBack, onSignup, showToast }) {
  const code = user ? getReferralCode(user) : null;
  const stats = user ? getReferralStats(user) : null;
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href.split("?")[0] + "?ref=" + code : "";

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const share = method => {
    const text = "J'utilise LegitWear pour vérifier l'authenticité de mes articles streetwear et luxe. Essaie avec mon code " + code + " et on gagne tous les deux des scans gratuits !";
    const eu = encodeURIComponent(url);
    const et = encodeURIComponent(text);
    if (method === "whatsapp") window.open("https://wa.me/?text=" + et, "_blank");
    if (method === "twitter") window.open("https://twitter.com/intent/tweet?text=" + et + "&url=" + eu, "_blank");
  };

  return (
    <div className="referral-page">
      <button className="back-btn" onClick={onBack} style={{marginBottom:32}}>← Retour</button>

      <div className="referral-hero">
        <div className="referral-hero-icon">🎁</div>
        <h1>Parraine tes amis,<br />gagne des <em>scans gratuits</em></h1>
        <p className="referral-hero-sub">Pour chaque ami qui s'inscrit avec ton code, vous gagnez tous les deux 5 scans bonus.</p>
      </div>

      <div className="referral-how">
        {[
          { n:"1", t:"Partage ton code", d:"Envoie ton code unique à tes amis acheteurs ou resellers." },
          { n:"2", t:"Ils s'inscrivent", d:"Ils créent un compte LegitWear avec ton code de parrainage." },
          { n:"3", t:"Vous gagnez tous les deux", d:"5 scans bonus crédités automatiquement sur vos comptes." },
        ].map(s => (
          <div className="referral-step" key={s.n}>
            <div className="referral-step-num">{s.n}</div>
            <div>
              <div className="referral-step-title">{s.t}</div>
              <div className="referral-step-desc">{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="referral-rewards">
        <div className="referral-reward">
          <div className="referral-reward-count">+5</div>
          <div className="referral-reward-label">Scans pour toi</div>
          <div className="referral-reward-desc">Par ami parrainé qui s'inscrit</div>
        </div>
        <div className="referral-reward">
          <div className="referral-reward-count">+5</div>
          <div className="referral-reward-label">Scans pour ton ami</div>
          <div className="referral-reward-desc">Dès son inscription avec ton code</div>
        </div>
      </div>

      {user ? (
        <>
          <div className="referral-stats">
            <div className="referral-stat">
              <div className="referral-stat-val">{stats.invited}</div>
              <div className="referral-stat-label">Invités</div>
            </div>
            <div className="referral-stat">
              <div className="referral-stat-val">{stats.joined}</div>
              <div className="referral-stat-label">Inscrits</div>
            </div>
            <div className="referral-stat">
              <div className="referral-stat-val">{stats.scansEarned}</div>
              <div className="referral-stat-label">Scans gagnés</div>
            </div>
          </div>

          <div className="referral-box">
            <div className="referral-box-title">Ton code de parrainage</div>
            <div className="referral-code-wrap">
              <div className="referral-code">{code}</div>
              <button className={"referral-copy-btn" + (copied ? " copied" : "")} onClick={copy}>
                {copied ? "Copié ✓" : "Copier"}
              </button>
            </div>
            <div className="referral-share-btns">
              <button className="referral-share-btn" onClick={() => share("whatsapp")}>💬 WhatsApp</button>
              <button className="referral-share-btn" onClick={() => share("twitter")}>𝕏 Twitter</button>
            </div>
          </div>

          <div style={{fontSize:11,color:"var(--ink-faint)",textAlign:"center",fontWeight:300,lineHeight:1.7}}>
            Les scans bonus sont crédités dès que ton filleul effectue son premier scan.<br/>
            Valable uniquement pour les nouveaux comptes.
          </div>
        </>
      ) : (
        <div className="referral-need-account">
          <div className="referral-need-account-title">Crée un compte pour parrainer</div>
          <div className="referral-need-account-sub">Tu dois être connecté pour accéder à ton code de parrainage personnel.</div>
          <button className="btn btn-primary btn-lg" onClick={onSignup}>Créer un compte gratuit</button>
        </div>
      )}
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ mode, onSuccess, onToggle, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setError("");
    if (!email || !password) return setError("Veuillez remplir tous les champs.");
    if (password.length < 6) return setError("Le mot de passe doit faire au moins 6 caractères.");
    const emailCheck = isValidEmail(email);
if (!emailCheck.valid) return setError(emailCheck.reason);
   setLoading(true);
if (mode === "signup") {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name || email.split("@")[0] } }
  });
  if (signUpError) { setError(signUpError.message); setLoading(false); return; }
  setError("");
  setLoading(false);
  onSuccess(email, true);
} else {
  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
if (signInError) {
  if (signInError.message.toLowerCase().includes("email not confirmed")) {
    setError("Merci de confirmer ton adresse email avant de te connecter (vérifie ta boîte mail).");
  } else {
    setError("Email ou mot de passe incorrect.");
  }
  setLoading(false);
  return;
}
  setSession(email);
  onSuccess(email, false);
  setLoading(false);
}
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-btn" onClick={onBack}>← Retour</button>
        <div className="auth-logo">LegitWear</div>
        <div className="auth-title">{mode === "signup" ? "Créer un compte" : "Bon retour"}</div>
        <div className="auth-sub">{mode === "signup" ? "Commencez à authentifier vos articles" : "Connectez-vous pour accéder à votre espace"}</div>
        {error && <div className="err">{error}</div>}
        {mode === "signup" && (
          <div className="field"><label>Prénom ou pseudo</label><input placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)} /></div>
        )}
        <div className="field"><label>Adresse email</label><input type="email" placeholder="vous@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="field" style={{marginBottom:24}}><label>Mot de passe</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} /></div>
        <button className="btn btn-primary" style={{width:"100%",padding:"12px"}} onClick={handle} disabled={loading}>
          {loading ? "…" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </button>
        <div className="auth-switch">
          {mode === "signup" ? <>Déjà un compte ? <span onClick={onToggle}>Connexion</span></> : <>Pas encore de compte ? <span onClick={onToggle}>S'inscrire</span></>}
        </div>
      </div>
    </div>
  );
}

// ─── RESULT ──────────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  const cls = result.verdict;
  const label = cls === "authentic" ? "Authentique" : cls === "fake" ? "Contrefaçon" : "Incertain";
  return (
    <div className="result-card">
      <div className={"result-header " + cls}>
        <div>
          <div className="result-brand">{result.brand}{result.product_type ? " — " + result.product_type : ""}</div>
          <div className={"verdict-pill " + cls}><span>●</span>{label}</div>
        </div>
        <div className="score-block">
          <div className={"score-num " + cls}>{result.score}</div>
          <div className="score-pct">% confiance</div>
        </div>
      </div>
      <div className="result-divider" />
      <div className="result-body">
        <p className="result-summary">{result.summary}</p>
        {result.issues && result.issues.length > 0 && (
          <>
            <div className="issues-label">Analyse détaillée</div>
            {result.issues.map((issue, i) => (
              <div className="issue-row" key={i}>
                <div className={"issue-dot " + issue.type} />
                <div><div className="issue-zone">{issue.zone}</div><div className="issue-desc">{issue.description}</div></div>
              </div>
            ))}
          </>
        )}
        {result.advice && <div className="advice-box"><strong>Conseil :</strong> {result.advice}</div>}
        <button className="pdf-btn" onClick={() => exportPDF(result)}>↓ Télécharger le rapport PDF</button>
      </div>
    </div>
  );
}

const LOAD_STEPS = ["Chargement des images…","Analyse du logo et typographies…","Vérification coutures et finitions…","Calcul du score de confiance…"];

function ScanTab({ userEmail }) {
  const [images, setImages] = useState([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  useEffect(() => {
    let t;
    if (loading) t = setInterval(() => setStep(s => (s + 1) % LOAD_STEPS.length), 2000);
    return () => clearInterval(t);
  }, [loading]);
  const addFiles = async files => {
    const arr = Array.from(files).slice(0, 6 - images.length);
    const converted = await Promise.all(arr.map(toBase64));
    setImages(p => [...p, ...converted].slice(0, 6));
  };
  const scan = async () => {
    if (!images.length) return setError("Ajoutez au moins une photo.");
    setError(""); setResult(null); setLoading(true); setStep(0);
    try {
      const res = await scanProduct(images, desc);
      setResult(res);
      addHistory(userEmail, { ...res, date: new Date().toISOString(), thumb: images[0]?.url });
    } catch(e) {
      setError("Erreur lors de l'analyse. Vérifiez votre connexion et votre solde API.");
    }
    setLoading(false);
  };
  const reset = () => { setImages([]); setDesc(""); setResult(null); setError(""); };
  if (loading) return (
    <div className="loading-wrap">
      <div className="loader" />
      <div className="loading-title">Analyse en cours</div>
      <div className="loading-step">{LOAD_STEPS[step]}</div>
    </div>
  );
  if (result) return (
    <>
      <ResultCard result={result} />
      <button className="btn btn-outline" style={{width:"100%",padding:"12px",marginTop:4}} onClick={reset}>← Nouvelle analyse</button>
    </>
  );
  return (
    <div className="scan-card">
      <div className="scan-label">Nouvelle analyse</div>
    <div className={"upload-zone" + (drag ? " drag" : "")}
  onDragOver={e => { e.preventDefault(); setDrag(true); }}
  onDragLeave={() => setDrag(false)}
  onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}>

        <input ref={ref} type="file" accept="image/*,image/heic,image/heif" multiple onChange={e => addFiles(e.target.files)} />
        <div className="upload-icon">↑</div>
        <div className="upload-title">Déposez vos photos ici</div>
        <div className="upload-hint">Logo, couture, étiquette, semelle — jusqu'à 6 photos</div>
      </div>
      {images.length > 0 && (
        <div className="preview-grid">
          {images.map((img, i) => (
            <div className="preview-img" key={i}>
              <img src={img.url} alt="" />
              <button className="preview-rm" onClick={e => { e.stopPropagation(); setImages(p => p.filter((_,j) => j !== i)); }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div className="field" style={{marginTop:20}}>
        <label>Description (optionnel)</label>
        <textarea placeholder="Ex : Nike Air Force 1 achetée sur Vinted, taille 42, prix 80€…" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      {error && <div className="err">{error}</div>}
      <button className="btn btn-primary btn-lg" style={{width:"100%",marginTop:16}} onClick={scan} disabled={!images.length}>
        {images.length ? "Analyser — " + images.length + " photo" + (images.length > 1 ? "s" : "") : "Ajoutez des photos"}
      </button>
    </div>
  );
}

function HistoryTab({ userEmail, onView }) {
  const history = getHistory(userEmail);
  if (!history.length) return (
    <div className="history-empty">
      <div className="history-empty-title">Aucune analyse pour l'instant</div>
      <div className="history-empty-sub">Vos scans apparaîtront ici après votre première analyse.</div>
    </div>
  );
  return (
    <div>
      {history.map((item, i) => (
        <div className="history-row" key={i} onClick={() => onView(item)}>
          {item.thumb ? <img className="history-thumb" src={item.thumb} alt="" /> : <div className="history-thumb" />}
          <div style={{flex:1,minWidth:0}}>
            <div className="history-brand">{item.brand}{item.product_type ? " — " + item.product_type : ""}</div>
            <div className="history-meta">{new Date(item.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})} · {item.score}% confiance</div>
          </div>
          <div className={"verdict-tag " + item.verdict}>
            {item.verdict === "authentic" ? "Authentique" : item.verdict === "fake" ? "Contrefaçon" : "Incertain"}
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ userEmail, onShare, onReferral }) {
  const [tab, setTab] = useState("scan");
  const [modal, setModal] = useState(null);
  const users = getUsers();
  const name = users[userEmail]?.name || "vous";
  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="dash-greeting">Bonjour, <em>{name}</em>.</div>
        <div className="dash-sub">Analysez un article ou consultez votre historique.</div>
      </div>
      <div className="tabs">
        <div className={"tab" + (tab === "scan" ? " active" : "")} onClick={() => setTab("scan")}>Analyser</div>
        <div className={"tab" + (tab === "history" ? " active" : "")} onClick={() => setTab("history")}>Historique</div>
        <div className={"tab" + (tab === "referral" ? " active" : "")} onClick={() => setTab("referral")}>🎁 Parrainer</div>
      </div>
      <div className="tab-content">
        {tab === "scan" && <ScanTab userEmail={userEmail} />}
        {tab === "history" && <HistoryTab userEmail={userEmail} onView={setModal} />}
        {tab === "referral" && <ReferralPage user={userEmail} onBack={() => setTab("scan")} onSignup={() => {}} showToast={() => {}} />}
      </div>
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-title">Résultat de l'analyse</div>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <ResultCard result={modal} />
              <div style={{fontSize:11,color:"var(--ink-faint)",marginTop:10}}>
                Analysé le {new Date(modal.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareModal({ onClose }) {
  const url = typeof window !== "undefined" ? window.location.href : "https://legitwear.app";
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const share = method => {
    const text = "LegitWear — Détecte les contrefaçons en secondes grâce à l'IA";
    const eu = encodeURIComponent(url);
    const et = encodeURIComponent(text);
    if (method === "twitter") window.open("https://twitter.com/intent/tweet?text=" + et + "&url=" + eu, "_blank");
    if (method === "whatsapp") window.open("https://wa.me/?text=" + et + "%20" + eu, "_blank");
    if (method === "native" && navigator.share) navigator.share({ title: "LegitWear", text, url });
    if (method === "sms") window.open("sms:?body=" + et + "%20" + eu);
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:400}} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-head-title">Partager LegitWear</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{fontSize:13,color:"var(--ink-soft)",marginBottom:18,fontWeight:300,lineHeight:1.6}}>Partage LegitWear avec tes amis resellers et acheteurs.</p>
          <div className="share-url-box">
            <div className="share-url">{url}</div>
            <button className={"share-copy-btn" + (copied ? " copied" : "")} onClick={copy}>{copied ? "Copié ✓" : "Copier"}</button>
          </div>
          <div className="share-methods">
            <button className="share-method" onClick={() => share("whatsapp")}><span className="share-method-icon">💬</span>WhatsApp</button>
            <button className="share-method" onClick={() => share("twitter")}><span className="share-method-icon">𝕏</span>Twitter</button>
            <button className="share-method" onClick={() => share("sms")}><span className="share-method-icon">📱</span>SMS</button>
            <button className="share-method" onClick={() => share("native")}><span className="share-method-icon">⬆️</span>Partager</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CGUPage({ onBack }) {
  return (
    <div className="cgu-page">
      <button className="back-btn" onClick={onBack} style={{marginBottom:32}}>← Retour</button>
      <div className="cgu-title">Conditions Générales d'Utilisation</div>
      <div className="cgu-date">Dernière mise à jour : Juin 2026</div>
      <div className="cgu-section">
        <div className="cgu-h2">1. Présentation du service</div>
        <p className="cgu-p"><strong>LegitWear</strong> est un service d'aide à l'authentification de vêtements, sneakers et accessoires de mode basé sur l'intelligence artificielle.</p>
        <p className="cgu-p">LegitWear n'est affilié à aucune marque mentionnée sur le site. Toutes les marques citées appartiennent à leurs propriétaires respectifs.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">2. Acceptation des conditions</div>
        <p className="cgu-p">En utilisant LegitWear, vous acceptez pleinement et sans réserve les présentes CGU.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">3. Limitation de responsabilité</div>
        <p className="cgu-p"><strong>Service indicatif uniquement.</strong> Les analyses sont générées par IA et ont un caractère purement indicatif et non contractuel.</p>
        <p className="cgu-p">LegitWear et son créateur ne peuvent en aucun cas être tenus responsables des décisions d'achat ou de vente prises sur la base des analyses fournies.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">4. Propriété intellectuelle</div>
        <p className="cgu-p">L'ensemble des éléments du site est protégé par le droit d'auteur. © 2026 LegitWear — Tous droits réservés.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">5. Données personnelles</div>
        <p className="cgu-p">Les données collectées sont utilisées uniquement pour le fonctionnement du service. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">6. Photos uploadées</div>
        <p className="cgu-p">Les photos sont utilisées uniquement pour l'analyse IA et ne sont pas conservées de manière permanente. Vous conservez l'entière propriété de vos photos.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">7. Abonnements et paiements</div>
        <p className="cgu-p">Les abonnements sont gérés par <strong>Stripe</strong>. Les abonnements sont renouvelés automatiquement. La résiliation peut être effectuée à tout moment.</p>
      </div>
      <div className="cgu-section">
        <div className="cgu-h2">8. Droit applicable</div>
        <p className="cgu-p">Les présentes CGU sont soumises au droit français.</p>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
// Ajoute ce composant dans ton App.jsx, juste avant le export default function App()

function SuccessPage({ onDashboard }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      minHeight:"100vh",background:"var(--ink)",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"40px 24px",position:"relative",overflow:"hidden"
    }}>
      {/* Glow background */}
      <div style={{
        position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        width:600,height:600,background:"radial-gradient(ellipse,rgba(196,168,130,0.08) 0%,transparent 70%)",
        pointerEvents:"none"
      }}/>

      {/* Cercle animé */}
      <div style={{
        width:96,height:96,borderRadius:"50%",border:"1px solid rgba(196,168,130,0.3)",
        display:"flex",alignItems:"center",justifyContent:"center",marginBottom:32,
        position:"relative",
        opacity: step >= 1 ? 1 : 0,
        transform: step >= 1 ? "scale(1)" : "scale(0.5)",
        transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{
          width:72,height:72,borderRadius:"50%",background:"rgba(61,122,92,0.15)",
          border:"1px solid rgba(61,122,92,0.4)",display:"flex",alignItems:"center",justifyContent:"center"
        }}>
          <span style={{fontSize:28}}>✓</span>
        </div>
        {/* Ring animé */}
        <div style={{
          position:"absolute",inset:-8,borderRadius:"50%",
          border:"1px solid rgba(196,168,130,0.15)",
          animation: step >= 1 ? "ringPulse 2s ease-in-out infinite" : "none"
        }}/>
      </div>

      {/* Texte principal */}
      <div style={{
        textAlign:"center",maxWidth:480,
        opacity: step >= 2 ? 1 : 0,
        transform: step >= 2 ? "translateY(0)" : "translateY(20px)",
        transition:"all 0.6s ease",
      }}>
        <div style={{
          fontFamily:"'Space Grotesk',sans-serif",fontSize:10,letterSpacing:"0.2em",
          textTransform:"uppercase",color:"var(--accent2)",marginBottom:16,fontWeight:400
        }}>
          Bienvenue dans la famille
        </div>
        <h1 style={{
          fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:800,
          color:"var(--cream)",lineHeight:1.02,letterSpacing:"-0.03em",marginBottom:16
        }}>
          Ton essai gratuit<br />est <em style={{fontStyle:"italic",color:"var(--accent)"}}>activé.</em>
        </h1>
        <p style={{
          fontSize:14,color:"rgba(247,244,239,0.5)",lineHeight:1.7,fontWeight:300,marginBottom:40
        }}>
          7 jours pour authentifier autant d'articles que tu veux.<br />
          Aucun débit avant la fin de la période d'essai.
        </p>
      </div>

      {/* Cards features */}
      <div style={{
        display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,width:"100%",maxWidth:480,marginBottom:40,
        opacity: step >= 3 ? 1 : 0,
        transform: step >= 3 ? "translateY(0)" : "translateY(20px)",
        transition:"all 0.6s ease",
      }}>
        {[
          { icon:"🔍", label:"Scans illimités", sub:"pendant 7 jours" },
          { icon:"⚡", label:"Résultats", sub:"en moins de 10s" },
          { icon:"📄", label:"Rapports PDF", sub:"exportables" },
        ].map((f,i) => (
          <div key={i} style={{
            background:"rgba(247,244,239,0.04)",border:"1px solid rgba(247,244,239,0.08)",
            borderRadius:6,padding:"16px 12px",textAlign:"center"
          }}>
            <div style={{fontSize:20,marginBottom:8}}>{f.icon}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"var(--cream)",marginBottom:3}}>{f.label}</div>
            <div style={{fontSize:10,color:"rgba(247,244,239,0.35)",fontWeight:300}}>{f.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        display:"flex",flexDirection:"column",alignItems:"center",gap:12,
        opacity: step >= 3 ? 1 : 0,
        transform: step >= 3 ? "translateY(0)" : "translateY(20px)",
        transition:"all 0.6s 0.1s ease",
      }}>
        <button
          onClick={onDashboard}
          style={{
            fontFamily:"'Space Grotesk',sans-serif",fontSize:11,fontWeight:600,
            letterSpacing:"0.16em",textTransform:"uppercase",
            padding:"13px 36px",borderRadius:3,cursor:"pointer",border:"none",
            background:"linear-gradient(135deg,var(--accent),var(--accent2))",
            color:"var(--ink)",transition:"all 0.25s",boxShadow:"0 4px 24px rgba(196,168,130,0.25)"
          }}
          onMouseOver={e => e.currentTarget.style.transform="translateY(-2px)"}
          onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}
        >
          Lancer mon premier scan →
        </button>
        <div style={{fontSize:11,color:"rgba(247,244,239,0.25)",fontWeight:300}}>
          Un email de confirmation a été envoyé à ton adresse
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%,100%{transform:scale(1);opacity:0.4}
          50%{transform:scale(1.15);opacity:0.1}
        }
      `}</style>
    </div>
  );
}
const DISPOSABLE_DOMAINS = ["test.com","test.fr","example.com","mailinator.com","yopmail.com","tempmail.com","guerrillamail.com","10minutemail.com","fakeinbox.com","trashmail.com"];
const FAKE_PATTERNS = ["test","azerty","qwerty","admin","user","abc","azertyuiop","123456","fake","exemple","example","aaa","sample","demo"];

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return { valid: false, reason: "Format d'email invalide." };
  const [localPart, domainFull] = email.toLowerCase().split("@");
  const domain = domainFull;
  const domainName = domain.split(".")[0];
  if (DISPOSABLE_DOMAINS.includes(domain)) return { valid: false, reason: "Merci d'utiliser une adresse email réelle." };
  if (/^(.)\1*$/.test(localPart) && localPart.length > 1) return { valid: false, reason: "Adresse email suspecte." };
  if (FAKE_PATTERNS.includes(localPart) || FAKE_PATTERNS.includes(domainName)) return { valid: false, reason: "Merci d'utiliser une adresse email réelle." };
  if (localPart === domainName) return { valid: false, reason: "Merci d'utiliser une adresse email réelle." };
  return { valid: true };
}
export default function App() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(getSession);
  const [showShare, setShowShare] = useState(false);const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  useEffect(() => {
  if (typeof window !== "undefined" && window.location.search.includes("session_id")) {
    setPage("success");
  } else if (user) {
    setPage("dashboard");
  }
}, []);
  const showToastMsg = msg => { setToast(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), 2500); };
  const goAuth = mode => { setAuthMode(mode); setPage("auth"); };
  const onAuthSuccess = email => { setUser(email); setPage("dashboard"); showToastMsg("Connecté 👋"); };
  const onLogout = () => { clearSession(); setUser(null); setPage("landing"); showToastMsg("Déconnecté."); };
  const onSwitchAccount = () => { clearSession(); setUser(null); setAuthMode("login"); setPage("auth"); };
 const PRICE_IDS = {
  starter: import.meta.env.VITE_STRIPE_STARTER_PRICE,
  pro: import.meta.env.VITE_STRIPE_PRO_PRICE,
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE,
};

const handleCheckout = async plan => {
  if (!user) { setAuthMode("signup"); setPage("auth"); return; }
  showToastMsg("Redirection vers le paiement…");
 try {
  const { data: { session: authSession } } = await supabase.auth.getSession();
  const userId = authSession?.user?.id;

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId: PRICE_IDS[plan], email: user, userId }),
  });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else showToastMsg("Erreur paiement, réessaie.");
  } catch(e) {
    showToastMsg("Erreur paiement, réessaie.");
  }
};
  const onHome = () => setPage("landing");

  const navProps = {
    user, onLogin: () => goAuth("login"), onSignup: () => goAuth("signup"),
    onLogout, onDashboard: () => setPage("dashboard"), onHome,
    onShare: () => setShowShare(true), onSwitchAccount,
    onHow: () => setPage("how"), onContact: () => setPage("contact"),
    onReferral: () => setPage("referral"),
  };

  return (
    <>
      <style>{STYLES}</style>
      <Navbar {...navProps} />
      {page === "landing" && <Landing onLogin={() => goAuth("login")} onSignup={() => goAuth("signup")} onShare={() => setShowShare(true)} onCheckout={handleCheckout} onCGU={() => setPage("cgu")} onHow={() => setPage("how")} onContact={() => setPage("contact")} />}
      {page === "how" && <HowPage onBack={onHome} onSignup={() => goAuth("signup")} />}
      {page === "contact" && <ContactPage onBack={onHome} />}
      {page === "referral" && <ReferralPage user={user} onBack={onHome} onSignup={() => goAuth("signup")} showToast={showToastMsg} />}
      {page === "auth" && <AuthPage mode={authMode} onSuccess={onAuthSuccess} onToggle={() => setAuthMode(m => m === "login" ? "signup" : "login")} onBack={() => setPage(user ? "dashboard" : "landing")} />}
      {page === "dashboard" && user && <Dashboard userEmail={user} onShare={() => setShowShare(true)} onReferral={() => setPage("referral")} />}
     {page === "success" && <SuccessPage onDashboard={() => { setPage("dashboard"); }} />} {page === "cgu" && <CGUPage onBack={onHome} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
      <div className={"toast" + (toastVisible ? " show" : "")}>{toast}</div>
    </>
  );
}
