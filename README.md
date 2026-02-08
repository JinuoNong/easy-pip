# Easy Pip

Easy Pip 是一款基于 Electron + React 的 Python 包可视化管理工具，提供安装、卸载、更新、环境切换、依赖树可视化、批量升级、安全扫描等功能，面向 Windows 桌面用户。

## 功能特性

### 包管理
- **已安装包管理**：列表展示、搜索过滤、单个与批量卸载、单包更新
- **搜索与安装**：查询 PyPI，支持指定版本安装
- **批量升级**：预览可升级包并一键批量更新
- **包版本对比**：查看不同版本之间的差异和变更历史

### 环境与依赖
- **依赖树可视化**：按包生成依赖关系树
- **依赖兼容性检查**：检测已安装包的版本兼容性和潜在冲突
- **环境管理**：自动检测 Python 环境，支持手动切换
- **镜像源管理**：配置 pip 镜像源

### 工具与维护
- **requirements 管理**：导入、预览、安装与导出 requirements.txt
- **安全扫描**：优先使用 pip-audit，失败时回退到 pip check + outdated
- **智能清理**：清理未使用的包、过期缓存和无用依赖
- **缓存管理**：管理 pip 下载缓存
- **历史与日志**：查看命令执行记录、状态、耗时与输出

### 其他
- **任务队列**：串行执行 pip 任务并可视化查看进度
- **双语界面**：支持中文和英文切换
- **虚拟滚动**：优化大数据量包列表的渲染性能

## 环境要求

- **操作系统**：Windows 10/11（64位）
- **Python**：已安装 Python 3.8 或更高版本
- **网络**：可联网访问 PyPI 与依赖下载源

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

启动后会自动打开 Electron 窗口，代码修改会自动热更新。

### 一键打包（推荐）

```powershell
.\rebuild.ps1
```

或者使用 CMD：

```cmd
rebuild.bat
```

脚本会自动：
1. 停止相关进程
2. 清理旧构建文件
3. 构建前端代码
4. 打包应用（解决文件锁定问题）
5. 输出到 build 目录

### 手动打包

```bash
# 清理并构建
npm run clean && npm run build

# 打包
npx electron-builder --win --x64
```

**注意**：如果遇到文件锁定问题，请使用一键打包脚本。

## 构建输出

打包完成后，文件位于 `dist-build-v17/` 目录：

```
dist-build-v17/
├── Easy Pip 1.0.7.exe      # 便携安装包（双击即可运行）
└── win-unpacked/           # 解压后的完整文件
    ├── Easy Pip.exe       # 主程序
    └── resources/         # 资源文件
```

## 目录结构

```
easy-pip/
├── electron/              # Electron 主进程
│   ├── main.js           # 应用入口
│   └── preload.js        # 预加载脚本
├── src/                   # React 前端源码
│   ├── components/       # UI 组件
│   ├── App.jsx           # 主应用组件
│   ├── i18n.jsx          # 国际化配置
│   └── main.jsx          # 前端入口
├── dist/                  # 前端构建产物
├── dist-build-v17/        # 打包输出目录
│   ├── Easy Pip x.x.x.exe
│   └── win-unpacked/
├── TECHNICAL_DOC/         # 技术文档
├── rebuild.ps1            # 一键打包脚本（推荐）
├── rebuild.bat            # CMD 批处理脚本
├── package.json           # 项目配置
└── vite.config.js         # Vite 构建配置
```

## 技术栈

- **前端框架**：React 19 + Vite 7
- **UI 组件库**：Ant Design 6
- **图表库**：Recharts
- **桌面框架**：Electron 40
- **打包工具**：electron-builder 26
- **构建工具**：Vite

## 常见问题

### Q: 打包时提示文件被占用怎么办？

A: 这是 Windows 文件锁定机制导致的。请使用一键打包脚本 `.\rebuild.ps1`，脚本会自动处理锁定问题。

### Q: 安全扫描功能无法使用？

A: 安全扫描依赖 pip-audit 包。若未安装，会自动回退到 pip check + outdated 进行基础检查。建议安装 pip-audit 以获得更好的安全检测能力。

### Q: 检测不到 Python 环境怎么办？

A: 请在"环境管理"功能中手动输入 python.exe 的路径。工具会自动验证路径有效性。

### Q: 如何切换语言？

A: 在应用设置中可以切换中文/英文界面，语言更改会立即生效。

### Q: 便携版无法启动？

A: 请检查：
1. 系统是否为 64 位 Windows
2. 是否安装了 Visual C++ 运行库
3. 杀毒软件是否拦截了应用

### Q: 构建速度慢怎么办？

A: 建议：
1. 确保使用 SSD 硬盘
2. 关闭不必要的后台程序
3. 使用一键打包脚本避免重复尝试

## 开发指南

### 添加新功能

1. 在 `src/components/` 创建组件
2. 在 `src/App.jsx` 中添加路由/菜单
3. 在 `src/i18n.jsx` 添加国际化文案
4. 在 `electron/preload.js` 添加需要的 API
5. 在 `electron/main.js` 实现对应逻辑
6. 更新相关文档

### 运行测试

```bash
# 开发模式测试
npm run dev

# 构建测试
npm run build
```

## License

MIT

---

**项目地址**：https://github.com/JinuoNong/easy-pip

**问题反馈**：如有问题请提交 Issue 或 Pull Request