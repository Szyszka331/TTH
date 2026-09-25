# Time4Heroes 3.9.0 — Stabilna Przygoda

Aktualizacja przesłanej wersji 3.8.0. Gra nadal działa jako statyczna aplikacja na GitHub Pages; nie wymaga serwera aplikacyjnego ani instalowania pakietów do uruchomienia.

## Uruchomienie i aktualizacja

1. W dotychczasowej grze wybierz Menu → Eksportuj, jeśli chcesz zachować również plik kopii postaci.
2. Rozpakuj ZIP i wgraj jego zawartość do tego samego katalogu repozytorium, z którego działa GitHub Pages. Plik `index.html` powinien pozostać na dotychczasowym poziomie.
3. Otwórz grę ponownie. Przy zachowaniu tej samej przeglądarki i adresu zapis 3.8.0 jest automatycznie migrowany do 3.9.0.
4. Strzałki są teraz w Menu → Otwórz kopię do testów. Powstaje osobny zapis skopiowanej postaci. W tym samym miejscu wrócisz do głównej przygody GPS.

Nie opublikowano automatycznie zmian w repozytorium — paczka jest gotowa do wgrania.

## Naprawy

- Zakupy i oferty kupca sprawdzają pojemność plecaka przed pobraniem złota. Istniejące, niepełne stosy są prawidłowo uwzględniane.
- Crafting uwzględnia miejsce zwalniane przez zużyte składniki. Brak miejsca nie zabiera materiałów ani opłaty.
- Wyjmowanie run i rozbieranie sprzętu sprawdzają miejsce na rezultat. Nie można sprzedać założonego przedmiotu ani zdjąć go do pełnego plecaka.
- Zaznaczone łupy, które się nie mieszczą, pozostają na ekranie wyników. Można odznaczyć część przedmiotów. Brak miejsca nie zamyka ekranu i nie usuwa wybranych nagród.
- Zapis obejmuje walkę, fazę tury, loch, jego mapę i termin zakończenia oraz nieodebrane łupy. Odświeżenie strony przywraca sesję. Czas wyprawy nadal płynie podczas zamknięcia aplikacji; ekran łupów zachowuje dotychczasową pauzę.
- Czynności z wieloma zmianami zapisują końcowy stan zamiast pośrednich etapów. Stary callback tury nie może uderzyć w nowym starciu.
- Błąd zapisu w przeglądarce pokazuje komunikat zamiast przerywać kod gry. Uszkodzone dane sesji w imporcie są sprawdzane.
- Pora codziennego resetu korzysta z lokalnej daty urządzenia.

## Walka i telefon

- Trzy przyciski: mikstura życia, większa mikstura życia, mikstura many.
- Wypicie zajmuje turę; pełne HP lub mana nie zużywają mikstury. Komunikat podaje rzeczywiście odzyskaną wartość.
- Przyciski na małych ekranach pokazują liczbę sztuk, koszt many i odnowienie umiejętności. Wskazówka przygotowywanego ataku bossa pozostaje widoczna.
- Dziennik walki jest rozwijany. Na telefonie przyciski akcji są przed dziennikiem.

## GPS i testy

- Interakcje terenowe wymagają aktualnego GPS z dokładnością do 50 m. Nowa próbka starsza niż 15 sekund jest odrzucana, a pozycja starsza niż 30 sekund nie uprawnia do interakcji.
- Duże skoki pomiędzy kolejnymi próbkami są filtrowane. Jest to filtr jakości lokalizacji, nie zabezpieczenie serwerowe przed oszukiwaniem.
- Domyślnie główna przygoda korzysta z GPS. Testy strzałkami i symulacja nocy działają w osobnej kopii postaci.
- Pliki eksportu wskazują GPS lub TEST. Zapis oznaczony jako testowy nie jest importowany do głównej przygody.
- Migracja zachowuje dotychczasowy postęp; nie da się ustalić, jaka jego część powstała w starym trybie testowym.

## Grafiki i czytelność

- Każda ze 153 definicji przedmiotów ma dostępny plik SVG bez emoji. Zestaw korzysta z powtarzalnych motywów kategorii, więc nie są to 153 unikalne ilustracje malarskie.
- Zachowano istniejące malowane atlasy przedmiotów oraz tła i potwory. Przedmioty poza atlasem korzystają z ikon wektorowych; uzupełniono siedem brakujących ikon.
- Ikony są używane także w łupach, bestiariuszu i składnikach receptur. Dodano subtelne oznaczenia rzadkości oraz tonacje zestawów.
- Ekran społeczności nie pokazuje fikcyjnych graczy. Katalog kupca nie jest opisywany jako trwająca licytacja.
- Nazwa biomu w górnym pasku odpowiada aktualnemu biomowi, zamiast stałej nazwy lasu.
- Service worker nie usuwa cache innych aplikacji i nie zwraca strony HTML w miejsce brakującego kodu JS/CSS.

## Weryfikacja

`node tests/regression.mjs` — 32 testy logiki: transakcje, stosy, mikstury, zapis i wznowienie, odbiór łupów, GPS, oddzielenie testów, migracja i obecność ikon.

Sprawdzono składnię JavaScript, odnośniki do lokalnych zasobów i pliki SVG. Obejrzano zestawienie nowych ikon.

Nie przeprowadzono pełnego testu w przeglądarce ani spaceru z telefonem: w środowisku wykonania zabrakło działającej przeglądarki, a jej pobranie się nie powiodło. Testy używają symulowanego DOM i próbek GPS; nie potwierdzają wizualnego układu na urządzeniu.

## Nadal do rozwoju

Gra jest jednoosobowym prototypem. Konta, synchronizacja, prawdziwe gildie, drużyny, PvP i handel między graczami wymagają osobnego backendu. Nie zostały dodane w tej aktualizacji. Pogoda i siedliska są symulowane. Zadania kończą się na wymaganym poziomie 50 przy limicie rozwoju 100. Część broni nadal współdzieli ilustracje atlasowe, a starsze postacie i nowe tła pozostają stylistycznie zróżnicowane.

---

## Historia wcześniejszej paczki

# Time4Heroes 3.8.0 — Klimatyczne Lokacje

## Nowości w 3.8.0

- Walki otrzymały pięć pełnych, malowanych scenerii zależnych od aktualnego biomu: łąkę, las, ruiny i cmentarz, bagno oraz skaliste wyżyny.
- W lochach używana jest mroczniejsza sceneria ruin, a noc, mgła, deszcz i burza dodają własną warstwę atmosferyczną.
- Sklep kupiecki, kuźnia, pracownia alchemiczna, dom aukcyjny i Sala Gildii mają nowe, spójne wnętrza w ciemnym stylu fantasy.
- Tła są pozbawione przypadkowych postaci; właściwy NPC jest teraz nakładany osobno wraz z podpisem, więc ekran pozostaje czytelny.
- Nowe grafiki działają również na telefonie, dopasowując kadr do pionowego ekranu bez zasłaniania paneli usług.

## Nowości w 3.7.0

## Nowości w 3.7.0

- Każdy z 117 gatunków może wystąpić w 5 odmianach: zwykłej, młodej, zahartowanej, skażonej i pradawnej — łącznie 585 wersji spotkań.
- Odmiany zmieniają rozmiar i kolor stworzenia, HP, atak, XP, złoto oraz mnożnik jego podstawowej tabeli łupów.
- Rzadkie wersje mają dodatkowe materiały: Znak Zahartowania, Skażoną Esencję i Pradawny Relikt.
- Pradawne osobniki są bardzo rzadkimi mini-bossami, ale nie pojawiają się z pełną siłą na początku gry.
- Bestiariusz zapamiętuje osobno pokonane odmiany każdego gatunku i pokazuje kolekcję 0–5 wraz z mnożnikami statystyk.
- Warianty są oznaczone na mapie i mają odrębne efekty wizualne w walce.

## Nowości w 3.6.0

- Berserker może jawnie wybrać dla jednoręcznej broni rękę główną albo drugą rękę — także na telefonie, bez przeciągania.
- Druga broń daje 45% swoich obrażeń; statystyki, ulepszenia, afiksy, runy i zestawy są uwzględniane bez dublowania jednego egzemplarza.
- Dodano 4 goblińskie role: Zwiadowcę, Wojownika, Maga i Czempiona, z innymi poziomami, statystykami oraz słabościami.
- Każda odmiana goblina ma osobną tabelę łupów i unikalne materiały: mapy zwiadowców, puklerze wojowników, fokusy magów i sztandary czempionów.
- Kontrakty oraz zadania na gobliny zaliczają wszystkie odmiany, a ich składy zależą od poziomu bohatera.
- Gobliny otrzymały czytelne warianty wizualne i oznaczenia roli na mapie, w walce i bestiariuszu.

- Avatar wybranej klasy płynnie przesuwa się pomiędzy kolejnymi punktami GPS zamiast przeskakiwać.
- Podczas ruchu postać wykonuje animację kroków z kołysaniem sylwetki, cieniem i drobnym pyłem spod stóp.
- Kierunek jest wyliczany z kolejnych pozycji GPS albo z czujnika kierunku telefonu.
- Postać odwraca się w lewo lub w prawo i pokazuje wskaźnik kierunku marszu.
- Szybszy ruch uruchamia dynamiczniejszą animację, a zatrzymanie GPS automatycznie uspokaja postać.
- Animacja działa także podczas poruszania strzałkami w trybie testowym.
- Ustawienie systemowe „ogranicz ruch” wyłącza animacje dla osób, które tego potrzebują.

## Zmiany z wersji 3.4.0

- Moby nie są już przywiązane do miejsca pierwszego uruchomienia gry.
- Świat został podzielony na sektory GPS 700 × 700 m; wejście do nowego sektora generuje populację w bieżącej okolicy i ośmiu sąsiednich sektorach.
- Każda lokalna populacja liczy do 126 potworów i jest deterministyczna dla danego dnia oraz miejsca.
- Zabite potwory zachowują pięciominutowy czas respawnu także po wyjeździe z sektora i powrocie.
- Dodano 12 miejsc występowania: łąki, lasy, pola, bagna, brzegi wody, cmentarze, kaplice, ruiny, jaskinie, wzgórza, obrzeża osad oraz drogi i rozstaje.
- Gatunki są dobierane według siedliska i poziomu gracza; po zmianie miejscowości gra automatycznie tworzy nową lokalną populację.
- Jeżeli GPS był aktywny przy zamknięciu gry, uruchamia się ponownie po następnym otwarciu i od razu sprawdza nową okolicę.
- Siedliska są widoczne na mapie jako oznaczone obszary, a bestiariusz pokazuje miejsca występowania każdego poznanego potwora.

## Zmiany z wersji 3.3.0

- Odnaleziono 61 grafik potworów, które były w paczce, ale nie występowały jako osobne gatunki w grze.
- Wszystkie 61 stworzeń dodano do danych, bestiariusza i pul losowania na mapie — gra zawiera teraz 114 gatunków.
- Każdy odzyskany potwór ma nazwę, rodzinę, zakres poziomów, strefę, słabość, biom, statystyki i tabelę łupów.
- Powstały cztery nowe, spójne atlasy 4×4 z poprawionymi grafikami odzyskanych stworzeń.
- Potwory rozłożono między pięć regionów oraz właściwe biomy; zapis z 3.2.0 automatycznie odświeża ich spawny.
- Liczba codziennie generowanych mobów wzrosła ze 118 do 150.

## Zmiany z wersji 3.2.0

- Nowy, oryginalny atlas broni, tarcz, pancerzy, łuków, kosturów, mikstur i biżuterii.
- 12 podstawowych przeciwników otrzymało spójne, szczegółowe grafiki do mapy, walki i bestiariusza.
- Dodano 12 nowych gatunków potworów z własnymi poziomami, słabościami i tabelami łupów.
- Liczba codziennie generowanych mobów wzrosła z 92 do 118.
- Nowe potwory zostały rozłożone między biomy, regiony oraz zielone, żółte, czerwone i czarne strefy.
- Domyślne przybliżenie mapy GPS jest teraz o jeden poziom bliższe.

- Sklep, kuźnia, alchemik i aukcje mają nowy układ inspirowany ekranami RPG.
- Towary pokazują duże ikony, rzadkość, statystyki, cenę i dostępność zakupu.
- Kuźnia otrzymała wizualny tor ulepszeń, gniazda run oraz osobny katalog receptur.
- Alchemik pokazuje stan każdego składnika i od razu sygnalizuje gotowe receptury.
- Aukcje mają gabloty ofert dnia, a sala gildii — rangę, pasek reputacji i sztandar.
- Wnętrza nadal korzystają z pełnoekranowych ilustracji oraz działają na telefonach.

- Dynamiczne wydarzenia mają sceny, wybory, ryzyko i możliwe walki.
- Pogoda oraz pora dnia tworzą rzadkie spotkanie odnawiane co kilka godzin.
- Każdy biom daje realny efekt w walce, łupach albo nagrodach z wydarzeń.
- Decyzje fabularne mogą utworzyć późniejsze spotkanie na mapie.
- Sceny po etapach questów i walkach uruchamiają się automatycznie.
- Walka pokazuje kolejno atak gracza, obrażenia i kontratak przeciwnika.
- Granice i kolory biomów pozostają widoczne, ale nazwy nie zaśmiecają mapy.
- Zapis z builda 3.1.1 migruje automatycznie i odświeża dzienne spawny.
