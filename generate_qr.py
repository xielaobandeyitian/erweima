import qrcode
import json
from pathlib import Path
from content_data import MODULES

base = Path(__file__).parent
pages_dir = base / 'pages'
pages_dir.mkdir(exist_ok=True)

# 这里填入你部署后的正式网址，例如：
# https://your-name.github.io/your-repo
# 或者 https://your-domain.com
base_url = 'https://xielaobandeyitian.github.io/erweima'


def render_module_shell(module_data, module_index):
    modules_json = json.dumps(MODULES, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang=\"zh-CN\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>{module_data['title']}</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{ font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif; margin: 0; background: linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%); color: #0f172a; -webkit-tap-highlight-color: transparent; }}
    a, button, input, select, textarea {{ -webkit-tap-highlight-color: transparent; }}
    .page {{ max-width: 900px; margin: 0 auto; padding: 16px 12px 32px; }}
    .hero {{ background: linear-gradient(135deg, #2563eb, #60a5fa); color: white; border-radius: 24px; padding: 18px; box-shadow: 0 14px 30px rgba(37,99,235,0.16); }}
    .hero h1 {{ margin: 0 0 6px; font-size: 22px; }}
    .hero p {{ margin: 0; line-height: 1.6; font-size: 14px; opacity: 0.95; }}
    .shell {{ max-width: 900px; margin: 0 auto; padding: 16px 12px 32px; }}
    .crumbs {{ margin: 12px 0 10px; font-size: 12px; color: #64748b; }}
    .crumbs a {{ color: #2563eb; text-decoration: none; }}
    .stack {{ display: grid; gap: 12px; }}
    .card, .node-card {{ display: block; padding: 16px 18px; border-radius: 18px; background: white; color: #0f172a; text-decoration: none; box-shadow: 0 8px 20px rgba(15,23,42,0.05); min-height: 60px; touch-action: manipulation; user-select: none; }}
    .card:active, .node-card:active, .btn:active {{ transform: scale(0.98); }}
    .card strong, .node-card strong {{ display: block; font-size: 16px; font-weight: 700; }}
    .card span, .node-card span {{ display: block; color: #6b7280; font-size: 13px; margin-top: 4px; }}
    .badge {{ display: inline-block; padding: 4px 8px; border-radius: 999px; background: #eff6ff; color: #2563eb; font-size: 12px; margin-bottom: 6px; }}
    .actions {{ display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }}
    .btn {{ display: inline-block; padding: 12px 16px; border-radius: 999px; text-decoration: none; font-weight: 700; color: #2563eb; background: #eff6ff; font-size: 14px; min-height: 44px; line-height: 1.2; touch-action: manipulation; }}
    .detail-box {{ background: white; border-radius: 20px; padding: 16px; box-shadow: 0 8px 20px rgba(15,23,42,0.05); }}
    .detail-box h2 {{ margin: 0 0 8px; font-size: 18px; }}
    .detail-box p {{ line-height: 1.7; font-size: 14px; color: #4b5563; margin: 0; }}
    .detail-box img, .detail-box video {{ width: 100%; max-height: 320px; object-fit: cover; border-radius: 14px; margin-top: 10px; }}
    .empty {{ padding: 16px; background: white; border-radius: 16px; color: #64748b; }}
    .mini-bar {{ display: flex; justify-content: space-between; align-items: center; padding: 10px 0 6px; font-size: 12px; color: #64748b; }}
    @media (max-width: 700px) {{ .shell {{ padding: 12px 10px 28px; }} .hero {{ padding: 14px; }} }}
  </style>
</head>
<body>
  <div class=\"shell\" id=\"app\"></div>
  <script>
    window.MODULE_DATA = {modules_json};
    window.DEFAULT_MODULE_ID = 'module-0{module_index}';
  </script>
  <script src=\"../app.js\"></script>
</body>
</html>
"""


for module_index, module_data in enumerate(MODULES, start=1):
    page_name = f'page-{module_index:02d}.html'
    url = f'{base_url}/pages/{page_name}'
    img = qrcode.make(url)
    img.save(pages_dir / f'qr-{module_index:02d}.png')

    page_path = pages_dir / page_name
    page_path.write_text(render_module_shell(module_data, module_index), encoding='utf-8')

print('二维码已生成')
print(f'当前目标地址：{base_url}')
