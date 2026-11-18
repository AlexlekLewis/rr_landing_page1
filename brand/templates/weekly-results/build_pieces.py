"""Turn Alex's weekly results packs (unzipped) into pieces.json for the RRA-standard renderer.
Usage: python3 build_pieces.py <unzipped-packs-dir> <post-date YYYY-MM-DD> > pieces.json
Each pack folder has sources/*.csv (data) and captions/*.txt (balls/overs, opposition)."""
import csv, glob, json, os, re, sys, datetime
root, postdate = sys.argv[1], sys.argv[2]

PACKS = {  # folder -> (audience tag, chip text, group phrase, program key)
 '03-feed':            ('ALL-ACADEMY',        'ALL ACADEMY',                 None,                None),
 'elite-melbourne':    ('ELITE-MELBOURNE',    'ELITE PROGRAM · MELBOURNE',   'ELITE PROGRAM',     'Elite 12-Week Program'),
 'perf-cranbourne':    ('PERFORMANCE-CRANBOURNE-NORTH','PERFORMANCE · CRANBOURNE NTH','PERFORMANCE SQUAD','Performance Squad | VIC | Cranbourne North'),
 'perf-mickleham':     ('PERFORMANCE-MICKLEHAM','PERFORMANCE · MICKLEHAM',   'PERFORMANCE SQUAD', 'Performance Squad | VIC | Mickleham'),
 'power-hallam':       ('POWER-HALLAM',       'POWER GAME · HALLAM',         'POWER GAME SQUAD',  'Preseason Power Game | VIC | Hallam'),
 'power-mickleham':    ('POWER-MICKLEHAM',    'POWER GAME · MICKLEHAM',      'POWER GAME SQUAD',  'Preseason Power Game | VIC | Mickleham'),
 'power-williamstown': ('POWER-WILLIAMSTOWN', 'POWER GAME · WILLIAMSTOWN',   'POWER GAME SQUAD',  'Preseason Power Game | VIC | Williamstown'),
 'spin-cranbourne':    ('SPIN-CRANBOURNE-NORTH','SPIN CLUB · CRANBOURNE NTH','SPIN CLUB',         'Spin Club | VIC | Cranbourne North'),
}
PROGRAM_TITLE = {'Elite 12-Week Program':'Elite Program','Performance Squad':'Performance Squad',
                 'Preseason Power Game':'Power Game','Spin Club':'Spin Club'}

# detail lines from every caption: balls / overs / keeper, and opposition + status
detail, opp = {}, {}
for f in glob.glob(os.path.join(root,'*','captions','*.txt'))+glob.glob(os.path.join(root,'*','*','captions','*.txt')):
    lines=[l.strip() for l in open(f)]
    for i,l in enumerate(lines):
        m=re.match(r"^([A-Z][A-Za-z' .-]+): (.+)$",l)
        if not m or m.group(1) in ('Scorecard','Coverage note','Bowling'): continue
        name,d=m.groups(); detail.setdefault(name,set()).add(d)
        if i+1<len(lines) and ' v ' in lines[i+1]:
            t=lines[i+1].rstrip('.'); opp[name]=t.split(' | ')[0].split(' v ',1)[1]

def figure(row):
    name, ret = row['Player'], row['Return']
    d=' '.join(sorted(detail.get(name,[]),key=len)[-1:])
    balls=re.search(r'from (\d+) balls',d); overs=re.search(r'from ([\d.]+) overs',d)
    keep=re.search(r'(\d+) verified keeper dismissal',d)
    bat=re.match(r'^(\d+\*?)',ret); bowl=re.match(r'^(\d+)/(\d+)',ret)
    f={'kind':'keeper','big':keep.group(1) if keep else '','unit':'DISMISSAL' if keep and keep.group(1)=='1' else 'DISMISSALS','chip':''}
    if bowl:
        f={'kind':'bowl','big':bowl.group(1),'unit':'WICKET' if bowl.group(1)=='1' else 'WICKETS',
           'fig':f"{bowl.group(1)}/{bowl.group(2)}",'chip':f"{bowl.group(1)}/{bowl.group(2)}"+(f" · {overs.group(1)} OVERS" if overs else '')}
    elif bat and 'RUNS' in ret or (bat and 'NOT OUT' in ret):
        n=bat.group(1)
        f={'kind':'bat','big':n,'unit':'NOT OUT' if n.endswith('*') else 'RUNS','fig':n,
           'chip':f"{n} OFF {balls.group(1)}" if balls else f"{n} RUNS"}
        if keep: f['chip']+=f" · {keep.group(1)} CATCH"+('ES' if keep.group(1)!='1' else '')
    elif keep:
        f['chip']=f"{keep.group(1)} KEEPER DISMISSAL"+('S' if keep.group(1)!='1' else '')
    return f

def day(iso):
    d=datetime.date.fromisoformat(iso); return d.strftime('%a %-d %b')

def item(row, prog_key):
    progs=[p.strip() for p in row['Program connections'].split(';')]
    p=next((x for x in progs if prog_key and x.startswith(prog_key.split(' | ')[0]) and (prog_key in x or '|' not in prog_key)), progs[0])
    if row['Bowling coaching credit'] and prog_key and prog_key.startswith('Spin'): p=row['Bowling coaching credit'].replace('Bowling: ','')
    parts=[s.strip() for s in p.split('|')]
    f=figure(row)
    return {'name':row['Player'],'team':row['Team'],'opp':opp.get(row['Player'],''),
            'day':day(row['Date']),'inprog':row['Status']=='In progress',
            'program':PROGRAM_TITLE.get(parts[0],parts[0]),'centre':parts[-1] if len(parts)>1 else '',
            'scorecard':row['Public scorecard'],**f}

pieces=[]
for folder,(tag,chip,group,prog) in PACKS.items():
    d=os.path.join(root,folder)
    if not os.path.isdir(d): continue
    order=['top-performances','highlights-mosaic']+sorted(os.path.basename(x)[:-4] for x in glob.glob(d+'/sources/b*.csv'))
    for n,key in enumerate([k for k in order if os.path.exists(f'{d}/sources/{k}.csv')],1):
        rows=[item(r,prog) for r in csv.DictReader(open(f'{d}/sources/{key}.csv'))]
        kinds={r['kind'] for r in rows}
        if key=='top-performances':
            head=('TOP','KNOCKS') if kinds=={'bat'} else ('TOP','SPELLS') if kinds=={'bowl'} else ('STAND','OUTS')
            t='list'
        elif key=='highlights-mosaic': head,t=('WEEKEND','WRAP'),'list'
        else:
            r=rows[0]; head,t=(r['big'],r['unit']),'spot'
        pieces.append({'file':f"{postdate}_RESULTS_{tag}_{n:02d}-{key}",'type':t,'head':head,
            'chip1':'13–15 NOVEMBER','chip2':chip,'group':group,'items':rows,'source':f'{folder}/{key}'})
json.dump(pieces,sys.stdout,indent=1,ensure_ascii=False)
