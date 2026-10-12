"""Create a standard ZIP with the complete, portable game and check every CRC."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parents[1]
output = root / 'dist' / 'downloads' / 'Time4Heroes_PIXEL_4_1.zip'
output.parent.mkdir(parents=True, exist_ok=True)
files = []
for directory in ('dist', 'tests', 'tools'):
    files.extend(p for p in (root / directory).rglob('*') if p.is_file() and 'downloads' not in p.parts and '__pycache__' not in p.parts)
files.extend(root / name for name in ('README.md', 'ART_DIRECTION.md', 'CHANGELOG.md', 'package.json'))
with ZipFile(output, 'w', compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for path in sorted(files):
        archive.write(path, Path('Time4Heroes_PIXEL_4_1') / path.relative_to(root))
with ZipFile(output) as archive:
    assert archive.testzip() is None, 'Archive CRC verification failed'
    assert 'Time4Heroes_PIXEL_4_1/dist/index.html' in archive.namelist()
print(f'{output}\n{len(files)} files · {output.stat().st_size} bytes\nSHA-256: {hashlib.sha256(output.read_bytes()).hexdigest()}')
