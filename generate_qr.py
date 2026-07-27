import qrcode
from pathlib import Path

base = Path(__file__).parent
pages_dir = base / 'pages'
pages_dir.mkdir(exist_ok=True)

# 这里填入你部署后的正式网址，例如：
# https://your-name.github.io/your-repo
# 或者 https://your-domain.com
base_url = 'https://xielaobandeyitian.github.io/erweima'

links = [
    ('qr-01.png', f'{base_url}/pages/page-01.html'),
    ('qr-02.png', f'{base_url}/pages/page-02.html'),
    ('qr-03.png', f'{base_url}/pages/page-03.html'),
    ('qr-04.png', f'{base_url}/pages/page-04.html'),
    ('qr-05.png', f'{base_url}/pages/page-05.html'),
    ('qr-06.png', f'{base_url}/pages/page-06.html'),
]

for filename, url in links:
    img = qrcode.make(url)
    img.save(pages_dir / filename)

print('二维码已生成')
print(f'当前目标地址：{base_url}')
