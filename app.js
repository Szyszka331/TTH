import {CLASSES,MONSTERS,MONSTER_LOOT,ITEMS,QUESTS,SKILLS,PETS,RECIPES,DUNGEONS,BUILDINGS} from './data.js?v=3998';

const REAL_SAVE_KEY='time4heroes_build_390', DEMO_SAVE_KEY='time4heroes_build_390_sandbox', MODE_KEY='time4heroes_mode';
let SAVE_KEY=localStorage.getItem(MODE_KEY)==='sandbox'?DEMO_SAVE_KEY:REAL_SAVE_KEY;
const CHARACTER_LIMIT=5;
const CHARACTER_META_REAL='time4heroes_character_active_gps';
const CHARACTER_META_TEST='time4heroes_character_active_sandbox';
let characterSlotTransition=false;
const MIGRATION_KEYS=['time4heroes_build_380','time4heroes_build_370','time4heroes_build_360','time4heroes_build_350','time4heroes_build_340','time4heroes_build_330','time4heroes_build_320','time4heroes_build_311','time4heroes_build_310','time4heroes_build_290','time4heroes_build_270','time4heroes_build_251','time4heroes_build_257','time4heroes_build_25','time4heroes_build_24','time4heroes_build_23','time4heroes_build_232','time4heroes_build_22','time4heroes_build_21','time4heroes_build_115','time4heroes_build_114','time4heroes_build_111','time4heroes_build_110','time4heroes_build_19','time4heroes_build_18','time4heroes_build_17','time4heroes_build_16','time4heroes_build_15','time4heroes_build_14','time4heroes_build_13','time4heroes_build_12_core','time4heroes_build_11','time4heroes_build_10','time4heroes_build_09','time4heroes_build_08','georpg_build_07','georpg_build_06','georpg_build_05','georpg_build_04','georpg_build_03','georpg_build_02','georpg_build_01'];
const app=document.querySelector('#app');
const toastEl=document.querySelector('#toast');
const BUILD_VERSION='3.9.9.8';
// 3.9.9.3 — handel, 36 slotów, alchemia, offline regen i indywidualna grafika przedmiotów.
// 3.9.9.2 — Szczęście jako statystyka + leczenie Maga siebie/sojuszników.
// 3.9.9.1 — crafting maks. Rzadki; Unikatowe/Heroiczne/Legendarne tylko z dropu.
// 3.9.9.0 — pełny crafting z materiałów potworów + receptury rzemieślnicze i przetwarzanie.
// 3.9.8.8 — bossowe unikaty, endgame EQ 80/90/100 i kowalstwo endgame.
const CURATED_MONSTER_LEVELS={"slime":[1,4],"rat":[1,5],"chochlik":[1,5],"lis":[3,6],"czapla":[5,10],"kruk":[5,10],"zdziczalyPies":[5,10],"wolf":[4,10],"dziewanna":[5,10],"wydra":[10,15],"ropucha":[4,8],"thornBoar":[10,15],"grzybiarz":[8,12],"sokol":[12,15],"plagueToad":[18,20],"trzcinnik":[10,18],"mangradora":[20,22],"blackrootGuardian":[20,22],"placzacaWierzba":[20,25],"leszy":[28,28],"jednorozec":[30,30],"beetle":[1,3],"spider":[5,8],"graveMoth":[8,10],"mireCrawler":[8,10],"krocionog":[8,12],"cmaUpiorna":[8,10],"komarzyca":[12,15],"skorpion":[15,20],"fireWasp":[20,20],"magmaScorpion":[20,22],"goblin":[5,13],"kieszonkowiec":[20,22],"zbir":[22,25],"goblinWarrior":[6,18],"klusownik":[25,27],"rozbojnik":[30,32],"goblinMage":[15,20],"najemnik":[25,28],"ork":[30,35],"szaleniec":[25,28],"goblinChampion":[25,25],"cultist":[17,38],"rotCultist":[25,28],"cinderCultist":[30,32],"ogre":[12,22],"stormCultist":[30,32],"graveColossus":[25,25],"skeleton":[7,22],"boneArcher":[18,18],"zombie":[15,15],"ghul":[20,20],"wisielec":[20,20],"mumia":[25,25],"zniwiarzPol":[33,33],"trupojad":[20,20],"pyreKnight":[35,35],"frozenKnight":[35,35],"lichWarden":[35,35],"kosciej":[36,36],"strachNaWroble":[23,23],"blednyOgnik":[40,40],"poltergeist":[42,42],"poludnica":[36,36],"shade":[36,36],"mistStag":[29,29],"bogWraith":[40,40],"ghost":[9,38],"rusalka":[41,41],"placzacaPanna":[44,44],"zmora":[45,45],"emberWraith":[43,43],"iceWraith":[42,42],"widmowyJezdziec":[42,42],"mossGolem":[30,30],"wir":[30,30],"elemental":[35,35],"plomyk":[40,40],"slagGolem":[35,35],"zywiolakCienia":[40,40],"obsidianSentinel":[55,55],"thunderGolem":[40,40],"lodowyGolem":[45,45],"zywiolakSwiatla":[44,44],"tempestLord":[50,50],"marshHag":[45,45],"latawiec":[50,50],"wodnik":[55,55],"bies":[52,52],"diabel":[55,55],"voidHound":[55,55],"cinderMatriarch":[60,60],"demon":[66,66],"hellhound":[66,66],"abyssHydra":[66,66],"caveBat":[10,10],"dzik":[15,15],"zbik":[10,10],"stormDrake":[70,70],"rys":[12,12],"harpia":[45,45],"niedzwiedz":[30,30],"wilkolak":[60,60],"fenStalker":[53,53],"sumOlbrzymi":[50,50],"mlodyKraken":[70,70],"mireMother":[70,70],"ashScavenger":[65,65],"ashDrake":[67,67],"frostRaptor":[77,77],"kozica":[40,40],"mountainTroll":[78,78],"skySerpent":[80,80],"bazyliszek":[70,70],"gryf":[80,80],"stormGriffin":[90,90],"wyvern":[80,80]};
const CURATED_MONSTER_RANKS={"slime":"Zwykły","rat":"Zwykły","chochlik":"Zwykły","lis":"Zwykły","czapla":"Zwykły","kruk":"Zwykły","zdziczalyPies":"Zwykły","wolf":"Zwykły","dziewanna":"Zwykły","wydra":"Zwykły","ropucha":"Zwykły","thornBoar":"Zwykły","grzybiarz":"Zwykły","sokol":"Zwykły","plagueToad":"Zwykły","trzcinnik":"Zwykły","mangradora":"Zwykły","blackrootGuardian":"Zwykły","placzacaWierzba":"Zwykły","leszy":"Heros","jednorozec":"Heros","beetle":"Zwykły","spider":"Zwykły","graveMoth":"Zwykły","mireCrawler":"Zwykły","krocionog":"Zwykły","cmaUpiorna":"Zwykły","komarzyca":"Zwykły","skorpion":"Zwykły","fireWasp":"Elita","magmaScorpion":"Zwykły","goblin":"Zwykły","kieszonkowiec":"Zwykły","zbir":"Zwykły","goblinWarrior":"Zwykły","klusownik":"Zwykły","rozbojnik":"Zwykły","goblinMage":"Elita","najemnik":"Zwykły","ork":"Zwykły","szaleniec":"Zwykły","goblinChampion":"Heros","cultist":"Zwykły","rotCultist":"Zwykły","cinderCultist":"Zwykły","ogre":"Zwykły","stormCultist":"Zwykły","graveColossus":"Zwykły","skeleton":"Zwykły","boneArcher":"Zwykły","zombie":"Zwykły","ghul":"Zwykły","wisielec":"Zwykły","mumia":"Zwykły","zniwiarzPol":"Elita","trupojad":"Zwykły","pyreKnight":"Zwykły","frozenKnight":"Zwykły","lichWarden":"Zwykły","kosciej":"Heros","strachNaWroble":"Zwykły","blednyOgnik":"Zwykły","poltergeist":"Zwykły","poludnica":"Zwykły","shade":"Zwykły","mistStag":"Zwykły","bogWraith":"Zwykły","ghost":"Zwykły","rusalka":"Elita","placzacaPanna":"Zwykły","zmora":"Zwykły","emberWraith":"Zwykły","iceWraith":"Zwykły","widmowyJezdziec":"Zwykły","mossGolem":"Zwykły","wir":"Zwykły","elemental":"Zwykły","plomyk":"Elita","slagGolem":"Zwykły","zywiolakCienia":"Elita","obsidianSentinel":"Elita","thunderGolem":"Elita","lodowyGolem":"Elita","zywiolakSwiatla":"Elita","tempestLord":"Elita","marshHag":"Elita","latawiec":"Zwykły","wodnik":"Elita","bies":"Zwykły","diabel":"Zwykły","voidHound":"Zwykły","cinderMatriarch":"Elita","demon":"Heros","hellhound":"Zwykły","abyssHydra":"Elita","caveBat":"Zwykły","dzik":"Zwykły","zbik":"Zwykły","stormDrake":"Legenda","rys":"Elita","harpia":"Zwykły","niedzwiedz":"Elita","wilkolak":"Heros","fenStalker":"Zwykły","sumOlbrzymi":"Zwykły","mlodyKraken":"Heros","mireMother":"Zwykły","ashScavenger":"Zwykły","ashDrake":"Zwykły","frostRaptor":"Elita","kozica":"Zwykły","mountainTroll":"Elita","skySerpent":"Legenda","bazyliszek":"Legenda","gryf":"Heros","stormGriffin":"Legenda","wyvern":"Elita"};
for(const m of MONSTERS){const lv=CURATED_MONSTER_LEVELS[m.id];if(lv){m.min=lv[0];m.max=lv[1]}m.rank=CURATED_MONSTER_RANKS[m.id]||'Zwykły'}
function registerCuratedMaterial(id,name,visualId='scrap'){if(ITEMS[id])return;ITEMS[id]={id,name,icon:'◆',visualId,type:'material',rarity:'common',value:Math.max(3,Math.round((name.length+7)*1.15)),maxStack:99}}
function registerCuratedRune(id,name){if(ITEMS[id])return;ITEMS[id]={id,name,icon:'◆',visualId:'runePower',type:'rune',rarity:'rare',value:82,runeKey:'power',runeValue:2}}
function registerCuratedGear(id,name,sourceId,reqLevel,rarity,classes){if(ITEMS[id])return;const src=ITEMS[sourceId]||ITEMS.shortBlade;const out={...src,id,name,reqLevel,rarity,classes:classes||src.classes,value:Math.max(src.value||20,Math.round((reqLevel+5)*(rarity==='legendary'?22:rarity==='heroic'?15:rarity==='epic'?10:rarity==='rare'?6:3)))};delete out.set;delete out.setName;delete out.setTwo;delete out.setThree;delete out.setClass;delete out.setLevel;delete out.classGear;if(src.damage){const base=Math.max(1,src.reqLevel||1),f=Math.max(.75,(reqLevel+6)/(base+6));out.damage=[Math.max(1,Math.round(src.damage[0]*f)),Math.max(2,Math.round(src.damage[1]*f))];out.power=Math.max(src.power||1,Math.round((src.power||1)*Math.sqrt(f)))}if(src.armor)out.armor=Math.max(src.armor,Math.round(src.armor*Math.max(.85,(reqLevel+8)/((src.reqLevel||1)+8))));ITEMS[id]=out}
function registerBossUniqueGear(id,name,sourceId,reqLevel,rarity,classes,boss,perk,build){registerCuratedGear(id,name,sourceId,reqLevel,rarity,classes);const d=ITEMS[id];if(!d)return;d.bossUnique=true;d.bossSource=boss;d.perk={...(perk||{}),label:perk?.label||'Unikat bossa'};d.build=`${build||'unikat bossowy'} • ${boss}`;d.value=Math.max(d.value||1,Math.round((d.value||1)*1.18));}
function registerEndgameMaterial(id,name,visualId='skySteel',rarity='epic',value=90){if(ITEMS[id])return;ITEMS[id]={id,name,icon:'◆',visualId,type:'material',rarity,value,maxStack:99}}
function addLootRows(base,extra){const out=[],seen=new Set();for(const row of [...(base||[]),...(extra||[])]){const key=row.id;if(seen.has(key))continue;seen.add(key);out.push(row)}return out}
function registerEndgameRecipe(id,result,ingredients){if(RECIPES.some(r=>r.id===id))return;RECIPES.push({id,station:'smith',name:ITEMS[result]?.name||result,result,qty:1,ingredients})}
registerCuratedMaterial("mud","Błoto","scrap");
registerCuratedMaterial("animalTail","Ogon zwierzęcia","wolfFang");
registerCuratedMaterial("plantShoots","Świeże pędy","herb");
registerCuratedMaterial("roots","Korzenie","scrap");
registerCuratedMaterial("wood","Drewno","herb");
registerCuratedMaterial("hide","Skóra","scrap");
registerCuratedGear("drop_lis_sztylet_chytrusa","Sztylet chytrusa","shortBlade",3,"uncommon",["ranger", "hunter"]);
registerCuratedMaterial("mat_zom","Żłom","scrap");
registerCuratedMaterial("feather","Pióra","stormFeather");
registerCuratedMaterial("beak","Dziób","wolfFang");
registerCuratedGear("drop_zdziczalyPies_buty_zagina_ego_bohatera","Buty zaginą ego bohatera","cg_knight_12_boots",5,"uncommon",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("furBundle","Futro","scrap");
registerCuratedMaterial("mat_mikstura_zycia","Mikstura życia","scrap");
registerCuratedMaterial("waterHerb","Zioła wodne","scrap");
registerCuratedMaterial("venomExtract","Ekstrakt trucizny","venomGland");
registerCuratedMaterial("spike","Kolce","wolfFang");
registerCuratedMaterial("fang","Kły","scrap");
registerCuratedMaterial("rareHerb","Rzadkie zioła","scrap");
registerCuratedGear("drop_sokol_pierscien_zwiadowcy","Pierścień zwiadowcy","cg_hunter_12_ring",12,"rare",["hunter"]);
registerCuratedGear("drop_sokol_rekawice_wzroku","Rękawice wzroku","cg_hunter_12_gloves",12,"rare",["hunter"]);
if(!ITEMS["ammo_strzay_szybkosci_100"])ITEMS["ammo_strzay_szybkosci_100"]={id:"ammo_strzay_szybkosci_100",name:"strzały szybkości",icon:'➶',visualId:'primitiveArrow',type:'ammo',rarity:'rare',value:4,maxStack:250};
registerCuratedGear("drop_plagueToad_zatrute_ostrze","Zatrute ostrze","oathSword",18,"rare",["knight", "berserker"]);
registerCuratedGear("drop_plagueToad_kaptur_tropiciela","Kaptur tropiciela","cg_ranger_12_helmet",18,"rare",["ranger"]);
registerCuratedRune("runePoison","Runa Trucizny");
registerCuratedGear("drop_trzcinnik_uk_wygiecia","Łuk wygięcia","scoutLongbow",10,"rare",["hunter", "ranger"]);
registerCuratedGear("drop_trzcinnik_kostur_powiewu","Kostur powiewu","focusWand",10,"rare",["mage"]);
registerCuratedGear("drop_trzcinnik_miecz_przeciecia","Miecz przecięcia","oathSword",10,"rare",["knight", "berserker"]);
registerCuratedGear("drop_mangradora_mot_wrzasku","Młot wrzasku","ironVowHammer",20,"rare",["knight", "berserker"]);
registerCuratedGear("drop_mangradora_wocznia_echa","Włócznia echa","guardianSpear",20,"rare",["knight", "hunter"]);
registerCuratedGear("drop_blackrootGuardian_czarne_ostrze","Czarne ostrze","oathSword",20,"rare",["knight"]);
registerCuratedGear("drop_blackrootGuardian_zbroja_korzeni","Zbroja korzeni","cg_knight_28_armor",20,"rare",["knight"]);
registerCuratedGear("drop_blackrootGuardian_kostur_ciemnosci","Kostur ciemnosci","frostStaff",20,"rare",["mage"]);
registerCuratedMaterial("mat_pierscien_badzacego_wedrowca","Pierścien błądzącego wędrowca","scrap");
registerCuratedGear("drop_placzacaWierzba_naszyjnik_lisci_wierzby","Naszyjnik liści wierzby","cg_knight_28_amulet",20,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedRune("runeLeaf","Runa Liści");
registerCuratedGear("drop_leszy_prawny_uk","Prawny łuk","mistLongbow",28,"heroic",["hunter", "ranger"]);
registerCuratedGear("drop_leszy_ostrze_podstepnego_kojarza","Ostrze podstępnego kojarzą","bastionBlade",28,"heroic",["knight", "berserker"]);
registerCuratedMaterial("mat_kilka_itemkow_dla_kazdej_klasy","Kilka itemkow dla każdej klasy","scrap");
registerCuratedGear("drop_beetle_pancerz","Pancerz","cg_knight_12_armor",1,"uncommon",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("weaverDust","Pył Tkacza","graveDust");
registerCuratedMaterial("arcaneDust","Magiczny pył","graveDust");
registerCuratedGear("drop_graveMoth_hem_grozy","Hełm grozy","cg_knight_12_helmet",8,"uncommon",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_cmaUpiorna_rekawice_nocnej_zmory","Rękawice nocnej zmory","cg_knight_12_gloves",8,"uncommon",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_komarzyca_ostrze_krwi","Ostrze krwi","oathSword",12,"rare",["knight", "berserker"]);
registerCuratedGear("drop_komarzyca_mot_krwawego_oprawcy","Młot krwawego oprawcy","ironVowHammer",12,"rare",["knight", "berserker"]);
if(!ITEMS["ammo_strzay_wampiryczne_100"])ITEMS["ammo_strzay_wampiryczne_100"]={id:"ammo_strzay_wampiryczne_100",name:"strzały wampiryczne",icon:'➶',visualId:'primitiveArrow',type:'ammo',rarity:'rare',value:4,maxStack:250};
registerCuratedGear("drop_fireWasp_tarcza_ognia","Tarcza ognia","cg_knight_12_offhand",20,"epic",["knight"]);
registerCuratedGear("drop_fireWasp_buty_ognistego_tancerza","Buty ognistego tancerza","cg_knight_12_boots",20,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_fireWasp_wocznia_ognia","Włócznia ognia","guardianSpear",20,"epic",["knight", "hunter"]);
registerCuratedRune("runeFire","Runa Ognia");
registerCuratedMaterial("ashPowder","Popiół","graveDust");
registerCuratedMaterial("fireHerb","Ogniste ziele","herb");
registerCuratedGear("drop_goblin_kaptur_goblina","Kaptur goblina","cg_knight_12_helmet",12,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_goblin_uk_goblina","Łuk goblina","scoutLongbow",12,"rare",["hunter", "ranger"]);
if(!ITEMS["ammo_strzay_trucizny_100"])ITEMS["ammo_strzay_trucizny_100"]={id:"ammo_strzay_trucizny_100",name:"strzały trucizny",icon:'➶',visualId:'primitiveArrow',type:'ammo',rarity:'rare',value:4,maxStack:250};
registerCuratedMaterial("goldPouch","Sakwa ze złotem","oldCoin");
registerCuratedRune("runeShadow","Runa Ciemności");
registerCuratedGear("drop_kieszonkowiec_tarcza_najemnika","Tarcza najemnika","cg_knight_28_offhand",20,"rare",["knight"]);
registerCuratedMaterial("oldPipes","Stare fajki","scrap");
registerCuratedGear("drop_goblinWarrior_ciezki_miecz","Ciężki miecz","oathSword",14,"rare",["knight", "berserker"]);
registerCuratedGear("drop_goblinWarrior_tarcza_wojownika","Tarcza wojownika","cg_knight_12_offhand",14,"rare",["knight"]);
registerCuratedGear("drop_goblinWarrior_mot_goblina","Młot goblina","ironVowHammer",14,"rare",["knight", "berserker"]);
registerCuratedGear("drop_klusownik_buty_wedrowca","Buty wędrowca","cg_knight_28_boots",25,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_klusownik_zaginiony_kij_maga","Zaginiony kij maga","frostStaff",25,"rare",["mage"]);
registerCuratedMaterial("snareCord","Linka na wnyki","scrap");
registerCuratedGear("drop_rozbojnik_tarcza_wojownika","Tarcza wojownika","cg_knight_28_offhand",30,"rare",["knight"]);
registerCuratedGear("drop_rozbojnik_pancerz_szlaku","Pancerz szlaku","cg_knight_28_armor",30,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_goblinMage_pierscienie_i_naszyjnik_dla_kazdej_klasy","Pierścienie i naszyjnik dla każdej klasy","cg_mage_12_amulet",15,"epic",["mage"]);
registerCuratedGear("drop_najemnik_zbroja_czarnego_najemnika","Zbroją czarnego najemnika","cg_knight_28_armor",25,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_najemnik_tarcza_ciemnosci","Tarcza ciemności","cg_knight_28_offhand",25,"rare",["knight"]);
registerCuratedGear("drop_ork_dwureczny_topor","Dwuręczny topór","mistReaver",30,"rare",["berserker", "knight"]);
registerCuratedGear("drop_ork_tarcza_gupca","Tarcza głupca","cg_knight_28_offhand",30,"rare",["knight"]);
registerCuratedGear("drop_szaleniec_topor_szalenca","Topor szaleńca","mistReaver",25,"rare",["berserker", "knight"]);
registerCuratedMaterial("falseBanner","Sztandar obłudy","scrap");
registerCuratedMaterial("prophecyScrap","Skrawek przepowiedni","roughCloth");
registerCuratedGear("drop_goblinChampion_zbroja","Zbroją","cg_knight_28_armor",25,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_goblinChampion_rekawice_i_buty_heroiczne_dla_kazdej_klasy","Rękawice i buty heroiczne dla każdej klasy","cg_knight_28_gloves",25,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_goblinChampion_pierscien_i_naszyknik_dla_maga","Pierscien i naszyknik dla maga","cg_mage_28_ring",25,"heroic",["mage"]);
registerCuratedMaterial("stagSkull","Czaszka jelenia","scrap");
registerCuratedMaterial("prophecyBook","Księga przepowiedni","roughCloth");
registerCuratedGear("drop_rotCultist_zatrute_ostrze","Zatrute ostrze","bastionBlade",25,"rare",["knight", "berserker"]);
registerCuratedGear("drop_cinderCultist_naszyjnik_kultysta","Naszyjnik kultysta","cg_knight_28_amulet",30,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_cinderCultist_kaptur_kultysta","Kaptur kultysta","cg_knight_28_helmet",30,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_cinderCultist_kontur_zaru","Kontur żaru","mistWand",30,"rare",["mage"]);
registerCuratedGear("drop_ogre_mot_ogra","Młot ogra","ashSentinelHammer",35,"rare",["knight", "berserker"]);
registerCuratedGear("drop_ogre_tarcza_gupca","Tarcza głupca","cg_knight_45_offhand",35,"rare",["knight"]);
registerCuratedRune("runeLightning","Runa Błyskawicy");
registerCuratedGear("drop_stormCultist_uk_burzy","Łuk burzy","mistLongbow",30,"rare",["hunter", "ranger"]);
registerCuratedMaterial("mat_kosc_nieumarego","Kość nieumarłego","scrap");
registerCuratedMaterial("mat_py_grobowy","Pył grobowy","graveDust");
registerCuratedMaterial("mat_odamek_runiczny","Odłamek runiczny","scrap");
registerCuratedGear("drop_graveColossus_mot_kurhanu","Młot kurhanu","sentinelHammer",25,"rare",["knight", "berserker"]);
registerCuratedGear("drop_graveColossus_tarcza_koscianego_kolosa","Tarcza kościanego kolosa","cg_knight_28_offhand",25,"rare",["knight"]);
registerCuratedMaterial("rottenMeat","Zgniłe mięso","rawMeat");
registerCuratedGear("drop_zombie_napiersciennik_straznika","Napiersciennik straznika","cg_knight_12_ring",15,"rare",["knight"]);
registerCuratedMaterial("rope","Lina","scrap");
registerCuratedMaterial("farewellLetter","Skrawek listu pożegnalnego","roughCloth");
registerCuratedMaterial("paper","Stary papier","roughCloth");
registerCuratedGear("drop_mumia_naszyjnik_piramidy","Naszyjnik piramidy","cg_knight_28_amulet",25,"rare",["knight"]);
registerCuratedGear("drop_mumia_pierscien_mumii","Pierścień mumii","cg_knight_28_ring",25,"rare",["knight"]);
registerCuratedGear("drop_zniwiarzPol_kosa_zniwiarza","Kosa żniwiarza","stormHalberd",33,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("straw","Słoma","herb");
registerCuratedGear("drop_zniwiarzPol_lekkie_buty","Lekkie buty","cg_knight_28_boots",33,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_zniwiarzPol_pierscien_zbiorow","Pierścień zbiorów","cg_knight_28_ring",33,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_zniwiarzPol_naszyjnik_urodzaju","Naszyjnik urodzaju","cg_knight_28_amulet",33,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
if(!ITEMS["ammo_strzay_trucizny"])ITEMS["ammo_strzay_trucizny"]={id:"ammo_strzay_trucizny",name:"strzały trucizny",icon:'➶',visualId:'primitiveArrow',type:'ammo',rarity:'rare',value:4,maxStack:250};
registerCuratedRune("runeIce","Runa Lodu");
registerCuratedGear("drop_lichWarden_kostur_licza","Kostur licza","mistWand",35,"rare",["mage"]);
registerCuratedGear("drop_lichWarden_ksiega_wiecznego_czuwania","Księga wiecznego czuwania","cg_mage_28_offhand",35,"rare",["mage"]);
registerCuratedGear("drop_lichWarden_pierscien_nekromanty","Pierścień nekromanty","cg_knight_28_ring",35,"rare",["knight"]);
registerCuratedMaterial("mat_unikat_tarczy_i_vos_dla_maga","Unikat tarczy i vos dla maga","scrap");
registerCuratedGear("drop_strachNaWroble_kapelusz_maga","Kapelusz maga","cg_mage_28_helmet",23,"rare",["mage"]);
registerCuratedRune("runeLuck","Runa Szczęścia");
registerCuratedMaterial("fairyDust","Pył wróżki","graveDust");
registerCuratedMaterial("wishScrap","Skrawek życzenia","roughCloth");
registerCuratedMaterial("spellBook","Księga zaklęć","roughCloth");
registerCuratedGear("drop_poltergeist_kontur_telepatii","Kontur telepatii","ashWand",42,"rare",["mage"]);
registerCuratedMaterial("mat_spodnie_tropiciela","Spodnie tropiciela","scrap");
registerCuratedGear("drop_poludnica_nasyznik_poudnia","Nasyznik południa","cg_knight_28_amulet",36,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_poludnica_pierscien_kompasu","Pierscien kompasu","cg_knight_28_ring",36,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("ghostCoin","Moneta widmo","oldCoin");
registerCuratedMaterial("knowledgeBook","Księga wiedzy","roughCloth");
registerCuratedGear("drop_mistStag_zbroja_mgy","Zbroją mgły","cg_knight_28_armor",29,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mistStag_buty_mgy","Buty mgły","cg_knight_28_boots",29,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mistStag_rekawice_mgy","Rękawice mgły","cg_knight_28_gloves",29,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_zgnile_mieso","Zgnile mięso","rawMeat");
registerCuratedMaterial("telepathyBook","Księga telepatii","roughCloth");
registerCuratedGear("drop_ghost_tarcza_widmo","Tarcza widmo","cg_knight_45_offhand",42,"rare",["knight"]);
registerCuratedMaterial("forestBook","Księga lasu","roughCloth");
registerCuratedMaterial("mat_jakies_unikaty_dla_maga","Jakieś unikaty dla maga","scrap");
registerCuratedRune("runeWater","Runa Wody");
registerCuratedGear("drop_placzacaPanna_ostrze_fali","Ostrze fali","ashOathSword",44,"rare",["knight", "berserker"]);
registerCuratedGear("drop_placzacaPanna_mot_posejdona","Młot posejdona","ashSentinelHammer",44,"rare",["knight", "berserker"]);
registerCuratedMaterial("waterCoin","Moneta wody","oldCoin");
registerCuratedMaterial("dreamBook","Księga snów","roughCloth");
registerCuratedMaterial("mat_nszyjnik_nocy","Nszyjnik nocy","scrap");
registerCuratedMaterial("fireBook","Księga ognia","roughCloth");
registerCuratedGear("drop_iceWraith_tarcza_lodu","Tarcza lodu","cg_knight_45_offhand",42,"rare",["knight"]);
registerCuratedGear("drop_iceWraith_buty_lodu","Buty lodu","cg_knight_45_boots",42,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
if(!ITEMS["ammo_strzay_lodu"])ITEMS["ammo_strzay_lodu"]={id:"ammo_strzay_lodu",name:"strzały lodu",icon:'➶',visualId:'primitiveArrow',type:'ammo',rarity:'rare',value:4,maxStack:250};
registerCuratedGear("drop_iceWraith_kontur_lodu","Kontur lodu","ashWand",42,"rare",["mage"]);
registerCuratedMaterial("frostCoin","Moneta lodu","oldCoin");
registerCuratedGear("drop_widmowyJezdziec_miecz_widmo","Miecz widmo","ashOathSword",42,"rare",["knight", "berserker"]);
registerCuratedGear("drop_widmowyJezdziec_buty_widmo","Buty widmo","cg_knight_45_boots",42,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_spodnie_widmo","Spodnie widmo","scrap");
registerCuratedMaterial("mat_zioa_lasu","Zioła lasu","scrap");
registerCuratedMaterial("windBook","Księga wiatru","roughCloth");
registerCuratedGear("drop_wir_kaptur_wiarru","Kaptur wiarru","cg_knight_28_helmet",30,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedRune("runeWind","Runa Wiatru");
registerCuratedMaterial("windCoin","Moneta wiatru","oldCoin");
registerCuratedGear("drop_elemental_mot_tektoniczny","Młot tektoniczny","sentinelHammer",35,"rare",["knight", "berserker"]);
registerCuratedGear("drop_elemental_pierscien_granitu","Pierścień granitu","cg_knight_28_ring",35,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_rozdzka_zaru","Różdżka żaru","scrap");
registerCuratedGear("drop_plomyk_amulet_pomienia","Amulet płomienia","cg_knight_45_amulet",40,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_slagGolem_tarcza_zuzlowa","Tarcza żużlowa","cg_knight_28_offhand",35,"rare",["knight"]);
registerCuratedGear("drop_slagGolem_mot_kuzniczego_zaru","Młot kuźniczego żaru","sentinelHammer",35,"rare",["knight", "berserker"]);
registerCuratedGear("drop_zywiolakCienia_kostur_cienia","Kostur cienia","ashWand",40,"epic",["mage"]);
registerCuratedGear("drop_zywiolakCienia_pierscien_pustki","Pierścień pustki","cg_knight_45_ring",40,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_obsidianSentinel_ostrze_obsydianu","Ostrze obsydianu","ashOathSword",55,"epic",["knight"]);
registerCuratedGear("drop_obsidianSentinel_pancerz_obsydianowego_straznika","Pancerz obsydianowego strażnika","cg_knight_45_armor",55,"epic",["knight"]);
registerCuratedGear("drop_thunderGolem_rekawice_piorunow","Rękawice piorunów","cg_knight_45_gloves",40,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_thunderGolem_mot_gromu","Młot gromu","ashSentinelHammer",40,"epic",["knight", "berserker"]);
registerCuratedGear("drop_lodowyGolem_tarcza_szronu","Tarcza szronu","cg_knight_45_offhand",45,"epic",["knight"]);
registerCuratedGear("drop_lodowyGolem_kostur_wiecznej_zimy","Kostur wiecznej zimy","ashWand",45,"epic",["mage"]);
registerCuratedRune("runeLight","Runa Światła");
registerCuratedGear("drop_zywiolakSwiatla_amulet_swiata","Amulet światła","cg_knight_45_amulet",44,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_bero_swietliste","Berło świetliste","roughCloth");
registerCuratedMaterial("stormFeather","Pióro burzy","stormFeather");
registerCuratedGear("drop_tempestLord_wocznia_wadcy_nawanicy","Włócznia władcy nawałnicy","stormHalberd",50,"epic",["knight", "hunter"]);
registerCuratedMaterial("mat_korona_nawanicy","Korona nawałnicy","scrap");
registerCuratedGear("drop_marshHag_kostur_wiedzmy_moczaru","Kostur wiedźmy moczaru","ashWand",45,"epic",["mage"]);
registerCuratedGear("drop_marshHag_pierscien_bagien","Pierścień bagien","cg_knight_45_ring",45,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_latawiec_uk_ognistego_wiatru","Łuk ognistego wiatru","ashLongbow",50,"rare",["hunter", "ranger"]);
registerCuratedGear("drop_latawiec_amulet_zaru","Amulet żaru","cg_knight_45_amulet",50,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_trojzab_rozlewiska","Trójząb rozlewiska","wolfFang");
registerCuratedGear("drop_wodnik_paszcz_wodnika","Płaszcz wodnika","cg_knight_45_amulet",55,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_bies_topor_biesa","Topór biesa","ashReaver",52,"rare",["berserker", "knight"]);
registerCuratedGear("drop_bies_amulet_boru","Amulet boru","cg_knight_45_amulet",52,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_diabel_miecz_popielnego_diaba","Miecz popielnego diabła","ashOathSword",55,"rare",["knight", "berserker"]);
registerCuratedGear("drop_diabel_kaptur_popiou","Kaptur popiołu","cg_knight_45_helmet",55,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_voidHound_naszyjnik_ka_pustki","Naszyjnik kła pustki","cg_knight_45_amulet",55,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_voidHound_buty_pustki","Buty pustki","cg_knight_45_boots",55,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_cinderMatriarch_szata_matki_zaru","Szata matki żaru","cg_knight_70_amulet",60,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_cinderMatriarch_pierscien_matki_zaru","Pierścień matki żaru","cg_knight_70_ring",60,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_demon_rogate_ostrze","Rogate ostrze","ashOathSword",66,"heroic",["knight", "berserker"]);
registerCuratedGear("drop_demon_pancerz_rogatego_demona","Pancerz rogatego demona","cg_knight_70_armor",66,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_demon_amulet_otchani","Amulet otchłani","cg_knight_70_amulet",66,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_hellhound_buty_piekielnego_ogara","Buty piekielnego ogara","cg_knight_70_boots",66,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_hellhound_naszyjnik_piekielnych_kow","Naszyjnik piekielnych kłów","cg_knight_70_amulet",66,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_kie_hydry","Kieł hydry","wolfFang");
registerCuratedGear("drop_abyssHydra_pancerz_hydry_otchani","Pancerz hydry otchłani","cg_knight_70_armor",66,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_abyssHydra_pierscien_trzech_gow","Pierścień trzech głów","cg_knight_70_ring",66,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("bloodBottle","Butelka krwi","scrap");
registerCuratedMaterial("batWing","Skrzydło krwiopijcy","stormFeather");
registerCuratedGear("drop_stormDrake_miecz_smoczego_wadcy","Miecz smoczego władcy","ashOathSword",70,"rare",["knight", "berserker"]);
registerCuratedGear("drop_stormDrake_kaptur_smoczego_zwiadowcy","Kaptur smoczego zwiadowcy","cg_knight_70_helmet",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_stormDrake_kostur_mroku","Kostur mroku","stormScepter",70,"rare",["mage"]);
registerCuratedGear("drop_stormDrake_buty_smoczego_jezdzca","Buty smoczego jeźdźca","cg_knight_70_boots",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_stormDrake_pierscien_smoczego_rodu","Pierścień smoczego rodu","cg_knight_70_ring",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_rys_czapka_owcy","Czapka łowcy","cg_hunter_12_helmet",12,"epic",["hunter"]);
registerCuratedMaterial("mat_spodnie_pregowanego_tropiciela","Spodnie pręgowanego tropiciela","scrap");
registerCuratedGear("drop_harpia_wocznia_lotu","Włócznia lotu","stormHalberd",45,"rare",["knight", "hunter"]);
registerCuratedGear("drop_harpia_zbroja_husarii","Zbroja husarii","cg_knight_45_armor",45,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_harpia_rekawice_szelestu","Rękawice szelestu","cg_knight_45_gloves",45,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_niedzwiedz_naszyjnik_niedzwiedziej_sily","Naszyjnik niedźwiedziej sily","cg_knight_28_amulet",30,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_niedzwiedz_tarcza_niedzwiedziej_siy","Tarcza niedźwiedziej siły","cg_knight_28_offhand",30,"epic",["knight"]);
registerCuratedGear("drop_wilkolak_hem_nocy","Hełm nocy","cg_knight_70_helmet",60,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_wilkolak_zbroja_ksiezyca","Zbroja księżyca","cg_knight_70_armor",60,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_wilkolak_uk_nocnego_wilka","Łuk nocnego wilka","stormLongbow",60,"heroic",["hunter", "ranger"]);
registerCuratedGear("drop_wilkolak_pierscien_zrecznosci","Pierścień zręczności","cg_knight_70_ring",60,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_wilkolak_naszyjnik_peni","Naszyjnik pełni","cg_knight_70_amulet",60,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_fenStalker_sztylet_tropicela","Sztylet tropicela","shortBlade",53,"rare",["ranger"]);
registerCuratedMaterial("fin","Płetwa","scrap");
registerCuratedMaterial("tentacle","Macka","scrap");
registerCuratedGear("drop_mlodyKraken_rekawice_wody","Rękawice wody","cg_knight_70_gloves",70,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mlodyKraken_zbroja_wodnego_krakena","Zbroja wodnego krakena","cg_knight_70_armor",70,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mlodyKraken_kostur_wody","Kostur wody","stormScepter",70,"heroic",["mage"]);
registerCuratedMaterial("mat_dopisz_jeszcze_kilka","Dopisz jeszcze kilka","scrap");
registerCuratedGear("drop_mireMother_kaptur_matki_mgy","Kaptur matki mgły","cg_knight_70_helmet",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mireMother_pancerz_matki_mgy","Pancerz matki mgły","cg_knight_70_armor",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mireMother_pierscien_mgy","Pierścień mgły","cg_knight_70_ring",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_ashScavenger_ostrze_padlinozercy","Ostrze padlinożercy","ashOathSword",65,"rare",["knight", "berserker"]);
registerCuratedGear("drop_ashScavenger_amulet_popiou","Amulet popiołu","cg_knight_70_amulet",65,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_ashDrake_wocznia_popielnego_draka","Włócznia popielnego draka","stormHalberd",67,"rare",["knight", "hunter"]);
registerCuratedGear("drop_ashDrake_pancerz_draka","Pancerz draka","cg_knight_70_armor",67,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_frostRaptor_buty_raptora","Buty raptora","cg_knight_70_boots",77,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_frostRaptor_rekawice_mrozu","Rękawice mrozu","cg_knight_70_gloves",77,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_frostRaptor_ostrze_lodowego_szponu","Ostrze lodowego szponu","ashOathSword",77,"epic",["knight", "berserker"]);
registerCuratedMaterial("mat_rog_gromu","Róg gromu","wolfFang");
registerCuratedGear("drop_kozica_amulet_gromowej_kozicy","Amulet gromowej kozicy","cg_knight_45_amulet",40,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_mountainTroll_mot_skalnego_trolla","Młot skalnego trolla","ashSentinelHammer",78,"epic",["knight", "berserker"]);
registerCuratedGear("drop_mountainTroll_amulet_trolla","Amulet trolla","cg_knight_70_amulet",78,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_skySerpent_wocznia_niebios","Włócznia niebios","stormHalberd",80,"legendary",["knight", "hunter"]);
registerCuratedGear("drop_skySerpent_pierscien_niebios","Pierścień niebios","cg_knight_70_ring",80,"legendary",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_skySerpent_zbroja_niebios","Zbroja niebios","cg_knight_70_armor",80,"legendary",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_oko_bazyliszka","Oko bazyliszka","scrap");
registerCuratedMaterial("mat_uska_bazyliszka","Łuska bazyliszka","wyvernScale");
registerCuratedGear("drop_bazyliszek_tarcza_bazyliszka","Tarcza bazyliszka","cg_knight_70_offhand",70,"rare",["knight"]);
registerCuratedGear("drop_bazyliszek_ostrze_bazyliszka","Ostrze bazyliszka","ashOathSword",70,"rare",["knight", "berserker"]);
registerCuratedGear("drop_bazyliszek_pierscien_skamienienia","Pierścień skamienienia","cg_knight_70_ring",70,"rare",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("mat_pioro_gryfa","Pióro gryfa","stormFeather");
registerCuratedGear("drop_gryf_uk_gryfa","Łuk gryfa","stormLongbow",80,"heroic",["hunter", "ranger"]);
registerCuratedGear("drop_gryf_pancerz_skalnego_gniazda","Pancerz skalnego gniazda","cg_knight_70_armor",80,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_gryf_amulet_gryfa","Amulet gryfa","cg_knight_70_amulet",80,"heroic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_stormGriffin_uk_gromu","Łuk gromu","stormLongbow",90,"legendary",["hunter", "ranger"]);
registerCuratedMaterial("mat_korona_gryfa_nawanicy","Korona gryfa nawałnicy","scrap");
registerCuratedGear("drop_stormGriffin_pierscien_burzy","Pierścień burzy","cg_knight_70_ring",90,"legendary",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedGear("drop_wyvern_wocznia_wywerny","Włócznia wywerny","stormHalberd",80,"epic",["knight", "hunter"]);
registerCuratedGear("drop_wyvern_pancerz_wywerny","Pancerz wywerny","cg_knight_70_armor",80,"epic",["knight", "mage", "hunter", "berserker", "ranger"]);
registerCuratedMaterial("stormHorn","Róg Gromu","wolfFang");
registerCuratedMaterial("basiliskEye","Oko Bazyliszka","scrap");
registerCuratedMaterial("basiliskScale","Łuska Bazyliszka","wyvernScale");
registerCuratedMaterial("gryphonFeather","Pióro Gryfa","stormFeather");

// 3.9.8.8 — materiały endgame, bronie 80/90/100 oraz bossowe unikaty.
registerEndgameMaterial('gryphonSeal','Pieczęć Gryfa','stormFeather','heroic',120);
registerEndgameMaterial('stormSigil','Pieczęć Nawałnicy','stormCore','heroic',145);
registerEndgameMaterial('eternalCore','Rdzeń Wieczności','crystal','legendary',260);
registerEndgameMaterial('krakenPearl','Perła Głębin','wraithEssence','heroic',125);
registerEndgameMaterial('basiliskHeart','Serce Bazyliszka','venomGland','heroic',135);

const ENDGAME_WEAPONS=[
 ['end_knight_80','Miecz Bastionu Niebios','stormOathBlade',80,'knight',{blockBonus:.10,staggerBonus:12,label:'+10% blok • +12 przełamania'},'obrona / przełamanie'],
 ['end_knight_90','Ostrze Władcy Nawałnicy','stormOathBlade',90,'knight',{approachDamage:.16,blockBonus:.08,label:'+16% po podejściu • +8% blok'},'kontratak / podejście'],
 ['end_knight_100','Miecz Wiecznego Strażnika','stormOathBlade',100,'knight',{blockBonus:.14,closeGuard:.10,label:'+14% blok • -10% obrażeń na BLISKO'},'bastion'],
 ['end_berserker_80','Topór Krwawego Gryfa','stormGreatAxe',80,'berserker',{lowHpDamage:.18,critDamage:.14,label:'+18% poniżej 50% HP • +14% kryt'},'furia / krytyk'],
 ['end_berserker_90','Rozpruwacz Nawałnicy','stormGreatAxe',90,'berserker',{bleedAmp:.28,closeDamage:.12,label:'+28% krwawienia • +12% BLISKO'},'krwawienie'],
 ['end_berserker_100','Ostrze Ostatniej Furii','stormGreatAxe',100,'berserker',{lowHpDamage:.25,critDamage:.20,label:'+25% poniżej 50% HP • +20% kryt'},'ostatnia furia'],
 ['end_mage_80','Kostur Niebiańskiego Węża','stormScepter',80,'mage',{farMana:6,farDamage:.12,label:'-6 many • +12% DALEKO'},'mana / dystans'],
 ['end_mage_90','Berło Serca Nawałnicy','stormScepter',90,'mage',{statusDamage:.18,critDamage:.15,label:'+18% na cele z efektem • +15% kryt'},'status / krytyk'],
 ['end_mage_100','Kostur Eteru','stormScepter',100,'mage',{farMana:8,farDamage:.18,label:'-8 many • +18% DALEKO'},'eter / dystans'],
 ['end_hunter_80','Łuk Skrzydła Gryfa','stormLongbow',80,'hunter',{farDamage:.20,critDamage:.14,label:'+20% DALEKO • +14% kryt'},'dystans / krytyk'],
 ['end_hunter_90','Łuk Gromowej Korony','stormLongbow',90,'hunter',{markDamage:.20,staggerBonus:12,label:'+20% oznaczony cel • +12 przełamania'},'znak / przełamanie'],
 ['end_hunter_100','Łuk Horyzontu','stormLongbow',100,'hunter',{farDamage:.26,petDamage:.20,label:'+26% DALEKO • +20% chowaniec'},'snajper / chowaniec'],
 ['end_ranger_80','Łuk Jadowitego Bazyliszka','stormSerpentBow',80,'ranger',{poisonAmp:.65,dodgeBonus:4,label:'+65% trucizny • +4% uniku'},'trucizna'],
 ['end_ranger_90','Łuk Cienia Nawałnicy','tempestTrackerBow',90,'ranger',{statusDamage:.22,dodgeBonus:5,label:'+22% na cele z efektem • +5% uniku'},'status / unik'],
 ['end_ranger_100','Łuk Pradawnego Śladu','stormSerpentBow',100,'ranger',{poisonAmp:.80,petDamage:.24,label:'+80% trucizny • +24% chowaniec'},'trucizna / chowaniec']
];
for(const [id,name,src,lvl,cls,perk,build] of ENDGAME_WEAPONS)registerBossUniqueGear(id,name,src,lvl,'legendary',[cls],'Endgame',perk,build);

// Unikaty głównych Herosów i Legend.
registerBossUniqueGear('boss_leszy_crown','Korona Starego Boru','cg_ranger_28_helmet',28,'heroic',['hunter','ranger'],'Leszy Starego Boru',{dodgeBonus:4,statusDamage:.08,label:'+4% uniku • +8% na cele z efektem'},'leśny cień');
registerBossUniqueGear('boss_leszy_cloak','Płaszcz Leśnego Cienia','cg_ranger_28_armor',28,'heroic',['hunter','ranger'],'Leszy Starego Boru',{poisonAmp:.18,petDamage:.10,label:'+18% trucizny • +10% chowaniec'},'tropiciel / chowaniec');
registerBossUniqueGear('boss_leszy_amulet','Amulet Szeptu Kniei','cg_ranger_28_amulet',28,'heroic',['hunter','ranger'],'Leszy Starego Boru',{statusDamage:.10,label:'+10% na cele z efektem'},'status');
registerBossUniqueGear('boss_leszy_quiver','Kołczan Leszego','cg_hunter_28_offhand',28,'heroic',['hunter'],'Leszy Starego Boru',{farDamage:.10,markDamage:.08,label:'+10% DALEKO • +8% oznaczony cel'},'dystans');

registerBossUniqueGear('boss_unicorn_staff','Kostur Świetlistej Grani','stormScepter',30,'heroic',['mage'],'Jednorożec Świetlistej Grani',{farMana:3,statusDamage:.10,label:'-3 many • +10% na cele z efektem'},'światło / mana');
registerBossUniqueGear('boss_unicorn_circlet','Diadem Jednorożca','cg_mage_28_helmet',30,'heroic',['mage'],'Jednorożec Świetlistej Grani',{critDamage:.12,label:'+12% obrażeń krytycznych'},'magia światła');
registerBossUniqueGear('boss_unicorn_robe','Szata Białej Many','cg_mage_28_armor',30,'heroic',['mage'],'Jednorożec Świetlistej Grani',{farDamage:.10,label:'+10% obrażeń na DALEKO'},'mana / dystans');
registerBossUniqueGear('boss_unicorn_ring','Pierścień Rogu','cg_mage_28_ring',30,'heroic',['mage','knight','hunter','berserker','ranger'],'Jednorożec Świetlistej Grani',{critDamage:.08,label:'+8% obrażeń krytycznych'},'uniwersalny krytyk');

registerBossUniqueGear('boss_kosciej_bow','Łuk Kościejowego Mrozu','mistLongbow',36,'heroic',['hunter','ranger'],'Kościej Nieśmiertelny',{statusDamage:.12,farDamage:.08,label:'+12% na cele z efektem • +8% DALEKO'},'mróz / dystans');
registerBossUniqueGear('boss_kosciej_shield','Tarcza Nieśmiertelnego','cg_knight_45_offhand',36,'heroic',['knight'],'Kościej Nieśmiertelny',{blockBonus:.10,closeGuard:.06,label:'+10% blok • -6% BLISKO'},'obrona');
registerBossUniqueGear('boss_kosciej_focus','Fokus Zimnej Kości','cg_mage_45_offhand',36,'heroic',['mage'],'Kościej Nieśmiertelny',{farMana:3,statusDamage:.10,label:'-3 many • +10% na cele z efektem'},'mróz / mana');
registerBossUniqueGear('boss_kosciej_ring','Pierścień Bezśmierci','cg_ranger_45_ring',36,'heroic',['hunter','ranger','mage'],'Kościej Nieśmiertelny',{dodgeBonus:4,label:'+4% uniku'},'unik');

registerBossUniqueGear('boss_wolf_claws','Szpony Pełni','stormGreatAxe',60,'heroic',['berserker'],'Wilkołak Północy',{lowHpDamage:.16,bleedAmp:.22,label:'+16% poniżej 50% HP • +22% krwawienia'},'krwawienie / furia');
registerBossUniqueGear('boss_wolf_quiver','Kołczan Księżycowego Łowcy','cg_hunter_70_offhand',60,'heroic',['hunter'],'Wilkołak Północy',{markDamage:.15,critDamage:.10,label:'+15% oznaczony cel • +10% kryt'},'nocny łowca');

registerBossUniqueGear('boss_kraken_staff','Kostur Głębin','stormScepter',70,'heroic',['mage'],'Młody Kraken',{statusDamage:.16,farMana:4,label:'+16% na cele z efektem • -4 many'},'woda / kontrola');
registerBossUniqueGear('boss_kraken_shield','Tarcza Macki','cg_knight_70_offhand',70,'heroic',['knight'],'Młody Kraken',{blockBonus:.12,closeGuard:.08,label:'+12% blok • -8% BLISKO'},'wytrzymałość');
registerBossUniqueGear('boss_kraken_bow','Łuk Sztormowych Głębin','stormLongbow',70,'heroic',['hunter','ranger'],'Młody Kraken',{farDamage:.16,statusDamage:.10,label:'+16% DALEKO • +10% na cele z efektem'},'dystans / woda');
registerBossUniqueGear('boss_kraken_amulet','Amulet Głębin','cg_mage_70_amulet',70,'heroic',['mage','hunter','ranger','knight','berserker'],'Młody Kraken',{statusDamage:.10,label:'+10% na cele z efektem'},'kontrola');

registerBossUniqueGear('boss_drake_knight','Miecz Smoczego Władcy','stormOathBlade',70,'legendary',['knight'],'Smok Burzowy',{blockBonus:.10,approachDamage:.14,label:'+10% blok • +14% po podejściu'},'smoczy bastion');
registerBossUniqueGear('boss_drake_berserker','Topór Smoczej Furii','stormGreatAxe',70,'legendary',['berserker'],'Smok Burzowy',{lowHpDamage:.18,critDamage:.14,label:'+18% poniżej 50% HP • +14% kryt'},'smocza furia');
registerBossUniqueGear('boss_drake_mage','Kostur Burzowego Serca','stormScepter',70,'legendary',['mage'],'Smok Burzowy',{farMana:5,farDamage:.12,label:'-5 many • +12% DALEKO'},'burza / mana');
registerBossUniqueGear('boss_drake_hunter','Łuk Smoczego Zwiadowcy','stormLongbow',70,'legendary',['hunter'],'Smok Burzowy',{farDamage:.18,critDamage:.12,label:'+18% DALEKO • +12% kryt'},'smoczy zwiad');
registerBossUniqueGear('boss_drake_ranger','Łuk Smoczego Jadu','stormSerpentBow',70,'legendary',['ranger'],'Smok Burzowy',{poisonAmp:.58,statusDamage:.12,label:'+58% trucizny • +12% na cele z efektem'},'jad / status');

registerBossUniqueGear('boss_basilisk_blade','Ostrze Skamienienia','ashOathSword',70,'legendary',['knight','berserker'],'Bazyliszek',{statusDamage:.16,staggerBonus:12,label:'+16% na cele z efektem • +12 przełamania'},'skamienienie');
registerBossUniqueGear('boss_basilisk_shield','Tarcza Kamiennego Wzroku','cg_knight_70_offhand',70,'legendary',['knight'],'Bazyliszek',{blockBonus:.13,closeGuard:.08,label:'+13% blok • -8% BLISKO'},'kamienna obrona');
registerBossUniqueGear('boss_basilisk_staff','Kostur Jadowitego Oka','stormScepter',70,'legendary',['mage'],'Bazyliszek',{statusDamage:.18,critDamage:.10,label:'+18% na cele z efektem • +10% kryt'},'jad / magia');
registerBossUniqueGear('boss_basilisk_bow','Łuk Bazyliszkowego Jadu','stormSerpentBow',70,'legendary',['hunter','ranger'],'Bazyliszek',{poisonAmp:.62,dodgeBonus:3,label:'+62% trucizny • +3% uniku'},'trucizna');
registerBossUniqueGear('boss_basilisk_ring','Pierścień Skamienienia','cg_ranger_70_ring',70,'legendary',['knight','mage','hunter','berserker','ranger'],'Bazyliszek',{statusDamage:.12,label:'+12% na cele z efektem'},'status');

registerBossUniqueGear('boss_serpent_spear','Włócznia Niebios','stormHalberd',80,'legendary',['knight'],'Wąż Niebios',{staggerBonus:14,approachDamage:.14,label:'+14 przełamania • +14% po podejściu'},'przełamanie');
registerBossUniqueGear('boss_serpent_staff','Kostur Niebiańskiej Iskry','stormScepter',80,'legendary',['mage'],'Wąż Niebios',{farMana:6,critDamage:.14,label:'-6 many • +14% kryt'},'burza / mana');
registerBossUniqueGear('boss_serpent_bow','Łuk Węża Niebios','stormLongbow',80,'legendary',['hunter'],'Wąż Niebios',{farDamage:.20,markDamage:.14,label:'+20% DALEKO • +14% oznaczony cel'},'dystans / znak');
registerBossUniqueGear('boss_serpent_venom','Łuk Jadowitego Nieba','stormSerpentBow',80,'legendary',['ranger'],'Wąż Niebios',{poisonAmp:.68,statusDamage:.14,label:'+68% trucizny • +14% na cele z efektem'},'trucizna / status');
registerBossUniqueGear('boss_serpent_axe','Topór Piorunowego Splotu','stormGreatAxe',80,'legendary',['berserker'],'Wąż Niebios',{critDamage:.16,lowHpDamage:.18,label:'+16% kryt • +18% poniżej 50% HP'},'krytyk / furia');

registerBossUniqueGear('boss_griffin90_knight','Ostrze Korony Nawałnicy','stormOathBlade',90,'legendary',['knight'],'Gryf Nawałnicy',{blockBonus:.12,staggerBonus:15,label:'+12% blok • +15 przełamania'},'bastion burzy');
registerBossUniqueGear('boss_griffin90_berserker','Szpon Nawałnicy','stormGreatAxe',90,'legendary',['berserker'],'Gryf Nawałnicy',{critDamage:.18,bleedAmp:.28,label:'+18% kryt • +28% krwawienia'},'szpon / krwawienie');
registerBossUniqueGear('boss_griffin90_mage','Berło Korony Gromu','stormScepter',90,'legendary',['mage'],'Gryf Nawałnicy',{farMana:7,farDamage:.16,label:'-7 many • +16% DALEKO'},'grom / mana');
registerBossUniqueGear('boss_griffin90_hunter','Łuk Gromowej Korony','stormLongbow',90,'legendary',['hunter'],'Gryf Nawałnicy',{farDamage:.22,critDamage:.16,label:'+22% DALEKO • +16% kryt'},'snajper burzy');
registerBossUniqueGear('boss_griffin90_ranger','Łuk Cienia Nawałnicy','tempestTrackerBow',90,'legendary',['ranger'],'Gryf Nawałnicy',{statusDamage:.20,dodgeBonus:5,label:'+20% na cele z efektem • +5% uniku'},'cień / unik');

// Endgame 80/90/100 rejestruje dawne receptury, ale 3.9.9.1 usuwa wszystkie receptury na Unikaty/Heroiki/Legendy z katalogu kowala.
for(const cls of ['knight','berserker','mage','hunter','ranger']){
 for(const lvl of [80,90,100]){
  for(const d of Object.values(ITEMS).filter(x=>x.classGear&&x.setClass===cls&&x.setLevel===lvl)){
   const ing=lvl===80?{skySteel:4,stormFeather:3,gryphonSeal:1}:lvl===90?{skySteel:5,stormFeather:5,stormSigil:2,gryphonSeal:2}:{skySteel:7,stormSigil:4,eternalCore:1,crystal:5};
   registerEndgameRecipe(`forge_${d.id}`,d.id,ing);
  }
 }
}
for(const [id,,,,cls] of ENDGAME_WEAPONS){const lvl=ITEMS[id].reqLevel;const ing=lvl===80?{skySteel:5,stormFeather:3,gryphonSeal:1}:lvl===90?{skySteel:7,stormSigil:2,gryphonSeal:2}:{skySteel:9,stormSigil:4,eternalCore:2};registerEndgameRecipe(`forge_${id}`,id,ing)}

// 3.9.8.9 — brakujące nazwane unikaty z tabeli dropów użytkownika.
registerCuratedGear('drop_rusalka_diadem_topieli','Diadem Rusałki Topieli','cg_mage_45_helmet',41,'epic',['mage']);
ITEMS.drop_rusalka_diadem_topieli.perk={statusDamage:.10,label:'+10% obrażeń na cele z efektem'};
registerCuratedGear('drop_rusalka_fokus_zielonej_fali','Fokus Zielonej Fali','cg_mage_45_offhand',41,'epic',['mage']);
ITEMS.drop_rusalka_fokus_zielonej_fali.perk={farMana:3,statusDamage:.08,label:'-3 many • +8% na cele z efektem'};
registerCuratedGear('drop_rusalka_pierscien_glebiny','Pierścień Głębin','cg_mage_45_ring',41,'epic',['mage']);
ITEMS.drop_rusalka_pierscien_glebiny.perk={critDamage:.10,label:'+10% obrażeń krytycznych'};

// 3.9.8.9 — każda runa ma własny efekt, przeznaczenie i recepturę.
const RUNE_SYSTEM={
 runePower:{runeKey:'power',runeValue:4,label:'+4 mocy',allowedSlots:['weapon','offhand','amulet','ring'],value:95,ingredients:{runeShard:2,crystal:1}},
 runeGuard:{runeKey:'armor',runeValue:4,label:'+4 pancerza',allowedSlots:['helmet','armor','gloves','boots','offhand'],value:95,ingredients:{runeShard:2,scrap:2}},
 runePrecision:{runeKey:'crit',runeValue:4,label:'+4% krytyka',allowedSlots:['weapon','offhand','amulet','ring'],value:105,ingredients:{runeShard:2,moonHerb:1}},
 runePoison:{runeKey:'power',runeValue:1,perk:{poisonAmp:.25},label:'+1 mocy • +25% trucizny',allowedSlots:['weapon','offhand','ring'],value:125,ingredients:{runeShard:3,venomGland:2,crystal:1}},
 runeLeaf:{runeKey:'armor',runeValue:1,perk:{petDamage:.12,dodgeBonus:2},label:'+1 pancerza • +12% chowaniec • +2% unik',allowedSlots:['offhand','amulet','ring','boots'],value:125,ingredients:{runeShard:3,herb:3,moonHerb:1}},
 runeFire:{runeKey:'power',runeValue:2,perk:{critDamage:.08},label:'+2 mocy • +8% obrażeń krytycznych',allowedSlots:['weapon','offhand','amulet'],value:135,ingredients:{runeShard:3,emberCore:1,crystal:1}},
 runeShadow:{runeKey:'power',runeValue:1,perk:{statusDamage:.10},label:'+1 mocy • +10% na cele z efektem',allowedSlots:['weapon','amulet','ring'],value:135,ingredients:{runeShard:3,shadowEssence:2,crystal:1}},
 runeLightning:{runeKey:'crit',runeValue:1,perk:{staggerBonus:6},label:'+1% krytyka • +6 przełamania',allowedSlots:['weapon','offhand'],value:140,ingredients:{runeShard:3,stormCore:1,crystal:1}},
 runeIce:{runeKey:'armor',runeValue:2,perk:{closeGuard:.05},label:'+2 pancerza • -5% obrażeń na BLISKO',allowedSlots:['helmet','armor','boots','offhand'],value:135,ingredients:{runeShard:3,frostCrystal:1,crystal:1}},
 runeLuck:{runeKey:'lck',runeValue:5,label:'+5 Szczęścia',allowedSlots:['amulet','ring'],value:120,ingredients:{runeShard:3,oldCoin:5,crystal:1}},
 runeWater:{runeKey:'power',runeValue:1,perk:{farMana:2},label:'+1 mocy • -2 many dla umiejętności dystansowych',allowedSlots:['weapon','offhand','amulet'],value:130,ingredients:{runeShard:3,bogAmber:1,crystal:1}},
 runeWind:{runeKey:'crit',runeValue:1,perk:{dodgeBonus:3},label:'+1% krytyka • +3% uniku',allowedSlots:['helmet','gloves','boots','amulet'],value:130,ingredients:{runeShard:3,stormFeather:1,moonHerb:1}},
 runeLight:{runeKey:'armor',runeValue:2,perk:{blockBonus:4},label:'+2 pancerza • +4% bloku',allowedSlots:['helmet','armor','offhand','amulet'],value:140,ingredients:{runeShard:3,wraithEssence:1,crystal:2}}
};
for(const [id,cfg] of Object.entries(RUNE_SYSTEM)){
 if(!ITEMS[id])ITEMS[id]={id,name:`Runa ${id.replace(/^rune/,'')}`,icon:'◆',visualId:'runePower',type:'rune',rarity:'rare',maxStack:99};
 Object.assign(ITEMS[id],{...cfg,type:'rune',rarity:'rare',maxStack:99});
 if(!RECIPES.some(r=>r.id===id))RECIPES.push({id,station:'smith',name:ITEMS[id].name,result:id,qty:1,ingredients:{...cfg.ingredients}});
}
const ALL_RUNE_IDS=Object.keys(RUNE_SYSTEM);
function randomRuneId(){return pick(ALL_RUNE_IDS)}
function runeFitsItem(runeId,item){const r=itemDef(runeId),d=item?.id?itemDef(item.id):item;return !!d?.slot&&(!r.allowedSlots||r.allowedSlots.includes(d.slot))}
function runeEffectText(runeId){const r=itemDef(runeId);return r.label||`${r.runeKey||'bonus'} +${r.runeValue||0}`}

// 3.9.9.0 — pełny crafting: surowce z potworów -> półprodukty -> sprzęt / mikstury.
function registerCraftMaterial(id,name,rarity='uncommon',value=28,visualId='scrap'){
 if(!ITEMS[id])ITEMS[id]={id,name,icon:'◆',visualId,type:'material',rarity,value,maxStack:99};
 else Object.assign(ITEMS[id],{name,type:'material',rarity,value,maxStack:99,visualId:ITEMS[id].visualId||visualId});
}
registerCraftMaterial('curedLeather','Wyprawiona skóra','uncommon',26,'wolfPelt');
registerCraftMaterial('bonePlate','Płytka kostna','uncommon',30,'bone');
registerCraftMaterial('spiritDust','Pył duchowy','rare',42,'ectoplasm');
registerCraftMaterial('toxinConcentrate','Koncentrat jadu','rare',46,'venomGland');
registerCraftMaterial('demonAlloy','Stop demoniczny','rare',58,'charredIron');
registerCraftMaterial('frostAlloy','Stop mrozu','rare',58,'frostCrystal');
registerCraftMaterial('stormAlloy','Stop burzy','epic',82,'stormCore');
registerCraftMaterial('abyssThread','Nić otchłani','epic',78,'mireSilk');
registerCraftMaterial('runicComposite','Kompozyt runiczny','epic',86,'runeShard');
registerCraftMaterial('herbalExtract','Ekstrakt zielarski','uncommon',24,'herb');
registerCraftMaterial('arcaneResin','Żywica arkanum','rare',48,'blackroot');

function registerCraftGear(id,name,sourceId,reqLevel,rarity,classes,perk,build){
 registerCuratedGear(id,name,sourceId,reqLevel,rarity,classes);
 const d=ITEMS[id];if(!d)return;
 d.craftOnly=true;d.perk={...(perk||{}),label:perk?.label||'Rzemiosło'};d.build=build||'przedmiot rzemieślniczy';
 d.value=Math.max(d.value||1,Math.round((d.value||1)*1.12));
}
// lvl 25 — pierwsze sensowne craftowane buildy.
registerCraftGear('craft_boneguard_shield','Puklerz Kościanej Straży','ironShield',25,'rare',['knight'],{blockBonus:5,closeGuard:.04,label:'+5% blok • -4% obrażeń na BLISKO'},'blok / obrona');
registerCraftGear('craft_fangcleaver','Tasak Kłów','ravenAxe',25,'rare',['berserker'],{critDamage:.07,lowHpDamage:.08,label:'+7% kryt • +8% poniżej 50% HP'},'krytyk / furia');
registerCraftGear('craft_spiritstaff','Kostur Duchowego Pyłu','mistStaff',25,'rare',['mage'],{farMana:2,statusDamage:.06,label:'-2 many • +6% na cele z efektem'},'mana / status');
registerCraftGear('craft_stalkerbow','Łuk Skórnika','wildBow',25,'rare',['hunter'],{farDamage:.08,critDamage:.05,label:'+8% DALEKO • +5% kryt'},'dystans / krytyk');
registerCraftGear('craft_venombow','Łuk Jadowego Szlaku','venomBow',25,'rare',['ranger'],{poisonAmp:.22,dodgeBonus:1,label:'+22% trucizny • +1% unik'},'trucizna / unik');
// lvl 55 — materiały żywiołów, demonów i zjaw.
registerCraftGear('craft_demonward','Ostrze Pogromcy Demonów','ashOathSword',55,'rare',['knight'],{blockBonus:7,statusDamage:.09,label:'+7% blok • +9% na cele z efektem'},'obrona / status');
registerCraftGear('craft_hellreaver','Rozpruwacz Piekielnych Kłów','ashReaver',55,'rare',['berserker'],{bleedAmp:.22,lowHpDamage:.14,label:'+22% krwawienia • +14% poniżej 50% HP'},'krwawienie / furia');
registerCraftGear('craft_frostcore_staff','Kostur Lodowego Rdzenia','frostStaff',55,'rare',['mage'],{farMana:4,staggerBonus:8,label:'-4 many • +8 przełamania'},'mana / lód');
registerCraftGear('craft_stormhunt_bow','Łuk Łowcy Burz','stormLongbow',55,'rare',['hunter'],{farDamage:.14,markDamage:.10,label:'+14% DALEKO • +10% oznaczony cel'},'dystans / znak');
registerCraftGear('craft_abyss_bow','Łuk Splotu Otchłani','shadowBow',55,'rare',['ranger'],{statusDamage:.12,poisonAmp:.35,label:'+12% na cele z efektem • +35% trucizny'},'status / trucizna');
// lvl 75 — rzemiosło heroiczne, krok przed legendarnym endgame.
registerCraftGear('craft_skywall','Tarcza Podniebnego Bastionu','cg_knight_70_offhand',75,'rare',['knight'],{blockBonus:10,staggerBonus:12,label:'+10% blok • +12 przełamania'},'bastion / przełamanie');
registerCraftGear('craft_titanreaver','Rozpruwacz Tytanów','stormGreatAxe',75,'rare',['berserker'],{critDamage:.14,bleedAmp:.25,label:'+14% kryt • +25% krwawienia'},'krytyk / krwawienie');
registerCraftGear('craft_arcane_scepter','Berło Runicznego Splotu','stormScepter',75,'rare',['mage'],{farMana:5,critDamage:.12,label:'-5 many • +12% kryt'},'mana / krytyk');
registerCraftGear('craft_gryphon_bow','Łuk Gryfiego Rzemiosła','skyPiercer',75,'rare',['hunter'],{farDamage:.18,petDamage:.14,label:'+18% DALEKO • +14% chowaniec'},'dystans / chowaniec');
registerCraftGear('craft_serpentfang_bow','Łuk Kła Niebios','stormSerpentBow',75,'rare',['ranger'],{poisonAmp:.52,dodgeBonus:3,label:'+52% trucizny • +3% unik'},'trucizna / unik');

const CRAFTING_EXPANSION_RECIPES=[
 // Przetwarzanie surowców — dzięki temu zwykły loot ma stałe zastosowanie.
 {id:'proc_curedLeather',station:'smith',category:'Przetwarzanie',name:'Wyprawiona skóra',result:'curedLeather',qty:1,ingredients:{hide:2,furBundle:2,roughCloth:1},note:'Skóry i futra ze zwierząt.'},
 {id:'proc_bonePlate',station:'smith',category:'Przetwarzanie',name:'Płytka kostna',result:'bonePlate',qty:1,ingredients:{bone:3,fang:2,scrap:2},note:'Kości, kły i złom.'},
 {id:'proc_demonAlloy',station:'smith',category:'Przetwarzanie',name:'Stop demoniczny',result:'demonAlloy',qty:1,ingredients:{charredIron:3,demonHorn:1,sulfur:2},note:'Surowce z demonów i pustkowi.'},
 {id:'proc_frostAlloy',station:'smith',category:'Przetwarzanie',name:'Stop mrozu',result:'frostAlloy',qty:1,ingredients:{scrap:3,frostCrystal:2,frostClaw:1},note:'Mroźne bestie i zjawy.'},
 {id:'proc_skySteel',station:'smith',category:'Przetwarzanie',name:'Stal niebios',result:'skySteel',qty:1,ingredients:{scrap:6,stormCore:1,stormFeather:2},note:'Materiały burzy.'},
 {id:'proc_stormAlloy',station:'smith',category:'Przetwarzanie',name:'Stop burzy',result:'stormAlloy',qty:1,ingredients:{skySteel:2,stormCore:1,stormFeather:2},note:'Zaawansowany stop endgame.'},
 {id:'proc_abyssThread',station:'smith',category:'Przetwarzanie',name:'Nić otchłani',result:'abyssThread',qty:1,ingredients:{mireSilk:2,shadowEssence:2,spiderSilk:2},note:'Mokradła, zjawy i cienie.'},
 {id:'proc_runicComposite',station:'smith',category:'Przetwarzanie',name:'Kompozyt runiczny',result:'runicComposite',qty:1,ingredients:{runeShard:3,crystal:2,ancientRelic:1},note:'Rzadki komponent do heroicznego craftingu.'},
 {id:'proc_runeShard',station:'smith',category:'Przetwarzanie',name:'Odłamki runiczne',result:'runeShard',qty:2,ingredients:{spiritDust:1,oldCoin:3},note:'Przetwarzanie energii zjaw.'},
 {id:'proc_crystal',station:'smith',category:'Przetwarzanie',name:'Szlifowane kryształy',result:'crystal',qty:2,ingredients:{stoneCore:2,bogAmber:1},note:'Kamień i bagienny bursztyn.'},
 {id:'proc_ashGlass',station:'smith',category:'Przetwarzanie',name:'Popielne szkło',result:'ashGlass',qty:1,ingredients:{charredIron:2,emberCore:1,crystal:1},note:'Pustkowia i ogniste bestie.'},
 {id:'proc_metalScrap',station:'smith',category:'Przetwarzanie',name:'Oczyszczony złom',result:'scrap',qty:2,ingredients:{mat_zom:2},note:'Przetopienie znalezionego żelastwa.'},
 // Alchemiczne półprodukty i tańsze warianty mikstur.
 {id:'alchemy_spiritDust',station:'alchemist',category:'Przetwarzanie',name:'Pył duchowy',result:'spiritDust',qty:1,ingredients:{ectoplasm:2,graveDust:2,crystal:1},note:'Esencja z nieumarłych i zjaw.'},
 {id:'alchemy_toxinConcentrate',station:'alchemist',category:'Przetwarzanie',name:'Koncentrat jadu',result:'toxinConcentrate',qty:1,ingredients:{venomExtract:2,venomGland:2,moonHerb:1},note:'Silny koncentrat trucizny.'},
 {id:'alchemy_herbalExtract',station:'alchemist',category:'Przetwarzanie',name:'Ekstrakt zielarski',result:'herbalExtract',qty:1,ingredients:{rareHerb:2,waterHerb:1,roots:2},note:'Baza mikstur regeneracyjnych.'},
 {id:'alchemy_arcaneResin',station:'alchemist',category:'Przetwarzanie',name:'Żywica arkanum',result:'arcaneResin',qty:1,ingredients:{blackroot:1,ancientBark:2,crystal:1},note:'Magiczna żywica do sprzętu maga.'},
 {id:'alchemy_fieldPotion',station:'alchemist',category:'Mikstury',name:'2× Mikstura życia z ekstraktu',result:'potion',qty:2,ingredients:{herbalExtract:1,slimeGel:1}},
 {id:'alchemy_spiritMana',station:'alchemist',category:'Mikstury',name:'2× Mikstura many z pyłu duchowego',result:'manaPotion',qty:2,ingredients:{spiritDust:1,waterHerb:1}},
 {id:'alchemy_doubleAntidote',station:'alchemist',category:'Mikstury',name:'2× Odtrutka z koncentratu',result:'antidote',qty:2,ingredients:{toxinConcentrate:1,herb:1}},
 {id:'alchemy_strongForest',station:'alchemist',category:'Mikstury',name:'2× Większa mikstura życia',result:'strongPotion',qty:2,ingredients:{herbalExtract:2,moonHerb:1,slimeGel:1}},
 // Craft-only sprzęt klasowy 25 / 55 / 75.
 {id:'forge_boneguard',station:'smith',category:'Ekwipunek',name:'Puklerz Kościanej Straży',result:'craft_boneguard_shield',qty:1,ingredients:{bonePlate:2,curedLeather:1,crystal:1}},
 {id:'forge_fangcleaver',station:'smith',category:'Broń',name:'Tasak Kłów',result:'craft_fangcleaver',qty:1,ingredients:{bonePlate:1,wolfFang:3,scrap:4}},
 {id:'forge_spiritstaff',station:'smith',category:'Broń',name:'Kostur Duchowego Pyłu',result:'craft_spiritstaff',qty:1,ingredients:{spiritDust:2,arcaneResin:1,crystal:2}},
 {id:'forge_stalkerbow',station:'smith',category:'Broń',name:'Łuk Skórnika',result:'craft_stalkerbow',qty:1,ingredients:{curedLeather:2,spiderSilk:2,wood:3}},
 {id:'forge_venombow',station:'smith',category:'Broń',name:'Łuk Jadowego Szlaku',result:'craft_venombow',qty:1,ingredients:{toxinConcentrate:2,curedLeather:1,wood:3}},
 {id:'forge_demonward',station:'smith',category:'Broń',name:'Ostrze Pogromcy Demonów',result:'craft_demonward',qty:1,ingredients:{demonAlloy:2,runicComposite:1,crystal:2}},
 {id:'forge_hellreaver',station:'smith',category:'Broń',name:'Rozpruwacz Piekielnych Kłów',result:'craft_hellreaver',qty:1,ingredients:{demonAlloy:2,hellhoundFang:2,scorchedBone:2}},
 {id:'forge_frostcore_staff',station:'smith',category:'Broń',name:'Kostur Lodowego Rdzenia',result:'craft_frostcore_staff',qty:1,ingredients:{frostAlloy:2,spiritDust:1,crystal:2}},
 {id:'forge_stormhunt_bow',station:'smith',category:'Broń',name:'Łuk Łowcy Burz',result:'craft_stormhunt_bow',qty:1,ingredients:{stormAlloy:1,stormFeather:3,curedLeather:2}},
 {id:'forge_abyss_bow',station:'smith',category:'Broń',name:'Łuk Splotu Otchłani',result:'craft_abyss_bow',qty:1,ingredients:{abyssThread:2,toxinConcentrate:1,shadowEssence:2}},
 {id:'forge_skywall',station:'smith',category:'Ekwipunek',name:'Tarcza Podniebnego Bastionu',result:'craft_skywall',qty:1,ingredients:{stormAlloy:2,runicComposite:1,skyScale:2}},
 {id:'forge_titanreaver',station:'smith',category:'Broń',name:'Rozpruwacz Tytanów',result:'craft_titanreaver',qty:1,ingredients:{demonAlloy:2,runicComposite:1,trollTooth:2}},
 {id:'forge_arcane_scepter',station:'smith',category:'Broń',name:'Berło Runicznego Splotu',result:'craft_arcane_scepter',qty:1,ingredients:{runicComposite:2,arcaneResin:2,stormCore:1}},
 {id:'forge_gryphon_bow',station:'smith',category:'Broń',name:'Łuk Gryfiego Rzemiosła',result:'craft_gryphon_bow',qty:1,ingredients:{stormAlloy:2,gryphonSeal:1,mat_pioro_gryfa:2}},
 {id:'forge_serpentfang_bow',station:'smith',category:'Broń',name:'Łuk Kła Niebios',result:'craft_serpentfang_bow',qty:1,ingredients:{stormAlloy:1,toxinConcentrate:2,skyScale:2}}
];
for(const r of CRAFTING_EXPANSION_RECIPES)if(!RECIPES.some(x=>x.id===r.id))RECIPES.push(r);

// 3.9.9.1 — twarda zasada ekonomii: Unikatowe/Heroiczne/Legendarne nie są craftowalne.
const NON_CRAFTABLE_GEAR_RARITIES=new Set(['epic','heroic','legendary']);
for(let i=RECIPES.length-1;i>=0;i--){
 const r=RECIPES[i],out=ITEMS[r.result];
 if(r.station==='smith'&&out?.slot&&NON_CRAFTABLE_GEAR_RARITIES.has(out.rarity))RECIPES.splice(i,1);
}
// Każdy Rzadki element EQ wymaga co najmniej jednego rzadkiego (lub lepszego) materiału.
const RARE_MATERIAL_RARITIES=new Set(['rare','epic','heroic','legendary']);
for(const r of RECIPES){
 const out=ITEMS[r.result];
 if(r.station!=='smith'||!out?.slot||out.rarity!=='rare')continue;
 const hasRareIngredient=Object.keys(r.ingredients||{}).some(id=>RARE_MATERIAL_RARITIES.has(ITEMS[id]?.rarity));
 if(!hasRareIngredient)r.ingredients.crystal=Math.max(r.ingredients.crystal||0,out.reqLevel>=50?2:1);
}

// Zwykła linia towaru dla każdego progu i klasy. Kowal oferuje mocniejsze wyroby shop_*.
const CITY_BASIC_TIERS=[1,12,25,40,55,70,85,100];
const CITY_BASIC_TIER_NAMES=['Podróżny','Żelazny','Kruczy','Mglisty','Popielny','Burzowy','Gwiezdny','Runiczny'];
const CITY_BASIC_CLASS_KITS={
 knight:{weapon:['miecz strażnika','sword','⚔️'],armor:['pancerz strażnika','🛡️'],stat:'str',armorScale:.43},
 mage:{weapon:['kostur adepta','staff','🪄'],armor:['szata adepta','🧥'],stat:'int',armorScale:.16},
 hunter:{weapon:['łuk łowcy','bow','🏹'],armor:['skórznia łowcy','🧥'],stat:'agi',armorScale:.28},
 berserker:{weapon:['topór wojownika','axe','🪓'],armor:['napierśnik wojownika','🛡️'],stat:'str',armorScale:.34},
 ranger:{weapon:['łuk tropiciela','bow','🏹'],armor:['skóry tropiciela','🧥'],stat:'agi',armorScale:.28}
};
for(const [cls,kit] of Object.entries(CITY_BASIC_CLASS_KITS))for(const [index,tier] of CITY_BASIC_TIERS.entries()){
 const prefix=CITY_BASIC_TIER_NAMES[index],weaponId=`city_basic_${cls}_${tier}_weapon`,armorId=`city_basic_${cls}_${tier}_armor`,base=Math.max(1,tier);
 ITEMS[weaponId]={id:weaponId,name:`${prefix} ${kit.weapon[0]}`,icon:kit.weapon[2],type:'weapon',slot:'weapon',weaponKind:kit.weapon[1],rarity:'common',reqLevel:tier,value:Math.ceil(20+base*5),classes:[cls],damage:[Math.max(2,Math.floor(base*.33)),Math.max(5,Math.ceil(base*.53)+5)],power:Math.max(1,Math.floor(base*.085)),merchantPlain:true,...(cls==='mage'?{magicAlwaysHits:true}:{}),...(['hunter','ranger'].includes(cls)?{ammo:'primitiveArrow'}:{})};
 ITEMS[armorId]={id:armorId,name:`${prefix} ${kit.armor[0]}`,icon:kit.armor[1],type:'armor',slot:'armor',rarity:'common',reqLevel:tier,value:Math.ceil(18+base*4),classes:[cls],armor:Math.max(1,Math.ceil(base*kit.armorScale)),merchantPlain:true};
}

function recipeCategory(r){if(r.category)return r.category;const d=itemDef(r.result);if(d.type==='rune')return 'Runy';if(d.type==='material')return 'Przetwarzanie';if(d.type==='weapon')return 'Broń';if(d.slot)return 'Ekwipunek';return r.station==='alchemist'?'Mikstury':'Inne'}
function recipeSort(a,b){const order={Przetwarzanie:0,Runy:1,Broń:2,Ekwipunek:3,Mikstury:4,Inne:5};return (order[recipeCategory(a)]??9)-(order[recipeCategory(b)]??9)||(itemDef(a.result).reqLevel||0)-(itemDef(b.result).reqLevel||0)||a.name.localeCompare(b.name)}

const CURATED_MONSTER_LOOT={"slime":[{"id":"mud","chance":0.72,"min":1,"max":2},{"id":"slimeGel","chance":0.52,"min":1,"max":2}],"rat":[{"id":"animalTail","chance":0.72,"min":1,"max":2},{"id":"slimeGel","chance":0.52,"min":1,"max":2},{"id":"oldCoin","chance":0.34,"min":1,"max":1}],"chochlik":[{"id":"plantShoots","chance":0.72,"min":1,"max":2},{"id":"roots","chance":0.52,"min":1,"max":2},{"id":"wood","chance":0.34,"min":1,"max":1}],"lis":[{"id":"animalTail","chance":0.72,"min":1,"max":2},{"id":"hide","chance":0.52,"min":1,"max":2},{"id":"drop_lis_sztylet_chytrusa","chance":0.028,"min":1,"max":1}],"czapla":[{"id":"mat_zom","chance":0.72,"min":1,"max":1},{"id":"feather","chance":0.52,"min":1,"max":2}],"kruk":[{"id":"feather","chance":0.72,"min":1,"max":2},{"id":"beak","chance":0.52,"min":1,"max":2}],"zdziczalyPies":[{"id":"drop_zdziczalyPies_buty_zagina_ego_bohatera","chance":0.028,"min":1,"max":1}],"wolf":[{"id":"furBundle","chance":0.72,"min":1,"max":2},{"id":"hide","chance":0.52,"min":1,"max":2},{"id":"rawMeat","chance":0.34,"min":1,"max":1},{"id":"herb","chance":0.22,"min":1,"max":1}],"dziewanna":[{"id":"roots","chance":0.72,"min":1,"max":2},{"id":"plantShoots","chance":0.52,"min":1,"max":2},{"id":"herb","chance":0.34,"min":1,"max":1}],"wydra":[{"id":"mat_mikstura_zycia","chance":0.72,"min":1,"max":1},{"id":"slimeGel","chance":0.52,"min":1,"max":2},{"id":"waterHerb","chance":0.34,"min":1,"max":1}],"ropucha":[{"id":"slimeGel","chance":0.72,"min":1,"max":2},{"id":"venomExtract","chance":0.52,"min":1,"max":2}],"thornBoar":[{"id":"spike","chance":0.72,"min":1,"max":2},{"id":"fang","chance":0.52,"min":1,"max":2},{"id":"hide","chance":0.34,"min":1,"max":1},{"id":"rawMeat","chance":0.22,"min":1,"max":1}],"grzybiarz":[{"id":"plantShoots","chance":0.72,"min":1,"max":2},{"id":"wood","chance":0.52,"min":1,"max":2},{"id":"rareHerb","chance":0.34,"min":1,"max":1}],"sokol":[{"id":"drop_sokol_pierscien_zwiadowcy","chance":0.028,"min":1,"max":1},{"id":"drop_sokol_rekawice_wzroku","chance":0.028,"min":1,"max":1},{"id":"ammo_strzay_szybkosci_100","chance":0.1,"min":100,"max":100}],"plagueToad":[{"id":"venomExtract","chance":0.72,"min":1,"max":2},{"id":"drop_plagueToad_zatrute_ostrze","chance":0.028,"min":1,"max":1},{"id":"drop_plagueToad_kaptur_tropiciela","chance":0.028,"min":1,"max":1},{"id":"runePoison","chance":0.055,"min":1,"max":1}],"trzcinnik":[{"id":"drop_trzcinnik_uk_wygiecia","chance":0.028,"min":1,"max":1},{"id":"drop_trzcinnik_kostur_powiewu","chance":0.028,"min":1,"max":1},{"id":"drop_trzcinnik_miecz_przeciecia","chance":0.028,"min":1,"max":1}],"mangradora":[{"id":"drop_mangradora_mot_wrzasku","chance":0.028,"min":1,"max":1},{"id":"drop_mangradora_wocznia_echa","chance":0.028,"min":1,"max":1}],"blackrootGuardian":[{"id":"drop_blackrootGuardian_czarne_ostrze","chance":0.028,"min":1,"max":1},{"id":"drop_blackrootGuardian_zbroja_korzeni","chance":0.028,"min":1,"max":1},{"id":"drop_blackrootGuardian_kostur_ciemnosci","chance":0.028,"min":1,"max":1}],"placzacaWierzba":[{"id":"wood","chance":0.72,"min":1,"max":2},{"id":"roots","chance":0.52,"min":1,"max":2},{"id":"plantShoots","chance":0.34,"min":1,"max":1},{"id":"mat_pierscien_badzacego_wedrowca","chance":0.22,"min":1,"max":1},{"id":"drop_placzacaWierzba_naszyjnik_lisci_wierzby","chance":0.028,"min":1,"max":1},{"id":"runeLeaf","chance":0.055,"min":1,"max":1}],"leszy":[{"id":"drop_leszy_prawny_uk","chance":0.045,"min":1,"max":1},{"id":"drop_leszy_ostrze_podstepnego_kojarza","chance":0.045,"min":1,"max":1},{"id":"cg_hunter_28_helmet","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_amulet","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_ring","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_offhand","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_helmet","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_amulet","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_ring","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_offhand","chance":0.035,"min":1,"max":1}],"jednorozec":[{"id":"mat_kilka_itemkow_dla_kazdej_klasy","chance":0.828,"min":1,"max":1},{"id":"cg_mage_28_helmet","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_amulet","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_ring","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_offhand","chance":0.035,"min":1,"max":1},{"id":"cg_knight_28_amulet","chance":0.035,"min":1,"max":1},{"id":"cg_berserker_28_ring","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_amulet","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_ring","chance":0.035,"min":1,"max":1}],"beetle":[{"id":"drop_beetle_pancerz","chance":0.028,"min":1,"max":1},{"id":"scrap","chance":0.72,"min":1,"max":2}],"spider":[{"id":"rareHerb","chance":0.72,"min":1,"max":2},{"id":"weaverDust","chance":0.52,"min":1,"max":2}],"graveMoth":[{"id":"arcaneDust","chance":0.72,"min":1,"max":2},{"id":"drop_graveMoth_hem_grozy","chance":0.028,"min":1,"max":1}],"mireCrawler":[{"id":"slimeGel","chance":0.72,"min":1,"max":2},{"id":"venomExtract","chance":0.52,"min":1,"max":2}],"krocionog":[{"id":"mud","chance":0.72,"min":1,"max":2},{"id":"slimeGel","chance":0.52,"min":1,"max":2},{"id":"venomExtract","chance":0.34,"min":1,"max":1}],"cmaUpiorna":[{"id":"arcaneDust","chance":0.72,"min":1,"max":2},{"id":"moonHerb","chance":0.52,"min":1,"max":2},{"id":"drop_cmaUpiorna_rekawice_nocnej_zmory","chance":0.028,"min":1,"max":1}],"komarzyca":[{"id":"drop_komarzyca_ostrze_krwi","chance":0.028,"min":1,"max":1},{"id":"drop_komarzyca_mot_krwawego_oprawcy","chance":0.028,"min":1,"max":1},{"id":"ammo_strzay_wampiryczne_100","chance":0.1,"min":100,"max":100}],"skorpion":[{"id":"venomExtract","chance":0.72,"min":1,"max":2},{"id":"slimeGel","chance":0.52,"min":1,"max":2},{"id":"mud","chance":0.34,"min":1,"max":1}],"fireWasp":[{"id":"drop_fireWasp_tarcza_ognia","chance":0.065,"min":1,"max":1},{"id":"drop_fireWasp_buty_ognistego_tancerza","chance":0.065,"min":1,"max":1},{"id":"drop_fireWasp_wocznia_ognia","chance":0.065,"min":1,"max":1},{"id":"cg_knight_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_hunter_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_berserker_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_ranger_12_ring","chance":0.032,"min":1,"max":1}],"magmaScorpion":[{"id":"runeFire","chance":0.055,"min":1,"max":1},{"id":"ashPowder","chance":0.72,"min":1,"max":2},{"id":"fireHerb","chance":0.52,"min":1,"max":2}],"goblin":[{"id":"drop_goblin_kaptur_goblina","chance":0.028,"min":1,"max":1},{"id":"drop_goblin_uk_goblina","chance":0.028,"min":1,"max":1},{"id":"ammo_strzay_trucizny_100","chance":0.1,"min":100,"max":100}],"kieszonkowiec":[{"id":"goldPouch","chance":0.72,"min":1,"max":2},{"id":"runeShadow","chance":0.055,"min":1,"max":1},{"id":"drop_kieszonkowiec_tarcza_najemnika","chance":0.028,"min":1,"max":1}],"zbir":[{"id":"oldCoin","chance":0.72,"min":1,"max":2},{"id":"oldPipes","chance":0.52,"min":1,"max":2}],"goblinWarrior":[{"id":"drop_goblinWarrior_ciezki_miecz","chance":0.028,"min":1,"max":1},{"id":"drop_goblinWarrior_tarcza_wojownika","chance":0.028,"min":1,"max":1},{"id":"drop_goblinWarrior_mot_goblina","chance":0.028,"min":1,"max":1}],"klusownik":[{"id":"drop_klusownik_buty_wedrowca","chance":0.028,"min":1,"max":1},{"id":"drop_klusownik_zaginiony_kij_maga","chance":0.028,"min":1,"max":1},{"id":"furBundle","chance":0.72,"min":1,"max":2},{"id":"snareCord","chance":0.52,"min":1,"max":2}],"rozbojnik":[{"id":"drop_rozbojnik_tarcza_wojownika","chance":0.028,"min":1,"max":1},{"id":"oldCoin","chance":0.72,"min":1,"max":2},{"id":"drop_rozbojnik_pancerz_szlaku","chance":0.028,"min":1,"max":1}],"goblinMage":[{"id":"drop_goblinMage_pierscienie_i_naszyjnik_dla_kazdej_klasy","chance":0.065,"min":1,"max":1},{"id":"cg_mage_12_helmet","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_armor","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_gloves","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_boots","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_amulet","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_mage_12_offhand","chance":0.032,"min":1,"max":1},{"id":"cg_knight_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_hunter_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_berserker_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_ranger_12_ring","chance":0.032,"min":1,"max":1},{"id":"cg_knight_12_amulet","chance":0.032,"min":1,"max":1},{"id":"cg_hunter_12_amulet","chance":0.032,"min":1,"max":1},{"id":"cg_berserker_12_amulet","chance":0.032,"min":1,"max":1},{"id":"cg_ranger_12_amulet","chance":0.032,"min":1,"max":1}],"najemnik":[{"id":"drop_najemnik_zbroja_czarnego_najemnika","chance":0.028,"min":1,"max":1},{"id":"runeShard","chance":0.055,"min":1,"max":1},{"id":"drop_najemnik_tarcza_ciemnosci","chance":0.028,"min":1,"max":1}],"ork":[{"id":"drop_ork_dwureczny_topor","chance":0.028,"min":1,"max":1},{"id":"drop_ork_tarcza_gupca","chance":0.028,"min":1,"max":1}],"szaleniec":[{"id":"drop_szaleniec_topor_szalenca","chance":0.028,"min":1,"max":1},{"id":"oldCoin","chance":0.72,"min":1,"max":2},{"id":"falseBanner","chance":0.52,"min":1,"max":2},{"id":"prophecyScrap","chance":0.34,"min":1,"max":1}],"goblinChampion":[{"id":"drop_goblinChampion_zbroja","chance":0.045,"min":1,"max":1},{"id":"drop_goblinChampion_rekawice_i_buty_heroiczne_dla_kazdej_klasy","chance":0.045,"min":1,"max":1},{"id":"drop_goblinChampion_pierscien_i_naszyknik_dla_maga","chance":0.045,"min":1,"max":1},{"id":"cg_knight_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_knight_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_knight_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_berserker_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_berserker_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_berserker_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_boots","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_ring","chance":0.035,"min":1,"max":1},{"id":"cg_mage_28_amulet","chance":0.035,"min":1,"max":1}],"cultist":[{"id":"stagSkull","chance":0.72,"min":1,"max":2},{"id":"prophecyBook","chance":0.52,"min":1,"max":2},{"id":"oldCoin","chance":0.34,"min":1,"max":1}],"rotCultist":[{"id":"venomExtract","chance":0.72,"min":1,"max":2},{"id":"drop_rotCultist_zatrute_ostrze","chance":0.028,"min":1,"max":1},{"id":"slimeGel","chance":0.52,"min":1,"max":2},{"id":"prophecyBook","chance":0.34,"min":1,"max":1},{"id":"moonHerb","chance":0.22,"min":1,"max":1}],"cinderCultist":[{"id":"runeFire","chance":0.055,"min":1,"max":1},{"id":"drop_cinderCultist_naszyjnik_kultysta","chance":0.028,"min":1,"max":1},{"id":"drop_cinderCultist_kaptur_kultysta","chance":0.028,"min":1,"max":1},{"id":"drop_cinderCultist_kontur_zaru","chance":0.028,"min":1,"max":1}],"ogre":[{"id":"drop_ogre_mot_ogra","chance":0.028,"min":1,"max":1},{"id":"drop_ogre_tarcza_gupca","chance":0.028,"min":1,"max":1}],"stormCultist":[{"id":"runeLightning","chance":0.055,"min":1,"max":1},{"id":"drop_stormCultist_uk_burzy","chance":0.028,"min":1,"max":1},{"id":"oldCoin","chance":0.72,"min":1,"max":2},{"id":"prophecyScrap","chance":0.52,"min":1,"max":2}],"graveColossus":[{"id":"mat_kosc_nieumarego","chance":0.72,"min":1,"max":1},{"id":"mat_py_grobowy","chance":0.52,"min":1,"max":1},{"id":"mat_odamek_runiczny","chance":0.34,"min":1,"max":1},{"id":"drop_graveColossus_mot_kurhanu","chance":0.028,"min":1,"max":1},{"id":"drop_graveColossus_tarcza_koscianego_kolosa","chance":0.028,"min":1,"max":1}],"skeleton":[{"id":"bastionBlade","chance":0.018,"min":1,"max":1},{"id":"ravenAxe","chance":0.018,"min":1,"max":1},{"id":"cg_knight_12_armor","chance":0.018,"min":1,"max":1},{"id":"cg_berserker_12_armor","chance":0.018,"min":1,"max":1}],"boneArcher":[{"id":"ravenLongbow","chance":0.018,"min":1,"max":1},{"id":"wildVenomBow","chance":0.018,"min":1,"max":1},{"id":"cg_hunter_12_gloves","chance":0.018,"min":1,"max":1},{"id":"cg_ranger_12_gloves","chance":0.018,"min":1,"max":1}],"zombie":[{"id":"rottenMeat","chance":0.72,"min":1,"max":2},{"id":"drop_zombie_napiersciennik_straznika","chance":0.028,"min":1,"max":1}],"ghul":[{"id":"rottenMeat","chance":0.72,"min":1,"max":2},{"id":"venomExtract","chance":0.52,"min":1,"max":2},{"id":"rareHerb","chance":0.34,"min":1,"max":1}],"wisielec":[{"id":"rottenMeat","chance":0.72,"min":1,"max":2},{"id":"rope","chance":0.52,"min":1,"max":2},{"id":"farewellLetter","chance":0.34,"min":1,"max":1}],"mumia":[{"id":"paper","chance":0.72,"min":1,"max":2},{"id":"rottenMeat","chance":0.52,"min":1,"max":2},{"id":"drop_mumia_naszyjnik_piramidy","chance":0.028,"min":1,"max":1},{"id":"drop_mumia_pierscien_mumii","chance":0.028,"min":1,"max":1}],"zniwiarzPol":[{"id":"drop_zniwiarzPol_kosa_zniwiarza","chance":0.065,"min":1,"max":1},{"id":"rareHerb","chance":0.778,"min":1,"max":2},{"id":"straw","chance":0.562,"min":1,"max":2},{"id":"drop_zniwiarzPol_lekkie_buty","chance":0.065,"min":1,"max":1},{"id":"drop_zniwiarzPol_pierscien_zbiorow","chance":0.065,"min":1,"max":1},{"id":"drop_zniwiarzPol_naszyjnik_urodzaju","chance":0.065,"min":1,"max":1}],"trupojad":[{"id":"venomExtract","chance":0.72,"min":1,"max":2},{"id":"ammo_strzay_trucizny","chance":0.1,"min":100,"max":100}],"pyreKnight":[{"id":"cg_knight_28_armor","chance":0.018,"min":1,"max":1},{"id":"cg_knight_28_gloves","chance":0.018,"min":1,"max":1},{"id":"cg_berserker_28_armor","chance":0.018,"min":1,"max":1},{"id":"cg_berserker_28_gloves","chance":0.018,"min":1,"max":1}],"frozenKnight":[{"id":"runeIce","chance":0.055,"min":1,"max":1},{"id":"cg_mage_28_armor","chance":0.018,"min":1,"max":1},{"id":"cg_mage_28_gloves","chance":0.018,"min":1,"max":1},{"id":"cg_mage_28_offhand","chance":0.018,"min":1,"max":1}],"lichWarden":[{"id":"mat_py_grobowy","chance":0.72,"min":1,"max":1},{"id":"shadowEssence","chance":0.52,"min":1,"max":2},{"id":"mat_odamek_runiczny","chance":0.34,"min":1,"max":1},{"id":"drop_lichWarden_kostur_licza","chance":0.028,"min":1,"max":1},{"id":"drop_lichWarden_ksiega_wiecznego_czuwania","chance":0.028,"min":1,"max":1},{"id":"drop_lichWarden_pierscien_nekromanty","chance":0.028,"min":1,"max":1}],"kosciej":[{"id":"mat_unikat_tarczy_i_vos_dla_maga","chance":0.828,"min":1,"max":1},{"id":"cg_hunter_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_28_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_armor","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_28_gloves","chance":0.035,"min":1,"max":1}],"strachNaWroble":[{"id":"straw","chance":0.72,"min":1,"max":2},{"id":"drop_strachNaWroble_kapelusz_maga","chance":0.028,"min":1,"max":1},{"id":"runeLuck","chance":0.055,"min":1,"max":1}],"blednyOgnik":[{"id":"runeFire","chance":0.055,"min":1,"max":1},{"id":"fairyDust","chance":0.72,"min":1,"max":2},{"id":"wishScrap","chance":0.52,"min":1,"max":2}],"poltergeist":[{"id":"spellBook","chance":0.72,"min":1,"max":2},{"id":"drop_poltergeist_kontur_telepatii","chance":0.028,"min":1,"max":1}],"poludnica":[{"id":"mat_spodnie_tropiciela","chance":0.72,"min":1,"max":1},{"id":"drop_poludnica_nasyznik_poudnia","chance":0.028,"min":1,"max":1},{"id":"drop_poludnica_pierscien_kompasu","chance":0.028,"min":1,"max":1}],"shade":[{"id":"runeShadow","chance":0.055,"min":1,"max":1},{"id":"ghostCoin","chance":0.72,"min":1,"max":2},{"id":"knowledgeBook","chance":0.52,"min":1,"max":2}],"mistStag":[{"id":"drop_mistStag_zbroja_mgy","chance":0.028,"min":1,"max":1},{"id":"drop_mistStag_buty_mgy","chance":0.028,"min":1,"max":1},{"id":"drop_mistStag_rekawice_mgy","chance":0.028,"min":1,"max":1}],"bogWraith":[{"id":"mat_zgnile_mieso","chance":0.72,"min":1,"max":1},{"id":"ghostCoin","chance":0.52,"min":1,"max":2},{"id":"farewellLetter","chance":0.34,"min":1,"max":1}],"ghost":[{"id":"ghostCoin","chance":0.72,"min":1,"max":2},{"id":"telepathyBook","chance":0.52,"min":1,"max":2},{"id":"drop_ghost_tarcza_widmo","chance":0.028,"min":1,"max":1}],"rusalka":[{"id":"runeLeaf","chance":0.12,"min":1,"max":1},{"id":"fairyDust","chance":0.778,"min":1,"max":2},{"id":"forestBook","chance":0.562,"min":1,"max":2},{"id":"mat_jakies_unikaty_dla_maga","chance":0.367,"min":1,"max":1},{"id":"cg_mage_28_amulet","chance":0.032,"min":1,"max":1},{"id":"cg_mage_28_ring","chance":0.032,"min":1,"max":1},{"id":"cg_mage_28_offhand","chance":0.032,"min":1,"max":1}],"placzacaPanna":[{"id":"runeWater","chance":0.055,"min":1,"max":1},{"id":"drop_placzacaPanna_ostrze_fali","chance":0.028,"min":1,"max":1},{"id":"drop_placzacaPanna_mot_posejdona","chance":0.028,"min":1,"max":1},{"id":"waterCoin","chance":0.72,"min":1,"max":2}],"zmora":[{"id":"ghostCoin","chance":0.72,"min":1,"max":2},{"id":"dreamBook","chance":0.52,"min":1,"max":2},{"id":"mat_nszyjnik_nocy","chance":0.34,"min":1,"max":1}],"emberWraith":[{"id":"runeFire","chance":0.055,"min":1,"max":1},{"id":"fireBook","chance":0.72,"min":1,"max":2},{"id":"mat_mikstura_zycia","chance":0.52,"min":1,"max":1}],"iceWraith":[{"id":"runeIce","chance":0.055,"min":1,"max":1},{"id":"drop_iceWraith_tarcza_lodu","chance":0.028,"min":1,"max":1},{"id":"drop_iceWraith_buty_lodu","chance":0.028,"min":1,"max":1},{"id":"ammo_strzay_lodu","chance":0.1,"min":100,"max":100},{"id":"drop_iceWraith_kontur_lodu","chance":0.028,"min":1,"max":1},{"id":"frostCoin","chance":0.72,"min":1,"max":2}],"widmowyJezdziec":[{"id":"drop_widmowyJezdziec_miecz_widmo","chance":0.028,"min":1,"max":1},{"id":"drop_widmowyJezdziec_buty_widmo","chance":0.028,"min":1,"max":1},{"id":"mat_spodnie_widmo","chance":0.72,"min":1,"max":1}],"mossGolem":[{"id":"slimeGel","chance":0.72,"min":1,"max":2},{"id":"mud","chance":0.52,"min":1,"max":2},{"id":"mat_zioa_lasu","chance":0.34,"min":1,"max":1}],"wir":[{"id":"windBook","chance":0.72,"min":1,"max":2},{"id":"drop_wir_kaptur_wiarru","chance":0.028,"min":1,"max":1},{"id":"runeWind","chance":0.055,"min":1,"max":1},{"id":"windCoin","chance":0.52,"min":1,"max":2}],"elemental":[{"id":"stoneCore","chance":0.72,"min":1,"max":2},{"id":"crystal","chance":0.52,"min":1,"max":2},{"id":"drop_elemental_mot_tektoniczny","chance":0.028,"min":1,"max":1},{"id":"drop_elemental_pierscien_granitu","chance":0.028,"min":1,"max":1}],"plomyk":[{"id":"emberCore","chance":0.778,"min":1,"max":2},{"id":"ashGlass","chance":0.562,"min":1,"max":2},{"id":"mat_rozdzka_zaru","chance":0.367,"min":1,"max":1},{"id":"drop_plomyk_amulet_pomienia","chance":0.065,"min":1,"max":1}],"slagGolem":[{"id":"charredIron","chance":0.72,"min":1,"max":2},{"id":"stoneCore","chance":0.52,"min":1,"max":2},{"id":"drop_slagGolem_tarcza_zuzlowa","chance":0.028,"min":1,"max":1},{"id":"drop_slagGolem_mot_kuzniczego_zaru","chance":0.028,"min":1,"max":1}],"zywiolakCienia":[{"id":"shadowEssence","chance":0.778,"min":1,"max":2},{"id":"ectoplasm","chance":0.562,"min":1,"max":2},{"id":"drop_zywiolakCienia_kostur_cienia","chance":0.065,"min":1,"max":1},{"id":"drop_zywiolakCienia_pierscien_pustki","chance":0.065,"min":1,"max":1}],"obsidianSentinel":[{"id":"stoneCore","chance":0.778,"min":1,"max":2},{"id":"charredIron","chance":0.562,"min":1,"max":2},{"id":"mat_odamek_runiczny","chance":0.367,"min":1,"max":1},{"id":"drop_obsidianSentinel_ostrze_obsydianu","chance":0.065,"min":1,"max":1},{"id":"drop_obsidianSentinel_pancerz_obsydianowego_straznika","chance":0.065,"min":1,"max":1}],"thunderGolem":[{"id":"stormCore","chance":0.778,"min":1,"max":2},{"id":"skySteel","chance":0.562,"min":1,"max":2},{"id":"drop_thunderGolem_rekawice_piorunow","chance":0.065,"min":1,"max":1},{"id":"drop_thunderGolem_mot_gromu","chance":0.065,"min":1,"max":1}],"lodowyGolem":[{"id":"frostCrystal","chance":0.778,"min":1,"max":2},{"id":"stoneCore","chance":0.562,"min":1,"max":2},{"id":"drop_lodowyGolem_tarcza_szronu","chance":0.065,"min":1,"max":1},{"id":"drop_lodowyGolem_kostur_wiecznej_zimy","chance":0.065,"min":1,"max":1}],"zywiolakSwiatla":[{"id":"crystal","chance":0.778,"min":1,"max":2},{"id":"runeLight","chance":0.12,"min":1,"max":1},{"id":"drop_zywiolakSwiatla_amulet_swiata","chance":0.065,"min":1,"max":1},{"id":"mat_bero_swietliste","chance":0.562,"min":1,"max":1}],"tempestLord":[{"id":"stormCore","chance":0.778,"min":1,"max":2},{"id":"skySteel","chance":0.562,"min":1,"max":2},{"id":"stormFeather","chance":0.367,"min":1,"max":1},{"id":"drop_tempestLord_wocznia_wadcy_nawanicy","chance":0.065,"min":1,"max":1},{"id":"mat_korona_nawanicy","chance":0.238,"min":1,"max":1}],"marshHag":[{"id":"hagCharm","chance":0.778,"min":1,"max":2},{"id":"moonHerb","chance":0.562,"min":1,"max":2},{"id":"wraithEssence","chance":0.367,"min":1,"max":1},{"id":"drop_marshHag_kostur_wiedzmy_moczaru","chance":0.065,"min":1,"max":1},{"id":"drop_marshHag_pierscien_bagien","chance":0.065,"min":1,"max":1}],"latawiec":[{"id":"fireWing","chance":0.72,"min":1,"max":2},{"id":"emberCore","chance":0.52,"min":1,"max":2},{"id":"drop_latawiec_uk_ognistego_wiatru","chance":0.028,"min":1,"max":1},{"id":"drop_latawiec_amulet_zaru","chance":0.028,"min":1,"max":1}],"wodnik":[{"id":"wraithEssence","chance":0.778,"min":1,"max":2},{"id":"swampScale","chance":0.562,"min":1,"max":2},{"id":"mat_trojzab_rozlewiska","chance":0.367,"min":1,"max":1},{"id":"drop_wodnik_paszcz_wodnika","chance":0.065,"min":1,"max":1}],"bies":[{"id":"demonHorn","chance":0.72,"min":1,"max":2},{"id":"ancientBark","chance":0.52,"min":1,"max":2},{"id":"drop_bies_topor_biesa","chance":0.028,"min":1,"max":1},{"id":"drop_bies_amulet_boru","chance":0.028,"min":1,"max":1}],"diabel":[{"id":"demonBlood","chance":0.72,"min":1,"max":2},{"id":"ashGlass","chance":0.52,"min":1,"max":2},{"id":"drop_diabel_miecz_popielnego_diaba","chance":0.028,"min":1,"max":1},{"id":"drop_diabel_kaptur_popiou","chance":0.028,"min":1,"max":1}],"voidHound":[{"id":"charredHide","chance":0.72,"min":1,"max":2},{"id":"demonBlood","chance":0.52,"min":1,"max":2},{"id":"shadowEssence","chance":0.34,"min":1,"max":1},{"id":"drop_voidHound_naszyjnik_ka_pustki","chance":0.028,"min":1,"max":1},{"id":"drop_voidHound_buty_pustki","chance":0.028,"min":1,"max":1}],"cinderMatriarch":[{"id":"emberCore","chance":0.778,"min":1,"max":2},{"id":"ashGlass","chance":0.562,"min":1,"max":2},{"id":"charredIron","chance":0.367,"min":1,"max":1},{"id":"drop_cinderMatriarch_szata_matki_zaru","chance":0.065,"min":1,"max":1},{"id":"drop_cinderMatriarch_pierscien_matki_zaru","chance":0.065,"min":1,"max":1}],"demon":[{"id":"demonHorn","chance":0.828,"min":1,"max":2},{"id":"demonBlood","chance":0.598,"min":1,"max":2},{"id":"sulfur","chance":0.391,"min":1,"max":1},{"id":"drop_demon_rogate_ostrze","chance":0.045,"min":1,"max":1},{"id":"drop_demon_pancerz_rogatego_demona","chance":0.045,"min":1,"max":1},{"id":"drop_demon_amulet_otchani","chance":0.045,"min":1,"max":1}],"hellhound":[{"id":"hellhoundFang","chance":0.72,"min":1,"max":2},{"id":"charredHide","chance":0.52,"min":1,"max":2},{"id":"demonBlood","chance":0.34,"min":1,"max":1},{"id":"drop_hellhound_buty_piekielnego_ogara","chance":0.028,"min":1,"max":1},{"id":"drop_hellhound_naszyjnik_piekielnych_kow","chance":0.028,"min":1,"max":1}],"abyssHydra":[{"id":"demonBlood","chance":0.778,"min":1,"max":2},{"id":"wyvernScale","chance":0.562,"min":1,"max":2},{"id":"emberCore","chance":0.367,"min":1,"max":1},{"id":"mat_kie_hydry","chance":0.238,"min":1,"max":1},{"id":"drop_abyssHydra_pancerz_hydry_otchani","chance":0.065,"min":1,"max":1},{"id":"drop_abyssHydra_pierscien_trzech_gow","chance":0.065,"min":1,"max":1}],"caveBat":[{"id":"bloodBottle","chance":0.72,"min":1,"max":2},{"id":"batWing","chance":0.52,"min":1,"max":2}],"dzik":[{"id":"fang","chance":0.72,"min":1,"max":2},{"id":"hide","chance":0.52,"min":1,"max":2},{"id":"rawMeat","chance":0.34,"min":1,"max":1}],"zbik":[{"id":"hide","chance":0.72,"min":1,"max":2},{"id":"animalTail","chance":0.52,"min":1,"max":2}],"stormDrake":[{"id":"drop_stormDrake_miecz_smoczego_wadcy","chance":0.028,"min":1,"max":1},{"id":"drop_stormDrake_kaptur_smoczego_zwiadowcy","chance":0.028,"min":1,"max":1},{"id":"drop_stormDrake_kostur_mroku","chance":0.028,"min":1,"max":1},{"id":"drop_stormDrake_buty_smoczego_jezdzca","chance":0.028,"min":1,"max":1},{"id":"drop_stormDrake_pierscien_smoczego_rodu","chance":0.028,"min":1,"max":1}],"rys":[{"id":"drop_rys_czapka_owcy","chance":0.065,"min":1,"max":1},{"id":"mat_spodnie_pregowanego_tropiciela","chance":0.778,"min":1,"max":1}],"harpia":[{"id":"drop_harpia_wocznia_lotu","chance":0.028,"min":1,"max":1},{"id":"drop_harpia_zbroja_husarii","chance":0.028,"min":1,"max":1},{"id":"drop_harpia_rekawice_szelestu","chance":0.028,"min":1,"max":1}],"niedzwiedz":[{"id":"hide","chance":0.778,"min":1,"max":2},{"id":"furBundle","chance":0.562,"min":1,"max":2},{"id":"drop_niedzwiedz_naszyjnik_niedzwiedziej_sily","chance":0.065,"min":1,"max":1},{"id":"drop_niedzwiedz_tarcza_niedzwiedziej_siy","chance":0.065,"min":1,"max":1}],"wilkolak":[{"id":"drop_wilkolak_hem_nocy","chance":0.045,"min":1,"max":1},{"id":"drop_wilkolak_zbroja_ksiezyca","chance":0.045,"min":1,"max":1},{"id":"drop_wilkolak_uk_nocnego_wilka","chance":0.045,"min":1,"max":1},{"id":"drop_wilkolak_pierscien_zrecznosci","chance":0.045,"min":1,"max":1},{"id":"drop_wilkolak_naszyjnik_peni","chance":0.045,"min":1,"max":1}],"fenStalker":[{"id":"roots","chance":0.72,"min":1,"max":2},{"id":"wood","chance":0.52,"min":1,"max":2},{"id":"drop_fenStalker_sztylet_tropicela","chance":0.028,"min":1,"max":1}],"sumOlbrzymi":[{"id":"rawMeat","chance":0.72,"min":1,"max":2},{"id":"fin","chance":0.52,"min":1,"max":2}],"mlodyKraken":[{"id":"rawMeat","chance":0.828,"min":1,"max":2},{"id":"tentacle","chance":0.598,"min":1,"max":2},{"id":"drop_mlodyKraken_rekawice_wody","chance":0.045,"min":1,"max":1},{"id":"drop_mlodyKraken_zbroja_wodnego_krakena","chance":0.045,"min":1,"max":1},{"id":"drop_mlodyKraken_kostur_wody","chance":0.045,"min":1,"max":1},{"id":"mat_dopisz_jeszcze_kilka","chance":0.391,"min":1,"max":1},{"id":"cg_mage_70_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_mage_70_armor","chance":0.035,"min":1,"max":1},{"id":"cg_mage_70_offhand","chance":0.035,"min":1,"max":1},{"id":"cg_hunter_70_gloves","chance":0.035,"min":1,"max":1},{"id":"cg_ranger_70_armor","chance":0.035,"min":1,"max":1}],"mireMother":[{"id":"mireSilk","chance":0.72,"min":1,"max":2},{"id":"bogAmber","chance":0.52,"min":1,"max":2},{"id":"wraithEssence","chance":0.34,"min":1,"max":1},{"id":"drop_mireMother_kaptur_matki_mgy","chance":0.028,"min":1,"max":1},{"id":"drop_mireMother_pancerz_matki_mgy","chance":0.028,"min":1,"max":1},{"id":"drop_mireMother_pierscien_mgy","chance":0.028,"min":1,"max":1}],"ashScavenger":[{"id":"scorchedBone","chance":0.72,"min":1,"max":2},{"id":"charredIron","chance":0.52,"min":1,"max":2},{"id":"drop_ashScavenger_ostrze_padlinozercy","chance":0.028,"min":1,"max":1},{"id":"drop_ashScavenger_amulet_popiou","chance":0.028,"min":1,"max":1}],"ashDrake":[{"id":"ashScale","chance":0.72,"min":1,"max":2},{"id":"emberCore","chance":0.52,"min":1,"max":2},{"id":"wyvernClaw","chance":0.34,"min":1,"max":1},{"id":"drop_ashDrake_wocznia_popielnego_draka","chance":0.028,"min":1,"max":1},{"id":"drop_ashDrake_pancerz_draka","chance":0.028,"min":1,"max":1}],"frostRaptor":[{"id":"frostClaw","chance":0.778,"min":1,"max":2},{"id":"frostCrystal","chance":0.562,"min":1,"max":2},{"id":"drop_frostRaptor_buty_raptora","chance":0.065,"min":1,"max":1},{"id":"drop_frostRaptor_rekawice_mrozu","chance":0.065,"min":1,"max":1},{"id":"drop_frostRaptor_ostrze_lodowego_szponu","chance":0.065,"min":1,"max":1}],"kozica":[{"id":"stormFeather","chance":0.72,"min":1,"max":2},{"id":"stormCore","chance":0.52,"min":1,"max":2},{"id":"mat_rog_gromu","chance":0.34,"min":1,"max":1},{"id":"drop_kozica_amulet_gromowej_kozicy","chance":0.028,"min":1,"max":1}],"mountainTroll":[{"id":"trollHide","chance":0.778,"min":1,"max":2},{"id":"trollTooth","chance":0.562,"min":1,"max":2},{"id":"stoneCore","chance":0.367,"min":1,"max":1},{"id":"drop_mountainTroll_mot_skalnego_trolla","chance":0.065,"min":1,"max":1},{"id":"drop_mountainTroll_amulet_trolla","chance":0.065,"min":1,"max":1}],"skySerpent":[{"id":"skyScale","chance":0.828,"min":1,"max":2},{"id":"stormFeather","chance":0.598,"min":1,"max":2},{"id":"stormCore","chance":0.391,"min":1,"max":1},{"id":"drop_skySerpent_wocznia_niebios","chance":0.075,"min":1,"max":1},{"id":"drop_skySerpent_pierscien_niebios","chance":0.075,"min":1,"max":1},{"id":"drop_skySerpent_zbroja_niebios","chance":0.075,"min":1,"max":1}],"bazyliszek":[{"id":"mat_oko_bazyliszka","chance":0.72,"min":1,"max":1},{"id":"venomGland","chance":0.52,"min":1,"max":2},{"id":"mat_uska_bazyliszka","chance":0.34,"min":1,"max":1},{"id":"drop_bazyliszek_tarcza_bazyliszka","chance":0.028,"min":1,"max":1},{"id":"drop_bazyliszek_ostrze_bazyliszka","chance":0.028,"min":1,"max":1},{"id":"drop_bazyliszek_pierscien_skamienienia","chance":0.028,"min":1,"max":1}],"gryf":[{"id":"mat_pioro_gryfa","chance":0.828,"min":1,"max":1},{"id":"skySteel","chance":0.598,"min":1,"max":2},{"id":"frostClaw","chance":0.391,"min":1,"max":1},{"id":"drop_gryf_uk_gryfa","chance":0.045,"min":1,"max":1},{"id":"drop_gryf_pancerz_skalnego_gniazda","chance":0.045,"min":1,"max":1},{"id":"drop_gryf_amulet_gryfa","chance":0.045,"min":1,"max":1}],"stormGriffin":[{"id":"stormFeather","chance":0.828,"min":1,"max":2},{"id":"skySteel","chance":0.598,"min":1,"max":2},{"id":"stormCore","chance":0.391,"min":1,"max":1},{"id":"drop_stormGriffin_uk_gromu","chance":0.075,"min":1,"max":1},{"id":"mat_korona_gryfa_nawanicy","chance":0.253,"min":1,"max":1},{"id":"drop_stormGriffin_pierscien_burzy","chance":0.075,"min":1,"max":1}],"wyvern":[{"id":"wyvernScale","chance":0.778,"min":1,"max":2},{"id":"wyvernClaw","chance":0.562,"min":1,"max":2},{"id":"emberCore","chance":0.367,"min":1,"max":1},{"id":"drop_wyvern_wocznia_wywerny","chance":0.065,"min":1,"max":1},{"id":"drop_wyvern_pancerz_wywerny","chance":0.065,"min":1,"max":1}]};

// 3.9.8.8 — ręcznie dopracowane pule głównych bossów. Usuwają tekstowe placeholdery z 3.9.8.7.
const ENDGAME_BOSS_LOOT={
 leszy:addLootRows(CURATED_MONSTER_LOOT.leszy,[
  {id:'boss_leszy_crown',chance:.055,min:1,max:1},{id:'boss_leszy_cloak',chance:.055,min:1,max:1},{id:'boss_leszy_amulet',chance:.055,min:1,max:1},{id:'boss_leszy_quiver',chance:.055,min:1,max:1}
 ]),
 jednorozec:[
  {id:'crystal',chance:.88,min:1,max:3},{id:'arcaneDust',chance:.70,min:1,max:2},
  {id:'boss_unicorn_staff',chance:.06,min:1,max:1},{id:'boss_unicorn_circlet',chance:.06,min:1,max:1},{id:'boss_unicorn_robe',chance:.06,min:1,max:1},{id:'boss_unicorn_ring',chance:.06,min:1,max:1},
  {id:'cg_mage_28_gloves',chance:.04,min:1,max:1},{id:'cg_mage_28_boots',chance:.04,min:1,max:1},{id:'cg_mage_28_amulet',chance:.04,min:1,max:1},{id:'cg_mage_28_offhand',chance:.04,min:1,max:1}
 ],
 kosciej:addLootRows(CURATED_MONSTER_LOOT.kosciej,[
  {id:'boss_kosciej_bow',chance:.05,min:1,max:1},{id:'boss_kosciej_shield',chance:.05,min:1,max:1},{id:'boss_kosciej_focus',chance:.05,min:1,max:1},{id:'boss_kosciej_ring',chance:.05,min:1,max:1}
 ]),
 wilkolak:addLootRows(CURATED_MONSTER_LOOT.wilkolak,[
  {id:'boss_wolf_claws',chance:.055,min:1,max:1},{id:'boss_wolf_quiver',chance:.055,min:1,max:1}
 ]),
 mlodyKraken:[
  {id:'rawMeat',chance:.82,min:1,max:2},{id:'tentacle',chance:.65,min:1,max:2},{id:'krakenPearl',chance:.38,min:1,max:1},
  {id:'boss_kraken_staff',chance:.055,min:1,max:1},{id:'boss_kraken_shield',chance:.055,min:1,max:1},{id:'boss_kraken_bow',chance:.055,min:1,max:1},{id:'boss_kraken_amulet',chance:.055,min:1,max:1},
  {id:'cg_mage_70_gloves',chance:.035,min:1,max:1},{id:'cg_hunter_70_gloves',chance:.035,min:1,max:1},{id:'cg_ranger_70_armor',chance:.035,min:1,max:1}
 ],
 stormDrake:[
  {id:'stormCore',chance:.88,min:1,max:2},{id:'skySteel',chance:.74,min:1,max:2},{id:'stormSigil',chance:.52,min:1,max:1},
  {id:'boss_drake_knight',chance:.045,min:1,max:1},{id:'boss_drake_berserker',chance:.045,min:1,max:1},{id:'boss_drake_mage',chance:.045,min:1,max:1},{id:'boss_drake_hunter',chance:.045,min:1,max:1},{id:'boss_drake_ranger',chance:.045,min:1,max:1},
  {id:'cg_knight_70_armor',chance:.025,min:1,max:1},{id:'cg_mage_70_armor',chance:.025,min:1,max:1},{id:'cg_hunter_70_armor',chance:.025,min:1,max:1},{id:'cg_berserker_70_armor',chance:.025,min:1,max:1},{id:'cg_ranger_70_armor',chance:.025,min:1,max:1}
 ],
 bazyliszek:[
  {id:'mat_oko_bazyliszka',chance:.82,min:1,max:1},{id:'mat_uska_bazyliszka',chance:.66,min:1,max:2},{id:'venomGland',chance:.60,min:1,max:2},{id:'basiliskHeart',chance:.34,min:1,max:1},
  {id:'boss_basilisk_blade',chance:.045,min:1,max:1},{id:'boss_basilisk_shield',chance:.045,min:1,max:1},{id:'boss_basilisk_staff',chance:.045,min:1,max:1},{id:'boss_basilisk_bow',chance:.045,min:1,max:1},{id:'boss_basilisk_ring',chance:.045,min:1,max:1}
 ],
 gryf:addLootRows(CURATED_MONSTER_LOOT.gryf,[
  {id:'gryphonSeal',chance:.64,min:1,max:1},{id:'cg_hunter_80_helmet',chance:.03,min:1,max:1},{id:'cg_hunter_80_armor',chance:.03,min:1,max:1},{id:'cg_ranger_80_helmet',chance:.03,min:1,max:1},{id:'cg_ranger_80_armor',chance:.03,min:1,max:1},{id:'cg_berserker_80_gloves',chance:.03,min:1,max:1}
 ]),
 skySerpent:[
  {id:'skyScale',chance:.90,min:1,max:2},{id:'stormFeather',chance:.76,min:1,max:2},{id:'skySteel',chance:.68,min:1,max:2},{id:'stormSigil',chance:.62,min:1,max:1},
  {id:'boss_serpent_spear',chance:.045,min:1,max:1},{id:'boss_serpent_staff',chance:.045,min:1,max:1},{id:'boss_serpent_bow',chance:.045,min:1,max:1},{id:'boss_serpent_venom',chance:.045,min:1,max:1},{id:'boss_serpent_axe',chance:.045,min:1,max:1},
  {id:'cg_knight_80_armor',chance:.025,min:1,max:1},{id:'cg_mage_80_armor',chance:.025,min:1,max:1},{id:'cg_knight_80_offhand',chance:.025,min:1,max:1},{id:'cg_mage_80_offhand',chance:.025,min:1,max:1}
 ],
 stormGriffin:[
  {id:'stormFeather',chance:.96,min:1,max:3},{id:'skySteel',chance:.82,min:1,max:3},{id:'stormCore',chance:.70,min:1,max:2},{id:'gryphonSeal',chance:.82,min:1,max:1},{id:'stormSigil',chance:.72,min:1,max:1},{id:'eternalCore',chance:.24,min:1,max:1},
  {id:'boss_griffin90_knight',chance:.045,min:1,max:1},{id:'boss_griffin90_berserker',chance:.045,min:1,max:1},{id:'boss_griffin90_mage',chance:.045,min:1,max:1},{id:'boss_griffin90_hunter',chance:.045,min:1,max:1},{id:'boss_griffin90_ranger',chance:.045,min:1,max:1},
  {id:'cg_knight_90_armor',chance:.02,min:1,max:1},{id:'cg_berserker_90_armor',chance:.02,min:1,max:1},{id:'cg_mage_90_armor',chance:.02,min:1,max:1},{id:'cg_hunter_90_armor',chance:.02,min:1,max:1},{id:'cg_ranger_90_armor',chance:.02,min:1,max:1},
  {id:'end_knight_100',chance:.008,min:1,max:1},{id:'end_berserker_100',chance:.008,min:1,max:1},{id:'end_mage_100',chance:.008,min:1,max:1},{id:'end_hunter_100',chance:.008,min:1,max:1},{id:'end_ranger_100',chance:.008,min:1,max:1}
 ]
};
Object.assign(MONSTER_LOOT,CURATED_MONSTER_LOOT);
Object.assign(MONSTER_LOOT,ENDGAME_BOSS_LOOT);
// Receptury korzystają także z podstawowych surowców. Zachowaj ich źródła
// po nałożeniu nazwanych tabel łupów, aby nie zablokować craftingu.
const CRAFT_MATERIAL_DROPS={
 wolf:[['wolfPelt',.42],['wolfFang',.24]],
 spider:[['spiderSilk',.45]],
 skeleton:[['bone',.54],['brokenBlade',.18]],
 goblin:[['roughCloth',.42]],
 beetle:[['beetleCarapace',.38]],
 ghost:[['graveDust',.36]],
 blackrootGuardian:[['blackroot',.55]],
 leszy:[['blackroot',.28],['ancientRelic',.07]]
};
for(const [monster,rows] of Object.entries(CRAFT_MATERIAL_DROPS)){
 const loot=MONSTER_LOOT[monster]||[];
 for(const [id,chance] of rows)if(ITEMS[id]&&!loot.some(row=>row.id===id))loot.push({id,chance,min:1,max:1});
 MONSTER_LOOT[monster]=loot;
}

// Nazwane łupy są jedynymi elementami wyposażenia losowanymi z danego stwora.
// Wcześniejsze dopiski z dokumentu traktowały całe zestawy lub spodnie jako surowiec.
const LOOT_ROW=(id,chance=.045)=>({id,chance,min:1,max:1});
function replaceLootRows(monster,removeIds=[],add=[]){MONSTER_LOOT[monster]=addLootRows((MONSTER_LOOT[monster]||[]).filter(r=>!removeIds.includes(r.id)),add)}
const correctedGear=[
 ['mat_pierscien_badzacego_wedrowca','cg_ranger_12_ring','ring','rare',28],
 ['mat_nszyjnik_nocy','cg_mage_28_amulet','amulet','rare',30],
 ['mat_rozdzka_zaru','emberWand','weapon','epic',31],
 ['mat_bero_swietliste','stormStaff','weapon','epic',47],
 ['mat_trojzab_rozlewiska','stormSpear','weapon','epic',27],
 ['mat_korona_nawanicy','cg_mage_45_helmet','helmet','epic',45],
 ['mat_spodnie_tropiciela','trailBoots','legs','rare',16],
 ['mat_spodnie_widmo','trailBoots','legs','rare',49],
 ['mat_spodnie_pregowanego_tropiciela','trailBoots','legs','epic',14]
];
for(const [id,source,slot,rarity,level] of correctedGear){const old=ITEMS[id],base=ITEMS[source]||ITEMS.shortSword;if(!old)continue;ITEMS[id]={...base,...old,type:slot==='weapon'?'weapon':'gear',slot,rarity,reqLevel:level,value:Math.max(35,base.value||35),maxStack:undefined,classes:slot==='legs'?['hunter','ranger']:base.classes};delete ITEMS[id].visualId;for(const key of ['set','classGear','setName','setTwo','setThree','setClass','setLevel'])delete ITEMS[id][key]}
registerCuratedGear('drop_skorpion_naszyjnik_trucizny','Naszyjnik trucizny','cg_ranger_12_amulet',25,'rare',['ranger','hunter']);
replaceLootRows('skorpion',[],[LOOT_ROW('drop_skorpion_naszyjnik_trucizny',.04)]);
replaceLootRows('najemnik',['runeShard'],[LOOT_ROW('runeShadow',.09)]);
replaceLootRows('kosciej',['mat_unikat_tarczy_i_vos_dla_maga'],[]);
replaceLootRows('stormDrake',[],['drop_stormDrake_kaptur_smoczego_zwiadowcy','drop_stormDrake_kostur_mroku','drop_stormDrake_buty_smoczego_jezdzca','drop_stormDrake_pierscien_smoczego_rodu'].filter(id=>ITEMS[id]).map(id=>LOOT_ROW(id,.035)));
replaceLootRows('mlodyKraken',[],['drop_mlodyKraken_rekawice_wody','drop_mlodyKraken_zbroja_wodnego_krakena','drop_mlodyKraken_kostur_wody'].filter(id=>ITEMS[id]).map(id=>LOOT_ROW(id,.045)));
for(const id of ['drop_stormDrake_kaptur_smoczego_zwiadowcy','drop_stormDrake_kostur_mroku','drop_stormDrake_buty_smoczego_jezdzca','drop_stormDrake_pierscien_smoczego_rodu'])if(ITEMS[id])ITEMS[id].rarity='legendary';
for(const cls of Object.keys(CLASSES))for(const slot of ['armor','gloves','boots']){
 const id=`boss_goblinChampion_${cls}_${slot}`,source=`cg_${cls}_28_${slot}`;
 registerCuratedGear(id,`${({armor:'Pancerz',gloves:'Rękawice',boots:'Buty'})[slot]} Czempiona • ${CLASSES[cls].name}`,source,25,'heroic',[cls]);
 replaceLootRows('goblinChampion',[],[LOOT_ROW(id,.025)]);
}
for(const slot of ['ring','amulet']){
 const id=`boss_goblinChampion_mage_${slot}`;
 registerCuratedGear(id,`${slot==='ring'?'Pierścień':'Amulet'} Czempiona Arkanum`,`cg_mage_28_${slot}`,25,'heroic',['mage']);
 replaceLootRows('goblinChampion',[],[LOOT_ROW(id,.03)]);
}
replaceLootRows('goblinChampion',['drop_goblinChampion_zbroja','drop_goblinChampion_rekawice_i_buty_heroiczne_dla_kazdej_klasy','drop_goblinChampion_pierscien_i_naszyknik_dla_maga',...Object.keys(CLASSES).flatMap(cls=>['armor','gloves','boots'].map(slot=>`cg_${cls}_28_${slot}`)),'cg_mage_28_ring','cg_mage_28_amulet'],[]);
registerCuratedGear('drop_pyreKnight_ostrze_stosu','Ostrze Rycerza Stosu','shortSword',35,'rare',['knight','berserker']);
registerCuratedGear('drop_pyreKnight_pancerz_stosu','Pancerz Rycerza Stosu','chainVest',35,'rare',['knight','berserker']);
replaceLootRows('pyreKnight',[],[LOOT_ROW('drop_pyreKnight_ostrze_stosu',.055),LOOT_ROW('drop_pyreKnight_pancerz_stosu',.045)]);
registerCuratedGear('drop_frozenKnight_mroczny_helm','Hełm Zamarzniętego Strażnika','cg_knight_12_helmet',35,'rare',['knight','berserker']);
replaceLootRows('frozenKnight',[],[LOOT_ROW('drop_frozenKnight_mroczny_helm',.05)]);
// Stale odświeżany asortyment klasowy. Sprzęt wyprawowy jest zwykły,
// niezwykły lub rzadki; wyjątkowe trofea wciąż pochodzą tylko od stworów.
const MERCHANT_TIER_NAMES=['Wędrowca','Traktu','Pogranicza','Mokradeł','Wyżyn','Nawałnicy','Niebios','Pradawnego Szlaku'];
const MERCHANT_TIER_LEVELS=[1,12,25,40,55,70,85,100];
const MERCHANT_WEAPONS={knight:'shortSword',mage:'apprenticeStaff',hunter:'hunterBow',berserker:'ironAxe',ranger:'primitiveBow'};
const MERCHANT_SLOT_NAMES={weapon:{knight:'Miecz',mage:'Kostur',hunter:'Łuk',berserker:'Topór',ranger:'Łuk'},armor:{knight:'Napierśnik',mage:'Szata',hunter:'Pancerz',berserker:'Napierśnik',ranger:'Skórznia'},helmet:{knight:'Hełm',mage:'Kaptur',hunter:'Hełm',berserker:'Hełm',ranger:'Kaptur'},gloves:{knight:'Rękawice',mage:'Rękawice',hunter:'Rękawice',berserker:'Karwasze',ranger:'Rękawice'},boots:{knight:'Buty',mage:'Buty',hunter:'Buty',berserker:'Buty',ranger:'Buty'},offhand:{knight:'Tarcza',mage:'Fokus',hunter:'Kołczan',berserker:'Topór zapasowy',ranger:'Zestaw pułapek'}};
for(let tier=0;tier<MERCHANT_TIER_LEVELS.length;tier++)for(const cls of Object.keys(CLASSES))for(const slot of Object.keys(MERCHANT_SLOT_NAMES)){
 const level=MERCHANT_TIER_LEVELS[tier],id=`shop_${cls}_${level}_${slot}`,source=slot==='weapon'||cls==='berserker'&&slot==='offhand'?MERCHANT_WEAPONS[cls]:`cg_${cls}_12_${slot}`;
 const src=ITEMS[source]||ITEMS.shortBlade,actualSlot=cls==='berserker'&&slot==='offhand'?'weapon':slot;
 const d={...src,id,name:`${MERCHANT_SLOT_NAMES[slot][cls]} ${MERCHANT_TIER_NAMES[tier]} • ${CLASSES[cls].name}`,slot:actualSlot,reqLevel:level,rarity:tier===0?'common':tier===1?'uncommon':'rare',classes:[cls],value:Math.round(20+level*(slot==='weapon'?9:6)),merchantStock:true};
 for(const key of ['set','classGear','setName','setTwo','setThree','setClass','setLevel','artFile','bossUnique','bossSource','build','perk'])delete d[key];
 if(actualSlot==='weapon'){d.damage=[Math.round(2+level*.58),Math.round(5+level*.90)];d.power=Math.round(1+level*.20);d.crit=cls==='hunter'||cls==='ranger'?Math.min(4,Math.floor(level/28)):0}
 else{d.armor=Math.round((slot==='armor'?3:slot==='offhand'?2:1)+level*(slot==='armor'?.38:slot==='offhand'?.25:.17));d.power=Math.round(level*.055);delete d.damage}
 ITEMS[id]=d;
}
for(const id of ['drop_pyreKnight_ostrze_stosu','drop_pyreKnight_pancerz_stosu','drop_frozenKnight_mroczny_helm',...Object.keys(CLASSES).flatMap(cls=>['armor','gloves','boots'].map(slot=>`boss_goblinChampion_${cls}_${slot}`)),'boss_goblinChampion_mage_ring','boss_goblinChampion_mage_amulet']){
 const d=ITEMS[id];if(!d)continue;delete d.set;delete d.classGear;delete d.setName;delete d.setTwo;delete d.setThree;delete d.setClass;delete d.setLevel;
}
for(const d of Object.values(ITEMS))if(d.slot&&!d.merchantPlain){
 const seed=[...d.id].reduce((h,ch)=>(h*33+ch.charCodeAt(0))>>>0,7);
 if(seed%3===0){const stat=d.classes?.includes('mage')?'int':d.classes?.includes('hunter')||d.classes?.includes('ranger')?'agi':seed%2?'str':'vit';d[stat] ||= 1+Math.min(3,Math.floor((d.reqLevel||1)/28));if(seed%5===0&&stat!=='str')d.str ||= 2}
}
// Ranga stwora wyznacza najwyższą rzadkość jego sprzętu.
const rankGearCap={'Zwykły':2,'Elita':3,'Heros':4,'Legenda':5};
for(const m of MONSTERS){const cap=rankGearCap[m.rank]??2;MONSTER_LOOT[m.id]=(MONSTER_LOOT[m.id]||[]).filter(r=>{const d=ITEMS[r.id];return !d?.slot||['common','uncommon','rare','epic','heroic','legendary'].indexOf(d.rarity)<=cap})}
const recategorized=new Set(correctedGear.map(row=>row[0]));
for(const rows of Object.values(MONSTER_LOOT))for(const row of rows)if(recategorized.has(row.id))row.chance=Math.min(row.chance,ITEMS[row.id].rarity==='epic'?.04:.07);
// Aktywne pule nie pokazują już roboczych wpisów z dokumentu ("jakieś itemy", "dla każdej klasy").
MONSTER_LOOT.rusalka=addLootRows(
 (MONSTER_LOOT.rusalka||[]).filter(x=>x.id!=='mat_jakies_unikaty_dla_maga'),
 [
  {id:'drop_rusalka_diadem_topieli',chance:.055,min:1,max:1},
  {id:'drop_rusalka_fokus_zielonej_fali',chance:.055,min:1,max:1},
  {id:'drop_rusalka_pierscien_glebiny',chance:.055,min:1,max:1}
 ]
);
MONSTER_LOOT.goblinMage=(MONSTER_LOOT.goblinMage||[]).filter(x=>x.id!=='drop_goblinMage_pierscienie_i_naszyjnik_dla_kazdej_klasy');
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
const playerMotion={heading:180,speed:0,moving:false,movingUntil:0,lastAt:0};
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
const CITY_MAX_LEVEL=3;
const CITY_UPGRADE_RULES={
 tavern:{name:'Karczma',icon:'🍺',costs:{2:{gold:260,scrap:2},3:{gold:700,scrap:5}},effects:{1:'4 aktywne zadania',2:'5 aktywnych zadań',3:'6 aktywnych zadań'}},
 shop:{name:'Sklep',icon:'🛒',costs:{2:{gold:320,scrap:2},3:{gold:850,scrap:6}},effects:{1:'ceny bazowe',2:'−5% cen kupna',3:'−10% cen kupna'}},
 smith:{name:'Kuźnia',icon:'⚒️',costs:{2:{gold:380,scrap:4},3:{gold:980,scrap:8}},effects:{1:'standardowe ulepszenia',2:'−6% kosztów kuźni',3:'−12% kosztów kuźni'}},
 alchemist:{name:'Alchemik',icon:'⚗️',costs:{2:{gold:300,scrap:2},3:{gold:760,scrap:5}},effects:{1:'mikstury i receptury',2:'−6% cen alchemika',3:'−12% cen alchemika'}},
 auction:{name:'Dom aukcyjny',icon:'🏛️',costs:{2:{gold:520,scrap:4},3:{gold:1350,scrap:9}},effects:{1:'3 własne aukcje',2:'5 własnych aukcji',3:'8 własnych aukcji'}},
 guild:{name:'Sala gildii',icon:'🏰',costs:{2:{gold:650,scrap:5},3:{gold:1600,scrap:10}},effects:{1:'standardowa reputacja',2:'+10% reputacji',3:'+20% reputacji'}}
};
const CITY_RADIUS=180;
const CITY_MOVE_COOLDOWN=30*24*60*60*1000;
function ensureCityState(s=state){if(!s)return;s.city ||= {buildings:{}};s.city.buildings ||= {};for(const b of BUILDINGS)s.city.buildings[b.id]=clamp(Number(s.city.buildings[b.id]||1),1,CITY_MAX_LEVEL);s.city.x=Number.isFinite(Number(s.city.x))?Number(s.city.x):0;s.city.y=Number.isFinite(Number(s.city.y))?Number(s.city.y):0;s.city.placed ??= !!s.world?.gpsOrigin;s.city.placedAt ||= s.city.placed?(s.created||Date.now()):0}
function cityDistance(s=state){if(!s?.player?.position)return Infinity;ensureCityState(s);return s.city.placed?dist(s.player.position,s.city):Infinity}
function insideCity(s=state){return cityDistance(s)<=CITY_RADIUS}
function mobileCityServices(){return SAVE_KEY!==DEMO_SAVE_KEY&&typeof window!=='undefined'&&window.innerWidth<=900}
function cityServiceAccess(){if(!mobileCityServices())return true;if(!state.city.placed){toast('Włącz GPS i postaw swoje miasto w wybranym miejscu.');return false}if(!insideCity()){toast(`Miasto jest poza zasięgiem. Podejdź do jego obszaru ${CITY_RADIUS} m na mapie.`);return false}return gpsInteractionReady()}
function placeCityHere(){
 if(state.player.position.virtualTravel)return toast('Nie można postawić miasta w trybie podróży domowej.');
 if(!gpsInteractionReady())return;
 ensureCityState();
 if(state.city.placed){const remaining=CITY_MOVE_COOLDOWN-(Date.now()-state.city.placedAt);if(remaining>0)return toast(`Miasto można przenieść za ${Math.ceil(remaining/86400000)} dni.`);if(!confirm('Przenieść miasto w bieżące miejsce? Kolejna zmiana będzie możliwa za 30 dni.'))return}
 state.city.x=state.player.position.x;state.city.y=state.player.position.y;state.city.placed=true;state.city.placedAt=Date.now();state.world.living.spawnKey='';ensureLivingWorld();save();toast('🏰 Miasto zostało oznaczone na mapie. Zasięg usług: 180 m.');
 if(currentTab==='town')renderTown(document.querySelector('#viewport'));else if(currentTab==='map')rebuildGameLayers();
}
function buildingLevel(id){ensureCityState();return clamp(Number(state.city.buildings[id]||1),1,CITY_MAX_LEVEL)}
function cityUpgradeCost(id){const lvl=buildingLevel(id),next=Math.min(CITY_MAX_LEVEL,lvl+1);return CITY_UPGRADE_RULES[id]?.costs?.[next]||null}
function cityUpgradeEffect(id,lvl=buildingLevel(id)){return CITY_UPGRADE_RULES[id]?.effects?.[lvl]||''}
function activeTaskLimit(){return 3+buildingLevel('tavern')}
function auctionListingLimit(){return ({1:3,2:5,3:8})[buildingLevel('auction')]||3}
function cityDiscount(id){const lvl=buildingLevel(id);return lvl===3?.12:lvl===2?.06:0}
function shopDiscount(){const lvl=buildingLevel('shop');return lvl===3?.10:lvl===2?.05:0}
function guildRepMultiplier(){const lvl=buildingLevel('guild');return lvl===3?1.20:lvl===2?1.10:1}

/* 3.9.6.4 — alchemy licenses + open Hero/Legend challenges (party optional) */
const ALCHEMY_READY_STOCK=[
 {id:'potion',price:38},{id:'potion100',price:72},{id:'strongPotion',price:92},{id:'potion150',price:112},{id:'potion200',price:148},
 {id:'manaPotion',price:44},{id:'manaPotion100',price:78},{id:'manaPotion150',price:118},{id:'manaPotion200',price:156},{id:'antidote',price:34}
];
const ALCHEMY_RECIPE_OFFERS={
 potion:{uses:8,price:72},manaPotion:{uses:7,price:88},strongPotion:{uses:5,price:120},antidote:{uses:8,price:64},
 strongPotion2:{uses:10,price:175},manaPotion2:{uses:8,price:160},
 potion100:{uses:8,price:92},potion150:{uses:7,price:130},potion200:{uses:6,price:165},
 manaPotion100:{uses:8,price:100},manaPotion150:{uses:7,price:135},manaPotion200:{uses:6,price:170}
};
const TEST_PARTY_CANDIDATES=[
 {id:'ai_lyra',name:'Lyra',class:'ranger',icon:'🏹'},
 {id:'ai_bran',name:'Bran',class:'knight',icon:'🛡️'},
 {id:'ai_ves',name:'Ves',class:'mage',icon:'🔮'}
];
const GROUP_RAIDS={
 hero:{label:'Heros',icon:'⚔️',recommendedParty:'2–4',soloLevelGap:5,levelBand:.55,daily:3,hp:2.8,atk:1.18,rep:12,gold:90,partyHp:[1,1.65,2.20,2.70],monsterPool:['goblinChampion','pyreKnight','frozenKnight','blackrootGuardian']},
 legend:{label:'Legenda',icon:'👑',recommendedParty:'3–4',soloLevelGap:10,levelBand:.78,daily:1,hp:4.9,atk:1.34,rep:35,gold:260,partyHp:[1,1.80,2.50,3.20],monsterPool:['graveColossus','stormDrake','tempestLord','abyssHydra']}
};
function ensureAlchemyState(s=state){if(!s)return;s.alchemy ||= {recipeUses:{}};s.alchemy.recipeUses ||= {};}
const GUILD_BUILDING_RULES={
 scout:{name:'Wieża Zwiadowców',icon:'🗼',max:10,desc:'Zwiększa zasięg rozpoczęcia walki z potworami o 2 m na poziom. Działa na członków gildii niezależnie od miejsca.',baseGold:220,baseScrap:1},
 forge:{name:'Kuźnia Gildii',icon:'⚒️',max:5,desc:'Zmniejsza koszt złota ulepszania ekwipunku o 2% na poziom.',baseGold:360,baseScrap:2},
 alchemist:{name:'Pracownia Alchemika',icon:'⚗️',max:5,desc:'Kupowane receptury otrzymują dodatkowe użycia wraz z rozwojem pracowni.',baseGold:320,baseScrap:1},
 expedition:{name:'Sala Wypraw',icon:'🧭',max:5,desc:'Zwiększa nagrody reputacji i złota za Herosów oraz Legendy o 3% na poziom.',baseGold:470,baseScrap:2},
 trophy:{name:'Sala Trofeów',icon:'🏆',max:5,desc:'Rejestruje najważniejsze zwycięstwa gildii i zwiększa poziom jej rozwoju.',baseGold:300,baseScrap:1}
};
const GUILD_MEMBER_RANKS=[
 {rank:'E',kills:50},{rank:'D',kills:150},{rank:'C',kills:400},{rank:'B',kills:800},{rank:'A',kills:1500},{rank:'S',kills:3000},{rank:'SS',kills:6000}
];
function ensureGuildMembershipProgress(s=state){
 if(!s?.player)return null;
 const guild=String(s.player.guild||'');
 if(!guild){s.player.guildMembership={guildName:'',joinedAt:0,kills:0,heroKills:0,legendKills:0};return null}
 const current=s.player.guildMembership;
 if(!current||current.guildName!==guild){s.player.guildMembership={guildName:guild,joinedAt:Date.now(),kills:0,heroKills:0,legendKills:0}}
 const rec=s.player.guildMembership;
 rec.joinedAt=Number(rec.joinedAt||Date.now());rec.kills=Math.max(0,Math.floor(Number(rec.kills||0)));rec.heroKills=Math.max(0,Math.floor(Number(rec.heroKills||0)));rec.legendKills=Math.max(0,Math.floor(Number(rec.legendKills||0)));
 return rec
}
function guildMemberRankInfo(kills=null){
 const rec=ensureGuildMembershipProgress();const n=Math.max(0,Math.floor(Number(kills==null?(rec?.kills||0):kills)));
 let idx=-1;for(let i=0;i<GUILD_MEMBER_RANKS.length;i++)if(n>=GUILD_MEMBER_RANKS[i].kills)idx=i;
 const current=idx>=0?GUILD_MEMBER_RANKS[idx]:null,next=GUILD_MEMBER_RANKS[idx+1]||null;
 return {rank:current?.rank||'Nowicjusz',kills:n,nextRank:next?.rank||null,nextKills:next?.kills||null,progress:next?Math.min(100,n/next.kills*100):100}
}
function recordGuildMonsterKill(raidTier=null){
 if(!state.player.guild)return;
 const rec=ensureGuildMembershipProgress();if(!rec)return;
 const before=guildMemberRankInfo(rec.kills).rank;rec.kills++;
 if(raidTier==='hero')rec.heroKills++;if(raidTier==='legend')rec.legendKills++;
 const after=guildMemberRankInfo(rec.kills).rank;
 if(after!==before&&after!=='Nowicjusz')guildLog(`${state.player.name||'Gracz'} awansuje na rangę gildyjną ${after} po ${rec.kills} zabitych potworach.`)
}
function ensureSocialState(s=state){
 if(!s)return;
 s.social ||= {party:{members:[]},raids:{day:daySeed(),heroWins:0,legendWins:0,history:[]}};
 s.social.party ||= {members:[]};s.social.party.members ||= [];
 s.social.raids ||= {day:daySeed(),heroWins:0,legendWins:0,history:[]};
 if(s.social.raids.day!==daySeed()){s.social.raids.day=daySeed();s.social.raids.heroWins=0;s.social.raids.legendWins=0}
 s.social.raids.history ||= [];
 s.social.guild ||= {};
 const g=s.social.guild;
 g.name ||= s.player?.guild||'';
 if(s.player?.guild&&!g.name)g.name=s.player.guild;
 g.treasury ||= {gold:0,scrap:0,crystal:0,runeShard:0};
 for(const k of ['gold','scrap','crystal','runeShard'])g.treasury[k]=Math.max(0,Number(g.treasury[k]||0));
 g.buildings ||= {};
 for(const id of Object.keys(GUILD_BUILDING_RULES))g.buildings[id]=clamp(Number(g.buildings[id]||0),0,GUILD_BUILDING_RULES[id].max);
 g.contributions ||= {};
 g.ownerName ||= s.player?.name||'';
 g.requests ||= [];
 g.warehouse ||= {};
 g.contracts ||= [];
 const today=daySeed();
 if(s.player?.guild&&g.contractDay!==today){
  const carried=g.contracts.filter(c=>c.accepted&&!c.claimed).slice(0,2);
  g.contracts=[...carried,...makeGuildContracts(today,s.player.level||1).filter(c=>!carried.some(old=>old.target===c.target))].slice(0,4);
  g.contractDay=today;
 }
 g.log ||= [];
 g.log=g.log.slice(0,30);
 ensureGuildMembershipProgress(s);
}
function guildState(){ensureSocialState();return state.social.guild}
function guildBuildingLevel(id){const rule=GUILD_BUILDING_RULES[id];if(!rule)return 0;return clamp(Number(guildState().buildings[id]||0),0,rule.max)}
function guildLevel(){const total=Object.keys(GUILD_BUILDING_RULES).reduce((a,id)=>a+guildBuildingLevel(id),0);return clamp(1+Math.floor(total/3),1,20)}
function guildMonsterAttackRadius(){return Math.min(80,60+guildBuildingLevel('scout')*2)}
function entityInteractionRadius(e){return e?.type==='monster'?guildMonsterAttackRadius():60}
function guildForgeDiscount(){return Math.min(.10,guildBuildingLevel('forge')*.02)}
function guildAlchemyExtraUses(){return Math.floor(guildBuildingLevel('alchemist')/2)}
function guildExpeditionBonus(){return 1+guildBuildingLevel('expedition')*.03}
function guildBuildingCost(id){const rule=GUILD_BUILDING_RULES[id];if(!rule)return null;const next=guildBuildingLevel(id)+1;if(next>rule.max)return null;return {gold:Math.ceil(rule.baseGold*next*next),scrap:Math.max(1,Math.ceil(rule.baseScrap*next*.9)),crystal:next>=4?Math.floor(next/4):0,runeShard:next>=8?1:0}}
function guildCostText(cost){if(!cost)return 'MAX';const parts=[`${cost.gold} 🪙`,`${cost.scrap} złomu`];if(cost.crystal)parts.push(`${cost.crystal} krysz.`);if(cost.runeShard)parts.push(`${cost.runeShard} odł. run.`);return parts.join(' • ')}
function guildLog(textValue){const g=guildState();g.log.unshift({at:Date.now(),text:String(textValue||'').slice(0,140)});g.log=g.log.slice(0,30)}
const GUILD_REQUEST_MATERIALS=['wolfPelt','spiderSilk','bone','ectoplasm','venomGland','moonHerb','bogAmber','charredIron','frostCrystal','stormFeather','scrap','crystal','runeShard'].filter(id=>ITEMS[id]);
function makeGuildContracts(day,level){
 const floor=Math.max(1,level-30);
 const targets=['slime','beetle','wolf','goblin','spider','skeleton','ghost','cultist','demon','wyvern']
  .map(id=>MONSTERS.find(m=>m.id===id)).filter(m=>m&&m.min<=level+4&&m.min>=floor);
 const pool=targets.length>=3?targets:MONSTERS.filter(m=>m.min<=level+4&&m.min>=floor&&m.rank!=='Legenda');
 const offset=pool.length?Math.floor(seeded(day*41+level*13)*pool.length):0;
 return Array.from({length:Math.min(3,pool.length)},(_,i)=>{
  const m=pool[(offset+i)%pool.length],need=3+i;
  return {id:`contract_${day}_${m.id}_${i}`,target:m.id,name:`Tropem: ${m.name}`,need,progress:0,accepted:false,claimed:false,xp:Math.round((80+level*14)*(1+i*.2)),gold:25+level*4+i*12,rep:3+i*2};
 });
}
function acceptGuildContract(id){
 if(!state.player.guild)return toast('Najpierw załóż gildię.');
 const g=guildState(),c=g.contracts.find(x=>x.id===id);if(!c||c.accepted||c.claimed)return;
 if(g.contracts.filter(x=>x.accepted&&!x.claimed).length>=2)return toast('Możesz prowadzić dwa kontrakty Edrina naraz.');
 c.accepted=true;save();openBuilding('guild','service');toast(`Przyjęto kontrakt: ${c.name}.`)
}
function progressGuildContracts(monsterId){
 if(!state.player.guild)return;
 for(const c of guildState().contracts)if(c.accepted&&!c.claimed&&monsterTargetMatches(c.target,monsterId))c.progress=Math.min(c.need,(c.progress||0)+1)
}
function claimGuildContract(id){
 const c=guildState().contracts.find(x=>x.id===id);if(!c||!c.accepted||c.claimed||c.progress<c.need)return;
 c.claimed=true;state.player.gold+=c.gold;const rep=Math.max(1,Math.round(c.rep*guildRepMultiplier()));state.adventure.reputation+=rep;gainXp(c.xp);
 guildLog(`${state.player.name} kończy kontrakt Edrina: ${c.name}.`);save();openBuilding('guild','service');toast(`Kontrakt: +${c.xp} XP • +${c.gold} 🪙 • +${rep} reputacji`)
}
function postGuildRequest(itemId,goal){
 if(!state.player.guild)return toast('Najpierw załóż gildię.');
 const g=guildState();if(g.ownerName!==state.player.name)return toast('Zlecenia na tablicy wystawia założyciel gildii.');
 if(!GUILD_REQUEST_MATERIALS.includes(itemId))return toast('Wybierz materiał z listy.');
 if(g.requests.filter(x=>!x.completed).length>=3)return toast('Tablica mieści najwyżej trzy otwarte potrzeby.');
 goal=Math.floor(Number(goal));if(![3,5,10].includes(goal))return toast('Wybierz cel: 3, 5 lub 10 sztuk.');
 const request={id:`need_${Date.now()}_${Math.floor(Math.random()*1e6)}`,itemId,goal,delivered:0,creator:state.player.name,accepted:false,completed:false,createdAt:Date.now()};
 g.requests.unshift(request);g.requests=g.requests.slice(0,15);guildLog(`${state.player.name} szuka ${goal}× ${itemDef(itemId).name}.`);save();openBuilding('guild','service');toast('Potrzeba dodana do tablicy gildii.')
}
function acceptGuildRequest(id){
 const r=guildState().requests.find(x=>x.id===id);if(!r||r.completed||r.accepted)return;
 r.accepted=true;save();openBuilding('guild','service');toast(`Przyjęto: ${r.goal}× ${itemDef(r.itemId).name}.`)
}
function deliverGuildRequest(id){
 const g=guildState(),r=g.requests.find(x=>x.id===id);if(!r||!r.accepted||r.completed)return;
 const remaining=r.goal-r.delivered,amount=Math.min(remaining,countItem(r.itemId));if(amount<=0)return toast(`Potrzebujesz: ${itemDef(r.itemId).name}.`);
 if(!removeItem(r.itemId,amount))return;
 r.delivered+=amount;g.warehouse[r.itemId]=(g.warehouse[r.itemId]||0)+amount;
 const who=state.player.name;g.contributions[who]||={gold:0,materials:0};g.contributions[who].materials+=amount;
 if(r.delivered>=r.goal){r.completed=true;const rep=Math.max(1,Math.round((4+Math.ceil(r.goal/2))*guildRepMultiplier()));state.adventure.reputation+=rep;guildLog(`${who} zamyka potrzebę: ${r.goal}× ${itemDef(r.itemId).name}.`);toast(`Potrzeba wykonana • +${rep} reputacji gildii`)}
 else toast(`Przekazano ${amount}× ${itemDef(r.itemId).name} (${r.delivered}/${r.goal}).`);
 save();openBuilding('guild','service')
}
function contributeGuild(kind,amount){
 if(!state.player.guild)return toast('Najpierw załóż gildię.');
 ensureSocialState();amount=Math.max(1,Math.floor(Number(amount)||0));const g=guildState();
 if(kind==='gold'){if(state.player.gold<amount)return toast('Za mało złota.');state.player.gold-=amount;g.treasury.gold+=amount}
 else{if(!['scrap','crystal','runeShard'].includes(kind))return;if(countItem(kind)<amount)return toast(`Brakuje: ${amount}× ${itemDef(kind).name}.`);removeItem(kind,amount);g.treasury[kind]+=amount}
 const who=state.player.name||'Gracz';g.contributions[who]||={gold:0,materials:0};if(kind==='gold')g.contributions[who].gold+=amount;else g.contributions[who].materials+=amount;guildLog(`${who} wpłaca ${kind==='gold'?amount+' złota':amount+'× '+itemDef(kind).name}.`);save();openBuilding('guild','service');toast('Wpłata trafiła do skarbca gildii.')
}
function upgradeGuildBuilding(id){
 if(!state.player.guild)return toast('Najpierw załóż gildię.');
 const rule=GUILD_BUILDING_RULES[id],cost=guildBuildingCost(id),g=guildState();if(!rule||!cost)return toast('Ten budynek ma już maksymalny poziom.');
 for(const k of ['gold','scrap','crystal','runeShard'])if((g.treasury[k]||0)<(cost[k]||0))return toast(`Skarbiec gildii nie ma zasobów na ulepszenie: ${guildCostText(cost)}.`);
 for(const k of ['gold','scrap','crystal','runeShard'])g.treasury[k]-=cost[k]||0;g.buildings[id]=guildBuildingLevel(id)+1;guildLog(`${rule.name} osiąga poziom ${g.buildings[id]}.`);save();openBuilding('guild','service');toast(`${rule.name}: poziom ${g.buildings[id]}/${rule.max}.`)
}

function alchemyFeaturedId(){return ALCHEMY_READY_STOCK[merchantCycle()%ALCHEMY_READY_STOCK.length].id}
function alchemyReadyPrice(row){return Math.max(1,Math.ceil(row.price*(1-cityDiscount('alchemist'))*(row.id===alchemyFeaturedId() ? .9 : 1)))}
function alchemyRecipeOffer(id){return ALCHEMY_RECIPE_OFFERS[id]||{uses:5,price:100}}
function alchemyRecipePrice(id){return Math.max(1,Math.ceil(alchemyRecipeOffer(id).price*(1-cityDiscount('alchemist'))))}
function alchemyCraftFee(r){return Math.max(1,Math.ceil(craftFee(r)*.32))}
function alchemyRecipeUses(id){ensureAlchemyState();return Math.max(0,Number(state.alchemy.recipeUses[id]||0))}
function buyAlchemyRecipe(id){ensureAlchemyState();const r=RECIPES.find(x=>x.id===id&&x.station==='alchemist');if(!r)return;const offer=alchemyRecipeOffer(id),price=alchemyRecipePrice(id);if(state.player.gold<price)return toast(`Potrzebujesz ${price} 🪙.`);state.player.gold-=price;state.alchemy.recipeUses[id]=alchemyRecipeUses(id)+offer.uses+guildAlchemyExtraUses();save();openBuilding('alchemist','service');toast(`Kupiono recepturę: ${r.name} • +${offer.uses+guildAlchemyExtraUses()} użyć • -${price} 🪙`)}
function guildPartyMembers(){ensureSocialState();return state.social.party.members}
function guildPartySize(){return 1+guildPartyMembers().length}
function addTestPartyMember(){ensureSocialState();const have=new Set(guildPartyMembers().map(x=>x.id)),next=TEST_PARTY_CANDIDATES.find(x=>!have.has(x.id));if(!next)return toast('Drużyna testowa jest już pełna (4/4).');state.social.party.members.push({...next,level:state.player.level,ai:true});save();openBuilding('guild','service');toast(`${next.name} dołącza do drużyny testowej.`)}
function clearTestParty(){ensureSocialState();state.social.party.members=[];save();openBuilding('guild','service');toast('Drużyna testowa została rozwiązana.')}
function raidDef(tier){return GROUP_RAIDS[tier]||GROUP_RAIDS.hero}
function raidWinsToday(tier){ensureSocialState();return Number(state.social.raids[`${tier}Wins`]||0)}
function raidMonster(tier){const d=raidDef(tier),idx=(daySeed()+(tier==='legend'?7:0))%d.monsterPool.length;return MONSTERS.find(m=>m.id===d.monsterPool[idx])||worldBossDef()}
function raidEncounterLevel(tier,m=raidMonster(tier)){if(!m)return 1;const d=raidDef(tier),span=Math.max(0,m.max-m.min),base=m.min+Math.round(span*(d.levelBand??.6)),wobble=((daySeed()+stableTextSeed(`${tier}_${m.id}`))%3)-1;return clamp(base+wobble,m.min,m.max)}
function raidSoloRecommendedLevel(tier,enemyLevel){const d=raidDef(tier);return Math.min(100,Math.max(1,Number(enemyLevel||1)+(d.soloLevelGap||0)))}
function raidPartyHpMultiplier(tier,size=1){const curve=raidDef(tier).partyHp||[1,1.65,2.2,2.7],n=Math.max(1,Math.min(4,Number(size)||1));return Number(curve[n-1]||curve.at(-1)||1)}
function partyMemberVsEnemyLevelMultiplier(memberLevel,enemyLevel){const gap=(Number(enemyLevel)||1)-(Number(memberLevel)||1);return gap>0?Math.max(.72,1-Math.min(20,gap)*.03):Math.min(1.20,1+Math.min(20,-gap)*.015)}
function raidRewardProfile(c=combat){
 if(!c?.raidTier)return {scale:1,fullLoot:true,damageShare:1,levelGap:0,actions:0};
 const partySize=1+(c.partyMembers?.length||0),actions=Number(c.raidPlayerActions||0),playerDamage=Number(c.raidPlayerDamage||0),partyDamage=Number(c.raidPartyDamage||0),damageShare=playerDamage/Math.max(1,playerDamage+partyDamage),levelGap=(Number(c.level)||1)-(state.player.level||1);
 if(partySize<=1)return {scale:1,fullLoot:true,damageShare,levelGap,actions};
 const levelScale=levelGap<=8?1:levelGap<=12?.75:levelGap<=16?.45:.25;
 const activityScale=(actions>=3||damageShare>=.05)?1:(actions>=2||damageShare>=.02)?.65:.30;
 const scale=Math.min(levelScale,activityScale);
 return {scale,fullLoot:scale>=.999,damageShare,levelGap,actions};
}
function startGuildRaid(tier){ensureSocialState();const d=raidDef(tier),size=guildPartySize(),wins=raidWinsToday(tier);if(wins>=d.daily)return toast(`Dzisiejszy limit: ${d.daily}/${d.daily} walk typu ${d.label}.`);const m=raidMonster(tier);if(!m)return toast('Nie znaleziono przeciwnika wyprawy.');const level=raidEncounterLevel(tier,m),soloRecommended=raidSoloRecommendedLevel(tier,level),e={id:`raid_${tier}_${daySeed()}_${Date.now()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};if(size===1&&state.player.level<soloRecommended)toast(`⚠️ ${d.label} lvl ${level}: solo zalecany jest około lvl ${soloRecommended}+. Możesz spróbować mimo ryzyka.`);startCombat(e,{level,raid:{tier,recommendedParty:d.recommendedParty,soloRecommended,party:guildPartyMembers().map(x=>({...x}))}})}
function raidIncomingMultiplier(){if(!combat?.raidTier)return 1;const allies=(combat.partyMembers||[]).filter(m=>(m.hp??1)>0).length;return Math.max(.76,1-allies*.06)}
function prepareCombatPartyMembers(rows=[]){return rows.map((m,index)=>{const level=Math.max(1,Number(m.level||state.player.level||1)),cls=CLASSES[m.class]||CLASSES.knight,maxHp=Math.max(70,Math.floor(72+level*10+(cls.base?.vit||5)*5));return {...m,_combatId:`ally-${index}`,maxHp,hp:maxHp}})}
function activeRaidAllies(){return (combat?.partyMembers||[]).filter(m=>(m.hp||0)>0)}
function raidPartyAssist(){if(!combat?.raidTier||!combat.partyMembers?.length||combat.hp<=0)return 0;let total=0;const details=[];for(const member of activeRaidAllies()){const memberLevel=Number(member.level||state.player.level),classMult=member.class==='mage'?1.08:member.class==='ranger'?1.02:member.class==='knight'?.90:1,levelMult=partyMemberVsEnemyLevelMultiplier(memberLevel,combat.level),relativePower=Math.max(.72,Math.min(1.35,1+(memberLevel-state.player.level)*.025)),dmg=Math.max(2,Math.floor(attackPower()*.30*classMult*levelMult*relativePower*(.88+Math.random()*.24)));total+=dmg;details.push(`${member.name} lvl ${memberLevel}: ${dmg}`)}combat.hp-=total;combat.raidPartyDamage=(combat.raidPartyDamage||0)+total;combat.lastPlayerHit=(combat.lastPlayerHit||0)+total;if(combat.isBoss)addStagger(Math.min(14,4+activeRaidAllies().length*3));if(details.length)logCombat(`🤝 Drużyna atakuje: ${details.join(' • ')} • razem ${total}.`);return total}
function enemyAttackRaidAlly(){if(!combat?.raidTier)return false;const allies=activeRaidAllies();if(!allies.length||Math.random()>=.30)return false;const member=pick(allies),defMult=member.class==='knight'?.72:member.class==='berserker'?.86:member.class==='ranger'?.88:member.class==='hunter'?.92:1,dmg=Math.max(1,Math.floor(combat.atk*(.72+Math.random()*.24)*defMult));member.hp=Math.max(0,member.hp-dmg);combat.lastEnemyHit=null;setCombatTaken(0,`ATAK NA ${member.name}`);logCombat(`🎯 ${combat.monster.name} atakuje ${member.name} za ${dmg}. ${member.hp<=0?'Sojusznik zostaje powalony!':`HP ${member.hp}/${member.maxHp}.`}`);return true}
function mageHealTargets(){if(!combat)return[];const p=state.player,out=[{key:'self',name:p.name||'Ty',hp:p.hp,maxHp:p.maxHp,self:true}];for(const m of combat.partyMembers||[])out.push({key:m._combatId,name:m.name||'Sojusznik',hp:m.hp||0,maxHp:m.maxHp||1,self:false,down:(m.hp||0)<=0});return out}
function mageHealTargetByKey(key){if(key==='self')return {kind:'self',target:state.player};const target=(combat?.partyMembers||[]).find(m=>m._combatId===key);return target?{kind:'ally',target}:null}
function mageHealAmount(skill,target){const maxHp=Math.max(1,target.maxHp||1),intStat=Math.max(0,Number(state.player.stats.int||0)+gearStat('int'));return Math.max(1,Math.floor(maxHp*(skill.healPct||.16)+intStat*(skill.healInt||.8)))}
function castMageHeal(skill,targetKey){const row=mageHealTargetByKey(targetKey),target=row?.target;if(!target||(row.kind==='ally'&&target.hp<=0))return 0;const before=target.hp,amount=mageHealAmount(skill,target);target.hp=Math.min(target.maxHp,target.hp+amount);const restored=target.hp-before;if(restored>0){trialStat('healingDone',restored);if(row.kind==='ally')trialStat('allyHealingDone',restored);playSfx('heal');logCombat(`✨ ${skill.name}: ${row.kind==='self'?'odzyskujesz':`${target.name} odzyskuje`} ${restored} HP.`)}return restored}
function upgradeCityBuilding(id){ensureCityState();const rule=CITY_UPGRADE_RULES[id],cost=cityUpgradeCost(id);if(!rule||!cost)return toast('Ten budynek ma już maksymalny poziom.');if(state.player.gold<cost.gold)return toast(`Potrzebujesz ${cost.gold} 🪙.`);if(countItem('scrap')<cost.scrap)return toast(`Potrzebujesz ${cost.scrap}× Złomu.`);state.player.gold-=cost.gold;removeItem('scrap',cost.scrap);state.city.buildings[id]=buildingLevel(id)+1;save();renderShell();toast(`${rule.name}: poziom ${state.city.buildings[id]} odblokowany.`)}

const TUTORIAL_STEPS=[
 {id:'move',title:'1. Rusz w świat',text:'Jesteś na MAPIE. W prawdziwej grze włącz GPS, a w zapisie testowym użyj strzałek. Oddal się co najmniej 60 m od punktu startowego.',go:'map',action:'Pokaż mapę'},
 {id:'kill',title:'2. Pierwsza walka',text:'Na mapie pojawi się treningowy Błotny Pełzacz lvl 1. Podejdź do niego i wybierz WALKA → ATAK. To bezpieczna pierwsza walka, a zwycięstwo gwarantuje przedmiot klasowy i zalicza pierwszą próbę umiejętności.',go:'map',action:'Znajdź potwora lvl 1'},
 {id:'inventory',title:'3. Otwórz plecak',text:'Kliknij na dole BOHATER → EKWIPUNEK + PLECAK. Tutaj znajdziesz łup z pierwszej walki oraz cały swój sprzęt.',go:'inventory',action:'Otwórz ekwipunek'},
 {id:'equip',title:'4. Załóż klasowy przedmiot',text:'Kliknij gwarantowany przedmiot z pierwszego łupu i wybierz ZAŁÓŻ. Zmiana wyposażenia od razu wpływa na Twoje statystyki.',go:'inventory',action:'Przejdź do plecaka'},
 {id:'skill',title:'5. Naucz się pierwszej umiejętności',text:'Wejdź w BOHATER → UMIEJĘTNOŚCI. Pierwsza zdolność Twojej klasy ma już ukończoną próbę po pierwszej walce — wydaj 1 punkt i odblokuj ją. Kolejne umiejętności mają już wyspecjalizowane Próby Klasowe.',go:'skills',action:'Odblokuj pierwszą umiejętność'},
 {id:'tavern',title:'6. Poznaj karczmę',text:'Kliknij MIASTO, a następnie KARCMĘ „POD KRUKIEM”. Tutaj odpoczywasz, odzyskujesz staminę i po samouczku znajdziesz tablicę zadań.',go:'town',action:'Idź do miasta'}
];

const STORY_SCENES={
 q2:{requiresSteps:3,npc:'Ranne wilki',role:'Dwa zwierzęta przy skraju lasu',monsterId:'wolf',intro:'Dwa wilki leżą przy ścieżce. Oba są ranne, ale nie od owczych rogów ani pasterskiego kija. W jednej z ran tkwi odłamek prymitywnego grotu, a obok widać ślady butów.',choices:[
  {id:'inspect',label:'Zbadaj rany i ślady',text:'Nie zakładasz winy wilków. Sprawdzasz grot, krew i kierunek, z którego przyszły.',trait:'insight',item:'scrap',result:'Rany są świeże i zadane bronią. Ślady butów prowadzą dalej niż trop wilków — ktoś przepędził zwierzęta i zabrał owce.'},
  {id:'spare',label:'Oszczędź wilki',text:'Zostawiasz zwierzęta w spokoju i zaznaczasz miejsce, by ostrzec pasterzy.',trait:'mercy',item:'herb',result:'Wilki nie próbują atakować. Jedno z nich kulejąc odchodzi w przeciwną stronę niż prowadzą ślady owiec.'},
  {id:'finish',label:'Dobij ranne wilki',text:'Uznajesz, że ranne drapieżniki nadal są zagrożeniem dla okolicy.',trait:'resolve',gold:20,result:'Zabezpieczasz teren, ale dopiero po walce zauważasz obcy grot i ludzkie ślady przy wilczych tropach.'}
 ]},
 q3:{requiresSteps:1,npc:'Ranny wilk',role:'Ślad w wilczej jamie',monsterId:'wolf',intro:'W jamie nie ma resztek owiec. Są za to strzępy płótna, ślady butów i grot goblińskiej strzały.',choices:[
  {id:'tracks',label:'Zbadaj ślady butów',text:'Skupiasz się na kierunku marszu i liczbie napastników.',trait:'insight',xp:55,result:'Ślady prowadzą ku ruinom i wyglądają na zorganizowany transport.'},
  {id:'arrow',label:'Zbadaj grot strzały',text:'Porównujesz grot z uzbrojeniem goblinów.',trait:'caution',item:'scrap',result:'Metal nosi znak, którego gobliny zwykle nie używają.'}
 ]},
 q4:{requiresSteps:1,npc:'Nessa',role:'Myśliwa zwiadowczyni',portrait:'nessa',intro:'Na mapie ruin zaznaczono trasę, którą ktoś z miasta kazał goblinom omijać patrole. Przy rogu pergaminu zachował się odcisk tej samej czarnej pieczęci.',choices:[
  {id:'decode',label:'Odczytaj trasę z Nessą',text:'Poznacie rytm patroli i miejsce następnej dostawy, ale ślad zostanie tylko przy Was.',trait:'insight',flag:'routeDecoded',xp:80,result:'Wiesz, kiedy obóz jest najsłabiej strzeżony. Nessa zapamiętuje układ wart przed kolejną wyprawą.'},
  {id:'report',label:'Ostrzeż straż miejską',text:'Oddajesz kopię mapy strażnikom; obóz szybciej dowie się, że ktoś go obserwuje.',trait:'caution',flag:'patrolWarned',rep:2,result:'Straż zaczyna pilnować drogi do miasta. W obozie goblinów może być teraz więcej czujek.'}
 ]},
 q6:{requiresSteps:1,npc:'Nessa',role:'Myśliwa zwiadowczyni',portrait:'nessa',intro:'Z obozu słychać rozmowę o „panu”, który ma przyjść przed trzecią nocą. Możesz zostać na skraju lasu albo podejść bliżej.',choices:[
  {id:'observe',label:'Zostań w ukryciu',text:'Bezpieczniej. Spróbujesz zapamiętać twarze, drogę i godziny zmian warty.',trait:'caution',xp:70,result:'Poznajesz rytm patroli i nie wzbudzasz podejrzeń.'},
  {id:'close',label:'Podejdź bliżej',text:'Ryzykujesz wykrycie, ale możesz usłyszeć więcej.',trait:'resolve',gold:35,result:'Słyszysz wzmiankę o starych ruinach i czarnym symbolu. Jeden ze zwiadowców odwraca głowę — zostałeś zauważony.',consequence:{type:'combat',monster:'goblin',elite:true,levelOffset:1,label:'Ryzykowne podejście: gobliński patrol może Cię zaatakować.'}}
 ]},
 q8:{requiresSteps:1,npc:'Taren',role:'Ranny myśliwy',portrait:'taren',intro:'Taren rozpoznał kuriera w obozie. Zanim poda Ci nazwisko, zza drzew dobiegają kroki goblinów. Musisz zdecydować, gdzie stanąć.',choices:[
  {id:'protect',label:'Osłoń Tarena',text:'Zatrzymaj patrol przy rannym myśliwym. Obrona lub przerwanie ciosu ochroni go, gdy przeciwnik zamierzy się na niego.',trait:'mercy',flag:'tarenRescued',result:'Taren przeżył zasadzkę i przekazał Ci opis kuriera. Przy kolejnej wizycie przypomni sobie szczegół pieczęci.',consequence:{type:'combat',monster:'goblinWarrior',levelOffset:0,label:'Goblin atakuje Tarena — osłoń go w walce.',mission:{type:'escort',name:'Taren'}}},
  {id:'pursue',label:'Dogoń kuriera',text:'Zatrzymaj zwiadowcę przed alarmem. Taren schroni się sam i może zapamiętać mniej szczegółów.',trait:'resolve',flag:'courierTrail',result:'Przechwytujesz pakunek z czarnym woskiem. Taren wraca do wioski własnymi siłami.',consequence:{type:'combat',monster:'goblinWarrior',levelOffset:0,label:'Kurier podnosi róg alarmowy — zatrzymaj sygnał.',mission:{type:'signal',name:'Róg kuriera'}}}
 ]},
 q10:{requiresSteps:1,npc:'Eldran',role:'Pustelnik',portrait:'eldran',intro:'Pustelnik rozpoznaje symbol jako znak dawnego bractwa. Twierdzi, że ktoś próbuje odtworzyć ich sieć rytuałów.',choices:[
  {id:'trust',label:'Zaufaj jego wiedzy',text:'Pozwolisz mu zatrzymać kopię znaku i poprosisz o interpretację.',trait:'insight',item:'moonHerb',result:'Eldran dzieli się notatką o miejscach, w których znak może pojawić się ponownie.'},
  {id:'keep',label:'Zachowaj dystans',text:'Nie oddasz nikomu oryginalnych dowodów.',trait:'resolve',gold:45,result:'Pustelnik szanuje ostrożność, ale nie mówi wszystkiego.'}
 ]},
 q12:{requiresSteps:2,npc:'Nieznajomy',role:'Nocny gość',classId:'ranger',intro:'Zakapturzona postać przekazuje goblinom czarny medalion. Po chwili odchodzi samotnie w stronę wzgórz.',choices:[
  {id:'watch',label:'Nie wychodź z ukrycia',text:'Najważniejsze są informacje, nie pościg.',trait:'caution',xp:100,flag:'nightWitness',result:'Zapamiętujesz głos i kierunek odejścia nieznajomego.'},
  {id:'follow',label:'Rusz za nieznajomym',text:'Ryzykujesz, że zauważy śledzenie.',trait:'resolve',gold:60,flag:'nightTrail',result:'Na szlaku znajdujesz fragment czarnego wosku z tym samym symbolem. Nieznajomy zostawia goblińskiego ochroniarza.',consequence:{type:'combat',monster:'goblinWarrior',elite:false,levelOffset:0,label:'Pościg: ochroniarz kuriera staje Ci na drodze.',mission:{type:'signal',name:'Sygnał ochroniarza'}}}
 ]},
 q13:{requiresSteps:1,npc:'Nessa',role:'Obrona wioski',portrait:'nessa',intro:'Po odparciu zwiadowców słyszysz róg przy bramie. Gobliński dowódca rozdziela siły: część biegnie ku straży, część do domów mieszkańców.',choices:[
  {id:'gate',label:'Utrzymaj bramę',text:'Walcz z dowódcą i przerwij sygnał, zanim ściągnie posiłki.',trait:'resolve',flag:'gateHeld',result:'Brama ocalała. Dowódca nie odzyskał medalionu, a straż ma czas zabezpieczyć ślady.',consequence:{type:'combat',monster:'goblinWarrior',elite:true,levelOffset:0,label:'Dowódca wzywa posiłki — przerwij róg.',mission:{type:'signal',name:'Róg dowódcy'}}},
  {id:'evacuate',label:'Osłoń mieszkańców',text:'Wyprowadź ludzi spod ostrzału i blokuj ciosy skierowane w ich stronę.',trait:'mercy',flag:'villageEvacuated',result:'Mieszkańcy są bezpieczni. Nessa odnajduje przy bramie pakunek, po który przyszły gobliny.',consequence:{type:'combat',monster:'goblinWarrior',elite:true,levelOffset:0,label:'Osłoń mieszkańców przed dowódcą.',mission:{type:'escort',name:'Mieszkańcy'}}}
 ]},
 q14:{requiresSteps:1,npc:'Eldran',role:'Pustelnik',portrait:'eldran',intro:'Eldran zamiera na widok medalionu. Wyjawia, że był częścią pieczęci pod ruinami: ktoś zlecił kradzież goblinom, by otworzyć starą drogę rytuału.',choices:[
  {id:'trust',label:'Powierz mu kopię znaków',text:'Eldran spróbuje odczytać pieczęć. Zachowasz oryginalny medalion jako dowód.',trait:'insight',flag:'eldranResearch',item:'runeShard',result:'Eldran pokazuje na mapie następny punkt sieci na północy. Obiecuje wysłać wiadomość, jeśli odnajdzie nazwisko zleceniodawcy.'},
  {id:'confront',label:'Zażądaj całej prawdy',text:'Pokaż mu wszystkie dowody i spytaj, dlaczego wcześniej milczał.',trait:'resolve',flag:'eldranConfronted',rep:2,result:'Eldran przyznaje, że dawniej sam pilnował pieczęci. Ktoś w mieście znał jej wartość i przez lata ukrywał ten fakt.'}
 ]},
 q15:{requiresSteps:1,npc:'Nessa',role:'Przed północnym traktem',portrait:'nessa',intro:'Ślady prowadzą ku północnemu obozowi. Tam zniknął drugi fragment pieczęci. Za plecami zostaje miasto, w którym ktoś już zna Twoje odkrycie.',choices:[
  {id:'guild',label:'Przekaż dowody gildii',text:'Edrin zabezpieczy miasto, a Ty ruszysz za transportem z oficjalnym listem.',trait:'caution',flag:'guildBriefed',rep:3,result:'Edrin wysyła zwiadowców. Na północy będą szukać śladów tej samej pieczęci.'},
  {id:'trail',label:'Zachowaj śledztwo w tajemnicy',text:'Ruszysz śladem kuriera, zanim dowie się, kto zna drogę przez ruiny.',trait:'insight',flag:'secretTrail',xp:160,result:'Nessa zostawia Ci znak zwiadowców. Na północy będzie czekał ktoś, kto zna zaginionego kuriera.'}
 ]},
 q17:{requiresSteps:1,npc:'Toren',role:'Zwiadowca Północy',classId:'hunter',portrait:'toren',intro:'W obozie nie ma ciał. Są dwa tropy: jeden prowadzi do zamarzniętego jaru, drugi do porzuconych zapasów.',choices:[
  {id:'survivors',label:'Najpierw szukaj ocalałych',text:'Ludzie mają pierwszeństwo przed łupem i śladami.',trait:'mercy',item:'potion',result:'Znajdujesz ślady ciągniętego rannego. Ktoś mógł przeżyć.'},
  {id:'evidence',label:'Najpierw zabezpiecz ślady',text:'Chcesz wiedzieć, z czym przyjdzie się zmierzyć.',trait:'insight',xp:120,result:'Rozpoznajesz ciężkie kroki ogra i ślady mniejszych butów obok.'}
 ]},
 q18a:{requiresSteps:1,npc:'Toren',role:'Zwiadowca Północy',classId:'hunter',portrait:'toren',intro:'Rozkaz owinięto w tkaninę i ukryto pod śniegiem. Na liście transportu jest nazwisko jednego z zaginionych strażników oraz szkic drugiej części pieczęci. Ktoś wydał konwój przed nadejściem zimy.',choices:[
  {id:'warn',label:'Wyślij nazwisko ocalałym',text:'Rodzina strażnika dowie się, dokąd go zabrano. Wieść może dotrzeć również do konwoju.',trait:'mercy',flag:'northFamiliesWarned',rep:3,result:'Toren obiecuje dotrzeć do bliskich strażnika. Jego dawna przysięga stanie się później ważną wskazówką.'},
  {id:'trace',label:'Zachowaj list jako dowód',text:'Sprawdź pieczęcie i rękopis, zanim ostrzeżesz kogokolwiek.',trait:'insight',flag:'northOrdersKept',xp:160,result:'Pismo z rozkazu pasuje do notatek z obozu. Konwój jechał do wieży, a nie do granicy.'}
 ]},
 q18b:{requiresSteps:1,npc:'Więzień konwoju',role:'Ocalały strażnik',classId:'knight',intro:'Po walce dwóch strażników w wozie odnajdujesz skutego człowieka. W lesie rozlega się róg; kurier z fragmentem pieczęci właśnie zmienia drogę.',choices:[
  {id:'free',label:'Uwolnij więźnia',text:'Zdejmiesz kajdany i osłonisz jego powrót do obozu.',trait:'mercy',flag:'northPrisonerFreed',rep:4,result:'Strażnik wskazuje schody w wieży, których kult nie pilnuje. Pamięta też znak wyryty pod ołtarzem.'},
  {id:'follow',label:'Rusz za kurierem',text:'Toren zajmie się więźniem, gdy wróci. Ty zabezpieczysz trasę fragmentu pieczęci.',trait:'resolve',flag:'northCourierTraced',xp:190,result:'Znajdujesz świeże ślady wozu i miejsce, w którym kurier zamienił eskortę.'}
 ]},
 q18c:{requiresSteps:1,npc:'Eldran',role:'Wiadomość w runach',portrait:'eldran',intro:'Odłamek pieczęci drży obok znaku z Doliny. Wyrzeźbiono na nim ostrzeżenie: brama wieży otwiera się dla dwóch zgodnych głosów. Jeden należy do strażnika, drugi do kuriera.',choices:[
  {id:'read',label:'Odczytaj kolejność znaków',text:'Poświęć czas na odszyfrowanie run. Rozpoznasz słaby punkt obrońców wieży.',trait:'insight',flag:'towerWard',item:'runeShard',result:'Znasz wzór ochronny. W wieży łatwiej przełamiesz obronę wrogów.'},
  {id:'cut',label:'Przetnij więź odłamka',text:'Mag konwoju próbuje wysłać sygnał. Zatrzymaj go, zanim połączy oba fragmenty.',trait:'resolve',flag:'towerRift',result:'Sygnał milknie, a fragment zostaje przy Tobie. Runy jednak tracą część informacji.',consequence:{type:'combat',monster:'goblinMage',levelOffset:0,label:'Przerwij sygnał goblińskiego maga.',mission:{type:'signal',name:'Runa alarmowa'}}}
 ]},
 q18d:{requiresSteps:1,npc:'Toren',role:'Strażnik wejścia do wieży',classId:'hunter',portrait:'toren',intro:'Ogr pada przy bramie. Toren widzi ucieczkę kuriera przez boczne przejście, a w zaspie odnajduje zasypane ślady pozostałych więźniów.',choices:[
  {id:'guard',label:'Zabezpiecz drogę więźniom',text:'Toren pomoże Ci przygotować wejście do wieży i odciąć patrol od rannych.',trait:'mercy',flag:'towerGuarded',item:'strongPotion',result:'Toren wyprowadza ocalałych. Zostawia Ci znak bezpiecznego przejścia do wieży.'},
  {id:'pursue',label:'Podążaj za kurierem',text:'Ryzykujesz zasadzkę, ale zapamiętasz trasę wroga.',trait:'caution',flag:'towerCourierRoute',xp:220,result:'Widzisz, gdzie kurier ukrył fragment pieczęci. Toren osłania wyjście z jaru.'}
 ]},
 q20a:{requiresSteps:1,npc:'Eldran',role:'Ostatni zapis strażnika',portrait:'eldran',intro:'Pod ołtarzem odkrywasz zapis dawnego strażnika. Pieczęć nie powstała w Dolinie: jej części przeniesiono przez mokradła, zanim zakon zamknął tamtejszą kaplicę.',choices:[
  {id:'guild',label:'Wyślij zapis do gildii',text:'Edrin ostrzeże mieszkańców, ale wiadomość zdradzi, dokąd podążasz.',trait:'caution',flag:'marshGuildWarned',rep:4,result:'Gildia przygotowuje zapasy na przejście przez bagno. Edrin szuka nazwiska strażnika z listy.'},
  {id:'eldran',label:'Zachowaj zapis dla Eldrana',text:'Pustelnik odczyta starsze runy. Wiadomość zostanie między Wami.',trait:'insight',flag:'marshRunesKnown',item:'runeShard',result:'Eldran wskazuje miejsce, w którym głos dzwonu może zdradzić drogę do kaplicy.'}
 ]},
 q20b:{requiresSteps:1,npc:'Toren',role:'Na granicy mokradeł',classId:'hunter',portrait:'toren',intro:'Dwie ścieżki znikają w trzcinie. Przy jednej leżą porzucone rzeczy uciekinierów, przy drugiej widać ślad kuriera. Żaden z tropów nie urwie się od razu.',choices:[
  {id:'people',label:'Pomóż uciekinierom',text:'Najpierw sprowadzisz ocalałych na suchy grunt.',trait:'mercy',flag:'marshRefugeesSafe',item:'mireMoss',result:'Uciekinierzy opisują dzwon i wioskę bez głosów. Wiesz, czego szukać dalej.'},
  {id:'courier',label:'Śledź kuriera',text:'Zapamiętaj odciski butów i drogę do opuszczonej wioski.',trait:'resolve',flag:'marshCourierRoute',xp:250,result:'Kurier zatrzymał się przy zatopionej wiosce. Zostawił na bruku ślad czarnego wosku.'}
 ]},
 q22:{requiresSteps:1,npc:'Lysa',role:'Ocalała z mokradeł',classId:'ranger',intro:'Zatopiona wioska wygląda tak, jakby mieszkańcy wyszli z domów w jednej chwili. Z placu dobiega ciche chlupotanie.',choices:[
  {id:'homes',label:'Przeszukaj domy',text:'Szukasz listów, zapasów i śladów codziennego życia.',trait:'insight',item:'mireMoss',result:'Znajdujesz zapiski o dzwonie, który odzywał się przed każdym zaginięciem.'},
  {id:'square',label:'Idź prosto na plac',text:'Źródło dźwięku może zniknąć, jeśli będziesz zwlekać.',trait:'resolve',gold:75,result:'W błocie widzisz świeże ślady prowadzące ku zatopionej kaplicy.'}
 ]},
 q24:{requiresSteps:1,npc:'Głos spod wody',role:'Zatopiony Dzwon',classId:'mage',intro:'Dzwon porusza się bez liny. Każde uderzenie brzmi jak jedno słowo, którego nie potrafisz do końca zrozumieć.',choices:[
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
 q33:{requiresSteps:1,npc:'Eldran',role:'Echo pustelnika',classId:'mage',intro:'Przy ołtarzu mgła układa się w znaki podobne do tych z Doliny Kruka. Rytuał można złamać siłą albo rozplątać jego strukturę.',choices:[
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
function conditionSatisfied(target){const c=climate();if(target==='night')return c.phase==='Noc';if(target==='nightOrClue')return c.phase==='Noc'||!!storyChoiceFor('q4')||state.quests.done.includes('q10');if(target==='nightOrFog')return c.phase==='Noc'||c.weather==='Mgła';if(target==='badWeather')return ['Mgła','Deszcz','Burza'].includes(c.weather);if(target==='day')return c.phase==='Dzień';return false}
function updateStoryConditions(){if(!state)return;ensureStoryState();let changed=false;for(const qid of [...state.quests.active]){const q=QUESTS.find(x=>x.id===qid);if(!q)continue;const prog=state.quests.progress[qid] ||= q.steps.map(()=>0);q.steps.forEach((s,i)=>{if(s.type==='condition'&&conditionSatisfied(s.target)&&!prog[i]){prog[i]=1;changed=true}else if(s.type==='story'&&storyChoiceFor(qid)&&!prog[i]){prog[i]=1;changed=true}});if(q.steps.every((s,i)=>questStepDone(s,prog[i]))){rewardQuest(q);changed=true}}if(changed)save()}
function storyProfileHTML(){ensureStoryState();const t=state.story.traits,ending=state.story.flags.endingDestroy?'Zniszczone serce bagna':state.story.flags.endingSeal?'Zapieczętowane serce bagna':null,effects=state.story.worldEffects||[];return `<div class="story-profile"><div><b>🧭 Twój ślad fabularny</b><small>Decyzje zmieniają nagrody, spotkania i to, co później pojawia się w świecie.</small></div><div class="story-traits"><span>🤝 ${storyTraitLabel('mercy')} <b>${t.mercy}</b></span><span>⚔️ ${storyTraitLabel('resolve')} <b>${t.resolve}</b></span><span>🔎 ${storyTraitLabel('insight')} <b>${t.insight}</b></span><span>🕯️ ${storyTraitLabel('caution')} <b>${t.caution}</b></span></div>${effects.length?`<div class="story-world-effects"><b>Ślady w świecie</b>${effects.slice(-5).map(e=>`<span>${e.icon||'◆'} ${e.label}</span>`).join('')}</div>`:''}${ending?`<div class="story-ending">Zakończenie Mokradeł Echa: <b>${ending}</b></div>`:''}</div>`}
function storyCanChoose(qid){const scene=storyScene(qid),q=QUESTS.find(x=>x.id===qid);if(!scene||!q)return false;if(storyChoiceFor(qid))return true;if(!scene.requiresSteps)return true;const prog=state.quests.progress[qid]||[];return q.steps.slice(0,scene.requiresSteps).every((s,i)=>questStepDone(s,prog[i]))}
function storyChoiceConsequenceHint(choice){const c=choice?.consequence;if(!c)return '';return `<em class="story-consequence-hint">⚠️ ${c.label||'Ta decyzja ma natychmiastową konsekwencję.'}</em>`}
function storyEchoLine(qid){
 const chosen=id=>storyChoiceFor(id),f=state.story?.flags||{};
 return ({
  q4:chosen('q2')==='spare'?'Wilk, któremu pozwoliłeś odejść, pojawia się na skraju ruin. Prowadził Cię w stronę właściwej ścieżki.':chosen('q2')==='finish'?'Przy mapie odnajdujesz ten sam grot, który tkwił w ranach wilków. Teraz wiesz, że za zniknięciem owiec stoją ludzie.':'Ślady przy ruinach potwierdzają to, co odkryłeś przy rannych wilkach: zwierzęta były tylko zasłoną.',
  q6:f.routeDecoded?'Znając rytm patroli z mapy, rozpoznajesz chwilę, kiedy można podejść do obozu.':f.patrolWarned?'Strażnicy zostawili na trakcie znak. Gobliny są czujniejsze, ale droga do wioski jest pilnowana.':'Nessa wskazuje słabo pilnowaną stronę obozu.',
  q8:chosen('q6')==='close'?'Taren słyszał nocną walkę przy obozie. Wie, że ktoś zdążył ostrzec kuriera.':'Taren zapamiętał głos człowieka, którego obserwowałeś z Nessą.',
  q12:f.courierTrail?'Na miejscu spotkania rozpoznajesz znak z pakunku kuriera. Teraz możesz szukać jego zleceniodawcy.':f.tarenWounded?'Taren przeżył, lecz obrażenia zamazały mu pamięć. Nadal masz ślady z obozu.':f.tarenSafe?'Taren przypomina sobie szczegół: kurier nosił pierścień z symbolem miasta.':'Droga do spotkania nosi ślady niedawnego transportu.',
  q13:f.patrolWarned?'Ostrzeżeni wcześniej strażnicy osłaniają wschodnią drogę. Możesz skoncentrować się na dowódcy.':f.routeDecoded?'Nessa zna trasę ataku dzięki mapie, którą odczytaliście razem.':'Atak zaczyna się przed świtem.',
  q14:f.signalRaised?'Alarm ściągnął dodatkowy patrol. Eldran widzi, że ktoś desperacko chce odzyskać medalion.':f.villageSafe?'Mieszkańcy mówią Eldranowi o Twojej obronie. Pustelnik w końcu decyduje się powiedzieć więcej.':chosen('q12')==='follow'?'Fragment czarnego wosku odebrany ochroniarzowi pasuje do medalionu.':'Zapis głosu nieznajomego pomaga powiązać obóz z dawną pieczęcią.',
  q15:f.eldranConfronted?'Eldran przyznał, że znał tę pieczęć od lat. Nessa pyta, komu jeszcze mogło zależeć na jej otwarciu.':'Na mapie Eldrana widnieje drugi punkt rytuału za północnym traktem.',
  q17:f.guildBriefed?'W obozie odnajdujesz znak zwiadowców Edrina. Gildia dotarła tu przed Tobą.':f.secretTrail?'Toren pokazuje Ci znak pozostawiony przez Nessę. Kurier był tu niedawno.':'Na śniegu widać ślady transportu przypominające trop z Doliny.',
  q18a:chosen('q17')==='survivors'?'Zabezpieczony ślad rannego prowadzi wprost do zasypanego rozkazu.':'Odciski ciężkich butów są takie same jak te, które Toren rozpoznał w obozie.',
  q18b:f.northFamiliesWarned?'Toren usłyszał od rodziny strażnika szczegół: więzień znał przejście pod wieżą.':'Na liście transportu rozpoznajesz znaki tego samego konwoju.',
  q18c:f.northPrisonerFreed?'Uratowany strażnik wskazuje drugi znak na spodzie odłamka.':'Ślady kuriera pokazują, dokąd zabrano brakującą część pieczęci.',
  q18d:f.signalRaised_q18c?'Sygnał maga dotarł do wieży. Toren radzi uważać na dodatkowy patrol.':f.towerWard?'Odczytany wzór wskazuje, jak osłabić obrońców wieży.':'Toren widzi, że ktoś zdołał otworzyć bramę.',
  q20a:f.towerWard?'Znaki pod ołtarzem odpowiadają wzorowi, który odczytałeś przed wejściem do wieży.':f.northPrisonerFreed?'Imię ocalonego strażnika powraca w ostatnim zapisie.':'Wieża i sanktuarium były częściami jednego łańcucha pieczęci.',
  q20b:f.marshGuildWarned?'Edrin przesłał zwiadowcom ostrzeżenie o dzwonie za granicą trzcin.':f.marshRunesKnown?'Notatki Eldrana pozwalają rozpoznać drogę wśród zalanych kamieni.':'Toren pokazuje dwie ścieżki, których nie ma na mapie.',
  q22:f.marshRefugeesSafe?'Uratowani podróżni opowiedzieli o wiosce, która opustoszała po trzecim uderzeniu dzwonu.':f.marshCourierRoute?'Ślad czarnego wosku urywa się na placu zatopionej wioski.':'Na drodze do wioski widzisz znaki dawnego zakonu.',
  q24:f.marshRunesKnown?'Z zapisu Eldrana wiesz, jak odczytać uderzenia dzwonu również za dnia.':f.marshRefugeesSafe?'Słowa ocalałych pomagają rozpoznać rytm dzwonu bez czekania na noc.':'W zatopionej wiosce znalazłeś wskazówkę prowadzącą do dzwonu.'
 })[qid]||'';
}
function storyResultText(qid,choice){const f=state.story?.flags||{};if(qid==='q8'&&choice.id==='protect'&&f.tarenWounded)return 'Taren przeżył walkę, ale został ranny. Zapamiętał tylko część opisu kuriera; pozostałe tropy trzeba będzie odnaleźć samemu.';if(qid==='q13'&&f.signalRaised_q13)return `${choice.result} Alarm jednak dotarł do drugiego patrolu; zobaczysz jego ślady dalej na szlaku.`;if(qid==='q18c'&&f.signalRaised_q18c)return `${choice.result} Mag zdołał jednak uprzedzić straż wieży.`;return choice.result}
function storyPortraitHTML(scene){if(scene.portrait)return `<img class="sprite-story-npc story-painted-portrait ${scene.portrait==='toren'?'story-toren-portrait':''}" src="assets/story/${scene.portrait}-3998.webp" alt="${scene.npc}">`;if(scene.monsterId)return monsterVisual(scene.monsterId,'sprite-story-npc story-beast-portrait');return classVisual(scene.classId||'ranger','sprite-story-npc')}
function openStoryScene(qid){ensureStoryState();const scene=storyScene(qid),q=QUESTS.find(x=>x.id===qid);if(!scene||!q)return;const selected=storyChoiceFor(qid);if(!storyCanChoose(qid)&&!selected)return toast('Najpierw ukończ wcześniejszy etap zadania.');state.story.seen[qid]=true;save();const chosen=selected?scene.choices.find(c=>c.id===selected):null,echo=storyEchoLine(qid);openModal(`<div class="story-modal"><div class="modal-head"><div><div class="story-kicker">${q.chapter}</div><h2>${q.name}</h2><div class="muted">Scena fabularna</div></div><button class="close" data-close>×</button></div><div class="story-scene"><div class="story-npc">${storyPortraitHTML(scene)}<b>${scene.npc}</b><small>${scene.role}</small></div><div class="story-dialogue"><p>${scene.intro}</p>${echo?`<p class="story-echo-line">${echo}</p>`:''}${chosen?`<div class="story-result"><span>TWÓJ WYBÓR</span><b>${chosen.label}</b><p>${storyResultText(qid,chosen)}</p></div>`:`<div class="story-choices">${scene.choices.map(c=>`<button class="story-choice" data-story-choice="${c.id}"><b>${c.label}</b><small>${c.text}</small>${storyChoiceConsequenceHint(c)}</button>`).join('')}</div>`}</div></div></div>`);document.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>applyStoryChoice(qid,b.dataset.storyChoice))}
function readyStorySceneId(preferred=null){const ids=preferred?[preferred]:[...state.quests.active];return ids.find(qid=>{if(!state.quests.active.includes(qid)||storyChoiceFor(qid))return false;const cur=currentQuestStep(qid);return cur?.step?.type==='story'&&storyCanChoose(qid)})||null}
function queueReadyStoryScene(preferred=null,delay=180){const qid=readyStorySceneId(preferred);if(!qid)return false;setTimeout(()=>{if(!combat&&state?.quests?.active?.includes(qid)&&!storyChoiceFor(qid)&&readyStorySceneId(qid)===qid)openStoryScene(qid)},delay);return true}
function startStoryConsequenceCombat(qid,choice){const c=choice?.consequence;if(c?.type!=='combat')return false;const m=MONSTERS.find(x=>x.id===c.monster);if(!m)return false;const lvl=clamp((state.player.level||1)+(c.levelOffset||0),m.min,m.max),entity={id:`story_${qid}_${choice.id}_${Date.now()}`,type:'monster',template:m.id,x:state.player.position.x||0,y:state.player.position.y||0,alive:true,elite:!!c.elite,synthetic:true};const started=startCombat(entity,{level:lvl,storyConsequence:{qid,choiceId:choice.id,mission:c.mission||null}});if(started)toast(`⚠️ ${c.label||'Zostałeś zaatakowany!'}`);return started}
function spawnStoryWorldEcho(qid,choice){
 const defs={
  'q2:inspect':{name:'Gobliński zwiadowca',icon:'👣',signal:'Ślady ciężkich butów przecinają drogę',desc:'Trop z miejsca odnalezienia wilków prowadzi do zwiadowcy niosącego cudzy znak.',xp:150,gold:45,choices:[{id:'track',label:'Dopadnij zwiadowcę',text:'Idziesz za tropem, zanim zdąży zniknąć.',combat:'goblin',elite:true,result:'Zwiadowca zauważa pościg i dobywa broni.'},{id:'report',label:'Przekaż trop straży',text:'Zachowujesz dowód i unikasz samotnej walki.',xp:55,rep:2,result:'Strażnicy zaczynają obserwować drogę do ruin.'}]},
  'q2:spare':{name:'Wilk wraca na szlak',icon:'🐺',signal:'Na skraju lasu widzisz znajomą sylwetkę',desc:'Oszczędzony wilk zostawił przy ścieżce zioła zabrudzone goblińską krwią.',xp:90,gold:15,item:'herb',choices:[{id:'accept',label:'Zabierz wskazówkę',text:'Ślady krwi wskazują dalszy kierunek poszukiwań.',item:'moonHerb',result:'Wilk znika między drzewami, ale tym razem nie warczy.'}]},
  'q2:finish':{name:'Niespokojna wataha',icon:'🐺',signal:'Z lasu odpowiada kilka gniewnych wyć',desc:'Zapach krwi zwabił resztę watahy. Wilki okrążają szlak.',xp:135,gold:35,choices:[{id:'stand',label:'Stań do walki',text:'Nie pozwalasz watasze podejść do wioski.',combat:'wolf',elite:true,result:'Największy wilk rusza pierwszy.'},{id:'withdraw',label:'Wycofaj się i ostrzeż pasterzy',text:'Omijasz stado szerokim łukiem.',xp:35,result:'Szlak zostaje czasowo zamknięty.'}]},
  'q8:protect':{name:'Wiadomość od Tarena',icon:'🏹',signal:'Na skraju szlaku znajdujesz strzałę z przywiązaną notatką',desc:'Taren rozpoznał pierścień kuriera. Na szkicu obok czarnej pieczęci narysował wieżę straży.',xp:120,gold:35,choices:[{id:'read',label:'Przeczytaj notatkę',text:'Porównaj rysunek z mapą ruin.',item:'moonHerb',result:'Wiesz, którego śladu szukać podczas spotkania z kurierem.'}]},
  'q8:pursue':{name:'Pakunek kuriera',icon:'📜',signal:'Przy trasie kuriera leży zawiniątko z czarnym woskiem',desc:'Na wewnętrznej stronie pergaminu ktoś z miasta oznaczył miejsce następnego spotkania.',xp:140,gold:40,choices:[{id:'inspect',label:'Zabezpiecz pakunek',text:'Odczytaj trasę i ukryj dowód przed kolejnym patrolem.',item:'scrap',result:'Czarny wosk pasuje do znaku znalezionego w wilczej jamie.'}]},
  'q13:gate':{name:'Ślad pod bramą',icon:'🛡️',signal:'Strażnik prosi Cię o obejrzenie znaku przy bramie',desc:'Napastnicy oznaczyli wejście tym samym czarnym woskiem co przesyłki z ruin.',xp:170,gold:45,choices:[{id:'trace',label:'Zbadaj znak',text:'Zachowaj próbkę dla Eldrana.',item:'runeShard',result:'Próbka może zdradzić cel zleceniodawcy.'}]},
  'q13:evacuate':{name:'Relacja mieszkańców',icon:'🏘️',signal:'Ocalały mieszkaniec chce opowiedzieć o ataku',desc:'Widział kuriera bez goblińskiej obstawy. Ktoś z miasta wcześniej otworzył mu drogę.',xp:160,gold:35,choices:[{id:'listen',label:'Wysłuchaj świadka',text:'Zapamiętaj opis postaci przed rozmową z Eldranem.',rep:2,result:'Eldran nie będzie mógł zbyć Twoich pytań.'}]},
  'q15:guild':{name:'Znak zwiadowców gildii',icon:'⚜️',signal:'Na północnym trakcie wiszą niebieskie wstążki',desc:'Edrin wysłał ludzi śladem medalionu. Jeden zostawił krótki raport o drugim fragmencie pieczęci.',xp:200,gold:50,choices:[{id:'report',label:'Przeczytaj raport',text:'Dowiedz się, dokąd szli gobliny.',rep:2,result:'Trop prowadzi ku północnemu obozowi.'}]},
  'q15:trail':{name:'Sekretny znak Nessy',icon:'👣',signal:'Na kamieniu widzisz znak narysowany przez Nessę',desc:'Kurier ominął straż i skręcił ku obozowi. Nessa zostawiła miejsce bezpiecznego podejścia.',xp:210,gold:35,choices:[{id:'follow',label:'Podążaj tropem',text:'Zachowaj znak dla następnego zwiadowcy.',item:'herb',result:'Na śniegu pojawia się ślad tej samej pieczęci.'}]},
  'q18b:free':{name:'Wskazówka uwolnionego strażnika',icon:'🗝️',signal:'Strażnik zostawił przy trakcie znak zakonu',desc:'Wskazuje bezpieczne przejście pod wieżą oraz miejsce dawnej skrytki.',xp:220,gold:55,choices:[{id:'cache',label:'Zbadaj skrytkę',text:'Otwórz schowek, zanim wrócą patrole.',item:'runeShard',result:'Zapis run wskazuje wejście do wieży.'}]},
  'q18b:follow':{name:'Zgubiona przesyłka kuriera',icon:'📜',signal:'Na śniegu leży zerwana torba pocztowa',desc:'W torbie znajduje się kopia mapy prowadzącej do drugiego fragmentu pieczęci.',xp:230,gold:55,choices:[{id:'map',label:'Zabezpiecz mapę',text:'Porównaj trasę z rozkazem znalezionym przy obozie.',item:'moonHerb',result:'Trop prowadzi do run przy posterunku.'}]},
  'q20b:people':{name:'Bezpieczny brzeg',icon:'🛖',signal:'Ocalały zostawił zapasy na skraju mokradeł',desc:'Ludzie, których wyprowadziłeś, zapamiętali drogę do zatopionej wioski.',xp:260,gold:75,choices:[{id:'supplies',label:'Odbierz zapasy',text:'Przygotuj się na wodę i mgłę.',item:'potion',result:'Masz nowy trop i potrzebne zapasy.'}]},
  'q20b:courier':{name:'Ślad czarnego wosku',icon:'◆',signal:'Przy grobli błyszczy czarny odłamek',desc:'Kurier zgubił część znaku przed wejściem w trzcinę.',xp:280,gold:65,choices:[{id:'seal',label:'Zbadaj odłamek',text:'Zapamiętaj ślad przed wejściem do wioski.',item:'runeShard',result:'Ten sam znak znajduje się na drzwiach zatopionej kaplicy.'}]},
  'q29:rescue':{name:'Ocalały z mokradeł',icon:'🧔',signal:'Ktoś woła Cię po imieniu przy starym trakcie',desc:'Uratowany więzień dotrzymał słowa i zostawił informacje o kryjówce kultu.',xp:210,gold:80,item:'bogAmber',choices:[{id:'take',label:'Odbierz mapę i zapasy',text:'Informacja otwiera bezpieczniejsze przejście przez bagno.',rep:3,result:'Na mapie pojawia się oznaczenie bocznej ścieżki.'}]},
  'q29:shadow':{name:'Uciekinier Czarnego Korzenia',icon:'🕯️',signal:'W trzcinach miga czarne światło',desc:'Kultysta, którego śledziłeś, spotyka się ze strażnikiem rytuału.',xp:245,gold:95,choices:[{id:'attack',label:'Przerwij spotkanie',text:'Atakujesz, zanim przekażą sobie wiadomość.',combat:'rotCultist',elite:true,result:'Strażnik rytuału zasłania drogę.'}]}
 };
 const key=`${qid}:${choice.id}`,def=defs[key];if(!def||!state?.world)return;const id=`story_echo_${qid}_${choice.id}`;if((state.world.entities||[]).some(e=>e.id===id)||state.world.living?.completedEvents?.includes(id))return;
 const p=state.player.position||{x:0,y:0},angle=(qid.charCodeAt(1)+(choice.id.length*17))%6.28,r=125+(choice.id.length%4)*28,x=(p.x||0)+Math.cos(angle)*r,y=(p.y||0)+Math.sin(angle)*r,biome=biomeAt(x,y);
 state.world.entities.push({...def,id,type:'event',x,y,biome,done:false,persistent:true,storyEcho:true});state.story.worldEffects.push({id:key,icon:def.icon,label:`${choice.label} → ${def.name}`});
}
function commitStoryChoice(qid,choice,mission=null){ensureStoryState();if(state.story.choices[qid])return false;state.story.choices[qid]=choice.id;if(choice.trait)state.story.traits[choice.trait]=(state.story.traits[choice.trait]||0)+1;if(choice.flag)state.story.flags[choice.flag]=true;if(choice.gold)state.player.gold+=choice.gold;if(choice.xp)gainXp(choice.xp);if(choice.item)addItem(choice.item);if(choice.rep){ensureAdventureState();state.adventure.reputation+=choice.rep}if(mission?.type==='escort'){if(mission.hits>0)state.story.flags[mission.name==='Taren'?'tarenWounded':'villageWounded']=true;else state.story.flags[mission.name==='Taren'?'tarenSafe':'villageSafe']=true}if(mission?.type==='signal'){state.story.flags[mission.signalRaised?'signalRaised':'signalStopped']=true;state.story.flags[`${mission.signalRaised?'signalRaised':'signalStopped'}_${qid}`]=true}spawnStoryWorldEcho(qid,choice);checkQuestProgress('story',qid);save();return true}
function applyStoryChoice(qid,choiceId){ensureStoryState();if(state.story.choices[qid])return;const scene=storyScene(qid),choice=scene?.choices.find(c=>c.id===choiceId);if(!choice)return;if(choice.consequence?.type==='combat'){if(startStoryConsequenceCombat(qid,choice))closeModal();return}commitStoryChoice(qid,choice);closeModal();refresh();toast(`Decyzja zapisana: ${choice.label} • świat zareaguje na ten wybór`)}

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
 const d=itemDef(id);
 return `<span class="item-icon-shell item-grade-${d.rarity}" title="${d.name} • ${rarityName(d.rarity)}"><img src="assets/item-art/${encodeURIComponent(id)}.webp?v=3996" class="${cls}" alt="${d.name}" loading="lazy"></span>`;
}
function skillIconVisual(id,cls='skill-svg'){return `<img src="assets/icons/skills/${id}.svg" class="${cls}" alt="">`}
function ensureCoreState(s=state){if(!s)return;ensureStoryState(s);ensureCityState(s);s.ui ||= {heroView:'char',adventureView:'quests',menuView:'settings'};s.tutorial ||= {stage:0,complete:false,rewardGiven:false,flags:{},introSeen:true};s.tutorial.flags ||= {};s.tutorial.introSeen ??= true;s.tutorial.mapDismissedStage ??= -1;s.settings ||= {};s.settings.audio ??= true;s.settings.ambient ??= true;s.settings.masterSound ??= (s.settings.audio||s.settings.ambient);s.settings.sfxVolume ??= .68;s.settings.ambientVolume ??= .18;s.settings.haptics ??= true;s.settings.mapMode ||= 'focused';s.settings.mapFilters ||= {};s.settings.mapFilters.trail ??= true;s.player.inventoryCapacity=Math.max(36,Number(s.player.inventoryCapacity)||36);s.player.trialStats ||= {};s.regen ||= {lastAt:Date.now(),hpCarry:0,manaCarry:0,staminaCarry:0};s.regen.lastAt ||= Date.now();s.regen.hpCarry ||= 0;s.regen.manaCarry ||= 0;s.regen.staminaCarry ||= 0;s.world.shrinePrayers ||= {};s.world.regionRewards ||= {};s.world.fogRadius=100;ensureDungeonAccessState(s);ensureCombatSkillLoadout(s);ensureBackpackSlots(s);ensureAlchemyState(s);ensureSocialState(s);ensureTutorialStarterMonster(s);}


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

const TUTORIAL_CLASS_DROPS={knight:'tutorialKnightShield',mage:'tutorialMageStaff',hunter:'tutorialHunterBow',berserker:'tutorialBerserkerAxe',ranger:'tutorialRangerHood'};
function tutorialClassDropId(cls=state?.player?.class){return TUTORIAL_CLASS_DROPS[cls]||'leatherGloves'}
const TUTORIAL_FIRST_MONSTER_ID='tutorial_first_monster';
function ensureTutorialStarterMonster(target=state,reposition=false){
 if(!target?.world||target.tutorial?.complete||target.tutorial?.flags?.kill)return null;
 const ready=(target.tutorial?.stage||0)>=1||!!target.tutorial?.flags?.move;if(!ready)return null;
 target.world.entities ||= [];
 let e=target.world.entities.find(x=>x.id===TUTORIAL_FIRST_MONSTER_ID);
 const pos=target.player?.position||{x:0,y:0};
 if(!e){e={id:TUTORIAL_FIRST_MONSTER_ID,type:'monster',template:'slime',variant:'normal',level:1,x:(pos.x||0)+36,y:pos.y||0,alive:true,respawn:Number.MAX_SAFE_INTEGER,elite:false,tutorialStarter:true};target.world.entities.unshift(e)}
 else {e.template='slime';e.variant='normal';e.level=1;e.elite=false;e.tutorialStarter=true;e.alive=true;e.respawn=Number.MAX_SAFE_INTEGER;if(reposition){e.x=(pos.x||0)+36;e.y=pos.y||0}}
 return e;
}
function tutorialLocksStory(){return !!state&&!state.tutorial?.complete}
function hideStoryUntilTutorial(target=state){
 if(!target?.quests||target.tutorial?.complete)return;
 target.quests.active=(target.quests.active||[]).filter(id=>!QUESTS.some(q=>q.id===id));
}
function unlockStoryAfterTutorial(){
 if(!state?.tutorial?.complete)return null;
 const q=ensureStoryQuestContinuity(false);
 if(q){state.ui.questFocus=q.id;syncQuestWorld();save();toast(`📜 Samouczek ukończony! Odblokowano fabułę: ${q.name}`)}
 return q;
}
function tutorialActionLabel(t){return t?.action||'Pokaż, gdzie kliknąć'}
function clearTutorialFocus(){document.querySelectorAll('.tutorial-focus').forEach(el=>el.classList.remove('tutorial-focus'))}
function applyTutorialFocus(){
 clearTutorialFocus();const t=tutorialInfo();if(!t)return;
 let selector='';
 if(t.id==='inventory'||t.id==='equip')selector=currentTab==='hero'?'[data-hero-view="gear"]':'[data-nav="hero"]';
 else if(t.id==='skill')selector=currentTab==='hero'?'[data-hero-view="skills"]':'[data-nav="hero"]';
 else if(t.id==='tavern')selector=currentTab==='town'?'[data-building="tavern"]':'[data-nav="town"]';
 else if(t.id==='kill'&&currentTab==='map')selector='.monster-marker.interaction-ready,.monster-marker';
 else selector='[data-nav="map"]';
 setTimeout(()=>{const el=document.querySelector(selector);if(el)el.classList.add('tutorial-focus')},80);
}
function tutorialInfo(){ensureCoreState();return state.tutorial.complete?null:TUTORIAL_STEPS[Math.min(Math.max(0,state.tutorial.stage||0),TUTORIAL_STEPS.length-1)]}
function tutorialStepDone(step){const f=state.tutorial.flags||{};if(f[step.id])return true;if(step.id==='skill')return state.player.skills.length>0;return false}
function advanceTutorial(){
 ensureCoreState();if(state.tutorial.complete)return;
 if(!Number.isInteger(state.tutorial.stage)||state.tutorial.stage<0||state.tutorial.stage>=TUTORIAL_STEPS.length)state.tutorial.stage=0;
 let moved=false;
 while(state.tutorial.stage<TUTORIAL_STEPS.length&&tutorialStepDone(TUTORIAL_STEPS[state.tutorial.stage])){state.tutorial.stage++;moved=true}
 if(state.tutorial.stage>=TUTORIAL_STEPS.length){
  state.tutorial.complete=true;clearTutorialFocus();
  if(!state.tutorial.finishReward){state.tutorial.finishReward=true;state.player.gold+=80;gainXp(180);addItem('potion',2);playSfx('level');haptic([25,40,25])}
  save();unlockStoryAfterTutorial();return;
 }
 if(moved){state.tutorial.mapDismissedStage=-1;save();setTimeout(applyTutorialFocus,40)}
}
function tutorialEvent(type,value=0){ensureCoreState();if(state.tutorial.complete)return;const f=state.tutorial.flags;if(type==='move'&&value>=60){f.move=true;advanceTutorial();ensureTutorialStarterMonster(state,true);save();return}else if(type==='kill')f.kill=true;else if(type==='tavern')f.tavern=true;else if(type==='inventory')f.inventory=true;else if(type==='equip')f.equip=true;else if(type==='skill')f.skill=true;advanceTutorial();save()}
function tutorialMapOverlay(){const t=tutorialInfo();if(!t||state.tutorial.mapDismissedStage===state.tutorial.stage)return'';const pct=Math.round((state.tutorial.stage/TUTORIAL_STEPS.length)*100);return `<div class="tutorial-map-card guided-tutorial-card"><div class="npe-progress"><i style="width:${pct}%"></i></div><button class="tutorial-map-close" data-tutorial-hide aria-label="Zamknij">×</button><span>SAMOUCZEK ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}</span><b>${t.title}</b><small>${t.text}</small><button class="primary tutorial-map-action" data-tutorial-go>${tutorialActionLabel(t)}</button></div>`}
function tutorialJournalHTML(){const t=tutorialInfo();if(!t)return `<div class="panel-item first-hour-card"><b>✅ Samouczek ukończony</b><div class="muted">Główny wątek fabularny jest już dostępny.</div></div>`;return `<div class="panel-item first-hour-card tutorial-journal-lock"><b>🎓 Samouczek • ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}: ${t.title}</b><p>${t.text}</p><div class="tutorial-lock-note">🔒 Zadania fabularne odblokują się po ukończeniu samouczka.</div><button class="primary" data-tutorial-go>${tutorialActionLabel(t)}</button></div>`}
function tutorialNavigate(){const t=tutorialInfo();if(!t)return;if(t.go==='town'){selectNav('town');setTimeout(applyTutorialFocus,100);return}if(t.go==='inventory'){state.ui.heroView='gear';save();selectNav('hero');setTimeout(applyTutorialFocus,100);return}if(t.go==='skills'){state.ui.heroView='skills';save();selectNav('hero');setTimeout(applyTutorialFocus,100);return}selectNav('map');setTimeout(applyTutorialFocus,150)}
function bindTutorialControls(root=document){root.querySelectorAll('[data-tutorial-go]').forEach(b=>b.addEventListener('click',tutorialNavigate));root.querySelector('[data-tutorial-hide]')?.addEventListener('click',()=>{state.tutorial.mapDismissedStage=state.tutorial.stage;save();root.querySelector('.tutorial-map-card')?.remove()});applyTutorialFocus()}
function buildingUnlock(id){if(id==='tavern')return {ok:true};const u=CORE_UNLOCKS[id];if(!u)return {ok:true};return {ok:state.player.level>=u.level,reason:u.label}}
function questStepNeed(s){return s?.type==='move'?Math.max(1,Number(s.target)||Number(s.count)||1):Math.max(1,Number(s?.count)||1)}
function questStepDone(s,value){return (Number(value)||0)>=questStepNeed(s)}
function currentQuestStepIndex(qid){const q=QUESTS.find(x=>x.id===qid);if(!q)return -1;const prog=state.quests.progress[qid]||[];return q.steps.findIndex((s,i)=>!questStepDone(s,prog[i]))}
function currentQuestStep(qid){const q=QUESTS.find(x=>x.id===qid),i=currentQuestStepIndex(qid);return q&&i>=0?{q,step:q.steps[i],index:i}:null}
function activeQuestTargets(){const set=new Set();for(const qid of state.quests.active){const cur=currentQuestStep(qid);if(cur?.step?.target)set.add(cur.step.target)}return set}
function questPoiVisible(e){if(!e||e.type!=='poi')return true;const refs=[];for(const q of QUESTS)q.steps.forEach((s,i)=>{if(s.type==='discover'&&s.target===e.id)refs.push({q,i})});if(!refs.length)return true;if(state.player.discovered.includes(e.id))return true;return refs.some(({q,i})=>state.quests.active.includes(q.id)&&currentQuestStepIndex(q.id)===i)}
function questWorldEntityVisible(e){if(!e)return false;if(tutorialLocksStory()&&!state.tutorial?.flags?.kill&&e.type==='monster'&&!e.tutorialStarter)return false;if(tutorialLocksStory()&&(e.questOnly||e.bountyId))return false;if(e.questOnly){if(!state.quests.active.includes(e.questId))return false;const cur=currentQuestStep(e.questId);return !!cur&&cur.index===e.questStage&&!e.done&&(e.type!=='monster'||e.alive!==false)}if(e.bountyId){const b=(state.adventure?.bounties||[]).find(x=>x.id===e.bountyId);return !!b&&b.accepted&&!b.claimed&&!e.done&&(e.type!=='monster'||e.alive)}return questPoiVisible(e)}
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


const PASSIVE_REGEN={hpPerMinute:.01,manaPerMinute:.02,staminaMinutesPerPoint:3,maxOfflineHours:24};
let passiveRegenTimer=null;
function applyPassiveRegen(now=Date.now(),target=state){
 if(!target?.player)return false;ensureCoreState(target);const r=target.regen,p=target.player;
 const last=Number(r.lastAt)||now,raw=Math.max(0,now-last),elapsed=Math.min(raw,PASSIVE_REGEN.maxOfflineHours*60*60*1000);r.lastAt=now;
 if(!elapsed||combat||dungeonRun)return false;
 let changed=false;
 const hpGain=elapsed*(p.maxHp*PASSIVE_REGEN.hpPerMinute)/(60*1000)+(Number(r.hpCarry)||0),hpWhole=Math.floor(hpGain);r.hpCarry=hpGain-hpWhole;
 if(hpWhole>0&&p.hp<p.maxHp){const before=p.hp;p.hp=Math.min(p.maxHp,p.hp+hpWhole);changed ||= p.hp!==before}
 const manaGain=elapsed*(p.maxMana*PASSIVE_REGEN.manaPerMinute)/(60*1000)+(Number(r.manaCarry)||0),manaWhole=Math.floor(manaGain);r.manaCarry=manaGain-manaWhole;
 if(manaWhole>0&&p.mana<p.maxMana){const before=p.mana;p.mana=Math.min(p.maxMana,p.mana+manaWhole);changed ||= p.mana!==before}
 ensureStaminaCap(target);const staminaGain=elapsed/(PASSIVE_REGEN.staminaMinutesPerPoint*60*1000)+(Number(r.staminaCarry)||0),staminaWhole=Math.floor(staminaGain);r.staminaCarry=staminaGain-staminaWhole;
 if(staminaWhole>0&&p.stamina<p.maxStamina){const before=p.stamina;p.stamina=Math.min(p.maxStamina,p.stamina+staminaWhole);changed ||= p.stamina!==before}
 return changed;
}
function passiveRegenTick(){
 if(!state?.player)return;const changed=applyPassiveRegen(Date.now());if(!changed)return;save();refreshTopbar();
 const drawer=document.querySelector('.drawer-panel');if(drawer&&drawerState()?.gearDrawerOpen)refreshGearDrawer?.();
 const heroVitals=document.querySelector('.hero-vitals');if(heroVitals&&currentTab==='hero')refresh();
}
function startPassiveRegen(){clearInterval(passiveRegenTimer);passiveRegenTimer=setInterval(passiveRegenTick,10000)}
function regenSummary(){return `HP +1%/min • mana +2%/min • stamina +1/${PASSIVE_REGEN.staminaMinutesPerPoint} min`}
function xpNeed(lvl){return Math.floor(110+60*lvl+20*lvl*lvl)}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),2500)}
function save(){
 if(!state||saveDepth||characterSlotTransition)return;
 state.playMode=SAVE_KEY===DEMO_SAVE_KEY?'sandbox':'gps';state.session={combat,dungeonRun,battleResult};
 try{
  const json=JSON.stringify(state);
  localStorage.setItem(characterSlotKey(activeCharacterSlot()),json);
  localStorage.setItem(SAVE_KEY,json);
  localStorage.setItem(characterRegistryKey(),'1');
  save.failed=false;
 }
 catch(error){if(!save.failed)toast('Nie udało się zapisać postępu. Zwolnij miejsce lub wyeksportuj zapis w Menu.');save.failed=true;console.warn('Zapis gry niedostępny',error.name)}
}

function rawLoad(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function characterModeId(){return SAVE_KEY===DEMO_SAVE_KEY?'sandbox':'gps'}
function characterActiveMetaKey(){return SAVE_KEY===DEMO_SAVE_KEY?CHARACTER_META_TEST:CHARACTER_META_REAL}
function characterRegistryKey(mode=characterModeId()){return `time4heroes_character_registry_${mode}_v3`}
function characterSaveIdentity(save){return save?.created?`created:${save.created}`:save?.player?`${save.player.name||''}|${save.player.class||''}|${save.player.level||1}`:''}
function characterSlotRowsRaw(mode=characterModeId()){return Array.from({length:CHARACTER_LIMIT},(_,i)=>({slot:i+1,save:rawLoad(characterSlotKey(i+1,mode))}))}
function repairCharacterRegistry(){
 const mode=characterModeId();
 let active=activeCharacterSlot();
 let rows=characterSlotRowsRaw(mode);
 let occupied=rows.filter(x=>x.save?.player);
 const canonical=rawLoad(SAVE_KEY);
 // One-time migration only: the old single save may seed slot 1 only when no slots exist yet.
 if(!occupied.length&&canonical?.player){
  localStorage.setItem(characterSlotKey(1,mode),JSON.stringify(canonical));
  setActiveCharacterSlot(1);active=1;
  rows=characterSlotRowsRaw(mode);occupied=rows.filter(x=>x.save?.player);
 }
 // Clean up exact duplicate characters produced by the old slot-switch race.
 const groups=new Map();
 for(const row of occupied){
  const id=characterSaveIdentity(row.save);if(!id)continue;
  if(!groups.has(id))groups.set(id,[]);groups.get(id).push(row);
 }
 for(const dupes of groups.values()){
  if(dupes.length<2)continue;
  const keep=dupes.find(x=>x.slot===active)||dupes[0];
  for(const row of dupes){if(row.slot!==keep.slot)localStorage.removeItem(characterSlotKey(row.slot,mode))}
 }
 rows=characterSlotRowsRaw(mode);occupied=rows.filter(x=>x.save?.player);
 let activeSave=rawLoad(characterSlotKey(active,mode));
 if(!activeSave?.player&&occupied.length){
  active=occupied[0].slot;setActiveCharacterSlot(active);activeSave=occupied[0].save;
 }
 // From this point the selected slot is the source of truth. The legacy key is mirror-only.
 if(activeSave?.player)localStorage.setItem(SAVE_KEY,JSON.stringify(activeSave));
 else localStorage.removeItem(SAVE_KEY);
 localStorage.setItem(characterRegistryKey(mode),'1');
 return activeSave?.player?activeSave:null;
}
function activeCharacterSlot(){
 const n=Number(localStorage.getItem(characterActiveMetaKey())||1);
 return Number.isInteger(n)&&n>=1&&n<=CHARACTER_LIMIT?n:1;
}
function setActiveCharacterSlot(slot){
 slot=Math.max(1,Math.min(CHARACTER_LIMIT,Number(slot)||1));
 localStorage.setItem(characterActiveMetaKey(),String(slot));
 return slot;
}
function characterSlotKey(slot,mode=characterModeId()){return `time4heroes_character_${mode}_${Math.max(1,Math.min(CHARACTER_LIMIT,Number(slot)||1))}`}
function characterSnapshot(slot){
 slot=Math.max(1,Math.min(CHARACTER_LIMIT,Number(slot)||1));
 const stored=rawLoad(characterSlotKey(slot));
 if(slot===activeCharacterSlot()&&state)return state;
 return stored;
}
function characterSlots(){return Array.from({length:CHARACTER_LIMIT},(_,i)=>{const slot=i+1,save=characterSnapshot(slot);return {slot,save,active:slot===activeCharacterSlot()}})}
function characterCount(){return characterSlots().filter(x=>x.save?.player).length}
function persistCurrentCharacterSlot(){
 if(!state)return false;
 const copy=JSON.parse(JSON.stringify(state));copy.playMode=SAVE_KEY===DEMO_SAVE_KEY?'sandbox':'gps';copy.session={combat,dungeonRun,battleResult};
 try{const json=JSON.stringify(copy);localStorage.setItem(characterSlotKey(activeCharacterSlot()),json);localStorage.setItem(SAVE_KEY,json);localStorage.setItem(characterRegistryKey(),'1');return true}catch{return false}
}
function prepareCharacterChange(){
 if(combat||dungeonRun||battleResult){toast('Najpierw zakończ walkę lub wyprawę.');return false}
 if(state&&!persistCurrentCharacterSlot())return toast('Nie udało się zapisać bieżącej postaci.'),false;
 try{if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch)}catch{}
 gpsWatch=null;stopAmbient();clearDungeonTimer();destroyRealMap();return true;
}
function switchCharacterSlot(slot){
 slot=Math.max(1,Math.min(CHARACTER_LIMIT,Number(slot)||1));
 if(slot===activeCharacterSlot())return toast('Ta postać jest już aktywna.');
 const next=rawLoad(characterSlotKey(slot));if(!next?.player)return toast('Ten slot jest pusty.');
 if(!prepareCharacterChange())return;
 // Freeze all unload/visibility autosaves before changing the active slot.
 characterSlotTransition=true;
 setActiveCharacterSlot(slot);
 state=JSON.parse(JSON.stringify(next));
 localStorage.setItem(SAVE_KEY,JSON.stringify(next));
 location.reload();
}
function createCharacterSlot(slot){
 slot=Math.max(1,Math.min(CHARACTER_LIMIT,Number(slot)||1));
 if(rawLoad(characterSlotKey(slot))?.player)return toast('Ten slot jest już zajęty.');
 if(!prepareCharacterChange())return;
 characterSlotTransition=true;
 setActiveCharacterSlot(slot);localStorage.removeItem(characterSlotKey(slot));localStorage.removeItem(SAVE_KEY);localStorage.setItem(characterRegistryKey(),'1');
 state=null;combat=null;dungeonRun=null;battleResult=null;currentTab='map';
 // Creation continues in the same document, so re-enable saving for the new character only now.
 characterSlotTransition=false;render();
}
function removeCharacterSlot(slot){
 slot=Math.max(1,Math.min(CHARACTER_LIMIT,Number(slot)||1));
 const snap=characterSnapshot(slot);if(!snap?.player)return;
 const name=snap.player.name||`Postać ${slot}`;
 if(!confirm(`Usunąć postać „${name}” ze slotu ${slot}? Tego nie można cofnąć.`))return;
 const isActive=slot===activeCharacterSlot();
 if(isActive){
  characterSlotTransition=true;
  try{if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch)}catch{}gpsWatch=null;stopAmbient();clearDungeonTimer();destroyRealMap();
  localStorage.removeItem(characterSlotKey(slot));localStorage.removeItem(SAVE_KEY);
  let replacement=null;for(let i=1;i<=CHARACTER_LIMIT;i++){if(i===slot)continue;const candidate=rawLoad(characterSlotKey(i));if(candidate?.player){replacement={slot:i,save:candidate};break}}
  if(replacement){setActiveCharacterSlot(replacement.slot);localStorage.setItem(SAVE_KEY,JSON.stringify(replacement.save))}else setActiveCharacterSlot(1);
  state=null;combat=null;dungeonRun=null;battleResult=null;currentTab='map';location.reload();return;
 }
 localStorage.removeItem(characterSlotKey(slot));openCharacterManager();
}
function characterCardHTML(row){
 const p=row.save?.player;
 if(!p)return `<div class="character-slot-card empty"><div class="character-slot-number">SLOT ${row.slot}</div><div class="character-slot-empty">＋</div><b>Wolny slot</b><small>Utwórz nowego bohatera</small><button class="primary" data-character-create="${row.slot}">Stwórz postać</button></div>`;
 const c=CLASSES[p.class]||{name:p.class};
 return `<div class="character-slot-card ${row.active?'active':''}"><div class="character-slot-number">SLOT ${row.slot}${row.active?' • AKTYWNA':''}</div><div class="character-slot-avatar">${classVisual(p.class,'sprite-character-slot')}</div><div class="character-slot-copy"><b>${p.name}</b><span>${c.name} • poziom ${p.level||1}</span><small>⚔️ ${p.kills||0} zabitych • 🪙 ${p.gold||0}</small></div><div class="character-slot-actions">${row.active?'<button class="secondary" disabled>Aktualna postać</button>':`<button class="primary" data-character-switch="${row.slot}">Graj</button>`}<button class="danger compact" data-character-delete="${row.slot}">Usuń</button></div></div>`;
}
function openCharacterManager(){
 const rows=characterSlots(),count=rows.filter(x=>x.save?.player).length;
 openModal(`<div class="character-manager"><div class="modal-head"><div><span class="eyebrow">BOHATEROWIE</span><h2>Twoje postacie</h2><p class="muted">${count}/${CHARACTER_LIMIT} zajętych slotów • każda postać ma osobny postęp</p></div><button class="close" data-close>×</button></div><div class="character-slot-grid">${rows.map(characterCardHTML).join('')}</div><div class="character-manager-note">Możesz mieć maksymalnie ${CHARACTER_LIMIT} postaci. Klasy mogą się powtarzać, ale pięć slotów pozwala wygodnie prowadzić po jednym bohaterze każdej klasy.</div></div>`);
 const root=document.querySelector('.modal-back');
 root?.querySelectorAll('[data-character-switch]').forEach(b=>b.onclick=()=>switchCharacterSlot(Number(b.dataset.characterSwitch)));
 root?.querySelectorAll('[data-character-create]').forEach(b=>b.onclick=()=>{closeModal();createCharacterSlot(Number(b.dataset.characterCreate))});
 root?.querySelectorAll('[data-character-delete]').forEach(b=>b.onclick=()=>removeCharacterSlot(Number(b.dataset.characterDelete)));
}
function itemDef(id){return ITEMS[id]||{id,name:id,icon:'❓',type:'unknown',rarity:'common',value:0}}
function skillDef(id){return (SKILLS[state.player.class]||[]).find(s=>s.id===id)}
const CLASS_SKILL_TRIALS={
 knight:{
  shield:{type:'tutorialKill',count:1,label:'Pokonaj pierwszego potwora w samouczku'},
  fortress:{type:'stat',key:'blocks',count:5,label:'Zablokuj tarczą 5 ataków'},
  lastStand:{type:'stat',key:'lowHpWins',count:3,label:'Wygraj 3 walki mając 35% HP lub mniej'},
  counter:{type:'stat',key:'defends',count:6,label:'Przyjmij postawę Obrony 6 razy'},
  breaker:{type:'stat',key:'skillUse_counter',count:8,label:'Wykonaj 8 Kontrataków'},
  riposte:{type:'stat',key:'bossBreaks',count:2,label:'Przełam 2 bossów, Herosów lub Legendy'},
  taunt:{type:'stat',key:'damageTaken',count:250,label:'Przyjmij łącznie 250 obrażeń w walce'},
  rally:{type:'stat',key:'skillUse_taunt',count:8,label:'Użyj Prowokacji 8 razy'},
  banner:{type:'stat',key:'eliteWins',count:5,label:'Pokonaj 5 elitarnych przeciwników'}
 },
 mage:{
  fire:{type:'tutorialKill',count:1,label:'Pokonaj pierwszego potwora w samouczku'},
  heal:{type:'stat',key:'manaSpent',count:80,label:'Zużyj 80 many w walce, aby opanować magię odnowy'},
  elemental:{type:'stat',key:'burnApplied',count:8,label:'Podpal przeciwników 8 razy'},
  meteor:{type:'stat',key:'burningKills',count:5,label:'Pokonaj 5 przeciwników, gdy są podpaleni'},
  frost:{type:'family',family:'Nieumarli',count:6,label:'Pokonaj 6 Nieumarłych'},
  iceArmor:{type:'stat',key:'freezeApplied',count:6,label:'Zamroź przeciwników 6 razy'},
  frostNova:{type:'stat',key:'noDamageWins',count:3,label:'Wygraj 3 walki bez otrzymania obrażeń'},
  spark:{type:'stat',key:'critHits',count:8,label:'Zadaj 8 trafień krytycznych czarami'},
  arcaneSurge:{type:'stat',key:'manaSpent',count:220,label:'Zużyj łącznie 220 many w walce'},
  arcaneRift:{type:'stat',key:'bossBreaks',count:2,label:'Przełam 2 bossów, Herosów lub Legendy'}
 },
 hunter:{
  double:{type:'tutorialKill',count:1,label:'Pokonaj pierwszego potwora w samouczku'},
  mark:{type:'stat',key:'farHits',count:12,label:'Traf przeciwników 12 razy z dystansu DALEKO'},
  eagleEye:{type:'stat',key:'markedCrits',count:5,label:'Zadaj 5 krytyków oznaczonym celom'},
  petStrike:{type:'stat',key:'petAttacks',count:10,label:'Niech chowaniec wykona 10 ataków'},
  pack:{type:'stat',key:'petKills',count:5,label:'Niech chowaniec dobije 5 przeciwników'},
  beastFury:{type:'stat',key:'petEliteWins',count:3,label:'Pokonaj 3 elity z aktywnym chowańcem'},
  volley:{type:'stat',key:'multiHitActions',count:10,label:'Wykonaj 10 wielokrotnych ataków'},
  camouflage:{type:'stat',key:'dodges',count:8,label:'Uniknij 8 ataków przeciwnika'},
  piercingShot:{type:'stat',key:'weakHits',count:10,label:'Traf słabość przeciwnika 10 razy'}
 },
 berserker:{
  rage:{type:'tutorialKill',count:1,label:'Pokonaj pierwszego potwora w samouczku'},
  roar:{type:'stat',key:'damageTaken',count:200,label:'Przyjmij łącznie 200 obrażeń'},
  berserk:{type:'stat',key:'lowHpWins',count:3,label:'Wygraj 3 walki mając 35% HP lub mniej'},
  cleave:{type:'stat',key:'closeHits',count:12,label:'Traf przeciwników 12 razy w zwarciu'},
  blood:{type:'stat',key:'bleedApplied',count:8,label:'Nałóż krwawienie 8 razy'},
  execution:{type:'stat',key:'finishingBlows',count:8,label:'Zadaj 8 ciosów kończących walkę'},
  dualCut:{type:'stat',key:'dualWieldAttacks',count:10,label:'Wykonaj 10 ataków z dwiema broniami'},
  whirlwind:{type:'stat',key:'skillUse_dualCut',count:10,label:'Użyj Podwójnego Cięcia 10 razy'},
  bloodRush:{type:'stat',key:'critLowHp',count:6,label:'Zadaj 6 krytyków mając mniej niż połowę HP'}
 },
 ranger:{
  poison:{type:'tutorialKill',count:1,label:'Pokonaj pierwszego potwora w samouczku'},
  destiny:{type:'stat',key:'poisonApplied',count:8,label:'Zatruj przeciwników 8 razy'},
  venomRain:{type:'stat',key:'poisonedKills',count:5,label:'Pokonaj 5 zatrutych przeciwników'},
  trap:{type:'monster',monster:'wolf',count:10,label:'Wytrop i pokonaj 10 Szarych Wilków'},
  vine:{type:'stat',key:'skillUse_trap',count:8,label:'Użyj Leśnej pułapki 8 razy'},
  snareShot:{type:'stat',key:'debuffedWins',count:5,label:'Pokonaj 5 osłabionych przeciwników'},
  spirit:{type:'stat',key:'petAttacks',count:10,label:'Niech chowaniec wykona 10 ataków'},
  windStep:{type:'stat',key:'dodges',count:8,label:'Uniknij 8 ataków przeciwnika'},
  wildFocus:{type:'stat',key:'petEliteWins',count:3,label:'Pokonaj 3 elity z aktywnym chowańcem'}
 }
};
function trialStat(key,amount=1){if(!state?.player)return 0;state.player.trialStats ||= {};state.player.trialStats[key]=Math.max(0,Number(state.player.trialStats[key]||0)+Number(amount||0));return state.player.trialStats[key]}
function trialStatValue(key){return Number(state.player.trialStats?.[key]||0)}
function skillTrialDef(skill){
 const special=CLASS_SKILL_TRIALS[state.player.class]?.[skill.id];if(special)return special;
 return {type:'stat',key:'classActions',count:10,label:'Wykonaj 10 akcji charakterystycznych dla klasy'};
}
function skillTrialProgress(skill){
 const t=skillTrialDef(skill),b=state.player.bestiary||{};let value=0;
 if(t.type==='monster')value=Number(b[t.monster]||0);
 else if(t.type==='family')value=Object.entries(b).reduce((sum,[id,n])=>sum+((MONSTERS.find(m=>m.id===id)?.family===t.family)?Number(n||0):0),0);
 else if(t.type==='kills')value=Number(state.player.kills||0);
 else if(t.type==='tutorialKill')value=state.tutorial?.flags?.kill?1:0;
 else if(t.type==='stat')value=trialStatValue(t.key);
 return {trial:t,value:Math.min(t.count,value),raw:value,done:value>=t.count};
}
function skillTrialText(skill){const x=skillTrialProgress(skill);return `${x.trial.label} • ${Math.floor(x.value)}/${x.trial.count}`}
const MAX_ACTIVE_SKILLS=4;
function ensureCombatSkillLoadout(s=state){
 const p=s?.player;if(!p)return[];
 p.skills ||= [];
 const known=new Set((SKILLS[p.class]||[]).map(x=>x.id));
 if(!Array.isArray(p.activeSkills))p.activeSkills=p.skills.filter(id=>known.has(id)).slice(0,MAX_ACTIVE_SKILLS);
 p.activeSkills=[...new Set(p.activeSkills)].filter(id=>p.skills.includes(id)&&known.has(id)).slice(0,MAX_ACTIVE_SKILLS);
 return p.activeSkills;
}
function activeCombatSkills(){return ensureCombatSkillLoadout().map(skillDef).filter(Boolean)}
function toggleCombatSkill(id){
 const p=state.player,s=skillDef(id);if(!s||!p.skills.includes(id))return toast('Najpierw odblokuj tę umiejętność.');
 const active=ensureCombatSkillLoadout();
 if(active.includes(id)){p.activeSkills=active.filter(x=>x!==id);save();toast(`${s.name} usunięto z paska walki.`);return}
 if(active.length>=MAX_ACTIVE_SKILLS)return toast(`Masz już ${MAX_ACTIVE_SKILLS}/${MAX_ACTIVE_SKILLS} aktywne umiejętności. Najpierw usuń jedną z paska.`);
 p.activeSkills=[...active,id];save();toast(`${s.name} dodano do paska walki.`)
}
function combatLoadoutHTML(){
 const p=state.player,active=ensureCombatSkillLoadout();
 return `<section class="combat-loadout-card"><div class="combat-loadout-head"><div><span class="eyebrow">PASEK WALKI</span><h3>Aktywne umiejętności</h3><p>W walce możesz mieć maksymalnie ${MAX_ACTIVE_SKILLS} aktywne umiejętności. Atak, Obrona i Mikstury są zawsze dostępne osobno.</p></div><span class="pill gold">${active.length}/${MAX_ACTIVE_SKILLS}</span></div><div class="combat-loadout-slots">${Array.from({length:MAX_ACTIVE_SKILLS},(_,i)=>{const id=active[i],skill=id?skillDef(id):null;return skill?`<button class="combat-loadout-slot filled" data-remove-active="${skill.id}" title="Kliknij, aby usunąć z paska"><span>${skillIconVisual(skill.id,'loadout-skill-svg')}</span><b>${skill.name}</b><small>Slot ${i+1} • kliknij, aby usunąć</small></button>`:`<div class="combat-loadout-slot empty"><span>＋</span><b>Wolny slot</b><small>Slot ${i+1}</small></div>`}).join('')}</div></section>`;
}
function petDef(id){return PETS[id]||null}
function itemName(inst){const d=itemDef(inst.id);return `${d.name}${inst.affix?.name?` ${inst.affix.name}`:''}${(inst.upgrade||0)>0?` +${inst.upgrade}`:''}`}
function countItem(id){return state.player.inventory.filter(x=>x.id===id).reduce((a,x)=>a+(x.qty||1),0)}
const STACK_MAX=32;
function isStackable(id){return ['consumable','material','rune','ammo'].includes(itemDef(id).type)}
function stackLimit(id){return itemDef(id).maxStack||STACK_MAX}
function inventoryCapacity(){return state?.player?.inventoryCapacity||36}
function ensureBackpackSlots(s=state){
 const inv=s?.player?.inventory||[],cap=s?.player?.inventoryCapacity||36,used=new Set(),pending=[],equippedUids=new Set(Object.values(s?.player?.equipped||{}).map(x=>x?.uid).filter(Boolean));
 for(let index=0;index<inv.length;index++){const item=inv[index];if(item?.uid&&equippedUids.has(item.uid))continue;const slot=Number(item.bagSlot);if(Number.isInteger(slot)&&slot>=0&&slot<cap&&!used.has(slot)){item.bagSlot=slot;used.add(slot)}else pending.push(item)}
 for(const item of pending){let slot=0;while(slot<cap&&used.has(slot))slot++;if(slot>=cap)break;item.bagSlot=slot;used.add(slot)}
 return used;
}
function backpackEntries(){ensureBackpackSlots();const inv=state?.player?.inventory||[];return inv.map((item,index)=>({item,index,slot:Number(item.bagSlot)})).filter(({item})=>!inventoryItemEquippedSlot(item)).sort((a,b)=>a.slot-b.slot)}
function inventoryUsedSlots(){return backpackEntries().length}
function normalizeInventoryStacks(inv=[]){const out=[];for(const raw of inv){const i={...raw};if(isStackable(i.id)){let q=Math.max(1,Number(i.qty)||1),first=true;while(q>0){const lim=stackLimit(i.id),part={...i,qty:Math.min(lim,q)};if(!first)delete part.bagSlot;out.push(part);q-=lim;first=false}}else out.push(i)}return out}
function inventoryHasRoom(slots=1){return inventoryUsedSlots()+slots<=inventoryCapacity()}
function firstFreeBackpackSlot(excludeItem=null){const cap=inventoryCapacity(),used=new Set(backpackEntries().filter(e=>e.item!==excludeItem).map(e=>e.slot));for(let i=0;i<cap;i++)if(!used.has(i))return i;return -1}
function moveBackpackItemToSlot(inventoryIndex,targetSlot){
 const cap=inventoryCapacity(),item=state.player.inventory[inventoryIndex];if(!item||inventoryItemEquippedSlot(item))return false;ensureBackpackSlots();targetSlot=Math.max(0,Math.min(cap-1,Number(targetSlot)|0));
 const sourceSlot=Number(item.bagSlot),target=backpackEntries().find(e=>e.slot===targetSlot&&e.item!==item);if(sourceSlot===targetSlot)return true;
 if(target)target.item.bagSlot=sourceSlot;item.bagSlot=targetSlot;state.ui ||= {};state.ui.bagSort='manual';save();haptic(8);return true;
}
function backpackSortKey(item,mode){const d=itemDef(item.id);if(mode==='rarity')return [-rarityRank(d.rarity),d.name];if(mode==='name')return [d.name];if(mode==='value')return [-itemSellValue(item),d.name];const order={weapon:0,offhand:1,helmet:2,armor:3,gloves:4,legs:5,boots:6,amulet:7,ring:8,consumable:8,ammo:9,rune:10,material:11};return [d.slot?order[d.slot]??7:order[d.type]??12,-rarityRank(d.rarity),d.name]}
function compareBackpackItems(a,b,mode){const ka=backpackSortKey(a.item,mode),kb=backpackSortKey(b.item,mode);for(let i=0;i<Math.max(ka.length,kb.length);i++){const x=ka[i],y=kb[i];if(typeof x==='string'||typeof y==='string'){const c=String(x??'').localeCompare(String(y??''),'pl');if(c)return c}else if((x??0)!==(y??0))return (x??0)-(y??0)}return a.index-b.index}
function sortBackpack(mode='type'){if(!['type','rarity','name','value'].includes(mode))return false;const entries=backpackEntries().slice().sort((a,b)=>compareBackpackItems(a,b,mode));entries.forEach((e,slot)=>e.item.bagSlot=slot);state.ui ||= {};state.ui.bagSort=mode;save();return true}
function bagSortOptionsHTML(){const current=state.ui?.bagSort||'manual';return `<label class="bag-sort-control"><span>Segreguj</span><select data-bag-sort><option value="manual" ${current==='manual'?'selected':''}>Ręcznie</option><option value="type" ${current==='type'?'selected':''}>Typ</option><option value="rarity" ${current==='rarity'?'selected':''}>Rzadkość</option><option value="name" ${current==='name'?'selected':''}>Nazwa</option><option value="value" ${current==='value'?'selected':''}>Wartość</option></select></label>`}

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
 const goingToTest=SAVE_KEY!==DEMO_SAVE_KEY,currentSlot=activeCharacterSlot();save();persistCurrentCharacterSlot();
 if(goingToTest&&!rawLoad(DEMO_SAVE_KEY)){
  const copy=JSON.parse(JSON.stringify(state));copy.settings.demo=true;copy.playMode='sandbox';copy.session={};copy.player.position.gps=false;copy.player.position.receivedAt=0;
  localStorage.setItem(DEMO_SAVE_KEY,JSON.stringify(copy));localStorage.setItem(CHARACTER_META_TEST,String(currentSlot));
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
const ENCHANTMENTS=[
 {name:'Płomień',power:4,perk:{critDamage:.08},label:'+4 mocy • +8% obrażeń krytycznych',slots:['weapon','offhand','amulet']},
 {name:'Bastion',armor:5,perk:{blockBonus:3},label:'+5 pancerza • +3% bloku',slots:['helmet','armor','gloves','boots','offhand']},
 {name:'Sokole Oko',crit:4,perk:{farDamage:.06},label:'+4% krytyka • +6% na DALEKO',slots:['weapon','offhand','amulet','ring']},
 {name:'Wicher',crit:2,perk:{dodgeBonus:3},label:'+2% krytyka • +3% uniku',slots:['helmet','gloves','boots','amulet','ring']},
 {name:'Grom',power:2,perk:{staggerBonus:6},label:'+2 mocy • +6 przełamania',slots:['weapon','offhand']},
 {name:'Pustka',power:2,perk:{statusDamage:.10},label:'+2 mocy • +10% na cele z efektem',slots:['weapon','amulet','ring']},
 {name:'Żywy Korzeń',armor:3,perk:{petDamage:.12,poisonAmp:.10},label:'+3 pancerza • +12% chowaniec • +10% trucizny',slots:['armor','gloves','boots','offhand','amulet']},
 {name:'Krew',power:3,perk:{lowHpDamage:.10,bleedAmp:.15},label:'+3 mocy • +10% poniżej 50% HP • +15% krwawienia',slots:['weapon','offhand','ring']}
];
function enchantPoolFor(inst){const d=itemDef(inst.id);return ENCHANTMENTS.filter(e=>!e.slots||e.slots.includes(d.slot))}
function enchantEffectText(e){return e?.label||e?.name||''}
function enchantRerollRemaining(inst){return Math.max(0,(inst?.enchantRerollAt||0)-Date.now())}
function forgeWaitLabel(ms){const min=Math.ceil(ms/60000);if(min<60)return `${min} min`;const h=Math.floor(min/60),m=min%60;return `${h} godz.${m?` ${m} min`:''}`}
const SET_BONUSES={raven:{name:'Kruczy Rynsztunek',two:{power:4},three:{armor:5,crit:3}},wild:{name:'Dziki Szlak',two:{crit:5},three:{power:5,armor:3}},mist:{name:'Strażnik Mgieł',two:{armor:4,crit:3},three:{power:7,armor:4}},ashguard:{name:'Popielna Straż',two:{power:8,armor:4},three:{power:7,crit:5}},stormforged:{name:'Nawałnica',two:{crit:6,armor:5},three:{power:10,crit:4}}};
for(const d of Object.values(ITEMS)){if(d.classGear&&d.set&&!SET_BONUSES[d.set])SET_BONUSES[d.set]={name:d.setName||d.set,two:d.setTwo||{},three:d.setThree||{},classId:d.setClass||d.classes?.[0],level:d.setLevel||d.reqLevel||1}}
const ECONOMY={sell:{common:.22,uncommon:.25,rare:.28,epic:.32,heroic:.35,legendary:.38},shopMarkup:1.18,auctionMin:.92,auctionMax:1.24,travelBase:10,travelPer100m:3,auctionFee:.03,auctionCommission:.07};
const GEAR_POOLS={uncommon:['shortSword','yewBow','apprenticeStaff','scoutHood','mageHood','leatherGloves','trailBoots','woodenShield','oldTalisman','chainVest','rangerLeather','apprenticeRobe'],rare:['ironAxe','warHammer','axe','blueBlade','forestBow','emberWand','arcaneStaff','wolfCharm','ironHelm','ironShield','ironArmor','runicRobe','rangerLeather','emberRing','boneRing'],epic:['ravenBlade','ravenMail','ravenHelm','wildBow','wildMail','wildHood','wildBoots','arcaneRobe','mistBlade','mistBow','mistStaff','mistMail','mistLeathers','mistRobe','mistHelm','mistHood','mistCirclet','ashBlade','ashBow','ashStaff','ashMail','ashLeathers','ashRobe','ashHelm','ashHood','ashCowl','stormSpear','stormBow','stormStaff','stormMail','stormLeathers','stormRobe','stormHelm','stormHood','stormCowl'],heroic:['mireCharm','cinderCharm','tempestCharm'],legendary:['stormCrown','cryptHeart']};
// 3.9.8.5 — nowe bronie mogą wypadać jako normalny loot klasowy
GEAR_POOLS.uncommon.push('steelSaber','watchmanMace','raiderAxe','cleaver','focusWand','sparkRod','scoutLongbow','quickBow','serpentBow','trailBow');
GEAR_POOLS.rare.push('oathSword','ironVowHammer','bloodAxe','skullHammer','frostStaff','manaRod','eagleBow','piercingBow','venomBow','trapperBow');
GEAR_POOLS.epic.push('bastionBlade','guardianSpear','mistBulwarkSword','sentinelHammer','ashOathSword','ashSentinelHammer','stormHalberd','stormOathBlade','ravenAxe','executionerBlade','mistReaver','breakerMaul','ashReaver','ashSkullMaul','stormGreatAxe','stormBloodBlade','emberStaff','voidWand','runeStaff20','mistWand','frostScepter','ashWand','runicScepter','tempestWand','stormScepter','ravenLongbow','beastmasterBow','mistLongbow','falconBow','ashLongbow','marksmanBow','stormLongbow','skyPiercer','wildVenomBow','beastBondBow','mistVenomBow','stalkerBow','ashVenomBow','shadowBow','tempestTrackerBow','stormSerpentBow');
for(const d of Object.values(ITEMS)){if(d.classGear&&GEAR_POOLS[d.rarity]&&!GEAR_POOLS[d.rarity].includes(d.id))GEAR_POOLS[d.rarity].push(d.id)}
function rarityRank(r){return ({common:0,uncommon:1,rare:2,epic:3,heroic:4,legendary:5})[r]||0}
function affixChance(r){return ({common:0,uncommon:.14,rare:.32,epic:.58,heroic:.82,legendary:1})[r]||0}
function createGearInstance(id){const d=itemDef(id),inst={id,uid:uid(),upgrade:0,rune:null,enchant:null,enchantRolls:0,affix:null};if(d.slot&&Math.random()<affixChance(d.rarity))inst.affix={...pick(AFFIXES)};return inst}
function merchantBuyPrice(id){const d=itemDef(id),typeMult=d.type==='material'?1.22:d.type==='consumable'?1.14:ECONOMY.shopMarkup;return Math.max(1,Math.ceil((d.value||1)*typeMult*(1-shopDiscount())))}
function itemSellValue(inst){const d=itemDef(inst.id),base=d.value||0,m=ECONOMY.sell[d.rarity]??.22,up=inst.upgrade||0,rank=rarityRank(d.rarity),quality=1+up*.045+(inst.affix?.name?.length?0.06:0)+(inst.enchant?.name?.length?0.10:0)+(inst.rune?0.08:0);return Math.max(1,Math.floor(base*m*quality+rank))}
function salvageYield(inst){const d=itemDef(inst.id),rank=rarityRank(d.rarity),up=inst.upgrade||0;return {scrap:Math.max(1,1+Math.floor(rank/2)+Math.ceil(up*.75)),shards:rank>=3?Math.max(1,Math.floor((rank-1)/2)+(up>=8?1:0)):0,crystal:rank>=4||up>=9?1:0}}
const MAX_ITEM_UPGRADE=10;
function itemUpgradeCap(inst){const rank=rarityRank(itemDef(inst.id).rarity);return Math.min(MAX_ITEM_UPGRADE,5+rank)}
function upgradeQuote(inst){const d=itemDef(inst.id),up=inst.upgrade||0,rank=rarityRank(d.rarity),target=up+1;return {gold:Math.ceil((18+(d.value||10)*.075+rank*10)*Math.pow(target,1.30)*(1-cityDiscount('smith'))*(1-guildForgeDiscount())),scrap:target<=1?0:Math.max(1,Math.ceil((target+rank)/2)),crystal:target>=5?1+(target>=9?1:0):0,shard:target>=8?1:0}}
const ENCHANT_REROLL_COOLDOWN=12*60*60*1000;
function enchantQuote(inst,reroll=false){const rank=rarityRank(itemDef(inst.id).rarity),rolls=inst.enchantRolls||0;return {gold:Math.ceil((65+rank*34+(reroll?55+rolls*28:0))*(1-cityDiscount('smith'))*(1-guildForgeDiscount())),crystal:1+(rank>=3?1:0)+(reroll&&rolls>=2?1:0),shard:reroll?1+(rolls>=3?1:0):0}}
function craftFee(recipe){const d=itemDef(recipe.result),rank=rarityRank(d.rarity),disc=recipe.station==='smith'?cityDiscount('smith'):recipe.station==='alchemist'?cityDiscount('alchemist'):0;return Math.ceil((6+(d.value||10)*.055+rank*10)*(1-disc))}
function travelCost(node){const d=dist(node,state.player.position);return Math.max(ECONOMY.travelBase,Math.ceil(ECONOMY.travelBase+d/100*ECONOMY.travelPer100m))}
function ensureEconomyState(s=state){if(!s)return;s.economy ||= {elitePity:0,bossPity:0,totalSold:0,totalSalvaged:0,auctionListings:[],auctionSold:0};s.economy.elitePity ||= 0;s.economy.bossPity ||= 0;s.economy.totalSold ||= 0;s.economy.totalSalvaged ||= 0;s.economy.auctionListings ||= [];s.economy.auctionSold ||= 0}
function itemClassAllowed(d,cls=state?.player?.class){return !d?.classes||!cls||d.classes.includes(cls)}
function itemClassNames(d){return d?.classes?.map(id=>CLASSES[id]?.name||id).join(', ')||'Wszystkie klasy'}
function randomGearFrom(tier){const pool=(GEAR_POOLS[tier]||[]).filter(id=>{const d=itemDef(id);return (!d.reqLevel||state.player.level>=d.reqLevel)&&itemClassAllowed(d)});if(!pool.length)return null;return pick(pool)}
function lootChanceLabel(chance){const pct=chance*100;return `${pct<1?pct.toFixed(1):pct<10?pct.toFixed(1):Math.round(pct)}%`}
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
const MATERIAL_SOURCE_CACHE=new Map();
function materialSourceLabel(id){
 if(MATERIAL_SOURCE_CACHE.has(id))return MATERIAL_SOURCE_CACHE.get(id);
 const drops=MONSTERS.flatMap(m=>monsterLootTable(m.id).filter(row=>row.id===id).map(row=>({name:m.name,level:m.min,chance:row.chance||0})))
  .sort((a,b)=>b.chance-a.chance||a.level-b.level).slice(0,2);
 const processing=RECIPES.find(r=>r.result===id&&r.station==='smith')?'Przetwarzanie u kowala':RECIPES.find(r=>r.result===id&&r.station==='alchemist')?'Warzenie u alchemika':'';
 const sources=[...(drops.length?[`Łup: ${drops.map(x=>`${x.name} (lvl ${x.level}+)`).join(', ')}`]:[]),...(processing?[processing]:[]),...(['herb','scrap'].includes(id)?['Sklep kupiecki']:[])];
 const label=sources.join(' • ')||'Sprawdź wydarzenia i eksplorację mapy';MATERIAL_SOURCE_CACHE.set(id,label);return label
}
function monsterLootHTML(m){const rows=monsterLootTable(m.id);if(!rows.length)return '<div class="loot-empty">Brak zarejestrowanych łupów.</div>';return `<div class="bestiary-loot-grid">${rows.map(r=>{const d=itemDef(r.id);return `<div class="bestiary-loot-row"><span class="loot-icon">${itemIconVisual(d.id,'item-svg')}</span><div><b class="rarity-${d.rarity}">${d.name}</b><small>${lootChanceLabel(r.chance)} • ${r.min||1}${(r.max||r.min||1)!==(r.min||1)?`–${r.max}`:''} szt.</small></div></div>`}).join('')}</div>`}
function rollMonsterMaterials(m,e,c){const drops=[];const elite=!!e?.elite,boss=!!c?.isBoss||!!c?.worldBoss,variantLoot=m?.variantLoot||1;for(const row of monsterLootTable(m.id)){const chance=Math.min(1,row.chance*(elite?1.12:1)*(boss?1.18:1)*variantLoot*lootRowLuckMultiplier(row));if(Math.random()>chance)continue;let qty=rnd(row.min||1,row.max||row.min||1);if(elite&&Math.random()<.30)qty++;if(boss&&Math.random()<.45)qty++;if(['corrupted','ancient'].includes(m?.variantId)&&Math.random()<.24)qty++;drops.push({id:row.id,qty})}return drops}
function mergeLootDrops(drops=[]){const merged=[];const stackIndex=new Map();for(const drop of drops.filter(Boolean)){const qty=Math.max(1,drop.qty||1);if(isStackable(drop.id)){if(stackIndex.has(drop.id)){merged[stackIndex.get(drop.id)].qty+=qty}else{stackIndex.set(drop.id,merged.length);merged.push({id:drop.id,qty,gear:false})}}else{for(let i=0;i<qty;i++)merged.push({id:drop.id,qty:1,gear:true})}}return merged}
function lootToastText(drops=[]){if(!drops.length)return '';const merged={};for(const d of drops)merged[d.id]=(merged[d.id]||0)+(d.qty||1);const bits=Object.entries(merged).slice(0,4).map(([id,q])=>`${q}× ${itemDef(id).name}`);const extra=Object.keys(merged).length>4?` +${Object.keys(merged).length-4} więcej`:'';return bits.join(' • ')+extra}
function rollNamedGear(m,drops){
 const options=monsterLootTable(m.id).filter(r=>{const d=ITEMS[r.id];return d?.slot&&itemClassAllowed(d)&&(!d.reqLevel||state.player.level>=d.reqLevel)});
 if(!options.length)return null;
 const total=options.reduce((n,r)=>n+r.chance,0);let roll=Math.random()*total;
 return (options.find(r=>(roll-=r.chance)<=0)||options.at(-1)).id;
}
function rollCombatLoot(m,e,c){
 ensureEconomyState();const drops=rollMonsterMaterials(m,e,c);
 if(m.variantId==='hardened'&&Math.random()<.34)drops.push({id:'hardenedMark',qty:1});
 if(m.variantId==='corrupted'&&Math.random()<.62)drops.push({id:'corruptedEssence',qty:1});
 if(m.variantId==='ancient'){drops.push({id:'ancientRelic',qty:Math.random()<.18?2:1});if(Math.random()<.35)drops.push({id:'runeShard',qty:1})}
 if(Math.random()<Math.min(.10,.018*luckLootMultiplier()))drops.push({id:'crystal',qty:1});
 const elite=!!e?.elite,boss=!!c?.isBoss||!!c?.worldBoss;
 let gearDrop=drops.find(x=>ITEMS[x.id]?.slot)?.id||null;
 if(elite&&!boss){state.economy.elitePity=gearDrop?0:state.economy.elitePity+1;if(!gearDrop&&state.economy.elitePity>=5){gearDrop=rollNamedGear(m,drops);if(gearDrop){drops.push({id:gearDrop,qty:1,gear:true});state.economy.elitePity=0}}if(Math.random()<.18)drops.push({id:'runeShard',qty:1})}
 if(boss){state.economy.bossPity=gearDrop?0:state.economy.bossPity+1;
  if(!gearDrop&&(m.rank==='Legenda'||m.rank==='Heros'||state.economy.bossPity>=3)){gearDrop=rollNamedGear(m,drops);if(gearDrop){drops.push({id:gearDrop,qty:1,gear:true});state.economy.bossPity=0}}
  if(Math.random()<.55)drops.push({id:'runeShard',qty:rnd(1,2)});if(Math.random()<Math.min(.18,.08*luckLootMultiplier()))drops.push({id:randomRuneId(),qty:1})
 }
 let finalDrops=mergeLootDrops(drops);
 if(!state.tutorial?.complete&&!state.tutorial?.rewardGiven){const tutorialDrop=tutorialClassDropId();finalDrops=[{id:tutorialDrop,qty:1,gear:true,tutorial:true},...finalDrops];state.tutorial.rewardGiven=true;playSfx('loot')}
 return {gearDrop,drops:finalDrops};
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
function totalLuck(){return Math.max(0,Number(state?.player?.stats?.lck||0)+gearStat('lck'))}
function luckCritBonus(){return Math.min(20,totalLuck()*.10)}
function luckLootMultiplier(){return 1+Math.min(.35,totalLuck()*.002)}
function luckLootBonusPct(){return (luckLootMultiplier()-1)*100}
function lootRowLuckMultiplier(row){const rarity=itemDef(row?.id)?.rarity||'common';return ['rare','epic','heroic','legendary'].includes(rarity)?luckLootMultiplier():1}
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
function claimBounty(id){ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||!b.accepted||b.claimed||b.progress<b.need)return; b.claimed=true;state.world.entities=state.world.entities.filter(e=>e.bountyId!==b.id);state.player.gold+=b.gold;const rep=Math.max(1,Math.round(b.rep*guildRepMultiplier()));state.adventure.reputation+=rep;gainXp(b.xp);save();renderShell();toast(`Kontrakt wykonany: +${b.xp} XP • +${b.gold} 🪙 • +${rep} reputacji`)}
function worldBossDef(){const list=[MONSTERS.find(m=>m.id==='graveColossus'),MONSTERS.find(m=>m.id==='stormDrake')].filter(Boolean);return list[daySeed()%list.length]||MONSTERS.find(m=>m.id==='ogre')}
function startWorldBoss(){ensureAdventureState();if(state.adventure.worldBossDay===daySeed())return toast('Dzisiejszy boss świata został już pokonany.');if(state.player.level<8)return toast('Boss świata wymaga co najmniej 8 poziomu.');const m=worldBossDef(),e={id:`worldboss_${daySeed()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};startCombat(e,{level:Math.max(m.min,state.player.level+3),worldBoss:true})}


const BIOMES={
 meadow:{name:'Łąki',icon:'🌾',color:'#8fca55',fill:.15,weight:40,rarity:'pospolite',desc:'Otwarte tereny. Częste zwierzęta, gobliny i surowce.'},
 forest:{name:'Las',icon:'🌲',color:'#1f5b2d',fill:.33,weight:28,rarity:'częsty',radius:[290,390],desc:'Gęsty teren pełen wilków, pająków i ukrytych ścieżek.'},
 highlands:{name:'Wzgórza',icon:'⛰️',color:'#927647',fill:.33,weight:17,rarity:'nieczęste',radius:[220,315],desc:'Trudniejszy teren z ogrami i silniejszymi bestiami.'},
 marsh:{name:'Mokradła',icon:'🌫️',color:'#2f8178',fill:.40,weight:10,rarity:'rzadkie',radius:[155,245],desc:'Niebezpieczne bagna, trucizny i rzadkie składniki.'},
 ruins:{name:'Ruiny',icon:'🏚️',color:'#72777f',fill:.45,weight:5,rarity:'bardzo rzadkie',radius:[105,165],desc:'Stare miejsca przyciągające nieumarłych i kultystów.'}
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
const BIOME_SITE_SPACING=720;
const BIOME_STARTER_SITES={
 '0,0':{x:0,y:0,id:'meadow'},
 '-1,0':{x:-460,y:80,id:'forest'},
 '1,0':{x:480,y:130,id:'ruins'},
 '1,-1':{x:765,y:-330,id:'marsh'},
 '-1,-1':{x:-460,y:-430,id:'highlands'}
};
const biomeSiteCache=new Map();
function biomeSite(gx,gy){
 const key=`${gx},${gy}`;if(biomeSiteCache.has(key))return biomeSiteCache.get(key);
 const h=gx*92821+gy*68917+4177,forced=BIOME_STARTER_SITES[`${gx},${gy}`];
 const roll=seeded(h+101)*Object.values(BIOMES).reduce((sum,b)=>sum+b.weight,0);
 let remaining=roll,id='meadow';
 for(const [key,b] of Object.entries(BIOMES)){remaining-=b.weight;if(remaining<0){id=key;break}}
 if(forced)id=forced.id;
 const radius=BIOMES[id].radius;
 const site={gx,gy,id,x:forced?.x??gx*BIOME_SITE_SPACING+(seeded(h+17)-.5)*240,y:forced?.y??gy*BIOME_SITE_SPACING+(seeded(h+53)-.5)*240,
  rx:radius?radius[0]+seeded(h+201)*(radius[1]-radius[0]):0,
  ry:radius?radius[0]+seeded(h+233)*(radius[1]-radius[0]):0,
  phase:seeded(h+259)*Math.PI*2,roughness:.13+seeded(h+281)*.09};
 if(biomeSiteCache.size>2048)biomeSiteCache.clear();biomeSiteCache.set(key,site);
 return site;
}
function biomeRadius(site,angle){
 const a=angle+site.phase;
 return 1+site.roughness*(.65*Math.sin(a*3)+.4*Math.cos(a*5+site.phase)+.22*Math.sin(a*9-site.phase));
}
function biomeContains(site,x,y){
 if(site.id==='meadow')return false;
 const dx=(x-site.x)/site.rx,dy=(y-site.y)/site.ry;
 if(Math.abs(dx)>1.25||Math.abs(dy)>1.25)return false;
 return Math.hypot(dx,dy)<=biomeRadius(site,Math.atan2(dy,dx));
}
function biomeOutline(site,steps=64){
 return Array.from({length:steps},(_,i)=>{const a=i*2*Math.PI/steps,r=biomeRadius(site,a);return {x:site.x+Math.cos(a)*site.rx*r,y:site.y+Math.sin(a)*site.ry*r}});
}
function biomeSitesAround(x=0,y=0,rings=2){
 const spacing=BIOME_SITE_SPACING,cx=Math.round(x/spacing),cy=Math.round(y/spacing),out=[];
 for(let gx=cx-rings;gx<=cx+rings;gx++)for(let gy=cy-rings;gy<=cy+rings;gy++)out.push(biomeSite(gx,gy));
 return out;
}
function biomeAt(x=0,y=0){
 let id='meadow';
 // Kolejność jest taka sama jak przy rysowaniu: sąsiadujące płaty mogą się nakładać.
 for(const site of biomeSitesAround(x,y,2))if(biomeContains(site,x,y))id=site.id;
 return id;
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
function habitatAt(x=0,y=0){
 const biome=biomeAt(x,y),options=HABITATS_BY_BIOME[biome]||HABITATS_BY_BIOME.meadow;
 const hx=Math.floor(x/180),hy=Math.floor(y/180),seed=hx*92821+hy*68917+22109;
 const id=options[Math.floor(seeded(seed)*options.length)%options.length];
 return {id,...HABITATS[id],biome,x,y};
}
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
  const seed=gx*31153+gy*77167+8803,x=(gx+.5)*LOCAL_CHUNK_SIZE+(seeded(seed+11)-.5)*120,y=(gy+.5)*LOCAL_CHUNK_SIZE+(seeded(seed+29)-.5)*120,h=habitatAt(x,y);
  out.push({id:`habitat_${gx}_${gy}`,type:'habitat',name:h.name,icon:h.icon,desc:h.desc,habitat:h.id,biome:h.biome,x,y,radius:270,dynamicLocal:true});
 }
 return out;
}
function generateLocalShrines(origin={x:0,y:0}){
 const {cx,cy}=localChunkCoords(origin.x||0,origin.y||0),out=[];
 for(let gx=cx-LOCAL_CHUNK_RADIUS;gx<=cx+LOCAL_CHUNK_RADIUS;gx++)for(let gy=cy-LOCAL_CHUNK_RADIUS;gy<=cy+LOCAL_CHUNK_RADIUS;gy++){
  const seed=gx*52711+gy*81223+34077;
  if((gx!==0||gy!==0)&&seeded(seed+19)>.42)continue;
  const x=gx*LOCAL_CHUNK_SIZE+165+seeded(seed+41)*370,y=gy*LOCAL_CHUNK_SIZE+165+seeded(seed+67)*370;
  const biome=biomeAt(x,y),names={meadow:'Kapliczka Wędrowców',forest:'Kapliczka Leśnego Szlaku',ruins:'Kapliczka Zapomnianych',marsh:'Kapliczka Wód',highlands:'Kapliczka Górskiego Wiatru'};
  out.push({id:`shrine_${gx}_${gy}`,type:'shrine',name:names[biome],icon:'⛩️',x,y,biome,dynamicLocal:true});
 }
 return out;
}
function generateLivingMonsters(day,origin=state?.player?.position||{x:0,y:0},source=state){
 const out=[];
 const {cx,cy}=localChunkCoords(origin.x||0,origin.y||0),respawns=source?.world?.living?.monsterRespawns||{},level=source?.player?.level||1,now=Date.now();
 for(let gx=cx-LOCAL_CHUNK_RADIUS;gx<=cx+LOCAL_CHUNK_RADIUS;gx++)for(let gy=cy-LOCAL_CHUNK_RADIUS;gy<=cy+LOCAL_CHUNK_RADIUS;gy++){
  const baseSeed=day*1009+gx*92821+gy*68917;
  for(let i=0;i<LOCAL_MOBS_PER_CHUNK;i++){
   const seed=baseSeed+i*193,x=gx*LOCAL_CHUNK_SIZE+55+seeded(seed+17)*(LOCAL_CHUNK_SIZE-110),y=gy*LOCAL_CHUNK_SIZE+55+seeded(seed+53)*(LOCAL_CHUNK_SIZE-110);
   if(source?.city?.placed&&Math.hypot(x-source.city.x,y-source.city.y)<=CITY_RADIUS)continue;
   const habitat=habitatAt(x,y),pool=habitatMonsterPool(habitat.id,level),goblinPool=pool.filter(id=>String(id).startsWith('goblin'));
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
  s.world.entities=[...generateLivingMonsters(day,p,s),...generateLocalHabitatMarkers(p),...generateLocalShrines(p),...events,...staticEntities];
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
 s.version=394;
 s.player ||= {};s.player.name=String(s.player.name||'Wędrowiec').replace(/[<>]/g,'').slice(0,30);if(s.player.guild)s.player.guild=String(s.player.guild).replace(/[<>]/g,'').slice(0,28);
 s.player.stats ||= {str:5,agi:5,int:5,vit:5,lck:3};
 s.player.stats.lck ??= 3;
 s.player.inventory ||= [];
 s.player.inventory=normalizeInventoryStacks(s.player.inventory);
 s.player.inventoryCapacity=Math.max(36,Number(s.player.inventoryCapacity)||36);
 for(const i of s.player.inventory){if(!isStackable(i.id)){i.uid ||= uid();i.upgrade ||= 0;i.rune ??= null;i.enchant ??= null;i.enchantRolls ||= 0;i.affix ??= null}}
 const oldEq=s.player.equipped||{};
 s.player.equipped={weapon:oldEq.weapon||null,helmet:oldEq.helmet||null,armor:oldEq.armor||null,gloves:oldEq.gloves||null,boots:oldEq.boots||null,amulet:oldEq.amulet||oldEq.trinket||null,ring1:oldEq.ring1||null,ring2:oldEq.ring2||null,offhand:oldEq.offhand||null,legs:oldEq.legs||null};
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
 s.player.maxStamina=100; s.player.stamina ??= s.player.maxStamina; s.player.stamina=clamp(s.player.stamina,0,100);
 s.player.kills ||= 0;
 s.quests ||= {active:['q1'],done:[],progress:{}};
 s.quests.active ||= ['q1'];s.quests.done ||= [];s.quests.progress ||= {};
 if(previousVersion<394){
  for(const qid of ['q24','q33','q40','q54']){
   const old=s.quests.progress[qid];if(Array.isArray(old)&&old.length>=2)s.quests.progress[qid]=old.slice(1);
  }
  const reached=id=>s.quests.done.includes(id)||s.quests.active.includes(id);
  if(reached('q19')){
   if(s.quests.done.includes('q19')){for(const id of ['q18a','q18b','q18c','q18d'])if(!s.quests.done.includes(id))s.quests.done.push(id)}
   else if(s.quests.active.includes('q19')&&s.quests.done.includes('q18')){s.quests.active=s.quests.active.filter(id=>id!=='q19');s.quests.active.push('q18a');s.quests.progress.q18a=[0,0]}
  }
  if(QUESTS.some((q,i)=>i>QUESTS.findIndex(x=>x.id==='q20b')&&reached(q.id)))for(const id of ['q20a','q20b'])if(!s.quests.done.includes(id))s.quests.done.push(id);
 }
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
 if(previousVersion<393&&s.world?.living)s.world.living.spawnKey='';
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
 const repaired=repairCharacterRegistry();if(repaired?.player)return normalizeState(repaired);
 if(SAVE_KEY===DEMO_SAVE_KEY||localStorage.getItem(characterActiveMetaKey())!==null||localStorage.getItem(characterRegistryKey())!==null)return null;
 for(const key of MIGRATION_KEYS){const old=rawLoad(key);if(old){const migrated=normalizeState(old);setActiveCharacterSlot(1);localStorage.setItem(characterSlotKey(1),JSON.stringify(migrated));localStorage.setItem(SAVE_KEY,JSON.stringify(migrated));localStorage.setItem(characterRegistryKey(),'1');return migrated}}
 return null;
}
function newGame(name,cls){
 characterSlotTransition=false;
 const c=CLASSES[cls];
 const weapon={id:starterWeapon(cls),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const armor={id:starterArmor(),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const boots={id:starterBoots(),uid:uid(),upgrade:0,rune:null,enchant:null,affix:null};
 const pets=['hunter','ranger'].includes(cls)?[{id:'youngWolf',level:1,xp:0}]:[];
 state={version:394,created:Date.now(),player:{name:String(name||'Wędrowiec').replace(/[<>]/g,'').slice(0,30),class:cls,level:1,xp:0,gold:55,hp:c.hp,maxHp:c.hp,mana:c.mana,maxMana:c.mana,stamina:100,maxStamina:100,stats:{...c.base},statPoints:0,skillPoints:1,skills:[],activeSkills:[],inventoryCapacity:36,inventory:[weapon,armor,boots,...(['hunter','ranger'].includes(cls)?[{id:'primitiveArrow',qty:150}]:[]),{id:'potion',qty:3},{id:'herb',qty:3},{id:'scrap',qty:1}],equipped:{weapon,helmet:null,armor,gloves:null,boots,amulet:null,ring1:null,ring2:null,offhand:null,legs:null},bestiary:{},bestiaryVariants:{},trialStats:{},discovered:[],dungeons:[],dungeonClears:{},position:{x:0,y:0,lat:null,lng:null,gps:false},kills:0,guild:null,friends:[],pets,petActive:pets.length?'youngWolf':null},quests:{active:[],done:[],progress:{}},world:{entities:generateWorld(),gpsOrigin:null,explored:[],fogRadius:100,living:{spawnDay:0,spawnKey:'',eventDay:0,contextKey:'',monsterRespawns:{},completedEvents:[],notifiedEvents:[],eventHistory:[],dailyExplore:{day:daySeed(),cells:{},claimed:false}}},settings:{demo:SAVE_KEY===DEMO_SAVE_KEY,forceNight:false,masterSound:true,audio:true,ambient:true,sfxVolume:.68,ambientVolume:.18,haptics:true,mapMode:'focused',mapFilters:{monster:true,poi:true,dungeon:true,event:true,biome:true,trail:true}},tutorial:{stage:0,complete:false,rewardGiven:false,flags:{},introSeen:false,finishReward:false,mapDismissedStage:-1},ui:{heroView:'char',adventureView:'quests',menuView:'settings'},adventure:{day:daySeed(),reputation:0,bounties:makeDailyBounties(daySeed()),worldBossDay:0,achievements:{}},economy:{elitePity:0,bossPity:0,totalSold:0,totalSalvaged:0,auctionListings:[],auctionSold:0},alchemy:{recipeUses:{}},social:{party:{members:[]},raids:{day:daySeed(),heroWins:0,legendWins:0,history:[]}},regen:{lastAt:Date.now(),hpCarry:0,manaCarry:0,staminaCarry:0},city:{buildings:{tavern:1,shop:1,smith:1,alchemist:1,auction:1,guild:1}}};
 state.version=394;ensureCoreState();ensureLivingWorld();ensureExplorationState();save();render();
}
function resetCharacter(){
 const slot=activeCharacterSlot(),name=state?.player?.name||'postać';
 if(!confirm(`Usunąć bieżącą postać „${name}” ze slotu ${slot}? Pozostałe postacie zostaną zachowane.`))return;
 characterSlotTransition=true;
 try{if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch)}catch{}gpsWatch=null;stopAmbient();clearDungeonTimer();destroyRealMap();
 localStorage.removeItem(characterSlotKey(slot));localStorage.removeItem(SAVE_KEY);
 let replacement=null;for(let i=1;i<=CHARACTER_LIMIT;i++){if(i===slot)continue;const candidate=rawLoad(characterSlotKey(i));if(candidate?.player){replacement={slot:i,save:candidate};break}}
 if(replacement){setActiveCharacterSlot(replacement.slot);localStorage.setItem(SAVE_KEY,JSON.stringify(replacement.save))}else setActiveCharacterSlot(1);
 state=null;combat=null;dungeonRun=null;battleResult=null;currentTab='map';location.reload();
}
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
function syncNorthQuestWorld(){
 const clues={q18a:{id:'north_courier_order',name:'Zasypany rozkaz',icon:'📜',visual:'tracks',distance:95},q18c:{id:'north_seal_piece',name:'Odłamek pieczęci',icon:'◆',visual:'tracks',distance:115},q20a:{id:'cold_shrine_runes',name:'Runy pod ołtarzem',icon:'ᛟ',visual:'tracks',distance:85}};
 for(const [qid,def] of Object.entries(clues)){
  if(!state.quests.active.includes(qid)||currentQuestStepIndex(qid)!==0||questEntityById(def.id))continue;
  const p=state.player.position||{x:0,y:0},pt=questSpawnPoint(p.x||0,p.y||0,def.distance,.7);
  spawnQuestEntity({id:def.id,questId:qid,questStage:0,name:def.name,icon:def.icon,visual:def.visual,x:pt.x,y:pt.y});
 }
 for(const [qid,template,count] of [['q13','goblin',2],['q18','ogre',2],['q18b','goblinWarrior',2],['q18d','ogre',1]]){
  if(!state.quests.active.includes(qid)||currentQuestStepIndex(qid)!==0)continue;
  for(let i=0;i<count;i++){
   const id=`${qid}_guardian_${i}`;if(questEntityById(id))continue;
   const p=state.player.position||{x:0,y:0},pt=questSpawnPoint(p.x||0,p.y||0,105+i*25,.4+i*.75);
   spawnQuestEntity({id,questId:qid,questStage:0,type:'monster',template,variant:'normal',name:MONSTERS.find(m=>m.id===template)?.name,x:pt.x,y:pt.y,alive:true,elite:false});
  }
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
 if(!state?.world)return;state.world.entities=(state.world.entities||[]).filter(e=>e.id!=='pasture');syncQ2World();syncNorthQuestWorld();ensureAdventureState();for(const b of state.adventure.bounties||[])if(b.accepted&&!b.claimed)spawnBountyTargets(b);
}
function questEvidenceModal(title,icon,text,next){openModal(`<div class="quest-evidence-modal"><div class="quest-evidence-icon">${icon}</div><span class="eyebrow">ŚLAD QUESTOWY</span><h2>${title}</h2><p>${text}</p>${next?`<div class="evidence-next">🧭 ${next}</div>`:''}<button class="primary" data-close>Kontynuuj śledztwo</button></div>`);document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)}
function interactQuestEntity(e){
 const cur=currentQuestStep(e.questId);if(!cur||cur.index!==e.questStage)return toast('Ten trop nie jest jeszcze aktywny.');
 checkQuestProgress('questInteract',e.id);e.done=true;playSfx('discover');haptic([15,20,15]);syncQuestWorld();save();
 if(e.id==='q2_sheep'){questEvidenceModal('Zaginiona owca','🐑','Owca nie została rozszarpana. Na ziemi widać wilczą sierść, ale także ślady ciężkich butów. Kilkadziesiąt metrów dalej trop staje się wyraźniejszy.','Na mapie pojawiły się wilcze tropy.');return}
 if(e.id==='q2_tracks'){questEvidenceModal('Tropy nie pasują','🐾','Wilcze ślady są chaotyczne, jakby zwierzęta uciekały. Obok biegną dwa ludzkie tropy. W trawie widać świeżą krew.','Na mapie pojawiły się dwa ranne wilki.');return}
 if(e.id==='q2_wolves'){if(currentTab==='map')selectNav('map');queueReadyStoryScene('q2',120);return}
 if(['north_courier_order','north_seal_piece','cold_shrine_runes'].includes(e.id)){if(currentTab==='map')selectNav('map');queueReadyStoryScene(e.questId,120);return}
 toast(`Zbadano: ${e.name}`);if(currentTab==='map')selectNav('map');
}
function interactResourceEntity(e){
 if(e.done)return;const b=(state.adventure?.bounties||[]).find(x=>x.id===e.bountyId);if(!b?.accepted||b.claimed)return toast('To znalezisko nie jest już potrzebne.');
 e.done=true;addItem(e.item,1);playSfx('discover');haptic(12);syncQuestWorld();save();toast(`Zebrano: ${itemDef(e.item).name} • ${Math.min(b.need,b.progress||0)}/${b.need}`);if(currentTab==='map')selectNav('map');
}

function monsterTemplate(e){const base=MONSTERS.find(m=>m.id===e.template)||MONSTERS[0],variantId=entityMonsterVariant(e),v=monsterVariantDef(variantId);return {...base,baseName:base.name,name:variantId==='normal'?base.name:`${base.name} — ${v.label}`,variantId,variantLabel:v.label,variantIcon:v.icon,variantLoot:v.loot,variantScale:v.scale,hp:Math.max(1,Math.round(base.hp*v.hp)),atk:Math.max(1,Math.round(base.atk*v.atk)),xp:Math.max(1,Math.round(base.xp*v.xp)),gold:[Math.max(1,Math.round(base.gold[0]*v.gold)),Math.max(2,Math.round(base.gold[1]*v.gold))]}}
function monsterLevel(m){const p=state?.player?.level||1;return clamp(p+rnd(-2,2),m.min,m.max)}
function entityMonsterLevel(e,m=null){
 m ||= monsterTemplate(e);
 if(e?.tutorialStarter)return 1;
 const saved=Number(e?.level);
 if(Number.isFinite(saved)&&saved>0)return clamp(Math.round(saved),m.min,m.max);
 const p=state?.player?.level||1,seed=stableTextSeed(`${e?.id||e?.template||m.id}:map-level:${daySeed()}`),offset=Math.floor(seeded(seed)*5)-2,lvl=clamp(p+offset,m.min,m.max);
 if(e)e.level=lvl;
 return lvl;
}
function monsterLevelTone(level){const diff=level-(state?.player?.level||1);return diff>=4?'danger':diff<=-4?'easy':'even'}
function effectiveStat(key){return Number(state.player.stats[key]||0)+gearStat(key)}
function primaryCombatStat(){const cls=state.player.class;return effectiveStat(cls==='mage'?'int':['hunter','ranger'].includes(cls)?'agi':'str')}
function supportGearPower(){return Object.keys(state.player.equipped||{}).filter(slot=>{const d=itemDef(equippedInstance(slot)?.id);return slot!=='weapon'&&!(slot==='offhand'&&d?.type==='weapon')}).reduce((sum,slot)=>sum+equipmentStat(slot,'power'),0)+setBonusStat('power')}
function weaponDamageRange(){const mainInst=equippedInstance('weapon'),main=itemDef(mainInst?.id),fallback=Math.max(1,main.power||1),base=main.damage||[Math.max(1,fallback-2),fallback+2],mainBonus=(mainInst?.upgrade||0)*2+instanceBonus(mainInst,'power');let min=base[0]+mainBonus,max=base[1]+mainBonus;if(state.player.class==='berserker'){const offInst=equippedInstance('offhand'),off=itemDef(offInst?.id);if(off?.type==='weapon'){const od=off.damage||[Math.max(1,(off.power||1)-2),(off.power||1)+2],offBonus=(offInst?.upgrade||0)*2+instanceBonus(offInst,'power');min+=(od[0]+offBonus)*.45;max+=(od[1]+offBonus)*.45}}const stat=primaryCombatStat()*.75+state.player.level*.55+supportGearPower();return {min:Math.max(1,Math.floor(min+stat)),max:Math.max(2,Math.ceil(max+stat))}}
function rollPlayerBaseDamage(){const r=weaponDamageRange();return rnd(r.min,r.max)}
function attackPower(){const r=weaponDamageRange();return Math.round((r.min+r.max)/2)}
function combatLevelGap(level=combat?.level){return Math.max(-20,Math.min(20,(Number(level)||state.player.level)-state.player.level))}
/* 3.9.8.0 — poziom jest głównym wyznacznikiem trudności.
   Ten sam lvl = brak ukrytej kary/bonusu. Wyższy lvl przeciwnika szybko robi się groźny. */
function playerVsEnemyLevelMultiplier(){const gap=combatLevelGap();if(gap>0)return Math.max(.50,1-gap*.055);if(gap<0)return Math.min(1.30,1+(-gap)*.02);return 1}
function enemyHpLevelGapMultiplier(level){const gap=Math.max(0,combatLevelGap(level));return 1+Math.min(.72,gap*.06)}
function enemyAtkLevelGapMultiplier(level){const gap=Math.max(0,combatLevelGap(level));return 1+Math.min(.84,gap*.07)}
function enemyLevelHpFloor(level,monster){const v=monsterVariantDef(monster?.variantId||'normal');return Math.round((52+Math.max(1,Number(level)||1)*11.5)*v.hp)}
function enemyLevelAtkFloor(level,monster){const v=monsterVariantDef(monster?.variantId||'normal');return Math.round((8+Math.max(1,Number(level)||1)*2.0)*v.atk)}
function hitChance(){const p=state.player;return p.class==='mage'?100:Math.min(99,92+effectiveStat('agi')*.32+(['hunter','ranger'].includes(p.class)?3:0))}
function armorPower(){const p=state.player;return Math.floor(effectiveStat('vit')*.55+gearStat('armor'))}
function critChance(){const p=state.player,pet=p.petActive?petDef(p.petActive):null,classBonus=p.class==='hunter'?5:p.class==='ranger'?2:0,biomeBonus=combat?.environment?.effect?.crit||0;return Math.min(70,5+effectiveStat('agi')*.55+luckCritBonus()+gearStat('crit')+(pet?.crit||0)+classBonus+biomeBonus)}
function dodgeChance(){const p=state.player,classBonus=p.class==='ranger'?7:p.class==='hunter'?3:p.class==='mage'?1:0,biomeBonus=combat?.environment?.effect?.dodge||0,storyBonus=combat?.monster?.family==='Natura'&&storyChoiceFor('q2')==='spare'?2:0,gearBonus=equippedCombatPerks().dodgeBonus||0;return Math.min(42,2+effectiveStat('agi')*.42+classBonus+(combat?.playerDodgeBuff||0)+biomeBonus+storyBonus+gearBonus)}
function hasShieldEquipped(){const d=itemDef(equippedInstance('offhand')?.id);return state.player.class==='knight'&&d?.slot==='offhand'&&d?.type==='gear'}
function blockChance(){const p=state.player,shield=hasShieldEquipped()?12+Math.min(12,gearStat('armor')*.35):0,classBonus=p.class==='knight'?6:0,guard=combat?.guard>0?18:0,gearBonus=equippedCombatPerks().blockBonus||0;return Math.min(60,shield+classBonus+guard+(combat?.playerBlockBuff||0)+gearBonus)}
function classPassiveText(){return ({knight:'🛡️ Rycerz: tarcza daje pasywny blok; Obrona wzmacnia go jeszcze bardziej.',mage:'🔮 Mag: zaklęcia nigdy nie chybiają; może też leczyć siebie i sojuszników za manę.',hunter:'🏹 Łowca: +5% bazowej szansy na krytyk i wsparcie chowańca.',berserker:'🪓 Berserker: im mniej HP, tym większe obrażenia; dwie bronie wzmacniają jego styl.',ranger:'🌿 Tropiciel: wysoki unik, trucizny, pułapki i kontrola przeciwnika.'})[state.player.class]||''}
function combatStatsPanelHTML(){
 const p=state.player,r=weaponDamageRange(),main=itemDef(equippedInstance('weapon')?.id),off=itemDef(equippedInstance('offhand')?.id),dual=p.class==='berserker'&&off?.type==='weapon';
 const weaponLabel=main?.name||'Brak broni',offLabel=dual?` + ${off.name}`:'';
 return `<section class="gear-combat-panel"><div class="gear-combat-head"><div><span class="eyebrow">PARAMETRY BOJOWE</span><h3>Siła w aktualnym wyposażeniu</h3><p>${weaponLabel}${offLabel}</p></div><div class="damage-range-main"><small>OBRAŻENIA BRONI</small><b>${r.min}–${r.max}</b><span>średnio ${attackPower()}</span></div></div><div class="gear-combat-grid"><div><span>⚔️ Atak</span><b>${attackPower()}</b><small>średnie obrażenia</small></div><div><span>🛡️ Pancerz</span><b>${armorPower()}</b><small>redukuje obrażenia</small></div><div><span>🎯 Trafienie</span><b>${hitChance().toFixed(0)}%</b><small>${p.class==='mage'?'magia nie chybia':'celność ataków'}</small></div><div><span>💥 Krytyk</span><b>${critChance().toFixed(0)}%</b><small>szansa na x1,65</small></div><div><span>🍀 Szczęście</span><b>${totalLuck()}</b><small>+${luckCritBonus().toFixed(1)} pp kryta</small></div><div><span>🎁 Lepszy łup</span><b>+${luckLootBonusPct().toFixed(1)}%</b><small>premia względna do rzadkiego łupu</small></div><div><span>💨 Unik</span><b>${dodgeChance().toFixed(0)}%</b><small>uniknięcie ciosu</small></div><div><span>🛡️ Blok</span><b>${blockChance().toFixed(0)}%</b><small>${hasShieldEquipped()?'tarcza aktywna':'bez tarczy'}</small></div><div><span>❤️ HP</span><b>${p.hp}/${p.maxHp}</b><small>punkty życia</small></div><div><span>🔷 Mana</span><b>${p.mana}/${p.maxMana}</b><small>zasób umiejętności</small></div></div><div class="gear-passive-line">${classPassiveText()}</div></section>`;
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
  else if(type==='move')prog[i]=Math.min(questStepNeed(s),Math.max(prog[i]||0,amount));
  else if(type==='story'&&s.target===target)prog[i]=1;
  else if(s.target===target)prog[i]=Math.min(s.count||1,(prog[i]||0)+amount);
  if(q.steps.every((step,idx)=>questStepDone(step,prog[idx])))rewardQuest(q);
 }
 syncQuestWorld();save();
}

function render(){if(!state){renderCreate();return}if(battleResult){showBattleVictory(battleResult);return}if(combat){openCombat();return}if(dungeonRun){renderShell();openDungeonCrawler();return}ensureCoreState();hideStoryUntilTutorial();ensureStoryQuestContinuity(false);syncQuestWorld();if(!state.tutorial?.introSeen){renderPrologueScreen();return}renderShell()}
function renderPrologueScreen(){
 destroyRealMap();
 const p=state.player,c=CLASSES[p.class];
 app.innerHTML=`<div class="onboarding-screen"><div class="onboarding-card"><div class="onboarding-hero">${classVisual(p.class,'sprite-hero')}</div><div class="prologue-mark">ROZDZIAŁ I</div><h1>Cienie nad Doliną</h1><p>Budzi Cię bicie dzwonu z małej wioski. Na drogach pojawiają się potwory, ludzie znikają, a stare znaki wracają na kamienie, na których nie powinno ich być.</p><div class="prologue-grid"><div><b>🗺️ Odkrywaj</b><small>Mapa pojawi się dopiero po rozpoczęciu przygody.</small></div><div><b>⚔️ Walcz</b><small>Rozwijaj ${c.name.toLowerCase()}, sprzęt i własny styl walki.</small></div><div><b>📜 Decyduj</b><small>Śledztwa i wybory zmieniają historię.</small></div></div><div class="test-note"><b>🧪 Testowanie bez GPS</b><span>W Menu możesz otworzyć osobną kopię do testów i poruszać się strzałkami. Główna przygoda korzysta z GPS.</span></div><button class="primary large" data-prologue-start>Wyrusz z wioski</button></div></div>`;
 document.querySelector('[data-prologue-start]')?.addEventListener('click',()=>{state.tutorial.introSeen=true;save();renderShell();toast('Pierwszy cel: oddal się 60 m od wioski. Włącz GPS lub otwórz kopię testową w Menu.')});
}



function renderCreate(){
 let selected='knight';
 app.innerHTML=`<div class="boot mobile-boot"><section class="mobile-brand"><div class="brand-badge">BUILD 3.0.7 • BIOME ZONES</div><h1 class="time4-logo"><span>TIME</span><strong>4</strong><span>HEROES</span></h1><p>Świat jest bliżej niż myślisz.</p><div class="hero-lineup">${classVisual('hunter','lineup side')}${classVisual('knight','lineup main')}${classVisual('mage','lineup side')}</div><div class="mobile-ready">📱 GPS RPG • osobna przygoda testowa bez GPS</div><button class="secondary install-cta" data-install-create>📲 Zainstaluj Time4Heroes</button></section><div class="card create create-mobile"><div class="create-slot-kicker">SLOT ${activeCharacterSlot()}/${CHARACTER_LIMIT}</div><h2>Stwórz bohatera</h2><div class="form-row"><label>Imię</label><input id="heroName" maxlength="18" value="Krzysztof" autocomplete="off"></div><div class="class-grid">${Object.entries(CLASSES).map(([id,c])=>`<button class="class-btn ${id===selected?'active':''}" data-class="${id}"><span class="class-icon">${classVisual(id,'sprite-class-btn')}</span><b>${c.name}</b><div class="tiny">${c.desc}</div></button>`).join('')}</div><div id="classDesc" class="panel-item hero-preview" style="margin:12px 0"></div><button id="startGame" class="primary large">Rozpocznij przygodę</button>${characterCount()?`<button class="secondary character-list-create" data-character-list>👥 Wybierz inną postać (${characterCount()}/${CHARACTER_LIMIT})</button>`:''} </div></div>`;
 const desc=()=>{const c=CLASSES[selected];const target=document.querySelector('#classDesc');if(target)target.innerHTML=`<div class="preview-avatar">${classVisual(selected,'sprite-preview')}</div><div><b>${c.name}</b><div class="muted">STR ${c.base.str} • AGI ${c.base.agi} • INT ${c.base.int} • VIT ${c.base.vit}</div><div>${c.desc}</div>${['hunter','ranger'].includes(selected)?'<div class="gold">🐺 Startujesz z chowańcem: Młody Wilk.</div>':''}</div>`};
 desc();
 document.querySelectorAll('[data-class]').forEach(b=>b.onclick=()=>{selected=b.dataset.class;document.querySelectorAll('[data-class]').forEach(x=>x.classList.toggle('active',x===b));desc()});
 document.querySelector('#startGame')?.addEventListener('click',()=>newGame(document.querySelector('#heroName')?.value.trim(),selected));
 document.querySelector('[data-install-create]')?.addEventListener('click',installPwa);
 document.querySelector('[data-character-list]')?.addEventListener('click',openCharacterManager);
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
  Dorian:'assets/npc-dorian.png',Selma:null,Ragor:null,
  Ilyra:null,Varo:null,Edrin:'assets/npc-edrin.png'
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
const NPC_SCENE_PORTRAITS={
 Dorian:{image:'assets/tavern-scene-desktop.png',x:'26%',y:'19%',scale:'580%'},
 Selma:{id:'shop',y:'23%'},Ragor:{id:'smith',y:'18%'},Ilyra:{id:'alchemist',y:'30%'},
 Varo:{id:'auction',y:'23%'},Edrin:{id:'guild',image:'assets/backgrounds/interior-guild-3998.webp',y:'25%'}
};
function npcVisual(name,classId,cls='sprite-npc'){
 const scene=NPC_SCENE_PORTRAITS[name];
 if(scene)return `<span class="${cls} scene-npc-portrait" role="img" aria-label="${name}" style="--portrait-image:url('${scene.image||`assets/backgrounds/interior-${scene.id}-3997.webp`}');--portrait-x:${scene.x||'50%'};--portrait-y:${scene.y};--portrait-scale:${scene.scale||'900%'}"></span>`;
 const path=GRAPHICS.npcs[name];return path?sprite(path,name,cls):classVisual(classId,cls)
}
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
 meadow:'assets/backgrounds/battle-meadow-3998.webp',
 forest:'assets/backgrounds/battle-forest-3998.webp',
 ruins:'assets/backgrounds/battle-ruins-3998.webp',
 marsh:'assets/backgrounds/battle-marsh-3998.webp',
 highlands:'assets/backgrounds/battle-highlands-3998.webp'
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
 return `<header class="topbar topbar-fantasy topbar-compact"><div class="brand-side"><div class="identity"><div class="mini-avatar">${classVisual(p.class,'sprite-mini')}</div><div><b>${p.name}</b><div class="tiny">${c.name} • poziom ${p.level} <span class="build-chip">${SAVE_KEY===DEMO_SAVE_KEY?'TEST • osobny zapis':BUILD_VERSION}</span></div></div></div><div class="bars"><div><div class="barwrap"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div><div class="barwrap"><div class="bar xp" style="width:${100*p.xp/need}%"></div><div class="barlabel">XP ${p.xp}/${need}</div></div><div class="tiny">ATK ${attackPower()} • Pancerz ${armorPower()} • Kryt ${critChance().toFixed(0)}%${pet?` • 🐾 lvl ${pet.level}`:''}</div></div></div></div><div class="hud-right"><div class="resource resource-fantasy"><span>🪙 <strong>${p.gold}</strong></span><span>💎 <strong>${countItem('crystal')}</strong></span><span title="${regenSummary()}">⚡ <strong>${p.stamina??100}/${p.maxStamina??100}</strong><small class="regen-hint">↗</small></span>${['hunter','ranger'].includes(p.class)?`<span>➶ <strong>${countItem('primitiveArrow')}</strong></span>`:''}</div><div class="world-meta"><span>${region}</span><span>${cl.icon} ${cl.weather}</span><span>🕒 ${now}</span></div></div></header>`;
}

function refreshTopbar(){
 const current=app.querySelector('.topbar');if(!current||!state?.player)return;
 const wrap=document.createElement('div');wrap.innerHTML=topbar();const next=wrap.firstElementChild;if(next)current.replaceWith(next);
}

function bottomNav(){const tabs=[['map','🗺️','Mapa','nav'],['hero','🧙','Bohater','nav'],['town','🏰','Miasto','nav'],['bestiary','📖','Bestiariusz','shortcut'],['menu','☰','Menu','nav']];return `<nav class="bottom core-nav">${tabs.map(([id,ico,name,type])=>type==='shortcut'?`<button class="navbtn ${currentTab==='adventureHub'&&state.ui.adventureView===id?'active':''}" data-shortcut="${id}"><span>${ico}</span>${name}</button>`:`<button class="navbtn ${id===currentTab?'active':''}" data-nav="${id}"><span>${ico}</span>${name}</button>`).join('')}</nav>`}

function activeTaskCount(){ensureAdventureState();return state.quests.active.length+(state.adventure.bounties||[]).filter(b=>b.accepted&&!b.claimed).length}
function canAcceptTask(){return activeTaskCount()<activeTaskLimit()}
function activeMainStoryQuest(){return state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).find(Boolean)||null}
function storyQuestAfter(qid){const i=QUESTS.findIndex(q=>q.id===qid);return i>=0&&i<QUESTS.length-1?QUESTS[i+1]:null}
function firstPendingStoryQuest(){for(let i=0;i<QUESTS.length;i++){const q=QUESTS[i];if(state.quests.done.includes(q.id)||state.quests.active.includes(q.id))continue;const prev=i>0?QUESTS[i-1]:null;if(prev&&!state.quests.done.includes(prev.id))continue;return q}return null}
function ensureStoryQuestContinuity(announce=false){
 if(!state?.quests||tutorialLocksStory())return null;
 const active=activeMainStoryQuest();if(active)return active;
 const next=firstPendingStoryQuest();if(!next||next.level>state.player.level+1)return null;
 state.quests.active.push(next.id);state.quests.progress[next.id] ||= next.steps.map(()=>0);syncQuestWorld();save();
 if(announce)toast(`📜 Główny wątek trwa dalej: ${next.name} • nowy cel pojawił się na mapie`);
 return next;
}

function nextStoryQuestAvailable(){
 if(tutorialLocksStory())return null;
 for(let i=0;i<QUESTS.length;i++){
  const q=QUESTS[i];if(state.quests.done.includes(q.id)||state.quests.active.includes(q.id))continue;
  const prev=i>0?QUESTS[i-1]:null;if(prev&&!state.quests.done.includes(prev.id))continue;
  if(q.level<=state.player.level+1)return q;
 }
 return null;
}
function acceptStoryQuest(qid){if(tutorialLocksStory())return toast('Najpierw ukończ samouczek.');const q=QUESTS.find(x=>x.id===qid);if(!q||state.quests.done.includes(qid)||state.quests.active.includes(qid))return;if(!canAcceptTask())return toast(`Możesz mieć maksymalnie ${activeTaskLimit()} aktywnych questów. Samouczek nie liczy się do limitu.`);state.quests.active.push(qid);state.quests.progress[qid] ||= q.steps.map(()=>0);syncQuestWorld();save();toast(`Przyjęto: ${q.name} • cel pojawił się na mapie`);closeModal();state.ui.adventureView='quests';currentTab='adventureHub';selectNav('adventureHub')}
function acceptBounty(id){if(tutorialLocksStory())return toast('Najpierw ukończ samouczek.');ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||b.claimed||b.accepted)return;if(!canAcceptTask())return toast(`Możesz mieć maksymalnie ${activeTaskLimit()} aktywnych questów. Samouczek nie liczy się do limitu.`);b.accepted=true;b.progress=0;spawnBountyTargets(b);save();toast(`Przyjęto zlecenie: ${b.name} • cele pojawiły się na mapie`);openBuilding('tavern','board')}
function tavernAnecdote(){const known=Object.keys(state.player.bestiary||{}).filter(id=>state.player.bestiary[id]>0);const id=known.length?pick(known):pick(['wolf','goblin','skeleton','spider','ghost']);const m=MONSTERS.find(x=>x.id===id)||MONSTERS[0];const lines={wolf:'„Wilk nigdy nie patrzy tylko na ciebie. Zawsze patrzy też, którędy będziesz uciekał.”',goblin:'„Goblin z nożem to problem. Goblin, którego nie widzisz, to większy problem.”',skeleton:'„Kości nie mają płuc. Nie próbuj ich zmęczyć — rozbij je.”',spider:'„Pająk przegrał ze mną raz. Drugi siedział na suficie. Dlatego patrzę też w górę.”',ghost:'„Na zjawy stal działa gorzej niż odwaga. A jeszcze lepiej działa arkanum.”'};return `${m.icon} ${m.name}: ${lines[id]||'„Każdy potwór ma nawyk. Przeżyjesz, jeśli zauważysz go przed pierwszym ciosem.”'}`}
function ensureTavernDaily(target=state){if(!target?.player)return {day:daySeed(),fireplaceUses:0,mealUses:0};const today=daySeed(),p=target.player;p.tavernDaily ||= {day:today,fireplaceUses:0,mealUses:0};if(p.tavernDaily.day!==today)p.tavernDaily={day:today,fireplaceUses:0,mealUses:0};p.tavernDaily.fireplaceUses=Math.max(0,Number(p.tavernDaily.fireplaceUses)||0);p.tavernDaily.mealUses=Math.max(0,Number(p.tavernDaily.mealUses)||0);return p.tavernDaily}
function ensureStaminaCap(target=state){if(!target?.player)return;const p=target.player;p.maxStamina=100;p.stamina=clamp(p.stamina??100,0,100)}
function buyTavernStamina(amount,cost,label){const p=state.player;ensureStaminaCap();const daily=ensureTavernDaily();if(daily.mealUses>=2)return toast('Dzienny limit posiłków i napitków został wykorzystany (2/2).');if(p.stamina>=p.maxStamina)return toast('Masz pełną staminę.');if(p.gold<cost)return toast(`Potrzebujesz ${cost} 🪙.`);p.gold-=cost;p.stamina=Math.min(p.maxStamina,p.stamina+amount);daily.mealUses++;save();refreshTopbar();openBuilding('tavern','keeper');toast(`${label}: +${amount} staminy • -${cost} 🪙 • dziś ${daily.mealUses}/2`)}
function restByFire(){const p=state.player;ensureStaminaCap();const daily=ensureTavernDaily(),cost=Math.min(70,15+p.level*3);if(daily.fireplaceUses>=2)return toast('Dzienny limit odpoczynku przy kominku został wykorzystany (2/2).');if(p.gold<cost)return toast(`Odpoczynek przy kominku kosztuje ${cost} 🪙.`);p.gold-=cost;p.hp=p.maxHp;p.mana=p.maxMana;p.stamina=Math.min(p.maxStamina,p.stamina+25);daily.fireplaceUses++;save();refreshTopbar();openBuilding('tavern','fireplace');toast(`Odpoczynek ${daily.fireplaceUses}/2 • pełne HP i mana • +25 staminy • -${cost} 🪙`)}
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
  if(id==='bag'){toggleGearDrawer();return;}
  if(id==='bestiary'){state.ui.adventureView='bestiary';save();selectNav('adventureHub');return;}
  if(id==='skills'){state.ui.heroView='skills';save();selectNav('hero');return;}
  if(id==='quests'){state.ui.adventureView='quests';save();selectNav('adventureHub');return;}
 });
}

const DRAWER_BAG_ICON='<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M10 8V5c0-5 12-5 12 0v3M7 10h18l3 22H4Z"/><path d="M5 15q11 7 22 0M9 23h14v8H9ZM13 13h6v7h-6Z"/></svg>';
function drawerState(){state.ui ||= {};state.ui.gearDrawerTab ||= 'bag';state.ui.gearDrawerFilter ||= 'all';state.ui.bagArrangeMode=!!state.ui.bagArrangeMode;if(!Number.isInteger(state.ui.bagMoveIndex))state.ui.bagMoveIndex=null;return state.ui}
function drawerEquipmentSlot(slot,label){const inst=equippedInstance(slot),d=inst?itemDef(inst.id):null;return `<button class="drawer-equip slot-${slot} ${d?'rarity-border-'+d.rarity:''}" data-drawer-slot="${slot}" title="${label}${d?': '+d.name:''}" aria-label="${label}${d?': '+d.name:': pusty'}">${d?itemIconVisual(d.id,'drawer-item-art'):`<span class="empty-slot-mark">${({helmet:'♜',amulet:'◇',weapon:'⚔',armor:'♙',offhand:'⛨',gloves:'⋔',boots:'∩',legs:'♜',ring1:'○',ring2:'○'})[slot]}</span>`}<small>${label}</small></button>`}
function drawerInventoryEntries(filter='all'){
 return backpackEntries().filter(({item})=>{const d=itemDef(item.id);return filter==='all'||filter==='gear'&&!!d.slot||filter==='usable'&&['consumable','ammo'].includes(d.type)||filter==='materials'&&['material','rune'].includes(d.type)});
}
function drawerBagHTML(){
 const ui=drawerState(),entries=drawerInventoryEntries(ui.gearDrawerFilter),used=inventoryUsedSlots(),cap=inventoryCapacity(),all=ui.gearDrawerFilter==='all';
 let cells='';
 if(all){const bySlot=new Map(entries.map(e=>[e.slot,e]));cells=Array.from({length:Math.ceil(cap/6)*6},(_,i)=>{const e=i<cap?bySlot.get(i):null;if(i>=cap)return '<span class="drawer-bag-cell empty filler" aria-hidden="true"></span>';if(!e)return `<button class="drawer-bag-cell empty drawer-drop-target" data-drawer-bag-pos="${i}" aria-label="Pusty slot ${i+1}"></button>`;const d=itemDef(e.item.id);return `<button class="drawer-bag-cell drawer-dnd-item drawer-drop-target rarity-border-${d.rarity} ${ui.gearDrawerSelection===e.index?'selected':''} ${ui.bagArrangeMode&&ui.bagMoveIndex===e.index?'bag-move-selected':''}" data-drawer-item="${e.index}" data-drawer-bag-pos="${i}" draggable="true" title="${itemName(e.item)} • przeciągnij, aby zmienić miejsce" aria-label="${itemName(e.item)}${e.item.qty>1?', '+e.item.qty+' sztuk':''}">${itemIconVisual(d.id,'drawer-item-art')}${e.item.qty>1?`<b class="drawer-qty">${e.item.qty}</b>`:''}${e.item.upgrade?`<em class="drawer-upgrade">+${e.item.upgrade}</em>`:''}</button>`}).join('')}else{cells=Array.from({length:Math.max(6,Math.ceil(entries.length/6)*6)},(_,i)=>{const e=entries[i];if(!e)return '<span class="drawer-bag-cell empty" aria-hidden="true"></span>';const d=itemDef(e.item.id);return `<button class="drawer-bag-cell rarity-border-${d.rarity} ${ui.gearDrawerSelection===e.index?'selected':''}" data-drawer-item="${e.index}" title="${itemName(e.item)}" aria-label="${itemName(e.item)}${e.item.qty>1?', '+e.item.qty+' sztuk':''}">${itemIconVisual(d.id,'drawer-item-art')}${e.item.qty>1?`<b class="drawer-qty">${e.item.qty}</b>`:''}${e.item.upgrade?`<em class="drawer-upgrade">+${e.item.upgrade}</em>`:''}</button>`}).join('')}
 return `<div class="drawer-section-heading"><b>PLECAK</b><span>${used} / ${cap}</span></div><div class="drawer-bag-tools">${bagSortOptionsHTML()}<button class="bag-arrange-toggle ${ui.bagArrangeMode?'active':''}" data-bag-arrange aria-pressed="${ui.bagArrangeMode}">✥ Układanie</button></div><div class="drawer-filters" aria-label="Filtr przedmiotów">${[['all','Wszystko'],['gear','Sprzęt'],['usable','Zapasy'],['materials','Materiały']].map(([id,label])=>`<button data-drawer-filter="${id}" aria-pressed="${ui.gearDrawerFilter===id}" class="${ui.gearDrawerFilter===id?'active':''}">${label}</button>`).join('')}</div><div class="drawer-bag-grid">${cells}</div>${!entries.length?'<p class="drawer-hint">Brak przedmiotów w tej kategorii.</p>':''}<p class="drawer-hint">${all?(ui.bagArrangeMode?(ui.bagMoveIndex!==null?'Wybierz docelowy slot — pusty lub zajęty.':'Kliknij przedmiot, a potem slot docelowy.'):'Przeciągnij przedmiot albo włącz „Układanie”, aby przenosić go także do pustych pól.'):'Ręczne przesuwanie jest dostępne w widoku „Wszystko”.'}</p>`;
}
function drawerStatsHTML(){const p=state.player;return `<div class="drawer-section-heading"><b>BOHATER</b><span>${CLASSES[p.class].name}</span></div><div class="drawer-stat-grid">${[['Siła',effectiveStat('str')],['Zręczność',effectiveStat('agi')],['Intelekt',effectiveStat('int')],['Witalność',effectiveStat('vit')],['Atak',attackPower()],['Pancerz',armorPower()],['Krytyk',critChance().toFixed(0)+'%'],['Unik',dodgeChance().toFixed(0)+'%']].map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('')}</div><p class="drawer-hint">${classPassiveText()}</p><button class="drawer-wide-action" data-drawer-skills>Rozwój i umiejętności${p.skillPoints?' • '+p.skillPoints+' pkt':''}</button>`}
function drawerQuestHTML(){const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean);return `<div class="drawer-section-heading"><b>WYPRAWA</b><span>${active.length} zadań</span></div>${active.map(q=>`<button class="drawer-quest" data-drawer-quest="${q.id}"><b>${q.name}</b><small>${currentQuestStep(q.id)?.step?.label||'Zadanie gotowe'}</small></button>`).join('')||'<p class="drawer-hint">Nowe zadania czekają w karczmie.</p>'}<button class="drawer-wide-action" data-drawer-journal>Otwórz dziennik</button>`}
function drawerDetailHTML(){const ui=drawerState(),i=state.player.inventory[ui.gearDrawerSelection];if(!i)return '';return `<section class="drawer-item-detail"><button class="drawer-detail-back" data-drawer-back>‹ Wróć do plecaka</button>${inventoryCard(i,ui.gearDrawerSelection)}</section>`}
function gearDrawerHTML(){const ui=drawerState(),p=state.player,selected=Number.isInteger(ui.gearDrawerSelection)&&state.player.inventory[ui.gearDrawerSelection];return `<button class="drawer-pull-tab" data-drawer-toggle aria-controls="gear-drawer-panel" aria-expanded="${!!ui.gearDrawerOpen}" aria-label="${ui.gearDrawerOpen?'Zwiń':'Rozwiń'} plecak">${DRAWER_BAG_ICON}<span>PLECAK</span><i>${ui.gearDrawerOpen?'›':'‹'}</i></button><section class="drawer-panel" id="gear-drawer-panel" aria-label="Plecak i wyposażenie" ${ui.gearDrawerOpen?'':'inert aria-hidden="true"'}><header class="drawer-title"><span>✦</span><div><b>${p.name}</b><small>${CLASSES[p.class].name} · poziom ${p.level}</small></div><button data-drawer-close aria-label="Zamknij plecak">×</button></header><div class="drawer-vitals"><div class="drawer-meter hp"><i style="width:${clamp(p.hp/p.maxHp*100,0,100)}%"></i><span>Życie ${p.hp} / ${p.maxHp}</span></div><div class="drawer-meter mana"><i style="width:${clamp(p.mana/p.maxMana*100,0,100)}%"></i><span>Mana ${p.mana} / ${p.maxMana}</span></div><div class="drawer-wallet"><span>◈ ${fmt(p.gold)} złota</span><span>${inventoryUsedSlots()} / ${inventoryCapacity()} miejsc</span></div></div><div class="drawer-scroll">${selected?drawerDetailHTML():`<div class="drawer-loadout"><div class="drawer-equipment">${[['ring1','Pierścień'],['helmet','Hełm'],['amulet','Amulet'],['weapon','Broń'],['armor','Pancerz'],['offhand',classOffhandLabel(p.class)],['gloves','Rękawice'],['legs','Spodnie'],['boots','Buty'],['ring2','Pierścień']].map(([slot,label])=>drawerEquipmentSlot(slot,label)).join('')}</div><div class="drawer-mini-stats"><span>ATAK<b>${attackPower()}</b></span><span>PANCERZ<b>${armorPower()}</b></span><span>KRYTYK<b>${critChance().toFixed(0)}%</b></span><div class="drawer-hero">${classVisual(p.class,'drawer-hero-art')}</div></div></div>${ui.gearDrawerTab==='stats'?drawerStatsHTML():ui.gearDrawerTab==='quests'?drawerQuestHTML():drawerBagHTML()}`}</div><nav class="drawer-tabs" aria-label="Zakładki plecaka">${[['bag','Plecak'],['stats','Bohater'],['quests','Zadania']].map(([id,label])=>`<button data-drawer-tab="${id}" class="${ui.gearDrawerTab===id?'active':''}" aria-pressed="${ui.gearDrawerTab===id}">${label}</button>`).join('')}</nav></section>`}
function renderGearDrawer(){const host=document.querySelector('#gear-drawer');if(!host||!state)return;const ui=drawerState(),scroll=host.querySelector('.drawer-scroll')?.scrollTop||0;host.classList.toggle('is-open',!!ui.gearDrawerOpen);host.innerHTML=gearDrawerHTML();const scroller=host.querySelector('.drawer-scroll');if(scroller)scroller.scrollTop=scroll;host.onclick=handleGearDrawerClick;host.querySelector('[data-bag-sort]')?.addEventListener('change',e=>{const mode=e.target.value;if(mode!=='manual')sortBackpack(mode);ui.gearDrawerSelection=null;ui.bagMoveIndex=null;renderGearDrawer()});host.querySelector('[data-bag-arrange]')?.addEventListener('click',e=>{e.stopPropagation();ui.bagArrangeMode=!ui.bagArrangeMode;ui.bagMoveIndex=null;ui.gearDrawerSelection=null;save();renderGearDrawer()});bindDrawerBagDragDrop(host)}
function bindDrawerBagDragDrop(root){
 if(drawerState().gearDrawerFilter!=='all')return;
 let dragIdx=null,ghost=null,start=null,moved=false;
 const bags=()=>root.querySelectorAll('[data-drawer-bag-pos]'),gear=()=>root.querySelectorAll('[data-drawer-slot]');
 const validGear=(slot)=>dragIdx!==null&&itemCanGoToSlot(state.player.inventory[dragIdx],slot);
 const highlight=()=>{bags().forEach(x=>x.classList.add('bag-drop-valid'));gear().forEach(x=>x.classList.toggle('drop-valid',validGear(x.dataset.drawerSlot)))};
 const clear=()=>{bags().forEach(x=>x.classList.remove('bag-drop-valid','bag-drop-hover'));gear().forEach(x=>x.classList.remove('drop-valid','drop-hover'));ghost?.remove();ghost=null;dragIdx=null;start=null;moved=false};
 const at=(x,y)=>{const hit=document.elementFromPoint?.(x,y),bag=hit?.closest?.('[data-drawer-bag-pos]'),slot=hit?.closest?.('[data-drawer-slot]');bags().forEach(el=>el.classList.toggle('bag-drop-hover',el===bag));gear().forEach(el=>el.classList.toggle('drop-hover',el===slot&&validGear(el.dataset.drawerSlot)));return {bag,slot}};
 const finish=(idx,target)=>{let ok=false;if(target.slot&&itemCanGoToSlot(state.player.inventory[idx],target.slot.dataset.drawerSlot))ok=equipIndexToSlot(idx,target.slot.dataset.drawerSlot);else if(target.bag)ok=moveBackpackItemToSlot(idx,Number(target.bag.dataset.drawerBagPos));if(ok){window.__t4hSuppressBagClickUntil=Date.now()+700;drawerState().gearDrawerSelection=null;clear();renderGearDrawer()}else clear()};
 root.querySelectorAll('.drawer-dnd-item').forEach(el=>{
  el.addEventListener('dragstart',e=>{dragIdx=Number(el.dataset.drawerItem);highlight();e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragIdx));el.classList.add('dragging')});
  el.addEventListener('dragend',()=>{el.classList.remove('dragging');clear()});
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;dragIdx=Number(el.dataset.drawerItem);start={x:e.clientX,y:e.clientY};moved=false;el.setPointerCapture?.(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(dragIdx===null||!start||e.pointerType==='mouse')return;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)<8&&!moved)return;if(!moved){moved=true;highlight();ghost=document.createElement('div');ghost.className='touch-drag-ghost';ghost.innerHTML=el.querySelector('.item-icon-shell')?.outerHTML||el.innerHTML;document.body.appendChild(ghost);window.__t4hSuppressBagClickUntil=Date.now()+700}ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;at(e.clientX,e.clientY)});
  el.addEventListener('pointerup',e=>{if(dragIdx===null||e.pointerType==='mouse')return;const target=at(e.clientX,e.clientY),idx=dragIdx;if(moved&&(target.bag||target.slot))finish(idx,target);else clear()});
  el.addEventListener('pointercancel',clear)
 });
 for(const el of [...bags(),...gear()]){
  el.addEventListener('dragover',e=>{if(dragIdx===null)return;if(el.dataset.drawerSlot&&!validGear(el.dataset.drawerSlot))return;e.preventDefault();el.classList.add(el.dataset.drawerSlot?'drop-hover':'bag-drop-hover')});
  el.addEventListener('dragleave',()=>el.classList.remove('drop-hover','bag-drop-hover'));
  el.addEventListener('drop',e=>{e.preventDefault();const idx=dragIdx??Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(idx))finish(idx,{slot:el.dataset.drawerSlot?el:null,bag:el.dataset.drawerBagPos!==undefined?el:null});else clear()})
 }
}
function toggleGearDrawer(force){if(!state||combat||dungeonRun||battleResult)return;const ui=drawerState();ui.gearDrawerOpen=typeof force==='boolean'?force:!ui.gearDrawerOpen;ui.gearDrawerSelection=null;save();renderGearDrawer();if(!ui.gearDrawerOpen)document.querySelector('[data-drawer-toggle]')?.focus()}
function handleGearDrawerClick(event){
 if(Date.now()<(window.__t4hSuppressBagClickUntil||0))return;const b=event.target.closest('button');if(!b)return;
 const ui=drawerState(),d=b.dataset;
 if(d.drawerToggle!==undefined||d.drawerClose!==undefined){toggleGearDrawer(d.drawerClose!==undefined?false:undefined);return}
 if(d.drawerTab){ui.gearDrawerTab=d.drawerTab;ui.gearDrawerSelection=null}
 else if(d.drawerFilter){ui.gearDrawerFilter=d.drawerFilter;ui.gearDrawerSelection=null;ui.bagMoveIndex=null}
 else if(ui.bagArrangeMode&&d.drawerBagPos!==undefined){const targetSlot=Number(d.drawerBagPos);const clickedIdx=d.drawerItem!==undefined?Number(d.drawerItem):null;if(ui.bagMoveIndex===null){if(clickedIdx!==null){ui.bagMoveIndex=clickedIdx;ui.gearDrawerSelection=null;save();renderGearDrawer()}return}const source=ui.bagMoveIndex;if(clickedIdx===source){ui.bagMoveIndex=null;save();renderGearDrawer();return}if(moveBackpackItemToSlot(source,targetSlot)){ui.bagMoveIndex=null;ui.gearDrawerSelection=null;save();renderGearDrawer()}return}
 else if(d.drawerItem!==undefined){ui.gearDrawerSelection=Number(d.drawerItem)}
 else if(d.drawerSlot){const item=equippedInstance(d.drawerSlot);if(!item)return toast('To miejsce wyposażenia jest puste.');ui.gearDrawerSelection=state.player.inventory.findIndex(x=>x.uid===item.uid)}
 else if(d.drawerBack!==undefined){ui.gearDrawerSelection=null}
 else if(d.drawerSkills!==undefined){toggleGearDrawer(false);state.ui.heroView='skills';selectNav('hero');return}
 else if(d.drawerQuest){toggleGearDrawer(false);state.ui.questGuideId=d.drawerQuest;save();selectNav('map');return}
 else if(d.drawerJournal!==undefined){toggleGearDrawer(false);openQuestView();return}
 else {
  const idx=ui.gearDrawerSelection,item=state.player.inventory[idx];if(!item)return;ui.gearDrawerSelection=null;
  if(d.equip!==undefined)equipIndex(idx);else if(d.equipSlot)equipIndexToSlot(idx,d.equipSlot);else if(d.unequip!==undefined)unequipItem(item.uid);else if(d.use!==undefined)useItem(item.id);else if(d.salvage!==undefined)salvageIndex(idx);else return;
 }
 save();renderGearDrawer();
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state?.ui?.gearDrawerOpen&&!document.querySelector('.modal-back')){toggleGearDrawer(false);event.preventDefault()}});
document.addEventListener('pointerdown',event=>{if(state?.ui?.gearDrawerOpen&&!event.target.closest('#gear-drawer')&&!event.target.closest('.modal-back')&&!combat&&!dungeonRun)toggleGearDrawer(false)});

function renderShell(){destroyRealMap();app.innerHTML=`<div class="shell shell-21">${connectionBanner()}${topbar()}<div class="shell-body"><div class="content-zone"><div class="main"><main class="viewport" id="viewport"></main><aside class="side" id="side"></aside></div></div></div><button class="quest-float ${tutorialLocksStory()?'tutorial-quest-float':''}" data-quest-float title="${tutorialLocksStory()?'Samouczek':'Questy'}">${tutorialLocksStory()?'🎓':'📜'}<span>${tutorialLocksStory()?`${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}`:(activeTaskCount()||'')}</span></button>${bottomNav()}<aside id="gear-drawer" class="rpg-gear-drawer"></aside></div>`;bindShellControls(document);document.querySelector('[data-quest-float]')?.addEventListener('click',openQuestView);selectNav(currentTab,false);renderGearDrawer()}
function selectNav(id,rebuild=true){if(id!=='map')destroyRealMap();currentTab=id;document.body.classList.toggle('map-view-active',id==='map');document.body.classList.toggle('scroll-view-active',id!=='map');if(rebuild)document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id));const el=document.querySelector('#viewport'),side=document.querySelector('#side'),main=document.querySelector('.main');if(!el||!side)return;main?.classList.toggle('map-main-only',id==='map');side.style.display='none';({map:renderMap,hero:renderHeroHub,adventureHub:renderAdventureHub,town:renderTown,menu:renderMenuHub}[id]||renderMap)(el);bindTutorialControls(document);bindShellControls(document)}
function refresh(){if(state?.ui?.gearDrawerOpen&&document.querySelector('#gear-drawer')&&!combat&&!dungeonRun&&!battleResult){renderGearDrawer();return}render()}
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
 el.innerHTML=`<div class="hero-stats-page"><section class="hero-stat-card hero-profile-card"><div class="hero-profile-art">${classVisual(p.class,'sprite-hero')}</div><div><span class="eyebrow">POSTAĆ</span><h2>${p.name}</h2><p>${c.name} • poziom ${p.level}</p><div class="hero-vitals"><span>❤️ ${p.hp}/${p.maxHp}</span><span>🔷 ${p.mana}/${p.maxMana}</span><span>⚡ ${p.stamina??100}/${p.maxStamina??100}</span></div></div></section><section class="hero-stat-card"><div class="section-title"><div><span class="eyebrow">STATYSTYKI</span><h3>Cechy bohatera</h3></div><span class="pill">${p.statPoints||0} pkt</span></div><div class="hero-base-stats">${Object.entries(p.stats).map(([k,v])=>`<div class="hero-base-stat"><span>${({str:'Siła',agi:'Zręczność',int:'Inteligencja',vit:'Witalność',lck:'Szczęście'})[k]||k.toUpperCase()}</span><b>${v}${gearStat(k)?` <small>+${gearStat(k)} EQ</small>`:''}</b>${p.statPoints?`<button class="secondary mini" data-stat="${k}">+1</button>`:''}</div>`).join('')}</div></section><section class="hero-stat-card"><span class="eyebrow">PARAMETRY BOJOWE</span><div class="hero-derived-stats"><div><b>${attackPower()}</b><span>Atak</span></div><div><b>${armorPower()}</b><span>Pancerz</span></div><div><b>${critChance().toFixed(0)}%</b><span>Krytyk</span></div><div><b>${totalLuck()}</b><span>🍀 Szczęście</span></div><div><b>+${luckLootBonusPct().toFixed(1)}%</b><span>Lepszy łup</span></div><div><b>${dodgeChance().toFixed(0)}%</b><span>Unik</span></div><div><b>${blockChance().toFixed(0)}%</b><span>Blok</span></div><div><b>${p.skillPoints}</b><span>Pkt umiejętności</span></div><div><b>${inventoryUsedSlots()}/${inventoryCapacity()}</b><span>Plecak</span></div><div><b>${pet?pet.level:'—'}</b><span>Chowaniec</span></div></div></section>${pet?`<section class="hero-stat-card"><span class="eyebrow">CHOWANIEC</span><div class="hero-pet-summary"><span class="pet-portrait">${petDef(pet.id).icon}</span><div><b>${petDef(pet.id).name}</b><small>Poziom ${pet.level}</small></div></div></section>`:''}</div>`;
 el.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{if(p.statPoints<=0)return;p.stats[b.dataset.stat]++;p.statPoints--;if(b.dataset.stat==='vit'){p.maxHp+=5;p.hp+=5}if(b.dataset.stat==='int'){p.maxMana+=4;p.mana+=4}save();renderHeroStats(el)});
}
function renderSkillsTree(el){
 const p=state.player,c=CLASSES[p.class],branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 ensureCombatSkillLoadout();
 el.innerHTML=`<div class="section-title"><div><h2>🌳 Umiejętności</h2><div class="muted">${c.name} • ukończ próby klasowe, a potem wydawaj punkty na wybrane zdolności.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="class-passive-card"><b>Pasyw klasy</b><span>${classPassiveText()}</span></div>${combatLoadoutHTML()}<div class="skill-branches standalone-skills">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div>`;
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
 el.querySelectorAll('[data-active-skill]').forEach(b=>b.onclick=()=>{toggleCombatSkill(b.dataset.activeSkill);renderSkillsTree(el)});
 el.querySelectorAll('[data-remove-active]').forEach(b=>b.onclick=()=>{toggleCombatSkill(b.dataset.removeActive);renderSkillsTree(el)});
}
function renderAdventureHub(el){
 ensureCoreState();
 const canTrips=true,canBest=state.player.kills>0;
 state.ui.adventureView ||= 'quests';
 const tabs=[
  ['quests','📜','Zadania',true],['events','✨','Wydarzenia',true],['trips','🕳️','Lochy',canTrips],['bestiary','📖','Bestiariusz',canBest]
 ];
 el.innerHTML=`<div class="adventure-shell"><div class="adventure-head"><div><span class="eyebrow">DZIENNIK BOHATERA</span><h2>Przygoda</h2><p>Zadania, wydarzenia, wyprawy i wiedza o potworach w jednym miejscu.</p></div><div class="adventure-summary"><span>📜 ${activeTaskCount()}/${activeTaskLimit()}</span><span>🕳️ ${state.player.dungeons.length}</span><span>👹 ${Object.keys(state.player.bestiary||{}).length}</span><span>🏅 ${state.adventure.reputation||0}</span></div></div><div class="hub-tabs adventure-tabs">${tabs.map(([id,ico,label,ok])=>`<button class="secondary ${state.ui.adventureView===id?'active':''}" data-adventure-view="${id}" ${ok?'':'disabled'}>${ico} ${label}${ok?'':' 🔒'}</button>`).join('')}</div><div id="hubContent" class="adventure-content"></div></div>`;
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
function makeLeafletIcon(html,cls='game-map-icon',size=[48,48],anchor=null){
 return L.divIcon({html,className:`${cls}-wrap`,iconSize:size,iconAnchor:anchor||[size[0]/2,size[1]/2],popupAnchor:[0,-size[1]/2]});
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
 const o=state.world.gpsOrigin,bounds=realMap.getBounds().pad(.3),latScale=111320,lngScale=latScale*Math.cos(o.lat*Math.PI/180);
 const minX=(bounds.getWest()-o.lng)*lngScale-450,maxX=(bounds.getEast()-o.lng)*lngScale+450;
 const minY=(bounds.getSouth()-o.lat)*latScale-450,maxY=(bounds.getNorth()-o.lat)*latScale+450;
 const startX=Math.max(-1000,Math.floor(minX/BIOME_SITE_SPACING)-1),endX=Math.min(1000,Math.ceil(maxX/BIOME_SITE_SPACING)+1);
 const startY=Math.max(-1000,Math.floor(minY/BIOME_SITE_SPACING)-1),endY=Math.min(1000,Math.ceil(maxY/BIOME_SITE_SPACING)+1);
 // Limit chroni telefon przy mocnym oddaleniu mapy; bliskie obszary zawsze są rysowane.
 if((endX-startX+1)*(endY-startY+1)>160)return;
 for(let gx=startX;gx<=endX;gx++)for(let gy=startY;gy<=endY;gy++){
  const site=biomeSite(gx,gy);if(site.id==='meadow'||site.x+site.rx*1.3<minX||site.x-site.rx*1.3>maxX||site.y+site.ry*1.3<minY||site.y-site.ry*1.3>maxY)continue;
  const points=biomeOutline(site).map(p=>worldToLatLng(p.x,p.y)),bio=BIOMES[site.id];
  leafletBiomeLayers.push(L.polygon(points,{pane:'biomePane',color:bio.color,weight:2,opacity:.9,fillColor:bio.color,fillOpacity:bio.fill,interactive:false,smoothFactor:0}).addTo(realMap));
 }
}

function rebuildCityLayer(){
 if(!realMap||!state.world.gpsOrigin)return;
 ensureCityState();if(!state.city.placed)return;const ll=worldToLatLng(state.city.x,state.city.y);if(!ll)return;
 const zone=L.circle(ll,{pane:'overlayPane',radius:CITY_RADIUS,color:'#e5b96b',weight:2.5,dashArray:'9 7',fillColor:'#c5934d',fillOpacity:.10,interactive:false}).addTo(realMap);
 const marker=L.marker(ll,{pane:'gamePane',title:`Wioska pod Krukiem • zasięg ${CITY_RADIUS} m`,icon:makeLeafletIcon('<div class="mmo-marker city-map-marker"><span>🏰</span><small>Miasto</small></div>','game-map-icon',[64,64])}).addTo(realMap);
 marker.on('click',()=>selectNav('town'));
 leafletZoneLayers.push(zone,marker);
}

function biomeLegendHTML(){
 if(!state.settings.mapFilters.biome||state.ui.biomeInfoOpen)return '';
 return `<div class="biome-map-key" aria-label="Legenda biomów">${Object.entries(BIOMES).map(([id,b])=>`<span class="${biomeInfoAtPlayer().id===id?'current':''}" title="${b.rarity}"><i style="--biome:${b.color}"></i>${b.name}</span>`).join('')}</div>`;
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
function nearbyInteractables(limit=3){return (state.world.entities||[]).filter(questWorldEntityVisible).filter(e=>(e.type!=='monster'||e.alive)&&(e.type!=='event'||!e.done)).map(e=>({e,d:dist(e,state.player.position)})).filter(x=>x.d<=entityInteractionRadius(x.e)).sort((a,b)=>a.d-b.d).slice(0,limit)}
function nearbyTrayHTML(){const near=nearbyInteractables();return `<div class="nearby-action-tray ${near.length?'has-actions':''}" data-nearby-tray>${near.length?`<span class="nearby-tray-title">W ZASIĘGU</span>${near.map(({e,d})=>{const name=e.type==='monster'?monsterTemplate(e).name:e.name;const icon=e.type==='monster'?'⚔️':e.icon||'📍';return `<button data-nearby-action="${e.id}"><span>${icon}</span><b>${name}</b><small>${Math.round(d)} m</small></button>`}).join('')}`:'<span class="nearby-tray-empty">Podejdź na 60 m do celu</span>'}</div>`}
function bindNearbyTray(root=document){root.querySelectorAll('[data-nearby-action]').forEach(b=>b.onclick=()=>interactEntity(state.world.entities.find(e=>e.id===b.dataset.nearbyAction)))}
function refreshNearbyTray(){const el=document.querySelector('[data-nearby-tray]');if(!el)return;const temp=document.createElement('div');temp.innerHTML=nearbyTrayHTML();const next=temp.firstElementChild;el.replaceWith(next);bindNearbyTray(document)}
function currentTaskBarSummary(){
 if(tutorialLocksStory()){const t=tutorialInfo();return t?{icon:'🎓',name:`Samouczek ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}`,goal:t.title}:null}
 const q=activeMainStoryQuest();if(q){const cur=currentQuestStep(q.id),prog=state.quests.progress[q.id]||[],i=cur?.index??0,step=cur?.step,current=prog[i]||0,need=step?.count||1;return {icon:'📜',name:q.name,goal:step?`${step.label||step.target||'Kontynuuj zadanie'}${need>1?` • ${Math.min(current,need)}/${need}`:''}`:'Kontynuuj fabułę'}}
 const b=(state.adventure?.bounties||[]).find(x=>x.accepted&&!x.claimed);if(b)return {icon:'📌',name:b.name,goal:`${Math.min(b.progress||0,b.need)}/${b.need} • ${b.type==='gather'?'zbierz potrzebne materiały':'pokonaj wskazane cele'}`};
 return null;
}
function mobileMapSheetToggleHTML(){state.ui.mapSheetOpen ??= false;const t=currentTaskBarSummary();return `<button class="mobile-map-sheet-toggle ${t?'has-task':''}" data-map-sheet-toggle>${state.ui.mapSheetOpen?'× Zamknij panel':t?`<span>${t.icon}</span><div><b>${t.name}</b><small>${t.goal}</small></div><em>⌃</em>`:'☰ Zadania i wydarzenia'}</button>`}


function rebuildGameLayers(){
 if(!realMap||!state.world.gpsOrigin)return;
 leafletEntityLayers.forEach(x=>realMap.removeLayer(x));leafletEntityLayers=[];
 leafletZoneLayers.forEach(x=>realMap.removeLayer(x));leafletZoneLayers=[];
 ensureLivingWorld();const filters=state.settings.mapFilters,z=rareZones(),targets=activeQuestTargets();
 for(const [name,a] of Object.entries(z)){
  const ll=worldToLatLng(a.x,a.y);if(!ll)continue;
 }
 rebuildBiomeLayers();
 rebuildCityLayer();
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
  .map(x=>{const e=x.e;let priority=6;if(e.type==='secret')priority=0;else if(e.type==='quest'||e.type==='resource')priority=1;else if(targets.has(e.id)||(e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template)))priority=1;else if(e.type==='event')priority=2;else if(e.type==='shrine'||e.type==='dungeon')priority=3;else if(e.type==='monster'&&e.elite)priority=4;else if(e.type==='poi')priority=5;return {...x,priority}})
  .sort((a,b)=>a.priority-b.priority||a.d-b.d);
 const monsterLimit=state.settings.mapMode==='focused'?12:28,otherLimit=state.settings.mapMode==='focused'?18:36;
 let monsters=0,others=0;
 const visible=candidates.filter(x=>{if(x.e.type==='monster'){if(monsters>=monsterLimit)return false;monsters++;return true}if(others>=otherLimit)return false;others++;return true});
 for(const {e,ll} of visible.filter(x=>x.e.type==='habitat')){
  const h=HABITATS[e.habitat]||HABITATS.meadow;
 }
 for(const {e,ll,d} of visible.filter(x=>x.d<=180&&(x.e.type==='event'||x.e.type==='dungeon'))){
  const color=e.type==='event'?'#d7b85f':e.type==='dungeon'?'#866eb8':'#b8634f';
 }
 for(const {e,ll,d} of visible){
  let inner='',label='';
  const questTarget=targets.has(e.id)||(e.type==='monster'&&e.template&&e.template!=='any'&&targets.has(e.template));
  if(e.type==='monster'){inner=mapMonsterHTML(e,d,questTarget);label=monsterTemplate(e).name}
  else if(e.type==='event'){inner=`<div class="mmo-marker event-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${e.icon}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=e.name}
  else if(e.type==='secret'){const found=state.world.exploration.secretsFound.includes(e.id);inner=`<div class="mmo-marker secret-marker ${found?'found':''}">${found?e.icon:'❔'}</div>`;label=found?e.name:'Sekret w pobliżu'}
  else if(e.type==='quest'){const visual=e.visual==='woundedWolves'?`<span class="quest-wolves">${monsterVisual('wolf','quest-wolf-a')}${monsterVisual('wolf','quest-wolf-b')}</span>`:`<span class="quest-world-icon">${e.icon||'❗'}</span>`;inner=`<div class="mmo-marker quest-world-marker interaction-ready">${visual}<span class="quest-pin">!</span></div>`;label=e.name}
  else if(e.type==='resource'){inner=`<div class="mmo-marker resource-marker ${d<=60?'interaction-ready':''}"><span>🌿</span>${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=e.name}
  else if(e.type==='dungeon'){const known=state.player.dungeons.includes(e.id);inner=`<div class="mmo-marker dungeon-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${known?e.icon:'❓'}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=known?e.name:'Nieznany loch'}
  else if(e.type==='shrine'){const used=shrineVisit(e.id);inner=`<div class="mmo-marker map-shrine-marker ${used?'used':''}${d<=60?' interaction-ready':''}"><span>⛩️</span>${used?'<small>✓</small>':d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=`${e.name} • ${used?'rzut wykorzystany dziś':'1 🪙, 1 rzut dziennie'}`}
  else if(e.type==='habitat'){inner=`<div class="mmo-marker habitat-marker"><span>${e.icon}</span></div>`;label=`${e.name} • miejsce występowania`}
  else {const known=state.player.discovered.includes(e.id);inner=`<div class="mmo-marker poi-marker ${questTarget?'quest-marker':''}${d<=60?' interaction-ready':d<=120?' proximity':''}">${known?e.icon:'❓'}${d<=60?'<span class="ready-pip">!</span>':''}</div>`;label=known?e.name:'Nieznane miejsce'}
  const creatureSize=e.type==='monster'?monsterMapSize(monsterTemplate(e)):null;
  const marker=L.marker(ll,{pane:'gamePane',icon:creatureSize?makeLeafletIcon(inner,'game-map-icon creature-map-icon',[Math.max(44,creatureSize.width),Math.max(44,creatureSize.height)],[Math.max(44,creatureSize.width)/2,Math.max(44,creatureSize.height)-6]):makeLeafletIcon(inner,'game-map-icon',[52,52]),title:label}).addTo(realMap);
 marker.on('click',()=>interactEntity(e));leafletEntityLayers.push(marker);
 }
}
function monsterMapSize(m){
 const id=m.id||'',name=(m.baseName||m.name||'').toLowerCase();
 if(/wyvern|drake|dragon|hydra|colossus|titan|leviathan|behemoth|tempestLord|mireMother|cinderMatriarch/i.test(id)||/smok|kolos|hydra|tytan/.test(name))return {width:96,height:100,tier:'huge'};
 if(/beetle|ant|moth|wasp|fly|spider|rat|bat|slime|toad/i.test(id)||m.family==='Owady')return {width:40,height:38,tier:'small'};
 if(/wolf|hound|dog|boar|fox|stag|deer|panther/i.test(id)||/wilk|ogar|pies|dzik|jeleń/.test(name))return {width:64,height:62,tier:'medium'};
 if(m.family==='Demony'||m.family==='Żywiołaki'||/golem|ogre|troll|giant/i.test(id))return {width:82,height:88,tier:'large'};
 return {width:58,height:68,tier:'normal'};
}
function mapMonsterHTML(e,d,questTarget=false){const m=monsterTemplate(e),size=monsterMapSize(m),lvl=entityMonsterLevel(e,m),tone=monsterLevelTone(lvl);return `<div class="mmo-marker monster-marker world-creature size-${size.tier} ${e.elite?'elite-marker':''} variant-marker-${m.variantId} ${questTarget?'quest-marker':''} ${d<=guildMonsterAttackRadius()?'interaction-ready':''}" style="--creature-w:${size.width}px;--creature-h:${size.height}px"><i class="creature-shadow"></i>${monsterVisual(m.id,'mmo-sprite',m.variantId)}<b class="creature-level level-${tone}" aria-label="Poziom ${lvl}">Lv. ${lvl}</b>${e.elite?'<b class="creature-rank" aria-label="Elita">★</b>':''}${questTarget?'<b class="creature-quest" aria-label="Cel zadania">!</b>':''}</div>`}
function directionalHeroVisual(id){return `<div class="directional-hero hero-${id}" role="img" aria-label="${CLASSES[id]?.name||'Bohater'}"></div>`}
function battleBackVisual(id){return `<img class="battle-back-hero battle-back-${id}" src="assets/characters/battle-backs/${id}-back.png" alt="${CLASSES[id]?.name||'Bohater'} od tyłu">`}

function movementBearing(from,to){
 if(from?.lat!=null&&from?.lng!=null&&to?.lat!=null&&to?.lng!=null){
  const lat1=Number(from.lat),lat2=Number(to.lat),lng1=Number(from.lng),lng2=Number(to.lng);
  if([lat1,lat2,lng1,lng2].every(Number.isFinite)){const dy=(lat2-lat1)*111320,dx=(lng2-lng1)*111320*Math.cos(lat1*Math.PI/180);if(Math.hypot(dx,dy)>=.4)return (Math.atan2(dx,dy)*180/Math.PI+360)%360}
 }
 return to?.heading!=null&&Number.isFinite(Number(to.heading))&&Number(to.heading)>=0?Number(to.heading)%360:playerMotion.heading;
}
function playerFacing(heading=0){const h=(heading+360)%360;if(h>=45&&h<135)return'right';if(h>=225&&h<315)return'left';if(h>=135&&h<225)return'down';return'up'}
function playerMarkerHTML(){
 const facing=playerFacing(playerMotion.heading),cycle=playerMotion.speed>2.8?300:520;
 return `<div class="leaflet-player-marker rpg-player-marker ${playerMotion.moving?'walking':''} ${playerMotion.speed>2.8?'moving-fast':''}" data-player-walker data-facing="${facing}" style="--walk-heading:${playerMotion.heading||0}deg;--walk-cycle:${cycle}ms"><div class="player-heading-arrow"></div><i class="player-walk-shadow"></i><b class="player-step-dust"></b><div class="player-facing"><div class="player-walk-avatar">${directionalHeroVisual(state.player.class)}</div></div><span class="player-pin-tip"></span></div>`;
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
 const moved=from?.lat!=null&&from?.lng!=null&&to?.lat!=null&&to?.lng!=null&&Number.isFinite(distance)&&distance>=threshold;
 if(moved){playerMotion.heading=movementBearing(from,to);state.ui.mapHeading=playerMotion.heading;playerMotion.speed=to?.testWalk?1.55:clamp(distance/elapsed,.2,18);playerMotion.movingUntil=now+(to?.testWalk?720:Math.round(clamp(900+elapsed*520,1100,2600)));playerMotion.lastStepSeconds=elapsed}
 playerMotion.moving=moved||now<playerMotion.movingUntil;playerMotion.lastAt=now;
 clearTimeout(playerWalkStopTimer);if(playerMotion.moving)playerWalkStopTimer=setTimeout(()=>{playerMotion.moving=false;playerMotion.speed=0;syncPlayerMarkerMotion()},Math.max(80,playerMotion.movingUntil-Date.now()));
}
function updateLiveMapPosition(){
 if(!realMap||!state.player.position.lat)return;
 const p=state.player.position,ll=[p.lat,p.lng];
 if(!playerMapMarker){
  const html=playerMarkerHTML();
  playerMapMarker=L.marker(ll,{pane:'playerPane',icon:makeLeafletIcon(html,'player-leaflet-icon',[64,80],[32,74]),zIndexOffset:1000}).addTo(realMap);
 }else{playerMapMarker.setLatLng(ll);requestAnimationFrame(syncPlayerMarkerMotion)}
 if(accuracyCircle){realMap.removeLayer(accuracyCircle);accuracyCircle=null}
 if(!interactionCircle)interactionCircle=L.circle(ll,{pane:'overlayPane',radius:guildMonsterAttackRadius(),color:'#67c6c5',weight:2,fillColor:'#67c6c5',fillOpacity:.025,interactive:false}).addTo(realMap);
 else{interactionCircle.setLatLng(ll);interactionCircle.setRadius(guildMonsterAttackRadius())}
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
  playerMapMarker=L.marker([p.lat,p.lng],{pane:'playerPane',icon:makeLeafletIcon(html,'player-leaflet-icon',[64,80],[32,74]),zIndexOffset:1000}).addTo(realMap);
  accuracyCircle=null;
  interactionCircle=L.circle([p.lat,p.lng],{pane:'overlayPane',radius:guildMonsterAttackRadius(),color:'#67c6c5',weight:2,fillColor:'#67c6c5',fillOpacity:.025,interactive:false}).addTo(realMap);
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
 return `<div class="map-quick-actions"><button class="secondary" data-map-gps>${gpsWatch!==null?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button><button class="secondary" data-map-center>🎯 Do mnie</button><button class="secondary" data-shortcut="quests">${tutorialLocksStory()?'🎓 Samouczek':'📜 Zadania'}</button><button class="secondary" data-nav="town">🏰 Miasto</button><span class="map-status-chip">${p.position.testWalk?'🧪 TEST • strzałki':virtual?'TRYB DOMOWY':hasGeo?`GPS ±${Math.round(p.position.accuracy||0)} m`:'GPS wyłączony'}</span></div>`;
}
function activeGuideQuest(){
 const active=state.quests.active||[];
 if(state.ui.questGuideId && active.includes(state.ui.questGuideId))return QUESTS.find(q=>q.id===state.ui.questGuideId)||null;
 return null;
}
function questGuideTarget(q=activeGuideQuest()){
 if(!q)return null;
 const prog=state.quests.progress[q.id]||[];
 const stepIndex=q.steps.findIndex((s,i)=>!questStepDone(s,prog[i]));
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
 const line=L.polyline([[p.lat,p.lng],target],{pane:'overlayPane',color:'#e53935',weight:3.5,opacity:.95,dashArray:'10 9',lineCap:'round',interactive:false});
 questGuideLayer=L.layerGroup([line]).addTo(realMap);
}

function biomeInfoSheetHTML(){
 if(!state.ui.biomeInfoOpen)return '';
 const bio=biomeInfoAtPlayer(),habitat=habitatInfoAtPlayer(),pool=habitatMonsterPool(habitat.id).map(id=>MONSTERS.find(m=>m.id===id)).filter(Boolean);
 return `<section class="biome-info-sheet"><div class="mobile-sheet-head"><div><b>${habitat.icon} ${habitat.name}</b><small>${bio.icon} Biom: ${bio.name} • ${bio.rarity}</small></div><button data-biome-info-close>▾ Zwiń</button></div><p>${habitat.desc}</p>${biomeEffectHTML(bio.id)}<div class="biome-sheet-monsters">${pool.slice(0,10).map(m=>`<span>${monsterVisual(m.id,'biome-list-sprite')} <b>${m.name}</b> <small>lvl ${m.min}–${m.max}</small></span>`).join('')}</div><div class="muted biome-note">Populacja odświeża się automatycznie po wejściu do nowej okolicy GPS.</div></section>`;
}
function mapSideTab(){state.ui.mapPanelTab ||= 'quests';return state.ui.mapPanelTab}
function mapSideTabsHTML(){const cur=mapSideTab();const tabs=[['quests','Zadania'],['events','Wydarzenia'],['nearby','W pobliżu']];return `<div class="mobile-sheet-head map-sheet-head"><b>${cur==='quests'?'📜 Zadania':cur==='events'?'✨ Wydarzenia':'📍 W pobliżu'}</b><button data-map-sheet-collapse>▾ Zwiń</button></div><div class="map-panel-tabs">${tabs.map(([id,label])=>`<button class="${cur===id?'active':''}" data-map-side-tab="${id}">${label}</button>`).join('')}</div>`}
function mapQuestPanelHTML(){
 const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean).slice(0,4),bounties=(state.adventure?.bounties||[]).filter(b=>b.accepted&&!b.claimed).slice(0,4),guided=activeGuideQuest();const next=nextStoryQuestAvailable();
 const tutorialHtml=tutorialLocksStory()?`<div class="quest-entry tutorial-task-entry"><div><b>🎓 Samouczek</b><small>${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}</small></div><p>${tutorialInfo()?.title||'Dokończ samouczek'}</p><button class="secondary" data-tutorial-go>${tutorialActionLabel(tutorialInfo())}</button></div>`:'';
 const storyHtml=active.map(q=>{const prog=state.quests.progress[q.id]||[],done=q.steps.reduce((n,s,i)=>n+(questStepDone(s,prog[i])?1:0),0),total=q.steps?.length||1,idx=currentQuestStepIndex(q.id),step=idx>=0?q.steps[idx]:null,current=idx>=0?(prog[idx]||0):0,need=step?questStepNeed(step):1;return `<div class="quest-entry ${guided?.id===q.id?'guided':''}"><div><b>${q.name}</b><small>${q.chapter||'Przygoda'} • lvl ${q.level}</small></div><div class="quest-progress-mini"><span style="width:${Math.min(100,done/total*100)}%"></span></div><p>${step?.label||q.desc||'Kontynuuj zadanie na mapie.'}${need>1?` <strong>${Math.min(current,need)}/${need}</strong>`:''}</p><button class="secondary quest-guide-btn ${guided?.id===q.id?'active':''}" data-guide-quest="${q.id}">${guided?.id===q.id?'🧭 Prowadzenie włączone':'➤ Prowadź do celu'}</button></div>`}).join('');
 const bountyHtml=bounties.length?`<div class="map-task-subtitle">ZLECENIA Z KARCZMY</div>${bounties.map(b=>`<div class="quest-entry bounty-task-entry"><div><b>📌 ${b.name}</b><small>Zlecenie • ${Math.min(b.progress||0,b.need)}/${b.need}</small></div><div class="quest-progress-mini"><span style="width:${Math.min(100,(b.progress||0)/Math.max(1,b.need)*100)}%"></span></div><p>${b.type==='gather'?`Zbierz: ${itemDef(b.target)?.name||b.target}`:`Pokonaj: ${MONSTERS.find(m=>m.id===b.target)?.name||b.target}`}</p></div>`).join('')}`:'';
 const empty=!tutorialHtml&&!storyHtml&&!bountyHtml?'<div class="panel-empty">Brak aktywnych zadań.</div>':'';
 return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>Zadania</h3><span>${activeTaskCount()}/${activeTaskLimit()}</span></div>${tutorialHtml}${storyHtml}${bountyHtml}${empty}${next?`<div class="quest-entry available"><div><b>Dostępne dalej</b><small>${next.chapter||'Przygoda'} • lvl ${next.level}</small></div><p>${next.name}</p><button class="secondary" data-open-quests>Otwórz dziennik</button></div>`:''}</div>`;
}

function mapEventsPanelHTML(){
 const discovered=state.player.discovered.slice(-3).reverse(),done=state.quests.done.slice(-2).reverse(),entries=[],nearest=(state.world.entities||[]).filter(e=>e.type==='event'&&!e.done).map(e=>({e,d:Math.round(dist(e,state.player.position))})).sort((a,b)=>a.d-b.d)[0];entries.push({t:'Teraz',text:`${biomeInfoAtPlayer().icon} ${biomeInfoAtPlayer().name} • ${climate().icon} ${climate().weather} • ${climate().phase}`});if(nearest)entries.push({t:'✨ Sygnał',text:`${nearest.e.signal||nearest.e.name} • ${nearest.d} m`});if(state.player.kills>0)entries.push({t:'Przed chwilą',text:`Pokonane potwory łącznie: ${state.player.kills}`});discovered.forEach(id=>{const e=state.world.entities.find(x=>x.id===id);if(e)entries.push({t:'Odkrycie',text:`Odkryto: ${e.name}`})});done.forEach(id=>{const q=QUESTS.find(x=>x.id===id);if(q)entries.push({t:'Ukończono',text:`Quest: ${q.name}`})});return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>Wydarzenia</h3><span>Na bieżąco</span></div>${nearest?`<button class="nearby-event-signal" data-world-event="${nearest.e.id}"><span>${nearest.e.icon||'✨'}</span><div><b>${nearest.e.name}</b><small>${nearest.d} m • ${eventTimeLabel(nearest.e)}</small></div></button>`:''}<div class="event-feed">${entries.slice(0,6).map(e=>`<div class="event-row"><b>${e.t}</b><p>${e.text}</p></div>`).join('')}</div></div>`;
}
function mapNearbyPanelHTML(){const nearby=mapDashboardEntities(180).slice(0,6);return `<div class="parchment-panel-v2"><div class="panel-heading"><h3>W pobliżu</h3><span>60 m interakcji • ${guildMonsterAttackRadius()} m walka</span></div>${nearby.length?nearby.map(e=>{const d=Math.round(dist(e,state.player.position)),name=e.type==='monster'?monsterTemplate(e).name:e.name;return `<button class="nearby-row" data-dash-entity="${e.id}"><b>${e.icon||(e.type==='monster'?'⚔️':'📍')} ${name}</b><small>${e.type} • ${d} m</small></button>`}).join(''):`<div class="panel-empty">Nic ciekawego w pobliżu.</div>`}</div>`}
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
 el.innerHTML=`<div class="world-dashboard osm-rpg-dashboard living-world-dashboard clean-map-dashboard"><section class="dashboard-main-card fantasy-card osm-rpg-card clean-map-card"><div class="real-map-rpg-frame weather-frame-${weatherSlug} phase-frame-${phaseSlug}"><div id="realMap" class="real-map real-map-rpg"></div>${mapAmbientFxHTML()}<div class="rpg-map-vignette"></div><div class="rpg-map-compass">N</div><button class="map-biome-button" data-biome-info title="${habitat.name} • ${region.name} — kliknij po informacje" aria-label="Informacje o biomie: ${region.name}"><span>${region.icon}</span></button>${questGuideHTML()}${biomeInfoSheetHTML()}${biomeLegendHTML()}<div class="map-ui-stack osm-controls"><button class="map-ui-btn" data-osm-zoom="in">＋</button><button class="map-ui-btn" data-osm-zoom="out">－</button><button class="map-ui-btn" data-osm-center>◎</button><button class="map-ui-btn" data-map-gps title="${gpsWatch!==null?'Wyłącz GPS':'Włącz GPS'}">📍</button><button class="map-ui-btn" data-map-sheet-toggle>📜</button></div>${tutorial}${testMovePadHTML()}<div class="osm-map-footer"><span class="map-status-chip" data-live-gps>${p.position.testWalk?'🧪 TEST • strzałki':virtual?'TRYB DOMOWY':hasGeo?`GPS ±${Math.round(p.position.accuracy||0)} m`:'GPS wyłączony'}</span><span class="interaction-badge">⚔️ ${guildMonsterAttackRadius()} m</span></div></div>${mobileMapSheetToggleHTML()}</section><aside class="dashboard-side-card fantasy-card map-journal-sheet ${state.ui.mapSheetOpen?'open':''}" data-map-journal-sheet>${mapRightPanelHTML()}</aside></div>`;
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
 const pos=state.player.position||{x:0,y:0},previousLL=worldToLatLng(pos.x||0,pos.y||0),previousPosition=previousLL?{lat:previousLL[0],lng:previousLL[1]}:{...pos};
 pos.x=(pos.x||0)+dx;pos.y=(pos.y||0)+dy;
 const ll=worldToLatLng(pos.x,pos.y);
 if(ll){pos.lat=ll[0];pos.lng=ll[1]}
 pos.gps=false;pos.accuracy=0;pos.heading=null;pos.virtualTravel=false;pos.testWalk=true;
 registerPlayerMovement(previousPosition,pos);state.player.position=pos;followGps=true;
 if(pos.lat&&pos.lng)addExploredPoint(pos.lat,pos.lng,0);
 const added=markExplorationArea(pos.x,pos.y);if(added)registerExplorationProgress(pos.x,pos.y);
 const away=Math.hypot(pos.x,pos.y);checkQuestProgress('move',null,away);tutorialEvent('move',away);notifyNearbyWorldEvents();save();
 if(currentTab==='map'&&realMap){updateLiveMapPosition();rebuildGameLayers();refreshNearbyTray();refreshQuestGuide();rebuildQuestGuideLayer()}
 else if(currentTab==='map')selectNav('map');
}

function shrineVisit(id){const entry=state?.world?.shrinePrayers?.[id];return entry?.day===todayKey()?entry:null}
function openShrine(e,result=null){
 const visit=shrineVisit(e.id),p=state.player;
 openModal(`<div class="shrine-prayer"><div class="modal-head"><div><span class="eyebrow">KAPLICZKA NA SZLAKU</span><h2>⛩️ ${e.name}</h2><div class="muted">Jeden rzut dziennie przy tej kapliczce • koszt 1 🪙</div></div><button class="close" data-close>×</button></div><div class="shrine-coin ${result?'tossed':''}">${result==='heads'?'🦅':result==='tails'?'🪙':'🪙'}</div><p>${result==='heads'?'Orzeł! Modlitwy zostały wysłuchane. Twoje życie zostało w pełni przywrócone.':result==='tails'?'Reszka. Modlitwy nie zostały wysłuchane. Twoje życie pozostaje bez zmian.':visit?'Dzisiejszy rzut przy tej kapliczce został już wykorzystany. Wróć jutro.':'Wrzuć jedną monetę i pomódl się. Orzeł uleczy całe życie, reszka nie uleczy nic.'}</p><div class="shrine-prayer-status">❤️ ${p.hp}/${p.maxHp} <span>🪙 ${p.gold}</span></div>${visit?'<button class="secondary" disabled>Wróć jutro</button>':`<button class="primary" data-pray-shrine="${e.id}" ${p.gold<1?'disabled':''}>Rzuć monetą • 1 🪙</button>`}${p.gold<1&&!visit?'<small>Potrzebujesz jednej monety.</small>':''}</div>`);
 document.querySelector('[data-pray-shrine]')?.addEventListener('click',()=>flipShrineCoin(e.id));
}
function flipShrineCoin(id,roll=Math.random()){
 const e=state.world.entities.find(x=>x.id===id&&x.type==='shrine');if(!e)return;
 if(state.player.position.virtualTravel)return toast('Podróż domowa nie pozwala korzystać z kapliczek.');
 if(!gpsInteractionReady())return;
 if(dist(e,state.player.position)>60)return toast('Podejdź na 60 m do kapliczki.');
 if(shrineVisit(id))return toast('Dziś rzucałeś już monetą przy tej kapliczce.');
 if(state.player.gold<1)return toast('Potrzebujesz 1 🪙 na modlitwę.');
 const result=roll<.5?'heads':'tails';
 state.world.shrinePrayers ||= {};
 for(const [key,value] of Object.entries(state.world.shrinePrayers))if(value?.day!==todayKey())delete state.world.shrinePrayers[key];
 state.world.shrinePrayers[id]={day:todayKey(),result};state.player.gold--;
 if(result==='heads'){state.player.hp=state.player.maxHp;playSfx('heal')}else playSfx('click');
 save();renderShell();openShrine(e,result);
}
function interactEntity(e){
 if(!e)return;
 const d=dist(e,state.player.position),R=entityInteractionRadius(e);
 if(e.type==='habitat'){state.ui.biomeInfoOpen=true;save();if(currentTab==='map')selectNav('map');return}
 // Once a guardian has been defeated the dungeon can be entered remotely; the physical marker is no longer required.
 if(e.type==='dungeon'&&state.player.dungeons.includes(e.id)&&dungeonAccess(e.id).guardianDefeated){openDungeonLobby(DUNGEONS.find(x=>x.id===e.id)||e);return}
 if(state.player.position.virtualTravel&&e.type!=='dungeon')return toast('Tryb podróży domowej nie pozwala na interakcje GPS. Włącz GPS, aby wrócić do świata.');
 if(!gpsInteractionReady())return;
 if(d>R)return toast(`Podejdź na ${R} m. Teraz: ${Math.round(d)} m.`);
 if(e.type==='secret'){discoverSecret(e);return}
 if(e.type==='shrine'){openShrine(e);return}
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
  const nextPosition={x:dx,y:dy,lat,lng,gps:true,accuracy,heading,receivedAt:now,virtualTravel:false,testWalk:false};registerPlayerMovement(state.player.position,nextPosition);state.player.position=nextPosition;
  const revealed=addExploredPoint(lat,lng,accuracy),newSectors=accuracy<=120?markExplorationArea(dx,dy):0;
  if(newSectors>0)registerExplorationProgress(dx,dy);
  const away=Math.hypot(dx,dy);checkQuestProgress('move',null,away);tutorialEvent('move',away);notifyNearbyWorldEvents();if(revealed||newSectors)checkRegionRewards();save();
  if(currentTab==='map'&&!combat&&!dungeonRun&&!battleResult){
   if(!realMap||!hadMapPosition){selectNav('map');setTimeout(()=>{followGps=true;updateLiveMapPosition()},120)}
   else{updateLiveMapPosition();rebuildGameLayers()}
  }else if(currentTab==='town'&&!combat&&!dungeonRun&&!battleResult)renderTown(document.querySelector('#viewport'));
 };
 const handleError=err=>{if(err.code!==1&&lastAcceptedFix&&Date.now()-lastAcceptedFix.at<30000)return;const msg=err.code===1?'Brak zgody na lokalizację. Włącz dostęp do lokalizacji dla tej strony.':err.code===2?'Nie udało się ustalić pozycji GPS.':err.code===3?'GPS nie odpowiedział na czas. Spróbuj ponownie.':err.message;toast(`GPS: ${msg}`);if(gpsWatch!==null)navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;if(state?.player?.position)state.player.position.gps=false;save();if(currentTab==='map')selectNav('map')};
 navigator.geolocation.getCurrentPosition(handlePosition,handleError,{enableHighAccuracy:true,maximumAge:0,timeout:15000});
 gpsWatch=navigator.geolocation.watchPosition(handlePosition,handleError,{enableHighAccuracy:true,maximumAge:1000,timeout:20000});
}


function renderCharacter(el){
 const p=state.player,c=CLASSES[p.class],slots=[['ring1','Pierścień I','💍'],['helmet','Hełm','⛑️'],['amulet','Amulet','📿'],['weapon','Broń główna','⚔️'],['armor','Pancerz','🛡️'],['offhand',classOffhandLabel(p.class),p.class==='berserker'?'🪓':p.class==='mage'?'🔮':['hunter','ranger'].includes(p.class)?'🎒':'🛡️'],['gloves','Rękawice','🧤'],['legs','Spodnie','👖'],['boots','Buty','🥾'],['ring2','Pierścień II','💍']];
 const branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 el.innerHTML=`<div class="section-title"><div><h2>${p.name}</h2><div class="muted">${c.name} • ${c.desc}</div></div><span class="pill">lvl ${p.level}</span></div><div class="character-layout"><div class="paperdoll"><div class="paperdoll-title">WYPOSAŻENIE</div><div class="paperdoll-grid">${slots.map(([slot,label,ico])=>equipmentSlotHTML(slot,label,ico)).join('')}<div class="hero-silhouette"><div class="hero-pixel">${classVisual(p.class,'sprite-hero')}</div><b>${p.name}</b><span>${c.name}</span></div></div></div><div class="character-stats"><h3>Statystyki</h3><div class="stat-grid">${Object.entries(p.stats).map(([k,v])=>`<div class="stat-card"><b>${({str:'SIŁA',agi:'ZRĘCZNOŚĆ',int:'INTELIGENCJA',vit:'WITALNOŚĆ',lck:'SZCZĘŚCIE'})[k]||k.toUpperCase()}</b><div class="stat-number">${v}</div>${p.statPoints?`<button class="secondary mini" data-stat="${k}">+1</button>`:''}</div>`).join('')}</div><div class="derived-grid"><div><b>${attackPower()}</b><span>Atak</span></div><div><b>${armorPower()}</b><span>Pancerz</span></div><div><b>${critChance().toFixed(0)}%</b><span>Krytyk</span></div><div><b>${totalLuck()}</b><span>🍀 Szczęście</span></div><div><b>+${luckLootBonusPct().toFixed(1)}%</b><span>Lepszy łup</span></div><div><b>${p.skillPoints}</b><span>Pkt skilli</span></div></div></div></div><div class="skill-tree-head"><div><h3>🌳 Drzewko umiejętności</h3><div class="muted">Poziom nie blokuje zdolności. Ukończ próbę klasową i wymagane wcześniejsze zdolności.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="skill-branches">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div><h3 style="margin-top:22px">🐾 Chowańce</h3>${petSection()}`;
 el.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{if(p.statPoints<=0)return;p.stats[b.dataset.stat]++;p.statPoints--;if(b.dataset.stat==='vit'){p.maxHp+=5;p.hp+=5}if(b.dataset.stat==='int'){p.maxMana+=4;p.mana+=4}save();refresh()});
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
 el.querySelectorAll('[data-active-skill]').forEach(b=>b.onclick=()=>{toggleCombatSkill(b.dataset.activeSkill);refresh()});
 el.querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>{p.petActive=b.dataset.pet;save();refresh();toast(`Aktywny chowaniec: ${petDef(p.petActive).name}`)});
 el.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{state.ui.heroView='gear';currentTab='hero';selectNav('hero');toast(`Wybierz przedmiot do slotu: ${b.dataset.slot}`)});
} 
function equipmentSlotHTML(slot,label,ico){
 const i=equippedInstance(slot),d=i?itemDef(i.id):null;
 return `<button class="gear-slot dnd-equip-slot ${i?`rarity-border-${d.rarity}`:'empty'}" data-equip-drop="${slot}" data-slot="${slot}" title="${i?itemName(i):`Przeciągnij tutaj: ${label}`}"><span>${d?itemIconVisual(d.id,'gear-item-svg'):ico}</span><b>${label}</b><small>${d?itemName(i):'pusty'}</small>${i?'<em class="equipped-dot">ZAŁOŻONE</em>':''}</button>`;
}
function skillCard(s){const p=state.player,learned=p.skills.includes(s.id),active=learned&&ensureCombatSkillLoadout().includes(s.id),reqSkill=s.requires,canPrev=!reqSkill||p.skills.includes(reqSkill),trial=skillTrialProgress(s),can=trial.done&&canPrev&&p.skillPoints>=s.cost;return `<div class="skill-node ${learned?'learned':!can?'locked':''} ${active?'active-loadout':''}"><div class="skill-orb">${skillIconVisual(s.id,'skill-node-svg')}</div><div class="skill-copy"><b>${s.name}</b><div class="tiny">${s.cost} pkt • mana ${s.mana}${s.cooldown?` • CD ${s.cooldown}`:''}</div><p>${s.desc}</p>${!learned?`<div class="skill-trial ${trial.done?'done':''}"><b>PRÓBA KLASOWA</b><span>${skillTrialText(s)}</span><i><em style="width:${Math.min(100,100*trial.value/trial.trial.count)}%"></em></i></div>`:''}${reqSkill&&!canPrev?`<div class="tiny danger-text">Wymaga umiejętności: ${skillDef(reqSkill)?.name||reqSkill}</div>`:''}</div>${learned?`<div class="skill-node-actions"><span class="pill ${active?'gold':'green'}">${active?'NA PASKU':'NAUCZONE'}</span><button class="secondary mini" data-active-skill="${s.id}">${active?'Usuń z paska':'Dodaj do walki'}</button></div>`:`<button class="secondary" data-learn="${s.id}" ${can?'':'disabled'}>${trial.done?'Odblokuj':'Ukończ próbę'}</button>`}</div>`}
function learnSkill(id){const p=state.player,s=(SKILLS[p.class]||[]).find(x=>x.id===id);if(!s||p.skills.includes(id))return;const trial=skillTrialProgress(s);if(!trial.done)return toast(`Próba klasowa: ${skillTrialText(s)}.`);if(s.requires&&!p.skills.includes(s.requires))return toast(`Najpierw odblokuj: ${skillDef(s.requires)?.name||s.requires}.`);if(p.skillPoints<s.cost)return toast('Za mało punktów umiejętności.');p.skillPoints-=s.cost;p.skills.push(id);const active=ensureCombatSkillLoadout();if(active.length<MAX_ACTIVE_SKILLS&&!active.includes(id))p.activeSkills=[...active,id];tutorialEvent('skill');save();refresh();toast(`Odblokowano: ${s.name}${p.activeSkills.includes(id)?' • dodano do paska walki':''}`)}
function petSection(){const p=state.player;if(!['hunter','ranger'].includes(p.class))return `<div class="panel-item"><b>🔒 Chowańce bojowe</b><div class="muted">Bojowe chowańce są specjalizacją Łowcy i Tropiciela.</div></div>`;if(!p.pets.length)return `<div class="panel-item">Nie masz jeszcze chowańca.</div>`;return `<div class="pet-grid">${p.pets.map(x=>{const d=petDef(x.id),need=x.level*90;return `<div class="pet-card-v03 ${p.petActive===x.id?'active':''}"><div class="pet-portrait">${d.icon}</div><div><b>${d.name} • lvl ${x.level}</b><div class="tiny">Aktywna: ${d.skill} • Pasywna: ${d.passive}</div><div class="muted">${d.desc}</div><div class="barwrap"><div class="bar petbar" style="width:${100*x.xp/need}%"></div><div class="barlabel">XP ${x.xp}/${need}</div></div></div><button class="secondary" data-pet="${x.id}" ${p.petActive===x.id?'disabled':''}>${p.petActive===x.id?'Aktywny':'Wybierz'}</button></div>`}).join('')}</div>`}
function inventoryItemEquippedSlot(i){if(!i?.uid)return null;return Object.entries(state.player.equipped||{}).find(([,x])=>x?.uid===i.uid)?.[0]||null}
function isOneHandedWeapon(d){return d?.type==='weapon'&&['sword','axe','hammer'].includes(d.weaponKind)}
function classOffhandLabel(cls=state?.player?.class){return ({knight:'Tarcza',berserker:'Druga broń',mage:'Fokus',hunter:'Kołczan',ranger:'Pułapki'})[cls]||'Druga ręka'}
function itemCanGoToSlot(i,slot){
 if(!i)return false;const d=itemDef(i.id);if(!d?.slot||!itemClassAllowed(d))return false;
 if(d.slot==='ring')return slot==='ring1'||slot==='ring2';
 if(slot==='offhand'&&state.player.class==='berserker'&&isOneHandedWeapon(d))return true;
 if(slot==='offhand'&&d.slot==='offhand')return itemClassAllowed(d);
 if(slot==='offhand')return false;
 return d.slot===slot;
}
function equipIndexToSlot(idx,slot){
 const i=state.player.inventory[idx];if(!i)return false;const d=itemDef(i.id);
 if(d.reqLevel&&state.player.level<d.reqLevel){toast(`Wymagany poziom ${d.reqLevel}.`);return false}
 if(!itemClassAllowed(d)){toast(`${d.name}: tylko ${itemClassNames(d)}.`);return false}
 if(!itemCanGoToSlot(i,slot)){toast(`${d.name} nie pasuje do slotu: ${slotLabel(slot)}.`);return false}
 ensureBackpackSlots();const oldSlot=inventoryItemEquippedSlot(i),incomingBagSlot=Number.isInteger(i.bagSlot)?i.bagSlot:firstFreeBackpackSlot(i),displaced=state.player.equipped[slot];
 if(oldSlot&&oldSlot!==slot&&displaced&&!inventoryHasRoom()){toast('Zwolnij miejsce na zdejmowany przedmiot.');return false}
 if(oldSlot&&oldSlot!==slot)state.player.equipped[oldSlot]=null;
 if(displaced?.uid&&displaced.uid!==i.uid){const oldItem=state.player.inventory.find(x=>x.uid===displaced.uid);if(oldItem)oldItem.bagSlot=incomingBagSlot>=0?incomingBagSlot:firstFreeBackpackSlot(i)}
 delete i.bagSlot;state.player.equipped[slot]=i;tutorialEvent('equip');playSfx('equip');haptic(12);save();toast(`Założono: ${itemName(i)} → ${slotLabel(slot)}`);return true;
}
function renderInventory(el){
 tutorialEvent('inventory');
 const p=state.player,slots=[['ring1','Pierścień I','💍'],['helmet','Hełm','⛑️'],['amulet','Amulet','📿'],['weapon','Broń główna','⚔️'],['armor','Pancerz','🛡️'],['offhand',classOffhandLabel(p.class),p.class==='berserker'?'🪓':p.class==='mage'?'🔮':['hunter','ranger'].includes(p.class)?'🎒':'🛡️'],['gloves','Rękawice','🧤'],['legs','Spodnie','👖'],['boots','Buty','🥾'],['ring2','Pierścień II','💍']],used=inventoryUsedSlots(),cap=inventoryCapacity(),bag=backpackEntries(),bySlot=new Map(bag.map(e=>[e.slot,e]));
 const cells=Array.from({length:cap},(_,idx)=>{const entry=bySlot.get(idx);if(!entry)return `<button class="backpack-slot empty bag-drop-target ${state.ui?.bagArrangeMode?'arrange-target':''}" data-bag-pos="${idx}" aria-label="Pusty slot ${idx+1}"><span>·</span></button>`;const i=entry.item,realIndex=entry.index,d=itemDef(i.id),qty=i.qty||1;return `<button class="backpack-slot dnd-bag-item bag-drop-target rarity-border-${d.rarity} ${state.ui?.bagArrangeMode&&state.ui?.bagMoveIndex===realIndex?'bag-move-selected':''}" data-bag-index="${realIndex}" data-bag-pos="${idx}" draggable="true" title="${itemName(i)} • przeciągnij, aby zmienić miejsce${d.slot?' lub założyć':''}"><span class="backpack-icon">${itemIconVisual(d.id,'backpack-item-svg')}</span>${qty>1?`<b class="stack-badge">${qty}</b>`:''}${(i.upgrade||0)>0?`<em>+${i.upgrade}</em>`:''}</button>`}).join('');
 el.innerHTML=`<div class="section-title gear-page-title"><div><h2>🎒 Ekwipunek + plecak</h2><div class="muted">Przeciągaj przedmioty między slotami plecaka. Sprzęt możesz także przeciągnąć na odpowiednie miejsce wyposażenia. Sprzedaż jest dostępna wyłącznie u kupca.</div></div><span class="pill ${used>=cap?'danger-pill':''}">${used}/${cap}</span></div><div class="gear-bag-layout"><section class="paperdoll drag-paperdoll"><div class="paperdoll-title">WYPOSAŻENIE</div><div class="paperdoll-grid dnd-paperdoll-grid">${slots.map(([slot,label,ico])=>equipmentSlotHTML(slot,label,ico)).join('')}<div class="hero-silhouette drag-hero-silhouette"><div class="hero-pixel">${classVisual(p.class,'sprite-hero')}</div><b>${p.name}</b><span>${CLASSES[p.class].name}</span></div></div><div class="drag-help">Przeciągnij sprzęt na podświetlony slot</div></section><section class="backpack-frame drag-backpack"><div class="backpack-topline"><b>Plecak</b><div class="backpack-tools"><span>${cap-used} wolnych</span>${bagSortOptionsHTML()}<button class="bag-arrange-toggle ${state.ui?.bagArrangeMode?'active':''}" data-bag-arrange aria-pressed="${!!state.ui?.bagArrangeMode}">✥ Układanie</button></div></div><div class="backpack-grid">${cells}</div><div class="drag-help">${state.ui?.bagArrangeMode?(state.ui?.bagMoveIndex!==null?'Wybierz slot docelowy — może być pusty.':'Kliknij przedmiot, potem puste lub zajęte pole.'):'Przeciągnij przedmiot albo włącz „Układanie”, aby przenosić go także do pustych pól.'}</div></section></div>${combatStatsPanelHTML()}${setStatusHTML()}`;
 bindInventoryDragDrop(el);
 el.querySelector('[data-bag-sort]')?.addEventListener('change',e=>{const mode=e.target.value;if(mode!=='manual')sortBackpack(mode);state.ui.bagMoveIndex=null;renderInventory(el)});
 el.querySelector('[data-bag-arrange]')?.addEventListener('click',()=>{state.ui ||= {};state.ui.bagArrangeMode=!state.ui.bagArrangeMode;state.ui.bagMoveIndex=null;save();renderInventory(el)});
 el.querySelectorAll('[data-bag-pos]').forEach(slot=>slot.addEventListener('click',e=>{if(!state.ui?.bagArrangeMode||Date.now()<(window.__t4hSuppressBagClickUntil||0))return;e.preventDefault();e.stopPropagation();const clickedIdx=slot.dataset.bagIndex!==undefined?Number(slot.dataset.bagIndex):null;if(state.ui.bagMoveIndex==null){if(clickedIdx!==null){state.ui.bagMoveIndex=clickedIdx;save();renderInventory(el)}return}const source=state.ui.bagMoveIndex;if(clickedIdx===source){state.ui.bagMoveIndex=null;save();renderInventory(el);return}moveBackpackItemToSlot(source,Number(slot.dataset.bagPos));state.ui.bagMoveIndex=null;save();renderInventory(el)}));
 el.querySelectorAll('[data-bag-index]').forEach(b=>b.onclick=e=>{if(state.ui?.bagArrangeMode||Date.now()<(window.__t4hSuppressBagClickUntil||0))return;openInventoryItem(Number(b.dataset.bagIndex))});
 el.querySelectorAll('[data-equip-drop]').forEach(b=>b.onclick=()=>{const slot=b.dataset.equipDrop,i=equippedInstance(slot);if(!i)return;const idx=state.player.inventory.findIndex(x=>x?.uid===i.uid);if(idx>=0)openInventoryItem(idx)});
}
function bindInventoryDragDrop(root){
 let dragIdx=null,ghost=null,start=null,moved=false;
 const bagTargets=()=>root.querySelectorAll('[data-bag-pos]');
 const highlight=idx=>{const i=state.player.inventory[idx];root.querySelectorAll('[data-equip-drop]').forEach(s=>s.classList.toggle('drop-valid',!!itemDef(i?.id).slot&&itemCanGoToSlot(i,s.dataset.equipDrop)));bagTargets().forEach(s=>s.classList.add('bag-drop-valid'))};
 const clear=()=>{root.querySelectorAll('[data-equip-drop]').forEach(s=>s.classList.remove('drop-valid','drop-hover'));bagTargets().forEach(s=>s.classList.remove('bag-drop-valid','bag-drop-hover'));ghost?.remove();ghost=null;dragIdx=null;start=null;moved=false};
 const hoverAt=(x,y)=>{const hit=document.elementFromPoint?.(x,y),equip=hit?.closest?.('[data-equip-drop]'),bag=hit?.closest?.('[data-bag-pos]');root.querySelectorAll('[data-equip-drop]').forEach(s=>s.classList.toggle('drop-hover',s===equip&&itemCanGoToSlot(state.player.inventory[dragIdx],s.dataset.equipDrop)));bagTargets().forEach(s=>s.classList.toggle('bag-drop-hover',s===bag));return {equip,bag}};
 root.querySelectorAll('.dnd-bag-item').forEach(item=>{
  item.addEventListener('dragstart',e=>{dragIdx=Number(item.dataset.bagIndex);highlight(dragIdx);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragIdx));item.classList.add('dragging')});
  item.addEventListener('dragend',()=>{item.classList.remove('dragging');clear()});
  item.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;dragIdx=Number(item.dataset.bagIndex);start={x:e.clientX,y:e.clientY};moved=false;item.setPointerCapture?.(e.pointerId)});
  item.addEventListener('pointermove',e=>{if(dragIdx===null||!start||e.pointerType==='mouse')return;const distPx=Math.hypot(e.clientX-start.x,e.clientY-start.y);if(distPx<8&&!moved)return;if(!moved){moved=true;highlight(dragIdx);ghost=document.createElement('div');ghost.className='touch-drag-ghost';ghost.innerHTML=item.querySelector('.backpack-icon')?.innerHTML||'🎒';document.body.appendChild(ghost);window.__t4hSuppressBagClickUntil=Date.now()+700}ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;hoverAt(e.clientX,e.clientY)});
  item.addEventListener('pointerup',e=>{if(dragIdx===null||e.pointerType==='mouse')return;const {equip,bag}=hoverAt(e.clientX,e.clientY),idx=dragIdx;if(moved&&equip&&itemCanGoToSlot(state.player.inventory[idx],equip.dataset.equipDrop)){if(equipIndexToSlot(idx,equip.dataset.equipDrop)){window.__t4hSuppressBagClickUntil=Date.now()+700;clear();renderInventory(root);return}}if(moved&&bag){moveBackpackItemToSlot(idx,Number(bag.dataset.bagPos));window.__t4hSuppressBagClickUntil=Date.now()+700;clear();renderInventory(root);return}clear()});
  item.addEventListener('pointercancel',clear);
 });
 root.querySelectorAll('[data-equip-drop]').forEach(slot=>{
  slot.addEventListener('dragover',e=>{if(dragIdx===null)return;if(itemCanGoToSlot(state.player.inventory[dragIdx],slot.dataset.equipDrop)){e.preventDefault();slot.classList.add('drop-hover')}});
  slot.addEventListener('dragleave',()=>slot.classList.remove('drop-hover'));
  slot.addEventListener('drop',e=>{e.preventDefault();const idx=dragIdx??Number(e.dataTransfer.getData('text/plain'));if(Number.isFinite(idx)&&equipIndexToSlot(idx,slot.dataset.equipDrop)){clear();renderInventory(root)}else clear()});
 });
 bagTargets().forEach(slot=>{
  slot.addEventListener('dragover',e=>{if(dragIdx===null)return;e.preventDefault();slot.classList.add('bag-drop-hover')});
  slot.addEventListener('dragleave',()=>slot.classList.remove('bag-drop-hover'));
  slot.addEventListener('drop',e=>{e.preventDefault();const idx=dragIdx??Number(e.dataTransfer.getData('text/plain'));if(Number.isFinite(idx)){moveBackpackItemToSlot(idx,Number(slot.dataset.bagPos));window.__t4hSuppressBagClickUntil=Date.now()+400;clear();renderInventory(root)}else clear()});
 });
}
function openInventoryItem(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);openModal(`<div class="modal-head"><div><h2>${itemIconVisual(d.id,'shop-item-svg')} ${itemName(i)}</h2><div class="muted">${inventoryItemEquippedSlot(i)?'Wyposażenie':`Plecak • ${inventoryUsedSlots()}/${inventoryCapacity()}`}${isStackable(i.id)?` • stos ${(i.qty||1)}/${stackLimit(i.id)}`:''}</div></div><button class="close" data-close>×</button></div>${inventoryCard(i,idx)}`);const root=document.querySelector('.modal-back');root?.querySelector('[data-equip]')?.addEventListener('click',()=>{closeModal();equipIndex(idx)});root?.querySelectorAll('[data-equip-slot]').forEach(b=>b.addEventListener('click',()=>{closeModal();if(equipIndexToSlot(idx,b.dataset.equipSlot))refresh()}));root?.querySelector('[data-unequip]')?.addEventListener('click',()=>{closeModal();unequipItem(i.uid)});root?.querySelector('[data-use]')?.addEventListener('click',()=>{closeModal();useItem(i.id)});root?.querySelector('[data-salvage]')?.addEventListener('click',()=>{closeModal();salvageIndex(idx)})}
function setStatusHTML(){const counts=activeSetCounts(),fmtSet=(obj)=>Object.entries(obj||{}).map(([k,v])=>`${k==='power'?'ATK':k==='armor'?'Pancerz':'Kryt'} +${v}${k==='crit'?'%':''}`).join(' • ');const rows=Object.entries(SET_BONUSES).filter(([id,b])=>(counts[id]||0)>0||b.classId===state.player.class).sort((a,b)=>(a[1].level||0)-(b[1].level||0)).map(([id,b])=>{const n=counts[id]||0;return `<div class="set-card ${n>=2?'active':''}"><b>⚜️ ${b.name}</b><span>${n} części • bonus od 2/3</span><small>2 części: ${fmtSet(b.two)||'—'}<br>3 części: ${fmtSet(b.three)||'—'}</small></div>`}).join('');return rows?`<div class="set-strip">${rows}</div>`:''}
function slotLabel(slot){return ({weapon:'Broń główna',helmet:'Hełm',armor:'Pancerz',gloves:'Rękawice',legs:'Spodnie',boots:'Buty',amulet:'Amulet',ring1:'Pierścień I',ring2:'Pierścień II',offhand:classOffhandLabel(),ring:'Pierścień'})[slot]||slot}
function inventoryEquipButtons(d,idx){if(state.player.class==='berserker'&&isOneHandedWeapon(d))return `<button class="secondary" data-equip-slot="weapon">⚔️ Ręka główna</button><button class="secondary dual-wield-action" data-equip-slot="offhand">🪓 Druga ręka <small>45% obrażeń</small></button>`;return `<button class="secondary" data-equip="${idx}">Załóż</button>`}
function inventoryCard(i,idx){const d=itemDef(i.id),eqSlot=Object.entries(state.player.equipped).find(([,x])=>x?.uid&&x.uid===i.uid)?.[0],eq=!!eqSlot,qty=i.qty||1,up=i.upgrade||0,details=[d.damage?`Obrażenia ${d.damage[0]}–${d.damage[1]}`:'',d.power&&!d.damage?`ATK +${d.power+up*2}`:'',d.armor?`Pancerz +${d.armor+up*2}`:'',d.crit?`Kryt +${d.crit+up}%`:'',...[['str','Siła'],['agi','Zręczność'],['int','Inteligencja'],['vit','Witalność'],['lck','Szczęście']].map(([key,label])=>d[key]?`${label} +${d[key]}`:''),d.ammo?`Amunicja: ${itemDef(d.ammo).name}`:'',d.build?`Build: ${d.build}`:'',itemCombatPerkText(d.id)?`◆ ${itemCombatPerkText(d.id)}`:''].filter(Boolean).join(' • '),mods=[i.affix?.name?`✨ Afiks: ${i.affix.name}`:'',i.enchant?.name?`🔮 ${i.enchant.name}: ${enchantEffectText(i.enchant)}`:'',i.rune?`${itemDef(i.rune).icon} ${itemDef(i.rune).name}: ${runeEffectText(i.rune)}`:'',d.set?`⚜️ ${SET_BONUSES[d.set]?.name||d.set}`:''].filter(Boolean);return `<div class="item-card rarity-card-${d.rarity}"><div class="item-top"><div class="item-icon">${itemIconVisual(d.id,'inventory-item-svg')}</div><div><b class="rarity-${d.rarity}">${itemName(i)}${qty>1?` ×${qty}`:''}</b><div class="tiny">${rarityName(d.rarity)}${d.reqLevel?` • wymagany lvl ${d.reqLevel}`:''} • ${d.slot?slotLabel(d.slot):d.type}${details?` • ${details}`:''}${d.classes?`<br>Klasa: ${itemClassNames(d)}`:''}</div>${mods.length?`<div class="item-mods">${mods.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div></div>${eq?`<div class="equipped-tag">ZAŁOŻONE: ${slotLabel(eqSlot)}</div>`:''}<div class="tabs" style="margin-top:8px">${d.slot?(eq?`<button class="secondary" data-unequip="${i.uid}">Zdejmij</button>`:inventoryEquipButtons(d,idx)):''}${d.type==='consumable'?`<button class="secondary" data-use="${d.id}">Użyj</button>`:''}${d.slot&&!eq?`<button class="ghost" data-salvage="${idx}">♻️ Rozbierz</button>`:''}</div>${d.value>0&&!eq?`<div class="inventory-sell-note">🪙 Sprzedaż tego przedmiotu jest dostępna u kupca w mieście.</div>`:''}</div>`}
function rarityName(r){return ({common:'Zwykły',uncommon:'Niezwykły',rare:'Rzadki',epic:'Unikatowy',heroic:'Heroiczny',legendary:'Legendarny'})[r]||r}
function unequipItem(uidv){const slot=Object.entries(state.player.equipped||{}).find(([,x])=>x?.uid===uidv)?.[0];if(!slot)return false;if(!inventoryHasRoom()){toast('Plecak jest pełny — najpierw zwolnij miejsce.');return false}const i=equippedInstance(slot),bagSlot=firstFreeBackpackSlot(i);state.player.equipped[slot]=null;if(i&&bagSlot>=0)i.bagSlot=bagSlot;playSfx('equip');save();refresh();toast(`Zdjęto: ${i?itemName(i):slotLabel(slot)}`);return true}
function equipIndex(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);if(d.reqLevel&&state.player.level<d.reqLevel)return toast(`Wymagany poziom ${d.reqLevel}.`);if(!itemClassAllowed(d))return toast(`${d.name}: tylko ${itemClassNames(d)}.`);let slot=d.slot;if(!slot)return;if(slot==='ring')slot=!state.player.equipped.ring1?'ring1':!state.player.equipped.ring2?'ring2':'ring1';if(equipIndexToSlot(idx,slot))refresh()}
function salvageIndex(idx){const i=state.player.inventory[idx];if(!i)return;const equipped=Object.values(state.player.equipped).some(x=>x?.uid&&x.uid===i.uid);if(equipped)return toast('Najpierw zdejmij przedmiot.');const d=itemDef(i.id);if(!d.slot)return toast('Rozebrać można tylko element wyposażenia.');const y=salvageYield(i),drops=[{id:'scrap',qty:y.scrap},...(y.shards?[{id:'runeShard',qty:y.shards}]:[]),...(y.crystal?[{id:'crystal',qty:y.crystal}]:[])];if(!canReceiveItems(drops,{},i.uid))return toast('Zwolnij miejsce na materiały. Przedmiot zachowano.');state.player.inventory.splice(idx,1);addItem('scrap',y.scrap);if(y.shards)addItem('runeShard',y.shards);if(y.crystal)addItem('crystal',y.crystal);ensureEconomyState();state.economy.totalSalvaged++;save();refresh();toast(`Rozebrano ${d.name}: +${y.scrap} 🔩${y.shards?` • +${y.shards} 🔹`:''}${y.crystal?' • +1 💎':''}`)}
function useItem(id){
 const d=itemDef(id),p=state.player;if(!countItem(id))return;
 const key=d.heal?'hp':d.mana?'mana':null,max=key==='hp'?p.maxHp:p.maxMana,amount=d.heal||d.mana;
 if(!key)return toast('Tego przedmiotu nie można teraz użyć.');
 if(p[key]>=max)return toast(key==='hp'?'Masz pełne zdrowie.':'Masz pełną manę.');
 const restored=Math.min(amount,max-p[key]);p[key]+=restored;removeItem(id);toast(`+${restored} ${key==='hp'?'HP':'many'}`);save();refreshTopbar();refresh();
}

function sellIndex(idx,qty=1,rerender=true){const i=state.player.inventory[idx];if(!i)return null;if(inventoryItemEquippedSlot(i)){toast('Najpierw zdejmij przedmiot.');return null}const d=itemDef(i.id),available=i.qty||1,amount=isStackable(i.id)?Math.max(1,Math.min(available,Number(qty)||1)):1,price=itemSellValue(i)*amount;state.player.gold+=price;if(available>amount)i.qty=available-amount;else state.player.inventory.splice(idx,1);ensureEconomyState();state.economy.totalSold+=amount;save();if(rerender)refresh();toast(`Sprzedano: ${d.name}${amount>1?` ×${amount}`:''} • +${price} 🪙`);return {id:d.id,name:d.name,amount,price}}

function questStepState(q,step,index){
 const prog=state.quests.progress[q.id]||[];const cur=prog[index]||0;const target=questStepNeed(step);
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
 if(tutorialLocksStory()){
  const t=tutorialInfo(),pct=Math.round((state.tutorial.stage/TUTORIAL_STEPS.length)*100);
  el.innerHTML=`<div class="tutorial-only-journal"><section class="tutorial-only-hero"><span class="eyebrow">NAJPIERW PODSTAWY</span><h2>🎓 Samouczek</h2><p>Zanim rozpoczniesz główny wątek fabularny, gra przeprowadzi Cię przez mapę, walkę, ekwipunek, umiejętności i karczmę.</p><div class="tutorial-only-progress"><div><i style="width:${pct}%"></i></div><b>${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}</b></div></section>${tutorialJournalHTML()}<section class="quests-locked-preview"><div class="locked-quest-icon">🔒</div><div><b>Zadania jeszcze zablokowane</b><p>Po ukończeniu ostatniego kroku samouczka automatycznie rozpocznie się pierwszy quest fabularny.</p></div></section></div>`;
  bindTutorialControls(el);return;
 }
 const active=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean),done=state.quests.done.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean).slice().reverse(),contracts=(state.adventure.bounties||[]).filter(b=>b.accepted&&!b.claimed);
 const selectable=[...active,...done];state.ui.questFocus ||= selectable[0]?.id||null;if(state.ui.questFocus&&!selectable.some(q=>q.id===state.ui.questFocus))state.ui.questFocus=selectable[0]?.id||null;
 const focus=QUESTS.find(q=>q.id===state.ui.questFocus);
 el.innerHTML=`<div class="quest-journal-23"><section class="quest-journal-side"><div class="journal-summary"><div><b>${active.length}</b><span>Fabularne</span></div><div><b>${contracts.length}</b><span>Kontrakty</span></div><div><b>${done.length}</b><span>Ukończone</span></div></div>${tutorialJournalHTML()}<div class="quest-section-label">AKTYWNE</div><div class="quest-list">${active.map(questHTML).join('')||'<div class="journal-empty">Brak aktywnych zadań fabularnych.</div>'}</div>${contracts.length?`<div class="quest-section-label">KONTRAKTY</div><div class="bounty-list-23">${contracts.map(b=>`<div class="bounty-card-23"><div><b>${b.icon} ${b.name}</b><small>${bountyTargetName(b)} • ${b.progress||0}/${b.need}</small></div><div class="quest-mini-bar"><i style="width:${Math.min(100,(b.progress||0)/b.need*100)}%"></i></div><div class="bounty-reward">${b.xp} XP • ${b.gold} 🪙 • ${b.rep} rep.</div>${(b.progress||0)>=b.need?`<button class="secondary" data-claim-bounty="${b.id}">Odbierz</button>`:`<button class="ghost" data-show-bounty="${b.id}">Pokaż cel na mapie</button>`}</div>`).join('')}</div>`:''}${done.length?`<details class="completed-quests"><summary>Ukończone (${done.length})</summary><div class="quest-list">${done.slice(0,12).map(questHTML).join('')}</div></details>`:''}</section><section class="quest-journal-main">${questDetailHTML(focus)}${storyProfileHTML()}</section></div><div class="quest-limit-note">Samouczek nie zajmuje miejsca. Maksymalnie ${activeTaskLimit()} aktywnych zadań i kontraktów.</div>`;
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
 openModal(`<div class="bestiary-modal"><div class="modal-head"><div><span class="eyebrow">BESTIARIUSZ</span><h2>${m.name}</h2><div class="muted">${m.family}${m.rank&&m.rank!=='Zwykły'?` • ${m.rank}`:''}${m.role?` • rola: ${m.role}`:''} • poziom ${m.min}${m.max!==m.min?`–${m.max}`:''}</div></div><button class="close" data-close>×</button></div><div class="bestiary-detail"><div class="bestiary-hero-art">${monsterVisual(m.id,'bestiary-modal-sprite')}</div><div><div class="bestiary-stat-grid"><span><b>${kills}</b> pokonanych</span><span><b>${m.weak||'—'}</b> słabość</span><span><b>${m.zone}</b> strefa</span><span><b>${m.xp}</b> bazowe XP</span></div><p>${monsterLore(m)}</p><div class="monster-habitats"><h3>📍 Miejsca występowania</h3><div>${places.map(place=>`<span>${place}</span>`).join('')}</div></div><div class="bestiary-loot"><h3>🎒 Możliwe łupy</h3><p class="muted">Szanse bazowe. Elity i bossowie mogą zwiększać ilość lub szansę materiałów.</p>${monsterLootHTML(m)}</div><div class="lore-tip">Dorian: ${tavernAnecdote()}</div></div></div>${monsterVariantProgressHTML(m)}</div>`)
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
 shop:{title:'Sklep kupiecki',npc:'Selma',role:'Kupcowa',classId:'hunter',bg:'assets/backgrounds/interior-shop-3997.webp',quote:'„Towar musi mieć cenę. Dobra rada czasem jest gratis.”'},
 smith:{title:'Kuźnia Ragora',npc:'Ragor',role:'Kowal i runmistrz',classId:'berserker',bg:'assets/backgrounds/interior-smith-3997.webp',quote:'„Dobra stal ma duszę. Zła ma tylko cenę.”'},
 alchemist:{title:'Pracownia Ilyry',npc:'Ilyra',role:'Alchemiczka',classId:'mage',bg:'assets/backgrounds/interior-alchemist-3997.webp',quote:'„Rośliny mówią. Trzeba tylko wiedzieć, kiedy nie przeszkadzać.”'},
 auction:{title:'Dom handlowy',npc:'Varo',role:'Licytator',classId:'ranger',bg:'assets/backgrounds/interior-auction-3997.webp',quote:'„Każdy przedmiot ma wartość. Pytanie brzmi: dla kogo?”'},
 guild:{title:'Sala gildii',npc:'Edrin',role:'Mistrz Gildii',classId:'knight',bg:'assets/backgrounds/interior-guild-3998.webp',quote:'„Siła to nie tylko miecz. To ludzie, którzy wracają po swoich.”'}
};

function cityProgressHTML(){ensureCityState();return `<section class="city-progress-panel"><div class="section-title"><div><span class="eyebrow">ROZWÓJ MIASTA</span><h3>Inwestycje Dębogrodu</h3><p class="muted">Rozbudowa budynków daje stałe premie do usług.</p></div><span class="pill">${Object.values(state.city.buildings).reduce((a,b)=>a+b,0)}/${BUILDINGS.length*CITY_MAX_LEVEL}</span></div><div class="city-upgrade-grid">${BUILDINGS.map(b=>{const lvl=buildingLevel(b.id),rule=CITY_UPGRADE_RULES[b.id],cost=cityUpgradeCost(b.id),unlocked=buildingUnlock(b.id).ok;return `<article class="city-upgrade-card ${lvl>=CITY_MAX_LEVEL?'maxed':''} ${unlocked?'':'locked'}"><div class="city-upgrade-head"><span>${rule?.icon||b.icon}</span><div><b>${b.name}</b><small>Poziom ${lvl}/${CITY_MAX_LEVEL}</small></div></div><p>${cityUpgradeEffect(b.id,lvl)}</p>${lvl<CITY_MAX_LEVEL&&unlocked?`<button class="secondary" data-city-upgrade="${b.id}">Ulepsz → ${lvl+1} • ${cost.gold} 🪙 + ${cost.scrap} 🔩</button>`:lvl>=CITY_MAX_LEVEL?'<button disabled>Poziom maksymalny</button>':`<button disabled>🔒 ${buildingUnlock(b.id).reason}</button>`}</article>`}).join('')}</div></section>`}
const CITY_MAP_SPOTS={
 tavern:{x:17,y:22},shop:{x:49,y:21},smith:{x:82,y:23},
 alchemist:{x:17,y:70},auction:{x:49,y:73},guild:{x:82,y:70}
};
const CITY_MAP_ZOOMS=[.7,1,1.25,1.5];
function renderTown(el){
 setAmbient('town');ensureCityState();
 const cl=climate(),distance=Math.round(cityDistance());
 const cityStatus=!state.city.placed?'Wybierz bezpieczne miejsce i postaw miasto, używając aktualnego GPS.':mobileCityServices()?(insideCity()?`Jesteś w obszarze miasta (${distance} m od centrum). Aktualny GPS odblokowuje usługi.`:`Usługi działają na telefonie w promieniu ${CITY_RADIUS} m od miasta. Pozostało ${Math.max(0,distance-CITY_RADIUS)} m.`):`Miasto ma na mapie własny obszar o promieniu ${CITY_RADIUS} m.`;
 const canMove=state.city.placed&&Date.now()-state.city.placedAt>=CITY_MOVE_COOLDOWN;
 const cityPlacement=(!state.city.placed||canMove)&&SAVE_KEY!==DEMO_SAVE_KEY?`<button class="secondary city-place-button" data-city-place>${state.city.placed?'📍 Przenieś miasto tutaj':'📍 Postaw miasto tutaj'}</button>`:'';
 const zoom=CITY_MAP_ZOOMS.includes(Number(state.ui.cityZoom))?Number(state.ui.cityZoom):1;
 const availableWidth=Number(el?.clientWidth)||Number(window.innerWidth)||1100;
 const boardWidth=Math.round(Math.max(980,Math.min(1400,availableWidth-36))*zoom);
 const buildingHTML=BUILDINGS.map(b=>{
  const spot=CITY_MAP_SPOTS[b.id],unlocked=buildingUnlock(b.id),level=buildingLevel(b.id);
  return `<button type="button" class="city-map-hotspot ${unlocked.ok?'':'city-map-locked'}" style="--spot-x:${spot.x}%;--spot-y:${spot.y}%" data-building="${b.id}" aria-label="${b.name} • poziom ${level}${unlocked.ok?'':` • zablokowane: ${unlocked.reason}`}" title="${b.name}${unlocked.ok?'':` • ${unlocked.reason}`}" ${unlocked.ok?'':'disabled'}><span class="city-map-pin">${unlocked.ok?b.icon:'🔒'}</span><span class="city-map-plaque"><b>${b.name}</b><small>${unlocked.ok?`Poziom ${level} • wejdź`:`${unlocked.reason}`}</small></span></button>`;
 }).join('');
 el.innerHTML=`<div class="city-hub-shell city-atlas-shell"><div class="city-hub-hero"><div><span class="eyebrow">DĘBOGRÓD</span><h2>Miasto bohaterów</h2><p>${cl.icon} ${cl.weather} • ${cl.phase}. Dotknij budynku, aby wejść do środka.</p><div class="city-range-status">🏰 ${cityStatus}</div>${cityPlacement}</div><div class="city-hub-seal">⚜️</div></div><section class="city-atlas-panel" aria-label="Plan miasta"><header class="city-atlas-toolbar"><div><b>Plan miasta</b><small>Przesuń planszę palcem lub wybierz budynek z listy</small></div><div class="city-zoom-controls"><button type="button" data-city-zoom="out" aria-label="Oddal miasto" ${zoom===CITY_MAP_ZOOMS[0]?'disabled':''}>−</button><span>${Math.round(zoom*100)}%</span><button type="button" data-city-zoom="in" aria-label="Przybliż miasto" ${zoom===CITY_MAP_ZOOMS.at(-1)?'disabled':''}>+</button></div></header><div class="city-map-viewport" data-city-map-viewport tabindex="0" aria-label="Interaktywna mapa miasta, którą można przesuwać"><div class="city-map-stage" data-city-map-stage style="width:${boardWidth}px"><img src="assets/backgrounds/city-map-3995.webp" alt="Ilustrowany plan miasta: karczma, sklep, kuźnia, alchemik, dom aukcyjny i sala gildii" draggable="false">${buildingHTML}</div></div><nav class="city-map-shortcuts" aria-label="Wybierz budynek na planie">${BUILDINGS.map(b=>`<button type="button" data-city-focus="${b.id}">${b.icon} ${b.name}</button>`).join('')}</nav></section>${cityProgressHTML()}</div>`;
 el.querySelectorAll('[data-building]:not(:disabled)').forEach(b=>b.onclick=()=>openBuilding(b.dataset.building,'scene'));
 el.querySelector('[data-city-place]')?.addEventListener('click',placeCityHere);
 el.querySelectorAll('[data-city-upgrade]').forEach(b=>b.onclick=()=>upgradeCityBuilding(b.dataset.cityUpgrade));
 el.querySelectorAll('[data-city-focus]').forEach(b=>b.onclick=()=>{
  const spot=CITY_MAP_SPOTS[b.dataset.cityFocus],viewport=el.querySelector('[data-city-map-viewport]'),stage=el.querySelector('[data-city-map-stage]');
  if(!spot||!viewport||!stage)return;
  viewport.scrollTo?.({left:stage.offsetWidth*spot.x/100-viewport.clientWidth/2,top:stage.offsetHeight*spot.y/100-viewport.clientHeight/2,behavior:'smooth'});
  stage.querySelector(`[data-building="${b.dataset.cityFocus}"]`)?.focus({preventScroll:true});
 });
 el.querySelectorAll('[data-city-zoom]').forEach(b=>b.onclick=()=>{
  const current=CITY_MAP_ZOOMS.indexOf(zoom),next=CITY_MAP_ZOOMS[Math.max(0,Math.min(CITY_MAP_ZOOMS.length-1,current+(b.dataset.cityZoom==='in'?1:-1)))];
  if(next===zoom)return;
  const viewport=el.querySelector('[data-city-map-viewport]'),stage=el.querySelector('[data-city-map-stage]');
  const centerX=(viewport.scrollLeft+viewport.clientWidth/2)/(stage.offsetWidth||boardWidth),centerY=(viewport.scrollTop+viewport.clientHeight/2)/(stage.offsetHeight||boardWidth*2/3);
  state.ui.cityZoom=next;save();renderTown(el);
  const target=el.querySelector('[data-city-map-viewport]'),newStage=el.querySelector('[data-city-map-stage]');
  target?.scrollTo?.({left:centerX*newStage.offsetWidth-target.clientWidth/2,top:centerY*newStage.offsetHeight-target.clientHeight/2});
 });
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
   ${hotspots}${sheet}
 </div>`;
}
function tavernBoardHTML(){ensureAdventureState();if(tutorialLocksStory()){const t=tutorialInfo();return `<div class="building-panel parchment-panel"><button class="ghost panel-back" data-building-home>← Wróć do karczmy</button><div class="board-head"><div><span>TABLICA OGŁOSZEŃ</span><h2>📌 Zadania jeszcze czekają</h2></div><b>🔒</b></div><article class="quest-paper tutorial-board-lock"><i></i><span>SAMOUCZEK ${state.tutorial.stage+1}/${TUTORIAL_STEPS.length}</span><h3>${t?.title||'Poznaj podstawy'}</h3><p>Najpierw ukończ samouczek. Po nim tablica odblokuje główną fabułę i kontrakty.</p><button class="primary" data-tutorial-go>${tutorialActionLabel(t)}</button></article></div>`}const story=nextStoryQuestAvailable(),bounties=state.adventure.bounties||[],active=activeTaskCount();return `<div class="building-panel parchment-panel"><button class="ghost panel-back" data-building-home>← Wróć do karczmy</button><div class="board-head"><div><span>TABLICA OGŁOSZEŃ</span><h2>📌 Kartki przypięte do desek</h2></div><b>${active}/${activeTaskLimit()} aktywne</b></div><div class="quest-board">${story?`<article class="quest-paper story-paper"><i></i><span>GŁÓWNY SZLAK • lvl ${story.level}</span><h3>${story.name}</h3><p>${story.desc}</p><strong>${story.xp} XP • ${story.gold} 🪙</strong><button class="secondary" data-accept-story="${story.id}" ${canAcceptTask()?'':'disabled'}>${canAcceptTask()?'Przyjmij':`Limit ${activeTaskLimit()}/${activeTaskLimit()}`}</button></article>`:`<article class="quest-paper"><i></i><h3>Główny wątek jest w toku</h3><p>Kolejne etapy fabuły uruchamiają się automatycznie. Do karczmy nie musisz wracać po każdą część historii.</p></article>`}${bounties.map(b=>`<article class="quest-paper contract-paper ${b.accepted?'accepted-paper':''}"><i></i><span>KONTRAKT DNIA</span><h3>${b.icon} ${b.name}</h3><p>${bountyObjective(b)}. Cel zostanie wygenerowany na mapie po przyjęciu.</p><strong>${b.xp} XP • ${b.gold} 🪙 • ${b.rep} rep.</strong>${b.claimed?'<button disabled>Wykonano</button>':b.accepted?`<button disabled>Przyjęte • ${b.progress||0}/${b.need}</button>`:`<button class="secondary" data-accept-bounty="${b.id}" ${canAcceptTask()?'':'disabled'}>${canAcceptTask()?'Przyjmij':`Limit ${activeTaskLimit()}/${activeTaskLimit()}`}</button>`}</article>`).join('')}</div><div class="quest-board-foot">Samouczek jest osobny i nie zajmuje miejsca w limicie zadań.</div></div>`}
function tavernKeeperHTML(){ensureStaminaCap();const p=state.player,daily=ensureTavernDaily(),st=p.stamina??100,max=p.maxStamina??100,limit=daily.mealUses>=2;return `<div class="building-panel"><button class="ghost panel-back" data-building-home>← Wróć do sali</button>${npcCard('Dorian','Karczmarz • były wojownik','knight','Dorian walczył kiedyś na północy. Zna nawyki potworów, a dziś pilnuje, żeby podróżni wracali na szlak w jednym kawałku.')}<div class="dialogue-bubble">${tavernAnecdote()}</div><div class="stamina-card"><b>⚡ Stamina ${st}/${max}</b><div class="mini-progress"><span style="width:${st/max*100}%"></span></div><small>Posiłki i napitki: ${daily.mealUses}/2 dzisiaj. Każda walka zużywa 3 staminy.</small></div><div class="tavern-menu"><button class="secondary" data-anecdote>🗣️ Kolejna anegdota</button><button class="secondary" data-stamina="10" data-cost="10" data-label="Piwo" ${limit?'disabled':''}>🍺 Piwo • +10 staminy • 10 🪙</button><button class="secondary" data-stamina="25" data-cost="25" data-label="Solidny posiłek" ${limit?'disabled':''}>🍲 Posiłek • +25 • 25 🪙</button><button class="secondary" data-stamina="50" data-cost="50" data-label="Karczemna uczta" ${limit?'disabled':''}>🍗 Uczta • +50 • 50 🪙</button></div></div>`}
function tavernFireplaceHTML(){ensureStaminaCap();const daily=ensureTavernDaily(),cost=Math.min(70,15+state.player.level*3),used=daily.fireplaceUses,blocked=used>=2;return `<div class="building-panel hearth-panel"><button class="ghost panel-back" data-building-home>← Wróć do sali</button><div class="big-hearth">🔥</div><h2>Kominek</h2><p>Siadasz przy ogniu. Ciepło rozluźnia mięśnie, a przez kilka minut świat może poczekać.</p><div class="rest-summary"><span>❤️ Pełne HP</span><span>🔷 Pełna mana</span><span>⚡ +25 staminy</span></div><div class="daily-tavern-limit">Odpoczynki dzisiaj: <b>${used}/2</b></div><button class="primary" data-fire-rest ${blocked?'disabled':''}>${blocked?'Limit wykorzystany':'Odpocznij • '+cost+' 🪙'}</button></div>`}
function buildingServiceHTML(id){const labels={shop:'sklepu',smith:'kuźni',alchemist:'pracowni',auction:'domu aukcyjnego',guild:'sali gildii'};const body=id==='shop'?shopHTML():id==='smith'?smithHTML():id==='alchemist'?alchemistHTML():id==='auction'?auctionHTML():id==='guild'?guildHTML():'';return `<div class="market-service market-${id}"><button class="ghost panel-back" data-building-home>← Wróć do ${labels[id]||'wnętrza'}</button>${body}</div>`}
function buildingTalkHTML(id){const c=CITY_INTERIORS[id];const extra={shop:'Selma słyszy większość plotek od handlarzy, zanim dotrą do karczmy.',smith:'Ragor najpierw ogląda materiał, dopiero potem pyta, co chcesz z niego zrobić.',alchemist:'Ilyra potrafi rozpoznać zioło po zapachu i truciznę po kolorze osadu.',auction:'Varo twierdzi, że na każdą rzecz znajdzie się kupiec — trzeba tylko poczekać.',guild:'Edrin pamięta nazwiska tych, którzy dotrzymują słowa.'}[id]||'Dorian opowiada o dawnych wyprawach.';return `<div class="building-panel"><button class="ghost panel-back" data-building-home>← Wróć do wnętrza</button>${npcCard(c.npc,c.role,c.classId,c.quote)}<div class="dialogue-bubble">${extra}</div>${id==='tavern'?'<button class="secondary" data-building-action="keeper">Porozmawiaj dłużej</button>':`<button class="secondary" data-building-action="service">Przejdź do usług</button>`}</div>`}
function buildingGlobalNavHTML(){return `<nav class="building-global-nav"><button data-building-nav="map">🗺️ <span>Mapa</span></button><button data-building-nav="hero">🛡️ <span>Bohater</span></button><button data-building-nav="town">🏰 <span>Miasto</span></button><button data-building-nav="quests">📜 <span>Zadania</span></button><button data-building-nav="menu">☰ <span>Menu</span></button></nav>`}
function openBuilding(id,view='scene'){
 if(!cityServiceAccess())return;
 const oldModal=document.querySelector('.modal'),keepScroll=view==='service'&&!!oldModal?.querySelector(`.market-${id}`),savedScroll=keepScroll?oldModal.scrollTop:0;
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
 bindBuilding(id,view);if(keepScroll){const next=document.querySelector('.modal');if(next)next.scrollTop=savedScroll}
}

function tavernHTML(){return tavernKeeperHTML()}
function serviceHeroHTML(id,kicker,title,text){const c=CITY_INTERIORS[id];return `<header class="service-hero"><div class="service-merchant">${npcVisual(c.npc,c.classId,'service-merchant-portrait')}</div><div class="service-hero-copy"><span>${kicker} • POZIOM ${buildingLevel(id)}</span><h2>${title}</h2><p>${text}</p></div><div class="service-wallet"><small>Twój mieszek</small><b>🪙 ${state.player.gold}</b><em>${inventoryUsedSlots()}/${inventoryCapacity()} miejsc</em></div></header>`}

const ITEM_COMBAT_PERKS={
 yewBow:{farDamage:.03,label:'+3% obrażeń na DALEKO'},forestBow:{farDamage:.06,label:'+6% obrażeń na DALEKO'},wildBow:{farDamage:.08,label:'+8% obrażeń na DALEKO'},mistBow:{farDamage:.10,label:'+10% obrażeń na DALEKO'},ashBow:{farDamage:.12,label:'+12% obrażeń na DALEKO'},stormBow:{farDamage:.15,label:'+15% obrażeń na DALEKO'},
 ironAxe:{approachDamage:.08,label:'+8% obrażeń po podejściu'},warHammer:{approachDamage:.10,label:'+10% obrażeń po podejściu'},axe:{approachDamage:.12,label:'+12% obrażeń po podejściu'},ravenBlade:{approachDamage:.10,label:'+10% obrażeń po podejściu'},mistBlade:{approachDamage:.12,label:'+12% obrażeń po podejściu'},ashBlade:{approachDamage:.14,label:'+14% obrażeń po podejściu'},stormSpear:{approachDamage:.16,label:'+16% obrażeń po podejściu'},
 emberWand:{farMana:2,label:'−2 many na DALEKO'},arcaneStaff:{farMana:3,label:'−3 many na DALEKO'},mistStaff:{farMana:3,label:'−3 many na DALEKO'},ashStaff:{farMana:4,label:'−4 many na DALEKO'},stormStaff:{farMana:5,label:'−5 many na DALEKO'},
 ironArmor:{closeGuard:.06,label:'−6% obrażeń na BLISKO'},ravenMail:{closeGuard:.08,label:'−8% obrażeń na BLISKO'},mistMail:{closeGuard:.10,label:'−10% obrażeń na BLISKO'},ashMail:{closeGuard:.12,label:'−12% obrażeń na BLISKO'},stormMail:{closeGuard:.14,label:'−14% obrażeń na BLISKO'},
 // 3.9.8.5 — specjalizacje nowych broni
 steelSaber:{blockBonus:3,label:"+3% bloku"},
 watchmanMace:{staggerBonus:4,label:"+4 przełamania"},
 oathSword:{blockBonus:4,label:"+4% bloku"},
 ironVowHammer:{staggerBonus:6,label:"+6 przełamania"},
 bastionBlade:{closeGuard:0.05,label:"−5% obrażeń na BLISKO"},
 guardianSpear:{midDamage:0.08,label:"+8% obrażeń na ŚREDNIO"},
 mistBulwarkSword:{blockBonus:6,label:"+6% bloku"},
 sentinelHammer:{staggerBonus:8,label:"+8 przełamania"},
 ashOathSword:{closeDamage:0.08,label:"+8% obrażeń na BLISKO"},
 ashSentinelHammer:{staggerBonus:10,label:"+10 przełamania"},
 stormHalberd:{midDamage:0.12,staggerBonus:5,label:"+12% na ŚREDNIO • +5 przełamania"},
 stormOathBlade:{blockBonus:7,closeDamage:0.06,label:"+7% bloku • +6% na BLISKO"},
 raiderAxe:{lowHpDamage:0.06,label:"+6% obrażeń poniżej 50% HP"},
 cleaver:{critDamage:0.1,label:"+10% mnożnika krytyka"},
 bloodAxe:{lowHpDamage:0.1,label:"+10% obrażeń poniżej 50% HP"},
 skullHammer:{staggerBonus:7,label:"+7 przełamania"},
 ravenAxe:{critDamage:0.15,label:"+15% mnożnika krytyka"},
 executionerBlade:{lowHpDamage:0.14,label:"+14% obrażeń poniżej 50% HP"},
 mistReaver:{statusDamage:0.08,label:"+8% obrażeń przeciw celom z efektem"},
 breakerMaul:{staggerBonus:10,label:"+10 przełamania"},
 ashReaver:{lowHpDamage:0.18,label:"+18% obrażeń poniżej 50% HP"},
 ashSkullMaul:{staggerBonus:12,label:"+12 przełamania"},
 stormGreatAxe:{critDamage:0.2,label:"+20% mnożnika krytyka"},
 stormBloodBlade:{lowHpDamage:0.22,label:"+22% obrażeń poniżej 50% HP"},
 focusWand:{critDamage:0.08,label:"+8% mnożnika krytyka"},
 sparkRod:{farMana:1,label:"−1 many na DALEKO"},
 frostStaff:{statusDamage:0.06,label:"+6% przeciw celom z efektem"},
 manaRod:{farMana:3,label:"−3 many na DALEKO"},
 emberStaff:{statusDamage:0.08,label:"+8% przeciw celom z efektem"},
 voidWand:{critDamage:0.15,label:"+15% mnożnika krytyka"},
 runeStaff20:{farMana:3,farDamage:0.04,label:"−3 many • +4% na DALEKO"},
 mistWand:{farMana:4,label:"−4 many na DALEKO"},
 frostScepter:{statusDamage:0.1,label:"+10% przeciw celom z efektem"},
 ashWand:{critDamage:0.18,label:"+18% mnożnika krytyka"},
 runicScepter:{farMana:5,label:"−5 many na DALEKO"},
 tempestWand:{farDamage:0.1,label:"+10% obrażeń na DALEKO"},
 stormScepter:{farMana:5,farDamage:0.06,label:"−5 many • +6% na DALEKO"},
 scoutLongbow:{farDamage:0.04,label:"+4% obrażeń na DALEKO"},
 quickBow:{critDamage:0.06,label:"+6% mnożnika krytyka"},
 eagleBow:{critDamage:0.1,label:"+10% mnożnika krytyka"},
 piercingBow:{staggerBonus:5,label:"+5 przełamania"},
 ravenLongbow:{farDamage:0.09,label:"+9% obrażeń na DALEKO"},
 beastmasterBow:{petDamage:0.18,label:"+18% obrażeń chowańca"},
 mistLongbow:{farDamage:0.12,label:"+12% obrażeń na DALEKO"},
 falconBow:{critDamage:0.12,label:"+12% mnożnika krytyka"},
 ashLongbow:{farDamage:0.14,label:"+14% obrażeń na DALEKO"},
 marksmanBow:{critDamage:0.15,label:"+15% mnożnika krytyka"},
 stormLongbow:{farDamage:0.18,label:"+18% obrażeń na DALEKO"},
 skyPiercer:{staggerBonus:9,label:"+9 przełamania"},
 serpentBow:{poisonAmp:0.15,label:"+15% obrażeń trucizny"},
 trailBow:{dodgeBonus:2,label:"+2% uniku"},
 venomBow:{poisonAmp:0.25,label:"+25% obrażeń trucizny"},
 trapperBow:{statusDamage:0.05,staggerBonus:3,label:"+5% na cele z efektem • +3 przełamania"},
 wildVenomBow:{poisonAmp:0.35,label:"+35% obrażeń trucizny"},
 beastBondBow:{petDamage:0.2,label:"+20% obrażeń chowańca"},
 mistVenomBow:{poisonAmp:0.4,label:"+40% obrażeń trucizny"},
 stalkerBow:{dodgeBonus:3,label:"+3% uniku"},
 ashVenomBow:{poisonAmp:0.45,label:"+45% obrażeń trucizny"},
 shadowBow:{statusDamage:0.12,dodgeBonus:2,label:"+12% na cele z efektem • +2% uniku"},
 tempestTrackerBow:{statusDamage:0.15,petDamage:0.12,label:"+15% na cele z efektem • +12% chowaniec"},
 stormSerpentBow:{poisonAmp:0.55,label:"+55% obrażeń trucizny"},
};
function itemCombatPerk(id){return ITEM_COMBAT_PERKS[id]||itemDef(id)?.perk||null}
function itemCombatPerkText(id){return itemCombatPerk(id)?.label||''}
function equippedCombatPerks(){const insts=Object.keys(state.player.equipped||{}).map(equippedInstance).filter(Boolean),out={farDamage:0,midDamage:0,closeDamage:0,approachDamage:0,farMana:0,closeGuard:0,lowHpDamage:0,statusDamage:0,markDamage:0,critDamage:0,staggerBonus:0,blockBonus:0,dodgeBonus:0,poisonAmp:0,bleedAmp:0,petDamage:0};for(const inst of insts){const p=itemCombatPerk(inst.id);if(p)for(const k of Object.keys(out))out[k]=Math.max(out[k],Number(p[k]||0))}for(const inst of insts){for(const src of [inst.enchant?.perk,inst.rune?itemDef(inst.rune)?.perk:null]){if(!src)continue;for(const k of Object.keys(out))out[k]+=Number(src[k]||0)}}return out}
function combatSkillManaCost(skill){if(!skill)return 0;let cost=Number(skill.mana||0);const perk=equippedCombatPerks();if(state.player.class==='mage'&&combatDistance()===2&&perk.farMana)cost=Math.max(0,cost-perk.farMana);return cost}
function combatGearDamageMultiplier(){const perk=equippedCombatPerks(),d=combatDistance();let m=1;if(d===2&&perk.farDamage)m*=1+perk.farDamage;if(d===1&&perk.midDamage)m*=1+perk.midDamage;if(d===0&&perk.closeDamage)m*=1+perk.closeDamage;if(combatIsMeleeClass()&&combat.approachBuffTurns>0&&perk.approachDamage)m*=1+perk.approachDamage;if(state.player.hp<=state.player.maxHp*.5&&perk.lowHpDamage)m*=1+perk.lowHpDamage;if((combat.poisonTurns||combat.bleedTurns||combat.burnTurns||combat.freezeTurns||combat.debuffTurns)&&perk.statusDamage)m*=1+perk.statusDamage;if(combat.markTurns>0&&perk.markDamage)m*=1+perk.markDamage;return m}
function combatIncomingGearMultiplier(){const perk=equippedCombatPerks(),gear=combatDistance()===0&&perk.closeGuard?1-perk.closeGuard:1;return gear*raidIncomingMultiplier()}
function itemStatsHTML(d){const stats=[];if(d.damage)stats.push(`⚔️ ${d.damage[0]}–${d.damage[1]}`);if(d.armor!==undefined)stats.push(`🛡️ ${d.armor}`);if(d.power)stats.push(`✦ +${d.power} mocy`);if(d.crit)stats.push(`🎯 +${d.crit}%`);for(const [key,label] of [['str','Siła'],['agi','Zręczność'],['int','Inteligencja'],['vit','Witalność'],['lck','Szczęście']])if(d[key])stats.push(`${label} +${d[key]}`);if(d.reqLevel)stats.push(`lvl ${d.reqLevel}`);if(d.build)stats.push(`🧩 ${d.build}`);if(d.classGear&&d.setName)stats.push(`⚜️ ${d.setName}`);const perk=itemCombatPerkText(d.id);if(perk)stats.push(`◆ ${perk}`);if(!stats.length)stats.push(d.type==='material'?'Materiał rzemieślniczy':d.type==='ammo'?'Amunicja':'Przedmiot użytkowy');return stats.map(x=>`<span>${x}</span>`).join('')}
function equipmentCompareHTML(id){
 const offered=itemDef(id);if(!offered?.slot)return '';
 const slot=offered.slot==='ring'?'ring1':offered.slot;
 const worn=equippedInstance(slot),current=worn?itemDef(worn.id):null;
 const keys=[['damage','Obrażenia'],['armor','Pancerz'],['power','Moc'],['crit','Krytyk'],['str','Siła'],['agi','Zręczność'],['int','Inteligencja'],['vit','Witalność'],['lck','Szczęście']];
 const number=(d,k)=>k==='damage'?d?.damage?Math.round((d.damage[0]+d.damage[1])/2):0:Number(d?.[k]||0);
 const rows=keys.filter(([k])=>number(offered,k)||number(current,k)).map(([k,label])=>{const old=number(current,k),next=number(offered,k),delta=next-old;return `<div class="equipment-compare-row"><span>${label}</span><b>${current?old:'—'}</b><b>${next}</b><em class="${delta>0?'positive':delta<0?'negative':''}">${delta>0?'+':''}${delta}</em></div>`}).join('');
 const allowed=itemClassAllowed(offered),levelOk=state.player.level>=(offered.reqLevel||1);
 return `<section class="equipment-compare"><h4>Porównanie • ${slotLabel(slot)}</h4><div class="equipment-compare-head"><span>Cecha</span><span>${current?current.name:'Puste miejsce'}</span><span>${offered.name}</span><span>Zmiana</span></div>${rows||'<p>Brak cech liczbowych.</p>'}${!allowed||!levelOk?`<p class="comparison-warning">${!allowed?'Niezgodne z klasą. ':''}${!levelOk?`Wymagany poziom ${offered.reqLevel}.`:''}</p>`:''}</section>`
}
function marketItemCardHTML(id,price,action,button='Kup',badge='Towar Selmy',sold=false){const d=itemDef(id),affordable=state.player.gold>=price,room=canReceiveItems([{id,qty:1}]);return `<article class="market-card rarity-frame-${d.rarity}"><div class="market-card-top"><span class="market-badge">${badge}</span><span class="rarity-${d.rarity}">${rarityName(d.rarity)}</span></div><div class="market-product"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><h3>${d.name}</h3><div class="market-stats">${itemStatsHTML(d)}</div></div></div><footer><div class="market-price"><small>Cena</small><b>${price} 🪙</b></div><button class="secondary market-buy" ${action} ${affordable&&room&&!sold?'':'disabled'}>${sold?'Wyprzedane':!room?'Pełny plecak':affordable?button:'Za mało złota'}</button></footer></article>`}
function recipeCardHTML(r,verb){const d=itemDef(r.result),fee=craftFee(r),ingredients=Object.entries(r.ingredients),ready=ingredients.every(([id,q])=>countItem(id)>=q)&&state.player.gold>=fee;return `<article class="recipe-card rarity-frame-${d.rarity}"><div class="recipe-output"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><span>${r.qty>1?`${r.qty}× `:''}${rarityName(d.rarity)}</span><h3>${r.name}</h3><div class="recipe-kind">${recipeCategory(r)}${d.reqLevel?` • lvl ${d.reqLevel}`:''}</div><div class="market-stats">${itemStatsHTML(d)}</div>${r.note?`<div class="recipe-note">${r.note}</div>`:''}</div></div><div class="ingredient-tray">${ingredients.map(([id,q])=>{const have=countItem(id),ok=have>=q;return `<span class="${ok?'ready':'missing'}" title="${itemDef(id).name} • masz ${have}">${itemIconVisual(id,'ingredient-icon')} ${q} <small>/${have}</small></span>`}).join('')}</div>${ingredientSourcesHTML(r)}<footer><div class="market-price"><small>Opłata</small><b>${fee} 🪙</b></div><button class="secondary market-buy" data-craft="${r.id}" ${ready?'':'disabled'}>${ready?verb:'Brakuje składników'}</button></footer></article>`}
function ingredientSourcesHTML(r){return `<details class="ingredient-sources"><summary>Gdzie zdobyć składniki?</summary>${Object.keys(r.ingredients).map(id=>`<p><b>${itemDef(id).name}:</b> ${materialSourceLabel(id)}</p>`).join('')}</details>`}
function sectionTitleHTML(icon,title,note){return `<div class="service-section-title"><span>${icon}</span><div><h3>${title}</h3><small>${note}</small></div></div>`}

function ensureShopUiState(){state.ui=state.ui||{};if(!state.ui.shopPage)state.ui.shopPage='3';if(typeof state.ui.shopClassOnly!=='boolean')state.ui.shopClassOnly=true;if(!state.ui.shopMode)state.ui.shopMode='buy'}
const MERCHANT_REFRESH_MS=6*60*60*1000;
function merchantCycle(now=Date.now()){return Math.floor(now/MERCHANT_REFRESH_MS)}
function merchantRefreshLabel(now=Date.now()){const minutes=Math.ceil((MERCHANT_REFRESH_MS-now%MERCHANT_REFRESH_MS)/60000);return `${Math.floor(minutes/60)} godz. ${minutes%60} min`}
function ensureMerchantStockState(s=state){
 ensureEconomyState(s);const cycle=merchantCycle();
 if(s.economy.merchantCycle!==cycle){s.economy.merchantCycle=cycle;s.economy.merchantSold={shop:{},smith:{}}}
 s.economy.merchantSold ||= {shop:{},smith:{}};s.economy.merchantSold.shop ||= {};s.economy.merchantSold.smith ||= {};
 return s.economy.merchantSold
}
function merchantSoldOut(id,merchant){return !!itemDef(id).slot&&!!ensureMerchantStockState()[merchant]?.[id]}
function rotatingGear(gear,limit=12){
 const cycle=merchantCycle(),cls=state.player.class,slots=['weapon','armor','helmet','offhand','gloves','boots','legs','amulet','ring'],out=[];
 for(const slot of slots){const rows=gear.filter(d=>d.slot===slot).sort((a,b)=>(b.reqLevel||1)-(a.reqLevel||1)||a.id.localeCompare(b.id));if(!rows.length)continue;
  out.push(rows[0].id);
  if((slot==='weapon'||slot==='armor')&&rows.length>1)out.push(rows[1+(cycle+stableTextSeed(`${cls}:${slot}`))%(rows.length-1)].id)
 }
 return out.slice(0,limit)
}
function shopInventoryPages(){
 ensureShopUiState();const cls=state.player.class,lvl=state.player.level;
 const basics=['potion','manaPotion','herb','scrap',...(['hunter','ranger'].includes(cls)?['primitiveArrow']:[])];
 const gearPool=Object.values(ITEMS).filter(d=>d.slot&&(!state.ui?.shopClassOnly||itemClassAllowed(d,cls))
  &&d.rarity==='common'&&!d.bossUnique&&!d.classGear
  &&!/^(drop_|boss_|end_|craft_|mat_)/.test(d.id)
  &&(d.reqLevel||1)<=lvl+5&&(d.reqLevel||1)>=Math.max(1,lvl-12))
  .sort((a,b)=>(a.reqLevel||1)-(b.reqLevel||1)||a.name.localeCompare(b.name,'pl'));
 const gear=rotatingGear(gearPool);
 const all=[...basics,...gear.filter(id=>!basics.includes(id))];return {1:basics,2:gear,3:all}
}
function smithStockIds(){
 const cls=state.player.class,lvl=state.player.level;
 const gear=Object.values(ITEMS).filter(d=>d.merchantStock&&d.classes?.includes(cls)&&['common','uncommon','rare'].includes(d.rarity)&&(d.reqLevel||1)<=lvl+5&&(d.reqLevel||1)>=Math.max(1,lvl-18));
 return rotatingGear(gear,4)
}
function smithOfferPrice(id){return Math.max(1,Math.ceil((itemDef(id).value||1)*ECONOMY.shopMarkup*(1-cityDiscount('smith'))))}
function currentShopStockIds(){ensureShopUiState();const pages=shopInventoryPages();let ids=(pages[state.ui.shopPage]||pages[3]).slice();if(state.ui.shopClassOnly){ids=ids.filter(id=>{const d=itemDef(id);return !d.classes||itemClassAllowed(d)})}return ids}
function shopSelectionState(){ensureShopUiState();const stock=currentShopStockIds();const sellEntries=backpackEntries().filter(({item})=>itemDef(item.id).value>0);if(!stock.length)state.ui.shopSelectedBuy=null;else if(!state.ui.shopSelectedBuy||!stock.includes(state.ui.shopSelectedBuy))state.ui.shopSelectedBuy=stock[0];const sellIndices=sellEntries.map(e=>e.index);if(!sellIndices.length)state.ui.shopSelectedSell=null;else if(state.ui.shopSelectedSell==null||!sellIndices.includes(state.ui.shopSelectedSell))state.ui.shopSelectedSell=sellIndices[0];if(state.ui.shopMode==='sell'&&state.ui.shopSelectedSell==null)state.ui.shopMode='buy';return {stock,sellEntries}}
function shopPageLabel(){return ({'1':'Zaopatrzenie','2':'Sprzęt','3':'Cały towar'})[String(state.ui?.shopPage||'3')]||'Cały towar'}
function shopStockGridHTML(items){if(!items.length)return '<div class="retro-grid-empty">Brak towaru w tej kategorii.</div>';return items.map(id=>{const d=itemDef(id),selected=state.ui.shopMode!=='sell'&&state.ui.shopSelectedBuy===id,price=merchantBuyPrice(id),sold=merchantSoldOut(id,'shop');return `<button class="retro-shop-slot ${selected?'selected':''} ${sold?'merchant-sold-out':''} rarity-frame-${d.rarity}" data-shop-select-buy="${id}" data-price="${price}" title="${d.name} • ${sold?'Wyprzedane':price+' 🪙'}"><span class="retro-shop-slot-icon">${itemIconVisual(d.id,'shop-item-svg')}</span>${sold?'<small>WYPRZEDANE</small>':''}</button>`}).join('')}
function retroSelectedBuyPanel(){const id=state.ui.shopSelectedBuy;if(!id)return `<div class="retro-tray muted-slot">Brak wyboru</div>`;const d=itemDef(id),price=merchantBuyPrice(id),room=canReceiveItems([{id,qty:1}]),ok=state.player.gold>=price&&room;return `<div class="retro-tray filled ${ok?'ready':''}"><div class="retro-tray-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><b>${d.name}</b><small>${rarityName(d.rarity)} • ${price} 🪙</small></div></div>`}
function retroSellGridHTML(entries){if(!entries.length)return '<div class="retro-grid-empty sell-empty">Nie masz przedmiotów na sprzedaż.</div>';return entries.map(({item,index})=>{const d=itemDef(item.id);return `<button class="retro-sell-slot rarity-frame-${d.rarity}" data-shop-select-sell="${index}" data-shop-sell="${index}" title="${itemName(item)}"><span>${itemIconVisual(d.id,'shop-item-svg')}</span>${(item.qty||1)>1?`<i>${item.qty||1}</i>`:''}</button>`}).join('')}
function retroShopSummaryHTML(stock,sellEntries){const mode=state.ui.shopMode||'buy';if(mode==='sell'&&state.ui.shopSelectedSell!=null){const row=sellEntries.find(e=>e.index===state.ui.shopSelectedSell);if(row){const item=row.item,d=itemDef(item.id),qty=item.qty||1,unit=itemSellValue(item);return `<div class="retro-summary-copy"><b>Sprzedaż</b><p>${itemName(item)}${qty>1?` ×${qty}`:''}</p><small>${rarityName(d.rarity)} • ${d.slot?slotLabel(d.slot):d.type}</small></div><div class="retro-summary-stats"><span>Prof: —</span><span>LVL: ${d.reqLevel||1}</span><span>Cena: ${unit} 🪙${qty>1?` / szt.`:''}</span></div><div class="retro-summary-totals"><em class="minus">0</em><em class="plus">+${unit}</em><em class="net">${qty>1?`Stos: ${unit*qty} 🪙`:''}</em></div>`}}const id=state.ui.shopSelectedBuy||stock[0];if(!id)return `<div class="retro-summary-copy"><b>Sklep</b><p>Brak towaru.</p></div>`;const d=itemDef(id),price=merchantBuyPrice(id);return `<div class="retro-summary-copy"><b>Kupno</b><p>${d.name}</p><small>${itemStatsHTML(d).replace(/<span>|<\/span>/g,'').replace(/<[^>]+>/g,' • ')}</small></div><div class="retro-summary-stats"><span>Prof: ${d.classes?itemClassNames(d):'Wsz.'}</span><span>LVL: ${d.reqLevel||1}</span><span>Cena: ${price} 🪙</span></div><div class="retro-summary-totals"><em class="minus">-${price}</em><em class="plus">0</em><em class="net">${state.player.gold>=price?'Gotowe do zakupu':'Za mało złota'}</em></div>${equipmentCompareHTML(id)}`}
function retroShopButtonsHTML(sellEntries,stock){if((state.ui.shopMode||'buy')==='sell'&&state.ui.shopSelectedSell!=null){const row=sellEntries.find(e=>e.index===state.ui.shopSelectedSell);if(row){const item=row.item,qty=item.qty||1;return `<button class="primary retro-accept" data-shop-accept>${qty>1?'Sprzedaj 1':'Sprzedaj'}</button>${qty>1?`<button class="secondary retro-accept-all" data-shop-accept-all>Sprzedaj cały stos</button>`:''}<button class="danger retro-exit" data-building-home>Wyjdź</button>`}}const id=state.ui.shopSelectedBuy||stock[0];if(!id)return `<button class="primary retro-accept" disabled>Akceptuj</button><button class="danger retro-exit" data-building-home>Wyjdź</button>`;const price=merchantBuyPrice(id),room=canReceiveItems([{id,qty:1}]),sold=merchantSoldOut(id,'shop'),ok=state.player.gold>=price&&room&&!sold;return `<button class="primary retro-accept" data-shop-accept ${ok?'':'disabled'}>${sold?'Wyprzedane':!room?'Pełny plecak':state.player.gold>=price?'Kup':'Za mało złota'}</button><button class="danger retro-exit" data-building-home>Wyjdź</button>`}

function shopSellHTML(){
 const entries=backpackEntries().filter(({item})=>itemDef(item.id).value>0);
 if(!entries.length)return `${sectionTitleHTML('🪙','Skup przedmiotów','Nie masz niczego, co kupiec może odkupić')}<div class="service-empty">Plecak nie zawiera przedmiotów na sprzedaż.</div>`;
 return `${sectionTitleHTML('🪙','Skup przedmiotów','Sprzedaż jest możliwa tylko tutaj — przedmioty założone nie są wystawiane')}<div class="shop-sell-grid">${entries.map(({item,index})=>{const d=itemDef(item.id),qty=item.qty||1,unit=itemSellValue(item);return `<article class="shop-sell-card rarity-frame-${d.rarity}"><div class="shop-sell-product"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><b class="rarity-${d.rarity}">${itemName(item)}${qty>1?` ×${qty}`:''}</b><small>${rarityName(d.rarity)} • ${d.slot?slotLabel(d.slot):d.type}</small></div></div><footer><div><small>Cena skupu</small><b>${unit} 🪙${qty>1?' / szt.':''}</b></div><div class="shop-sell-actions"><button class="secondary" data-shop-sell="${index}">Sprzedaj${qty>1?' 1':''}</button>${qty>1?`<button class="ghost" data-shop-sell-all="${index}">Cały stos • ${unit*qty} 🪙</button>`:''}</div></footer></article>`}).join('')}</div>`;
}
function shopSellSheetHTML(idx){const item=state.player.inventory[idx];if(!item||inventoryItemEquippedSlot(item))return '';const d=itemDef(item.id),qty=item.qty||1,unit=itemSellValue(item);return `<div class="shop-sell-sheet-card"><button class="shop-sell-sheet-close" data-shop-sell-close aria-label="Zamknij">×</button><div class="shop-sell-sheet-item"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><small>SPRZEDAŻ</small><b class="rarity-${d.rarity}">${itemName(item)}${qty>1?` ×${qty}`:''}</b><span>${rarityName(d.rarity)} • ${d.slot?slotLabel(d.slot):d.type}</span></div></div><div class="shop-sell-sheet-price"><span>Cena skupu</span><b>${unit} 🪙${qty>1?' / szt.':''}</b>${qty>1?`<em>Cały stos: ${unit*qty} 🪙</em>`:''}</div><div class="shop-sell-sheet-actions"><button class="primary" data-shop-sheet-sell="${idx}">${qty>1?'Sprzedaj 1':'Sprzedaj'}</button>${qty>1?`<button class="secondary" data-shop-sheet-sell-all="${idx}">Sprzedaj cały stos</button>`:''}<button class="ghost" data-shop-sell-close>Anuluj</button></div></div>`}
function closeShopSellSheet(){const sheet=document.querySelector('[data-shop-sell-sheet]');if(sheet){sheet.classList.remove('open');sheet.innerHTML=''}}
function openShopSellSheet(idx){const sheet=document.querySelector('[data-shop-sell-sheet]');if(!sheet)return;const html=shopSellSheetHTML(idx);if(!html)return;sheet.innerHTML=html;sheet.classList.add('open');sheet.querySelectorAll('[data-shop-sell-close]').forEach(b=>b.onclick=closeShopSellSheet);sheet.querySelector('[data-shop-sheet-sell]')?.addEventListener('click',()=>sellAtShopPreserveScroll(idx,1));sheet.querySelector('[data-shop-sheet-sell-all]')?.addEventListener('click',()=>{const item=state.player.inventory[idx];if(item)sellAtShopPreserveScroll(idx,item.qty||1)})}
function refreshShopPreserveScroll(scrollTop=0){openBuilding('shop','service');const next=document.querySelector('.modal');if(next)next.scrollTop=scrollTop}
function sellAtShopPreserveScroll(idx,qty=1){const scroller=document.querySelector('.modal'),scrollTop=scroller?.scrollTop||0,result=sellIndex(idx,qty,false);if(!result)return;ensureShopUiState();state.ui.shopMode='buy';state.ui.shopSelectedSell=null;save();refreshShopPreserveScroll(scrollTop)}
function sellAtShop(idx,qty=1){return sellAtShopPreserveScroll(idx,qty)}
function shopHTML(){const {stock,sellEntries}=shopSelectionState();return `<div class="retro-shop-shell"><div class="retro-shop-banner"><div class="retro-shop-title">Sklep</div><button class="close retro-shop-close" data-building-home title="Wyjdź">×</button></div><div class="retro-shop-awning" aria-hidden="true"></div><div class="retro-shop-body"><section class="retro-shop-left"><div class="retro-shop-grid">${shopStockGridHTML(stock)}</div><div class="retro-shop-left-foot"><b>${shopPageLabel()}</b><small>${state.ui.shopClassOnly?'Tylko przedmioty zgodne z klasą':'Pełna oferta Selmy'} • Nowy towar za ${merchantRefreshLabel()} • Kliknij przedmiot, aby go obejrzeć.</small></div></section><aside class="retro-shop-right"><section class="retro-shop-pane"><h4>Kup</h4>${retroSelectedBuyPanel()}</section><section class="retro-shop-pane"><h4>Sprzedaj</h4><div class="retro-sell-grid">${retroSellGridHTML(sellEntries)}</div></section><div class="retro-shop-pagebar"><button class="${String(state.ui.shopPage)==='1'?'active':''}" data-shop-page="1">1</button><button class="${String(state.ui.shopPage)==='2'?'active':''}" data-shop-page="2">2</button><button class="${String(state.ui.shopPage)==='3'?'active':''}" data-shop-page="3">3</button><button class="retro-options ${state.ui.shopClassOnly?'active':''}" data-shop-options>Opcje</button></div><div class="retro-shop-filters"><span>Twój złoty mieszek: <b>${state.player.gold}</b></span><span>Widok: <b>${shopPageLabel()}</b></span></div><div class="retro-shop-summary">${retroShopSummaryHTML(stock,sellEntries)}</div><div class="retro-shop-actions">${retroShopButtonsHTML(sellEntries,stock)}</div></aside></div><div class="shop-sell-sheet" data-shop-sell-sheet aria-live="polite"></div></div>`}
function smithGearCardHTML(i,runes){const d=itemDef(i.id),up=i.upgrade||0,cap=itemUpgradeCap(i),q=upgradeQuote(i),eq=enchantQuote(i,!!i.enchant),wait=i.enchant?enchantRerollRemaining(i):0,compatible=runes.filter(r=>runeFitsItem(r,i)),costBits=[`${q.gold}🪙`,q.scrap?`${q.scrap}🔩`:'',q.crystal?`${q.crystal}💎`:'',q.shard?`${q.shard}🔹`:''].filter(Boolean).join(' + ');return `<article class="workshop-card rarity-frame-${d.rarity}"><div class="workshop-item"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><span class="rarity-${d.rarity}">${rarityName(d.rarity)}</span><h3>${itemName(i)}</h3><div class="market-stats">${itemStatsHTML(d)}</div></div></div><div class="upgrade-track" aria-label="Poziom ulepszenia">${Array.from({length:cap},(_,x)=>x+1).map(n=>`<i class="${n<=up?'lit':''}"></i>`).join('')}<b>+${up}/${cap}</b></div><div class="socket-line"><span>${i.enchant?`🔮 ${i.enchant.name} • ${enchantEffectText(i.enchant)}`:'◇ Bez zaklęcia'}</span><span>${i.rune?`${itemDef(i.rune).icon} ${itemDef(i.rune).name} • ${runeEffectText(i.rune)}`:'◇ Wolne gniazdo runy'}</span></div><div class="workshop-actions"><button class="secondary" data-upgrade="${i.uid}" ${up>=cap?'disabled':''}>${up>=cap?'Ulepszenie MAX':`⚒️ +${up+1} • ${costBits}`}</button><button class="secondary" data-enchant="${i.uid}" ${wait?'disabled':''}>${i.enchant?(wait?`🔒 Przerzut za ${forgeWaitLabel(wait)}`:`🔮 Przerzuć • ${eq.gold}🪙`):`🔮 Zaklnij • ${eq.gold}🪙`}</button>${!i.rune?(compatible.map(r=>`<button class="ghost rune-button" title="${runeEffectText(r)}" data-socket="${i.uid}" data-rune="${r}" ${countItem(r)?'':'disabled'}>${itemDef(r).icon} ${itemDef(r).name.replace('Runa ','')} (${countItem(r)})</button>`).join('')||'<span class="muted">Brak pasujących run.</span>'):`<button class="ghost" data-unsocket="${i.uid}">↩️ Wyjmij runę</button>`}</div></article>`}
function merchantSellHTML(){
 const entries=backpackEntries().filter(({item})=>itemDef(item.id).value>0);
 return `${sectionTitleHTML('🪙','Sprzedaj przedmioty','Kliknij przedmiot, aby zobaczyć cenę i potwierdzić sprzedaż')}<div class="merchant-sell-grid">${entries.map(({item,index})=>`<button class="merchant-sell-item rarity-frame-${itemDef(item.id).rarity}" data-merchant-select-sell="${index}">${itemIconVisual(item.id,'shop-item-svg')}<span>${itemName(item)}${(item.qty||1)>1?` ×${item.qty}`:''}<small>${itemSellValue(item)} 🪙 / szt.</small></span></button>`).join('')||'<p>Plecak nie zawiera przedmiotów na sprzedaż.</p>'}</div><div class="shop-sell-sheet" data-merchant-sell-sheet aria-live="polite"></div>`
}
function openMerchantSellSheet(id,idx){const sheet=document.querySelector('[data-merchant-sell-sheet]');if(!sheet)return;const html=shopSellSheetHTML(idx);if(!html)return;sheet.innerHTML=html;sheet.classList.add('open');sheet.querySelector('[data-shop-sell-close]')?.addEventListener('click',()=>{sheet.classList.remove('open');sheet.innerHTML=''}) ;sheet.querySelector('[data-shop-sheet-sell]')?.addEventListener('click',()=>{if(sellIndex(idx,1,false))openBuilding(id,'service')});sheet.querySelector('[data-shop-sheet-sell-all]')?.addEventListener('click',()=>{if(sellIndex(idx,state.player.inventory[idx]?.qty||1,false))openBuilding(id,'service')})}
function smithOfferHTML(){
 const cards=smithStockIds().map(id=>{const d=itemDef(id),price=smithOfferPrice(id),sold=merchantSoldOut(id,'smith'),room=canReceiveItems([{id,qty:1}]),funded=state.player.gold>=price;
  return `<article class="market-card smith-stock-card rarity-frame-${d.rarity}"><div class="market-product"><div class="market-product-icon">${itemIconVisual(id,'shop-item-svg')}</div><div><h3>${d.name}</h3><div class="market-stats">${itemStatsHTML(d)}</div></div></div>${equipmentCompareHTML(id)}<footer><div class="market-price"><small>Cena Ragora</small><b>${price} 🪙</b></div><button class="secondary market-buy" data-buy-smith="${id}" ${sold||!room||!funded?'disabled':''}>${sold?'Wyprzedane':!room?'Pełny plecak':funded?'Kup':'Za mało złota'}</button></footer></article>`
 }).join('');
 return `${sectionTitleHTML('⚒️','Gotowy sprzęt klasowy',`Poziom ${state.player.level} • nowa dostawa za ${merchantRefreshLabel()} • po jednej sztuce z oferty`)}<div class="auction-grid smith-stock-grid">${cards||'<div class="service-empty">Brak sprzętu na ten poziom.</div>'}</div>`
}
function smithHTML(){const gear=state.player.inventory.filter(i=>itemDef(i.id).slot),recipes=RECIPES.filter(r=>r.station==='smith'&&itemClassAllowed(itemDef(r.result))).sort(recipeSort),runes=ALL_RUNE_IDS.filter(id=>ITEMS[id]),ownedRunes=runes.reduce((a,id)=>a+countItem(id),0),groups=[['Przetwarzanie','🧱','Surowce z potworów zamieniasz w półprodukty potrzebne do właściwego craftingu.'],['Runy','◆','Runy do specjalizacji buildów.'],['Broń','⚔️','Broń sklepowa i craft-only od lvl 25 do endgame.'],['Ekwipunek','🛡️','Tarcze, pancerze i klasowe elementy rzemieślnicze.']];return `${serviceHeroHTML('smith','KUŹNIA, RUNY I CRAFTING','Warsztat Ragora','Przetwarzaj łupy z potworów, twórz półprodukty, wykuwaj sprzęt klasowy i rozwijaj go runami oraz enchantem.')}<div class="resource-belt"><span>🔩 Złom <b>${countItem('scrap')}</b></span><span>💎 Kryształ <b>${countItem('crystal')}</b></span><span>🔹 Odłamki <b>${countItem('runeShard')}</b></span><span>◆ Gotowe runy <b>${ownedRunes}</b></span><span>🧵 Skóra <b>${countItem('curedLeather')}</b></span><span>⚡ Stop burzy <b>${countItem('stormAlloy')}</b></span></div><div class="merchant-quote">Ragor: „Nie sprzedawaj wszystkiego. Z kości, skór, jadów i rdzeni zrobimy coś, czego sklep nie ma.”</div>${smithOfferHTML()}${sectionTitleHTML('🔥','Obróbka sprzętu',gear.length?'Wybierz przedmiot i operację':'Nie masz sprzętu do obróbki')}<div class="workshop-grid">${gear.map(i=>smithGearCardHTML(i,runes)).join('')||'<div class="service-empty">Przynieś Ragorowi broń albo pancerz znaleziony na szlaku.</div>'}</div>${merchantSellHTML()}${groups.map(([cat,icon,desc])=>{const rows=recipes.filter(r=>recipeCategory(r)===cat);return rows.length?`${sectionTitleHTML(icon,cat,desc)}<div class="recipe-grid">${rows.map(r=>recipeCardHTML(r,cat==='Przetwarzanie'?'Przetwórz':cat==='Runy'?'Wykuj runę':'Wykuj')).join('')}</div>`:''}).join('')}`}

function alchemyCraftCardHTML(r){const d=itemDef(r.result),uses=alchemyRecipeUses(r.id),fee=alchemyCraftFee(r),ingredients=Object.entries(r.ingredients),ready=uses>0&&ingredients.every(([id,q])=>countItem(id)>=q)&&state.player.gold>=fee;return `<article class="recipe-card alchemy-owned ${uses?'':'recipe-locked'} rarity-frame-${d.rarity}"><div class="recipe-output"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><span>${r.qty>1?`${r.qty}× `:''}${rarityName(d.rarity)}</span><h3>${r.name}</h3><div class="recipe-kind">${recipeCategory(r)}</div>${r.note?`<div class="recipe-note">${r.note}</div>`:''}<div class="alchemy-use-badge">📜 Pozostało użyć: <b>${uses}</b></div></div></div><div class="ingredient-tray">${ingredients.map(([id,q])=>{const have=countItem(id),ok=have>=q;return `<span class="${ok?'ready':'missing'}" title="Masz ${have}">${itemIconVisual(id,'ingredient-icon')} ${q} <small>/${have}</small></span>`}).join('')}</div>${ingredientSourcesHTML(r)}<footer><div class="market-price"><small>Warzenie</small><b>${fee} 🪙</b></div><button class="secondary market-buy" data-craft="${r.id}" ${ready?'':'disabled'}>${!uses?'Kup recepturę':ready?'Wytwórz':'Brakuje składników'}</button></footer></article>`}
function alchemyLicenseCardHTML(r){const d=itemDef(r.result),offer=alchemyRecipeOffer(r.id),price=alchemyRecipePrice(r.id),available=state.player.gold>=price;return `<article class="recipe-card alchemy-license rarity-frame-${d.rarity}"><div class="recipe-output"><div class="market-product-icon">${itemIconVisual(d.id,'shop-item-svg')}</div><div><span>📜 ${offer.uses+guildAlchemyExtraUses()} użyć za zakup</span><h3>${r.name}</h3><small>Pozostało: ${alchemyRecipeUses(r.id)}</small></div></div><div class="ingredient-tray">${Object.entries(r.ingredients).map(([id,q])=>`<span title="${itemDef(id).name}">${itemIconVisual(id,'ingredient-icon')} ${q} × ${itemDef(id).name}</span>`).join('')}</div>${ingredientSourcesHTML(r)}<footer><div class="market-price"><small>Receptura</small><b>${price} 🪙</b></div><button class="secondary market-buy" data-buy-alchemy-recipe="${r.id}" ${available?'':'disabled'}>${available?'Kup recepturę':'Za mało złota'}</button></footer></article>`}
function alchemistHTML(){ensureAlchemyState();const recipes=RECIPES.filter(r=>r.station==='alchemist');return `${serviceHeroHTML('alchemist','ALCHEMIK','Kocioł Ilyry','Kup gotowe mikstury albo receptury z ograniczoną liczbą użyć. Własne warzenie jest wyraźnie tańsze.')}<div class="resource-belt alchemy-belt"><span>🌿 Zioło <b>${countItem('herb')}</b></span><span>🌙 Księżycowe <b>${countItem('moonHerb')}</b></span><span>💎 Kryształ <b>${countItem('crystal')}</b></span><span>☠️ Jad <b>${countItem('venomGland')}</b></span></div><div class="merchant-quote alchemy-quote">„Potrzebujesz mikstury od razu — kup. Masz składniki — receptura oszczędzi Ci złota.”</div>${sectionTitleHTML('🧪','Gotowe mikstury',`Pełna oferta • co 6 godzin inna mikstura ma rabat 10% • zmiana za ${merchantRefreshLabel()}`)}<div class="auction-grid alchemy-ready-grid">${ALCHEMY_READY_STOCK.map(row=>marketItemCardHTML(row.id,alchemyReadyPrice(row),`data-buy="${row.id}" data-price="${alchemyReadyPrice(row)}"`,'Kup',row.id===alchemyFeaturedId()?'Promocja 6h':'Gotowa mikstura')).join('')}</div>${sectionTitleHTML('📜','Receptury Ilyry','Każdy zakup dodaje określoną liczbę użyć receptury')}<div class="alchemy-license-grid">${recipes.map(alchemyLicenseCardHTML).join('')}</div>${sectionTitleHTML('⚗️','Twój kocioł','Zużywasz 1 użycie receptury za każde warzenie')}<div class="recipe-grid">${recipes.map(alchemyCraftCardHTML).join('')}</div>${merchantSellHTML()}`}

function ensureAuctionUiState(){state.ui ||= {};state.ui.auctionSelectedIndex ??= null}
function auctionListableEntries(){return backpackEntries().filter(({item})=>itemDef(item.id).value>0)}
function auctionSuggestedUnitPrice(item){const d=itemDef(item.id),base=Math.max(itemSellValue(item)*2,Math.ceil((d.value||1)*.82)),mods=(item.upgrade||0)*8+(item.affix?10:0)+(item.enchant?18:0)+(item.rune?14:0);return Math.max(2,base+mods)}
function auctionListingFee(price,qty=1){return Math.max(1,Math.ceil(Math.max(1,price)*Math.max(1,qty)*(ECONOMY.auctionFee||.03)))}
function auctionSalePayout(listing){return Math.max(1,Math.floor(listing.unitPrice*listing.qty*(1-(ECONOMY.auctionCommission||.07))))}
function auctionTimeLabel(ms){if(ms<=0)return 'zakończona';const min=Math.ceil(ms/60000);if(min<60)return `${min} min`;const h=Math.ceil(min/60);if(h<24)return `${h} godz.`;return `${Math.ceil(h/24)} dni`}
function auctionSaleChance(listing){const fair=Math.max(1,auctionSuggestedUnitPrice(listing.item)),ratio=listing.unitPrice/fair,durationBoost=listing.durationHours>=24?.12:listing.durationHours>=12?.05:-.04;return clamp(.92-(ratio-.7)*.48+durationBoost,.06,.94)}
function processAuctionListings(){ensureEconomyState();let changed=false;const now=Date.now();for(const listing of state.economy.auctionListings){if(listing.status!=='active'||now<listing.endsAt)continue;const roll=seeded(stableTextSeed(listing.id)+Math.floor(listing.endsAt/60000));listing.saleChance=auctionSaleChance(listing);if(roll<listing.saleChance){listing.status='sold';listing.payout=auctionSalePayout(listing);listing.resolvedAt=now;state.economy.auctionSold+=(listing.qty||1)}else{listing.status='expired';listing.resolvedAt=now}changed=true}if(changed)save();return changed}
function auctionSelectedEntry(){ensureAuctionUiState();const entries=auctionListableEntries();if(!entries.length){state.ui.auctionSelectedIndex=null;return null}let row=entries.find(e=>e.index===Number(state.ui.auctionSelectedIndex));if(!row){row=entries[0];state.ui.auctionSelectedIndex=row.index}return row}
function extractAuctionItem(index,qty){const item=state.player.inventory[index];if(!item||inventoryItemEquippedSlot(item))return null;const amount=isStackable(item.id)?Math.max(1,Math.min(item.qty||1,Number(qty)||1)):1;const snapshot=JSON.parse(JSON.stringify(item));snapshot.qty=amount;delete snapshot.bagSlot;if(isStackable(item.id)&&(item.qty||1)>amount)item.qty=(item.qty||1)-amount;else state.player.inventory.splice(index,1);return {item:snapshot,qty:amount}}
function listAuctionItem(index,qty,unitPrice,durationHours){ensureEconomyState();const activeCount=state.economy.auctionListings.filter(x=>x.status==='active').length;if(activeCount>=auctionListingLimit())return toast(`Dom aukcyjny na poziomie ${buildingLevel('auction')} pozwala na ${auctionListingLimit()} aktywne aukcje.`);const row=auctionListableEntries().find(e=>e.index===Number(index));if(!row)return toast('Ten przedmiot nie jest już dostępny w plecaku.');const item=row.item,d=itemDef(item.id),amount=isStackable(item.id)?Math.max(1,Math.min(item.qty||1,Number(qty)||1)):1,price=Math.max(1,Math.floor(Number(unitPrice)||0)),hours=[6,12,24].includes(Number(durationHours))?Number(durationHours):12;if(!price)return toast('Podaj cenę aukcji.');const fee=auctionListingFee(price,amount);if(state.player.gold<fee)return toast(`Wystawienie kosztuje ${fee} 🪙.`);const taken=extractAuctionItem(row.index,amount);if(!taken)return toast('Nie udało się przenieść przedmiotu na aukcję.');state.player.gold-=fee;const now=Date.now(),listing={id:`auc_${now}_${Math.floor(Math.random()*1e6)}`,item:taken.item,qty:taken.qty,unitPrice:price,durationHours:hours,createdAt:now,endsAt:now+hours*3600000,status:'active',fee};state.economy.auctionListings.unshift(listing);ensureAuctionUiState();state.ui.auctionSelectedIndex=null;save();openBuilding('auction','service');toast(`Wystawiono: ${d.name}${amount>1?` ×${amount}`:''} • ${price} 🪙 / szt. • opłata ${fee} 🪙`)}
function returnAuctionListingItem(listing){if(isStackable(listing.item.id)){if(!canReceiveItems([{id:listing.item.id,qty:listing.qty}]))return false;addItem(listing.item.id,listing.qty);return true}if(!inventoryHasRoom())return false;const restored=JSON.parse(JSON.stringify(listing.item));delete restored.bagSlot;state.player.inventory.push(restored);ensureBackpackSlots();save();return true}
function cancelAuctionListing(id){ensureEconomyState();const listing=state.economy.auctionListings.find(x=>x.id===id);if(!listing||listing.status!=='active')return;if(!returnAuctionListingItem(listing))return toast('Zwolnij miejsce w plecaku, aby anulować aukcję.');state.economy.auctionListings=state.economy.auctionListings.filter(x=>x.id!==id);save();openBuilding('auction','service');toast('Aukcja anulowana. Opłata za wystawienie nie podlega zwrotowi.')}
function claimAuctionGold(id){ensureEconomyState();const listing=state.economy.auctionListings.find(x=>x.id===id);if(!listing||listing.status!=='sold')return;const payout=listing.payout||auctionSalePayout(listing);state.player.gold+=payout;state.economy.auctionListings=state.economy.auctionListings.filter(x=>x.id!==id);save();openBuilding('auction','service');toast(`Odebrano ${payout} 🪙 z aukcji.`)}
function claimAuctionItem(id){ensureEconomyState();const listing=state.economy.auctionListings.find(x=>x.id===id);if(!listing||listing.status!=='expired')return;if(!returnAuctionListingItem(listing))return toast('Plecak jest pełny. Zwolnij miejsce i spróbuj ponownie.');state.economy.auctionListings=state.economy.auctionListings.filter(x=>x.id!==id);save();openBuilding('auction','service');toast('Niesprzedany przedmiot wrócił do plecaka.')}
function auctionListingFormHTML(){
 const entries=auctionListableEntries(),row=auctionSelectedEntry(),activeCount=(state.economy?.auctionListings||[]).filter(x=>x.status==='active').length,atLimit=activeCount>=auctionListingLimit();
 if(!entries.length)return `${sectionTitleHTML('📦','Wystaw przedmiot','Przedmiot jest przenoszony z plecaka do domu aukcyjnego')}<div class="service-empty">Nie masz w plecaku niczego, co można wystawić.</div>`;
 const item=row.item,d=itemDef(item.id),max=item.qty||1,suggested=auctionSuggestedUnitPrice(item),note=`Cena za sztukę • 3% opłaty • 7% prowizji • ${activeCount}/${auctionListingLimit()} aktywnych`;
 return `${sectionTitleHTML('📦','Wystaw przedmiot',note)}<div class="auction-listing-form"><label><span>Przedmiot</span><select id="auctionListItem">${entries.map(({item,index})=>`<option value="${index}" ${index===row.index?'selected':''}>${itemName(item)}${(item.qty||1)>1?` ×${item.qty||1}`:''}</option>`).join('')}</select></label><div class="auction-list-preview"><div>${itemIconVisual(item.id,'shop-item-svg')}</div><p><b>${itemName(item)}</b><small>${rarityName(d.rarity)} • sugerowana cena: ${suggested} 🪙 / szt.</small></p></div><div class="auction-list-controls"><label><span>Ilość</span><input id="auctionListQty" type="number" min="1" max="${max}" value="1" ${isStackable(item.id)?'':'disabled'}></label><label><span>Cena / szt.</span><input id="auctionListPrice" type="number" min="1" max="999999" value="${suggested}"></label><label><span>Czas</span><select id="auctionListDuration"><option value="6">6 godzin</option><option value="12" selected>12 godzin</option><option value="24">24 godziny</option></select></label><button class="primary auction-list-submit" data-auction-list ${atLimit?'disabled':''}>${atLimit?'Limit aukcji':'Wystaw na aukcję'}</button></div><small class="auction-local-note">Rynek jest obecnie symulowany lokalnie. Po dodaniu serwera ten sam panel może obsługiwać oferty innych graczy.</small></div>`;
}
function ownAuctionListingsHTML(){ensureEconomyState();processAuctionListings();const list=state.economy.auctionListings;if(!list.length)return `${sectionTitleHTML('📜','Moje aukcje','Aktywne i zakończone oferty')}<div class="service-empty">Nie masz obecnie żadnych wystawionych przedmiotów.</div>`;const now=Date.now();return `${sectionTitleHTML('📜','Moje aukcje',`${list.filter(x=>x.status==='active').length} aktywnych • ${list.filter(x=>x.status==='sold').length} sprzedanych`)}<div class="own-auction-grid">${list.map(l=>{const d=itemDef(l.item.id),total=l.unitPrice*l.qty,chance=Math.round((l.saleChance||auctionSaleChance(l))*100);return `<article class="own-auction-card status-${l.status}"><div class="own-auction-icon">${itemIconVisual(l.item.id,'shop-item-svg')}</div><div class="own-auction-copy"><b>${itemName(l.item)}${l.qty>1?` ×${l.qty}`:''}</b><small>${l.unitPrice} 🪙 / szt. • razem ${total} 🪙</small><em>${l.status==='active'?`Pozostało: ${auctionTimeLabel(l.endsAt-now)} • szansa rynku ~${chance}%`:l.status==='sold'?`Sprzedano • do odbioru ${l.payout||auctionSalePayout(l)} 🪙`:'Nie sprzedano • odbierz przedmiot'}</em></div><div class="own-auction-actions">${l.status==='active'?`<button class="ghost" data-auction-cancel="${l.id}">Anuluj</button>`:l.status==='sold'?`<button class="primary" data-auction-claim-gold="${l.id}">Odbierz złoto</button>`:`<button class="secondary" data-auction-claim-item="${l.id}">Odbierz przedmiot</button>`}</div></article>`}).join('')}</div>`}

function ensureAuctionVendorState(s=state){ensureEconomyState(s);const day=daySeed();if(s.economy.vendorDay!==day){s.economy.vendorDay=day;s.economy.vendorSold=[]}s.economy.vendorSold ||= [];return s.economy.vendorSold}
function auctionOfferIds(){
 const level=state.player.level,cls=state.player.class,day=daySeed();
 return Object.values(ITEMS).filter(d=>d.slot&&itemClassAllowed(d,cls)&&['uncommon','rare'].includes(d.rarity)&&!d.bossUnique&&!d.classGear&&!/^(drop_|boss_|end_|craft_|mat_)/.test(d.id)&&(d.reqLevel||1)<=level+5&&(d.reqLevel||1)>=Math.max(1,level-18))
  .sort((a,b)=>seeded(day*37+stableTextSeed(a.id))-seeded(day*37+stableTextSeed(b.id))).slice(0,8).map(d=>d.id)
}
function auctionOfferPrice(id){const d=itemDef(id),factor=ECONOMY.auctionMin+seeded(daySeed()*11+stableTextSeed(id))*(ECONOMY.auctionMax-ECONOMY.auctionMin);return Math.ceil(d.value*factor)}
function auctionHTML(){
 ensureEconomyState();ensureAuctionUiState();processAuctionListings();const sold=ensureAuctionVendorState(),ids=auctionOfferIds();
 const offers=ids.map((id,i)=>{const d=itemDef(id),price=auctionOfferPrice(id);return `<div class="auction-offer-wrapper" data-auction-offer data-auction-name="${d.name.toLocaleLowerCase('pl')}" data-auction-slot="${d.slot}">${marketItemCardHTML(id,price,`data-auction-buy="${id}" data-price="${price}"`,'Kup ofertę',i===0?'Oferta dnia':`Gablota ${i+1}`,sold.includes(id))}${equipmentCompareHTML(id)}</div>`}).join('');
 return `${serviceHeroHTML('auction','DOM AUKCYJNY','Katalog Vara','Kupuj oferty dnia albo wystaw własne przedmioty na lokalnym rynku.')}<div class="auction-ribbon"><span>🔨 DOM AUKCYJNY</span><b>Oferty Vara + własne aukcje</b><small>Wystawienie 3% • prowizja 7% • limit ${auctionListingLimit()}</small></div>${auctionListingFormHTML()}${ownAuctionListingsHTML()}${sectionTitleHTML('👑','Oferty kupca','Zwykły i rzadki sprzęt dla Twojej klasy • bez unikatów z potworów • jedna sztuka dziennie')}<div class="auction-offer-filters"><input data-auction-search type="search" placeholder="Szukaj nazwy przedmiotu" aria-label="Szukaj w ofertach"><select data-auction-slot aria-label="Filtruj oferty według slotu"><option value="">Wszystkie typy</option><option value="weapon">Broń</option><option value="armor">Pancerz</option><option value="helmet">Hełm</option><option value="offhand">Druga ręka</option><option value="gloves">Rękawice</option><option value="boots">Buty</option><option value="ring">Pierścień</option><option value="amulet">Amulet</option></select></div><div class="auction-grid">${offers||'<div class="service-empty">Brak ofert na Twój poziom.</div>'}</div>`
}
function guildPartyHTML(){ensureSocialState();const members=guildPartyMembers(),size=guildPartySize();return `${sectionTitleHTML('🤝','Drużyna',`Aktualnie ${size}/4 • w wersji online te miejsca zajmą prawdziwi gracze`)}<div class="guild-party-panel"><div class="guild-party-member self"><span>🧙</span><div><b>${state.player.name}</b><small>${CLASSES[state.player.class].name} • lvl ${state.player.level} • TY</small></div></div>${members.map(m=>`<div class="guild-party-member"><span>${m.icon||'⚔️'}</span><div><b>${m.name}</b><small>${CLASSES[m.class]?.name||m.class} • lvl ${m.level||state.player.level} • BOT TESTOWY</small></div></div>`).join('')}${Array.from({length:Math.max(0,4-size)},()=>`<div class="guild-party-member empty"><span>＋</span><div><b>Wolne miejsce</b><small>oczekuje na gracza</small></div></div>`).join('')}</div><div class="guild-party-actions"><button class="secondary" data-party-add-test ${size>=4?'disabled':''}>➕ Dodaj członka testowego</button><button class="ghost" data-party-clear ${members.length?'':'disabled'}>Rozwiąż drużynę testową</button></div><small class="guild-online-note">Obecnie drużyna jest symulowana lokalnie. Struktura walk i slotów jest przygotowana tak, aby później podmienić boty na graczy z serwera.</small>`}
function guildRaidCardHTML(tier){ensureSocialState();const d=raidDef(tier),m=raidMonster(tier),size=guildPartySize(),wins=raidWinsToday(tier),left=Math.max(0,d.daily-wins),level=raidEncounterLevel(tier,m),soloRecommended=raidSoloRecommendedLevel(tier,level),ready=left>0;return `<article class="guild-raid-card tier-${tier}"><div class="guild-raid-mark">${d.icon}</div><div class="guild-raid-copy"><span>${d.label.toUpperCase()} • WYZWANIE</span><h3>${m?.name||d.label} <small>lvl ${level}</small></h3><p>${tier==='legend'?'Możesz wejść solo, ale Legenda jest projektowana tak, by samotne zwycięstwo wymagało dużej przewagi poziomu i bardzo dobrego ekwipunku. Drużyna mocno ułatwia walkę.':'Możesz walczyć sam. Heros jest jednak znacznie silniejszy od zwykłego przeciwnika na tym samym poziomie, więc solo najlepiej wrócić z przewagą poziomu.'}</p><div class="guild-raid-meta"><span>👤 solo: zalecany lvl ${soloRecommended}+</span><span>👥 drużyna: ${d.recommendedParty}</span><span>❤️ HP przy ${size} os.: ×${raidPartyHpMultiplier(tier,size).toFixed(2)}</span><span>🎟️ dziś ${wins}/${d.daily}</span><span>🎁 osobisty drop</span></div></div><button class="primary" data-start-guild-raid="${tier}" ${ready?'':'disabled'}>${!left?'Limit dzienny':size===1?`Spróbuj solo: ${d.label}`:`Walcz: ${d.label} • ${size} os.`}</button></article>`}
function guildDevelopmentHTML(){
 ensureSocialState();if(!state.player.guild)return '';
 const g=guildState(),lvl=guildLevel(),range=guildMonsterAttackRadius(),me=g.contributions[state.player.name]||{gold:0,materials:0},member=guildMemberRankInfo();
 const buildings=Object.entries(GUILD_BUILDING_RULES).map(([id,rule])=>{const bl=guildBuildingLevel(id),cost=guildBuildingCost(id),effect=id==='scout'?`Zasięg walki: ${60+bl*2} m`:id==='forge'?`Rabat kuźni: ${bl*2}%`:id==='alchemist'?`Bonus receptur: +${guildAlchemyExtraUses()} użyć`:id==='expedition'?`Nagrody wypraw: +${bl*3}%`:`Poziom rozwoju: ${bl}/${rule.max}`;return `<article class="guild-building-card"><div class="guild-building-icon">${rule.icon}</div><div class="guild-building-copy"><span>POZIOM ${bl}/${rule.max}</span><h3>${rule.name}</h3><p>${rule.desc}</p><b>${effect}</b><div class="guild-building-pips">${Array.from({length:rule.max},(_,i)=>`<i class="${i<bl?'on':''}"></i>`).join('')}</div></div><div class="guild-building-action">${cost?`<small>${guildCostText(cost)}</small><button class="secondary" data-guild-upgrade="${id}">Ulepsz</button>`:'<b>MAKS.</b>'}</div></article>`}).join('');
 const logs=(g.log||[]).slice(0,6).map(x=>`<div class="guild-log-row"><span>•</span><p>${x.text}</p></div>`).join('')||'<div class="guild-log-empty">Brak wpisów. Pierwsza wpłata rozpocznie historię rozwoju.</div>';
 return `${sectionTitleHTML('🏗️','Rozwój gildii',`Poziom ${lvl} • bonusy działają dla tej postaci w każdym miejscu`)}<div class="guild-development-head"><div><small>GILDIA</small><h3>${state.player.guild}</h3><span>🗼 Zasięg walki z potworami: <b>${range} m</b> / 80 m</span></div><div class="guild-level-seal"><small>LVL</small><b>${lvl}</b></div></div><div class="guild-treasury"><div><small>ZŁOTO</small><b>${g.treasury.gold} 🪙</b></div><div><small>ZŁOM</small><b>${g.treasury.scrap}</b></div><div><small>KRYSZTAŁ</small><b>${g.treasury.crystal}</b></div><div><small>ODŁ. RUN.</small><b>${g.treasury.runeShard}</b></div></div><div class="guild-contribute"><div><b>Twój wkład • ranga ${member.rank}</b><small>${member.kills} zabitych od dołączenia • ${me.gold||0} złota • ${me.materials||0} materiałów</small></div><div class="guild-contribute-actions"><button class="ghost" data-guild-contribute="gold:100">+100 🪙</button><button class="ghost" data-guild-contribute="gold:500">+500 🪙</button><button class="ghost" data-guild-contribute="scrap:1">+1 złom</button><button class="ghost" data-guild-contribute="crystal:1">+1 kryształ</button><button class="ghost" data-guild-contribute="runeShard:1">+1 odł. run.</button></div></div><div class="guild-buildings-grid">${buildings}</div><div class="guild-shared-note">🌐 W wersji online skarbiec, poziomy budynków i historia będą jednym stanem na serwerze dla wszystkich członków. Nie będzie wymagane przebywanie obok siebie.</div><div class="guild-log"><h3>Ostatnie działania</h3>${logs}</div>`
}
function guildContractsHTML(){
 if(!state.player.guild)return '';
 const rows=guildState().contracts.map(c=>{
  const m=MONSTERS.find(x=>x.id===c.target),done=c.progress>=c.need;
  return `<article class="guild-job-card"><div class="guild-job-icon">${m?.icon||'⚔️'}</div><div class="guild-job-copy"><b>${c.name}</b><small>Pokonaj ${c.need}× ${m?.name||'potwora'} • poziom ${m?.min||1}+ • ${c.progress}/${c.need}</small><span>🎁 ${c.xp} XP • ${c.gold} 🪙 • ${c.rep} reputacji</span></div><button class="secondary" ${c.claimed?'disabled':!c.accepted?`data-guild-contract-accept="${c.id}"`:done?`data-guild-contract-claim="${c.id}"`:'disabled'}>${c.claimed?'Odebrano':!c.accepted?'Przyjmij':done?'Odbierz nagrodę':'W trakcie'}</button></article>`
 }).join('');
 return `${sectionTitleHTML('📜','Kontrakty Edrina','Trzy propozycje dziennie • maksymalnie dwa aktywne • przyjęty kontrakt zostaje po zmianie dnia')}<div class="guild-job-list">${rows||'<p>Brak dostępnych kontraktów.</p>'}</div>`
}
function guildRequestsHTML(){
 if(!state.player.guild)return '';
 const g=guildState(),owner=g.ownerName===state.player.name,open=g.requests.filter(x=>!x.completed),history=g.requests.filter(x=>x.completed).slice(0,3);
 const form=owner?`<div class="guild-request-form"><label>Potrzebny łup<select id="guildNeedItem">${GUILD_REQUEST_MATERIALS.map(id=>`<option value="${id}">${itemDef(id).name}</option>`).join('')}</select></label><label>Ile sztuk<select id="guildNeedGoal"><option value="3">3</option><option value="5" selected>5</option><option value="10">10</option></select></label><button class="secondary" data-guild-request-post ${open.length>=3?'disabled':''}>Przypnij zlecenie</button></div>`:'';
 const cards=[...open,...history].map(r=>`<article class="guild-job-card ${r.completed?'guild-job-done':''}"><div class="guild-job-icon">${itemIconVisual(r.itemId,'ingredient-icon')}</div><div class="guild-job-copy"><b>${itemDef(r.itemId).name}</b><small>${r.delivered}/${r.goal} szt. • ${r.completed?'Zakończone':`Wystawił: ${r.creator}`}</small><span>${materialSourceLabel(r.itemId)}</span></div><button class="secondary" ${r.completed?'disabled':!r.accepted?`data-guild-request-accept="${r.id}"`:countItem(r.itemId)>0?`data-guild-request-deliver="${r.id}"`:'disabled'}>${r.completed?'Wykonane':!r.accepted?'Przyjmij':countItem(r.itemId)>0?`Oddaj (${Math.min(countItem(r.itemId),r.goal-r.delivered)})`:'Brak materiału'}</button></article>`).join('');
 return `${sectionTitleHTML('📌','Tablica potrzeb gildii','Założyciel wskazuje łupy • członek przyjmuje zlecenie i oddaje zdobyte materiały')}${form}<div class="guild-job-list">${cards||'<p>Tablica jest pusta. Założyciel może przypiąć pierwszą potrzebę.</p>'}</div><small class="guild-online-note">Postęp tej wersji zapisuje się lokalnie u postaci. Wspólna tablica i zaproszenia między urządzeniami wymagają serwera.</small>`
}
function guildHTML(){ensureSocialState();const rep=state.adventure.reputation||0,member=guildMemberRankInfo(),rec=ensureGuildMembershipProgress(),progress=member.progress;return `${serviceHeroHTML('guild','SALA GILDII','Bractwo Edrina','Podejmuj kontrakty Edrina, zbieraj łupy na potrzeby gildii i rozwijaj własną siedzibę.')}<div class="guild-banner guild-rank-banner rank-${member.rank}"><span>🛡️</span><div><small>RANGA GILDYJNA • POTWORY OD DOŁĄCZENIA</small><h3>${member.rank}</h3><div class="guild-rep-track"><i style="width:${progress}%"></i></div><em>${member.nextRank?`${member.kills} / ${member.nextKills} • następna ranga ${member.nextRank}`:`${member.kills} zabitych • najwyższa ranga SS`}${rec?` • Herosi ${rec.heroKills} • Legendy ${rec.legendKills}`:''}</em></div></div><div class="guild-services"><button class="secondary" data-guild-service="smith">⚒️ Kuźnia gildyjna</button><button class="secondary" data-guild-service="alchemist">⚗️ Alchemik gildyjny</button><button class="secondary" data-guild-service="auction">🔨 Dom aukcyjny</button></div><div class="guild-create-card"><span class="guild-wax">⚜️</span><div><small>${state.player.guild?'TWOJA GILDIA':'ZAŁÓŻ WŁASNĄ GILDIĘ'}</small><h3>${state.player.guild||'Napisz pierwszy rozdział'}</h3><p>${state.player.guild?'Rozwój gildii jest zapisany przy tej postaci. Ranga członka rośnie za potwory zabite od chwili dołączenia do gildii.':'Wybierz nazwę, pod którą będą znane Twoje przyszłe czyny.'}</p>${!state.player.guild?'<div class="guild-name-row"><input id="guildName" placeholder="Nazwa gildii" maxlength="28"><button class="secondary" data-create-guild>Utwórz gildię</button></div>':`<div class="guild-member-line">🛡️ ${state.player.name} • ranga <b>${member.rank}</b> • ${member.kills} zabitych • ${rep} reputacji</div>`}</div></div>${guildContractsHTML()}${guildRequestsHTML()}${guildDevelopmentHTML()}${guildPartyHTML()}${sectionTitleHTML('👑','Herosi i Legendy','Drużyna pomaga, ale nie jest wymagana — solo możesz spróbować na własne ryzyko')}<div class="guild-raids">${guildRaidCardHTML('hero')}${guildRaidCardHTML('legend')}</div>`}

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
 document.querySelectorAll('[data-buy-smith]').forEach(b=>b.onclick=()=>buyItem(b.dataset.buySmith,'smith',smithOfferPrice(b.dataset.buySmith)));
 document.querySelectorAll('[data-merchant-select-sell]').forEach(b=>b.onclick=()=>openMerchantSellSheet(id,Number(b.dataset.merchantSelectSell))); 
 document.querySelectorAll('[data-shop-sell]:not([data-shop-select-sell])').forEach(b=>b.onclick=()=>sellAtShop(Number(b.dataset.shopSell),1));
 document.querySelectorAll('[data-shop-sell-all]').forEach(b=>b.onclick=()=>{const idx=Number(b.dataset.shopSellAll),item=state.player.inventory[idx];sellAtShop(idx,item?.qty||1)});
 document.querySelectorAll('[data-shop-select-buy]').forEach(b=>b.onclick=()=>{ensureShopUiState();state.ui.shopMode='buy';state.ui.shopSelectedBuy=b.dataset.shopSelectBuy;save();openBuilding('shop','service')});
 document.querySelectorAll('[data-shop-select-sell]').forEach(b=>b.onclick=()=>{ensureShopUiState();state.ui.shopMode='sell';state.ui.shopSelectedSell=Number(b.dataset.shopSelectSell);save();openShopSellSheet(Number(b.dataset.shopSelectSell))});
 document.querySelectorAll('[data-shop-page]').forEach(b=>b.onclick=()=>{ensureShopUiState();state.ui.shopPage=String(b.dataset.shopPage);save();openBuilding('shop','service')});
 document.querySelector('[data-shop-options]')?.addEventListener('click',()=>{ensureShopUiState();state.ui.shopClassOnly=!state.ui.shopClassOnly;save();openBuilding('shop','service')});
 document.querySelector('[data-shop-accept]')?.addEventListener('click',()=>{ensureShopUiState();if(state.ui.shopMode==='sell'&&state.ui.shopSelectedSell!=null){sellAtShop(Number(state.ui.shopSelectedSell),1);return}const id=state.ui.shopSelectedBuy;if(id)buyItem(id,'shop',merchantBuyPrice(id))});
 document.querySelector('[data-shop-accept-all]')?.addEventListener('click',()=>{ensureShopUiState();const idx=Number(state.ui.shopSelectedSell);const item=state.player.inventory[idx];if(item)sellAtShop(idx,item.qty||1)});
 document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>upgradeItem(b.dataset.upgrade));
 document.querySelectorAll('[data-enchant]').forEach(b=>b.onclick=()=>enchantItem(b.dataset.enchant));
 document.querySelectorAll('[data-socket]').forEach(b=>b.onclick=()=>socketRune(b.dataset.socket,b.dataset.rune));
 document.querySelectorAll('[data-unsocket]').forEach(b=>b.onclick=()=>unsocketRune(b.dataset.unsocket));
 document.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>craftRecipe(b.dataset.craft));
 document.querySelectorAll('[data-buy-alchemy-recipe]').forEach(b=>b.onclick=()=>buyAlchemyRecipe(b.dataset.buyAlchemyRecipe));
 document.querySelectorAll('[data-auction-buy]').forEach(b=>b.onclick=()=>{buyItem(b.dataset.auctionBuy,'auction',Number(b.dataset.price))});
 document.querySelector('#auctionListItem')?.addEventListener('change',e=>{ensureAuctionUiState();state.ui.auctionSelectedIndex=Number(e.target.value);save();openBuilding('auction','service')});
 document.querySelector('[data-auction-list]')?.addEventListener('click',()=>{const idx=Number(document.querySelector('#auctionListItem')?.value),qty=Number(document.querySelector('#auctionListQty')?.value||1),price=Number(document.querySelector('#auctionListPrice')?.value||0),duration=Number(document.querySelector('#auctionListDuration')?.value||12);listAuctionItem(idx,qty,price,duration)});
 document.querySelectorAll('[data-auction-cancel]').forEach(b=>b.onclick=()=>cancelAuctionListing(b.dataset.auctionCancel));
 document.querySelectorAll('[data-auction-claim-gold]').forEach(b=>b.onclick=()=>claimAuctionGold(b.dataset.auctionClaimGold));
 document.querySelectorAll('[data-auction-claim-item]').forEach(b=>b.onclick=()=>claimAuctionItem(b.dataset.auctionClaimItem));
 const filterAuctionOffers=()=>{const query=(document.querySelector('[data-auction-search]')?.value||'').trim().toLocaleLowerCase('pl'),slot=document.querySelector('[data-auction-slot]')?.value||'';document.querySelectorAll('[data-auction-offer]').forEach(card=>{card.hidden=!!query&&!card.dataset.auctionName.includes(query)||!!slot&&card.dataset.auctionSlot!==slot})};
 document.querySelector('[data-auction-search]')?.addEventListener('input',filterAuctionOffers);
 document.querySelector('[data-auction-slot]')?.addEventListener('change',filterAuctionOffers);
 document.querySelector('[data-create-guild]')?.addEventListener('click',()=>{const n=document.querySelector('#guildName')?.value.trim();if(!n)return;state.player.guild=n.replace(/[<>]/g,'');ensureSocialState();state.social.guild.name=state.player.guild;guildLog(`${state.player.name} zakłada gildię ${state.player.guild}.`);save();openBuilding('guild','service')});
 document.querySelectorAll('[data-guild-service]').forEach(b=>b.onclick=()=>openBuilding(b.dataset.guildService,'service'));
 document.querySelectorAll('[data-guild-contribute]').forEach(b=>b.onclick=()=>{const [kind,amount]=String(b.dataset.guildContribute||'').split(':');contributeGuild(kind,Number(amount))});
 document.querySelectorAll('[data-guild-upgrade]').forEach(b=>b.onclick=()=>upgradeGuildBuilding(b.dataset.guildUpgrade));
 document.querySelectorAll('[data-guild-contract-accept]').forEach(b=>b.onclick=()=>acceptGuildContract(b.dataset.guildContractAccept));
 document.querySelectorAll('[data-guild-contract-claim]').forEach(b=>b.onclick=()=>claimGuildContract(b.dataset.guildContractClaim));
 document.querySelector('[data-guild-request-post]')?.addEventListener('click',()=>postGuildRequest(document.querySelector('#guildNeedItem')?.value,document.querySelector('#guildNeedGoal')?.value));
 document.querySelectorAll('[data-guild-request-accept]').forEach(b=>b.onclick=()=>acceptGuildRequest(b.dataset.guildRequestAccept));
 document.querySelectorAll('[data-guild-request-deliver]').forEach(b=>b.onclick=()=>deliverGuildRequest(b.dataset.guildRequestDeliver));
 document.querySelector('[data-party-add-test]')?.addEventListener('click',addTestPartyMember);
 document.querySelector('[data-party-clear]')?.addEventListener('click',clearTestParty);
 document.querySelectorAll('[data-start-guild-raid]').forEach(b=>b.onclick=()=>{closeModal();startGuildRaid(b.dataset.startGuildRaid)});
}

function buyItem(id,building,forcedPrice){
 if(!ITEMS[id])return;
 const d=itemDef(id),tracked=['shop','smith'].includes(building)&&!!d.slot;
 if(building==='smith'&&!smithStockIds().includes(id))return toast('Tego przedmiotu nie ma w bieżącej dostawie kowala.');
 if(building==='auction'&&(!auctionOfferIds().includes(id)||ensureAuctionVendorState().includes(id)))return toast('Ta oferta Vara nie jest już dostępna.');
 if(tracked&&merchantSoldOut(id,building))return toast('Przedmiot wyprzedany. Następna dostawa za '+merchantRefreshLabel()+'.');
 if(!requireItemRoom([{id,qty:1}]))return;
 const price=building==='smith'?smithOfferPrice(id):building==='auction'?auctionOfferPrice(id):Number.isFinite(forcedPrice)&&forcedPrice>0?forcedPrice:merchantBuyPrice(id);
 if(state.player.gold<price)return toast('Za mało złota.');
 state.player.gold-=price;addItem(id);
 if(tracked&&((building==='smith'&&smithStockIds().includes(id))||(building==='shop'&&currentShopStockIds().includes(id))))ensureMerchantStockState()[building][id]=1;
 if(building==='auction')ensureAuctionVendorState().push(id);
 save();openBuilding(building,'service');toast(`Kupiono: ${d.name} • -${price} 🪙`)
}
function upgradeItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const up=i.upgrade||0,cap=itemUpgradeCap(i);if(up>=cap)return toast(`Ten przedmiot osiągnął limit +${cap}.`);const q=upgradeQuote(i);if(state.player.gold<q.gold)return toast(`Potrzebujesz ${q.gold} złota.`);if(countItem('scrap')<q.scrap)return toast(`Potrzebujesz ${q.scrap}× Żelazny złom.`);if(q.crystal&&countItem('crystal')<q.crystal)return toast(`Potrzebujesz ${q.crystal}× Odłamek kryształu.`);if(q.shard&&countItem('runeShard')<q.shard)return toast(`Potrzebujesz ${q.shard}× Odłamek runiczny.`);state.player.gold-=q.gold;if(q.scrap)removeItem('scrap',q.scrap);if(q.crystal)removeItem('crystal',q.crystal);if(q.shard)removeItem('runeShard',q.shard);i.upgrade=up+1;save();openBuilding('smith','service');toast(`${itemDef(i.id).name} ulepszono do +${i.upgrade} • -${q.gold} 🪙`)}
function enchantItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const reroll=!!i.enchant,wait=reroll?enchantRerollRemaining(i):0;if(wait)return toast(`Przerzut będzie dostępny za ${forgeWaitLabel(wait)}.`);const q=enchantQuote(i,reroll);if(state.player.gold<q.gold)return toast(`Potrzebujesz ${q.gold} złota.`);if(countItem('crystal')<q.crystal)return toast(`Potrzebujesz ${q.crystal}× Odłamek kryształu.`);if(q.shard&&countItem('runeShard')<q.shard)return toast(`Potrzebujesz ${q.shard}× Odłamek runiczny.`);let pool=enchantPoolFor(i);if(i.enchant)pool=pool.filter(x=>x.name!==i.enchant.name);if(!pool.length)return toast('Brak pasujących zaklęć dla tego slotu.');state.player.gold-=q.gold;removeItem('crystal',q.crystal);if(q.shard)removeItem('runeShard',q.shard);i.enchant=JSON.parse(JSON.stringify(pick(pool)));if(reroll){i.enchantRolls=(i.enchantRolls||0)+1;i.enchantRerollAt=Date.now()+ENCHANT_REROLL_COOLDOWN}else{i.enchantRolls=i.enchantRolls||0;i.enchantRerollAt=0}save();openBuilding('smith','service');toast(`${reroll?'Przerzucono':'Zaklęto'}: ${itemDef(i.id).name} • ${i.enchant.name} (${enchantEffectText(i.enchant)})`)}
function socketRune(uidv,runeId){const i=state.player.inventory.find(x=>x.uid===uidv),r=itemDef(runeId);if(!i||i.rune)return;if(!r||r.type!=='rune')return toast('Nieprawidłowa runa.');if(!runeFitsItem(runeId,i))return toast(`${r.name} nie pasuje do slotu ${slotLabel(itemDef(i.id).slot)}.`);if(!countItem(runeId))return toast(`Brakuje: ${r.name}`);removeItem(runeId,1);i.rune=runeId;save();openBuilding('smith','service');toast(`${r.name} została osadzona w ${itemDef(i.id).name}: ${runeEffectText(runeId)}.`)}
function unsocketRune(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i?.rune)return;const cost=30+rarityRank(itemDef(i.id).rarity)*18+(i.upgrade||0)*4;if(state.player.gold<cost)return toast(`Wyjęcie runy kosztuje ${cost} 🪙.`);const rune=i.rune;if(!requireItemRoom([{id:rune,qty:1}]))return;state.player.gold-=cost;i.rune=null;addItem(rune);save();openBuilding('smith','service');toast(`Odzyskano ${itemDef(rune).name} • -${cost} 🪙`)}
function craftRecipe(id){const r=RECIPES.find(x=>x.id===id);if(!r)return;const out=itemDef(r.result);if(out.slot&&!itemClassAllowed(out))return toast(`${out.name}: receptura dla ${itemClassNames(out)}.`);const alchemy=r.station==='alchemist';if(alchemy){ensureAlchemyState();if(alchemyRecipeUses(r.id)<=0)return toast('Najpierw kup tę recepturę u alchemika.')}const fee=alchemy?alchemyCraftFee(r):craftFee(r);for(const [ing,q] of Object.entries(r.ingredients))if(countItem(ing)<q)return toast(`Brakuje: ${q}× ${itemDef(ing).name}`);if(state.player.gold<fee)return toast(`${alchemy?'Warzenie':'Crafting'} kosztuje ${fee} 🪙.`);if(!requireItemRoom([{id:r.result,qty:r.qty||1}],r.ingredients))return;for(const [ing,q] of Object.entries(r.ingredients))removeItem(ing,q);state.player.gold-=fee;if(alchemy)state.alchemy.recipeUses[r.id]=Math.max(0,alchemyRecipeUses(r.id)-1);addItem(r.result,r.qty);save();openBuilding(r.station==='smith'?'smith':'alchemist','service');toast(`${r.station==='smith'?'Wykuto':'Uwarzono'}: ${r.name} • -${fee} 🪙${alchemy?` • receptura ${alchemyRecipeUses(r.id)} użyć`:''}`)}

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


function renderMore(el){ensureCoreState();const soundOn=!!state.settings.masterSound;el.innerHTML=`<div class="section-title"><h2>☰ Menu</h2><span class="pill">Build ${BUILD_VERSION}</span></div><div class="panel-list"><div class="panel-item"><b>🗺️ Mapa i eksploracja</b><div class="muted">Narzędzia mapy są tutaj, żeby ekran rozgrywki został czysty.</div><div class="settings-toggles"><button class="secondary" data-menu-gps>${gpsWatch!==null?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button><button class="secondary" data-menu-center>🎯 Do mnie</button><button class="secondary" data-map-mode>👁️ Widok: ${state.settings.mapMode==='focused'?'Skupiony':'Pełny'}</button><button class="secondary" data-explorer-journal>🧭 Dziennik odkrywcy</button><button class="secondary" data-fast-travel>⚡ Podróż</button></div><details class="menu-map-layers"><summary>Warstwy mapy</summary><div class="settings-toggles">${[['monster','👹 Potwory'],['poi','📌 Miejsca'],['dungeon','🕳️ Lochy'],['event','✨ Eventy'],['biome','🌿 Biomy'],['trail','👣 Ślad']].map(([k,n])=>`<button class="filter-btn ${state.settings.mapFilters[k]?'active':''}" data-filter="${k}">${n}</button>`).join('')}</div></details></div><div class="panel-item"><b>📜 Przygoda</b><div class="muted">Zadania, wydarzenia, wyprawy i bestiariusz są zebrane w jednym dzienniku.</div><div class="settings-toggles"><button class="secondary" data-menu-quests>📜 Questy</button><button class="secondary" data-menu-events>✨ Wydarzenia</button><button class="secondary" data-menu-trips>🧭 Wyprawy</button><button class="secondary" data-menu-bestiary>📖 Bestiariusz</button></div></div><div class="panel-item"><b>🔊 Dźwięk</b><div class="muted">Jeden główny przełącznik wycisza jednocześnie efekty i ambient.</div><div class="settings-toggles"><button class="secondary ${soundOn?'active':''}" data-master-sound>${soundOn?'🔊 Dźwięk: WŁ.':'🔇 Dźwięk: WYŁ.'}</button><button class="secondary" data-haptics>${state.settings.haptics?'📳 Wibracje: WŁ.':'📴 Wibracje: WYŁ.'}</button></div></div><div class="panel-item"><b>🎓 Samouczek</b><div class="muted">Wskazówka pojawia się na mapie i można ją zamknąć bez wyłączania samouczka. Pełny postęp jest w Questach.</div><button class="secondary" data-restart-tutorial>Uruchom od początku</button></div><div class="panel-item mobile-install-card"><b>📲 Time4Heroes na telefonie</b><button class="secondary" data-install-app>${isStandalone()?'✅ Aplikacja zainstalowana':'Zainstaluj na telefonie'}</button></div><div class="panel-item"><b>👥 Postacie</b><div class="muted">Możesz prowadzić maksymalnie 5 niezależnych bohaterów. Aktualnie: slot ${activeCharacterSlot()} • ${state.player.name} (${CLASSES[state.player.class]?.name||state.player.class}, lvl ${state.player.level}).</div><button class="secondary" data-character-manager>Wybierz postać • ${characterCount()}/${CHARACTER_LIMIT}</button></div><div class="panel-item"><b>💾 Zapis gry</b><div class="tabs" style="margin-top:8px"><button class="secondary" data-export>Eksportuj</button><button class="secondary" data-import>Importuj</button><input type="file" id="saveFile" accept="application/json" hidden></div></div><div class="panel-item"><b>${SAVE_KEY===DEMO_SAVE_KEY?'🧪 Osobna przygoda testowa':'📍 Przygoda GPS'}</b><p class="muted">Testy mają osobny zapis. Strzałki i symulacja nocy nie zmieniają postępu przygody GPS.</p><button class="secondary" data-play-mode>${SAVE_KEY===DEMO_SAVE_KEY?'Wróć do przygody GPS':'Otwórz kopię do testów'}</button><button class="secondary" data-night>${state.settings.forceNight?'Wyłącz symulację nocy':'Włącz symulację nocy'}</button></div><div class="panel-item reset-character-card"><b>🗑️ Usuń bieżącą postać</b><div class="muted">Usuwa tylko aktualnie wybraną postać. Pozostałe sloty zostają bez zmian.</div><button class="danger" data-reset-character>Usuń tę postać</button></div></div>`;
 el.querySelector('[data-install-app]')?.addEventListener('click',installPwa);el.querySelector('[data-character-manager]')?.addEventListener('click',openCharacterManager);el.querySelector('[data-export]').onclick=exportSave;el.querySelector('[data-import]').onclick=()=>document.querySelector('#saveFile').click();document.querySelector('#saveFile').onchange=importSave;el.querySelector('[data-play-mode]').onclick=switchPlayMode;el.querySelector('[data-night]').disabled=SAVE_KEY!==DEMO_SAVE_KEY;el.querySelector('[data-night]').onclick=()=>{state.settings.forceNight=!state.settings.forceNight;save();renderMore(el)};el.querySelector('[data-master-sound]').onclick=()=>{toggleMasterSound();renderMore(el)};el.querySelector('[data-haptics]').onclick=()=>{state.settings.haptics=!state.settings.haptics;save();renderMore(el)};el.querySelector('[data-restart-tutorial]').onclick=()=>{state.tutorial={stage:0,complete:false,rewardGiven:true,flags:{},introSeen:true,finishReward:true,mapDismissedStage:-1};hideStoryUntilTutorial();save();selectNav('map')};el.querySelector('[data-reset-character]').onclick=resetCharacter;el.querySelector('[data-menu-gps]').onclick=()=>{toggleGps();setTimeout(()=>{if(currentTab==='menu')renderMore(el)},120)};el.querySelector('[data-menu-center]').onclick=centerMapOnPlayer;el.querySelector('[data-map-mode]').onclick=()=>{state.settings.mapMode=state.settings.mapMode==='focused'?'full':'focused';save();renderMore(el)};el.querySelector('[data-explorer-journal]').onclick=openExplorerJournal;el.querySelector('[data-fast-travel]').onclick=openFastTravel;el.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.settings.mapFilters[b.dataset.filter]=!state.settings.mapFilters[b.dataset.filter];save();renderMore(el)});el.querySelector('[data-menu-quests]').onclick=openQuestView;el.querySelector('[data-menu-events]').onclick=()=>{state.ui.adventureView='events';save();selectNav('adventureHub')};el.querySelector('[data-menu-trips]').onclick=()=>{state.ui.adventureView='trips';save();selectNav('adventureHub')};el.querySelector('[data-menu-bestiary]').onclick=()=>{state.ui.adventureView='bestiary';save();selectNav('adventureHub')}}

function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`time4heroes-${BUILD_VERSION}-${SAVE_KEY===DEMO_SAVE_KEY?'TEST':'GPS'}-save.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
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
 fire:{type:'ogień',stagger:18},elemental:{type:'ogień',stagger:28},meteor:{type:'ogień',stagger:40},frost:{type:'lód',interrupt:true,stagger:34},iceArmor:{type:'lód',stagger:5},frostNova:{type:'lód',interrupt:true,stagger:42},spark:{type:'arkanum',stagger:22},arcaneSurge:{type:'arkanum',stagger:4},arcaneRift:{type:'arkanum',interrupt:true,stagger:45},heal:{type:'leczenie',stagger:0},
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
  frenzy:{icon:'⚔️',name:'Szał bossa',hint:'Dwa szybkie uderzenia. Obrona i blok są tu bardzo cenne.'},
  storySignal:{icon:'📯',name:'Róg alarmowy',hint:'Przerwij umiejętnością albo poświęć turę, by zniszczyć róg. Inaczej wróg zyska przewagę.'},
  storyStrike:{icon:'🛡️',name:'Atak na sojusznika',hint:'Użyj Obrony lub umiejętności PRZERWIJ, aby osłonić postać.'}
 })[intent.type]||{icon:'⚠️',name:'Nieznany zamiar',hint:'Przygotuj się.'};
}
function chooseBossIntent(){
 const phase=combat.bossPhase||1, roll=(combat.enemyTurns+combat.level+combat.monster.id.length)%3;
 if(phase===1)return roll===1?{type:'ward',interruptible:true}:{type:'smash',interruptible:true};
 if(phase===2)return roll===0?{type:'smash',interruptible:true}:roll===1?{type:'hex',interruptible:true}:{type:'ward',interruptible:true};
 return roll===0?{type:'frenzy',interruptible:true}:roll===1?{type:'smash',interruptible:true}:{type:'hex',interruptible:true};
}
const COMBAT_RANGE_LABELS=['BLISKO','ŚREDNIO','DALEKO'];
const ENEMY_COMBAT_PROFILES={
 Natura:{style:'rush',preferred:0,label:'szarżuje do zwarcia'},Owady:{style:'venom',preferred:0,label:'napiera i szuka miejsca na ukąszenie'},Nieumarli:{style:'rush',preferred:0,label:'nieustępliwie skraca dystans'},Zjawy:{style:'ranged',preferred:2,label:'utrzymuje dystans i atakuje energią'},Demony:{style:'teleport',preferred:0,label:'potrafi nagle skrócić dystans'},Żywiołaki:{style:'ranged',preferred:1,label:'rażą z dystansu energią żywiołu'},Ludzie:{style:'tactical',preferred:1,label:'walczy taktycznie'},Bestie:{style:'charge',preferred:0,label:'przygotowuje gwałtowną szarżę'}
};
function enemyCombatProfile(){const m=combat?.monster||{},role=`${m.role||''} ${m.name||''}`.toLowerCase(),base={...(ENEMY_COMBAT_PROFILES[m.family]||ENEMY_COMBAT_PROFILES.Natura)};if(m.family==='Ludzie'&&/mag|zwiadow|łucz|kusz|strzel|kapłan/.test(role))return {...base,style:'ranged',preferred:2,label:'próbuje utrzymać dystans'};if(m.family==='Nieumarli'&&/łucz|archer/.test(role))return {...base,style:'ranged',preferred:2,label:'ostrzał z dystansu'};if(m.family==='Demony'&&/wiedźm|matka|czar|sukk|mistress/.test(role))return {...base,style:'ranged',preferred:2,label:'rzuca zaklęcia z dystansu'};return base}
function enemyCombatStyleHint(){const p=enemyCombatProfile();return `${p.label} • preferuje ${COMBAT_RANGE_LABELS[p.preferred]||'BLISKO'}`}
function enemyRangedAttack(mult=.88,label='ATAK DYSTANSOWY'){const dodge=Math.random()*100<dodgeChance();if(dodge){trialStat('dodges');combat.lastEnemyHit=null;setCombatTaken(0,'UNIK');logCombat(`💨 Unikasz ataku dystansowego: ${combat.monster.name}.`);return 0}const blocked=Math.random()*100<blockChance();if(blocked)trialStat('blocks');const reduction=armorPower()*.30,guardMult=combat.guard>0?.62:1,blockMult=blocked?.58:1,gearMult=combatIncomingGearMultiplier(),dmg=Math.max(1,Math.floor((combat.atk*mult-reduction)*guardMult*blockMult*gearMult));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;setCombatTaken(dmg,blocked?'BLOK':label);logCombat(`${blocked?'🛡️ Blok! ':''}${combat.monster.name} atakuje z dystansu za ${dmg}.`);if(combat.guard>0)combat.guard--;return dmg}

const ENEMY_SPECIAL_ATTACKS={
 Natura:{icon:'🌿',name:'Dziki napór',cost:22,mult:1.28,armor:.28,effect:'push'},
 Owady:{icon:'☠️',name:'Jadowite ukłucie',cost:20,mult:1.08,armor:.24,effect:'weaken'},
 Ludzie:{icon:'⚔️',name:'Technika bojowa',cost:24,mult:1.30,armor:.18,effect:'push'},
 Nieumarli:{icon:'🩸',name:'Wysysanie życia',cost:26,mult:1.12,armor:.24,effect:'leech'},
 Zjawy:{icon:'👻',name:'Drenaż eteru',cost:24,mult:1.02,armor:.12,effect:'manaDrain'},
 Demony:{icon:'🔥',name:'Piekielna eksplozja',cost:30,mult:1.42,armor:.08,effect:'push'},
 Żywiołaki:{icon:'⚡',name:'Fala żywiołu',cost:28,mult:1.32,armor:.12,effect:'push'},
 Bestie:{icon:'🐾',name:'Rozszarpanie',cost:24,mult:1.38,armor:.22,effect:'weaken'}
};
function enemyManaEnabled(){return !!combat&&Number(combat.maxEnemyMana||0)>0}
function regenerateEnemyMana(){
 if(!enemyManaEnabled())return 0;
 const before=combat.enemyMana||0,gain=Math.max(1,combat.enemyManaRegen||8);
 combat.enemyMana=Math.min(combat.maxEnemyMana,before+gain);
 return combat.enemyMana-before;
}
function enemySpecialDef(){return ENEMY_SPECIAL_ATTACKS[combat?.monster?.family]||ENEMY_SPECIAL_ATTACKS.Natura}
function tryEliteRegeneration(){
 if(!combat?.entity?.elite||!enemyManaEnabled()||combat.hp<=0||combat.hp>combat.maxHp*.58||(combat.enemyRegenCooldown||0)>0)return false;
 const cost=30;if(combat.enemyMana<cost)return false;
 const before=combat.hp,heal=Math.max(8,Math.floor(combat.maxHp*.14));combat.hp=Math.min(combat.maxHp,combat.hp+heal);const restored=combat.hp-before;if(!restored)return false;
 combat.enemyMana-=cost;combat.enemyRegenCooldown=4;combat.lastEnemyHit=null;setCombatTaken(0,'REGENERACJA ELITY');logCombat(`💚 ${combat.monster.name} zużywa ${cost} many i regeneruje ${restored} HP.`);playSfx('heal');return true;
}
function tryEnemySpecialAttack(){
 if(!combat||!enemyManaEnabled()||(!combat.questFight&&!combat.entity?.elite&&!combat.worldBoss&&!combat.dungeon?.boss)||(combat.enemySpecialCooldown||0)>0)return false;
 const cadence=combat.entity?.elite?2:3;if(combat.enemyTurns%cadence!==0)return false;
 const def=enemySpecialDef();if(combat.enemyMana<def.cost)return false;
 combat.enemyMana-=def.cost;combat.enemySpecialCooldown=2;combat.fx='enemy';
 const dodge=Math.random()*100<dodgeChance()*.55;if(dodge){trialStat('dodges');combat.lastEnemyHit=null;setCombatTaken(0,def.name.toUpperCase());logCombat(`💨 Unikasz specjalnego ataku: ${def.name}.`);return true}
 const blocked=Math.random()*100<blockChance();if(blocked)trialStat('blocks');const guardMult=combat.guard>0?.52:1,blockMult=blocked?.60:1,freezeMult=combat.freezeTurns>0?.82:1,reduction=armorPower()*(def.armor??.22),mult=(1-combat.debuff)*guardMult*blockMult*freezeMult,dmg=Math.max(1,Math.floor((combat.atk*def.mult-reduction)*mult*combatIncomingGearMultiplier()));
 state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;setCombatTaken(dmg,def.name.toUpperCase());
 let extra='';
 if(def.effect==='weaken'){combat.playerWeaken=Math.max(combat.playerWeaken,.18);combat.playerWeakenTurns=Math.max(combat.playerWeakenTurns,2);extra=' • osłabienie 18%';}
 else if(def.effect==='leech'){const before=combat.hp,heal=Math.max(1,Math.floor(dmg*.55));combat.hp=Math.min(combat.maxHp,combat.hp+heal);extra=` • odzyskuje ${combat.hp-before} HP`;}
 else if(def.effect==='manaDrain'){const drain=Math.min(state.player.mana,Math.max(8,10+Math.floor(combat.level*.6)));state.player.mana-=drain;extra=` • wysysa ${drain} many`;}
 else if(def.effect==='push'&&combatDistance()<2){combat.distance=Math.min(2,combatDistance()+1);extra=` • odrzuca Cię na ${combatDistanceLabel()}`;}
 logCombat(`${def.icon} ${combat.monster.name}: ${def.name} za ${dmg}${blocked?' • blok':''}${extra}.`);if(combat.guard>0)combat.guard--;return true;
}

function combatIsMeleeClass(){return ['knight','berserker'].includes(state.player.class)}
function combatIsRangedClass(){return ['hunter','ranger','mage'].includes(state.player.class)}
function combatDistance(){return clamp(Number(combat?.distance??1),0,2)}
function combatDistanceLabel(){return COMBAT_RANGE_LABELS[combatDistance()]||'ŚREDNIO'}
function combatOffensiveSkill(skill){return !skill||['damage','multi','poison','pet','rage'].includes(skill.kind)}
function combatNeedsClose(skill){return combatIsMeleeClass()&&combatOffensiveSkill(skill)&&combatDistance()>0}
function combatRangeDamageMultiplier(){
 if(!combatIsRangedClass())return 1;
 const d=combatDistance(),cls=state.player.class;
 if(cls==='mage')return d===2?1.05:d===0?.95:1;
 return d===2?1.10:d===0?.88:1;
}
function combatRangeHint(){
 const d=combatDistance(),label=combatDistanceLabel();
 if(combatIsMeleeClass())return d===0?`${label} • możesz atakować wręcz`:`${label} • podejdź, aby atakować wręcz`;
 const bonus=combatRangeDamageMultiplier();return `${label} • atak dystansowy ${bonus>1?`+${Math.round((bonus-1)*100)}% obrażeń`:bonus<1?`−${Math.round((1-bonus)*100)}% obrażeń`:'bez modyfikatora'}`;
}
function markEnemyHpDamage(beforeHp){
 if(!combat)return;const before=clamp(Number(beforeHp||0),0,combat.maxHp),after=clamp(Number(combat.hp||0),0,combat.maxHp);if(before>after)combat.enemyHpGhostFrom=before;
}
function queueCombatVictory(){
 if(!combat)return;if(combat.victoryAnimating)return;combat.hp=0;combat.victoryAnimating=true;combat.phase='victoryDelay';combat.menu='main';combat.enemyVanishing=false;const active=combat,token=++combat.turnToken;save();openCombat();
 setTimeout(()=>{if(combat!==active||combat.turnToken!==token)return;combat.enemyHpGhostFrom=null;combat.enemyVanishing=true;save();openCombat();setTimeout(()=>{if(combat===active&&combat.turnToken===token)winCombat()},420)},650);
}
function combatMove(delta){
 if(!combat||combat.phase!=='player')return;const enemyHpBefore=combat.hp;
 const before=combatDistance(),after=clamp(before+delta,0,2);if(after===before)return;
 resetCombatExchange();combat.distance=after;combat.menu='main';combat.turnDealtNote=after<before?'PODEJŚCIE':'COFNIĘCIE';if(after<before&&after===0&&combatIsMeleeClass()&&equippedCombatPerks().approachDamage)combat.approachBuffTurns=1;
 logCombat(after<before?`👣 Podchodzisz do przeciwnika. Dystans: ${combatDistanceLabel()}.`:`↩️ Cofasz się. Dystans: ${combatDistanceLabel()}.`);if(combat.raidTier)combat.raidPlayerActions=(combat.raidPlayerActions||0)+1;haptic(10);raidPartyAssist();markEnemyHpDamage(enemyHpBefore);if(combat.hp<=0)return queueCombatVictory();queueEnemyTurn(700);
}
function combatCommandMenuHTML(c,p,combatSkills,potionIds,potionTotal,locked){
 const menu=c.menu||'main',distance=combatDistance(),melee=combatIsMeleeClass(),rangeHint=combatRangeHint();
 const back=`<button class="command-back" data-command-back>← Wróć</button>`;
 if(menu==='fight'){
  const basicBlocked=locked||combatNeedsClose(null)||(['hunter','ranger'].includes(p.class)&&!countItem('primitiveArrow'));
  return `<div class="battle-command-panel"><div class="command-panel-head"><div><span>⚔️ WALKA</span><small>${rangeHint}</small></div>${back}</div><div class="skill-hotbar command-fight-grid"><button class="battle-skill basic" data-attack ${basicBlocked?'disabled':''}><span>${['hunter','ranger'].includes(p.class)?'🏹':p.class==='mage'?'🔮':'⚔️'}</span><b>Atak</b><small>${combatNeedsClose(null)?'Podejdź na BLISKO':['hunter','ranger'].includes(p.class)?`➶ ${countItem('primitiveArrow')}`:'+10 przeł.'}</small></button><button class="battle-skill defend-skill" data-defend ${locked?'disabled':''}><span>🛡️</span><b>Obrona</b><small>na 1 turę</small></button>${combatSkills.map(s=>{const meta=combatSkillMeta(s),cd=c.cooldowns?.[s.id]||0,needsClose=combatNeedsClose(s),manaCost=combatSkillManaCost(s),blocked=locked||needsClose||p.mana<manaCost||cd>0||(['hunter','ranger'].includes(p.class)&&countItem('primitiveArrow')<rangedAmmoCost(s));return `<button class="battle-skill ${c.intent&&meta.interrupt?'interrupt-ready':''} ${cd?'skill-cooldown':''}" data-skill="${s.id}" ${blocked?'disabled':''}><span>${skillIconVisual(s.id,'combat-skill-svg')}</span><b>${s.name}</b><small>${needsClose?'Podejdź na BLISKO':cd?`⏳ CD ${cd}`:`${manaCost} many • ${meta.type}${manaCost<s.mana?' • premia sprzętu':''}${meta.interrupt?' • PRZERWIJ':''}`}</small></button>`}).join('')}</div></div>`;
 }
 if(menu==='healTarget'){
  const skill=skillDef(c.pendingHealSkill),manaCost=skill?combatSkillManaCost(skill):0,targets=mageHealTargets();
  return `<div class="battle-command-panel"><div class="command-panel-head"><div><span>✨ ${skill?.name||'UZDROWIENIE'}</span><small>Wybierz żywy cel. Leczenie zużywa turę i ${manaCost} many.</small></div>${back}</div><div class="combat-potion-drawer command-heal-grid">${targets.map(t=>{const full=t.hp>=t.maxHp,blocked=locked||!skill||p.mana<manaCost||t.down||full;return `<button class="combat-potion-option ${t.down?'heal-target-down':''}" data-heal-target="${t.key}" ${blocked?'disabled':''}><span>${t.self?'🧙':'🤝'}</span><b>${t.name}${t.self?' (Ty)':''}</b><small>${t.down?'POWALONY':`HP ${t.hp}/${t.maxHp}${full?' • pełne':''}`}</small></button>`}).join('')}</div></div>`;
 }
 if(menu==='heal')return `<div class="battle-command-panel"><div class="command-panel-head"><div><span>🧪 LECZENIE</span><small>Wybierz miksturę. Użycie zużywa turę.</small></div>${back}</div><div class="combat-potion-drawer command-heal-grid">${potionIds.map(id=>{const d=itemDef(id),full=d.heal?p.hp>=p.maxHp:p.mana>=p.maxMana;return `<button class="combat-potion-option" data-combat-potion="${id}" ${locked||!countItem(id)||full?'disabled':''}><span>${itemIconVisual(id,'combat-item-icon')}</span><b>${id==='manaPotion'?'Mana':id==='strongPotion'?'Duże leczenie':'Leczenie'}</b><small>+${d.heal||d.mana} ${d.mana?'many':'HP'} • ${countItem(id)} szt.</small></button>`}).join('')}</div></div>`;
 if(menu==='position')return `<div class="battle-command-panel"><div class="command-panel-head"><div><span>${melee?'👣 PODEJŚCIE':'🎯 POZYCJA'}</span><small>${rangeHint}</small></div>${back}</div><div class="position-command-grid"><button class="pokemon-command approach" data-range-move="-1" ${locked||distance===0?'disabled':''}><span>→</span><b>Podejdź</b><small>${distance===0?'Już jesteś blisko':melee?'Skróć dystans do ataku':'Skróć dystans'}</small></button><button class="pokemon-command retreat" data-range-move="1" ${locked||distance===2?'disabled':''}><span>←</span><b>Cofnij się</b><small>${distance===2?'Już jesteś daleko':melee?'Zwiększ dystans':'Lepsza pozycja dystansowa'}</small></button><div class="range-track"><span class="${distance===0?'active':''}">BLISKO</span><i></i><span class="${distance===1?'active':''}">ŚREDNIO</span><i></i><span class="${distance===2?'active':''}">DALEKO</span></div></div></div>`;
 return `<div class="battle-command-panel main-command-panel"><div class="command-question"><b>Co zrobisz?</b><span>${rangeHint}</span></div><div class="pokemon-command-grid"><button class="pokemon-command fight" data-command="fight" ${locked?'disabled':''}><span>⚔️</span><b>Walka</b><small>${melee&&distance>0?'Ataki wręcz wymagają BLISKO':'Atak i umiejętności'}</small></button><button class="pokemon-command position" data-command="position" ${locked?'disabled':''}><span>${melee?'👣':'🎯'}</span><b>${melee?'Podejście':'Pozycja'}</b><small>${distance===0?'BLISKO':distance===1?'ŚREDNIO':'DALEKO'}</small></button><button class="pokemon-command heal" data-command="heal" ${locked||!potionTotal?'disabled':''}><span>🧪</span><b>Leczenie</b><small>${potionTotal} mikstur</small></button><button class="pokemon-command flee" data-flee ${locked||c.dungeon||c.raidTier?'disabled':''}><span>🏃</span><b>Ucieczka</b><small>${c.dungeon||c.raidTier?'zablokowana':'70% szans'}</small></button></div>${c.intent?.type==='storySignal'?'<button class="story-disrupt-action" data-story-disrupt>📯 Zniszcz róg • poświęć turę, zatrzymaj alarm</button>':''}</div>`;
}

function startCombat(entity,opts={}){
 if(combat||battleResult)return false;
 ensureStaminaCap();const p=state.player;if(p.stamina<3){toast('⚡ Potrzebujesz 3 staminy, aby rozpocząć walkę. Odpocznij lub zjedz w karczmie.');return false}
 state.ui.gearDrawerOpen=false;
 const m=monsterTemplate(entity),lvl=opts.level??entityMonsterLevel(entity,m),environment=combatEnvironment(m),scale=.66+lvl*.075,isDungeonBoss=!!opts.dungeon?.boss,isWorldBoss=!!opts.worldBoss,questFight=!!opts.storyConsequence,raidTier=opts.raid?.tier||null,isRaid=!!raidTier,curatedBoss=['Elita','Heros','Legenda'].includes(m.rank),isBoss=isWorldBoss||isDungeonBoss||isRaid||!!entity.elite||curatedBoss||!!opts.storyConsequence?.mission,partySize=isRaid?1+(opts.raid?.party?.length||0):1,raidPartyHpMult=isRaid?raidPartyHpMultiplier(raidTier,partySize):1,bossHpMult=isRaid?(raidTier==='legend'?GROUP_RAIDS.legend.hp:GROUP_RAIDS.hero.hp):isDungeonBoss?1.58:isWorldBoss?1.72:m.rank==='Legenda'?2.15:m.rank==='Heros'?1.72:m.rank==='Elita'?1.38:entity.elite?1.38:1,questHpMult=questFight?(lvl<12?1.28:1.75):1,bossAtkMult=isRaid?(raidTier==='legend'?GROUP_RAIDS.legend.atk:GROUP_RAIDS.hero.atk):isDungeonBoss?1.20:isWorldBoss?1.28:m.rank==='Legenda'?1.38:m.rank==='Heros'?1.24:m.rank==='Elita'?1.12:entity.elite?1.12:1,questAtkMult=questFight?1.10:1;
 const levelHpBase=Math.max(m.hp*scale,enemyLevelHpFloor(lvl,m)),levelAtkBase=Math.max(m.atk*(.62+lvl*.045),enemyLevelAtkFloor(lvl,m));
 let maxHp=Math.max(24,Math.floor(levelHpBase*bossHpMult*questHpMult*raidPartyHpMult*enemyHpLevelGapMultiplier(lvl)));if(questFight){const questFloor=attackPower()*(entity.elite?5.5:3.8);maxHp=Math.max(maxHp,Math.floor(questFloor))}const atk=Math.max(4,Math.floor(levelAtkBase*bossAtkMult*questAtkMult*environment.enemyDamage*enemyAtkLevelGapMultiplier(lvl))),maxEnemyMana=isRaid?(raidTier==='legend'?160:130):Math.min(140,isWorldBoss||isDungeonBoss?120:entity.elite?Math.max(78,72+lvl*3):questFight?Math.max(52,48+lvl*2):0),enemyManaRegen=maxEnemyMana?(isRaid?(raidTier==='legend'?14:12):entity.elite?11:8):0;
 p.stamina=Math.max(0,p.stamina-3);
 combat={entity,monster:m,level:lvl,maxHp,hp:maxHp,atk,baseAtk:atk,environment,log:[`⚡ Rozpoczęcie walki: -3 staminy • pozostało ${p.stamina}/${p.maxStamina}.`,`${m.name} staje do walki.`,`${BIOMES[environment.biomeId].icon} ${environment.effect.title}: ${environment.effect.summary}.`],guard:0,debuff:0,debuffTurns:0,poison:0,poisonTurns:0,bleed:0,bleedTurns:0,burn:0,burnTurns:0,freezeTurns:0,mark:0,markTurns:0,dungeon:opts.dungeon||null,worldBoss:isWorldBoss,isBoss,questFight,bossPhase:1,enemyTurns:0,intent:null,maxEnemyMana,enemyMana:maxEnemyMana,enemyManaRegen,enemyRegenCooldown:0,enemySpecialCooldown:0,stagger:0,staggerMax:isBoss?100:0,stunned:0,vulnerableTurns:0,barrier:0,barrierTurns:0,playerWeaken:0,playerWeakenTurns:0,playerCritBuff:0,playerCritBuffTurns:0,playerDodgeBuff:0,playerDodgeBuffTurns:0,playerPowerBuff:0,playerPowerBuffTurns:0,playerBlockBuff:0,playerBlockBuffTurns:0,cooldowns:{},lastPlayerHit:null,lastEnemyHit:null,enemyHpGhostFrom:null,victoryAnimating:false,enemyVanishing:false,turnDealt:null,turnTaken:null,turnDealtNote:'',turnTakenNote:'',damageTakenTotal:0,usedPotion:false,phase:'player',turnToken:0,distance:1,menu:'main',approachBuffTurns:0,storyConsequence:opts.storyConsequence||null,storyMission:opts.storyConsequence?.mission?{...opts.storyConsequence.mission,triggered:false,hits:0,signalRaised:false,signalStopped:false,protected:false}:null,worldEvent:opts.worldEvent||null,raidTier,partyMembers:prepareCombatPartyMembers(opts.raid?.party||[]),raidPartyHpMult,raidPlayerDamage:0,raidPartyDamage:0,raidPlayerActions:0};
 if(questFight&&state.story?.flags?.routeDecoded&&opts.storyConsequence?.qid==='q6'){combat.stagger=24;combat.log.push('🗺️ Nessa wskazuje słaby punkt patrolu: +24 przełamania na starcie.')}
 if(dungeonRun?.id==='forgottenTower'&&state.story?.flags?.towerWard){combat.stagger=25;combat.log.push('ᛟ Odczytana pieczęć ujawnia słaby punkt strażnika: +25 przełamania na starcie.')}
 if(dungeonRun?.id==='forgottenTower'&&state.story?.flags?.northPrisonerFreed){combat.stagger=Math.min(50,combat.stagger+15);combat.log.push('🗝️ Wskazówka ocalonego strażnika: +15 przełamania na starcie.')}
 if(combat.storyMission?.type==='escort'&&state.story?.flags?.patrolWarned)combat.log.push('🛡️ Straż patroluje szlak, dając Ci czas na ochronę towarzyszy.');
 if(combat.storyMission)combat.log.push(`📜 CEL: ${combat.storyMission.type==='escort'?`osłoń ${combat.storyMission.name} przed zapowiadanym ciosem`:`przerwij sygnał: ${combat.storyMission.name}`}.`);
 if(m.variantId!=='normal')combat.log.push(`${m.variantIcon} Odmiana ${m.variantLabel}: HP ×${monsterVariantDef(m.variantId).hp.toFixed(2)}, ATK ×${monsterVariantDef(m.variantId).atk.toFixed(2)}, łup ×${m.variantLoot.toFixed(2)}.`);
 if(entity.tutorialStarter)combat.log.push('🎓 Przeciwnik treningowy lvl 1 — po zwycięstwie pierwsza Próba Klasowa zostanie zaliczona.');
 const levelGap=lvl-p.level;if(levelGap===0)combat.log.push('⚖️ Równy poziom: brak kar za różnicę lvl — wynik zależy od ekwipunku i decyzji.');else if(levelGap>=2)combat.log.push(`⚠️ Przeciwnik ma +${levelGap} poziomów: wyraźnie więcej HP i obrażeń, a Twoje ciosy są słabsze.`);
 if(questFight)combat.log.push(`📜 Przeciwnik questowy: wzmocnione HP${maxEnemyMana?' • własna mana • specjalne ataki':''}.`);
 if(entity.elite&&maxEnemyMana)combat.log.push('⭐ Elita może regenerować HP, odnawia manę i używa silniejszych zdolności.');
 if(isDungeonBoss)combat.log.push('👑 Boss lochu jest wyraźnie silniejszy od zwykłych przeciwników.');
 if(isRaid){const raidSize=1+(combat.partyMembers?.length||0),soloRec=opts.raid?.soloRecommended||raidSoloRecommendedLevel(raidTier,lvl);combat.log.push(`${raidTier==='legend'?'👑 LEGENDA':'⚔️ HEROS'} lvl ${lvl}: ${raidSize===1?`próba SOLO • zalecany lvl solo ${soloRec}+`:`drużyna ${raidSize} os. • HP ×${raidPartyHpMult.toFixed(2)}`} • poziom przeciwnika nie jest uśredniany • osobisty drop.`);}
 save();openCombat();return true;
}
function openCombat(){
 const c=combat,p=state.player;if(!c)return;setAmbient(c.isBoss?'boss':'battle');const cl=climate(),pet=petInstance(),intent=bossIntentInfo(c.intent),resists=(FAMILY_RESISTS[c.monster.family]||[]),locked=c.phase!=='player',phaseLabel=c.phase==='enemyDelay'?'TWÓJ CIOS…':c.phase==='enemyResult'?'PRZECIWNIK ODPOWIADA':'TURA GRACZA',combatSkills=activeCombatSkills(),potionIds=[...new Set(p.inventory.filter(i=>itemDef(i.id).type==='consumable'&&(itemDef(i.id).heal||itemDef(i.id).mana)).map(i=>i.id))].sort((a,b)=>(itemDef(a).heal||itemDef(a).mana)-(itemDef(b).heal||itemDef(b).mana)),potionTotal=potionIds.reduce((n,id)=>n+countItem(id),0),enemyHpPct=100*Math.max(0,c.hp)/Math.max(1,c.maxHp),enemyGhostHp=Math.max(Math.max(0,c.hp),Math.min(c.maxHp,c.enemyHpGhostFrom??Math.max(0,c.hp))),enemyGhostPct=100*enemyGhostHp/Math.max(1,c.maxHp);
 app.innerHTML=`<div class="battle-screen ${c.dungeon?'dungeon-battle':''} theme-${battleTheme(c.monster)} fx-${c.fx||'idle'}"><div class="battle-top"><div><span class="build-chip">WALKA ${BUILD_VERSION}</span><h2>${c.raidTier==='legend'?'👑 Legenda':c.raidTier==='hero'?'⚔️ Heros':c.worldBoss?'🌍 Boss świata':c.dungeon?'🕳️ Komnata lochu':c.storyMission?'📜 Starcie fabularne':'⚔️ Spotkanie w świecie'}</h2></div><div>${c.dungeon&&dungeonRun?`⏱️ <span data-dungeon-timer>${formatClock(dungeonRemainingSec())}</span> • `:''}${cl.icon} ${cl.weather} • ${cl.phase}</div></div><div class="battle-arena" data-distance="${combatDistance()}"><div class="arena-layer layer-back"></div><div class="combatant hero-side ${c.lastEnemyHit?'combat-hit':''}"><div class="combat-name"><b>${p.name}</b><span>${CLASSES[p.class].name} • lvl ${p.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap bigbar"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div class="battle-sprite hero-sprite"><div class="pokemon-back">${battleBackVisual(p.class)}</div><span class="shadow"></span>${c.lastEnemyHit?`<strong class="float-damage hero-damage">-${c.lastEnemyHit}</strong>`:''}</div>${pet?`<div class="battle-pet"><span>${petVisual(pet.id,'sprite-pet')}</span><small>${petDef(pet.id).name} lvl ${pet.level}</small></div>`:''}${c.playerWeakenTurns?`<div class="player-status-chip">⬇️ Osłabienie ${c.playerWeakenTurns}</div>`:''}${c.playerCritBuffTurns?`<div class="player-status-chip buff">🎯 Krytyk +${c.playerCritBuff}%</div>`:''}${c.playerDodgeBuffTurns?`<div class="player-status-chip buff">💨 Unik +${c.playerDodgeBuff}%</div>`:''}${c.playerPowerBuffTurns?`<div class="player-status-chip buff">⚔️ Moc +${c.playerPowerBuff}%</div>`:''}${c.playerBlockBuffTurns?`<div class="player-status-chip buff">🛡️ Blok +${c.playerBlockBuff}%</div>`:''}</div><div class="battle-center"><div class="versus">VS</div><div class="turn-indicator">${phaseLabel}</div><div class="range-indicator">${combatDistanceLabel()}</div>${c.isBoss?`<div class="break-wrap"><small>PRZEŁAMANIE</small><div class="break-bar"><span style="width:${Math.min(100,c.stagger)}%"></span></div><b>${Math.floor(c.stagger)}/${c.staggerMax}</b></div>`:''}</div><div class="combatant enemy-side ${c.lastPlayerHit?'combat-hit':''} ${c.enemyVanishing?'enemy-defeated':''}"><div class="combat-name"><b>${c.entity.elite?'⭐ ':''}${c.monster.name}</b><span>${c.monster.family} • lvl ${c.level}</span></div><div class="battle-bars"><div class="barwrap bigbar enemy-hp-wrap"><div class="bar enemy-hp-loss" style="--ghost-start:${enemyGhostPct}%;--ghost-end:${enemyHpPct}%;width:${enemyGhostPct}%"></div><div class="bar hp enemyhp enemy-hp-current" style="width:${enemyHpPct}%"></div><div class="barlabel">HP ${Math.max(0,c.hp)}/${c.maxHp}</div></div>${c.maxEnemyMana?`<div class="barwrap bigbar enemy-mana-bar"><div class="bar mana" style="width:${100*Math.max(0,c.enemyMana)/c.maxEnemyMana}%"></div><div class="barlabel">MANA ${Math.max(0,Math.floor(c.enemyMana))}/${c.maxEnemyMana}</div></div>`:''}<div class="status-row">${c.poisonTurns?`<span>☠️ Trucizna ${c.poisonTurns}</span>`:''}${c.bleedTurns?`<span>🩸 Krwawienie ${c.bleedTurns}</span>`:''}${c.burnTurns?`<span>🔥 Podpalenie ${c.burnTurns}</span>`:''}${c.freezeTurns?`<span>❄️ Zamrożenie ${c.freezeTurns}</span>`:''}${c.debuffTurns?`<span>⬇️ Osłabienie ${c.debuffTurns}</span>`:''}${c.markTurns?`<span>🎯 Znak ${c.markTurns}</span>`:''}${c.barrierTurns?`<span>🛡️ Bariera ${c.barrierTurns}</span>`:''}${c.vulnerableTurns?`<span>💢 Przełamany</span>`:''}</div></div><div class="battle-sprite enemy-sprite"><div>${monsterVisual(c.monster.id,'sprite-battle')}</div><span class="shadow"></span>${c.lastPlayerHit?`<strong class="float-damage enemy-damage">-${c.lastPlayerHit}</strong>`:''}</div><div class="enemy-meta"><span>ATK ${c.atk}</span><span class="ai-meta">🧠 ${enemyCombatStyleHint()}</span><span class="weak-meta">🎯 ${c.monster.weak||'brak'}</span>${resists.length?`<span class="resist-meta">🧱 ${resists.join(', ')}</span>`:''}</div>${c.isBoss?`<div class="boss-intent ${c.intent?'danger-intent':''}"><b>${intent.icon} ${c.intent?intent.name:'Faza '+c.bossPhase}</b><small>${c.intent?intent.hint:'Zapełnij pasek przełamania, aby ogłuszyć bossa.'}</small></div>`:''}</div></div><div class="battle-bottom"><div class="combat-feedback-column">${combatExchangeHTML()}<details class="combat-log" open><summary>Dziennik walki</summary>${c.log.slice(-7).map(x=>`<div>› ${x}</div>`).join('')}</details></div><div>${combatCommandMenuHTML(c,p,combatSkills,potionIds,potionTotal,locked)}<div class="combat-help"><span>🎯 traf w słabość: +25%</span><span>🧱 odporność: −28%</span><span>💢 100 przełamania = ogłuszenie</span><span>📏 ${combatDistanceLabel()}</span></div></div></div></div>`;
 const battleScreen=document.querySelector('.battle-screen');if(battleScreen){battleScreen.style.setProperty('--battle-bg',`url('${battleBackdrop(c)}')`);for(const cls of battleAtmosphereClass(c).split(' ').filter(Boolean))battleScreen.classList.add(cls)}
 const battleChip=document.querySelector('.battle-top .build-chip');if(battleChip)battleChip.textContent=`WALKA ${BUILD_VERSION}`;
 const contextHost=document.querySelector('.battle-arena');if(contextHost){const banner=document.createElement('div');banner.className='battle-environment-effect';banner.innerHTML=`<span>${BIOMES[c.environment.biomeId].icon}</span><div><b>${BIOMES[c.environment.biomeId].name} — ${c.environment.effect.title}</b><small>${c.environment.effect.summary} • ${cl.icon} ${cl.weather} • ${cl.phase}</small></div>`;contextHost.before(banner)}
 if(c.storyMission&&contextHost){const mission=document.createElement('div');mission.className='story-mission-banner';const sm=c.storyMission;mission.innerHTML=`<strong>📜 ${sm.name}</strong><span>${sm.type==='escort'?sm.hits?'Towarzysz został trafiony • do końca walki uważaj na kolejny cios':'Gdy wróg zapowie atak, wybierz Obrona lub PRZERWIJ.':sm.signalRaised?'Alarm rozesłany • wróg jest silniejszy':sm.signalStopped?'Róg zniszczony • patrol nie otrzymał sygnału':'Powstrzymaj sygnał, gdy przeciwnik podniesie róg.'}</span>`;contextHost.before(mission)}
 if(c.raidTier&&contextHost){const party=document.createElement('div');party.className='raid-party-strip';party.innerHTML=`<b>${c.raidTier==='legend'?'👑 LEGENDA':'⚔️ HEROS'} lvl ${c.level}</b><span>🧙 ${state.player.name} • lvl ${state.player.level}</span>${(c.partyMembers||[]).map(m=>`<span class="${(m.hp||0)<=0?'down':''}">${m.icon||'⚔️'} ${m.name} • lvl ${m.level||state.player.level} • ${(m.hp||0)<=0?'💀 POWALONY':`❤️ ${m.hp}/${m.maxHp}`}</span>`).join('')}<em>${(c.partyMembers||[]).length?`HP przeciwnika ×${(c.raidPartyHpMult||1).toFixed(2)} • Twój wkład: ${c.raidPlayerDamage||0} dmg • drużyna: ${c.raidPartyDamage||0} dmg`:`Tryb SOLO • stały lvl przeciwnika ${c.level}`}</em>`;contextHost.before(party)}
 if(c.dungeon&&dungeonRun)startDungeonTimer();document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>{if(!combat||combat.phase!=='player')return;combat.menu=b.dataset.command;openCombat()}));document.querySelector('[data-command-back]')?.addEventListener('click',()=>{if(!combat)return;combat.menu='main';combat.pendingHealSkill=null;openCombat()});document.querySelectorAll('[data-heal-target]').forEach(b=>b.addEventListener('click',()=>{if(!combat||combat.phase!=='player')return;const skill=skillDef(combat.pendingHealSkill);if(skill)playerAction(skill,b.dataset.healTarget)}));document.querySelectorAll('[data-range-move]').forEach(b=>b.addEventListener('click',()=>combatMove(Number(b.dataset.rangeMove))));document.querySelector('[data-attack]')?.addEventListener('click',()=>playerAction(null));document.querySelector('[data-defend]')?.addEventListener('click',defendAction);document.querySelectorAll('[data-skill]').forEach(b=>b.addEventListener('click',()=>playerAction(skillDef(b.dataset.skill))));document.querySelectorAll('[data-combat-potion]').forEach(b=>b.addEventListener('click',()=>combatPotion(b.dataset.combatPotion)));document.querySelector('[data-flee]')?.addEventListener('click',fleeCombat);document.querySelector('[data-story-disrupt]')?.addEventListener('click',disruptStorySignal);
 setTimeout(()=>{if(combat&&combat.phase==='player'){combat.lastPlayerHit=null;combat.lastEnemyHit=null;combat.fx='idle'}},1050);
}
function logCombat(t){combat.log.push(t)}
function resetCombatExchange(){if(!combat)return;combat.turnDealt=0;combat.turnTaken=0;combat.turnDealtNote='';combat.turnTakenNote=''}
function addCombatDealt(amount,note=''){if(!combat)return;combat.turnDealt=(combat.turnDealt||0)+Math.max(0,amount||0);if(note)combat.turnDealtNote=note}
function setCombatTaken(amount,note=''){if(!combat)return;const taken=Math.max(0,amount||0);combat.turnTaken=taken;combat.turnTakenNote=note||'';if(taken){combat.damageTakenTotal=(combat.damageTakenTotal||0)+taken;trialStat('damageTaken',taken)}}
function combatExchangeHTML(){if(!combat)return '';const dealt=combat.turnDealt,taken=combat.turnTaken,has=dealt!==null||taken!==null;if(!has)return `<div class="combat-exchange empty"><span>Wybierz akcję, aby rozpocząć wymianę ciosów.</span></div>`;return `<div class="combat-exchange"><div class="exchange-card dealt"><small>⚔️ ZADAŁEŚ</small><b>${dealt??0}</b><span>${combat.turnDealtNote||'obrażeń'}</span></div><div class="exchange-card taken"><small>🩸 OTRZYMAŁEŚ</small><b>${taken??0}</b><span>${combat.turnTakenNote||'obrażeń'}</span></div></div>`}
function hitDamage(mult=1,critBonus=0,type='fizyczne'){
 const p=state.player,phasePenalty=combat.monster.family==='Zjawy'&&type==='fizyczne'?12:0,miss=Math.random()*100>=Math.max(20,hitChance()-phasePenalty);
 if(miss){combat.fx='idle';return {dmg:0,crit:false,weak:false,resist:false,type,miss:true}}
 const crit=Math.random()*100<critChance()+(combat.mark||0)+(combat.playerCritBuff||0)+critBonus,weak=weaknessMod(type),weaken=1-(combat.playerWeaken||0),vulnerable=combat.vulnerableTurns?1.35:1,barrier=combat.barrierTurns?.55:1,powerBuff=1+(combat.playerPowerBuff||0)/100,berserkMult=p.class==='berserker'?1+(1-p.hp/p.maxHp)*.25:1,storyMult=combat.monster.family==='Natura'&&storyChoiceFor('q2')==='finish'?1.05:1,environmentMult=(combat.environment?.damage||1)*(type==='trucizna'?(combat.environment?.poison||1):1),rangeMult=combatRangeDamageMultiplier(),gearMult=combatGearDamageMultiplier(),levelMult=playerVsEnemyLevelMultiplier(),base=rollPlayerBaseDamage()*mult,critMult=crit?1.65+(equippedCombatPerks().critDamage||0):1,dmg=Math.max(1,Math.floor(base*critMult*weak.mult*weaken*vulnerable*barrier*powerBuff*berserkMult*storyMult*environmentMult*rangeMult*gearMult*levelMult));
 trialStat('hits');if(combatDistance()===0)trialStat('closeHits');else trialStat('rangedHits');if(combatDistance()===2)trialStat('farHits');if(crit){trialStat('critHits');if(combat.markTurns>0)trialStat('markedCrits');if(state.player.hp<=state.player.maxHp*.5)trialStat('critLowHp');combat.fx='crit';playSfx('crit');haptic(22)}else{combat.fx=weak.kind==='weak'?'weak':'hit';playSfx('hit')}if(weak.kind==='weak'){trialStat('weakHits');haptic(12)}return {dmg,crit,weak:weak.kind==='weak',resist:weak.kind==='resist',type,miss:false};
}
function hitSuffix(h){return `${h.miss?' • PUDŁO':''}${h.crit?' • KRYTYK':''}${h.weak?' • 🎯 SŁABOŚĆ':''}${h.resist?' • 🧱 ODPORNOŚĆ':''}`}
function applySkillStatus(skill,hit=null){
 if(!skill||!skill.status||hit?.miss)return;const chance=Math.min(1,(skill.statusChance??1)+(state.player.class==='mage'?.08:0));if(Math.random()>chance)return;const turns=skill.statusTurns||2;
 if(skill.status==='bleed'){if(combat.monster.family==='Nieumarli'&&Math.random()<.65){logCombat('🦴 Nieumarły niemal nie reaguje na krwawienie.');return}combat.bleed=Math.max(combat.bleed,Math.max(3,Math.floor(attackPower()*.13*(1+(equippedCombatPerks().bleedAmp||0)))));combat.bleedTurns=Math.max(combat.bleedTurns,turns);trialStat('bleedApplied');logCombat(`🩸 ${combat.monster.name} krwawi przez ${turns} tury.`)}
 else if(skill.status==='burn'){combat.burn=Math.max(combat.burn,Math.max(4,Math.floor(attackPower()*.15)));combat.burnTurns=Math.max(combat.burnTurns,turns);trialStat('burnApplied');logCombat(`🔥 Cel zostaje podpalony na ${turns} tury.`)}
 else if(skill.status==='freeze'){combat.freezeTurns=Math.max(combat.freezeTurns,turns);trialStat('freezeApplied');logCombat(`❄️ Cel zostaje zamrożony na ${turns} tury.`)}
 else if(skill.status==='stun'){combat.stunned=Math.max(combat.stunned,1);trialStat('stunApplied');logCombat('💫 Przeciwnik zostaje ogłuszony i straci akcję.')}
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
 if(combat.stagger>=combat.staggerMax){trialStat('bossBreaks');combat.stagger=0;combat.stunned=1;combat.vulnerableTurns=1;if(combat.intent){if(combat.intent.type==='storySignal')combat.storyMission.signalStopped=true;if(combat.intent.type==='storyStrike')combat.storyMission.protected=true;logCombat('💥 Przełamanie przerywa zamiar bossa!');combat.intent=null}else logCombat('💥 Boss zostaje PRZEŁAMANY i traci następną akcję!');playSfx('boss');haptic([30,20,45]);return true}return false;
}
function interruptIntent(skill,meta){
 if(!combat?.intent||!meta?.interrupt||!combat.intent.interruptible)return false;const info=bossIntentInfo(combat.intent);if(combat.intent.type==='storySignal')combat.storyMission.signalStopped=true;if(combat.intent.type==='storyStrike')combat.storyMission.protected=true;combat.intent=null;combat.stunned=1;combat.stagger=Math.min(combat.staggerMax,combat.stagger+20);trialStat('interrupts');logCombat(`✋ ${skill.name} przerywa: ${info.name}. Boss traci akcję.`);playSfx('boss');haptic([20,20,30]);return true;
}
function afterPlayerAttack(meta,hits=1){
 addStagger((meta?.stagger||10)+Math.max(0,hits-1)*4+(equippedCombatPerks().staggerBonus||0));
 if(combat.barrierTurns>0&&--combat.barrierTurns===0){combat.barrier=0;logCombat('Runiczna bariera przeciwnika wygasa.')}
 if(combat.vulnerableTurns>0)combat.vulnerableTurns--;
}
function rangedAmmoCost(skill){if(!['hunter','ranger'].includes(state.player.class))return 0;if(!skill)return 1;if(['buff','debuff','mark','guard'].includes(skill.kind))return 0;if(skill.kind==='multi')return Math.max(1,skill.hits||1);return 1}
function playerAction(skill,targetKey=null){
 if(!combat||combat.phase!=='player')return;
 if(skill?.kind==='heal'&&!targetKey){if(combat.raidTier&&combat.partyMembers?.length){combat.pendingHealSkill=skill.id;combat.menu='healTarget';openCombat();return}targetKey='self'}
 if(skill?.kind==='heal'&&targetKey){const row=mageHealTargetByKey(targetKey);if(!row||(row.kind==='ally'&&row.target.hp<=0))return toast('Tego sojusznika nie można teraz uleczyć.');if(row.target.hp>=row.target.maxHp)return toast('Wybrany cel ma pełne HP.')}
 const enemyHpBefore=combat.hp;if(combatNeedsClose(skill)){combat.menu='position';openCombat();return toast('Musisz podejść na BLISKO, aby wykonać ten atak.')}resetCombatExchange();const ammoCost=rangedAmmoCost(skill),cd=skill?(combat.cooldowns?.[skill.id]||0):0;if(cd)return toast(`Umiejętność gotowa za ${cd} tur.`);const manaCost=combatSkillManaCost(skill);if(skill&&state.player.mana<manaCost)return toast('Za mało many.');if(ammoCost&&countItem('primitiveArrow')<ammoCost)return toast(`Brak strzał. Potrzebujesz ${ammoCost}.`);if(ammoCost)removeItem('primitiveArrow',ammoCost);if(skill){state.player.mana-=manaCost;trialStat('manaSpent',manaCost);trialStat(`skillUse_${skill.id}`);if(skill.kind==='multi')trialStat('multiHitActions');if(skill.cooldown)combat.cooldowns[skill.id]=(skill.cooldown||0)+1}if(state.player.class==='berserker'&&itemDef(equippedInstance('offhand')?.id)?.type==='weapon'&&combatOffensiveSkill(skill))trialStat('dualWieldAttacks');trialStat('classActions');const meta=combatSkillMeta(skill);let total=0,hits=1,lastHit=null;
 if(skill&&interruptIntent(skill,meta)){};
 if(!skill){const h=hitDamage(1,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?'Atak chybia.':`Atakujesz za ${h.dmg}${hitSuffix(h)}.`)}
 else if(skill.kind==='damage'){const h=hitDamage(skill.mult,skill.critBonus||0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?`${skill.name}: pudło.`:`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);if(!h.miss&&skill.debuff){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3}applySkillStatus(skill,h)}
 else if(skill.kind==='multi'){hits=skill.hits;let crits=0,weaks=0,resists=0,misses=0;for(let i=0;i<skill.hits;i++){const h=hitDamage(skill.mult,0,meta.type);lastHit=h;total+=h.dmg;if(h.crit)crits++;if(h.weak)weaks++;if(h.resist)resists++;if(h.miss)misses++}combat.hp-=total;logCombat(`${skill.name}: ${total} obrażeń w ${skill.hits-misses}/${skill.hits} trafieniach${crits?` • krytyki ${crits}`:''}${weaks?' • 🎯 słabość':''}${resists?' • 🧱 odporność':''}.`);if(misses<skill.hits)applySkillStatus(skill,{miss:false})}
 else if(skill.kind==='guard'){combat.guard=Math.max(combat.guard,skill.turns);logCombat(`${skill.name}: wzmacniasz obronę na ${skill.turns} tury.`)}
 else if(skill.kind==='buff'){applyPlayerBuff(skill)}
 else if(skill.kind==='heal'){const restored=castMageHeal(skill,targetKey||'self');combat.turnDealtNote=`LECZENIE +${restored}`;combat.pendingHealSkill=null}
 else if(skill.kind==='debuff'){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3;logCombat(`${skill.name}: przeciwnik zostaje osłabiony.`)}
 else if(skill.kind==='mark'){combat.mark=25;combat.markTurns=skill.turns;logCombat(`${skill.name}: oznaczasz cel.`)}
 else if(skill.kind==='poison'){const h=hitDamage(skill.mult,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;if(!h.miss){combat.poison=Math.max(4,Math.floor(attackPower()*(state.player.class==='ranger'?.29:.24)*(combat.environment?.poison||1)*(1+(equippedCombatPerks().poisonAmp||0))));combat.poisonTurns=skill.turns;trialStat('poisonApplied');logCombat(`${skill.name}: ${h.dmg}${hitSuffix(h)} i trucizna.`)}else logCombat(`${skill.name}: pudło.`)}
 else if(skill.kind==='pet'){const h=hitDamage(skill.mult,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?`${skill.name}: pudło.`:`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);if(!h.miss){applySkillStatus(skill,h);petAttack(true)}}
 else if(skill.kind==='rage'){const missing=1-state.player.hp/state.player.maxHp,mult=1.2+missing*.7,h=hitDamage(mult,0,meta.type);lastHit=h;total=h.dmg;combat.hp-=h.dmg;logCombat(h.miss?`${skill.name}: pudło.`:`${skill.name}: ${h.dmg}${hitSuffix(h)}.`);applySkillStatus(skill,h)}
 if(total){combat.lastPlayerHit=total;addCombatDealt(total,lastHit?.crit?'KRYTYK':skill?.name||'Atak podstawowy');afterPlayerAttack(meta,hits)}else if(skill){if(lastHit?.miss)combat.turnDealtNote='PUDŁO';else if(['guard','buff','debuff','mark'].includes(skill.kind))combat.turnDealtNote=skill.name;afterPlayerAttack(meta,1)}
 if(total&&combat.hp<=0){trialStat('finishingBlows');combat.killingSkillId=skill?.id||'basic';if(skill)trialStat(`killSkill_${skill.id}`)}if(combat.raidTier){combat.raidPlayerActions=(combat.raidPlayerActions||0)+1;combat.raidPlayerDamage=(combat.raidPlayerDamage||0)+total}if(combat.approachBuffTurns>0&&combatOffensiveSkill(skill))combat.approachBuffTurns=0;if(skill?.kind!=='pet')petAttack(false);markEnemyHpDamage(enemyHpBefore);if(combat.hp<=0)return queueCombatVictory();raidPartyAssist();markEnemyHpDamage(enemyHpBefore);if(combat.hp<=0)return queueCombatVictory();queueEnemyTurn();
}
function defendAction(){if(!combat||combat.phase!=='player')return;const enemyHpBefore=combat.hp;resetCombatExchange();combat.turnDealtNote='OBRONA';combat.guard=Math.max(combat.guard,1);trialStat('defends');trialStat('classActions');if(combat.raidTier)combat.raidPlayerActions=(combat.raidPlayerActions||0)+1;logCombat('🛡️ Przyjmujesz postawę obronną. Najbliższy cios zada znacznie mniej obrażeń.');haptic(12);raidPartyAssist();markEnemyHpDamage(enemyHpBefore);if(combat.hp<=0)return queueCombatVictory();queueEnemyTurn()}
function petAttack(force){const p=petInstance();if(!p)return;if(!force&&Math.random()>.35)return;const dmg=Math.max(2,Math.floor(petPower()*(.8+Math.random()*.4)*(1+(equippedCombatPerks().petDamage||0))));trialStat('petAttacks');combat.hp-=dmg;if(combat.hp<=0)trialStat('petKills');combat.lastPlayerHit=(combat.lastPlayerHit||0)+dmg;addCombatDealt(dmg,'Atak + chowaniec');logCombat(`${petDef(p.id).icon} ${petDef(p.id).name} atakuje za ${dmg}.`)}
function resolveBossIntent(){
 const intent=combat.intent;if(!intent)return false;const info=bossIntentInfo(intent);combat.intent=null;
 if(intent.type==='storySignal'){
  combat.storyMission.signalRaised=true;combat.atk=Math.ceil(combat.atk*1.15);combat.barrier=.20;combat.barrierTurns=2;setCombatTaken(0,'ALARM');logCombat('📯 Alarm dotarł do patrolu: przeciwnik zyskuje +15% ATK i krótką osłonę. Późniejszy ślad zostanie w fabule.');
 }else if(intent.type==='storyStrike'){
  if(combat.guard>0){combat.guard--;combat.storyMission.protected=true;setCombatTaken(0,'OSŁONIĘTO');logCombat(`🛡️ Osłaniasz: ${combat.storyMission.name}. Atak nie trafia towarzyszy.`)}
  else{combat.storyMission.hits++;setCombatTaken(0,'RANNY SOJUSZNIK');logCombat(`🩸 ${combat.storyMission.name} otrzymuje cios. Śledztwo będzie miało inny przebieg.`)}
 }else if(intent.type==='smash'){
  combat.fx='boss';const reduction=armorPower()*.28,guardMult=combat.guard>0?.28:1,blocked=Math.random()*100<blockChance();if(blocked)trialStat('blocks');const blockMult=blocked?.55:1,dmg=Math.max(1,Math.floor((combat.atk*2.25-reduction)*guardMult*blockMult));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;setCombatTaken(dmg,blocked||combat.guard>0?'BLOK / OBRONA':info.name);logCombat(`${combat.guard>0||blocked?'🛡️ Ograniczasz cios':'💥 Trafia Cię'}: ${info.name} za ${dmg}.`);if(combat.guard>0)combat.guard--;
 }else if(intent.type==='hex'){
  combat.playerWeaken=.28;combat.playerWeakenTurns=2;const drain=Math.min(state.player.mana,12+combat.bossPhase*4);state.player.mana-=drain;setCombatTaken(0,'KLĄTWA');logCombat(`🕯️ ${info.name}: −28% obrażeń na 2 tury i −${drain} many.`);
 }else if(intent.type==='ward'){
  combat.barrier=.45;combat.barrierTurns=2;setCombatTaken(0,'BARIERA BOSSA');logCombat('🛡️ Boss otacza się runiczną barierą: otrzymuje o 45% mniej obrażeń przez 2 Twoje akcje.');
 }else if(intent.type==='frenzy'){
  let total=0;for(let i=0;i<2;i++){const blocked=Math.random()*100<blockChance(),d=Math.max(1,Math.floor((combat.atk*1.05-armorPower()*.32)*(blocked?.55:1)));total+=d}state.player.hp=Math.max(0,state.player.hp-total);combat.lastEnemyHit=total;setCombatTaken(total,info.name);logCombat(`⚔️ ${info.name}: dwa uderzenia zadają łącznie ${total}.`);
 }
 return true;
}
function disruptStorySignal(){if(!combat||combat.phase!=='player'||combat.intent?.type!=='storySignal')return;resetCombatExchange();combat.intent=null;combat.storyMission.signalStopped=true;combat.turnDealtNote='RÓG ZNISZCZONY';logCombat('💥 Niszczycielski sygnał zostaje przerwany. Poświęcasz turę, lecz patrol nie otrzyma alarmu.');playSfx('boss');haptic([22,18,34]);queueEnemyTurn(650)}
function tickEnemyStatuses(){
 if(combat.debuffTurns>0&&--combat.debuffTurns===0)combat.debuff=0;if(combat.markTurns>0&&--combat.markTurns===0)combat.mark=0;if(combat.playerWeakenTurns>0&&--combat.playerWeakenTurns===0)combat.playerWeaken=0;
 if(combat.poisonTurns>0)combat.poisonTurns--;if(combat.bleedTurns>0)combat.bleedTurns--;if(combat.burnTurns>0)combat.burnTurns--;if(combat.freezeTurns>0)combat.freezeTurns--;if(combat.enemyRegenCooldown>0)combat.enemyRegenCooldown--;if(combat.enemySpecialCooldown>0)combat.enemySpecialCooldown--;
 tickCombatCooldowns();tickPlayerBuffs();
}
function queueEnemyTurn(delay=1100){
 if(!combat)return;combat.menu='main';combat.phase='enemyDelay';const active=combat,token=++combat.turnToken;save();openCombat();setTimeout(()=>{if(combat===active&&combat.turnToken===token&&combat.phase==='enemyDelay')enemyTurn()},delay)
}
function finishEnemyTurn(delay=1050){
 if(!combat)return;combat.phase='enemyResult';const active=combat,token=++combat.turnToken;save();openCombat();setTimeout(()=>{if(combat===active&&combat.turnToken===token&&combat.phase==='enemyResult'){combat.phase='player';combat.menu='main';combat.lastPlayerHit=null;combat.lastEnemyHit=null;combat.fx='idle';save();openCombat()}},delay)
}
function enemyTurn(){
 if(!combat)return;if(combat.hp<=0)return queueCombatVictory();combat.phase='enemyResult';combat.enemyHpGhostFrom=null;const statusHpBefore=combat.hp;
 if(combat.poisonTurns>0){combat.hp-=combat.poison;addCombatDealt(combat.poison,'Atak + efekty');logCombat(`☠️ Trucizna zadaje ${combat.poison}.`)}
 if(combat.bleedTurns>0){combat.hp-=combat.bleed;addCombatDealt(combat.bleed,'Atak + efekty');logCombat(`🩸 Krwawienie zadaje ${combat.bleed}.`)}
 if(combat.burnTurns>0){combat.hp-=combat.burn;addCombatDealt(combat.burn,'Atak + efekty');logCombat(`🔥 Podpalenie zadaje ${combat.burn}.`)}
 markEnemyHpDamage(statusHpBefore);if(combat.hp<=0)return queueCombatVictory();
 if(combat.isBoss&&combat.bossPhase===1&&combat.hp<=combat.maxHp*.55){combat.bossPhase=2;combat.atk=Math.floor(combat.baseAtk*1.25);logCombat(`🔥 ${combat.monster.name} przechodzi do FAZY II!`);playSfx('boss');haptic([35,25,35])}
 if(combat.isBoss&&combat.bossPhase===2&&combat.hp<=combat.maxHp*.25){combat.bossPhase=3;combat.atk=Math.floor(combat.baseAtk*1.50);logCombat(`☠️ ${combat.monster.name} przechodzi do FAZY III — desperacki szał!`);playSfx('boss');haptic([40,25,40])}
 regenerateEnemyMana();
 if(combat.stunned>0){combat.stunned--;setCombatTaken(0,'OGŁUSZONY');logCombat('💫 Przeciwnik jest ogłuszony i traci akcję.');tickEnemyStatuses();return finishEnemyTurn()}
 if(combat.freezeTurns>0&&Math.random()<.25){setCombatTaken(0,'ZAMROŻONY');logCombat('❄️ Zamrożenie spowalnia przeciwnika — traci akcję.');tickEnemyStatuses();return finishEnemyTurn()}
 if(combat.intent){resolveBossIntent();tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn()}
 combat.enemyTurns++;
 if(combat.storyMission&&!combat.storyMission.triggered&&combat.enemyTurns===2){combat.storyMission.triggered=true;const type=combat.storyMission.type==='escort'?'storyStrike':'storySignal';combat.intent={type,interruptible:true};const info=bossIntentInfo(combat.intent);setCombatTaken(0,'ZAPOWIEDŹ');logCombat(`⚠️ ${info.name}: ${info.hint}`);playSfx('boss');haptic([22,18,22]);tickEnemyStatuses();return finishEnemyTurn(850)}
 if(tryEliteRegeneration()){tickEnemyStatuses();return finishEnemyTurn(900)}
 const intentEvery=combat.bossPhase>=3?2:3,intentCost=22;if(combat.isBoss&&combat.enemyTurns%intentEvery===0&&(!enemyManaEnabled()||combat.enemyMana>=intentCost)){if(enemyManaEnabled())combat.enemyMana-=intentCost;combat.intent=chooseBossIntent();const info=bossIntentInfo(combat.intent);setCombatTaken(0,'BOSS SZYKUJE ATAK');logCombat(`⚠️ Boss przygotowuje: ${info.name}${enemyManaEnabled()?` • −${intentCost} many`:''}. ${info.hint}`);playSfx('boss');haptic([30,35,30]);tickEnemyStatuses();return finishEnemyTurn()}
 if(tryEnemySpecialAttack()){tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn(950)}
 if(enemyAttackRaidAlly()){tickEnemyStatuses();return finishEnemyTurn(900)}
 const profile=enemyCombatProfile(),d=combatDistance();
 if(profile.style==='teleport'&&d>0){combat.distance=0;combat.lastEnemyHit=null;setCombatTaken(0,'TELEPORT');logCombat(`🔥 ${combat.monster.name} teleportuje się na BLISKO.`);tickEnemyStatuses();return finishEnemyTurn(800)}
 if(profile.style==='charge'&&d>0){const from=d;combat.distance=Math.max(0,d-2);let impact=0;if(combat.distance===0&&from===2){const reduction=armorPower()*.28,gearMult=combatIncomingGearMultiplier();impact=Math.max(1,Math.floor((combat.atk*.52-reduction)*gearMult));state.player.hp=Math.max(0,state.player.hp-impact);combat.lastEnemyHit=impact;setCombatTaken(impact,'SZARŻA');logCombat(`💥 ${combat.monster.name} szarżuje z DALEKO na BLISKO i zadaje ${impact}.`)}else{combat.lastEnemyHit=null;setCombatTaken(0,'SZARŻA');logCombat(`🐾 ${combat.monster.name} gwałtownie skraca dystans. Teraz: ${combatDistanceLabel()}.`)}tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn(850)}
 if(profile.style==='ranged'&&d>=Math.max(1,profile.preferred)){enemyRangedAttack(profile.preferred===2?.92:.88,profile.style==='ranged'?'ATAK DYSTANSOWY':'ATAK');tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn()}
 if(profile.style==='tactical'&&d===0&&Math.random()<.45){combat.distance=1;combat.lastEnemyHit=null;setCombatTaken(0,'ODSKOK');logCombat(`↩️ ${combat.monster.name} odskakuje na ŚREDNIO.`);tickEnemyStatuses();return finishEnemyTurn(750)}
 if(profile.style==='tactical'&&d>=1&&Math.random()<.55){enemyRangedAttack(.82,'ATAK TAKTYCZNY');tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn()}
 if(d>0){combat.distance=d-1;combat.lastEnemyHit=null;setCombatTaken(0,'PODEJŚCIE WROGA');logCombat(`👣 ${combat.monster.name} skraca dystans. Teraz: ${combatDistanceLabel()}.`);tickEnemyStatuses();return finishEnemyTurn(800)}
 const dodge=Math.random()*100<dodgeChance();if(dodge){trialStat('dodges');combat.lastEnemyHit=null;setCombatTaken(0,'UNIK');logCombat('💨 Unikasz ataku przeciwnika.');tickEnemyStatuses();return finishEnemyTurn()}
 combat.fx='enemy';const blocked=Math.random()*100<blockChance();if(blocked)trialStat('blocks');const reduction=armorPower()*.42,guardMult=combat.guard>0?.55:1,freezeMult=combat.freezeTurns>0?.78:1,blockMult=blocked?.52:1,mult=(1-combat.debuff)*guardMult*freezeMult*blockMult,dmg=Math.max(1,Math.floor((combat.atk*(.85+Math.random()*.3)-reduction)*mult*combatIncomingGearMultiplier()));state.player.hp=Math.max(0,state.player.hp-dmg);combat.lastEnemyHit=dmg;setCombatTaken(dmg,blocked?'BLOK':'TRAFIENIE');logCombat(`${blocked?'🛡️ Blok! ':''}${combat.monster.name} zadaje Ci ${dmg}.`);if(enemyCombatProfile().style==='venom'&&Math.random()<.28){combat.playerWeaken=Math.max(combat.playerWeaken,.12);combat.playerWeakenTurns=Math.max(combat.playerWeakenTurns,2);logCombat('☠️ Jad osłabia Twoje obrażenia o 12% na 2 tury.')}if(combat.guard>0)combat.guard--;tickEnemyStatuses();if(state.player.hp<=0)return loseCombat();return finishEnemyTurn();
}
function combatPotion(id='potion'){
 if(!combat||combat.phase!=='player'||!countItem(id))return;const enemyHpBefore=combat.hp;
 const d=itemDef(id),p=state.player,key=d.heal?'hp':d.mana?'mana':null;
 if(!key)return;const max=key==='hp'?p.maxHp:p.maxMana;
 if(p[key]>=max)return toast(key==='hp'?'Masz pełne zdrowie.':'Masz pełną manę.');
 resetCombatExchange();combat.usedPotion=true;combat.turnDealtNote=d.mana?'MIKSTURA MANY':'LECZENIE';playSfx('heal');
 const restored=Math.min(d.heal||d.mana,max-p[key]);p[key]+=restored;removeItem(id);
 logCombat(`${d.name}: +${restored} ${key==='hp'?'HP':'many'}.`);if(combat.raidTier)combat.raidPlayerActions=(combat.raidPlayerActions||0)+1;raidPartyAssist();markEnemyHpDamage(enemyHpBefore);if(combat.hp<=0)return queueCombatVictory();queueEnemyTurn();
}

function fleeCombat(){if(!combat||combat.phase!=='player')return;if(combat?.dungeon||combat?.raidTier)return toast(combat?.raidTier?'Nie możesz opuścić rozpoczętej wyprawy drużynowej.':'Nie możesz uciec z tej komnaty lochu.');if(Math.random()<.7){combat=null;save();renderShell();toast('Udało Ci się uciec.')}else{logCombat('Nie udało się uciec!');queueEnemyTurn()}}
function battleLootRow(drop,index){const d=itemDef(drop.id);return `<label class="battle-loot-row rarity-card-${d.rarity} ${drop.tutorial?'tutorial-class-loot':''}"><input type="checkbox" data-battle-loot="${index}" checked><span class="battle-loot-icon">${itemIconVisual(d.id,'shop-item-svg')}</span><span class="battle-loot-copy"><b class="rarity-${d.rarity}">${d.name}</b><small>${drop.tutorial?'🎓 GWARANTOWANY ŁUP KLASOWY • ':''}${drop.qty>1?`${drop.qty} szt. • `:''}${d.rarity} • ${d.type==='material'?'materiał':d.type==='consumable'?'zużywalny':d.slot?'ekwipunek':'przedmiot'}</small></span><span class="battle-loot-take">ZABIERZ</span></label>`}
function collectSelectedBattleLoot(result){const selected=[...document.querySelectorAll('[data-battle-loot]:checked')].map(x=>Number(x.dataset.battleLoot)).filter(Number.isInteger);let taken=[];for(const i of selected){const drop=result.drops[i];if(!drop)continue;const added=addItem(drop.id,drop.qty||1);if(added)taken.push({id:drop.id,qty:added})}return taken}
function finishBattleResult(result,takeLoot=true){if(result!==battleResult)return;if(takeLoot){const drops=[...document.querySelectorAll('[data-battle-loot]:checked')].map(x=>result.drops[Number(x.dataset.battleLoot)]).filter(Boolean);if(!requireItemRoom(drops))return}const taken=takeLoot?collectSelectedBattleLoot(result):[];if(result.dungeonInfo&&dungeonRun&&result.pauseStarted){dungeonRun.deadline+=Math.max(0,Date.now()-result.pauseStarted)}battleResult=null;closeModal();save();if(taken.length){playSfx('loot');toast(`Zabrano: ${lootToastText(taken)}`)}if(result.dungeonInfo){advanceDungeonAfterCombat(result.dungeonInfo);return}renderShell();queueReadyStoryScene(null,260)}
function showBattleVictory(result){renderShell();const lootHtml=result.drops.length?`<div class="battle-loot-list">${result.drops.map(battleLootRow).join('')}</div><div class="battle-loot-tools"><button class="secondary" data-loot-all>Zaznacz wszystko</button><button class="ghost" data-loot-none>Odznacz</button></div>`:`<div class="battle-loot-empty">Ten przeciwnik niczego nie upuścił.</div>`;openModal(`<div class="battle-result victory"><div class="battle-result-mark">🏆</div><span class="eyebrow">WYNIK WALKI</span><h2>WYGRANA</h2><div class="battle-result-rewards"><span><b>+${result.xp}</b> XP</span><span><b>+${result.gold}</b> 🪙</span>${result.worldBossRep?`<span><b>+${result.worldBossRep}</b> reputacji</span>`:''}${result.raidRep?`<span><b>+${result.raidRep}</b> reputacji</span>`:''}${result.raidTier?`<span><b>${result.raidContribution}%</b> wkładu</span>${result.raidRewardScale<1?`<span><b>${Math.round(result.raidRewardScale*100)}%</b> nagród</span>`:''}`:''}</div>${result.storyOutcome?`<div class="battle-story-outcome">📜 ${result.storyOutcome}</div>`:''}<div class="battle-loot-head"><div><h3>${result.raidTier?'Łup osobisty':'Łupy'}</h3><p>${result.raidTier?`Nagrody są liczone osobno dla każdego członka drużyny • drużyna ${result.raidPartySize}/4.${result.raidFullLoot?'':' Zbyt mały wkład lub bardzo duża różnica poziomu ograniczyła nagrody.'}`:'Zaznacz tylko rzeczy, które chcesz zabrać. Reszta zostanie na miejscu.'}</p></div><span>🎒 ${inventoryUsedSlots()}/${inventoryCapacity()}</span></div>${lootHtml}<div class="battle-result-actions"><button class="primary" data-take-battle-loot>Zabierz wybrane</button><button class="secondary" data-leave-battle-loot>Zostaw wszystko</button></div></div>`,true);document.querySelector('[data-loot-all]')?.addEventListener('click',()=>document.querySelectorAll('[data-battle-loot]').forEach(x=>x.checked=true));document.querySelector('[data-loot-none]')?.addEventListener('click',()=>document.querySelectorAll('[data-battle-loot]').forEach(x=>x.checked=false));document.querySelector('[data-take-battle-loot]')?.addEventListener('click',()=>finishBattleResult(result,true));document.querySelector('[data-leave-battle-loot]')?.addEventListener('click',()=>finishBattleResult(result,false))}
function showBattleDefeat(onReturn){renderShell();openModal(`<div class="battle-result defeat"><div class="battle-result-mark">💀</div><span class="eyebrow">WYNIK WALKI</span><h2>ZGINĄŁEŚ</h2><button class="primary" data-death-return>Wróć</button></div>`,true);document.querySelector('[data-death-return]')?.addEventListener('click',()=>{closeModal();onReturn?.();renderShell()})}
function winCombat(){
 const c=combat,m=c.monster,e=c.entity,biomeXp=c.environment?.familyMatch?(c.environment.effect.familyXp||1):1,raidXpMult=c.raidTier==='legend'?2.2:c.raidTier==='hero'?1.45:1,raidReward=raidRewardProfile(c);let xp=Math.floor(m.xp*(.65+.055*c.level)*(e.elite?1.75:1)*biomeXp*raidXpMult),baseGold=Math.floor(rnd(...m.gold)*(e.elite?2:1)*(c.raidTier==='legend'?2:c.raidTier==='hero'?1.35:1));if(c.raidTier&&1+(c.partyMembers?.length||0)>1&&raidReward.scale<1){xp=Math.max(1,Math.floor(xp*raidReward.scale));baseGold=Math.max(1,Math.floor(baseGold*raidReward.scale))}let gold=baseGold,worldBossRep=0,raidRep=0;
 if(c.distance===0)trialStat('closeKills');else trialStat('rangedKills');if(state.player.class==='mage')trialStat('mageKills');if(state.player.hp<=state.player.maxHp*.35)trialStat('lowHpWins');if((c.damageTakenTotal||0)===0)trialStat('noDamageWins');if(c.poisonTurns>0)trialStat('poisonedKills');if(c.burnTurns>0)trialStat('burningKills');if(c.debuffTurns>0)trialStat('debuffedWins');if(e.elite){trialStat('eliteWins');if(state.player.petActive)trialStat('petEliteWins')};
 state.player.bestiaryVariants ||= {};const variantKills=state.player.bestiaryVariants[m.id] ||= {},variantId=m.variantId||e.variant||'normal';variantKills[variantId]=(variantKills[variantId]||0)+1;
 state.player.gold+=baseGold;state.player.kills++;recordGuildMonsterKill(c.raidTier||null);progressGuildContracts(m.id);playSfx('kill');haptic(18);tutorialEvent('kill');state.player.bestiary[m.id]=(state.player.bestiary[m.id]||0)+1;if(!e.synthetic){e.alive=false;e.respawn=Date.now()+5*60*1000}checkQuestProgress('kill',m.id);const loot=rollCombatLoot(m,e,c);if((c.environment?.effect?.loot||1)>1&&Math.random()<(c.environment.effect.loot-1)){const extra=monsterLootTable(m.id)[0];if(extra)loot.drops=mergeLootDrops([...loot.drops,{id:extra.id,qty:1}])}gainXp(xp);gainPetXp(xp);if(e.elite||c.isBoss)playSfx('loot');if(c.worldBoss){state.adventure.worldBossDay=daySeed();state.adventure.reputation+=25;worldBossRep=25;state.player.gold+=180;gold+=180;loot.drops.push({id:'titanShard',qty:1},{id:'runeShard',qty:2});if(Math.random()<.55)loot.drops.push({id:randomRuneId(),qty:1});if(Math.random()<.18)loot.drops.push({id:pick(['stormCrown','cryptHeart']),qty:1});loot.drops=mergeLootDrops(loot.drops)}if(c.raidTier){ensureSocialState();const rd=raidDef(c.raidTier),eligible=raidReward.fullLoot;state.social.raids[`${c.raidTier}Wins`]=(state.social.raids[`${c.raidTier}Wins`]||0)+1;const guildRaidMult=guildExpeditionBonus(),rewardScale=(1+(c.partyMembers?.length||0)>1?raidReward.scale:1);raidRep=Math.max(1,Math.ceil(rd.rep*guildRaidMult*rewardScale));const raidGold=Math.max(1,Math.ceil(rd.gold*guildRaidMult*rewardScale));state.adventure.reputation+=raidRep;state.player.gold+=raidGold;gold+=raidGold;if(eligible){loot.drops.push({id:'runeShard',qty:c.raidTier==='legend'?2:1});if(c.raidTier==='legend'){loot.drops.push({id:'titanShard',qty:2});if(Math.random()<.35)loot.drops.push({id:pick(['stormCrown','cryptHeart']),qty:1});if(Math.random()<.32){const legendaryGear=randomGearFrom('legendary');if(legendaryGear)loot.drops.push({id:legendaryGear,qty:1,gear:true})}}else if(Math.random()<.28)loot.drops.push({id:randomRuneId(),qty:1})}loot.drops=mergeLootDrops(loot.drops);state.social.raids.history.unshift({tier:c.raidTier,monster:m.id,at:Date.now(),party:1+(c.partyMembers?.length||0),playerDamage:c.raidPlayerDamage||0,partyDamage:c.raidPartyDamage||0,eligible,rewardScale:raidReward.scale,levelGap:raidReward.levelGap});state.social.raids.history=state.social.raids.history.slice(0,20)}let storyOutcome='';if(c.storyConsequence?.qid){const sc=storyScene(c.storyConsequence.qid),choice=sc?.choices.find(x=>x.id===c.storyConsequence.choiceId),sm=c.storyMission;if(choice){if(!commitStoryChoice(c.storyConsequence.qid,choice,sm))checkQuestProgress('story',c.storyConsequence.qid);storyOutcome=sm?.type==='escort'?(sm.hits?`${sm.name} przeżył, lecz został ranny. Ten ślad wróci w dalszej opowieści.`:`Osłoniłeś: ${sm.name}. Bezpieczny świadek może pomóc w śledztwie.`):sm?.type==='signal'?(sm.signalRaised?'Alarm zdążył dotrzeć do patrolu. Ślady tego pojawią się później.':'Powstrzymałeś alarm. Nikt nie uprzedził następnego patrolu.'):`Decyzja zapisana: ${choice.label}.`}}if(c.worldEvent?.eventId){const event=eventById(c.worldEvent.eventId),choice=event?.choices?.find(x=>x.id===c.worldEvent.choiceId);if(event)completeWorldEvent(event,choice||{label:'Walka wygrana'},{deferRender:true})}updateAchievements();const pauseStarted=c.dungeon&&dungeonRun?Date.now():0;if(pauseStarted)clearDungeonTimer();const result={xp,gold,worldBossRep,raidRep,raidTier:c.raidTier||null,raidPartySize:c.raidTier?1+(c.partyMembers?.length||0):0,raidContribution:c.raidTier?Math.round(100*(c.raidPlayerDamage||0)/Math.max(1,(c.raidPlayerDamage||0)+(c.raidPartyDamage||0))):0,raidRewardScale:c.raidTier?raidReward.scale:1,raidFullLoot:c.raidTier?raidReward.fullLoot:true,drops:loot.drops,storyOutcome,dungeonInfo:c.dungeon,pauseStarted};combat=null;battleResult=result;save();showBattleVictory(result);
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
 else if(!document.hidden){passiveRegenTick();if(gpsPausedByBackground){gpsPausedByBackground=false;setTimeout(()=>{if(gpsWatch===null)toggleGps()},650)}}
});

// Save one coherent snapshot after each synchronous action.
newGame=atomicAction(newGame);buyItem=atomicAction(buyItem);craftRecipe=atomicAction(craftRecipe);unsocketRune=atomicAction(unsocketRune);
playerAction=atomicAction(playerAction);enemyTurn=atomicAction(enemyTurn);combatPotion=atomicAction(combatPotion);useItem=atomicAction(useItem);
applyStoryChoice=atomicAction(applyStoryChoice);chooseWorldEvent=atomicAction(chooseWorldEvent);
winCombat=atomicAction(winCombat);loseCombat=atomicAction(loseCombat);finishBattleResult=atomicAction(finishBattleResult);
salvageIndex=atomicAction(salvageIndex);sellIndex=atomicAction(sellIndex);equipIndexToSlot=atomicAction(equipIndexToSlot);
startDungeon=atomicAction(startDungeon);moveDungeon=atomicAction(moveDungeon);completeDungeon=atomicAction(completeDungeon);resolveDungeonRoom=atomicAction(resolveDungeonRoom);
state=load();restoreSession();if(applyPassiveRegen(Date.now()))save();startPassiveRegen();if(Number.isFinite(state?.ui?.mapHeading))playerMotion.heading=state.ui.mapHeading;
const resumeGpsAfterLaunch=!!state?.player?.position?.gps;
if(state?.world?.entities){for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true}
render();resumeSession();
if(resumeGpsAfterLaunch&&navigator.geolocation)setTimeout(()=>{if(state&&gpsWatch===null)toggleGps()},650);
