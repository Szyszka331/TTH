// World-space coordinates follow the dirt/cobblestone paths in assets/world.png.
// Only these corridors are walkable. The bridge is the only river crossing.
export const WORLD={width:1536,height:1024};
export const NODES={
 inn:[190,286],i1:[197,328],i2:[220,373],i3:[245,409],i4:[257,479],
 fork:[281,511],a1:[333,531],alchemist:[389,514],a2:[393,551],a3:[475,574],square:[558,578],
 g1:[602,561],g2:[609,500],g3:[601,441],guild:[599,389],west:[695,589],b1:[748,590],b2:[800,598],b3:[854,610],
 s1:[311,544],s2:[319,594],s3:[338,650],s4:[315,683],smith:[232,690],
 east:[897,622],forkEast:[997,638],e1:[1071,594],wolf:[1123,549],e2:[1181,498],e3:[1229,471],boar:[1283,435],
 e4:[1324,408],e5:[1306,384],e6:[1262,372],herbs:[1185,393],e7:[1255,355],wisp:[1301,321],
 r1:[1320,280],r2:[1350,254],r3:[1380,220],r4:[1365,189],guardian:[1349,164],
 t1:[1009,679],t2:[1001,733],t3:[1022,777],goblin:[1068,791],t4:[1008,803],t5:[973,820],chest:[945,837]
};
const chains=[
 [15,'inn','i1','i2','i3','i4','fork','a1','a2','a3','square','g1','west','b1'],
 [14,'a1','alchemist'],[19,'g1','g2','g3','guild'],
 [8,'fork','s1','s2','s3','s4','smith'],
 [12,'b1','b2','b3'],[16,'b3','east','forkEast','e1','wolf','e2','e3','boar','e4','e5','e6','e7','wisp','r1','r2','r3'],
 [11,'r3','r4','guardian'],[12,'e6','herbs'],
 [11,'forkEast','t1','t2','t3','t4','t5','chest'],[10,'t3','goblin']
];
export const ROADS=chains.flatMap(([radius,...ids])=>ids.slice(1).map((b,i)=>({a:ids[i],b,radius})));
export const ACCESS=Object.fromEntries(['inn','smith','alchemist','guild','herbs','chest','wolf','boar','goblin','slime','wisp','guardian'].map(id=>[id,id==='slime'?{x:897,y:622}:point(NODES[id])]));
export const SPAWN=toPercent(ACCESS.inn);
export const GATE=toPercent(ACCESS.guild);
export const SPEED=145;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function point(p){return {x:p[0],y:p[1]};}
export function fromPercent(p){return {x:p.x*WORLD.width/100,y:p.y*WORLD.height/100};}
export function toPercent(p){return {x:p.x/WORLD.width*100,y:p.y/WORLD.height*100};}
function projection(p,road){
 const a=point(NODES[road.a]),b=point(NODES[road.b]),dx=b.x-a.x,dy=b.y-a.y;
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));
 return {x:a.x+t*dx,y:a.y+t*dy};
}
export function isWalkable(p){return Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&ROADS.some(r=>distance(p,projection(p,r))<=r.radius+1e-7);}
export function nearestRoad(p){
 let best=null;
 for(const [index,r] of ROADS.entries()){const q=projection(p,r),d=distance(p,q);if(!best||d<best.distance)best={point:q,index,distance:d};}
 return best;
}
export function safePosition(percent){
 const p=fromPercent(percent||SPAWN);
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return {...SPAWN};
 return isWalkable(p)?toPercent(p):toPercent(nearestRoad(p).point);
}
// Dijkstra over the road graph; projection nodes avoid shortcuts at corners.
export function routeTo(start,end){
 if(!isWalkable(start)||!isWalkable(end))return [];
 const s=nearestRoad(start),e=nearestRoad(end),points={...Object.fromEntries(Object.entries(NODES).map(([id,p])=>[id,point(p)])),start:s.point,end:e.point};
 const links=Object.fromEntries(Object.keys(points).map(id=>[id,[]]));
 function link(a,b){const cost=distance(points[a],points[b]);links[a].push([b,cost]);links[b].push([a,cost]);}
 for(const r of ROADS)link(r.a,r.b);
 for(const [id,entry] of [['start',s],['end',e]]){const r=ROADS[entry.index];link(id,r.a);link(id,r.b);}
 if(s.index===e.index)link('start','end');
 const costs={start:0},previous={},unseen=new Set(Object.keys(points));
 while(unseen.size){const current=[...unseen].reduce((a,b)=>(costs[a]??Infinity)<=(costs[b]??Infinity)?a:b);if(!Number.isFinite(costs[current]))return [];unseen.delete(current);if(current==='end')break;
  for(const [next,cost] of links[current])if((costs[next]??Infinity)>costs[current]+cost){costs[next]=costs[current]+cost;previous[next]=current;}
 }
 const ids=['end'];while(ids[0]!=='start')ids.unshift(previous[ids[0]]);
 const path=[...ids.map(id=>points[id]),{...end}];let last=start;
 return path.filter(p=>{if(distance(last,p)<.01)return false;last=p;return true;});
}
// Substeps prevent tunnelling even when a tab stalls or a key is held at a wall.
export function moveOnRoad(position,dx,dy){
 let p={...position};const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/2));
 for(let i=0;i<steps;i++){
  const x=dx/steps,y=dy/steps,next={x:p.x+x,y:p.y+y};
  if(isWalkable(next)){p=next;continue;}
  const axes=Math.abs(x)>=Math.abs(y)?[[x,0],[0,y]]:[[0,y],[x,0]];
  for(const [ax,ay] of axes){const q={x:p.x+ax,y:p.y+ay};if(isWalkable(q))p=q;}
 }
 return p;
}
export function advanceRoute(position,route,budget){
 let p={...position},left=budget,travelled=0;
 while(route.length&&left>0){const target=route[0],d=distance(p,target);if(d<.001){route.shift();continue;}const step=Math.min(d,left),next=moveOnRoad(p,(target.x-p.x)/d*step,(target.y-p.y)/d*step),moved=distance(p,next);p=next;travelled+=moved;left-=step;if(step>=d-.001&&distance(p,target)<.1)route.shift();if(moved<.0001)break;}
 return {position:p,travelled};
}
export const DIRECTIONS={ArrowUp:'north',ArrowDown:'south',ArrowLeft:'west',ArrowRight:'east',w:'north',s:'south',a:'west',d:'east'};
export function keyDirection(key){return DIRECTIONS[key]||DIRECTIONS[key?.toLowerCase()]||null;}
export function inputVector(keys){const x=Number(keys.has('east'))-Number(keys.has('west')),y=Number(keys.has('south'))-Number(keys.has('north')),length=Math.hypot(x,y)||1;return {x:x/length,y:y/length};}
export function facing(dx,dy,last='south'){return !dx&&!dy?last:Math.abs(dy)>=Math.abs(dx)?dy>0?'south':'north':dx>0?'east':'west';}
export function nearLocation(percent,id){return !!ACCESS[id]&&distance(fromPercent(percent),ACCESS[id])<=26;}
