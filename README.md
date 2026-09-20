# Time4Heroes — Build 2.5.5

## Mobile Startup & Test Walk Hotfix

Naprawiono dwa krytyczne błędy runtime:
- brak `renderCreate()` — świeża instalacja / telefon bez zapisu nie mógł uruchomić kreatora postaci,
- brak `geoDistance()` — chodzenie testowe strzałkami wywalało błąd w konsoli.

Dodatkowo przywrócono `refresh()`, używane przez ekwipunek, skille, import zapisu i lochy.

### Testowanie
1. Otwórz grę na telefonie bez starego zapisu — powinien pojawić się kreator postaci.
2. Po stworzeniu postaci zobaczysz prolog.
3. Po „Wyrusz z wioski” możesz chodzić strzałkami bez GPS.
4. GPS możesz włączyć później.
