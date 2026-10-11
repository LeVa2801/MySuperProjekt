# Meta Dev Dashboard

Ein browserbasiertes Entwickler-Dashboard zum Lernen und Experimentieren. Es vereint mehrere kleine Werkzeuge und interaktive Studios in einer React-Anwendung. Für den lokalen Entwicklungsbetrieb ist kein Backend erforderlich.

## Funktionen

- **C / C++ Playground:** Programme im Browser bearbeiten und ausführen sowie Quellcode exportieren.
- **Maschinensimulation:** Maschinenkomponenten in einer interaktiven 3D-Ansicht zusammenstellen und simulieren.
- **3D Modellstudio:** Modelle aus Grundkörpern erstellen und als GLB exportieren.
- **Animation Studio:** 3D-Animationen mit Keyframes erstellen und in mehrere Sprachen exportieren.
- **API-Generator:** Fetch- und cURL-Beispiele für REST-Endpunkte erzeugen.
- **Colorpicker, Todo und Einstellungen:** Farben und Aufgaben verwalten sowie das Dashboard anpassen.

## Voraussetzungen

- Node.js 22.12 oder neuer
- npm (wird zusammen mit Node.js installiert)

## Lokal installieren und starten

Die Befehle im Repository-Root ausführen:

```sh
npm ci
npm run dev
```

Vite zeigt die lokale URL im Terminal an (standardmäßig `http://localhost:5173`). Änderungen am Quellcode werden während der Entwicklung automatisch übernommen.

## Entwicklung

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver starten |
| `npm run lint` | ESLint-Prüfung ausführen |
| `npm run build` | TypeScript prüfen und Produktionsbuild nach `dist/` erstellen |
| `npm run preview` | Den Produktionsbuild lokal bereitstellen (zuerst `npm run build` ausführen) |

Vor einem Commit können die Prüfungen zusammen ausgeführt werden:

```sh
npm run lint
npm run build
```

Die Abhängigkeitsprüfung sowie Lint und Build laufen außerdem automatisch in GitHub Actions für Pushes und Pull Requests.

## Produktion und Hosting

Für einen statischen Build:

```sh
npm run build
```

Die fertige Anwendung liegt danach in `dist/` und kann auf einem statischen Webhost ausgeliefert werden. Da die Anwendung clientseitiges Routing verwendet, muss der Host unbekannte Pfade auf `index.html` zurückleiten. Die mitgelieferte Nginx-Konfiguration erledigt das für den Docker-Betrieb.

Image bauen und starten:

```sh
docker build -t meta-dev-dashboard .
docker run --rm -p 8080:8080 meta-dev-dashboard
```

Danach ist die Anwendung unter `http://localhost:8080` erreichbar. Das Docker-Image baut die Anwendung in einem eigenen Build-Schritt und liefert nur die fertigen Dateien mit einem unprivilegierten Nginx-Server aus.

## Projektstruktur

- `src/app/` – Einstieg, Navigation und gemeinsames App-Layout
- `src/features/` – einzelne Dashboard-Werkzeuge und deren Komponenten
- `src/shared/` – gemeinsam genutzte Komponenten, Hooks und Hilfsfunktionen
- `public/` – statische Dateien und WebAssembly-Ressourcen
- `.github/workflows/` – automatisierte GitHub-Prüfungen
- `dist/` – generierte Build-Ausgabe (wird nicht eingecheckt)

Die Anwendung ist eine clientseitige Single-Page-App mit React, TypeScript und Vite. Die Entwicklungstools liegen bewusst gemeinsam im Repository-Root, sodass Installation, Checks und Build immer von derselben Stelle aus funktionieren.
