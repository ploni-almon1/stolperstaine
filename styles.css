/* Základní reset */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  height: 100vh;
  height: 100dvh; /* Lepší výška pro mobilní prohlížeče */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #111;
  color: #f0f0f0;
}

/* Hlavička */
#app-header {
  padding: 10px 16px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

#app-header h1 { font-size: 1.1rem; font-weight: 600; }
.controls { display: flex; gap: 16px; font-size: 0.85rem; flex-wrap: wrap; }
.switch { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.switch input { cursor: pointer; accent-color: #d4af37; }

/* Kontejner mapy - přidána pojistka min-height a šedé pozadí pro případ nenačtení dlaždic */
#map { 
  flex: 1 1 auto; 
  width: 100%; 
  min-height: 50vh; 
  z-index: 1; 
  background: #222; 
}

/* Vysouvací panel s detailem */
#detail-panel {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  max-height: 65vh; /* Mírně zvětšeno pro zobrazení všech nových polí */
  overflow-y: auto;
  background: #1a1a1a;
  border-top: 3px solid #d4af37;
  padding: 20px;
  z-index: 2000;
  transform: translateY(100%); /* Ve výchozím stavu schováno dole */
  transition: transform 0.3s ease;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.6);
}

#detail-panel.active { transform: translateY(0); } /* Třída pro vysunutí */

#close-detail {
  position: absolute; top: 10px; right: 10px;
  background: transparent; border: none; color: #f0f0f0;
  font-size: 1.2rem; cursor: pointer;
}

#detail-panel img { max-width: 200px; border-radius: 6px; margin-bottom: 12px; border: 1px solid #333; }
#detail-panel h2 { font-size: 1.2rem; color: #d4af37; margin-bottom: 8px; }
#detail-panel p { font-size: 0.9rem; margin-bottom: 8px; color: #ccc; }
#detail-panel a { color: #d4af37; font-weight: 600; text-decoration: none; display: block; margin-top: 12px; }

/* Zvýraznění textu stavu v detailu */
#detail-cleaned { color: #27ae60; font-weight: 600; margin-bottom: 4px; }
#detail-flower { color: #ff9ff3; font-weight: 600; margin-bottom: 12px; }

/* Ikony na mapě (tečky) */
.stone-icon {
  background: #d4af37; border: 2px solid #fff; border-radius: 50%;
  width: 18px !important; height: 18px !important; box-shadow: 0 0 6px rgba(0,0,0,0.5);
}
.stone-icon.needs-cleaning { background: #e74c3c; animation: pulse 2s infinite; }
.stone-icon.recently-cleaned { background: #27ae60; }
.stone-icon.has-flower { background: #ff9ff3; } /* Samotný květ */
.stone-icon.cleaned-and-flower { background: linear-gradient(135deg, #27ae60 50%, #ff9ff3 50%); } /* Obojí najednou */

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.7; }
}

/* Kulaté tlačítko pro zjištění polohy */
#locate-btn {
  position: fixed; bottom: 30px; right: 20px; z-index: 1500;
  width: 48px; height: 48px; border-radius: 50%;
  background: #1a1a1a; border: 2px solid #d4af37; color: #d4af37;
  font-size: 1.4rem; cursor: pointer; box-shadow: 0 2px 12px rgba(0,0,0,0.6);
}
#locate-btn:hover { background: #262626; }
body.panel-open #locate-btn { display: none; } /* Skryje tlačítko, když je otevřený panel */

/* Formulář pro čištění a květiny */
#cleaning-form { margin-top: 16px; padding-top: 16px; border-top: 1px solid #333; }
#cleaning-form h3 { font-size: 0.95rem; color: #d4af37; margin-bottom: 10px; }
.form-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.form-row label { font-size: 0.85rem; color: #aaa; min-width: 90px; }
.form-row input[type="text"] {
  flex: 1; padding: 8px; background: #0f0f0f; border: 1px solid #333;
  border-radius: 6px; color: #f0f0f0;
}
.form-row input.invalid { border-color: #e74c3c; background: #1f1010; }

/* Stylování pro checkboxy akcí */
.form-actions { display: flex; gap: 15px; font-size: 0.9em; margin-bottom: 10px; }
.form-actions label { display: flex; align-items: center; gap: 5px; cursor: pointer; color: #ccc; }
.form-actions input[type="checkbox"] { accent-color: #d4af37; cursor: pointer; width: 16px; height: 16px; }

#cleaning-submit {
  margin-top: 6px; padding: 9px 20px; background: #d4af37; color: #111;
  border: none; border-radius: 6px; font-weight: 700; cursor: pointer;
}
.feedback { margin-left: 12px; font-size: 0.85rem; font-weight: 600; }
.feedback.hidden { display: none; }
