export const normalize=s=>String(s).toLowerCase().normalize('NFKC').replace(/[’‘]/g,"'").replace(/[.!?]/g,'').replace(/\s+/g,' ').trim();
export function acceptedAnswers(w){return [...new Set([w.word,...w.word.split(/\s*[,/]\s*/)].map(normalize))].filter(Boolean);}
export function isCorrect(answer,w){return acceptedAnswers(w).includes(normalize(answer));}
export function shuffled(a,rng=Math.random){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
export function optionsFor(word,pool,rng=Math.random){const seen=new Set([normalize(word.meaning)]);const others=shuffled(pool.filter(w=>normalize(w.word)!==normalize(word.word)),rng).filter(w=>{const k=normalize(w.meaning);if(seen.has(k))return false;seen.add(k);return true;}).slice(0,3);return shuffled([word,...others],rng);}
export function schedule(previous,correct,now=Date.now()) {const stage=correct?Math.min((previous?.stage||0)+1,6):0;const hours=correct?[0,24,72,168,336,720,1440][stage]:1/6;return {...previous,stage,last:now,due:now+hours*3600000,seen:(previous?.seen||0)+1,correct:(previous?.correct||0)+(correct?1:0),wrong:(previous?.wrong||0)+(correct?0:1)};}
export const localDay=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function filterWords(items,{topic='all',level='all',query='',saved=false},progress={},favorites=[]){const q=normalize(query);return items.filter(w=>(topic==='all'||w.topic===topic)&&(level==='all'||w.level===level)&&(!saved||favorites.includes(w.id))&&(!q||normalize(w.word+' '+w.meaning).includes(q)));}
export function dueWords(items,progress,now=Date.now()){return items.filter(w=>progress[w.id]&&progress[w.id].due<=now);}
export function sessionWords(pool,progress,n=20,review=false){if(review)return shuffled(pool).slice(0,n);return shuffled(pool.filter(w=>!progress[w.id])).concat(shuffled(pool.filter(w=>progress[w.id]))).slice(0,n);}
