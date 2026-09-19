export const CLASSES = {
  knight:{name:'Ciężki Rycerz',icon:'🛡️',accent:'stal',desc:'Tank. Blok, pancerz, tarcza i kontrola przeciwnika.',base:{str:7,agi:3,int:2,vit:9},hp:150,mana:45},
  mage:{name:'Mag',icon:'🔮',accent:'arkanum',desc:'Silne zaklęcia, mana i efekty żywiołów.',base:{str:2,agi:4,int:10,vit:5},hp:95,mana:125},
  hunter:{name:'Łowca',icon:'🏹',accent:'las',desc:'Krytyki, podwójny strzał i współpraca z chowańcem.',base:{str:4,agi:10,int:3,vit:5},hp:108,mana:75},
  berserker:{name:'Berserker',icon:'🪓',accent:'krew',desc:'Ogromne obrażenia, furia i premie przy niskim HP.',base:{str:10,agi:5,int:1,vit:7},hp:138,mana:40},
  ranger:{name:'Tropiciel',icon:'🌿',accent:'natura',desc:'Trucizny, pułapki, mobilność i chowaniec.',base:{str:4,agi:8,int:6,vit:5},hp:112,mana:90}
};

export const MONSTERS = [
 {id:'slime',name:'Błotny Pełzacz',icon:'🟢',family:'Natura',min:1,max:4,zone:'green',hp:42,atk:7,xp:38,gold:[3,8],weak:'ogień'},
 {id:'rat',name:'Zdziczały Szczur',icon:'🐀',family:'Natura',min:1,max:5,zone:'green',hp:36,atk:8,xp:35,gold:[2,7],weak:'trucizna'},
 {id:'beetle',name:'Pancerznik',icon:'🪲',family:'Owady',min:2,max:7,zone:'green',hp:48,atk:8,xp:44,gold:[3,9],weak:'przebicie'},
 {id:'wolf',name:'Szary Wilk',icon:'🐺',family:'Natura',min:4,max:10,zone:'green',hp:62,atk:11,xp:62,gold:[5,12],weak:'pułapki'},
 {id:'goblin',name:'Gobliński Zwiadowca',icon:'👺',family:'Ludzie',min:3,max:12,zone:'green',hp:58,atk:10,xp:58,gold:[5,13],weak:'krwawienie'},
 {id:'skeleton',name:'Kościany Wojownik',icon:'💀',family:'Nieumarli',min:10,max:22,zone:'green',hp:94,atk:16,xp:118,gold:[10,20],weak:'obuch'},
 {id:'ghost',name:'Błądząca Zjawa',icon:'👻',family:'Zjawy',min:25,max:38,zone:'yellow',hp:145,atk:23,xp:245,gold:[18,34],weak:'arkanum'},
 {id:'elemental',name:'Żywiołak Kamienia',icon:'🗿',family:'Żywiołaki',min:30,max:45,zone:'yellow',hp:190,atk:25,xp:300,gold:[22,40],weak:'lód'},
 {id:'cultist',name:'Kultysta Pustki',icon:'🥷',family:'Ludzie',min:20,max:38,zone:'yellow',hp:135,atk:24,xp:220,gold:[16,35],weak:'światło'},
 {id:'demon',name:'Rogaty Demon',icon:'👹',family:'Demony',min:40,max:58,zone:'red',hp:265,atk:38,xp:520,gold:[35,65],weak:'lód'},
 {id:'hellhound',name:'Piekielny Ogar',icon:'🐕‍🦺',family:'Demony',min:45,max:65,zone:'red',hp:245,atk:43,xp:560,gold:[38,72],weak:'woda'},
 {id:'wyvern',name:'Popielna Wywerna',icon:'🐉',family:'Bestie',min:60,max:80,zone:'black',hp:420,atk:58,xp:920,gold:[70,120],weak:'przebicie'},
 {id:'shade',name:'Cień z Kurhanu',icon:'🌑',family:'Zjawy',min:18,max:32,zone:'yellow',hp:122,atk:21,xp:190,gold:[14,30],weak:'światło'},
 {id:'spider',name:'Leśny Tkacz',icon:'🕷️',family:'Owady',min:8,max:18,zone:'green',hp:82,atk:14,xp:96,gold:[8,18],weak:'ogień'},
 {id:'ogre',name:'Ogr Rozbójnik',icon:'👹',family:'Ludzie',min:32,max:48,zone:'yellow',hp:235,atk:31,xp:365,gold:[28,52],weak:'trucizna'}
];

export const ITEMS = {
 rustySword:{id:'rustySword',name:'Wyszczerbiony miecz',icon:'🗡️',type:'weapon',slot:'weapon',rarity:'common',value:18,power:4},
 hunterBow:{id:'hunterBow',name:'Łuk zwiadowcy',icon:'🏹',type:'weapon',slot:'weapon',rarity:'common',value:20,power:4},
 apprenticeStaff:{id:'apprenticeStaff',name:'Kostur ucznia',icon:'🪄',type:'weapon',slot:'weapon',rarity:'common',value:20,power:4},
 axe:{id:'axe',name:'Ciężki topór',icon:'🪓',type:'weapon',slot:'weapon',rarity:'common',value:20,power:5},
 leather:{id:'leather',name:'Skórzana kamizelka',icon:'🥋',type:'armor',slot:'armor',rarity:'common',value:16,armor:3},
 ironArmor:{id:'ironArmor',name:'Żelazny kirys',icon:'🛡️',type:'armor',slot:'armor',rarity:'rare',value:75,armor:9},
 scoutHood:{id:'scoutHood',name:'Kaptur zwiadowcy',icon:'🥷',type:'gear',slot:'helmet',rarity:'uncommon',value:34,armor:2,crit:1},
 ironHelm:{id:'ironHelm',name:'Żelazny hełm',icon:'⛑️',type:'gear',slot:'helmet',rarity:'rare',value:82,armor:6},
 leatherGloves:{id:'leatherGloves',name:'Rękawice wędrowca',icon:'🧤',type:'gear',slot:'gloves',rarity:'uncommon',value:28,armor:1,power:1},
 trailBoots:{id:'trailBoots',name:'Buty Zielonego Szlaku',icon:'🥾',type:'gear',slot:'boots',rarity:'uncommon',value:32,armor:1,crit:2},
 woodenShield:{id:'woodenShield',name:'Okrągła tarcza',icon:'🛡️',type:'gear',slot:'offhand',rarity:'uncommon',value:38,armor:4},
 blueBlade:{id:'blueBlade',name:'Ostrze Strażnika',icon:'⚔️',type:'weapon',slot:'weapon',rarity:'rare',value:110,power:14},
 forestBow:{id:'forestBow',name:'Łuk Zielonego Szlaku',icon:'🏹',type:'weapon',slot:'weapon',rarity:'rare',value:105,power:12,crit:2},
 arcaneStaff:{id:'arcaneStaff',name:'Kostur Runiczny',icon:'🪄',type:'weapon',slot:'weapon',rarity:'rare',value:115,power:13},
 shadowRing:{id:'shadowRing',name:'Pierścień Cienia',icon:'💍',type:'trinket',slot:'ring',rarity:'epic',value:260,crit:8},
 emberRing:{id:'emberRing',name:'Pierścień Żaru',icon:'💍',type:'trinket',slot:'ring',rarity:'rare',value:135,power:4,crit:2},
 wolfCharm:{id:'wolfCharm',name:'Wilczy amulet',icon:'📿',type:'trinket',slot:'amulet',rarity:'rare',value:95,crit:4,power:2},
 oldTalisman:{id:'oldTalisman',name:'Stary talizman',icon:'📿',type:'trinket',slot:'amulet',rarity:'uncommon',value:42,crit:2},
 potion:{id:'potion',name:'Mikstura życia',icon:'🧪',type:'consumable',rarity:'common',value:12,heal:55},
 strongPotion:{id:'strongPotion',name:'Większa mikstura życia',icon:'❤️‍🔥',type:'consumable',rarity:'rare',value:34,heal:130},
 manaPotion:{id:'manaPotion',name:'Mikstura many',icon:'🔷',type:'consumable',rarity:'common',value:14,mana:50},
 antidote:{id:'antidote',name:'Odtrutka',icon:'🍶',type:'consumable',rarity:'common',value:10},
 wolfPelt:{id:'wolfPelt',name:'Wilcza skóra',icon:'🧶',type:'material',rarity:'common',value:8},
 herb:{id:'herb',name:'Gorzki liść',icon:'🌿',type:'material',rarity:'common',value:4},
 moonHerb:{id:'moonHerb',name:'Księżycowe ziele',icon:'☘️',type:'material',rarity:'rare',value:10},
 bone:{id:'bone',name:'Kość nieumarłego',icon:'🦴',type:'material',rarity:'common',value:6},
 scrap:{id:'scrap',name:'Żelazny złom',icon:'🔩',type:'material',rarity:'common',value:6},
 crystal:{id:'crystal',name:'Odłamek kryształu',icon:'💎',type:'material',rarity:'rare',value:15},
 blackMedallion:{id:'blackMedallion',name:'Czarny medalion',icon:'📿',type:'quest',rarity:'epic',value:0}
};

export const SKILLS = {
 knight:[
  {id:'shield',branch:'Bastion',name:'Uderzenie tarczą',icon:'🛡️',req:1,cost:1,mana:8,kind:'damage',mult:1.25,desc:'125% obrażeń i osłabienie ataku przeciwnika.',debuff:0.15},
  {id:'fortress',branch:'Bastion',name:'Żelazna Forteca',icon:'🏰',req:3,cost:1,mana:12,kind:'guard',turns:2,requires:'shield',desc:'Przez 2 tury otrzymujesz o 45% mniej obrażeń.'},
  {id:'taunt',branch:'Bastion',name:'Prowokacja',icon:'📣',req:6,cost:2,mana:14,kind:'debuff',debuff:0.30,requires:'fortress',desc:'Mocno obniża atak przeciwnika na 3 tury.'},
  {id:'counter',branch:'Odwet',name:'Kontratak',icon:'↩️',req:4,cost:1,mana:10,kind:'damage',mult:1.5,requires:'shield',desc:'150% obrażeń. Bezpieczny, ciężki kontratak.'},
  {id:'breaker',branch:'Odwet',name:'Łamacz Gardy',icon:'🔨',req:8,cost:2,mana:18,kind:'damage',mult:2.0,requires:'counter',desc:'200% obrażeń. Cios przeznaczony na elity i bossów.'},
  {id:'lastStand',branch:'Odwet',name:'Ostatni Bastion',icon:'⚜️',req:12,cost:2,mana:22,kind:'guard',turns:3,requires:'breaker',desc:'Potężna obrona przez 3 tury.'}
 ],
 mage:[
  {id:'fire',branch:'Ogień',name:'Ognisty pocisk',icon:'🔥',req:1,cost:1,mana:12,kind:'damage',mult:1.55,desc:'155% obrażeń magicznych.'},
  {id:'frost',branch:'Lód',name:'Lodowa pieczęć',icon:'❄️',req:3,cost:1,mana:16,kind:'damage',mult:1.20,desc:'120% obrażeń i osłabienie przeciwnika.',debuff:0.20},
  {id:'elemental',branch:'Arkanum',name:'Eksplozja Żywiołów',icon:'💥',req:6,cost:2,mana:28,kind:'damage',mult:2.35,requires:'fire',desc:'Potężny atak za dużą ilość many.'},
  {id:'spark',branch:'Arkanum',name:'Łańcuch Iskier',icon:'⚡',req:4,cost:1,mana:15,kind:'multi',hits:2,mult:.9,requires:'fire',desc:'Dwa magiczne trafienia po 90%.'},
  {id:'iceArmor',branch:'Lód',name:'Pancerz Lodu',icon:'🧊',req:7,cost:2,mana:20,kind:'guard',turns:2,requires:'frost',desc:'Zmniejsza obrażenia przez 2 tury.'},
  {id:'meteor',branch:'Ogień',name:'Meteor',icon:'☄️',req:12,cost:2,mana:36,kind:'damage',mult:3.0,requires:'elemental',desc:'300% obrażeń. Drogi, kończący czar.'}
 ],
 hunter:[
  {id:'double',branch:'Strzelectwo',name:'Podwójny strzał',icon:'🏹',req:1,cost:1,mana:10,kind:'multi',hits:2,mult:0.82,desc:'Dwa trafienia po 82% obrażeń.'},
  {id:'mark',branch:'Strzelectwo',name:'Znak łowcy',icon:'🎯',req:3,cost:1,mana:12,kind:'mark',turns:3,requires:'double',desc:'Przez 3 tury +25% szansy na krytyk.'},
  {id:'petStrike',branch:'Bestia',name:'Skoordynowany Strzał',icon:'🐺',req:6,cost:2,mana:18,kind:'pet',mult:1.45,desc:'145% obrażeń, a aktywny pupil zawsze atakuje.'},
  {id:'eagleEye',branch:'Strzelectwo',name:'Sokole Oko',icon:'🦅',req:7,cost:2,mana:18,kind:'damage',mult:1.7,critBonus:30,requires:'mark',desc:'170% obrażeń i wysoka szansa na krytyk.'},
  {id:'pack',branch:'Bestia',name:'Zew Stada',icon:'🐾',req:9,cost:2,mana:20,kind:'pet',mult:1.6,requires:'petStrike',desc:'Silny wspólny atak z chowańcem.'},
  {id:'volley',branch:'Przetrwanie',name:'Salwa',icon:'🌧️',req:12,cost:2,mana:26,kind:'multi',hits:3,mult:.76,requires:'eagleEye',desc:'Trzy szybkie trafienia po 76%.'}
 ],
 berserker:[
  {id:'rage',branch:'Furia',name:'Furia',icon:'😡',req:1,cost:1,mana:6,kind:'rage',desc:'Cios 120–190% zależnie od utraconego HP.'},
  {id:'cleave',branch:'Rzeź',name:'Rozłupanie',icon:'🪓',req:3,cost:1,mana:10,kind:'damage',mult:1.75,desc:'Silny cios za 175% obrażeń.'},
  {id:'blood',branch:'Rzeź',name:'Krwawy Taniec',icon:'🩸',req:6,cost:2,mana:16,kind:'multi',hits:3,mult:0.72,requires:'cleave',desc:'Trzy szybkie ciosy po 72% obrażeń.'},
  {id:'roar',branch:'Furia',name:'Ryk Wojenny',icon:'📢',req:5,cost:1,mana:8,kind:'debuff',debuff:.22,requires:'rage',desc:'Osłabia atak przeciwnika.'},
  {id:'execution',branch:'Rzeź',name:'Egzekucja',icon:'⚔️',req:9,cost:2,mana:15,kind:'damage',mult:2.25,requires:'blood',desc:'225% obrażeń.'},
  {id:'berserk',branch:'Furia',name:'Szał Berserkera',icon:'🔥',req:12,cost:2,mana:18,kind:'rage',requires:'roar',desc:'Potężny cios skalujący się z utraconym HP.'}
 ],
 ranger:[
  {id:'poison',branch:'Trucizny',name:'Zatruty grot',icon:'☠️',req:1,cost:1,mana:10,kind:'poison',mult:1.05,turns:3,desc:'105% obrażeń i trucizna przez 3 tury.'},
  {id:'trap',branch:'Pułapki',name:'Leśna pułapka',icon:'🪤',req:3,cost:1,mana:12,kind:'debuff',debuff:0.25,desc:'Obniża atak przeciwnika na 3 tury.'},
  {id:'destiny',branch:'Trucizny',name:'Strzała Przeznaczenia',icon:'🌠',req:6,cost:2,mana:20,kind:'damage',mult:2.0,critBonus:20,requires:'poison',desc:'200% obrażeń i +20% szansy na krytyk.'},
  {id:'vine',branch:'Pułapki',name:'Pnącza',icon:'🌱',req:6,cost:1,mana:14,kind:'debuff',debuff:.32,requires:'trap',desc:'Mocne osłabienie przeciwnika.'},
  {id:'spirit',branch:'Duch Natury',name:'Duch Lasu',icon:'🦊',req:8,cost:2,mana:18,kind:'pet',mult:1.5,desc:'Wspólny atak z aktywnym chowańcem.'},
  {id:'venomRain',branch:'Trucizny',name:'Deszcz Jadu',icon:'🌧️',req:12,cost:2,mana:26,kind:'poison',mult:1.65,turns:4,requires:'destiny',desc:'Silny strzał i dłuższa trucizna.'}
 ]
};

export const PETS = {
 youngWolf:{id:'youngWolf',name:'Młody Wilk',icon:'🐺',power:7,skill:'Rozszarpanie',passive:'+ regularne ataki',desc:'Wierny kompan. Często dobija osłabionych przeciwników.'},
 raven:{id:'raven',name:'Kruk',icon:'🐦‍⬛',power:6,crit:4,skill:'Pikowanie',passive:'+4% krytyka',desc:'Zwiększa szansę na krytyk i atakuje z powietrza.'},
 forestLynx:{id:'forestLynx',name:'Ryś Leśny',icon:'🐈',power:10,skill:'Skok',passive:'+ obrażenia',desc:'Rzadki, ofensywny pupil Tropicieli i Łowców.'},
 emberling:{id:'emberling',name:'Żaroptak',icon:'🐦',power:12,crit:2,skill:'Iskra',passive:'+2% krytyka',desc:'Rzadki ptak znaleziony przy czerwonych strefach.'},
 shadowFox:{id:'shadowFox',name:'Lis Cienia',icon:'🦊',power:9,crit:5,skill:'Zniknięcie',passive:'+5% krytyka',desc:'Niezwykle rzadki chowaniec związany z ruinami.'}
};

export const RECIPES = [
 {id:'potion',name:'Mikstura życia',result:'potion',qty:1,ingredients:{herb:2}},
 {id:'manaPotion',name:'Mikstura many',result:'manaPotion',qty:1,ingredients:{herb:1,crystal:1}},
 {id:'strongPotion',name:'Większa mikstura życia',result:'strongPotion',qty:1,ingredients:{herb:2,moonHerb:1}},
 {id:'antidote',name:'Odtrutka',result:'antidote',qty:1,ingredients:{herb:1,bone:1}}
];

export const DUNGEONS = [
 {id:'oldCrypt',name:'Stara Krypta',icon:'🕳️',x:185,y:-125,min:7,boss:'skeleton',desc:'Wilgotne podziemia pełne kości, run, pułapek i bocznych komnat.'},
 {id:'forgottenTower',name:'Zapomniana Wieża',icon:'🗼',x:-300,y:-170,min:18,boss:'cultist',desc:'Wieża starego zakonu. W środku słychać szepty.'},
 {id:'beastLair',name:'Legowisko Bestii',icon:'🦴',x:320,y:245,min:45,boss:'wyvern',desc:'Czarna strefa. W powietrzu czuć popiół i siarkę.'}
];

export const QUESTS = [
 {id:'q1',chapter:'Cienie nad Doliną',name:'Pierwszy krok',level:1,desc:'Karczmarz prosi, abyś sprawdził drogę za wioską.',steps:[{type:'move',target:60,label:'Oddal się 60 m od wioski'},{type:'kill',target:'any',count:2,label:'Pokonaj 2 stworzenia'}],xp:150,gold:25},
 {id:'q2',chapter:'Cienie nad Doliną',name:'Zaginiona owca',level:2,desc:'Z pastwiska zniknęła owca. Wszyscy obwiniają wilki.',steps:[{type:'discover',target:'pasture',label:'Zbadaj pastwisko'},{type:'kill',target:'wolf',count:1,label:'Sprawdź trop wilków'}],xp:260,gold:35},
 {id:'q3',chapter:'Cienie nad Doliną',name:'Wilcza jama',level:3,desc:'Ranne wilki nie wyglądają na winnych. Ślady prowadzą dalej.',steps:[{type:'discover',target:'wolfDen',label:'Odnajdź wilczą jamę'},{type:'kill',target:'goblin',count:3,label:'Pokonaj gobliński patrol'}],xp:420,gold:55},
 {id:'q4',chapter:'Cienie nad Doliną',name:'Mapa',level:4,desc:'Fragment mapy wskazuje stare ruiny.',steps:[{type:'discover',target:'oldRuins',label:'Odkryj Stare Ruiny'}],xp:500,gold:70},
 {id:'q5',chapter:'Cienie nad Doliną',name:'Nie jesteśmy sami',level:4,desc:'Obserwuj ruiny i ustal, dokąd gobliny prowadzą łupy.',steps:[{type:'discover',target:'watchPoint',label:'Dotrzyj do punktu obserwacyjnego'}],xp:560,gold:75},
 {id:'q6',chapter:'Cienie nad Doliną',name:'Obserwator',level:5,desc:'Podsłuchaj rozmowę goblinów bez alarmowania obozu.',steps:[{type:'discover',target:'goblinCamp',label:'Podejdź do obozu goblinów'}],xp:650,gold:90},
 {id:'q7',chapter:'Cienie nad Doliną',name:'Zaginiony myśliwy',level:6,desc:'Myśliwy nie wrócił z patrolu.',steps:[{type:'discover',target:'hunterTrail',label:'Odnajdź ślady myśliwego'},{type:'kill',target:'any',count:3,label:'Oczyść drogę'}],xp:780,gold:110},
 {id:'q8',chapter:'Cienie nad Doliną',name:'Ten, który uciekł',level:6,desc:'Odnajdź rannego myśliwego i eskortuj go do bezpiecznego miejsca.',steps:[{type:'discover',target:'woundedHunter',label:'Odnajdź rannego myśliwego'}],xp:850,gold:115},
 {id:'q9',chapter:'Cienie nad Doliną',name:'Ruiny',level:7,desc:'Zbadaj dziedziniec, wieżę i podziemia ruin.',steps:[{type:'dungeon',target:'oldCrypt',label:'Ukończ Starą Kryptę'}],xp:1050,gold:150},
 {id:'q10',chapter:'Cienie nad Doliną',name:'Stary znak',level:7,desc:'Pustelnik może rozpoznać symbol z ruin.',steps:[{type:'discover',target:'hermit',label:'Odnajdź pustelnika'}],xp:900,gold:120},
 {id:'q11',chapter:'Cienie nad Doliną',name:'Pod ruinami',level:8,desc:'Wróć do ruin i znajdź więźnia.',steps:[{type:'dungeon',target:'oldCrypt',label:'Przeszukaj podziemia'}],xp:1200,gold:180},
 {id:'q12',chapter:'Cienie nad Doliną',name:'Nocny gość',level:8,desc:'Nocą do obozu ma przyjść ktoś ważny.',steps:[{type:'discover',target:'nightGuest',label:'Obserwuj spotkanie nocą'}],xp:1350,gold:200},
 {id:'q13',chapter:'Cienie nad Doliną',name:'Atak na wioskę',level:9,desc:'Gobliny ruszyły na wioskę. Broń mieszkańców.',steps:[{type:'kill',target:'any',count:5,label:'Pokonaj napastników'}],xp:1600,gold:250},
 {id:'q14',chapter:'Cienie nad Doliną',name:'Czarny medalion',level:9,desc:'Zanieś tajemniczy medalion pustelnikowi.',steps:[{type:'discover',target:'hermit',label:'Zanieś Czarny medalion pustelnikowi'}],xp:1500,gold:220},
 {id:'q15',chapter:'Cienie nad Doliną',name:'Droga na północ',level:10,desc:'Pierwszy rozdział dobiega końca. Otwiera się nowy region.',steps:[{type:'move',target:350,label:'Oddal się 350 m od wioski'}],xp:2200,gold:350}
];

export const BUILDINGS = [
 {id:'tavern',name:'Karczma „Pod Krukiem”',icon:'🍺',tag:'Questy • odpoczynek'},
 {id:'shop',name:'Sklep kupiecki',icon:'🛒',tag:'Mikstury • materiały'},
 {id:'smith',name:'Kuźnia',icon:'⚒️',tag:'Ulepszanie • rozbiórka'},
 {id:'alchemist',name:'Alchemik',icon:'⚗️',tag:'Warzenie mikstur'},
 {id:'auction',name:'Dom aukcyjny',icon:'🏛️',tag:'Oferty dnia'},
 {id:'guild',name:'Sala gildii',icon:'🏰',tag:'Gildie • wyprawy'}
];
