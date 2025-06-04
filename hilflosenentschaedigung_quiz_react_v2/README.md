# Hilflosenentschädigung‑Funnel (React + Vite)

Dieser Funnel prüft Schritt für Schritt, ob ein
Anspruch auf AHV‑Hilflosenentschädigung besteht.

## Entwicklung

```bash
npm install
npm run dev
```

## Produktion / Vercel‑Deploy

Vercel erkennt Vite‑Projekte automatisch.

1. Repo mit diesem Code pushen.
2. Neues Projekt in Vercel anlegen (Framework: Other → Vite wird erkannt).
3. Build‑Command: `npm run build`
4. Output Directory: `dist`

### WordPress‑Einbettung (nach Deploy)

```html
<iframe
  src="https://<projekt>.vercel.app"
  width="100%"
  height="700"
  style="border:0"
  loading="lazy">
</iframe>
```