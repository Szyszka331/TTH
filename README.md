## 3.9.9.8.5 — Przenoszenie fabuły, zakupy i odnawiane zlecenia

Pełna paczka gry z grafikami, oparta na wersji 3.9.9.8.4. Zachowuje dotychczasowy zapis postaci.

- **Fabuła:** przy fizycznym celu w Zadaniach i panelu mapy jest przycisk „Kontynuuj tutaj”. Świeży GPS przenosi nieukończony cel w okolice gracza i zachowuje postęp. Kolejne etapy nowych zadań powstają w aktualnej okolicy; starsze aktywne zadanie można przenieść tym przyciskiem. Cele nie przesuwają się przy każdym kroku. Już odblokowane lochy zachowują położenie i dostęp z Wypraw.
- **Miasto:** przed postawieniem gra wyjaśnia zasięg usług 180 m, zmianę lokalizacji raz na 30 dni i niezależność fabuły od miasta. Rozpoczęcie gry w pracy nie wymaga rozgrywania tam całego wątku.
- **Zakupy:** sklep, kowal, alchemik i aukcje korzystają z potwierdzenia z ilością, przyciskami − / + / Maks. i łączną ceną. Limit uwzględnia złoto i wolne miejsce. Sprzęt i pojedyncze aukcje nadal mają limit jednej sztuki; mikstury, materiały i receptury można kupować partiami. Receptury pokazują sumę zakupionych użyć. Sprzęt zachowuje porównanie z wyposażeniem.
- **Przewijanie:** po kupnie lub sprzedaży odświeża się zawartość sklepu z zachowaniem jego okna i przewinięcia. Na telefonie potwierdzenie zakupu nie otwiera automatycznie klawiatury.
- **Tablica w karczmie:** niedokończone zlecenie można anulować na tablicy, w dzienniku lub panelu mapy. Po anulowaniu jego cele znikają. Po odebraniu nagrody lub anulowaniu pojawia się nowa oferta, bez czekania do następnego dnia. Przyjęte zlecenia nie wygasają o północy. Nagrodę można odebrać tylko raz.
- **Mapa:** bohatera zastępuje wyraźna kropka ze strzałką. Przycisk 🧭 włącza kompas; niektóre telefony poproszą o zgodę. Przy poprawnym odczycie strzałka pokazuje kierunek telefonu. Bez kompasu wskazuje ostatni kierunek przemieszczania, z etykietą „Kierunek ruchu”; przed pierwszym odczytem lub ruchem strzałka jest ukryta. Odmowa zgody na kompas nie wyłącza GPS.
- **Bohater:** pasek doświadczenia pokazuje obecne XP, próg awansu i dokładną liczbę XP brakującą do następnego poziomu. Na poziomie 100 pokazuje osiągnięty limit.

Aktualizacja: rozpakuj całe archiwum i zastąp pliki pod dotychczasowym adresem HTTPS. Otwórz grę ponownie; ekran powinien pokazać Build 3.9.9.8.5. Nie czyść danych strony — tam znajduje się lokalny zapis. Zmieniono wersję pamięci podręcznej i adresy plików aplikacji.

Weryfikacja: `node --check app.js`, `node --check data.js`, `node --check sw.js` oraz `node tests/regression.mjs` — **269 kontroli**. Testy obejmują model DOM, zakupy i sprzedaż w trzech sklepach, bilans transakcji, zlecenia, przenoszenie celów oraz symulowane odczyty GPS i kompasu. Nie przeprowadzono pełnego testu w przeglądarce ani gestów i czujników na fizycznym telefonie.

## 3.9.9.8.4 — GPS w przeglądarce

Wersja zawiera poprzednią poprawkę przewijania i nową obsługę lokalizacji.

- Mapa pokazuje przybliżoną lokalizację osobnym punktem i obszarem dokładności. Dopiero świeży odczyt do 50 m ustawia bohatera, kotwiczy świat i zalicza postęp. Przybliżony odczyt nie odkrywa miejsc, nie zalicza kroków ani nie odblokowuje walk lub usług miasta.
- Pierwszy odczyt korzysta z szybkiego ustalenia lokalizacji, a równolegle działa dokładne śledzenie. Timeout lub chwilowy brak sygnału nie kończy śledzenia.
- Przycisk „Do mnie” / ◎ uruchamia lokalizowanie, jeśli GPS był wyłączony. Status na mapie otwiera pomoc i ponowienie próby; pomoc jest także w Menu.
- Gra osobno wyjaśnia brak zgody, brak HTTPS, brak obsługi lokalizacji oraz blokadę w osadzonym widoku. Nie zmienia ustawień uprawnień użytkownika.
- Po powrocie z tła GPS wznawia się, jeśli był włączony. Wyłączenie GPS, zmiana postaci i ponowienie żądania unieważniają spóźnione odczyty z poprzedniej sesji.
- Wersja i pamięć podręczna zostały zaktualizowane. Zapisy postaci pozostają zgodne.

Uruchomienie: opublikuj całą zawartość paczki pod dotychczasowym adresem gry HTTPS, otwórz ten adres, kliknij 📍 lub ◎ na mapie i zezwól na lokalizację. Lokalizacja urządzenia i uprawnienie przeglądarki również muszą być włączone. W przeglądarce wewnątrz komunikatora użyj opcji „Otwórz w przeglądarce”, jeśli lokalizacja jest blokowana. Na komputerze odczyt może być mniej dokładny niż na telefonie.

Weryfikacja: `node --check app.js` oraz `node tests/regression.mjs` (239 kontroli, w tym symulowane próbki, błędy GPS i wywołania mapy). Nie przeprowadzono testu na fizycznym telefonie ani pełnego testu w przeglądarce.
Dokumentacja interfejsu: https://www.w3.org/TR/geolocation/ .

## 3.9.9.8.3 — Poprawka przewijania przesłanej wersji 3.9.9.8

Poprawka została nałożona bezpośrednio na przesłany plik Time4Heroes_3998_FABULA_WALKA_GRAFIKI.zip.

- Na telefonie blokada przewijania dotyczy tylko widoku mapy, a nie całej strony.
- Ekrany tworzenia bohatera i wprowadzenia zwalniają blokadę mapy, również przy tworzeniu kolejnej postaci.
- Zmieniono identyfikator pamięci podręcznej, aby przeglądarka pobrała poprawione pliki po aktualizacji.
- Pozostała zawartość i mechanika pochodzą z przesłanej wersji 3.9.9.8.
- Testy: node tests/regression.mjs. Nie przeprowadzono testu gestem na fizycznym telefonie.

## 3.9.9.8 — Fabuła, walka i ilustracje

- Pierwszy rozdział łączy wilcze tropy, mapę z czarną pieczęcią, kuriera, atak na wioskę i wyznanie Eldrana. Wybory wpływają na późniejsze dialogi, zdarzenia na mapie i przygotowanie do walki. Nagroda za wybór wymagający starcia jest przyznawana dopiero po wygranej; przegrana pozwala spróbować ponownie.
- Starcia fabularne mają cele: osłoń Tarena lub mieszkańców przed zapowiadanym ciosem albo przerwij alarm. Walka pokazuje cel i skutek, a po zwycięstwie zapisuje, czy ktoś został ranny i czy sygnał dotarł do patrolu. Skrócono nadmiernie długie wczesne walki.
- Dodano sześć etapów śledztwa na północy między obozem, wieżą i mokradłami. Rozkazy, jeniec, runy i decyzje prowadzą do kolejnego rozdziału; cele potrzebne do zadań pojawiają się na mapie. Poziomy potworów i wieży dopasowano do kolejności fabuły.
- Usunięto obowiązkowe czekanie na noc lub określoną pogodę w zadaniach o dzwonie, ołtarzu, sanktuarium popiołu i iglicy. Ślady pozwalają dotrzeć do nich także za dnia. Naprawiono liczenie dystansu w zadaniach marszu: decyzja odblokowuje się po pokonaniu pełnej wymaganej odległości.
- Pięć biomów ma nowe malowane tła walki. Dodano portrety Nessy, Tarena, Torena i Eldrana. Sala gildii ma pełną ilustrację Edrina za stołem mapowym zamiast pustego pliku.
- Starsze zapisy zachowują postęp po zmianach w etapach fabuły. Testy: `node tests/regression.mjs` (218 kontroli). Gra pozostaje statyczną aplikacją przeglądarkową; współdzielone konta i handel między graczami nadal wymagają serwera.

## 3.9.9.7 — Wnętrza i NPC

- Sklep, kuźnia, pracownia alchemiczna, dom aukcyjny i sala gildii otrzymały nowe malowane tła z postacią wkomponowaną za ladą, warsztatem, stołem lub mapą. Usunięto nakładany na środek wnętrza sprite, który miał inną skalę i zasłaniał wyposażenie pomieszczenia.
- Selma, Ragor, Ilyra, Varo i Edrin mają czytelne, naturalne proporcje i pozostają widoczni w centralnej części kadru telefonu. Portrety w rozmowie i usługach pokazują tę samą postać co ilustracja wnętrza. Dorian w karczmie również korzysta z kadru swojej istniejącej sceny.
- Aktywne miejsca rozmowy i usług nadal można kliknąć; dopasowano obszary dotykowe do narysowanych postaci i lad. Oryginalne tła pozostają w paczce, a nowe mają osobne pliki `assets/backgrounds/interior-*-3997.webp`.
- Testy: `node tests/regression.mjs` (206 kontroli).

## 3.9.9.6 — Gildia i sklepy

- Sala gildii ma trzy dzienne propozycje kontraktów Edrina; można prowadzić dwa naraz, postęp liczy się za wskazane potwory, a nagrody XP, złota i reputacji odbiera się po wykonaniu. Przyjęty kontrakt pozostaje w zapisie po zmianie dnia.
- Założyciel może przypiąć do trzech potrzeb na materiały. W tej wersji postać przyjmuje zlecenie i przekazuje łupy do lokalnego magazynu gildii; ukończenie daje reputację.
- Sklep kupiecki sprzedaje podstawowy sprzęt bez dodatkowych statystyk dla każdej z pięciu klas na ośmiu progach poziomu. Kuźnia sprzedaje gotowy sprzęt klasowy od Zwykłego do Rzadkiego. Sprzęt z oferty jest jednorazowy na cykl, a nowa dostawa przychodzi co 6 godzin; zwykłe materiały i mikstury można kupować wielokrotnie.
- Alchemik zachowuje pełną ofertę gotowych mikstur, a wyróżniona mikstura zyskuje rabat zmieniający się co 6 godzin. Receptury u kowala i alchemika pokazują źródła każdego składnika.
- Przywrócono dostępność podstawowych materiałów rzemieślniczych w łupach konkretnych potworów, w tym wilczej skóry, pajęczego jedwabiu i kości. Test dostępności sprawdza wszystkie składniki receptur.
- Dom aukcyjny ma codzienną gablotę ośmiu ofert dla klasy i poziomu postaci, wyszukiwarkę, filtr slotów, porównanie z założonym sprzętem i limit jednego zakupu każdego przedmiotu dziennie. Własne aukcje i tablica gildii nadal działają lokalnie; handel oraz zaproszenia między prawdziwymi graczami wymagają serwera.
- Biblioteka grafik obejmuje 1143 osobne pliki WebP przedmiotów, w tym nowe podstawowe zestawy klasowe. Testy: `node tests/regression.mjs` (204 kontrole).

## 3.9.9.5 — Ilustrowany plan miasta

- Zakładka Miasto pokazuje jedną malowaną planszę z sześcioma budynkami: karczmą, sklepem, kuźnią, alchemikiem, domem aukcyjnym i salą gildii. Każdy budynek ma duży obszar do kliknięcia i prowadzi do istniejącego wnętrza oraz usług.
- Na telefonie planszę można przesuwać i powiększać; lista budynków pod planszą pozwala szybko wyśrodkować wybrany obiekt. Niedostępne jeszcze budynki są oznaczone kłódką. Rozbudowa miasta pozostaje pod mapą.
- Grafika `assets/backgrounds/city-map-3995.webp` jest oryginalną ilustracją stworzoną dla Time4Heroes z referencji układu miasta. Przyciski i napisy pozostają osobną warstwą HTML, więc działają również na małym ekranie.

## 3.9.9.4 — Biomy, miasto i kapliczki

- Biomy powstają jako nieregularne płaty o różnych rozmiarach. Ich wagi występowania są niezależne od procentu powierzchni: łąki 40, lasy 28, wzgórza 17, mokradła 10, ruiny 5. To wagi losowania miejsc, a nie gwarantowany podział mapy. Na mapie widać organiczne granice, a potwory są dobierane do biomu w punkcie pojawienia.
- Miasto gracz stawia w wybranym miejscu po uruchomieniu GPS; ma widoczną strefę 180 m. Przeniesienie jest możliwe raz na 30 dni. Na telefonie wejście do usług wymaga bycia w strefie z aktualnym GPS; przeglądarka pozwala zarządzać miastem. Istniejące miasta zachowują miejsce wokół wcześniejszego punktu zakotwiczenia. Kopia testowa pozostaje dostępna bez GPS.
- Na mapie powstają kapliczki o stałych pozycjach. W promieniu 60 m można zapłacić 1 monetę i rzucić raz dziennie przy każdej kapliczce. Orzeł przywraca pełne HP, reszka nie leczy. Wykorzystany rzut zachowuje się w zapisie także po ponownym uruchomieniu gry.

## 3.9.9.3 — Handel, alchemia, łupy i grafiki przedmiotów

- Plecak ma 36 miejsc dla nowych postaci i istniejących zapisów. Wysuwany plecak i ekran bohatera pozwalają przenieść sprzęt na slot wyposażenia; zajęty slot zamienia się z przedmiotem w plecaku.
- Sklep ma regularny asortyment dla pięciu klas na poziomach 1/12/25/40/55/70/85/100. Można włączyć pełną ofertę, porównać statystyki zakładanego przedmiotu z kupowanym i sprawdzić wymagania klasy/poziomu. Trofea unikatowe, heroiczne i legendarne nadal pochodzą z łupów.
- Kliknięcie przedmiotu do sprzedaży otwiera panel „Sprzedaj 1 / cały stos” u kupca, kowala i alchemika. Zakupy, sprzedaż, receptury i rzemiosło zachowują pozycję przewijania okna usługi.
- Alchemik sprzedaje gotowe mikstury życia i many +50/+100/+150/+200 oraz silną miksturę życia +130. Receptury mają ograniczoną liczbę użyć, zużywają znalezione lub zdobyte składniki i są tańsze od gotowych mikstur także po uwzględnieniu wartości materiałów i licencji.
- Regeneracja HP, many i staminy obejmuje czas poza grą (maksymalnie 24 godziny na jedno wczytanie). Postęp jest zapisywany po powrocie.
- 117 potworów ma własne tabele łupów. Naprawiono brakujące i błędnie sklasyfikowane elementy sprzętu, rangi przedmiotów oraz dosłowne placeholdery. Gwarantowany łup Herosa/Legendy wybiera się z jego własnej tabeli; warianty i bossowie mogą dawać osobne premie materiałowe.
- Każdy z 1063 zdefiniowanych przedmiotów ma odrębny plik WebP. Grafiki są wariantami trzech malowanych arkuszy źródłowych. Źródła i skrypt generujący znajdują się w `assets/item-art/source/` i `tools/generate_item_art.py`.
- Uruchom `node tests/regression.mjs`, aby sprawdzić mechanikę. Grafiki można odtworzyć przez `node tests/dump-items.mjs assets/item-art/catalog.json` i `python tools/generate_item_art.py --force`.

## 3.9.9.2 — Szczęście i leczenie Maga

- Dodano piątą podstawową statystykę: **Szczęście (LCK)**. Każda klasa startuje z 3 LCK i może rozwijać je punktami statystyk.
- Każde 10 LCK daje +1 punkt procentowy szansy na krytyk.
- Każde 10 LCK daje +2% względnej premii do szans rzadkiego lub lepszego łupu; statystyka nie dodaje przedmiotów spoza tabeli dropu potwora.
- Runa Szczęścia daje teraz +5 LCK zamiast bezpośredniego krytyka.
- Mag otrzymał umiejętność **Uzdrowienie**: 18 many, 2 tury odnowienia, leczenie skaluje się z Inteligencją.
- Uzdrowienie działa na Maga oraz wybranego żywego sojusznika w walce drużynowej.
- Sojusznicy w rajdach Heros/Legenda mają własne HP, mogą zostać powaleni i po powaleniu przestają atakować.

## 3.9.9.1 — Drop ponad crafting

- Unikatowe (kod `epic`), Heroiczne i Legendarne wyposażenie nie może być wytwarzane u kowala.
- Te trzy klasy jakości pozostają nagrodą z potworów, Elit, Herosów, Legend i odpowiednich aktywności.
- Crafting wyposażenia kończy się na jakości Rzadkiej.
- Każda receptura tworząca Rzadki element wyposażenia wymaga co najmniej jednego materiału jakości Rzadkiej lub wyższej.
- Dawne receptury endgame 80/90/100 na Legendarne EQ są automatycznie usuwane z katalogu kowala.
- Materiały bossowe nadal są wartościowe: służą do run, ulepszeń, enchantu i rzadkiego craftingu, ale nie omijają polowania na bossowy loot.

## 3.9.9.0 — Pełny crafting z materiałów potworów

- Surowce z potworów mają zastosowanie w przetwarzaniu i recepturach.
- 11 półproduktów rzemieślniczych i alchemicznych.
- 15 craft-only przedmiotów klasowych na lvl 25 / 55 / 75.
- Alternatywne receptury mikstur i konwersje materiałów.
- Katalog kowala podzielony na Przetwarzanie / Runy / Broń / Ekwipunek.

## 3.9.8.9 — Runy, enchant, ulepszanie i ekonomia

- 13 run z własnymi efektami bojowymi, ograniczeniami slotów i recepturami u kowala.
- Ulepszanie sprzętu do +5…+10 zależnie od rzadkości; wyższe poziomy wymagają kryształów i odłamków runicznych.
- 8 enchantów zależnych od slotu; przerzut zaklęcia ma 12-godzinne odnowienie.
- Runy i enchanty wpływają bezpośrednio na walkę (blok, unik, trucizna, przełamanie, mana, krytyki itd.).
- Zbalansowano skup, sklep, aukcje, crafting i ogólne szanse na losowy sprzęt.
- Aukcje: 3% opłaty za wystawienie i 7% prowizji po sprzedaży.
- Usunięto aktywne robocze wpisy dropu i dodano konkretne unikaty Rusałki Topieli.

# Time4Heroes 3.9.6.4 — Herosi i Legendy bez blokady drużyny

- Usunięto minimalną liczbę graczy potrzebną do rozpoczęcia walki z Herosem lub Legendą.
- Herosa i Legendę można zaatakować solo; drużyna jest przewagą, a nie wymogiem.
- Poziom Herosa/Legendy nie skaluje się już automatycznie powyżej poziomu gracza, więc można wrócić później i realnie go przepoziomować.
- Karta przeciwnika pokazuje jego poziom, zalecany poziom do próby solo oraz sugerowaną liczebność drużyny.
- Heros: solo celuje w ok. +5 poziomów przewagi; Legenda: ok. +10 poziomów. To zalecenie, nie blokada.
- Zachowano zwiększone HP, manę, regenerację, specjalne ataki, przełamanie i pomoc drużyny.

---

# Time4Heroes 3.9.1 — Plecak i sprzedaż

## Zmiany tej paczki

- Plecak obsługuje ręczne przeciąganie przedmiotów pomiędzy polami, również na telefonie.
- Dodano segregowanie plecaka według typu, rzadkości, nazwy i wartości.
- Pozycje przedmiotów są zapisywane; przeciągnięcie na zajęty slot zamienia przedmioty miejscami.
- Sprzedaż została usunięta z podglądu plecaka i szczegółów przedmiotu.
- Sprzedaż odbywa się u kupca w sklepie; stosy można sprzedawać po jednej sztuce albo w całości.
- Zmieniono wersję cache zasobów, aby GitHub Pages szybciej pobierał nowy JS/CSS po aktualizacji.
- Testy regresji: 51/51.

---

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


## 3.9.6.2
- Maksymalna stamina bohatera: 100.
- Koszt rozpoczęcia walki pozostaje 3 staminy.
- Dzienne limity karczmy pozostają bez zmian: 2 posiłki/napitki i 2 odpoczynki przy kominku.

## 3.9.6.3
- Alchemik sprzedaje gotowe mikstury oraz receptury z ograniczoną liczbą użyć.
- Wytwarzanie z receptur ma niższą opłatę niż kupowanie gotowych mikstur.
- Sala gildii ma szybkie wejścia do kuźni, alchemika i aukcji.
- Dodano lokalny prototyp drużyny 4-osobowej przygotowany pod późniejszy backend multiplayer.
- Dodano grupowych Herosów (min. 2 osoby) i Legendy (min. 4 osoby), dzienne limity, skalowane HP/ATK, pomoc drużyny, osobisty loot i zapis wkładu.


## Build 3.9.6.5 — rozwój gildii
- Wspólny skarbiec gildii i wpłaty złota/materiałów.
- Budynki gildii ulepszane ze skarbca.
- Wieża Zwiadowców 0–10 zwiększa zasięg rozpoczęcia walki z potworami z 60 do maks. 80 m.
- Kuźnia gildii daje do 10% rabatu na złoto przy ulepszaniu.
- Pracownia Alchemika zwiększa liczbę użyć kupowanych receptur.
- Sala Wypraw zwiększa nagrody z Herosów i Legend.
- Rozwój gildii nie zależy od fizycznej lokalizacji członków; backend online może później synchronizować ten sam stan gildii.

## Build 3.9.7.2 — poprawka wielu postaci
- Każdy slot postaci jest teraz niezależnym zapisem i źródłem prawdy.
- Każdy normalny zapis gry trafia jednocześnie do aktywnego slotu i kopii bieżącej postaci.
- Tworzenie nowego slotu nie może nadpisać poprzedniej postaci.
- Przy starcie gra naprawia układ slotów z wersji 3.9.7.1 i próbuje zachować odrębny zapis, jeśli znajdzie go w starej kopii aktywnej postaci.


## Build 3.9.7.3 — gwarantowany pierwszy łup klasowy
- Pierwszy potwór zabity w samouczku zawsze dodaje do ekranu łupu jeden przedmiot dla wybranej klasy.
- Rycerz: Tarcza młodego strażnika. Mag: Kostur pierwszej iskry. Łowca: Łuk młodego łowcy. Berserker: Toporek pierwszej furii. Tropiciel: Kaptur młodego tropiciela.
- Wszystkie przedmioty wymagają poziomu 1 i można je od razu założyć.
- Stary, błędny Kaptur zwiadowcy dla każdej klasy został usunięty z samouczka.


## Build 3.9.7.4 — balans poziomów i próby klasowe
- Przewaga poziomów potwora wzmacnia jego HP/ATK i zmniejsza obrażenia gracza.
- Umiejętności nie są już blokowane poziomem; wymagają prób klasowych + punktów + poprzednich skilli.
- Tropiciel: Leśna pułapka wymaga zabicia 10 Szarych Wilków.


## Build 3.9.7.5 — skalowanie drużynowe
- Poziom Herosa/Legendy pozostaje stały i nie jest uśredniany z poziomem drużyny.
- Każdy członek jest liczony indywidualnie względem poziomu przeciwnika.
- HP Herosa skaluje się: 100/165/220/270% dla 1–4 graczy.
- HP Legendy skaluje się: 100/180/250/320% dla 1–4 graczy.
- XP i nagrody są osobiste; w drużynie bardzo niski poziom lub minimalny wkład ogranicza nagrody, ale solo nie ma kary anty-boost.


## 3.9.7.6 — samouczek przed fabułą
- Nowa postać zaczyna bez aktywnych questów fabularnych.
- 6-krokowy samouczek prowadzi przez mapę, pierwszą walkę, ekwipunek, założenie łupu, umiejętność i karczmę.
- Interfejs podświetla przycisk/element, który trzeba kliknąć.
- Tablica zadań i fabuła odblokowują się dopiero po ukończeniu tutoriala.

## Build 3.9.7.7 — twarda naprawa przełączania postaci
- Zablokowano autosave podczas przełączania slotu, aby `pagehide` / `visibilitychange` nie nadpisywały docelowej postaci starym stanem.
- Slot postaci jest źródłem prawdy; główny klucz zapisu jest tylko lustrem aktywnego slotu.
- Stare identyczne duplikaty utworzone przez poprzedni błąd są scalane do jednego slotu (preferowany jest aktywny slot), a drugi slot zostaje zwolniony.
- Tworzenie nowej postaci nadal zapisuje ją wyłącznie do wybranego pustego slotu.


## Build 3.9.7.8 — wyspecjalizowane Próby Klasowe
- Każda klasa ma własne wyzwania zamiast ogólnego „zabij X potworów”.
- Próby reagują na styl gry: blok, unik, dystans, krytyki, statusy, chowańce, niskie HP, przełamanie bossa i używanie wcześniejszych umiejętności.
- Przykład Tropiciela: Leśna pułapka wymaga wytropienia i pokonania 10 Szarych Wilków.


## Build 3.9.7.9 — natychmiastowe odświeżanie HUD
- HP i mana aktualizują się od razu po użyciu mikstury poza walką.
- Odpoczynek przy kominku natychmiast aktualizuje HP, manę, staminę i złoto w górnym HUD.
- Posiłek u karczmarza natychmiast aktualizuje staminę i złoto.


## Build 3.9.8.0 — balans poziomów + pasek zadań
- Równy poziom gracza i potwora nie ma ukrytych modyfikatorów poziomu.
- Normalne potwory mają minimalne HP/ATK wynikające z ich poziomu, aby walka na równym lvl była pełną wymianą ciosów.
- Przewaga poziomu przeciwnika jest znacznie groźniejsza.
- Zwinięty pasek zadań pokazuje nazwę i bieżący cel.
- Panel zadań na mapie pokazuje również zaakceptowane zlecenia z karczmy.


## Build 3.9.8.3 — powrót do losowych spawnów
- Usunięto przyciąganie mobów, questów i eventów do dróg OpenStreetMap.
- Spawny znów są losowe jak przed wersją 3.9.8.2.
- Pozostałe mechaniki z 3.9.8.1 zostały zachowane.


## Build 3.9.8.4 — własne grafiki broni + regeneracja
- Wszystkie bronie korzystają z osobnych, lokalnych SVG przygotowanych dla Time4Heroes zamiast wspólnego atlasu.
- HP regeneruje 1% maksymalnego życia na minutę poza walką i lochem.
- Mana regeneruje 2% maksymalnej many na minutę poza walką i lochem.
- Stamina regeneruje 1 punkt co 3 minuty poza walką i lochem.
- Regeneracja działa również po powrocie do gry (do 24 h przerwy) i aktualizuje HUD automatycznie.


## Build 3.9.8.5 — bronie pod buildy
- Dodano 61 nowych broni, łącznie 91 broni.
- Progi 7/12/20/28/36/45 mają minimum 3 wybory dla każdej klasy.
- Nowe style: blok, przełamanie, niski HP, krytyki, mana, dystans, statusy, trucizna, chowaniec i unik.
- Sklep dobiera bronie do klasy i poziomu gracza; nowe bronie mogą też wypadać jako loot.

## Build 3.9.8.6 — klasowe zestawy ekwipunku
- Dodano 136 nowych elementów klasowego EQ dla 5 klas.
- Progi zestawów: lvl 12, 28, 45 i 70.
- Każda klasa ma hełm, pancerz, rękawice, buty, amulet i pierścień; Rycerz, Mag, Łowca i Tropiciel mają też własny off-hand.
- Off-hand: Rycerz — tarcza, Mag — fokus, Łowca — kołczan, Tropiciel — zestaw pułapek; Berserker zachowuje dual wield.
- Przedmioty wzmacniają różne buildy: blok, przełamanie, niski HP, krwawienie, mana, dystans, krytyki, oznaczenie, chowaniec, trucizna i unik.
- Dodano bonusy za 2 i 3 części klasowego zestawu.
- Grafiki klasowych elementów są lokalnymi PNG wyciętymi z wygenerowanych arkuszy i są cache'owane przez PWA.
- Gear lvl 12/28/45 trafia do odpowiednich pul dropu, a lvl 70 do puli legendarnej. Legenda gildyjna ma dodatkową szansę na klasowy legendarny drop.


## 3.9.8.7 — dropy 117 potworów
- Poziomy wszystkich 117 potworów zsynchronizowane z kolumną „Docelowy lvl” z dokumentu użytkownika.
- Każdy potwór ma własną tabelę łupów zamiast rodzinnego fallbacku.
- Materiały, EQ, runy, strzały i unikaty z dokumentu są realnymi przedmiotami.
- Brakujące dropy dla Żywiołaków, Demonów i wysokopoziomowych Bestii zostały uzupełnione tematycznie.
- Elity, Herosi i Legendy z dokumentu są traktowane jako walki bossowe; Herosi/Legendy mają lepsze pule losowego EQ.


## 3.9.8.8 — bossowe unikaty i endgame 80–100
- Smok Burzowy i Bazyliszek poprawieni do rangi Legenda zgodnie z tabelą użytkownika.
- 15 nowych endgame'owych broni klasowych na lvl 80 / 90 / 100.
- Pełne zestawy klasowe 80 / 90 / 100 dla 5 klas, z bonusami setów i klasowymi off-handami.
- Nowe materiały: Pieczęć Gryfa, Pieczęć Nawałnicy, Rdzeń Wieczności, Perła Głębin i Serce Bazyliszka.
- Kowal automatycznie pokazuje receptury na endgame EQ i bronie po klasie gracza.
- Ręcznie dopracowane pule Leszego, Jednorożca, Kościeja, Wilkołaka, Krakena, Smoka Burzowego, Bazyliszka, Gryfa, Węża Niebios i Gryfa Nawałnicy.
- Usunięte tekstowe placeholdery typu „dopisz jeszcze kilka” z aktywnych pul dropu bossów.
