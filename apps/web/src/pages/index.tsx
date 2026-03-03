import Head from "next/head";
import { useState } from "react";


type Page = "calculator" | "share" | "settings";

// normal es magas kontraszt mod

const theme = {
  normal: {
    pri: "#3b9be8",      // fő
    sec: "#384555",      // masodlagos
    bg: "#2a3444",       // alap hatter
    bgDark: "#232b38",   // sotetebb hatter
    txt: "#9ca3af",      // szoveg szin
  },
  contrast: {
    pri: "#00ff00",      // fő
    sec: "#111",         // masodlagos
    bg: "#000",          // alap hatter
    bgDark: "#000",      // sotetebb hatter
    txt: "#fff",         // szoveg szin
  },
};

// INPUT MEZOK

const fields = [
  { label: "Gravitációs állandó (m/s²)", value: "9.81" },
  { label: "Tömeg (g)", ph: "Adja meg a tömeget" },
  { label: "Kezdősebesség (m/s)", ph: "Adja meg a kezdősebességet" },
  { label: "Végsebesség (m/s)", ph: "Adja meg a végsebességet" },
  { label: "Távolság (m)", ph: "Adja meg a távolságot" },
  { label: "Idő (s)", ph: "Adja meg az időt" },
];

export default function Home() {

  // ALLAPOTOK

  const [page, setPage] = useState<Page>("calculator");
  const [hc, setHc] = useState(false);

  // aktiv szin tema kivalasztasa
  const t = hc ? theme.contrast : theme.normal;
  
  // doboz: hatter, padding, border-radius
  const box = (bg: string, p = 20, r = 12) => ({
    backgroundColor: bg,
    padding: p,
    borderRadius: r,
  });

  // flexbox: gap es irany
  const flex = (gap = 16, dir: "row" | "column" = "row") => ({
    display: "flex",
    gap,
    flexDirection: dir,
  });

  // szoveg: meret es vastagsag
  const text = (size: number, bold = false) => ({
    fontSize: size,
    fontWeight: bold ? "bold" : "normal",
    color: "#fff",
  });

  return (
    <>
      <Head>
        <title>Csúszásch</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* FŐ CONTAINER */}
      <div style={{ ...box(t.bg), minHeight: "100vh" }}>

        {/* Nav */}

        <nav style={{ ...box(t.bgDark, 16, 0), position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{
            ...flex(),
            maxWidth: 1200,
            margin: "0 auto",
            justifyContent: "space-between",
            alignItems: "center",
          }}>

            {/* Logo ||| majd a png lesz :3 */}
            <h1 style={{ ...text(20, true), fontStyle: "italic" }}>
              Csúszásch
            </h1>

            {/* Nav gombok */}
            <div style={flex()}>
              {(["calculator", "share", "settings"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    ...box(page === p ? t.pri : t.sec, 8, 8),
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {{ calculator: "Számító", share: "Megosztás", settings: "Beállítások" }[p]}
                </button>
              ))}
            </div>

          </div>
        </nav>

        <div style={{ padding: 16, maxWidth: page === "settings" ? 600 : 1400, margin: "0 auto" }}>

          {/* Main page */}

          {page === "calculator" && (
            <div style={box(t.bgDark, 24)}>

              {/* Cím ||| ide meg valami text vagy faszom se tudja*/}
              <h2 style={{ ...text(28, true), fontStyle: "italic", marginBottom: 16 }}>
                Csúszásch
              </h2>

              {/* bal es jobb oldalak*/}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>

                {/* BAL PANEL*/}
                <div style={box(t.sec)}>
                  <h3 style={{ ...text(20, true), marginBottom: 16 }}>
                    Mérési adatok
                  </h3>

                  {/* Input mezok (TODO: nem input hanem majd a szamolt adatokat kell betenni ide) */}
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

                  {/* Surlodas final*/}
                  <div style={{
                    ...box(`${t.pri}33`, 20),
                    border: `2px solid ${t.pri}`,
                    marginTop: 16,
                  }}>
                    <p style={{ fontSize: 14, color: t.txt }}>Súrlódási együttható</p>
                    <p style={{ ...text(40, true), color: t.pri }}>0.425</p>
                  </div>
                </div>

                {/* JOBB PANEL */}
                <div style={flex(16, "column")}>
                  {[
                    { n: "Sebesség", v: "120 m/s" },
                    { n: "Gyorsulás", v: "5.000 m/s²" },
                  ].map((c) => (
                    <div key={c.n} style={{ ...box(t.sec), flex: 1 }}>

                      {/* Grafikon header */}
                      <div style={{ ...flex(12), alignItems: "center", marginBottom: 12 }}>
                        <span style={text(24, true)}>{c.n}</span>
                        <span style={{ color: t.txt }}>|</span>
                        <span style={{ ...text(24, true), color: t.pri }}>{c.v}</span>
                      </div>

                      {/* Grafikon placeholder */}
                      <div style={{ ...box(t.bg), height: 150 }} />

                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* MEGOSZTAS OLDAL */}

          {page === "share" && (
            <div style={{
              ...box(t.sec, 24),
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}>

              {/* QR kod doboz placeholder*/}
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

                {/* Parosito (sex) kód , placeholder */}
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

          {/* SETTINGS OLDAL */}

          {page === "settings" && (
            <div style={box(t.bgDark, 24)}>

              <h2 style={{ ...text(28, true), marginBottom: 16 }}>
                Beállítások
              </h2>

              {/* Constrast toggle ||| ezt lehet masolni ha tervben van tobb feature*/}
              <div style={{ ...box(t.sec), ...flex(), justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={text(18, true)}>Magas kontraszt mód</h3>
                  <p style={{ color: t.txt, marginTop: 4, fontSize: 14 }}>
                    Fokozott színkontraszt a jobb láthatóságért
                  </p>
                </div>

                {/* Toggle gomb */}
                <button
                  onClick={() => setHc(!hc)}
                  style={{
                    width: 56,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: hc ? "#00ff00" : t.txt,
                    position: "relative",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span style={{
                    position: "absolute",
                    top: 4,
                    left: hc ? 28 : 4,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    transition: "left 0.2s",
                  }} />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
