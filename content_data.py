from urllib.parse import quote


def make_svg_data_uri(label: str, bg: str = "#f5f9ff", accent: str = "#2563eb") -> str:
    svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
      <rect width='800' height='500' rx='32' fill='{bg}' />
      <rect x='40' y='40' width='720' height='420' rx='24' fill='white' stroke='{accent}' stroke-width='4' />
      <circle cx='400' cy='250' r='120' fill='{accent}' fill-opacity='0.12' />
      <path d='M280 260c24-72 112-72 136 0' stroke='{accent}' stroke-width='14' fill='none' stroke-linecap='round' />
      <circle cx='400' cy='220' r='36' fill='{accent}' />
      <text x='400' y='420' text-anchor='middle' font-family='Microsoft YaHei, Arial, sans-serif' font-size='36' fill='#1f2937'>{label}</text>
    </svg>"""
    return "data:image/svg+xml;charset=utf-8," + quote(svg)


MODULES = [
    {
        "id": "module-01",
        "title": "模块 1",
        "description": "这里展示第一个模块的图片、文字说明和视频入口。",
        "categories": [
            {
                "name": "类别1",
                "children": [
                    {
                        "type": "image",
                        "title": "图片示例",
                        "src": make_svg_data_uri("模块 1 · 类别 1"),
                        "caption": "可替换为实际图片文件。",
                    },
                    {
                        "type": "word",
                        "title": "说明文档",
                        "content": "这里可以放文字说明、Word 文档摘要或操作说明。",
                    },
                ],
            },
            {
                "name": "类别2",
                "children": [
                    {
                        "type": "video",
                        "title": "视频示例",
                        "video_url": "",
                        "description": "可替换为真实的视频链接或文件。",
                    },
                    {
                        "type": "word",
                        "title": "补充说明",
                        "content": "后续可以继续增加更多类别或子类别。",
                    },
                ],
            },
        ],
    },
    {
        "id": "module-02",
        "title": "模块 2",
        "description": "第二个模块用于展示另一组资源。",
        "categories": [
            {
                "name": "类别1",
                "children": [
                    {
                        "type": "image",
                        "title": "图片示例",
                        "src": make_svg_data_uri("模块 2 · 类别 1"),
                        "caption": "可替换为正式宣传图。",
                    }
                ],
            },
            {
                "name": "类别2",
                "children": [
                    {
                        "type": "word",
                        "title": "文字说明",
                        "content": "这里适合放简短介绍或操作步骤。",
                    },
                    {
                        "type": "video",
                        "title": "演示视频",
                        "video_url": "",
                        "description": "上传真实视频后，这里即可直接在线播放。",
                    },
                ],
            },
        ],
    },
    {
        "id": "module-03",
        "title": "模块 3",
        "description": "第三个模块适合放置数据汇总类内容。",
        "categories": [
            {
                "name": "类别1",
                "children": [
                    {
                        "type": "word",
                        "title": "项目说明",
                        "content": "可以放项目信息、流程说明或目标概览。",
                    }
                ],
            },
            {
                "name": "类别2",
                "children": [
                    {
                        "type": "image",
                        "title": "图片示例",
                        "src": make_svg_data_uri("模块 3 · 类别 2"),
                        "caption": "可用于展示流程图或成果图。",
                    },
                    {
                        "type": "word",
                        "title": "备注",
                        "content": "继续添加类别即可扩展到后台管理那种三级目录结构。",
                    },
                ],
            },
        ],
    },
    {
        "id": "module-04",
        "title": "模块 4",
        "description": "第四个模块适合展示多媒体内容。",
        "categories": [
            {
                "name": "类别1",
                "children": [
                    {
                        "type": "video",
                        "title": "介绍视频",
                        "video_url": "",
                        "description": "可以替换为 mp4 链接。",
                    }
                ],
            },
            {
                "name": "类别2",
                "children": [
                    {
                        "type": "image",
                        "title": "示意图",
                        "src": make_svg_data_uri("模块 4 · 类别 2"),
                        "caption": "可放置截图或设计稿。",
                    },
                    {
                        "type": "word",
                        "title": "详情",
                        "content": "这里的内容会按类别归档，便于后续维护。",
                    },
                ],
            },
        ],
    },
    {
        "id": "module-05",
        "title": "模块 5",
        "description": "第五个模块可用于展示更复杂的内容层级。",
        "categories": [
            {
                "name": "类别1",
                "children": [
                    {
                        "type": "word",
                        "title": "说明",
                        "content": "把类别继续往下扩，便于形成树状展示。",
                    }
                ],
            },
            {
                "name": "类别2",
                "children": [
                    {
                        "type": "image",
                        "title": "封面图",
                        "src": make_svg_data_uri("模块 5 · 类别 2"),
                        "caption": "可替换为正式封面。",
                    },
                    {
                        "type": "video",
                        "title": "展示视频",
                        "video_url": "",
                        "description": "后续可接入具体视频资源。",
                    },
                ],
            },
        ],
    },
    {
        "id": "module-06",
        "title": "模块 6",
        "description": "第六个模块可作为预留扩展入口。",
        "categories": [
            {
                "name": "类别1",
                "children": [
                    {
                        "type": "word",
                        "title": "预留说明",
                        "content": "你可以在这里继续添加新的分类。",
                    }
                ],
            },
            {
                "name": "类别2",
                "children": [
                    {
                        "type": "image",
                        "title": "预留图片",
                        "src": make_svg_data_uri("模块 6 · 类别 2"),
                        "caption": "以后可替换为真实内容。",
                    }
                ],
            },
        ],
    },
]
