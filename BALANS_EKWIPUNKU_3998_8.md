# 3.9.9.8.8 — znaczenie ekwipunku i balans klas

Pełna paczka na bazie 3.9.9.8.7. Zachowuje grafiki, przedmioty, postacie, questy, GPS, strzały w sklepach, gildie od poziomu 1, komunikaty awansu i wcześniejsze poprawki przewijania. Zmiany działają także na posiadanym wyposażeniu: zapisuje się jego identyfikator, ulepszenia, afiksy, runy i zaklęcia, a parametry wynikają z aktualnych definicji. Nie resetujemy postaci ani ekwipunku.

## Co zmieniono

- **Broń wyznacza podstawę ataku.** Usunięto niezależny płaski dodatek obrażeń za poziom i główną cechę. Siła / Zręczność / Inteligencja mnoży teraz bazę broni. Moc wpisana na broni rzeczywiście wchodzi do obrażeń; wcześniej przy broni z zakresem obrażeń była pomijana. Ulepszenia, afiksy, runy i zaklęcia nadal działają.
- **Rycerz ma +18% do części obrażeń pochodzącej z broni.** Pomaga to zrekompensować koszt podejścia, bez usuwania walki na dystans i konieczności ruchu. Berserker zachowuje udział drugiej broni 45%.
- **Kowal rozróżnia profile pancerza:** ciężka płyta Rycerza, średnia ochrona Berserkera, lżejszy sprzęt Łowcy i Tropiciela oraz szaty Maga. Fokus i kołczan dają moc, nie fikcyjny pancerz taki jak tarcza. Dotychczasowe zestawy klasowe już miały różne profile i je zachowują.
- **Zręczność:** obrażenia nadal rosną z tą cechą, ale premia do krytyka i uniku ma malejący przyrost. Krytyk na kolejnych progach zestawów rośnie wolniej. Limity: bazowy krytyk 70%, unik 42%, blok 60%. Gra informuje o osiągnięciu limitu. Wyspecjalizowany Łowca z kompletem wysokiej jakości nadal może dojść do limitu krytyka; dodatkowe punkty ponad limit nie zwiększą bazowej szansy.
- **Porównanie przed zakupem pokazuje parametry całego bohatera:** zakres i średnią obrażeń, pancerz, trafienie, krytyk, unik i blok. Liczy rzeczywiste ulepszenia założonego przedmiotu oraz utratę lub uzyskanie premii zestawu. Pierścień jest porównywany z oboma miejscami; jednoręczna broń Berserkera z obiema rękami. Podgląd nie zapisuje ani nie zmienia wyposażenia.
- Oferta w podglądzie nie ma jeszcze losowego afiksu, ulepszeń, runy ani zaklęcia. Efekty warunkowe, np. obrażenia po podejściu lub na zatruty cel, pozostają opisane przy przedmiocie; nie są udawanym stałym DPS-em. Przedmiot na przyszły poziom ma wyraźne ostrzeżenie.
- **Dostępność sprzętu:** kowal pokazuje użyteczny sprzęt w sześciu podstawowych miejscach i bliskie kolejne progi, zamiast ucinać listę do czterech ofert. Ma istniejące bronie na poziomy 3–9, więc nie trzeba czekać z wymianą startowego oręża do 12. poziomu. Zachowano sześciogodzinną dostawę, limity rzadkości i osobną stałą ofertę strzał.
- Zwykłe przedmioty bez dodatkowych cech nadal istnieją. Wyższa rzadkość nie oznacza, że stary przedmiot zawsze pokona nowy sprzęt z wyższego poziomu.

## Czy wymiana broni faktycznie ma sens?

Bohater poziomu 25, te same cechy, umiejętności i pozostały sprzęt. Wymiana tylko broni głównej z progu 12 na 25. Berserker cały czas ma tę samą drugą broń.

| Klasa | Atak w 3.9.9.8.7: stara → nowa | Atak w 3.9.9.8.8: stara → nowa | Przyrost w nowej wersji | Akcje na zwykłego wroga w nowej wersji |
|---|---:|---:|---:|---:|
| Ciężki Rycerz | 73 → 83 | 57 → 99 | +73,68% | 8,78 → 5,74 |
| Mag | 76 → 86 | 53 → 89 | +67,92% | 4,62 → 2,58 |
| Łowca | 76 → 86 | 52 → 88 | +69,23% | 4,33 → 2,74 |
| Berserker | 85 → 95 | 85 → 121 | +42,35% | 5,64 → 4,61 |
| Tropiciel | 76 → 85 | 52 → 87 | +67,31% | 4,63 → 3,06 |

To osobny eksperyment: 16 wspólnych ziaren losowości na każdy model potwora. Różny czas zabicia zmienia dalszy przebieg losowań, fazy bossa i decyzje kontrolera, więc wygrane w pojedynczej małej próbie nie muszą rosnąć idealnie monotonnie wraz z siłą broni. Sam przewidywany atak jest liczony deterministycznie.

## Porównanie wszystkich klas

W głównej macierzy: poziom 25, sześć części sprzętu kowala, zwykli wrogowie, najlepszy z trzech badanych legalnych zestawów umiejętności. Akcje obejmują też podejście i obronę. Wszystkie klasy wygrały wszystkie pojedyncze walki w tej próbie, zarówno przed zmianą, jak i po niej.

| Klasa | Akcje przed → po | Pozostałe życie przed → po |
|---|---:|---:|
| Ciężki Rycerz | 5,79 → 5,23 | 84% → 89% |
| Mag | 2,56 → 2,56 | 94% → 93% |
| Łowca | 2,28 → 2,76 | 98% → 94% |
| Berserker | 4,69 → 4,03 | 82% → 85% |
| Tropiciel | 2,78 → 2,95 | 96% → 93% |

Rycerz i Berserker zyskali tempo. Łowca i Tropiciel nadal korzystają z dystansu, lecz mniej polegają na niemal bezpłatnym krytyku i uniku ze Zręczności. Mag zachowuje swoją tożsamość i leczenie, a jego sklepowe szaty słabiej chronią przed uderzeniami.

Poziom 80, trzy naturalnie występujące modele przeciwników o wyższej randze, 48 prób na konfigurację. Kolumna „zestaw” to broń kowala plus zestaw klasowy; dobieramy najlepszy z trzech badanych układów umiejętności osobno dla danej konfiguracji.

| Klasa | Kowal: wygrane przed → po | Zestaw klasowy: wygrane przed → po |
|---|---:|---:|
| Ciężki Rycerz | 43,75% → 68,75% | 91,67% → 95,83% |
| Mag | 97,92% → 97,92% | 100% → 100% |
| Łowca | 89,58% → 83,33% | 100% → 100% |
| Berserker | 64,58% → 97,92% | 93,75% → 95,83% |
| Tropiciel | 93,75% → 81,25% | 93,75% → 91,67% |

## Co nadal wymaga obserwacji

**Balans nie jest zamknięty.** Mag nadal ma przewagę w podtrzymywaniu długich wypraw dzięki leczeniu. Klasy walczące wręcz ponoszą koszt podejścia i częściej potrzebują odpoczynku lub mikstur. W próbie sześciu walk poziomu 25 bez żadnego odzyskiwania zasobów Rycerz ze sprzętem kowala wzrósł z 0% do 40,63% ukończonych wypraw, Berserker z 0% do 12,5%; Mag zachował 100%, Łowca uzyskał 78,13%, Tropiciel 84,38%.

Na poziomie 50, przy pozostaniu na sklepowym progu 40 i bez odpoczynku/mikstur, całą serię ukończył tylko Mag w 3,13% prób; pozostałe klasy nie ukończyły żadnej. Zestawy klasowe wyraźnie poprawiają ten wynik, ale rozpiętość między klasami pozostaje. To celowo surowa próba wyczerpywania zasobów, a nie typowa wyprawa z regeneracją między realnymi spacerami. Wynik wskazuje, że następny etap strojenia powinien objąć ekonomię zasobów i koszt podejścia, a nie samo zwiększanie wszystkich obrażeń.

Nie wykonano symulacji PvP, testów wszystkich możliwych afiksów i konfiguracji ani pełnego testu na telefonie. To nie są statystyki graczy. Zbiór potworów nie pozwala rzetelnie porównać całej końcówki poziomów 91–100; sklep i legalność wyposażenia sprawdzono do poziomu 100. Nie deklarujemy, że każda konfiguracja ma identyczną trudność.

## Dokładne wzory

- Zakresy bazowe istniejących broni przemnożono przez 2,6 i zaokrąglono w definicjach, aby zrównoważyć usunięcie starego płaskiego dodatku. Nie jest to dodatkowy ukryty mnożnik za każdym wczytaniem zapisu.
- Baza pojedynczej broni = jej zakres + moc broni + 2 × poziom ulepszenia + premie mocy afiksu, zaklęcia i runy.
- U Berserkera do bazy dochodzi 45% wartości drugiej broni. Pozostałe klasy nie czerpią tej premii.
- Końcowy zakres bazowy = baza broni × (1 + 0,004 × główna cecha) × premia Rycerza + 2 + 0,7 × moc pozostałego wyposażenia i zestawów. Premia Rycerza to 1,18, pozostałych klas 1.
- Zręczność dodaje do krytyka 0,12 × Zręczność / (1 + Zręczność / 100), a do uniku 0,16 × Zręczność / (1 + Zręczność / 80), w punktach procentowych.
- Krytyk generowanych zestawów: dotychczasową liniową skalę zastępuje 0,8 × pierwiastek z mnożnika progu, z zaokrągleniem. Pozostałe parametry zestawów zachowują swoją skalę.
- Pancerz ze sprzętu kowala ma mnożniki profilu: Rycerz 1,55; Berserker 1,15; Łowca/Tropiciel 0,95; Mag 0,60. Witalność nadal dodaje 0,55 do pancerza na punkt. Premia Witalności na przedmiocie nie jest obietnicą dodatkowego maksymalnego życia; życie dostaje się za wydanie punktu cechy tak jak wcześniej.

## Weryfikacja i odtworzenie

- **324 kontrole regresji**: zakupy, sprzedaż i przewinięcie w modelu DOM, strzały, awanse, GPS, postacie, zapis, wzory obrażeń, limity cech, porównanie z rzeczywistym założeniem, oba pierścienie i obie ręce Berserkera, brak mutacji także po błędzie podglądu, asortyment każdej klasy na poziomach 1–100.
- **8 kontroli service workera**: integralna instalacja, zgodność wersji, portrety offline i zachowanie zapisów.
- Świeża macierz bazowej wersji .7: **25 440 walk + 960 wypraw**. Nowa wersja .8: **25 440 walk + 960 wypraw**. Osobna kontrola znaczenia sprzętu .8: **19 680 walk**. Brak przekroczeń limitu 100 akcji w głównej macierzy nowej wersji.
- Główna macierz obejmuje poziomy 1, 5, 12, 25, 40, 50, 60 i 80, pięć klas, dwa modele wyposażenia, trzy układy umiejętności, naturalne rangi potworów i 16 ziaren na model. Przydział punktów: 2 w cechę główną i 1 w Witalność na poziom. Trudność wypraw badano na 32 osobnych ziarnach, bez leczenia miksturami, regeneracji i awansu pomiędzy walkami.
- Główna macierz zachowuje te same progi broni w obu wersjach dla porównywalności. Na poziomie 5 nadal bada stary sprzęt progu 1. Osobny eksperyment sprzętowy sprawdza ulepszone, rzeczywiście dostępne w sklepie bronie wczesnych poziomów.

```bash
node tests/regression.mjs
node tests/service-worker.mjs
node tests/class-balance.mjs nowy-audyt.json
node tests/equipment-balance.mjs nowy-audyt-sprzetu.json
```

Surowe wyniki: `tests/class-balance-before-39988.json`, `tests/class-balance-after-39988.json`, `tests/equipment-before-39988.json`, `tests/equipment-impact-39988.json`. Historyczne raporty .6 i .7 opisują tamte wersje. Starszy audyt można odtworzyć skryptem przy ustawieniu `T4H_BALANCE_ROOT` na rozpakowaną paczkę .7.

Nie używano automatyzacji przeglądarki. Wygląd i zachowanie na fizycznym telefonie wymagają próby po wgraniu paczki.
