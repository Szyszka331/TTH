# Wyposażenie i rozwój postaci — 3.9.9.8.7

Ocena na podstawie kodu tej paczki oraz zakończonego audytu 3.9.9.8.6. Zmiany amunicji, gildii i komunikatów są wdrożone; propozycje przebudowy balansu poniżej pozostają projektem.

## Co warto zaczerpnąć z Margonem

Oficjalna dokumentacja opisuje broń, obronę, szybkość ataku, odporności i bonusy legendarne jako osobne mechanizmy. Szybkość zmienia kolejność oraz liczbę tur, a przedmioty mogą również spowalniać przeciwnika. Rzadkość wpływa zarówno na parametry bazowe, jak i liczbę nadanych bonusów. Z tego wynika, że dobrze dobrane wyposażenie może jednocześnie wzmacniać atak, przeżywalność i tempo walki. To moja interpretacja opisanych mechanik, a nie stały procent udziału ekwipunku w sile postaci. [1]

Profesje mają różne ograniczenia: Wojownik opiera obronę na życiu, pancerzu i tarczy; Łowca korzysta z szybkości i uniku; Tropiciel łączy dystans z żywiołami. Paladyn kładzie nacisk na obronę i wsparcie, a Tancerz Ostrzy na dwie bronie i unik. [2] Taki podział daje podstawę do mocnych i słabych zestawień. Sam opis profesji nie dowodzi równowagi wygranych ani nie daje aktualnego rankingu PvP.

Dostępne były archiwalne kopie oficjalnej dokumentacji z lipca 2025. Bieżących stron nie udało się w całości odczytać. Nie potwierdzono zatem stanu wszystkich późniejszych zmian ani rankingu klas na październik 2026.

## Co rzeczywiście dzieje się w Time4Heroes

**Wyposażenie już ma znaczenie, ale nie jest ono równomierne ani zawsze czytelne przy pojedynczej wymianie.**

W `weaponDamageRange()` obrażenia zawierają zakres broni, ulepszenia i bonusy instancji, a następnie dodawany jest składnik `0,75 × główna cecha + 0,55 × poziom + moc pozostałego wyposażenia`. Główna cecha uwzględnia także bonusy sprzętu. Przy wymianie samej broni znaczna część wyniku pozostaje więc bez zmian — lepszy zakres broni nie oznacza proporcjonalnie równie dużego wzrostu całego ataku.

W bazowym sprzęcie kowala szata Maga i napierśnik Rycerza na poziomie 25 mają po 13 pancerza. To osłabia odczuwalną różnicę między ciężkim i lekkim wyposażeniem. Z kolei Zręczność daje łucznikom jednocześnie obrażenia, celność, krytyki i unik. W badanym rozwoju na poziomie 80 Łowca i Tropiciel już ze sprzętem kowala osiągają limity bazowego krytyka i uniku; dalszy bonus do takiego parametru może nie poprawić wyniku.

Zestawy klasowe są wyraźnie silniejsze. W poprzednim audycie Rycerz na poziomie 80 wygrał **43,8%** prób ze sprzętem kowala i **91,7%** z zestawem klasowym. Było to 48 prób na kompozycję przeciw trzem konkretnym bossom; w każdej grupie wybrano najlepszą z trzech kompozycji umiejętności. To nie ogólny współczynnik wygranych wszystkich graczy. Metoda, ograniczenia i pozostałe klasy: `BALANS_3998_6.md`, wyniki: `tests/class-balance-39986.json`.

## Proponowana przebudowa

1. **Silniejszy związek ataku z bronią.** Dostroić zakresy broni i udział cechy w obrażeniach tak, aby wymiana broni dawała wyraźny efekt. Zmiana musi objąć także potwory i umiejętności. Proste podwojenie ataku wszystkich broni dodatkowo wzmocniłoby obecnie szybkie klasy.
2. **Osobne profile obrony.** Ciężki pancerz powinien dawać mocniejszą ochronę fizyczną, skóra wspierać łucznika, a szata wspierać magię. Ochrona Maga musi mieć koszt w porównaniu z ochroną Rycerza.
3. **Przedmioty pod konkretny sposób walki.** Zestaw do blokowania, do krwawienia, do szybkich zabójstw lub do długiej walki z trucizną. Lepszy przedmiot powinien pomagać w czymś konkretnym, zamiast zawsze zwiększać wszystkie parametry.
4. **Wspólny budżet siły przedmiotów.** Porównywać sprzęt o podobnym poziomie, rzadkości i koszcie zdobycia. Zachować zwykłe rzeczy bez dodatkowych cech. Sklep daje podstawę do gry; rzadki łup uzasadnia polowanie.
5. **Czytelne porównanie przed zakupem.** Oprócz surowego „+Siła” pokazywać zmianę końcowego zakresu obrażeń i ochrony. Parametr osiągający limit powinien to komunikować. Sprawdzić również rozbieżności między etykietą „moc” a zakresem obrażeń broni, zanim zmienimy naliczanie.

| Klasa w naszej grze | Co powinien szczególnie zmieniać dobór wyposażenia |
| --- | --- |
| Ciężki Rycerz | Skuteczność tarczy, przeżywalność i wartość kontrataku |
| Mag | Wybór żywiołu, koszt i siłę czarów, ochronę kosztem ofensywy |
| Łowca | Moc krótkiej serii strzałów i skuteczność krytyków |
| Berserker | Współpracę dwóch broni, krwawienie i korzyść z ryzyka |
| Tropiciel | Trucizny, pułapki i przewagę w dłuższym starciu |

Najpierw należy dostroić broń, pancerze sklepowe i nadmiar korzyści Zręczności. Następnie powtórzyć porównania pięciu klas na tych samych poziomach, ze zwykłym i rzadkim wyposażeniem, w pojedynczych walkach oraz seriach. Dopiero wyniki pokażą, czy lepszy łup daje satysfakcję bez powiększania przewagi Maga i łuczników. Pełna przebudowa kolejności tur nie jest konieczna do pierwszej poprawy ekwipunku.

## Źródła

[1] Garmory, „Mechanika walk”, sekcje 2.1, 3.1 i 3.2. Kopia oficjalnej dokumentacji z 17.07.2025: https://web.archive.org/web/20250717234453/https://pomoc.margonem.pl/index/view,372 . Adres bieżący: https://pomoc.margonem.pl/index/view,372 .

[2] Garmory, „Opis profesji”, kopia z 17.07.2025: https://web.archive.org/web/20250717215518/https://pomoc.margonem.pl/index/view,342 .

Wnioski o Time4Heroes pochodzą z lokalnego kodu i dołączonych testów, nie z poradników o Margonem.
