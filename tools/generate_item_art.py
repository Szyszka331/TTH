"""Prepare per-item art from Time4Heroes' two hand-painted 8x6 source sheets.
Run `node tests/dump-items.mjs /tmp/t4h-items.json` first, then this script.
"""
from pathlib import Path
from PIL import Image,ImageEnhance,ImageDraw,ImageFilter
import json,hashlib,unicodedata,random,sys
root=Path(__file__).resolve().parents[1]
items=json.loads(Path(sys.argv[1] if len(sys.argv)>1 and not sys.argv[1].startswith('--') else root/'assets/item-art/catalog.json').read_text())
out=root/'assets/item-art';out.mkdir(exist_ok=True)
sheets=[Image.open(out/'source'/x).convert('RGBA') for x in ('gear-and-materials.png','monster-loot.png','potions-and-loot.png')]
tiles=[]
for sheet_index,sheet in enumerate(sheets):
 w,h=sheet.size
 row_edges=[0,220,400,565,735,900,h] if sheet_index==2 else [round(y*h/6) for y in range(7)]
 for y in range(6):
  for x in range(8):
   tile=sheet.crop((round(x*w/8),row_edges[y],round((x+1)*w/8),row_edges[y+1]))
   tiles.append(tile)

def plain(s):
 return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if not unicodedata.combining(c)).replace('ł','l')
def has(s,*terms):return any(t in s for t in terms)
def choose(d):
 n=plain(d.get('name','')+' '+d['id']);slot=d.get('slot');kind=d.get('weaponKind','');t=d.get('type','')
 # Explicit monster/element variants of a matching equipment silhouette.
 if slot=='weapon' or t=='weapon':
  if has(n,'trojzab','trident'):return 55
  if has(n,'wlocz','spear','oszczep') or kind=='spear':return 54 if has(n,'mrok','shadow') else 4
  if has(n,'rozdzk','wand','laska'):return 61 if has(n,'zar','ogien','popiel') else 8
  if has(n,'berlo','scepter'):return 62
  if has(n,'kostur','staff','mag','astral') or kind=='staff':return 59 if has(n,'wod','lod','mroz','burz','grom') else 60 if has(n,'kosc','nekro','cien') else 7
  if has(n,'luk','bow') or kind=='bow':return 57 if has(n,'burz','grom') else 56 if has(n,'jad','truc','ziel') else 5
  if has(n,'kusz','crossbow'):return 58 if has(n,'ogn','feniks') else 6
  if has(n,'topor','siekier','axe') or kind=='axe':return 52 if has(n,'krw','ogn','demon') else 2
  if has(n,'mlot','hammer','maczug') or kind=='hammer':return 53 if has(n,'ogn','zar') else 3
  if has(n,'sztylet','dagger'):return 1
  if has(n,'kosa','zniwiar'):return 48
  return 49 if has(n,'lod','mroz','szron') else 50 if has(n,'burz','grom','smocz') else 51 if has(n,'kosc','trup') else 48 if has(n,'goblin') else 0
 if slot=='helmet':return 64 if has(n,'goblin') else 65 if has(n,'smocz','burz','kraken') else 66 if has(n,'kos','czasz') else 67 if has(n,'wilcz','wilk') else 13 if has(n,'kaptur') else 15 if has(n,'koron') else 14 if has(n,'mage','mag') else 12
 if slot=='armor':return 69 if has(n,'kraken','wod') else 68 if has(n,'burz','smocz') else 71 if has(n,'ogn','zar') else 70 if has(n,'low','tropic','lesn','zwiadow') else 18 if has(n,'szata','robe','mag') else 17 if has(n,'skór','skor') else 16
 if slot=='legs':return 72 if has(n,'widmo','duch') else 73
 if slot=='gloves':return 75 if has(n,'wod','lod','mroz') else 74 if has(n,'goblin') else 20 if has(n,'stal','pancerz') else 19
 if slot=='boots':return 77 if has(n,'widmo','duch') else 76 if has(n,'smocz','ogn') else 21
 if slot=='offhand':return 79 if has(n,'burz','grom','kraken','wod') else 78 if has(n,'kos','nekro') else 63 if has(n,'fokus','kula','mrok') else 9 if has(n,'tarcz') else 10 if has(n,'koł','kolcz') else 11 if has(n,'puł','pulap') else 9
 if slot=='ring':return 85 if has(n,'burz','grom','elek') else 84 if has(n,'mrok','cien','widm') else 83 if has(n,'mag','arkan') else 24
 if slot=='amulet':return 80 if has(n,'truc','skorp','jad') else 82 if has(n,'wod','kraken') else 81 if has(n,'ksiezyc','moon') else 27 if has(n,'taliz') else 25 if has(n,'medal') else 26
 if t=='consumable':return (100 if d['mana']<=50 else 101 if d['mana']<=100 else 102 if d['mana']<=150 else 103) if d.get('mana') else (96 if d['heal']<=50 else 97 if d['heal']<=100 else 98 if d['heal']<=150 else 99) if d.get('heal') else 136 if has(n,'jad','truc','odtrut') else 31
 if t=='rune':return 86 if has(n,'ogn','zar','moc') else 41
 if t=='ammo':return 10
 if has(n,'goblinear','ucho'):return 104
 if has(n,'ogon','rattail','tail'):return 105
 if has(n,'mieso','meat'):return 106
 if has(n,'pelt','futro','sier','wilcza skora'):return 107
 if has(n,'pancerz owada','carapace','chityn'):return 110
 if has(n,'oko','eye'):return 111 if has(n,'bazyl') else 92
 if has(n,'złom','zlom','scrap','stare zelazo'):return 112
 if has(n,'brokenblade','odlamek ostrza'):return 113
 if has(n,'monet','coin'):return 114
 if has(n,'plotno','płotno','roughcloth','tkanin'):return 115
 if has(n,'spidersilk','pajecz','jedwab'):return 116
 if has(n,'goblinmapscrap','fragment mapy','skrawek mapy'):return 118
 if has(n,'bloto','mud'):return 117
 if has(n,'drewno','wood'):return 119
 if has(n,'moonherb','ksiezycowe ziele'):return 121
 if has(n,'rareherb','rzadkie ziola'):return 122
 if has(n,'waterherb','wodne ziola'):return 123
 if has(n,'korzen','roots'):return 124
 if has(n,'herb','ziol','ziele'):return 120
 if has(n,'grzyb','mushroom'):return 126 if has(n,'ziel') else 125
 if has(n,'gravedust','pyl grobow'):return 130
 if has(n,'ectoplasm','ektoplaz'):return 131
 if has(n,'stormcore','rdzen burz'):return 133
 if has(n,'embercore','rdzen zar'):return 134
 if has(n,'runeshard','odlamek runiczny'):return 135
 if has(n,'venomgland','gruczol jadowy'):return 136
 if has(n,'krakenpearl','perla glebin'):return 137
 if has(n,'demonblood','krew demon'):return 140
 if has(n,'serce','heart'):return 142
 if has(n,'relic','relikt'):return 143
 if has(n,'recept','pergamin','zwoj','mapa','dokument'):return 45
 if has(n,'sluz','ektoplaz','esencja','duch','widm'):return 43
 if has(n,'ryb','karp','sledz','sum'):return 47
 if has(n,'kryszt','diament','gem','klejnot'):return 132 if has(n,'odlam','kryszt') else 40
 if has(n,'run','pieczec','sigil'):return 94 if has(n,'burz','grom') else 41
 if has(n,'kiel','zab','fang','pazur','szpon','claw'):return 109 if has(n,'pazur','szpon','claw') else 108
 if has(n,'luska','scale','pancerz'):return 91 if has(n,'smocz','burz') else 39
 if has(n,'mack','tentacle','kraken'):return 89
 if has(n,'skorpion','jad','venom','truciz','toksyn'):return 93 if has(n,'flakon','eliks','ekstrakt') else 80 if has(n,'naszy','amulet') else 88
 if has(n,'pior','feather','skrzydl'):return 90 if has(n,'gryf') else 127
 if has(n,'oko','eye'):return 92
 if has(n,'rog','horn'):return 42
 if has(n,'kos','bone','czasz','szkielet'):return 129 if has(n,'czasz','skull') else 128
 if has(n,'sier','futr','skór','skor','wolf','wilk'):return 35
 if has(n,'korzen','root','drewno'):return 34
 if has(n,'zio','herb','traw','lisc','roslin'):return 121 if has(n,'ksiezyc','moon') else 122 if has(n,'rare','rzad') else 120
 if has(n,'grzyb','mushroom'):return 94
 if has(n,'monet','zlot','coin'):return 114
 if has(n,'serc','krw','blood'):return 40
 if has(n,'kwiat','flower'):return 33
 if has(n,'relikt','artefakt'):return 95
 return 40 if has(n,'stal','metal','złom','zlom','odłam','odlam') else 35 if has(n,'materia','płotno','plotno','skór') else 42

def theme(n):
 n=plain(n)
 if has(n,'burz','grom','nieb','blysk'):return (135,200,250)
 if has(n,'lod','mroz','szron','widm','wod','kraken'):return (100,200,232)
 if has(n,'ogn','zar','popiel','feniks','lawa'):return (240,124,62)
 if has(n,'jad','truc','ziel','lesn','tropic','mech'):return (125,199,86)
 if has(n,'cien','mrok','nekro','kos','pustk'):return (173,111,215)
 if has(n,'krw','goblin','demon'):return (214,84,76)
 return None

manifest={}
for id,d in items.items():
 idx=choose(d);target=out/(id+'.webp');
 if '--force' not in sys.argv and target.exists() and target.stat().st_size>100:
  manifest[id]={'file':'assets/item-art/'+id+'.webp','sheet':idx//48+1,'tile':idx%48};continue
 src=tiles[idx];seed=int.from_bytes(hashlib.sha256(id.encode()).digest()[:8],'big');rng=random.Random(seed)
 # A differently framed engraving/glint and a restrained tint make every ID its own image.
 alpha=src.getchannel('A');box=alpha.getbbox();src=src.crop(box) if box else src
 maxwh=max(src.size);canvas=Image.new('RGBA',(112,112));scale=rng.uniform(.73,.89);size=(max(1,int(src.width*scale*100/maxwh)),max(1,int(src.height*scale*100/maxwh)))
 src=src.resize(size,Image.Resampling.LANCZOS)
 tint=theme(d['name']+' '+id)
 if tint:
  solid=Image.new('RGB',size,tint);rgb=src.convert('RGB');rgb=Image.blend(rgb,Image.blend(rgb,solid,.40),.17);src=Image.merge('RGBA',(*rgb.split(),src.getchannel('A')))
 src=ImageEnhance.Contrast(src).enhance(rng.uniform(.95,1.06))
 src=src.rotate(rng.uniform(-3.5,3.5),Image.Resampling.BICUBIC,expand=True)
 x=(112-src.width)//2+rng.randint(-2,2);y=(112-src.height)//2+rng.randint(-2,2)
 canvas.alpha_composite(src,(x,y))
 # Tiny hand-engraved glints are keyed to the item, restrained enough for silhouettes to read.
 mark=Image.new('RGBA',canvas.size);draw=ImageDraw.Draw(mark)
 glint=tint or (227,192,113)
 for j in range(2+(seed%3)):
  gx=rng.randint(20,92);gy=rng.randint(16,92);rad=rng.choice((1,2));draw.ellipse((gx-rad,gy-rad,gx+rad,gy+rad),fill=(*glint,30+10*(j%2)))
 canvas=Image.alpha_composite(canvas,mark)
 filename=id+'.webp';temporary=out/(id+'.pending.webp');canvas.save(temporary,'WEBP',quality=84,method=4);temporary.replace(out/filename)
 manifest[id]={'file':'assets/item-art/'+filename,'sheet':idx//48+1,'tile':idx%48}
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f'{len(items)} individual WebP images generated; {len(set(m["file"] for m in manifest.values()))} distinct files')
