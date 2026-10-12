# Wspólny styl Time4Heroes Pixel

## Kierunek

Klasyczne fantasy, czytelne pikselowe kształty i ciepła osada na tle ciemnozielonego lasu. Kamień, drewno, ceglaste dachy i turkusowa woda. Magia jest akcentem turkusowym lub fioletowym. Nie dodajemy fotorealizmu, malarskich portretów ani ilustracji o innej perspektywie.

Mapa ma widok z góry pod kątem. Postacie stoją w tej samej perspektywie, mają mocny kontur, pełne sylwetki i czytelne uzbrojenie. Łowca nosi brązową skórę i odsłoniętą głowę; Tropiciel ma zielony kaptur, fiolki i bardziej leśny wygląd. Wielkość postaci nie zmienia się od rozmiaru pliku. Stwory są skalowane świadomie: boss większy, śluz niższy.

Interfejs korzysta z prostych linii i przygaszonego złota. Zwykły przedmiot ma neutralną ramkę, niepospolity zieloną, rzadki niebieską, relikt fioletową. Kolorowi zawsze towarzyszy tekst. Każdy model broni i pancerza ma własną sylwetkę. Różny bonus tego samego modelu może używać tego samego rysunku.

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


## Zestaw 4.2 — dostarczone zasoby

Tryb: wbudowane narzędzie imagegen, bez API/CLI. Wszystkie PNG zachowują wygenerowany kanał alfa i oryginalne piksele. Kod wyświetla fragmenty arkuszy według metadanych w `dist/art-42.js`; analiza alfa służyła wyłącznie pomiarowi obszarów, bez retuszu obrazu. W atlasie przedmiotów uwzględniono wszystkie widoczne piksele o alfa powyżej 2/255 oraz margines. Sylwetki chodzenia mają wspólną skalę w obrębie klasy i kotwicę pod stopami. Lewy profil Tropiciela korzysta z odbicia prawego profilu w CSS, ponieważ wygenerowany drugi rząd również przedstawiał prawy profil.

| Zasób | Plik finalny | Zawartość |
| --- | --- | --- |
| Wyposażenie | `dist/assets/gear-42.png` | 16 różnych modeli: 12 broni, trzy pancerze, tarcza; powiększone odstępy |
| Rycerz | `dist/assets/walk-knight-42.png` | 4×4 klatki, stal i czerwona peleryna |
| Mag | `dist/assets/walk-mage-42.png` | 4×4 klatki, fiolet i niebieski kryształ |
| Łowca | `dist/assets/walk-hunter-42.png` | 4×4 klatki, odkryta głowa, brązowa skóra |
| Berserker | `dist/assets/walk-berserker-42.png` | 4×4 klatki, rude włosy, futro i topór |
| Tropiciel | `dist/assets/walk-ranger-42.png` | 4×4 klatki, zielony kaptur i fiolki |

### Pełne prompty 4.2

Dla pięciu arkuszy chodu użyto poniższego wspólnego prefiksu, a następnie jednego opisu klasy z listy. Odniesienie: `dist/assets/atlas.png`. W każdym wywołaniu `transparent_background: true`.

```text
Create ONE production-ready WALK CYCLE SPRITE SHEET for the existing Time4Heroes pixel-art RPG. Match the reference sheet's crisp 16-bit pixel art, dark pixel outlines, muted woodland colors, proportions, highlights, no antialiasing, no blur, no 3D. EXACTLY 4 columns x 4 rows, 16 evenly spaced full-body sprites, uniform cells, transparent alpha background, no text, labels, frame borders or ground shadows. One identical character in every cell, identical scale, centered horizontally, feet at the same cell-relative baseline, ample transparent margin around all weapons and cape. ROW 1 faces SOUTH toward viewer, ROW 2 faces WEST to the left, ROW 3 faces EAST to the right, ROW 4 faces NORTH away from viewer showing back. Four columns in each row are a smooth walk cycle: left foot forward/right arm forward; feet passing under body; right foot forward/left arm forward; feet passing under body again. Feet and knees must have genuinely different readable poses. Body stays upright and consistent, cloak subtly follows stride. Keep all 16 sprites separate with large gutters and uncut. Full body visible. Only this character:
```

1. Rycerz: `The FIRST character of the reference: sturdy fully armored silver-steel knight, closed steel helmet, red short cape, single straight sword and small round shield.`
2. Mag: `The SECOND character of the reference: lean purple-robed mage, pointed purple hood/hat, gold trim, blue crystal-topped wooden staff.`
3. Łowca: `The THIRD character of the reference: brown-haired bare-headed hunter, brown leather jerkin, short muted brown cape, wooden longbow and quiver. No green hood.`
4. Berserker: `The FOURTH character of the reference: muscular red-haired berserker, bare upper arms, fur shoulder mantle, leather trousers, broad iron axe.`
5. Tropiciel: `The FIFTH character of the reference: green-hooded tracker/ranger, forest-green short cloak, brown layered leather, belt of small potions, short curved bow. Distinct from the bare-headed hunter.`

Atlas wyposażenia, odniesienie: `dist/assets/atlas.png`, przezroczystość włączona:

```text
Create ONE pixel-art equipment atlas for Time4Heroes, matching the reference image's crisp 16-bit painted pixels, dark outlines, earthy fantasy palette, clear readable silhouettes. Transparent alpha background, no labels, no text, no frames, no shadows on the background. EXACTLY 4 columns x 4 rows, 16 separate evenly centered icons in equal cells, large transparent gutters. Every whole object entirely inside its cell, no touching other cells. Row 1 left to right: (1) plain straight iron sword with leather hilt, (2) refined ranger steel sword with branching leaf-shaped green guard and longer slender blade, (3) legendary broad silver sword with luminous teal runes and angular gold crossguard, (4) simple crooked wooden apprentice staff with small blue crystal. Row 2: (5) forked forest staff wrapped in vines with green crystal, (6) elaborate ancient spiral staff with large floating teal orb enclosed in gold rune halo, (7) plain simple curved wooden bow, (8) reinforced green and bone recurve bow. Row 3: (9) ornate ancient silver and teal double-curved bow with inlaid runes, (10) humble one-headed iron woodcutter axe on wood haft, (11) broad steel bearded battle axe with gold collar and dark handle, (12) legendary two-bladed crescent axe with teal crystal center and runes. Row 4: (13) simple brown sleeveless leather vest armor with buckles, (14) ranger scout armor: green short shoulder cape over layered studded leather and visible chainmail sleeves, (15) oath armor: heavy silver-steel plate breastplate with broad shoulder pauldrons and teal tabard, (16) round wood shield with iron rim and small red painted emblem. The three armor icons have unmistakably different SHAPES, construction, materials and silhouette, not recolors. All icons suitable for 64px game inventory rendering.
```

Końcowa korekta odstępów, odniesienie: pierwszy wygenerowany atlas wyposażenia, przezroczystość włączona:

```text
Re-layout the attached exact 16 game equipment icons into a clean production spritesheet. Preserve all sixteen designs, colors, silhouettes and pixel art style in the same row-major order. Transparent alpha background. EXACT 4 by 4 regular grid. IMPORTANT: enlarge the transparent gutters drastically, so each complete icon including any glow, detached orb, blade tip, string and handle fits only in the middle 65 percent of its own cell. Each cell has at least 17 percent entirely empty margin on all four sides, and the four rows have broad completely transparent uninterrupted horizontal gutters. No item may reach or cross a cell border. Each row equally tall. No frames, no text, no new background. Keep leather vest, green scout chainmail, silver plate armor very distinct. This is for safe independent extraction without any adjacent icon fragments.
```
