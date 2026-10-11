# Time4Heroes 3.9.9.8.10 — statystyki wyposażenia i koszty wypraw

Pełna aktualizacja wersji 3.9.9.8.9. Zachowuje dotychczasowe grafiki, postacie, zadania, ceny łupów, kupowanie i sprzedawanie z zachowaniem przewinięcia. Nie wymaga rozpoczynania postaci od nowa.

## Wyposażenie rzeczywiście zwiększa życie i manę

- Każdy punkt **Witalności z założonego sprzętu daje +5 maksymalnego życia**, a punkt **Inteligencji daje +4 maksymalnej many**. Przykład: przedmiot z +3 Witalności i +2 Inteligencji podnosi limity o 15 życia i 8 many.
- Liczy się noszony egzemplarz, włącznie z jego afiksem, zaklęciem i ulepszeniami. Obsługa statystyk run i kompletów korzysta z tego samego naliczania; ta wersja nie dodaje nowych run ani premii kompletów.
- Porównanie przed zakupem pokazuje różnicę maksymalnego życia i many. Bohater ma informację, ile obu limitów pochodzi z wyposażenia.
- Zwiększenie limitu nie leczy. Zdjęcie przedmiotu obniża limit i w razie potrzeby ogranicza bieżący zasób. Wielokrotne zakładanie przedmiotów nie daje darmowego leczenia.
- Starszy zapis dostaje brakującą premię tylko raz. Zachowane są obrażenia, bieżąca mana, rozwój z poziomów i wydane punkty statystyk. Premia sprzętu nie narasta przy kolejnych zapisach ani przy przełączaniu postaci.
- Podgląd porównania niczego nie zapisuje i nie zmienia bieżącego życia ani many.

## Zaopatrzenie

Paczka **100 prymitywnych strzał kosztuje 100 złota**, zarówno w zwykłym sklepie, jak i u kowala. Oferta pozostaje dostępna dla Łowcy i Tropiciela. Wcześniej taka paczka kosztowała 200 złota bez zniżek.

Ceny podstawowe mikstur u alchemika:

| Przedmiot | Odnowienie | Cena .9 | Cena .10 |
| --- | ---: | ---: | ---: |
| Mała mikstura życia | 50 życia | 38 | 14 |
| Mikstura życia | 100 życia | 72 | 42 |
| Większa mikstura życia | 130 życia | 92 | 50 |
| Mikstura życia | 150 życia | 112 | 58 |
| Mikstura życia | 200 życia | 148 | 74 |
| Mała mikstura many | 50 many | 44 | 26 |
| Mikstura many | 100 many | 78 | 46 |
| Mikstura many | 150 many | 118 | 64 |
| Mikstura many | 200 many | 156 | 84 |
| Odtrutka | — | 34 | 24 |

Mała mikstura życia w zwykłym sklepie zachowuje cenę 14 złota. Te same butelki mają wspólną cenę podstawową; końcowa cena może się różnić przez poziom budynku i promocję alchemika. Większa butelka pozwala odzyskać więcej zasobów w jednej turze walki — nie każda daje najtańszy punkt leczenia. Ceny skupu łupów z wersji .9 pozostają zachowane.

## Receptury z ograniczonymi użyciami

Wszystkie 20 receptur alchemicznych mają jawnie ustaloną cenę i liczbę użyć. Zakup kolejnej receptury dodaje użycia. Warzenie zużywa składniki, opłatę i jedno użycie. Liczba użyć już kupionych receptur zostaje zachowana; nie ma zwrotu za wcześniejsze zakupy.

Najważniejsze zmiany wydajności:

| Receptura | Wynik jednego użycia |
| --- | ---: |
| Większa mikstura życia ze śluzu (`strongPotion2`) | 2 sztuki |
| Mikstura życia z ekstraktu | 6 sztuk po 50 życia |
| Mikstura many z pyłu duchowego | 4 sztuki po 50 many |
| Odtrutka z koncentratu | 4 sztuki |
| Większa mikstura życia z ekstraktu | 4 sztuki po 130 życia |

Receptury many 150 i 200 wymagają po jednym zielu wodnym zamiast dwóch. Karta zakupu pokazuje wydajność jednego użycia, opłatę za warzenie i koszt receptury przypadający na użycie przy wykorzystaniu całego zakupu.

Kontrola opłacalności obejmuje wszystkie receptury gotowych mikstur, również koszt wytwarzania ekstraktów, pyłu i koncentratu. Surowce mają koszt równy utraconej cenie skupu, a opłaty za receptury są rozłożone na wszystkie użycia. Przy tych założeniach warzenie jest tańsze od gotowych butelek, także przy maksymalnej zniżce miasta i promocji alchemika. **Kupowanie wszystkich surowców lub wykorzystanie tylko części receptury może zmienić wynik.**

## Regeneracja i pierwsze podejście

- Życie regeneruje się o **2% maksymalnego życia na minutę** zamiast 1%. Mana nadal odnawia się o 2% na minutę, stamina o 1 punkt na 3 minuty.
- Zachowane są naliczanie podczas nieobecności, reszty ułamkowe i limit 24 godzin. Trwająca walka lub wyprawa w lochu nadal blokuje tę regenerację.
- Rycerz i Berserker przy pierwszym podejściu na **BLISKO** otrzymują osłonę: najbliższy zwykły cios ma obrażenia zmniejszone o 45%. Działa istniejący mechanizm Obrony, także wobec specjalnych ataków bossów. Osłona nie zastępuje silniejszej aktywnej obrony.
- Premia podejścia jest dostępna raz na walkę. Cofanie się i ponowne podejście jej nie odnawiają. Stan jest zachowany po wznowieniu walki.

## Pomiary kosztów wypraw

Wersję .9 i .10 porównano w tym samym silniku gry, na pięciu klasach, z sześcioma częściami sprzętu od kowala i legalnym zestawem umiejętności. Dla każdego przypadku użyto 12 ustalonych ziaren losowania. Wariant spacerowy obejmuje 18 walk i trzy minuty regeneracji między walkami. Drugi wariant to sześć walk bez przerw.

Poniżej średni koszt **zużytych** mikstur i strzał w wariancie spacerowym, w złocie, po zaokrągleniu. Pełne wyniki zawierają także wygrane, łupy, przychód i pozostałe zasoby.

| Klasa | Poziom 5: .9 → .10 | Poziom 12: .9 → .10 | Poziom 25: .9 → .10 | Poziom 50: .9 → .10 |
| --- | ---: | ---: | ---: | ---: |
| Rycerz | 582 → 336 | 606 → 330 | 690 → 353 | 1599 → 995 |
| Mag | 570 → 334 | 398 → 217 | 280 → 126 | 911 → 689 |
| Łowca | 753 → 428 | 827 → 463 | 873 → 470 | 1473 → 855 |
| Berserker | 430 → 267 | 565 → 295 | 610 → 295 | 1258 → 790 |
| Tropiciel | 760 → 449 | 738 → 414 | 752 → 408 | 1286 → 701 |

W .10 wykonano 5760 prób walk w wyprawach, w .9 — 5749; wcześniejsze porażki skracały wyprawę. Osobno wykonano po 2040 pojedynczych walk na wersję z kompletami klasowymi na poziomach 25, 50 i 80, z trzema zestawami umiejętności dla każdej klasy. Poprawka limitów zasobów nie dała Magowi dodatkowych zwycięstw w tych przypadkach testowych.

**Ograniczenia pomiaru:** steruje automat, a nie gracz. Poziom postaci jest stały: zapisuje się zdobywane doświadczenie, ale nie stosuje awansów ani ich pełnego leczenia. Nie ma nagród za zadania, odpoczynku w karczmie, warzenia ani ulepszania sprzętu z nowych łupów. Zapasy są niesione z miasta; raport liczy zużycie, nie pełny wydatek na początkowe stosy i logistykę 36 slotów. Wartość łupów to możliwy skup, nie faktycznie dokonana sprzedaż. Nie jest to test godziny marszu z telefonem ani PvP.

## Co nadal wymaga pracy

- Mag pozostaje oszczędny w części długich wypraw. Łowca i Tropiciel na poziomie 5 mogą przy częstym używaniu zdolności wydać więcej na kupowane zapasy niż uzyskają ze zwykłych walk i skupu łupów. Warzenie, nagrody za zadania i awanse nie są uwzględnione w tych pomiarach.
- Balans bossów zależy mocno od klasy, przedziału poziomów i zestawu umiejętności. Przykładowo w badanych walkach bossowych na poziomie 50 najlepsze warianty osiągały 12,5% wygranych dla Rycerza, 87,5% dla Maga, 25% dla Łowcy, 75% dla Berserkera i 37,5% dla Tropiciela. To osiem prób na wariant w tym przedziale, nie uniwersalny ranking klas. Nie ogłaszamy zamkniętego balansu.
- Naturalne przedziały poziomów potworów nadal kończą się przed limitem poziomu 100. Końcówka gry wymaga osobnego etapu projektowania.
- Wspólne konta, zapis między urządzeniami i prawdziwy handel między graczami wymagają serwera. Ta paczka ich nie dodaje.
- Potrzebne są testy na fizycznym Androidzie i iPhonie oraz rzeczywiste marsze z GPS. W tej aktualizacji nie wykonano testu w pełnej przeglądarce ani na telefonie.

## Weryfikacja i odtworzenie

377 kontroli regresji obejmuje stare funkcje oraz migracje limitów, brak leczenia przez zamianę sprzętu, czysty podgląd porównania, awans i wydawanie punktów, osłonę podejścia, finanse receptur, zakup amunicji oraz pełną początkową ścieżkę każdej klasy: walka, łup, wyposażenie, pierwsza zdolność, karczma i jednorazowa nagroda samouczka. Dodatkowe 8 kontroli sprawdza instalację i pamięć podręczną w modelu Service Workera.

```sh
node tests/regression.mjs
node tests/service-worker.mjs
node tests/expedition-economy.mjs wynik-wypraw.json
node tests/equipment-vitals-balance.mjs wynik-wyposazenia.json
```

Raporty .10 i odniesienia .9: `tests/expedition-before-399810.json`, `tests/expedition-after-399810.json`, `tests/equipment-vitals-before-399810.json`, `tests/equipment-vitals-after-399810.json`. Starsze raporty z poprzednich wydań pozostają historyczne. Aby odtworzyć odniesienie, ustaw `T4H_BALANCE_ROOT` na rozpakowaną wersję .9.

## Instalacja aktualizacji

Wgraj całą zawartość ZIP-a pod dotychczasowy adres HTTPS. Otwórz grę online, użyj „Zapisz i aktualizuj” i sprawdź numer **3.9.9.8.10**. Gdy pozostaje stara wersja, zamknij wszystkie okna gry i zainstalowaną aplikację, następnie otwórz ponownie online. Nie kasuj danych witryny — przechowują lokalne postacie.
