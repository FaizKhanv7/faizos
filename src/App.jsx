import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [booting, setBooting] = useState(true);
  const [bootVisible, setBootVisible] = useState(true);
  const [time, setTime] = useState('');
  const [termDate, setTermDate] = useState('');

  // Window state: { id, open, minimized, zIndex, x, y, width, maxH }
  const [windows, setWindows] = useState([
    { id: 'win-hero', open: true, minimized: false, zIndex: 20, x: 150, y: 100, title: 'About This Dev', width: 460 },
    { id: 'win-projects', open: false, minimized: true, zIndex: 20, x: 300, y: 80, title: 'Projects', width: 500, height: 400, maxH: 500 },
    { id: 'win-skills', open: false, minimized: true, zIndex: 20, x: 100, y: 150, title: 'My Skills', width: 600, height: 400 },
    { id: 'win-terminal', open: false, minimized: true, zIndex: 20, x: 200, y: 300, title: 'faiz@macbook-pro:~', width: 500 },
    { id: 'win-contact', open: false, minimized: true, zIndex: 20, x: 700, y: 200, title: 'Contacts', width: 320 },
    { id: 'win-achievements', open: false, minimized: true, zIndex: 20, x: 250, y: 120, title: 'Reminders', width: 600, height: 450 }
  ]);

  const [zCounter, setZCounter] = useState(20);
  const [activeMenu, setActiveMenu] = useState(null);
  const [bouncingApp, setBouncingApp] = useState(null);
  const [activeFinderTab, setActiveFinderTab] = useState('Projects');

  const menus = {
    'faiz': [
      { label: 'About Faiz OS', action: () => openWin('win-hero') },
      { divider: true },
      { label: 'Preferences...', action: () => openWin('win-skills') },
      { divider: true },
      { label: 'Hide Faiz OS', action: () => { } },
      { label: 'Quit Faiz OS', action: () => window.close() }
    ],
    'file': [
      { label: 'New Window', action: () => openWin('win-projects') },
      { label: 'New Folder', action: () => { } },
      { divider: true },
      { label: 'Close Window', action: () => { } }
    ],
    'edit': [
      { label: 'Undo', action: () => { } },
      { label: 'Redo', action: () => { } },
      { divider: true },
      { label: 'Cut', action: () => { } },
      { label: 'Copy', action: () => { } },
      { label: 'Paste', action: () => { } }
    ],
    'view': [
      { label: 'Show Toolbar', action: () => { } },
      { label: 'Enter Full Screen', action: () => { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen() } }
    ],
    'go': [
      { label: 'Home', action: () => openWin('win-hero') },
      { label: 'Projects', action: () => openWin('win-projects') },
      { label: 'Terminal', action: () => openWin('win-terminal') }
    ],
    'window': [
      { label: 'Minimize', action: () => { } },
      { label: 'Zoom', action: () => { } },
      { divider: true },
      { label: 'Bring All to Front', action: () => { } }
    ],
    'help': [
      { label: 'Faiz OS Help', action: () => openWin('win-contact') }
    ]
  };

  const [activeSkillTab, setActiveSkillTab] = useState('Frontend');
  const skillsData = {
    'Frontend': [
      { name: 'React', img: '/react.png' },
      { name: 'Next.js', img: '/nextjs.png' },
      { name: 'Vite', img: '/vite.png' },
      { name: 'TypeScript', img: '/typescript.png' },
      { name: 'Tailwind CSS', img: '/tailwind.png' }
    ],
    'Backend & Cloud': [
      { name: 'Firebase', img: '/firebase.png' },
      { name: 'Supabase', img: '/supabase.png' },
      { name: 'Vercel', img: '/vercel.png' },
      { name: 'Python', img: '/python.png' }
    ],
    'AI & DevOps': [
      { name: 'Gemini SDK', img: '/gemini.png' },
      { name: 'AI Agents (Cursor)', img: '/cursor.png' },
      { name: 'Git/GitHub', img: '/github.png' }
    ]
  };

  // Dragging state
  const dragRef = useRef({ id: null, ox: 0, oy: 0 });

  useEffect(() => {
    // Boot sequence
    setTimeout(() => {
      setBooting(false);
      setTimeout(() => {
        setBootVisible(false);
        setTermDate(new Date().toDateString());
      }, 800);
    }, 2800);

    // Clock
    const updateClock = () => {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
      setTime(now.toLocaleDateString('en-US', options).replace(',', ''));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragRef.current.id) return;

      const { id, ox, oy } = dragRef.current;
      let x = e.clientX - ox;
      let y = e.clientY - oy;
      y = Math.max(28, y); // Keep under menubar

      setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
    };

    const handleMouseUp = () => {
      dragRef.current.id = null;
    };

    const closeMenu = (e) => {
      if (!e.target.closest('.mac-dropdown') && !e.target.closest('.apple-icon-wrapper')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  const bringToFront = (id) => {
    setZCounter(c => {
      const newZ = c + 1;
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
      return newZ;
    });
  };

  const openWin = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, open: true, minimized: false } : w));
    bringToFront(id);
  };

  const closeApp = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, open: false, minimized: false } : w));
  };

  const minWin = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  };

  const toggleWin = (id) => {
    const w = windows.find(w => w.id === id);
    if (!w.open) {
      setBouncingApp(id);
      setTimeout(() => {
        setBouncingApp(null);
        openWin(id);
      }, 1200);
    } else if (w.minimized) {
      openWin(id);
    } else {
      if (w.zIndex < zCounter) {
        bringToFront(id);
      } else {
        closeApp(id);
      }
    }
  };

  const startDrag = (e, id) => {
    if (e.target.closest('.win-controls')) return;
    bringToFront(id);
    const winObj = windows.find(w => w.id === id);
    if (winObj) {
      dragRef.current = {
        id,
        ox: e.clientX - winObj.x,
        oy: e.clientY - winObj.y
      };
    }
    e.preventDefault();
  };

  const isDockActive = (id) => {
    const w = windows.find(win => win.id === id);
    return w && w.open;
  };

  return (
    <>
      {bootVisible && (
        <div id="boot-screen" style={{ opacity: booting ? 1 : 0, pointerEvents: booting ? 'auto' : 'none' }}>
          <img src="/applelogo.png" className="apple-logo-boot" alt="Apple Logo" />
          <div className="boot-loading-bar">
            <div className="boot-loading-fill"></div>
          </div>
          <div className="boot-text">Launching Faiz OS</div>
        </div>
      )}

      <div id="menubar">
        <div className="menubar-left">
          <div style={{ position: 'relative' }}>
            <div className={`apple-icon-wrapper ${activeMenu === 'apple' ? 'active-bg' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'apple' ? null : 'apple'); }}>
              <img src="/applelogo.png" className="apple-icon" alt="Apple" />
            </div>
            {activeMenu === 'apple' && (
              <div className="mac-dropdown" style={{ left: '4px' }}>
                <div className="mac-dropdown-item" onClick={() => { openWin('win-hero'); setActiveMenu(null); }}>About This Mac</div>
                <div className="mac-dropdown-divider"></div>
                <div className="mac-dropdown-item" onClick={() => { openWin('win-skills'); setActiveMenu(null); }}>System Settings...</div>
                <div className="mac-dropdown-divider"></div>
                <div className="mac-dropdown-item" onClick={() => { window.location.reload(); }}>Restart...</div>
                <div className="mac-dropdown-item" onClick={() => { window.close(); }}>Shut Down...</div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div className={`menu-item bold ${activeMenu === 'faiz' ? 'active-bg' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'faiz' ? null : 'faiz'); }} style={{ padding: '4px 8px', borderRadius: '4px' }}>Faiz OS</div>
            {activeMenu === 'faiz' && (
              <div className="mac-dropdown" style={{ left: '0' }}>
                {menus.faiz.map((item, i) => item.divider ? <div key={i} className="mac-dropdown-divider"></div> : <div key={`faiz-${i}`} className="mac-dropdown-item" onClick={() => { item.action(); setActiveMenu(null); }}>{item.label}</div>)}
              </div>
            )}
          </div>

          {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(menuName => {
            const key = menuName.toLowerCase();
            return (
              <div key={key} style={{ position: 'relative' }}>
                <div className={`menu-item ${activeMenu === key ? 'active-bg' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === key ? null : key); }} style={{ padding: '4px 8px', borderRadius: '4px' }}>{menuName}</div>
                {activeMenu === key && (
                  <div className="mac-dropdown" style={{ left: '0' }}>
                    {menus[key].map((item, i) => item.divider ? <div key={i} className="mac-dropdown-divider"></div> : <div key={`${key}-${i}`} className="mac-dropdown-item" onClick={() => { item.action(); setActiveMenu(null); }}>{item.label}</div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="menubar-right">
          <span style={{ fontSize: '12px' }}>100%</span>
          <img src="/battery.png" className="menu-icon" alt="Battery" />
          <img src="/wifi.png" className="menu-icon" alt="WiFi" />
          <span className="menu-item bold" style={{ marginLeft: '8px' }}>{time}</span>
        </div>
      </div>

      <div id="desktop">
        <div className="desktop-icon" onClick={() => openWin('win-projects')}>
          <div className="desktop-icon-img"><img src="/folder.png" alt="Projects" /></div>
          <span>Projects</span>
        </div>
        <div className="desktop-icon" onClick={() => openWin('win-terminal')}>
          <div className="desktop-icon-img"><img src="/terminal.png" alt="Terminal" /></div>
          <span>Terminal</span>
        </div>
      </div>

      {/* Windows */}
      {windows.map(win => (
        <div
          key={win.id}
          id={win.id}
          className={`win ${win.minimized ? 'minimized' : ''} ${!win.open ? 'closed' : ''}`}
          style={{
            width: win.width,
            height: win.height,
            top: win.y,
            left: win.x,
            maxHeight: win.maxH,
            zIndex: win.zIndex
          }}
          onMouseDown={() => bringToFront(win.id)}
        >
          <div
            className="win-titlebar"
            style={win.id === 'win-terminal' ? { background: 'rgba(40,40,40,0.95)', borderBottom: '1px solid #555' } : {}}
            onMouseDown={(e) => startDrag(e, win.id)}
          >
            <div className="win-controls">
              <button className="win-btn btn-close" onClick={() => closeApp(win.id)}></button>
              <button className="win-btn btn-min" onClick={() => minWin(win.id)}></button>
              <button className="win-btn btn-max" onClick={() => bringToFront(win.id)}></button>
            </div>
            <div className="win-title" style={win.id === 'win-terminal' ? { color: '#bbb' } : {}}>{win.title}</div>
          </div>

          {/* Window Bodies */}
          {win.id === 'win-hero' && (
            <div className="win-body">
              <div className="hero-avatar">
                <img src="/applelogo.png" alt="Apple" style={{ width: '50px', objectFit: 'contain' }} />
              </div>
              <div className="hero-info">
                <div className="hero-name">Faiz OS</div>
                <div className="hero-role">Version 16.3 (Years Old)</div>
                <div className="hero-specs">
                  Full-Stack Dev · Founder · Builder<br />
                  Available for Internship · Summer 2026<br />
                  Memory: 100% Motivation
                </div>
                <button className="btn-primary" onClick={() => openWin('win-contact')}>Get In Touch</button>
              </div>
            </div>
          )}

          {win.id === 'win-projects' && (
            <div className="win-body">
              <div className="finder-sidebar">
                <div className="finder-sidebar-title">Favorites</div>
                <div className={`finder-sidebar-item ${activeFinderTab === 'Projects' ? 'active' : ''}`} onClick={() => setActiveFinderTab('Projects')}>
                  <span style={{ color: '#0A84FF' }}>📁</span> Projects
                </div>
                <div className={`finder-sidebar-item ${activeFinderTab === 'Documents' ? 'active' : ''}`} onClick={() => setActiveFinderTab('Documents')}>
                  <span style={{ color: '#34c759' }}>📄</span> Documents
                </div>
                <div className={`finder-sidebar-item ${activeFinderTab === 'Downloads' ? 'active' : ''}`} onClick={() => setActiveFinderTab('Downloads')}>
                  <span style={{ color: '#5e5ce6' }}>⬇️</span> Downloads
                </div>
              </div>
              <div className="finder-main">
                <div className="finder-toolbar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="finder-nav-btn">&#8249;</span>
                    <span className="finder-nav-btn">&#8250;</span>
                    <span className="finder-title">{activeFinderTab}</span>
                  </div>
                </div>
                <div className="win-content">
                  {activeFinderTab === 'Projects' && (
                    <div className="finder-grid">
                      <a href="https://lockinfounders.com" target="_blank" rel="noreferrer" className="finder-item">
                        <img src="/lockin.png" alt="LockIn" className="finder-item-icon" onError={(e) => e.target.src = '/folder.png'} />
                        <span className="finder-item-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                          LockIn <span style={{ fontSize: '9px', opacity: 0.6 }}>↗</span>
                        </span>
                      </a>
                      <a href="https://futureforgepitch.vercel.app" target="_blank" rel="noreferrer" className="finder-item">
                        <img src="/barber.png" alt="Barbershop Site" className="finder-item-icon" onError={(e) => e.target.src = '/folder.png'} />
                        <span className="finder-item-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                          FutureForge <span style={{ fontSize: '9px', opacity: 0.6 }}>↗</span>
                        </span>
                      </a>
                      <a href="https://wavehack.org" target="_blank" rel="noreferrer" className="finder-item">
                        <img src="/wavehack.png" alt="WaveHack" className="finder-item-icon" onError={(e) => e.target.src = '/folder.png'} />
                        <span className="finder-item-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                          WaveHack <span style={{ fontSize: '9px', opacity: 0.6 }}>↗</span>
                        </span>
                      </a>
                    </div>
                  )}
                  {activeFinderTab === 'Documents' && (
                    <div className="finder-grid">
                      <a href="https://docs.google.com/document/d/1lMxhccD7vipKujpXSULwPGa2MevUGykMT6LuJTWxurc/edit?usp=sharing" target="_blank" rel="noreferrer" className="finder-item">
                        <img src="/file.png" alt="Resume" className="finder-item-icon" onError={(e) => e.target.src = '/folder.png'} />
                        <span className="finder-item-name">resume.pdf</span>
                      </a>
                    </div>
                  )}
                  {activeFinderTab === 'Downloads' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: '14px', fontWeight: 500 }}>
                      No downloads available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {win.id === 'win-skills' && (
            <div className="win-body">
              <div className="settings-sidebar">
                {Object.keys(skillsData).map(tab => (
                  <div
                    key={tab}
                    className={`settings-sidebar-item ${activeSkillTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveSkillTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className="win-content" style={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div className="skills-marquee-container">
                  <div className="skills-marquee" key={activeSkillTab}>
                    <div className="skills-set">
                      {skillsData[activeSkillTab].map((skill, i) => (
                        <div key={`set1-${i}`} className="skill-card">
                          <img src={skill.img} alt={skill.name} className="skill-img" onError={(e) => e.target.style.display = 'none'} />
                          <div className="skill-name">{skill.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="skills-set">
                      {skillsData[activeSkillTab].map((skill, i) => (
                        <div key={`set2-${i}`} className="skill-card">
                          <img src={skill.img} alt={skill.name} className="skill-img" onError={(e) => e.target.style.display = 'none'} />
                          <div className="skill-name">{skill.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="skills-set">
                      {skillsData[activeSkillTab].map((skill, i) => (
                        <div key={`set3-${i}`} className="skill-card">
                          <img src={skill.img} alt={skill.name} className="skill-img" onError={(e) => e.target.style.display = 'none'} />
                          <div className="skill-name">{skill.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {win.id === 'win-terminal' && (
            <div className="win-body">
              <div className="win-content">
                <div>Last login: <span>{termDate}</span> on ttys000</div>
                <br />
                <div><span className="term-prompt">faiz@macbook-pro</span> <span className="term-dir">~</span> % <span className="term-cmd">whoami</span></div>
                <div className="term-out">High school full-stack developer & founder</div>

                <div><span className="term-prompt">faiz@macbook-pro</span> <span className="term-dir">~</span> % <span className="term-cmd">cat profile.txt</span></div>
                <div className="term-out">I don't wait for opportunities — I build them. I've sold commercial websites, founded a nonprofit, and launched a real startup.</div>

                <div><span className="term-prompt">faiz@macbook-pro</span> <span className="term-dir">~</span> % <span className="term-cursor"></span></div>
              </div>
            </div>
          )}

          {win.id === 'win-contact' && (
            <div className="win-body">
              <div className="win-content">
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Let's Connect</div>
                <div className="contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><img src="/gmail.png" alt="Email" style={{ width: '18px', objectFit: 'contain' }} /> <a href="mailto:writetofaiz7@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>writetofaiz7@gmail.com</a></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><img src="/github.png" alt="GitHub" style={{ width: '18px', objectFit: 'contain' }} /> <a href="https://github.com/FaizKhanv7" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>github.com/FaizKhanv7</a></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><img src="/linkedin.png" alt="LinkedIn" style={{ width: '18px', objectFit: 'contain' }} /> <a href="https://www.linkedin.com/in/faiz-khan-6958b639a/" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>linkedin.com/in/faiz</a></div>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }} onClick={() => closeApp('win-contact')}>Close</button>
              </div>
            </div>
          )}

          {win.id === 'win-achievements' && (
            <div className="win-body">
              <div className="reminders-main">
                <div className="reminders-sidebar">
                  <div className="reminders-search">🔍 Search</div>
                  <div className="reminders-list active">
                    <div className="reminders-icon">≡</div> All
                  </div>
                </div>
                <div className="reminders-content">
                  <div className="reminders-header">
                    <h2>Achievements</h2>
                  </div>

                  <div className="reminders-section-title">Worked with and trusted by people from:</div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">Harvard</div>
                  </div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">Rice</div>
                  </div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">Yale</div>
                  </div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">Google</div>
                  </div>

                  <div className="reminders-section-title" style={{ marginTop: '24px' }}>Milestones</div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">TSA Cybersecurity 4th place winner</div>
                  </div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">1x hackathon winner</div>
                  </div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">Hosted a hackathon with 30+ people</div>
                  </div>
                  <div className="reminders-item">
                    <div className="reminders-circle"></div>
                    <div className="reminders-text">Launched a startup with 300+ users</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div id="dock-container">
        <div id="dock">
          <div className={`dock-item ${isDockActive('win-hero') ? 'active' : ''} ${bouncingApp === 'win-hero' ? 'bouncing' : ''}`} onClick={() => toggleWin('win-hero')}>
            <img src="/finder.png" alt="Home" /><div className="dock-tooltip">Home</div>
          </div>
          <div className={`dock-item ${isDockActive('win-projects') ? 'active' : ''} ${bouncingApp === 'win-projects' ? 'bouncing' : ''}`} onClick={() => toggleWin('win-projects')}>
            <img src="/folder.png" alt="Projects" /><div className="dock-tooltip">Files</div>
          </div>
          <div className={`dock-item ${isDockActive('win-skills') ? 'active' : ''} ${bouncingApp === 'win-skills' ? 'bouncing' : ''}`} onClick={() => toggleWin('win-skills')}>
            <img src="/settings.png" alt="Settings" /><div className="dock-tooltip">System Settings</div>
          </div>
          <div className={`dock-item ${isDockActive('win-terminal') ? 'active' : ''} ${bouncingApp === 'win-terminal' ? 'bouncing' : ''}`} onClick={() => toggleWin('win-terminal')}>
            <img src="/terminal.png" alt="Terminal" /><div className="dock-tooltip">Terminal</div>
          </div>
          <div className={`dock-item ${isDockActive('win-achievements') ? 'active' : ''} ${bouncingApp === 'win-achievements' ? 'bouncing' : ''}`} onClick={() => toggleWin('win-achievements')}>
            <img src="/reminders.png" alt="Achievements" /><div className="dock-tooltip">Reminders</div>
          </div>
          <div className={`dock-item ${isDockActive('win-contact') ? 'active' : ''} ${bouncingApp === 'win-contact' ? 'bouncing' : ''}`} onClick={() => toggleWin('win-contact')}>
            <img src="/mail.png" alt="Mail" /><div className="dock-tooltip">Mail</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
