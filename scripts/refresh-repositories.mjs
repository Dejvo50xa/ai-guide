import {readFile,writeFile} from 'node:fs/promises';
const path=new URL('../src/data/repositories.json',import.meta.url);
const repos=JSON.parse(await readFile(path,'utf8'));
let failures=0;
for(const repo of repos){
  try{
    const response=await fetch('https://api.github.com/repos/'+repo.id,{headers:{Accept:'application/vnd.github+json','User-Agent':'PromptujAI-catalog'},signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const data=await response.json();
    if(!Number.isSafeInteger(data.stargazers_count))throw new Error('Invalid metadata');
    Object.assign(repo,{stars:data.stargazers_count,checkedAt:new Date().toISOString(),pushedAt:data.pushed_at,archived:data.archived});
    console.log('Updated '+repo.id);
  }catch(error){failures++;console.error(repo.id+': '+error.message+'; keeping dated snapshot');}
}
await writeFile(path,JSON.stringify(repos,null,2)+'\n');
if(failures)process.exitCode=1;
