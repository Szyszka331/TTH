# Wspólny styl Time4Heroes Pixel

## Kierunek

Klasyczne fantasy, czytelne pikselowe kształty i ciepła osada na tle ciemnozielonego lasu. Kamień, drewno, ceglaste dachy i turkusowa woda. Magia jest akcentem turkusowym lub fioletowym. Nie dodajemy fotorealizmu, malarskich portretów ani ilustracji o innej perspektywie.

Mapa ma widok z góry pod kątem. Postacie stoją w tej samej perspektywie, mają mocny kontur, pełne sylwetki i czytelne uzbrojenie. Łowca nosi brązową skórę i odsłoniętą głowę; Tropiciel ma zielony kaptur, fiolki i bardziej leśny wygląd. Wielkość postaci nie zmienia się od rozmiaru pliku. Stwory są skalowane świadomie: boss większy, śluz niższy.

Interfejs korzysta z prostych linii i przygaszonego złota. Zwykły przedmiot ma neutralną ramkę, niepospolity zieloną, rzadki niebieską, relikt fioletową. Kolorowi zawsze towarzyszy tekst. Rysunek rodziny przedmiotów może być współdzielony przez jej poziomy w prototypie; przyszłe unikatowe przedmioty powinny mieć osobne sylwetki.

## Materiały i sposób przygotowania

Grafiki powstały w bieżącej pracy za pomocą wbudowanego generatora obrazów. Nie pobierano cudzych grafik z innych gier. Poniższe opisy są skrótem specyfikacji generowania, a nie dosłownym zapisem całych promptów.

| Zasób | Ścieżka w grze | Specyfikacja |
| --- | --- | --- |
| Mapa | `dist/assets/world.png` | 1536×1024, spójna scena fantasy w pixel arcie: osada po lewej, karczma z czerwonym dachem, kuźnia na dole, pracownia z fioletowym daszkiem, mury i brama, rzeka z mostem, leśny szlak i ruiny po prawej. Bez postaci, napisów i interfejsu. |
| Atlas | `dist/assets/atlas.png` | 1536×1024 RGBA, 24 odrębne sylwetki: pięć klas i karczmarka; sześć potworów; sześć elementów wyposażenia; mikstury i materiały. Przezroczyste tło, pełne stopy i broń, ta sama paleta oraz kontur. |

Pierwszy atlas został poprawiony generatorem obrazów, aby poprawić odstępy i przezroczystość. Końcowy arkusz zachowano bez dalszej edycji rastrowej. Rzeczywiste prostokąty sylwetek są zapisane w `dist/atlas.js`; CSS wyświetla te obszary, zachowując proporcje i margines. Dzięki temu wysokie kapelusze, stopy i broń nie są obcinane przez umowne równe pola.

Źródłowe wyniki generowania w tej sesji: mapa `exec-468b618e-b5df-4372-a65b-3ffb89d8603d.png`, końcowy atlas `exec-d89415d9-55c4-45f9-833e-c28d22acb14e.png`. Trwałe kopie potrzebne do działania gry znajdują się w `dist/assets/`.

Ikony interfejsu oraz znak aplikacji są prostymi figurami SVG napisanymi w kodzie. Nie udają grafik przedmiotów. Animacje CSS obejmują ruch znacznika, oddech sylwetki, uderzenie i liczby obrażeń; uwzględniają ustawienie ograniczenia animacji.

## Reguły kolejnych grafik

1. Używać istniejącej mapy i atlasu jako odniesienia kolorów, perspektywy i konturu.
2. Projektować czytelną sylwetkę przed drobnymi detalami.
3. Eksportować pełne obiekty z przezroczystością i marginesem; nie wciskać ich w komórkę przez rozciąganie.
4. Utrzymać wspólną gęstość pikseli. Nie mieszać wyraźnych pikseli z rozmytym malarstwem.
5. Sprawdzać grafikę w docelowej małej skali, szczególnie na ekranie telefonu.
6. Sceny sklepów projektować z prawidłowymi proporcjami: lada na pierwszym planie zasłania dolną część sprzedawcy. Nie doklejać pełnej postaci na powierzchni lady.
