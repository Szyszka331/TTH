# Time4Heroes — Build 1.13.1 — Cache/UI Hotfix

Hotfix po Build 1.13.

## Naprawione

- naprawiono problem, w którym nowy `index.html` mógł działać razem ze starym `app.js` i `styles.css` z cache;
- `app.js`, `data.js` i `styles.css` mają teraz cache-busting `?v=1131`;
- Service Worker używa strategii network-first dla HTML/JS/CSS;
- stare cache Time4Heroes są usuwane przy aktywacji nowego Service Workera;
- zachowany został 5-elementowy interfejs: Mapa / Bohater / Przygoda / Miasto / Menu;
- zachowana jest nowa mapa Leaflet z ikonami zamiast starego ekranu pełnego prostokątnych etykiet;
- tryb skupiony pokazuje maksymalnie 12 najbliższych potworów i 18 ważnych punktów;
- quest „pokonaj dowolne stwory” nie odsłania już wszystkich potworów na mapie;
- konkretne cele questa mają złote podświetlenie;
- wszystkie grafiki NPC i potworów z Build 1.13 pozostają w paczce.

## Wgrywanie na GitHub Pages

Podmień cały komplet plików z paczki, nie tylko `index.html`. Po wdrożeniu wykonaj jedno twarde odświeżenie strony (Ctrl+F5). Dzięki cache-bustingowi kolejne ładowania powinny już korzystać ze spójnej wersji.
