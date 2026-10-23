import subprocess,json,os
session=subprocess.check_output(['agent-browser','session','id','--scope','worktree','--prefix','next-dev-loop'],text=True).strip()
prefix=['agent-browser','--session',session,'--restore']
def run(*args):
 r=subprocess.run(prefix+list(args)+['--json'],text=True,capture_output=True,check=True)
 data=json.loads(r.stdout)
 assert data.get('success'),data
 return data.get('data')
def state():
 return run('eval', '({p:Number(document.querySelector("#journey").dataset.progress),playing:document.querySelector("#journey").dataset.playing,slider:Number(document.querySelector("input[type=range]").value),scroll:scrollY,width:document.documentElement.scrollWidth,viewport:innerWidth})')['result']
run('open','--enable','react-devtools',os.environ.get('TERRALA_URL','http://127.0.0.1:3000'))
run('wait','.scene-shell[data-model-ready="true"]')
run('set','viewport','1440','900')
run('click','button[data-step="0"]')
run('react','renders','start')
run('click','.trial-controls button')
run('wait','--fn','Number(document.querySelector("#journey").dataset.progress)>0.12')
run('click','.trial-controls button')
a=state();assert a['playing']=='false' and a['p']>.12,a
# Read on separate frame cycles, without changing UI.
run('wait','300')
b=state();assert a['p']==b['p'],(a,b)
profile=run('react','renders','stop')
open('/tmp/terrala-playback-render-report.json','w').write(json.dumps(profile))
run('focus','input[type=range]')
run('press','End');a=state();assert a['p']==1 and a['slider']==1000,a
run('press','Home');a=state();assert a['p']==0 and a['slider']==0,a
run('click','button[data-step="2"]');a=state();assert abs(a['p']-.4)<.001 and a['slider']==400,a
run('scroll','down','500');a=state();assert a['p']>.4 and a['playing']=='false',a
run('scroll','up','700');b=state();assert b['p']<a['p'],(a,b)
run('click','button[data-step="5"]');a=state();assert a['p']==1,a
run('wait','300');b=state();assert b['p']==1,b
run('screenshot','/tmp/terrala-desktop-final.png')
run('set','viewport','390','844');a=state();assert a['p']==1 and a['width']==a['viewport'],a
run('click','button[data-step="1"]');a=state();assert abs(a['p']-.24)<.001,a
run('focus','input[type=range]');run('press','End');a=state();assert a['p']==1,a
run('screenshot','/tmp/terrala-mobile-final.png')
run('set','viewport','375','667');run('click','button[data-step="0"]')
a=run('eval','({bottom:document.querySelector(".caption").getBoundingClientRect().bottom,height:innerHeight,width:document.documentElement.scrollWidth,viewport:innerWidth})')['result']
assert a['bottom']<=a['height'] and a['width']==a['viewport'],a
run('screenshot','/tmp/terrala-mobile-small-final.png')
run('set','media','light','reduced-motion')
run('wait','--fn','document.querySelector("#journey").dataset.reduced==="true"')
a=state();assert a['p']==1 and a['playing']=='false',a
assert run('eval','document.querySelector("input[type=range]").disabled')['result']==True
run('screenshot','/tmp/terrala-reduced-motion.png')
run('set','media','light','no-preference')
run('click','button[data-step="0"]')
print('PASS: playback/pause, slider keyboard, stage seek, scroll forward/reverse, end hold, resize, 390x844 and 375x667 layout, reduced motion')
