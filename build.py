from pathlib import Path
import shutil
root=Path(__file__).resolve().parent
out=root/'dist'
if out.exists():shutil.rmtree(out)
out.mkdir()
for name in ['index.html','styles.css','art.js','story.js','engine.js','game.js','AGENTS.md','README.md','CHANGELOG.md']:
 shutil.copy2(root/name,out/name)
shutil.copytree(root/'assets',out/'assets')
print('Build complete: dist/')
