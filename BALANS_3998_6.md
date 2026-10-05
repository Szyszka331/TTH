# Balans wszystkich klas — 3.9.9.8.6

**Werdykt: klasy nie są jeszcze dobrze zbalansowane.** Podejrzenie dotyczące Maga jest uzasadnione, ale problem nie ogranicza się do leczenia. Mag łączy duży zapas many, kontrolę przeciwnika i bardzo mocne wyposażenie. Łowca często szybciej kończy walkę, a Tropiciel korzysta z podobnej przewagi Zręczności. Rycerz oraz Berserker mocniej odczuwają koszty podejścia, otrzymanych obrażeń i zużycia many.

To audyt rzeczywistego kodu oraz symulacji PvE. Poprawiono potwierdzone błędy. Poniższe propozycje dalszego strojenia nie zostały automatycznie włączone do gry.

## Ocena każdej klasy

| Klasa | Mocne strony | Główna nierównowaga | Zalecany kierunek dalszych zmian |
| --- | --- | --- | --- |
| Ciężki Rycerz | Tarcza, blok, przerywanie zamiarów, bardzo dobry pancerz zestawu klasowego | Za wolne walki solo i słaba wydajność wielu starć. Sprzęt ma duże znaczenie; test samego miecza i zbroi zaniża ocenę Rycerza. | Wzmocnić korzyść z tarczy i zbliżenia, obniżyć koszt podstawowej rotacji. Sprawdzić kontratak po udanym bloku. |
| Mag | Pewne trafienia zaklęć, duża mana, leczenie, zamrożenie i przerwania | Nadal bardzo uniwersalny po korekcie leczenia. Zestaw klasowy mocno podnosi atak i krytyki; ofensywne zaklęcia mają stałe koszty, gdy pula many szybko rośnie. | Najpierw dostroić koszty częstych czarów, zestawy i dostępność kontroli. Zachować rolę silnego maga o ograniczonej wytrzymałości. |
| Łowca | Szybkie zabójstwa, wielokrotne trafienia, chowaniec i wysoki unik | Zręczność zwiększa jednocześnie obrażenia, celność, krytyki i unik. Wysoka skuteczność ofensywna nie wymaga dużego poświęcenia obrony. | Rozdzielić część korzyści Zręczności lub zastosować malejący przyrost krytyka/uniku. Utrzymać rolę szybkiego strzelca. |
| Berserker | Dwie bronie, dobre obrażenia w zestawie klasowym, krwawienie i furia przy utracie życia | Ryzyko niskiego życia nie zawsze opłaca się względem bezpiecznego ataku z dystansu. Zapas many i konieczność podejścia ograniczają serię walk. | Poprawić ekonomię furii i nagrodę za walkę w zwarciu; rozważyć ograniczone leczenie po dobiciu, bez robienia z niego drugiego Maga. |
| Tropiciel | Trucizna, pułapki, kontrola, chowaniec i wysoki unik | Zręczność daje tę samą szeroką przewagę co Łowcy. Przy limicie uniku zdolności dodatkowo zwiększające unik tracą wartość. | Zachować przewagę w dłuższych walkach i kontroli, wyraźniej oddzielić od szybkiego Łowcy. Sprawdzić wartość pułapek i bonusów po osiągnięciu limitów. |

## Co dokładnie sprawdzono

Końcowy audyt obejmuje **25 440 pojedynczych walk** i **960 prób wypraw po maksymalnie sześć starć**. Liczba wypraw nie oznacza 960 pełnych serii: po porażce próba kończy się wcześniej.

- Pięć klas, poziomy 1, 5, 12, 25, 40, 50, 60 i 80. Wszystkie modele potworów dostępne w rzeczywistym zakresie danego poziomu, a nie dowolnie przeskalowane stworzenia. Zachowano rodziny, odporności i naturalne rangi; bossowie mają flagę elity i jej zdolności.
- Po 16 powtarzalnych ziaren na model, trzy kompozycje umiejętności na klasę oraz dwa warianty wyposażenia. Zwykłych przeciwników i bossów oceniono oddzielnie.
- Wariant „kowal”: sześć faktycznie dostępnych slotów z ostatniego osiągniętego progu sklepu, z tarczą Rycerza, fokusem Maga i drugą bronią Berserkera. Wariant „zestaw”: broń kowala i dostępne elementy `cg_*` właściwej klasy, wraz z biżuterią i premiami zestawu. Na najniższych poziomach zestaw klasowy nie jest jeszcze dostępny, więc oba warianty są takie same.
- Po dwa punkty w główną cechę i jednym w Witalność za poziom, z odpowiadającym im wzrostem życia i many. Chowaniec Łowcy i Tropiciela ma poziom równy około 60% poziomu bohatera.
- Do czterech aktywnych zdolności, poprzedniki i rzeczywisty budżet punktów. Dawne pola `req` służą w audycie jako ostrożne etapy doboru umiejętności; gra nadal odblokowuje zdolności próbami klasowymi.
- Prawdziwe funkcje obrażeń, statusów, wrogich tur i kosztów zasobów. Sterownik korzysta z leczenia, przerywania i oceny korzyści z efektów; nie jest optymalnym graczem. Limit 100 akcji.
- Pełne zasoby przed pojedynczą walką. Bez ulepszeń, run, losowych bonusów instancji, mikstur i regeneracji. Stała łąka za dnia.
- W wyprawach zachowano życie, manę i strzały między walkami. Użyto 32 innych ziaren niż w pojedynczych próbach, rotacji dostępnych zwykłych potworów i kompozycji wybranej według wygranych oraz tempa pojedynczych walk. Bez awansów i odpoczynku. To porównanie tempa ekspedycji, nie obietnica maksymalnej możliwej liczby walk.

Wstępny test samej podstawowej broni i zbroi został zastąpiony szerszym audytem. Szczególnie Rycerz wymaga oceny z właściwą tarczą.

## Przykład: zwykłe potwory na poziomie 25

Sprzęt kowala; po 160 walk w każdym wierszu. Pokazano najlepszą z trzech badanych kompozycji: najpierw wygrane, potem liczba akcji. Wszystkie pięć klas wygrywało ten zestaw, lecz robiły to z różnym kosztem. Akcje obejmują podejście, obronę i użycie umiejętności.

| Klasa | Akcje na walkę | W tym podejścia | Pozostałe życie | Zużycie całej puli many | Strzały |
| --- | ---: | ---: | ---: | ---: | ---: |
| Ciężki Rycerz | 5,79 | 2,21 | 84% | 49% | 0,00 |
| Mag | 2,56 | 0,00 | 94% | 12% | 0,00 |
| Łowca | 2,28 | 0,00 | 98% | 38% | 4,05 |
| Berserker | 4,69 | 1,89 | 82% | 35% | 0,00 |
| Tropiciel | 2,78 | 0,00 | 96% | 31% | 2,78 |

Mag i Rycerz zużywają tu podobną bezwzględną ilość many na walkę, ale dla Maga to około 12% zasobu, a dla Rycerza 49%. Sama zmiana leczenia tego nie wyrównuje. Niższe liczby akcji oznaczają też mniej okazji do otrzymania ciosu, co pomaga klasom dystansowym zachować życie.

## Przykład: sześć kolejnych starć na poziomie 25

Sprzęt kowala, bez mikstur, regeneracji i awansów. Po 32 próby. Przeciwnicy zmieniają się w obrębie zwykłej puli, aby wynik nie opierał się wyłącznie na jednej rodzinie.

| Klasa | Średnio wygranych z 6 | Próby z kompletem 6 zwycięstw |
| --- | ---: | ---: |
| Ciężki Rycerz | 3,38 | 0,0% |
| Mag | 6,00 | 100,0% |
| Łowca | 5,97 | 96,9% |
| Berserker | 3,72 | 0,0% |
| Tropiciel | 5,97 | 96,9% |

To wskazuje na nierówną wygodę zdobywania doświadczenia. Nie oznacza, że Rycerz lub Berserker nie mogą wygrać dłuższej wyprawy: mikstury, odpoczynek, lepszy sprzęt i inny sposób gry zmieniają wynik. Koszt kupowania mikstur i zarobek złota nie zostały tu symulowane.

## Sprzęt mocno zmienia wynik przeciw bossom

Poziom 80: Wywerna, Niebiański Wąż i Gryf, po 16 ziaren, czyli 48 prób na kompozycję. To mała pula trzech konkretnych bossów, a nie ogólny procent wygranych gracza. W każdej kolumnie wybrano najlepszą z badanych kompozycji; mogła być inna dla innego sprzętu.

| Klasa | Wygrane: kowal | Wygrane: zestaw klasowy | Akcje: zestaw klasowy |
| --- | ---: | ---: | ---: |
| Ciężki Rycerz | 43,8% | 91,7% | 12,17 |
| Mag | 97,9% | 100,0% | 5,88 |
| Łowca | 89,6% | 100,0% | 5,63 |
| Berserker | 64,6% | 93,8% | 6,38 |
| Tropiciel | 93,8% | 93,8% | 6,54 |

Wnioski: Rycerz bardzo zyskuje z właściwym sprzętem, ale nadal walczy długo. Berserker z zestawem jest znacznie silniejszy niż sugeruje test podstawowej broni. Mag pozostaje mocny także po zmianie leczenia. Łowca i Tropiciel również należą do mocnych klas; proste obniżenie wyłącznie obrażeń Maga nie rozwiąże nierównowagi.

## Potwierdzone przyczyny w kodzie

1. **Zręczność ma wiele korzyści naraz.** Daje główne obrażenia obu łucznikom oraz celność, krytyki i unik. W testowym rozwoju na poziomie 80 obie klasy osiągają 70% bazowego krytyka i 42% uniku już z wyposażeniem kowala. Rycerz ma wtedy około 8% krytyka i 3% uniku, choć nadrabia tarczą. Siła nie daje porównywalnego bonusu obronnego.
2. **Mana Maga rośnie dużo szybciej.** W zastosowanym rozwoju poziomu 80 Mag ma 1231 many, Rycerz 282, Berserker 277, Łowca 312, Tropiciel 406. Większość ofensywnych zdolności ma stały koszt, więc różnica nie znika przy podobnych kosztach pojedynczych ataków.
3. **Kowal słabo rozróżnia pancerz klas.** Szata Maga i napierśnik Rycerza na poziomie 25 mają po 13 pancerza. Generator korzysta ze wspólnego wzoru. Zestawy klasowe różnicują ochronę znacznie lepiej.
4. **Podejście kosztuje pełną turę.** Przeciw taktycznym odskokom i odrzuceniom klasy wręcz tracą kolejne okazje do ataku. W powyższym zestawie poziomu 25 Rycerz przeznacza średnio ponad dwie akcje na zbliżenie.
5. **Limity mogą unieważniać bonusy.** Przy 42% uniku Kamuflaż Łowcy i Krok Wiatru Tropiciela nie zwiększają już tej szansy. Przy wysokim krytyku część bonusów też przestaje mieć wartość.
6. **Nie ma pełnego materiału do oceny poziomów 91–100.** Postać może osiągnąć 100, ale najwyższy aktualny zakres potworów kończy się na 90. Nie dopisywano fikcyjnych przeciwników do audytu.

## Co poprawiono w tej paczce

- Uzdrowienie Maga: 6% maksymalnej many, minimum 18, zamiast stałego kosztu 18. Moc: 12% maksymalnego życia rzucającego (ograniczonego maksymalnym życiem celu) + 0,55 × Inteligencja, zamiast 16% życia celu + 0,8 × Inteligencja. Niski poziom Maga nie daje ogromnego leczenia przez sam wybór wysokopoziomowego sojusznika. Odnowienie i koszt tury pozostają.
- Leczenie nie daje przełamania bossa, także z bonusem przełamania na wyposażeniu.
- Ułamkowe premie bloku, np. 0,08, dają deklarowane 8 punktów procentowych zamiast 0,08. Poprawia to m.in. tarcze Rycerza.
- Osłabienie ataku oraz zamrożenie wpływają również na zwykły atak dystansowy wroga. Wcześniej ta ścieżka pomijała oba efekty.
- Obrona zmniejsza obrażenia obu uderzeń „Szału bossa” o 45% przed zaokrągleniem i zużywa jedną osłonę. Wcześniej nie wpływała na ten atak mimo podpowiedzi w grze. Bloki podczas szału wliczają się do prób klasowych.

Końcowe tabele i dane JSON dotyczą kodu **po tych poprawkach**. Nie zmieniano globalnie bazowych statystyk, wartości całego wyposażenia ani obrażeń ofensywnych zdolności wszystkich klas. Zapis postaci zachowuje umiejętności i przedmioty.

## Kolejność dalszego strojenia

1. Ustalić różne profile ochrony sklepowego sprzętu i rozsądny koszt many podstawowych rotacji.
2. Wyrównać koszt zbliżenia w stosunku do natychmiastowego ataku dystansowego, zachowując sens pozycji.
3. Ograniczyć kumulację korzyści Zręczności; sprawdzić zdolności po osiągnięciu limitów.
4. Dostroić klasowe zestawy i kontrolę Maga, potem ponowić te same scenariusze. Zmieniać pojedyncze źródła przewagi, żeby wiedzieć, co rzeczywiście pomaga.
5. Dodać graczy do testów: różne rozkłady statystyk, rodziny przeciwników, biomy, sprzęt i dłuższe wyprawy. Porównać czas zdobywania doświadczenia oraz wydatki na mikstury i strzały.

Nie wyciągano wniosków o równowadze PvP: funkcje sieciowe są obecnie wyłączone. Drużynowi sojusznicy są symulowani innym, uproszczonym kodem, więc również wymagają osobnej oceny. Wyniki PvE nie dowodzą balansu drużynowego.

## Pliki i odtworzenie

- `tests/class-balance-39986.json`: wszystkie wyniki, przeciwnicy, statystyki, wyposażenie i kompozycje.
- `node tests/class-balance.mjs wynik.json`: odtworzenie końcowego audytu.
- `tests/balance.mjs`: środowisko rzeczywistego silnika walki oraz wcześniejszy, prostszy test podstawowej broni i zbroi.
- `node tests/regression.mjs`: 284 kontrole regresji.
- `node tests/service-worker.mjs`: 8 kontroli instalacji i pamięci podręcznej.

Testy wykonano w Node z modelem DOM i zdarzeń. Nie przeprowadzono testu na fizycznym iPhonie ani pełnego testu przeglądarki.
