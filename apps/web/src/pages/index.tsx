import Head from "next/head";
import { useState, CSSProperties } from "react";

// oldal tipusok
type Page = "calculator" | "share" | "settings" | "login";

// ==================== TEMAK ====================
const theme = {
  dark: {
    pri: "#3b9be8",     // main
    sec: "#384555",     // secondary
    bg: "#2a3444",      // background
    bgDark: "#1d2733",  // dark background
    txt: "#9ca3af",     // text
    accent: "#60a5fa",  // accent
  },
  light: {
    pri: "#2563eb",     // main
    sec: "#e2e8f0",     // secondary
    bg: "#f8fafc",      // background
    bgDark: "#ffffff",  // dark background
    txt: "#64748b",     // text
    accent: "#3b82f6",  // accent
  },
  contrast: {
    pri: "#00ff00",     // main
    sec: "#111",        // secondary
    bg: "#000",         // background
    bgDark: "#000",     // dark background
    txt: "#fff",        // text
    accent: "#00ff00",  // accent
  },
};

// ==================== IKONOK ====================
const icon = (d: string, size = 18) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  calculator: icon("M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"),
  // share ikon
  share: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  // settings
  settings: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  login: icon("M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"),
  email: icon("M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6", 20),
  lock: icon("M3 11h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2V11zM7 11V7a5 5 0 0110 0v4", 20),
  user: icon("M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8", 20),
  // google es apple :3
  google: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  apple: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
};

// ==================== MERESI MEZOK ====================
// TODO: ezek a telorol jonnek majd
const fields = [
  { label: "Gravitációs állandó (m/s²)", value: "9.81" },
  { label: "Tömeg (g)", ph: "Adja meg a tömeget" },
  { label: "Kezdősebesség (m/s)", ph: "Adja meg a kezdősebességet" },
  { label: "Végsebesség (m/s)", ph: "Adja meg a végsebességet" },
  { label: "Távolság (m)", ph: "Adja meg a távolságot" },
  { label: "Idő (s)", ph: "Adja meg az időt" },
];

// nav menu konfiguracio ||| uj menupontot ide kell rakni
const navItems: { key: Page; label: string; icon: keyof typeof Icons }[] = [
  { key: "calculator", label: "Mérés", icon: "calculator" },
  { key: "share", label: "Megosztás", icon: "share" },
  { key: "settings", label: "Beállítások", icon: "settings" },
];

// ==================== KOMPONENSEK ====================

// toggle switch gomb ||| hasznald ujra ha kell meg ilyen
const Toggle = ({
  on,
  onToggle,
  color,
}: {
  on: boolean;
  onToggle: () => void;
  color: string;
}) => (
  <button
    onClick={onToggle}
    style={{
      width: 56,
      height: 32,
      borderRadius: 16,
      backgroundColor: color,
      position: "relative",
      border: "none",
      cursor: "pointer",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 4,
        left: on ? 28 : 4,
        width: 24,
        height: 24,
        borderRadius: "50%",
        backgroundColor: "#fff",
        transition: "left 0.2s",
      }}
    />
  </button>
);

// ==================== MAIN KOMPONENS ====================
export default function Home() {
  // -------- ALLAPOTOK --------        
  const [page, setPage] = useState<Page>("calculator");         // melyik oldal aktiv
  const [hc, setHc] = useState(false);                          // magas kontraszt mod
  const [lightMode, setLightMode] = useState(false);            // vilagos mod (default: sotet)
  const [isSignUp, setIsSignUp] = useState(false);              // login vagy regisztracio
  const [email, setEmail] = useState("");                       // email input
  const [password, setPassword] = useState("");                 // jelszo input
  const [name, setName] = useState("");                         // nev input
  const [navHover, setNavHover] = useState<Page | null>(null);  // melyik nav gombra hoverelunk

  // -------- TEMA KIVALASZTASA --------
  // hc > light > dark sorrendben nezi melyik aktiv
  const t = hc ? theme.contrast : lightMode ? theme.light : theme.dark;
  
  // kepek a tematol fuggoen ||| light mode = light kepek
  const iconSrc = lightMode ? "/ikon_light.png" : "/icon1.png";
  const titleSrc = lightMode ? "/title_light.png" : "/title1.png";
  const txtColor = lightMode && !hc ? "#1e293b" : "#fff";

  // -------- HELPER STILUSOK --------
  const box = (bg: string, p = 20, r = 12): CSSProperties => ({
    backgroundColor: bg,
    padding: p,
    borderRadius: r,
  });
  const flex = (gap = 16, dir: "row" | "column" = "row"): CSSProperties => ({
    display: "flex",
    gap,
    flexDirection: dir,
  });
  const text = (size: number, bold = false): CSSProperties => ({
    fontSize: size,
    fontWeight: bold ? "bold" : "normal",
    color: txtColor,
  });

  // nav gomb ||| automatikusan kezeli az aktiv/hover allapotot
  const navBtnStyle = (key: Page): CSSProperties => ({
    ...box("transparent", 10, 10),
    color: page === key ? "#fff" : t.txt,
    border: key === "login" && page !== key ? `1px solid ${t.sec}` : "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: page === key ? 600 : 400,
    background: page === key ? `linear-gradient(135deg, ${t.pri} 0%, ${t.accent} 100%)` : navHover === key ? t.sec : "transparent",
    transition: "all 0.2s ease",
    boxShadow: page === key ? `0 4px 15px ${t.pri}40` : "none",
  });

  // input mezo a login formhoz
  const inputStyle: CSSProperties = {
    width: "100%",
    ...box(t.bg, 14, 10),
    paddingLeft: 44,
    color: "#fff",
    border: `1px solid ${t.sec}`,
    fontSize: 15,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  // social login gomb (google, apple stb)
  const socialBtn = (bg: string, color = "#fff"): CSSProperties => ({
    ...box(bg, 14, 10),
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    fontSize: 15,
    fontWeight: 500,
    color,
    transition: "transform 0.2s, box-shadow 0.2s",
  });

  // -------- BELSO KOMPONENSEK --------
  // input mezo ikonnal ||| hasznald a formokhoz
  const InputField = ({ icon, label, type, value, onChange, placeholder }: any) => (
    <div>
      <label style={{ display: "block", fontSize: 14, color: t.txt, marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.txt }}>{icon}</div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = t.pri;
            e.target.style.boxShadow = `0 0 0 3px ${t.pri}30`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = t.sec;
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );

  // beallitasok sor toggle-vel ||| hasznald ha kell uj setting !!!!!
  const SettingRow = ({ title, desc, children }: any) => (
    <div
      style={{
        ...box(t.sec),
        ...flex(),
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <h3 style={text(18, true)}>{title}</h3>
        <p style={{ color: t.txt, marginTop: 4, fontSize: 14 }}>{desc}</p>
      </div>
      {children}
    </div>
  );

  // ==================== RENDERELES ====================
  return (
    <>
      <Head>
        <title>Csúszásch</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon1.png" type="image/png" /> {/* favicon a tabon */}
      </Head>

      {/* ========== FO CONTAINER ========== */}
      <div style={{ ...box(t.bg), minHeight: "100vh" }}>

        {/* ---------- NAVBAR ---------- */}
        {/* navbar blur effekttel, eleg sexy */}
        <nav style={{
          background: `linear-gradient(180deg, ${t.bgDark} 0%, ${t.bgDark}ee 100%)`,
          padding: "12px 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${t.sec}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
          <div style={{
            ...flex(),
            maxWidth: 1200,
            margin: "0 auto",
            justifyContent: "space-between",
            alignItems: "center",
          }}>

            {/* Logo kep - valt a tema alapjan */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img 
                src={titleSrc} 
                alt="Csúszásch" 
                style={{
                  height: 56,
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Nav menu gombok */}
            <div style={{ ...flex(8), alignItems: "center" }}>
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  onMouseEnter={() => setNavHover(item.key)}
                  onMouseLeave={() => setNavHover(null)}
                  style={navBtnStyle(item.key)}
                >
                  {Icons[item.icon]}
                  {item.label}
                </button>
              ))}

              {/* elvalaszto vonal */}
              <div style={{ width: 1, height: 24, backgroundColor: t.sec, margin: "0 8px" }} />

              {/* login gomb kulon mert mas stilusu */}
              <button
                onClick={() => setPage("login")}
                onMouseEnter={() => setNavHover("login")}
                onMouseLeave={() => setNavHover(null)}
                style={navBtnStyle("login")}
              >
                {Icons.login}
                Bejelentkezés
              </button>
            </div>

          </div>
        </nav>

        {/* ---------- OLDAL TARTALOM ---------- */}
        {/* settings oldalnal kisebb maxWidth mert ugy szebb */}
        <div style={{ padding: 16, maxWidth: page === "settings" ? 600 : 1400, margin: "0 auto" }}>

          {/* ========== MERES OLDAL ========== */}
          {page === "calculator" && (
            <div style={box(t.bgDark, 24)}>

              {/* 2 oszlopos layout: bal = inputok, jobb = grafikonok */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>

                {/* ------- BAL PANEL - MERESI ADATOK ------- */}
                <div style={box(t.sec)}>
                  <h3 style={{ ...text(20, true), marginBottom: 16 }}>
                    Mérési adatok
                  </h3>

                  {/* input mezok - TODO: kesobb ezek a telefonrol jonnek */}
                  {fields.map((f, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 14, color: t.txt, marginBottom: 4 }}>
                        {f.label}
                      </label>
                      <input
                        type="number"
                        defaultValue={f.value}
                        placeholder={f.ph}
                        style={{
                          width: "100%",
                          ...box(t.bg, 12, 8),
                          color: "#fff",
                          border: `1px solid ${t.txt}`,
                          fontSize: 16,
                        }}
                      />
                    </div>
                  ))}

                  {/* nagy kiemelt doboz a vegeredmenynek */}
                  <div style={{
                    ...box(`${t.pri}33`, 20),
                    border: `2px solid ${t.pri}`,
                    marginTop: 16,
                  }}>
                    <p style={{ fontSize: 14, color: t.txt }}>Súrlódási együttható</p>
                    <p style={{ ...text(40, true), color: t.pri }}>0.425</p>
                  </div>
                </div>

                {/* ------- JOBB PANEL - GRAFIKONOK ------- */}
                <div style={{ ...flex(16, "column"), height: "100%" }}>
                  {[
                    { n: "Sebesség", v: "120 m/s" },
                    { n: "Gyorsulás", v: "5.000 m/s²" },
                  ].map((c) => (
                    <div key={c.n} style={{ ...box(t.sec), flex: 1, display: "flex", flexDirection: "column" }}>

                      {/* grafikon cim + ertek */}
                      <div style={{ ...flex(12), alignItems: "center", marginBottom: 12 }}>
                        <span style={text(24, true)}>{c.n}</span>
                        <span style={{ color: t.txt }}>|</span>
                        <span style={{ ...text(24, true), color: t.pri }}>{c.v}</span>
                      </div>

                      {/* TODO: ide jon majd a grafikon komponens */}
                      <div style={{ ...box(t.bg), flex: 1, minHeight: 150 }} />

                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* ========== MEGOSZTAS OLDAL ========== */}
          {/* QR kod + parosito (haha sex) kod a telefonhoz */}
          {page === "share" && (
            <div style={{
              ...box(t.sec, 24),
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}>

              {/* QR kod placeholder - TODO: igazi qr kod generalas */}
              <div style={{ ...box("#fff", 24, 16), border: `4px solid ${t.pri}` }}>
                <div style={{
                  aspectRatio: "1",
                  ...box("#e5e7eb"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.txt,
                }}>
                  QR Code
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <h2 style={{ ...text(24, true), lineHeight: 1.5, marginBottom: 24 }}>
                  Kérjük scannelje be a QR kódot, vagy írja be a következő számot
                </h2>

                {/* parosito kod - placeholder */}
                <div style={{ ...box(t.bg, 16), display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {["6", "7", "6", "-", "7", "6", "7"].map((d, i) => 
                    d === "-" ? (
                      <span key={i} style={{ ...text(28, true), color: t.txt, margin: "0 8px" }}>-</span>
                    ) : (
                      <span key={i} style={{
                        ...box(t.pri, 0, 8),
                        width: 48,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...text(24, true),
                      }}>
                        {d}
                      </span>
                    )
                  )}
                </div>

                <p style={{ color: t.txt, marginTop: 24, fontSize: 14 }}>
                  A kód 5 perc múlva lejár
                </p>
              </div>

            </div>
          )}

          {/* ========== BEALLITASOK OLDAL ========== */}
          {page === "settings" && (
            <div style={box(t.bgDark, 24)}>
              <h2 style={{ ...text(28, true), marginBottom: 16 }}>Beállítások</h2>
              
              {/* vilagos mod toggle */}
              <SettingRow
                title="Világos mód"
                desc="Váltás világos és sötét téma között"
              >
                <Toggle
                  on={lightMode}
                  onToggle={() => setLightMode(!lightMode)}
                  color={lightMode ? t.pri : t.txt}
                />
              </SettingRow>

              {/* magas kontraszt toggle - siketek es nagyothallok szamara teletext 444es oldalon feliratozva is megtalálhatjak*/}
              <SettingRow
                title="Magas kontraszt mód"
                desc="Fokozott színkontraszt a jobb láthatóságért"
              >
                <Toggle
                  on={hc}
                  onToggle={() => setHc(!hc)}
                  color={hc ? "#00ff00" : t.txt}
                />
              </SettingRow>
            </div>
          )}

          {/* ========== LOGIN / REGISZTRACIO OLDAL ========== */}
          {page === "login" && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "calc(100vh - 200px)",
            }}>
              {/* login kartya - kozepre igazitva, szep arnyekkal */}
              <div style={{
                ...box(t.bgDark, 40, 20),
                width: "100%",
                maxWidth: 420,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                border: `1px solid ${t.sec}`,
              }}>
                {/* header logo + udvozles */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <img 
                    src={iconSrc} 
                    alt="Csúszásch ikon" 
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "contain",
                      margin: "0 auto 16px",
                      display: "block",
                    }}
                  />
                  <h2 style={{ ...text(26, true), marginBottom: 8 }}>
                    {isSignUp ? "Fiók létrehozása" : "Üdvözöljük!"} {/* 1 sor 2 state-re, kurva jo */}
                  </h2>
                  <p style={{ color: t.txt, fontSize: 15 }}>
                    {isSignUp ? "Hozzon létre fiókot a folytatáshoz" : "Jelentkezzen be a fiókjába"}
                  </p>
                </div>

                {/* social login gombok - google meg apple */}
                <div style={{ ...flex(12, "column"), marginBottom: 24 }}>
                  <button
                    style={socialBtn("#fff", "#333")}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {Icons.google}
                    Folytatás Google fiókkal
                  </button>

                  <button
                    style={socialBtn("#000", "#fff")}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.5)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {Icons.apple}
                    Folytatás Apple ID-val
                  </button>
                </div>

                {/* elvalaszto vonal "vagy" szoveggel */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: t.sec }} />
                  <span style={{ color: t.txt, fontSize: 13 }}>vagy</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: t.sec }} />
                </div>

                {/* login/reg form */}
                <form onSubmit={(e) => e.preventDefault()} style={{ ...flex(16, "column") }}>
                  {/* nev mezo csak regisztraciokor latszik */}
                  {isSignUp && (
                    <InputField
                      icon={Icons.user}
                      label="Teljes név"
                      type="text"
                      value={name}
                      onChange={(e: any) => setName(e.target.value)}
                      placeholder="Adja meg a nevét"
                    />
                  )}
                  <InputField
                    icon={Icons.email}
                    label="E-mail cím"
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="pelda@email.com"
                  />
                  <InputField
                    icon={Icons.lock}
                    label="Jelszó"
                    type="password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />

                  {/* elfelejtett jelszo link - csak loginnal */}
                  {!isSignUp && (
                    <div style={{ textAlign: "right", marginTop: -8 }}>
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: t.pri,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        Elfelejtett jelszó?
                      </button>
                    </div>
                  )}

                  {/* submit gomb */}
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: 14,
                      borderRadius: 10,
                      border: "none",
                      background: `linear-gradient(135deg, ${t.pri} 0%, ${t.accent} 100%)`,
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      boxShadow: `0 4px 15px ${t.pri}40`,
                      marginTop: 8,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 8px 25px ${t.pri}50`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 4px 15px ${t.pri}40`;
                    }}
                  >
                    {isSignUp ? "Regisztráció" : "Bejelentkezés"}
                  </button>
                </form>

                {/* valtogatas login/reg kozott */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 24,
                    paddingTop: 24,
                    borderTop: `1px solid ${t.sec}`,
                  }}
                >
                  <span style={{ color: t.txt, fontSize: 14 }}>
                    {isSignUp ? "Már van fiókja? " : "Még nincs fiókja? "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{
                      background: "none",
                      border: "none",
                      color: t.pri,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    {isSignUp ? "Bejelentkezés" : "Regisztráció"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
