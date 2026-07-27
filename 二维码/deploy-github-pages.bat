@echo off
setlocal
cd /d "%~dp0"

echo https://github.com/xielaobandeyitian/erweima.git

set /p REPO_URL=

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo 已完成推送，请到 GitHub 仓库的 Settings > Pages 开启部署。
