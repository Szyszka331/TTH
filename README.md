# Time4Heroes 4.2 — uruchomienie z GitHub Pages

Ta paczka zawiera grę przeglądarkową: sterowanie strzałkami / WASD, animacje chodzenia pięciu klas, ruch po ścieżkach i różne grafiki broni oraz zbroi. Telefon: przyciski kierunku lub kliknięcie celu. Nie wymaga npm, serwera gry ani kluczy API.

## Najprostsza instalacja

1. Rozpakuj `Time4Heroes_GITHUB_PAGES_4_2.zip` na komputerze.
2. Utwórz na GitHubie nowe publiczne repozytorium, np. `Time4HeroesPixel`.
3. W repozytorium wybierz **Add file → Upload files**. Wgraj całą rozpakowaną zawartość: `index.html`, pliki JS/CSS, `assets/`, manifest i pozostałe pliki. Zatwierdź **Commit changes** na gałęzi `main`.
4. Plik `index.html` musi być bezpośrednio w głównym katalogu repozytorium. Nie wgrywaj samego ZIP-a ani dodatkowego folderu zawierającego całą paczkę.
5. Wejdź w **Settings → Pages → Build and deployment**. W **Source** wybierz **Deploy from a branch**, następnie **main** i **/(root)**. Kliknij **Save**.
6. Zaczekaj na zakończenie publikacji. Otwórz adres pokazany w **Settings → Pages**. Zwykle ma postać `https://LOGIN.github.io/Time4HeroesPixel/`.

Plik `.nojekyll` w paczce wyłącza przetwarzanie Jekyll. Jeśli system nie pokazuje plików zaczynających się kropką, możesz utworzyć na GitHubie pusty plik o dokładnie tej nazwie. Obrazy i kod używają ścieżek względnych, więc gra działa także w podkatalogu nazwanym jak repozytorium.

## Postać i aktualizacje

- Przed przejściem ze starego adresu gry wyeksportuj postać w **Opcje → Eksportuj**, a pod nowym adresem wybierz **Importuj**. Zapis jest lokalny dla przeglądarki i adresu, nie synchronizuje się przez konto GitHub.
- Kolega może otworzyć link na własnym urządzeniu; dostanie własny zapis. Ta wersja jest jednoosobowa.
- Aby zaktualizować grę, zastąp odpowiednie pliki i folder `assets/` z nowej paczki. Zachowaj ich nazwy i wielkość liter. Nie usuwaj danych przeglądarki, aby wymusić odświeżenie — usuniesz również zapis.
- GPS jest opcjonalny. Wymaga HTTPS, zgody na lokalizację i urządzenia udostępniającego lokalizację.
- Nie uruchamiaj gry dwuklikiem `index.html`; moduły JS potrzebują HTTP/HTTPS. Lokalnie można użyć `python3 -m http.server 8080` w rozpakowanym katalogu i otworzyć `http://localhost:8080`.

Instrukcja GitHub: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Paczka jest przygotowana do publikacji. Nie została automatycznie wgrana na Twoje konto GitHub. Walidacja obejmuje testy kodu, kompletność ścieżek i kontrolę ZIP; nie wykonano testu wizualnego na prawdziwym telefonie/przeglądarce.
