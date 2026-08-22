const section = { background: "white", border: "1px solid #dce7e1", borderRadius: 18, padding: 24 };

export default function Home() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "64px 24px" }}>
      <p style={{ color: "#16705a", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Juno Open Health Tools</p>
      <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.8rem)", lineHeight: .98, margin: "14px 0 20px" }}>Make messy health notes easier to explain.</h1>
      <p style={{ fontSize: 20, lineHeight: 1.6, maxWidth: 700 }}>Free, no-account tools for finding symptom words, building a timeline, reflecting on a flare, and preparing a focused appointment brief.</p>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", margin: "36px 0" }}>
        <section style={section}><h2>Describe</h2><p>Explore plain-language sensation, timing, pattern, and impact words without diagnostic inference.</p></section>
        <section style={section}><h2>Organise</h2><p>Turn dated observations into a factual chronology that keeps uncertainty visible.</p></section>
        <section style={section}><h2>Prepare</h2><p>Prioritise a main goal, recent changes, functional impact, and the questions that matter most.</p></section>
      </div>
      <p style={{ padding: 20, borderLeft: "4px solid #eead70", background: "#fff8f0", lineHeight: 1.6 }}>These tools organise information. They do not diagnose, recommend treatment, replace a clinician, or provide emergency care.</p>
      <p style={{ padding: 20, borderLeft: "4px solid #16705a", background: "#effaf6", lineHeight: 1.6 }}>Before a tool call, Juno Health Tools asks for permission to process the minimum non-identifying text needed for that request. Do not submit PHI, names, contact details, record numbers, credentials, or provider documents. Tool inputs and outputs are not intentionally stored in an application database.</p>
      <nav style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 32 }}>
        <a href="https://github.com/MarshallBear1/juno-open-health-tools">Open-source resources</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/support">Support</a>
        <a href="https://junocompanion.com/?utm_source=juno_health_tools&utm_medium=referral&utm_campaign=open_health_tools">About Juno</a>
      </nav>
    </main>
  );
}
