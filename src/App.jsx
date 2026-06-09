import { useState, useEffect, useCallback, useRef } from "react";

// ── FIREBASE CONFIG ───────────────────────────────────────────────────────────
// Instruções: substitua os valores abaixo com as suas credenciais do Firebase
// Veja o guia de configuração incluído no arquivo de instruções
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBgjUXCdX54VhFPzhPaxqYiQTeOs2npYRk",
  authDomain: "studio-val-pinheiro.firebaseapp.com",
  projectId: "studio-val-pinheiro",
  storageBucket: "studio-val-pinheiro.firebasestorage.app",
  messagingSenderId: "446821665199",
  appId: "1:446821665199:web:a2da6cabec1c8cbb4e075a",
};

// ── PALETA & ESTILOS ──────────────────────────────────────────────────────────
const C = {
  cream: "#FAF6EE", gold: "#C8973A", goldLight: "#E8C97A", goldPale: "#F5E9C8",
  brown: "#5C3A1E", brownLight: "#8B5E3C", rose: "#D4826A", rosePale: "#F9EDE8",
  white: "#FFFFFF", gray: "#9E8E7E", grayLight: "#EDE8E0", success: "#7BAF7B", text: "#3A2A1A",
};

const S = {
  app: { minHeight:"100vh", background:`linear-gradient(160deg,${C.cream} 0%,#F0EAD8 100%)`, fontFamily:"'Georgia','Times New Roman',serif", color:C.text, maxWidth:480, margin:"0 auto", position:"relative" },
  header: { background:`linear-gradient(135deg,${C.brown} 0%,${C.brownLight} 100%)`, padding:"20px 20px 16px", color:C.cream, textAlign:"center", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(92,58,30,0.3)" },
  logoTitle: { fontSize:20, letterSpacing:3, fontWeight:"normal", margin:0, color:C.goldLight, fontStyle:"italic" },
  logoSub: { fontSize:10, letterSpacing:4, color:C.cream, opacity:0.8, margin:"4px 0 0", textTransform:"uppercase" },
  nav: { display:"flex", background:C.brown, borderTop:`1px solid rgba(200,151,58,0.3)` },
  navBtn:(active)=>({ flex:1, padding:"10px 4px", border:"none", background:active?`rgba(200,151,58,0.25)`:"transparent", color:active?C.goldLight:"rgba(250,246,238,0.6)", fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderBottom:active?`2px solid ${C.gold}`:"2px solid transparent", transition:"all 0.2s", fontFamily:"inherit" }),
  card: { background:C.white, borderRadius:16, padding:20, margin:"16px 16px 0", boxShadow:"0 2px 16px rgba(92,58,30,0.08)", border:`1px solid ${C.grayLight}` },
  cardGold: { background:`linear-gradient(135deg,${C.brown} 0%,${C.brownLight} 100%)`, borderRadius:16, padding:20, margin:"16px 16px 0", boxShadow:"0 4px 20px rgba(92,58,30,0.2)" },
  sectionTitle: { fontSize:11, letterSpacing:3, textTransform:"uppercase", color:C.gold, margin:"0 0 14px", fontStyle:"normal" },
  bigValue: { fontSize:36, fontWeight:"bold", color:C.goldLight, margin:0, lineHeight:1, fontStyle:"italic" },
  pill:(active)=>({ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${active?C.gold:C.grayLight}`, background:active?C.goldPale:C.white, color:active?C.brown:C.gray, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", whiteSpace:"nowrap" }),
  btn: {
    primary: { background:`linear-gradient(135deg,${C.gold} 0%,${C.brownLight} 100%)`, color:C.white, border:"none", borderRadius:12, padding:"14px 28px", fontSize:14, letterSpacing:1, cursor:"pointer", fontFamily:"inherit", fontStyle:"italic", width:"100%", boxShadow:"0 4px 16px rgba(200,151,58,0.4)" },
    ghost: { background:"transparent", color:C.brownLight, border:`1.5px solid ${C.grayLight}`, borderRadius:12, padding:"12px 20px", fontSize:13, cursor:"pointer", fontFamily:"inherit" },
    google: { background:C.white, color:"#444", border:"1.5px solid #DDD", borderRadius:12, padding:"14px 20px", fontSize:14, cursor:"pointer", fontFamily:"inherit", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  },
  input: { width:"100%", padding:"12px 14px", borderRadius:10, border:`1.5px solid ${C.grayLight}`, background:C.cream, fontSize:15, fontFamily:"inherit", color:C.text, outline:"none", boxSizing:"border-box" },
  label: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:C.gray, display:"block", marginBottom:6 },
  divider: { height:1, background:C.grayLight, margin:"16px 0" },
};

// ── SERVIÇOS PRÉ-CADASTRADOS ─────────────────────────────────────────────────
const SERVICOS_PADRAO = [
  // Básicos
  { id:"emg_mao", nome:"Esmaltação em Gel – Mão", preco:70, categoria:"Básicos" },
  { id:"emg_pe", nome:"Esmaltação em Gel – Pé", preco:80, categoria:"Básicos" },
  { id:"bdg_sem", nome:"Banho de Gel SEM esmaltação", preco:100, categoria:"Básicos" },
  { id:"bdg_com", nome:"Banho de Gel COM esmaltação", preco:135, categoria:"Básicos" },
  { id:"bli_sem", nome:"Blindagem SEM Esmaltação", preco:80, categoria:"Básicos" },
  { id:"bli_com", nome:"Blindagem COM Esmaltação", preco:115, categoria:"Básicos" },
  // Alongamento
  { id:"alo_sem", nome:"Alongamento SEM esmaltação", preco:180, categoria:"Alongamento em Gel" },
  { id:"alo_com", nome:"Alongamento COM esmaltação", preco:215, categoria:"Alongamento em Gel" },
  { id:"man_30", nome:"Manutenção até 30 dias", preco:120, categoria:"Alongamento em Gel" },
  { id:"man_pos", nome:"Manutenção após 30 dias", preco:180, categoria:"Alongamento em Gel" },
  { id:"rem_alo", nome:"Remoção de alongamento", preco:50, categoria:"Alongamento em Gel" },
  // Extras
  { id:"dec_par", nome:"Decoração (par de unhas)", preco:10, categoria:"Extras" },
  { id:"dec_fra", nome:"Decoração Francesinha", preco:10, categoria:"Extras" },
  { id:"rem_esm", nome:"Remoção de esmaltação", preco:20, categoria:"Extras" },
  { id:"poc_cro", nome:"Pó cromado (10 unhas)", preco:10, categoria:"Extras" },
  { id:"rec_unh", nome:"Reconstrução de unha (un.)", preco:20, categoria:"Extras" },
  { id:"cut_mao", nome:"Cutilagem com lixamento mão", preco:25, categoria:"Extras" },
  { id:"cut_pe", nome:"Cutilagem com lixamento pé", preco:30, categoria:"Extras" },
  // Cursos — valores à vista
  { id:"cur_nail", nome:"Curso Nail Designer Profissional", preco:2499, categoria:"Cursos", precoEditavel:true },
  { id:"cur_man",  nome:"Curso Manicure Profissional",      preco:1799, categoria:"Cursos", precoEditavel:true },
  { id:"cur_esm",  nome:"Curso Esmaltação em Gel",          preco:999,  categoria:"Cursos", precoEditavel:true },
  { id:"cur_mol",  nome:"Curso Alongamento Molde F1",        preco:1499, categoria:"Cursos", precoEditavel:true },
  { id:"cur_bli",  nome:"Curso Blindagem",                   preco:999,  categoria:"Cursos", precoEditavel:true },
  { id:"cur_cut",  nome:"Curso Cutilagem Combinada",         preco:599,  categoria:"Cursos", precoEditavel:true },
  { id:"outro", nome:"Outro / Avulso", preco:0, categoria:"Outros", precoLivre:true },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (v) => `R$ ${Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
const today = () => new Date().toISOString().slice(0,10);
const toDate = (s) => new Date(s+"T12:00:00");
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const save = useCallback((v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key]);
  return [val, save];
}

// ── GOOGLE ICON ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

// ── TELA DE LOGIN ─────────────────────────────────────────────────────────────
function TelaLogin({ onLogin, firebaseReady, firebaseError }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function entrarComGoogle() {
    if (!firebaseReady) {
      setErro("Firebase não configurado. Configure as credenciais e recarregue.");
      return;
    }
    setLoading(true);
    setErro("");
    try {
      await onLogin();
    } catch(e) {
      setErro("Erro ao entrar com Google: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.cream} 0%,#F0EAD8 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Georgia',serif" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ width:80, height:80, background:`linear-gradient(135deg,${C.brown},${C.brownLight})`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(92,58,30,0.3)" }}>
          <span style={{ fontSize:32 }}>💅</span>
        </div>
        <h1 style={{ fontSize:28, fontStyle:"italic", color:C.brown, margin:"0 0 8px", fontWeight:"normal" }}>Studio Val Pinheiro</h1>
        <p style={{ fontSize:11, letterSpacing:4, textTransform:"uppercase", color:C.gray, margin:0 }}>Controle de Faturamento</p>
      </div>

      <div style={{ background:C.white, borderRadius:20, padding:32, width:"100%", maxWidth:360, boxShadow:"0 8px 32px rgba(92,58,30,0.12)" }}>
        <p style={{ textAlign:"center", color:C.gray, fontSize:14, lineHeight:1.7, marginTop:0, marginBottom:28 }}>
          Entre com sua conta Google para salvar todos os seus dados na nuvem com segurança.
        </p>

        {firebaseError && (
          <div style={{ background:"#FFF3E0", border:"1px solid #FFB74D", borderRadius:10, padding:14, marginBottom:20, fontSize:13, color:"#E65100" }}>
            ⚠️ {firebaseError}
          </div>
        )}

        <button style={S.btn.google} onClick={entrarComGoogle} disabled={loading}>
          {loading ? <span>Entrando...</span> : <><GoogleIcon /> Entrar com Google</>}
        </button>

        {erro && <p style={{ color:"#C0392B", fontSize:13, textAlign:"center", marginTop:16 }}>{erro}</p>}

        <div style={{ marginTop:24, padding:16, background:C.goldPale, borderRadius:10 }}>
          <p style={{ margin:0, fontSize:11, color:C.brownLight, lineHeight:1.6, textAlign:"center" }}>
            🔒 Seus dados ficam salvos na nuvem do Google (Firebase) e nunca se perdem.
          </p>
        </div>
      </div>

      <p style={{ marginTop:32, fontSize:11, color:C.gray, textAlign:"center", lineHeight:1.6, maxWidth:320 }}>
        ⚙️ Para ativar o login com Google, configure as credenciais do Firebase seguindo as instruções do arquivo README incluso.
      </p>
    </div>
  );
}

// ── DEMO MODE (sem Firebase) ──────────────────────────────────────────────────
function useDemoStorage(key, initial) {
  return useLocalStorage(key, initial);
}

// ══════════════════════════════════════════════════════════════════════════════
// ABA INÍCIO
// ══════════════════════════════════════════════════════════════════════════════
function AbaInicio({ atendimentos, salvar, servicos, usuario }) {
  const [etapa, setEtapa] = useState(1);
  const [selServico, setSelServico] = useState(null);
  const [precoEditado, setPrecoEditado] = useState("");
  const [obs, setObs] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [cat, setCat] = useState("Básicos");

  const cats = [...new Set(servicos.map(s => s.categoria))];
  const hoje = today();
  const atendHoje = atendimentos.filter(a => a.data === hoje);
  const totalHoje = atendHoje.reduce((s,a) => s+a.valor, 0);

  function selecionarServico(sv) {
    setSelServico(sv);
    setPrecoEditado(sv.preco === 0 ? "" : String(sv.preco));
    setEtapa(2);
  }

  function confirmar() {
    const valor = parseFloat(precoEditado.replace(",","."));
    if (!valor || valor <= 0) { alert("Informe um valor válido."); return; }
    const novo = { id:Date.now(), data:hoje, servicoId:selServico.id, servicoNome:selServico.nome, valor, cliente:nomeCliente.trim(), obs:obs.trim(), categoria:selServico.categoria };
    salvar([novo, ...atendimentos]);
    setSucesso(true);
    setTimeout(() => { setSucesso(false); setEtapa(1); setSelServico(null); setPrecoEditado(""); setObs(""); setNomeCliente(""); }, 2000);
  }

  if (sucesso) return (
    <div style={{ padding:60, textAlign:"center" }}>
      <div style={{ fontSize:72, marginBottom:16 }}>✨</div>
      <p style={{ color:C.success, fontSize:22, fontStyle:"italic", margin:"0 0 8px" }}>Registrado!</p>
      <p style={{ color:C.gold, fontSize:20 }}>{fmt(parseFloat(precoEditado.replace(",",".")))}</p>
      <p style={{ color:C.gray, fontSize:13 }}>{selServico?.nome}</p>
    </div>
  );

  return (
    <div style={{ paddingBottom:100 }}>
      {/* Card do dia */}
      <div style={S.cardGold}>
        <p style={{ ...S.sectionTitle, color:C.goldPale }}>
          Hoje · {new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
        </p>
        {usuario && <p style={{ color:C.goldPale, fontSize:11, margin:"-8px 0 12px", letterSpacing:1 }}>☁️ {usuario.email}</p>}
        <p style={S.bigValue}>{fmt(totalHoje)}</p>
        <div style={{ display:"flex", gap:24, marginTop:12 }}>
          <div>
            <p style={{ margin:0, color:C.goldPale, fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>Atendimentos</p>
            <p style={{ margin:0, color:C.cream, fontSize:24, fontStyle:"italic" }}>{atendHoje.length}</p>
          </div>
          <div>
            <p style={{ margin:0, color:C.goldPale, fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>Ticket médio</p>
            <p style={{ margin:0, color:C.cream, fontSize:24, fontStyle:"italic" }}>{atendHoje.length ? fmt(totalHoje/atendHoje.length) : "–"}</p>
          </div>
        </div>
      </div>

      {etapa === 1 && (
        <>
          <div style={{ ...S.card, paddingBottom:12 }}>
            <p style={S.sectionTitle}>Novo atendimento</p>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8 }}>
              {cats.map(c => <button key={c} style={S.pill(cat===c)} onClick={()=>setCat(c)}>{c}</button>)}
            </div>
          </div>
          <div style={{ ...S.card, paddingTop:12 }}>
            {servicos.filter(s=>s.categoria===cat).map(sv => (
              <button key={sv.id} onClick={()=>selecionarServico(sv)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"13px 0", background:"none", border:"none", borderBottom:`1px solid ${C.grayLight}`, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                <span style={{ color:C.text, fontSize:14 }}>{sv.nome}</span>
                <span style={{ color:sv.precoLivre?C.gray:C.gold, fontSize:14, fontStyle:"italic", minWidth:80, textAlign:"right" }}>
                  {sv.precoLivre ? "variável" : sv.precoEditavel ? `${fmt(sv.preco)} ✎` : fmt(sv.preco)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {etapa === 2 && selServico && (
        <div style={S.card}>
          <button onClick={()=>setEtapa(1)} style={{ ...S.btn.ghost, marginBottom:16, width:"auto", padding:"8px 16px", fontSize:12 }}>← Voltar</button>
          <p style={S.sectionTitle}>Confirmar atendimento</p>
          <p style={{ fontStyle:"italic", fontSize:17, color:C.brown, margin:"0 0 6px" }}>{selServico.nome}</p>
          {selServico.categoria === "Cursos" && <p style={{ fontSize:11, color:C.gray, margin:"0 0 20px" }}>Ajuste o valor conforme a forma de pagamento (à vista / parcelado)</p>}

          <label style={S.label}>Valor (R$)</label>
          <input style={{ ...S.input, fontSize:22, color:C.gold, fontStyle:"italic", marginBottom:16 }} type="number" value={precoEditado} onChange={e=>setPrecoEditado(e.target.value)} placeholder="0,00" inputMode="decimal" autoFocus />

          <label style={S.label}>Cliente (opcional)</label>
          <input style={{ ...S.input, marginBottom:16 }} value={nomeCliente} onChange={e=>setNomeCliente(e.target.value)} placeholder="Nome da cliente / aluna" />

          <label style={S.label}>Observação (opcional)</label>
          <input style={{ ...S.input, marginBottom:24 }} value={obs} onChange={e=>setObs(e.target.value)} placeholder="Ex: parcelado em 12x, nail art extra..." />

          <button style={S.btn.primary} onClick={confirmar}>✓ Registrar atendimento</button>
        </div>
      )}

      {atendHoje.length > 0 && etapa === 1 && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Atendimentos de hoje</p>
          {atendHoje.map(a => (
            <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"10px 0", borderBottom:`1px solid ${C.grayLight}` }}>
              <div>
                <p style={{ margin:0, fontSize:13, color:C.text }}>{a.servicoNome}</p>
                {a.cliente && <p style={{ margin:"2px 0 0", fontSize:11, color:C.gray }}>{a.cliente}</p>}
              </div>
              <span style={{ color:C.gold, fontSize:15, fontStyle:"italic" }}>{fmt(a.valor)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ABA CALENDÁRIO
// ══════════════════════════════════════════════════════════════════════════════
function AbaCalendario({ atendimentos }) {
  const [mesAtual, setMesAtual] = useState(()=>today().slice(0,7));
  const [diaSel, setDiaSel] = useState(today());
  const [ano, mes] = mesAtual.split("-").map(Number);
  const primeiroDia = new Date(ano,mes-1,1).getDay();
  const diasNoMes = new Date(ano,mes,0).getDate();

  function totalDia(d) { return atendimentos.filter(a=>a.data===d).reduce((s,a)=>s+a.valor,0); }
  const atendDiaSel = atendimentos.filter(a=>a.data===diaSel);
  const totalDiaSel = atendDiaSel.reduce((s,a)=>s+a.valor,0);

  function navMes(delta) {
    const d = new Date(ano,mes-1+delta,1);
    const v = d.toISOString().slice(0,7);
    setMesAtual(v);
    setDiaSel(v+"-01");
  }

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={S.card}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <button onClick={()=>navMes(-1)} style={{ ...S.btn.ghost, padding:"6px 14px", fontSize:20 }}>‹</button>
          <span style={{ fontStyle:"italic", fontSize:17, color:C.brown }}>{MESES[mes-1]} {ano}</span>
          <button onClick={()=>navMes(1)} style={{ ...S.btn.ghost, padding:"6px 14px", fontSize:20 }}>›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
          {DIAS_SEMANA.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, color:C.gray, letterSpacing:1, padding:"4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
          {Array.from({length:primeiroDia}).map((_,i)=><div key={"e"+i}/>)}
          {Array.from({length:diasNoMes},(_,i)=>{
            const dia = i+1;
            const dStr = `${ano}-${String(mes).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
            const total = totalDia(dStr);
            const isSelected = dStr===diaSel;
            const isToday = dStr===today();
            return (
              <button key={dia} onClick={()=>setDiaSel(dStr)} style={{ background:isSelected?C.gold:total>0?C.goldPale:"transparent", border:isToday?`2px solid ${C.gold}`:"2px solid transparent", borderRadius:8, padding:"6px 2px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", minHeight:44, transition:"all 0.15s" }}>
                <span style={{ fontSize:13, color:isSelected?C.white:C.text, fontWeight:isToday?"bold":"normal" }}>{dia}</span>
                {total>0 && <span style={{ fontSize:8, color:isSelected?C.goldPale:C.brownLight }}>{fmt(total).replace("R$ ","").replace(",00","")}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={S.card}>
        <p style={S.sectionTitle}>{toDate(diaSel).toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
        {atendDiaSel.length===0
          ? <p style={{ color:C.gray, fontStyle:"italic", fontSize:14 }}>Nenhum atendimento neste dia.</p>
          : <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ color:C.gray, fontSize:13 }}>{atendDiaSel.length} atendimento{atendDiaSel.length>1?"s":""}</span>
              <span style={{ color:C.gold, fontSize:17, fontStyle:"italic" }}>{fmt(totalDiaSel)}</span>
            </div>
            {atendDiaSel.map(a=>(
              <div key={a.id} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.grayLight}` }}>
                <div>
                  <p style={{ margin:0, fontSize:13 }}>{a.servicoNome}</p>
                  {a.cliente && <p style={{ margin:"2px 0 0", fontSize:11, color:C.gray }}>{a.cliente}</p>}
                </div>
                <span style={{ color:C.gold, fontStyle:"italic" }}>{fmt(a.valor)}</span>
              </div>
            ))}
          </>
        }
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ABA RELATÓRIOS
// ══════════════════════════════════════════════════════════════════════════════
function AbaRelatorios({ atendimentos }) {
  const [periodo, setPeriodo] = useState("mes");
  const [mesSel, setMesSel] = useState(today().slice(0,7));
  const [anoSel, setAnoSel] = useState(String(new Date().getFullYear()));

  function filtrar(inicio,fim) { return atendimentos.filter(a=>a.data>=inicio&&a.data<=fim); }

  let dados = [];
  let label = "";
  if (periodo==="semana") {
    const d = new Date(); const day=d.getDay(); const mon=new Date(d); mon.setDate(d.getDate()-(day===0?6:day-1));
    const fim=new Date(mon); fim.setDate(mon.getDate()+6);
    const i=mon.toISOString().slice(0,10), f=fim.toISOString().slice(0,10);
    dados=filtrar(i,f);
    label=`${toDate(i).toLocaleDateString("pt-BR",{day:"numeric",month:"short"})} – ${toDate(f).toLocaleDateString("pt-BR",{day:"numeric",month:"short"})}`;
  } else if (periodo==="mes") {
    const [a,m]=mesSel.split("-");
    const inicio=`${mesSel}-01`, fim=`${mesSel}-${new Date(Number(a),Number(m),0).getDate().toString().padStart(2,"0")}`;
    dados=filtrar(inicio,fim); label=`${MESES[Number(m)-1]} ${a}`;
  } else {
    dados=atendimentos.filter(a=>a.data.startsWith(anoSel)); label=anoSel;
  }

  const total=dados.reduce((s,a)=>s+a.valor,0);
  const count=dados.length;
  const ticket=count?total/count:0;

  const servicoCount={};
  dados.forEach(a=>{ servicoCount[a.servicoNome]=(servicoCount[a.servicoNome]||0)+1; });
  const rankServicos=Object.entries(servicoCount).sort((x,y)=>y[1]-x[1]).slice(0,5);

  const porDia={};
  dados.forEach(a=>{ porDia[a.data]=(porDia[a.data]||0)+a.valor; });
  const melhorDia=Object.entries(porDia).sort((x,y)=>y[1]-x[1])[0];

  const porMes={};
  atendimentos.filter(a=>a.data.startsWith(anoSel)).forEach(a=>{ const m=a.data.slice(0,7); porMes[m]=(porMes[m]||0)+a.valor; });
  const melhorMes=Object.entries(porMes).sort((x,y)=>y[1]-x[1])[0];

  const mesesAno=Array.from({length:12},(_,i)=>`${anoSel}-${String(i+1).padStart(2,"0")}`);
  const maxMes=Math.max(...mesesAno.map(m=>porMes[m]||0),1);

  const anos=[...new Set(atendimentos.map(a=>a.data.slice(0,4)))].sort().reverse();
  if(!anos.includes(String(new Date().getFullYear()))) anos.unshift(String(new Date().getFullYear()));

  // Faturamento por categoria
  const porCat={};
  dados.forEach(a=>{ const cat=a.categoria||"Outros"; porCat[cat]=(porCat[cat]||0)+a.valor; });
  const rankCat=Object.entries(porCat).sort((x,y)=>y[1]-x[1]);

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={S.card}>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {["semana","mes","ano"].map(p=>(
            <button key={p} style={S.pill(periodo===p)} onClick={()=>setPeriodo(p)}>{p==="semana"?"Semana":p==="mes"?"Mês":"Ano"}</button>
          ))}
        </div>
        {periodo==="mes" && (
          <select style={{ ...S.input, marginBottom:0 }} value={mesSel} onChange={e=>setMesSel(e.target.value)}>
            {Array.from({length:36},(_,i)=>{ const d=new Date(); d.setMonth(d.getMonth()-i); const v=d.toISOString().slice(0,7); const [a,m]=v.split("-"); return <option key={v} value={v}>{MESES[Number(m)-1]} {a}</option>; })}
          </select>
        )}
        {periodo==="ano" && (
          <select style={{ ...S.input, marginBottom:0 }} value={anoSel} onChange={e=>setAnoSel(e.target.value)}>
            {anos.map(a=><option key={a} value={a}>{a}</option>)}
          </select>
        )}
      </div>

      <div style={S.cardGold}>
        <p style={{ ...S.sectionTitle, color:C.goldPale }}>{label}</p>
        <p style={S.bigValue}>{fmt(total)}</p>
        <div style={{ display:"flex", gap:24, marginTop:12 }}>
          <div>
            <p style={{ margin:0, color:C.goldPale, fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>Atendimentos</p>
            <p style={{ margin:0, color:C.cream, fontSize:24, fontStyle:"italic" }}>{count}</p>
          </div>
          <div>
            <p style={{ margin:0, color:C.goldPale, fontSize:10, letterSpacing:2, textTransform:"uppercase" }}>Ticket médio</p>
            <p style={{ margin:0, color:C.cream, fontSize:24, fontStyle:"italic" }}>{count?fmt(ticket):"–"}</p>
          </div>
        </div>
      </div>

      {melhorDia && (
        <div style={{ ...S.card, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={S.sectionTitle}>✦ Melhor dia</p>
            <p style={{ margin:0, fontSize:14, color:C.text }}>{toDate(melhorDia[0]).toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
          </div>
          <span style={{ color:C.gold, fontSize:18, fontStyle:"italic" }}>{fmt(melhorDia[1])}</span>
        </div>
      )}

      {periodo==="ano" && melhorMes && (
        <div style={{ ...S.card, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={S.sectionTitle}>✦ Melhor mês</p>
            <p style={{ margin:0, fontSize:14, color:C.text }}>{MESES[Number(melhorMes[0].split("-")[1])-1]}</p>
          </div>
          <span style={{ color:C.gold, fontSize:18, fontStyle:"italic" }}>{fmt(melhorMes[1])}</span>
        </div>
      )}

      {periodo==="ano" && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Faturamento mensal</p>
          <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:100 }}>
            {mesesAno.map((m,i)=>{
              const v=porMes[m]||0;
              const h=Math.max((v/maxMes)*90,v>0?8:2);
              return (
                <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <div style={{ width:"100%", height:h, background:v>0?`linear-gradient(to top,${C.gold},${C.goldLight})`:C.grayLight, borderRadius:"4px 4px 0 0", transition:"height 0.3s" }}/>
                  <span style={{ fontSize:7, color:C.gray }}>{MESES[i].slice(0,3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rankCat.length > 0 && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Por categoria</p>
          {rankCat.map(([cat,val])=>(
            <div key={cat} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.grayLight}` }}>
              <span style={{ fontSize:13, color:C.text }}>{cat}</span>
              <span style={{ color:C.gold, fontStyle:"italic", fontSize:14 }}>{fmt(val)}</span>
            </div>
          ))}
        </div>
      )}

      {rankServicos.length > 0 && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Serviços mais realizados</p>
          {rankServicos.map(([nome,qtd],idx)=>(
            <div key={nome} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:`1px solid ${C.grayLight}` }}>
              <span style={{ color:idx===0?C.gold:C.gray, fontSize:12, minWidth:16, textAlign:"center", fontStyle:"italic" }}>{idx===0?"★":idx+1}</span>
              <span style={{ flex:1, fontSize:13, color:C.text }}>{nome}</span>
              <span style={{ background:C.goldPale, color:C.brownLight, borderRadius:20, padding:"3px 10px", fontSize:12 }}>{qtd}×</span>
            </div>
          ))}
        </div>
      )}

      {count===0 && (
        <div style={{ ...S.card, textAlign:"center", padding:40 }}>
          <p style={{ color:C.gray, fontStyle:"italic" }}>Nenhum atendimento neste período.</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ABA CONFIGURAÇÕES
// ══════════════════════════════════════════════════════════════════════════════
function AbaConfig({ servicos, salvarServicos, atendimentos, salvarAtendimentos, onLogout, usuario }) {
  const [aba, setAba] = useState("precos");
  const [editId, setEditId] = useState(null);
  const [editPreco, setEditPreco] = useState("");

  function salvarPreco(id) {
    const v=parseFloat(editPreco.replace(",","."));
    if(!v||v<0) return;
    salvarServicos(servicos.map(s=>s.id===id?{...s,preco:v}:s));
    setEditId(null);
  }

  function excluirAtend(id) {
    if(!confirm("Excluir este atendimento?")) return;
    salvarAtendimentos(atendimentos.filter(a=>a.id!==id));
  }

  function exportarCSV() {
    const header="Data,Serviço,Categoria,Cliente,Valor,Obs";
    const rows=atendimentos.map(a=>`${a.data},"${a.servicoNome}","${a.categoria||""}","${a.cliente||""}",${a.valor},"${a.obs||""}"`);
    const csv=[header,...rows].join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url; link.download=`studio-val-pinheiro-${today()}.csv`; link.click();
  }

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={S.card}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["precos","historico","backup","conta"].map(a=>(
            <button key={a} style={S.pill(aba===a)} onClick={()=>setAba(a)}>
              {a==="precos"?"Preços":a==="historico"?"Histórico":a==="backup"?"Backup":"Conta"}
            </button>
          ))}
        </div>
      </div>

      {aba==="precos" && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Editar preços dos serviços</p>
          {["Básicos","Alongamento em Gel","Extras","Cursos"].map(categoria=>{
            const svs=servicos.filter(s=>s.categoria===categoria&&!s.precoLivre);
            if(!svs.length) return null;
            return (
              <div key={categoria}>
                <p style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:C.brownLight, margin:"16px 0 8px" }}>{categoria}</p>
                {svs.map(sv=>(
                  <div key={sv.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.grayLight}`, gap:8 }}>
                    <span style={{ fontSize:12, color:C.text, flex:1 }}>{sv.nome}</span>
                    {editId===sv.id
                      ? <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <input style={{ ...S.input, width:80, padding:"6px 10px", fontSize:14 }} value={editPreco} onChange={e=>setEditPreco(e.target.value)} type="number" inputMode="decimal" autoFocus/>
                          <button onClick={()=>salvarPreco(sv.id)} style={{ ...S.btn.primary, width:"auto", padding:"6px 12px", fontSize:13 }}>✓</button>
                          <button onClick={()=>setEditId(null)} style={{ ...S.btn.ghost, padding:"6px 10px" }}>✕</button>
                        </div>
                      : <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <span style={{ color:C.gold, fontSize:13, fontStyle:"italic" }}>{fmt(sv.preco)}</span>
                          <button onClick={()=>{ setEditId(sv.id); setEditPreco(String(sv.preco)); }} style={{ background:"none", border:"none", cursor:"pointer", color:C.gray, padding:4, fontSize:14 }}>✎</button>
                        </div>
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {aba==="historico" && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Todos os atendimentos ({atendimentos.length})</p>
          {atendimentos.length===0
            ? <p style={{ color:C.gray, fontStyle:"italic" }}>Nenhum registro ainda.</p>
            : atendimentos.slice(0,300).map(a=>(
              <div key={a.id} style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.grayLight}`, gap:8 }}>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:13, color:C.text }}>{a.servicoNome}</p>
                  <p style={{ margin:"2px 0 0", fontSize:11, color:C.gray }}>{toDate(a.data).toLocaleDateString("pt-BR")} {a.cliente?`· ${a.cliente}`:""}</p>
                </div>
                <span style={{ color:C.gold, fontSize:14, fontStyle:"italic" }}>{fmt(a.valor)}</span>
                <button onClick={()=>excluirAtend(a.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#C0392B", padding:4, fontSize:14 }}>🗑</button>
              </div>
            ))
          }
        </div>
      )}

      {aba==="backup" && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Backup dos dados</p>
          <p style={{ fontSize:13, color:C.gray, lineHeight:1.7, marginBottom:20 }}>
            Exporte todos os atendimentos em planilha CSV. Abra no Excel, Google Sheets, ou guarde no Google Drive.
          </p>
          <button style={S.btn.primary} onClick={exportarCSV}>↓ Exportar planilha CSV</button>
          <div style={{ ...S.divider, margin:"24px 0" }}/>
          <div style={{ background:C.goldPale, borderRadius:10, padding:16 }}>
            <p style={{ margin:0, fontSize:12, color:C.brownLight, lineHeight:1.7 }}>
              📊 <strong>{atendimentos.length}</strong> atendimentos registrados<br/>
              💰 Total geral: <strong>{fmt(atendimentos.reduce((s,a)=>s+a.valor,0))}</strong><br/>
              ☁️ {usuario?"Dados sincronizados com Google":"Dados salvos localmente"}
            </p>
          </div>
        </div>
      )}

      {aba==="conta" && (
        <div style={S.card}>
          <p style={S.sectionTitle}>Minha conta</p>
          {usuario
            ? <>
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
                  {usuario.photoURL && <img src={usuario.photoURL} style={{ width:52, height:52, borderRadius:"50%", border:`2px solid ${C.gold}` }} alt="foto"/>}
                  <div>
                    <p style={{ margin:0, fontSize:15, color:C.brown }}>{usuario.displayName}</p>
                    <p style={{ margin:"4px 0 0", fontSize:12, color:C.gray }}>{usuario.email}</p>
                  </div>
                </div>
                <div style={{ background:C.goldPale, borderRadius:10, padding:14, marginBottom:20 }}>
                  <p style={{ margin:0, fontSize:12, color:C.brownLight }}>☁️ Seus dados estão salvos na nuvem do Google e ficam seguros para sempre.</p>
                </div>
                <button style={{ ...S.btn.ghost, width:"100%" }} onClick={onLogout}>Sair da conta</button>
              </>
            : <>
                <p style={{ color:C.gray, fontSize:14, lineHeight:1.7 }}>Você está usando o modo offline. Os dados ficam apenas neste dispositivo.</p>
                <div style={{ background:"#FFF3E0", border:"1px solid #FFB74D", borderRadius:10, padding:14 }}>
                  <p style={{ margin:0, fontSize:12, color:"#E65100" }}>⚠️ Para ativar o login com Google e salvar na nuvem, configure as credenciais do Firebase.</p>
                </div>
              </>
          }
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [aba, setAba] = useState("inicio");
  const [usuario, setUsuario] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [syncStatus, setSyncStatus] = useState("local"); // local | syncing | synced | error

  // Dados (localStorage como fallback)
  const [atendimentos, setAtendimentos] = useLocalStorage("vp_atendimentos", []);
  const [servicos, setServicos] = useLocalStorage("vp_servicos", SERVICOS_PADRAO);

  const firebaseRef = useRef(null);
  const dbRef = useRef(null);

  // ── Inicializar Firebase dinamicamente ──────────────────────────────────────
  useEffect(() => {
    const isConfigured = FIREBASE_CONFIG.apiKey !== "COLE_SUA_API_KEY_AQUI";
    if (!isConfigured) {
      setFirebaseError("Firebase não configurado. Usando modo offline.");
      setLoadingAuth(false);
      return;
    }

    // Carrega Firebase via CDN
    const scripts = [
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js",
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js",
    ];

    let loaded = 0;
    scripts.forEach(src => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        loaded++;
        if (loaded === scripts.length) initFirebase();
      };
      s.onerror = () => { setFirebaseError("Erro ao carregar Firebase."); setLoadingAuth(false); };
      document.head.appendChild(s);
    });

    function initFirebase() {
      try {
        const app = window.firebase.initializeApp(FIREBASE_CONFIG);
        firebaseRef.current = window.firebase;
        dbRef.current = window.firebase.firestore();
        setFirebaseReady(true);

        window.firebase.auth().onAuthStateChanged(user => {
          setUsuario(user);
          setLoadingAuth(false);
          if (user) carregarDadosNuvem(user.uid);
        });
      } catch(e) {
        setFirebaseError("Erro ao inicializar Firebase: " + e.message);
        setLoadingAuth(false);
      }
    }
  }, []);

  // ── Carregar dados da nuvem ─────────────────────────────────────────────────
  async function carregarDadosNuvem(uid) {
    if (!dbRef.current) return;
    setSyncStatus("syncing");
    try {
      const docAt = await dbRef.current.collection("usuarios").doc(uid).collection("dados").doc("atendimentos").get();
      const docSv = await dbRef.current.collection("usuarios").doc(uid).collection("dados").doc("servicos").get();
      if (docAt.exists) setAtendimentos(docAt.data().lista || []);
      if (docSv.exists) setServicos(docSv.data().lista || SERVICOS_PADRAO);
      setSyncStatus("synced");
    } catch(e) {
      setSyncStatus("error");
    }
  }

  // ── Salvar na nuvem ─────────────────────────────────────────────────────────
  async function salvarNaNuvem(uid, campo, dados) {
    if (!dbRef.current || !uid) return;
    setSyncStatus("syncing");
    try {
      await dbRef.current.collection("usuarios").doc(uid).collection("dados").doc(campo).set({ lista: dados });
      setSyncStatus("synced");
    } catch(e) {
      setSyncStatus("error");
    }
  }

  function salvarAtendimentos(lista) {
    setAtendimentos(lista);
    if (usuario) salvarNaNuvem(usuario.uid, "atendimentos", lista);
  }

  function salvarServicos(lista) {
    setServicos(lista);
    if (usuario) salvarNaNuvem(usuario.uid, "servicos", lista);
  }

  // ── Login / Logout ──────────────────────────────────────────────────────────
  async function login() {
    const provider = new window.firebase.auth.GoogleAuthProvider();
    await window.firebase.auth().signInWithPopup(provider);
  }

  async function logout() {
    if (!confirm("Sair da conta?")) return;
    await window.firebase.auth().signOut();
    setUsuario(null);
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loadingAuth) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.cream, fontFamily:"'Georgia',serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>💅</div>
        <p style={{ color:C.brown, fontStyle:"italic" }}>Carregando...</p>
      </div>
    </div>
  );

  // ── Login (Firebase configurado mas usuário não logado) ─────────────────────
  if (firebaseReady && !usuario) return (
    <TelaLogin onLogin={login} firebaseReady={firebaseReady} firebaseError={firebaseError}/>
  );

  const abas = [
    { id:"inicio", label:"Início", emoji:"🏠" },
    { id:"calendario", label:"Agenda", emoji:"📅" },
    { id:"relatorios", label:"Relatórios", emoji:"📊" },
    { id:"config", label:"Config.", emoji:"⚙️" },
  ];

  return (
    <div style={S.app}>
      <header style={S.header}>
        <p style={S.logoTitle}>Studio Val Pinheiro</p>
        <p style={S.logoSub}>
          {syncStatus==="syncing"?"☁️ Sincronizando...":syncStatus==="synced"?"☁️ Salvo na nuvem":syncStatus==="error"?"⚠️ Erro de sync":usuario?"☁️ Modo online":"📱 Modo offline"}
        </p>
      </header>

      <nav style={S.nav}>
        {abas.map(a=>(
          <button key={a.id} style={S.navBtn(aba===a.id)} onClick={()=>setAba(a.id)}>
            <span style={{ fontSize:16 }}>{a.emoji}</span>
            {a.label}
          </button>
        ))}
      </nav>

      <div>
        {aba==="inicio" && <AbaInicio atendimentos={atendimentos} salvar={salvarAtendimentos} servicos={servicos} usuario={usuario}/>}
        {aba==="calendario" && <AbaCalendario atendimentos={atendimentos}/>}
        {aba==="relatorios" && <AbaRelatorios atendimentos={atendimentos}/>}
        {aba==="config" && <AbaConfig servicos={servicos} salvarServicos={salvarServicos} atendimentos={atendimentos} salvarAtendimentos={salvarAtendimentos} onLogout={logout} usuario={usuario}/>}
      </div>
    </div>
  );
}
