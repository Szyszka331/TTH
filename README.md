# Time4Heroes — Pikselowe Pogranicze

Wersja 4.1.0 alpha — Szlak łowców · nowy, osobny początek gry.

Jednoosobowy RPG w spójnym stylu pixel art. Pierwszy rozdział obejmuje osadę, leśny szlak i ruiny. To grywalna podstawa do oceny nowego kierunku; nie jest pełnym przeniesieniem poprzedniej gry.

## Jak zagrać

Najwygodniej otworzyć opublikowany link do gry. Wystarczy przeglądarka z JavaScript. GPS jest opcjonalny i wymaga zgody użytkownika oraz HTTPS.

Po pobraniu ZIP rozpakuj cały katalog. Nie uruchamiaj plików bezpośrednio wewnątrz archiwum. Moduły JavaScript wymagają serwera HTTP, więc dwuklik pliku HTML może nie uruchomić gry.

Lokalnie, mając Python 3, uruchom w folderze projektu:

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Na Windows można użyć `py -3` zamiast `python3`. Otwórz `http://localhost:8080`. Zatrzymanie: Ctrl+C. Można też umieścić zawartość `dist/` na hostingu statycznym z HTTPS. Gra nie wymaga instalowania pakietów ani zewnętrznych usług graficznych.

## Pierwsze kroki

1. Kliknij portret bohatera, aby wybrać klasę. Każda z pięciu klas ma osobny zapis.
2. Wybierz wilka lub śluza na mapie, a następnie przycisk spotkania pod mapą.
3. Korzystaj z umiejętności. Zapowiedź silnego ciosu jest sygnałem do obrony albo przerwania ataku.
4. Po walce odbierz łupy. Zadania ukończysz bezpośrednio z dziennika.
5. Odpocznij w karczmie. U kowala porównaj wyposażenie i ulepsz broń za kły oraz złoto.
6. Po awansie wydaj punkt w zakładce Bohater. Przed Strażnikiem warto osiągnąć poziom 5 i założyć mocniejsze wyposażenie.

Po pierwszej wygranej nowego bohatera odbierz broń Mocy i załóż ją. W zakładce Zadania przełącz się na Polowania, aby wybrać kolejny cel, lub Bestiariusz, aby sprawdzić łupy i taktykę. Elity wybierzesz przyciskiem pod mapą po odblokowaniu wymaganej fabuły i poziomu. Po ukończeniu fabuły kowal pozwoli nasycić broń wybranym bonusem. Pełna lista zmian znajduje się w `CHANGELOG.md`.

Na telefonie mapę można przesuwać w poziomie. Zakładki Osada / Leśny szlak / Ruiny przenoszą widok. Ekwipunek zakłada się kliknięciem; na komputerze działa również przeciąganie do odpowiedniego pola.

## Zawartość tej wersji

- Jedna nowa mapa, wspólna paleta i atlas 24 grafik z przezroczystością.
- Rycerz, Mag, Łowca, Berserker i Tropiciel, po cztery umiejętności.
- Sześć rodzajów przeciwników oraz sześć wariantów elitarnych, w tym Przebudzony Strażnik. Sekwencja tur, zapowiedzi, efekty statusu i okazje do kontrataku.
- Trzy etapy fabuły, trzy imienne zlecenia, bestiariusz, śledzenie celów, zbieranie składników, skrzynia patrolu oraz powtarzalne kontrakty Straży.
- Broń i pancerze wpływające na statystyki; pięć rodzajów bonusów na konkretnych egzemplarzach, relikt, ulepszenia, wybór bonusu u kowala i porównywanie wyposażenia. Gwarancja sprzętu z bonusem najpóźniej w czwartym kolejnym zwycięstwie nad elitą bez takiego łupu.
- Plecak z limitem 36 miejsc. Stosy zużywają jedno miejsce; wyposażone rzeczy w tej alfie pozostają w plecaku.
- Karczma, kowal, alchemiczka i lokalna Straż. Kupowanie oraz sprzedaż z ilością, warzenie mikstur.
- Zapis lokalny, eksport/import postaci oraz regeneracja życia i many poza walką, także po zamknięciu gry.
- Dobrowolny spacer GPS: za 250 m dodatkowe 3 zioła i 12 złota. Dokładne współrzędne są używane jedynie do bieżącego pomiaru, nie trafiają do zapisu gry.
- Zasoby potrzebne do gry są buforowane po poprawnym pierwszym załadowaniu przez service worker, jeśli przeglądarka na to pozwala. Czyszczenie danych przeglądarki usuwa także zapis; warto go eksportować.

## Granice prototypu

Pierwszy rozdział zaprojektowano na poziomy 1–5, a polowania na elity i zlecenia rozszerzają rozwój do okolic poziomu 8. Limit poziomu 20 pozwala dalej testować rozwój, ale nie oznacza kompletnej zawartości na te poziomy. Nie ma jeszcze serwera MMO, PvP, wymiany między graczami, rozbudowy miasta, systemu strzał, staminy ani pełnej biblioteki dawnych zadań. Kontrakty Straży nie udają gildii innych graczy. GPS nie jest systemem zabezpieczenia rywalizacji.

Warianty poziomów broni i pancerza używają wspólnego rysunku danej rodziny, a rzadkość odróżnia ramka oraz opis. Grafiki postaci mają animacje interfejsu; nie są jeszcze wieloklatkowymi zestawami ruchu w czterech kierunkach. Wnętrza usług są panelami z grafikami, nie kompletnymi scenami ze sprzedawcami za ladą.

Zapis 3.9.9.8 pozostaje osobno. Ta wersja nie importuje postaci 3.9.9.8. Zapis pixel 4.0 jest zgodny i migruje automatycznie, bez resetowania bohatera. Nowe zapisy używają kluczy `time4heroes.pixel.v1.<klasa>` i są lokalne dla urządzenia oraz adresu gry.

## Kod i sprawdzenie

- `dist/engine.js`: stan gry i reguły, niezależne od ekranu.
- `dist/data.js`: klasy, przedmioty, przeciwnicy, miejsca i zadania.
- `dist/app.js`, `dist/style.css`: interfejs, mapa i animacje.
- `dist/atlas.js`: prostokąty pełnych sylwetek w arkuszu grafik.
- `tests/`: testy silnika, przejście rozdziału i testy kontrolera z uproszczonym DOM.
- `ART_DIRECTION.md`: zasady spójności grafiki.

Testy: `node --test tests/*.test.mjs` (Node 22 lub nowszy). Sprawdzono 76 testów, w tym 50 symulowanych przejść rozdziału i 100 walk przygotowanych postaci pięciu klas z Przebudzonym Strażnikiem. To weryfikuje możliwość przejścia, nie zastępuje oceny przyjemności ani ostatecznego balansu przez graczy.

Nie wykonano testu wizualnego w przeglądarce, na iPhone/Android ani spaceru GPS w terenie. Testy kontrolera nie renderują strony. Te kontrole pozostają kolejnym etapem weryfikacji.
