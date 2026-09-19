# GeoRPG — Build 0.1

Samodzielny prototyp przeglądarkowego GPS RPG bez frameworków i bez zależności zewnętrznych.

## Co działa
- tworzenie postaci: Ciężki Rycerz, Mag, Łowca, Berserker, Tropiciel;
- poziomy, XP, statystyki, punkty umiejętności i proste drzewka;
- proceduralna mapa 2D z codziennie zmieniającymi się strefami żółtą/czerwoną/czarną;
- prawdziwy GPS przez Web Geolocation API oraz tryb testowy strzałkami;
- potwory, dystans interakcji, elity, odradzanie;
- turowa walka, atak, umiejętność, mikstury, ucieczka, krytyki, pancerz;
- ekwipunek, wyposażanie przedmiotów, sprzedaż, loot;
- questy głównego rozdziału „Cienie nad Doliną” (15 definicji);
- odkrywanie lokacji i lochów w terenie;
- odkryte lochy można uruchamiać z domu;
- karczma, sklep, kowal, alchemik, dom aukcyjny i sala gildii;
- crafting prostej mikstury;
- bestiariusz;
- UI graczy w pobliżu z akcjami: drużyna/PvP/handel/profil/znajomy (demo — wymaga backendu);
- zapis automatyczny w localStorage;
- eksport zapisu do JSON.

## Uruchomienie lokalne
Najprościej uruchomić serwer statyczny w katalogu projektu:

```bash
python -m http.server 8080
```

Potem wejdź na `http://localhost:8080`.

> Uwaga: prawdziwy GPS w przeglądarce mobilnej wymaga bezpiecznego kontekstu HTTPS. GitHub Pages zapewnia HTTPS.

## Publikacja na GitHub Pages
1. Wgraj zawartość tego folderu do repozytorium (np. `GRA`).
2. W repozytorium otwórz Settings → Pages.
3. Ustaw Deploy from branch → `main` / `/ (root)`.
4. Po publikacji otwórz stronę na telefonie i zezwól na lokalizację.

## Najważniejsze ograniczenie builda 0.1
Multiplayer, prawdziwe aukcje, gildie, handel i obecność graczy wymagają serwera/backendu. W tym buildzie ich interfejs jest przygotowany, ale nie są udawane jako sieciowo działające.

## Następny logiczny etap
Backend kont i graczy online + synchronizacja stanu, następnie prawdziwa drużyna, handel, aukcje, gildie i PvP.
