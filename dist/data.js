export const VERSION='4.1 · SZLAK ŁOWCÓW';
export const CLASSES={
 knight:{name:'Rycerz',sprite:0,tag:'Tarcza i odwet',desc:'Osłoń cios. Odpowiedz mocniejszym uderzeniem.',hp:120,mana:32,armor:4,crit:.08,weapon:'sword',skills:[['shield','Uderzenie tarczą',8,1.6,'stun'],['riposte','Riposta',10,2.2,'damage'],['fortress','Forteca',9,0,'guard'],['breaker','Łamacz gardy',14,2.8,'damage']]},
 mage:{name:'Mag',sprite:1,tag:'Żywioły i kontrola',desc:'Podpalaj przeciwników i zatrzymuj ich lodem.',hp:82,mana:65,armor:1,crit:.10,weapon:'staff',skills:[['fire','Ognisty pocisk',8,1.7,'burn'],['frost','Lodowa pieczęć',10,1.3,'stun'],['heal','Uzdrowienie',15,0,'heal'],['meteor','Meteor',20,3.0,'damage']]},
 hunter:{name:'Łowca',sprite:2,tag:'Celność i krytyki',desc:'Szybkie strzały. Potężne trafienia z przygotowania.',hp:96,mana:40,armor:2,crit:.22,weapon:'bow',skills:[['double','Podwójny strzał',7,1.7,'damage'],['aim','Celny strzał',10,2.0,'crit'],['camouflage','Kamuflaż',9,0,'guard'],['pierce','Przeszywająca strzała',14,2.7,'damage']]},
 berserker:{name:'Berserker',sprite:3,tag:'Furia i mocne ciosy',desc:'Im mniej życia, tym mocniej uderzasz.',hp:110,mana:32,armor:2,crit:.13,weapon:'axe',skills:[['cleave','Rozłupanie',7,1.8,'damage'],['blood','Krwawy zamach',9,1.5,'bleed'],['roar','Ryk wojownika',10,0,'guard'],['execute','Egzekucja',14,2.7,'damage']]},
 ranger:{name:'Tropiciel',sprite:4,tag:'Trucizna i pułapki',desc:'Zatruj cel, a potem złap go w sidła.',hp:96,mana:48,armor:2,crit:.14,weapon:'bow',skills:[['poison','Zatruta strzała',7,1.15,'poison'],['trap','Leśne sidła',9,1.4,'stun'],['wind','Krok wiatru',8,0,'guard'],['venom','Jadowita salwa',14,2.1,'poison']]}
};
export const ITEMS={
 potion:{name:'Mikstura życia',sprite:18,type:'consumable',rarity:'common',price:18,sell:5,heal:45,desc:'Przywraca 45 punktów życia. W walce usuwa krwawienie i truciznę.'},
 mana:{name:'Mikstura many',sprite:19,type:'consumable',rarity:'common',price:20,sell:6,mana:35,desc:'Przywraca 35 punktów many.'},
 strongPotion:{name:'Esencja życia',sprite:18,type:'consumable',rarity:'uncommon',price:35,sell:10,heal:100,desc:'Przywraca 100 punktów życia. W walce usuwa krwawienie i truciznę.'},
 pelt:{name:'Wilcza skóra',sprite:20,type:'material',rarity:'common',sell:8,desc:'Skóra z wilków na Leśnym Szlaku. Nessa potrzebuje jej do naprawy płaszczy straży.'},
 fang:{name:'Ostry kieł',sprite:21,type:'material',rarity:'uncommon',sell:12,desc:'Trofeum wilka lub dzika. Kowal wykorzysta je przy ulepszaniu broni.'},
 crystal:{name:'Odłamek przysięgi',sprite:22,type:'material',rarity:'rare',sell:35,desc:'Runiczny kryształ ze strażnika ruin. Potrzebny do stworzenia broni reliktowej.'},
 herb:{name:'Srebrzyste ziele',sprite:23,type:'material',rarity:'common',sell:4,desc:'Rośnie w leśnych polanach. Trzy wiązki i 6 złota wystarczą na miksturę życia.'},
 leather:{name:'Skórzana kurtka',sprite:17,type:'armor',slot:'armor',rarity:'common',price:42,sell:12,armor:3,hp:8,level:1,desc:'Prosta ochrona na pierwszą wyprawę.'},
 scoutArmor:{name:'Kaftan strażnika',sprite:17,type:'armor',slot:'armor',rarity:'uncommon',price:105,sell:30,armor:7,hp:20,level:3,desc:'Solidny kaftan z pracowni miejscowego kowala.'},
 oathArmor:{name:'Pancerz Starej Straży',sprite:17,type:'armor',slot:'armor',rarity:'rare',sell:70,armor:11,hp:38,level:5,desc:'Rzadki łup ze strażnika. Wzmacnia obronę i maksymalne życie.'},
 shield:{name:'Tarcza wartownika',sprite:16,type:'shield',slot:'offhand',classes:['knight'],rarity:'common',price:36,sell:10,armor:3,level:1,desc:'Pozwala Rycerzowi przygotować odwet po osłonięciu ciosu.'}
};
const weapons={sword:['Miecz podróżny','Miecz Zielonej Straży','Ostrze Przysięgi',12],staff:['Kostur wędrowca','Kostur Srebrnego Liścia','Berło Przysięgi',13],bow:['Łuk myśliwski','Łuk Zielonej Straży','Cięciwa Przysięgi',14],axe:['Topór podróżny','Topór Zielonej Straży','Rozłam Przysięgi',15]};
for(const [type,[normal,good,relic,sprite]] of Object.entries(weapons))for(let tier=0;tier<3;tier++){
 const id=type+tier;ITEMS[id]={name:[normal,good,relic][tier],sprite,type:'weapon',slot:'weapon',classes:Object.entries(CLASSES).filter(([,c])=>c.weapon===type).map(([id])=>id),rarity:['common','uncommon','epic'][tier],attack:[5,12,23][tier],level:[1,3,5][tier],price:[32,110,0][tier],sell:[10,32,100][tier],desc:tier===2?'Relikt dawnej straży. Co trzeci trafiony atak przywraca 7 życia.':tier===1?'Broń wyraźnie mocniejsza od wyposażenia podróżnego.':'Niezawodna broń na początek drogi.',relic:tier===2};
}
export const ENEMIES={
 wolf:{name:'Wilk szarego szlaku',sprite:6,level:1,hp:39,attack:9,armor:0,xp:25,gold:8,region:'Leśny Szlak',desc:'Krąży przy trakcie. Przed skokiem przywiera do ziemi.',intent:'Przygotowuje skok',loot:[['pelt',1],['fang',.38]],x:70,y:37},
 boar:{name:'Dzik z podszytu',sprite:7,level:2,hp:63,attack:13,armor:2,xp:38,gold:11,region:'Zielona Polana',desc:'Wytrzymały i uparty. Obrona osłabia jego szarżę.',intent:'Przygotowuje szarżę',loot:[['fang',.75],['pelt',.4]],x:79,y:56},
 goblin:{name:'Goblin szabrownik',sprite:8,level:3,hp:87,attack:17,armor:3,xp:52,gold:17,region:'Stara Wieża',desc:'Zbiera cudze rzeczy przy ruinach strażnicy.',intent:'Celuje zatrutym ostrzem',loot:[['fang',.5],['potion',.4],['scoutArmor',.12]],x:81,y:77},
 slime:{name:'Leśny śluz',sprite:9,level:1,hp:31,attack:6,armor:0,xp:17,gold:5,region:'Nad Potokiem',desc:'Łagodniejsze starcie dla początkującego wędrowca.',intent:'Zbiera się do skoku',loot:[['herb',.8],['mana',.15]],x:60,y:63},
 wisp:{name:'Błędny ognik',sprite:11,level:4,hp:105,attack:19,armor:1,xp:66,gold:20,region:'Zapomniane Ruiny',desc:'Niebieski blask prowadzi ku zamkniętej bramie.',intent:'Skupia magiczny rozbłysk',loot:[['mana',.65],['crystal',.2]],x:83,y:28},
 guardian:{name:'Strażnik Przysięgi',sprite:10,level:5,hp:235,attack:27,armor:5,xp:150,gold:55,region:'Serce Ruin',boss:true,desc:'Dawny obrońca pogranicza. Pokonaj go, by odzyskać pierwszy relikt.',intent:'Unosi kamienny młot',loot:[['crystal',1],['oathArmor',.25]],x:89,y:13}
};
export const LOCATIONS=[
 {id:'inn',name:'Karczma Pod Lisem',type:'service',service:'inn',x:14,y:22,sprite:5,tag:'Odpoczynek • opowieść'},
 {id:'smith',name:'Kuźnia Torena',type:'service',service:'smith',x:13,y:60,sprite:12,tag:'Broń • pancerze • ulepszenia'},
 {id:'alchemist',name:'Pracownia Eldry',type:'service',service:'alchemist',x:28,y:43,sprite:19,tag:'Mikstury • warzenie'},
 {id:'guild',name:'Brama Straży',type:'service',service:'guild',x:39,y:31,sprite:16,tag:'Kontrakty • reputacja'},
 {id:'herbs',name:'Srebrzysta polana',type:'gather',x:68,y:22,sprite:23,tag:'Zbieranie ziół'},
 {id:'chest',name:'Skrzynia patrolu',type:'chest',x:61,y:79,sprite:22,tag:'Sekret pogranicza'},
 ...Object.entries(ENEMIES).map(([id,e])=>({id,name:e.name,type:'enemy',x:e.x,y:e.y,sprite:e.sprite,tag:`Poziom ${e.level}${e.boss?' • BOSS':''}`}))
];
export const QUESTS=[
 {id:'q1',title:'Ślady na szlaku',speaker:'Nessa',text:'Patrol nie wrócił do bramy. Na trakcie słychać wilki. Oczyść drogę i przynieś dwie skóry — uszyjemy strażnikom ciepłe płaszcze.',goals:[['wolf',3,'Pokonaj wilki'],['pelt',2,'Przynieś wilcze skóry']],gold:35,xp:45},
 {id:'q2',title:'Znak pod starą wieżą',speaker:'Toren',text:'Na skrzyni patrolu znalazłem ten sam znak co na dawnych murach. Gobliny kręcą się przy wieży. Przepędź je i sprawdź porzucone zapasy.',goals:[['goblin',2,'Pokonaj szabrowników'],['chest',1,'Otwórz skrzynię patrolu']],gold:50,xp:70},
 {id:'q3',title:'Przysięga w kamieniu',speaker:'Nessa',text:'To nie potwór strzegł bramy. To jeden z naszych, zaklęty przed laty. Przełam jego kamienną zbroję i przynieś odłamek. Toren wykuje z niego broń godną nowej straży.',goals:[['guardian',1,'Pokonaj Strażnika Przysięgi'],['crystal',1,'Przynieś odłamek przysięgi']],gold:80,xp:120}
];
export const RARITY={common:'Zwykły',uncommon:'Niepospolity',rare:'Rzadki',epic:'Reliktowy'};

export const AFFIXES={
 power:{name:'Mocy',attack:3,desc:'+3 do ataku'},
 precision:{name:'Precyzji',crit:.04,desc:'+4 p.p. szansy na krytyk'},
 vitality:{name:'Witalności',hp:16,desc:'+16 maksymalnego życia'},
 ward:{name:'Ochrony',armor:2,desc:'+2 do pancerza'},
 focus:{name:'Skupienia',maxMana:12,desc:'+12 maksymalnej many'}
};
export const ELITE_NAMES={wolf:'Alfa Szarego Szlaku',boar:'Odyniec Ciernistego Boru',goblin:'Herszt Starej Wieży',slime:'Pradawny śluz',wisp:'Ognik Złamanej Pieczęci',guardian:'Przebudzony Strażnik'};
export const TACTICS={
 wolf:{heavy:1.7,effect:'bleed',effectName:'Krwawienie',tick:3,tip:'Nieosłonięty skok wywołuje krwawienie. Mikstura życia usuwa ten efekt.'},
 boar:{heavy:2,tip:'Szarża jest bardzo mocna. Osłoń ją, aby otworzyć okazję do mocniejszego ciosu.'},
 goblin:{heavy:1.5,effect:'poison',effectName:'Trucizna',tick:4,tip:'Zatrute ostrze rani jeszcze przez dwie tury. Obrona zapobiega zatruciu.'},
 slime:{heavy:1.4,tip:'Dobry cel pierwszej wyprawy. Obrona przed skokiem otwiera okazję do kontry.'},
 wisp:{heavy:1.6,effect:'drain',tip:'Nieosłonięty rozbłysk zabiera dodatkowo 10 many. Przerwij go lub się osłoń.'},
 guardian:{heavy:1.85,tip:'Poniżej 35% życia wpada w szał. Przerwij młot lub osłoń cios, a potem wykorzystaj odsłonięcie.'}
};
export const HUNTS=[
 {id:'supplies',title:'Płaszcze na zimny szlak',giver:'Nessa',level:2,text:'Strażnicy wrócili, ale ich płaszcze są w strzępach. Zbierz skóry i ziele do ich wyprawienia. Toren uszyje dla Ciebie kaftan.',goals:[['pelt',6,'Wilcze skóry'],['herb',4,'Srebrzyste ziele']],gold:30,xp:55,reward:'scoutArmor',affix:'vitality',target:'wolf'},
 {id:'alphas',title:'Ten, którego słucha wataha',giver:'Straż Pogranicza',level:3,text:'Zwykłe wilki uciekają przed nowym przywódcą. Pokonaj dwie Alfy na Leśnym Szlaku. Straż odda Ci broń ze swojego skarbca.',goals:[['elite:wolf',2,'Pokonaj Alfy Szarego Szlaku']],gold:60,xp:90,reward:'class1',affix:'precision',target:'wolf'},
 {id:'echo',title:'Echo pod kamieniem',giver:'Toren',level:7,text:'Kamienny strażnik nadal słyszy dawną przysięgę. Zmierz się z jego przebudzoną postacią i przynieś cztery odłamki. Wzmocnimy Twój pancerz runami.',goals:[['elite:guardian',1,'Pokonaj Przebudzonego Strażnika'],['crystal',4,'Odłamki przysięgi']],gold:100,xp:170,reward:'oathArmor',affix:'ward',target:'guardian'}
];
