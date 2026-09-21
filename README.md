# Time4Heroes — Build 2.6.1 — Pixel Monster Integration

Pierwszy test integracji sprite’ów z paczek użytkownika.

- 82 uporządkowane sprite’y w `assets/monsters/`
- 82 miniatury markerów w `assets/markers/`
- `monster_manifest.json` z identyfikatorami i źródłami
- 27 istniejących ID potworów gry podpiętych do nowych grafik tam, gdzie istnieje sensowne dopasowanie
- niepasujące / brakujące bossy zachowują wcześniejsze grafiki jako fallback
- `image-rendering: pixelated` dla ostrego pixel artu

To jest build integracyjny: mechaniki 2.6 pozostają bez zmian. Następny krok to dobór i wykonanie spójnych pixel-artowych teł walki / lochów.
