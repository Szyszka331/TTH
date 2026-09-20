import {CLASSES,MONSTERS,ITEMS,QUESTS,SKILLS,PETS,RECIPES,DUNGEONS,BUILDINGS} from './data.js?v=2520';

const SAVE_KEY='time4heroes_build_251';
const MIGRATION_KEYS=['time4heroes_build_25','time4heroes_build_24','time4heroes_build_23','time4heroes_build_232','time4heroes_build_22','time4heroes_build_21','time4heroes_build_115','time4heroes_build_114','time4heroes_build_111','time4heroes_build_110','time4heroes_build_19','time4heroes_build_18','time4heroes_build_17','time4heroes_build_16','time4heroes_build_15','time4heroes_build_14','time4heroes_build_13','time4heroes_build_12_core','time4heroes_build_11','time4heroes_build_10','time4heroes_build_09','time4heroes_build_08','georpg_build_07','georpg_build_06','georpg_build_05','georpg_build_04','georpg_build_03','georpg_build_02','georpg_build_01'];
const app=document.querySelector('#app');
const toastEl=document.querySelector('#toast');
let state=null;
let combat=null;
let dungeonRun=null;
let gpsWatch=null;
let currentTab='map';
let installPromptEvent=null;
let realMap=null;
let fogLayer=null;
let trailLayer=null;
let playerMapMarker=null;
let accuracyCircle=null;
let interactionCircle=null;
let followGps=true;
let leafletEntityLayers=[];
let leafletZoneLayers=[];
let leafletBiomeLayers=[];
let leafletDecorLayers=[];
let lastGpsTick=0;
let gpsPausedByBackground=false;
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
const daySeed=()=>Number(new Date().toISOString().slice(0,10).replaceAll('-',''));
const seeded=(seed)=>{const x=Math.sin(seed)*10000;return x-Math.floor(x)};
const fmt=n=>Math.round(n).toLocaleString('pl-PL');

const CORE_UNLOCKS={shop:{level:2,label:'Poziom 2'},smith:{level:3,label:'Poziom 3'},alchemist:{level:4,label:'Poziom 4'},auction:{level:8,label:'Poziom 8'},guild:{level:10,label:'Poziom 10'}};
const TUTORIAL_STEPS=[
 {id:'move',title:'Pierwszy krok',text:'Odejdź 60 m od punktu startowego. GPS pokazuje Twoją pozycję, a tryb testowy pozwala sprawdzić grę bez wychodzenia.',go:'map'},
 {id:'kill',title:'Pierwsza walka',text:'Podejdź do słabego przeciwnika i wygraj pierwszą walkę.',go:'map'},
 {id:'tavern',title:'Bezpieczny powrót',text:'Odwiedź Karczmę „Pod Krukiem”. To Twój pierwszy bezpieczny hub.',go:'town'},
 {id:'inventory',title:'Sprawdź zdobycz',text:'Otwórz Bohater → Ekwipunek. Po pierwszej walce czeka tam treningowy łup.',go:'inventory'},
 {id:'equip',title:'Załóż nowy sprzęt',text:'Wyposaż znaleziony przedmiot i zobacz, jak zmienia statystyki.',go:'inventory'},
 {id:'skill',title:'Pierwsza umiejętność',text:'W Bohater → Postać wydaj pierwszy punkt umiejętności. Każda klasa rozwija się inaczej.',go:'skills'},
 {id:'secret',title:'Coś poza szlakiem',text:'Odkryj pierwszy sekret. Poza głównym szlakiem czekają miejsca, których jeszcze nie znasz.',go:'map'},
 {id:'dungeonDiscover',title:'Pierwszy loch',text:'Odnajdź Piwnicę Pod Krukiem niedaleko wioski. Po odkryciu loch zostaje w Twoim dzienniku.',go:'map'},
 {id:'dungeonComplete',title:'Pierwsza wyprawa',text:'Ukończ Piwnicę Pod Krukiem: wydarzenie, strażnik i boss pokażą Ci podstawy lochów.',go:'map'}
];

const STORY_SCENES={
 q2:{requiresSteps:1,npc:'Mara',role:'Pasterka',classId:'ranger',intro:'Na ogrodzeniu wiszą kępki szarej sierści, ale ziemia jest zbyt mocno zdeptana jak na zwykły atak wilków.',choices:[
  {id:'spare',label:'Nie osądzaj wilków bez dowodu',text:'Najpierw sprawdzisz, kto naprawdę przepędził stado.',trait:'mercy',item:'herb',result:'Mara niechętnie przyznaje, że nikt nie widział samego ataku.'},
  {id:'hunt',label:'Traktuj wilczy trop jako zagrożenie',text:'Zabezpieczysz okolicę, nawet jeśli trop okaże się fałszywy.',trait:'resolve',gold:20,result:'Mieszkańcy czują się bezpieczniej, ale część śladów zostaje zadeptana.'}
 ]},
 q3:{requiresSteps:1,npc:'Ranny wilk',role:'Ślad w wilczej jamie',classId:'hunter',intro:'W jamie nie ma resztek owiec. Są za to strzępy płótna, ślady butów i grot goblińskiej strzały.',choices:[
  {id:'tracks',label:'Zbadaj ślady butów',text:'Skupiasz się na kierunku marszu i liczbie napastników.',trait:'insight',xp:55,result:'Ślady prowadzą ku ruinom i wyglądają na zorganizowany transport.'},
  {id:'arrow',label:'Zbadaj grot strzały',text:'Porównujesz grot z uzbrojeniem goblinów.',trait:'caution',item:'scrap',result:'Metal nosi znak, którego gobliny zwykle nie używają.'}
 ]},
 q6:{requiresSteps:1,npc:'Nessa',role:'Myśliwa zwiadowczyni',classId:'hunter',intro:'Z obozu słychać rozmowę o „panu”, który ma przyjść przed trzecią nocą. Możesz zostać na skraju lasu albo podejść bliżej.',choices:[
  {id:'observe',label:'Zostań w ukryciu',text:'Bezpieczniej. Spróbujesz zapamiętać twarze, drogę i godziny zmian warty.',trait:'caution',xp:70,result:'Poznajesz rytm patroli i nie wzbudzasz podejrzeń.'},
  {id:'close',label:'Podejdź bliżej',text:'Ryzykujesz wykrycie, ale możesz usłyszeć więcej.',trait:'resolve',gold:35,result:'Słyszysz wzmiankę o starych ruinach i czarnym symbolu.'}
 ]},
 q10:{requiresSteps:1,npc:'Eldran',role:'Pustelnik',classId:'mage',intro:'Pustelnik rozpoznaje symbol jako znak dawnego bractwa. Twierdzi, że ktoś próbuje odtworzyć ich sieć rytuałów.',choices:[
  {id:'trust',label:'Zaufaj jego wiedzy',text:'Pozwolisz mu zatrzymać kopię znaku i poprosisz o interpretację.',trait:'insight',item:'moonHerb',result:'Eldran dzieli się notatką o miejscach, w których znak może pojawić się ponownie.'},
  {id:'keep',label:'Zachowaj dystans',text:'Nie oddasz nikomu oryginalnych dowodów.',trait:'resolve',gold:45,result:'Pustelnik szanuje ostrożność, ale nie mówi wszystkiego.'}
 ]},
 q12:{requiresSteps:2,npc:'Nieznajomy',role:'Nocny gość',classId:'ranger',intro:'Zakapturzona postać przekazuje goblinom czarny medalion. Po chwili odchodzi samotnie w stronę wzgórz.',choices:[
  {id:'watch',label:'Nie wychodź z ukrycia',text:'Najważniejsze są informacje, nie pościg.',trait:'caution',xp:100,flag:'nightWitness',result:'Zapamiętujesz głos i kierunek odejścia nieznajomego.'},
  {id:'follow',label:'Rusz za nieznajomym',text:'Ryzykujesz, że zauważy śledzenie.',trait:'resolve',gold:60,flag:'nightTrail',result:'Na szlaku znajdujesz fragment czarnego wosku z tym samym symbolem.'}
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
function ensureStoryState(s=state){if(!s)return;s.story ||= {choices:{},flags:{},traits:{mercy:0,resolve:0,insight:0,caution:0},seen:{}};s.story.choices ||= {};s.story.flags ||= {};s.story.traits ||= {mercy:0,resolve:0,insight:0,caution:0};s.story.seen ||= {};for(const k of ['mercy','resolve','insight','caution'])s.story.traits[k] ??= 0}
function storyChoiceFor(qid){ensureStoryState();return state.story.choices[qid]||null}
function storyTraitLabel(k){return ({mercy:'Empatia',resolve:'Determinacja',insight:'Wnikliwość',caution:'Ostrożność'})[k]||k}
function conditionSatisfied(target){const c=climate();if(target==='night')return c.phase==='Noc';if(target==='nightOrFog')return c.phase==='Noc'||c.weather==='Mgła';if(target==='badWeather')return ['Mgła','Deszcz','Burza'].includes(c.weather);if(target==='day')return c.phase==='Dzień';return false}
function updateStoryConditions(){if(!state)return;ensureStoryState();let changed=false;for(const qid of [...state.quests.active]){const q=QUESTS.find(x=>x.id===qid);if(!q)continue;const prog=state.quests.progress[qid] ||= q.steps.map(()=>0);q.steps.forEach((s,i)=>{if(s.type==='condition'&&conditionSatisfied(s.target)&&!prog[i]){prog[i]=1;changed=true}else if(s.type==='story'&&storyChoiceFor(qid)&&!prog[i]){prog[i]=1;changed=true}});if(q.steps.every((s,i)=>(prog[i]||0)>=(s.count||1))){rewardQuest(q);changed=true}}if(changed)save()}
function storyProfileHTML(){ensureStoryState();const t=state.story.traits,ending=state.story.flags.endingDestroy?'Zniszczone serce bagna':state.story.flags.endingSeal?'Zapieczętowane serce bagna':null;return `<div class="story-profile"><div><b>🧭 Twój ślad fabularny</b><small>Decyzje nie blokują klas ani regionów, ale zmieniają nagrody, informacje i podsumowanie historii.</small></div><div class="story-traits"><span>🤝 ${storyTraitLabel('mercy')} <b>${t.mercy}</b></span><span>⚔️ ${storyTraitLabel('resolve')} <b>${t.resolve}</b></span><span>🔎 ${storyTraitLabel('insight')} <b>${t.insight}</b></span><span>🕯️ ${storyTraitLabel('caution')} <b>${t.caution}</b></span></div>${ending?`<div class="story-ending">Zakończenie Mokradeł Echa: <b>${ending}</b></div>`:''}</div>`}
function storyCanChoose(qid){const scene=storyScene(qid),q=QUESTS.find(x=>x.id===qid);if(!scene||!q)return false;if(storyChoiceFor(qid))return true;if(!scene.requiresSteps)return true;const prog=state.quests.progress[qid]||[];return q.steps.slice(0,scene.requiresSteps).every((s,i)=>(prog[i]||0)>=(s.count||1))}
function openStoryScene(qid){ensureStoryState();const scene=storyScene(qid),q=QUESTS.find(x=>x.id===qid);if(!scene||!q)return;const selected=storyChoiceFor(qid);if(!storyCanChoose(qid)&&!selected)return toast('Najpierw ukończ wcześniejszy etap zadania.');state.story.seen[qid]=true;save();const chosen=selected?scene.choices.find(c=>c.id===selected):null;openModal(`<div class="story-modal"><div class="modal-head"><div><div class="story-kicker">${q.chapter}</div><h2>${q.name}</h2><div class="muted">Scena fabularna</div></div><button class="close" data-close>×</button></div><div class="story-scene"><div class="story-npc">${classVisual(scene.classId||'ranger','sprite-story-npc')}<b>${scene.npc}</b><small>${scene.role}</small></div><div class="story-dialogue"><p>${scene.intro}</p>${chosen?`<div class="story-result"><span>TWÓJ WYBÓR</span><b>${chosen.label}</b><p>${chosen.result}</p></div>`:`<div class="story-choices">${scene.choices.map(c=>`<button class="story-choice" data-story-choice="${c.id}"><b>${c.label}</b><small>${c.text}</small></button>`).join('')}</div>`}</div></div></div>`);document.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>applyStoryChoice(qid,b.dataset.storyChoice))}
function applyStoryChoice(qid,choiceId){ensureStoryState();if(state.story.choices[qid])return;const scene=storyScene(qid),choice=scene?.choices.find(c=>c.id===choiceId);if(!choice)return;state.story.choices[qid]=choice.id;if(choice.trait)state.story.traits[choice.trait]=(state.story.traits[choice.trait]||0)+1;if(choice.flag)state.story.flags[choice.flag]=true;if(choice.gold)state.player.gold+=choice.gold;if(choice.xp)gainXp(choice.xp);if(choice.item)addItem(choice.item);if(choice.rep){ensureAdventureState();state.adventure.reputation+=choice.rep}checkQuestProgress('story',qid);save();closeModal();refresh();toast(`Decyzja zapisana: ${choice.label}`)}

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
function itemIconVisual(id,cls='item-svg'){return `<img src="assets/icons/items/${id}.svg" class="${cls}" alt="">`}
function skillIconVisual(id,cls='skill-svg'){return `<img src="assets/icons/skills/${id}.svg" class="${cls}" alt="">`}
function ensureCoreState(s=state){if(!s)return;ensureStoryState(s);s.ui ||= {heroView:'char',adventureView:'quests',menuView:'settings'};s.tutorial ||= {stage:0,complete:false,rewardGiven:false,flags:{},introSeen:true};s.tutorial.flags ||= {};s.tutorial.introSeen ??= true;s.tutorial.mapDismissedStage ??= -1;s.settings ||= {};s.settings.audio ??= true;s.settings.ambient ??= true;s.settings.masterSound ??= (s.settings.audio||s.settings.ambient);s.settings.sfxVolume ??= .68;s.settings.ambientVolume ??= .18;s.settings.haptics ??= true;s.settings.mapMode ||= 'focused';s.settings.mapFilters ||= {};s.settings.mapFilters.trail ??= true;s.player.inventoryCapacity ??= 32;s.world.regionRewards ||= {};s.world.fogRadius=100;}

function tutorialInfo(){ensureCoreState();return state.tutorial.complete?null:TUTORIAL_STEPS[Math.min(state.tutorial.stage,TUTORIAL_STEPS.length-1)]}
function tutorialStepDone(step){const f=state.tutorial.flags||{};if(f[step.id])return true;if(step.id==='skill')return state.player.skills.length>0;if(step.id==='secret')return (state.world.exploration?.secretsFound||[]).length>0;if(step.id==='dungeonDiscover')return state.player.dungeons.includes('trainingCellar');if(step.id==='dungeonComplete')return (state.player.dungeonClears?.trainingCellar||0)>0;return false}
function advanceTutorial(){ensureCoreState();if(state.tutorial.complete)return;let moved=false;while(state.tutorial.stage<TUTORIAL_STEPS.length&&tutorialStepDone(TUTORIAL_STEPS[state.tutorial.stage])){state.tutorial.stage++;moved=true}if(state.tutorial.stage>=TUTORIAL_STEPS.length){state.tutorial.complete=true;if(!state.tutorial.finishReward){state.tutorial.finishReward=true;state.player.gold+=80;gainXp(180);addItem('potion',2);playSfx('level');haptic([25,40,25]);toast('Pierwsza wyprawa ukończona! +180 XP • +80 🪙 • 2 mikstury')}}if(moved)save()}
function tutorialEvent(type,value=0){ensureCoreState();if(state.tutorial.complete)return;const f=state.tutorial.flags; if(type==='move'&&value>=60)f.move=true;else if(type==='kill'){f.kill=true;if(!state.tutorial.rewardGiven){state.tutorial.rewardGiven=true;addItem('scoutHood');playSfx('loot');toast('Pierwszy łup: Kaptur zwiadowcy trafił do plecaka.')}}else if(type==='tavern')f.tavern=true;else if(type==='inventory')f.inventory=true;else if(type==='equip')f.equip=true;else if(type==='skill')f.skill=true;else if(type==='secret')f.secret=true;else if(type==='dungeonDiscover')f.dungeonDiscover=true;else if(type==='dungeonComplete')f.dungeonComplete=true;advanceTutorial();save()}
function tutorialMapOverlay(){const t=tutorialInfo();if(!t||state.tutorial.mapDismissedStage===state.tutorial.stage)return'';const pct=Math.round((state.tutorial.stage/TUTORIAL_STEPS.length)*100);return `<div class="tutorial-map-card"><div class="npe-progress"><i style="width:${pct}%"></i></div><button class="tutorial-map-close" data-tutorial-hide aria-label="Zamknij">×</button><span>WSKAZÓWKA ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}</span><b>${t.title}</b><small>${t.text}</small></div>`}
function tutorialJournalHTML(){const t=tutorialInfo();if(!t)return `<div class="panel-item first-hour-card"><b>✅ Samouczek ukończony</b><div class="muted">Pierwsza godzina została zakończona.</div></div>`;return `<div class="panel-item first-hour-card"><b>🎓 Samouczek • ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}: ${t.title}</b><p>${t.text}</p><button class="secondary" data-tutorial-go>Pokaż na mapie</button></div>`}
function tutorialNavigate(){const t=tutorialInfo();if(!t)return;if(t.go==='town'){selectNav('town');return}if(t.go==='inventory'){state.ui.heroView='inv';save();selectNav('hero');return}if(t.go==='skills'){state.ui.heroView='char';save();selectNav('hero');return}selectNav('map')}
function bindTutorialControls(root=document){root.querySelector('[data-tutorial-go]')?.addEventListener('click',tutorialNavigate);root.querySelector('[data-tutorial-hide]')?.addEventListener('click',()=>{state.tutorial.mapDismissedStage=state.tutorial.stage;save();root.querySelector('.tutorial-map-card')?.remove()})}
function buildingUnlock(id){if(id==='tavern')return {ok:true};const u=CORE_UNLOCKS[id];if(!u)return {ok:true};return {ok:state.player.level>=u.level,reason:u.label}}
function activeQuestTargets(){const set=new Set();for(const qid of state.quests.active){const q=QUESTS.find(x=>x.id===qid);if(!q)continue;const prog=state.quests.progress[qid]||[];q.steps.forEach((s,i)=>{if((prog[i]||0)<(s.count||1)&&s.target)set.add(s.target)})}return set}
function focusedEntityVisible(e){if(state.settings.mapMode!=='focused')return true;const d=dist(e,state.player.position),targets=activeQuestTargets(),specificMonster=e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template);if(e.type==='monster')return d<=165||(e.elite&&d<=300)||(specificMonster&&d<=320);if(e.type==='event')return d<=260;if(e.type==='dungeon')return targets.has(e.id)||d<=260||(state.player.dungeons.includes(e.id)&&d<=360);if(e.type==='poi')return targets.has(e.id)||d<=210||(state.player.discovered.includes(e.id)&&d<=260);return true}
document.addEventListener('click',e=>{if(e.target.closest('button'))playSfx('click')},{capture:true});


function xpNeed(lvl){return Math.floor(110+60*lvl+20*lvl*lvl)}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),2500)}
function save(){if(state)localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
function rawLoad(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function itemDef(id){return ITEMS[id]||{id,name:id,icon:'❓',type:'unknown',rarity:'common',value:0}}
function skillDef(id){return (SKILLS[state.player.class]||[]).find(s=>s.id===id)}
function petDef(id){return PETS[id]||null}
function itemName(inst){const d=itemDef(inst.id);return `${d.name}${inst.affix?.name?` ${inst.affix.name}`:''}${(inst.upgrade||0)>0?` +${inst.upgrade}`:''}`}
function countItem(id){return state.player.inventory.filter(x=>x.id===id).reduce((a,x)=>a+(x.qty||1),0)}
const STACK_MAX=32;
function isStackable(id){return ['consumable','material','rune'].includes(itemDef(id).type)}
function inventoryCapacity(){return state?.player?.inventoryCapacity||32}
function inventoryUsedSlots(){return state?.player?.inventory?.length||0}
function normalizeInventoryStacks(inv=[]){const out=[];for(const raw of inv){const i={...raw};if(isStackable(i.id)){let q=Math.max(1,Number(i.qty)||1);while(q>0){out.push({id:i.id,qty:Math.min(STACK_MAX,q)});q-=STACK_MAX}}else out.push(i)}return out}
function inventoryHasRoom(slots=1){return inventoryUsedSlots()+slots<=inventoryCapacity()}
const AFFIXES=[{name:'Ognia',power:3},{name:'Żelaza',armor:3},{name:'Sokoła',crit:3},{name:'Łowcy',power:2,crit:2}];
const SET_BONUSES={raven:{name:'Kruczy Rynsztunek',two:{power:4},three:{armor:5,crit:3}},wild:{name:'Dziki Szlak',two:{crit:5},three:{power:5,armor:3}},mist:{name:'Strażnik Mgieł',two:{armor:4,crit:3},three:{power:7,armor:4}},ashguard:{name:'Popielna Straż',two:{power:8,armor:4},three:{power:7,crit:5}},stormforged:{name:'Nawałnica',two:{crit:6,armor:5},three:{power:10,crit:4}}};
const ECONOMY={sell:{common:.28,uncommon:.32,rare:.36,epic:.40,heroic:.44,legendary:.48},shopMarkup:1.12,auctionMin:.95,auctionMax:1.18,travelBase:10,travelPer100m:3};
const GEAR_POOLS={uncommon:['scoutHood','leatherGloves','trailBoots','woodenShield','oldTalisman'],rare:['blueBlade','forestBow','arcaneStaff','wolfCharm','ironHelm','emberRing'],epic:['ravenBlade','ravenMail','ravenHelm','wildBow','wildHood','wildBoots','mistBlade','mistMail','mistHood','ashBlade','ashMail','ashHelm','stormSpear','stormMail','stormHelm'],heroic:['mireCharm','cinderCharm','tempestCharm'],legendary:['stormCrown','cryptHeart']};
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
function randomGearFrom(tier){const pool=(GEAR_POOLS[tier]||[]).filter(id=>{const d=itemDef(id);return !d.reqLevel||state.player.level>=d.reqLevel});if(!pool.length)return null;return pick(pool)}
function rollCombatLoot(m,e,c){ensureEconomyState();let gearDrop=null;
 if(m.id==='wolf'&&Math.random()<.45)addItem('wolfPelt');if(m.family==='Nieumarli'&&Math.random()<.38)addItem('bone');
 if(['mireCrawler','fenStalker','blackrootGuardian'].includes(m.id)&&Math.random()<.48)addItem('mireMoss');if(m.id==='bogWraith'&&Math.random()<.42)addItem('wraithEssence');if(['mossGolem','marshHag'].includes(m.id)&&Math.random()<.36)addItem('bogAmber');
 if(m.id==='mireMother'){addItem('bogAmber',2);addItem('wraithEssence',2);addItem('mireMoss',3)}
 if(['ashScavenger','cinderCultist','pyreKnight'].includes(m.id)&&Math.random()<.42)addItem('charredIron');if(['emberWraith','fireWasp'].includes(m.id)&&Math.random()<.34)addItem('ashGlass');if(['slagGolem','ashDrake'].includes(m.id)&&Math.random()<.30)addItem('emberCore');if(m.id==='cinderMatriarch'){addItem('emberCore',2);addItem('ashGlass',2);addItem('charredIron',3)}
 if(['frostRaptor','iceWraith','frozenKnight'].includes(m.id)&&Math.random()<.40)addItem('frostCrystal');if(['stormCultist','skySerpent'].includes(m.id)&&Math.random()<.36)addItem('stormFeather');if(['thunderGolem','mountainTroll'].includes(m.id)&&Math.random()<.28)addItem('skySteel');if(m.id==='tempestLord'){addItem('skySteel',2);addItem('stormFeather',2);addItem('frostCrystal',2)}
 if(Math.random()<.12)addItem('herb');if(Math.random()<.06)addItem('scrap');if(Math.random()<.025)addItem('crystal');
 const elite=!!e.elite,boss=!!c.isBoss||!!c.worldBoss;
 if(!elite&&!boss&&Math.random()<.018)gearDrop=randomGearFrom('uncommon');
 if(elite&&!boss){state.economy.elitePity++;if(Math.random()<.18||state.economy.elitePity>=4){gearDrop=randomGearFrom(Math.random()<.22?'epic':'rare');state.economy.elitePity=0}if(Math.random()<.16)addItem('runeShard')}
 if(boss){state.economy.bossPity++;const epicGuaranteed=state.economy.bossPity>=3;if(Math.random()<.58||epicGuaranteed){gearDrop=randomGearFrom(Math.random()<.18?'heroic':'epic');state.economy.bossPity=0}else gearDrop=randomGearFrom('rare');if(Math.random()<.55)addItem('runeShard',rnd(1,2));if(Math.random()<.08)addItem(pick(['runePower','runeGuard','runePrecision']))}
 if(gearDrop)addItem(gearDrop);return gearDrop;
}
function addItem(id,qty=1){let left=Math.max(0,qty|0),added=0;if(isStackable(id)){for(const st of state.player.inventory.filter(x=>x.id===id&&isStackable(x.id)&&((x.qty||1)<STACK_MAX))){if(left<=0)break;const room=STACK_MAX-(st.qty||1),take=Math.min(room,left);st.qty=(st.qty||1)+take;left-=take;added+=take}while(left>0&&inventoryHasRoom()){const take=Math.min(STACK_MAX,left);state.player.inventory.push({id,qty:take});left-=take;added+=take}}else{while(left>0&&inventoryHasRoom()){state.player.inventory.push(createGearInstance(id));left--;added++}}if(left>0)toast(`🎒 Plecak pełny — nie zmieściło się ${left}× ${itemDef(id).name}.`);if(added)checkQuestProgress('item',id);save();return added}
function removeItem(id,qty=1){let left=qty;for(let i=state.player.inventory.length-1;i>=0&&left>0;i--){const x=state.player.inventory[i];if(x.id!==id)continue;const q=x.qty||1;if(q>left){x.qty=q-left;left=0}else{left-=q;state.player.inventory.splice(i,1)}}save();return left===0}
function starterWeapon(cls){return cls==='mage'?'apprenticeStaff':cls==='hunter'||cls==='ranger'?'hunterBow':cls==='berserker'?'axe':'rustySword'}
function equippedInstance(slot){const e=state.player.equipped[slot];if(!e)return null;return state.player.inventory.find(x=>x.uid&&x.uid===e.uid)||e}
function instanceBonus(inst,key){if(!inst)return 0;let v=0;if(inst.affix?.[key])v+=inst.affix[key];if(inst.enchant?.[key])v+=inst.enchant[key];if(inst.rune){const r=itemDef(inst.rune);if(r.runeKey===key)v+=r.runeValue||0}return v}
function equipmentStat(slot,key){const inst=equippedInstance(slot);if(!inst)return 0;const d=itemDef(inst.id),base=d[key]||0,up=inst.upgrade||0;return base+(base?(key==='crit'?up:up*2):0)+instanceBonus(inst,key)}
function activeSetCounts(){const counts={};for(const slot of Object.keys(state.player.equipped||{})){const inst=equippedInstance(slot);const set=inst&&itemDef(inst.id).set;if(set)counts[set]=(counts[set]||0)+1}return counts}
function setBonusStat(key){let total=0;for(const [set,count] of Object.entries(activeSetCounts())){const b=SET_BONUSES[set];if(!b)continue;if(count>=2)total+=b.two?.[key]||0;if(count>=3)total+=b.three?.[key]||0}return total}
function gearStat(key){return Object.keys(state.player.equipped||{}).reduce((sum,slot)=>sum+equipmentStat(slot,key),0)+setBonusStat(key)}
function climate(){
 const hour=state?.settings?.forceNight?1:new Date().getHours();
 const phase=hour>=6&&hour<18?'Dzień':hour>=18&&hour<22?'Zmierzch':'Noc';
 const bucket=Math.floor(new Date().getHours()/6);
 const options=[['☀️','Bezchmurnie'],['🌧️','Deszcz'],['🌫️','Mgła'],['⛈️','Burza'],['💨','Wiatr']];
 const w=options[Math.floor(seeded(daySeed()+bucket*47)*options.length)];
 return {icon:w[0],weather:w[1],phase,hour};
}

const BOUNTY_POOL=[
 {id:'wolf',name:'Wilczy trop',icon:'🐺',target:'wolf',need:3,xp:220,gold:45,rep:4},
 {id:'goblin',name:'Goblińskie zasadzki',icon:'👺',target:'goblin',need:4,xp:280,gold:55,rep:5},
 {id:'undead',name:'Kości nie spoczną',icon:'💀',target:'skeleton',need:3,xp:360,gold:70,rep:6},
 {id:'insects',name:'Plaga tkaczy',icon:'🕷️',target:'spider',need:4,xp:310,gold:60,rep:5},
 {id:'ogres',name:'Łowca olbrzymów',icon:'👹',target:'ogre',need:2,xp:520,gold:100,rep:8}
];
function makeDailyBounties(day){const pool=[...BOUNTY_POOL],out=[];for(let i=0;i<3;i++){const idx=Math.floor(seeded(day+711+i*83)*pool.length),b=pool.splice(idx,1)[0];out.push({...b,progress:0,claimed:false,accepted:false})}return out}
function ensureAdventureState(s=state){if(!s)return; s.adventure ||= {day:daySeed(),reputation:0,bounties:[],worldBossDay:0,achievements:{}};if(s.adventure.day!==daySeed()){s.adventure.day=daySeed();s.adventure.bounties=makeDailyBounties(daySeed())}if(!s.adventure.bounties?.length)s.adventure.bounties=makeDailyBounties(daySeed());for(const b of s.adventure.bounties||[])b.accepted ??= false;s.adventure.achievements ||= {};s.adventure.reputation ||= 0;s.adventure.worldBossDay ||= 0}
function progressBounties(type,target,amount=1){if(type!=='kill')return;ensureAdventureState();for(const b of state.adventure.bounties){if(b.accepted&&!b.claimed&&b.target===target)b.progress=Math.min(b.need,(b.progress||0)+amount)}updateAchievements()}
function updateAchievements(){if(!state?.adventure)return;const a=state.adventure.achievements,p=state.player;a.firstBlood ||= p.kills>=1;a.hunter ||= p.kills>=25;a.explorer ||= p.discovered.length>=6;a.delver ||= Object.values(p.dungeonClears||{}).reduce((x,y)=>x+y,0)>=3;a.veteran ||= p.level>=10;a.north ||= state.quests.done.includes('q15')}
function claimBounty(id){ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||!b.accepted||b.claimed||b.progress<b.need)return; b.claimed=true;state.player.gold+=b.gold;state.adventure.reputation+=b.rep;gainXp(b.xp);save();renderShell();toast(`Kontrakt wykonany: +${b.xp} XP • +${b.gold} 🪙 • +${b.rep} reputacji`)}
function worldBossDef(){const list=[MONSTERS.find(m=>m.id==='graveColossus'),MONSTERS.find(m=>m.id==='stormDrake')].filter(Boolean);return list[daySeed()%list.length]||MONSTERS.find(m=>m.id==='ogre')}
function startWorldBoss(){ensureAdventureState();if(state.adventure.worldBossDay===daySeed())return toast('Dzisiejszy boss świata został już pokonany.');if(state.player.level<8)return toast('Boss świata wymaga co najmniej 8 poziomu.');const m=worldBossDef(),e={id:`worldboss_${daySeed()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};startCombat(e,{level:Math.max(m.min,state.player.level+3),worldBoss:true})}


const BIOMES={
 meadow:{name:'Łąki',icon:'🌾',color:'#7e9b52',desc:'Otwarte tereny. Częste zwierzęta, gobliny i surowce.'},
 forest:{name:'Las',icon:'🌲',color:'#315f3b',desc:'Gęsty teren pełen wilków, pająków i ukrytych ścieżek.'},
 ruins:{name:'Ruiny',icon:'🏚️',color:'#706a63',desc:'Stare miejsca przyciągające nieumarłych i kultystów.'},
 marsh:{name:'Mokradła',icon:'🌫️',color:'#4e756c',desc:'Niebezpieczne bagna, trucizny i rzadkie składniki.'},
 highlands:{name:'Wzgórza',icon:'⛰️',color:'#7b735d',desc:'Trudniejszy teren z ogrami i silniejszymi bestiami.'}
};


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
 {kind:'caravan',name:'Wędrowna karawana',icon:'🛒',desc:'Kupcy zatrzymali się na krótki postój.',xp:90,gold:55,item:'potion'},
 {kind:'rift',name:'Szczelina energii',icon:'🌀',desc:'Niestabilna energia wypływa z ziemi.',xp:150,gold:30,item:'crystal'},
 {kind:'herbs',name:'Rzadkie zioła',icon:'🌿',desc:'Kępa rzadkich roślin pojawiła się po zmianie pogody.',xp:70,gold:18,item:'moonHerb'},
 {kind:'cache',name:'Porzucony skarb',icon:'📦',desc:'Ktoś ukrył tu skrzynię i już po nią nie wrócił.',xp:110,gold:75,item:'scrap'}
];
function biomeAt(x=0,y=0){
 const size=320,gx=Math.floor(x/size),gy=Math.floor(y/size),keys=Object.keys(BIOMES);
 const hash=gx*92821+gy*68917+4177;
 return keys[Math.floor(seeded(hash)*keys.length)%keys.length];
}
function biomeInfoAtPlayer(){const id=biomeAt(state?.player?.position?.x||0,state?.player?.position?.y||0);return {id,...BIOMES[id]}}
function biomeMonsterPool(id){
 const map={meadow:['rat','slime','wolf','goblin','beetle'],forest:['wolf','spider','goblin','beetle'],ruins:['skeleton','shade','ghost','cultist'],marsh:['slime','spider','ghost','elemental'],highlands:['ogre','wolf','elemental','wyvern']};
 return (map[id]||map.meadow).filter(id=>MONSTERS.some(m=>m.id===id));
}
function generateLivingMonsters(day){
 const out=[];
 for(let i=0;i<92;i++){
  const a=seeded(day+i*71)*Math.PI*2,r=70+seeded(day+i*113)*1820,x=Math.cos(a)*r,y=Math.sin(a)*r;
  const zone=zoneAt(x,y),biome=biomeAt(x,y);
  let pool=biomeMonsterPool(biome);
  if(x>=1440)pool=['frostRaptor','stormCultist','iceWraith','thunderGolem','mountainTroll','skySerpent','frozenKnight'].filter(id=>MONSTERS.some(m=>m.id===id));
  else if(x>=1040)pool=['ashScavenger','fireWasp','cinderCultist','emberWraith','slagGolem','ashDrake','pyreKnight'].filter(id=>MONSTERS.some(m=>m.id===id));
  else if(x>=620)pool=['mireCrawler','bogWraith','fenStalker','rotCultist','mossGolem','marshHag','blackrootGuardian'].filter(id=>MONSTERS.some(m=>m.id===id));
  else if(zone==='red')pool=['demon','hellhound','elemental'].filter(id=>MONSTERS.some(m=>m.id===id));
  else if(zone==='black')pool=['wyvern','demon','ogre'].filter(id=>MONSTERS.some(m=>m.id===id));
  const id=pool[Math.floor(seeded(day+i*157)*pool.length)]||'wolf';
  out.push({id:`live_${day}_${i}`,type:'monster',template:id,x,y,alive:true,respawn:0,elite:seeded(day+i*199)>.92,biome});
 }
 return out;
}
function makeLivingEvents(day){
 const out=[];
 for(let i=0;i<4;i++){
  const base=WORLD_EVENTS[i%WORLD_EVENTS.length],a=seeded(day+500+i*43)*Math.PI*2,r=140+seeded(day+700+i*59)*520;
  out.push({...base,id:`event_${day}_${i}`,type:'event',x:Math.cos(a)*r,y:Math.sin(a)*r,done:false});
 }
 return out;
}
function ensureLivingWorld(s=state){
 if(!s?.world)return;
 s.world.living ||= {spawnDay:0,eventDay:0,completedEvents:[],dailyExplore:{day:daySeed(),cells:{},claimed:false}};
 const L=s.world.living,day=daySeed();
 L.completedEvents ||= [];
 if(!L.dailyExplore||L.dailyExplore.day!==day)L.dailyExplore={day,cells:{},claimed:false};
 if(L.spawnDay!==day||L.eventDay!==day){
  const staticEntities=(s.world.entities||generateWorld()).filter(e=>!['monster','event'].includes(e.type));
  s.world.entities=[...generateLivingMonsters(day),...makeLivingEvents(day),...staticEntities];
  L.spawnDay=day;L.eventDay=day;L.completedEvents=[];
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
function resolveWorldEvent(e){
 if(!e||e.type!=='event')return;ensureLivingWorld();
 if(state.world.living.completedEvents.includes(e.id)||e.done)return toast('To wydarzenie zostało już ukończone.');
 const d=dist(e,state.player.position);if(d>60)return toast(`Podejdź bliżej. ${Math.round(d)} m.`);
 e.done=true;state.world.living.completedEvents.push(e.id);state.player.gold+=e.gold||0;if(e.item)addItem(e.item);gainXp(e.xp||0);save();toast(`${e.name}: +${e.xp} XP • +${e.gold} 🪙${e.item?` • ${itemDef(e.item).name}`:''}`);if(currentTab==='map')selectNav('map');
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
 if(gpsWatch!==null){closeModal();followGps=false;if(realMap)realMap.setView(ll,17,{animate:true});toast(`Mapa: ${n.name}`);return}
 const cost=travelCost(n);if(state.player.gold<cost)return toast(`Podróż kosztuje ${cost} 🪙.`);state.player.gold-=cost;
 state.player.position={x:n.x,y:n.y,lat:ll[0],lng:ll[1],gps:false,accuracy:0,heading:null,virtualTravel:true};state.world.exploration.travelVisited.push(id);save();closeModal();selectNav('map');toast(`Szybka podróż: ${n.name} • -${cost} 🪙. Tryb GPS-interakcji jest zablokowany.`)
}
function sectorLatLngRing(key){const size=explorationSectorSize(),{sx,sy}=sectorParts(key),x1=sx*size,y1=sy*size,x2=x1+size,y2=y1+size,a=worldToLatLng(x1,y1),b=worldToLatLng(x2,y2);if(!a||!b)return null;return [[a[0],a[1]],[b[0],a[1]],[b[0],b[1]],[a[0],b[1]]]}

function normalizeState(s){
 if(!s)return null;
 const previousVersion=s.version||0;
 s.version=115;
 s.player ||= {};
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
 s.settings.demo ??= true;s.settings.forceNight ??= false;
 s.settings.mapFilters ||= {monster:true,poi:true,dungeon:true,event:true,biome:false,trail:true};
 s.settings.mapFilters.monster ??= true;s.settings.mapFilters.poi ??= true;s.settings.mapFilters.dungeon ??= true;s.settings.mapFilters.event ??= true;s.settings.mapFilters.biome ??= false;s.settings.mapFilters.trail ??= true;ensureCoreState(s);
 s.adventure ||= {day:daySeed(),reputation:0,bounties:[],worldBossDay:0,achievements:{}};
 if(previousVersion<19&&s.world?.living){s.world.living.spawnDay=0;s.world.living.eventDay=0}
 ensureAdventureState(s);
 ensureEconomyState(s);
 ensureLivingWorld(s);
 ensureExplorationState(s);
 if(['hunter','ranger'].includes(s.player.class)&&s.player.pets.length===0){s.player.pets.push({id:'youngWolf',level:1,xp:0});s.player.petActive='youngWolf'}
 return s;
}

function load(){
 const now=rawLoad(SAVE_KEY);if(now)return normalizeState(now);
 for(const key of MIGRATION_KEYS){const old=rawLoad(key);if(old){const migrated=normalizeState(old);localStorage.setItem(SAVE_KEY,JSON.stringify(migrated));return migrated}}
 return null;
}
function newGame(name,cls){
 const c=CLASSES[cls];
 const weapon={id:starterWeapon(cls),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const armor={id:'leather',uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const boots={id:'trailBoots',uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const pets=['hunter','ranger'].includes(cls)?[{id:'youngWolf',level:1,xp:0}]:[];
 state={version:124,created:Date.now(),player:{name:name||'Wędrowiec',class:cls,level:1,xp:0,gold:55,hp:c.hp,maxHp:c.hp,mana:c.mana,maxMana:c.mana,stamina:100,maxStamina:100,stats:{...c.base},statPoints:0,skillPoints:1,skills:[],inventoryCapacity:32,inventory:[weapon,armor,boots,{id:'potion',qty:3},{id:'herb',qty:3},{id:'scrap',qty:1}],equipped:{weapon,helmet:null,armor,gloves:null,boots,amulet:null,ring1:null,ring2:null,offhand:null},bestiary:{},discovered:[],dungeons:[],dungeonClears:{},position:{x:0,y:0,lat:null,lng:null,gps:false},kills:0,guild:null,friends:[],pets,petActive:pets.length?'youngWolf':null},quests:{active:['q1'],done:[],progress:{}},world:{entities:generateWorld(),gpsOrigin:null,explored:[],fogRadius:100,living:{spawnDay:0,eventDay:0,completedEvents:[],dailyExplore:{day:daySeed(),cells:{},claimed:false}}},settings:{demo:true,forceNight:false,masterSound:true,audio:true,ambient:true,sfxVolume:.68,ambientVolume:.18,haptics:true,mapMode:'focused',mapFilters:{monster:true,poi:true,dungeon:true,event:true,biome:false,trail:true}},tutorial:{stage:0,complete:false,rewardGiven:false,flags:{},introSeen:false,finishReward:false,mapDismissedStage:-1},ui:{heroView:'char',adventureView:'quests',menuView:'settings'},adventure:{day:daySeed(),reputation:0,bounties:makeDailyBounties(daySeed()),worldBossDay:0,achievements:{}},economy:{elitePity:0,bossPity:0,totalSold:0,totalSalvaged:0}};
 ensureLivingWorld();ensureExplorationState();save();render();setTimeout(showPrologue,80);
}
function resetCharacter(){if(!confirm('Zresetować postać i wrócić do kreatora? Usunie to lokalny postęp tej gry.'))return;try{if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch)}catch{}gpsWatch=null;stopAmbient();for(const key of Object.keys(localStorage)){if(key===SAVE_KEY||key.startsWith('time4heroes_build_')||key.startsWith('georpg_build_'))localStorage.removeItem(key)}state=null;combat=null;dungeonRun=null;currentTab='map';destroyRealMap();render();}
function centerMapOnPlayer(){selectNav('map');setTimeout(()=>{if(realMap&&state?.player?.position?.lat){followGps=true;realMap.setView([state.player.position.lat,state.player.position.lng],17,{animate:true})}},120)}
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
  {id:'pasture',name:'Opuszczone Pastwisko',icon:'🐑',x:95,y:55},{id:'wolfDen',name:'Wilcza Jama',icon:'🐾',x:165,y:80},{id:'oldRuins',name:'Stare Ruiny',icon:'🏚️',x:180,y:-112},{id:'watchPoint',name:'Punkt Obserwacyjny',icon:'👁️',x:145,y:-75},{id:'goblinCamp',name:'Gobliński Obóz',icon:'⛺',x:230,y:-95},{id:'hunterTrail',name:'Ślady Myśliwego',icon:'👣',x:-150,y:130},{id:'woundedHunter',name:'Ranny Myśliwy',icon:'🧔',x:-205,y:165},{id:'hermit',name:'Chata Pustelnika',icon:'🛖',x:-255,y:-75},{id:'nightGuest',name:'Nocny Punkt Obserwacji',icon:'🌙',x:245,y:-135},{id:'northCamp',name:'Obóz Północny',icon:'🏕️',x:430,y:210},{id:'brokenBridge',name:'Zerwany Most',icon:'🌉',x:485,y:80},{id:'coldShrine',name:'Mroźne Sanktuarium',icon:'❄️',x:520,y:-100},
  ...REGION3_POIS
 ];
 return [...ents,...DUNGEONS.map(d=>({...d,type:'dungeon'})),...poi.map(p=>({...p,type:'poi'}))];
}

function monsterTemplate(e){return MONSTERS.find(m=>m.id===e.template)||MONSTERS[0]}
function monsterLevel(m){const p=state?.player?.level||1;return clamp(p+rnd(-2,2),m.min,m.max)}
function attackPower(){const p=state.player;return Math.floor(5+p.stats.str*1.65+p.stats.agi*.55+p.stats.int*.25+gearStat('power'))}
function armorPower(){const p=state.player;return Math.floor(p.stats.vit*.55+gearStat('armor'))}
function critChance(){const p=state.player;const pet=p.petActive?petDef(p.petActive):null;return Math.min(65,5+p.stats.agi*.55+gearStat('crit')+(pet?.crit||0))}
function petInstance(){return state.player.pets.find(p=>p.id===state.player.petActive)||null}
function petPower(){const p=petInstance();if(!p)return 0;return (petDef(p.id)?.power||0)+p.level*2}

function gainXp(amount){
 const p=state.player;p.xp+=amount;let levels=0;
 while(p.xp>=xpNeed(p.level)&&p.level<100){p.xp-=xpNeed(p.level);p.level++;levels++;p.statPoints+=3;p.skillPoints+=1;const c=CLASSES[p.class];p.maxHp+=Math.floor(9+c.base.vit*.6);p.hp=p.maxHp;p.maxMana+=Math.floor(3+c.base.int*.3);p.mana=p.maxMana}
 if(levels){toast(`Awans! Poziom ${p.level}. +${levels*3} pkt statystyk i +${levels} pkt umiejętności.`);playSfx('level');haptic([25,35,25])}save();
}
function gainPetXp(amount){const p=petInstance();if(!p)return;p.xp+=Math.max(1,Math.floor(amount*.2));while(p.xp>=p.level*90){p.xp-=p.level*90;p.level++;toast(`${petDef(p.id).name} awansuje na poziom ${p.level}!`)}}
function rewardQuest(q){gainXp(q.xp);state.player.gold+=q.gold;if(!state.quests.done.includes(q.id))state.quests.done.push(q.id);state.quests.active=state.quests.active.filter(id=>id!==q.id);if(q.id==='q13'&&!countItem('blackMedallion'))addItem('blackMedallion');if(q.id==='q25'){addItem('mistHood');addItem('wraithEssence',2)}if(q.id==='q30'){addItem('mistMail');addItem('bogAmber',2)}if(q.id==='q35'){addItem('mistBlade');addItem('mireCharm');if(['hunter','ranger'].includes(state.player.class)&&!state.player.pets.some(p=>p.id==='mireLynx')){state.player.pets.push({id:'mireLynx',level:1,xp:0});toast('Nowy chowaniec: Ryś Mgieł!')}if(state.story?.flags?.endingDestroy)state.adventure.reputation+=2;if(state.story?.flags?.endingSeal)state.adventure.reputation+=4}if(q.id==='q38'){addItem('ashHelm');addItem('charredIron',2)}if(q.id==='q45'){addItem('ashBlade');addItem('cinderCharm');if(['hunter','ranger'].includes(state.player.class)&&!state.player.pets.some(p=>p.id==='cinderHound')){state.player.pets.push({id:'cinderHound',level:1,xp:0});toast('Nowy chowaniec: Ogar Popiołu!')}}if(q.id==='q48'){addItem('stormHelm');addItem('frostCrystal',2)}if(q.id==='q55'){addItem('stormSpear');addItem('tempestCharm');if(['hunter','ranger'].includes(state.player.class)&&!state.player.pets.some(p=>p.id==='stormHawk')){state.player.pets.push({id:'stormHawk',level:1,xp:0});toast('Nowy chowaniec: Jastrząb Burzy!')}}toast(`Quest ukończony: ${q.name} • +${q.xp} XP • +${q.gold} 🪙`);save()}
function checkQuestProgress(type,target,amount=1){
 progressBounties(type,target,amount);
 for(const qid of [...state.quests.active]){const q=QUESTS.find(x=>x.id===qid);if(!q)continue;const prog=state.quests.progress[qid] ||= q.steps.map(()=>0);q.steps.forEach((s,i)=>{if(s.type!==type)return;if(type==='kill'&&(s.target==='any'||s.target===target))prog[i]=Math.min(s.count||1,prog[i]+amount);else if(type==='move')prog[i]=Math.max(prog[i],amount);else if(type==='story'&&s.target===target)prog[i]=1;else if(s.target===target)prog[i]=1});if(q.steps.every((s,i)=>prog[i]>=(s.count||1)))rewardQuest(q)}save();
}

function render(){if(!state){renderCreate();return}renderShell()}



function showPrologue(){if(!state||state.tutorial?.introSeen)return;state.tutorial.introSeen=true;save();openModal(`<div class="prologue"><div class="prologue-mark">TIME4HEROES</div><h2>Cienie nad Doliną</h2><p>Budzi Cię bicie dzwonu z małej wioski. Na drogach pojawiają się potwory, ludzie znikają, a stare znaki wracają na kamienie, na których nie powinno ich być.</p><div class="prologue-grid"><div><b>🌫️ Odkrywaj</b><small>Ruszaj w realny świat i odkrywaj nowe miejsca.</small></div><div><b>⚔️ Walcz</b><small>Rozwijaj klasę, sprzęt i własny styl walki.</small></div><div><b>📜 Decyduj</b><small>Śledztwa i wybory zmieniają historię.</small></div></div><button class="primary large" data-prologue-start>Wyrusz z wioski</button></div>`);document.querySelector('[data-prologue-start]')?.addEventListener('click',()=>{closeModal();toast('Pierwszy cel: oddal się 60 m od wioski.')})}

function renderCreate(){
 let selected='knight';
 app.innerHTML=`<div class="boot mobile-boot"><section class="mobile-brand"><div class="brand-badge">BUILD 2.5 • LIVING WORLD</div><h1 class="time4-logo"><span>TIME</span><strong>4</strong><span>HEROES</span></h1><p>Świat jest bliżej niż myślisz.</p><div class="hero-lineup">${classVisual('hunter','lineup side')}${classVisual('knight','lineup main')}${classVisual('mage','lineup side')}</div><div class="mobile-ready">📱 GPS RPG • gotowe na telefon • instalowalne jak aplikacja</div><button class="secondary install-cta" data-install-create>📲 Zainstaluj Time4Heroes</button></section><div class="card create create-mobile"><h2>Stwórz bohatera</h2><div class="form-row"><label>Imię</label><input id="heroName" maxlength="18" value="Krzysztof" autocomplete="off"></div><div class="class-grid">${Object.entries(CLASSES).map(([id,c])=>`<button class="class-btn ${id===selected?'active':''}" data-class="${id}"><span class="class-icon">${classVisual(id,'sprite-class-btn')}</span><b>${c.name}</b><div class="tiny">${c.desc}</div></button>`).join('')}</div><div id="classDesc" class="panel-item hero-preview" style="margin:12px 0"></div><button id="startGame" class="primary large">Rozpocznij przygodę</button></div></div>`;
 const desc=()=>{const c=CLASSES[selected];document.querySelector('#classDesc').innerHTML=`<div class="preview-avatar">${classVisual(selected,'sprite-preview')}</div><div><b>${c.name}</b><div class="muted">STR ${c.base.str} • AGI ${c.base.agi} • INT ${c.base.int} • VIT ${c.base.vit}</div><div>${c.desc}</div>${['hunter','ranger'].includes(selected)?'<div class="gold">🐺 Startujesz z chowańcem: Młody Wilk.</div>':''}</div>`};desc();
 document.querySelectorAll('[data-class]').forEach(b=>b.onclick=()=>{selected=b.dataset.class;document.querySelectorAll('[data-class]').forEach(x=>x.classList.toggle('active',x===b));desc()});
 document.querySelector('#startGame').onclick=()=>newGame(document.querySelector('#heroName').value.trim(),selected);
 document.querySelector('[data-install-create]')?.addEventListener('click',installPwa);
}
const GRAPHICS={
 classes:{knight:'assets/knight.png',mage:'assets/mage.png',hunter:'assets/hunter.png',berserker:'assets/berserker.png',ranger:'assets/ranger.png'},
 monsters:{
  wolf:'assets/wolf.png',goblin:'assets/goblin.png',skeleton:'assets/skeleton.png',spider:'assets/spider.png',elemental:'assets/elemental.png',
  ghost:'assets/ghost.png',cultist:'assets/cultist.png',demon:'assets/demon.png',hellhound:'assets/hellhound.png',wyvern:'assets/wyvern.png',
  marshHag:'assets/marshHag.png',blackrootGuardian:'assets/blackrootGuardian.png',mireMother:'assets/mireMother.png',
  cinderMatriarch:'assets/cinderMatriarch.png',tempestLord:'assets/tempestLord.png',shade:'assets/ghost.png'
 },
 npcs:{
  Dorian:'assets/npc-dorian.png',Selma:'assets/npc-selma.png',Ragor:'assets/npc-ragor.png',
  Ilyra:'assets/npc-ilyra.png',Varo:'assets/npc-varo.png',Edrin:'assets/npc-edrin.png'
 },
 pets:{youngWolf:'assets/wolf.png',cinderHound:'assets/hellhound.png'}
};
function sprite(path,alt,cls){return `<img src="${path}" alt="${alt}" class="pixel-sprite ${cls||''}">`}
function classVisual(id,cls='sprite-inline'){const c=CLASSES[id];const path=GRAPHICS.classes[id];return path?sprite(path,c?.name||id,cls):(c?.icon||'❓')}
function monsterVisual(id,cls='sprite-inline'){const m=MONSTERS.find(x=>x.id===id);const path=GRAPHICS.monsters[id];return path?sprite(path,m?.name||id,cls):(m?.icon||'❓')}
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
function npcCard(name, role, classId, text){
  return `<div class="npc-card"><div class="npc-portrait">${npcVisual(name,classId,'sprite-npc')}</div><div><b>${name}</b><div class="muted">${role}</div><p>${text}</p></div></div>`;
}


function topbar(){
 const p=state.player,c=CLASSES[p.class],need=xpNeed(p.level),cl=climate(),pet=petInstance();
 const region='Las Dębowy';
 const now=new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
 return `<header class="topbar topbar-fantasy topbar-compact"><div class="brand-side"><div class="identity"><div class="mini-avatar">${classVisual(p.class,'sprite-mini')}</div><div><b>${p.name}</b><div class="tiny">${c.name} • poziom ${p.level} <span class="build-chip">2.5.2</span></div></div></div><div class="bars"><div><div class="barwrap"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div><div class="barwrap"><div class="bar xp" style="width:${100*p.xp/need}%"></div><div class="barlabel">XP ${p.xp}/${need}</div></div><div class="tiny">ATK ${attackPower()} • Pancerz ${armorPower()} • Kryt ${critChance().toFixed(0)}%${pet?` • 🐾 lvl ${pet.level}`:''}</div></div></div></div><div class="hud-right"><div class="resource resource-fantasy"><span>🪙 <strong>${p.gold}</strong></span><span>💎 <strong>${countItem('crystal')}</strong></span><span>⚡ <strong>${p.stamina??100}/${p.maxStamina??100}</strong></span></div><div class="world-meta"><span>${region}</span><span>${cl.icon} ${cl.weather}</span><span>🕒 ${now}</span></div></div></header>`;
}

function bottomNav(){const tabs=[['map','🗺️','Mapa','nav'],['hero','🧙','Bohater','nav'],['town','🏰','Miasto','nav'],['quests','📜','Zadania','shortcut'],['menu','☰','Menu','nav']];return `<nav class="bottom core-nav">${tabs.map(([id,ico,name,type])=>type==='shortcut'?`<button class="navbtn ${currentTab==='adventureHub'&&state.ui.adventureView==='quests'?'active':''}" data-shortcut="${id}"><span>${ico}</span>${name}</button>`:`<button class="navbtn ${id===currentTab?'active':''}" data-nav="${id}"><span>${ico}</span>${name}</button>`).join('')}</nav>`}

function activeTaskCount(){ensureAdventureState();return state.quests.active.length+(state.adventure.bounties||[]).filter(b=>b.accepted&&!b.claimed).length}
function canAcceptTask(){return activeTaskCount()<4}
function nextStoryQuestAvailable(){
 for(let i=0;i<QUESTS.length;i++){
  const q=QUESTS[i];if(state.quests.done.includes(q.id)||state.quests.active.includes(q.id))continue;
  const prev=i>0?QUESTS[i-1]:null;if(prev&&!state.quests.done.includes(prev.id))continue;
  if(q.level<=state.player.level+1)return q;
 }
 return null;
}
function acceptStoryQuest(qid){const q=QUESTS.find(x=>x.id===qid);if(!q||state.quests.done.includes(qid)||state.quests.active.includes(qid))return;if(!canAcceptTask())return toast('Możesz mieć maksymalnie 4 aktywne questy. Samouczek nie liczy się do limitu.');state.quests.active.push(qid);state.quests.progress[qid] ||= q.steps.map(()=>0);save();toast(`Przyjęto: ${q.name}`);openBuilding('tavern','board')}
function acceptBounty(id){ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||b.claimed||b.accepted)return;if(!canAcceptTask())return toast('Możesz mieć maksymalnie 4 aktywne questy. Samouczek nie liczy się do limitu.');b.accepted=true;b.progress=0;save();toast(`Przyjęto zlecenie: ${b.name}`);openBuilding('tavern','board')}
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
  if(id==='bag'){state.ui.heroView='bag';save();selectNav('hero');return;}
  if(id==='bestiary'){state.ui.adventureView='bestiary';save();selectNav('adventureHub');return;}
  if(id==='skills'){state.ui.heroView='skills';save();selectNav('hero');return;}
  if(id==='quests'){state.ui.adventureView='quests';save();selectNav('adventureHub');return;}
 });
}

function renderShell(){destroyRealMap();app.innerHTML=`<div class="shell shell-21">${connectionBanner()}${topbar()}<div class="shell-body"><div class="content-zone"><div class="main"><main class="viewport" id="viewport"></main><aside class="side" id="side"></aside></div></div></div><button class="quest-float" data-quest-float title="Questy">📜<span>${activeTaskCount()||''}</span></button>${bottomNav()}</div>`;bindShellControls(document);document.querySelector('[data-quest-float]')?.addEventListener('click',openQuestView);selectNav(currentTab,false)}
function selectNav(id,rebuild=true){if(id!=='map')destroyRealMap();currentTab=id;if(rebuild)document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id));const el=document.querySelector('#viewport'),side=document.querySelector('#side'),main=document.querySelector('.main');if(!el||!side)return;main?.classList.add('map-main-only');side.style.display='none';({map:renderMap,hero:renderHeroHub,adventureHub:renderAdventureHub,town:renderTown,menu:renderMenuHub}[id]||renderMap)(el);bindTutorialControls(document);bindShellControls(document)}
function renderHeroHub(el){
 ensureCoreState();
 if(state.ui.heroView==='inv')state.ui.heroView='bag';
 if(!['char','bag','skills'].includes(state.ui.heroView))state.ui.heroView='char';
 el.innerHTML=`<div class="hub-tabs hero-hub-tabs"><button class="secondary ${state.ui.heroView==='char'?'active':''}" data-hero-view="char">🧙 Postać i ekwipunek</button><button class="secondary ${state.ui.heroView==='bag'?'active':''}" data-hero-view="bag">🎒 Plecak</button><button class="secondary ${state.ui.heroView==='skills'?'active':''}" data-hero-view="skills">🌳 Umiejętności</button></div><div id="hubContent"></div>`;
 const body=el.querySelector('#hubContent');
 if(state.ui.heroView==='bag'){tutorialEvent('inventory');renderInventory(body)}
 else if(state.ui.heroView==='skills')renderSkillsTree(body);
 else renderHeroOverview(body);
 el.querySelectorAll('[data-hero-view]').forEach(b=>b.onclick=()=>{state.ui.heroView=b.dataset.heroView;save();renderHeroHub(el)});
}
function renderHeroOverview(el){renderCharacter(el);el.querySelector('.skill-tree-head')?.remove();el.querySelector('.skill-branches')?.remove()}
function renderSkillsTree(el){
 const p=state.player,c=CLASSES[p.class],branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 el.innerHTML=`<div class="section-title"><div><h2>🌳 Umiejętności</h2><div class="muted">${c.name} • rozwijaj wybraną ścieżkę bohatera.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="skill-branches standalone-skills">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div>`;
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
}
function renderAdventureHub(el){
 ensureCoreState();
 const canTrips=state.player.level>=4||state.quests.done.includes('q3'),canBest=state.player.kills>0;
 state.ui.adventureView ||= 'quests';
 const tabs=[
  ['quests','📜','Zadania',true],['events','✨','Wydarzenia',true],['trips','🧭','Wyprawy',canTrips],['bestiary','📖','Bestiariusz',canBest]
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
 fogLayer=null;trailLayer=null;playerMapMarker=null;accuracyCircle=null;interactionCircle=null;leafletEntityLayers=[];leafletZoneLayers=[];leafletBiomeLayers=[];leafletDecorLayers=[];
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
 leafletBiomeLayers.forEach(x=>realMap.removeLayer(x));leafletBiomeLayers=[];
 if(!state.settings.mapFilters.biome)return;
 const size=320,px=state.player.position.x||0,py=state.player.position.y||0,cx=Math.floor(px/size),cy=Math.floor(py/size);
 for(let gx=cx-2;gx<=cx+2;gx++)for(let gy=cy-2;gy<=cy+2;gy++){
  const x1=gx*size,y1=gy*size,x2=x1+size,y2=y1+size,id=biomeAt(x1+size/2,y1+size/2),bio=BIOMES[id];
  const a=worldToLatLng(x1,y1),b=worldToLatLng(x2,y2);if(!a||!b)continue;
  const layer=L.rectangle([a,b],{pane:'biomePane',color:bio.color,weight:1,fillColor:bio.color,fillOpacity:.11,interactive:false}).addTo(realMap);leafletBiomeLayers.push(layer);
 }
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
function nearbyInteractables(limit=3){return (state.world.entities||[]).filter(e=>(e.type!=='monster'||e.alive)&&(e.type!=='event'||!e.done)).map(e=>({e,d:dist(e,state.player.position)})).filter(x=>x.d<=60).sort((a,b)=>a.d-b.d).slice(0,limit)}
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
  .filter(e=>e.type!=='monster'||e.alive)
  .filter(e=>e.type!=='event'||!e.done)
  .filter(e=>e.type==='monster'?filters.monster:e.type==='dungeon'?filters.dungeon:e.type==='event'?filters.event:filters.poi)
  .filter(secretMapVisible)
  .filter(focusedEntityVisible)
  .map(e=>({e,ll:worldToLatLng(e.x,e.y),d:dist(e,state.player.position)}))
  .filter(x=>x.ll&&bounds.contains(x.ll))
  .map(x=>{const e=x.e;let priority=6;if(e.type==='secret')priority=0;else if(targets.has(e.id)||(e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template)))priority=1;else if(e.type==='event')priority=2;else if(e.type==='dungeon')priority=3;else if(e.type==='monster'&&e.elite)priority=4;else if(e.type==='poi')priority=5;return {...x,priority}})
  .sort((a,b)=>a.priority-b.priority||a.d-b.d);
 const monsterLimit=state.settings.mapMode==='focused'?12:28,otherLimit=state.settings.mapMode==='focused'?18:36;
 let monsters=0,others=0;
 const visible=candidates.filter(x=>{if(x.e.type==='monster'){if(monsters>=monsterLimit)return false;monsters++;return true}if(others>=otherLimit)return false;others++;return true});
 for(const {e,ll,d} of visible.filter(x=>x.d<=180&&(x.e.type==='event'||x.e.type==='dungeon'||x.e.elite))){
  const color=e.type==='event'?'#d7b85f':e.type==='dungeon'?'#866eb8':'#b8634f';
  const ring=L.circle(ll,{radius:e.type==='dungeon'?34:24,pane:'overlayPane',color,weight:1.5,dashArray:'3 6',fillColor:color,fillOpacity:.045,interactive:false}).addTo(realMap);leafletZoneLayers.push(ring);
 }
 for(const {e,ll,d} of visible){
  let inner='',label='';
  const questTarget=targets.has(e.id)||(e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template));
  if(e.type==='monster'){const m=monsterTemplate(e),near=d<=60?' interaction-ready':d<=120?' proximity':'';inner=`<div class="mmo-marker monster-marker ${e.elite?'elite-marker':''} ${questTarget?'quest-marker':''}${near}">${e.elite?'<span class="mmo-star">★</span>':''}${monsterVisual(m.id,'mmo-sprite')}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=m.name}
  else if(e.type==='event'){inner=`<div class="mmo-marker event-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${e.icon}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=e.name}
  else if(e.type==='secret'){const found=state.world.exploration.secretsFound.includes(e.id);inner=`<div class="mmo-marker secret-marker ${found?'found':''}">${found?e.icon:'❔'}</div>`;label=found?e.name:'Sekret w pobliżu'}
  else if(e.type==='dungeon'){const known=state.player.dungeons.includes(e.id);inner=`<div class="mmo-marker dungeon-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${known?e.icon:'❓'}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=known?e.name:'Nieznany loch'}
  else {const known=state.player.discovered.includes(e.id);inner=`<div class="mmo-marker poi-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${known?e.icon:'❓'}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=known?e.name:'Nieznane miejsce'}
  const marker=L.marker(ll,{pane:'gamePane',icon:makeLeafletIcon(inner,'game-map-icon',[52,52]),title:label}).addTo(realMap);
  marker.on('click',()=>interactEntity(e));leafletEntityLayers.push(marker);
 }
}
function updateLiveMapPosition(){
 if(!realMap||!state.player.position.lat)return;
 const ll=[state.player.position.lat,state.player.position.lng];
 if(playerMapMarker)playerMapMarker.setLatLng(ll);
 if(accuracyCircle){accuracyCircle.setLatLng(ll);accuracyCircle.setRadius(Math.max(8,state.player.position.accuracy||15))}
 if(interactionCircle)interactionCircle.setLatLng(ll);
 if(followGps)realMap.panTo(ll,{animate:true,duration:.35});
 const hud=document.querySelector('[data-live-gps]');if(hud)hud.textContent=`GPS ±${Math.round(state.player.position.accuracy||0)} m`;
 const fogCount=document.querySelector('[data-fog-count]');if(fogCount){const r=regionDiscoveryStats();fogCount.textContent=`${r.name}: ${r.percent}%`} refreshNearbyTray();
}
function initRealMap(){
 const target=document.querySelector('#realMap');if(!target)return;
 if(!window.L){target.innerHTML='<div class="map-error">Mapa OpenStreetMap jest niedostępna. Połącz się z internetem, aby zobaczyć prawdziwą mapę GPS.</div>';return}
 destroyRealMap();
 realMap=L.map(target,{zoomControl:false,attributionControl:true,minZoom:3,maxZoom:19,preferCanvas:true});
 realMap.createPane('biomePane');realMap.getPane('biomePane').style.zIndex=280;
 realMap.createPane('decorPane');realMap.getPane('decorPane').style.zIndex=360;realMap.getPane('decorPane').style.pointerEvents='none';
 realMap.createPane('gamePane');realMap.getPane('gamePane').style.zIndex=620;
 realMap.createPane('playerPane');realMap.getPane('playerPane').style.zIndex=700;
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors',updateWhenIdle:true,keepBuffer:2,className:'rpg-osm-tiles'}).addTo(realMap);
 const p=state.player.position,origin=state.world.gpsOrigin;
 const center=p.lat?[p.lat,p.lng]:origin?[origin.lat,origin.lng]:[52.1,19.4];
 realMap.setView(center,p.lat?17:origin?16:6);
 if(origin){rebuildGameLayers()}
 if(p.lat){
  const html=`<div class="leaflet-player-marker rpg-player-marker">${classVisual(p.class,'mmo-player-sprite')}<span></span></div>`;
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
  return `<button class="dash-entity monster ${e.elite?'elite':''}" style="left:${pt.left}%;top:${pt.top}%" title="${m.name} • ${d} m" data-dash-entity="${e.id}"><span class="badge">${e.elite?'☠️':'⚔️'}</span><span class="sprite">${monsterVisual(m.id,'sprite-entity')}</span><small>${m.name}<em>${d} m</em></small></button>`;
 }
 const discovered=state.player.discovered.includes(e.id)||state.player.dungeons.includes(e.id);
 return `<button class="dash-entity ${e.type}" style="left:${pt.left}%;top:${pt.top}%" title="${discovered?e.name:'Nieznane miejsce'} • ${d} m" data-dash-entity="${e.id}"><span class="badge">${e.icon||'📍'}</span><small>${discovered?e.name:'Nieznane'}<em>${d} m</em></small></button>`;
}
function mapQuickActionsHTML(){
 const p=state.player,hasGeo=!!(p.position.lat&&p.position.lng),virtual=!!p.position.virtualTravel;
 return `<div class="map-quick-actions"><button class="secondary" data-map-gps>${gpsWatch!==null?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button><button class="secondary" data-map-center>🎯 Do mnie</button><button class="secondary" data-shortcut="quests">📜 Zadania</button><button class="secondary" data-nav="town">🏰 Miasto</button><span class="map-status-chip">${virtual?'TRYB DOMOWY':hasGeo?`GPS ±${Math.round(p.position.accuracy||0)} m`:'GPS wyłączony'}</span></div>`;
}
function mapSideTab(){state.ui.mapPanelTab ||= 'quests';return state.ui.mapPanelTab}
function mapSideTabsHTML(){const cur=mapSideTab();const tabs=[['quests','Zadania'],['events','Wydarzenia'],['nearby','W pobliżu']];return `<div class="map-panel-tabs">${tabs.map(([id,label])=>`<button class="${cur===id?'active':''}" data-map-side-tab="${id}">${label}</button>`).join('')}</div>`}
function mapQuestPanelHTML(){
 const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean).slice(0,4);
 const next=nextStoryQuestAvailable();
 return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>Zadania</h3><span>${activeTaskCount()}/4</span></div>${active.length?active.map(q=>{const steps=(state.quests.progress[q.id]||[]).reduce((a,b)=>a+(b?1:0),0);const total=q.steps?.length||1;return `<div class="quest-entry"><div><b>${q.name}</b><small>${q.chapter||'Przygoda'} • lvl ${q.level}</small></div><div class="quest-progress-mini"><span style="width:${Math.min(100,steps/total*100)}%"></span></div><p>${q.desc||q.steps?.[0]?.desc||'Kontynuuj zadanie na mapie.'}</p></div>`}).join(''):`<div class="panel-empty">Brak aktywnych zadań.</div>`}${next?`<div class="quest-entry available"><div><b>Dostępne dalej</b><small>${next.chapter||'Przygoda'} • lvl ${next.level}</small></div><p>${next.name}</p><button class="secondary" data-open-quests>Otwórz dziennik</button></div>`:''}</div>`;
}
function mapEventsPanelHTML(){
 const discovered=state.player.discovered.slice(-3).reverse();
 const done=state.quests.done.slice(-2).reverse();
 const entries=[];
 entries.push({t:'Teraz',text:`Region: ${biomeInfoAtPlayer().name} • pogoda: ${climate().weather}`});
 if(state.player.kills>0)entries.push({t:'Przed chwilą',text:`Pokonane potwory łącznie: ${state.player.kills}`});
 discovered.forEach(id=>{const e=state.world.entities.find(x=>x.id===id);if(e)entries.push({t:'Odkrycie',text:`Odkryto: ${e.name}`})});
 done.forEach(id=>{const q=QUESTS.find(x=>x.id===id);if(q)entries.push({t:'Ukończono',text:`Quest: ${q.name}`})});
 if(state.player.dungeons.length)entries.push({t:'Lochy',text:`Odkryte lochy: ${state.player.dungeons.length}`});
 return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>Wydarzenia</h3><span>Na bieżąco</span></div><div class="event-feed">${entries.slice(0,6).map(e=>`<div class="event-row"><b>${e.t}</b><p>${e.text}</p></div>`).join('')}</div></div>`;
}
function mapNearbyPanelHTML(){
 const nearby=mapDashboardEntities(180).slice(0,6);
 return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>W pobliżu</h3><span>60 m interakcji</span></div>${nearby.length?nearby.map(e=>{const d=Math.round(dist(e,state.player.position));const name=e.type==='monster'?monsterTemplate(e).name:e.name;return `<button class="nearby-row" data-dash-entity="${e.id}"><b>${e.icon|| (e.type==='monster'?'⚔️':'📍')} ${name}</b><small>${e.type} • ${d} m</small></button>`}).join(''):`<div class="panel-empty">Nic ciekawego w pobliżu.</div>`}</div>`;
}
function mapRightPanelHTML(){const tab=mapSideTab();return `${mapSideTabsHTML()}${tab==='events'?mapEventsPanelHTML():tab==='nearby'?mapNearbyPanelHTML():mapQuestPanelHTML()}`}
function mapBackpackPreviewHTML(){
 const p=state.player;const cap=inventoryCapacity(),used=inventoryUsedSlots();const items=p.inventory.slice(0,12);
 return `<section class="dashboard-panel inventory-preview fantasy-card"><div class="panel-title-line"><h3>Plecak</h3><span>${used}/${cap}</span></div><div class="mini-bag-grid">${items.map((i,idx)=>{const d=itemDef(i.id);return `<button class="mini-bag-slot rarity-border-${d.rarity||'common'}" data-bag-index="${idx}"><span>${itemIconVisual(d.id,'mini-item-svg')}</span>${(i.qty||1)>1?`<em>${i.qty}</em>`:''}</button>`}).join('')}${Array.from({length:Math.max(0,12-items.length)}).map(()=>`<div class="mini-bag-slot empty"></div>`).join('')}</div><button class="secondary wide" data-shortcut="bag">Otwórz plecak</button></section>`;
}
function mapTownPreviewHTML(){
 const defs=[['tavern','Karczma','🍺'],['smith','Kuźnia','⚒️'],['alchemist','Alchemik','🧪'],['shop','Sklep','🛒'],['guild','Gildia','🛡️'],['auction','Aukcje','💰']];
 return `<section class="dashboard-panel city-preview fantasy-card"><div class="panel-title-line"><h3>Miasto — Dębogród</h3><span>Hub</span></div><div class="city-preview-grid">${defs.map(([id,name,icon])=>{const req=CORE_UNLOCKS[id];const locked=req&&state.player.level<req.level;return `<button class="city-mini-btn ${locked?'locked':''}" data-map-building="${id}" ${locked?'disabled':''}><span>${icon}</span><b>${name}</b><small>${locked?req.label:'wejdź'}</small></button>`}).join('')}</div></section>`;
}
function renderMap(el){setAmbient('forest');destroyRealMap();ensureLivingWorld();state.ui.mapPanelTab ||= 'quests';state.ui.mapSheetOpen ??= false;const p=state.player,hasGeo=!!(p.position.lat&&p.position.lng),virtual=!!p.position.virtualTravel;for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true;const tutorial=tutorialMapOverlay();const region=biomeInfoAtPlayer(),cl=climate();const weatherSlug=cl.weather.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('ł','l');const phaseSlug=cl.phase.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');el.innerHTML=`<div class="world-dashboard osm-rpg-dashboard living-world-dashboard"><section class="dashboard-main-card fantasy-card osm-rpg-card"><div class="dashboard-map-header compact-map-head"><div><div class="dashboard-kicker">Mapa GPS • OpenStreetMap • Żywy świat</div><h2>${region.icon} ${region.name}</h2><p>${region.desc} <b>${cl.icon} ${cl.weather}</b> • ${cl.phase}</p></div>${mapQuickActionsHTML()}</div><div class="real-map-rpg-frame weather-frame-${weatherSlug} phase-frame-${phaseSlug}"><div id="realMap" class="real-map real-map-rpg"></div>${mapAmbientFxHTML()}<div class="rpg-map-vignette"></div><div class="rpg-map-compass">N</div><div class="rpg-map-legend"><span>${region.icon} ${region.name}</span><span>⚔️ potwory</span><span>✨ eventy</span><span>🕳️ lochy</span></div><div class="map-ui-stack osm-controls"><button class="map-ui-btn" data-osm-zoom="in">＋</button><button class="map-ui-btn" data-osm-zoom="out">－</button><button class="map-ui-btn" data-osm-center>◎</button><button class="map-ui-btn" data-map-sheet-toggle>📜</button></div>${tutorial}${!hasGeo?`<div class="gps-start-card dashboard-gps-card osm-gps-card"><b>📍 Włącz prawdziwy GPS</b><p>Pozycja gracza pojawi się na OpenStreetMap, a świat RPG zostanie rozmieszczony wokół Ciebie.</p><div class="gps-card-actions"><button class="primary" data-map-gps>Włącz GPS</button><button class="secondary" data-map-demo-step="up">Test bez GPS</button></div></div>`:''}${nearbyTrayHTML()}<div class="osm-map-footer"><span class="map-status-chip" data-live-gps>${virtual?'TRYB DOMOWY':hasGeo?`GPS ±${Math.round(p.position.accuracy||0)} m`:'GPS wyłączony'}</span><span class="interaction-badge">⚔️ interakcja 60 m</span></div></div>${mobileMapSheetToggleHTML()}</section><aside class="dashboard-side-card fantasy-card map-journal-sheet ${state.ui.mapSheetOpen?'open':''}" data-map-journal-sheet>${mapRightPanelHTML()}</aside><div class="dashboard-bottom-row">${mapBackpackPreviewHTML()}${mapTownPreviewHTML()}</div></div>`;
 el.querySelectorAll('[data-map-side-tab]').forEach(b=>b.onclick=()=>{state.ui.mapPanelTab=b.dataset.mapSideTab;save();renderMap(el)});
 el.querySelectorAll('[data-map-demo-step]').forEach(b=>b.onclick=()=>{const step=b.dataset.mapDemoStep;const delta={up:[0,30],down:[0,-30],left:[-30,0],right:[30,0]}[step];if(delta)moveDemo(delta[0],delta[1])});
 el.querySelectorAll('[data-map-building]').forEach(b=>b.onclick=()=>openBuilding(b.dataset.mapBuilding,'scene'));
 el.querySelectorAll('[data-map-gps]').forEach(b=>b.addEventListener('click',toggleGps));
 el.querySelectorAll('[data-osm-zoom]').forEach(b=>b.onclick=()=>{if(!realMap)return;b.dataset.osmZoom==='in'?realMap.zoomIn():realMap.zoomOut()});
 const centerNow=()=>{if(realMap&&p.lat){followGps=true;realMap.setView([p.lat,p.lng],Math.max(16,realMap.getZoom()),{animate:true})}else toast('Włącz GPS, aby wyśrodkować mapę.')};
 el.querySelector('[data-osm-center]')?.addEventListener('click',centerNow);
 el.querySelectorAll('[data-map-center]').forEach(b=>b.addEventListener('click',centerNow));
 el.querySelectorAll('[data-map-sheet-toggle]').forEach(b=>b.onclick=()=>{state.ui.mapSheetOpen=!state.ui.mapSheetOpen;save();renderMap(el)});
 el.querySelector('[data-open-quests]')?.addEventListener('click',openQuestView);
 el.querySelectorAll('[data-bag-index]').forEach(b=>b.onclick=()=>openInventoryItem(Number(b.dataset.bagIndex)));
 bindNearbyTray(el);bindShellControls(el);bindTutorialControls(el);initRealMap();
}

function entityHTML(e,radius){const pt=mapPoint(e.x,e.y,radius),d=dist(e,state.player.position);if(pt.left<-10||pt.left>110||pt.top<-10||pt.top>110)return'';if(e.type==='monster'){const m=monsterTemplate(e);return `<button class="entity monster ${e.elite?'elite':''}" style="left:${pt.left}%;top:${pt.top}%" title="${m.name} • ${Math.round(d)} m" data-entity="${e.id}"><span class="entity-sprite">${e.elite?'<b class="elite-star">⭐</b>':''}${monsterVisual(m.id,'sprite-entity')}</span><small>${Math.round(d)}m</small></button>`}const discovered=state.player.discovered.includes(e.id)||state.player.dungeons.includes(e.id);const icon=e.type==='dungeon'&&!discovered?'❓':e.icon;return `<button class="entity ${e.type}" style="left:${pt.left}%;top:${pt.top}%" title="${discovered?e.name:'Nieznane miejsce'} • ${Math.round(d)} m" data-entity="${e.id}"><span class="entity-sprite">${icon}</span><small>${Math.round(d)}m</small></button>`}
function moveDemo(dx,dy){state.player.position.x+=dx;state.player.position.y+=dy;state.player.position.gps=false;state.player.position.virtualTravel=false;const added=markExplorationArea(state.player.position.x,state.player.position.y);if(added)registerExplorationProgress(state.player.position.x,state.player.position.y);const away=Math.hypot(state.player.position.x,state.player.position.y);checkQuestProgress('move',null,away);tutorialEvent('move',away);save();selectNav('map')}

function interactEntity(e){if(!e)return;const d=dist(e,state.player.position),R=60;if(state.player.position.virtualTravel&&e.type!=='dungeon')return toast('Tryb podróży domowej nie pozwala na interakcje GPS. Włącz GPS, aby wrócić do świata.');if(d>R&&!(e.type==='dungeon'&&state.player.position.virtualTravel&&state.player.dungeons.includes(e.id)))return toast(`Podejdź na ${R} m. Teraz: ${Math.round(d)} m.`);if(e.type==='secret'){discoverSecret(e);return}if(e.type==='event'){resolveWorldEvent(e);return}if(e.type==='monster'){startCombat(e);return}if(e.type==='poi'){if(e.id==='nightGuest'&&climate().phase!=='Noc')return toast('To miejsce ma znaczenie nocą. Włącz symulację nocy w Menu albo wróć później.');const fresh=!state.player.discovered.includes(e.id);if(fresh){state.player.discovered.push(e.id);playSfx('discover');haptic(20)}checkQuestProgress('discover',e.id);save();toast(fresh?`Odkryto: ${e.name}`:e.name);selectNav('map');return}if(e.type==='dungeon'){if(!state.player.dungeons.includes(e.id)){state.player.dungeons.push(e.id);state.player.discovered.push(e.id);playSfx('discover');haptic([20,25,20]);save();toast(`Odkryto loch: ${e.name}.`);tutorialEvent('dungeonDiscover',e.id)}startDungeon(DUNGEONS.find(x=>x.id===e.id)||e)}}


function toggleGps(){
 if(gpsWatch!==null){navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;toast('GPS wyłączony. Odkryta mapa zostaje zapisana.');if(currentTab==='map')selectNav('map');return}
 if(!navigator.geolocation)return toast('Ta przeglądarka nie udostępnia GPS.');
 toast('Uruchamiam dokładny GPS…');
 gpsWatch=navigator.geolocation.watchPosition(pos=>{
  const now=Date.now();if(now-lastGpsTick<2200)return;lastGpsTick=now;
  const {latitude:lat,longitude:lng,accuracy=0,heading=null}=pos.coords;
  const firstOrigin=!state.world.gpsOrigin;
  if(firstOrigin)state.world.gpsOrigin={lat,lng};
  const o=state.world.gpsOrigin,dy=(lat-o.lat)*111320,dx=(lng-o.lng)*111320*Math.cos(o.lat*Math.PI/180);
  state.player.position={x:dx,y:dy,lat,lng,gps:true,accuracy,heading,virtualTravel:false};
  const revealed=addExploredPoint(lat,lng,accuracy);
  const newSectors=accuracy<=120?markExplorationArea(dx,dy):0;
  if(newSectors>0)registerExplorationProgress(dx,dy);
  const away=Math.hypot(dx,dy);checkQuestProgress('move',null,away);tutorialEvent('move',away);if(revealed||newSectors)checkRegionRewards();save();
  if(currentTab==='map'){
   if(firstOrigin||!realMap)selectNav('map');
   else{updateLiveMapPosition();if(revealed&&state.world.explored.length%5===0)rebuildGameLayers()}
  }
 },err=>{toast(`GPS: ${err.message}`);gpsWatch=null;if(currentTab==='map')selectNav('map')},{enableHighAccuracy:true,maximumAge:4000,timeout:18000});
}


function renderCharacter(el){
 const p=state.player,c=CLASSES[p.class],slots=[['helmet','Hełm','⛑️'],['amulet','Amulet','📿'],['weapon','Broń','⚔️'],['armor','Pancerz','🛡️'],['offhand','Druga ręka','🛡️'],['gloves','Rękawice','🧤'],['ring1','Pierścień I','💍'],['ring2','Pierścień II','💍'],['boots','Buty','🥾']];
 const branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 el.innerHTML=`<div class="section-title"><div><h2>${p.name}</h2><div class="muted">${c.name} • ${c.desc}</div></div><span class="pill">lvl ${p.level}</span></div><div class="character-layout"><div class="paperdoll"><div class="paperdoll-title">WYPOSAŻENIE</div><div class="paperdoll-grid">${slots.map(([slot,label,ico])=>equipmentSlotHTML(slot,label,ico)).join('')}<div class="hero-silhouette"><div class="hero-pixel">${classVisual(p.class,'sprite-hero')}</div><b>${p.name}</b><span>${c.name}</span></div></div></div><div class="character-stats"><h3>Statystyki</h3><div class="stat-grid">${Object.entries(p.stats).map(([k,v])=>`<div class="stat-card"><b>${k.toUpperCase()}</b><div class="stat-number">${v}</div>${p.statPoints?`<button class="secondary mini" data-stat="${k}">+1</button>`:''}</div>`).join('')}</div><div class="derived-grid"><div><b>${attackPower()}</b><span>Atak</span></div><div><b>${armorPower()}</b><span>Pancerz</span></div><div><b>${critChance().toFixed(0)}%</b><span>Krytyk</span></div><div><b>${p.skillPoints}</b><span>Pkt skilli</span></div></div></div></div><div class="skill-tree-head"><div><h3>🌳 Drzewko umiejętności</h3><div class="muted">Wybierz kierunek rozwoju. Umiejętności wymagają poprzednich w swojej ścieżce.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="skill-branches">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div><h3 style="margin-top:22px">🐾 Chowańce</h3>${petSection()}`;
 el.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{if(p.statPoints<=0)return;p.stats[b.dataset.stat]++;p.statPoints--;if(b.dataset.stat==='vit'){p.maxHp+=5;p.hp+=5}if(b.dataset.stat==='int'){p.maxMana+=4;p.mana+=4}save();refresh()});
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
 el.querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>{p.petActive=b.dataset.pet;save();refresh();toast(`Aktywny chowaniec: ${petDef(p.petActive).name}`)});
 el.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{state.ui.heroView='bag';currentTab='hero';selectNav('hero');toast(`Wybierz przedmiot do slotu: ${b.dataset.slot}`)});
} 
function equipmentSlotHTML(slot,label,ico){const i=equippedInstance(slot),d=i?itemDef(i.id):null;return `<button class="gear-slot ${i?`rarity-border-${d.rarity}`:'empty'}" data-slot="${slot}"><span>${d?itemIconVisual(d.id,'gear-item-svg'):ico}</span><b>${label}</b><small>${d?itemName(i):'pusty'}</small></button>`}
function skillCard(s){const p=state.player,learned=p.skills.includes(s.id),reqSkill=s.requires,canLevel=p.level>=s.req,canPrev=!reqSkill||p.skills.includes(reqSkill),can=canLevel&&canPrev&&p.skillPoints>=s.cost;return `<div class="skill-node ${learned?'learned':!can?'locked':''}"><div class="skill-orb">${skillIconVisual(s.id,'skill-node-svg')}</div><div class="skill-copy"><b>${s.name}</b><div class="tiny">lvl ${s.req} • ${s.cost} pkt • mana ${s.mana}</div><p>${s.desc}</p>${reqSkill&&!canPrev?`<div class="tiny danger-text">Wymaga: ${skillDef(reqSkill)?.name||reqSkill}</div>`:''}</div>${learned?'<span class="pill green">NAUCZONE</span>':`<button class="secondary" data-learn="${s.id}" ${can?'':'disabled'}>Odblokuj</button>`}</div>`}
function learnSkill(id){const p=state.player,s=(SKILLS[p.class]||[]).find(x=>x.id===id);if(!s||p.skills.includes(id))return;if(p.level<s.req)return toast(`Wymagany poziom ${s.req}.`);if(s.requires&&!p.skills.includes(s.requires))return toast(`Najpierw odblokuj: ${skillDef(s.requires)?.name||s.requires}.`);if(p.skillPoints<s.cost)return toast('Za mało punktów umiejętności.');p.skillPoints-=s.cost;p.skills.push(id);tutorialEvent('skill');save();refresh();toast(`Odblokowano: ${s.name}`)}
function petSection(){const p=state.player;if(!['hunter','ranger'].includes(p.class))return `<div class="panel-item"><b>🔒 Chowańce bojowe</b><div class="muted">Bojowe chowańce są specjalizacją Łowcy i Tropiciela.</div></div>`;if(!p.pets.length)return `<div class="panel-item">Nie masz jeszcze chowańca.</div>`;return `<div class="pet-grid">${p.pets.map(x=>{const d=petDef(x.id),need=x.level*90;return `<div class="pet-card-v03 ${p.petActive===x.id?'active':''}"><div class="pet-portrait">${d.icon}</div><div><b>${d.name} • lvl ${x.level}</b><div class="tiny">Aktywna: ${d.skill} • Pasywna: ${d.passive}</div><div class="muted">${d.desc}</div><div class="barwrap"><div class="bar petbar" style="width:${100*x.xp/need}%"></div><div class="barlabel">XP ${x.xp}/${need}</div></div></div><button class="secondary" data-pet="${x.id}" ${p.petActive===x.id?'disabled':''}>${p.petActive===x.id?'Aktywny':'Wybierz'}</button></div>`}).join('')}</div>`}
function renderInventory(el){
 tutorialEvent('inventory');
 const p=state.player,slots=['weapon','helmet','armor','gloves','boots','amulet','ring1','ring2','offhand'],used=inventoryUsedSlots(),cap=inventoryCapacity(),cells=Array.from({length:cap},(_,idx)=>{const i=p.inventory[idx];if(!i)return `<button class="backpack-slot empty" disabled><span>·</span></button>`;const d=itemDef(i.id),qty=i.qty||1;return `<button class="backpack-slot rarity-border-${d.rarity}" data-bag-index="${idx}" title="${itemName(i)}"><span class="backpack-icon">${itemIconVisual(d.id,'backpack-item-svg')}</span>${qty>1?`<b class="stack-badge">${qty}</b>`:''}${(i.upgrade||0)>0?`<em>+${i.upgrade}</em>`:''}</button>`}).join('');
 el.innerHTML=`<div class="section-title"><div><h2>🎒 Plecak</h2><div class="muted">Każdy stos zajmuje jeden slot. Mikstury, materiały i runy: maks. ${STACK_MAX} szt. w stosie.</div></div><span class="pill ${used>=cap?'danger-pill':''}">${used}/${cap}</span></div><div class="backpack-frame"><div class="backpack-topline"><b>Miejsca w plecaku</b><span>${cap-used} wolnych</span></div><div class="backpack-grid">${cells}</div></div><h3 style="margin-top:18px">Wyposażenie</h3><div class="equip-strip">${slots.map(slot=>{const i=equippedInstance(slot),d=i?itemDef(i.id):null;return `<div class="equip-chip"><span>${d?itemIconVisual(d.id,'equip-item-svg'):'·'}</span><small>${slotLabel(slot)}</small><b>${d?itemName(i):'—'}</b></div>`}).join('')}</div>${setStatusHTML()}`;
 el.querySelectorAll('[data-bag-index]').forEach(b=>b.onclick=()=>openInventoryItem(Number(b.dataset.bagIndex)));
}
function openInventoryItem(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);openModal(`<div class="modal-head"><div><h2>${itemIconVisual(d.id,'shop-item-svg')} ${itemName(i)}</h2><div class="muted">Slot ${idx+1}/${inventoryCapacity()}${isStackable(i.id)?` • stos ${(i.qty||1)}/${STACK_MAX}`:''}</div></div><button class="close" data-close>×</button></div>${inventoryCard(i,idx)}`);const root=document.querySelector('.modal-back');root?.querySelector('[data-equip]')?.addEventListener('click',()=>{closeModal();equipIndex(idx)});root?.querySelector('[data-use]')?.addEventListener('click',()=>{closeModal();useItem(i.id)});root?.querySelector('[data-sell]')?.addEventListener('click',()=>{closeModal();sellIndex(idx)});root?.querySelector('[data-salvage]')?.addEventListener('click',()=>{closeModal();salvageIndex(idx)})}
function setStatusHTML(){const counts=activeSetCounts();const rows=Object.entries(SET_BONUSES).map(([id,b])=>{const n=counts[id]||0;return `<div class="set-card ${n>=2?'active':''}"><b>⚜️ ${b.name}</b><span>${n}/3 części</span><small>2 części: ${Object.entries(b.two).map(([k,v])=>`${k==='power'?'ATK':k==='armor'?'Pancerz':'Kryt'} +${v}`).join(' • ')}<br>3 części: ${Object.entries(b.three).map(([k,v])=>`${k==='power'?'ATK':k==='armor'?'Pancerz':'Kryt'} +${v}${k==='crit'?'%':''}`).join(' • ')}</small></div>`}).join('');return `<div class="set-strip">${rows}</div>`}
function slotLabel(slot){return ({weapon:'Broń',helmet:'Hełm',armor:'Pancerz',gloves:'Rękawice',boots:'Buty',amulet:'Amulet',ring1:'Pierścień I',ring2:'Pierścień II',offhand:'Druga ręka',ring:'Pierścień'})[slot]||slot}
function inventoryCard(i,idx){const d=itemDef(i.id),eqSlot=Object.entries(state.player.equipped).find(([,x])=>x?.uid&&x.uid===i.uid)?.[0],eq=!!eqSlot,qty=i.qty||1,up=i.upgrade||0,details=[d.power?`ATK +${d.power+up*2}`:'',d.armor?`Pancerz +${d.armor+up*2}`:'',d.crit?`Kryt +${d.crit+up}%`:''].filter(Boolean).join(' • '),mods=[i.affix?.name?`✨ Afiks: ${i.affix.name}`:'',i.enchant?.name?`🔮 Enchant: ${i.enchant.name}`:'',i.rune?`${itemDef(i.rune).icon} ${itemDef(i.rune).name}`:'',d.set?`⚜️ ${SET_BONUSES[d.set]?.name||d.set}`:''].filter(Boolean);return `<div class="item-card rarity-card-${d.rarity}"><div class="item-top"><div class="item-icon">${itemIconVisual(d.id,'inventory-item-svg')}</div><div><b class="rarity-${d.rarity}">${itemName(i)}${qty>1?` ×${qty}`:''}</b><div class="tiny">${rarityName(d.rarity)}${d.reqLevel?` • lvl ${d.reqLevel}`:''} • ${d.slot?slotLabel(d.slot):d.type}${details?` • ${details}`:''}</div>${mods.length?`<div class="item-mods">${mods.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div></div>${eq?`<div class="equipped-tag">ZAŁOŻONE: ${slotLabel(eqSlot)}</div>`:''}<div class="tabs" style="margin-top:8px">${d.slot?`<button class="secondary" data-equip="${idx}" ${eq?'disabled':''}>${eq?'Założone':'Załóż'}</button>`:''}${d.type==='consumable'?`<button class="secondary" data-use="${d.id}">Użyj</button>`:''}${d.value>0&&!eq?`<button class="ghost" data-sell="${idx}">Sprzedaj ${itemSellValue(i)} 🪙</button>`:''}${d.slot&&!eq?`<button class="ghost" data-salvage="${idx}">♻️ Rozbierz</button>`:''}</div></div>`}
function rarityName(r){return ({common:'Zwykły',uncommon:'Niezwykły',rare:'Rzadki',epic:'Epicki',heroic:'Heroiczny',legendary:'Legendarny'})[r]||r}
function equipIndex(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);if(d.reqLevel&&state.player.level<d.reqLevel)return toast(`Wymagany poziom ${d.reqLevel}.`);let slot=d.slot;if(!slot)return;if(slot==='ring')slot=!state.player.equipped.ring1?'ring1':!state.player.equipped.ring2?'ring2':'ring1';state.player.equipped[slot]=i;tutorialEvent('equip');playSfx('equip');haptic(12);save();refresh();toast(`Założono: ${itemName(i)} • ${slotLabel(slot)}`)}
function salvageIndex(idx){const i=state.player.inventory[idx];if(!i)return;const equipped=Object.values(state.player.equipped).some(x=>x?.uid&&x.uid===i.uid);if(equipped)return toast('Najpierw zdejmij przedmiot.');const d=itemDef(i.id),y=salvageYield(i);state.player.inventory.splice(idx,1);addItem('scrap',y.scrap);if(y.shards)addItem('runeShard',y.shards);if(y.crystal)addItem('crystal',y.crystal);ensureEconomyState();state.economy.totalSalvaged++;save();refresh();toast(`Rozebrano ${d.name}: +${y.scrap} 🔩${y.shards?` • +${y.shards} 🔹`:''}${y.crystal?' • +1 💎':''}`)}
function useItem(id){const d=itemDef(id);if(!countItem(id))return;if(d.heal){state.player.hp=Math.min(state.player.maxHp,state.player.hp+d.heal);removeItem(id);toast(`+${d.heal} HP`)}else if(d.mana){state.player.mana=Math.min(state.player.maxMana,state.player.mana+d.mana);removeItem(id);toast(`+${d.mana} many`)}else return toast('Tego przedmiotu nie można teraz użyć.');save();refresh()}
function sellIndex(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id),price=itemSellValue(i);state.player.gold+=price;if(i.qty&&i.qty>1)i.qty--;else state.player.inventory.splice(idx,1);ensureEconomyState();state.economy.totalSold++;save();refresh();toast(`Sprzedano: ${d.name} • +${price} 🪙`)}

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
 return `<article class="quest-detail-card"><div class="quest-detail-head"><div><span>${q.chapter||'Przygoda'}</span><h3>${q.name}</h3><small>Poziom ${q.level}</small></div><div class="quest-seal">${done?'✓':'📜'}</div></div><p class="quest-description">${q.desc||''}</p><div class="quest-detail-progress"><b>Postęp</b><span>${pct}%</span><div><i style="width:${pct}%"></i></div></div><div class="quest-step-list">${(q.steps||[]).map((s,i)=>{const st=questStepState(q,s,i);return `<div class="quest-step ${st.done?'done':''}"><span>${st.done?'✓':'○'}</span><div><b>${s.label||s.desc||'Cel zadania'}</b><small>${st.done?'Wykonano':`${Math.floor(st.cur)}/${st.target}`}</small></div></div>`}).join('')}</div><div class="quest-reward-box"><span>🎁 Nagroda</span><b>${q.xp||0} XP • ${q.gold||0} 🪙</b></div>${scene&&active?`<button class="primary quest-story-action" data-story-scene="${q.id}" ${storyCanChoose(q.id)||chosen?'':'disabled'}>${chosen?'📖 Zobacz swój wybór':'💬 Rozegraj scenę fabularną'}</button>`:''}${done?'<div class="quest-complete-stamp">UKOŃCZONO</div>':''}</article>`;
}
function renderQuests(el){
 updateStoryConditions();ensureStoryState();ensureAdventureState();
 const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean),done=state.quests.done.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean).slice().reverse(),contracts=(state.adventure.bounties||[]).filter(b=>b.accepted&&!b.claimed);
 const selectable=[...active,...done];state.ui.questFocus ||= selectable[0]?.id||null;if(state.ui.questFocus&&!selectable.some(q=>q.id===state.ui.questFocus))state.ui.questFocus=selectable[0]?.id||null;
 const focus=QUESTS.find(q=>q.id===state.ui.questFocus);
 el.innerHTML=`<div class="quest-journal-23"><section class="quest-journal-side"><div class="journal-summary"><div><b>${active.length}</b><span>Fabularne</span></div><div><b>${contracts.length}</b><span>Kontrakty</span></div><div><b>${done.length}</b><span>Ukończone</span></div></div>${tutorialJournalHTML()}<div class="quest-section-label">AKTYWNE</div><div class="quest-list">${active.map(questHTML).join('')||'<div class="journal-empty">Brak aktywnych zadań fabularnych.</div>'}</div>${contracts.length?`<div class="quest-section-label">KONTRAKTY</div><div class="bounty-list-23">${contracts.map(b=>`<div class="bounty-card-23"><div><b>${b.icon} ${b.name}</b><small>${MONSTERS.find(m=>m.id===b.target)?.name||b.target} • ${b.progress||0}/${b.need}</small></div><div class="quest-mini-bar"><i style="width:${Math.min(100,(b.progress||0)/b.need*100)}%"></i></div><div class="bounty-reward">${b.xp} XP • ${b.gold} 🪙 • ${b.rep} rep.</div>${(b.progress||0)>=b.need?`<button class="secondary" data-claim-bounty="${b.id}">Odbierz</button>`:''}</div>`).join('')}</div>`:''}${done.length?`<details class="completed-quests"><summary>Ukończone (${done.length})</summary><div class="quest-list">${done.slice(0,12).map(questHTML).join('')}</div></details>`:''}</section><section class="quest-journal-main">${questDetailHTML(focus)}${storyProfileHTML()}</section></div><div class="quest-limit-note">Samouczek nie zajmuje miejsca. Maksymalnie 4 aktywne zadania i kontrakty.</div>`;
 el.querySelectorAll('[data-focus-quest]').forEach(b=>b.onclick=()=>{state.ui.questFocus=b.dataset.focusQuest;save();renderQuests(el)});
 el.querySelectorAll('[data-story-scene]').forEach(b=>b.onclick=()=>openStoryScene(b.dataset.storyScene));
 el.querySelectorAll('[data-claim-bounty]').forEach(b=>b.onclick=()=>claimBounty(b.dataset.claimBounty));bindTutorialControls(el)
}
function renderEvents(el){
 ensureLivingWorld();const stats=explorationStats(),events=(state.world.entities||[]).filter(e=>e.type==='event'),completed=state.world.living.completedEvents||[];
 el.innerHTML=`<div class="events-dashboard"><section class="daily-explore-card"><div class="daily-icon">🧭</div><div><span>CEL DZIENNY</span><h3>Eksploracja świata</h3><p>Odwiedzaj nowe obszary podczas spaceru.</p><div class="daily-progress"><i style="width:${stats.percent}%"></i></div><small>${stats.count}/${stats.goal} sektorów ${stats.claimed?'• nagroda odebrana':''}</small></div><div class="daily-reward"><b>350 XP</b><span>75 🪙 • 5 rep.</span></div></section><div class="events-grid">${events.map(e=>{const done=completed.includes(e.id)||e.done,d=Math.round(dist(e,state.player.position));return `<article class="world-event-card ${done?'done':''}"><div class="event-icon-big">${e.icon||'✨'}</div><div class="event-body"><span>${done?'UKOŃCZONE':'WYDARZENIE ŚWIATA'}</span><h3>${e.name}</h3><p>${e.desc||'Dynamiczne wydarzenie pojawiło się w świecie.'}</p><div class="event-meta"><b>📍 ${d} m</b><b>🎁 ${e.xp||0} XP • ${e.gold||0} 🪙</b></div>${e.item?`<small>Możliwa nagroda: ${itemDef(e.item)?.name||e.item}</small>`:''}</div><button class="${done?'ghost':'secondary'}" data-world-event="${e.id}" ${done?'disabled':''}>${done?'✓ Gotowe':d<=60?'Wejdź w interakcję':'Pokaż na mapie'}</button></article>`}).join('')||'<div class="journal-empty">Brak aktywnych wydarzeń.</div>'}</div></div>`;
 el.querySelectorAll('[data-world-event]').forEach(b=>b.onclick=()=>{const e=eventById(b.dataset.worldEvent);if(!e)return;const d=dist(e,state.player.position);if(d<=60)resolveWorldEvent(e);else{selectNav('map');toast(`Wydarzenie: ${e.name} • ${Math.round(d)} m od Ciebie.`)}})
}
function renderAdventure(el){
 const discovered=new Set(state.player.dungeons||[]),regions=Object.values(EXPLORATION_REGIONS);
 el.innerHTML=`<div class="trips-shell"><div class="region-strip">${regions.map(r=>`<div class="region-chip"><span>${r.icon}</span><div><b>${r.name}</b><small>poziom ${r.level}</small></div></div>`).join('')}</div><div class="dungeon-grid-23">${DUNGEONS.map(d=>{const known=discovered.has(d.id),boss=MONSTERS.find(m=>m.id===d.boss),clears=state.player.dungeonClears[d.id]||0,levelOk=state.player.level>=d.min;return `<article class="dungeon-card-23 ${known?'known':'locked'}"><div class="dungeon-art"><span>${d.icon}</span>${known?'<em>ODKRYTY</em>':'<em>???</em>'}</div><div class="dungeon-copy"><span>LOCH • poziom ${d.min}+</span><h3>${known?d.name:'Nieodkryty loch'}</h3><p>${known?d.desc:'Odkryj wejście podczas eksploracji świata GPS.'}</p>${known&&boss?`<div class="dungeon-boss"><b>Boss</b><span>${monsterVisual(boss.id,'dungeon-boss-sprite')} ${boss.name}</span></div>`:''}<div class="dungeon-meta"><span>🏆 Ukończenia: ${clears}</span><span>${levelOk?'✅ Poziom OK':`🔒 Wymaga lvl ${d.min}`}</span></div></div><button class="${known&&levelOk?'primary':'ghost'}" data-enter-dungeon="${d.id}" ${known&&levelOk?'':'disabled'}>${known?levelOk?'Wejdź do lochu':'Za niski poziom':'Najpierw odkryj'}</button></article>`}).join('')}</div></div>`;
 el.querySelectorAll('[data-enter-dungeon]').forEach(b=>b.onclick=()=>startDungeon(DUNGEONS.find(d=>d.id===b.dataset.enterDungeon)))
}
function bestiaryFamilies(){return ['Wszystkie',...new Set(MONSTERS.map(m=>m.family))]}
function openBestiaryMonster(id){const m=MONSTERS.find(x=>x.id===id);if(!m)return;const kills=state.player.bestiary?.[id]||0;if(!kills)return;openModal(`<div class="bestiary-modal"><div class="modal-head"><div><span class="eyebrow">BESTIARIUSZ</span><h2>${m.name}</h2><div class="muted">${m.family} • poziom ${m.min}–${m.max}</div></div><button class="close" data-close>×</button></div><div class="bestiary-detail"><div class="bestiary-hero-art">${monsterVisual(m.id,'bestiary-modal-sprite')}</div><div><div class="bestiary-stat-grid"><span><b>${kills}</b> pokonanych</span><span><b>${m.weak||'—'}</b> słabość</span><span><b>${m.zone}</b> strefa</span><span><b>${m.xp}</b> bazowe XP</span></div><p>${monsterLore(m)}</p><div class="lore-tip">Dorian: ${tavernAnecdote()}</div></div></div></div>`)}
function renderBestiary(el){
 state.ui.bestiaryFamily ||= 'Wszystkie';const families=bestiaryFamilies(),knownCount=MONSTERS.filter(m=>(state.player.bestiary?.[m.id]||0)>0).length,filtered=MONSTERS.filter(m=>state.ui.bestiaryFamily==='Wszystkie'||m.family===state.ui.bestiaryFamily);
 el.innerHTML=`<div class="bestiary-shell"><div class="bestiary-top"><div><span class="eyebrow">KSIĘGA POTWORÓW</span><h2>Bestiariusz</h2><p>Poznane stworzenia ujawniają słabości, strefę i historię.</p></div><div class="bestiary-counter"><b>${knownCount}</b><span>/ ${MONSTERS.length} poznanych</span></div></div><div class="family-tabs">${families.map(f=>`<button class="${state.ui.bestiaryFamily===f?'active':''}" data-family="${f}">${f}</button>`).join('')}</div><div class="bestiary-grid-23">${filtered.map(m=>{const kills=state.player.bestiary?.[m.id]||0,known=kills>0;return `<button class="bestiary-card-23 ${known?'known':'unknown'}" data-best-monster="${m.id}" ${known?'':'disabled'}><div class="bestiary-art">${known?monsterVisual(m.id,'bestiary-card-sprite'):'<span class="unknown-monster">?</span>'}</div><div class="bestiary-copy"><span>${known?m.family:'NIEODKRYTY'}</span><h3>${known?m.name:'Nieznane stworzenie'}</h3>${known?`<div class="bestiary-line"><b>🎯 ${m.weak||'brak'}</b><b>⚔️ ${kills}×</b></div><small>lvl ${m.min}–${m.max} • ${m.zone}</small>`:'<small>Pokonaj potwora, aby odblokować wpis.</small>'}</div></button>`}).join('')}</div></div>`;
 el.querySelectorAll('[data-family]').forEach(b=>b.onclick=()=>{state.ui.bestiaryFamily=b.dataset.family;save();renderBestiary(el)});el.querySelectorAll('[data-best-monster]').forEach(b=>b.onclick=()=>openBestiaryMonster(b.dataset.bestMonster))
}

function monsterLore(m){
 const lore={Natura:'Dziki mieszkaniec szlaków i lasów. Najczęściej atakuje samotnych wędrowców.',Owady:'Pancerz i jad czynią te stworzenia groźniejszymi, niż sugeruje ich rozmiar.',Nieumarli:'Pozostałość dawnych bitew. Magia utrzymuje ich kości w ruchu.',Zjawy:'Istoty związane z miejscami, w których śmierć zostawiła zbyt silny ślad.',Demony:'Przybysze z miejsc, w których ogień i gniew mają własną wolę.',Żywiołaki:'Skupiska pierwotnej energii związanej z kamieniem, ogniem i burzą.',Ludzie:'Bandytów i kultystów nie ogranicza natura — walczą z wyrachowaniem.',Bestie:'Rzadkie drapieżniki z najniebezpieczniejszych stref świata.'};return lore[m.family]||'Nieznane stworzenie świata Time4Heroes.'
}
const CITY_INTERIORS={
 tavern:{title:'Karczma „Pod Krukiem”',npc:'Dorian',role:'Karczmarz • były wojownik',classId:'knight',bg:'assets/tavern-scene-desktop.png',quote:'„Miecz odwiesiłem na ścianę. Pamięć o potworach — nie.”'},
 shop:{title:'Sklep kupiecki',npc:'Selma',role:'Kupcowa',classId:'hunter',bg:'assets/shop-scene-desktop.jpg',bgDesktop:'assets/shop-scene-desktop.jpg',bgMobile:'assets/shop-scene-mobile.jpg',quote:'„Towar musi mieć cenę. Dobra rada czasem jest gratis.”'},
 smith:{title:'Kuźnia Ragora',npc:'Ragor',role:'Kowal i runmistrz',classId:'berserker',bg:'assets/smith-scene-desktop.jpg',bgDesktop:'assets/smith-scene-desktop.jpg',bgMobile:'assets/smith-scene-mobile.jpg',quote:'„Dobra stal ma duszę. Zła ma tylko cenę.”'},
 alchemist:{title:'Pracownia Ilyry',npc:'Ilyra',role:'Alchemiczka',classId:'mage',bg:'assets/alchemist-scene-desktop.jpg',bgDesktop:'assets/alchemist-scene-desktop.jpg',bgMobile:'assets/alchemist-scene-mobile.jpg',quote:'„Rośliny mówią. Trzeba tylko wiedzieć, kiedy nie przeszkadzać.”'},
 auction:{title:'Dom aukcyjny',npc:'Varo',role:'Licytator',classId:'ranger',bg:'assets/auction-scene-desktop.jpg',bgDesktop:'assets/auction-scene-desktop.jpg',bgMobile:'assets/auction-scene-mobile.jpg',quote:'„Każdy przedmiot ma wartość. Pytanie brzmi: dla kogo?”'},
 guild:{title:'Sala gildii',npc:'Edrin',role:'Mistrz Gildii',classId:'knight',bg:'assets/guild-scene-desktop.jpg',bgDesktop:'assets/guild-scene-desktop.jpg',bgMobile:'assets/guild-scene-mobile.jpg',quote:'„Siła to nie tylko miecz. To ludzie, którzy wracają po swoich.”'}
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
 else if(view==='service')sheet=`<aside class="tavern-sheet clean-room-sheet">${buildingServiceHTML(id)}</aside>`;
 const hotspots=view==='scene'?`<div class="tavern-hotspots clean-room-hotspots" aria-label="Interaktywne elementy wnętrza">
   <button class="tavern-hotspot clean-room-hotspot clean-room-hotspot-npc" data-building-action="keeper" aria-label="Porozmawiaj z ${c.npc}" title="${c.npc}"><span>💬</span></button>
   <button class="tavern-hotspot clean-room-hotspot clean-room-hotspot-service" data-building-action="service" aria-label="Otwórz usługę" title="Usługa"><span>${icon}</span></button>
 </div><div class="tavern-tap-hint clean-room-tap-hint">Dotknij postaci albo stanowiska</div>`:'';
 return `<div class="tavern-clean-stage clean-room-stage room-${id}">
   <picture class="tavern-scene-picture clean-room-picture"><source media="(max-width:620px)" srcset="${c.bgMobile||c.bg}"><img src="${c.bgDesktop||c.bg}" alt="${c.title}"></picture>
   <div class="tavern-scene-vignette clean-room-vignette"></div>
   ${hotspots}${sheet}
 </div>`;
}
function tavernBoardHTML(){ensureAdventureState();const story=nextStoryQuestAvailable(),bounties=state.adventure.bounties||[],active=activeTaskCount();return `<div class="building-panel parchment-panel"><button class="ghost panel-back" data-building-home>← Wróć do karczmy</button><div class="board-head"><div><span>TABLICA OGŁOSZEŃ</span><h2>📌 Kartki przypięte do desek</h2></div><b>${active}/4 aktywne</b></div><div class="quest-board">${story?`<article class="quest-paper story-paper"><i></i><span>GŁÓWNY SZLAK • lvl ${story.level}</span><h3>${story.name}</h3><p>${story.desc}</p><strong>${story.xp} XP • ${story.gold} 🪙</strong><button class="secondary" data-accept-story="${story.id}" ${canAcceptTask()?'':'disabled'}>${canAcceptTask()?'Przyjmij':'Limit 4/4'}</button></article>`:`<article class="quest-paper"><i></i><h3>Brak nowej kartki fabularnej</h3><p>Dokończ obecne zadanie albo zdobądź wymagany poziom.</p></article>`}${bounties.map(b=>`<article class="quest-paper contract-paper ${b.accepted?'accepted-paper':''}"><i></i><span>KONTRAKT DNIA</span><h3>${b.icon} ${b.name}</h3><p>Pokonaj ${b.need}× ${MONSTERS.find(m=>m.id===b.target)?.name||b.target}.</p><strong>${b.xp} XP • ${b.gold} 🪙 • ${b.rep} rep.</strong>${b.claimed?'<button disabled>Wykonano</button>':b.accepted?`<button disabled>Przyjęte • ${b.progress||0}/${b.need}</button>`:`<button class="secondary" data-accept-bounty="${b.id}" ${canAcceptTask()?'':'disabled'}>${canAcceptTask()?'Przyjmij':'Limit 4/4'}</button>`}</article>`).join('')}</div><div class="quest-board-foot">Samouczek jest osobny i nie zajmuje żadnego z 4 miejsc.</div></div>`}
function tavernKeeperHTML(){const p=state.player,st=p.stamina??100,max=p.maxStamina??100;return `<div class="building-panel"><button class="ghost panel-back" data-building-home>← Wróć do sali</button>${npcCard('Dorian','Karczmarz • były wojownik','knight','Dorian walczył kiedyś na północy. Zna nawyki potworów, a dziś pilnuje, żeby podróżni wracali na szlak w jednym kawałku.')}<div class="dialogue-bubble">${tavernAnecdote()}</div><div class="stamina-card"><b>⚡ Stamina ${st}/${max}</b><div class="mini-progress"><span style="width:${st/max*100}%"></span></div><small>Napitek i jedzenie przywracają siły przed dalszą drogą.</small></div><div class="tavern-menu"><button class="secondary" data-anecdote>🗣️ Kolejna anegdota</button><button class="secondary" data-stamina="10" data-cost="10" data-label="Piwo">🍺 Piwo • +10 staminy • 10 🪙</button><button class="secondary" data-stamina="25" data-cost="25" data-label="Solidny posiłek">🍲 Posiłek • +25 • 25 🪙</button><button class="secondary" data-stamina="50" data-cost="50" data-label="Karczemna uczta">🍗 Uczta • +50 • 50 🪙</button></div></div>`}
function tavernFireplaceHTML(){const cost=Math.min(70,15+state.player.level*3);return `<div class="building-panel hearth-panel"><button class="ghost panel-back" data-building-home>← Wróć do sali</button><div class="big-hearth">🔥</div><h2>Kominek</h2><p>Siadasz przy ogniu. Ciepło rozluźnia mięśnie, a przez kilka minut świat może poczekać.</p><div class="rest-summary"><span>❤️ Pełne HP</span><span>🔷 Pełna mana</span><span>⚡ +25 staminy</span></div><button class="primary" data-fire-rest>Odpocznij • ${cost} 🪙</button></div>`}
function buildingServiceHTML(id){if(id==='shop')return `<button class="ghost panel-back" data-building-home>← Wróć do sklepu</button>${shopHTML()}`;if(id==='smith')return `<button class="ghost panel-back" data-building-home>← Wróć do kuźni</button>${smithHTML()}`;if(id==='alchemist')return `<button class="ghost panel-back" data-building-home>← Wróć do pracowni</button>${alchemistHTML()}`;if(id==='auction')return `<button class="ghost panel-back" data-building-home>← Wróć do domu aukcyjnego</button>${auctionHTML()}`;if(id==='guild')return `<button class="ghost panel-back" data-building-home>← Wróć do sali gildii</button>${guildHTML()}`;return ''}
function buildingTalkHTML(id){const c=CITY_INTERIORS[id];const extra={shop:'Selma słyszy większość plotek od handlarzy, zanim dotrą do karczmy.',smith:'Ragor najpierw ogląda materiał, dopiero potem pyta, co chcesz z niego zrobić.',alchemist:'Ilyra potrafi rozpoznać zioło po zapachu i truciznę po kolorze osadu.',auction:'Varo twierdzi, że na każdą rzecz znajdzie się kupiec — trzeba tylko poczekać.',guild:'Edrin pamięta nazwiska tych, którzy dotrzymują słowa.'}[id]||'Dorian opowiada o dawnych wyprawach.';return `<div class="building-panel"><button class="ghost panel-back" data-building-home>← Wróć do wnętrza</button>${npcCard(c.npc,c.role,c.classId,c.quote)}<div class="dialogue-bubble">${extra}</div>${id==='tavern'?'<button class="secondary" data-building-action="keeper">Porozmawiaj dłużej</button>':`<button class="secondary" data-building-action="service">Przejdź do usług</button>`}</div>`}
function openBuilding(id,view='scene'){
 setAmbient(id==='tavern'?'tavern':'town');
 const unlock=buildingUnlock(id);if(!unlock.ok)return toast(`Odblokujesz to: ${unlock.reason}.`);
 if(id==='tavern')tutorialEvent('tavern');
 const c=CITY_INTERIORS[id]||CITY_INTERIORS.tavern;
 let body=id==='tavern'?tavernSceneHTML(view):buildingSceneHTML(id,view);
 const top=id==='tavern'
   ? `<div class="tavern-chrome"><div class="building-nav-actions"><button class="building-exit tavern-exit" data-building-map>← Mapa</button><button class="ghost building-city" data-building-exit>Miasto</button></div><div><b>Karczma „Pod Krukiem”</b><small>Dorian • kominek • tablica ogłoszeń</small></div><button class="close tavern-close" data-close title="Zamknij">×</button></div>`
   : `<div class="tavern-chrome clean-room-chrome"><div class="building-nav-actions"><button class="building-exit tavern-exit" data-building-map>← Mapa</button><button class="ghost building-city" data-building-exit>Miasto</button></div><div><b>${c.title}</b><small>${c.npc} • ${c.role}</small></div><button class="close tavern-close" data-close title="Zamknij">×</button></div>`;
 openModal(`<div class="location-scene scene-${id} city-modal ${id==='tavern'?'tavern-modal-clean':'clean-room-modal'}"><div class="location-overlay">${top}<div id="buildingBody">${body}</div></div></div>`);
 bindBuilding(id,view)
}

function tavernHTML(){return tavernKeeperHTML()}
function shopHTML(){const ids=['potion','manaPotion','herb','scrap','leather','ironArmor'];return `${npcCard('Selma','Kupcowa','hunter','Ceny kupna są wyższe niż wartość odsprzedaży — najlepszy sprzęt nadal zdobywa się w świecie.')}<div class="panel-list">${ids.map(id=>{const i=itemDef(id),price=merchantBuyPrice(id);return `<div class="panel-item shoprow"><div><b class="shop-item-name">${itemIconVisual(i.id,'shop-item-svg')} ${i.name}</b><div class="muted">${price} 🪙 • sprzedaż: ${Math.max(1,Math.floor(i.value*(ECONOMY.sell[i.rarity]??.28)))} 🪙</div></div><button class="secondary" data-buy="${id}" data-price="${price}">Kup</button></div>`}).join('')}</div>`}
function smithHTML(){const gear=state.player.inventory.filter(i=>itemDef(i.id).slot),recipes=RECIPES.filter(r=>r.station==='smith'),runes=['runePower','runeGuard','runePrecision'];return `${npcCard('Ragor','Kowal i runmistrz','berserker','Pracujesz przy prawdziwym kowadle: ulepszanie, runy i crafting są osobnymi etapami obróbki.')}<div class="forge-summary"><span>🔹 Odłamki: <b>${countItem('runeShard')}</b></span>${runes.map(id=>`<span>${itemDef(id).icon} ${countItem(id)}</span>`).join('')}</div><h3>⚒️ Obróbka sprzętu</h3><div class="panel-list">${gear.map(i=>{const d=itemDef(i.id),up=i.upgrade||0,q=upgradeQuote(i),eq=enchantQuote(i,!!i.enchant);return `<div class="panel-item smith-item"><div><b class="shop-item-name">${itemIconVisual(d.id,'shop-item-svg')} ${itemName(i)}</b><div class="muted">${rarityName(d.rarity)} • +${up} • ${i.enchant?`🔮 ${i.enchant.name}`:'bez enchantu'} • ${i.rune?`${itemDef(i.rune).icon} ${itemDef(i.rune).name}`:'wolne gniazdo runy'}</div></div><div class="smith-actions"><button class="secondary" data-upgrade="${i.uid}" ${up>=5?'disabled':''}>${up>=5?'MAX':`Ulepsz ${q.gold}🪙${q.scrap?` + ${q.scrap}🔩`:''}`}</button><button class="secondary" data-enchant="${i.uid}">${i.enchant?`Przerzuć ${eq.gold}🪙`:`Enchant ${eq.gold}🪙`}</button>${!i.rune?runes.map(r=>`<button class="ghost" data-socket="${i.uid}" data-rune="${r}" ${countItem(r)?'':'disabled'}>${itemDef(r).icon} Osadź</button>`).join(''):`<button class="ghost" data-unsocket="${i.uid}">↩️ Wyjmij runę</button>`}</div></div>`}).join('')}</div><h3>🧰 Receptury kuźni</h3><div class="panel-list">${recipes.map(r=>{const fee=craftFee(r);return `<div class="panel-item shoprow"><div><b class="shop-item-name">${itemIconVisual(r.result,'shop-item-svg')} ${r.name}</b><div class="muted">${Object.entries(r.ingredients).map(([id,q])=>`${q}× ${itemDef(id).icon} ${itemDef(id).name}`).join(' + ')} • ${fee} 🪙</div></div><button class="secondary" data-craft="${r.id}">Wykuj</button></div>`}).join('')}</div>`}
function alchemistHTML(){return `${npcCard('Ilyra','Alchemiczka','mage','Kocioł, zioła i fiolki są częścią stanowiska — tutaj faktycznie warzysz mikstury.')}<div class="panel-list">${RECIPES.filter(r=>r.station==='alchemist').map(r=>{const fee=craftFee(r);return `<div class="panel-item shoprow"><div><b class="shop-item-name">${itemIconVisual(r.result,'shop-item-svg')} ${r.name}</b><div class="muted">${Object.entries(r.ingredients).map(([id,q])=>`${q}× ${itemDef(id).icon} ${itemDef(id).name}`).join(' + ')} • ${fee} 🪙</div></div><button class="secondary" data-craft="${r.id}">Uwarz</button></div>`}).join('')}</div>`}
function auctionHTML(){const offerIds=['blueBlade','forestBow','arcaneStaff','shadowRing','wolfCharm','ironHelm','emberRing','ravenBlade','wildBow','mistHood'];const ids=[0,1,2,3].map(i=>offerIds[Math.floor(seeded(daySeed()+i*91)*offerIds.length)]);return `${npcCard('Varo','Licytator','ranger','Księga ofert zmienia się codziennie.')}<div class="panel-list">${ids.map((id,i)=>{const d=itemDef(id),factor=ECONOMY.auctionMin+seeded(daySeed()+i*17)*(ECONOMY.auctionMax-ECONOMY.auctionMin)+(rarityRank(d.rarity)>=3?.12:0),price=Math.ceil(d.value*factor);return `<div class="panel-item shoprow"><div><b class="rarity-${d.rarity} shop-item-name">${itemIconVisual(d.id,'shop-item-svg')} ${d.name}</b><div class="muted">${rarityName(d.rarity)} • ${price} 🪙</div></div><button class="secondary" data-auction-buy="${id}" data-price="${price}">Kup</button></div>`}).join('')}</div>`}
function guildHTML(){return `${npcCard('Edrin','Mistrz Gildii','knight','To miejsce ma być bazą reputacji i przyszłych wypraw drużynowych.')}<div class="panel-item"><b>🛡️ Gildia</b><p>${state.player.guild?`Należysz do gildii <b>${state.player.guild}</b>.`:'Nie należysz jeszcze do gildii.'}</p>${!state.player.guild?'<input id="guildName" placeholder="Nazwa gildii" style="width:100%"><button class="secondary" style="margin-top:8px" data-create-guild>Utwórz gildię bohatera</button>':'<div class="muted">Reputacja: '+state.adventure.reputation+'. Rozwijaj ją przez kontrakty i wyprawy.</div>'}</div>`}
function bindBuilding(id,view){
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
 document.querySelectorAll('[data-auction-buy]').forEach(b=>b.onclick=()=>{const price=Number(b.dataset.price);if(state.player.gold<price)return toast('Za mało złota.');state.player.gold-=price;addItem(b.dataset.auctionBuy);save();openBuilding('auction','service');toast('Kupiono ofertę z rynku.')});
 document.querySelector('[data-create-guild]')?.addEventListener('click',()=>{const n=document.querySelector('#guildName')?.value.trim();if(!n)return;state.player.guild=n;save();openBuilding('guild','service')});
}

function buyItem(id,building,forcedPrice){const d=itemDef(id),price=Number.isFinite(forcedPrice)&&forcedPrice>0?forcedPrice:merchantBuyPrice(id);if(state.player.gold<price)return toast('Za mało złota.');state.player.gold-=price;addItem(id);save();openBuilding(building,'service');toast(`Kupiono: ${d.name} • -${price} 🪙`)}
function upgradeItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const up=i.upgrade||0;if(up>=5)return;const q=upgradeQuote(i);if(state.player.gold<q.gold)return toast(`Potrzebujesz ${q.gold} złota.`);if(countItem('scrap')<q.scrap)return toast(`Potrzebujesz ${q.scrap}× Żelazny złom.`);state.player.gold-=q.gold;if(q.scrap)removeItem('scrap',q.scrap);i.upgrade=up+1;save();openBuilding('smith','service');toast(`${itemDef(i.id).name} ulepszono do +${i.upgrade} • -${q.gold} 🪙`)}
function enchantItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const reroll=!!i.enchant,q=enchantQuote(i,reroll);if(state.player.gold<q.gold)return toast(`Potrzebujesz ${q.gold} złota.`);if(countItem('crystal')<q.crystal)return toast(`Potrzebujesz ${q.crystal}× Odłamek kryształu.`);if(q.shard&&countItem('runeShard')<q.shard)return toast('Przerzut wymaga 1× Odłamka Runicznego.');state.player.gold-=q.gold;removeItem('crystal',q.crystal);if(q.shard)removeItem('runeShard',q.shard);let pool=[{name:'Płomień',power:4},{name:'Bastion',armor:4},{name:'Sokole Oko',crit:4}];if(i.enchant)pool=pool.filter(x=>x.name!==i.enchant.name);i.enchant={...pick(pool)};i.enchantRolls=(i.enchantRolls||0)+(reroll?1:0);save();openBuilding('smith','service');toast(`${reroll?'Przerzucono':'Zaklęto'}: ${itemDef(i.id).name} • ${i.enchant.name}`)}
function socketRune(uidv,runeId){const i=state.player.inventory.find(x=>x.uid===uidv),r=itemDef(runeId);if(!i||i.rune)return;if(!countItem(runeId))return toast(`Brakuje: ${r.name}`);removeItem(runeId,1);i.rune=runeId;save();openBuilding('smith','service');toast(`${r.name} została osadzona w ${itemDef(i.id).name}.`)}
function unsocketRune(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i?.rune)return;const cost=35+rarityRank(itemDef(i.id).rarity)*10;if(state.player.gold<cost)return toast(`Wyjęcie runy kosztuje ${cost} 🪙.`);const rune=i.rune;state.player.gold-=cost;i.rune=null;addItem(rune);save();openBuilding('smith','service');toast(`Odzyskano ${itemDef(rune).name} • -${cost} 🪙`)}
function craftRecipe(id){const r=RECIPES.find(x=>x.id===id);if(!r)return;const fee=craftFee(r);for(const [ing,q] of Object.entries(r.ingredients))if(countItem(ing)<q)return toast(`Brakuje: ${q}× ${itemDef(ing).name}`);if(state.player.gold<fee)return toast(`Crafting kosztuje ${fee} 🪙.`);for(const [ing,q] of Object.entries(r.ingredients))removeItem(ing,q);state.player.gold-=fee;addItem(r.result,r.qty);save();openBuilding(r.station==='smith'?'smith':'alchemist','service');toast(`${r.station==='smith'?'Wykuto':'Uwarzono'}: ${r.name} • -${fee} 🪙`)}

function renderSocial(el){const fake=[{n:'Ardan',l:7,c:'knight',d:42},{n:'Mirael',l:6,c:'mage',d:88},{n:'Borvik',l:9,c:'berserker',d:135}];el.innerHTML=`<div class="section-title"><h2>👥 Gracze w pobliżu</h2><span class="pill">TRYB LOKALNY</span></div><p class="muted">Tryb społecznościowy zostanie dodany dopiero po dopracowaniu rdzenia gry.</p><div class="panel-list">${fake.map((x,i)=>`<button class="panel-item social-row" style="color:inherit;text-align:left" data-player="${i}"><div class="social-avatar">${classVisual(x.c,'sprite-social')}</div><div><b>${x.n}</b> • lvl ${x.l}<div class="muted">${CLASSES[x.c].name} • ${x.d} m od Ciebie</div></div></button>`).join('')}</div>`;el.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>openPlayer(fake[Number(b.dataset.player)]))}
function openPlayer(x){openModal(`<div class="modal-head"><div><h2>${x.n}</h2><div class="muted">${CLASSES[x.c].name} • lvl ${x.l}</div></div><button class="close" data-close>×</button></div><div class="tabs"><button class="secondary" data-social="party">➕ Drużyna</button><button class="secondary" data-social="pvp">⚔️ PvP</button><button class="secondary" data-social="trade">🤝 Handel</button><button class="secondary" data-social="profile">👤 Profil</button><button class="secondary" data-social="friend">⭐ Znajomy</button></div><p class="muted">Funkcje sieciowe są celowo odłożone na późniejszy etap.</p>`);document.querySelectorAll('[data-social]').forEach(b=>b.onclick=()=>toast(`„${b.textContent.trim()}” — multiplayer jest obecnie wyłączony.`))}


function isStandalone(){return window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true}
function isIos(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
async function installPwa(){
 if(isStandalone())return toast('Time4Heroes jest już uruchomione jako aplikacja.');
 if(installPromptEvent){installPromptEvent.prompt();const r=await installPromptEvent.userChoice;installPromptEvent=null;if(r.outcome==='accepted')toast('Time4Heroes zostało dodane do telefonu.');return}
 if(isIos()){openModal(`<div class="modal-head"><div><h2>📲 Zainstaluj Time4Heroes</h2><div class="muted">iPhone / iPad</div></div><button class="close" data-close>×</button></div><div class="install-steps"><div><b>1</b><span>Otwórz grę w Safari.</span></div><div><b>2</b><span>Naciśnij ikonę <strong>Udostępnij</strong>.</span></div><div><b>3</b><span>Wybierz <strong>Do ekranu początkowego</strong>.</span></div><div><b>4</b><span>Potwierdź „Dodaj”.</span></div></div>`);return}
 openModal(`<div class="modal-head"><div><h2>📲 Zainstaluj Time4Heroes</h2><div class="muted">Android / Chrome</div></div><button class="close" data-close>×</button></div><p>Jeżeli przycisk instalacji nie pojawił się automatycznie, otwórz menu przeglądarki <b>⋮</b> i wybierz <b>Dodaj do ekranu głównego</b> albo <b>Zainstaluj aplikację</b>.</p>`)
}


function renderMore(el){ensureCoreState();const soundOn=!!state.settings.masterSound;el.innerHTML=`<div class="section-title"><h2>☰ Menu</h2><span class="pill">Build 2.5.2</span></div><div class="panel-list"><div class="panel-item"><b>🗺️ Mapa i eksploracja</b><div class="muted">Narzędzia mapy są tutaj, żeby ekran rozgrywki został czysty.</div><div class="settings-toggles"><button class="secondary" data-menu-gps>${gpsWatch!==null?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button><button class="secondary" data-menu-center>🎯 Do mnie</button><button class="secondary" data-map-mode>👁️ Widok: ${state.settings.mapMode==='focused'?'Skupiony':'Pełny'}</button><button class="secondary" data-explorer-journal>🧭 Dziennik odkrywcy</button><button class="secondary" data-fast-travel>⚡ Podróż</button></div><details class="menu-map-layers"><summary>Warstwy mapy</summary><div class="settings-toggles">${[['monster','👹 Potwory'],['poi','📌 Miejsca'],['dungeon','🕳️ Lochy'],['event','✨ Eventy'],['biome','🌿 Biomy'],['trail','👣 Ślad']].map(([k,n])=>`<button class="filter-btn ${state.settings.mapFilters[k]?'active':''}" data-filter="${k}">${n}</button>`).join('')}</div></details></div><div class="panel-item"><b>📜 Przygoda</b><div class="muted">Zadania, wydarzenia, wyprawy i bestiariusz są zebrane w jednym dzienniku.</div><div class="settings-toggles"><button class="secondary" data-menu-quests>📜 Questy</button><button class="secondary" data-menu-events>✨ Wydarzenia</button><button class="secondary" data-menu-trips>🧭 Wyprawy</button><button class="secondary" data-menu-bestiary>📖 Bestiariusz</button></div></div><div class="panel-item"><b>🔊 Dźwięk</b><div class="muted">Jeden główny przełącznik wycisza jednocześnie efekty i ambient.</div><div class="settings-toggles"><button class="secondary ${soundOn?'active':''}" data-master-sound>${soundOn?'🔊 Dźwięk: WŁ.':'🔇 Dźwięk: WYŁ.'}</button><button class="secondary" data-haptics>${state.settings.haptics?'📳 Wibracje: WŁ.':'📴 Wibracje: WYŁ.'}</button></div></div><div class="panel-item"><b>🎓 Samouczek</b><div class="muted">Wskazówka pojawia się na mapie i można ją zamknąć bez wyłączania samouczka. Pełny postęp jest w Questach.</div><button class="secondary" data-restart-tutorial>Uruchom od początku</button></div><div class="panel-item mobile-install-card"><b>📲 Time4Heroes na telefonie</b><button class="secondary" data-install-app>${isStandalone()?'✅ Aplikacja zainstalowana':'Zainstaluj na telefonie'}</button></div><div class="panel-item"><b>💾 Zapis gry</b><div class="tabs" style="margin-top:8px"><button class="secondary" data-export>Eksportuj</button><button class="secondary" data-import>Importuj</button><input type="file" id="saveFile" accept="application/json" hidden></div></div><div class="panel-item"><b>🌙 Testy</b><button class="secondary" data-night>${state.settings.forceNight?'Wyłącz symulację nocy':'Włącz symulację nocy'}</button></div><div class="panel-item reset-character-card"><b>🧪 Reset postaci do testów</b><div class="muted">Usuwa lokalny save oraz stare save’y migracyjne i wraca prosto do kreatora postaci.</div><button class="danger" data-reset-character>Resetuj postać</button></div></div>`;
 el.querySelector('[data-install-app]')?.addEventListener('click',installPwa);el.querySelector('[data-export]').onclick=exportSave;el.querySelector('[data-import]').onclick=()=>document.querySelector('#saveFile').click();document.querySelector('#saveFile').onchange=importSave;el.querySelector('[data-night]').onclick=()=>{state.settings.forceNight=!state.settings.forceNight;save();renderMore(el)};el.querySelector('[data-master-sound]').onclick=()=>{toggleMasterSound();renderMore(el)};el.querySelector('[data-haptics]').onclick=()=>{state.settings.haptics=!state.settings.haptics;save();renderMore(el)};el.querySelector('[data-restart-tutorial]').onclick=()=>{state.tutorial={stage:0,complete:false,rewardGiven:true,flags:{},introSeen:true,finishReward:true,mapDismissedStage:-1};save();selectNav('map')};el.querySelector('[data-reset-character]').onclick=resetCharacter;el.querySelector('[data-menu-gps]').onclick=()=>{toggleGps();setTimeout(()=>{if(currentTab==='menu')renderMore(el)},120)};el.querySelector('[data-menu-center]').onclick=centerMapOnPlayer;el.querySelector('[data-map-mode]').onclick=()=>{state.settings.mapMode=state.settings.mapMode==='focused'?'full':'focused';save();renderMore(el)};el.querySelector('[data-explorer-journal]').onclick=openExplorerJournal;el.querySelector('[data-fast-travel]').onclick=openFastTravel;el.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.settings.mapFilters[b.dataset.filter]=!state.settings.mapFilters[b.dataset.filter];save();renderMore(el)});el.querySelector('[data-menu-quests]').onclick=openQuestView;el.querySelector('[data-menu-events]').onclick=()=>{state.ui.adventureView='events';save();selectNav('adventureHub')};el.querySelector('[data-menu-trips]').onclick=()=>{state.ui.adventureView='trips';save();selectNav('adventureHub')};el.querySelector('[data-menu-bestiary]').onclick=()=>{state.ui.adventureView='bestiary';save();selectNav('adventureHub')}}

function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='time4heroes-build-2.5.2-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importSave(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=normalizeState(JSON.parse(r.result));save();refresh();toast('Zapis zaimportowany.')}catch{toast('Nieprawidłowy plik zapisu.')}};r.readAsText(f)}


const SKILL_COMBAT_META={
 shield:{type:'obuch',interrupt:true,stagger:38},fortress:{type:'obuch',stagger:5},taunt:{type:'obuch',interrupt:true,stagger:30},counter:{type:'obuch',stagger:24},breaker:{type:'obuch',interrupt:true,stagger:42},lastStand:{type:'obuch',stagger:6},
 fire:{type:'ogień',stagger:18},frost:{type:'lód',interrupt:true,stagger:34},elemental:{type:'arkanum',stagger:28},spark:{type:'arkanum',stagger:22},iceArmor:{type:'lód',stagger:5},meteor:{type:'ogień',stagger:36},
 double:{type:'przebicie',stagger:20},mark:{type:'przebicie',stagger:14},petStrike:{type:'przebicie',stagger:26},eagleEye:{type:'przebicie',interrupt:true,stagger:36},pack:{type:'przebicie',stagger:28},volley:{type:'przebicie',stagger:30},
 rage:{type:'krwawienie',stagger:22},cleave:{type:'krwawienie',stagger:26},blood:{type:'krwawienie',stagger:30},roar:{type:'krwawienie',interrupt:true,stagger:34},execution:{type:'krwawienie',stagger:36},berserk:{type:'krwawienie',stagger:32},
 poison:{type:'trucizna',stagger:18},trap:{type:'pułapki',interrupt:true,stagger:35},destiny:{type:'przebicie',stagger:30},vine:{type:'pułapki',stagger:28},spirit:{type:'arkanum',stagger:25},venomRain:{type:'trucizna',stagger:32}
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
  ward:{icon:'🛡️',name:'Runiczna osłona',hint:'Boss założy silną barierę. Przerwanie lub przełamanie zatrzyma rytuał.'}
 })[intent.type]||{icon:'⚠️',name:'Nieznany zamiar',hint:'Przygotuj się.'};
}
function chooseBossIntent(){
 const phase=combat.bossPhase||1, roll=(combat.enemyTurns+combat.level+combat.monster.id.length)%3;
 if(phase===1)return roll===1?{type:'ward',interruptible:true}:{type:'smash',interruptible:true};
 return roll===0?{type:'smash',interruptible:true}:roll===1?{type:'hex',interruptible:true}:{type:'ward',interruptible:true};
}
function startCombat(entity,opts={}){
 const m=monsterTemplate(entity),lvl=opts.level||monsterLevel(m),scale=.66+lvl*.075,maxHp=Math.max(24,Math.floor(m.hp*scale)),atk=Math.max(4,Math.floor(m.atk*(.62+lvl*.045))),isBoss=!!opts.worldBoss||!!opts.dungeon?.boss||!!entity.elite;
 combat={entity,monster:m,level:lvl,maxHp,hp:maxHp,atk,baseAtk:atk,log:[`${m.name} staje do walki.`],guard:0,debuff:0,debuffTurns:0,poison:0,poisonTurns:0,mark:0,markTurns:0,dungeon:opts.dungeon||null,worldBoss:!!opts.worldBoss,isBoss,bossPhase:1,enemyTurns:0,intent:null,stagger:0,staggerMax:isBoss?100:0,stunned:0,vulnerableTurns:0,barrier:0,barrierTurns:0,playerWeaken:0,playerWeakenTurns:0,lastPlayerHit:null,lastEnemyHit:null};
 openCombat();
}
function openCombat(){
 const c=combat,p=state.player;if(!c)return;setAmbient(c.isBoss?'boss':'battle');const cl=climate(),pet=petInstance(),intent=bossIntentInfo(c.intent),resists=(FAMILY_RESISTS[c.monster.family]||[]);
 app.innerHTML=`<div class="battle-screen ${c.dungeon?'dungeon-battle':''} theme-${battleTheme(c.monster)} fx-${c.fx||'idle'}"><div class="battle-top"><div><span class="build-chip">WALKA 2.3</span><h2>${c.worldBoss?'🌍 Boss świata':c.dungeon?'🕳️ Komnata lochu':'⚔️ Spotkanie w świecie'}</h2></div><div>${cl.icon} ${cl.weather} • ${cl.phase}</div></div><div class="battle-arena"><div class="arena-layer layer-back"></div><div class="combatant hero-side ${c.lastEnemyHit?'combat-hit':''}"><div class="combat-name"><b>${p.name}</b><span>${CLASSES[p.class].name} • lvl ${p.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap bigbar"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div class="battle-sprite hero-sprite"><div>${classVisual(p.class,'sprite-battle')}</div><span class="shadow"></span>${c.lastEnemyHit?`<strong class="float-damage hero-damage">-${c.lastEnemyHit}</strong>`:''}</div>${pet?`<div class="battle-pet"><span>${petVisual(pet.id,'sprite-pet')}</span><small>${petDef(pet.id).name} lvl ${pet.level}</small></div>`:''}${c.playerWeakenTurns?`<div class="player-status-chip">⬇️ Osłabienie ${c.playerWeakenTurns}</div>`:''}</div><div class="battle-center"><div class="versus">VS</div><div class="turn-indicator">TURA GRACZA</div>${c.isBoss?`<div class="break-wrap"><small>PRZEŁAMANIE</small><div class="break-bar"><span style="width:${Math.min(100,c.stagger)}%"></span></div><b>${Math.floor(c.stagger)}/${c.staggerMax}</b></div>`:''}</div><div class="combatant enemy-side ${c.lastPlayerHit?'combat-hit':''}"><div class="combat-name"><b>${c.entity.elite?'⭐ ':''}${c.monster.name}</b><span>${c.monster.family} • lvl ${c.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp enemyhp" style="width:${100*Math.max(0,c.hp)/c.maxHp}%"></div><div class="barlabel">HP ${Math.max(0,c.hp)}/${c.maxHp}</div></div><div class="status-row">${c.poisonTurns?`<span>☠️ Trucizna ${c.poisonTurns}</span>`:''}${c.debuffTurns?`<span>⬇️ Osłabienie ${c.debuffTurns}</span>`:''}${c.markTurns?`<span>🎯 Znak ${c.markTurns}</span>`:''}${c.barrierTurns?`<span>🛡️ Bariera ${c.barrierTurns}</span>`:''}${c.vulnerableTurns?`<span>💢 Przełamany</span>`:''}</div></div><div class="battle-sprite enemy-sprite"><div>${monsterVisual(c.monster.id,'sprite-battle')}</div><span class="shadow"></span>${c.lastPlayerHit?`<strong class="float-damage enemy-damage">-${c.lastPlayerHit}</strong>`:''}</div><div class="enemy-meta"><span>ATK ${c.atk}</span><span class="weak-meta">🎯 ${c.monster.weak||'brak'}</span>${resists.length?`<span class="resist-meta">🧱 ${resists.join(', ')}</span>`:''}</div>${c.isBoss?`<div class="boss-intent ${c.intent?'danger-intent':''}"><b>${intent.icon} ${c.intent?intent.name:'Faza '+c.bossPhase}</b><small>${c.intent?intent.hint:'Zapełnij pasek przełamania, aby ogłuszyć bossa.'}</small></div>`:''}</div></div><div class="battle-bottom"><div class="combat-log"><b>Dziennik walki</b>${c.log.slice(-7).map(x=>`<div>› ${x}</div>`).join('')}</div><div><div class="skill-hotbar"><button class="battle-skill basic" data-attack><span>⚔️</span><b>Atak</b><small>+10 przeł.</small></button><button class="battle-skill defend-skill" data-defend><span>🛡️</span><b>Obrona</b><small>na 1 turę</small></button>${p.skills.map(id=>skillDef(id)).filter(Boolean).map(s=>{const meta=combatSkillMeta(s);return `<button class="battle-skill ${c.intent&&meta.interrupt?'interrupt-ready':''}" data-skill="${s.id}" ${p.mana<s.mana?'disabled':''}><span>${skillIconVisual(s.id,'combat-skill-svg')}</span><b>${s.name}</b><small>${s.mana} many • ${meta.type}${meta.interrupt?' • PRZERWIJ':''}</small></button>`}).join('')}<button class="battle-skill potion-skill" data-combat-potion ${countItem('potion')?'':'disabled'}><span>🧪</span><b>Mikstura</b><small>${countItem('potion')} szt.</small></button><button class="battle-skill flee-skill" data-flee><span>🏃</span><b>Ucieczka</b><small>${c.dungeon?'zablokowana':'70%'}</small></button></div><div class="combat-help"><span>🎯 traf w słabość: +25%</span><span>🧱 odporność: −28%</span><span>💢 100 przełamania = ogłuszenie</span></div></div></div></div>`;
 document.querySelector('[data-attack]').onclick=()=>playerAction(null);document.querySelector('[data-defend]').onclick=defendAction;document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>playerAction(skillDef(b.dataset.skill)));document.querySelector('[data-combat-potion]')?.addEventListener('click',combatPotion);document.querySelector('[data-flee]').onclick=fleeCombat;
 setTimeout(()=>{if(combat){combat.lastPlayerHit=null;combat.lastEnemyHit=null;combat.fx='idle'}},650);
}
function logCombat(t){combat.log.push(t)}
function hitDamage(mult=1,critBonus=0,type='fizyczne'){
 const miss=false,crit=Math.random()*100<critChance()+combat.mark+critBonus,weak=weaknessMod(type),weaken=1-(combat.playerWeaken||0),vulnerable=combat.vulnerableTurns?1.35:1,barrier=combat.barrierTurns?.55:1,base=attackPower()*mult*(.88+Math.random()*.24),dmg=Math.max(1,Math.floor(base*(crit?1.65:1)*weak.mult*weaken*vulnerable*barrier));
 if(crit){combat.fx='crit';playSfx('crit');haptic(22)}else{combat.fx=weak.kind==='weak'?'weak':'hit';playSfx('hit');}if(weak.kind==='weak')haptic(12);return {dmg,crit,weak:weak.kind==='weak',resist:weak.kind==='resist',type,miss};
}
function hitSuffix(h){return `${h.crit?' • KRYTYK':''}${h.weak?' • 🎯 SŁABOŚĆ':''}${h.resist?' • 🧱 ODPORNOŚĆ':''}`}
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
function playerAction(skill){
 if(!combat)return;if(skill&&state.player.mana<skill.mana)return toast('Za mało many.');if(skill)state.player.mana-=skill.mana;const meta=combatSkillMeta(skill);let total=0,hits=1;
 if(skill&&interruptIntent(skill,meta)){};
 if(!skill){const h=hitDamage(1,0,meta.type);total=h.dmg;combat.hp-=h.dmg;logCombat(`Atakujesz za ${h.dmg}${hitSuffix(h)}.`)}
 else if(skill.kind==='damage'){const h=hitDamage(skill.mult,skill.critBonus||0,meta.type);total=h.dmg;combat.hp-=h.dmg;logCombat(`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);if(skill.debuff){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3}}
 else if(skill.kind==='multi'){hits=skill.hits;let crits=0,weaks=0,resists=0;for(let i=0;i<skill.hits;i++){const h=hitDamage(skill.mult,0,meta.type);total+=h.dmg;if(h.crit)crits++;if(h.weak)weaks++;if(h.resist)resists++}combat.hp-=total;logCombat(`${skill.name}: ${total} obrażeń w ${skill.hits} trafieniach${crits?` • krytyki ${crits}`:''}${weaks?' • 🎯 słabość':''}${resists?' • 🧱 odporność':''}.`)}
 else if(skill.kind==='guard'){combat.guard=Math.max(combat.guard,skill.turns);logCombat(`${skill.name}: wzmacniasz obronę na ${skill.turns} tury.`)}
 else if(skill.kind==='debuff'){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3;logCombat(`${skill.name}: przeciwnik zostaje osłabiony.`)}
 else if(skill.kind==='mark'){combat.mark=25;combat.markTurns=skill.turns;logCombat(`${skill.name}: oznaczasz cel.`)}
 else if(skill.kind==='poison'){const h=hitDamage(skill.mult,0,meta.type);total=h.dmg;combat.hp-=h.dmg;combat.poison=Math.max(4,Math.floor(attackPower()*.24));combat.poisonTurns=skill.turns;logCombat(`${skill.name}: ${h.dmg}${hitSuffix(h)} i trucizna.`)}
 else if(skill.kind==='pet'){const h=hitDamage(skill.mult,0,meta.type);total=h.dmg;combat.hp-=h.dmg;logCombat(`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);petAttack(true)}
 else if(skill.kind==='rage'){const missing=1-state.player.hp/state.player.maxHp,mult=1.2+missing*.7,h=hitDamage(mult,0,meta.type);total=h.dmg;combat.hp-=h.dmg;logCombat(`${skill.name}: ${h.dmg}${hitSuffix(h)}.`)}
 if(total){combat.lastPlayerHit=total;afterPlayerAttack(meta,hits)}else if(skill)afterPlayerAttack(meta,1);
 if(skill?.kind!=='pet')petAttack(false);if(combat.hp<=0)return winCombat();enemyTurn();
}
function defendAction(){if(!combat)return;combat.guard=Math.max(combat.guard,1);logCombat('🛡️ Przyjmujesz postawę obronną. Najbliższy cios zada znacznie mniej obrażeń.');haptic(12);enemyTurn()}
function petAttack(force){const p=petInstance();if(!p)return;if(!force&&Math.random()>.35)return;const dmg=Math.max(2,Math.floor(petPower()*(.8+Math.random()*.4)));combat.hp-=dmg;combat.lastPlayerHit=(combat.lastPlayerHit||0)+dmg;logCombat(`${petDef(p.id).icon} ${petDef(p.id).name} atakuje za ${dmg}.`)}
function resolveBossIntent(){
 const intent=combat.intent;if(!intent)return false;const info=bossIntentInfo(intent);combat.intent=null;
 if(intent.type==='smash'){
  combat.fx='boss';const reduction=armorPower()*.28,guardMult=combat.guard>0?.28:1,dmg=Math.max(1,Math.floor((combat.atk*2.25-reduction)*guardMult));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;logCombat(`${combat.guard>0?'🛡️ Blokujesz większość':'💥 Trafia Cię'}: ${info.name} za ${dmg}.`);if(combat.guard>0)combat.guard--;
 }else if(intent.type==='hex'){
  combat.playerWeaken=.28;combat.playerWeakenTurns=2;const drain=Math.min(state.player.mana,12+combat.bossPhase*4);state.player.mana-=drain;logCombat(`🕯️ ${info.name}: −28% obrażeń na 2 tury i −${drain} many.`);
 }else if(intent.type==='ward'){
  combat.barrier=.45;combat.barrierTurns=2;logCombat('🛡️ Boss otacza się runiczną barierą: otrzymuje o 45% mniej obrażeń przez 2 Twoje akcje.');
 }
 return true;
}
function tickEnemyStatuses(){
 if(combat.debuffTurns>0&&--combat.debuffTurns===0)combat.debuff=0;if(combat.markTurns>0&&--combat.markTurns===0)combat.mark=0;if(combat.playerWeakenTurns>0&&--combat.playerWeakenTurns===0)combat.playerWeaken=0;
}
function enemyTurn(){
 if(combat.hp<=0)return winCombat();
 if(combat.poisonTurns>0){combat.hp-=combat.poison;combat.poisonTurns--;logCombat(`☠️ Trucizna zadaje ${combat.poison}.`);if(combat.hp<=0)return winCombat()}
 if(combat.isBoss&&combat.bossPhase===1&&combat.hp<=combat.maxHp*.5){combat.bossPhase=2;combat.atk=Math.floor(combat.baseAtk*1.28);logCombat(`🔥 ${combat.monster.name} przechodzi do FAZY II! Zamiary są groźniejsze.`);playSfx('boss');haptic([35,25,35])}
 if(combat.stunned>0){combat.stunned--;logCombat('💫 Przeciwnik jest ogłuszony i traci akcję.');tickEnemyStatuses();save();openCombat();return}
 if(combat.intent){resolveBossIntent();tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();save();openCombat();return}
 combat.enemyTurns++;
 if(combat.isBoss&&combat.enemyTurns%3===0){combat.intent=chooseBossIntent();const info=bossIntentInfo(combat.intent);logCombat(`⚠️ Boss przygotowuje: ${info.name}. ${info.hint}`);playSfx('boss');haptic([30,35,30]);save();openCombat();return}
 combat.fx='enemy';const reduction=armorPower()*.42,guardMult=combat.guard>0?.55:1,mult=(1-combat.debuff)*guardMult,dmg=Math.max(1,Math.floor((combat.atk*(.85+Math.random()*.3)-reduction)*mult));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;logCombat(`${combat.monster.name} zadaje Ci ${dmg}.`);if(combat.guard>0)combat.guard--;tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();save();openCombat();
}
function combatPotion(){if(!countItem('potion'))return;playSfx('heal');removeItem('potion');state.player.hp=Math.min(state.player.maxHp,state.player.hp+55);logCombat('Wypijasz Miksturę życia (+55 HP).');enemyTurn()}
function fleeCombat(){if(combat?.dungeon)return toast('Nie możesz uciec z tej komnaty lochu.');if(Math.random()<.7){combat=null;renderShell();toast('Udało Ci się uciec.')}else{logCombat('Nie udało się uciec!');enemyTurn()}}
function winCombat(){
 const c=combat,m=c.monster,e=c.entity,xp=Math.floor(m.xp*(.65+.055*c.level)*(e.elite?1.75:1)),gold=rnd(...m.gold)*(e.elite?2:1);
 state.player.gold+=gold;state.player.kills++;playSfx('kill');haptic(18);tutorialEvent('kill');state.player.bestiary[m.id]=(state.player.bestiary[m.id]||0)+1;if(!e.synthetic){e.alive=false;e.respawn=Date.now()+5*60*1000}checkQuestProgress('kill',m.id);const gearDrop=rollCombatLoot(m,e,c);gainXp(xp);gainPetXp(xp);if(e.elite||c.isBoss)playSfx('loot');if(c.worldBoss){state.adventure.worldBossDay=daySeed();state.adventure.reputation+=25;state.player.gold+=180;addItem('titanShard');addItem('runeShard',2);if(Math.random()<.55)addItem(pick(['runePower','runeGuard','runePrecision']));if(Math.random()<.18)addItem(pick(['stormCrown','cryptHeart']));toast('Boss świata pokonany! +25 reputacji • +180 🪙 • dodatkowy łup')}updateAchievements();const dungeonInfo=c.dungeon;combat=null;save();if(dungeonInfo){renderShell();advanceDungeonAfterCombat(dungeonInfo);return}renderShell();toast(`Zwycięstwo! +${xp} XP • +${gold} 🪙`);
}
function loseCombat(){const loss=Math.min(250,Math.max(10,Math.floor(state.player.gold*.04)));state.player.hp=Math.max(1,Math.floor(state.player.maxHp*.35));state.player.mana=Math.floor(state.player.maxMana*.35);state.player.gold=Math.max(0,state.player.gold-loss);combat=null;dungeonRun=null;save();renderShell();toast(`Porażka. Tracisz ${loss} 🪙 i budzisz się w wiosce.`)}
function startDungeon(d){if(!d)return;if(!state.player.dungeons.includes(d.id))return toast('Najpierw odkryj ten loch w świecie GPS.');dungeonRun={id:d.id,stage:0};openDungeonStage()}
function dungeonPath(){return ['Wejście','Wydarzenie','Strażnik','Boss']}
function pathHTML(){return `<div class="room-path">${dungeonPath().map((r,i)=>`<div class="room-dot ${i<dungeonRun.stage?'done':i===dungeonRun.stage?'current':''}">${i+1}. ${r}</div>`).join('')}</div>`}
function openDungeonStage(){
 setAmbient('dungeon');
 const d=DUNGEONS.find(x=>x.id===dungeonRun.id),s=dungeonRun.stage;
 if(s===0){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Sugerowany poziom ${d.min}</div></div><button class="close" data-abandon>×</button></div>${pathHTML()}<p>${d.desc}</p><div class="panel-item">Kamienne schody prowadzą w ciemność. Zapisujesz drogę — ten loch pozostanie dostępny z domu.</div><button class="primary" style="margin-top:10px" data-next-room>Wejdź głębiej</button>`);document.querySelector('[data-next-room]').onclick=()=>{dungeonRun.stage=1;openDungeonStage()};document.querySelector('[data-abandon]').onclick=abandonDungeon;return}
 if(s===1){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Komnata wydarzenia</div></div><button class="close" data-abandon>×</button></div>${pathHTML()}<p>Rozwidlenie. Po lewej widać stare runy. Po prawej leży zamknięta skrzynia.</p><div class="tabs"><button class="secondary" data-choice="runes">✨ Zbadaj runy</button><button class="secondary" data-choice="chest">📦 Otwórz skrzynię</button></div>`);document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>dungeonChoice(b.dataset.choice));document.querySelector('[data-abandon]').onclick=abandonDungeon;return}
 if(s===2){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Strażnik</div></div></div>${pathHTML()}<div class="panel-item"><b>Coś porusza się w ciemności.</b><div class="muted">Przed komnatą bossa czeka strażnik.</div></div><button class="primary" style="margin-top:10px" data-fight-room>Walcz</button>`);document.querySelector('[data-fight-room]').onclick=()=>startDungeonFight(false);return}
 if(s===3){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Komnata bossa</div></div></div>${pathHTML()}<div class="panel-item"><b>🔥 Boss lochu</b><div class="muted">Po tej walce otrzymasz nagrodę za ukończenie wyprawy.</div></div><button class="primary" style="margin-top:10px" data-fight-boss>Rozpocznij walkę</button>`);document.querySelector('[data-fight-boss]').onclick=()=>startDungeonFight(true)}
}
function dungeonChoice(choice){if(choice==='runes'){state.player.mana=Math.min(state.player.maxMana,state.player.mana+30);gainXp(35);toast('Runy przywracają 30 many i dają 35 XP.')}else{if(Math.random()<.35){const dmg=Math.max(5,Math.floor(state.player.maxHp*.12));state.player.hp=Math.max(1,state.player.hp-dmg);toast(`Pułapka! -${dmg} HP.`)}else{addItem(pick(['herb','herb','moonHerb','crystal','potion','scrap']));if(Math.random()<.12)addItem('runeShard');toast('W skrzyni znalazłeś przedmiot.')}}save();dungeonRun.stage=2;openDungeonStage()}
function startDungeonFight(boss){const d=DUNGEONS.find(x=>x.id===dungeonRun.id),guards={trainingCellar:['slime','rat'],oldCrypt:['skeleton','goblin'],forgottenTower:['cultist','ghost'],beastLair:['demon','hellhound'],sunkenChapel:['mireCrawler','bogWraith'],witchBarrow:['rotCultist','marshHag'],blackrootKeep:['blackrootGuardian','mossGolem'],emberMine:['ashScavenger','fireWasp','cinderCultist'],ashenCitadel:['pyreKnight','ashDrake','emberWraith'],frostVault:['frostRaptor','iceWraith','frozenKnight'],tempestSpire:['stormCultist','thunderGolem','skySerpent']};let id=boss?d.boss:pick(guards[d.id]||['demon','hellhound']);const m=MONSTERS.find(x=>x.id===id)||MONSTERS[0];const e={id:`d_${Date.now()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:boss,synthetic:true};closeModal();startCombat(e,{level:clamp(state.player.level+(boss?2:0),m.min,m.max),dungeon:{boss}})}
function advanceDungeonAfterCombat(info){if(!dungeonRun)return refresh();if(info.boss){completeDungeon();return}dungeonRun.stage=3;openDungeonStage()}
function completeDungeon(){playSfx('loot');haptic([20,25,20]);const d=DUNGEONS.find(x=>x.id===dungeonRun.id),isTraining=d.id==='trainingCellar',bonus=isTraining?140:220+state.player.level*35,gold=isTraining?35:55+state.player.level*4;gainXp(bonus);state.player.gold+=gold;state.player.dungeonClears[d.id]=(state.player.dungeonClears[d.id]||0)+1;if(d.id==='trainingCellar')tutorialEvent('dungeonComplete',d.id);checkQuestProgress('dungeon',d.id);if(!isTraining&&Math.random()<.32)addItem('crystal');if(!isTraining&&Math.random()<.38)addItem('runeShard');if(Math.random()<.22)addItem('moonHerb');if(!isTraining&&Math.random()<.18)addItem(randomGearFrom(state.player.level>=21?'epic':'rare'));if(isTraining)addItem('potion');if(['sunkenChapel','witchBarrow','blackrootKeep'].includes(d.id)){addItem('mireMoss',rnd(1,2));if(Math.random()<.65)addItem('bogAmber');if(Math.random()<.45)addItem('wraithEssence')}if(['emberMine','ashenCitadel'].includes(d.id)){addItem('charredIron',rnd(1,2));if(Math.random()<.65)addItem('ashGlass');if(Math.random()<.45)addItem('emberCore')}if(['frostVault','tempestSpire'].includes(d.id)){addItem('frostCrystal',rnd(1,2));if(Math.random()<.65)addItem('stormFeather');if(Math.random()<.40)addItem('skySteel')}updateAchievements();dungeonRun=null;save();refresh();toast(`${d.name} ukończona! +${bonus} XP • +${gold} 🪙`)}
function abandonDungeon(){dungeonRun=null;closeModal();toast('Opuszczasz loch.')}

function openModal(html){document.body.classList.add('modal-open');let wrap=document.querySelector('.modal-back');if(!wrap){wrap=document.createElement('div');wrap.className='modal-back';document.body.appendChild(wrap)}wrap.innerHTML=`<div class="modal">${html}</div>`;wrap.onclick=e=>{if(e.target===wrap&&combat===null&&dungeonRun===null)closeModal()};wrap.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)}
function closeModal(){document.querySelector('.modal-back')?.remove();document.body.classList.remove('modal-open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.modal-back')&&combat===null&&dungeonRun===null)closeModal()});

// Mobile 1.10: oszczędzanie baterii w tle.
document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&gpsWatch!==null){navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;gpsPausedByBackground=true}
 else if(!document.hidden&&gpsPausedByBackground){gpsPausedByBackground=false;setTimeout(()=>{if(gpsWatch===null)toggleGps()},650)}
});

state=load();
if(state?.world?.entities){for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true}
render();
