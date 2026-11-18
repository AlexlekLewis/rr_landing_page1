"""Captions for every piece: python3 captions.py pieces.json outdir  -> <AUDIENCE>_CAPTIONS.txt"""
import json, sys, os, collections
pieces=json.load(open(sys.argv[1])); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
TAGS='#RoyalsAcademyMelbourne #RajasthanRoyals #HallaBol #ClubCricket'
def line(i):
    if i['kind']=='bowl':
        m,o=i['chip'].split(' · '); return f"{i['name']}: {m} from {o.lower()} for {i['team']}"
    if i['kind']=='bat':
        parts=i['chip'].split(' · '); r,b=parts[0].split(' OFF ')
        t=f"{i['name']}: {r} off {b} balls for {i['team']}"
        return t+(f", plus {parts[1].lower()} behind the stumps" if len(parts)>1 else '')
    return f"{i['name']}: {i['chip'].lower()} for {i['team']}"
by=collections.defaultdict(list)
for p in pieces: by[p['file'].split('_')[2]].append(p)
for aud,ps in by.items():
    txt=[f"RRA RESULTS | 13-15 NOVEMBER 2026 | {aud}",
         "Each graphic comes in two sizes: FEED-4x5 (Instagram + Facebook feed) and VERT-9x16 (Instagram Story, Reel cover, TikTok).",
         "Matches marked 'in progress' were still going when the results were collected: check the scorecard before posting.",""]
    for p in ps:
        items=p['items']; first=items[0]
        if p['type']=='spot':
            hook={'bat':f"{first['big'].rstrip('*')}{' not out' if first['big'].endswith('*') else ''} for {first['name'].split()[0]}.",
                  'bowl':f"{first['big']} wickets for {first['name'].split()[0]}.",'keeper':f"Sharp work from {first['name'].split()[0]}."}[first['kind']]
            body=[line(first)+('' if not first['inprog'] else ' (match in progress)')+'.']
        else:
            hook='What a weekend across our clubs.'
            body=[line(i)+(' (in progress)' if i['inprog'] else '')+'.' for i in items]
        proud='Proud of every player in our academy community and the way you represent your clubs.'
        txt+=['-'*60,p['file'],'',hook,'',*body,'',proud,'','Halla Bol!','',TAGS,'']
    open(os.path.join(out,f"2026-11-18_RESULTS_{aud}_CAPTIONS.txt"),'w').write('\n'.join(txt))
print('\n'.join(sorted(os.listdir(out))))
