# GitHub Pages 部署说明

## 1. 准备仓库
1. 在 GitHub 新建一个仓库
2. 把当前目录中的所有文件上传到仓库

## 2. 打开 Pages 设置
1. 进入仓库页面
2. 点击 Settings → Pages
3. 在 Source 中选择 "Deploy from a branch"
4. 选择分支 `main`
5. 目录选择 `/root`
6. 点击 Save

## 3. 访问地址
部署完成后，访问地址类似：
`https://你的用户名.github.io/你的仓库名/`

## 4. 生成正式二维码
把 `generate_qr.py` 中的 `base_url` 改成上面的正式地址，然后运行：

```bash
python generate_qr.py
```

这样生成出来的 6 个二维码就会指向正式页面。