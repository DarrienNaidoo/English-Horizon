import { createRoot } from "react-dom/client";

function MinimalApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>SpeakWorld: English for Life</h1>
      <p>English learning app for Chinese students</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Learning Progress</h3>
            <p>Level 3 • 1,250 XP</p>
          </div>
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Daily Challenge</h3>
            <p>Complete 3 speaking exercises</p>
          </div>
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Recent Activity</h3>
            <p>Chinese New Year lesson completed</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Features</h2>
        <ul>
          <li>Interactive lessons with cultural content</li>
          <li>Speaking practice with pronunciation feedback</li>
          <li>Educational games and activities</li>
          <li>Teacher mode for classroom use</li>
          <li>Translation toggle (English ↔ Chinese)</li>
          <li>Offline functionality for classroom use</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3>App Status: Stable</h3>
        <p>This minimal version demonstrates the app concept without complex dependencies that were causing server instability.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<MinimalApp />);