import {CLASSES,MONSTERS,MONSTER_LOOT,ITEMS,QUESTS,SKILLS,PETS,RECIPES,DUNGEONS,BUILDINGS} from './data.js?v=3900';

const REAL_SAVE_KEY='time4heroes_build_390', DEMO_SAVE_KEY='time4heroes_build_390_sandbox', MODE_KEY='time4heroes_mode';
let SAVE_KEY=localStorage.getItem(MODE_KEY)==='sandbox'?DEMO_SAVE_KEY:REAL_SAVE_KEY;
const MIGRATION_KEYS=['time4heroes_build_380','time4heroes_build_370','time4heroes_build_360','time4heroes_build_350','time4heroes_build_340','time4heroes_build_330','time4heroes_build_320','time4heroes_build_311','time4heroes_build_310','time4heroes_build_290','time4heroes_build_270','time4heroes_build_251','time4heroes_build_257','time4heroes_build_25','time4heroes_build_24','time4heroes_build_23','time4heroes_build_232','time4heroes_build_22','time4heroes_build_21','time4heroes_build_115','time4heroes_build_114','time4heroes_build_111','time4heroes_build_110','time4heroes_build_19','time4heroes_build_18','time4heroes_build_17','time4heroes_build_16','time4heroes_build_15','time4heroes_build_14','time4heroes_build_13','time4heroes_build_12_core','time4heroes_build_11','time4heroes_build_10','time4heroes_build_09','time4heroes_build_08','georpg_build_07','georpg_build_06','georpg_build_05','georpg_build_04','georpg_build_03','georpg_build_02','georpg_build_01'];
const app=document.querySelector('#app');
const toastEl=document.querySelector('#toast');
const BUILD_VERSION='3.9.0';
function refreshVisibleBuildLabels(){const walker=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))if(node.nodeValue?.includes('3.0.7'))node.nodeValue=node.nodeValue.replaceAll('3.0.7',BUILD_VERSION)}
new MutationObserver(refreshVisibleBuildLabels).observe(app,{childList:true,subtree:true});
let state=null;
let combat=null;
let dungeonRun=null;
let battleResult=null;
let saveDepth=0;
let lastAcceptedFix=null;
let lastGpsWarningAt=0;
let dungeonTimerId=null;
let gpsWatch=null;
let currentTab='map';
let installPromptEvent=null;
let realMap=null;
let fogLayer=null;
let trailLayer=null;
let playerMapMarker=null;
let accuracyCircle=null;
let interactionCircle=null;
let questGuideLayer=null;
let followGps=true;
let leafletEntityLayers=[];
let leafletZoneLayers=[];
let leafletBiomeLayers=[];
let leafletDecorLayers=[];
let lastGpsTick=0;
let gpsPausedByBackground=false;
let playerWalkStopTimer=null;
const playerMotion={heading:0,speed:0,moving:false,movingUntil:0,lastAt:0};
let isOnline=navigator.onLine;
function connectionBanner(){return isOnline?'':'<div class=\"offline-banner\" data-offline-banner>📴 Tryb offline — zapis i większość gry działa, ale OpenStreetMap może być niedostępny.</div>'}
function refreshConnectionBanner(){const old=document.querySelector('[data-offline-banner]');if(!isOnline&&!old)document.querySelector('.shell')?.insertAdjacentHTML('afterbegin',connectionBanner());if(isOnline&&old)old.remove()}
window.addEventListener('online',()=>{isOnline=true;refreshConnectionBanner();toast('Połączenie wróciło.')});
window.addEventListener('offline',()=>{isOnline=false;refreshConnectionBanner();toast('Brak internetu — tryb offline.')});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPromptEvent=e;});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const dist=(a,b)=>Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));
const uid=()=>Math.random().toString(36).slice(2,10);
const daySeed=()=>Number(todayKey().replaceAll('-',''));
const seeded=(seed)=>{const x=Math.sin(seed)*10000;return x-Math.floor(x)};
const fmt=n=>Math.round(n).toLocaleString('pl-PL');
const MONSTER_VARIANTS={
 normal:{id:'normal',label:'Zwykły',icon:'●',hp:1,atk:1,xp:1,gold:1,loot:1,scale:1,desc:'Podstawowa odmiana gatunku.'},
 young:{id:'young',label:'Młody',icon:'🌱',hp:.78,atk:.86,xp:.78,gold:.76,loot:.84,scale:.88,desc:'Mniejszy i słabszy osobnik, ale nadal może upuścić typowe materiały.'},
 hardened:{id:'hardened',label:'Zahartowany',icon:'⚔️',hp:1.34,atk:1.16,xp:1.38,gold:1.30,loot:1.20,scale:1.04,drop:'hardenedMark',desc:'Doświadczony osobnik z większą wytrzymałością i lepszym łupem.'},
 corrupted:{id:'corrupted',label:'Skażony',icon:'🟣',hp:1.62,atk:1.34,xp:1.72,gold:1.58,loot:1.46,scale:1.09,drop:'corruptedEssence',desc:'Rzadka wersja przesiąknięta obcą energią. Jest groźniejsza i zostawia skażoną esencję.'},
 ancient:{id:'ancient',label:'Pradawny',icon:'👑',hp:2.12,atk:1.56,xp:2.45,gold:2.15,loot:1.82,scale:1.16,drop:'ancientRelic',desc:'Najrzadsza odmiana gatunku — niemal mini-boss z najlepszymi nagrodami.'}
};
const MONSTER_VARIANT_ORDER=['normal','young','hardened','corrupted','ancient'];
function stableTextSeed(value=''){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h||1)}
function monsterVariantFromRoll(roll,level=1){let id=roll<.54?'normal':roll<.76?'young':roll<.92?'hardened':roll<.985?'corrupted':'ancient';if(level<3&&id==='corrupted')id='hardened';if(level<8&&id==='ancient')id='corrupted';return id}
function monsterVariantDef(id='normal'){return MONSTER_VARIANTS[id]||MONSTER_VARIANTS.normal}
function entityMonsterVariant(e,level=state?.player?.level||1){if(!e)return 'normal';if(MONSTER_VARIANTS[e.variant])return e.variant;const seed=stableTextSeed(`${e.id||e.template||'monster'}:${e.template||''}`)+daySeed()*31;e.variant=monsterVariantFromRoll(seeded(seed),level);return e.variant}
function geoDistance(a,b){
 const lat1=Number(a?.lat),lng1=Number(a?.lng),lat2=Number(b?.lat),lng2=Number(b?.lng);
 if(![lat1,lng1,lat2,lng2].every(Number.isFinite))return Infinity;
 const R=6371000,toRad=x=>x*Math.PI/180,dLat=toRad(lat2-lat1),dLng=toRad(lng2-lng1);
 const s=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
 return 2*R*Math.asin(Math.min(1,Math.sqrt(s)));
}


const CORE_UNLOCKS={shop:{level:1,label:'Poziom 1'},smith:{level:1,label:'Poziom 1'},alchemist:{level:1,label:'Poziom 1'},auction:{level:8,label:'Poziom 8'},guild:{level:10,label:'Poziom 10'}};
const TUTORIAL_STEPS=[
 {id:'move',title:'Pierwszy krok',text:'Odejdź 60 m od punktu startowego. GPS pokazuje Twoją pozycję, a tryb testowy pozwala sprawdzić grę bez wychodzenia.',go:'map'},
 {id:'kill',title:'Pierwsza walka',text:'Podejdź do słabego przeciwnika i wygraj pierwszą walkę.',go:'map'},
 {id:'tavern',title:'Bezpieczny powrót',text:'Odwiedź Karczmę „Pod Krukiem”. To Twój pierwszy bezpieczny hub.',go:'town'},
 {id:'inventory',title:'Sprawdź zdobycz',text:'Otwórz Bohater → Ekwipunek. Po pierwszej walce czeka tam treningowy łup.',go:'inventory'},
 {id:'equip',title:'Załóż nowy sprzęt',text:'Wyposaż znaleziony przedmiot i zobacz, jak zmienia statystyki.',go:'inventory'},
 {id:'skill',title:'Pierwsza umiejętność',text:'W Bohater → Postać wydaj pierwszy punkt umiejętności. Każda klasa rozwija się inaczej.',go:'skills'},
 {id:'secret',title:'Coś poza szlakiem',text:'Odkryj pierwszy sekret. Poza głównym szlakiem czekają miejsca, których jeszcze nie znasz.',go:'map'},
 {id:'dungeonDiscover',title:'Pierwszy loch',text:'Odnajdź Piwnicę Pod Krukiem niedaleko wioski. Samo odkrycie nie wystarczy — pokonaj strażnika wejścia, aby odblokować loch na stałe.',go:'map'},
 {id:'dungeonComplete',title:'Pierwsza wyprawa',text:'Wejdź do odblokowanej Piwnicy Pod Krukiem z zakładki Lochy, eksploruj ją strzałkami i pokonaj bossa przed końcem czasu.',go:'map'}
];

const STORY_SCENES={
 q2:{requiresSteps:3,npc:'Ranne wilki',role:'Dwa zwierzęta przy skraju lasu',classId:'hunter',intro:'Dwa wilki leżą przy ścieżce. Oba są ranne, ale nie od owczych rogów ani pasterskiego kija. W jednej z ran tkwi odłamek prymitywnego grotu, a obok widać ślady butów.',choices:[
  {id:'inspect',label:'Zbadaj rany i ślady',text:'Nie zakładasz winy wilków. Sprawdzasz grot, krew i kierunek, z którego przyszły.',trait:'insight',item:'scrap',result:'Rany są świeże i zadane bronią. Ślady butów prowadzą dalej niż trop wilków — ktoś przepędził zwierzęta i zabrał owce.'},
  {id:'spare',label:'Oszczędź wilki',text:'Zostawiasz zwierzęta w spokoju i zaznaczasz miejsce, by ostrzec pasterzy.',trait:'mercy',item:'herb',result:'Wilki nie próbują atakować. Jedno z nich kulejąc odchodzi w przeciwną stronę niż prowadzą ślady owiec.'},
  {id:'finish',label:'Dobij ranne wilki',text:'Uznajesz, że ranne drapieżniki nadal są zagrożeniem dla okolicy.',trait:'resolve',gold:20,result:'Zabezpieczasz teren, ale dopiero po walce zauważasz obcy grot i ludzkie ślady przy wilczych tropach.'}
 ]},
 q3:{requiresSteps:1,npc:'Ranny wilk',role:'Ślad w wilczej jamie',classId:'hunter',intro:'W jamie nie ma resztek owiec. Są za to strzępy płótna, ślady butów i grot goblińskiej strzały.',choices:[
  {id:'tracks',label:'Zbadaj ślady butów',text:'Skupiasz się na kierunku marszu i liczbie napastników.',trait:'insight',xp:55,result:'Ślady prowadzą ku ruinom i wyglądają na zorganizowany transport.'},
  {id:'arrow',label:'Zbadaj grot strzały',text:'Porównujesz grot z uzbrojeniem goblinów.',trait:'caution',item:'scrap',result:'Metal nosi znak, którego gobliny zwykle nie używają.'}
 ]},
 q6:{requiresSteps:1,npc:'Nessa',role:'Myśliwa zwiadowczyni',classId:'hunter',intro:'Z obozu słychać rozmowę o „panu”, który ma przyjść przed trzecią nocą. Możesz zostać na skraju lasu albo podejść bliżej.',choices:[
  {id:'observe',label:'Zostań w ukryciu',text:'Bezpieczniej. Spróbujesz zapamiętać twarze, drogę i godziny zmian warty.',trait:'caution',xp:70,result:'Poznajesz rytm patroli i nie wzbudzasz podejrzeń.'},
  {id:'close',label:'Podejdź bliżej',text:'Ryzykujesz wykrycie, ale możesz usłyszeć więcej.',trait:'resolve',gold:35,result:'Słyszysz wzmiankę o starych ruinach i czarnym symbolu. Jeden ze zwiadowców odwraca głowę — zostałeś zauważony.',consequence:{type:'combat',monster:'goblin',elite:true,levelOffset:1,label:'Ryzykowne podejście: gobliński patrol może Cię zaatakować.'}}
 ]},
 q10:{requiresSteps:1,npc:'Eldran',role:'Pustelnik',classId:'mage',intro:'Pustelnik rozpoznaje symbol jako znak dawnego bractwa. Twierdzi, że ktoś próbuje odtworzyć ich sieć rytuałów.',choices:[
  {id:'trust',label:'Zaufaj jego wiedzy',text:'Pozwolisz mu zatrzymać kopię znaku i poprosisz o interpretację.',trait:'insight',item:'moonHerb',result:'Eldran dzieli się notatką o miejscach, w których znak może pojawić się ponownie.'},
  {id:'keep',label:'Zachowaj dystans',text:'Nie oddasz nikomu oryginalnych dowodów.',trait:'resolve',gold:45,result:'Pustelnik szanuje ostrożność, ale nie mówi wszystkiego.'}
 ]},
 q12:{requiresSteps:2,npc:'Nieznajomy',role:'Nocny gość',classId:'ranger',intro:'Zakapturzona postać przekazuje goblinom czarny medalion. Po chwili odchodzi samotnie w stronę wzgórz.',choices:[
  {id:'watch',label:'Nie wychodź z ukrycia',text:'Najważniejsze są informacje, nie pościg.',trait:'caution',xp:100,flag:'nightWitness',result:'Zapamiętujesz głos i kierunek odejścia nieznajomego.'},
  {id:'follow',label:'Rusz za nieznajomym',text:'Ryzykujesz, że zauważy śledzenie.',trait:'resolve',gold:60,flag:'nightTrail',result:'Na szlaku znajdujesz fragment czarnego wosku z tym samym symbolem. Nieznajomy zostawia za sobą ochroniarza.',consequence:{type:'combat',monster:'cultist',elite:false,levelOffset:0,label:'Pościg: ochroniarz kultu staje Ci na drodze.'}}
 ]},
 q17:{requiresSteps:1,npc:'Toren',role:'Zwiadowca Północy',classId:'hunter',intro:'W obozie nie ma ciał. Są dwa tropy: jeden prowadzi do zamarzniętego jaru, drugi do porzuconych zapasów.',choices:[
  {id:'survivors',label:'Najpierw szukaj ocalałych',text:'Ludzie mają pierwszeństwo przed łupem i śladami.',trait:'mercy',item:'potion',result:'Znajdujesz ślady ciągniętego rannego. Ktoś mógł przeżyć.'},
  {id:'evidence',label:'Najpierw zabezpiecz ślady',text:'Chcesz wiedzieć, z czym przyjdzie się zmierzyć.',trait:'insight',xp:120,result:'Rozpoznajesz ciężkie kroki ogra i ślady mniejszych butów obok.'}
 ]},
 q22:{requiresSteps:1,npc:'Lysa',role:'Ocalała z mokradeł',classId:'ranger',intro:'Zatopiona wioska wygląda tak, jakby mieszkańcy wyszli z domów w jednej chwili. Z placu dobiega ciche chlupotanie.',choices:[
  {id:'homes',label:'Przeszukaj domy',text:'Szukasz listów, zapasów i śladów codziennego życia.',trait:'insight',item:'mireMoss',result:'Znajdujesz zapiski o dzwonie, który odzywał się przed każdym zaginięciem.'},
  {id:'square',label:'Idź prosto na plac',text:'Źródło dźwięku może zniknąć, jeśli będziesz zwlekać.',trait:'resolve',gold:75,result:'W błocie widzisz świeże ślady prowadzące ku zatopionej kaplicy.'}
 ]},
 q24:{requiresSteps:2,npc:'Głos spod wody',role:'Zatopiony Dzwon',classId:'mage',intro:'Dzwon porusza się bez liny. Każde uderzenie brzmi jak jedno słowo, którego nie potrafisz do końca zrozumieć.',choices:[
  {id:'answer',label:'Odpowiedz na wezwanie',text:'Dotykasz zimnego metalu i pozwalasz wizji wejść do umysłu.',trait:'resolve',xp:160,flag:'bellVision',result:'Widzisz kaplicę sprzed zatopienia i sylwetkę kobiety niosącej czarne korzenie.'},
  {id:'hide',label:'Obserwuj z dystansu',text:'Nie pozwalasz, by rytuał objął także Ciebie.',trait:'caution',item:'wraithEssence',result:'Zauważasz, że każde uderzenie przyciąga zjawy z innej części bagna.'}
 ]},
 q27:{requiresSteps:1,npc:'Ilyra',role:'Alchemiczka',classId:'mage',intro:'Totemy są częścią większego wzoru. Zniszczenie ich osłabi rytuał, ale odczytanie symboli może zdradzić cel wiedźmy.',choices:[
  {id:'destroy',label:'Zniszcz totemy',text:'Nie ryzykujesz, że rytuał będzie dalej działał.',trait:'resolve',xp:180,result:'Mgła na chwilę rzednie, a część stworzeń wycofuje się w głąb bagna.'},
  {id:'study',label:'Odczytaj symbole',text:'Pozostawiasz je na miejscu tak długo, jak to konieczne.',trait:'insight',item:'runeShard',result:'Rozpoznajesz trzy punkty rytuału: kopiec, stary trakt i ołtarz mgły.'}
 ]},
 q29:{requiresSteps:2,npc:'Więzień',role:'Jeniec kultystów',classId:'knight',intro:'Po walce znajdujesz związanego człowieka. Jeden z kultystów ucieka w głąb mokradeł.',choices:[
  {id:'rescue',label:'Uwolnij więźnia',text:'Rezygnujesz z pościgu, żeby wyprowadzić go z obozu.',trait:'mercy',rep:3,result:'Jeniec zdradza, że kult czci „Matkę”, która śpi pod korzeniami.'},
  {id:'shadow',label:'Śledź uciekającego kultystę',text:'Więzień będzie musiał poczekać kilka minut.',trait:'caution',gold:90,result:'Odkrywasz skrót prowadzący ku staremu traktowi i bramie twierdzy.'}
 ]},
 q33:{requiresSteps:2,npc:'Eldran',role:'Echo pustelnika',classId:'mage',intro:'Przy ołtarzu mgła układa się w znaki podobne do tych z Doliny Kruka. Rytuał można złamać siłą albo rozplątać jego strukturę.',choices:[
  {id:'break',label:'Rozbij ołtarz',text:'Przerywasz rytuał natychmiast, zanim zdąży się odnowić.',trait:'resolve',xp:210,result:'Kamień pęka, ale fala energii budzi strażnika korzeni.'},
  {id:'unravel',label:'Rozplącz rytuał',text:'Śledzisz kolejność znaków i wygaszasz je jeden po drugim.',trait:'insight',item:'runePrecision',result:'Dowiadujesz się, że rytuał można zakończyć bez niszczenia samego serca bagna.'}
 ]},
 q35:{npc:'Matka Mgły',role:'Ostatnie echo',classId:'mage',intro:'Po walce serce bagna nadal pulsuje. Możesz je roztrzaskać albo zamknąć w pieczęci, której wzór poznawałeś przez całą wyprawę.',requiresSteps:1,choices:[
  {id:'destroy',label:'Zniszcz serce bagna',text:'Kończysz zagrożenie siłą. Mokradła długo będą dochodziły do siebie.',trait:'resolve',item:'runePower',flag:'endingDestroy',result:'Mgła opada gwałtownie. Część bagien wysycha, ale rytuał nie może już wrócić.'},
  {id:'seal',label:'Zapieczętuj serce',text:'Ryzykujesz, że ktoś kiedyś złamie pieczęć, ale zachowujesz równowagę mokradeł.',trait:'insight',item:'runeGuard',flag:'endingSeal',result:'Mgła cofa się powoli. Bagno pozostaje żywe, ale traci wolę Matki Mgły.'}
 ]},
 q45:{npc:'Serce Żaru',role:'Ostatni płomień pustkowi',classId:'berserker',intro:'Po śmierci Matki Żaru ogień w cytadeli nie gaśnie. Możesz rozbić rdzeń albo zamknąć część jego mocy w runicznej pieczęci.',requiresSteps:1,choices:[
  {id:'quench',label:'Zgaś Serce Żaru',text:'Pustkowia przestaną się rozszerzać, ale ich ogień zostanie utracony.',trait:'mercy',item:'runeGuard',flag:'ashQuenched',result:'Żar przygasa. Po raz pierwszy od lat nad pustkowiami widać czyste niebo.'},
  {id:'bind',label:'Zwiąż moc z pieczęcią',text:'Zachowujesz część energii dla przyszłych walk.',trait:'insight',item:'runePower',flag:'ashBound',result:'Rdzeń zamyka się w czarnym szkle. Pustkowia pozostają gorące, ale przestają rosnąć.'}
 ]},
 q46:{npc:'Kael',role:'Kartograf szczytów',classId:'hunter',intro:'Na przełęczy dwie grupy potrzebują pomocy: ranni kartografowie i zwiadowcy ścigający kultystów burzy.',requiresSteps:1,choices:[
  {id:'rescue',label:'Pomóż kartografom',text:'Zabezpieczasz drogę i ratujesz mapy przełęczy.',trait:'mercy',xp:350,result:'Kartografowie pokazują Ci bezpieczne obejście lodowych urwisk.'},
  {id:'pursue',label:'Ścigaj kultystów',text:'Nie pozwalasz przeciwnikom zniknąć w górach.',trait:'resolve',gold:180,result:'Odnajdujesz znak prowadzący do obozu burzy.'}
 ]},
 q50:{npc:'Zamarznięty Strażnik',role:'Dawna przysięga',classId:'knight',intro:'Rycerz uwięziony w lodzie pamięta tylko rozkaz: strzec drogi do iglicy. Prosi o wolność, ale jego przysięga nadal trzyma pieczęć.',requiresSteps:1,choices:[
  {id:'free',label:'Uwolnij strażnika',text:'Przerywasz jego wieczną służbę.',trait:'mercy',item:'frostCrystal',result:'Lód pęka, a duch odchodzi. Pieczęć słabnie, ale poznajesz jego ostatnie ostrzeżenie.'},
  {id:'oath',label:'Dokończ przysięgę',text:'Pomagasz mu odnowić pieczęć na jeszcze jedną noc.',trait:'caution',item:'stormFeather',result:'Strażnik wskazuje bezpieczną drogę przez Most Niebios.'}
 ]},
 q55:{npc:'Władca Nawałnicy',role:'Serce burzy',classId:'mage',intro:'Po walce w komnacie pozostaje kryształ sterujący pogodą nad szczytami. Możesz go rozbić albo ustawić tak, by burze osłaniały region zamiast go niszczyć.',requiresSteps:1,choices:[
  {id:'shatter',label:'Rozbij Serce Nawałnicy',text:'Kończysz cykl burz raz na zawsze.',trait:'resolve',item:'runePower',flag:'stormShattered',result:'Pioruny znikają. Nad szczytami zapada niezwykła cisza.'},
  {id:'attune',label:'Dostrój Serce Nawałnicy',text:'Ryzykujesz, ale zachowujesz naturalną siłę gór.',trait:'insight',item:'runePrecision',flag:'stormAttuned',result:'Burze odsuwają się od szlaków i zbierają nad pustymi graniami.'}
 ]}
};
function storyScene(qid){return STORY_SCENES[qid]||null}
function ensureStoryState(s=state){if(!s)return;s.story ||= {choices:{},flags:{},traits:{mercy:0,resolve:0,insight:0,caution:0},seen:{},worldEffects:[]};s.story.choices ||= {};s.story.flags ||= {};s.story.traits ||= {mercy:0,resolve:0,insight:0,caution:0};s.story.seen ||= {};s.story.worldEffects ||= [];for(const k of ['mercy','resolve','insight','caution'])s.story.traits[k] ??= 0}
function storyChoiceFor(qid){ensureStoryState();return state.story.choices[qid]||null}
function storyTraitLabel(k){return ({mercy:'Empatia',resolve:'Determinacja',insight:'Wnikliwość',caution:'Ostrożność'})[k]||k}
function conditionSatisfied(target){const c=climate();if(target==='night')return c.phase==='Noc';if(target==='nightOrFog')return c.phase==='Noc'||c.weather==='Mgła';if(target==='badWeather')return ['Mgła','Deszcz','Burza'].includes(c.weather);if(target==='day')return c.phase==='Dzień';return false}
function updateStoryConditions(){if(!state)return;ensureStoryState();let changed=false;for(const qid of [...state.quests.active]){const q=QUESTS.find(x=>x.id===qid);if(!q)continue;const prog=state.quests.progress[qid] ||= q.steps.map(()=>0);q.steps.forEach((s,i)=>{if(s.type==='condition'&&conditionSatisfied(s.target)&&!prog[i]){prog[i]=1;changed=true}else if(s.type==='story'&&storyChoiceFor(qid)&&!prog[i]){prog[i]=1;changed=true}});if(q.steps.every((s,i)=>(prog[i]||0)>=(s.count||1))){rewardQuest(q);changed=true}}if(changed)save()}
function storyProfileHTML(){ensureStoryState();const t=state.story.traits,ending=state.story.flags.endingDestroy?'Zniszczone serce bagna':state.story.flags.endingSeal?'Zapieczętowane serce bagna':null,effects=state.story.worldEffects||[];return `<div class="story-profile"><div><b>🧭 Twój ślad fabularny</b><small>Decyzje zmieniają nagrody, spotkania i to, co później pojawia się w świecie.</small></div><div class="story-traits"><span>🤝 ${storyTraitLabel('mercy')} <b>${t.mercy}</b></span><span>⚔️ ${storyTraitLabel('resolve')} <b>${t.resolve}</b></span><span>🔎 ${storyTraitLabel('insight')} <b>${t.insight}</b></span><span>🕯️ ${storyTraitLabel('caution')} <b>${t.caution}</b></span></div>${effects.length?`<div class="story-world-effects"><b>Ślady w świecie</b>${effects.slice(-5).map(e=>`<span>${e.icon||'◆'} ${e.label}</span>`).join('')}</div>`:''}${ending?`<div class="story-ending">Zakończenie Mokradeł Echa: <b>${ending}</b></div>`:''}</div>`}
function storyCanChoose(qid){const scene=storyScene(qid),q=QUESTS.find(x=>x.id===qid);if(!scene||!q)return false;if(storyChoiceFor(qid))return true;if(!scene.requiresSteps)return true;const prog=state.quests.progress[qid]||[];return q.steps.slice(0,scene.requiresSteps).every((s,i)=>(prog[i]||0)>=(s.count||1))}
function storyChoiceConsequenceHint(choice){const c=choice?.consequence;if(!c)return '';return `<em class="story-consequence-hint">⚠️ ${c.label||'Ta decyzja ma natychmiastową konsekwencję.'}</em>`}
function openStoryScene(qid){ensureStoryState();const scene=storyScene(qid),q=QUESTS.find(x=>x.id===qid);if(!scene||!q)return;const selected=storyChoiceFor(qid);if(!storyCanChoose(qid)&&!selected)return toast('Najpierw ukończ wcześniejszy etap zadania.');state.story.seen[qid]=true;save();const chosen=selected?scene.choices.find(c=>c.id===selected):null;openModal(`<div class="story-modal"><div class="modal-head"><div><div class="story-kicker">${q.chapter}</div><h2>${q.name}</h2><div class="muted">Scena fabularna</div></div><button class="close" data-close>×</button></div><div class="story-scene"><div class="story-npc">${classVisual(scene.classId||'ranger','sprite-story-npc')}<b>${scene.npc}</b><small>${scene.role}</small></div><div class="story-dialogue"><p>${scene.intro}</p>${chosen?`<div class="story-result"><span>TWÓJ WYBÓR</span><b>${chosen.label}</b><p>${chosen.result}</p></div>`:`<div class="story-choices">${scene.choices.map(c=>`<button class="story-choice" data-story-choice="${c.id}"><b>${c.label}</b><small>${c.text}</small>${storyChoiceConsequenceHint(c)}</button>`).join('')}</div>`}</div></div></div>`);document.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>applyStoryChoice(qid,b.dataset.storyChoice))}
function readyStorySceneId(preferred=null){const ids=preferred?[preferred]:[...state.quests.active];return ids.find(qid=>{if(!state.quests.active.includes(qid)||storyChoiceFor(qid))return false;const cur=currentQuestStep(qid);return cur?.step?.type==='story'&&storyCanChoose(qid)})||null}
function queueReadyStoryScene(preferred=null,delay=180){const qid=readyStorySceneId(preferred);if(!qid)return false;setTimeout(()=>{if(!combat&&state?.quests?.active?.includes(qid)&&!storyChoiceFor(qid)&&readyStorySceneId(qid)===qid)openStoryScene(qid)},delay);return true}
function startStoryConsequenceCombat(qid,choice){const c=choice?.consequence;if(c?.type!=='combat')return false;const m=MONSTERS.find(x=>x.id===c.monster);if(!m)return false;const lvl=clamp((state.player.level||1)+(c.levelOffset||0),m.min,m.max),entity={id:`story_${qid}_${choice.id}_${Date.now()}`,type:'monster',template:m.id,x:state.player.position.x||0,y:state.player.position.y||0,alive:true,elite:!!c.elite,synthetic:true};toast(`⚠️ ${c.label||'Zostałeś zaatakowany!'}`);startCombat(entity,{level:lvl,storyConsequence:{qid,choiceId:choice.id}});return true}
function spawnStoryWorldEcho(qid,choice){
 const defs={
  'q2:inspect':{name:'Gobliński zwiadowca',icon:'👣',signal:'Ślady ciężkich butów przecinają drogę',desc:'Trop z miejsca odnalezienia wilków prowadzi do zwiadowcy niosącego cudzy znak.',xp:150,gold:45,choices:[{id:'track',label:'Dopadnij zwiadowcę',text:'Idziesz za tropem, zanim zdąży zniknąć.',combat:'goblin',elite:true,result:'Zwiadowca zauważa pościg i dobywa broni.'},{id:'report',label:'Przekaż trop straży',text:'Zachowujesz dowód i unikasz samotnej walki.',xp:55,rep:2,result:'Strażnicy zaczynają obserwować drogę do ruin.'}]},
  'q2:spare':{name:'Wilk wraca na szlak',icon:'🐺',signal:'Na skraju lasu widzisz znajomą sylwetkę',desc:'Oszczędzony wilk zostawił przy ścieżce zioła zabrudzone goblińską krwią.',xp:90,gold:15,item:'herb',choices:[{id:'accept',label:'Zabierz wskazówkę',text:'Ślady krwi wskazują dalszy kierunek poszukiwań.',item:'moonHerb',result:'Wilk znika między drzewami, ale tym razem nie warczy.'}]},
  'q2:finish':{name:'Niespokojna wataha',icon:'🐺',signal:'Z lasu odpowiada kilka gniewnych wyć',desc:'Zapach krwi zwabił resztę watahy. Wilki okrążają szlak.',xp:135,gold:35,choices:[{id:'stand',label:'Stań do walki',text:'Nie pozwalasz watasze podejść do wioski.',combat:'wolf',elite:true,result:'Największy wilk rusza pierwszy.'},{id:'withdraw',label:'Wycofaj się i ostrzeż pasterzy',text:'Omijasz stado szerokim łukiem.',xp:35,result:'Szlak zostaje czasowo zamknięty.'}]},
  'q29:rescue':{name:'Ocalały z mokradeł',icon:'🧔',signal:'Ktoś woła Cię po imieniu przy starym trakcie',desc:'Uratowany więzień dotrzymał słowa i zostawił informacje o kryjówce kultu.',xp:210,gold:80,item:'bogAmber',choices:[{id:'take',label:'Odbierz mapę i zapasy',text:'Informacja otwiera bezpieczniejsze przejście przez bagno.',rep:3,result:'Na mapie pojawia się oznaczenie bocznej ścieżki.'}]},
  'q29:shadow':{name:'Uciekinier Czarnego Korzenia',icon:'🕯️',signal:'W trzcinach miga czarne światło',desc:'Kultysta, którego śledziłeś, spotyka się ze strażnikiem rytuału.',xp:245,gold:95,choices:[{id:'attack',label:'Przerwij spotkanie',text:'Atakujesz, zanim przekażą sobie wiadomość.',combat:'rotCultist',elite:true,result:'Strażnik rytuału zasłania drogę.'}]}
 };
 const key=`${qid}:${choice.id}`,def=defs[key];if(!def||!state?.world)return;const id=`story_echo_${qid}_${choice.id}`;if((state.world.entities||[]).some(e=>e.id===id)||state.world.living?.completedEvents?.includes(id))return;
 const p=state.player.position||{x:0,y:0},angle=(qid.charCodeAt(1)+(choice.id.length*17))%6.28,r=125+(choice.id.length%4)*28,x=(p.x||0)+Math.cos(angle)*r,y=(p.y||0)+Math.sin(angle)*r,biome=biomeAt(x,y);
 state.world.entities.push({...def,id,type:'event',x,y,biome,done:false,persistent:true,storyEcho:true});state.story.worldEffects.push({id:key,icon:def.icon,label:`${choice.label} → ${def.name}`});
}
function applyStoryChoice(qid,choiceId){ensureStoryState();if(state.story.choices[qid])return;const scene=storyScene(qid),choice=scene?.choices.find(c=>c.id===choiceId);if(!choice)return;state.story.choices[qid]=choice.id;if(choice.trait)state.story.traits[choice.trait]=(state.story.traits[choice.trait]||0)+1;if(choice.flag)state.story.flags[choice.flag]=true;if(choice.gold)state.player.gold+=choice.gold;if(choice.xp)gainXp(choice.xp);if(choice.item)addItem(choice.item);if(choice.rep){ensureAdventureState();state.adventure.reputation+=choice.rep}spawnStoryWorldEcho(qid,choice);save();closeModal();if(startStoryConsequenceCombat(qid,choice))return;checkQuestProgress('story',qid);refresh();toast(`Decyzja zapisana: ${choice.label} • świat zareaguje na ten wybór`)}

let audioCtx=null;
let ambientPlayer=null;
let ambientKey=null;
let ambientWanted=null;
let audioUnlocked=false;
const SFX_FILES={click:'ui-click.wav',discover:'discover.wav',crit:'crit.wav',level:'level.wav',kill:'hit.wav',boss:'boss.wav',equip:'equip.wav',hit:'hit.wav',loot:'loot.wav',heal:'heal.wav'};
const AMBIENT_FILES={forest:'ambient-forest.wav',town:'ambient-tavern.wav',tavern:'ambient-tavern.wav',dungeon:'ambient-dungeon.wav',battle:'ambient-battle.wav',boss:'ambient-boss.wav'};
function ensureAudio(){try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}catch{return null}}
function fallbackTone(type='click'){
 const ctx=ensureAudio();if(!ctx)return;const cfg={click:[420,.025,.018],discover:[660,.18,.045],crit:[900,.12,.05],level:[520,.35,.05],kill:[240,.18,.045],boss:[120,.28,.06],equip:[560,.09,.03],hit:[190,.11,.045],loot:[700,.22,.035],heal:[440,.20,.025]}[type]||[400,.05,.02];
 const o=ctx.createOscillator(),g=ctx.createGain();o.type=type==='boss'?'sawtooth':'square';o.frequency.setValueAtTime(cfg[0],ctx.currentTime);if(type==='level'||type==='loot'||type==='heal')o.frequency.exponentialRampToValueAtTime(Math.max(cfg[0]+1,900),ctx.currentTime+cfg[1]);g.gain.setValueAtTime(cfg[2],ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+cfg[1]);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+cfg[1]);
}
function playSfx(type='click'){
 if(!state?.settings?.masterSound||!state?.settings?.audio)return;const file=SFX_FILES[type];if(!file)return fallbackTone(type);
 try{const a=new Audio(`assets/audio/${file}`);a.volume=clamp(state.settings.sfxVolume??.68,0,1);a.playbackRate=type==='hit'?(.96+Math.random()*.08):1;a.play().catch(()=>{if(state?.settings?.masterSound&&state?.settings?.audio)fallbackTone(type)})}catch{if(state?.settings?.masterSound&&state?.settings?.audio)fallbackTone(type)}
}
function stopAmbient(){if(ambientPlayer){ambientPlayer.pause();ambientPlayer.src='';ambientPlayer=null}ambientKey=null}
function setAmbient(key){ambientWanted=key;if(!state?.settings?.masterSound||!state?.settings?.ambient||!audioUnlocked){if(!state?.settings?.masterSound||!state?.settings?.ambient)stopAmbient();return}const file=AMBIENT_FILES[key];if(!file){stopAmbient();return}if(ambientPlayer&&ambientKey===key&&!ambientPlayer.paused)return;stopAmbient();try{const a=new Audio(`assets/audio/${file}`);a.loop=true;a.volume=clamp(state.settings.ambientVolume??.18,0,.45);ambientPlayer=a;ambientKey=key;a.play().catch(()=>{})}catch{}}
function refreshAmbient(){if(state?.settings?.masterSound&&state?.settings?.ambient&&ambientWanted)setAmbient(ambientWanted);else stopAmbient()}
function toggleMasterSound(){ensureCoreState();const on=!!state.settings.masterSound;state.settings.masterSound=!on;state.settings.audio=!on;state.settings.ambient=!on;if(on){stopAmbient();try{audioCtx?.suspend?.()}catch{}}else{try{audioCtx?.resume?.()}catch{}refreshAmbient()}save();}
document.addEventListener('pointerdown',()=>{if(!audioUnlocked){audioUnlocked=true;refreshAmbient()}},{capture:true});
function haptic(pattern=18){if(state?.settings?.haptics&&navigator.vibrate)navigator.vibrate(pattern)}
const ITEM_ART_ATLAS={
 shortBlade:[0,0],rustySword:[0,0],shortSword:[1,0],blueBlade:[1,0],ravenBlade:[1,0],mistBlade:[1,0],ashBlade:[1,0],ironAxe:[2,0],axe:[2,0],warHammer:[3,0],
 woodenShield:[0,1],ironShield:[1,1],primitiveBow:[2,1],hunterBow:[2,1],yewBow:[2,1],forestBow:[2,1],wildBow:[2,1],mistBow:[2,1],ashBow:[2,1],stormBow:[2,1],willowStaff:[3,1],noviceStaff:[3,1],apprenticeStaff:[3,1],emberWand:[3,1],arcaneStaff:[3,1],mistStaff:[3,1],ashStaff:[3,1],stormStaff:[3,1],
 chainVest:[0,2],ravenMail:[0,2],mistMail:[0,2],ashMail:[0,2],stormMail:[0,2],ironArmor:[1,2],rangerLeather:[2,2],wildMail:[2,2],mistLeathers:[2,2],ashLeathers:[2,2],stormLeathers:[2,2],apprenticeRobe:[3,2],runicRobe:[3,2],arcaneRobe:[3,2],mistRobe:[3,2],ashRobe:[3,2],stormRobe:[3,2],
 potion:[0,3],strongPotion:[0,3],manaPotion:[1,3],oldTalisman:[2,3],wolfCharm:[2,3],mireCharm:[2,3],cinderCharm:[2,3],shadowRing:[3,3],emberRing:[3,3],boneRing:[3,3]
};
function atlasStyle(path,pos,cols,rows){const x=cols===1?0:pos[0]/(cols-1)*100,y=rows===1?0:pos[1]/(rows-1)*100;return `--atlas-image:url('${path}');--atlas-size:${cols*100}% ${rows*100}%;--atlas-x:${x}%;--atlas-y:${y}%`}
function itemIconVisual(id,cls='item-svg'){
 const d=itemDef(id),pos=ITEM_ART_ATLAS[id],family=/^(mist|storm)/.test(id)?'frost':/^(ash|ember|cinder)/.test(id)?'ember':/^(wild|forest|wolf)/.test(id)?'forest':'neutral';
 const art=pos?`<span class="atlas-sprite item-atlas-sprite ${cls} item-tone-${family}" role="img" aria-label="${d.name}" style="${atlasStyle('assets/atlases/item-atlas-320.png',pos,4,4)}"></span>`:`<img src="assets/icons/items/${id}.svg" class="${cls}" alt="${d.name}" loading="lazy">`;
 return `<span class="item-icon-shell item-grade-${d.rarity}" title="${d.name} • ${rarityName(d.rarity)}">${art}</span>`;
}
function skillIconVisual(id,cls='skill-svg'){return `<img src="assets/icons/skills/${id}.svg" class="${cls}" alt="">`}
function ensureCoreState(s=state){if(!s)return;ensureStoryState(s);s.ui ||= {heroView:'char',adventureView:'quests',menuView:'settings'};s.tutorial ||= {stage:0,complete:false,rewardGiven:false,flags:{},introSeen:true};s.tutorial.flags ||= {};s.tutorial.introSeen ??= true;s.tutorial.mapDismissedStage ??= -1;s.settings ||= {};s.settings.audio ??= true;s.settings.ambient ??= true;s.settings.masterSound ??= (s.settings.audio||s.settings.ambient);s.settings.sfxVolume ??= .68;s.settings.ambientVolume ??= .18;s.settings.haptics ??= true;s.settings.mapMode ||= 'focused';s.settings.mapFilters ||= {};s.settings.mapFilters.trail ??= true;s.player.inventoryCapacity ??= 32;s.world.regionRewards ||= {};s.world.fogRadius=100;ensureDungeonAccessState(s);}


const DUNGEON_DAILY_LIMIT=3;
const DUNGEON_SUCCESS_COOLDOWN=60*60*1000;
const DUNGEON_FAIL_COOLDOWN=15*60*1000;
const DUNGEON_GUARDIANS={
 trainingCellar:'slime',oldCrypt:'skeleton',forgottenTower:'cultist',beastLair:'hellhound',sunkenChapel:'mireCrawler',witchBarrow:'rotCultist',blackrootKeep:'blackrootGuardian',emberMine:'cinderCultist',ashenCitadel:'pyreKnight',frostVault:'frozenKnight',tempestSpire:'thunderGolem'
};
const DUNGEON_ROOM_POOLS={
 trainingCellar:['empty','monster','monster','chest','trap','shrine','key','secret'],
 default:['empty','monster','monster','monster','elite','chest','trap','shrine','key','secret']
};
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function ensureDungeonAccessState(s=state){
 if(!s?.player)return;
 s.player.dungeonAccess ||= {};
 s.player.discovered ||= [];
 s.player.dungeons ||= [];
 s.player.dungeonClears ||= {};
 for(const d of DUNGEONS){
  const a=s.player.dungeonAccess[d.id] ||= {discovered:false,guardianDefeated:false,day:todayKey(),attempts:0,cooldownUntil:0,bestTime:null,bestExplore:0,lastResult:null};
  if(a.day!==todayKey()){a.day=todayKey();a.attempts=0}
  const wasKnown=s.player.discovered.includes(d.id)||s.player.dungeons.includes(d.id)||(s.player.dungeonClears[d.id]||0)>0;
  if(wasKnown&&!s.player.discovered.includes(d.id))s.player.discovered.push(d.id);
  a.discovered ||= wasKnown;
  if((s.player.dungeonClears[d.id]||0)>0){a.guardianDefeated=true;if(!s.player.dungeons.includes(d.id))s.player.dungeons.push(d.id)}
  // Old saves that had merely discovered a dungeon but never cleared it now require the new guardian.
  if(!a.guardianDefeated&&s.player.dungeons.includes(d.id)&&(s.player.dungeonClears[d.id]||0)===0){s.player.dungeons=s.player.dungeons.filter(x=>x!==d.id)}
 }
}
function dungeonAccess(id){ensureDungeonAccessState();const a=state.player.dungeonAccess[id];if(a.day!==todayKey()){a.day=todayKey();a.attempts=0;save()}return a}
function dungeonTimeLimit(d){if(d.id==='trainingCellar')return 10*60;if(d.min<15)return 12*60;if(d.min<30)return 15*60;if(d.min<45)return 18*60;return 20*60}
function dungeonSize(d){if(d.id==='trainingCellar')return 6;if(d.min<20)return 7;return 8}
function formatClock(sec){sec=Math.max(0,Math.ceil(sec));const m=Math.floor(sec/60),s=sec%60;return `${m}:${String(s).padStart(2,'0')}`}
function formatCooldown(ms){return formatClock(Math.max(0,Math.ceil((ms-Date.now())/1000)))}
function dungeonRemainingSec(){if(!dungeonRun)return 0;return Math.max(0,Math.ceil((dungeonRun.deadline-Date.now())/1000))}
function clearDungeonTimer(){if(dungeonTimerId){clearInterval(dungeonTimerId);dungeonTimerId=null}}
function startDungeonTimer(){clearDungeonTimer();dungeonTimerId=setInterval(()=>{if(!dungeonRun){clearDungeonTimer();return}const left=dungeonRemainingSec();document.querySelectorAll('[data-dungeon-timer]').forEach(el=>{el.textContent=formatClock(left);el.classList.toggle('danger',left<=60)});if(left<=0)failDungeonRun('time')},1000)}
function dungeonCellKey(x,y){return `${x},${y}`}
function seededRunRandom(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}}
function makeDungeonGrid(d){
 const size=dungeonSize(d),seed=(Date.now()&0xffffffff)^(d.id.length*7919)^(state.player.level*104729),rand=seededRunRandom(seed);
 const grid=Array.from({length:size},()=>Array.from({length:size},()=>({wall:true,type:'wall',resolved:false,revealed:false,visited:false})));
 const start={x:Math.floor(size/2),y:size-1},boss={x:Math.max(1,Math.min(size-2,Math.floor(rand()*size))),y:0};
 let x=start.x,y=start.y;grid[y][x]={wall:false,type:'start',resolved:true,revealed:true,visited:true};
 const path=[];
 while(y>boss.y){
  if(rand()<.62)y--;else{x+=rand()<.5?-1:1;x=Math.max(0,Math.min(size-1,x))}
  const k=dungeonCellKey(x,y);if(!path.includes(k))path.push(k);grid[y][x]={wall:false,type:'empty',resolved:false,revealed:false,visited:false}
 }
 while(x!==boss.x){x+=x<boss.x?1:-1;grid[y][x]={wall:false,type:'empty',resolved:false,revealed:false,visited:false}}
 grid[boss.y][boss.x]={wall:false,type:'boss',resolved:false,revealed:false,visited:false};
 // Branches make every run less predictable without creating impossible mazes.
 const floorCells=[];for(let gy=0;gy<size;gy++)for(let gx=0;gx<size;gx++)if(!grid[gy][gx].wall)floorCells.push({x:gx,y:gy});
 for(const c of [...floorCells]){
  if(rand()>.78)continue;const dirs=[[1,0],[-1,0],[0,1],[0,-1]];let [dx,dy]=dirs[Math.floor(rand()*dirs.length)],len=1+Math.floor(rand()*3),bx=c.x,by=c.y;
  for(let i=0;i<len;i++){bx+=dx;by+=dy;if(bx<0||by<0||bx>=size||by>=size)break;if(by===boss.y&&bx===boss.x)break;grid[by][bx]={wall:false,type:'empty',resolved:false,revealed:false,visited:false}}
 }
 const pool=DUNGEON_ROOM_POOLS[d.id]||DUNGEON_ROOM_POOLS.default;let keyPlaced=false;
 for(let gy=0;gy<size;gy++)for(let gx=0;gx<size;gx++){
  const c=grid[gy][gx];if(c.wall||c.type==='start'||c.type==='boss')continue;
  let type=pool[Math.floor(rand()*pool.length)];
  if(type==='key'&&keyPlaced)type='chest';if(type==='key')keyPlaced=true;
  c.type=type;
 }
 if(d.id!=='trainingCellar'&&!keyPlaced){const keyCandidates=[];for(let gy=1;gy<size;gy++)for(let gx=0;gx<size;gx++){const c=grid[gy][gx];if(!c.wall&&!['start','boss'].includes(c.type))keyCandidates.push(c)}if(keyCandidates.length){keyCandidates[Math.floor(rand()*keyCandidates.length)].type='key';keyPlaced=true}}
 // Guarantee enough resistance before boss.
 const candidates=[];for(let gy=1;gy<size;gy++)for(let gx=0;gx<size;gx++){const c=grid[gy][gx];if(!c.wall&&c.type!=='start')candidates.push(c)}
 let combatRooms=candidates.filter(c=>['monster','elite'].includes(c.type));while(combatRooms.length<Math.max(3,Math.floor(size/2))&&candidates.length){const c=candidates[Math.floor(rand()*candidates.length)];if(!['boss','start'].includes(c.type)){c.type='monster';combatRooms.push(c)}}
 return {grid,size,start,boss,seed};
}
function revealDungeonAround(x,y){if(!dungeonRun)return;const {grid,size}=dungeonRun;for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<size&&ny<size&&!grid[ny][nx].wall)grid[ny][nx].revealed=true}}
function dungeonExplorationPercent(){if(!dungeonRun)return 0;let floor=0,seen=0;for(const row of dungeonRun.grid)for(const c of row)if(!c.wall){floor++;if(c.visited)seen++}return floor?Math.round(seen/floor*100):0}
function dungeonGuardianId(d){return DUNGEON_GUARDIANS[d.id]||'skeleton'}
function dungeonGuardianMonster(d){return MONSTERS.find(m=>m.id===dungeonGuardianId(d))||MONSTERS[0]}

function tutorialInfo(){ensureCoreState();return state.tutorial.complete?null:TUTORIAL_STEPS[Math.min(state.tutorial.stage,TUTORIAL_STEPS.length-1)]}
function tutorialStepDone(step){const f=state.tutorial.flags||{};if(f[step.id])return true;if(step.id==='skill')return state.player.skills.length>0;if(step.id==='secret')return (state.world.exploration?.secretsFound||[]).length>0;if(step.id==='dungeonDiscover')return state.player.discovered.includes('trainingCellar');if(step.id==='dungeonComplete')return (state.player.dungeonClears?.trainingCellar||0)>0;return false}
function advanceTutorial(){ensureCoreState();if(state.tutorial.complete)return;let moved=false;while(state.tutorial.stage<TUTORIAL_STEPS.length&&tutorialStepDone(TUTORIAL_STEPS[state.tutorial.stage])){state.tutorial.stage++;moved=true}if(state.tutorial.stage>=TUTORIAL_STEPS.length){state.tutorial.complete=true;if(!state.tutorial.finishReward){state.tutorial.finishReward=true;state.player.gold+=80;gainXp(180);addItem('potion',2);playSfx('level');haptic([25,40,25]);toast('Pierwsza wyprawa ukończona! +180 XP • +80 🪙 • 2 mikstury')}}if(moved)save()}
function tutorialEvent(type,value=0){ensureCoreState();if(state.tutorial.complete)return;const f=state.tutorial.flags; if(type==='move'&&value>=60)f.move=true;else if(type==='kill'){f.kill=true;if(!state.tutorial.rewardGiven){state.tutorial.rewardGiven=true;addItem('scoutHood');playSfx('loot');toast('Pierwszy łup: Kaptur zwiadowcy trafił do plecaka.')}}else if(type==='tavern')f.tavern=true;else if(type==='inventory')f.inventory=true;else if(type==='equip')f.equip=true;else if(type==='skill')f.skill=true;else if(type==='secret')f.secret=true;else if(type==='dungeonDiscover')f.dungeonDiscover=true;else if(type==='dungeonComplete')f.dungeonComplete=true;advanceTutorial();save()}
function tutorialMapOverlay(){const t=tutorialInfo();if(!t||state.tutorial.mapDismissedStage===state.tutorial.stage)return'';const pct=Math.round((state.tutorial.stage/TUTORIAL_STEPS.length)*100);return `<div class="tutorial-map-card"><div class="npe-progress"><i style="width:${pct}%"></i></div><button class="tutorial-map-close" data-tutorial-hide aria-label="Zamknij">×</button><span>WSKAZÓWKA ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}</span><b>${t.title}</b><small>${t.text}</small></div>`}
function tutorialJournalHTML(){const t=tutorialInfo();if(!t)return `<div class="panel-item first-hour-card"><b>✅ Samouczek ukończony</b><div class="muted">Pierwsza godzina została zakończona.</div></div>`;return `<div class="panel-item first-hour-card"><b>🎓 Samouczek • ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}: ${t.title}</b><p>${t.text}</p><button class="secondary" data-tutorial-go>Pokaż na mapie</button></div>`}
function tutorialNavigate(){const t=tutorialInfo();if(!t)return;if(t.go==='town'){selectNav('town');return}if(t.go==='inventory'){state.ui.heroView='gear';save();selectNav('hero');return}if(t.go==='skills'){state.ui.heroView='skills';save();selectNav('hero');return}selectNav('map')}
function bindTutorialControls(root=document){root.querySelector('[data-tutorial-go]')?.addEventListener('click',tutorialNavigate);root.querySelector('[data-tutorial-hide]')?.addEventListener('click',()=>{state.tutorial.mapDismissedStage=state.tutorial.stage;save();root.querySelector('.tutorial-map-card')?.remove()})}
function buildingUnlock(id){if(id==='tavern')return {ok:true};const u=CORE_UNLOCKS[id];if(!u)return {ok:true};return {ok:state.player.level>=u.level,reason:u.label}}
function currentQuestStepIndex(qid){const q=QUESTS.find(x=>x.id===qid);if(!q)return -1;const prog=state.quests.progress[qid]||[];return q.steps.findIndex((s,i)=>(prog[i]||0)<(s.count||1))}
function currentQuestStep(qid){const q=QUESTS.find(x=>x.id===qid),i=currentQuestStepIndex(qid);return q&&i>=0?{q,step:q.steps[i],index:i}:null}
function activeQuestTargets(){const set=new Set();for(const qid of state.quests.active){const cur=currentQuestStep(qid);if(cur?.step?.target)set.add(cur.step.target)}return set}
function questPoiVisible(e){if(!e||e.type!=='poi')return true;const refs=[];for(const q of QUESTS)q.steps.forEach((s,i)=>{if(s.type==='discover'&&s.target===e.id)refs.push({q,i})});if(!refs.length)return true;if(state.player.discovered.includes(e.id))return true;return refs.some(({q,i})=>state.quests.active.includes(q.id)&&currentQuestStepIndex(q.id)===i)}
function questWorldEntityVisible(e){if(!e)return false;if(e.questOnly){if(!state.quests.active.includes(e.questId))return false;const cur=currentQuestStep(e.questId);return !!cur&&cur.index===e.questStage&&!e.done}if(e.bountyId){const b=(state.adventure?.bounties||[]).find(x=>x.id===e.bountyId);return !!b&&b.accepted&&!b.claimed&&!e.done&&(e.type!=='monster'||e.alive)}return questPoiVisible(e)}
function focusedEntityVisible(e){
 if(state.settings.mapMode!=='focused')return true;
 const d=dist(e,state.player.position),targets=activeQuestTargets(),specificMonster=e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template);
 if(e.type==='monster')return d<=165||(e.elite&&d<=300)||(specificMonster&&d<=320);
 if(e.type==='event')return d<=260;
 if(e.type==='habitat')return d<=520;
 if(e.type==='dungeon')return targets.has(e.id)||d<=260||(state.player.dungeons.includes(e.id)&&d<=360);
 if(e.type==='poi')return targets.has(e.id)||d<=210||(state.player.discovered.includes(e.id)&&d<=260);
 return true;
}
document.addEventListener('click',e=>{if(e.target.closest('button'))playSfx('click')},{capture:true});


function xpNeed(lvl){return Math.floor(110+60*lvl+20*lvl*lvl)}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),2500)}
function save(){
 if(!state||saveDepth)return;
 state.playMode=SAVE_KEY===DEMO_SAVE_KEY?'sandbox':'gps';state.session={combat,dungeonRun,battleResult};
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));save.failed=false}
 catch(error){if(!save.failed)toast('Nie udało się zapisać postępu. Zwolnij miejsce lub wyeksportuj zapis w Menu.');save.failed=true;console.warn('Zapis gry niedostępny',error.name)}
}

function rawLoad(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function itemDef(id){return ITEMS[id]||{id,name:id,icon:'❓',type:'unknown',rarity:'common',value:0}}
function skillDef(id){return (SKILLS[state.player.class]||[]).find(s=>s.id===id)}
function petDef(id){return PETS[id]||null}
function itemName(inst){const d=itemDef(inst.id);return `${d.name}${inst.affix?.name?` ${inst.affix.name}`:''}${(inst.upgrade||0)>0?` +${inst.upgrade}`:''}`}
function countItem(id){return state.player.inventory.filter(x=>x.id===id).reduce((a,x)=>a+(x.qty||1),0)}
const STACK_MAX=32;
function isStackable(id){return ['consumable','material','rune','ammo'].includes(itemDef(id).type)}
function stackLimit(id){return itemDef(id).maxStack||STACK_MAX}
function inventoryCapacity(){return state?.player?.inventoryCapacity||32}
function backpackEntries(){const inv=state?.player?.inventory||[];return inv.map((item,index)=>({item,index})).filter(({item})=>!inventoryItemEquippedSlot(item))}
function inventoryUsedSlots(){return backpackEntries().length}
function normalizeInventoryStacks(inv=[]){const out=[];for(const raw of inv){const i={...raw};if(isStackable(i.id)){let q=Math.max(1,Number(i.qty)||1);while(q>0){const lim=stackLimit(i.id);out.push({id:i.id,qty:Math.min(lim,q)});q-=lim}}else out.push(i)}return out}
function inventoryHasRoom(slots=1){return inventoryUsedSlots()+slots<=inventoryCapacity()}

function canReceiveItems(drops,ingredients={},removedUid=null){
 const inv=state.player.inventory.filter(i=>!removedUid||i.uid!==removedUid).map(i=>({...i}));
 for(const [id,qty] of Object.entries(ingredients)){
  let left=qty;
  for(let i=inv.length-1;i>=0&&left>0;i--){if(inv[i].id!==id)continue;const take=Math.min(left,inv[i].qty||1);left-=take;inv[i].qty=(inv[i].qty||1)-take;if(!inv[i].qty)inv.splice(i,1)}
  if(left)return false;
 }
 const used=()=>inv.filter(i=>!inventoryItemEquippedSlot(i)).length;
 for(const drop of drops){
  if(!ITEMS[drop.id]||!Number.isInteger(drop.qty??1)||(drop.qty??1)<1)return false;
  let left=drop.qty??1;
  if(isStackable(drop.id))for(const item of inv.filter(i=>i.id===drop.id)){const take=Math.min(left,Math.max(0,stackLimit(drop.id)-(item.qty||1)));item.qty=(item.qty||1)+take;left-=take;if(!left)break}
  while(left>0){if(used()>=inventoryCapacity())return false;const take=isStackable(drop.id)?Math.min(left,stackLimit(drop.id)):1;inv.push({id:drop.id,qty:take});left-=take}
 }
 return true;
}
function requireItemRoom(drops,ingredients={}){if(canReceiveItems(drops,ingredients))return true;toast('Plecak jest pełny. Zwolnij miejsce — niczego nie pobrano.');return false}
function atomicAction(action){return function(...args){saveDepth++;try{return action.apply(this,args)}finally{saveDepth--;if(!saveDepth)save()}}}
function restoreSession(){
 const session=state?.session||{};
 combat=session.combat||null;dungeonRun=session.dungeonRun||null;battleResult=session.battleResult||null;
 if(dungeonRun&&!DUNGEONS.some(d=>d.id===dungeonRun.id))dungeonRun=null;
 if(combat){
  if(!MONSTERS.some(m=>m.id===combat.monster?.id)){combat=null;return}
  const entity=state.world.entities.find(e=>e.id===combat.entity?.id);if(entity)combat.entity=entity;
  combat.turnToken=(combat.turnToken||0)+1;
 }
 lastAcceptedFix=null;
 if(state?.player?.position)state.player.position.receivedAt=0;
}
function resumeSession(){
 if(battleResult){showBattleVictory(battleResult);return}
 if(dungeonRun&&dungeonRemainingSec()<=0){failDungeonRun('time');return}
 if(combat){
  if(combat.phase==='enemyDelay'){queueEnemyTurn(350);return}
  if(combat.phase==='enemyResult'){finishEnemyTurn(350);return}
  if(combat.hp<=0){winCombat();return}
  openCombat();return;
 }
 if(dungeonRun){const cell=dungeonCurrentCell();if(cell?.visited&&!cell.resolved)resolveDungeonRoom(cell);else openDungeonCrawler()}
}
function switchPlayMode(){
 if(combat||dungeonRun||battleResult)return toast('Najpierw zakończ walkę lub wyprawę.');
 const goingToTest=SAVE_KEY!==DEMO_SAVE_KEY;save();
 if(goingToTest&&!rawLoad(DEMO_SAVE_KEY)){
  const copy=JSON.parse(JSON.stringify(state));copy.settings.demo=true;copy.playMode='sandbox';copy.session={};copy.player.position.gps=false;copy.player.position.receivedAt=0;
  localStorage.setItem(DEMO_SAVE_KEY,JSON.stringify(copy));
 }
 localStorage.setItem(MODE_KEY,goingToTest?'sandbox':'gps');location.reload();
}
function gpsInteractionReady(){
 if(SAVE_KEY===DEMO_SAVE_KEY&&state.settings.demo)return true;
 const p=state.player.position,ok=p.gps&&gpsWatch!==null&&p.receivedAt&&Date.now()-p.receivedAt<=30000&&p.accuracy<=50;
 if(!ok)toast('Poczekaj na aktualny GPS z dokładnością do 50 m.');
 return !!ok;
}

const AFFIXES=[{name:'Ognia',power:3},{name:'Żelaza',armor:3},{name:'Sokoła',crit:3},{name:'Łowcy',power:2,crit:2}];
const SET_BONUSES={raven:{name:'Kruczy Rynsztunek',two:{power:4},three:{armor:5,crit:3}},wild:{name:'Dziki Szlak',two:{crit:5},three:{power:5,armor:3}},mist:{name:'Strażnik Mgieł',two:{armor:4,crit:3},three:{power:7,armor:4}},ashguard:{name:'Popielna Straż',two:{power:8,armor:4},three:{power:7,crit:5}},stormforged:{name:'Nawałnica',two:{crit:6,armor:5},three:{power:10,crit:4}}};
const ECONOMY={sell:{common:.28,uncommon:.32,rare:.36,epic:.40,heroic:.44,legendary:.48},shopMarkup:1.12,auctionMin:.95,auctionMax:1.18,travelBase:10,travelPer100m:3};
const GEAR_POOLS={uncommon:['shortSword','yewBow','apprenticeStaff','scoutHood','mageHood','leatherGloves','trailBoots','woodenShield','oldTalisman','chainVest','rangerLeather','apprenticeRobe'],rare:['ironAxe','warHammer','axe','blueBlade','forestBow','emberWand','arcaneStaff','wolfCharm','ironHelm','ironShield','ironArmor','runicRobe','rangerLeather','emberRing','boneRing'],epic:['ravenBlade','ravenMail','ravenHelm','wildBow','wildMail','wildHood','wildBoots','arcaneRobe','mistBlade','mistBow','mistStaff','mistMail','mistLeathers','mistRobe','mistHelm','mistHood','mistCirclet','ashBlade','ashBow','ashStaff','ashMail','ashLeathers','ashRobe','ashHelm','ashHood','ashCowl','stormSpear','stormBow','stormStaff','stormMail','stormLeathers','stormRobe','stormHelm','stormHood','stormCowl'],heroic:['mireCharm','cinderCharm','tempestCharm'],legendary:['stormCrown','cryptHeart']};
function rarityRank(r){return ({common:0,uncommon:1,rare:2,epic:3,heroic:4,legendary:5})[r]||0}
function affixChance(r){return ({common:0,uncommon:.14,rare:.32,epic:.58,heroic:.82,legendary:1})[r]||0}
function createGearInstance(id){const d=itemDef(id),inst={id,uid:uid(),upgrade:0,rune:null,enchant:null,enchantRolls:0,affix:null};if(d.slot&&Math.random()<affixChance(d.rarity))inst.affix={...pick(AFFIXES)};return inst}
function merchantBuyPrice(id){const d=itemDef(id),typeMult=d.type==='material'?1.18:d.type==='consumable'?1.10:ECONOMY.shopMarkup;return Math.max(1,Math.ceil(d.value*typeMult))}
function itemSellValue(inst){const d=itemDef(inst.id),base=d.value||0,m=ECONOMY.sell[d.rarity]??.28,up=inst.upgrade||0,modBonus=(inst.affix?6:0)+(inst.enchant?14:0)+(inst.rune?10:0);return Math.max(1,Math.floor(base*m+up*5+modBonus))}
function salvageYield(inst){const d=itemDef(inst.id),rank=rarityRank(d.rarity),up=inst.upgrade||0;return {scrap:Math.max(1,1+Math.floor(rank/2)+up),shards:rank>=3?Math.max(1,Math.floor((rank-1)/2)):0,crystal:rank>=4?1:0}}
function upgradeQuote(inst){const d=itemDef(inst.id),up=inst.upgrade||0,rank=rarityRank(d.rarity);return {gold:Math.ceil((16+d.value*.10+rank*8)*Math.pow(up+1,1.28)),scrap:up===0?0:Math.max(1,Math.ceil((up+rank)/2))}}
function enchantQuote(inst,reroll=false){const rank=rarityRank(itemDef(inst.id).rarity),rolls=inst.enchantRolls||0;return {gold:Math.ceil(55+rank*28+(reroll?35+rolls*22:0)),crystal:1+(rank>=3?1:0)+(reroll&&rolls>=2?1:0),shard:reroll?1:0}}
function craftFee(recipe){const d=itemDef(recipe.result),rank=rarityRank(d.rarity);return Math.ceil(8+(d.value||10)*.08+rank*12)}
function travelCost(node){const d=dist(node,state.player.position);return Math.max(ECONOMY.travelBase,Math.ceil(ECONOMY.travelBase+d/100*ECONOMY.travelPer100m))}
function ensureEconomyState(s=state){if(!s)return;s.economy ||= {elitePity:0,bossPity:0,totalSold:0,totalSalvaged:0};s.economy.elitePity ||= 0;s.economy.bossPity ||= 0;s.economy.totalSold ||= 0;s.economy.totalSalvaged ||= 0}
function itemClassAllowed(d,cls=state?.player?.class){return !d?.classes||!cls||d.classes.includes(cls)}
function itemClassNames(d){return d?.classes?.map(id=>CLASSES[id]?.name||id).join(', ')||'Wszystkie klasy'}
function randomGearFrom(tier){const pool=(GEAR_POOLS[tier]||[]).filter(id=>{const d=itemDef(id);return (!d.reqLevel||state.player.level>=d.reqLevel)&&itemClassAllowed(d)});if(!pool.length)return null;return pick(pool)}
function lootChanceLabel(chance){const pct=Math.round(chance*100);return `${pct}%`}
function monsterLootTable(id){
 if(MONSTER_LOOT[id])return MONSTER_LOOT[id];
 const family=MONSTERS.find(m=>m.id===id)?.family;
 const familyLoot={
  Natura:[{id:'herb',chance:.38,min:1,max:2},{id:'rawMeat',chance:.34,min:1,max:2}],
  Owady:[{id:'venomGland',chance:.48,min:1,max:1},{id:'spiderSilk',chance:.42,min:1,max:2}],
  Nieumarli:[{id:'bone',chance:.64,min:1,max:2},{id:'graveDust',chance:.38,min:1,max:1}],
  Zjawy:[{id:'ectoplasm',chance:.54,min:1,max:2},{id:'graveDust',chance:.44,min:1,max:1}],
  Demony:[{id:'demonBlood',chance:.42,min:1,max:1},{id:'sulfur',chance:.58,min:1,max:2}],
  'Żywiołaki':[{id:'stoneCore',chance:.56,min:1,max:2},{id:'crystal',chance:.12,min:1,max:1}],
  Ludzie:[{id:'roughCloth',chance:.52,min:1,max:2},{id:'scrap',chance:.34,min:1,max:2},{id:'oldCoin',chance:.22,min:1,max:2}],
  Bestie:[{id:'rawMeat',chance:.62,min:1,max:2},{id:'wolfPelt',chance:.32,min:1,max:1},{id:'wolfFang',chance:.24,min:1,max:1}]
 };
 return familyLoot[family]||[];
}
function monsterLootHTML(m){const rows=monsterLootTable(m.id);if(!rows.length)return '<div class="loot-empty">Brak zarejestrowanych łupów.</div>';return `<div class="bestiary-loot-grid">${rows.map(r=>{const d=itemDef(r.id);return `<div class="bestiary-loot-row"><span class="loot-icon">${itemIconVisual(d.id,'item-svg')}</span><div><b class="rarity-${d.rarity}">${d.name}</b><small>${lootChanceLabel(r.chance)} • ${r.min||1}${(r.max||r.min||1)!==(r.min||1)?`–${r.max}`:''} szt.</small></div></div>`}).join('')}</div>`}
function rollMonsterMaterials(m,e,c){const drops=[];const elite=!!e?.elite,boss=!!c?.isBoss||!!c?.worldBoss,variantLoot=m?.variantLoot||1;for(const row of monsterLootTable(m.id)){const chance=Math.min(1,row.chance*(elite?1.12:1)*(boss?1.18:1)*variantLoot);if(Math.random()>chance)continue;let qty=rnd(row.min||1,row.max||row.min||1);if(elite&&Math.random()<.30)qty++;if(boss&&Math.random()<.45)qty++;if(['corrupted','ancient'].includes(m?.variantId)&&Math.random()<.24)qty++;drops.push({id:row.id,qty})}return drops}
function mergeLootDrops(drops=[]){const merged=[];const stackIndex=new Map();for(const drop of drops.filter(Boolean)){const qty=Math.max(1,drop.qty||1);if(isStackable(drop.id)){if(stackIndex.has(drop.id)){merged[stackIndex.get(drop.id)].qty+=qty}else{stackIndex.set(drop.id,merged.length);merged.push({id:drop.id,qty,gear:false})}}else{for(let i=0;i<qty;i++)merged.push({id:drop.id,qty:1,gear:true})}}return merged}
function lootToastText(drops=[]){if(!drops.length)return '';const merged={};for(const d of drops)merged[d.id]=(merged[d.id]||0)+(d.qty||1);const bits=Object.entries(merged).slice(0,4).map(([id,q])=>`${itemDef(id).icon} ${q}× ${itemDef(id).name}`);const extra=Object.keys(merged).length>4?` +${Object.keys(merged).length-4} więcej`:'';return bits.join(' • ')+extra}
function rollCombatLoot(m,e,c){ensureEconomyState();let gearDrop=null;const drops=rollMonsterMaterials(m,e,c);
 if(m.variantId==='hardened'&&Math.random()<.34)drops.push({id:'hardenedMark',qty:1});
 if(m.variantId==='corrupted'&&Math.random()<.62)drops.push({id:'corruptedEssence',qty:1});
 if(m.variantId==='ancient'){drops.push({id:'ancientRelic',qty:Math.random()<.18?2:1});if(Math.random()<.35)drops.push({id:'runeShard',qty:1})}
 if(Math.random()<.018)drops.push({id:'crystal',qty:1});
 const elite=!!e.elite,boss=!!c.isBoss||!!c.worldBoss;
 const variantGearChance={normal:.018,young:.010,hardened:.035,corrupted:.075,ancient:.16}[m.variantId]??.018;
 if(!elite&&!boss&&Math.random()<variantGearChance)gearDrop=randomGearFrom(m.variantId==='ancient'?'rare':m.variantId==='corrupted'&&Math.random()<.22?'rare':'uncommon');
 if(elite&&!boss){state.economy.elitePity++;if(Math.random()<.18||state.economy.elitePity>=4){gearDrop=randomGearFrom(Math.random()<.22?'epic':'rare');state.economy.elitePity=0}if(Math.random()<.16)drops.push({id:'runeShard',qty:1})}
 if(boss){state.economy.bossPity++;const epicGuaranteed=state.economy.bossPity>=3;if(Math.random()<.58||epicGuaranteed){gearDrop=randomGearFrom(Math.random()<.18?'heroic':'epic');state.economy.bossPity=0}else gearDrop=randomGearFrom('rare');if(Math.random()<.55)drops.push({id:'runeShard',qty:rnd(1,2)});if(Math.random()<.08)drops.push({id:pick(['runePower','runeGuard','runePrecision']),qty:1})}
 if(gearDrop)drops.push({id:gearDrop,qty:1,gear:true});return {gearDrop,drops:mergeLootDrops(drops)};
}
function addItem(id,qty=1){if(!ITEMS[id]||!Number.isInteger(qty)||qty<=0)return 0;let left=Math.max(0,qty|0),added=0;if(isStackable(id)){const lim=stackLimit(id);for(const st of state.player.inventory.filter(x=>x.id===id&&isStackable(x.id)&&((x.qty||1)<lim))){if(left<=0)break;const room=lim-(st.qty||1),take=Math.min(room,left);st.qty=(st.qty||1)+take;left-=take;added+=take}while(left>0&&inventoryHasRoom()){const take=Math.min(lim,left);state.player.inventory.push({id,qty:take});left-=take;added+=take}}else{while(left>0&&inventoryHasRoom()){state.player.inventory.push(createGearInstance(id));left--;added++}}if(left>0)toast(`🎒 Plecak pełny — nie zmieściło się ${left}× ${itemDef(id).name}.`);if(added)checkQuestProgress('item',id);save();return added}
function removeItem(id,qty=1){let left=qty;for(let i=state.player.inventory.length-1;i>=0&&left>0;i--){const x=state.player.inventory[i];if(x.id!==id)continue;const q=x.qty||1;if(q>left){x.qty=q-left;left=0}else{left-=q;state.player.inventory.splice(i,1)}}save();return left===0}
function starterWeapon(cls){return cls==='mage'?'willowStaff':cls==='hunter'||cls==='ranger'?'primitiveBow':'shortBlade'}
function starterArmor(){return'tornRags'}
function starterBoots(){return'holeyBoots'}
function equippedInstance(slot){const e=state.player.equipped[slot];if(!e)return null;return state.player.inventory.find(x=>x.uid&&x.uid===e.uid)||e}
function instanceBonus(inst,key){if(!inst)return 0;let v=0;if(inst.affix?.[key])v+=inst.affix[key];if(inst.enchant?.[key])v+=inst.enchant[key];if(inst.rune){const r=itemDef(inst.rune);if(r.runeKey===key)v+=r.runeValue||0}return v}
function equipmentStat(slot,key){const inst=equippedInstance(slot);if(!inst)return 0;const d=itemDef(inst.id),base=d[key]||0,up=inst.upgrade||0;return base+(base?(key==='crit'?up:up*2):0)+instanceBonus(inst,key)}
function activeSetCounts(){const counts={};for(const slot of Object.keys(state.player.equipped||{})){const inst=equippedInstance(slot);const set=inst&&itemDef(inst.id).set;if(set)counts[set]=(counts[set]||0)+1}return counts}
function setBonusStat(key){let total=0;for(const [set,count] of Object.entries(activeSetCounts())){const b=SET_BONUSES[set];if(!b)continue;if(count>=2)total+=b.two?.[key]||0;if(count>=3)total+=b.three?.[key]||0}return total}
function gearStat(key){return Object.keys(state.player.equipped||{}).reduce((sum,slot)=>sum+equipmentStat(slot,key),0)+setBonusStat(key)}
function climate(source=state){
 const hour=source?.settings?.forceNight?1:new Date().getHours();
 const phase=hour>=6&&hour<18?'Dzień':hour>=18&&hour<22?'Zmierzch':'Noc';
 const bucket=Math.floor(new Date().getHours()/6);
 const options=[['☀️','Bezchmurnie'],['🌧️','Deszcz'],['🌫️','Mgła'],['⛈️','Burza'],['💨','Wiatr']];
 const w=options[Math.floor(seeded(daySeed()+bucket*47)*options.length)];
 return {icon:w[0],weather:w[1],phase,hour,bucket};
}
function worldContextKey(source=state){const c=climate(source),p=source?.player?.position||{x:0,y:0};return `${daySeed()}_${c.bucket}_${c.weather}_${c.phase}_${localChunkId(p.x||0,p.y||0)}`}

const BOUNTY_POOL=[
 {id:'herbs',name:'Zielarskie zamówienie',icon:'🌿',type:'gather',target:'herb',need:5,minLevel:1,xp:180,gold:38,rep:3},
 {id:'rats',name:'Plaga szczurów',icon:'🐀',type:'kill',target:'rat',need:5,minLevel:1,xp:190,gold:40,rep:3},
 {id:'beetles',name:'Twarde pancerze',icon:'🪲',type:'kill',target:'beetle',need:4,minLevel:1,xp:210,gold:42,rep:3},
 {id:'wolf',name:'Wilczy trop',icon:'🐺',type:'kill',target:'wolf',need:3,minLevel:4,xp:220,gold:45,rep:4},
 {id:'goblin',name:'Goblińskie zasadzki',icon:'👺',type:'kill',target:'goblin',need:4,minLevel:3,xp:280,gold:55,rep:5},
 {id:'insects',name:'Plaga tkaczy',icon:'🕷️',type:'kill',target:'spider',need:5,minLevel:8,xp:340,gold:65,rep:5},
 {id:'undead',name:'Kości nie spoczną',icon:'💀',type:'kill',target:'skeleton',need:3,minLevel:10,xp:360,gold:70,rep:6},
 {id:'ogres',name:'Łowca olbrzymów',icon:'👹',type:'kill',target:'ogre',need:2,minLevel:25,xp:520,gold:100,rep:8}
];
function makeDailyBounties(day,level=state?.player?.level||1){let pool=BOUNTY_POOL.filter(b=>(b.minLevel||1)<=level+1);if(pool.length<3)pool=[...BOUNTY_POOL].slice(0,3);const out=[];for(let i=0;i<Math.min(3,pool.length);i++){const idx=Math.floor(seeded(day+711+i*83)*pool.length),b=pool.splice(idx,1)[0];out.push({...b,progress:0,claimed:false,accepted:false})}return out}
function ensureAdventureState(s=state){if(!s)return; s.adventure ||= {day:daySeed(),reputation:0,bounties:[],worldBossDay:0,achievements:{}};if(s.adventure.day!==daySeed()){s.adventure.day=daySeed();s.adventure.bounties=makeDailyBounties(daySeed(),s.player?.level||1)}if(!s.adventure.bounties?.length)s.adventure.bounties=makeDailyBounties(daySeed(),s.player?.level||1);for(const b of s.adventure.bounties||[])b.accepted ??= false;s.adventure.achievements ||= {};s.adventure.reputation ||= 0;s.adventure.worldBossDay ||= 0}
function monsterTargetMatches(target,monsterId){return target==='any'||target===monsterId||(target==='goblin'&&String(monsterId).startsWith('goblin'))}
function progressBounties(type,target,amount=1){ensureAdventureState();for(const b of state.adventure.bounties){if(!b.accepted||b.claimed)continue;const matches=b.type==='gather'?b.target===target:monsterTargetMatches(b.target,target);if(!matches)continue;if((b.type==='gather'&&type==='item')||((b.type||'kill')==='kill'&&type==='kill'))b.progress=Math.min(b.need,(b.progress||0)+amount)}updateAchievements()}
function updateAchievements(){if(!state?.adventure)return;const a=state.adventure.achievements,p=state.player;a.firstBlood ||= p.kills>=1;a.hunter ||= p.kills>=25;a.explorer ||= p.discovered.length>=6;a.delver ||= Object.values(p.dungeonClears||{}).reduce((x,y)=>x+y,0)>=3;a.veteran ||= p.level>=10;a.north ||= state.quests.done.includes('q15')}
function claimBounty(id){ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||!b.accepted||b.claimed||b.progress<b.need)return; b.claimed=true;state.world.entities=state.world.entities.filter(e=>e.bountyId!==b.id);state.player.gold+=b.gold;state.adventure.reputation+=b.rep;gainXp(b.xp);save();renderShell();toast(`Kontrakt wykonany: +${b.xp} XP • +${b.gold} 🪙 • +${b.rep} reputacji`)}
function worldBossDef(){const list=[MONSTERS.find(m=>m.id==='graveColossus'),MONSTERS.find(m=>m.id==='stormDrake')].filter(Boolean);return list[daySeed()%list.length]||MONSTERS.find(m=>m.id==='ogre')}
function startWorldBoss(){ensureAdventureState();if(state.adventure.worldBossDay===daySeed())return toast('Dzisiejszy boss świata został już pokonany.');if(state.player.level<8)return toast('Boss świata wymaga co najmniej 8 poziomu.');const m=worldBossDef(),e={id:`worldboss_${daySeed()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};startCombat(e,{level:Math.max(m.min,state.player.level+3),worldBoss:true})}


const BIOME_CELL_SIZE=210;
const BIOMES={
 meadow:{name:'Łąki',icon:'🌾',color:'#8fca55',fill:.30,desc:'Otwarte tereny. Częste zwierzęta, gobliny i surowce.'},
 forest:{name:'Las',icon:'🌲',color:'#1f5b2d',fill:.36,desc:'Gęsty teren pełen wilków, pająków i ukrytych ścieżek.'},
 ruins:{name:'Ruiny',icon:'🏚️',color:'#72777f',fill:.32,desc:'Stare miejsca przyciągające nieumarłych i kultystów.'},
 marsh:{name:'Mokradła',icon:'🌫️',color:'#2f8178',fill:.34,desc:'Niebezpieczne bagna, trucizny i rzadkie składniki.'},
 highlands:{name:'Wzgórza',icon:'⛰️',color:'#927647',fill:.33,desc:'Trudniejszy teren z ogrami i silniejszymi bestiami.'}
};
const BIOME_EFFECTS={
 meadow:{title:'Otwarta przestrzeń',summary:'+3% krytyka • +15% złota z wydarzeń',crit:3,eventGold:1.15},
 forest:{title:'Leśna osłona',summary:'+6% uniku • większa szansa na materiały',dodge:6,loot:1.12},
 ruins:{title:'Pamięć ruin',summary:'+12% obrażeń i +15% XP przeciw nieumarłym i zjawom',familyDamage:1.12,familyXp:1.15,families:['Nieumarli','Zjawy']},
 marsh:{title:'Toksyczne opary',summary:'+30% siły trucizn • dodatkowy materiał z eventów',poison:1.30,eventMaterial:1},
 highlands:{title:'Próba wysokości',summary:'+8% obrażeń • przeciwnicy zadają +6%',damage:1.08,enemyDamage:1.06}
};

// Build 3.4 — precyzyjne miejsca występowania wewnątrz szerokich biomów.
const HABITATS={
 meadow:{name:'Łąka',icon:'🌾',color:'#9ecb55',desc:'Otwarte trawy, kwiaty i niskie zarośla. Polują tu zwierzęta i drobne stwory natury.'},
 forest:{name:'Gęsty las',icon:'🌲',color:'#2f7838',desc:'Zacienione ostępy, wykroty i leśne ścieżki zamieszkane przez bestie oraz owady.'},
 fields:{name:'Pola i miedze',icon:'🌻',color:'#c5a94c',desc:'Pola uprawne, miedze i stare strachy. Pojawiają się tu szkodniki, zbiry i zjawy pól.'},
 wetland:{name:'Bagno',icon:'🐸',color:'#3f8876',desc:'Grząski teren pełen trzciny, jadu, topielców i stworzeń ukrytych pod wodą.'},
 waterside:{name:'Brzeg wody',icon:'🌊',color:'#3f84a5',desc:'Rzeki, stawy i rozlewiska. Można spotkać wodne bestie, rusałki i żywiołaki.'},
 cemetery:{name:'Cmentarz',icon:'🪦',color:'#77747c',desc:'Mogiły i stare nekropolie przyciągają nieumarłych, ghule oraz nocne zjawy.'},
 chapel:{name:'Kaplica',icon:'⛪',color:'#9b8a70',desc:'Opuszczone kaplice i przydrożne sanktuaria, gdzie ścierają się duchy, kult i demony.'},
 ruins:{name:'Ruiny',icon:'🏚️',color:'#82776c',desc:'Pozostałości osad i warowni. Kryją bandytów, kultystów, duchy i kamienne konstrukty.'},
 cave:{name:'Jaskinie i kamieniołomy',icon:'🕳️',color:'#665b54',desc:'Ciemne groty oraz wyrobiska zamieszkane przez bestie, owady, golemy i demony.'},
 highlands:{name:'Wzgórza',icon:'⛰️',color:'#9a7746',desc:'Odsłonięte grzbiety i skalne zbocza, na których żyją silne drapieżniki i żywiołaki.'},
 settlement:{name:'Obrzeża osady',icon:'🏘️',color:'#a87548',desc:'Zabudowania, opuszczone zagrody i podwórza nawiedzane przez rabusiów oraz dzikie zwierzęta.'},
 crossroads:{name:'Drogi i rozstaje',icon:'🛤️',color:'#aa925f',desc:'Trakty, mosty i rozstaje. Ulubione miejsca zasadzek ludzi, goblinów i niespokojnych duchów.'}
};
const HABITATS_BY_BIOME={
 meadow:['meadow','fields','settlement','crossroads','chapel'],
 forest:['forest','cave','cemetery','chapel','crossroads'],
 ruins:['ruins','cemetery','chapel','cave','settlement'],
 marsh:['wetland','waterside','ruins','cemetery','chapel'],
 highlands:['highlands','cave','ruins','chapel','crossroads']
};
const FAMILY_HABITATS={
 Natura:['meadow','forest','fields','wetland','waterside'],
 Owady:['forest','fields','wetland','cave'],
 Nieumarli:['cemetery','chapel','ruins','cave'],
 Zjawy:['cemetery','chapel','ruins','wetland','waterside','crossroads'],
 Demony:['chapel','ruins','cave','highlands'],
 'Żywiołaki':['cave','ruins','waterside','highlands'],
 Ludzie:['settlement','crossroads','fields','ruins'],
 Bestie:['forest','cave','highlands','wetland','waterside','meadow']
};
const BIOME_TO_HABITATS={meadow:['meadow','fields'],forest:['forest'],ruins:['ruins','cemetery','chapel'],marsh:['wetland','waterside'],highlands:['highlands','cave']};
function monsterHabitats(m){
 const set=new Set([...(FAMILY_HABITATS[m?.family]||[]),...(BIOME_TO_HABITATS[m?.biome]||[])]),priority=[],id=String(m?.id||'').toLowerCase(),name=String(m?.name||'').toLowerCase();
 const has=(...words)=>words.some(w=>id.includes(w)||name.includes(w));
 const prefer=(...ids)=>{for(const h of ids){priority.push(h);set.add(h)}};
 if(has('szkielet','kośc','zombie','mumia','ghul','trup','wisielec','licz','lich','żniwiarz'))prefer('cemetery','chapel');
 if(has('rusał','wodnik','kraken','sum','wydra','topiel','wir','bog','mire','marsh','fen','ropuch'))prefer('waterside','wetland');
 if(has('polud','połud','dziewanna','strach','żniwiarz','sokół'))prefer('fields','meadow');
 if(has('rozbój','zbir','najem','kieszon','kłus','klus','goblin'))prefer('crossroads','settlement');
 if(has('demon','diabe','bies','kultyst','zmora'))prefer('chapel','ruins');
 if(has('golem','elemental','żywioł','zywiol'))prefer('cave','ruins');
 return [...new Set([...priority,...set])];
}
function monsterHabitatNames(m,limit=4){return monsterHabitats(m).slice(0,limit).map(id=>`${HABITATS[id]?.icon||'📍'} ${HABITATS[id]?.name||id}`)}
function biomeEffect(id=biomeInfoAtPlayer().id){return BIOME_EFFECTS[id]||BIOME_EFFECTS.meadow}
function combatEnvironment(monster){
 const biomeId=biomeInfoAtPlayer().id,effect=biomeEffect(biomeId),cl=climate();
 const familyMatch=!!(effect.families||[]).includes(monster?.family);
 let damage=effect.damage||1,enemyDamage=effect.enemyDamage||1,poison=effect.poison||1;
 if(familyMatch)damage*=effect.familyDamage||1;
 if(cl.weather==='Deszcz')poison*=1.10;
 if(cl.weather==='Burza')enemyDamage*=1.05;
 if(cl.phase==='Noc'&&monster?.family==='Zjawy')enemyDamage*=1.08;
 return {biomeId,effect,climate:cl,damage,enemyDamage,poison,familyMatch};
}
function biomeEffectHTML(id=biomeInfoAtPlayer().id){const b=BIOMES[id],e=biomeEffect(id);return `<div class="biome-active-effect"><span>${b.icon}</span><div><b>${e.title}</b><small>${e.summary}</small></div></div>`}


const REGION4_POIS=[
 {id:'ashGate',name:'Popielna Brama',icon:'🔥',x:1065,y:330},
 {id:'emberMineGate',name:'Szyb Kopalni Żaru',icon:'⛏️',x:1150,y:-235},
 {id:'cinderCamp',name:'Obóz Żaru',icon:'⛺',x:1210,y:180},
 {id:'ashShrine',name:'Sanktuarium Popiołu',icon:'🕯️',x:1245,y:-120},
 {id:'charredFort',name:'Spalony Fort',icon:'🏚️',x:1300,y:300},
 {id:'ashenCitadelGate',name:'Brama Popielnej Cytadeli',icon:'🚪',x:1345,y:40}
];
const REGION5_POIS=[
 {id:'peakGate',name:'Kamienna Przełęcz',icon:'⛰️',x:1450,y:320},
 {id:'frostVaultGate',name:'Wejście do Krypty Mrozu',icon:'🧊',x:1525,y:-220},
 {id:'stormCamp',name:'Obóz Burzy',icon:'⚡',x:1600,y:190},
 {id:'frozenMonument',name:'Zamarznięty Pomnik',icon:'🗿',x:1660,y:-80},
 {id:'skyBridge',name:'Most Niebios',icon:'🌉',x:1730,y:260},
 {id:'tempestSpireGate',name:'Brama Iglicy',icon:'🗼',x:1790,y:55}
];

const REGION3_POIS=[
 {id:'mireGate',name:'Brama Trzcin',icon:'🌾',x:610,y:330},
 {id:'drownedVillage',name:'Zatopiona Wioska',icon:'🏚️',x:670,y:210},
 {id:'sunkenBell',name:'Zatopiony Dzwon',icon:'🔔',x:700,y:-260},
 {id:'whisperMarsh',name:'Szeptane Rozlewisko',icon:'🌫️',x:735,y:95},
 {id:'witchTotem',name:'Totemy Wiedźmy',icon:'🪬',x:785,y:300},
 {id:'blackrootCamp',name:'Obóz Czarnego Korzenia',icon:'⛺',x:835,y:125},
 {id:'oldCauseway',name:'Stary Trakt',icon:'🧱',x:860,y:-210},
 {id:'fogAltar',name:'Ołtarz Mgły',icon:'🕯️',x:900,y:170},
 {id:'blackrootGate',name:'Brama Twierdzy',icon:'🚪',x:920,y:10}
];
function ensureRegion3Entities(s=state){
 if(!s?.world)return;
 s.world.entities ||= [];
 const existing=new Set(s.world.entities.map(e=>e.id));
 for(const d of DUNGEONS)if(!existing.has(d.id)){s.world.entities.push({...d,type:'dungeon'});existing.add(d.id)}
 for(const p of [...REGION3_POIS,...REGION4_POIS,...REGION5_POIS])if(!existing.has(p.id)){s.world.entities.push({...p,type:'poi'});existing.add(p.id)}
}

const WORLD_EVENTS=[
 {kind:'cry',name:'Krzyk między drzewami',icon:'🗣️',signal:'Słyszysz krzyk w oddali',biomes:['forest','meadow','highlands'],desc:'Głos urywa się nagle. W trawie widać ślady pośpiesznej ucieczki.',xp:120,gold:42,choices:[
  {id:'rush',label:'Biegnij na pomoc',text:'Działasz natychmiast, ale możesz wpaść w zasadzkę.',combatByBiome:{forest:'wolf',meadow:'goblin',highlands:'ogre'},elite:false,result:'Napastnik wychodzi z ukrycia.'},
  {id:'track',label:'Podejdź ostrożnie',text:'Najpierw sprawdzasz ślady i drogę odwrotu.',xp:55,item:'herb',result:'Odnajdujesz rannego wędrowca i wyprowadzasz go na szlak.'}
 ]},
 {kind:'ambush',name:'Podejrzany obóz',icon:'⛺',signal:'Czujesz dym i słyszysz przyciszone głosy',biomes:['forest','ruins','meadow'],desc:'Ogień jest świeży, a wartownik co chwilę patrzy w stronę drogi.',xp:145,gold:58,choices:[
  {id:'approach',label:'Podejdź do obozu',text:'Ryzykujesz wykrycie, żeby poznać ich plan.',combat:'goblin',elite:true,result:'Wartownik zauważa ruch i podnosi alarm.'},
  {id:'observe',label:'Obserwuj z ukrycia',text:'Zapamiętujesz trasę patrolu i wycofujesz się bez walki.',xp:70,gold:20,result:'Informacja trafia później do strażników.'}
 ]},
 {kind:'rift',name:'Szczelina energii',icon:'🌀',signal:'Powietrze drży, jak przed uderzeniem pioruna',biomes:['ruins','marsh','highlands'],desc:'Niestabilna energia wypływa z ziemi i przyciąga istoty z okolicy.',xp:175,gold:36,item:'crystal',choices:[
  {id:'seal',label:'Spróbuj zamknąć szczelinę',text:'Dotykasz run, zanim energia wymknie się spod kontroli.',combatByBiome:{meadow:'elemental',forest:'elemental',ruins:'ghost',marsh:'elemental',highlands:'elemental'},elite:true,result:'Ze szczeliny wyłania się jej strażnik.'},
  {id:'sample',label:'Pobierz próbkę i odejdź',text:'Bezpieczniejsze wyjście, ale szczelina pozostanie aktywna.',xp:45,item:'runeShard',result:'Zabierasz fragment niestabilnej runy.'}
 ]},
 {kind:'herbalist',name:'Zaginiona zielarka',icon:'🌿',signal:'Widzisz porzucony kosz i świeże ślady',biomes:['forest','marsh','meadow'],desc:'Kosz pełen ziół leży przy ścieżce. Właścicielka nie mogła odejść daleko.',xp:105,gold:32,item:'moonHerb',choices:[
  {id:'search',label:'Odnajdź zielarkę',text:'Ślady prowadzą poza bezpieczny szlak.',riskCombat:'spider',chance:.55,result:'W gęstwinie coś porusza się szybciej niż człowiek.'},
  {id:'secure',label:'Zabezpiecz zioła',text:'Zostawiasz znak dla straży i chronisz zapasy przed deszczem.',xp:35,item:'herb',result:'Część ziół nadaje się jeszcze do użycia.'}
 ]},
 {kind:'cache',name:'Porzucony skarb',icon:'📦',signal:'Dostrzegasz świeżo naruszoną ziemię',biomes:['ruins','highlands','forest'],desc:'Skrzynia jest ukryta zbyt starannie, by została porzucona przypadkiem.',xp:125,gold:78,item:'scrap',choices:[
  {id:'open',label:'Otwórz skrzynię',text:'Sprawdzasz zamek i podnosisz wieko.',riskCombat:'cultist',chance:.40,result:'To przynęta — właściciel czekał w pobliżu.'},
  {id:'mark',label:'Oznacz miejsce dla gildii',text:'Nie ryzykujesz pułapki i zdobywasz reputację.',xp:65,rep:3,result:'Zwiadowcy odbiorą skrytkę później.'}
 ]},
 {kind:'caravan',name:'Wędrowna karawana',icon:'🛒',signal:'Słyszysz dzwonki kupieckiego wozu',biomes:['meadow','forest','highlands'],desc:'Koło wozu pękło, a kupcy obawiają się, że hałas ściągnie potwory.',xp:95,gold:60,item:'potion',choices:[
  {id:'guard',label:'Osłaniaj naprawę',text:'Stajesz na straży, dopóki wóz nie ruszy.',riskCombat:'wolf',chance:.45,result:'Z zarośli dobiega warczenie.'},
  {id:'repair',label:'Pomóż naprawić koło',text:'Praca trwa krócej, a kupcy płacą za pomoc.',xp:40,gold:35,result:'Karawana rusza przed zapadnięciem zmroku.'}
 ]}
];
function biomeSite(gx,gy){
 const spacing=720,keys=Object.keys(BIOMES),forced={
  '0,0':{x:0,y:0,id:'meadow'},
  '-1,0':{x:-430,y:80,id:'forest'},
  '1,0':{x:430,y:100,id:'ruins'},
  '0,-1':{x:100,y:-430,id:'marsh'},
  '-1,-1':{x:-430,y:-390,id:'highlands'},
  '0,1':{x:40,y:450,id:'forest'},
  '1,-1':{x:510,y:-410,id:'marsh'},
  '1,1':{x:470,y:450,id:'ruins'},
  '-1,1':{x:-470,y:440,id:'highlands'}
 };
 const fk=`${gx},${gy}`;if(forced[fk])return forced[fk];
 const h=gx*92821+gy*68917+4177;
 const jx=(seeded(h+17)-.5)*260,jy=(seeded(h+53)-.5)*260;
 const id=keys[Math.floor(seeded(h+101)*keys.length)%keys.length];
 return {x:gx*spacing+jx,y:gy*spacing+jy,id};
}
function biomeSitesAround(x=0,y=0,rings=2){
 const spacing=720,cx=Math.round(x/spacing),cy=Math.round(y/spacing),out=[];
 for(let gx=cx-rings;gx<=cx+rings;gx++)for(let gy=cy-rings;gy<=cy+rings;gy++)out.push(biomeSite(gx,gy));
 return out;
}
function biomeAt(x=0,y=0){
 let best=null,bestD=Infinity;
 for(const s of biomeSitesAround(x,y,2)){const dx=x-s.x,dy=y-s.y,d=dx*dx+dy*dy;if(d<bestD){bestD=d;best=s}}
 return best?.id||'meadow';
}
function biomeInfoAtPlayer(){const id=biomeAt(state?.player?.position?.x||0,state?.player?.position?.y||0);return {id,...BIOMES[id]}}
const LOCAL_CHUNK_SIZE=700;
const LOCAL_CHUNK_RADIUS=1;
const LOCAL_MOBS_PER_CHUNK=14;
function localChunkCoords(x=0,y=0){return {cx:Math.floor(x/LOCAL_CHUNK_SIZE),cy:Math.floor(y/LOCAL_CHUNK_SIZE)}}
function localChunkId(x=0,y=0){const {cx,cy}=localChunkCoords(x,y);return `${cx}:${cy}`}
function habitatForChunk(cx,cy){
 const x=(cx+.5)*LOCAL_CHUNK_SIZE,y=(cy+.5)*LOCAL_CHUNK_SIZE,biome=biomeAt(x,y),options=HABITATS_BY_BIOME[biome]||HABITATS_BY_BIOME.meadow;
 const seed=cx*92821+cy*68917+22109,index=Math.floor(seeded(seed)*options.length)%options.length,id=options[index];
 return {id,...HABITATS[id],biome,cx,cy,x,y};
}
function habitatAt(x=0,y=0){const {cx,cy}=localChunkCoords(x,y);return habitatForChunk(cx,cy)}
function habitatInfoAtPlayer(){const p=state?.player?.position||{x:0,y:0};return habitatAt(p.x||0,p.y||0)}
function biomeMonsterPool(id){
 const habitats=BIOME_TO_HABITATS[id]||BIOME_TO_HABITATS.meadow;
 return MONSTERS.filter(m=>monsterHabitats(m).some(h=>habitats.includes(h))).map(m=>m.id);
}
function habitatMonsterPool(id,level=state?.player?.level||1){
 const maxLevel=Math.max(12,level+12),minLevel=Math.max(1,level-12);
 let pool=MONSTERS.filter(m=>monsterHabitats(m).includes(id)&&m.min<=maxLevel&&m.max>=minLevel);
 if(pool.length<5)pool=MONSTERS.filter(m=>monsterHabitats(m).includes(id)&&m.min<=level+22);
 if(!pool.length)pool=MONSTERS.filter(m=>m.min<=maxLevel);
 return pool.map(m=>m.id);
}
function generateLocalHabitatMarkers(origin={x:0,y:0}){
 const {cx,cy}=localChunkCoords(origin.x||0,origin.y||0),out=[];
 for(let gx=cx-LOCAL_CHUNK_RADIUS;gx<=cx+LOCAL_CHUNK_RADIUS;gx++)for(let gy=cy-LOCAL_CHUNK_RADIUS;gy<=cy+LOCAL_CHUNK_RADIUS;gy++){
  const h=habitatForChunk(gx,gy),seed=gx*31153+gy*77167+8803;
  out.push({id:`habitat_${gx}_${gy}`,type:'habitat',name:h.name,icon:h.icon,desc:h.desc,habitat:h.id,biome:h.biome,x:h.x+(seeded(seed+11)-.5)*120,y:h.y+(seeded(seed+29)-.5)*120,radius:270,dynamicLocal:true});
 }
 return out;
}
function generateLivingMonsters(day,origin=state?.player?.position||{x:0,y:0},source=state){
 const out=[];
 const {cx,cy}=localChunkCoords(origin.x||0,origin.y||0),respawns=source?.world?.living?.monsterRespawns||{},level=source?.player?.level||1,now=Date.now();
 for(let gx=cx-LOCAL_CHUNK_RADIUS;gx<=cx+LOCAL_CHUNK_RADIUS;gx++)for(let gy=cy-LOCAL_CHUNK_RADIUS;gy<=cy+LOCAL_CHUNK_RADIUS;gy++){
  const habitat=habitatForChunk(gx,gy),pool=habitatMonsterPool(habitat.id,level),goblinPool=pool.filter(id=>String(id).startsWith('goblin')),baseSeed=day*1009+gx*92821+gy*68917;
  for(let i=0;i<LOCAL_MOBS_PER_CHUNK;i++){
   const seed=baseSeed+i*193,x=gx*LOCAL_CHUNK_SIZE+55+seeded(seed+17)*(LOCAL_CHUNK_SIZE-110),y=gy*LOCAL_CHUNK_SIZE+55+seeded(seed+53)*(LOCAL_CHUNK_SIZE-110);
   const goblinPatrol=['crossroads','settlement'].includes(habitat.id)&&i<Math.min(3,goblinPool.length),template=goblinPatrol?goblinPool[(i+Math.floor(seeded(baseSeed+71)*goblinPool.length))%goblinPool.length]:pool[Math.floor(seeded(seed+101)*pool.length)]||'wolf',id=`local_${day}_${gx}_${gy}_${i}`;let respawn=respawns[id]||0;
   const entity={id,type:'monster',template,variant:monsterVariantFromRoll(seeded(seed+173),level),x,y,alive:respawn<=now,elite:seeded(seed+149)>.92,biome:habitat.biome,habitat:habitat.id,dynamicLocal:true,chunk:`${gx}:${gy}`};
   Object.defineProperty(entity,'respawn',{enumerable:true,configurable:true,get(){return respawn},set(value){respawn=value;if(source?.world?.living){source.world.living.monsterRespawns ||= {};if(value>Date.now())source.world.living.monsterRespawns[id]=value;else delete source.world.living.monsterRespawns[id]}}});
   out.push(entity);
  }
 }
 return out;
}
function makeLivingEvents(day,origin={x:0,y:0}){
 const out=[];
 const chunk=localChunkId(origin.x||0,origin.y||0).replace(':','_');
 for(let i=0;i<6;i++){
  const a=seeded(day+500+i*43)*Math.PI*2,r=150+seeded(day+700+i*59)*640,x=(origin.x||0)+Math.cos(a)*r,y=(origin.y||0)+Math.sin(a)*r,biome=biomeAt(x,y);
  const pool=WORLD_EVENTS.filter(e=>!e.biomes||e.biomes.includes(biome)),base=pool[Math.floor(seeded(day+910+i*97)*pool.length)]||WORLD_EVENTS[i%WORLD_EVENTS.length];
  out.push({...base,id:`event_${day}_${chunk}_${i}`,type:'event',x,y,biome,habitat:habitatAt(x,y).id,done:false,dynamicLocal:true,expiresAt:new Date().setHours(23,59,59,999)});
 }
 return out;
}
function makeContextEvent(s,contextKey){
 const c=climate(s),p=s?.player?.position||{x:0,y:0},seed=daySeed()+c.bucket*997,a=seeded(seed+73)*Math.PI*2,r=105+seeded(seed+91)*210,x=(p.x||0)+Math.cos(a)*r,y=(p.y||0)+Math.sin(a)*r,biome=biomeAt(x,y);
 let kind=c.weather==='Burza'?'rift':c.weather==='Mgła'||c.phase==='Noc'?'cry':c.weather==='Deszcz'?'herbalist':'ambush';
 let base=WORLD_EVENTS.find(e=>e.kind===kind)||WORLD_EVENTS.find(e=>(e.biomes||[]).includes(biome))||WORLD_EVENTS[0];
 const special=c.weather==='Burza'?{name:'Pęknięcie burzowe',icon:'⚡',signal:'Nagle uderza piorun, choć niebo nad Tobą jest puste'}:c.weather==='Mgła'?{name:'Głos we mgle',icon:'🌫️',signal:'Z mgły dobiega szept, który zna Twoje imię'}:c.phase==='Noc'?{name:'Wycie w ciemności',icon:'🌙',signal:'Słyszysz wycie bardzo blisko szlaku'}:c.weather==='Deszcz'?{name:'Ślady zmywane przez deszcz',icon:'🌧️',signal:'Deszcz odsłania świeże ślady przy drodze'}:{name:'Ruch na bocznym szlaku',icon:'✨',signal:'Na skraju widzenia coś porusza się między drzewami'};
 return {...base,...special,id:`context_${contextKey}`,type:'event',x,y,biome,done:false,contextual:true,rare:true,expiresAt:Date.now()+Math.max(15*60*1000,(6-(new Date().getHours()%6))*60*60*1000)};
}
function ensureLivingWorld(s=state){
 if(!s?.world)return;
 s.world.living ||= {spawnDay:0,spawnKey:'',eventDay:0,contextKey:'',monsterRespawns:{},completedEvents:[],notifiedEvents:[],eventHistory:[],dailyExplore:{day:daySeed(),cells:{},claimed:false}};
 const L=s.world.living,day=daySeed();
 L.completedEvents ||= [];L.notifiedEvents ||= [];L.eventHistory ||= [];L.contextKey ||= '';L.spawnKey ||= '';L.monsterRespawns ||= {};
 for(const e of s.world.entities||[])if(e.dynamicLocal&&!e.alive&&(e.respawn||0)>Date.now())L.monsterRespawns[e.id]=e.respawn;
 if(!L.dailyExplore||L.dailyExplore.day!==day)L.dailyExplore={day,cells:{},claimed:false};
 const p=s.player?.position||{x:0,y:0},spawnKey=`${day}:${localChunkId(p.x||0,p.y||0)}`;
 for(const [id,time] of Object.entries(L.monsterRespawns))if(time<=Date.now())delete L.monsterRespawns[id];
 if(L.spawnDay!==day||L.eventDay!==day||L.spawnKey!==spawnKey){
  const newDay=L.spawnDay!==day;
  const staticEntities=(s.world.entities||generateWorld()).filter(e=>{
   if(e.dynamicLocal||e.type==='habitat')return false;
   if(e.type==='event'&&!e.persistent)return false;
   if(e.type==='monster'&&!e.questOnly&&!e.bountyId&&!e.synthetic)return false;
   return true;
  });
  if(newDay){L.completedEvents=L.completedEvents.filter(id=>String(id).startsWith('story_'));L.monsterRespawns={}}
  const events=makeLivingEvents(day,p);for(const e of events)e.done=L.completedEvents.includes(e.id);
  s.world.entities=[...generateLivingMonsters(day,p,s),...generateLocalHabitatMarkers(p),...events,...staticEntities];
  L.spawnDay=day;L.eventDay=day;L.spawnKey=spawnKey;L.notifiedEvents=[];L.contextKey='';
 }
 const contextKey=worldContextKey(s);
 if(L.contextKey!==contextKey){
  s.world.entities=(s.world.entities||[]).filter(e=>!e.contextual);
  const event=makeContextEvent(s,contextKey);if(!L.completedEvents.includes(event.id))s.world.entities.push(event);
  L.contextKey=contextKey;
 }
}
function explorationCell(x,y,size=100){return `${Math.floor(x/size)}:${Math.floor(y/size)}`}
function registerExplorationProgress(x,y){
 ensureLivingWorld();
 const d=state.world.living.dailyExplore,key=explorationCell(x,y);d.cells[key]=1;
 const count=Object.keys(d.cells).length;
 if(count>=8&&!d.claimed){d.claimed=true;state.player.gold+=75;state.adventure.reputation+=5;gainXp(350);toast('Cel eksploracji ukończony! +350 XP • +75 🪙 • +5 reputacji')}
 return count;
}
function explorationStats(){ensureLivingWorld();const d=state.world.living.dailyExplore,count=Object.keys(d.cells||{}).length;return {count,goal:8,claimed:!!d.claimed,percent:Math.min(100,Math.round(count/8*100))}}
function eventById(id){return (state.world.entities||[]).find(e=>e.type==='event'&&e.id===id)}
function eventChoiceMonster(e,choice){const id=choice.combatByBiome?.[e.biome]||choice.combat||choice.riskCombat;return MONSTERS.some(m=>m.id===id)?id:'goblin'}
function completeWorldEvent(e,choice={},opts={}){
 if(!e||e.done)return;ensureLivingWorld();const effect=biomeEffect(e.biome||biomeAt(e.x,e.y));
 e.done=true;if(!state.world.living.completedEvents.includes(e.id))state.world.living.completedEvents.push(e.id);
 const xp=Math.max(0,Math.round((e.xp||0)+(choice.xp||0))),gold=Math.max(0,Math.round(((e.gold||0)+(choice.gold||0))*(effect.eventGold||1))),rep=choice.rep||0;
 state.player.gold+=gold;if(rep)state.adventure.reputation+=rep;
 const rewards=[];for(const id of [e.item,choice.item].filter(Boolean)){const qty=1+(effect.eventMaterial||0);addItem(id,qty);rewards.push(`${qty}× ${itemDef(id).name}`)}
 if(xp)gainXp(xp);state.world.living.eventHistory.unshift({id:e.id,name:e.name,choice:choice.label||'Interakcja',at:Date.now(),result:choice.result||'',biome:e.biome});state.world.living.eventHistory=state.world.living.eventHistory.slice(0,12);save();
 if(!opts.deferRender){closeModal();if(currentTab==='map')selectNav('map')}
 toast(`${e.name}: +${xp} XP • +${gold} 🪙${rep?` • +${rep} rep.`:''}${rewards.length?` • ${rewards.join(', ')}`:''}`);
}
function chooseWorldEvent(e,choiceId){
 const choice=(e.choices||[]).find(c=>c.id===choiceId);if(!choice||e.done)return;
 const monsterId=eventChoiceMonster(e,choice),mustFight=!!(choice.combat||choice.combatByBiome),riskFight=!!choice.riskCombat&&Math.random()<(choice.chance??.5);
 if(mustFight||riskFight){const m=MONSTERS.find(x=>x.id===monsterId),lvl=clamp(state.player.level+(choice.elite?1:0),m.min,m.max),entity={id:`eventfight_${e.id}_${Date.now()}`,type:'monster',template:m.id,x:e.x,y:e.y,alive:true,elite:!!choice.elite,synthetic:true};closeModal();toast(`⚠️ ${choice.result||'Zostałeś zaatakowany!'}`);startCombat(entity,{level:lvl,worldEvent:{eventId:e.id,choiceId:choice.id}});return}
 completeWorldEvent(e,choice);
}
function openWorldEvent(e){
 if(!e||e.type!=='event'||!gpsInteractionReady())return;ensureLivingWorld();if(state.world.living.completedEvents.includes(e.id)||e.done)return toast('To wydarzenie zostało już ukończone.');
 const d=dist(e,state.player.position);if(d>60)return toast(`Podejdź bliżej. ${Math.round(d)} m.`);const bio=BIOMES[e.biome||biomeAt(e.x,e.y)],cl=climate(),choices=e.choices?.length?e.choices:[{id:'resolve',label:'Zbadaj miejsce',text:'Sprawdzasz teren i zabezpieczasz znalezisko.',result:'Wydarzenie zostało rozwiązane.'}];
 openModal(`<div class="world-event-scene"><div class="event-scene-art"><span>${e.icon||'✨'}</span><em>${e.rare?'RZADKIE WYDARZENIE':'WYDARZENIE ŚWIATA'}</em></div><div class="modal-head"><div><h2>${e.name}</h2><div class="muted">${bio.icon} ${bio.name} • ${cl.icon} ${cl.weather} • ${cl.phase}</div></div><button class="close" data-close>×</button></div><p class="event-scene-desc">${e.desc||'Coś wydarzyło się w tej okolicy.'}</p>${biomeEffectHTML(e.biome||biomeAt(e.x,e.y))}<div class="story-choices event-choices">${choices.map(c=>`<button class="story-choice" data-event-choice="${c.id}"><b>${c.label}</b><small>${c.text}</small>${c.combat||c.combatByBiome?'<em class="story-consequence-hint">⚠️ Może rozpocząć walkę</em>':c.riskCombat?'<em class="story-consequence-hint">🎲 Ryzyko zasadzki</em>':''}</button>`).join('')}</div></div>`);
 document.querySelectorAll('[data-event-choice]').forEach(b=>b.onclick=()=>chooseWorldEvent(e,b.dataset.eventChoice));
}
function resolveWorldEvent(e){openWorldEvent(e)}
function notifyNearbyWorldEvents(){
 ensureLivingWorld();const L=state.world.living,near=(state.world.entities||[]).filter(e=>e.type==='event'&&!e.done&&!L.notifiedEvents.includes(e.id)).map(e=>({e,d:dist(e,state.player.position)})).filter(x=>x.d<=220).sort((a,b)=>a.d-b.d)[0];if(!near)return;
 L.notifiedEvents.push(near.e.id);save();toast(`✨ ${near.e.signal||'W pobliżu dzieje się coś niezwykłego'} — ${Math.round(near.d)} m`);
}


const EXPLORATION_REGIONS={
 valley:{id:'valley',name:'Dolina Kruka',icon:'🌲',level:'1–10',bounds:{x1:-400,x2:400,y1:-400,y2:400}},
 north:{id:'north',name:'Północne Rubieże',icon:'❄️',level:'11–20',bounds:{x1:360,x2:640,y1:-400,y2:400}},
 mire:{id:'mire',name:'Mokradła Echa',icon:'🌫️',level:'21–30',bounds:{x1:600,x2:1040,y1:-420,y2:420}},
 ash:{id:'ash',name:'Popielne Pustkowia',icon:'🔥',level:'31–40',bounds:{x1:1040,x2:1440,y1:-450,y2:450}},
 peaks:{id:'peaks',name:'Rozbite Szczyty',icon:'⛰️',level:'41–50',bounds:{x1:1440,x2:1880,y1:-460,y2:460}}
};
const EXPLORATION_SECRETS=[
 {id:'secretFirstTrail',region:'valley',name:'Znak Pierwszego Szlaku',icon:'🪶',x:95,y:-35,desc:'Niewielki kamień ze świeżym symbolem kruka. Pierwsza wskazówka, że poza głównym szlakiem czekają sekrety.',xp:70,gold:20,item:'herb'},
 {id:'secretCrowStone',region:'valley',name:'Kamień Kruka',icon:'🪨',x:-145,y:-245,desc:'Kamień z wyrytym symbolem kruka. Ktoś zostawił pod nim drobny depozyt.',xp:120,gold:35,item:'crystal'},
 {id:'secretHunterCache',region:'valley',name:'Skrytka Myśliwego',icon:'🎒',x:285,y:185,desc:'Stara skrytka ukryta poza szlakiem.',xp:140,gold:45,item:'wolfCharm'},
 {id:'secretOldWell',region:'valley',name:'Zapomniana Studnia',icon:'🕳️',x:-315,y:95,desc:'Studnia zarosła mchem, ale na dnie wciąż coś błyszczy.',xp:110,gold:30,item:'moonHerb'},
 {id:'secretIceRune',region:'north',name:'Runa Mrozu',icon:'❄️',x:455,y:-185,desc:'Znak wykuty w kamieniu przez dawnych strażników północy.',xp:180,gold:55,item:'runeShard'},
 {id:'secretBanner',region:'north',name:'Rozdarty Sztandar',icon:'🚩',x:535,y:275,desc:'Pozostałość po oddziale, który nigdy nie wrócił do doliny.',xp:190,gold:60,item:'runeGuard'},
 {id:'secretBellShard',region:'north',name:'Odłamek Dzwonu',icon:'🔔',x:585,y:-285,desc:'Metaliczny fragment pokryty starymi znakami.',xp:210,gold:65,item:'crystal'},
 {id:'secretDrownedIdol',region:'mire',name:'Idol Topielców',icon:'🗿',x:690,y:-135,desc:'Kamienna twarz wynurza się z czarnej wody.',xp:240,gold:75,item:'wraithEssence'},
 {id:'secretReedCircle',region:'mire',name:'Krąg Trzcin',icon:'🌾',x:755,y:285,desc:'Trzciny układają się tu w idealny krąg mimo braku wiatru.',xp:230,gold:70,item:'mireMoss'},
 {id:'secretBlackrootChest',region:'mire',name:'Skrzynia Czarnego Korzenia',icon:'📦',x:875,y:-70,desc:'Skrzynia związana korzeniami. Ktoś bardzo nie chciał, by ją odnaleziono.',xp:280,gold:95,item:'runePrecision'},
 {id:'secretDrownedGrave',region:'mire',name:'Grób bez imienia',icon:'🪦',x:930,y:245,desc:'Kamień nagrobny stojący samotnie pośród mokradeł.',xp:300,gold:90,item:'bogAmber'},
{id:'secretAshAnvil',region:'ash',name:'Kuźnia bez kowala',icon:'⚒️',x:1120,y:250,desc:'Kamienne kowadło jest wciąż ciepłe, choć w pobliżu nikogo nie ma.',xp:360,gold:120,item:'charredIron'},
 {id:'secretGlassField',region:'ash',name:'Pole Czarnego Szkła',icon:'🔸',x:1260,y:-310,desc:'Piasek stopił się tu w gładkie czarne płyty.',xp:390,gold:130,item:'ashGlass'},
 {id:'secretCinderNest',region:'ash',name:'Gniazdo Żaru',icon:'🔥',x:1380,y:280,desc:'W szczelinie skalnej pulsuje niewielki rdzeń ognia.',xp:420,gold:145,item:'emberCore'},
 {id:'secretFrozenMap',region:'peaks',name:'Mapa w lodzie',icon:'🗺️',x:1490,y:260,desc:'Pod warstwą lodu widać fragment mapy dawnych przełęczy.',xp:460,gold:150,item:'frostCrystal'},
 {id:'secretStormNest',region:'peaks',name:'Gniazdo Jastrzębia',icon:'🪶',x:1665,y:320,desc:'Na półce skalnej leżą pióra naładowane statyczną energią.',xp:490,gold:165,item:'stormFeather'},
 {id:'secretSkyForge',region:'peaks',name:'Kuźnia Niebios',icon:'⚡',x:1830,y:-260,desc:'Stary piec kuźniczy zbiera energię z uderzeń piorunów.',xp:540,gold:185,item:'skySteel'}
];
const FAST_TRAVEL_BASE=[
 {id:'village',name:'Wioska pod Krukiem',icon:'🏘️',x:0,y:0,always:true},
 {id:'hermit',name:'Chata Pustelnika',icon:'🛖'},
 {id:'northCamp',name:'Obóz Północny',icon:'🏕️'},
 {id:'mireGate',name:'Brama Trzcin',icon:'🌾'},
 {id:'ashGate',name:'Popielna Brama',icon:'🔥'},
 {id:'peakGate',name:'Kamienna Przełęcz',icon:'⛰️'}
];
function explorationSectorSize(s=state){return s?.world?.exploration?.sectorSize||80}
function sectorParts(key){const [sx,sy]=String(key).split(':').map(Number);return {sx,sy}}
function sectorKey80(x,y,size=explorationSectorSize()){return `${Math.floor(x/size)}:${Math.floor(y/size)}`}
function sectorCenter(key,size=explorationSectorSize()){const {sx,sy}=sectorParts(key);return {x:(sx+.5)*size,y:(sy+.5)*size}}
function regionIdAt(x=0,y=0){if(x>=1440)return'peaks';if(x>=1040)return'ash';if(x>=620)return'mire';if(x>=350)return'north';return'valley'}
function currentRegionId(){return regionIdAt(state?.player?.position?.x||0,state?.player?.position?.y||0)}
function ensureExplorationState(s=state){
 if(!s?.world)return;
 s.world.exploration ||= {sectorSize:80,sectors:{},secretsFound:[],cartographyXp:0,regionRewards:{},travelVisited:[]};
 const e=s.world.exploration;e.sectorSize ||= 80;e.sectors ||= {};e.secretsFound ||= [];e.cartographyXp ||= 0;e.regionRewards ||= {};e.travelVisited ||= [];
 if(Object.keys(e.sectors).length===0&&s.world.gpsOrigin&&(s.world.explored||[]).length){
  const o=s.world.gpsOrigin;
  for(const p of s.world.explored){const y=(p[0]-o.lat)*111320,x=(p[1]-o.lng)*111320*Math.cos(o.lat*Math.PI/180),key=sectorKey80(x,y,e.sectorSize);e.sectors[key] ||= {firstSeen:s.created||Date.now(),visits:1,region:regionIdAt(x,y)}}
 }
 const ids=new Set((s.world.entities||[]).map(x=>x.id));
 for(const sec of EXPLORATION_SECRETS)if(!ids.has(sec.id))s.world.entities.push({...sec,type:'secret'});const td=DUNGEONS.find(d=>d.id==='trainingCellar');if(td&&!ids.has(td.id))s.world.entities.push({...td,type:'dungeon'});
}
function isSectorDiscoveredAt(x,y){ensureExplorationState();return !!state.world.exploration.sectors[sectorKey80(x,y)]}
function markExplorationArea(x,y){
 ensureExplorationState();const e=state.world.exploration,size=e.sectorSize,r=state.world.fogRadius||90,sx=Math.floor(x/size),sy=Math.floor(y/size);let added=0;
 for(let ix=sx-2;ix<=sx+2;ix++)for(let iy=sy-2;iy<=sy+2;iy++){
  const cx=(ix+.5)*size,cy=(iy+.5)*size;if(Math.hypot(cx-x,cy-y)>r+size*.55)continue;
  const key=`${ix}:${iy}`;if(!e.sectors[key]){e.sectors[key]={firstSeen:Date.now(),visits:1,region:regionIdAt(cx,cy)};e.cartographyXp+=6;added++}else e.sectors[key].visits=(e.sectors[key].visits||0)+1;
 }
 if(added){checkRegionRewards();playSfx('discover');haptic(10)}
 return added;
}
function regionKeys(regionId){
 ensureExplorationState();const r=EXPLORATION_REGIONS[regionId]||EXPLORATION_REGIONS.valley,size=state.world.exploration.sectorSize,b=r.bounds,out=[];
 const sx1=Math.floor(b.x1/size),sx2=Math.ceil(b.x2/size)-1,sy1=Math.floor(b.y1/size),sy2=Math.ceil(b.y2/size)-1;
 for(let sx=sx1;sx<=sx2;sx++)for(let sy=sy1;sy<=sy2;sy++){const c={x:(sx+.5)*size,y:(sy+.5)*size};if(c.x>=b.x1&&c.x<b.x2&&c.y>=b.y1&&c.y<b.y2)out.push(`${sx}:${sy}`)}return out;
}
function regionDiscoveryStats(regionId=currentRegionId()){
 ensureExplorationState();const keys=regionKeys(regionId),sectors=state.world.exploration.sectors,done=keys.filter(k=>sectors[k]).length,total=keys.length;return {id:regionId,...EXPLORATION_REGIONS[regionId],done,total,percent:total?Math.min(100,Math.round(done/total*100)):0};
}
function regionDiscoveryPercent(regionId=currentRegionId()){return regionDiscoveryStats(regionId).percent}
function regionSecretStats(regionId=currentRegionId()){
 ensureExplorationState();const all=EXPLORATION_SECRETS.filter(s=>s.region===regionId),found=state.world.exploration.secretsFound;return {done:all.filter(s=>found.includes(s.id)).length,total:all.length,all};
}
function cartographyStats(){ensureExplorationState();const xp=state.world.exploration.cartographyXp||0,level=1+Math.floor(xp/250),into=xp%250;const rank=level>=8?'Mistrz Map':level>=5?'Kartograf':level>=3?'Zwiadowca':'Wędrowiec';return {xp,level,into,next:250,rank,sectors:Object.keys(state.world.exploration.sectors).length}}
function checkRegionRewards(){
 ensureExplorationState();const ex=state.world.exploration,reg=regionDiscoveryStats();ex.regionRewards[reg.id] ||= {};
 for(const mark of [25,50,75,100])if(reg.percent>=mark&&!ex.regionRewards[reg.id][mark]){
  ex.regionRewards[reg.id][mark]=true;const gold={25:60,50:110,75:180,100:320}[mark],xp={25:120,50:220,75:380,100:700}[mark];state.player.gold+=gold;gainXp(xp);if(mark===100)addItem('runeShard',2);toast(`${reg.name}: odkryto ${mark}%! +${xp} XP • +${gold} 🪙${mark===100?' • 2× Odłamek Runiczny':''}`);playSfx('discover');haptic([18,30,18]);
 }
}
function secretMapVisible(e){if(e.type!=='secret')return true;ensureExplorationState();const found=state.world.exploration.secretsFound.includes(e.id);if(found)return true;return isSectorDiscoveredAt(e.x,e.y)&&dist(e,state.player.position)<=150}
function discoverSecret(e){
 ensureExplorationState();if(state.world.exploration.secretsFound.includes(e.id))return toast(`${e.name} — już odkryte.`);if(dist(e,state.player.position)>60)return toast(`Podejdź na 60 m. Brakuje około ${Math.max(1,Math.round(dist(e,state.player.position)-60))} m.`);
 state.world.exploration.secretsFound.push(e.id);tutorialEvent('secret',e.id);state.world.exploration.cartographyXp+=50;state.player.gold+=e.gold||0;if(e.item)addItem(e.item);gainXp(e.xp||0);save();playSfx('discover');haptic([20,35,20]);toast(`Sekret odkryty: ${e.name}! +${e.xp} XP • +${e.gold} 🪙${e.item?` • ${itemDef(e.item).name}`:''}`);if(currentTab==='map')selectNav('map');
}
function availableTravelNodes(){
 ensureExplorationState();const out=[];
 for(const n of FAST_TRAVEL_BASE){if(n.always){out.push(n);continue}const ent=(state.world.entities||[]).find(e=>e.id===n.id);if(ent&&(state.player.discovered.includes(n.id)||state.player.dungeons.includes(n.id)))out.push({...n,x:ent.x,y:ent.y})}
 for(const id of state.player.dungeons){const d=DUNGEONS.find(x=>x.id===id);if(d)out.push({id:d.id,name:d.name,icon:d.icon,x:d.x,y:d.y,dungeon:true})}
 return out.filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);
}
function openExplorerJournal(){
 ensureExplorationState();const cart=cartographyStats(),regions=Object.keys(EXPLORATION_REGIONS).map(id=>regionDiscoveryStats(id)),found=state.world.exploration.secretsFound;
 openModal(`<div class="modal-head"><div><h2>🧭 Dziennik Odkrywcy</h2><div class="muted">Kartografia • poziom ${cart.level} — ${cart.rank}</div></div><button class="close" data-close>×</button></div><div class="cartography-card"><div><b>${cart.sectors}</b><span>odkrytych sektorów</span></div><div><b>${cart.xp}</b><span>XP kartografii</span></div><div><b>${found.length}/${EXPLORATION_SECRETS.length}</b><span>sekretów</span></div></div><div class="cartography-progress"><span style="width:${cart.into/cart.next*100}%"></span></div><small class="muted">Do kolejnego poziomu kartografii: ${cart.next-cart.into} XP</small><h3>Regiony</h3><div class="explorer-region-grid">${regions.map(r=>{const ss=regionSecretStats(r.id);return `<div class="explorer-region-card ${r.id===currentRegionId()?'current':''}"><div><b>${r.icon} ${r.name}</b><small>Poziomy ${r.level}</small></div><strong>${r.percent}%</strong><div class="mini-progress"><span style="width:${r.percent}%"></span></div><small>${r.done}/${r.total} sektorów • sekrety ${ss.done}/${ss.total}</small></div>`}).join('')}</div><h3>Sekrety</h3><div class="secret-journal">${EXPLORATION_SECRETS.map(s=>`<div class="secret-entry ${found.includes(s.id)?'found':''}"><span>${found.includes(s.id)?s.icon:'❔'}</span><div><b>${found.includes(s.id)?s.name:'Nieodkryty sekret'}</b><small>${EXPLORATION_REGIONS[s.region].name}${found.includes(s.id)?` • ${s.desc}`:' • eksploruj region'}</small></div><em>${found.includes(s.id)?'✓':'?'}</em></div>`).join('')}</div>`);
}
function openFastTravel(){
 if(!state.world.gpsOrigin)return toast('Najpierw uruchom GPS i zakotwicz świat.');const nodes=availableTravelNodes();
 openModal(`<div class="modal-head"><div><h2>⚡ Szybka podróż</h2><div class="muted">Działa wyłącznie do miejsc, które wcześniej odkryłeś.</div></div><button class="close" data-close>×</button></div><div class="panel-item travel-warning"><b>${gpsWatch!==null?'📍 GPS jest aktywny':'🏠 Tryb domowy'}</b><div class="muted">${gpsWatch!==null?'Przy aktywnym GPS możesz tylko wyśrodkować mapę na odkrytym miejscu. Wyłącz GPS, aby wejść w tryb podróży domowej.':'Podróż domowa nie pozwala farmić potworów ani eventów GPS. Odkryte lochy pozostają dostępne.'}</div></div><div class="travel-list">${nodes.map(n=>`<button class="travel-node" data-travel="${n.id}"><span>${n.icon}</span><div><b>${n.name}</b><small>${n.dungeon?'Odkryty loch':'Odkryty węzeł'}${gpsWatch===null?` • ${travelCost(n)} 🪙`:''}</small></div><em>→</em></button>`).join('')}</div>`);document.querySelectorAll('[data-travel]').forEach(b=>b.onclick=()=>fastTravelTo(b.dataset.travel));
}
function fastTravelTo(id){
 const n=availableTravelNodes().find(x=>x.id===id);if(!n)return toast('Ten węzeł nie jest dostępny.');const ll=worldToLatLng(n.x,n.y);if(!ll)return toast('Brak zakotwiczonego świata GPS.');
 if(gpsWatch!==null){closeModal();followGps=false;if(realMap)realMap.setView(ll,18,{animate:true});toast(`Mapa: ${n.name}`);return}
 const cost=travelCost(n);if(state.player.gold<cost)return toast(`Podróż kosztuje ${cost} 🪙.`);state.player.gold-=cost;
 state.player.position={x:n.x,y:n.y,lat:ll[0],lng:ll[1],gps:false,accuracy:0,heading:null,virtualTravel:true};state.world.exploration.travelVisited.push(id);save();closeModal();selectNav('map');toast(`Szybka podróż: ${n.name} • -${cost} 🪙. Tryb GPS-interakcji jest zablokowany.`)
}
function sectorLatLngRing(key){const size=explorationSectorSize(),{sx,sy}=sectorParts(key),x1=sx*size,y1=sy*size,x2=x1+size,y2=y1+size,a=worldToLatLng(x1,y1),b=worldToLatLng(x2,y2);if(!a||!b)return null;return [[a[0],a[1]],[b[0],a[1]],[b[0],b[1]],[a[0],b[1]]]}

function equippedInstanceForState(s,slot){const e=s?.player?.equipped?.[slot];if(!e)return null;return s.player.inventory.find(x=>x.uid&&x.uid===e.uid)||e}
function normalizeState(s){
 if(!s)return null;
 const previousVersion=s.version||0;
 s.version=390;
 s.player ||= {};s.player.name=String(s.player.name||'Wędrowiec').replace(/[<>]/g,'').slice(0,30);if(s.player.guild)s.player.guild=String(s.player.guild).replace(/[<>]/g,'').slice(0,28);
 s.player.stats ||= {str:5,agi:5,int:5,vit:5};
 s.player.inventory ||= [];
 s.player.inventory=normalizeInventoryStacks(s.player.inventory);
 s.player.inventoryCapacity ??= 32;
 for(const i of s.player.inventory){if(!isStackable(i.id)){i.uid ||= uid();i.upgrade ||= 0;i.rune ??= null;i.enchant ??= null;i.enchantRolls ||= 0;i.affix ??= null}}
 const oldEq=s.player.equipped||{};
 s.player.equipped={weapon:oldEq.weapon||null,helmet:oldEq.helmet||null,armor:oldEq.armor||null,gloves:oldEq.gloves||null,boots:oldEq.boots||null,amulet:oldEq.amulet||oldEq.trinket||null,ring1:oldEq.ring1||null,ring2:oldEq.ring2||null,offhand:oldEq.offhand||null};
 for(const slot of Object.keys(s.player.equipped)){const e=s.player.equipped[slot];if(e?.uid){const found=s.player.inventory.find(x=>x.uid===e.uid);if(found)s.player.equipped[slot]=found}}
 s.player.skills ||= [];
 s.player.skillPoints ??= 1;
 s.player.statPoints ??= 0;
 s.player.pets ||= [];
 s.player.petActive ??= null;
 s.player.bestiary ||= {};
 s.player.bestiaryVariants ||= {};
 for(const [monsterId,kills] of Object.entries(s.player.bestiary))if(kills>0&&!s.player.bestiaryVariants[monsterId])s.player.bestiaryVariants[monsterId]={normal:kills};
 s.player.discovered ||= [];
 s.player.dungeons ||= [];
 s.player.dungeonClears ||= {};
 s.player.friends ||= [];
 s.player.guild ??= null;
 s.player.position ||= {x:0,y:0,lat:null,lng:null,gps:false};
 s.player.maxStamina ??= 100; s.player.stamina ??= s.player.maxStamina; s.player.stamina=clamp(s.player.stamina,0,s.player.maxStamina);
 s.player.kills ||= 0;
 s.quests ||= {active:['q1'],done:[],progress:{}};
 s.quests.active ||= ['q1'];s.quests.done ||= [];s.quests.progress ||= {};
 s.world ||= {entities:generateWorld(),gpsOrigin:null};
 s.world.entities ||= generateWorld();
 ensureRegion3Entities(s);
 s.world.gpsOrigin ??= null;
 s.world.explored ||= [];
 s.world.fogRadius=100;
 s.settings ||= {};
 s.settings.demo=SAVE_KEY===DEMO_SAVE_KEY;s.settings.forceNight=s.settings.demo?!!s.settings.forceNight:false;
 s.settings.mapFilters ||= {monster:true,poi:true,dungeon:true,event:true,biome:true,trail:true};
 s.settings.mapFilters.monster ??= true;s.settings.mapFilters.poi ??= true;s.settings.mapFilters.dungeon ??= true;s.settings.mapFilters.event ??= true;s.settings.mapFilters.biome ??= true;s.settings.mapFilters.trail ??= true;if(previousVersion<131)s.settings.mapFilters.biome=true;ensureCoreState(s);if(s.quests.active.includes('q2')&&!s.quests.done.includes('q2')&&(s.quests.progress.q2||[]).length<4){s.quests.progress.q2=[0,0,0,0];if(s.story?.choices)delete s.story.choices.q2;}
 s.adventure ||= {day:daySeed(),reputation:0,bounties:[],worldBossDay:0,achievements:{}};
 if(previousVersion<19&&s.world?.living){s.world.living.spawnDay=0;s.world.living.eventDay=0}
 if(previousVersion<310&&s.world?.living){s.world.living.spawnDay=0;s.world.living.eventDay=0;s.world.living.contextKey=''}
 if(previousVersion<320&&s.world?.living){s.world.living.spawnDay=0;s.world.living.eventDay=0;s.world.living.contextKey=''}
 if(previousVersion<330&&s.world?.living){s.world.living.spawnDay=0;s.world.living.eventDay=0;s.world.living.contextKey=''}
 if(previousVersion<340&&s.world?.living){s.world.living.spawnDay=0;s.world.living.eventDay=0;s.world.living.spawnKey='';s.world.living.contextKey='';s.world.living.monsterRespawns={}}
 ensureAdventureState(s);
 ensureEconomyState(s);
 ensureLivingWorld(s);
 ensureExplorationState(s);
 if(['hunter','ranger'].includes(s.player.class)&&s.player.pets.length===0){s.player.pets.push({id:'youngWolf',level:1,xp:0});s.player.petActive='youngWolf'}
 if(previousVersion<128&&['hunter','ranger'].includes(s.player.class)&&!s.player.inventory.some(x=>x.id==='primitiveArrow'))s.player.inventory.push({id:'primitiveArrow',qty:150});
 if(previousVersion<128&&s.player.level<7){for(const [slot,id] of [['weapon',starterWeapon(s.player.class)],['armor',starterArmor()],['boots',starterBoots()]]){const current=equippedInstanceForState(s,slot),d=itemDef(current?.id);if(d?.reqLevel&&s.player.level<d.reqLevel){const fresh={id,uid:uid(),upgrade:0,rune:null,enchant:null,enchantRolls:0,affix:null};s.player.inventory.push(fresh);s.player.equipped[slot]=fresh}}}
 return s;
}

function load(){
 const now=rawLoad(SAVE_KEY);if(now)return normalizeState(now);
 if(SAVE_KEY===DEMO_SAVE_KEY)return null;
 for(const key of MIGRATION_KEYS){const old=rawLoad(key);if(old){const migrated=normalizeState(old);localStorage.setItem(SAVE_KEY,JSON.stringify(migrated));return migrated}}
 return null;
}
function newGame(name,cls){
 const c=CLASSES[cls];
 const weapon={id:starterWeapon(cls),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const armor={id:starterArmor(),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const boots={id:starterBoots(),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const pets=['hunter','ranger'].includes(cls)?[{id:'youngWolf',level:1,xp:0}]:[];
 state={version:390,created:Date.now(),player:{name:String(name||'Wędrowiec').replace(/[<>]/g,'').slice(0,30),class:cls,level:1,xp:0,gold:55,hp:c.hp,maxHp:c.hp,mana:c.mana,maxMana:c.mana,stamina:100,maxStamina:100,stats:{...c.base},statPoints:0,skillPoints:1,skills:[],inventoryCapacity:32,inventory:[weapon,armor,boots,...(['hunter','ranger'].includes(cls)?[{id:'primitiveArrow',qty:150}]:[]),{id:'potion',qty:3},{id:'herb',qty:3},{id:'scrap',qty:1}],equipped:{weapon,helmet:null,armor,gloves:null,boots,amulet:null,ring1:null,ring2:null,offhand:null},bestiary:{},bestiaryVariants:{},discovered:[],dungeons:[],dungeonClears:{},position:{x:0,y:0,lat:null,lng:null,gps:false},kills:0,guild:null,friends:[],pets,petActive:pets.length?'youngWolf':null},quests:{active:['q1'],done:[],progress:{}},world:{entities:generateWorld(),gpsOrigin:null,explored:[],fogRadius:100,living:{spawnDay:0,spawnKey:'',eventDay:0,contextKey:'',monsterRespawns:{},completedEvents:[],notifiedEvents:[],eventHistory:[],dailyExplore:{day:daySeed(),cells:{},claimed:false}}},settings:{demo:SAVE_KEY===DEMO_SAVE_KEY,forceNight:false,masterSound:true,audio:true,ambient:true,sfxVolume:.68,ambientVolume:.18,haptics:true,mapMode:'focused',mapFilters:{monster:true,poi:true,dungeon:true,event:true,biome:true,trail:true}},tutorial:{stage:0,complete:false,rewardGiven:false,flags:{},introSeen:false,finishReward:false,mapDismissedStage:-1},ui:{heroView:'char',adventureView:'quests',menuView:'settings'},adventure:{day:daySeed(),reputation:0,bounties:makeDailyBounties(daySeed()),worldBossDay:0,achievements:{}},economy:{elitePity:0,bossPity:0,totalSold:0,totalSalvaged:0}};
 state.version=390;ensureCoreState();ensureLivingWorld();ensureExplorationState();save();render();
}
function resetCharacter(){if(!confirm('Zresetować postać i wrócić do kreatora? Usunie to lokalny postęp tej gry.'))return;try{if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch)}catch{}gpsWatch=null;stopAmbient();for(const key of Object.keys(localStorage)){if(key===SAVE_KEY||key.startsWith('time4heroes_build_')||key.startsWith('georpg_build_'))localStorage.removeItem(key)}state=null;combat=null;dungeonRun=null;battleResult=null;clearDungeonTimer();currentTab='map';destroyRealMap();render();}
function centerMapOnPlayer(){selectNav('map');setTimeout(()=>{if(realMap&&state?.player?.position?.lat){followGps=true;realMap.setView([state.player.position.lat,state.player.position.lng],18,{animate:true})}},120)}
function openQuestView(){state.ui.adventureView='quests';save();selectNav('adventureHub')}

function rareZones(){const s=daySeed();return {yellow:{x:(seeded(s+1)-.5)*420,y:(seeded(s+2)-.5)*420,r:200},red:{x:(seeded(s+3)-.5)*560,y:(seeded(s+4)-.5)*560,r:100},black:{x:(seeded(s+5)-.5)*650,y:(seeded(s+6)-.5)*650,r:50}}}
function zoneAt(x,y){const z=rareZones();if(Math.hypot(x-z.black.x,y-z.black.y)<=z.black.r)return'black';if(Math.hypot(x-z.red.x,y-z.red.y)<=z.red.r)return'red';if(Math.hypot(x-z.yellow.x,y-z.yellow.y)<=z.yellow.r)return'yellow';return'green'}
function generateWorld(){
 const seed=daySeed(),ents=[];
 for(let i=0;i<30;i++){
  const angle=seeded(seed+i*31)*Math.PI*2,r=65+seeded(seed+i*73)*450,x=Math.cos(angle)*r,y=Math.sin(angle)*r,zone=zoneAt(x,y);
  let pool=MONSTERS.filter(m=>m.zone===zone||(zone!=='green'&&m.zone==='green'));if(!pool.length)pool=MONSTERS.filter(m=>m.zone==='green');
  const template=pool[Math.floor(seeded(seed+i*97)*pool.length)];
  ents.push({id:`m${seed}_${i}`,type:'monster',template:template.id,x,y,alive:true,respawn:0,elite:seeded(seed+i*111)>.91});
 }
 const poi=[
  {id:'wolfDen',name:'Wilcza Jama',icon:'🐾',x:165,y:80},{id:'oldRuins',name:'Stare Ruiny',icon:'🏚️',x:180,y:-112},{id:'watchPoint',name:'Punkt Obserwacyjny',icon:'👁️',x:145,y:-75},{id:'goblinCamp',name:'Gobliński Obóz',icon:'⛺',x:230,y:-95},{id:'hunterTrail',name:'Ślady Myśliwego',icon:'👣',x:-150,y:130},{id:'woundedHunter',name:'Ranny Myśliwy',icon:'🧔',x:-205,y:165},{id:'hermit',name:'Chata Pustelnika',icon:'🛖',x:-255,y:-75},{id:'nightGuest',name:'Nocny Punkt Obserwacji',icon:'🌙',x:245,y:-135},{id:'northCamp',name:'Obóz Północny',icon:'🏕️',x:430,y:210},{id:'brokenBridge',name:'Zerwany Most',icon:'🌉',x:485,y:80},{id:'coldShrine',name:'Mroźne Sanktuarium',icon:'❄️',x:520,y:-100},
  ...REGION3_POIS
 ];
 return [...ents,...DUNGEONS.map(d=>({...d,type:'dungeon'})),...poi.map(p=>({...p,type:'poi'}))];
}


function questEntityById(id){return (state.world?.entities||[]).find(e=>e.id===id)}
function removeQuestEntities(qid){if(!state?.world?.entities)return;state.world.entities=state.world.entities.filter(e=>e.questId!==qid)}
function questSpawnPoint(baseX,baseY,distance=80,angle=0){return {x:baseX+Math.cos(angle)*distance,y:baseY+Math.sin(angle)*distance}}
function spawnQuestEntity(def){
 state.world.entities ||= [];const old=state.world.entities.find(e=>e.id===def.id);if(old)return old;const e={type:'quest',icon:'❗',questOnly:true,done:false,...def};state.world.entities.push(e);return e;
}
function syncQ2World(){
 if(!state.quests.active.includes('q2')){removeQuestEntities('q2');return}
 const cur=currentQuestStep('q2');if(!cur)return;
 const existing=state.world.entities.filter(e=>e.questId==='q2');
 for(const e of existing)e.done=e.questStage!==cur.index;
 if(cur.index===0&&!questEntityById('q2_sheep')){
  const p=state.player.position||{x:0,y:0},pt=questSpawnPoint(p.x||0,p.y||0,95,.45);
  spawnQuestEntity({id:'q2_sheep',questId:'q2',questStage:0,name:'Zaginiona owca',icon:'🐑',visual:'sheep',x:pt.x,y:pt.y,desc:'Owca leży przy skraju ścieżki. Nie wygląda, jakby rozszarpały ją wilki.'});
 }
 if(cur.index===1&&!questEntityById('q2_tracks')){
  const a=questEntityById('q2_sheep')||{x:state.player.position.x||0,y:state.player.position.y||0},pt=questSpawnPoint(a.x,a.y,58,-.25);
  spawnQuestEntity({id:'q2_tracks',questId:'q2',questStage:1,name:'Wilcze tropy',icon:'🐾',visual:'tracks',x:pt.x,y:pt.y,desc:'Wilcze łapy mieszają się z głębszymi śladami butów. Trop prowadzi w stronę lasu.'});
 }
 if(cur.index===2&&!questEntityById('q2_wolves')){
  const a=questEntityById('q2_tracks')||{x:state.player.position.x||0,y:state.player.position.y||0},pt=questSpawnPoint(a.x,a.y,82,.8);
  spawnQuestEntity({id:'q2_wolves',questId:'q2',questStage:2,name:'Dwa ranne wilki',icon:'🐺',visual:'woundedWolves',x:pt.x,y:pt.y,desc:'Dwa ranne wilki leżą w trawie. Ich rany wyglądają podejrzanie.'});
 }
}
function bountyWorldId(b,i){return `bounty_${b.id}_${state.adventure.day}_${i}`}
function bountySpawnPoint(i,total){const p=state.player.position||{x:0,y:0},a=(i/Math.max(1,total))*Math.PI*2+.55,r=75+(i%3)*38;return questSpawnPoint(p.x||0,p.y||0,r,a)}
function bountyMonsterTemplate(b,index){if(b?.target!=='goblin')return b?.target;const level=state.player.level||1,pool=['goblin','goblinWarrior','goblinMage','goblinChampion'].filter(id=>(MONSTERS.find(m=>m.id===id)?.min||1)<=level+3);return pool[Math.floor(seeded(state.adventure.day+index*67)*pool.length)]||'goblin'}
function spawnBountyTargets(b){
 if(!b||!b.accepted||b.claimed)return;state.world.entities ||= [];
 const present=state.world.entities.filter(e=>e.bountyId===b.id&&!e.done&&(e.type!=='monster'||e.alive)).length;
 const remaining=Math.max(0,b.need-(b.progress||0));if(present>=remaining)return;
 const need=Math.max(0,remaining-present);
 for(let i=0;i<need;i++){
  const idx=present+i,pt=bountySpawnPoint(idx,Math.max(1,remaining));
  if(b.type==='gather')state.world.entities.push({id:bountyWorldId(b,idx),type:'resource',bountyId:b.id,item:b.target,name:itemDef(b.target).name,icon:'🌿',x:pt.x,y:pt.y,done:false});
  else state.world.entities.push({id:bountyWorldId(b,idx),type:'monster',template:bountyMonsterTemplate(b,idx),variant:monsterVariantFromRoll(seeded(state.adventure.day+idx*113+41),state.player.level),bountyId:b.id,x:pt.x,y:pt.y,alive:true,respawn:Number.MAX_SAFE_INTEGER,elite:false});
 }
}
function syncQuestWorld(){
 if(!state?.world)return;state.world.entities=(state.world.entities||[]).filter(e=>e.id!=='pasture');syncQ2World();ensureAdventureState();for(const b of state.adventure.bounties||[])if(b.accepted&&!b.claimed)spawnBountyTargets(b);
}
function questEvidenceModal(title,icon,text,next){openModal(`<div class="quest-evidence-modal"><div class="quest-evidence-icon">${icon}</div><span class="eyebrow">ŚLAD QUESTOWY</span><h2>${title}</h2><p>${text}</p>${next?`<div class="evidence-next">🧭 ${next}</div>`:''}<button class="primary" data-close>Kontynuuj śledztwo</button></div>`);document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)}
function interactQuestEntity(e){
 const cur=currentQuestStep(e.questId);if(!cur||cur.index!==e.questStage)return toast('Ten trop nie jest jeszcze aktywny.');
 checkQuestProgress('questInteract',e.id);e.done=true;playSfx('discover');haptic([15,20,15]);syncQuestWorld();save();
 if(e.id==='q2_sheep'){questEvidenceModal('Zaginiona owca','🐑','Owca nie została rozszarpana. Na ziemi widać wilczą sierść, ale także ślady ciężkich butów. Kilkadziesiąt metrów dalej trop staje się wyraźniejszy.','Na mapie pojawiły się wilcze tropy.');return}
 if(e.id==='q2_tracks'){questEvidenceModal('Tropy nie pasują','🐾','Wilcze ślady są chaotyczne, jakby zwierzęta uciekały. Obok biegną dwa ludzkie tropy. W trawie widać świeżą krew.','Na mapie pojawiły się dwa ranne wilki.');return}
 if(e.id==='q2_wolves'){if(currentTab==='map')selectNav('map');queueReadyStoryScene('q2',120);return}
 toast(`Zbadano: ${e.name}`);if(currentTab==='map')selectNav('map');
}
function interactResourceEntity(e){
 if(e.done)return;const b=(state.adventure?.bounties||[]).find(x=>x.id===e.bountyId);if(!b?.accepted||b.claimed)return toast('To znalezisko nie jest już potrzebne.');
 e.done=true;addItem(e.item,1);playSfx('discover');haptic(12);syncQuestWorld();save();toast(`Zebrano: ${itemDef(e.item).name} • ${Math.min(b.need,b.progress||0)}/${b.need}`);if(currentTab==='map')selectNav('map');
}

function monsterTemplate(e){const base=MONSTERS.find(m=>m.id===e.template)||MONSTERS[0],variantId=entityMonsterVariant(e),v=monsterVariantDef(variantId);return {...base,baseName:base.name,name:variantId==='normal'?base.name:`${base.name} — ${v.label}`,variantId,variantLabel:v.label,variantIcon:v.icon,variantLoot:v.loot,variantScale:v.scale,hp:Math.max(1,Math.round(base.hp*v.hp)),atk:Math.max(1,Math.round(base.atk*v.atk)),xp:Math.max(1,Math.round(base.xp*v.xp)),gold:[Math.max(1,Math.round(base.gold[0]*v.gold)),Math.max(2,Math.round(base.gold[1]*v.gold))]}}
function monsterLevel(m){const p=state?.player?.level||1;return clamp(p+rnd(-2,2),m.min,m.max)}
function primaryCombatStat(){const p=state.player;return p.class==='mage'?p.stats.int:['hunter','ranger'].includes(p.class)?p.stats.agi:p.stats.str}
function supportGearPower(){return Object.keys(state.player.equipped||{}).filter(slot=>{const d=itemDef(equippedInstance(slot)?.id);return slot!=='weapon'&&!(slot==='offhand'&&d?.type==='weapon')}).reduce((sum,slot)=>sum+equipmentStat(slot,'power'),0)+setBonusStat('power')}
function weaponDamageRange(){const mainInst=equippedInstance('weapon'),main=itemDef(mainInst?.id),fallback=Math.max(1,main.power||1),base=main.damage||[Math.max(1,fallback-2),fallback+2],mainBonus=(mainInst?.upgrade||0)*2+instanceBonus(mainInst,'power');let min=base[0]+mainBonus,max=base[1]+mainBonus;if(state.player.class==='berserker'){const offInst=equippedInstance('offhand'),off=itemDef(offInst?.id);if(off?.type==='weapon'){const od=off.damage||[Math.max(1,(off.power||1)-2),(off.power||1)+2],offBonus=(offInst?.upgrade||0)*2+instanceBonus(offInst,'power');min+=(od[0]+offBonus)*.45;max+=(od[1]+offBonus)*.45}}const stat=primaryCombatStat()*.75+state.player.level*.55+supportGearPower();return {min:Math.max(1,Math.floor(min+stat)),max:Math.max(2,Math.ceil(max+stat))}}
function rollPlayerBaseDamage(){const r=weaponDamageRange();return rnd(r.min,r.max)}
function attackPower(){const r=weaponDamageRange();return Math.round((r.min+r.max)/2)}
function hitChance(){const p=state.player;return p.class==='mage'?100:Math.min(99,92+p.stats.agi*.32+(['hunter','ranger'].includes(p.class)?3:0))}
function armorPower(){const p=state.player;return Math.floor(p.stats.vit*.55+gearStat('armor'))}
function critChance(){const p=state.player,pet=p.petActive?petDef(p.petActive):null,classBonus=p.class==='hunter'?5:p.class==='ranger'?2:0,biomeBonus=combat?.environment?.effect?.crit||0;return Math.min(70,5+p.stats.agi*.55+gearStat('crit')+(pet?.crit||0)+classBonus+biomeBonus)}
function dodgeChance(){const p=state.player,classBonus=p.class==='ranger'?7:p.class==='hunter'?3:p.class==='mage'?1:0,biomeBonus=combat?.environment?.effect?.dodge||0,storyBonus=combat?.monster?.family==='Natura'&&storyChoiceFor('q2')==='spare'?2:0;return Math.min(42,2+p.stats.agi*.42+classBonus+(combat?.playerDodgeBuff||0)+biomeBonus+storyBonus)}
function hasShieldEquipped(){const d=itemDef(equippedInstance('offhand')?.id);return state.player.class==='knight'&&d?.slot==='offhand'&&d?.type==='gear'}
function blockChance(){const p=state.player,shield=hasShieldEquipped()?12+Math.min(12,gearStat('armor')*.35):0,classBonus=p.class==='knight'?6:0,guard=combat?.guard>0?18:0;return Math.min(60,shield+classBonus+guard+(combat?.playerBlockBuff||0))}
function classPassiveText(){return ({knight:'🛡️ Rycerz: tarcza daje pasywny blok; Obrona wzmacnia go jeszcze bardziej.',mage:'🔮 Mag: zaklęcia nigdy nie chybiają, ale wymagają zarządzania maną.',hunter:'🏹 Łowca: +5% bazowej szansy na krytyk i wsparcie chowańca.',berserker:'🪓 Berserker: im mniej HP, tym większe obrażenia; dwie bronie wzmacniają jego styl.',ranger:'🌿 Tropiciel: wysoki unik, trucizny, pułapki i kontrola przeciwnika.'})[state.player.class]||''}
function combatStatsPanelHTML(){
 const p=state.player,r=weaponDamageRange(),main=itemDef(equippedInstance('weapon')?.id),off=itemDef(equippedInstance('offhand')?.id),dual=p.class==='berserker'&&off?.type==='weapon';
 const weaponLabel=main?.name||'Brak broni',offLabel=dual?` + ${off.name}`:'';
 return `<section class="gear-combat-panel"><div class="gear-combat-head"><div><span class="eyebrow">PARAMETRY BOJOWE</span><h3>Siła w aktualnym wyposażeniu</h3><p>${weaponLabel}${offLabel}</p></div><div class="damage-range-main"><small>OBRAŻENIA BRONI</small><b>${r.min}–${r.max}</b><span>średnio ${attackPower()}</span></div></div><div class="gear-combat-grid"><div><span>⚔️ Atak</span><b>${attackPower()}</b><small>średnie obrażenia</small></div><div><span>🛡️ Pancerz</span><b>${armorPower()}</b><small>redukuje obrażenia</small></div><div><span>🎯 Trafienie</span><b>${hitChance().toFixed(0)}%</b><small>${p.class==='mage'?'magia nie chybia':'celność ataków'}</small></div><div><span>💥 Krytyk</span><b>${critChance().toFixed(0)}%</b><small>szansa na x1,65</small></div><div><span>💨 Unik</span><b>${dodgeChance().toFixed(0)}%</b><small>uniknięcie ciosu</small></div><div><span>🛡️ Blok</span><b>${blockChance().toFixed(0)}%</b><small>${hasShieldEquipped()?'tarcza aktywna':'bez tarczy'}</small></div><div><span>❤️ HP</span><b>${p.hp}/${p.maxHp}</b><small>punkty życia</small></div><div><span>🔷 Mana</span><b>${p.mana}/${p.maxMana}</b><small>zasób umiejętności</small></div></div><div class="gear-passive-line">${classPassiveText()}</div></section>`;
}
function petInstance(){return state.player.pets.find(p=>p.id===state.player.petActive)||null}
function petPower(){const p=petInstance();if(!p)return 0;return (petDef(p.id)?.power||0)+p.level*2}

function gainXp(amount){
 const p=state.player;p.xp+=amount;let levels=0;
 while(p.xp>=xpNeed(p.level)&&p.level<100){p.xp-=xpNeed(p.level);p.level++;levels++;p.statPoints+=3;p.skillPoints+=1;const c=CLASSES[p.class];p.maxHp+=Math.floor(9+c.base.vit*.6);p.hp=p.maxHp;p.maxMana+=Math.floor(3+c.base.int*.3);p.mana=p.maxMana}
 if(levels){toast(`Awans! Poziom ${p.level}. +${levels*3} pkt statystyk i +${levels} pkt umiejętności.`);playSfx('level');haptic([25,35,25])}save();
}
function gainPetXp(amount){const p=petInstance();if(!p)return;p.xp+=Math.max(1,Math.floor(amount*.2));while(p.xp>=p.level*90){p.xp-=p.level*90;p.level++;toast(`${petDef(p.id).name} awansuje na poziom ${p.level}!`)}}
function rewardQuest(q){
 removeQuestEntities(q.id);
 gainXp(q.xp);
 state.player.gold+=q.gold;
 if(!state.quests.done.includes(q.id))state.quests.done.push(q.id);
 state.quests.active=state.quests.active.filter(id=>id!==q.id);
 if(q.id==='q13'&&!countItem('blackMedallion'))addItem('blackMedallion');
 if(q.id==='q25'){addItem(state.player.class==='mage'?'mistCirclet':['hunter','ranger'].includes(state.player.class)?'mistHood':'mistHelm');addItem('wraithEssence',2)}
 if(q.id==='q30'){addItem(state.player.class==='mage'?'mistRobe':['hunter','ranger'].includes(state.player.class)?'mistLeathers':'mistMail');addItem('bogAmber',2)}
 if(q.id==='q35'){addItem(state.player.class==='mage'?'mistStaff':['hunter','ranger'].includes(state.player.class)?'mistBow':'mistBlade');addItem('mireCharm');if(['hunter','ranger'].includes(state.player.class)&&!state.player.pets.some(p=>p.id==='mireLynx')){state.player.pets.push({id:'mireLynx',level:1,xp:0});toast('Nowy chowaniec: Ryś Mgieł!')}if(state.story?.flags?.endingDestroy)state.adventure.reputation+=2;if(state.story?.flags?.endingSeal)state.adventure.reputation+=4}
 if(q.id==='q38'){addItem(state.player.class==='mage'?'ashCowl':['hunter','ranger'].includes(state.player.class)?'ashHood':'ashHelm');addItem('charredIron',2)}
 if(q.id==='q45'){addItem(state.player.class==='mage'?'ashStaff':['hunter','ranger'].includes(state.player.class)?'ashBow':'ashBlade');addItem('cinderCharm');if(['hunter','ranger'].includes(state.player.class)&&!state.player.pets.some(p=>p.id==='cinderHound')){state.player.pets.push({id:'cinderHound',level:1,xp:0});toast('Nowy chowaniec: Ogar Popiołu!')}}
 if(q.id==='q48'){addItem(state.player.class==='mage'?'stormCowl':['hunter','ranger'].includes(state.player.class)?'stormHood':'stormHelm');addItem('frostCrystal',2)}
 if(q.id==='q55'){addItem(state.player.class==='mage'?'stormStaff':['hunter','ranger'].includes(state.player.class)?'stormBow':'stormSpear');addItem('tempestCharm');if(['hunter','ranger'].includes(state.player.class)&&!state.player.pets.some(p=>p.id==='stormHawk')){state.player.pets.push({id:'stormHawk',level:1,xp:0});toast('Nowy chowaniec: Jastrząb Burzy!')}}
 const next=ensureStoryQuestContinuity(false);
 syncQuestWorld();save();
 if(next){
   const chapterChanged=next.chapter!==q.chapter;
   toast(`✅ ${q.name} ukończone • +${q.xp} XP • +${q.gold} 🪙 • ${chapterChanged?`Nowy rozdział: ${next.chapter} — `:''}Następny etap: ${next.name}`);
 }else{
   const pending=firstPendingStoryQuest();
   if(pending&&pending.level>state.player.level+1)toast(`✅ ${q.name} ukończone • +${q.xp} XP • +${q.gold} 🪙 • następny etap od lvl ${pending.level}`);
   else toast(`✅ ${q.name} ukończone • +${q.xp} XP • +${q.gold} 🪙`);
 }
}

function checkQuestProgress(type,target,amount=1){
 progressBounties(type,target,amount);
 for(const qid of [...state.quests.active]){
  const q=QUESTS.find(x=>x.id===qid);if(!q)continue;
  const prog=state.quests.progress[qid] ||= q.steps.map(()=>0),i=currentQuestStepIndex(qid);if(i<0)continue;
  const s=q.steps[i];if(s.type!==type)continue;
  if(type==='kill'&&monsterTargetMatches(s.target,target))prog[i]=Math.min(s.count||1,(prog[i]||0)+amount);
  else if(type==='move')prog[i]=Math.max(prog[i]||0,amount);
  else if(type==='story'&&s.target===target)prog[i]=1;
  else if(s.target===target)prog[i]=Math.min(s.count||1,(prog[i]||0)+amount);
  if(q.steps.every((step,idx)=>(prog[idx]||0)>=(step.count||1)))rewardQuest(q);
 }
 syncQuestWorld();save();
}

function render(){if(!state){renderCreate();return}if(battleResult){showBattleVictory(battleResult);return}if(combat){openCombat();return}if(dungeonRun){renderShell();openDungeonCrawler();return}ensureCoreState();ensureStoryQuestContinuity(false);syncQuestWorld();if(!state.tutorial?.introSeen){renderPrologueScreen();return}renderShell()}
function renderPrologueScreen(){
 destroyRealMap();
 const p=state.player,c=CLASSES[p.class];
 app.innerHTML=`<div class="onboarding-screen"><div class="onboarding-card"><div class="onboarding-hero">${classVisual(p.class,'sprite-hero')}</div><div class="prologue-mark">ROZDZIAŁ I</div><h1>Cienie nad Doliną</h1><p>Budzi Cię bicie dzwonu z małej wioski. Na drogach pojawiają się potwory, ludzie znikają, a stare znaki wracają na kamienie, na których nie powinno ich być.</p><div class="prologue-grid"><div><b>🗺️ Odkrywaj</b><small>Mapa pojawi się dopiero po rozpoczęciu przygody.</small></div><div><b>⚔️ Walcz</b><small>Rozwijaj ${c.name.toLowerCase()}, sprzęt i własny styl walki.</small></div><div><b>📜 Decyduj</b><small>Śledztwa i wybory zmieniają historię.</small></div></div><div class="test-note"><b>🧪 Testowanie bez GPS</b><span>W Menu możesz otworzyć osobną kopię do testów i poruszać się strzałkami. Główna przygoda korzysta z GPS.</span></div><button class="primary large" data-prologue-start>Wyrusz z wioski</button></div></div>`;
 document.querySelector('[data-prologue-start]')?.addEventListener('click',()=>{state.tutorial.introSeen=true;save();renderShell();toast('Pierwszy cel: oddal się 60 m od wioski. Włącz GPS lub otwórz kopię testową w Menu.')});
}



function renderCreate(){
 let selected='knight';
 app.innerHTML=`<div class="boot mobile-boot"><section class="mobile-brand"><div class="brand-badge">BUILD 3.0.7 • BIOME ZONES</div><h1 class="time4-logo"><span>TIME</span><strong>4</strong><span>HEROES</span></h1><p>Świat jest bliżej niż myślisz.</p><div class="hero-lineup">${classVisual('hunter','lineup side')}${classVisual('knight','lineup main')}${classVisual('mage','lineup side')}</div><div class="mobile-ready">📱 GPS RPG • osobna przygoda testowa bez GPS</div><button class="secondary install-cta" data-install-create>📲 Zainstaluj Time4Heroes</button></section><div class="card create create-mobile"><h2>Stwórz bohatera</h2><div class="form-row"><label>Imię</label><input id="heroName" maxlength="18" value="Krzysztof" autocomplete="off"></div><div class="class-grid">${Object.entries(CLASSES).map(([id,c])=>`<button class="class-btn ${id===selected?'active':''}" data-class="${id}"><span class="class-icon">${classVisual(id,'sprite-class-btn')}</span><b>${c.name}</b><div class="tiny">${c.desc}</div></button>`).join('')}</div><div id="classDesc" class="panel-item hero-preview" style="margin:12px 0"></div><button id="startGame" class="primary large">Rozpocznij przygodę</button></div></div>`;
 const desc=()=>{const c=CLASSES[selected];const target=document.querySelector('#classDesc');if(target)target.innerHTML=`<div class="preview-avatar">${classVisual(selected,'sprite-preview')}</div><div><b>${c.name}</b><div class="muted">STR ${c.base.str} • AGI ${c.base.agi} • INT ${c.base.int} • VIT ${c.base.vit}</div><div>${c.desc}</div>${['hunter','ranger'].includes(selected)?'<div class="gold">🐺 Startujesz z chowańcem: Młody Wilk.</div>':''}</div>`};
 desc();
 document.querySelectorAll('[data-class]').forEach(b=>b.onclick=()=>{selected=b.dataset.class;document.querySelectorAll('[data-class]').forEach(x=>x.classList.toggle('active',x===b));desc()});
 document.querySelector('#startGame')?.addEventListener('click',()=>newGame(document.querySelector('#heroName')?.value.trim(),selected));
 document.querySelector('[data-install-create]')?.addEventListener('click',installPwa);
}

function showPrologue(){if(!state||state.tutorial?.introSeen)return;renderPrologueScreen()}
const GRAPHICS={
 classes:{knight:'assets/knight.png',mage:'assets/mage.png',hunter:'assets/hunter.png',berserker:'assets/berserker.png',ranger:'assets/ranger.png'},
 monsters:{
  'wolf':'assets/monsters/wilk.png',
  'goblin':'assets/goblin.png',
  'skeleton':'assets/monsters/szkielet.png',
  'spider':'assets/monsters/pajak.png',
  'elemental':'assets/monsters/kamienny-golem.png',
  'ghost':'assets/monsters/zjawa.png',
  'cultist':'assets/monsters/kultysta.png',
  'demon':'assets/monsters/rogaty-czart.png',
  'hellhound':'assets/monsters/piekielny-ogar.png',
  'wyvern':'assets/wyvern.png',
  'marshHag':'assets/monsters/wiedzma.png',
  'blackrootGuardian':'assets/monsters/korzeniec.png',
  'mireMother':'assets/mireMother.png',
  'cinderMatriarch':'assets/monsters/sukkub.png',
  'tempestLord':'assets/tempestLord.png',
  'shade':'assets/monsters/cien.png',
  'mireCrawler':'assets/monsters/larwa-bagienna.png',
  'bogWraith':'assets/monsters/topielec.png',
  'rotCultist':'assets/monsters/kultysta.png',
  'mossGolem':'assets/monsters/korzeniec.png',
  'fireWasp':'assets/monsters/roj-szerszeni.png',
  'cinderCultist':'assets/monsters/kultysta.png',
  'emberWraith':'assets/monsters/mara.png',
  'slagGolem':'assets/monsters/zywiolak-lawy.png',
  'pyreKnight':'assets/monsters/nawiedzony-rycerz.png',
  'frostRaptor':'assets/monsters/jaszczur-skalny.png',
  'stormCultist':'assets/monsters/kultysta.png',
  'iceWraith':'assets/monsters/zjawa.png',
  'thunderGolem':'assets/monsters/piorunnik.png',
  'mountainTroll':'assets/monsters/troll.png',
  'frozenKnight':'assets/monsters/nawiedzony-rycerz.png',
 },
 npcs:{
  Dorian:'assets/npc-dorian.png',Selma:'assets/npcs/npc-selma-cutout-380.webp',Ragor:'assets/npcs/npc-ragor-cutout-380.webp',
  Ilyra:'assets/npcs/npc-ilyra-cutout-380.webp',Varo:'assets/npcs/npc-varo-cutout-380.webp',Edrin:'assets/npcs/npc-edrin-cutout-380.webp'
 },
 pets:{youngWolf:'assets/wolf.png',cinderHound:'assets/hellhound.png'}
};
const CORE_MONSTER_ATLAS={slime:[0,0],rat:[1,0],beetle:[2,0],wolf:[3,0],goblin:[0,1],goblinWarrior:[0,1],goblinMage:[0,1],goblinChampion:[0,1],skeleton:[1,1],spider:[2,1],elemental:[3,1],ghost:[0,2],cultist:[1,2],demon:[2,2],hellhound:[3,2]};
const GOBLIN_VISUALS={goblin:{cls:'goblin-scout',badge:'🗡️'},goblinWarrior:{cls:'goblin-warrior',badge:'🛡️'},goblinMage:{cls:'goblin-mage',badge:'✦'},goblinChampion:{cls:'goblin-champion',badge:'♛'}};
const NEW_MONSTER_ATLAS={thornBoar:[0,0],caveBat:[1,0],graveMoth:[2,0],boneArcher:[3,0],mistStag:[0,1],plagueToad:[1,1],magmaScorpion:[2,1],voidHound:[3,1],obsidianSentinel:[0,2],stormGriffin:[1,2],lichWarden:[2,2],abyssHydra:[3,2]};
const ARCHIVE_MONSTER_ATLAS_IDS=[
 ['bazyliszek','bies','blednyOgnik','chochlik','cmaUpiorna','czapla','diabel','dziewanna','dzik','ghul','gryf','grzybiarz','harpia','jednorozec','kieszonkowiec','klusownik'],
 ['komarzyca','kosciej','kozica','krocionog','kruk','latawiec','leszy','lis','lodowyGolem','mangradora','mlodyKraken','mumia','najemnik','niedzwiedz','ork','placzacaPanna'],
 ['placzacaWierzba','plomyk','poltergeist','poludnica','ropucha','rozbojnik','rusalka','rys','skorpion','sokol','strachNaWroble','sumOlbrzymi','szaleniec','trupojad','trzcinnik','widmowyJezdziec'],
 ['wilkolak','wir','wisielec','wodnik','wydra','zbik','zbir','zdziczalyPies','zmora','zniwiarzPol','zombie','zywiolakCienia','zywiolakSwiatla']
];
const ARCHIVE_MONSTER_ATLAS=Object.fromEntries(ARCHIVE_MONSTER_ATLAS_IDS.flatMap((ids,sheet)=>ids.map((id,index)=>[id,{sheet:sheet+1,pos:[index%4,Math.floor(index/4)]}])));
function sprite(path,alt,cls){return `<img src="${path}" alt="${alt}" class="pixel-sprite ${cls||''}">`}
function classVisual(id,cls='sprite-inline'){const c=CLASSES[id];const path=GRAPHICS.classes[id];return path?sprite(path,c?.name||id,cls):(c?.icon||'❓')}
function monsterVisual(id,cls='sprite-inline',variant=null){variant ||= combat?.monster?.id===id?combat.monster.variantId:'normal';const m=MONSTERS.find(x=>x.id===id),core=CORE_MONSTER_ATLAS[id],fresh=NEW_MONSTER_ATLAS[id],archive=ARCHIVE_MONSTER_ATLAS[id],goblin=GOBLIN_VISUALS[id],v=monsterVariantDef(variant),variantCls=`monster-version variant-${v.id}`;if(core||fresh||archive){const path=core?'assets/atlases/monster-atlas-core-320.png':fresh?'assets/atlases/monster-atlas-new-320.png':`assets/atlases/archive-monsters-${archive.sheet}-330.png`,pos=core||fresh||archive.pos,rows=archive?4:3,spriteHtml=`<span class="pixel-sprite atlas-sprite monster-atlas-sprite ${goblin?.cls||''} ${goblin?'goblin-atlas-fill':cls} ${variantCls}" role="img" aria-label="${m?.name||id} — ${v.label}" style="${atlasStyle(path,pos,4,rows)};--monster-version-scale:${v.scale}"></span>`;return goblin?`<span class="goblin-role-wrap ${goblin.cls} ${cls} variant-wrap-${v.id}" data-role="${goblin.badge}">${spriteHtml}</span>`:spriteHtml}const path=GRAPHICS.monsters[id];return path?sprite(path,`${m?.name||id} — ${v.label}`,`${cls} ${variantCls}`):(m?.icon||'❓')}
function npcVisual(name,classId,cls='sprite-npc'){const path=GRAPHICS.npcs[name];return path?sprite(path,name,cls):classVisual(classId,cls)}
function petVisual(id,cls='sprite-inline'){const p=PETS[id];const path=GRAPHICS.pets[id]||GRAPHICS.monsters[id];return path?sprite(path,p?.name||id,cls):(p?.icon||'❓')}

function battleTheme(m){
  if(!m) return 'forest';
  if(['Nieumarli','Zjawy'].includes(m.family)) return 'crypt';
  if(['Demony'].includes(m.family)) return 'inferno';
  if(['Żywiołaki'].includes(m.family)) return 'ember';
  if(['Bestie'].includes(m.family)) return 'storm';
  return 'forest';
}
const BATTLE_BACKDROPS={
 meadow:'assets/backgrounds/battle-meadow-380.webp',
 forest:'assets/backgrounds/battle-forest-380.webp',
 ruins:'assets/backgrounds/battle-ruins-380.webp',
 marsh:'assets/backgrounds/battle-marsh-380.webp',
 highlands:'assets/backgrounds/battle-highlands-380.webp'
};
function battleBackdrop(c){
 const biome=c?.dungeon?'ruins':c?.environment?.biomeId||'forest';
 return BATTLE_BACKDROPS[biome]||BATTLE_BACKDROPS.forest;
}
function battleAtmosphereClass(c){
 const cl=c?.environment?.climate||climate(),classes=[];
 if(cl.phase==='Noc')classes.push('phase-night');
 if(cl.weather==='Deszcz')classes.push('weather-rain');
 else if(cl.weather==='Burza')classes.push('weather-storm');
 else if(cl.weather==='Mgła')classes.push('weather-fog');
 return classes.join(' ');
}
function npcCard(name, role, classId, text){
  return `<div class="npc-card"><div class="npc-portrait">${npcVisual(name,classId,'sprite-npc')}</div><div><b>${name}</b><div class="muted">${role}</div><p>${text}</p></div></div>`;
}


function topbar(){
 const p=state.player,c=CLASSES[p.class],need=xpNeed(p.level),cl=climate(),pet=petInstance();
 const region=biomeInfoAtPlayer().name;
 const now=new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
 return `<header class="topbar topbar-fantasy topbar-compact"><div class="brand-side"><div class="identity"><div class="mini-avatar">${classVisual(p.class,'sprite-mini')}</div><div><b>${p.name}</b><div class="tiny">${c.name} • poziom ${p.level} <span class="build-chip">${SAVE_KEY===DEMO_SAVE_KEY?'TEST • osobny zapis':BUILD_VERSION}</span></div></div></div><div class="bars"><div><div class="barwrap"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div><div class="barwrap"><div class="bar xp" style="width:${100*p.xp/need}%"></div><div class="barlabel">XP ${p.xp}/${need}</div></div><div class="tiny">ATK ${attackPower()} • Pancerz ${armorPower()} • Kryt ${critChance().toFixed(0)}%${pet?` • 🐾 lvl ${pet.level}`:''}</div></div></div></div><div class="hud-right"><div class="resource resource-fantasy"><span>🪙 <strong>${p.gold}</strong></span><span>💎 <strong>${countItem('crystal')}</strong></span><span>⚡ <strong>${p.stamina??100}/${p.maxStamina??100}</strong></span>${['hunter','ranger'].includes(p.class)?`<span>➶ <strong>${countItem('primitiveArrow')}</strong></span>`:''}</div><div class="world-meta"><span>${region}</span><span>${cl.icon} ${cl.weather}</span><span>🕒 ${now}</span></div></div></header>`;
}

function bottomNav(){const tabs=[['map','🗺️','Mapa','nav'],['hero','🧙','Bohater','nav'],['town','🏰','Miasto','nav'],['quests','📜','Zadania','shortcut'],['menu','☰','Menu','nav']];return `<nav class="bottom core-nav">${tabs.map(([id,ico,name,type])=>type==='shortcut'?`<button class="navbtn ${currentTab==='adventureHub'&&state.ui.adventureView==='quests'?'active':''}" data-shortcut="${id}"><span>${ico}</span>${name}</button>`:`<button class="navbtn ${id===currentTab?'active':''}" data-nav="${id}"><span>${ico}</span>${name}</button>`).join('')}</nav>`}

function activeTaskCount(){ensureAdventureState();return state.quests.active.length+(state.adventure.bounties||[]).filter(b=>b.accepted&&!b.claimed).length}
function canAcceptTask(){return activeTaskCount()<4}
function activeMainStoryQuest(){return state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).find(Boolean)||null}
function storyQuestAfter(qid){const i=QUESTS.findIndex(q=>q.id===qid);return i>=0&&i<QUESTS.length-1?QUESTS[i+1]:null}
function firstPendingStoryQuest(){for(let i=0;i<QUESTS.length;i++){const q=QUESTS[i];if(state.quests.done.includes(q.id)||state.quests.active.includes(q.id))continue;const prev=i>0?QUESTS[i-1]:null;if(prev&&!state.quests.done.includes(prev.id))continue;return q}return null}
function ensureStoryQuestContinuity(announce=false){
 if(!state?.quests)return null;
 const active=activeMainStoryQuest();if(active)return active;
 const next=firstPendingStoryQuest();if(!next||next.level>state.player.level+1)return null;
 state.quests.active.push(next.id);state.quests.progress[next.id] ||= next.steps.map(()=>0);syncQuestWorld();save();
 if(announce)toast(`📜 Główny wątek trwa dalej: ${next.name} • nowy cel pojawił się na mapie`);
 return next;
}

function nextStoryQuestAvailable(){
 for(let i=0;i<QUESTS.length;i++){
  const q=QUESTS[i];if(state.quests.done.includes(q.id)||state.quests.active.includes(q.id))continue;
  const prev=i>0?QUESTS[i-1]:null;if(prev&&!state.quests.done.includes(prev.id))continue;
  if(q.level<=state.player.level+1)return q;
 }
 return null;
}
function acceptStoryQuest(qid){const q=QUESTS.find(x=>x.id===qid);if(!q||state.quests.done.includes(qid)||state.quests.active.includes(qid))return;if(!canAcceptTask())return toast('Możesz mieć maksymalnie 4 aktywne questy. Samouczek nie liczy się do limitu.');state.quests.active.push(qid);state.quests.progress[qid] ||= q.steps.map(()=>0);syncQuestWorld();save();toast(`Przyjęto: ${q.name} • cel pojawił się na mapie`);closeModal();state.ui.adventureView='quests';currentTab='adventureHub';selectNav('adventureHub')}
function acceptBounty(id){ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||b.claimed||b.accepted)return;if(!canAcceptTask())return toast('Możesz mieć maksymalnie 4 aktywne questy. Samouczek nie liczy się do limitu.');b.accepted=true;b.progress=0;spawnBountyTargets(b);save();toast(`Przyjęto zlecenie: ${b.name} • cele pojawiły się na mapie`);openBuilding('tavern','board')}
function tavernAnecdote(){const known=Object.keys(state.player.bestiary||{}).filter(id=>state.player.bestiary[id]>0);const id=known.length?pick(known):pick(['wolf','goblin','skeleton','spider','ghost']);const m=MONSTERS.find(x=>x.id===id)||MONSTERS[0];const lines={wolf:'„Wilk nigdy nie patrzy tylko na ciebie. Zawsze patrzy też, którędy będziesz uciekał.”',goblin:'„Goblin z nożem to problem. Goblin, którego nie widzisz, to większy problem.”',skeleton:'„Kości nie mają płuc. Nie próbuj ich zmęczyć — rozbij je.”',spider:'„Pająk przegrał ze mną raz. Drugi siedział na suficie. Dlatego patrzę też w górę.”',ghost:'„Na zjawy stal działa gorzej niż odwaga. A jeszcze lepiej działa arkanum.”'};return `${m.icon} ${m.name}: ${lines[id]||'„Każdy potwór ma nawyk. Przeżyjesz, jeśli zauważysz go przed pierwszym ciosem.”'}`}
function buyTavernStamina(amount,cost,label){const p=state.player;p.maxStamina ??=100;p.stamina ??=p.maxStamina;if(p.stamina>=p.maxStamina)return toast('Masz pełną staminę.');if(p.gold<cost)return toast(`Potrzebujesz ${cost} 🪙.`);p.gold-=cost;p.stamina=Math.min(p.maxStamina,p.stamina+amount);save();openBuilding('tavern','keeper');toast(`${label}: +${amount} staminy • -${cost} 🪙`)}
function restByFire(){const cost=Math.min(70,15+state.player.level*3);if(state.player.gold<cost)return toast(`Odpoczynek przy kominku kosztuje ${cost} 🪙.`);state.player.gold-=cost;state.player.hp=state.player.maxHp;state.player.mana=state.player.maxMana;state.player.maxStamina ??=100;state.player.stamina=Math.min(state.player.maxStamina,(state.player.stamina??state.player.maxStamina)+25);save();openBuilding('tavern','fireplace');toast(`Odpocząłeś przy kominku • pełne HP i mana • +25 staminy • -${cost} 🪙`)}
function shellSidebar(){
 const items=[
  {id:'map',label:'Mapa',icon:'🗺️',type:'nav'},
  {id:'hero',label:'Bohater',icon:'🧙',type:'nav'},
  {id:'town',label:'Miasto',icon:'🏰',type:'nav'},
  {id:'quests',label:'Zadania',icon:'📜',type:'shortcut'},
  {id:'menu',label:'Menu',icon:'☰',type:'nav'}
 ];
 return `<aside class="left-rail fantasy-rail">${items.map(it=>{const active=(it.id==='map'&&currentTab==='map')||(it.id==='hero'&&currentTab==='hero')||(it.id==='town'&&currentTab==='town')||(it.id==='quests'&&currentTab==='adventureHub'&&state.ui.adventureView==='quests')||(it.id==='menu'&&currentTab==='menu');return `<button class="rail-btn ${active?'active':''}" ${it.type==='nav'?`data-nav="${it.id}"`:`data-shortcut="${it.id}"`}><span>${it.icon}</span><small>${it.label}</small></button>`}).join('')}</aside>`;
}
function bindShellControls(root=document){
 root.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>selectNav(b.dataset.nav));
 root.querySelectorAll('[data-shortcut]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.shortcut;
  if(id==='bag'){state.ui.heroView='gear';save();selectNav('hero');return;}
  if(id==='bestiary'){state.ui.adventureView='bestiary';save();selectNav('adventureHub');return;}
  if(id==='skills'){state.ui.heroView='skills';save();selectNav('hero');return;}
  if(id==='quests'){state.ui.adventureView='quests';save();selectNav('adventureHub');return;}
 });
}

function renderShell(){destroyRealMap();app.innerHTML=`<div class="shell shell-21">${connectionBanner()}${topbar()}<div class="shell-body"><div class="content-zone"><div class="main"><main class="viewport" id="viewport"></main><aside class="side" id="side"></aside></div></div></div><button class="quest-float" data-quest-float title="Questy">📜<span>${activeTaskCount()||''}</span></button>${bottomNav()}</div>`;bindShellControls(document);document.querySelector('[data-quest-float]')?.addEventListener('click',openQuestView);selectNav(currentTab,false)}
function selectNav(id,rebuild=true){if(id!=='map')destroyRealMap();currentTab=id;document.body.classList.toggle('map-view-active',id==='map');document.body.classList.toggle('scroll-view-active',id!=='map');if(rebuild)document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id));const el=document.querySelector('#viewport'),side=document.querySelector('#side'),main=document.querySelector('.main');if(!el||!side)return;main?.classList.toggle('map-main-only',id==='map');side.style.display='none';({map:renderMap,hero:renderHeroHub,adventureHub:renderAdventureHub,town:renderTown,menu:renderMenuHub}[id]||renderMap)(el);bindTutorialControls(document);bindShellControls(document)}
function refresh(){render()}
function renderHeroHub(el){
 ensureCoreState();
 if(state.ui.heroView==='char')state.ui.heroView='stats';
 if(state.ui.heroView==='inv'||state.ui.heroView==='bag')state.ui.heroView='gear';
 if(!['stats','gear','skills'].includes(state.ui.heroView))state.ui.heroView='stats';
 el.innerHTML=`<div class="hub-tabs hero-hub-tabs"><button class="secondary ${state.ui.heroView==='stats'?'active':''}" data-hero-view="stats">🧙 Postać</button><button class="secondary ${state.ui.heroView==='gear'?'active':''}" data-hero-view="gear">🎒 Ekwipunek + plecak</button><button class="secondary ${state.ui.heroView==='skills'?'active':''}" data-hero-view="skills">🌳 Umiejętności</button></div><div id="hubContent"></div>`;
 const body=el.querySelector('#hubContent');
 if(state.ui.heroView==='gear'){tutorialEvent('inventory');renderInventory(body)}
 else if(state.ui.heroView==='skills')renderSkillsTree(body);
 else renderHeroStats(body);
 el.querySelectorAll('[data-hero-view]').forEach(b=>b.onclick=()=>{state.ui.heroView=b.dataset.heroView;save();renderHeroHub(el)});
}
function renderHeroStats(el){
 const p=state.player,c=CLASSES[p.class],pet=petInstance();
 el.innerHTML=`<div class="hero-stats-page"><section class="hero-stat-card hero-profile-card"><div class="hero-profile-art">${classVisual(p.class,'sprite-hero')}</div><div><span class="eyebrow">POSTAĆ</span><h2>${p.name}</h2><p>${c.name} • poziom ${p.level}</p><div class="hero-vitals"><span>❤️ ${p.hp}/${p.maxHp}</span><span>🔷 ${p.mana}/${p.maxMana}</span><span>⚡ ${p.stamina??100}/${p.maxStamina??100}</span></div></div></section><section class="hero-stat-card"><div class="section-title"><div><span class="eyebrow">STATYSTYKI</span><h3>Cechy bohatera</h3></div><span class="pill">${p.statPoints||0} pkt</span></div><div class="hero-base-stats">${Object.entries(p.stats).map(([k,v])=>`<div class="hero-base-stat"><span>${({str:'Siła',agi:'Zręczność',int:'Inteligencja',vit:'Witalność'})[k]||k.toUpperCase()}</span><b>${v}</b>${p.statPoints?`<button class="secondary mini" data-stat="${k}">+1</button>`:''}</div>`).join('')}</div></section><section class="hero-stat-card"><span class="eyebrow">PARAMETRY BOJOWE</span><div class="hero-derived-stats"><div><b>${attackPower()}</b><span>Atak</span></div><div><b>${armorPower()}</b><span>Pancerz</span></div><div><b>${critChance().toFixed(0)}%</b><span>Krytyk</span></div><div><b>${dodgeChance().toFixed(0)}%</b><span>Unik</span></div><div><b>${blockChance().toFixed(0)}%</b><span>Blok</span></div><div><b>${p.skillPoints}</b><span>Pkt umiejętności</span></div><div><b>${inventoryUsedSlots()}/${inventoryCapacity()}</b><span>Plecak</span></div><div><b>${pet?pet.level:'—'}</b><span>Chowaniec</span></div></div></section>${pet?`<section class="hero-stat-card"><span class="eyebrow">CHOWANIEC</span><div class="hero-pet-summary"><span class="pet-portrait">${petDef(pet.id).icon}</span><div><b>${petDef(pet.id).name}</b><small>Poziom ${pet.level}</small></div></div></section>`:''}</div>`;
 el.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{if(p.statPoints<=0)return;p.stats[b.dataset.stat]++;p.statPoints--;if(b.dataset.stat==='vit'){p.maxHp+=5;p.hp+=5}if(b.dataset.stat==='int'){p.maxMana+=4;p.mana+=4}save();renderHeroStats(el)});
}
function renderSkillsTree(el){
 const p=state.player,c=CLASSES[p.class],branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 el.innerHTML=`<div class="section-title"><div><h2>🌳 Umiejętności</h2><div class="muted">${c.name} • rozwijaj wybraną ścieżkę bohatera.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="class-passive-card"><b>Pasyw klasy</b><span>${classPassiveText()}</span></div><div class="skill-branches standalone-skills">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div>`;
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
}
function renderAdventureHub(el){
 ensureCoreState();
 const canTrips=true,canBest=state.player.kills>0;
 state.ui.adventureView ||= 'quests';
 const tabs=[
  ['quests','📜','Zadania',true],['events','✨','Wydarzenia',true],['trips','🕳️','Lochy',canTrips],['bestiary','📖','Bestiariusz',canBest]
 ];
 el.innerHTML=`<div class="adventure-shell"><div class="adventure-head"><div><span class="eyebrow">DZIENNIK BOHATERA</span><h2>Przygoda</h2><p>Zadania, wydarzenia, wyprawy i wiedza o potworach w jednym miejscu.</p></div><div class="adventure-summary"><span>📜 ${activeTaskCount()}/4</span><span>🕳️ ${state.player.dungeons.length}</span><span>👹 ${Object.keys(state.player.bestiary||{}).length}</span><span>🏅 ${state.adventure.reputation||0}</span></div></div><div class="hub-tabs adventure-tabs">${tabs.map(([id,ico,label,ok])=>`<button class="secondary ${state.ui.adventureView===id?'active':''}" data-adventure-view="${id}" ${ok?'':'disabled'}>${ico} ${label}${ok?'':' 🔒'}</button>`).join('')}</div><div id="hubContent" class="adventure-content"></div></div>`;
 const body=el.querySelector('#hubContent');
 if(state.ui.adventureView==='events')renderEvents(body);
 else if(state.ui.adventureView==='trips'&&canTrips)renderAdventure(body);
 else if(state.ui.adventureView==='bestiary'&&canBest)renderBestiary(body);
 else{state.ui.adventureView='quests';renderQuests(body)}
 el.querySelectorAll('[data-adventure-view]').forEach(b=>b.onclick=()=>{if(b.disabled)return;state.ui.adventureView=b.dataset.adventureView;save();renderAdventureHub(el)})
}
function renderMenuHub(el){renderMore(el)}

function worldToLatLng(x,y){
 const o=state.world.gpsOrigin;if(!o)return null;
 return [o.lat+y/111320,o.lng+x/(111320*Math.cos(o.lat*Math.PI/180))];
}
function addExploredPoint(lat,lng,accuracy=0){
 if(!Number.isFinite(lat)||!Number.isFinite(lng))return false;
 if(accuracy&&accuracy>120)return false;
 state.world.explored ||= [];
 const last=state.world.explored[state.world.explored.length-1];
 if(last&&geoDistance({lat:last[0],lng:last[1]},{lat,lng})<22)return false;
 state.world.explored.push([Number(lat.toFixed(6)),Number(lng.toFixed(6))]);
 if(state.world.explored.length>900)state.world.explored=state.world.explored.filter((_,i)=>i%2===0).slice(-700);
 return true;
}
function circleRing(lat,lng,radius=90,segments=24){
 const out=[],latScale=111320,lngScale=111320*Math.cos(lat*Math.PI/180);
 for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2;out.push([lat+Math.sin(a)*radius/latScale,lng+Math.cos(a)*radius/lngScale])}
 return out;
}
function destroyRealMap(){
 if(realMap){try{realMap.remove()}catch{}realMap=null}
 clearTimeout(playerWalkStopTimer);playerWalkStopTimer=null;playerMotion.moving=false;
 fogLayer=null;trailLayer=null;playerMapMarker=null;accuracyCircle=null;interactionCircle=null;questGuideLayer=null;leafletEntityLayers=[];leafletZoneLayers=[];leafletBiomeLayers=[];leafletDecorLayers=[];
}
function makeLeafletIcon(html,cls='game-map-icon',size=[48,48]){
 return L.divIcon({html,className:`${cls}-wrap`,iconSize:size,iconAnchor:[size[0]/2,size[1]/2],popupAnchor:[0,-size[1]/2]});
}

function rebuildFog(){
 if(fogLayer&&realMap){try{realMap.removeLayer(fogLayer)}catch{}fogLayer=null}
}
function rebuildTrail(){
 if(!realMap||!window.L)return;if(trailLayer){realMap.removeLayer(trailLayer);trailLayer=null}if(!state.settings.mapFilters.trail)return;const pts=(state.world.explored||[]).slice(-120);if(pts.length<2)return;trailLayer=L.polyline(pts,{pane:'overlayPane',color:'#d2ad58',weight:3,opacity:.5,dashArray:'2 8',interactive:false}).addTo(realMap);
}

function rebuildBiomeLayers(){
 if(!realMap||!state.world.gpsOrigin)return;
 leafletBiomeLayers.forEach(x=>{try{realMap.removeLayer(x)}catch{}});leafletBiomeLayers=[];
 if(!state.settings.mapFilters.biome)return;
 const size=BIOME_CELL_SIZE,px=state.player.position.x||0,py=state.player.position.y||0,cx=Math.floor(px/size),cy=Math.floor(py/size);
 const minX=cx-5,maxX=cx+5,minY=cy-5,maxY=cy+5;
 const idAt=(gx,gy)=>biomeAt(gx*size+size/2,gy*size+size/2);
 const edgeColor='#f2e0a9';
 const boundary=(p1,p2)=>{
  if(!p1||!p2)return;
  leafletBiomeLayers.push(L.polyline([p1,p2],{pane:'biomeBorderPane',color:'#17100a',weight:6,opacity:.70,interactive:false}).addTo(realMap));
  leafletBiomeLayers.push(L.polyline([p1,p2],{pane:'biomeBorderPane',color:edgeColor,weight:2.8,opacity:.96,interactive:false}).addTo(realMap));
 };
 for(let gx=minX;gx<=maxX;gx++)for(let gy=minY;gy<=maxY;gy++){
  const x1=gx*size,y1=gy*size,x2=x1+size,y2=y1+size,id=idAt(gx,gy),bio=BIOMES[id];
  const a=worldToLatLng(x1,y1),b=worldToLatLng(x2,y2);if(!a||!b)continue;
  leafletBiomeLayers.push(L.rectangle([a,b],{pane:'biomePane',stroke:false,fillColor:bio.color,fillOpacity:bio.fill??.32,interactive:false}).addTo(realMap));
  if(idAt(gx+1,gy)!==id)boundary(worldToLatLng(x2,y1),worldToLatLng(x2,y2));
  if(idAt(gx,gy+1)!==id)boundary(worldToLatLng(x1,y2),worldToLatLng(x2,y2));
 }
}

function biomeLegendHTML(){
 if(!state.settings.mapFilters.biome||state.ui.biomeInfoOpen)return '';
 return `<div class="biome-map-key" aria-label="Legenda biomów">${Object.entries(BIOMES).map(([id,b])=>`<span class="${biomeInfoAtPlayer().id===id?'current':''}"><i style="--biome:${b.color}"></i>${b.name}</span>`).join('')}</div>`;
}

function rpgDecorIcon(kind,variant=0,scale=1){
 const map={
  tree:['🌲','🌳','🌲','🌿'],rock:['🪨','⛰️'],ruin:['🏚️','🗿','🧱'],shrine:['🪦','⛩️','🕯️'],camp:['⛺','🔥'],mushroom:['🍄','🌿'],
  reeds:['🌾','🌿'],bones:['🦴','💀'],ash:['🔥','🪨'],frost:['❄️','🧊'],flowers:['🌼','🌿'],wisp:['✨','🟢']
 };
 const pool=map[kind]||['🌲'];
 const icon=pool[variant%pool.length];
 return makeLeafletIcon(`<div class="rpg-decor rpg-decor-${kind}" style="--decor-scale:${scale}"><span>${icon}</span></div>`,'rpg-decor-icon',[42,42]);
}
function decorProfileForBiome(id){
 const profiles={
  meadow:[['tree',10,520],['flowers',16,430],['rock',5,460],['camp',2,430],['shrine',1,500]],
  forest:[['tree',34,520],['mushroom',11,330],['rock',6,470],['ruin',2,500],['shrine',2,480]],
  ruins:[['tree',12,520],['ruin',10,500],['bones',7,390],['rock',7,470],['shrine',3,450]],
  marsh:[['reeds',25,510],['mushroom',10,360],['tree',10,500],['ruin',3,470],['wisp',5,380]],
  highlands:[['rock',22,520],['tree',9,500],['ruin',4,490],['camp',2,420],['shrine',2,470]]
 };
 return profiles[id]||profiles.forest;
}
function rebuildRpgDecorations(){
 if(!realMap||!state.world.gpsOrigin)return;
 leafletDecorLayers.forEach(x=>{try{realMap.removeLayer(x)}catch{}});leafletDecorLayers=[];
 if(realMap.getZoom()<14)return;
 const p=state.player.position||{x:0,y:0},baseX=p.x||0,baseY=p.y||0;
 const biome=biomeAt(baseX,baseY),cl=climate();
 const seed=daySeed()+Math.floor(baseX/350)*73+Math.floor(baseY/350)*131;
 const defs=[...decorProfileForBiome(biome)];
 if(cl.phase==='Noc')defs.push(['wisp',6,410]);
 if(cl.weather==='Mgła')defs.push(['wisp',3,360]);
 let n=0;
 for(const [kind,count,radius] of defs){
  for(let i=0;i<count;i++){
   const a=seeded(seed+n*43+i*11)*Math.PI*2;
   const r=72+seeded(seed+n*79+i*17)*(radius-72);
   const x=baseX+Math.cos(a)*r,y=baseY+Math.sin(a)*r;
   const localBiome=biomeAt(x,y);
   if(kind==='tree'&&localBiome==='highlands'&&seeded(seed+i*211)>.45)continue;
   if(kind==='reeds'&&localBiome!=='marsh'&&seeded(seed+i*227)>.18)continue;
   const ll=worldToLatLng(x,y);if(!ll)continue;
   const scale=.82+seeded(seed+n*101+i*29)*.42;
   const opacity=(kind==='tree'||kind==='reeds')?.80:kind==='wisp'?.66:.70;
   const marker=L.marker(ll,{pane:'decorPane',interactive:false,icon:rpgDecorIcon(kind,i,scale),opacity}).addTo(realMap);
   leafletDecorLayers.push(marker);
  }
  n+=count+7;
 }
}

function mapAmbientFxHTML(){
 const cl=climate(),bio=biomeInfoAtPlayer();
 const weatherClass=cl.weather==='Deszcz'?'rain':cl.weather==='Burza'?'storm':cl.weather==='Mgła'?'fog':cl.weather==='Wiatr'?'wind':'clear';
 const phaseClass=cl.phase==='Noc'?'night':cl.phase==='Zmierzch'?'dusk':'day';
 const amount=weatherClass==='rain'||weatherClass==='storm'?24:phaseClass==='night'?10:6;
 const particles=Array.from({length:amount},(_,i)=>`<i style="--i:${i};--x:${(i*37)%97}%;--delay:${((i*17)%23)/10}s"></i>`).join('');
 return `<div class="map-ambient-fx weather-${weatherClass} phase-${phaseClass} biome-${bio.id}" aria-hidden="true">${particles}</div>`;
}
function nearbyInteractables(limit=3){return (state.world.entities||[]).filter(questWorldEntityVisible).filter(e=>(e.type!=='monster'||e.alive)&&(e.type!=='event'||!e.done)).map(e=>({e,d:dist(e,state.player.position)})).filter(x=>x.d<=60).sort((a,b)=>a.d-b.d).slice(0,limit)}
function nearbyTrayHTML(){const near=nearbyInteractables();return `<div class="nearby-action-tray ${near.length?'has-actions':''}" data-nearby-tray>${near.length?`<span class="nearby-tray-title">W ZASIĘGU</span>${near.map(({e,d})=>{const name=e.type==='monster'?monsterTemplate(e).name:e.name;const icon=e.type==='monster'?'⚔️':e.icon||'📍';return `<button data-nearby-action="${e.id}"><span>${icon}</span><b>${name}</b><small>${Math.round(d)} m</small></button>`}).join('')}`:'<span class="nearby-tray-empty">Podejdź na 60 m do celu</span>'}</div>`}
function bindNearbyTray(root=document){root.querySelectorAll('[data-nearby-action]').forEach(b=>b.onclick=()=>interactEntity(state.world.entities.find(e=>e.id===b.dataset.nearbyAction)))}
function refreshNearbyTray(){const el=document.querySelector('[data-nearby-tray]');if(!el)return;const temp=document.createElement('div');temp.innerHTML=nearbyTrayHTML();const next=temp.firstElementChild;el.replaceWith(next);bindNearbyTray(document)}
function mobileMapSheetToggleHTML(){state.ui.mapSheetOpen ??= false;return `<button class="mobile-map-sheet-toggle" data-map-sheet-toggle>${state.ui.mapSheetOpen?'× Zamknij panel':'☰ Zadania i wydarzenia'}</button>`}

function rebuildGameLayers(){
 if(!realMap||!state.world.gpsOrigin)return;
 leafletEntityLayers.forEach(x=>realMap.removeLayer(x));leafletEntityLayers=[];
 leafletZoneLayers.forEach(x=>realMap.removeLayer(x));leafletZoneLayers=[];
 ensureLivingWorld();const filters=state.settings.mapFilters,z=rareZones(),targets=activeQuestTargets();
 for(const [name,a] of Object.entries(z)){
  const ll=worldToLatLng(a.x,a.y);if(!ll)continue;
  const color=name==='yellow'?'#d5bf45':name==='red'?'#d04b4b':'#777';
  const layer=L.circle(ll,{radius:a.r,pane:'overlayPane',color,weight:2,dashArray:'6 7',fillColor:color,fillOpacity:name==='black'?.10:.07,interactive:false}).addTo(realMap);leafletZoneLayers.push(layer);
 }
 rebuildBiomeLayers();
 rebuildTrail();
 rebuildRpgDecorations();
 const bounds=realMap.getBounds().pad(.18);
 const candidates=state.world.entities
  .filter(questWorldEntityVisible)
  .filter(e=>e.type!=='monster'||e.alive)
  .filter(e=>e.type!=='event'||!e.done)
  .filter(e=>e.type==='monster'?filters.monster:e.type==='dungeon'?filters.dungeon:e.type==='event'?filters.event:e.type==='habitat'?filters.biome:filters.poi)
  .filter(secretMapVisible)
  .filter(focusedEntityVisible)
  .map(e=>({e,ll:worldToLatLng(e.x,e.y),d:dist(e,state.player.position)}))
  .filter(x=>x.ll&&bounds.contains(x.ll))
  .map(x=>{const e=x.e;let priority=6;if(e.type==='secret')priority=0;else if(e.type==='quest'||e.type==='resource')priority=1;else if(targets.has(e.id)||(e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template)))priority=1;else if(e.type==='event')priority=2;else if(e.type==='dungeon')priority=3;else if(e.type==='monster'&&e.elite)priority=4;else if(e.type==='poi')priority=5;return {...x,priority}})
  .sort((a,b)=>a.priority-b.priority||a.d-b.d);
 const monsterLimit=state.settings.mapMode==='focused'?12:28,otherLimit=state.settings.mapMode==='focused'?18:36;
 let monsters=0,others=0;
 const visible=candidates.filter(x=>{if(x.e.type==='monster'){if(monsters>=monsterLimit)return false;monsters++;return true}if(others>=otherLimit)return false;others++;return true});
 for(const {e,ll} of visible.filter(x=>x.e.type==='habitat')){
  const h=HABITATS[e.habitat]||HABITATS.meadow;
  const area=L.circle(ll,{radius:e.radius||270,pane:'biomePane',color:h.color,weight:1.5,dashArray:'5 8',fillColor:h.color,fillOpacity:.075,interactive:false}).addTo(realMap);leafletZoneLayers.push(area);
 }
 for(const {e,ll,d} of visible.filter(x=>x.d<=180&&(x.e.type==='event'||x.e.type==='dungeon'||x.e.elite))){
  const color=e.type==='event'?'#d7b85f':e.type==='dungeon'?'#866eb8':'#b8634f';
  const ring=L.circle(ll,{radius:e.type==='dungeon'?34:24,pane:'overlayPane',color,weight:1.5,dashArray:'3 6',fillColor:color,fillOpacity:.045,interactive:false}).addTo(realMap);leafletZoneLayers.push(ring);
 }
 for(const {e,ll,d} of visible){
  let inner='',label='';
  const questTarget=targets.has(e.id)||(e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template));
  if(e.type==='monster'){const m=monsterTemplate(e),near=d<=60?' interaction-ready':d<=120?' proximity':'';inner=`<div class="mmo-marker monster-marker ${e.elite?'elite-marker':''} variant-marker-${m.variantId} ${questTarget?'quest-marker':''}${near}">${e.elite?'<span class="mmo-star">★</span>':''}${m.variantId!=='normal'?`<span class="variant-map-badge">${m.variantIcon}</span>`:''}${monsterVisual(m.id,'mmo-sprite',m.variantId)}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=m.name}
  else if(e.type==='event'){inner=`<div class="mmo-marker event-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${e.icon}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=e.name}
  else if(e.type==='secret'){const found=state.world.exploration.secretsFound.includes(e.id);inner=`<div class="mmo-marker secret-marker ${found?'found':''}">${found?e.icon:'❔'}</div>`;label=found?e.name:'Sekret w pobliżu'}
  else if(e.type==='quest'){const visual=e.visual==='woundedWolves'?`<span class="quest-wolves">${monsterVisual('wolf','quest-wolf-a')}${monsterVisual('wolf','quest-wolf-b')}</span>`:`<span class="quest-world-icon">${e.icon||'❗'}</span>`;inner=`<div class="mmo-marker quest-world-marker interaction-ready">${visual}<span class="quest-pin">!</span></div>`;label=e.name}
  else if(e.type==='resource'){inner=`<div class="mmo-marker resource-marker ${d<=60?'interaction-ready':''}"><span>🌿</span>${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=e.name}
  else if(e.type==='dungeon'){const known=state.player.dungeons.includes(e.id);inner=`<div class="mmo-marker dungeon-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${known?e.icon:'❓'}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=known?e.name:'Nieznany loch'}
  else if(e.type==='habitat'){inner=`<div class="mmo-marker habitat-marker"><span>${e.icon}</span></div>`;label=`${e.name} • miejsce występowania`}
  else {const known=state.player.discovered.includes(e.id);inner=`<div class="mmo-marker poi-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${known?e.icon:'❓'}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=known?e.name:'Nieznane miejsce'}
  const marker=L.marker(ll,{pane:'gamePane',icon:makeLeafletIcon(inner,'game-map-icon',[52,52]),title:label}).addTo(realMap);
 marker.on('click',()=>interactEntity(e));leafletEntityLayers.push(marker);
 }
}
function movementBearing(from,to){
 if(to?.heading!==null&&to?.heading!==undefined&&Number.isFinite(Number(to.heading))&&Number(to.heading)>=0)return Number(to.heading)%360;
 const lat1=Number(from?.lat),lng1=Number(from?.lng),lat2=Number(to?.lat),lng2=Number(to?.lng);
 if(![lat1,lng1,lat2,lng2].every(Number.isFinite))return playerMotion.heading||0;
 const dy=(lat2-lat1)*111320,dx=(lng2-lng1)*111320*Math.cos(lat1*Math.PI/180);
 if(Math.hypot(dx,dy)<.4)return playerMotion.heading||0;
 return (Math.atan2(dx,dy)*180/Math.PI+360)%360;
}
function playerFacing(heading=0){const h=(heading+360)%360;if(h>=45&&h<135)return'right';if(h>=225&&h<315)return'left';if(h>=135&&h<225)return'down';return'up'}
function playerMarkerHTML(){
 const facing=playerFacing(playerMotion.heading),cycle=playerMotion.speed>2.8?300:520;
 return `<div class="leaflet-player-marker rpg-player-marker ${playerMotion.moving?'walking':''} ${playerMotion.speed>2.8?'moving-fast':''}" data-player-walker data-facing="${facing}" style="--walk-heading:${playerMotion.heading||0}deg;--walk-cycle:${cycle}ms"><div class="player-heading-arrow"></div><i class="player-walk-shadow"></i><b class="player-step-dust"></b><div class="player-facing"><div class="player-walk-avatar">${classVisual(state.player.class,'mmo-player-sprite')}</div></div><span class="player-pin-tip"></span></div>`;
}
function syncPlayerMarkerMotion(){
 const markerEl=playerMapMarker?.getElement?.(),walker=markerEl?.querySelector?.('[data-player-walker]');if(!walker)return;
 const moving=playerMotion.moving&&Date.now()<playerMotion.movingUntil,facing=playerFacing(playerMotion.heading),fast=playerMotion.speed>2.8;
 walker.classList.toggle('walking',moving);walker.classList.toggle('moving-fast',moving&&fast);walker.dataset.facing=facing;
 walker.style.setProperty('--walk-heading',`${playerMotion.heading||0}deg`);walker.style.setProperty('--walk-cycle',`${fast?300:Math.round(clamp(620-playerMotion.speed*55,380,570))}ms`);
 markerEl.style.setProperty('--marker-move-ms',`${Math.round(clamp((playerMotion.lastStepSeconds||.8)*1000,420,1400))}ms`);
}
function registerPlayerMovement(from,to){
 const now=Date.now(),distance=geoDistance(from,to),elapsed=playerMotion.lastAt?Math.max(.25,(now-playerMotion.lastAt)/1000):1,threshold=to?.testWalk ? .5 : Math.max(1.8,Math.min(7,(Number(to?.accuracy)||10)*.18));
 const moved=Number.isFinite(distance)&&distance>=threshold;
 if(moved){playerMotion.heading=movementBearing(from,to);playerMotion.speed=to?.testWalk?1.55:clamp(distance/elapsed,.2,18);playerMotion.movingUntil=now+(to?.testWalk?720:Math.round(clamp(900+elapsed*520,1100,2600)));playerMotion.lastStepSeconds=elapsed}
 playerMotion.moving=moved||now<playerMotion.movingUntil;playerMotion.lastAt=now;
 clearTimeout(playerWalkStopTimer);if(playerMotion.moving)playerWalkStopTimer=setTimeout(()=>{playerMotion.moving=false;playerMotion.speed=0;syncPlayerMarkerMotion()},Math.max(80,playerMotion.movingUntil-Date.now()));
}
function updateLiveMapPosition(){
 if(!realMap||!state.player.position.lat)return;
 const p=state.player.position,ll=[p.lat,p.lng];
 if(!playerMapMarker){
  const html=playerMarkerHTML();
  playerMapMarker=L.marker(ll,{pane:'playerPane',icon:makeLeafletIcon(html,'player-leaflet-icon',[62,62]),zIndexOffset:1000}).addTo(realMap);
 }else{const previous=playerMapMarker.getLatLng?.();registerPlayerMovement(previous?{lat:previous.lat,lng:previous.lng}:p,p);playerMapMarker.setLatLng(ll);requestAnimationFrame(syncPlayerMarkerMotion)}
 if(!accuracyCircle)accuracyCircle=L.circle(ll,{pane:'overlayPane',radius:Math.max(8,p.accuracy||15),color:'#66b6db',weight:1,fillColor:'#5ca9d0',fillOpacity:.05,interactive:false}).addTo(realMap);
 else{accuracyCircle.setLatLng(ll);accuracyCircle.setRadius(Math.max(8,p.accuracy||15))}
 if(!interactionCircle)interactionCircle=L.circle(ll,{pane:'overlayPane',radius:60,color:'#e2bd66',weight:2,dashArray:'6 8',fillColor:'#d9b458',fillOpacity:.025,interactive:false}).addTo(realMap);
 else interactionCircle.setLatLng(ll);
 if(followGps)realMap.panTo(ll,{animate:true,duration:.25});
 const hud=document.querySelector('[data-live-gps]');if(hud){const motion=playerMotion.moving?(playerMotion.speed>2.8?'🏃':'🚶'):'📍';hud.textContent=p.testWalk?`${motion} TEST • strzałki`:`${motion} GPS ±${Math.round(p.accuracy||0)} m`}
 refreshNearbyTray();refreshQuestGuide();rebuildQuestGuideLayer();
}
function initRealMap(){
 const target=document.querySelector('#realMap');if(!target)return;
 if(!window.L){target.innerHTML='<div class="map-error">Mapa OpenStreetMap jest niedostępna. Połącz się z internetem, aby zobaczyć prawdziwą mapę GPS.</div>';return}
 destroyRealMap();
 realMap=L.map(target,{zoomControl:false,attributionControl:true,minZoom:3,maxZoom:19,preferCanvas:true});
 realMap.createPane('biomePane');realMap.getPane('biomePane').style.zIndex=300;realMap.getPane('biomePane').style.pointerEvents='none';
 realMap.createPane('biomeBorderPane');realMap.getPane('biomeBorderPane').style.zIndex=315;realMap.getPane('biomeBorderPane').style.pointerEvents='none';
 realMap.createPane('biomeLabelPane');realMap.getPane('biomeLabelPane').style.zIndex=340;realMap.getPane('biomeLabelPane').style.pointerEvents='none';
 realMap.createPane('decorPane');realMap.getPane('decorPane').style.zIndex=360;realMap.getPane('decorPane').style.pointerEvents='none';
 realMap.createPane('gamePane');realMap.getPane('gamePane').style.zIndex=620;
 realMap.createPane('playerPane');realMap.getPane('playerPane').style.zIndex=700;
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors',updateWhenIdle:true,keepBuffer:2,className:'rpg-osm-tiles'}).addTo(realMap);
 const p=state.player.position,origin=state.world.gpsOrigin;
 const center=p.lat?[p.lat,p.lng]:origin?[origin.lat,origin.lng]:[52.1,19.4];
 realMap.setView(center,p.lat?18:origin?17:7);
 if(origin){rebuildGameLayers();rebuildQuestGuideLayer()}
 if(p.lat){
  const html=playerMarkerHTML();
  playerMapMarker=L.marker([p.lat,p.lng],{pane:'playerPane',icon:makeLeafletIcon(html,'player-leaflet-icon',[62,62]),zIndexOffset:1000}).addTo(realMap);
  accuracyCircle=L.circle([p.lat,p.lng],{pane:'overlayPane',radius:Math.max(8,p.accuracy||15),color:'#66b6db',weight:1,fillColor:'#5ca9d0',fillOpacity:.05,interactive:false}).addTo(realMap);
  interactionCircle=L.circle([p.lat,p.lng],{pane:'overlayPane',radius:60,color:'#e2bd66',weight:2,dashArray:'6 8',fillColor:'#d9b458',fillOpacity:.025,interactive:false}).addTo(realMap);
 }
 realMap.on('dragstart',()=>{followGps=false});
 realMap.on('moveend',()=>{rebuildGameLayers()});
 realMap.on('zoomend',()=>{rebuildGameLayers()});
 setTimeout(()=>realMap.invalidateSize(),100);
}

function mapPoint(x,y,radius=500){return {left:50+(x-state.player.position.x)/(radius*2)*100,top:50-(y-state.player.position.y)/(radius*2)*100}}


function mapDashboardEntities(radius=260){
 return state.world.entities.filter(e=>{
  if(e.type==='monster'&&!e.alive)return false;
  if(e.type==='event' && !state.settings.mapFilters.event)return false;
  if(e.type==='monster' && !state.settings.mapFilters.monster)return false;
  if(e.type==='poi' && !state.settings.mapFilters.poi)return false;
  if(e.type==='dungeon' && !state.settings.mapFilters.dungeon)return false;
  return dist(e,state.player.position)<=radius;
 }).sort((a,b)=>dist(a,state.player.position)-dist(b,state.player.position)).slice(0,14);
}
function dashboardMapEntityHTML(e){
 const pt=mapPoint(e.x,e.y,260);if(pt.left<5||pt.left>95||pt.top<6||pt.top>94)return '';
 const d=Math.round(dist(e,state.player.position));
 if(e.type==='monster'){
  const m=monsterTemplate(e);
  return `<button class="dash-entity monster ${e.elite?'elite':''} variant-marker-${m.variantId}" style="left:${pt.left}%;top:${pt.top}%" title="${m.name} • ${d} m" data-dash-entity="${e.id}"><span class="badge">${e.elite?'☠️':m.variantId==='normal'?'⚔️':m.variantIcon}</span><span class="sprite">${monsterVisual(m.id,'sprite-entity',m.variantId)}</span><small>${m.name}<em>${d} m</em></small></button>`;
 }
 const discovered=state.player.discovered.includes(e.id)||state.player.dungeons.includes(e.id);
 return `<button class="dash-entity ${e.type}" style="left:${pt.left}%;top:${pt.top}%" title="${discovered?e.name:'Nieznane miejsce'} • ${d} m" data-dash-entity="${e.id}"><span class="badge">${e.icon||'📍'}</span><small>${discovered?e.name:'Nieznane'}<em>${d} m</em></small></button>`;
}
function mapQuickActionsHTML(){
 const p=state.player,hasGeo=!!(p.position.lat&&p.position.lng),virtual=!!p.position.virtualTravel;
 return `<div class="map-quick-actions"><button class="secondary" data-map-gps>${gpsWatch!==null?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button><button class="secondary" data-map-center>🎯 Do mnie</button><button class="secondary" data-shortcut="quests">📜 Zadania</button><button class="secondary" data-nav="town">🏰 Miasto</button><span class="map-status-chip">${p.position.testWalk?'🧪 TEST • strzałki':virtual?'TRYB DOMOWY':hasGeo?`GPS ±${Math.round(p.position.accuracy||0)} m`:'GPS wyłączony'}</span></div>`;
}
function activeGuideQuest(){
 const active=state.quests.active||[];
 if(state.ui.questGuideId && active.includes(state.ui.questGuideId))return QUESTS.find(q=>q.id===state.ui.questGuideId)||null;
 return null;
}
function questGuideTarget(q=activeGuideQuest()){
 if(!q)return null;
 const prog=state.quests.progress[q.id]||[];
 const stepIndex=q.steps.findIndex((s,i)=>(prog[i]||0)<(s.count||1));
 if(stepIndex<0)return null;
 const step=q.steps[stepIndex];
 let entity=null;
 if(step.type==='discover'||step.type==='dungeon'||step.type==='questInteract')entity=state.world.entities.find(e=>e.id===step.target&&questWorldEntityVisible(e))||null;
 else if(step.type==='kill'){
 const pool=state.world.entities.filter(e=>e.type==='monster'&&e.alive&&monsterTargetMatches(step.target,e.template));
  entity=pool.sort((a,b)=>dist(a,state.player.position)-dist(b,state.player.position))[0]||null;
 }
 if(entity){return {q,step,stepIndex,x:entity.x,y:entity.y,name:entity.type==='monster'?monsterTemplate(entity).name:(entity.name||step.label),distance:Math.round(dist(entity,state.player.position)),entityId:entity.id}}
 if(step.type==='move'){
  const needed=Number(step.target)||Number(step.count)||60,p=state.player.position||{x:0,y:0},r=Math.hypot(p.x||0,p.y||0),remain=Math.max(0,Math.ceil(needed-r));
  let ux=0,uy=1;if(r>5){ux=(p.x||0)/r;uy=(p.y||0)/r}
  return {q,step,stepIndex,x:(p.x||0)+ux*Math.max(remain,30),y:(p.y||0)+uy*Math.max(remain,30),name:step.label||q.name,distance:remain,moveGoal:true};
 }
 return {q,step,stepIndex,name:step.label||q.name,distance:null,noMapTarget:true};
}
function questGuideHTML(){
 const g=questGuideTarget();if(!g)return '';
 if(g.noMapTarget)return `<div class="quest-guide-hud no-target" data-guide-hud><span>🧭</span><div><b>${g.q.name}</b><small>${g.name}</small></div><button data-guide-stop>×</button></div>`;
 const p=state.player.position||{x:0,y:0},dx=g.x-(p.x||0),dy=g.y-(p.y||0),angle=Math.atan2(dx,dy)*180/Math.PI;
 return `<div class="quest-guide-hud" data-guide-hud><div class="quest-guide-arrow" data-guide-arrow style="transform:rotate(${angle}deg)">▲</div><div><b>${g.q.name}</b><small data-guide-distance>${g.distance!=null?`${g.distance} m • `:''}${g.name}</small></div><button data-guide-stop title="Wyłącz prowadzenie">×</button></div>`;
}
function refreshQuestGuide(){
 const root=document.querySelector('[data-guide-hud]');if(!root)return;const g=questGuideTarget();if(!g){root.remove();return}const d=root.querySelector('[data-guide-distance]');if(d)d.textContent=`${g.distance!=null?`${g.distance} m • `:''}${g.name}`;const a=root.querySelector('[data-guide-arrow]');if(a&&!g.noMapTarget){const p=state.player.position||{x:0,y:0},angle=Math.atan2(g.x-(p.x||0),g.y-(p.y||0))*180/Math.PI;a.style.transform=`rotate(${angle}deg)`}}
function rebuildQuestGuideLayer(){
 if(!realMap||!window.L)return;
 if(questGuideLayer){try{realMap.removeLayer(questGuideLayer)}catch{}questGuideLayer=null}
 const g=questGuideTarget(),p=state.player.position;if(!g||g.noMapTarget||!p?.lat||!p?.lng)return;
 const target=worldToLatLng(g.x,g.y);if(!target)return;
 const line=L.polyline([[p.lat,p.lng],target],{pane:'overlayPane',color:'#f2c85f',weight:3,opacity:.78,dashArray:'8 10',interactive:false});
 const halo=L.circle(target,{pane:'overlayPane',radius:18,color:'#f2c85f',weight:2,fillColor:'#f2c85f',fillOpacity:.12,interactive:false});
 questGuideLayer=L.layerGroup([line,halo]).addTo(realMap);
}

function biomeInfoSheetHTML(){
 if(!state.ui.biomeInfoOpen)return '';
 const bio=biomeInfoAtPlayer(),habitat=habitatInfoAtPlayer(),pool=habitatMonsterPool(habitat.id).map(id=>MONSTERS.find(m=>m.id===id)).filter(Boolean);
 return `<section class="biome-info-sheet"><div class="mobile-sheet-head"><div><b>${habitat.icon} ${habitat.name}</b><small>${bio.icon} Biom: ${bio.name}</small></div><button data-biome-info-close>▾ Zwiń</button></div><p>${habitat.desc}</p>${biomeEffectHTML(bio.id)}<div class="biome-sheet-monsters">${pool.slice(0,10).map(m=>`<span>${monsterVisual(m.id,'biome-list-sprite')} <b>${m.name}</b> <small>lvl ${m.min}–${m.max}</small></span>`).join('')}</div><div class="muted biome-note">Populacja odświeża się automatycznie po wejściu do nowej okolicy GPS.</div></section>`;
}
function mapSideTab(){state.ui.mapPanelTab ||= 'quests';return state.ui.mapPanelTab}
function mapSideTabsHTML(){const cur=mapSideTab();const tabs=[['quests','Zadania'],['events','Wydarzenia'],['nearby','W pobliżu']];return `<div class="mobile-sheet-head map-sheet-head"><b>${cur==='quests'?'📜 Zadania':cur==='events'?'✨ Wydarzenia':'📍 W pobliżu'}</b><button data-map-sheet-collapse>▾ Zwiń</button></div><div class="map-panel-tabs">${tabs.map(([id,label])=>`<button class="${cur===id?'active':''}" data-map-side-tab="${id}">${label}</button>`).join('')}</div>`}
function mapQuestPanelHTML(){
 const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean).slice(0,4),guided=activeGuideQuest();const next=nextStoryQuestAvailable();
 return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>Zadania</h3><span>${activeTaskCount()}/4</span></div>${active.length?active.map(q=>{const prog=state.quests.progress[q.id]||[],done=q.steps.reduce((n,s,i)=>n+((prog[i]||0)>=(s.count||1)?1:0),0),total=q.steps?.length||1,step=q.steps.find((s,i)=>(prog[i]||0)<(s.count||1));return `<div class="quest-entry ${guided?.id===q.id?'guided':''}"><div><b>${q.name}</b><small>${q.chapter||'Przygoda'} • lvl ${q.level}</small></div><div class="quest-progress-mini"><span style="width:${Math.min(100,done/total*100)}%"></span></div><p>${step?.label||q.desc||'Kontynuuj zadanie na mapie.'}</p><button class="secondary quest-guide-btn ${guided?.id===q.id?'active':''}" data-guide-quest="${q.id}">${guided?.id===q.id?'🧭 Prowadzenie włączone':'➤ Prowadź do celu'}</button></div>`}).join(''):`<div class="panel-empty">Brak aktywnych zadań.</div>`}${next?`<div class="quest-entry available"><div><b>Dostępne dalej</b><small>${next.chapter||'Przygoda'} • lvl ${next.level}</small></div><p>${next.name}</p><button class="secondary" data-open-quests>Otwórz dziennik</button></div>`:''}</div>`;
}
function mapEventsPanelHTML(){
 const discovered=state.player.discovered.slice(-3).reverse(),done=state.quests.done.slice(-2).reverse(),entries=[],nearest=(state.world.entities||[]).filter(e=>e.type==='event'&&!e.done).map(e=>({e,d:Math.round(dist(e,state.player.position))})).sort((a,b)=>a.d-b.d)[0];entries.push({t:'Teraz',text:`${biomeInfoAtPlayer().icon} ${biomeInfoAtPlayer().name} • ${climate().icon} ${climate().weather} • ${climate().phase}`});if(nearest)entries.push({t:'✨ Sygnał',text:`${nearest.e.signal||nearest.e.name} • ${nearest.d} m`});if(state.player.kills>0)entries.push({t:'Przed chwilą',text:`Pokonane potwory łącznie: ${state.player.kills}`});discovered.forEach(id=>{const e=state.world.entities.find(x=>x.id===id);if(e)entries.push({t:'Odkrycie',text:`Odkryto: ${e.name}`})});done.forEach(id=>{const q=QUESTS.find(x=>x.id===id);if(q)entries.push({t:'Ukończono',text:`Quest: ${q.name}`})});return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>Wydarzenia</h3><span>Na bieżąco</span></div>${nearest?`<button class="nearby-event-signal" data-world-event="${nearest.e.id}"><span>${nearest.e.icon||'✨'}</span><div><b>${nearest.e.name}</b><small>${nearest.d} m • ${eventTimeLabel(nearest.e)}</small></div></button>`:''}<div class="event-feed">${entries.slice(0,6).map(e=>`<div class="event-row"><b>${e.t}</b><p>${e.text}</p></div>`).join('')}</div></div>`;
}
function mapNearbyPanelHTML(){const nearby=mapDashboardEntities(180).slice(0,6);return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>W pobliżu</h3><span>60 m interakcji</span></div>${nearby.length?nearby.map(e=>{const d=Math.round(dist(e,state.player.position)),name=e.type==='monster'?monsterTemplate(e).name:e.name;return `<button class="nearby-row" data-dash-entity="${e.id}"><b>${e.icon||(e.type==='monster'?'⚔️':'📍')} ${name}</b><small>${e.type} • ${d} m</small></button>`}).join(''):`<div class="panel-empty">Nic ciekawego w pobliżu.</div>`}</div>`}
function mapRightPanelHTML(){const tab=mapSideTab();return `${mapSideTabsHTML()}${tab==='events'?mapEventsPanelHTML():tab==='nearby'?mapNearbyPanelHTML():mapQuestPanelHTML()}`}
function mapBackpackPreviewHTML(){
 const cap=inventoryCapacity(),used=inventoryUsedSlots(),entries=backpackEntries().slice(0,12);
 return `<section class="dashboard-panel inventory-preview fantasy-card"><div class="panel-title-line"><h3>Plecak</h3><span>${used}/${cap}</span></div><div class="mini-bag-grid">${entries.map(({item:i,index})=>{const d=itemDef(i.id);return `<button class="mini-bag-slot rarity-border-${d.rarity||'common'}" data-bag-index="${index}"><span>${itemIconVisual(d.id,'mini-item-svg')}</span>${(i.qty||1)>1?`<em>${i.qty}</em>`:''}</button>`}).join('')}${Array.from({length:Math.max(0,12-entries.length)}).map(()=>`<div class="mini-bag-slot empty"></div>`).join('')}</div><button class="secondary wide" data-shortcut="bag">Otwórz plecak</button></section>`;
}
function mapTownPreviewHTML(){
 const defs=[['tavern','Karczma','🍺'],['smith','Kuźnia','⚒️'],['alchemist','Alchemik','🧪'],['shop','Sklep','🛒'],['guild','Gildia','🛡️'],['auction','Aukcje','💰']];
 return `<section class="dashboard-panel city-preview fantasy-card"><div class="panel-title-line"><h3>Miasto — Dębogród</h3><span>Hub</span></div><div class="city-preview-grid">${defs.map(([id,name,icon])=>{const req=CORE_UNLOCKS[id];const locked=req&&state.player.level<req.level;return `<button class="city-mini-btn ${locked?'locked':''}" data-map-building="${id}" ${locked?'disabled':''}><span>${icon}</span><b>${name}</b><small>${locked?req.label:'wejdź'}</small></button>`}).join('')}</div></section>`;
}
function currentBiomeInfoHTML(){
 const bio=biomeInfoAtPlayer(),pool=biomeMonsterPool(bio.id).map(id=>MONSTERS.find(m=>m.id===id)).filter(Boolean);
 return `<div class="biome-info-modal"><div class="modal-head"><div><h2>${bio.icon} ${bio.name}</h2><div class="muted">Informacje o okolicy</div></div><button class="close" data-close>×</button></div><p>${bio.desc}</p>${biomeEffectHTML(bio.id)}<h3>Potwory, których możesz się spodziewać</h3><div class="biome-monster-list">${pool.map(m=>`<div class="biome-monster-chip"><span>${m.icon}</span><div><b>${m.name}</b><small>lvl ${m.min}–${m.max} • ${m.family}</small></div></div>`).join('')}</div><div class="muted biome-note">Pogoda, pora dnia i rzadkie wydarzenia mogą sprowadzić inne stworzenia.</div></div>`;
}
function testMovePadHTML(){
 if(state.settings.demo===false)return '';
 return `<div class="test-move-pad" aria-label="Sterowanie testowe"><span>TEST</span><button data-map-demo-step="up" title="Idź na północ">▲</button><button data-map-demo-step="left" title="Idź na zachód">◀</button><button data-map-demo-step="down" title="Idź na południe">▼</button><button data-map-demo-step="right" title="Idź na wschód">▶</button></div>`;
}
function renderMap(el){
 setAmbient('forest');destroyRealMap();ensureLivingWorld();state.ui.mapPanelTab ||= 'quests';state.ui.mapSheetOpen ??= false;state.ui.biomeInfoOpen ??= false;
 const p=state.player,hasGeo=!!(p.position.lat&&p.position.lng),virtual=!!p.position.virtualTravel;
 for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true;
 const tutorial=tutorialMapOverlay(),region=biomeInfoAtPlayer(),habitat=habitatInfoAtPlayer(),cl=climate();
 const weatherSlug=cl.weather.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('ł','l'),phaseSlug=cl.phase.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 el.innerHTML=`<div class="world-dashboard osm-rpg-dashboard living-world-dashboard clean-map-dashboard"><section class="dashboard-main-card fantasy-card osm-rpg-card clean-map-card"><div class="real-map-rpg-frame weather-frame-${weatherSlug} phase-frame-${phaseSlug}"><div id="realMap" class="real-map real-map-rpg"></div>${mapAmbientFxHTML()}<div class="rpg-map-vignette"></div><div class="rpg-map-compass">N</div><div class="map-location-pill"><span>${habitat.icon} ${habitat.name} • ${region.icon} ${region.name}</span><button data-biome-info title="Informacje o okolicy">ⓘ</button></div>${questGuideHTML()}${biomeInfoSheetHTML()}${biomeLegendHTML()}<div class="map-ui-stack osm-controls"><button class="map-ui-btn" data-osm-zoom="in">＋</button><button class="map-ui-btn" data-osm-zoom="out">－</button><button class="map-ui-btn" data-osm-center>◎</button><button class="map-ui-btn" data-map-gps title="${gpsWatch!==null?'Wyłącz GPS':'Włącz GPS'}">📍</button><button class="map-ui-btn" data-map-sheet-toggle>📜</button></div>${tutorial}${testMovePadHTML()}${nearbyTrayHTML()}<div class="osm-map-footer"><span class="map-status-chip" data-live-gps>${p.position.testWalk?'🧪 TEST • strzałki':virtual?'TRYB DOMOWY':hasGeo?`GPS ±${Math.round(p.position.accuracy||0)} m`:'GPS wyłączony'}</span><span class="interaction-badge">⚔️ 60 m</span></div></div>${mobileMapSheetToggleHTML()}</section><aside class="dashboard-side-card fantasy-card map-journal-sheet ${state.ui.mapSheetOpen?'open':''}" data-map-journal-sheet>${mapRightPanelHTML()}</aside></div>`;
 el.querySelectorAll('[data-map-side-tab]').forEach(b=>b.onclick=()=>{state.ui.mapPanelTab=b.dataset.mapSideTab;save();renderMap(el)});
 el.querySelectorAll('[data-map-demo-step]').forEach(b=>b.onclick=()=>{const step=b.dataset.mapDemoStep,delta={up:[0,30],down:[0,-30],left:[-30,0],right:[30,0]}[step];if(delta)moveDemo(delta[0],delta[1])});
 el.querySelectorAll('[data-map-gps]').forEach(b=>b.addEventListener('click',toggleGps));
 el.querySelectorAll('[data-osm-zoom]').forEach(b=>b.onclick=()=>{if(!realMap)return;b.dataset.osmZoom==='in'?realMap.zoomIn():realMap.zoomOut()});
 const centerNow=()=>{if(realMap&&state.player.position.lat){followGps=true;realMap.setView([state.player.position.lat,state.player.position.lng],Math.max(18,realMap.getZoom()),{animate:true})}else toast('Włącz GPS, aby wyśrodkować mapę.')};
 el.querySelector('[data-osm-center]')?.addEventListener('click',centerNow);
 el.querySelectorAll('[data-map-sheet-toggle]').forEach(b=>b.onclick=()=>{state.ui.mapSheetOpen=!state.ui.mapSheetOpen;save();renderMap(el)});
 el.querySelectorAll('[data-map-sheet-collapse]').forEach(b=>b.onclick=()=>{state.ui.mapSheetOpen=false;save();renderMap(el)});
 el.querySelector('[data-biome-info]')?.addEventListener('click',()=>{state.ui.biomeInfoOpen=!state.ui.biomeInfoOpen;save();renderMap(el)});
 el.querySelector('[data-biome-info-close]')?.addEventListener('click',()=>{state.ui.biomeInfoOpen=false;save();renderMap(el)});
 el.querySelectorAll('[data-guide-quest]').forEach(b=>b.onclick=()=>{state.ui.questGuideId=state.ui.questGuideId===b.dataset.guideQuest?null:b.dataset.guideQuest;state.ui.mapSheetOpen=false;save();renderMap(el)});
 el.querySelector('[data-guide-stop]')?.addEventListener('click',()=>{state.ui.questGuideId=null;save();renderMap(el)});
 el.querySelector('[data-open-quests]')?.addEventListener('click',openQuestView);
 el.querySelectorAll('[data-world-event]').forEach(b=>b.onclick=()=>{const e=eventById(b.dataset.worldEvent);if(!e)return;const d=dist(e,state.player.position);if(d<=60&&gpsInteractionReady())openWorldEvent(e);else toast(`${e.signal||e.name} • ${Math.round(d)} m`)});
 bindNearbyTray(el);bindShellControls(el);bindTutorialControls(el);initRealMap();
}

function entityHTML(e,radius){const pt=mapPoint(e.x,e.y,radius),d=dist(e,state.player.position);if(pt.left<-10||pt.left>110||pt.top<-10||pt.top>110)return'';if(e.type==='monster'){const m=monsterTemplate(e);return `<button class="entity monster ${e.elite?'elite':''} variant-marker-${m.variantId}" style="left:${pt.left}%;top:${pt.top}%" title="${m.name} • ${Math.round(d)} m" data-entity="${e.id}"><span class="entity-sprite">${e.elite?'<b class="elite-star">⭐</b>':m.variantId!=='normal'?`<b class="variant-entity-star">${m.variantIcon}</b>`:''}${monsterVisual(m.id,'sprite-entity',m.variantId)}</span><small>${Math.round(d)}m</small></button>`}const discovered=state.player.discovered.includes(e.id)||state.player.dungeons.includes(e.id);const icon=e.type==='dungeon'&&!discovered?'❓':e.icon;return `<button class="entity ${e.type}" style="left:${pt.left}%;top:${pt.top}%" title="${discovered?e.name:'Nieznane miejsce'} • ${Math.round(d)} m" data-entity="${e.id}"><span class="entity-sprite">${icon}</span><small>${Math.round(d)}m</small></button>`}
function moveDemo(dx,dy){
 if(SAVE_KEY!==DEMO_SAVE_KEY||!state.settings.demo)return toast('Strzałki działają tylko w osobnej przygodzie testowej.');
 if(gpsWatch!==null){try{navigator.geolocation?.clearWatch(gpsWatch)}catch{}gpsWatch=null;gpsPausedByBackground=false}
 state.world ||= {};state.world.explored ||= [];
 if(!state.world.gpsOrigin){
  const c=realMap?.getCenter?.();
  state.world.gpsOrigin={lat:Number(c?.lat)||52.1,lng:Number(c?.lng)||19.4};
 }
 const pos=state.player.position||{x:0,y:0};
 pos.x=(pos.x||0)+dx;pos.y=(pos.y||0)+dy;
 const ll=worldToLatLng(pos.x,pos.y);
 if(ll){pos.lat=ll[0];pos.lng=ll[1]}
 pos.gps=false;pos.accuracy=0;pos.heading=null;pos.virtualTravel=false;pos.testWalk=true;
 state.player.position=pos;followGps=true;
 if(pos.lat&&pos.lng)addExploredPoint(pos.lat,pos.lng,0);
 const added=markExplorationArea(pos.x,pos.y);if(added)registerExplorationProgress(pos.x,pos.y);
 const away=Math.hypot(pos.x,pos.y);checkQuestProgress('move',null,away);tutorialEvent('move',away);notifyNearbyWorldEvents();save();
 if(currentTab==='map'&&realMap){updateLiveMapPosition();rebuildGameLayers();refreshNearbyTray();refreshQuestGuide();rebuildQuestGuideLayer()}
 else if(currentTab==='map')selectNav('map');
}

function interactEntity(e){
 if(!e)return;
 const d=dist(e,state.player.position),R=60;
 if(e.type==='habitat'){state.ui.biomeInfoOpen=true;save();if(currentTab==='map')selectNav('map');return}
 // Once a guardian has been defeated the dungeon can be entered remotely; the physical marker is no longer required.
 if(e.type==='dungeon'&&state.player.dungeons.includes(e.id)&&dungeonAccess(e.id).guardianDefeated){openDungeonLobby(DUNGEONS.find(x=>x.id===e.id)||e);return}
 if(state.player.position.virtualTravel&&e.type!=='dungeon')return toast('Tryb podróży domowej nie pozwala na interakcje GPS. Włącz GPS, aby wrócić do świata.');
 if(!gpsInteractionReady())return;
 if(d>R)return toast(`Podejdź na ${R} m. Teraz: ${Math.round(d)} m.`);
 if(e.type==='secret'){discoverSecret(e);return}
 if(e.type==='quest'){interactQuestEntity(e);return}
 if(e.type==='resource'){interactResourceEntity(e);return}
 if(e.type==='event'){resolveWorldEvent(e);return}
 if(e.type==='monster'){startCombat(e);return}
 if(e.type==='poi'){if(e.id==='nightGuest'&&climate().phase!=='Noc')return toast('To miejsce ma znaczenie nocą. Włącz symulację nocy w Menu albo wróć później.');const fresh=!state.player.discovered.includes(e.id);if(fresh){state.player.discovered.push(e.id);playSfx('discover');haptic(20)}checkQuestProgress('discover',e.id);save();toast(fresh?`Odkryto: ${e.name}`:e.name);selectNav('map');queueReadyStoryScene(null,180);return}
 if(e.type==='dungeon'){
  const def=DUNGEONS.find(x=>x.id===e.id)||e,a=dungeonAccess(e.id),fresh=!a.discovered;
  if(fresh){a.discovered=true;if(!state.player.discovered.includes(e.id))state.player.discovered.push(e.id);playSfx('discover');haptic([20,25,20]);tutorialEvent('dungeonDiscover',e.id);save();toast(`Odkryto wejście: ${e.name}. Strażnik blokuje dostęp.`)}
  if(!a.guardianDefeated){openDungeonGuardianPrompt(def);return}
  openDungeonLobby(def);
 }
}


function toggleGps(){
 if(gpsWatch!==null){navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;if(state?.player?.position)state.player.position.gps=false;save();toast('GPS wyłączony.');if(currentTab==='map')selectNav('map');return}
 if(!navigator.geolocation)return toast('Ta przeglądarka nie udostępnia GPS.');
 followGps=true;toast('Uruchamiam dokładny GPS…');
 const handlePosition=pos=>{
  const now=Date.now();if(now-lastGpsTick<800)return;
  const {latitude:lat,longitude:lng,accuracy=Infinity,heading=null}=pos.coords;
  const warn=msg=>{if(now-lastGpsWarningAt>8000){toast(msg);lastGpsWarningAt=now}};
  if(!Number.isFinite(lat)||!Number.isFinite(lng)||!Number.isFinite(accuracy)||accuracy<0||accuracy>50||!pos.timestamp||now-pos.timestamp>15000){warn('GPS jest niedokładny. Poczekaj na sygnał do 50 m.');return}
  if(lastAcceptedFix){const seconds=(now-lastAcceptedFix.at)/1000,meters=geoDistance({lat,lng},lastAcceptedFix);if(seconds<30&&meters>Math.max(80,seconds*12+accuracy)){warn('Duży skok GPS — czekam na stabilną pozycję.');return}}
  lastAcceptedFix={lat,lng,at:now};lastGpsTick=now;
  const hadMapPosition=!!state.player.position.lat;
  const firstOrigin=!state.world.gpsOrigin;
  if(firstOrigin)state.world.gpsOrigin={lat,lng};
  const o=state.world.gpsOrigin,dy=(lat-o.lat)*111320,dx=(lng-o.lng)*111320*Math.cos(o.lat*Math.PI/180);
  state.player.position={x:dx,y:dy,lat,lng,gps:true,accuracy,heading,receivedAt:now,virtualTravel:false,testWalk:false};
  const revealed=addExploredPoint(lat,lng,accuracy),newSectors=accuracy<=120?markExplorationArea(dx,dy):0;
  if(newSectors>0)registerExplorationProgress(dx,dy);
  const away=Math.hypot(dx,dy);checkQuestProgress('move',null,away);tutorialEvent('move',away);notifyNearbyWorldEvents();if(revealed||newSectors)checkRegionRewards();save();
  if(currentTab==='map'&&!combat&&!dungeonRun&&!battleResult){
   if(!realMap||!hadMapPosition){selectNav('map');setTimeout(()=>{followGps=true;updateLiveMapPosition()},120)}
   else{updateLiveMapPosition();rebuildGameLayers()}
  }
 };
 const handleError=err=>{if(err.code!==1&&lastAcceptedFix&&Date.now()-lastAcceptedFix.at<30000)return;const msg=err.code===1?'Brak zgody na lokalizację. Włącz dostęp do lokalizacji dla tej strony.':err.code===2?'Nie udało się ustalić pozycji GPS.':err.code===3?'GPS nie odpowiedział na czas. Spróbuj ponownie.':err.message;toast(`GPS: ${msg}`);if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;if(state?.player?.position)state.player.position.gps=false;save();if(currentTab==='map')selectNav('map')};
 navigator.geolocation.getCurrentPosition(handlePosition,handleError,{enableHighAccuracy:true,maximumAge:0,timeout:15000});
 gpsWatch=navigator.geolocation.watchPosition(handlePosition,handleError,{enableHighAccuracy:true,maximumAge:1000,timeout:20000});
}


function renderCharacter(el){
 const p=state.player,c=CLASSES[p.class],slots=[['helmet','Hełm','⛑️'],['amulet','Amulet','📿'],['weapon','Broń główna','⚔️'],['armor','Pancerz','🛡️'],['offhand',p.class==='berserker'?'Druga broń':'Druga ręka',p.class==='berserker'?'🪓':'🛡️'],['gloves','Rękawice','🧤'],['ring1','Pierścień I','💍'],['ring2','Pierścień II','💍'],['boots','Buty','🥾']];
 const branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 el.innerHTML=`<div class="section-title"><div><h2>${p.name}</h2><div class="muted">${c.name} • ${c.desc}</div></div><span class="pill">lvl ${p.level}</span></div><div class="character-layout"><div class="paperdoll"><div class="paperdoll-title">WYPOSAŻENIE</div><div class="paperdoll-grid">${slots.map(([slot,label,ico])=>equipmentSlotHTML(slot,label,ico)).join('')}<div class="hero-silhouette"><div class="hero-pixel">${classVisual(p.class,'sprite-hero')}</div><b>${p.name}</b><span>${c.name}</span></div></div></div><div class="character-stats"><h3>Statystyki</h3><div class="stat-grid">${Object.entries(p.stats).map(([k,v])=>`<div class="stat-card"><b>${k.toUpperCase()}</b><div class="stat-number">${v}</div>${p.statPoints?`<button class="secondary mini" data-stat="${k}">+1</button>`:''}</div>`).join('')}</div><div class="derived-grid"><div><b>${attackPower()}</b><span>Atak</span></div><div><b>${armorPower()}</b><span>Pancerz</span></div><div><b>${critChance().toFixed(0)}%</b><span>Krytyk</span></div><div><b>${p.skillPoints}</b><span>Pkt skilli</span></div></div></div></div><div class="skill-tree-head"><div><h3>🌳 Drzewko umiejętności</h3><div class="muted">Wybierz kierunek rozwoju. Umiejętności wymagają poprzednich w swojej ścieżce.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="skill-branches">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div><h3 style="margin-top:22px">🐾 Chowańce</h3>${petSection()}`;
 el.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{if(p.statPoints<=0)return;p.stats[b.dataset.stat]++;p.statPoints--;if(b.dataset.stat==='vit'){p.maxHp+=5;p.hp+=5}if(b.dataset.stat==='int'){p.maxMana+=4;p.mana+=4}save();refresh()});
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
 el.querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>{p.petActive=b.dataset.pet;save();refresh();toast(`Aktywny chowaniec: ${petDef(p.petActive).name}`)});
 el.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{state.ui.heroView='gear';currentTab='hero';selectNav('hero');toast(`Wybierz przedmiot do slotu: ${b.dataset.slot}`)});
} 
function equipmentSlotHTML(slot,label,ico){
 const i=equippedInstance(slot),d=i?itemDef(i.id):null;
 return `<button class="gear-slot dnd-equip-slot ${i?`rarity-border-${d.rarity}`:'empty'}" data-equip-drop="${slot}" data-slot="${slot}" title="${i?itemName(i):`Przeciągnij tutaj: ${label}`}"><span>${d?itemIconVisual(d.id,'gear-item-svg'):ico}</span><b>${label}</b><small>${d?itemName(i):'pusty'}</small>${i?'<em class="equipped-dot">ZAŁOŻONE</em>':''}</button>`;
}
function skillCard(s){const p=state.player,learned=p.skills.includes(s.id),reqSkill=s.requires,canLevel=p.level>=s.req,canPrev=!reqSkill||p.skills.includes(reqSkill),can=canLevel&&canPrev&&p.skillPoints>=s.cost;return `<div class="skill-node ${learned?'learned':!can?'locked':''}"><div class="skill-orb">${skillIconVisual(s.id,'skill-node-svg')}</div><div class="skill-copy"><b>${s.name}</b><div class="tiny">lvl ${s.req} • ${s.cost} pkt • mana ${s.mana}${s.cooldown?` • CD ${s.cooldown}`:''}</div><p>${s.desc}</p>${reqSkill&&!canPrev?`<div class="tiny danger-text">Wymaga: ${skillDef(reqSkill)?.name||reqSkill}</div>`:''}</div>${learned?'<span class="pill green">NAUCZONE</span>':`<button class="secondary" data-learn="${s.id}" ${can?'':'disabled'}>Odblokuj</button>`}</div>`}
function learnSkill(id){const p=state.player,s=(SKILLS[p.class]||[]).find(x=>x.id===id);if(!s||p.skills.includes(id))return;if(p.level<s.req)return toast(`Wymagany poziom ${s.req}.`);if(s.requires&&!p.skills.includes(s.requires))return toast(`Najpierw odblokuj: ${skillDef(s.requires)?.name||s.requires}.`);if(p.skillPoints<s.cost)return toast('Za mało punktów umiejętności.');p.skillPoints-=s.cost;p.skills.push(id);tutorialEvent('skill');save();refresh();toast(`Odblokowano: ${s.name}`)}
function petSection(){const p=state.player;if(!['hunter','ranger'].includes(p.class))return `<div class="panel-item"><b>🔒 Chowańce bojowe</b><div class="muted">Bojowe chowańce są specjalizacją Łowcy i Tropiciela.</div></div>`;if(!p.pets.length)return `<div class="panel-item">Nie masz jeszcze chowańca.</div>`;return `<div class="pet-grid">${p.pets.map(x=>{const d=petDef(x.id),need=x.level*90;return `<div class="pet-card-v03 ${p.petActive===x.id?'active':''}"><div class="pet-portrait">${d.icon}</div><div><b>${d.name} • lvl ${x.level}</b><div class="tiny">Aktywna: ${d.skill} • Pasywna: ${d.passive}</div><div class="muted">${d.desc}</div><div class="barwrap"><div class="bar petbar" style="width:${100*x.xp/need}%"></div><div class="barlabel">XP ${x.xp}/${need}</div></div></div><button class="secondary" data-pet="${x.id}" ${p.petActive===x.id?'disabled':''}>${p.petActive===x.id?'Aktywny':'Wybierz'}</button></div>`}).join('')}</div>`}
function inventoryItemEquippedSlot(i){if(!i?.uid)return null;return Object.entries(state.player.equipped||{}).find(([,x])=>x?.uid===i.uid)?.[0]||null}
function isOneHandedWeapon(d){return d?.type==='weapon'&&['sword','axe','hammer'].includes(d.weaponKind)}
function itemCanGoToSlot(i,slot){
 if(!i)return false;const d=itemDef(i.id);if(!d?.slot||!itemClassAllowed(d))return false;
 if(d.slot==='ring')return slot==='ring1'||slot==='ring2';
 if(slot==='offhand'&&state.player.class==='berserker'&&isOneHandedWeapon(d))return true;
 if(slot==='offhand'&&state.player.class!=='knight')return false;
 return d.slot===slot;
}
function equipIndexToSlot(idx,slot){
 const i=state.player.inventory[idx];if(!i)return false;const d=itemDef(i.id);
 if(d.reqLevel&&state.player.level<d.reqLevel){toast(`Wymagany poziom ${d.reqLevel}.`);return false}
 if(!itemClassAllowed(d)){toast(`${d.name}: tylko ${itemClassNames(d)}.`);return false}
 if(!itemCanGoToSlot(i,slot)){toast(`${d.name} nie pasuje do slotu: ${slotLabel(slot)}.`);return false}
 const oldSlot=inventoryItemEquippedSlot(i);if(oldSlot&&oldSlot!==slot&&state.player.equipped[slot]&&!inventoryHasRoom()){toast('Zwolnij miejsce na zdejmowany przedmiot.');return false}if(oldSlot&&oldSlot!==slot)state.player.equipped[oldSlot]=null;
 state.player.equipped[slot]=i;tutorialEvent('equip');playSfx('equip');haptic(12);save();toast(`Założono: ${itemName(i)} → ${slotLabel(slot)}`);return true;
}
function renderInventory(el){
 tutorialEvent('inventory');
 const p=state.player,slots=[['helmet','Hełm','⛑️'],['amulet','Amulet','📿'],['weapon','Broń główna','⚔️'],['armor','Pancerz','🛡️'],['offhand',p.class==='berserker'?'Druga broń':'Druga ręka',p.class==='berserker'?'🪓':'🛡️'],['gloves','Rękawice','🧤'],['ring1','Pierścień I','💍'],['ring2','Pierścień II','💍'],['boots','Buty','🥾']],used=inventoryUsedSlots(),cap=inventoryCapacity(),bag=backpackEntries();
 const cells=Array.from({length:cap},(_,idx)=>{const entry=bag[idx];if(!entry)return `<button class="backpack-slot empty" disabled><span>·</span></button>`;const i=entry.item,realIndex=entry.index,d=itemDef(i.id),qty=i.qty||1,gear=!!d.slot;return `<button class="backpack-slot dnd-bag-item rarity-border-${d.rarity}" data-bag-index="${realIndex}" ${gear?'draggable="true"':''} data-dnd-gear="${gear?'1':'0'}" title="${itemName(i)}${gear?' • przeciągnij na slot':''}"><span class="backpack-icon">${itemIconVisual(d.id,'backpack-item-svg')}</span>${qty>1?`<b class="stack-badge">${qty}</b>`:''}${(i.upgrade||0)>0?`<em>+${i.upgrade}</em>`:''}</button>`}).join('');
 el.innerHTML=`<div class="section-title gear-page-title"><div><h2>🎒 Ekwipunek + plecak</h2><div class="muted">Sprzęt ma wymagany poziom i klasy. Berserker może trzymać drugą broń zamiast tarczy; Łowca i Tropiciel zużywają strzały.</div></div><span class="pill ${used>=cap?'danger-pill':''}">${used}/${cap}</span></div><div class="gear-bag-layout"><section class="paperdoll drag-paperdoll"><div class="paperdoll-title">WYPOSAŻENIE</div><div class="paperdoll-grid dnd-paperdoll-grid">${slots.map(([slot,label,ico])=>equipmentSlotHTML(slot,label,ico)).join('')}<div class="hero-silhouette drag-hero-silhouette"><div class="hero-pixel">${classVisual(p.class,'sprite-hero')}</div><b>${p.name}</b><span>${CLASSES[p.class].name}</span></div></div><div class="drag-help">Przeciągnij przedmiot na podświetlony slot</div></section><section class="backpack-frame drag-backpack"><div class="backpack-topline"><b>Plecak</b><span>${cap-used} wolnych</span></div><div class="backpack-grid">${cells}</div></section></div>${combatStatsPanelHTML()}${setStatusHTML()}`;
 bindInventoryDragDrop(el);
 el.querySelectorAll('[data-bag-index]').forEach(b=>b.onclick=e=>{if(Date.now()<(window.__t4hSuppressBagClickUntil||0))return;openInventoryItem(Number(b.dataset.bagIndex))});
 el.querySelectorAll('[data-equip-drop]').forEach(b=>b.onclick=()=>{const slot=b.dataset.equipDrop,i=equippedInstance(slot);if(!i)return;const idx=state.player.inventory.findIndex(x=>x?.uid===i.uid);if(idx>=0)openInventoryItem(idx)});
}
function bindInventoryDragDrop(root){
 let dragIdx=null,ghost=null,start=null,moved=false;
 const highlight=idx=>{const i=state.player.inventory[idx];root.querySelectorAll('[data-equip-drop]').forEach(s=>s.classList.toggle('drop-valid',itemCanGoToSlot(i,s.dataset.equipDrop)))};
 const clear=()=>{root.querySelectorAll('[data-equip-drop]').forEach(s=>s.classList.remove('drop-valid','drop-hover'));ghost?.remove();ghost=null;dragIdx=null;start=null;moved=false};
 root.querySelectorAll('.dnd-bag-item[data-dnd-gear="1"]').forEach(item=>{
  item.addEventListener('dragstart',e=>{dragIdx=Number(item.dataset.bagIndex);highlight(dragIdx);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragIdx));item.classList.add('dragging')});
  item.addEventListener('dragend',()=>{item.classList.remove('dragging');clear()});
  item.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;dragIdx=Number(item.dataset.bagIndex);start={x:e.clientX,y:e.clientY};moved=false;item.setPointerCapture?.(e.pointerId)});
  item.addEventListener('pointermove',e=>{if(dragIdx===null||!start||e.pointerType==='mouse')return;const distPx=Math.hypot(e.clientX-start.x,e.clientY-start.y);if(distPx<8&&!moved)return;if(!moved){moved=true;highlight(dragIdx);ghost=document.createElement('div');ghost.className='touch-drag-ghost';ghost.innerHTML=item.querySelector('.backpack-icon')?.innerHTML||'⚔️';document.body.appendChild(ghost);window.__t4hSuppressBagClickUntil=Date.now()+600}ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;document.elementFromPoint(e.clientX,e.clientY)?.closest?.('[data-equip-drop]')&&root.querySelectorAll('[data-equip-drop]').forEach(s=>s.classList.toggle('drop-hover',s===document.elementFromPoint(e.clientX,e.clientY)?.closest?.('[data-equip-drop]')))});
  item.addEventListener('pointerup',e=>{if(dragIdx===null||e.pointerType==='mouse')return;const slotEl=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('[data-equip-drop]');const idx=dragIdx;if(moved&&slotEl&&itemCanGoToSlot(state.player.inventory[idx],slotEl.dataset.equipDrop)){if(equipIndexToSlot(idx,slotEl.dataset.equipDrop)){window.__t4hSuppressBagClickUntil=Date.now()+700;clear();renderInventory(root);return}}clear()});
  item.addEventListener('pointercancel',clear);
 });
 root.querySelectorAll('[data-equip-drop]').forEach(slot=>{
  slot.addEventListener('dragover',e=>{if(dragIdx===null)return;if(itemCanGoToSlot(state.player.inventory[dragIdx],slot.dataset.equipDrop)){e.preventDefault();slot.classList.add('drop-hover')}});
  slot.addEventListener('dragleave',()=>slot.classList.remove('drop-hover'));
  slot.addEventListener('drop',e=>{e.preventDefault();const idx=dragIdx??Number(e.dataTransfer.getData('text/plain'));if(Number.isFinite(idx)&&equipIndexToSlot(idx,slot.dataset.equipDrop)){clear();renderInventory(root)}else clear()});
 });
}
function openInventoryItem(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);openModal(`<div class="modal-head"><div><h2>${itemIconVisual(d.id,'shop-item-svg')} ${itemName(i)}</h2><div class="muted">${inventoryItemEquippedSlot(i)?'Wyposażenie':`Plecak • ${inventoryUsedSlots()}/${inventoryCapacity()}`}${isStackable(i.id)?` • stos ${(i.qty||1)}/${stackLimit(i.id)}`:''}</div></div><button class="close" data-close>×</button></div>${inventoryCard(i,idx)}`);const root=document.querySelector('.modal-back');root?.querySelector('[data-equip]')?.addEventListener('click',()=>{closeModal();equipIndex(idx)});root?.querySelectorAll('[data-equip-slot]').forEach(b=>b.addEventListener('click',()=>{closeModal();if(equipIndexToSlot(idx,b.dataset.equipSlot))refresh()}));root?.querySelector('[data-unequip]')?.addEventListener('click',()=>{closeModal();unequipItem(i.uid)});root?.querySelector('[data-use]')?.addEventListener('click',()=>{closeModal();useItem(i.id)});root?.querySelector('[data-sell]')?.addEventListener('click',()=>{closeModal();sellIndex(idx)});root?.querySelector('[data-salvage]')?.addEventListener('click',()=>{closeModal();salvageIndex(idx)})}
function setStatusHTML(){const counts=activeSetCounts();const rows=Object.entries(SET_BONUSES).map(([id,b])=>{const n=counts[id]||0;return `<div class="set-card ${n>=2?'active':''}"><b>⚜️ ${b.name}</b><span>${n}/3 części</span><small>2 części: ${Object.entries(b.two).map(([k,v])=>`${k==='power'?'ATK':k==='armor'?'Pancerz':'Kryt'} +${v}`).join(' • ')}<br>3 części: ${Object.entries(b.three).map(([k,v])=>`${k==='power'?'ATK':k==='armor'?'Pancerz':'Kryt'} +${v}${k==='crit'?'%':''}`).join(' • ')}</small></div>`}).join('');return `<div class="set-strip">${rows}</div>`}
function slotLabel(slot){return ({weapon:'Broń główna',helmet:'Hełm',armor:'Pancerz',gloves:'Rękawice',boots:'Buty',amulet:'Amulet',ring1:'Pierścień I',ring2:'Pierścień II',offhand:state?.player?.class==='berserker'?'Druga broń':'Druga ręka',ring:'Pierścień'})[slot]||slot}
function inventoryEquipButtons(d,idx){if(state.player.class==='berserker'&&isOneHandedWeapon(d))return `<button class="secondary" data-equip-slot="weapon">⚔️ Ręka główna</button><button class="secondary dual-wield-action" data-equip-slot="offhand">🪓 Druga ręka <small>45% obrażeń</small></button>`;return `<button class="secondary" data-equip="${idx}">Załóż</button>`}
function inventoryCard(i,idx){const d=itemDef(i.id),eqSlot=Object.entries(state.player.equipped).find(([,x])=>x?.uid&&x.uid===i.uid)?.[0],eq=!!eqSlot,qty=i.qty||1,up=i.upgrade||0,details=[d.damage?`Obrażenia ${d.damage[0]}–${d.damage[1]}`:'',d.power&&!d.damage?`ATK +${d.power+up*2}`:'',d.armor?`Pancerz +${d.armor+up*2}`:'',d.crit?`Kryt +${d.crit+up}%`:'',d.ammo?`Amunicja: ${itemDef(d.ammo).name}`:''].filter(Boolean).join(' • '),mods=[i.affix?.name?`✨ Afiks: ${i.affix.name}`:'',i.enchant?.name?`🔮 Enchant: ${i.enchant.name}`:'',i.rune?`${itemDef(i.rune).icon} ${itemDef(i.rune).name}`:'',d.set?`⚜️ ${SET_BONUSES[d.set]?.name||d.set}`:''].filter(Boolean);return `<div class="item-card rarity-card-${d.rarity}"><div class="item-top"><div class="item-icon">${itemIconVisual(d.id,'inventory-item-svg')}</div><div><b class="rarity-${d.rarity}">${itemName(i)}${qty>1?` ×${qty}`:''}</b><div class="tiny">${rarityName(d.rarity)}${d.reqLevel?` • wymagany lvl ${d.reqLevel}`:''} • ${d.slot?slotLabel(d.slot):d.type}${details?` • ${details}`:''}${d.classes?`<br>Klasa: ${itemClassNames(d)}`:''}</div>${mods.length?`<div class="item-mods">${mods.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div></div>${eq?`<div class="equipped-tag">ZAŁOŻONE: ${slotLabel(eqSlot)}</div>`:''}<div class="tabs" style="margin-top:8px">${d.slot?(eq?`<button class="secondary" data-unequip="${i.uid}">Zdejmij</button>`:inventoryEquipButtons(d,idx)):''}${d.type==='consumable'?`<button class="secondary" data-use="${d.id}">Użyj</button>`:''}${d.value>0&&!eq?`<button class="ghost" data-sell="${idx}">Sprzedaj ${itemSellValue(i)} 🪙</button>`:''}${d.slot&&!eq?`<button class="ghost" data-salvage="${idx}">♻️ Rozbierz</button>`:''}</div></div>`}
function rarityName(r){return ({common:'Zwykły',uncommon:'Niezwykły',rare:'Rzadki',epic:'Epicki',heroic:'Heroiczny',legendary:'Legendarny'})[r]||r}
function unequipItem(uidv){const slot=Object.entries(state.player.equipped||{}).find(([,x])=>x?.uid===uidv)?.[0];if(!slot)return false;if(!inventoryHasRoom()){toast('Plecak jest pełny — najpierw zwolnij miejsce.');return false}const i=equippedInstance(slot);state.player.equipped[slot]=null;playSfx('equip');save();refresh();toast(`Zdjęto: ${i?itemName(i):slotLabel(slot)}`);return true}
function equipIndex(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);if(d.reqLevel&&state.player.level<d.reqLevel)return toast(`Wymagany poziom ${d.reqLevel}.`);if(!itemClassAllowed(d))return toast(`${d.name}: tylko ${itemClassNames(d)}.`);let slot=d.slot;if(!slot)return;if(slot==='ring')slot=!state.player.equipped.ring1?'ring1':!state.player.equipped.ring2?'ring2':'ring1';if(equipIndexToSlot(idx,slot))refresh()}
function salvageIndex(idx){const i=state.player.inventory[idx];if(!i)return;const equipped=Object.values(state.player.equipped).some(x=>x?.uid&&x.uid===i.uid);if(equipped)return toast('Najpierw zdejmij przedmiot.');const d=itemDef(i.id);if(!d.slot)return toast('Rozebrać można tylko element wyposażenia.');const y=salvageYield(i),drops=[{id:'scrap',qty:y.scrap},...(y.shards?[{id:'runeShard',qty:y.shards}]:[]),...(y.crystal?[{id:'crystal',qty:y.crystal}]:[])];if(!canReceiveItems(drops,{},i.uid))return toast('Zwolnij miejsce na materiały. Przedmiot zachowano.');state.player.inventory.splice(idx,1);addItem('scrap',y.scrap);if(y.shards)addItem('runeShard',y.shards);if(y.crystal)addItem('crystal',y.crystal);ensureEconomyState();state.economy.totalSalvaged++;save();refresh();toast(`Rozebrano ${d.name}: +${y.scrap} 🔩${y.shards?` • +${y.shards} 🔹`:''}${y.crystal?' • +1 💎':''}`)}
function useItem(id){
 const d=itemDef(id),p=state.player;if(!countItem(id))return;
 const key=d.heal?'hp':d.mana?'mana':null,max=key==='hp'?p.maxHp:p.maxMana,amount=d.heal||d.mana;
 if(!key)return toast('Tego przedmiotu nie można teraz użyć.');
 if(p[key]>=max)return toast(key==='hp'?'Masz pełne zdrowie.':'Masz pełną manę.');
 const restored=Math.min(amount,max-p[key]);p[key]+=restored;removeItem(id);toast(`+${restored} ${key==='hp'?'HP':'many'}`);save();refresh();
}

function sellIndex(idx){const i=state.player.inventory[idx];if(!i)return;if(inventoryItemEquippedSlot(i))return toast('Najpierw zdejmij przedmiot.');const d=itemDef(i.id),price=itemSellValue(i);state.player.gold+=price;if(i.qty&&i.qty>1)i.qty--;else state.player.inventory.splice(idx,1);ensureEconomyState();state.economy.totalSold++;save();refresh();toast(`Sprzedano: ${d.name} • +${price} 🪙`)}

function questStepState(q,step,index){
 const prog=state.quests.progress[q.id]||[];const cur=prog[index]||0;const target=step.count||1;
 if(step.type==='move')return {cur:Math.min(step.target||target,cur),target:step.target||target,done:cur>=(step.target||target)};
 return {cur:Math.min(target,cur),target,done:cur>=target};
}
function questProgressPercent(q){if(state.quests.done.includes(q.id))return 100;if(!q.steps?.length)return 0;const done=q.steps.reduce((sum,s,i)=>sum+(questStepState(q,s,i).done?1:0),0);return Math.round(done/q.steps.length*100)}
function questHTML(q){
 const active=state.quests.active.includes(q.id),done=state.quests.done.includes(q.id),pct=questProgressPercent(q),focus=state.ui.questFocus===q.id;
 return `<button class="quest-list-card ${active?'active-quest':''} ${done?'done-quest':''} ${focus?'selected':''}" data-focus-quest="${q.id}"><div class="quest-list-top"><span>${done?'✓':active?'◆':'○'}</span><div><b>${q.name}</b><small>${q.chapter||'Przygoda'} • poziom ${q.level}</small></div><em>${done?'UKOŃCZONO':pct+'%'}</em></div><div class="quest-mini-bar"><i style="width:${pct}%"></i></div></button>`;
}
function questDetailHTML(q){
 if(!q)return `<div class="quest-detail-card empty"><div class="quest-seal">📜</div><h3>Wybierz zadanie</h3><p>Wybierz wpis z dziennika, aby zobaczyć szczegóły.</p></div>`;
 const active=state.quests.active.includes(q.id),done=state.quests.done.includes(q.id),pct=questProgressPercent(q),scene=storyScene(q.id),chosen=storyChoiceFor(q.id);
 return `<article class="quest-detail-card"><div class="quest-detail-head"><div><span>${q.chapter||'Przygoda'}</span><h3>${q.name}</h3><small>Poziom ${q.level}</small></div><div class="quest-seal">${done?'✓':'📜'}</div></div><p class="quest-description">${q.desc||''}</p><div class="quest-detail-progress"><b>Postęp</b><span>${pct}%</span><div><i style="width:${pct}%"></i></div></div><div class="quest-step-list">${(q.steps||[]).map((s,i)=>{const st=questStepState(q,s,i);return `<div class="quest-step ${st.done?'done':''}"><span>${st.done?'✓':'○'}</span><div><b>${s.label||s.desc||'Cel zadania'}</b><small>${st.done?'Wykonano':`${Math.floor(st.cur)}/${st.target}`}</small></div></div>`}).join('')}</div><div class="quest-reward-box"><span>🎁 Nagroda</span><b>${q.xp||0} XP • ${q.gold||0} 🪙</b></div>${scene&&active?(chosen?`<button class="secondary quest-story-action" data-story-scene="${q.id}">📖 Zobacz swój wybór</button>`:`<div class="quest-auto-scene-note">🗺️ Scena uruchomi się automatycznie przy właściwym celu na mapie.</div>`):''}${done?'<div class="quest-complete-stamp">UKOŃCZONO</div>':''}</article>`;
}
function bountyTargetName(b){return b.type==='gather'?itemDef(b.target).name:(MONSTERS.find(m=>m.id===b.target)?.name||b.target)}
function bountyVerb(b){return b.type==='gather'?'Zbierz':'Pokonaj'}
function bountyObjective(b){return `${bountyVerb(b)} ${b.need}× ${bountyTargetName(b)}`}
function renderQuests(el){
 updateStoryConditions();ensureStoryState();ensureAdventureState();
 const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean),done=state.quests.done.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean).slice().reverse(),contracts=(state.adventure.bounties||[]).filter(b=>b.accepted&&!b.claimed);
 const selectable=[...active,...done];state.ui.questFocus ||= selectable[0]?.id||null;if(state.ui.questFocus&&!selectable.some(q=>q.id===state.ui.questFocus))state.ui.questFocus=selectable[0]?.id||null;
 const focus=QUESTS.find(q=>q.id===state.ui.questFocus);
 el.innerHTML=`<div class="quest-journal-23"><section class="quest-journal-side"><div class="journal-summary"><div><b>${active.length}</b><span>Fabularne</span></div><div><b>${contracts.length}</b><span>Kontrakty</span></div><div><b>${done.length}</b><span>Ukończone</span></div></div>${tutorialJournalHTML()}<div class="quest-section-label">AKTYWNE</div><div class="quest-list">${active.map(questHTML).join('')||'<div class="journal-empty">Brak aktywnych zadań fabularnych.</div>'}</div>${contracts.length?`<div class="quest-section-label">KONTRAKTY</div><div class="bounty-list-23">${contracts.map(b=>`<div class="bounty-card-23"><div><b>${b.icon} ${b.name}</b><small>${bountyTargetName(b)} • ${b.progress||0}/${b.need}</small></div><div class="quest-mini-bar"><i style="width:${Math.min(100,(b.progress||0)/b.need*100)}%"></i></div><div class="bounty-reward">${b.xp} XP • ${b.gold} 🪙 • ${b.rep} rep.</div>${(b.progress||0)>=b.need?`<button class="secondary" data-claim-bounty="${b.id}">Odbierz</button>`:`<button class="ghost" data-show-bounty="${b.id}">Pokaż cel na mapie</button>`}</div>`).join('')}</div>`:''}${done.length?`<details class="completed-quests"><summary>Ukończone (${done.length})</summary><div class="quest-list">${done.slice(0,12).map(questHTML).join('')}</div></details>`:''}</section><section class="quest-journal-main">${questDetailHTML(focus)}${storyProfileHTML()}</section></div><div class="quest-limit-note">Samouczek nie zajmuje miejsca. Maksymalnie 4 aktywne zadania i kontrakty.</div>`;
 el.querySelectorAll('[data-focus-quest]').forEach(b=>b.onclick=()=>{state.ui.questFocus=b.dataset.focusQuest;save();renderQuests(el)});
 el.querySelectorAll('[data-story-scene]').forEach(b=>b.onclick=()=>openStoryScene(b.dataset.storyScene));
 el.querySelectorAll('[data-claim-bounty]').forEach(b=>b.onclick=()=>claimBounty(b.dataset.claimBounty));
 el.querySelectorAll('[data-show-bounty]').forEach(btn=>btn.onclick=()=>{const b=state.adventure.bounties.find(x=>x.id===btn.dataset.showBounty);if(!b)return;spawnBountyTargets(b);save();selectNav('map');toast(`${bountyObjective(b)} • cele są zaznaczone na mapie`) });bindTutorialControls(el)
}
function eventTimeLabel(e){if(e.persistent)return 'Skutek decyzji';const left=Math.max(0,(e.expiresAt||0)-Date.now());if(!left)return 'do końca dnia';const h=Math.floor(left/3600000),m=Math.floor(left%3600000/60000);return h?`${h} h ${m} min`:`${Math.max(1,m)} min`}
function renderEvents(el){
 ensureLivingWorld();const stats=explorationStats(),events=(state.world.entities||[]).filter(e=>e.type==='event'),completed=state.world.living.completedEvents||[],history=state.world.living.eventHistory||[];
 el.innerHTML=`<div class="events-dashboard"><section class="daily-explore-card"><div class="daily-icon">🧭</div><div><span>CEL DZIENNY</span><h3>Eksploracja świata</h3><p>Odwiedzaj nowe obszary podczas spaceru.</p><div class="daily-progress"><i style="width:${stats.percent}%"></i></div><small>${stats.count}/${stats.goal} sektorów ${stats.claimed?'• nagroda odebrana':''}</small></div><div class="daily-reward"><b>350 XP</b><span>75 🪙 • 5 rep.</span></div></section><div class="event-context-banner"><b>${climate().icon} Świat reaguje na warunki</b><span>${biomeInfoAtPlayer().icon} ${biomeInfoAtPlayer().name} • ${climate().weather} • ${climate().phase}</span><small>Co kilka godzin pojawia się inne rzadkie spotkanie. Wybór może dać nagrodę, zmienić świat albo rozpocząć walkę.</small></div><div class="events-grid">${events.map(e=>{const done=completed.includes(e.id)||e.done,d=Math.round(dist(e,state.player.position)),bio=BIOMES[e.biome||biomeAt(e.x,e.y)];return `<article class="world-event-card ${done?'done':''} ${e.rare?'rare':''}"><div class="event-icon-big">${e.icon||'✨'}</div><div class="event-body"><span>${done?'UKOŃCZONE':e.storyEcho?'KONSEKWENCJA DECYZJI':e.rare?'RZADKIE WYDARZENIE':'WYDARZENIE ŚWIATA'}</span><h3>${e.name}</h3><p>${e.desc||'Dynamiczne wydarzenie pojawiło się w świecie.'}</p><div class="event-meta"><b>📍 ${d} m</b><b>${bio.icon} ${bio.name}</b><b>⏳ ${eventTimeLabel(e)}</b></div><small>Wybory: ${(e.choices||[]).length||1} • bazowo ${e.xp||0} XP i ${e.gold||0} 🪙</small></div><button class="${done?'ghost':'secondary'}" data-world-event="${e.id}" ${done?'disabled':''}>${done?'✓ Gotowe':d<=60?'Rozegraj scenę':'Pokaż na mapie'}</button></article>`}).join('')||'<div class="journal-empty">Brak aktywnych wydarzeń.</div>'}</div>${history.length?`<section class="event-history"><h3>Ostatnie konsekwencje</h3>${history.slice(0,6).map(h=>`<div><span>✓</span><p><b>${h.name}</b><small>${h.choice}${h.result?` • ${h.result}`:''}</small></p></div>`).join('')}</section>`:''}</div>`;
 el.querySelectorAll('[data-world-event]').forEach(b=>b.onclick=()=>{const e=eventById(b.dataset.worldEvent);if(!e)return;const d=dist(e,state.player.position);if(d<=60&&gpsInteractionReady())openWorldEvent(e);else{state.ui.mapPanelTab='events';state.ui.mapSheetOpen=false;selectNav('map');toast(`${e.signal||e.name} • ${Math.round(d)} m od Ciebie.`)}})
}
function renderAdventure(el){
 ensureDungeonAccessState();
 const regions=Object.values(EXPLORATION_REGIONS);
 el.innerHTML=`<div class="trips-shell"><div class="dungeon-rules-banner"><div><b>🕳️ Odkryj → pokonaj strażnika → eksploruj z domu</b><small>Każdy loch: 3 wejścia dziennie. Po zwycięstwie zamyka się na 1 godzinę. Porażka: 15 min.</small></div></div><div class="region-strip">${regions.map(r=>`<div class="region-chip"><span>${r.icon}</span><div><b>${r.name}</b><small>poziom ${r.level}</small></div></div>`).join('')}</div><div class="dungeon-grid-23">${DUNGEONS.map(d=>{const a=dungeonAccess(d.id),discovered=a.discovered||state.player.discovered.includes(d.id),unlocked=a.guardianDefeated&&state.player.dungeons.includes(d.id),boss=MONSTERS.find(m=>m.id===d.boss),clears=state.player.dungeonClears[d.id]||0,levelOk=state.player.level>=d.min,cool=Math.max(0,a.cooldownUntil-Date.now()),attemptsLeft=Math.max(0,DUNGEON_DAILY_LIMIT-a.attempts),ready=unlocked&&levelOk&&!cool&&attemptsLeft>0;let status=!discovered?'NIEODKRYTY':!unlocked?'STRAŻNIK NIEPOKONANY':cool?`ODNOWIENIE ${formatCooldown(a.cooldownUntil)}`:attemptsLeft<=0?'LIMIT DZIENNY':'GOTOWY';return `<article class="dungeon-card-23 ${unlocked?'known':discovered?'guarded':'locked'}"><div class="dungeon-art"><span>${d.icon}</span><em>${status}</em></div><div class="dungeon-copy"><span>LOCH • poziom ${d.min}+ • ⏱️ ${Math.round(dungeonTimeLimit(d)/60)} min</span><h3>${discovered?d.name:'Nieodkryty loch'}</h3><p>${discovered?d.desc:'Odnajdź wejście podczas eksploracji GPS. Dopiero wtedy poznasz, co kryje się pod ziemią.'}</p>${discovered&&!unlocked?`<div class="dungeon-guardian-line"><b>🛡️ Strażnik wejścia</b><span>${dungeonGuardianMonster(d).name}</span><small>Wróć fizycznie do wejścia i pokonaj go w promieniu 60 m.</small></div>`:''}${unlocked&&boss?`<div class="dungeon-boss"><b>Boss</b><span>${monsterVisual(boss.id,'dungeon-boss-sprite')} ${boss.name}</span></div>`:''}<div class="dungeon-meta"><span>🎟️ Dziś: ${a.attempts}/${DUNGEON_DAILY_LIMIT}</span><span>🏆 Ukończenia: ${clears}</span><span>${a.bestTime?`⏱️ Rekord: ${formatClock(a.bestTime)}`:'⏱️ Brak rekordu'}</span><span>${a.bestExplore?`🗺️ Rekord mapy: ${a.bestExplore}%`:'🗺️ Brak rekordu'}</span></div></div><button class="${ready?'primary':'ghost'}" data-enter-dungeon="${d.id}" ${ready?'':'disabled'}>${!discovered?'Najpierw odkryj':!unlocked?'Pokonaj strażnika':!levelOk?`Wymaga lvl ${d.min}`:cool?`Zamknięty ${formatCooldown(a.cooldownUntil)}`:attemptsLeft<=0?'0/3 wejść':'Rozpocznij wyprawę'}</button></article>`}).join('')}</div></div>`;
 el.querySelectorAll('[data-enter-dungeon]').forEach(b=>b.onclick=()=>openDungeonLobby(DUNGEONS.find(d=>d.id===b.dataset.enterDungeon)))
}
function bestiaryFamilies(){return ['Wszystkie',...new Set(MONSTERS.map(m=>m.family))]}
function monsterVariantKills(id){const saved=state.player.bestiaryVariants?.[id];if(saved)return saved;const legacy=state.player.bestiary?.[id]||0;return legacy?{normal:legacy}:{}}
function knownMonsterVariantCount(id){const kills=monsterVariantKills(id);return MONSTER_VARIANT_ORDER.filter(v=>(kills[v]||0)>0).length}
function monsterVariantProgressHTML(m){const kills=monsterVariantKills(m.id);return `<section class="monster-variant-journal"><div class="variant-journal-head"><div><span class="eyebrow">ODMIANY GATUNKU</span><h3>Odkryto ${knownMonsterVariantCount(m.id)}/${MONSTER_VARIANT_ORDER.length}</h3></div><small>Każda wersja ma inne statystyki i mnożnik łupów.</small></div><div class="monster-variant-grid">${MONSTER_VARIANT_ORDER.map(id=>{const v=monsterVariantDef(id),count=kills[id]||0,known=count>0;return `<article class="monster-variant-card variant-card-${id} ${known?'known':'locked'}"><div class="variant-mini-art">${known?monsterVisual(m.id,'variant-bestiary-sprite',id):'<b>?</b>'}</div><span>${v.icon} ${v.label}</span><b>${known?`${count}× pokonany`:'Nieodkryty'}</b><small>${known?`HP ×${v.hp.toFixed(2)} • ATK ×${v.atk.toFixed(2)} • łup ×${v.loot.toFixed(2)}`:id==='ancient'?'Bardzo rzadka odmiana':'Spotkaj tę wersję w świecie'}</small><p>${known?v.desc:'???'}</p></article>`}).join('')}</div></section>`}
function openBestiaryMonster(id){
 const m=MONSTERS.find(x=>x.id===id);if(!m)return;const kills=state.player.bestiary?.[id]||0;if(!kills)return;
 const places=monsterHabitatNames(m,6);
 openModal(`<div class="bestiary-modal"><div class="modal-head"><div><span class="eyebrow">BESTIARIUSZ</span><h2>${m.name}</h2><div class="muted">${m.family}${m.role?` • rola: ${m.role}`:''} • poziom ${m.min}–${m.max}</div></div><button class="close" data-close>×</button></div><div class="bestiary-detail"><div class="bestiary-hero-art">${monsterVisual(m.id,'bestiary-modal-sprite')}</div><div><div class="bestiary-stat-grid"><span><b>${kills}</b> pokonanych</span><span><b>${m.weak||'—'}</b> słabość</span><span><b>${m.zone}</b> strefa</span><span><b>${m.xp}</b> bazowe XP</span></div><p>${monsterLore(m)}</p><div class="monster-habitats"><h3>📍 Miejsca występowania</h3><div>${places.map(place=>`<span>${place}</span>`).join('')}</div></div><div class="bestiary-loot"><h3>🎒 Możliwe łupy</h3><p class="muted">Szanse bazowe. Elity i bossowie mogą zwiększać ilość lub szansę materiałów.</p>${monsterLootHTML(m)}</div><div class="lore-tip">Dorian: ${tavernAnecdote()}</div></div></div>${monsterVariantProgressHTML(m)}</div>`)
}
function renderBestiary(el){
 state.ui.bestiaryFamily ||= 'Wszystkie';const families=bestiaryFamilies(),knownCount=MONSTERS.filter(m=>(state.player.bestiary?.[m.id]||0)>0).length,filtered=MONSTERS.filter(m=>state.ui.bestiaryFamily==='Wszystkie'||m.family===state.ui.bestiaryFamily);
 el.innerHTML=`<div class="bestiary-shell"><div class="bestiary-top"><div><span class="eyebrow">KSIĘGA POTWORÓW</span><h2>Bestiariusz</h2><p>Poznane stworzenia ujawniają słabości, miejsca występowania, historię i możliwe łupy.</p></div><div class="bestiary-counter"><b>${knownCount}</b><span>/ ${MONSTERS.length} poznanych</span></div></div><div class="family-tabs">${families.map(f=>`<button class="${state.ui.bestiaryFamily===f?'active':''}" data-family="${f}">${f}</button>`).join('')}</div><div class="bestiary-grid-23">${filtered.map(m=>{const kills=state.player.bestiary?.[m.id]||0,known=kills>0,place=monsterHabitatNames(m,1)[0];return `<button class="bestiary-card-23 ${known?'known':'unknown'}" data-best-monster="${m.id}" ${known?'':'disabled'}><div class="bestiary-art">${known?monsterVisual(m.id,'bestiary-card-sprite'):'<span class="unknown-monster">?</span>'}</div><div class="bestiary-copy"><span>${known?m.family:'NIEODKRYTY'}</span><h3>${known?m.name:'Nieznane stworzenie'}</h3>${known?`<div class="bestiary-line"><b>🎯 ${m.weak||'brak'}</b><b>⚔️ ${kills}×</b></div><small>lvl ${m.min}–${m.max} • ${place}</small>`:'<small>Pokonaj potwora, aby odblokować wpis.</small>'}</div></button>`}).join('')}</div></div>`;
 el.querySelectorAll('[data-family]').forEach(b=>b.onclick=()=>{state.ui.bestiaryFamily=b.dataset.family;save();renderBestiary(el)});el.querySelectorAll('[data-best-monster]').forEach(b=>{const id=b.dataset.bestMonster,count=knownMonsterVariantCount(id),line=b.querySelector('.bestiary-line');if(line)line.insertAdjacentHTML('beforeend',`<b class="variant-count-chip">🧬 ${count}/5</b>`);b.onclick=()=>openBestiaryMonster(id)})
}

function monsterLore(m){
 const goblins={goblin:'Lekki zwiadowca plemienia. Okrąża ofiarę, oznacza bezpieczne przejścia na skrawkach map i najczęściej pilnuje traktów.',goblinWarrior:'Ciężej uzbrojony wojownik osłaniający goblińskie patrole. Nosi prowizoryczny puklerz i zbiera metal na naprawy.',goblinMage:'Samouk posługujący się kradzionymi fokusami i niestabilną magią. W jego torbie częściej trafiają się mikstury oraz odłamki run.',goblinChampion:'Dowódca większego oddziału. Sztandar czempiona jest trofeum, a przy nim zwykle znajduje się więcej monet i lepsza broń.'};
 if(goblins[m.id])return goblins[m.id];
 const lore={Natura:'Dziki mieszkaniec szlaków i lasów. Najczęściej atakuje samotnych wędrowców.',Owady:'Pancerz i jad czynią te stworzenia groźniejszymi, niż sugeruje ich rozmiar.',Nieumarli:'Pozostałość dawnych bitew. Magia utrzymuje ich kości w ruchu.',Zjawy:'Istoty związane z miejscami, w których śmierć zostawiła zbyt silny ślad.',Demony:'Przybysze z miejsc, w których ogień i gniew mają własną wolę.',Żywiołaki:'Skupiska pierwotnej energii związanej z kamieniem, ogniem i burzą.',Ludzie:'Bandytów i kultystów nie ogranicza natura — walczą z wyrachowaniem.',Bestie:'Rzadkie drapieżniki z najniebezpieczniejszych stref świata.'};return lore[m.family]||'Nieznane stworzenie świata Time4Heroes.'
}
const CITY_INTERIORS={
 tavern:{title:'Karczma „Pod Krukiem”',npc:'Dorian',role:'Karczmarz • były wojownik',classId:'knight',bg:'assets/tavern-scene-desktop.png',quote:'„Miecz odwiesiłem na ścianę. Pamięć o potworach — nie.”'},
 shop:{title:'Sklep kupiecki',npc:'Selma',role:'Kupcowa',classId:'hunter',bg:'assets/backgrounds/interior-shop-380.webp',quote:'„Towar musi mieć cenę. Dobra rada czasem jest gratis.”'},
 smith:{title:'Kuźnia Ragora',npc:'Ragor',role:'Kowal i runmistrz',classId:'berserker',bg:'assets/backgrounds/interior-smith-380.webp',quote:'„Dobra stal ma duszę. Zła ma tylko cenę.”'},
 alchemist:{title:'Pracownia Ilyry',npc:'Ilyra',role:'Alchemiczka',classId:'mage',bg:'assets/backgrounds/interior-alchemist-380.webp',quote:'„Rośliny mówią. Trzeba tylko wiedzieć, kiedy nie przeszkadzać.”'},
 auction:{title:'Dom handlowy',npc:'Varo',role:'Licytator',classId:'ranger',bg:'assets/backgrounds/interior-auction-380.webp',quote:'„Każdy przedmiot ma wartość. Pytanie brzmi: dla kogo?”'},
 guild:{title:'Sala gildii',npc:'Edrin',role:'Mistrz Gildii',classId:'knight',bg:'assets/backgrounds/interior-guild-380.webp',quote:'„Siła to nie tylko miecz. To ludzie, którzy wracają po swoich.”'}
};
function renderTown(el){
 setAmbient('town');
 const cl=climate();
 const cardCopy={tavern:['Dorian','Odpoczynek • plotki • questy'],shop:['Selma','Handel • towary dnia'],smith:['Ragor','Ulepszanie • runy • rzemiosło'],alchemist:['Ilyra','Mikstury • receptury • składniki'],auction:['Varo','Oferty dnia • rzadkie przedmioty'],guild:['Edrin','Reputacja • kontrakty • gildia']};
 el.innerHTML=`<div class="city-hub-shell"><div class="city-hub-hero"><div><span class="eyebrow">WIOSKA POD KRUKIEM</span><h2>Miasto bohaterów</h2><p>${cl.icon} ${cl.weather} • ${cl.phase}. Wybierz miejsce i wejdź do środka.</p></div><div class="city-hub-seal">⚜️</div></div><div class="city-district-grid">${BUILDINGS.map(b=>{const u=buildingUnlock(b.id),c=CITY_INTERIORS[b.id],copy=cardCopy[b.id]||[c?.npc||'',b.tag||''];return `<button class="city-building-card ${u.ok?'':'locked-building'}" data-building="${b.id}" ${u.ok?'':'disabled'} style="--card-bg:url('${c?.bg||''}')"><span class="city-building-art"></span><span class="city-building-shade"></span><span class="city-building-npc">${u.ok?npcVisual(c.npc,c.classId,'city-card-npc'):''}</span><span class="city-building-copy"><small>${copy[0]}</small><b>${b.name}</b><em>${u.ok?copy[1]:`🔒 ${u.reason}`}</em><strong>${u.ok?'WEJDŹ DO ŚRODKA →':'ZABLOKOWANE'}</strong></span></button>`}).join('')}</div></div>`;
 el.querySelectorAll('[data-building]:not(:disabled)').forEach(b=>b.onclick=()=>openBuilding(b.dataset.building,'scene'));
}
function tavernSceneHTML(view='scene'){
 const showHotspots=view==='scene';
 let sheet='';
 if(view==='keeper')sheet=`<aside class="tavern-sheet tavern-sheet-keeper">${tavernKeeperHTML()}</aside>`;
 else if(view==='fireplace')sheet=`<aside class="tavern-sheet tavern-sheet-fire">${tavernFireplaceHTML()}</aside>`;
 else if(view==='board')sheet=`<aside class="tavern-sheet tavern-sheet-board">${tavernBoardHTML()}</aside>`;
 return `<div class="tavern-clean-stage">
   <picture class="tavern-scene-picture"><source media="(max-width:620px)" srcset="assets/tavern-scene-mobile.png"><img src="assets/tavern-scene-desktop.png" alt="Wnętrze Karczmy Pod Krukiem"></picture>
   <div class="tavern-scene-vignette"></div>
   ${showHotspots?`<div class="tavern-hotspots" aria-label="Interaktywne elementy karczmy">
     <button class="tavern-hotspot tavern-hotspot-dorian" data-building-action="keeper" aria-label="Porozmawiaj z Dorianem" title="Dorian"><span>💬</span></button>
     <button class="tavern-hotspot tavern-hotspot-board" data-building-action="board" aria-label="Otwórz tablicę ogłoszeń" title="Tablica ogłoszeń"><span>📜</span></button>
     <button class="tavern-hotspot tavern-hotspot-fire" data-building-action="fireplace" aria-label="Odpocznij przy kominku" title="Kominek"><span>🔥</span></button>
   </div><div class="tavern-tap-hint">Dotknij Doriana, tablicy albo kominka</div>`:''}
   ${sheet}
 </div>`;
}
function buildingSceneHTML(id,view='scene'){
 if(id==='tavern')return tavernSceneHTML(view);
 const c=CITY_INTERIORS[id];
 const icon=id==='smith'?'⚒️':id==='alchemist'?'⚗️':id==='shop'?'👜':id==='auction'?'🔨':'🛡️';
 let sheet='';
 if(view==='talk')sheet=`<aside class="tavern-sheet clean-room-sheet">${buildingTalkHTML(id)}</aside>`;
 else if(view==='service')sheet=`<aside class="tavern-sheet clean-room-sheet service-sheet service-sheet-${id}">${buildingServiceHTML(id)}</aside>`;
 const hotspots=view==='scene'?`<div class="tavern-hotspots clean-room-hotspots" aria-label="Interaktywne elementy wnętrza">
   <button class="tavern-hotspot clean-room-hotspot clean-room-hotspot-npc" data-building-action="keeper" aria-label="Porozmawiaj z ${c.npc}" title="${c.npc}"><span>💬</span></button>
   <button class="tavern-hotspot clean-room-hotspot clean-room-hotspot-service" data-building-action="service" aria-label="Otwórz usługę" title="Usługa"><span>${icon}</span></button>
 </div><div class="tavern-tap-hint clean-room-tap-hint">Dotknij postaci albo stanowiska</div>`:'';
 return `<div class="tavern-clean-stage clean-room-stage room-${id}">
   <picture class="tavern-scene-picture clean-room-picture"><source media="(max-width:620px)" srcset="${c.bgMobile||c.bg}"><img src="${c.bgDesktop||c.bg}" alt="${c.title}"></picture>
   <div class="tavern-scene-vignette clean-room-vignette"></div>
   <div class="clean-room-scene-npc" aria-label="${c.npc} — ${c.role}">${npcVisual(c.npc,c.classId,'clean-room-scene-sprite')}<span><b>${c.npc}</b><small>${c.role}</small></span></div>
   ${hotspots}${sheet}
 </div>`;
}
function tavernBoardHTML(){ensureAdventureState();const story=nextStoryQuestAvailable(),bounties=state.adventure.bounties||[],active=activeTaskCount();return `<div class="building-panel parchment-panel"><button class="ghost panel-back" data-building-home>← Wróć do karczmy</button><div class="board-head"><div><span>TABLICA OGŁOSZEŃ</span><h2>📌 Kartki przypięte do desek</h2></div><b>${active}/4 aktywne</b></div><div class="quest-board">${story?`<article class="quest-paper story-paper"><i></i><span>GŁÓWNY SZLAK • lvl ${story.level}</span><h3>${story.name}</h3><p>${story.desc}</p><strong>${story.xp} XP • ${story.gold} 🪙</strong><button class="secondary" data-accept-story="${story.id}" ${canAcceptTask()?'':'disabled'}>${canAcceptTask()?'Przyjmij':'Limit 4/4'}</button></article>`:`<article class="quest-paper"><i></i><h3>Główny wątek jest w toku</h3><p>Kolejne etapy fabuły uruchamiają się automatycznie. Do karczmy nie musisz wracać po każdą część historii.</p></article>`}${bounties.map(b=>`<article class="quest-paper contract-paper ${b.accepted?'accepted-paper':''}"><i></i><span>KONTRAKT DNIA</span><h3>${b.icon} ${b.name}</h3><p>${bountyObjective(b)}. Cel zostanie wygenerowany na mapie po przyjęciu.</p><strong>${b.xp} XP • ${b.gold} 🪙 • ${b.rep} rep.</strong>${b.claimed?'<button disabled>Wykonano</button>':b.accepted?`<button disabled>Przyjęte • ${b.progress||0}/${b.need}</button>`:`<button class="secondary" data-accept-bounty="${b.id}" ${canAcceptTask()?'':'disabled'}>${canAcceptTask()?'Przyjmij':'Limit 4/4'}</button>`}</article>`).join('')}</div><div class="quest-board-foot">Samouczek jest osobny i nie zajmuje żadnego z 4 miejsc.</div></div>`}
function tavernKeeperHTML(){const p=state.player,st=p.stamina??100,max=p.maxStamina??100;return `<div class="building-panel"><button class="ghost panel-back" data-building-home>← Wróć do sali</button>${npcCard('Dorian','Karczmarz • były wojownik','knight','Dorian walczył kiedyś na północy. Zna nawyki potworów, a dziś pilnuje, żeby podróżni wracali na szlak w jednym kawałku.')}<div class="dialogue-bubble">${tavernAnecdote()}</div><div class="stamina-card"><b>⚡ Stamina ${st}/${max}</b><div class="mini-progress"><span style="width:${st/max*100}%"></span></div><small>Napitek i jedzenie przywracają siły przed dalszą drogą.</small></div><div class="tavern-menu"><button class="secondary" data-anecdote>🗣️ Kolejna anegdota</button><button class="secondary" data-stamina="10" data-cost="10" data-label="Piwo">🍺 Piwo • +10 staminy • 10 🪙</button><button class="secondary" data-stamina="25" data-cost="25" data-label="Solidny posiłek">🍲 Posiłek • +25 • 25 🪙</button><button class="secondary" data-stamina="50" data-cost="50" data-label="Karczemna uczta">🍗 Uczta • +50 • 50 🪙</button></div></div>`}
function tavernFireplaceHTML(){const cost=Math.min(70,15+state.player.level*3);return `<div class="building-panel hearth-panel"><button class="ghost panel-back" data-building-home>← Wróć do sali</button><div class="big-hearth">🔥</div><h2>Kominek</h2><p>Siadasz przy ogniu. Ciepło rozluźnia mięśnie, a przez kilka minut świat może poczekać.</p><div class="rest-summary"><span>❤️ Pełne HP</span><span>🔷 Pełna mana</span><span>⚡ +25 staminy</span></div><button class="primary" data-fire-rest>Odpocznij • ${cost} 🪙</button></div>`}
function buildingServiceHTML(id){const labels={shop:'sklepu',smith:'kuźni',alchemist:'pracowni',auction:'domu aukcyjnego',guild:'sali gildii'};const body=id==='shop'?shopHTML():id==='smith'?smithHTML():id==='alchemist'?alchemistHTML():id==='auction'?auctionHTML():id==='guild'?guildHTML():'';return `<div class="market-service market-${id}"><button class="ghost panel-back" data-building-home>← Wróć do ${labels[id]||'wnętrza'}</button>${body}</div>`}
function buildingTalkHTML(id){const c=CITY_INTERIORS[id];const extra={shop:'Selma słyszy większość plotek od handlarzy, zanim dotrą do karczmy.',smith:'Ragor najpierw ogląda materiał, dopiero potem pyta, co chcesz z niego zrobić.',alchemist:'Ilyra potrafi rozpoznać zioło po zapachu i truciznę po kolorze osadu.',auction:'Varo twierdzi, że na każdą rzecz znajdzie się kupiec — trzeba tylko poczekać.',guild:'Edrin pamięta nazwiska tych, którzy dotrzymują słowa.'}[id]||'Dorian opowiada o dawnych wyprawach.';return `<div class="building-panel"><button class="ghost panel-back" data-building-home>← Wróć do wnętrza</button>${npcCard(c.npc,c.role,c.classId,c.quote)}<div class="dialogue-bubble">${extra}</div>${id==='tavern'?'<button class="secondary" data-building-action="keeper">Porozmawiaj dłużej</button>':`<button class="secondary" data-building-action="service">Przejdź do usług</button>`}</div>`}
function buildingGlobalNavHTML(){return `<nav class="building-global-nav"><button data-building-nav="map">🗺️ <span>Mapa</span></button><button data-building-nav="hero">🛡️ <span>Bohater</span></button><button data-building-nav="town">🏰 <span>Miasto</span></button><button data-building-nav="quests">📜 <span>Zadania</span></button><button data-building-nav="menu">☰ <span>Menu</span></button></nav>`}
function openBuilding(id,view='scene'){
 setAmbient(id==='tavern'?'tavern':'town');
 const unlock=buildingUnlock(id);if(!unlock.ok)return toast(`Odblokujesz to: ${unlock.reason}.`);
 if(id==='tavern')tutorialEvent('tavern');
 document.body.classList.add('building-open');
 const c=CITY_INTERIORS[id]||CITY_INTERIORS.tavern;
 let body=id==='tavern'?tavernSceneHTML(view):buildingSceneHTML(id,view);
 const top=id==='tavern'
   ? `<div class="tavern-chrome"><div><b>Karczma „Pod Krukiem”</b><small>Dorian • kominek • tablica ogłoszeń</small></div><button class="close tavern-close" data-close title="Zamknij">×</button></div>${buildingGlobalNavHTML()}`
   : `<div class="tavern-chrome clean-room-chrome"><div><b>${c.title}</b><small>${c.npc} • ${c.role}</small></div><button class="close tavern-close" data-close title="Zamknij">×</button></div>${buildingGlobalNavHTML()}`;
 openModal(`<div class="location-scene scene-${id} city-modal ${id==='tavern'?'tavern-modal-clean':'clean-room-modal'}"><div class="location-overlay">${top}<div id="buildingBody">${body}</div></div></div>`);
 bindBuilding(id,view)
}

function tavernHTML(){return tavernKeeperHTML()}
function serviceHeroHTML(id,kicker,title,text){const c=CITY_INTERIORS[id];return `<header class="service-hero"><div class="service-merchant">${npcVisual(c.npc,c.classId,'service-merchant-portrait')}</div><div class="service-hero-copy"><span>${kicker}</span><h2>${title}</h2><p>${text}</p></div><div class="service-wallet"><small>Twój mieszek</small><b>🪙 ${state.player.gold}</b><em>${inventoryUsedSlots()}/${inventoryCapacity()} miejsc</em></div></header>`}
function itemStatsHTML(d){const stats=[];if(d.damage)stats.push(`⚔️ ${d.damage[0]}–${d.damage[1]}`);if(d.armor!==undefined)stats.push(`🛡️ ${d.armor}`);if(d.power)stats.push(`✦ +${d.power} mocy`);if(d.crit)stats.push(`🎯 +${d.crit}%`);if(d.reqLevel)stats.push(`lvl ${d.reqLevel}`);if(!stats.length)stats.push(d.type==='material'?'Materiał rzemieślniczy':d.type==='ammo'?'Amunicja':'Przedmiot użytkowy');return stats.map(x=>`<span>${x}</span>`).join('')}
function marketItemCardHTML(id,price,action,button='Kup',badge='Towar Selmy'){const d=itemDef(id),affordable=state.player.gold>=price,room=canReceiveItems([{id,qty:1}]);return `<article class="market-card rarity-frame-${d.rarity}"><div class="market-card-top"><span class="market-badge">${badge}</span><span class="rarity-${d.rarity}">${rarityName(d.rarity)}</span></div><div class="market-product"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><h3>${d.name}</h3><div class="market-stats">${itemStatsHTML(d)}</div></div></div><footer><div class="market-price"><small>Cena</small><b>${price} 🪙</b></div><button class="secondary market-buy" ${action} ${affordable&&room?'':'disabled'}>${!room?'Pełny plecak':affordable?button:'Za mało złota'}</button></footer></article>`}
function recipeCardHTML(r,verb){const d=itemDef(r.result),fee=craftFee(r),ingredients=Object.entries(r.ingredients),ready=ingredients.every(([id,q])=>countItem(id)>=q)&&state.player.gold>=fee;return `<article class="recipe-card rarity-frame-${d.rarity}"><div class="recipe-output"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><span>${r.qty>1?`${r.qty}× `:''}${rarityName(d.rarity)}</span><h3>${r.name}</h3><div class="market-stats">${itemStatsHTML(d)}</div></div></div><div class="ingredient-tray">${ingredients.map(([id,q])=>{const have=countItem(id),ok=have>=q;return `<span class="${ok?'ready':'missing'}" title="Masz ${have}">${itemIconVisual(id,'ingredient-icon')} ${q} <small>/${have}</small></span>`}).join('')}</div><footer><div class="market-price"><small>Opłata</small><b>${fee} 🪙</b></div><button class="secondary market-buy" data-craft="${r.id}" ${ready?'':'disabled'}>${ready?verb:'Brakuje składników'}</button></footer></article>`}
function sectionTitleHTML(icon,title,note){return `<div class="service-section-title"><span>${icon}</span><div><h3>${title}</h3><small>${note}</small></div></div>`}
function shopHTML(){const classGear={knight:['rustySword','shortSword','chainVest','woodenShield','ironArmor'],berserker:['rustySword','shortSword','ironAxe','chainVest','berserkerHarness'],mage:['noviceStaff','apprenticeStaff','apprenticeRobe','mageHood','mageShoes'],hunter:['hunterBow','yewBow','rangerLeather','scoutHood','trailBoots'],ranger:['hunterBow','yewBow','rangerLeather','scoutHood','trailBoots']}[state.player.class]||[];const basics=['potion','manaPotion','herb','scrap',...(['hunter','ranger'].includes(state.player.class)?['primitiveArrow']:[])],gear=classGear.filter(id=>!itemDef(id).reqLevel||itemDef(id).reqLevel<=state.player.level+5);return `${serviceHeroHTML('shop','SKLEP KUPIECKI','Towary Selmy','Zaopatrzenie na szlak i sprzęt dobrany do Twojej klasy.')}<div class="merchant-quote">„Dla Ciebie odłożyłam rzeczy, które naprawdę mogą się przydać.”</div>${sectionTitleHTML('🎒','Zaopatrzenie','Mikstury, materiały i zapasy')}<div class="market-grid">${basics.map(id=>{const price=merchantBuyPrice(id);return marketItemCardHTML(id,price,`data-buy="${id}" data-price="${price}"`,'Kup','Na szlak')}).join('')}</div>${sectionTitleHTML('⚔️','Sprzęt dla bohatera',`${CLASSES[state.player.class]?.name||'Twoja klasa'} • oferty do poziomu ${state.player.level+5}`)}<div class="market-grid">${gear.map(id=>{const price=merchantBuyPrice(id);return marketItemCardHTML(id,price,`data-buy="${id}" data-price="${price}"`,'Kup','Dobór Selmy')}).join('')}</div>`}
function smithGearCardHTML(i,runes){const d=itemDef(i.id),up=i.upgrade||0,q=upgradeQuote(i),eq=enchantQuote(i,!!i.enchant);return `<article class="workshop-card rarity-frame-${d.rarity}"><div class="workshop-item"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><span class="rarity-${d.rarity}">${rarityName(d.rarity)}</span><h3>${itemName(i)}</h3><div class="market-stats">${itemStatsHTML(d)}</div></div></div><div class="upgrade-track" aria-label="Poziom ulepszenia">${[1,2,3,4,5].map(n=>`<i class="${n<=up?'lit':''}"></i>`).join('')}<b>+${up}</b></div><div class="socket-line"><span>${i.enchant?`🔮 ${i.enchant.name}`:'◇ Bez zaklęcia'}</span><span>${i.rune?`${itemDef(i.rune).icon} ${itemDef(i.rune).name}`:'◇ Wolne gniazdo runy'}</span></div><div class="workshop-actions"><button class="secondary" data-upgrade="${i.uid}" ${up>=5?'disabled':''}>${up>=5?'Ulepszenie MAX':`⚒️ +${up+1} • ${q.gold}🪙${q.scrap?` + ${q.scrap}🔩`:''}`}</button><button class="secondary" data-enchant="${i.uid}">${i.enchant?`🔮 Przerzuć • ${eq.gold}🪙`:`🔮 Zaklnij • ${eq.gold}🪙`}</button>${!i.rune?runes.map(r=>`<button class="ghost rune-button" data-socket="${i.uid}" data-rune="${r}" ${countItem(r)?'':'disabled'}>${itemDef(r).icon} ${countItem(r)}</button>`).join(''):`<button class="ghost" data-unsocket="${i.uid}">↩️ Wyjmij runę</button>`}</div></article>`}
function smithHTML(){const gear=state.player.inventory.filter(i=>itemDef(i.id).slot),recipes=RECIPES.filter(r=>r.station==='smith'&&itemClassAllowed(itemDef(r.result))),runes=['runePower','runeGuard','runePrecision'];return `${serviceHeroHTML('smith','KUŹNIA I RUNY','Warsztat Ragora','Ulepszaj znaleziony sprzęt, osadzaj runy i wykuwaj nowe przedmioty.')}<div class="resource-belt"><span>🔩 Złom <b>${countItem('scrap')}</b></span><span>💎 Kryształ <b>${countItem('crystal')}</b></span><span>🔹 Odłamki <b>${countItem('runeShard')}</b></span>${runes.map(id=>`<span>${itemDef(id).icon} ${itemDef(id).name.replace('Runa ','')} <b>${countItem(id)}</b></span>`).join('')}</div>${sectionTitleHTML('🔥','Obróbka sprzętu',gear.length?'Wybierz przedmiot i operację':'Nie masz sprzętu do obróbki')}<div class="workshop-grid">${gear.map(i=>smithGearCardHTML(i,runes)).join('')||'<div class="service-empty">Przynieś Ragorowi broń albo pancerz znaleziony na szlaku.</div>'}</div>${sectionTitleHTML('🧰','Katalog receptur','Materiały zdobywasz z potworów i wydarzeń')}<div class="recipe-grid">${recipes.map(r=>recipeCardHTML(r,'Wykuj')).join('')}</div>`}
function alchemistHTML(){const recipes=RECIPES.filter(r=>r.station==='alchemist');return `${serviceHeroHTML('alchemist','PRACOWNIA ALCHEMICZNA','Kocioł Ilyry','Dobierz składniki, sprawdź zapasy i uwarz mikstury przed wyprawą.')}<div class="resource-belt alchemy-belt"><span>🌿 Zioło <b>${countItem('herb')}</b></span><span>🌙 Księżycowe <b>${countItem('moonHerb')}</b></span><span>💎 Kryształ <b>${countItem('crystal')}</b></span><span>☠️ Jad <b>${countItem('venomGland')}</b></span></div><div class="merchant-quote alchemy-quote">„Zielony płomień oznacza, że mikstura jest gotowa. Fioletowy — że czas uciekać.”</div>${sectionTitleHTML('⚗️','Receptury','Zielone składniki są gotowe, czerwonych brakuje')}<div class="recipe-grid">${recipes.map(r=>recipeCardHTML(r,'Uwarz')).join('')}</div>`}
function auctionHTML(){const offerIds=['blueBlade','forestBow','arcaneStaff','shadowRing','wolfCharm','ironHelm','emberRing','ravenBlade','wildBow','arcaneRobe','mistBlade','mistBow','mistStaff','mistHelm','mistHood','mistCirclet'].filter(id=>itemClassAllowed(itemDef(id)));const ids=[0,1,2,3].map(i=>offerIds[Math.floor(seeded(daySeed()+i*91)*offerIds.length)]);return `${serviceHeroHTML('auction','OFERTY DNIA','Katalog Vara','Rzadkie przedmioty wybrane dla Twojej klasy. Katalog zmienia się każdego dnia.')}<div class="auction-ribbon"><span>🔨 OFERTY KUPCA</span><b>4 starannie wybrane oferty</b><small>Nowy katalog po zmianie dnia</small></div>${sectionTitleHTML('👑','Gabloty aukcyjne','Zakup jest natychmiastowy — bez oczekiwania na licytację')}<div class="auction-grid">${ids.map((id,i)=>{const d=itemDef(id),factor=ECONOMY.auctionMin+seeded(daySeed()+i*17)*(ECONOMY.auctionMax-ECONOMY.auctionMin)+(rarityRank(d.rarity)>=3?.12:0),price=Math.ceil(d.value*factor);return marketItemCardHTML(id,price,`data-auction-buy="${id}" data-price="${price}"`,'Kup ofertę',i===0?'Oferta dnia':`Gablota ${i+1}`)}).join('')}</div>`}
function guildHTML(){const rep=state.adventure.reputation||0,rank=rep>=120?'Strażnik Kruka':rep>=60?'Zaprzysiężony':rep>=25?'Towarzysz':'Rekrut',progress=Math.min(100,rep/120*100);return `${serviceHeroHTML('guild','SALA GILDII','Bractwo Edrina','Kontrakty budują reputację i otwierają drogę do przyszłych wypraw drużynowych.')}<div class="guild-banner"><span>🛡️</span><div><small>RANGA BOHATERA</small><h3>${rank}</h3><div class="guild-rep-track"><i style="width:${progress}%"></i></div><em>${rep} reputacji</em></div></div><div class="guild-perks"><div><span>📜</span><b>Kontrakty</b><small>Wykonuj zlecenia z tablicy w karczmie.</small></div><div><span>⚔️</span><b>Wyprawy</b><small>Buduj pozycję przed wyprawami gildyjnymi.</small></div><div><span>🏰</span><b>Wspólna sala</b><small>Twoja nazwa pozostaje częścią lokalnego zapisu.</small></div></div><div class="guild-create-card"><span class="guild-wax">⚜️</span><div><small>${state.player.guild?'TWOJA GILDIA':'ZAŁÓŻ WŁASNĄ GILDIĘ'}</small><h3>${state.player.guild||'Napisz pierwszy rozdział'}</h3><p>${state.player.guild?'Edrin zapisał nazwę gildii w księdze miasta.':'Wybierz nazwę, pod którą będą znane Twoje przyszłe czyny.'}</p>${!state.player.guild?'<div class="guild-name-row"><input id="guildName" placeholder="Nazwa gildii" maxlength="28"><button class="secondary" data-create-guild>Utwórz gildię</button></div>':`<div class="guild-member-line">🛡️ Założyciel: ${state.player.name} • ${rep} reputacji</div>`}</div></div>`}
function bindBuilding(id,view){
 document.querySelectorAll('[data-building-nav]').forEach(b=>b.onclick=()=>{const target=b.dataset.buildingNav;closeModal();if(target==='quests'){state.ui.adventureView='quests';save();currentTab='adventureHub';selectNav('adventureHub');return}currentTab=target;selectNav(target)});
 document.querySelectorAll('[data-building-map]').forEach(b=>b.onclick=()=>{closeModal();currentTab='map';selectNav('map')});
 document.querySelectorAll('[data-building-exit]').forEach(b=>b.onclick=()=>{closeModal();currentTab='town';selectNav('town')});
 document.querySelectorAll('[data-building-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.buildingAction;if(a==='keeper')openBuilding(id,id==='tavern'?'keeper':'talk');else openBuilding(id,a)});
 document.querySelectorAll('[data-building-home]').forEach(b=>b.onclick=()=>openBuilding(id,'scene'));
 document.querySelector('[data-anecdote]')?.addEventListener('click',()=>openBuilding('tavern','keeper'));
 document.querySelectorAll('[data-stamina]').forEach(b=>b.onclick=()=>buyTavernStamina(Number(b.dataset.stamina),Number(b.dataset.cost),b.dataset.label));
 document.querySelector('[data-fire-rest]')?.addEventListener('click',restByFire);
 document.querySelectorAll('[data-accept-story]').forEach(b=>b.onclick=()=>acceptStoryQuest(b.dataset.acceptStory));
 document.querySelectorAll('[data-accept-bounty]').forEach(b=>b.onclick=()=>acceptBounty(b.dataset.acceptBounty));
 document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buyItem(b.dataset.buy,id,Number(b.dataset.price))); 
 document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>upgradeItem(b.dataset.upgrade));
 document.querySelectorAll('[data-enchant]').forEach(b=>b.onclick=()=>enchantItem(b.dataset.enchant));
 document.querySelectorAll('[data-socket]').forEach(b=>b.onclick=()=>socketRune(b.dataset.socket,b.dataset.rune));
 document.querySelectorAll('[data-unsocket]').forEach(b=>b.onclick=()=>unsocketRune(b.dataset.unsocket));
 document.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>craftRecipe(b.dataset.craft));
 document.querySelectorAll('[data-auction-buy]').forEach(b=>b.onclick=()=>{buyItem(b.dataset.auctionBuy,'auction',Number(b.dataset.price))});
 document.querySelector('[data-create-guild]')?.addEventListener('click',()=>{const n=document.querySelector('#guildName')?.value.trim();if(!n)return;state.player.guild=n.replace(/[<>]/g,'');save();openBuilding('guild','service')});
}

function buyItem(id,building,forcedPrice){if(!ITEMS[id])return;if(!requireItemRoom([{id,qty:1}]))return;const d=itemDef(id),price=Number.isFinite(forcedPrice)&&forcedPrice>0?forcedPrice:merchantBuyPrice(id);if(state.player.gold<price)return toast('Za mało złota.');state.player.gold-=price;addItem(id);save();openBuilding(building,'service');toast(`Kupiono: ${d.name} • -${price} 🪙`)}
function upgradeItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const up=i.upgrade||0;if(up>=5)return;const q=upgradeQuote(i);if(state.player.gold<q.gold)return toast(`Potrzebujesz ${q.gold} złota.`);if(countItem('scrap')<q.scrap)return toast(`Potrzebujesz ${q.scrap}× Żelazny złom.`);state.player.gold-=q.gold;if(q.scrap)removeItem('scrap',q.scrap);i.upgrade=up+1;save();openBuilding('smith','service');toast(`${itemDef(i.id).name} ulepszono do +${i.upgrade} • -${q.gold} 🪙`)}
function enchantItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const reroll=!!i.enchant,q=enchantQuote(i,reroll);if(state.player.gold<q.gold)return toast(`Potrzebujesz ${q.gold} złota.`);if(countItem('crystal')<q.crystal)return toast(`Potrzebujesz ${q.crystal}× Odłamek kryształu.`);if(q.shard&&countItem('runeShard')<q.shard)return toast('Przerzut wymaga 1× Odłamka Runicznego.');state.player.gold-=q.gold;removeItem('crystal',q.crystal);if(q.shard)removeItem('runeShard',q.shard);let pool=[{name:'Płomień',power:4},{name:'Bastion',armor:4},{name:'Sokole Oko',crit:4}];if(i.enchant)pool=pool.filter(x=>x.name!==i.enchant.name);i.enchant={...pick(pool)};i.enchantRolls=(i.enchantRolls||0)+(reroll?1:0);save();openBuilding('smith','service');toast(`${reroll?'Przerzucono':'Zaklęto'}: ${itemDef(i.id).name} • ${i.enchant.name}`)}
function socketRune(uidv,runeId){const i=state.player.inventory.find(x=>x.uid===uidv),r=itemDef(runeId);if(!i||i.rune)return;if(!countItem(runeId))return toast(`Brakuje: ${r.name}`);removeItem(runeId,1);i.rune=runeId;save();openBuilding('smith','service');toast(`${r.name} została osadzona w ${itemDef(i.id).name}.`)}
function unsocketRune(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i?.rune)return;const cost=35+rarityRank(itemDef(i.id).rarity)*10;if(state.player.gold<cost)return toast(`Wyjęcie runy kosztuje ${cost} 🪙.`);const rune=i.rune;if(!requireItemRoom([{id:rune,qty:1}]))return;state.player.gold-=cost;i.rune=null;addItem(rune);save();openBuilding('smith','service');toast(`Odzyskano ${itemDef(rune).name} • -${cost} 🪙`)}
function craftRecipe(id){const r=RECIPES.find(x=>x.id===id);if(!r)return;const out=itemDef(r.result);if(out.slot&&!itemClassAllowed(out))return toast(`${out.name}: receptura dla ${itemClassNames(out)}.`);const fee=craftFee(r);for(const [ing,q] of Object.entries(r.ingredients))if(countItem(ing)<q)return toast(`Brakuje: ${q}× ${itemDef(ing).name}`);if(state.player.gold<fee)return toast(`Crafting kosztuje ${fee} 🪙.`);if(!requireItemRoom([{id:r.result,qty:r.qty||1}],r.ingredients))return;for(const [ing,q] of Object.entries(r.ingredients))removeItem(ing,q);state.player.gold-=fee;addItem(r.result,r.qty);save();openBuilding(r.station==='smith'?'smith':'alchemist','service');toast(`${r.station==='smith'?'Wykuto':'Uwarzono'}: ${r.name} • -${fee} 🪙`)}

function renderSocial(el){el.innerHTML='<div class="section-title"><h2>Społeczność</h2><span class="pill">W PRZYGOTOWANIU</span></div><div class="panel-item"><h3>Przygoda jednoosobowa</h3><p>Drużyny, PvP i handel między graczami wymagają wspólnego serwera. Obecna wersja zapisuje Twoją przygodę na tym urządzeniu.</p></div>'}

function openPlayer(x){openModal(`<div class="modal-head"><div><h2>${x.n}</h2><div class="muted">${CLASSES[x.c].name} • lvl ${x.l}</div></div><button class="close" data-close>×</button></div><div class="tabs"><button class="secondary" data-social="party">➕ Drużyna</button><button class="secondary" data-social="pvp">⚔️ PvP</button><button class="secondary" data-social="trade">🤝 Handel</button><button class="secondary" data-social="profile">👤 Profil</button><button class="secondary" data-social="friend">⭐ Znajomy</button></div><p class="muted">Funkcje sieciowe są celowo odłożone na późniejszy etap.</p>`);document.querySelectorAll('[data-social]').forEach(b=>b.onclick=()=>toast(`„${b.textContent.trim()}” — multiplayer jest obecnie wyłączony.`))}


function isStandalone(){return window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true}
function isIos(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
async function installPwa(){
 if(isStandalone())return toast('Time4Heroes jest już uruchomione jako aplikacja.');
 if(installPromptEvent){installPromptEvent.prompt();const r=await installPromptEvent.userChoice;installPromptEvent=null;if(r.outcome==='accepted')toast('Time4Heroes zostało dodane do telefonu.');return}
 if(isIos()){openModal(`<div class="modal-head"><div><h2>📲 Zainstaluj Time4Heroes</h2><div class="muted">iPhone / iPad</div></div><button class="close" data-close>×</button></div><div class="install-steps"><div><b>1</b><span>Otwórz grę w Safari.</span></div><div><b>2</b><span>Naciśnij ikonę <strong>Udostępnij</strong>.</span></div><div><b>3</b><span>Wybierz <strong>Do ekranu początkowego</strong>.</span></div><div><b>4</b><span>Potwierdź „Dodaj”.</span></div></div>`);return}
 openModal(`<div class="modal-head"><div><h2>📲 Zainstaluj Time4Heroes</h2><div class="muted">Android / Chrome</div></div><button class="close" data-close>×</button></div><p>Jeżeli przycisk instalacji nie pojawił się automatycznie, otwórz menu przeglądarki <b>⋮</b> i wybierz <b>Dodaj do ekranu głównego</b> albo <b>Zainstaluj aplikację</b>.</p>`)
}


function renderMore(el){ensureCoreState();const soundOn=!!state.settings.masterSound;el.innerHTML=`<div class="section-title"><h2>☰ Menu</h2><span class="pill">Build 3.0.7</span></div><div class="panel-list"><div class="panel-item"><b>🗺️ Mapa i eksploracja</b><div class="muted">Narzędzia mapy są tutaj, żeby ekran rozgrywki został czysty.</div><div class="settings-toggles"><button class="secondary" data-menu-gps>${gpsWatch!==null?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button><button class="secondary" data-menu-center>🎯 Do mnie</button><button class="secondary" data-map-mode>👁️ Widok: ${state.settings.mapMode==='focused'?'Skupiony':'Pełny'}</button><button class="secondary" data-explorer-journal>🧭 Dziennik odkrywcy</button><button class="secondary" data-fast-travel>⚡ Podróż</button></div><details class="menu-map-layers"><summary>Warstwy mapy</summary><div class="settings-toggles">${[['monster','👹 Potwory'],['poi','📌 Miejsca'],['dungeon','🕳️ Lochy'],['event','✨ Eventy'],['biome','🌿 Biomy'],['trail','👣 Ślad']].map(([k,n])=>`<button class="filter-btn ${state.settings.mapFilters[k]?'active':''}" data-filter="${k}">${n}</button>`).join('')}</div></details></div><div class="panel-item"><b>📜 Przygoda</b><div class="muted">Zadania, wydarzenia, wyprawy i bestiariusz są zebrane w jednym dzienniku.</div><div class="settings-toggles"><button class="secondary" data-menu-quests>📜 Questy</button><button class="secondary" data-menu-events>✨ Wydarzenia</button><button class="secondary" data-menu-trips>🧭 Wyprawy</button><button class="secondary" data-menu-bestiary>📖 Bestiariusz</button></div></div><div class="panel-item"><b>🔊 Dźwięk</b><div class="muted">Jeden główny przełącznik wycisza jednocześnie efekty i ambient.</div><div class="settings-toggles"><button class="secondary ${soundOn?'active':''}" data-master-sound>${soundOn?'🔊 Dźwięk: WŁ.':'🔇 Dźwięk: WYŁ.'}</button><button class="secondary" data-haptics>${state.settings.haptics?'📳 Wibracje: WŁ.':'📴 Wibracje: WYŁ.'}</button></div></div><div class="panel-item"><b>🎓 Samouczek</b><div class="muted">Wskazówka pojawia się na mapie i można ją zamknąć bez wyłączania samouczka. Pełny postęp jest w Questach.</div><button class="secondary" data-restart-tutorial>Uruchom od początku</button></div><div class="panel-item mobile-install-card"><b>📲 Time4Heroes na telefonie</b><button class="secondary" data-install-app>${isStandalone()?'✅ Aplikacja zainstalowana':'Zainstaluj na telefonie'}</button></div><div class="panel-item"><b>💾 Zapis gry</b><div class="tabs" style="margin-top:8px"><button class="secondary" data-export>Eksportuj</button><button class="secondary" data-import>Importuj</button><input type="file" id="saveFile" accept="application/json" hidden></div></div><div class="panel-item"><b>${SAVE_KEY===DEMO_SAVE_KEY?'🧪 Osobna przygoda testowa':'📍 Przygoda GPS'}</b><p class="muted">Testy mają osobny zapis. Strzałki i symulacja nocy nie zmieniają postępu przygody GPS.</p><button class="secondary" data-play-mode>${SAVE_KEY===DEMO_SAVE_KEY?'Wróć do przygody GPS':'Otwórz kopię do testów'}</button><button class="secondary" data-night>${state.settings.forceNight?'Wyłącz symulację nocy':'Włącz symulację nocy'}</button></div><div class="panel-item reset-character-card"><b>🧪 Reset postaci do testów</b><div class="muted">Usuwa lokalny save oraz stare save’y migracyjne i wraca prosto do kreatora postaci.</div><button class="danger" data-reset-character>Resetuj postać</button></div></div>`;
 el.querySelector('[data-install-app]')?.addEventListener('click',installPwa);el.querySelector('[data-export]').onclick=exportSave;el.querySelector('[data-import]').onclick=()=>document.querySelector('#saveFile').click();document.querySelector('#saveFile').onchange=importSave;el.querySelector('[data-play-mode]').onclick=switchPlayMode;el.querySelector('[data-night]').disabled=SAVE_KEY!==DEMO_SAVE_KEY;el.querySelector('[data-night]').onclick=()=>{state.settings.forceNight=!state.settings.forceNight;save();renderMore(el)};el.querySelector('[data-master-sound]').onclick=()=>{toggleMasterSound();renderMore(el)};el.querySelector('[data-haptics]').onclick=()=>{state.settings.haptics=!state.settings.haptics;save();renderMore(el)};el.querySelector('[data-restart-tutorial]').onclick=()=>{state.tutorial={stage:0,complete:false,rewardGiven:true,flags:{},introSeen:true,finishReward:true,mapDismissedStage:-1};save();selectNav('map')};el.querySelector('[data-reset-character]').onclick=resetCharacter;el.querySelector('[data-menu-gps]').onclick=()=>{toggleGps();setTimeout(()=>{if(currentTab==='menu')renderMore(el)},120)};el.querySelector('[data-menu-center]').onclick=centerMapOnPlayer;el.querySelector('[data-map-mode]').onclick=()=>{state.settings.mapMode=state.settings.mapMode==='focused'?'full':'focused';save();renderMore(el)};el.querySelector('[data-explorer-journal]').onclick=openExplorerJournal;el.querySelector('[data-fast-travel]').onclick=openFastTravel;el.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.settings.mapFilters[b.dataset.filter]=!state.settings.mapFilters[b.dataset.filter];save();renderMore(el)});el.querySelector('[data-menu-quests]').onclick=openQuestView;el.querySelector('[data-menu-events]').onclick=()=>{state.ui.adventureView='events';save();selectNav('adventureHub')};el.querySelector('[data-menu-trips]').onclick=()=>{state.ui.adventureView='trips';save();selectNav('adventureHub')};el.querySelector('[data-menu-bestiary]').onclick=()=>{state.ui.adventureView='bestiary';save();selectNav('adventureHub')}}

function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=SAVE_KEY===DEMO_SAVE_KEY?'time4heroes-3.9.0-TEST-save.json':'time4heroes-3.9.0-GPS-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function validateSessionSave(raw){
 const session=raw.session;if(!session)return;
 const c=session.combat,d=session.dungeonRun,r=session.battleResult;
 if(c&&(!MONSTERS.some(m=>m.id===c.monster?.id)||!c.entity||!Array.isArray(c.log)||!Number.isFinite(c.hp)||!Number.isFinite(c.maxHp)||!['player','enemyDelay','enemyResult'].includes(c.phase)||!BIOMES[c.environment?.biomeId]||!c.environment?.effect))throw Error('Nieprawidłowa walka');
 if(d&&(!DUNGEONS.some(x=>x.id===d.id)||!Number.isInteger(d.size)||d.size<1||d.size>16||!Array.isArray(d.grid)||d.grid.length!==d.size||!d.grid.every(row=>Array.isArray(row)&&row.length===d.size&&row.every(cell=>cell&&typeof cell==='object'))||!Number.isInteger(d.x)||!Number.isInteger(d.y)||!d.grid[d.y]?.[d.x]||!Number.isFinite(d.deadline)))throw Error('Nieprawidłowy loch');
 if(r&&(!Array.isArray(r.drops)||r.drops.some(drop=>!ITEMS[drop.id]||!Number.isInteger(drop.qty)||drop.qty<1)))throw Error('Nieprawidłowe łupy');
}

function importSave(e){
 const f=e.target.files?.[0];if(!f)return;if(f.size>5*1024*1024)return toast('Plik zapisu jest zbyt duży.');
 const r=new FileReader();r.onload=()=>{try{
  const raw=JSON.parse(r.result);if(!raw?.player||!CLASSES[raw.player.class]||!Array.isArray(raw.player.inventory)||!Number.isFinite(raw.player.level)||raw.player.level<1||raw.player.level>100)throw Error('Nieprawidłowa postać');
  if(SAVE_KEY===REAL_SAVE_KEY&&raw.playMode==='sandbox')return toast('To zapis testowy. Otwórz kopię testową w Menu, aby go importować.');validateSessionSave(raw);const next=normalizeState(raw);if(combat)combat.turnToken++;clearDungeonTimer();if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;
  combat=null;dungeonRun=null;battleResult=null;closeModal();state=next;restoreSession();save();render();resumeSession();toast('Zapis zaimportowany.');
 }catch{toast('Nieprawidłowy plik zapisu — bieżący postęp zachowano.')}};r.readAsText(f);
}



const SKILL_COMBAT_META={
 shield:{type:'obuch',interrupt:true,stagger:38},fortress:{type:'obuch',stagger:5},lastStand:{type:'obuch',stagger:6},counter:{type:'obuch',stagger:24},breaker:{type:'obuch',interrupt:true,stagger:44},riposte:{type:'krwawienie',stagger:30},taunt:{type:'obuch',interrupt:true,stagger:30},rally:{type:'fizyczne',stagger:4},banner:{type:'fizyczne',stagger:4},
 fire:{type:'ogień',stagger:18},elemental:{type:'ogień',stagger:28},meteor:{type:'ogień',stagger:40},frost:{type:'lód',interrupt:true,stagger:34},iceArmor:{type:'lód',stagger:5},frostNova:{type:'lód',interrupt:true,stagger:42},spark:{type:'arkanum',stagger:22},arcaneSurge:{type:'arkanum',stagger:4},arcaneRift:{type:'arkanum',interrupt:true,stagger:45},
 double:{type:'przebicie',stagger:20},mark:{type:'przebicie',stagger:14},eagleEye:{type:'przebicie',interrupt:true,stagger:36},petStrike:{type:'przebicie',stagger:26},pack:{type:'przebicie',stagger:28},beastFury:{type:'krwawienie',stagger:34},volley:{type:'przebicie',stagger:30},camouflage:{type:'pułapki',stagger:4},piercingShot:{type:'przebicie',interrupt:true,stagger:46},
 rage:{type:'krwawienie',stagger:22},roar:{type:'krwawienie',interrupt:true,stagger:34},berserk:{type:'krwawienie',stagger:34},cleave:{type:'krwawienie',stagger:26},blood:{type:'krwawienie',stagger:30},execution:{type:'krwawienie',stagger:38},dualCut:{type:'krwawienie',stagger:24},whirlwind:{type:'krwawienie',stagger:34},bloodRush:{type:'krwawienie',stagger:4},
 poison:{type:'trucizna',stagger:18},destiny:{type:'przebicie',stagger:30},venomRain:{type:'trucizna',stagger:32},trap:{type:'pułapki',interrupt:true,stagger:35},vine:{type:'pułapki',stagger:28},snareShot:{type:'pułapki',interrupt:true,stagger:40},spirit:{type:'arkanum',stagger:25},windStep:{type:'pułapki',stagger:4},wildFocus:{type:'przebicie',stagger:4}
};
const FAMILY_RESISTS={
 'Nieumarli':['trucizna'],
 'Zjawy':['krwawienie','obuch'],
 'Demony':['ogień'],
 'Żywiołaki':['obuch'],
 'Owady':['trucizna']
};
function combatSkillMeta(skill){return skill?SKILL_COMBAT_META[skill.id]||{type:'fizyczne',stagger:18}:{type:'fizyczne',stagger:10}}
function weaknessMod(type){
 const weak=combat?.monster?.weak, family=combat?.monster?.family, resisted=(FAMILY_RESISTS[family]||[]).includes(type);
 if(type&&weak===type)return {mult:1.25,label:'SŁABOŚĆ',kind:'weak'};
 if(resisted)return {mult:.72,label:'ODPORNOŚĆ',kind:'resist'};
 return {mult:1,label:'',kind:''};
}
function bossIntentInfo(intent){
 if(!intent)return {icon:'👁️',name:'Obserwuje',hint:'Boss czeka na Twój ruch.'};
 return ({
  smash:{icon:'💥',name:'Niszczycielski cios',hint:'Obrona mocno zmniejszy obrażenia. Skill PRZERWIJ może całkiem zatrzymać atak.'},
  hex:{icon:'🕯️',name:'Klątwa osłabienia',hint:'Przerwij przygotowanie albo stracisz część mocy i many.'},
  ward:{icon:'🛡️',name:'Runiczna osłona',hint:'Boss założy silną barierę. Przerwanie lub przełamanie zatrzyma rytuał.'},
  frenzy:{icon:'⚔️',name:'Szał bossa',hint:'Dwa szybkie uderzenia. Obrona i blok są tu bardzo cenne.'}
 })[intent.type]||{icon:'⚠️',name:'Nieznany zamiar',hint:'Przygotuj się.'};
}
function chooseBossIntent(){
 const phase=combat.bossPhase||1, roll=(combat.enemyTurns+combat.level+combat.monster.id.length)%3;
 if(phase===1)return roll===1?{type:'ward',interruptible:true}:{type:'smash',interruptible:true};
 if(phase===2)return roll===0?{type:'smash',interruptible:true}:roll===1?{type:'hex',interruptible:true}:{type:'ward',interruptible:true};
 return roll===0?{type:'frenzy',interruptible:true}:roll===1?{type:'smash',interruptible:true}:{type:'hex',interruptible:true};
}
function startCombat(entity,opts={}){
 if(combat||battleResult)return;
 const m=monsterTemplate(entity),lvl=opts.level||monsterLevel(m),environment=combatEnvironment(m),scale=.66+lvl*.075,isDungeonBoss=!!opts.dungeon?.boss,isWorldBoss=!!opts.worldBoss,isBoss=isWorldBoss||isDungeonBoss||!!entity.elite,bossHpMult=isDungeonBoss?1.42:isWorldBoss?1.58:entity.elite?1.12:1,bossAtkMult=isDungeonBoss?1.18:isWorldBoss?1.25:entity.elite?1.08:1,maxHp=Math.max(24,Math.floor(m.hp*scale*bossHpMult)),atk=Math.max(4,Math.floor(m.atk*(.62+lvl*.045)*bossAtkMult*environment.enemyDamage));
 combat={entity,monster:m,level:lvl,maxHp,hp:maxHp,atk,baseAtk:atk,environment,log:[`${m.name} staje do walki.`,`${BIOMES[environment.biomeId].icon} ${environment.effect.title}: ${environment.effect.summary}.`],guard:0,debuff:0,debuffTurns:0,poison:0,poisonTurns:0,bleed:0,bleedTurns:0,burn:0,burnTurns:0,freezeTurns:0,mark:0,markTurns:0,dungeon:opts.dungeon||null,worldBoss:isWorldBoss,isBoss,bossPhase:1,enemyTurns:0,intent:null,stagger:0,staggerMax:isBoss?100:0,stunned:0,vulnerableTurns:0,barrier:0,barrierTurns:0,playerWeaken:0,playerWeakenTurns:0,playerCritBuff:0,playerCritBuffTurns:0,playerDodgeBuff:0,playerDodgeBuffTurns:0,playerPowerBuff:0,playerPowerBuffTurns:0,playerBlockBuff:0,playerBlockBuffTurns:0,cooldowns:{},lastPlayerHit:null,lastEnemyHit:null,turnDealt:null,turnTaken:null,turnDealtNote:'',turnTakenNote:'',phase:'player',turnToken:0,storyConsequence:opts.storyConsequence||null,worldEvent:opts.worldEvent||null};
 if(m.variantId!=='normal')combat.log.push(`${m.variantIcon} Odmiana ${m.variantLabel}: HP ×${monsterVariantDef(m.variantId).hp.toFixed(2)}, ATK ×${monsterVariantDef(m.variantId).atk.toFixed(2)}, łup ×${m.variantLoot.toFixed(2)}.`);
 if(isDungeonBoss)combat.log.push('👑 Boss lochu jest wyraźnie silniejszy od zwykłych przeciwników.');
 save();openCombat();
}
function openCombat(){
 const c=combat,p=state.player;if(!c)return;setAmbient(c.isBoss?'boss':'battle');const cl=climate(),pet=petInstance(),intent=bossIntentInfo(c.intent),resists=(FAMILY_RESISTS[c.monster.family]||[]),locked=c.phase!=='player',phaseLabel=c.phase==='enemyDelay'?'TWÓJ CIOS…':c.phase==='enemyResult'?'PRZECIWNIK ODPOWIADA':'TURA GRACZA';
 app.innerHTML=`<div class="battle-screen ${c.dungeon?'dungeon-battle':''} theme-${battleTheme(c.monster)} fx-${c.fx||'idle'}"><div class="battle-top"><div><span class="build-chip">WALKA 3.0.7</span><h2>${c.worldBoss?'🌍 Boss świata':c.dungeon?'🕳️ Komnata lochu':'⚔️ Spotkanie w świecie'}</h2></div><div>${c.dungeon&&dungeonRun?`⏱️ <span data-dungeon-timer>${formatClock(dungeonRemainingSec())}</span> • `:''}${cl.icon} ${cl.weather} • ${cl.phase}</div></div><div class="battle-arena"><div class="arena-layer layer-back"></div><div class="combatant hero-side ${c.lastEnemyHit?'combat-hit':''}"><div class="combat-name"><b>${p.name}</b><span>${CLASSES[p.class].name} • lvl ${p.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap bigbar"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div class="battle-sprite hero-sprite"><div>${classVisual(p.class,'sprite-battle')}</div><span class="shadow"></span>${c.lastEnemyHit?`<strong class="float-damage hero-damage">-${c.lastEnemyHit}</strong>`:''}</div>${pet?`<div class="battle-pet"><span>${petVisual(pet.id,'sprite-pet')}</span><small>${petDef(pet.id).name} lvl ${pet.level}</small></div>`:''}${c.playerWeakenTurns?`<div class="player-status-chip">⬇️ Osłabienie ${c.playerWeakenTurns}</div>`:''}${c.playerCritBuffTurns?`<div class="player-status-chip buff">🎯 Krytyk +${c.playerCritBuff}%</div>`:''}${c.playerDodgeBuffTurns?`<div class="player-status-chip buff">💨 Unik +${c.playerDodgeBuff}%</div>`:''}${c.playerPowerBuffTurns?`<div class="player-status-chip buff">⚔️ Moc +${c.playerPowerBuff}%</div>`:''}${c.playerBlockBuffTurns?`<div class="player-status-chip buff">🛡️ Blok +${c.playerBlockBuff}%</div>`:''}</div><div class="battle-center"><div class="versus">VS</div><div class="turn-indicator">${phaseLabel}</div>${c.isBoss?`<div class="break-wrap"><small>PRZEŁAMANIE</small><div class="break-bar"><span style="width:${Math.min(100,c.stagger)}%"></span></div><b>${Math.floor(c.stagger)}/${c.staggerMax}</b></div>`:''}</div><div class="combatant enemy-side ${c.lastPlayerHit?'combat-hit':''}"><div class="combat-name"><b>${c.entity.elite?'⭐ ':''}${c.monster.name}</b><span>${c.monster.family} • lvl ${c.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp enemyhp" style="width:${100*Math.max(0,c.hp)/c.maxHp}%"></div><div class="barlabel">HP ${Math.max(0,c.hp)}/${c.maxHp}</div></div><div class="status-row">${c.poisonTurns?`<span>☠️ Trucizna ${c.poisonTurns}</span>`:''}${c.bleedTurns?`<span>🩸 Krwawienie ${c.bleedTurns}</span>`:''}${c.burnTurns?`<span>🔥 Podpalenie ${c.burnTurns}</span>`:''}${c.freezeTurns?`<span>❄️ Zamrożenie ${c.freezeTurns}</span>`:''}${c.debuffTurns?`<span>⬇️ Osłabienie ${c.debuffTurns}</span>`:''}${c.markTurns?`<span>🎯 Znak ${c.markTurns}</span>`:''}${c.barrierTurns?`<span>🛡️ Bariera ${c.barrierTurns}</span>`:''}${c.vulnerableTurns?`<span>💢 Przełamany</span>`:''}</div></div><div class="battle-sprite enemy-sprite"><div>${monsterVisual(c.monster.id,'sprite-battle')}</div><span class="shadow"></span>${c.lastPlayerHit?`<strong class="float-damage enemy-damage">-${c.lastPlayerHit}</strong>`:''}</div><div class="enemy-meta"><span>ATK ${c.atk}</span><span class="weak-meta">🎯 ${c.monster.weak||'brak'}</span>${resists.length?`<span class="resist-meta">🧱 ${resists.join(', ')}</span>`:''}</div>${c.isBoss?`<div class="boss-intent ${c.intent?'danger-intent':''}"><b>${intent.icon} ${c.intent?intent.name:'Faza '+c.bossPhase}</b><small>${c.intent?intent.hint:'Zapełnij pasek przełamania, aby ogłuszyć bossa.'}</small></div>`:''}</div></div><div class="battle-bottom"><div class="combat-feedback-column">${combatExchangeHTML()}<details class="combat-log"><summary>Dziennik walki</summary>${c.log.slice(-7).map(x=>`<div>› ${x}</div>`).join('')}</details></div><div><div class="skill-hotbar"><button class="battle-skill basic" data-attack ${locked||(['hunter','ranger'].includes(p.class)&&!countItem('primitiveArrow'))?'disabled':''}><span>${['hunter','ranger'].includes(p.class)?'🏹':'⚔️'}</span><b>Atak</b><small>${['hunter','ranger'].includes(p.class)?`➶ ${countItem('primitiveArrow')}`:'+10 przeł.'}</small></button><button class="battle-skill defend-skill" data-defend ${locked?'disabled':''}><span>🛡️</span><b>Obrona</b><small>na 1 turę</small></button>${p.skills.map(id=>skillDef(id)).filter(Boolean).map(s=>{const meta=combatSkillMeta(s),cd=c.cooldowns?.[s.id]||0,blocked=locked||p.mana<s.mana||cd>0||(['hunter','ranger'].includes(p.class)&&countItem('primitiveArrow')<rangedAmmoCost(s));return `<button class="battle-skill ${c.intent&&meta.interrupt?'interrupt-ready':''} ${cd?'skill-cooldown':''}" data-skill="${s.id}" ${blocked?'disabled':''}><span>${skillIconVisual(s.id,'combat-skill-svg')}</span><b>${s.name}</b><small>${cd?`⏳ CD ${cd}`:`${s.mana} many • ${meta.type}${meta.interrupt?' • PRZERWIJ':''}`}</small></button>`}).join('')}${['potion','strongPotion','manaPotion'].map(id=>{const d=itemDef(id),full=d.heal?p.hp>=p.maxHp:p.mana>=p.maxMana;return `<button class="battle-skill potion-skill" data-combat-potion="${id}" ${locked||!countItem(id)||full?'disabled':''}><span>${itemIconVisual(id,'combat-item-icon')}</span><b>${id==='manaPotion'?'Mana':id==='strongPotion'?'Duże leczenie':'Leczenie'}</b><small>+${d.heal||d.mana} ${d.mana?'many':'HP'} • ${countItem(id)} szt.</small></button>`}).join('')}<button class="battle-skill flee-skill" data-flee ${locked?'disabled':''}><span>🏃</span><b>Ucieczka</b><small>${c.dungeon?'zablokowana':'70%'}</small></button></div><div class="combat-help"><span>🎯 traf w słabość: +25%</span><span>🧱 odporność: −28%</span><span>💢 100 przełamania = ogłuszenie</span><span>💨 unik ${dodgeChance().toFixed(0)}% • 🛡️ blok ${blockChance().toFixed(0)}%</span></div></div></div></div>`;
 const battleScreen=document.querySelector('.battle-screen');if(battleScreen){battleScreen.style.setProperty('--battle-bg',`url('${battleBackdrop(c)}')`);for(const cls of battleAtmosphereClass(c).split(' ').filter(Boolean))battleScreen.classList.add(cls)}
 const battleChip=document.querySelector('.battle-top .build-chip');if(battleChip)battleChip.textContent=`WALKA ${BUILD_VERSION}`;
 const contextHost=document.querySelector('.battle-arena');if(contextHost){const banner=document.createElement('div');banner.className='battle-environment-effect';banner.innerHTML=`<span>${BIOMES[c.environment.biomeId].icon}</span><div><b>${BIOMES[c.environment.biomeId].name} — ${c.environment.effect.title}</b><small>${c.environment.effect.summary} • ${cl.icon} ${cl.weather} • ${cl.phase}</small></div>`;contextHost.before(banner)}
 if(c.dungeon&&dungeonRun)startDungeonTimer();document.querySelector('[data-attack]').onclick=()=>playerAction(null);document.querySelector('[data-defend]').onclick=defendAction;document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>playerAction(skillDef(b.dataset.skill)));document.querySelectorAll('[data-combat-potion]').forEach(b=>b.addEventListener('click',()=>combatPotion(b.dataset.combatPotion)));document.querySelector('[data-flee]').onclick=fleeCombat;
 setTimeout(()=>{if(combat&&combat.phase==='player'){combat.lastPlayerHit=null;combat.lastEnemyHit=null;combat.fx='idle'}},1050);
}
function logCombat(t){combat.log.push(t)}
function resetCombatExchange(){if(!combat)return;combat.turnDealt=0;combat.turnTaken=0;combat.turnDealtNote='';combat.turnTakenNote=''}
function addCombatDealt(amount,note=''){if(!combat)return;combat.turnDealt=(combat.turnDealt||0)+Math.max(0,amount||0);if(note)combat.turnDealtNote=note}
function setCombatTaken(amount,note=''){if(!combat)return;combat.turnTaken=Math.max(0,amount||0);combat.turnTakenNote=note||''}
function combatExchangeHTML(){if(!combat)return '';const dealt=combat.turnDealt,taken=combat.turnTaken,has=dealt!==null||taken!==null;if(!has)return `<div class="combat-exchange empty"><span>Wybierz akcję, aby rozpocząć wymianę ciosów.</span></div>`;return `<div class="combat-exchange"><div class="exchange-card dealt"><small>⚔️ ZADAŁEŚ</small><b>${dealt??0}</b><span>${combat.turnDealtNote||'obrażeń'}</span></div><div class="exchange-card taken"><small>🩸 OTRZYMAŁEŚ</small><b>${taken??0}</b><span>${combat.turnTakenNote||'obrażeń'}</span></div></div>`}
function hitDamage(mult=1,critBonus=0,type='fizyczne'){
 const p=state.player,miss=Math.random()*100>=hitChance();
 if(miss){combat.fx='idle';return {dmg:0,crit:false,weak:false,resist:false,type,miss:true}}
 const crit=Math.random()*100<critChance()+(combat.mark||0)+(combat.playerCritBuff||0)+critBonus,weak=weaknessMod(type),weaken=1-(combat.playerWeaken||0),vulnerable=combat.vulnerableTurns?1.35:1,barrier=combat.barrierTurns?.55:1,powerBuff=1+(combat.playerPowerBuff||0)/100,berserkMult=p.class==='berserker'?1+(1-p.hp/p.maxHp)*.25:1,storyMult=combat.monster.family==='Natura'&&storyChoiceFor('q2')==='finish'?1.05:1,environmentMult=(combat.environment?.damage||1)*(type==='trucizna'?(combat.environment?.poison||1):1),base=rollPlayerBaseDamage()*mult,dmg=Math.max(1,Math.floor(base*(crit?1.65:1)*weak.mult*weaken*vulnerable*barrier*powerBuff*berserkMult*storyMult*environmentMult));
 if(crit){combat.fx='crit';playSfx('crit');haptic(22)}else{combat.fx=weak.kind==='weak'?'weak':'hit';playSfx('hit')}if(weak.kind==='weak')haptic(12);return {dmg,crit,weak:weak.kind==='weak',resist:weak.kind==='resist',type,miss:false};
}
function hitSuffix(h){return `${h.miss?' • PUDŁO':''}${h.crit?' • KRYTYK':''}${h.weak?' • 🎯 SŁABOŚĆ':''}${h.resist?' • 🧱 ODPORNOŚĆ':''}`}
function applySkillStatus(skill,hit=null){
 if(!skill||!skill.status||hit?.miss)return;const chance=Math.min(1,(skill.statusChance??1)+(state.player.class==='mage'?.08:0));if(Math.random()>chance)return;const turns=skill.statusTurns||2;
 if(skill.status==='bleed'){combat.bleed=Math.max(combat.bleed,Math.max(3,Math.floor(attackPower()*.13)));combat.bleedTurns=Math.max(combat.bleedTurns,turns);logCombat(`🩸 ${combat.monster.name} krwawi przez ${turns} tury.`)}
 else if(skill.status==='burn'){combat.burn=Math.max(combat.burn,Math.max(4,Math.floor(attackPower()*.15)));combat.burnTurns=Math.max(combat.burnTurns,turns);logCombat(`🔥 Cel zostaje podpalony na ${turns} tury.`)}
 else if(skill.status==='freeze'){combat.freezeTurns=Math.max(combat.freezeTurns,turns);logCombat(`❄️ Cel zostaje zamrożony na ${turns} tury.`)}
 else if(skill.status==='stun'){combat.stunned=Math.max(combat.stunned,1);logCombat('💫 Przeciwnik zostaje ogłuszony i straci akcję.')}
}
function applyPlayerBuff(skill){
 if(!skill||skill.kind!=='buff')return;const turns=skill.turns||2,val=skill.value||15,key=skill.buff;
 if(key==='crit'){combat.playerCritBuff=Math.max(combat.playerCritBuff,val);combat.playerCritBuffTurns=Math.max(combat.playerCritBuffTurns,turns)}
 if(key==='dodge'){combat.playerDodgeBuff=Math.max(combat.playerDodgeBuff,val);combat.playerDodgeBuffTurns=Math.max(combat.playerDodgeBuffTurns,turns)}
 if(key==='power'){combat.playerPowerBuff=Math.max(combat.playerPowerBuff,val);combat.playerPowerBuffTurns=Math.max(combat.playerPowerBuffTurns,turns)}
 if(key==='block'){combat.playerBlockBuff=Math.max(combat.playerBlockBuff,val);combat.playerBlockBuffTurns=Math.max(combat.playerBlockBuffTurns,turns);combat.guard=Math.max(combat.guard,1)}
 logCombat(`${skill.name}: aktywny efekt ${key} przez ${turns} tury.`)
}
function tickCombatCooldowns(){for(const id of Object.keys(combat.cooldowns||{})){combat.cooldowns[id]=Math.max(0,(combat.cooldowns[id]||0)-1);if(!combat.cooldowns[id])delete combat.cooldowns[id]}}
function tickPlayerBuffs(){for(const [turnKey,valKey] of [['playerCritBuffTurns','playerCritBuff'],['playerDodgeBuffTurns','playerDodgeBuff'],['playerPowerBuffTurns','playerPowerBuff'],['playerBlockBuffTurns','playerBlockBuff']]){if(combat[turnKey]>0&&--combat[turnKey]===0)combat[valKey]=0}}
function addStagger(amount){
 if(!combat?.isBoss||amount<=0)return false;combat.stagger=Math.min(combat.staggerMax,combat.stagger+amount);
 if(combat.stagger>=combat.staggerMax){combat.stagger=0;combat.stunned=1;combat.vulnerableTurns=1;if(combat.intent){logCombat('💥 Przełamanie przerywa zamiar bossa!');combat.intent=null}else logCombat('💥 Boss zostaje PRZEŁAMANY i traci następną akcję!');playSfx('boss');haptic([30,20,45]);return true}return false;
}
function interruptIntent(skill,meta){
 if(!combat?.intent||!meta?.interrupt||!combat.intent.interruptible)return false;const info=bossIntentInfo(combat.intent);combat.intent=null;combat.stunned=1;combat.stagger=Math.min(combat.staggerMax,combat.stagger+20);logCombat(`✋ ${skill.name} przerywa: ${info.name}. Boss traci akcję.`);playSfx('boss');haptic([20,20,30]);return true;
}
function afterPlayerAttack(meta,hits=1){
 addStagger((meta?.stagger||10)+Math.max(0,hits-1)*4);
 if(combat.barrierTurns>0&&--combat.barrierTurns===0){combat.barrier=0;logCombat('Runiczna bariera przeciwnika wygasa.')}
 if(combat.vulnerableTurns>0)combat.vulnerableTurns--;
}
function rangedAmmoCost(skill){if(!['hunter','ranger'].includes(state.player.class))return 0;if(!skill)return 1;if(['buff','debuff','mark','guard'].includes(skill.kind))return 0;if(skill.kind==='multi')return Math.max(1,skill.hits||1);return 1}
function playerAction(skill){
 if(!combat||combat.phase!=='player')return;resetCombatExchange();const ammoCost=rangedAmmoCost(skill),cd=skill?(combat.cooldowns?.[skill.id]||0):0;if(cd)return toast(`Umiejętność gotowa za ${cd} tur.`);if(skill&&state.player.mana<skill.mana)return toast('Za mało many.');if(ammoCost&&countItem('primitiveArrow')<ammoCost)return toast(`Brak strzał. Potrzebujesz ${ammoCost}.`);if(ammoCost)removeItem('primitiveArrow',ammoCost);if(skill){state.player.mana-=skill.mana;if(skill.cooldown)combat.cooldowns[skill.id]=(skill.cooldown||0)+1}const meta=combatSkillMeta(skill);let total=0,hits=1,lastHit=null;
 if(skill&&interruptIntent(skill,meta)){};
 if(!skill){const h=hitDamage(1,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?'Atak chybia.':`Atakujesz za ${h.dmg}${hitSuffix(h)}.`)}
 else if(skill.kind==='damage'){const h=hitDamage(skill.mult,skill.critBonus||0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?`${skill.name}: pudło.`:`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);if(!h.miss&&skill.debuff){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3}applySkillStatus(skill,h)}
 else if(skill.kind==='multi'){hits=skill.hits;let crits=0,weaks=0,resists=0,misses=0;for(let i=0;i<skill.hits;i++){const h=hitDamage(skill.mult,0,meta.type);lastHit=h;total+=h.dmg;if(h.crit)crits++;if(h.weak)weaks++;if(h.resist)resists++;if(h.miss)misses++}combat.hp-=total;logCombat(`${skill.name}: ${total} obrażeń w ${skill.hits-misses}/${skill.hits} trafieniach${crits?` • krytyki ${crits}`:''}${weaks?' • 🎯 słabość':''}${resists?' • 🧱 odporność':''}.`);if(misses<skill.hits)applySkillStatus(skill,{miss:false})}
 else if(skill.kind==='guard'){combat.guard=Math.max(combat.guard,skill.turns);logCombat(`${skill.name}: wzmacniasz obronę na ${skill.turns} tury.`)}
 else if(skill.kind==='buff'){applyPlayerBuff(skill)}
 else if(skill.kind==='debuff'){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3;logCombat(`${skill.name}: przeciwnik zostaje osłabiony.`)}
 else if(skill.kind==='mark'){combat.mark=25;combat.markTurns=skill.turns;logCombat(`${skill.name}: oznaczasz cel.`)}
 else if(skill.kind==='poison'){const h=hitDamage(skill.mult,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;if(!h.miss){combat.poison=Math.max(4,Math.floor(attackPower()*(state.player.class==='ranger'?.29:.24)*(combat.environment?.poison||1)));combat.poisonTurns=skill.turns;logCombat(`${skill.name}: ${h.dmg}${hitSuffix(h)} i trucizna.`)}else logCombat(`${skill.name}: pudło.`)}
 else if(skill.kind==='pet'){const h=hitDamage(skill.mult,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?`${skill.name}: pudło.`:`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);if(!h.miss){applySkillStatus(skill,h);petAttack(true)}}
 else if(skill.kind==='rage'){const missing=1-state.player.hp/state.player.maxHp,mult=1.2+missing*.7,h=hitDamage(mult,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?`${skill.name}: pudło.`:`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);applySkillStatus(skill,h)}
 if(total){combat.lastPlayerHit=total;addCombatDealt(total,lastHit?.crit?'KRYTYK':skill?.name||'Atak podstawowy');afterPlayerAttack(meta,hits)}else if(skill){if(lastHit?.miss)combat.turnDealtNote='PUDŁO';else if(['guard','buff','debuff','mark'].includes(skill.kind))combat.turnDealtNote=skill.name;afterPlayerAttack(meta,1)}
 if(skill?.kind!=='pet')petAttack(false);if(combat.hp<=0)return winCombat();queueEnemyTurn();
}
function defendAction(){if(!combat||combat.phase!=='player')return;resetCombatExchange();combat.turnDealtNote='OBRONA';combat.guard=Math.max(combat.guard,1);logCombat('🛡️ Przyjmujesz postawę obronną. Najbliższy cios zada znacznie mniej obrażeń.');haptic(12);queueEnemyTurn()}
function petAttack(force){const p=petInstance();if(!p)return;if(!force&&Math.random()>.35)return;const dmg=Math.max(2,Math.floor(petPower()*(.8+Math.random()*.4)));combat.hp-=dmg;combat.lastPlayerHit=(combat.lastPlayerHit||0)+dmg;addCombatDealt(dmg,'Atak + chowaniec');logCombat(`${petDef(p.id).icon} ${petDef(p.id).name} atakuje za ${dmg}.`)}
function resolveBossIntent(){
 const intent=combat.intent;if(!intent)return false;const info=bossIntentInfo(intent);combat.intent=null;
 if(intent.type==='smash'){
  combat.fx='boss';const reduction=armorPower()*.28,guardMult=combat.guard>0?.28:1,blocked=Math.random()*100<blockChance(),blockMult=blocked?.55:1,dmg=Math.max(1,Math.floor((combat.atk*2.25-reduction)*guardMult*blockMult));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;setCombatTaken(dmg,blocked||combat.guard>0?'BLOK / OBRONA':info.name);logCombat(`${combat.guard>0||blocked?'🛡️ Ograniczasz cios':'💥 Trafia Cię'}: ${info.name} za ${dmg}.`);if(combat.guard>0)combat.guard--;
 }else if(intent.type==='hex'){
  combat.playerWeaken=.28;combat.playerWeakenTurns=2;const drain=Math.min(state.player.mana,12+combat.bossPhase*4);state.player.mana-=drain;setCombatTaken(0,'KLĄTWA');logCombat(`🕯️ ${info.name}: −28% obrażeń na 2 tury i −${drain} many.`);
 }else if(intent.type==='ward'){
  combat.barrier=.45;combat.barrierTurns=2;setCombatTaken(0,'BARIERA BOSSA');logCombat('🛡️ Boss otacza się runiczną barierą: otrzymuje o 45% mniej obrażeń przez 2 Twoje akcje.');
 }else if(intent.type==='frenzy'){
  let total=0;for(let i=0;i<2;i++){const blocked=Math.random()*100<blockChance(),d=Math.max(1,Math.floor((combat.atk*1.05-armorPower()*.32)*(blocked?.55:1)));total+=d}state.player.hp=Math.max(0,state.player.hp-total);combat.lastEnemyHit=total;setCombatTaken(total,info.name);logCombat(`⚔️ ${info.name}: dwa uderzenia zadają łącznie ${total}.`);
 }
 return true;
}
function tickEnemyStatuses(){
 if(combat.debuffTurns>0&&--combat.debuffTurns===0)combat.debuff=0;if(combat.markTurns>0&&--combat.markTurns===0)combat.mark=0;if(combat.playerWeakenTurns>0&&--combat.playerWeakenTurns===0)combat.playerWeaken=0;
 if(combat.poisonTurns>0)combat.poisonTurns--;if(combat.bleedTurns>0)combat.bleedTurns--;if(combat.burnTurns>0)combat.burnTurns--;if(combat.freezeTurns>0)combat.freezeTurns--;
 tickCombatCooldowns();tickPlayerBuffs();
}
function queueEnemyTurn(delay=1100){
 if(!combat)return;combat.phase='enemyDelay';const active=combat,token=++combat.turnToken;save();openCombat();setTimeout(()=>{if(combat===active&&combat.turnToken===token&&combat.phase==='enemyDelay')enemyTurn()},delay)
}
function finishEnemyTurn(delay=1050){
 if(!combat)return;combat.phase='enemyResult';const active=combat,token=++combat.turnToken;save();openCombat();setTimeout(()=>{if(combat===active&&combat.turnToken===token&&combat.phase==='enemyResult'){combat.phase='player';combat.lastPlayerHit=null;combat.lastEnemyHit=null;combat.fx='idle';save();openCombat()}},delay)
}
function enemyTurn(){
 if(!combat)return;if(combat.hp<=0)return winCombat();combat.phase='enemyResult';
 if(combat.poisonTurns>0){combat.hp-=combat.poison;addCombatDealt(combat.poison,'Atak + efekty');logCombat(`☠️ Trucizna zadaje ${combat.poison}.`)}
 if(combat.bleedTurns>0){combat.hp-=combat.bleed;addCombatDealt(combat.bleed,'Atak + efekty');logCombat(`🩸 Krwawienie zadaje ${combat.bleed}.`)}
 if(combat.burnTurns>0){combat.hp-=combat.burn;addCombatDealt(combat.burn,'Atak + efekty');logCombat(`🔥 Podpalenie zadaje ${combat.burn}.`)}
 if(combat.hp<=0)return winCombat();
 if(combat.isBoss&&combat.bossPhase===1&&combat.hp<=combat.maxHp*.55){combat.bossPhase=2;combat.atk=Math.floor(combat.baseAtk*1.25);logCombat(`🔥 ${combat.monster.name} przechodzi do FAZY II!`);playSfx('boss');haptic([35,25,35])}
 if(combat.isBoss&&combat.bossPhase===2&&combat.hp<=combat.maxHp*.25){combat.bossPhase=3;combat.atk=Math.floor(combat.baseAtk*1.50);logCombat(`☠️ ${combat.monster.name} przechodzi do FAZY III — desperacki szał!`);playSfx('boss');haptic([40,25,40])}
 if(combat.stunned>0){combat.stunned--;setCombatTaken(0,'OGŁUSZONY');logCombat('💫 Przeciwnik jest ogłuszony i traci akcję.');tickEnemyStatuses();return finishEnemyTurn()}
 if(combat.freezeTurns>0&&Math.random()<.25){setCombatTaken(0,'ZAMROŻONY');logCombat('❄️ Zamrożenie spowalnia przeciwnika — traci akcję.');tickEnemyStatuses();return finishEnemyTurn()}
 if(combat.intent){resolveBossIntent();tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn()}
 combat.enemyTurns++;
 const intentEvery=combat.bossPhase>=3?2:3;if(combat.isBoss&&combat.enemyTurns%intentEvery===0){combat.intent=chooseBossIntent();const info=bossIntentInfo(combat.intent);setCombatTaken(0,'BOSS SZYKUJE ATAK');logCombat(`⚠️ Boss przygotowuje: ${info.name}. ${info.hint}`);playSfx('boss');haptic([30,35,30]);tickEnemyStatuses();return finishEnemyTurn()}
 const dodge=Math.random()*100<dodgeChance();if(dodge){combat.lastEnemyHit=null;setCombatTaken(0,'UNIK');logCombat('💨 Unikasz ataku przeciwnika.');tickEnemyStatuses();return finishEnemyTurn()}
 combat.fx='enemy';const blocked=Math.random()*100<blockChance(),reduction=armorPower()*.42,guardMult=combat.guard>0?.55:1,freezeMult=combat.freezeTurns>0?.78:1,blockMult=blocked?.52:1,mult=(1-combat.debuff)*guardMult*freezeMult*blockMult,dmg=Math.max(1,Math.floor((combat.atk*(.85+Math.random()*.3)-reduction)*mult));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;setCombatTaken(dmg,blocked?'BLOK':'TRAFIENIE');logCombat(`${blocked?'🛡️ Blok! ':''}${combat.monster.name} zadaje Ci ${dmg}.`);if(combat.guard>0)combat.guard--;tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn();
}
function combatPotion(id='potion'){
 if(!combat||combat.phase!=='player'||!countItem(id))return;
 const d=itemDef(id),p=state.player,key=d.heal?'hp':d.mana?'mana':null;
 if(!key)return;const max=key==='hp'?p.maxHp:p.maxMana;
 if(p[key]>=max)return toast(key==='hp'?'Masz pełne zdrowie.':'Masz pełną manę.');
 resetCombatExchange();combat.turnDealtNote=d.mana?'MIKSTURA MANY':'LECZENIE';playSfx('heal');
 const restored=Math.min(d.heal||d.mana,max-p[key]);p[key]+=restored;removeItem(id);
 logCombat(`${d.name}: +${restored} ${key==='hp'?'HP':'many'}.`);queueEnemyTurn();
}

function fleeCombat(){if(!combat||combat.phase!=='player')return;if(combat?.dungeon)return toast('Nie możesz uciec z tej komnaty lochu.');if(Math.random()<.7){combat=null;save();renderShell();toast('Udało Ci się uciec.')}else{logCombat('Nie udało się uciec!');queueEnemyTurn()}}
function battleLootRow(drop,index){const d=itemDef(drop.id);return `<label class="battle-loot-row rarity-card-${d.rarity}"><input type="checkbox" data-battle-loot="${index}" checked><span class="battle-loot-icon">${itemIconVisual(d.id,'shop-item-svg')}</span><span class="battle-loot-copy"><b class="rarity-${d.rarity}">${d.name}</b><small>${drop.qty>1?`${drop.qty} szt. • `:''}${d.rarity} • ${d.type==='material'?'materiał':d.type==='consumable'?'zużywalny':d.slot?'ekwipunek':'przedmiot'}</small></span><span class="battle-loot-take">ZABIERZ</span></label>`}
function collectSelectedBattleLoot(result){const selected=[...document.querySelectorAll('[data-battle-loot]:checked')].map(x=>Number(x.dataset.battleLoot)).filter(Number.isInteger);let taken=[];for(const i of selected){const drop=result.drops[i];if(!drop)continue;const added=addItem(drop.id,drop.qty||1);if(added)taken.push({id:drop.id,qty:added})}return taken}
function finishBattleResult(result,takeLoot=true){if(result!==battleResult)return;if(takeLoot){const drops=[...document.querySelectorAll('[data-battle-loot]:checked')].map(x=>result.drops[Number(x.dataset.battleLoot)]).filter(Boolean);if(!requireItemRoom(drops))return}const taken=takeLoot?collectSelectedBattleLoot(result):[];if(result.dungeonInfo&&dungeonRun&&result.pauseStarted){dungeonRun.deadline+=Math.max(0,Date.now()-result.pauseStarted)}battleResult=null;closeModal();save();if(taken.length){playSfx('loot');toast(`Zabrano: ${lootToastText(taken)}`)}if(result.dungeonInfo){advanceDungeonAfterCombat(result.dungeonInfo);return}renderShell();queueReadyStoryScene(null,260)}
function showBattleVictory(result){renderShell();const lootHtml=result.drops.length?`<div class="battle-loot-list">${result.drops.map(battleLootRow).join('')}</div><div class="battle-loot-tools"><button class="secondary" data-loot-all>Zaznacz wszystko</button><button class="ghost" data-loot-none>Odznacz</button></div>`:`<div class="battle-loot-empty">Ten przeciwnik niczego nie upuścił.</div>`;openModal(`<div class="battle-result victory"><div class="battle-result-mark">🏆</div><span class="eyebrow">WYNIK WALKI</span><h2>WYGRANA</h2><div class="battle-result-rewards"><span><b>+${result.xp}</b> XP</span><span><b>+${result.gold}</b> 🪙</span>${result.worldBossRep?`<span><b>+${result.worldBossRep}</b> reputacji</span>`:''}</div><div class="battle-loot-head"><div><h3>Łupy</h3><p>Zaznacz tylko rzeczy, które chcesz zabrać. Reszta zostanie na miejscu.</p></div><span>🎒 ${inventoryUsedSlots()}/${inventoryCapacity()}</span></div>${lootHtml}<div class="battle-result-actions"><button class="primary" data-take-battle-loot>Zabierz wybrane</button><button class="secondary" data-leave-battle-loot>Zostaw wszystko</button></div></div>`,true);document.querySelector('[data-loot-all]')?.addEventListener('click',()=>document.querySelectorAll('[data-battle-loot]').forEach(x=>x.checked=true));document.querySelector('[data-loot-none]')?.addEventListener('click',()=>document.querySelectorAll('[data-battle-loot]').forEach(x=>x.checked=false));document.querySelector('[data-take-battle-loot]')?.addEventListener('click',()=>finishBattleResult(result,true));document.querySelector('[data-leave-battle-loot]')?.addEventListener('click',()=>finishBattleResult(result,false))}
function showBattleDefeat(onReturn){renderShell();openModal(`<div class="battle-result defeat"><div class="battle-result-mark">💀</div><span class="eyebrow">WYNIK WALKI</span><h2>ZGINĄŁEŚ</h2><button class="primary" data-death-return>Wróć</button></div>`,true);document.querySelector('[data-death-return]')?.addEventListener('click',()=>{closeModal();onReturn?.();renderShell()})}
function winCombat(){
 const c=combat,m=c.monster,e=c.entity,biomeXp=c.environment?.familyMatch?(c.environment.effect.familyXp||1):1,xp=Math.floor(m.xp*(.65+.055*c.level)*(e.elite?1.75:1)*biomeXp),baseGold=rnd(...m.gold)*(e.elite?2:1);let gold=baseGold,worldBossRep=0;
 state.player.bestiaryVariants ||= {};const variantKills=state.player.bestiaryVariants[m.id] ||= {},variantId=m.variantId||e.variant||'normal';variantKills[variantId]=(variantKills[variantId]||0)+1;
 state.player.gold+=baseGold;state.player.kills++;playSfx('kill');haptic(18);tutorialEvent('kill');state.player.bestiary[m.id]=(state.player.bestiary[m.id]||0)+1;if(!e.synthetic){e.alive=false;e.respawn=Date.now()+5*60*1000}checkQuestProgress('kill',m.id);const loot=rollCombatLoot(m,e,c);if((c.environment?.effect?.loot||1)>1&&Math.random()<(c.environment.effect.loot-1)){const extra=monsterLootTable(m.id)[0];if(extra)loot.drops=mergeLootDrops([...loot.drops,{id:extra.id,qty:1}])}gainXp(xp);gainPetXp(xp);if(e.elite||c.isBoss)playSfx('loot');if(c.worldBoss){state.adventure.worldBossDay=daySeed();state.adventure.reputation+=25;worldBossRep=25;state.player.gold+=180;gold+=180;loot.drops.push({id:'titanShard',qty:1},{id:'runeShard',qty:2});if(Math.random()<.55)loot.drops.push({id:pick(['runePower','runeGuard','runePrecision']),qty:1});if(Math.random()<.18)loot.drops.push({id:pick(['stormCrown','cryptHeart']),qty:1});loot.drops=mergeLootDrops(loot.drops)}if(c.storyConsequence?.qid)checkQuestProgress('story',c.storyConsequence.qid);if(c.worldEvent?.eventId){const event=eventById(c.worldEvent.eventId),choice=event?.choices?.find(x=>x.id===c.worldEvent.choiceId);if(event)completeWorldEvent(event,choice||{label:'Walka wygrana'},{deferRender:true})}updateAchievements();const pauseStarted=c.dungeon&&dungeonRun?Date.now():0;if(pauseStarted)clearDungeonTimer();const result={xp,gold,worldBossRep,drops:loot.drops,dungeonInfo:c.dungeon,pauseStarted};combat=null;battleResult=result;save();showBattleVictory(result);
}
function loseCombat(){const storyRetry=combat?.storyConsequence||null,info=combat?.dungeon,loss=Math.min(250,Math.max(10,Math.floor(state.player.gold*.04)));state.player.hp=Math.max(1,Math.floor(state.player.maxHp*.35));state.player.mana=Math.floor(state.player.maxMana*.35);state.player.gold=Math.max(0,state.player.gold-loss);if(storyRetry&&state.story?.choices)delete state.story.choices[storyRetry.qid];let after=storyRetry?()=>{if(state.story?.choices)delete state.story.choices[storyRetry.qid];save();setTimeout(()=>queueReadyStoryScene(storyRetry.qid,120),60)}:null;if(dungeonRun){clearDungeonTimer();const d=DUNGEONS.find(x=>x.id===dungeonRun.id),a=dungeonAccess(dungeonRun.id),explore=dungeonExplorationPercent();a.cooldownUntil=Date.now()+DUNGEON_FAIL_COOLDOWN;a.lastResult={type:'death',explore,at:Date.now()};dungeonRun=null}combat=null;save();showBattleDefeat(after)}
function openDungeonGuardianPrompt(d){
 if(!d)return;const a=dungeonAccess(d.id),m=dungeonGuardianMonster(d);
 if(a.guardianDefeated){openDungeonLobby(d);return}
 openModal(`<div class="dungeon-guardian-modal"><div class="modal-head"><div><span class="eyebrow">ODKRYTE WEJŚCIE</span><h2>${d.icon} ${d.name}</h2><div class="muted">Dostęp do lochu blokuje strażnik.</div></div><button class="close" data-close>×</button></div><div class="guardian-showdown"><div class="guardian-art">${monsterVisual(m.id,'guardian-unlock-sprite')}</div><div><span>STRAŻNIK WEJŚCIA</span><h3>${m.name}</h3><p>Pokonaj strażnika tutaj, w świecie GPS. Zwycięstwo odblokuje ${d.name} na stałe i od tej chwili wejdziesz do niego z dowolnego miejsca.</p><div class="dungeon-meta"><span>⚔️ Sugerowany lvl ${d.min}+</span><span>🎟️ Walka ze strażnikiem nie zużywa wejścia dziennego</span></div><button class="primary" data-fight-dungeon-guardian>Walcz ze strażnikiem</button></div></div></div>`);
 document.querySelector('[data-fight-dungeon-guardian]')?.addEventListener('click',()=>startDungeonGuardianFight(d));
}
function startDungeonGuardianFight(d){
 if(!gpsInteractionReady())return;
 const marker=state.world.entities.find(e=>e.id===d.id);if(!marker||dist(marker,state.player.position)>60)return toast('Podejdź ponownie do wejścia lochu na 60 m.');
 const m=dungeonGuardianMonster(d),level=clamp(Math.max(d.min,state.player.level),m.min,m.max),e={id:`guardian_${d.id}_${Date.now()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};
 closeModal();startCombat(e,{level,dungeon:{type:'guardian',dungeonId:d.id}})
}
function unlockDungeonAfterGuardian(id){
 const d=DUNGEONS.find(x=>x.id===id);if(!d)return;const a=dungeonAccess(id);a.discovered=true;a.guardianDefeated=true;if(!state.player.discovered.includes(id))state.player.discovered.push(id);if(!state.player.dungeons.includes(id))state.player.dungeons.push(id);save();renderShell();toast(`🔓 ${d.name} odblokowany! Od teraz wejdziesz z dowolnego miejsca.`)
}
function openDungeonLobby(d){
 if(!d)return;const a=dungeonAccess(d.id),cool=Math.max(0,a.cooldownUntil-Date.now()),left=Math.max(0,DUNGEON_DAILY_LIMIT-a.attempts),levelOk=state.player.level>=d.min;
 if(!a.guardianDefeated||!state.player.dungeons.includes(d.id))return toast('Najpierw odkryj wejście GPS i pokonaj strażnika.');
 const boss=MONSTERS.find(m=>m.id===d.boss);
 openModal(`<div class="dungeon-lobby"><div class="modal-head"><div><span class="eyebrow">ODKRYTY LOCH</span><h2>${d.icon} ${d.name}</h2><div class="muted">Dostępny z dowolnego miejsca</div></div><button class="close" data-close>×</button></div><div class="dungeon-lobby-hero"><div class="dungeon-lobby-icon">${d.icon}</div><div><p>${d.desc}</p><div class="dungeon-rule-pills"><span>⏱️ ${Math.round(dungeonTimeLimit(d)/60)} min</span><span>🎟️ ${a.attempts}/${DUNGEON_DAILY_LIMIT} dziś</span><span>🔒 po sukcesie 1 h</span><span>💀 porażka 15 min</span></div></div></div>${boss?`<div class="dungeon-lobby-boss"><span>${monsterVisual(boss.id,'dungeon-lobby-boss-sprite')}</span><div><small>BOSS</small><b>${boss.name}</b></div></div>`:''}<div class="dungeon-records"><span><b>${state.player.dungeonClears[d.id]||0}</b> ukończeń</span><span><b>${a.bestTime?formatClock(a.bestTime):'—'}</b> rekord czasu</span><span><b>${a.bestExplore||0}%</b> rekord eksploracji</span></div><div class="dungeon-lobby-status">${!levelOk?`🔒 Wymagany poziom ${d.min}.`:cool?`🔒 Pieczęć odnowi się za <b>${formatCooldown(a.cooldownUntil)}</b>.`:left<=0?'🎟️ Wykorzystano wszystkie 3 wejścia na dziś.':`🟢 Gotowy • pozostało wejść: <b>${left}/${DUNGEON_DAILY_LIMIT}</b>`}</div><button class="primary dungeon-action" data-start-dungeon-run ${levelOk&&!cool&&left>0?'':'disabled'}>Rozpocznij ekspedycję</button></div>`);
 document.querySelector('[data-start-dungeon-run]')?.addEventListener('click',()=>startDungeon(d));
}
function startDungeon(d){
 if(!d)return;const a=dungeonAccess(d.id),now=Date.now();
 if(!a.guardianDefeated||!state.player.dungeons.includes(d.id))return toast('Najpierw pokonaj strażnika wejścia.');
 if(state.player.level<d.min)return toast(`Wymagany poziom ${d.min}.`);
 if(a.cooldownUntil>now)return toast(`Loch jest zamknięty jeszcze ${formatCooldown(a.cooldownUntil)}.`);
 if(a.attempts>=DUNGEON_DAILY_LIMIT)return toast('Wykorzystano 3 wejścia do tego lochu na dziś.');
 a.attempts++;const made=makeDungeonGrid(d),limit=dungeonTimeLimit(d);
 dungeonRun={id:d.id,grid:made.grid,size:made.size,x:made.start.x,y:made.start.y,bossPos:made.boss,seed:made.seed,startedAt:now,deadline:now+limit*1000,timeLimit:limit,roomsCleared:0,kills:0,chests:0,secrets:0,keys:0,result:null};
 revealDungeonAround(dungeonRun.x,dungeonRun.y);save();closeModal();startDungeonTimer();openDungeonCrawler();
}
function dungeonCellIcon(c,x,y){
 if(dungeonRun&&x===dungeonRun.x&&y===dungeonRun.y)return '🧙';if(!c.revealed)return '·';if(c.wall)return '';
 if(!c.visited)return c.type==='boss'?'👑':'?';
 const map={start:'🚪',empty:'·',monster:'⚔️',elite:'☠️',chest:'📦',trap:'🕸️',shrine:'✨',key:'🗝️',secret:'⭐',boss:'👑'};return c.resolved&&c.type!=='start'?'✓':(map[c.type]||'·')
}
function dungeonMapHTML(){
 const cells=[];for(let y=0;y<dungeonRun.size;y++)for(let x=0;x<dungeonRun.size;x++){const c=dungeonRun.grid[y][x],current=x===dungeonRun.x&&y===dungeonRun.y;cells.push(`<div class="dungeon-map-cell ${c.wall?'wall':'floor'} ${c.revealed?'revealed':''} ${c.visited?'visited':''} ${current?'current':''} ${c.type==='boss'?'boss-cell':''}">${dungeonCellIcon(c,x,y)}</div>`)}return `<div class="crawler-map" style="--dungeon-size:${dungeonRun.size}">${cells.join('')}</div>`
}
function dungeonCurrentCell(){return dungeonRun?.grid?.[dungeonRun.y]?.[dungeonRun.x]||null}
function dungeonRoomText(c){
 if(!c)return '';const texts={start:'Kamienne schody prowadzą z powrotem na powierzchnię.',empty:'Korytarz jest pusty, ale cisza nie daje spokoju.',monster:'Słychać kroki i szuranie po kamieniu.',elite:'Powietrze robi się ciężkie. Coś znacznie silniejszego pilnuje przejścia.',chest:'W kącie stoi stara skrzynia.',trap:'Na podłodze widać podejrzane nacięcia.',shrine:'Stare runy emanują słabym światłem.',key:'Na kamiennym postumencie leży klucz.',secret:'Za pękniętą ścianą widać ukrytą wnękę.',boss:'Za drzwiami czeka serce tego lochu.'};return texts[c.type]||''
}
function openDungeonCrawler(){
 if(!dungeonRun)return;const d=DUNGEONS.find(x=>x.id===dungeonRun.id);if(!d)return;if(dungeonRemainingSec()<=0)return failDungeonRun('time');setAmbient('dungeon');const c=dungeonCurrentCell(),explore=dungeonExplorationPercent();
 openModal(`<div class="dungeon-crawler"><div class="crawler-head"><div><span class="eyebrow">EKSPEDYCJA</span><h2>${d.icon} ${d.name}</h2><small>Każdy ruch może kosztować zasoby i czas.</small></div><div class="crawler-timer"><small>POZOSTAŁO</small><b data-dungeon-timer>${formatClock(dungeonRemainingSec())}</b></div></div><div class="crawler-status"><span>❤️ ${state.player.hp}/${state.player.maxHp}</span><span>🔷 ${state.player.mana}/${state.player.maxMana}</span><span>🧪 ${countItem('potion')}</span><span>🗝️ ${dungeonRun.keys}</span><span>🗺️ ${explore}%</span></div><div class="crawler-layout"><section class="crawler-map-panel">${dungeonMapHTML()}<div class="crawler-legend"><span>🧙 Ty</span><span>? nieznane</span><span>✓ oczyszczone</span><span>👑 boss</span></div></section><section class="crawler-room-panel"><div class="crawler-room-copy"><small>AKTUALNE POLE</small><h3>${c.type==='start'?'Wejście':c.type==='boss'?'Komnata bossa':c.resolved?'Oczyszczone pomieszczenie':'Nieznane pomieszczenie'}</h3><p>${dungeonRoomText(c)}</p></div><div class="crawler-dpad"><button data-dungeon-move="up">▲</button><div><button data-dungeon-move="left">◀</button><button data-dungeon-move="down">▼</button><button data-dungeon-move="right">▶</button></div></div><button class="ghost crawler-abandon" data-abandon-dungeon>Opuść loch • próba zostanie zużyta</button></section></div></div>`);
 document.querySelectorAll('[data-dungeon-move]').forEach(b=>b.onclick=()=>moveDungeon(b.dataset.dungeonMove));document.querySelector('[data-abandon-dungeon]')?.addEventListener('click',()=>failDungeonRun('abandon'));startDungeonTimer();
}
function moveDungeon(dir){
 if(!dungeonRun)return;if(dungeonRemainingSec()<=0)return failDungeonRun('time');const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!delta)return;const nx=dungeonRun.x+delta[0],ny=dungeonRun.y+delta[1];if(nx<0||ny<0||nx>=dungeonRun.size||ny>=dungeonRun.size)return toast('Kamienna ściana blokuje przejście.');const c=dungeonRun.grid[ny][nx];if(c.wall)return toast('Nie ma tam przejścia.');const d=DUNGEONS.find(x=>x.id===dungeonRun.id);if(c.type==='boss'&&d?.id!=='trainingCellar'&&dungeonRun.keys<1)return toast('🗝️ Komnata bossa jest zamknięta. Najpierw znajdź klucz w lochu.');dungeonRun.x=nx;dungeonRun.y=ny;c.revealed=true;c.visited=true;revealDungeonAround(nx,ny);save();resolveDungeonRoom(c);
}
function dungeonEnemyPool(d){
 const pools={trainingCellar:['slime','rat','beetle'],oldCrypt:['skeleton','ghost','goblin','goblinWarrior'],forgottenTower:['cultist','ghost','skeleton','goblinMage'],beastLair:['hellhound','demon','wyvern'],sunkenChapel:['mireCrawler','bogWraith','fenStalker'],witchBarrow:['rotCultist','marshHag','bogWraith'],blackrootKeep:['blackrootGuardian','mossGolem','rotCultist'],emberMine:['ashScavenger','fireWasp','cinderCultist','slagGolem'],ashenCitadel:['pyreKnight','ashDrake','emberWraith'],frostVault:['frostRaptor','iceWraith','frozenKnight'],tempestSpire:['stormCultist','thunderGolem','skySerpent']};return pools[d.id]||['skeleton','goblin','goblinWarrior','ghost']
}
function resolveDungeonRoom(c){
 if(!dungeonRun||!c)return;if(c.resolved){openDungeonCrawler();return}const d=DUNGEONS.find(x=>x.id===dungeonRun.id);
 if(c.type==='monster'||c.type==='elite'){const id=pick(dungeonEnemyPool(d)),m=MONSTERS.find(x=>x.id===id)||MONSTERS[0],e={id:`dr_${Date.now()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:c.type==='elite',synthetic:true};closeModal();startCombat(e,{level:clamp(Math.max(d.min,state.player.level)+(c.type==='elite'?1:0),m.min,m.max),dungeon:{type:'room',dungeonId:d.id,x:dungeonRun.x,y:dungeonRun.y}});return}
 if(c.type==='boss'){const m=MONSTERS.find(x=>x.id===d.boss)||MONSTERS[0],e={id:`db_${Date.now()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};closeModal();startCombat(e,{level:clamp(Math.max(d.min,state.player.level)+2,m.min,m.max),dungeon:{type:'boss',boss:true,dungeonId:d.id,x:dungeonRun.x,y:dungeonRun.y}});return}
 if(c.type==='chest'){c.resolved=true;dungeonRun.chests++;const roll=Math.random();if(roll<.22){const dmg=Math.max(4,Math.floor(state.player.maxHp*.08));state.player.hp=Math.max(1,state.player.hp-dmg);toast(`Pułapka w skrzyni! -${dmg} HP.`)}else{addItem(pick(['herb','potion','scrap','crystal','moonHerb']));if(Math.random()<.18)addItem('runeShard');toast('📦 Zabierasz łup ze skrzyni.')}}
 else if(c.type==='trap'){c.resolved=true;const dmg=Math.max(5,Math.floor(state.player.maxHp*(.08+Math.random()*.08)));state.player.hp=Math.max(1,state.player.hp-dmg);toast(`🕸️ Pułapka! -${dmg} HP.`)}
 else if(c.type==='shrine'){c.resolved=true;const heal=Math.floor(state.player.maxHp*.28),mana=Math.floor(state.player.maxMana*.25);state.player.hp=Math.min(state.player.maxHp,state.player.hp+heal);state.player.mana=Math.min(state.player.maxMana,state.player.mana+mana);toast(`✨ Kapliczka: +${heal} HP • +${mana} many.`)}
 else if(c.type==='key'){c.resolved=true;dungeonRun.keys++;toast('🗝️ Zdobywasz stary klucz.')} 
 else if(c.type==='secret'){c.resolved=true;dungeonRun.secrets++;addItem(pick(['crystal','runeShard','moonHerb']));gainXp(40+state.player.level*8);toast('⭐ Odkryto sekret lochu!')}
 else {c.resolved=true}
 dungeonRun.roomsCleared++;save();openDungeonCrawler();
}
function advanceDungeonAfterCombat(info){
 if(info?.type==='guardian'){unlockDungeonAfterGuardian(info.dungeonId);return}
 if(!dungeonRun)return refresh();if(dungeonRemainingSec()<=0)return failDungeonRun('time');const cell=dungeonRun.grid?.[info.y]?.[info.x];if(cell){cell.resolved=true;cell.visited=true;dungeonRun.roomsCleared++}dungeonRun.kills++;
 if(info?.type==='boss'||info?.boss){completeDungeon();return}save();openDungeonCrawler();
}
function completeDungeon(){
 if(!dungeonRun)return;clearDungeonTimer();playSfx('loot');haptic([20,25,20]);const d=DUNGEONS.find(x=>x.id===dungeonRun.id),a=dungeonAccess(d.id),isTraining=d.id==='trainingCellar',bonus=isTraining?160:260+state.player.level*40,gold=isTraining?45:70+state.player.level*5,elapsed=Math.max(1,dungeonRun.timeLimit-dungeonRemainingSec()),explore=dungeonExplorationPercent();gainXp(bonus);state.player.gold+=gold;state.player.dungeonClears[d.id]=(state.player.dungeonClears[d.id]||0)+1;a.cooldownUntil=Date.now()+DUNGEON_SUCCESS_COOLDOWN;a.bestTime=a.bestTime?Math.min(a.bestTime,elapsed):elapsed;a.bestExplore=Math.max(a.bestExplore||0,explore);a.lastResult={type:'success',time:elapsed,explore,at:Date.now()};if(d.id==='trainingCellar')tutorialEvent('dungeonComplete',d.id);checkQuestProgress('dungeon',d.id);if(!isTraining&&Math.random()<.45)addItem('crystal');if(!isTraining&&Math.random()<.45)addItem('runeShard');if(Math.random()<.26)addItem('moonHerb');if(!isTraining&&Math.random()<.22)addItem(randomGearFrom(state.player.level>=21?'epic':'rare'));if(isTraining)addItem('potion');updateAchievements();const stats={name:d.name,elapsed,explore,kills:dungeonRun.kills,chests:dungeonRun.chests,secrets:dungeonRun.secrets,xp:bonus,gold};dungeonRun=null;save();renderShell();openModal(`<div class="dungeon-result success"><div class="result-icon">🏆</div><span class="eyebrow">LOCH UKOŃCZONY</span><h2>${stats.name}</h2><div class="dungeon-records"><span><b>${formatClock(stats.elapsed)}</b> czas</span><span><b>${stats.explore}%</b> eksploracja</span><span><b>${stats.kills}</b> walk</span><span><b>${stats.chests}</b> skrzyń</span><span><b>${stats.secrets}</b> sekretów</span></div><div class="result-reward">+${stats.xp} XP • +${stats.gold} 🪙</div><p>🔒 Loch został zapieczętowany na 1 godzinę. Następna wyprawa wygeneruje nowy układ.</p><button class="primary" data-close>Wróć do świata</button></div>`);document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)
}
function failDungeonRun(reason='fail'){
 if(!dungeonRun)return;clearDungeonTimer();const d=DUNGEONS.find(x=>x.id===dungeonRun.id),a=dungeonAccess(d.id),explore=dungeonExplorationPercent();a.cooldownUntil=Date.now()+DUNGEON_FAIL_COOLDOWN;a.lastResult={type:reason,explore,at:Date.now()};const msg=reason==='time'?'Czas wyprawy minął.':reason==='death'?'Poległeś w lochu.':'Wycofałeś się z lochu.';dungeonRun=null;combat=null;save();renderShell();openModal(`<div class="dungeon-result failure"><div class="result-icon">💀</div><span class="eyebrow">WYPRAWA NIEUDANA</span><h2>${d.name}</h2><p>${msg}</p><div class="dungeon-records"><span><b>${explore}%</b> odkrytej mapy</span><span><b>15 min</b> blokady</span></div><p>Próba dzienna została zużyta. Zdobyte podczas wyprawy zwykłe przedmioty pozostają w plecaku.</p><button class="primary" data-close>Wróć do świata</button></div>`);document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)
}
function abandonDungeon(){failDungeonRun('abandon')}

function openModal(html,locked=false){document.body.classList.add('modal-open');document.body.classList.toggle('dungeon-open',!!dungeonRun);let wrap=document.querySelector('.modal-back');if(!wrap){wrap=document.createElement('div');wrap.className='modal-back';document.body.appendChild(wrap)}wrap.dataset.locked=locked?'1':'0';wrap.innerHTML=`<div class="modal">${html}</div>`;wrap.onclick=e=>{if(e.target===wrap&&wrap.dataset.locked!=='1'&&combat===null&&dungeonRun===null)closeModal()};wrap.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)}
function closeModal(){document.querySelector('.modal-back')?.remove();document.body.classList.remove('modal-open');document.body.classList.remove('building-open');document.body.classList.remove('dungeon-open')}
document.addEventListener('keydown',e=>{const m=document.querySelector('.modal-back');if(e.key==='Escape'&&m&&m.dataset.locked!=='1'&&combat===null&&dungeonRun===null)closeModal()});

// Mobile 1.10: oszczędzanie baterii w tle.
window.addEventListener('pagehide',()=>save());
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)save();
 if(document.hidden&&gpsWatch!==null){navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;gpsPausedByBackground=true}
 else if(!document.hidden&&gpsPausedByBackground){gpsPausedByBackground=false;setTimeout(()=>{if(gpsWatch===null)toggleGps()},650)}
});

// Save one coherent snapshot after each synchronous action.
newGame=atomicAction(newGame);buyItem=atomicAction(buyItem);craftRecipe=atomicAction(craftRecipe);unsocketRune=atomicAction(unsocketRune);
playerAction=atomicAction(playerAction);enemyTurn=atomicAction(enemyTurn);combatPotion=atomicAction(combatPotion);useItem=atomicAction(useItem);
applyStoryChoice=atomicAction(applyStoryChoice);chooseWorldEvent=atomicAction(chooseWorldEvent);
winCombat=atomicAction(winCombat);loseCombat=atomicAction(loseCombat);finishBattleResult=atomicAction(finishBattleResult);
salvageIndex=atomicAction(salvageIndex);sellIndex=atomicAction(sellIndex);equipIndexToSlot=atomicAction(equipIndexToSlot);
startDungeon=atomicAction(startDungeon);moveDungeon=atomicAction(moveDungeon);completeDungeon=atomicAction(completeDungeon);resolveDungeonRoom=atomicAction(resolveDungeonRoom);
state=load();restoreSession();
const resumeGpsAfterLaunch=!!state?.player?.position?.gps;
if(state?.world?.entities){for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true}
render();resumeSession();
if(resumeGpsAfterLaunch&&navigator.geolocation)setTimeout(()=>{if(state&&gpsWatch===null)toggleGps()},650);
