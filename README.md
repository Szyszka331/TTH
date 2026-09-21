# Time4Heroes — Build 2.7 — Quest World System

## Najważniejsze zmiany
- Questowe cele na mapie pojawiają się dopiero po przyjęciu zadania.
- Etapy questów są sekwencyjne: następny trop nie istnieje na mapie, dopóki poprzedni nie zostanie rozwiązany.
- „Zaginiona owca” jest pierwszym pełnym śledztwem terenowym: owca → tropy → dwa ranne wilki → decyzja.
- Zwykłe fabularne POI (ruiny, obóz, ślady myśliwego itd.) są ukryte do momentu aktywacji odpowiedniego etapu questa.
- Kontrakty poboczne gwarantują cele w świecie po przyjęciu.
- Dodany kontrakt zbierania Jaskółczego ziela.
- Kontrakty zabijania generują odpowiednią liczbę wymaganych przeciwników wokół gracza.
- Cele poboczne znikają po ukończeniu/odebraniu kontraktu.
- Zachowano pixel-artowe potwory i Dungeon Crawler 2.6.

## Test „Zaginiona owca”
1. Ukończ `q1`.
2. Przyjmij `Zaginioną owcę` na tablicy w karczmie.
3. Na mapie pojawi się tylko owca.
4. Po jej zbadaniu pojawią się wilcze tropy.
5. Po zbadaniu tropów pojawią się dwa ranne wilki.
6. Przy wilkach wybierz sposób rozwiązania sytuacji.

## Test kontraktów
Po przyjęciu zlecenia z tablicy gra tworzy wymagane moby lub rośliny w osiągalnym promieniu wokół aktualnej pozycji.
