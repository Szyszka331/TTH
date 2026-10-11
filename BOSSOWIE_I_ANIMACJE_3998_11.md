# Time4Heroes 3.9.9.8.11 — bossowie i animacje walki

Pełna paczka oparta na zweryfikowanej wersji 3.9.9.8.10. Obejmuje punkt dotyczący bossów, ich przygotowania i nagród oraz animacje walki. Zachowuje wszystkie wcześniejsze pliki graficzne, zapis postaci, questy, ekwipunek, zakupy i GPS.

## Co widać w grze

- Ruch postaci przy podejściu i ataku, wypad w walce wręcz, lot strzał i zaklęć, reakcja na trafienie, efekty obrony i leczenia, wejście w starcie oraz znikanie pokonanego przeciwnika. Postacie lekko poruszają się także w spoczynku.
- Ruch odbywa się na osobnej warstwie, aby nie przesuwać komórek atlasów i nie zniekształcać proporcji. Efekty wynikają z już rozstrzygniętej tury, nie zadają ponownie obrażeń i nie wydłużają istniejących opóźnień walki. Stary efekt nie odtwarza się od początku po wznowieniu zapisu. Uwzględniono systemowe ograniczenie animacji.
- Przed naturalną Elitą, Herosem i Legendą pojawia się przygotowanie: poziom, wymagany poziom broni, liczba aktualnych części wyposażenia, życie/mana, umiejętności przerywające i strzały. Okno zawiera taktykę, informację o Gniewie oraz podgląd nagrody. Te same wskazówki są w szczegółach odkrytego bossa w bestiariuszu.
- Wskaźniki sprzętu są orientacyjne: nie obliczają szansy wygranej i nie uwzględniają pełnej jakości, run ani ulepszeń. Można podjąć walkę mimo ostrzeżeń. Samo otwarcie okna niczego nie zużywa; potwierdzenie ponownie sprawdza GPS, dystans, dostępność przeciwnika i staminę.

Animacje poruszają istniejącymi ilustracjami i dodają efekty. Nie są nowymi zestawami rysowanych klatek kończyn. Źródłowe grafiki nie zostały ponownie docięte ani przerysowane.

## Zmiany bossów

1. Naturalne bossy na mapie otrzymują statystyki wynikające z rzeczywistego poziomu, rodziny, wariantu i rangi. Usunięto nierówności po wcześniejszym przenoszeniu szablonów na inne poziomy. Przykładem był Władca Burz, którego stara baza dawała nadmiernie wysokie życie dla jego aktualnego poziomu. Statystyki nie dostosowują się do klasy ani siły ekwipunku gracza.
2. Techniki rodzinne i rytuał leczenia mają zapowiedź z pełną turą na reakcję. Umiejętność PRZERWIJ lub przełamanie zatrzymują rytuał. Leczenie bossa wynosi 10% maksymalnego życia; Elita/Heros mogą podjąć dwie próby, Legenda trzy. Przerwana próba też zużywa limit i manę. Wspólny czas odnowienia ogranicza serie kolejnych zapowiedzi.
3. Obrona lub blok zatrzymują odrzucenie i osłabienie wywoływane przez technikę rodzinną. Obrona nadal zmniejsza jej obrażenia. Ciężkie techniki uwzględniają osłabienie przeciwnika i ochronę wynikającą ze sprzętu.
4. Przełamanie zachowuje premię do następnego ataku. Wcześniej nowo nadana podatność potrafiła znikać jeszcze podczas tego samego ciosu.
5. Zamrożony boss zadaje o 8% mniej obrażeń i ma 10% szansy utraty akcji. Zwykli przeciwnicy zachowują dotychczasowe silniejsze działanie lodu. Przerwanie zapowiedzianej techniki nadal działa.
6. Naturalny Heros/Legenda zyskuje Gniew po 20 akcjach bohatera: od 21. akcji atak rośnie o 8 punktów procentowych na akcję, maksymalnie do +80%. Jest licznik i ostrzeżenie przed walką. Liczą się również akcje, po których boss jest ogłuszony. Zasada jest wspólna dla wszystkich klas i zwiększa znaczenie broni w przeciągających się starciach. Elity i osobne rajdy nie mają tej dodatkowej reguły.
7. Zapowiedziana technika, zapłacona mana, wykorzystane próby leczenia, czas odnowienia i Gniew zachowują się w zapisie po zamknięciu gry.

Nowa bazowa krzywa statystyk, Gniew i opisane niżej nagrody dotyczą naturalnych bossów na mapie. Osobne starcia fabularne, lochy, rajdy i wydarzenie bossa świata zachowują swoje krzywe bazowe i nagrody. Korzystają jednak ze wspólnych poprawek technik, przełamania, ograniczeń leczenia i odporności bossów na zamrożenie, gdy mają zastosowanie. Nie wykonano pełnego ponownego strojenia wszystkich tych trybów.

## Nagrody

- Naturalne bossy zawsze dodają 1–2 odłamki runy do łupów do odebrania. Pozostałe przedmioty nadal są losowane według istniejących zasad rangi; nie dodano sprzedaży rzadkich łupów w zwykłym sklepie.
- Minimalne bazowe XP zależy od poziomu i rangi: 10% progu poziomu dla Elity, 16% dla Herosa, 24% dla Legendy. Jeżeli dotychczasowa nagroda jest wyższa, zostaje wyższa wartość. Biom może zwiększyć XP.
- Złoto ma minimalną wartość zależną od poziomu/rangi. W oknie przygotowania widać jego przedział oraz bazowe XP. Nagroda za cel ponad 5 poziomów słabszy maleje o 6 punktów procentowych na kolejny poziom przewagi, do minimum 15% bazowej wartości; dotyczy XP i złota.
- Nagrody nie można pobrać drugi raz. Zajęty plecak korzysta z istniejącego odbioru łupów po walce.

## Wyniki balansu

W pełnym porównaniu odtworzono 7 920 walk wersji .10 i 7 920 walk końcowej .11: 32 szablony rangowanych bossów, 33 zestawienia poziomów (oba krańce zakresu, gdy różne), pięć klas, dwa zestawy wyposażenia, po trzy legalne zestawy umiejętności i osiem ustalonych losowań. W tych próbach nie było nierozstrzygniętych walk po limicie 100 akcji.

Dodatkowo dla czterech Legend zamrożono wybór najlepszego zestawu umiejętności z pierwszej serii i wykonano po 640 walk każdej wersji na 16 innych losowaniach. Poniższe wyniki pochodzą wyłącznie z tej dodatkowej serii. Każda komórka obejmuje 64 walki. Nie wybierano zestawów ponownie na podstawie tych wyników.

| Klasa | .10 sklep/kowal | .11 sklep/kowal | .10 zestaw klasowy | .11 zestaw klasowy |
|---|---:|---:|---:|---:|
| Rycerz | 46,9% | 18,8% | 85,9% | 81,2% |
| Mag | 89,1% | 29,7% | 100,0% | 93,8% |
| Łowca | 51,6% | 15,6% | 92,2% | 81,2% |
| Berserker | 100,0% | 40,6% | 95,3% | 96,9% |
| Tropiciel | 68,8% | 6,2% | 82,8% | 75,0% |

Warunki: ten sam poziom gracza i bossa, pełne początkowe życie/mana, wystarczająca liczba strzał, brak mikstur, ulepszeń i sojuszników. „Sklep/kowal” to sześć zwykłych części dla klasy i poziomu; „zestaw klasowy” dodaje dostępne klasowe części/akcesoria i zachowuje zwykłą broń. Obie wersje używają tej samej heurystyki reagowania na zagrożenia.

W .11 każda klasa wyraźnie zyskuje na komplecie klasowym. Przewaga Maga w podstawowym sprzęcie spadła, a Legendy są trudniejsze. Mag nadal dobrze radzi sobie z podtrzymywaniem życia, Berserker z szybkim zadawaniem obrażeń. Różnice między klasami pozostały: to strojenie PvE i przygotowania, nie dowód idealnego balansu. Wyniki nie zastępują prób graczy; dotyczą jednej strategii automatycznej, małej liczby bossów legendarnych i opisanych konfiguracji. Nie są oceną PvP ani współpracy online.

W pierwszej, ośmiolosowaniowej serii najlepsze z badanych konfiguracji z aktualnym zwykłym sprzętem wygrywały wszystkie spotkania z Elitami; zestawy klasowe wygrywały wszystkie spotkania z Herosami. Jest to orientacyjny punkt odniesienia dla przygotowanej postaci, a nie gwarancja dla dowolnego gracza.

## Weryfikacja i aktualizacja

- 396 kontroli regresji funkcji gry i modelu DOM, w tym scenariusze każdego z pięciu klasowych przerwań, obrony przed odrzuceniem, zachowania zapisu, limitów leczenia, Gniewu, podglądu nagród i braku powtórnego naliczania obrażeń przez animacje.
- 8 kontroli instalacji i pamięci podręcznej; sprawdzenie składni app.js, data.js i sw.js.
- 8 560 walk końcowej .11 i 8 560 walk bazowej .10 łącznie z dodatkową serią walidacyjną. Raporty są w katalogu tests.
- Nie wykonano testu w pełnej przeglądarce ani na fizycznym telefonie. Płynność, kadry i układ animacji wymagają oceny na urządzeniu.

Wgraj pełną zawartość archiwum pod dotychczasowy adres HTTPS, otwórz grę online i wybierz „Zapisz i aktualizuj”. Sprawdź numer 3.9.9.8.11. W razie starej wersji zamknij wszystkie okna gry oraz zainstalowaną aplikację i otwórz ponownie online. Nie kasuj danych witryny: zawierają lokalny zapis postaci. Rozpoczęta wcześniej walka zachowuje zapisane statystyki przeciwnika; nowe spotkania używają nowych zasad poziomów.

Raporty: tests/boss-before-399811.json, tests/boss-after-399811.json, tests/boss-legends-before-validation-399811.json, tests/boss-legends-after-validation-399811.json. Audyt można odtworzyć przez node tests/boss-balance.mjs wynik.json; T4H_BALANCE_ROOT wskazuje osobny katalog wcześniejszej wersji. BOSS_AUDIT_RANKS=Legenda, BOSS_AUDIT_LOADOUTS=poprzedni-raport.json, BOSS_AUDIT_SEEDS=16 i BOSS_AUDIT_SEED_OFFSET=100 odtwarzają dodatkową serię z ustalonymi zestawami.

Rozszerzenie końcówki gry 90–100, pełny serwer MMO i przebudowa źródłowych ilustracji pozostają odrębnymi zadaniami.
