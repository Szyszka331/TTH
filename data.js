export const CLASSES = {
  knight:{name:'Ciężki Rycerz',icon:'🛡️',desc:'Tank. Blokuje obrażenia i wytrzymuje najdłużej.',base:{str:7,agi:3,int:2,vit:9},hp:150,mana:35,skill:'Żelazna Forteca'},
  mage:{name:'Mag',icon:'🔮',desc:'Silne zaklęcia, mana i efekty statusowe.',base:{str:2,agi:4,int:10,vit:5},hp:95,mana:120,skill:'Eksplozja Żywiołów'},
  hunter:{name:'Łowca',icon:'🏹',desc:'Krytyki, uniki, podwójny strzał i pupil.',base:{str:4,agi:10,int:3,vit:5},hp:105,mana:65,skill:'Skoordynowany Strzał'},
  berserker:{name:'Berserker',icon:'🪓',desc:'Rośnie w siłę, gdy traci zdrowie.',base:{str:10,agi:5,int:1,vit:7},hp:135,mana:25,skill:'Krwawy Taniec'},
  ranger:{name:'Tropiciel',icon:'🌿',desc:'Hybryda: trucizny, pułapki i pupil.',base:{str:4,agi:8,int:6,vit:5},hp:110,mana:80,skill:'Zatruta Strzała Przeznaczenia'}
};

export const MONSTERS = [
 {id:'slime',name:'Błotny Pełzacz',icon:'🟢',family:'Natura',min:1,max:4,zone:'green',hp:42,atk:7,xp:38,gold:[3,8]},
 {id:'rat',name:'Zdziczały Szczur',icon:'🐀',family:'Natura',min:1,max:5,zone:'green',hp:36,atk:8,xp:35,gold:[2,7]},
 {id:'beetle',name:'Pancerznik',icon:'🪲',family:'Owady',min:2,max:7,zone:'green',hp:48,atk:8,xp:44,gold:[3,9]},
 {id:'wolf',name:'Szary Wilk',icon:'🐺',family:'Natura',min:4,max:10,zone:'green',hp:62,atk:11,xp:62,gold:[5,12]},
 {id:'goblin',name:'Gobliński Zwiadowca',icon:'👺',family:'Ludzie',min:3,max:9,zone:'green',hp:58,atk:10,xp:58,gold:[5,13]},
 {id:'skeleton',name:'Kościany Wojownik',icon:'💀',family:'Nieumarli',min:10,max:18,zone:'green',hp:94,atk:16,xp:118,gold:[10,20]},
 {id:'ghost',name:'Błądząca Zjawa',icon:'👻',family:'Zjawy',min:25,max:36,zone:'yellow',hp:145,atk:23,xp:245,gold:[18,34]},
 {id:'elemental',name:'Żywiołak Kamienia',icon:'🗿',family:'Żywiołaki',min:30,max:42,zone:'yellow',hp:190,atk:25,xp:300,gold:[22,40]},
 {id:'cultist',name:'Kultysta Pustki',icon:'🥷',family:'Ludzie',min:20,max:35,zone:'yellow',hp:135,atk:24,xp:220,gold:[16,35]},
 {id:'demon',name:'Rogaty Demon',icon:'👹',family:'Demony',min:40,max:55,zone:'red',hp:265,atk:38,xp:520,gold:[35,65]},
 {id:'wyvern',name:'Popielna Wywerna',icon:'🐉',family:'Bestie',min:60,max:75,zone:'black',hp:420,atk:58,xp:920,gold:[70,120]}
];

export const ITEMS = {
 rustySword:{id:'rustySword',name:'Wyszczerbiony miecz',icon:'🗡️',type:'weapon',rarity:'common',value:18,power:4},
 hunterBow:{id:'hunterBow',name:'Łuk zwiadowcy',icon:'🏹',type:'weapon',rarity:'common',value:20,power:4},
 apprenticeStaff:{id:'apprenticeStaff',name:'Kostur ucznia',icon:'🪄',type:'weapon',rarity:'common',value:20,power:4},
 axe:{id:'axe',name:'Ciężki topór',icon:'🪓',type:'weapon',rarity:'common',value:20,power:5},
 leather:{id:'leather',name:'Skórzana kamizelka',icon:'🥋',type:'armor',rarity:'common',value:16,armor:3},
 ironArmor:{id:'ironArmor',name:'Żelazny kirys',icon:'🛡️',type:'armor',rarity:'rare',value:75,armor:9},
 blueBlade:{id:'blueBlade',name:'Ostrze Strażnika',icon:'⚔️',type:'weapon',rarity:'rare',value:110,power:14},
 shadowRing:{id:'shadowRing',name:'Pierścień Cienia',icon:'💍',type:'trinket',rarity:'epic',value:260,crit:8},
 potion:{id:'potion',name:'Mikstura życia',icon:'🧪',type:'consumable',rarity:'common',value:12,heal:55},
 manaPotion:{id:'manaPotion',name:'Mikstura many',icon:'🔷',type:'consumable',rarity:'common',value:14,mana:45},
 wolfPelt:{id:'wolfPelt',name:'Wilcza skóra',icon:'🧶',type:'material',rarity:'common',value:8},
 herb:{id:'herb',name:'Gorzki liść',icon:'🌿',type:'material',rarity:'common',value:4},
 bone:{id:'bone',name:'Kość nieumarłego',icon:'🦴',type:'material',rarity:'common',value:6},
 blackMedallion:{id:'blackMedallion',name:'Czarny medalion',icon:'📿',type:'quest',rarity:'epic',value:0}
};

export const QUESTS = [
 {id:'q1',chapter:'Cienie nad Doliną',name:'Pierwszy krok',level:1,desc:'Karczmarz prosi, abyś sprawdził drogę za wioską.',steps:[{type:'move',target:60,label:'Oddal się 60 m od wioski'},{type:'kill',target:'any',count:2,label:'Pokonaj 2 stworzenia'}],xp:150,gold:25},
 {id:'q2',chapter:'Cienie nad Doliną',name:'Zaginiona owca',level:2,desc:'Z pastwiska zniknęła owca. Wszyscy obwiniają wilki.',steps:[{type:'discover',target:'pasture',label:'Zbadaj pastwisko'},{type:'kill',target:'wolf',count:1,label:'Sprawdź trop wilków'}],xp:260,gold:35},
 {id:'q3',chapter:'Cienie nad Doliną',name:'Wilcza jama',level:3,desc:'Ranne wilki nie wyglądają na winnych. Ślady prowadzą dalej.',steps:[{type:'discover',target:'wolfDen',label:'Odnajdź wilczą jamę'},{type:'kill',target:'goblin',count:3,label:'Pokonaj gobliński patrol'}],xp:420,gold:55},
 {id:'q4',chapter:'Cienie nad Doliną',name:'Mapa',level:4,desc:'Fragment mapy wskazuje stare ruiny.',steps:[{type:'discover',target:'oldRuins',label:'Odkryj Stare Ruiny'}],xp:500,gold:70},
 {id:'q5',chapter:'Cienie nad Doliną',name:'Nie jesteśmy sami',level:4,desc:'Obserwuj ruiny i ustal, dokąd gobliny prowadzą łupy.',steps:[{type:'discover',target:'watchPoint',label:'Dotrzyj do punktu obserwacyjnego'}],xp:560,gold:75},
 {id:'q6',chapter:'Cienie nad Doliną',name:'Obserwator',level:5,desc:'Podsłuchaj rozmowę goblinów bez alarmowania obozu.',steps:[{type:'discover',target:'goblinCamp',label:'Podejdź do obozu goblinów'}],xp:650,gold:90},
 {id:'q7',chapter:'Cienie nad Doliną',name:'Zaginiony myśliwy',level:6,desc:'Myśliwy nie wrócił z patrolu.',steps:[{type:'discover',target:'hunterTrail',label:'Odnajdź ślady myśliwego'},{type:'kill',target:'any',count:3,label:'Oczyść drogę'}],xp:780,gold:110},
 {id:'q8',chapter:'Cienie nad Doliną',name:'Ten, który uciekł',level:6,desc:'Odnajdź rannego myśliwego i eskortuj go do bezpiecznego miejsca.',steps:[{type:'discover',target:'woundedHunter',label:'Odnajdź rannego myśliwego'}],xp:850,gold:115},
 {id:'q9',chapter:'Cienie nad Doliną',name:'Ruiny',level:7,desc:'Zbadaj dziedziniec, wieżę i podziemia ruin.',steps:[{type:'dungeon',target:'oldCrypt',label:'Ukończ Stare Ruiny'}],xp:1050,gold:150},
 {id:'q10',chapter:'Cienie nad Doliną',name:'Stary znak',level:7,desc:'Pustelnik może rozpoznać symbol z ruin.',steps:[{type:'discover',target:'hermit',label:'Odnajdź pustelnika'}],xp:900,gold:120},
 {id:'q11',chapter:'Cienie nad Doliną',name:'Pod ruinami',level:8,desc:'Wróć do ruin i znajdź więźnia.',steps:[{type:'dungeon',target:'oldCrypt',label:'Przeszukaj podziemia'}],xp:1200,gold:180},
 {id:'q12',chapter:'Cienie nad Doliną',name:'Nocny gość',level:8,desc:'Nocą do obozu ma przyjść ktoś ważny.',steps:[{type:'discover',target:'nightGuest',label:'Obserwuj spotkanie nocą'}],xp:1350,gold:200},
 {id:'q13',chapter:'Cienie nad Doliną',name:'Atak na wioskę',level:9,desc:'Gobliny ruszyły na wioskę. Broń mieszkańców.',steps:[{type:'kill',target:'any',count:5,label:'Pokonaj napastników'}],xp:1600,gold:250},
 {id:'q14',chapter:'Cienie nad Doliną',name:'Czarny medalion',level:9,desc:'Zanieś tajemniczy medalion pustelnikowi.',steps:[{type:'item',target:'blackMedallion',label:'Zdobądź Czarny medalion'}],xp:1500,gold:220},
 {id:'q15',chapter:'Cienie nad Doliną',name:'Droga na północ',level:10,desc:'Pierwszy rozdział dobiega końca. Otwiera się nowy region.',steps:[{type:'move',target:350,label:'Wyrusz 350 m na północ'}],xp:2200,gold:350}
];

export const SKILLS = {
 knight:[{id:'shield',name:'Uderzenie tarczą',lvl:2,cost:1,desc:'120% obrażeń i 25% szansy na osłabienie ataku wroga.'},{id:'fortress',name:'Żelazna Forteca',lvl:5,cost:2,desc:'Na 2 tury zmniejsza obrażenia o 45%.'},{id:'taunt',name:'Prowokacja',lvl:8,cost:2,desc:'W PvE zmniejsza atak przeciwnika.'}],
 mage:[{id:'fire',name:'Ognisty pocisk',lvl:2,cost:1,desc:'150% obrażeń magicznych.'},{id:'frost',name:'Lodowa pieczęć',lvl:5,cost:2,desc:'Obrażenia i spowolnienie.'},{id:'elemental',name:'Eksplozja Żywiołów',lvl:8,cost:2,desc:'Potężny atak zużywający dużo many.'}],
 hunter:[{id:'double',name:'Podwójny strzał',lvl:2,cost:1,desc:'Dwa słabsze trafienia.'},{id:'mark',name:'Znak łowcy',lvl:5,cost:2,desc:'Zwiększa szansę na krytyk.'},{id:'petStrike',name:'Skoordynowany Strzał',lvl:8,cost:2,desc:'Atak razem z pupilem.'}],
 berserker:[{id:'rage',name:'Furia',lvl:2,cost:1,desc:'Więcej obrażeń przy niskim HP.'},{id:'cleave',name:'Rozłupanie',lvl:5,cost:2,desc:'Silny cios 170%.'},{id:'blood',name:'Krwawy Taniec',lvl:8,cost:2,desc:'Seria trzech ataków.'}],
 ranger:[{id:'poison',name:'Zatruty grot',lvl:2,cost:1,desc:'Nakłada truciznę na 3 tury.'},{id:'trap',name:'Leśna pułapka',lvl:5,cost:2,desc:'Zmniejsza atak i unik wroga.'},{id:'destiny',name:'Strzała Przeznaczenia',lvl:8,cost:2,desc:'Mocny strzał z bonusem do krytyka.'}]
};

export const BUILDINGS = [
 {id:'tavern',name:'Karczma „Pod Krukiem”',icon:'🍺',x:-45,y:-30,type:'building'},
 {id:'shop',name:'Sklep kupiecki',icon:'🛒',x:35,y:-28,type:'building'},
 {id:'smith',name:'Kuźnia',icon:'⚒️',x:-30,y:42,type:'building'},
 {id:'alchemist',name:'Alchemik',icon:'⚗️',x:42,y:44,type:'building'},
 {id:'auction',name:'Dom aukcyjny',icon:'🏛️',x:0,y:78,type:'building'},
 {id:'guild',name:'Sala gildii',icon:'🏰',x:75,y:12,type:'building'}
];
