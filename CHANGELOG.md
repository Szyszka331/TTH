# 4.1.0 alpha — Szlak łowców

- **Czytelne tury:** cios bohatera, efekty i odpowiedź przeciwnika są pokazywane kolejno. Paski życia oraz many odpowiadają poszczególnym etapom. Skrócony przebieg przy ograniczeniu animacji.
- **Taktyka:** osłona silnego ataku lub przerwanie przygotowania odsłania przeciwnika na jeden cios (+35% obrażeń). Wilki powodują krwawienie, gobliny zatruwają, ogniki odbierają manę. Obrona chroni przed tymi efektami; mikstura życia usuwa krwawienie i truciznę.
- **Rozwój umiejętności:** rangi leczenia i obrony zwiększają ich skuteczność. Opisy pokazują moc aktualnej rangi.
- **Indywidualne bonusy sprzętu:** Mocy (+3 ataku), Precyzji (+4 p.p. krytyka), Witalności (+16 życia), Ochrony (+2 pancerza), Skupienia (+12 many). Zwykłe przedmioty nadal występują. Bonus dotyczy konkretnego egzemplarza i jest uwzględniany w statystykach, cenie sprzedaży oraz porównaniu.
- **Pierwsze trofeum:** pierwsza wygrana nowego bohatera daje klasową broń Mocy. Na ekranie łupów działa porównanie i przycisk odbioru z założeniem wybranego przedmiotu.
- **Polowania na elity:** sześć mocniejszych wariantów znanych przeciwników. Wymagają postępu fabuły oraz poziomu. Mają 35% szansy na dodatkowe wyposażenie z bonusem; po trzech kolejnych zwycięstwach bez tego łupu czwarte gwarantuje przedmiot. Licznik obejmuje wszystkie elity i zapisuje się między sesjami.
- **Dziennik:** zakładki Fabuła, Polowania oraz Bestiariusz. Trzy imienne zlecenia z określonym wyposażeniem, wymaganymi materiałami i śledzeniem postępu. Bestiariusz pokazuje szanse na łup, taktykę oraz przycisk wskazania miejsca na mapie.
- **Nasycanie broni:** po pierwszym rozdziale i poziomie 5 kowal pozwala wybrać konkretny bonus. Koszt: 3 odłamki, 4 kły, 60 złota. Zastępuje poprzedni bonus, zachowuje ulepszenie broni. Bez losowania.
- **Zgodność:** zapis pixel 4.0 migruje przy wczytaniu, zachowując bohatera, sprzęt, doświadczenie i fabułę. Wersjonowane moduły zapobiegają mieszaniu starego i nowego kodu z pamięci podręcznej.

Stylistyka, mapa i atlas pozostają zgodne z zaakceptowaną wersją. Elity wykorzystują te same sylwetki z oznaczeniem rangi. Nie dodano serwera MMO ani wieloklatkowych sprite’ów.

Walidacja: testy mechanik, kontrolera interfejsu w uproszczonym DOM, pamięci podręcznej, 50 przejść fabuły i 100 walk pięciu klas z Przebudzonym Strażnikiem przy określonym wyposażeniu. To test możliwości przejścia, nie pełny audyt balansu PvP. Nie wykonano wizualnych testów w prawdziwej przeglądarce ani testów GPS w terenie.
