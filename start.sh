#!/usr/bin/env bash
# 一键启动：中国经济资金流动全景图（纯前端）。
# 依赖缺失时自动 npm install，然后启动 Vite dev server。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# 端口/监听地址（如需修改请直接改这里，不读取外部环境变量以免被污染）
DEV_PORT=5175
DEV_HOST=0.0.0.0

log() { printf '\033[0;36m[start]\033[0m %s\n' "$*"; }
die() { printf '\033[0;31m[start]\033[0m %s\n' "$*" >&2; exit 1; }

command -v npm >/dev/null 2>&1 || die "未找到 npm，请先安装 Node.js 18+。"

# --- 0. 释放端口（防止旧实例残留） ---
log "释放端口 $DEV_PORT ..."
lsof -ti ":$DEV_PORT" | xargs kill -9 2>/dev/null || true
sleep 1

# --- 1. 前端依赖（仅缺失时安装） ---
if [ ! -d "$ROOT/node_modules" ]; then
  log "安装前端依赖 (npm install) ..."
  npm install --silent
fi

# --- 2. 启动 ---
cleanup() { log "停止服务 ..."; }
trap cleanup EXIT INT TERM

log "启动 http://localhost:${DEV_PORT} （${DEV_HOST}:${DEV_PORT}）"
exec npm run dev -- --host "$DEV_HOST" --port "$DEV_PORT"
