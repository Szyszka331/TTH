# Time4Heroes 3.8.1 — Miasto i sklepy (prototyp)

## Jak wypróbować

1. Otwórz `index.html` przez lokalny serwer HTTP albo host HTTPS, uruchom grę i przejdź do zakładki **Miasto**.
2. Na komputerze kliknij **Wypróbuj miasto (30 min)**, aby sprawdzić budynki i sklepy bez GPS. Dostęp próbny działa tylko na komputerze w trybie demonstracyjnym.
3. Na telefonie włącz GPS i wybierz **Ustaw miasto tutaj**. Strefa ma promień 200 m; wejście do usług wymaga aktualnej dokładnej pozycji wewnątrz niej. Centrum można przenieść raz na 30 dni.
4. Rozbuduj budynek na komputerze po potwierdzonej wizycie w strefie. Ulepszenia dają zniżki na zakupy, ulepszanie, warzenie i posiłki albo dodatkową reputację w gildii.

Wersja ZIP przechowuje zapis wyłącznie lokalnie w przeglądarce. Telefon i komputer **nie synchronizują się automatycznie**: aby używać tego samego miasta i bohatera na obu urządzeniach, wyeksportuj zapis w **Menu → Eksportuj**, a potem zaimportuj na drugim urządzeniu. Potwierdzenie wizyty daje dostęp do usług na komputerze przez cztery godziny od ostatniej wizyty zapisanej w pliku. Do automatycznej synchronizacji potrzebny będzie serwer i konto gracza.

## Zmiany 3.8.1

- Selma, Ragor, Ilyra, Varo i Edrin stoją za elementami wystroju swoich lokacji. Lada albo stół zasłania dolną część postaci, a przyciski rozmowy i usług nadal działają.
- Wszystkie 153 zdefiniowane przedmioty mają własny plik SVG. Ikony są używane w sklepie, ekwipunku, łupach, recepturach i bestiariuszu.
- Sklep Selmy zawiera katalog dla każdej z pięciu klas, filtry kategorii, wymagany poziom, cenę, informację o braku miejsca w plecaku i sprzedaż łupów z plecaka.
- Część egzemplarzy sklepowych ma dodatkowe premie do Siły, Zręczności, Inteligencji albo Witalności. Zwykłe egzemplarze nie dostają losowej premii po zakupie. Premie zwiększają wartości pokazywane przy postaci i parametry walki.
- Miasto można utworzyć z telefonu w obszarze GPS; na telefonie widać strefę na mapie i dostęp do usług, a na komputerze rozbudowę budynków. Tryb próbny na komputerze nie potwierdza wizyty GPS.
- Zapis z 3.8.0 migruje przy pierwszym uruchomieniu; wersja 3.8.1 zapisuje się pod osobnym kluczem.

---

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
