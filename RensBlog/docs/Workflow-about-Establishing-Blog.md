# 我的博客建设流程

### 前置介绍1：文件目录及其作用

```
RensBlog/                          # 项目根目录（VitePress 博客站点）
├── docs/                          # VitePress 项目文档根目录
│   ├── .vitepress/                # VitePress 配置与构建输出目录
│   │   ├── cache/                 # 构建缓存目录
│   │   │   └── deps/              # 依赖缓存（Vue、VueUse 等）
│   │   ├── dist/                  # 静态站点构建输出目录（可部署）
│   │   │   ├── assets/            # 构建后的 JS/CSS/字体资源
│   │   │   ├── 404.html           # 404 错误页面
│   │   │   ├── index.html         # 首页 HTML
│   │   │   └── ...                # 各页面的预渲染 HTML
│   │   ├── theme/                 # 自定义主题目录
│   │   │   ├── index.ts           # 主题入口配置
│   │   │   └── style.css          # 自定义样式
│   │   └── config.mts             # 站点配置文件（可调标题、导航、侧边栏等）
│   ├── api-examples.md            # API 示例页面
│   ├── firstdemo.md               # 自定义演示页面
│   ├── index.md                   # 站点首页（访问 / 时显示）
│   └── markdown-examples.md       # Markdown 语法示例页面
├── node_modules/                  # 项目依赖包目录
├── package.json                   # 项目配置与脚本（dev/build/preview）
└── package-lock.json              # 依赖锁定文件
```

 **原理** ：VitePress 使用 **基于文件的路由** ——每个 `.md` 文件自动对应一个 HTML 页面。例如：

* `docs/index.md` → `/index.html`（访问 `/`）
* `docs/api-examples.md` → `/api-examples.html`

`docs` 目录是 VitePress 的 **项目根目录** ，`.vitepress` 目录是 **保留目录** ，存放配置文件、缓存和构建输出。

## 前置介绍2：技术栈

**最终实现框架是：VitePress v1.6.4构建+Github托管+Cloudflare部署**

```
┌─────────────┐     push/commit      ┌─────────────┐     自动构建/部署      ┌─────────────┐
│   本地电脑   │ ───────────────────→ │   GitHub    │ ───────────────────→ │  Cloudflare │
│  (开发环境)  │                      │  (代码仓库)  │                      │  (托管平台)  │
└─────────────┘                      └─────────────┘                      └─────────────┘
       ↑                                                                    │
       └────────────────────  访问 https://your-site.pages.dev ←────────────┘
```

| 层级           | 技术              | 说明                                                           |
| -------------- | ----------------- | -------------------------------------------------------------- |
| 静态站点生成器 | VitePress v1.6.4  | 基于 Vite + Vue 3 的静态站点构建工具，专为文档和博客设计       |
| 搜索能力       | Algolia DocSearch | 内置支持，通过`@algolia/*` 包提供文档搜索功能                |
| 包管理器       | npm               | 使用`package-lock.json` 锁定依赖版本                         |
| 代码托管       | Github            | 作为代码仓库，方便本地修改上传，且作为Cloudflare的网页索取地址 |
| 网页部署       | Cloudflare        | 检测到 GitHub 代码更新后，自动执行构建命令，生成全新的网站内容 |

## 前置介绍3：常用命令速查（npm 版）

| 命令                        | 作用                                |
| --------------------------- | ----------------------------------- |
| `npm run docs:dev`        | 启动开发服务器（实时预览 + 热更新） |
| `npm run docs:build`      | 构建静态 HTML 文件到`dist` 目录   |
| `npm run docs:preview`    | 本地预览构建后的站点                |
| `npm --version`           | 查询npm版本                         |
| `npx vitepress --version` | 查询vitepress版本                   |

## 第一步：环境准备

### 1.1 安装 Node.js

**操作**：访问 [Node.js 官网](https://nodejs.org/) 下载并安装 **Node.js 22 及以上版本**。安装完成后，打开终端（VS Code 内置终端或系统终端），输入以下命令验证：

```bash
node -v
```

下载npm的指令：

```bash
npm install npm -g npm@<版本号>
```

如果输出版本号（如 `v22.x.x`），说明安装成功。

**原理**：VitePress 是基于 Node.js 构建的工具，需要 Node.js 运行时环境来执行安装、构建和开发服务器等操作。VitePress 是**仅 ESM（ECMAScript Module）** 的软件包，要求 Node.js 22+ 才能完整支持 ESM 模块规范。

### 1.2 确认 npm 已安装

**操作**：在终端中输入以下命令验证 npm 是否随 Node.js 一起安装成功：

```bash
npm -v
```

**原理**：npm 是 Node.js 的默认包管理器，随 Node.js 自动安装。它是我们接下来安装 VitePress 和管理项目依赖的核心工具。

### 1.3 安装 VS Code 及必要插件

**操作**：

1. 如果尚未安装，访问 [VS Code 官网](https://code.visualstudio.com/) 下载安装。
2. 打开 VS Code，点击左侧活动栏的**扩展图标**（或按 `Ctrl+Shift+X`），搜索并安装以下插件：

| 插件名称                      | 搜索关键词                         | 作用                                                          |
| :---------------------------- | :--------------------------------- | :------------------------------------------------------------ |
| **Volar**               | `Vue.volar`                      | Vue 3 官方语言支持，能解析`.md` 文件中的 Vue 语法和组件提示 |
| **Markdown All in One** | `yzhang.markdown-all-in-one`     | 提供 Markdown 快捷键、目录生成、标题导航等增强功能            |
| **markdownlint**        | `davidanson.vscode-markdownlint` | Markdown 语法规范检查，自动提示格式错误                       |

**原理**：Volar 是 Vue 3 + Vite 生态的官方语言服务器，它让 VS Code 能够识别 VitePress 中 Markdown 文件里嵌入的 Vue 语法，提供代码高亮、智能提示和错误检查。后两个插件大幅提升 Markdown 写作体验。

---

## 第二步：创建项目

### 2.1 创建项目目录并用 VS Code 打开

**操作**：

1. 在桌面或你喜欢的位置新建一个文件夹，例如 `my-blog`。
2. 打开 VS Code，点击 **File → Open Folder**，选择刚才创建的 `my-blog` 文件夹并打开。
3. 在 VS Code 中按 ``Ctrl+` ``（或点击 **Terminal → New Terminal**）打开内置终端。

**原理**：VS Code 内置终端会自动继承当前项目的环境变量，确保后续执行的命令都在项目目录下生效。在项目根目录打开终端是后续所有操作的基础。

### 2.2 初始化 package.json

**操作**：在 VS Code 终端中执行：

```bash
npm init -y
```

（`-y` 表示所有选项按默认值快速生成，无需手动回车确认）

**原理**：`npm init -y` 会生成 `package.json` 文件，这是 Node.js 项目的**清单文件**，记录项目名称、版本、依赖包和脚本命令等信息。VitePress 需要依赖此文件来管理所有安装的包和自定义脚本。

### 2.3 修改 package.json（关键步骤）

**操作**：打开项目根目录下的 `package.json`，确保包含以下配置：

```json
{
  "type": "module",
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

（如果你已经通过 `npm init -y` 生成了默认内容，直接在原有内容上修改或添加这三项即可。）

**原理**：`"type": "module"` 告诉 Node.js 该项目使用 **ES Module** 规范。VitePress 是纯 ESM 包，如果不加这行，后续的配置文件（如 `.vitepress/config.js`）中的 `import` 语法会被当作 CommonJS 解析，导致 `require is not defined` 错误。`scripts` 中定义了三个常用命令，方便后续启动和构建。

---

## 第三步：安装 VitePress

### 3.1 安装 VitePress 到项目

**操作**：在 VS Code 终端中执行：

```bash
npm install -D vitepress
```

（这个过程可能需要几十秒，请耐心等待网络下载）

**原理**：`-D`（即 `--save-dev`）表示将 VitePress 安装为**开发依赖**（devDependencies）。因为 VitePress 是静态站点生成器，只在开发阶段使用（编写、预览、构建），网站上线后不需要它运行，所以放在开发依赖中更合理。安装完成后，`node_modules` 文件夹和 `package-lock.json` 文件会被创建。

---

## 第四步：初始化 VitePress 项目

### 4.1 运行初始化向导

**操作**：在 VS Code 终端中执行：

```bash
npx vitepress init
```

**原理**：`npx` 是 npm 自带的命令执行工具，它会自动在当前项目的 `node_modules/.bin` 目录中查找 `vitepress` 命令并执行，无需全局安装。如果不加 `npx`，系统会提示"找不到命令"。

向导会依次提问，推荐按以下方式回答：

| 问题                                                 | 推荐回答          | 说明                     |
| :--------------------------------------------------- | :---------------- | :----------------------- |
| Where should VitePress initialize the config?        | `./docs`        | 配置文件存放目录         |
| Where should VitePress look for your markdown files? | `./docs`        | Markdown 源文件目录      |
| Site title:                                          | 你的博客名称      | 网站标题（出现在左上角） |
| Site description:                                    | 你的博客描述      | 网站描述（大标题）       |
| Theme:                                               | `Default Theme` | 使用默认主题             |
| Use TypeScript for config and theme files?           | `Yes` 或 `No` | 推荐 Yes（更严谨）       |
| Add VitePress npm scripts to package.json?           | `Yes`           | 自动添加脚本             |
| Add a prefix for VitePress npm scripts?              | `Yes`           | 添加前缀（好像没遇到）   |
| Prefix for VitePress npm scripts:                    | `docs`          | 脚本前缀(好像没有)       |

**原理**：初始化向导会自动完成以下工作：

- 创建 `docs` 目录作为 VitePress 站点的**项目根目录**
- 在 `docs/.vitepress/` 中生成配置文件 `config.js`（或 `config.ts`）
- 在 `docs/` 中生成示例页面：`index.md`（首页）、`api-examples.md`、`markdown-examples.md`
- 自动更新 `package.json`，添加 `docs:dev`、`docs:build`、`docs:preview` 等脚本（如果你在向导中选择了 Yes）

### 4.2 查看生成的文件结构

**操作**：在 VS Code 左侧资源管理器中查看项目结构，应该类似这样：

```
my-blog/
├── docs/                      # VitePress 项目根目录
│   ├── .vitepress/            # 配置目录
│   │   └── config.js          # 站点配置文件
│   ├── api-examples.md        # 示例页面
│   ├── index.md               # 首页（访问 / 时显示）
│   └── markdown-examples.md   # 示例页面
├── node_modules/              # 依赖包
├── package-lock.json          # 依赖锁定文件（确保版本一致）
├── package.json               # 项目清单
```

**原理**：VitePress 使用**基于文件的路由**——每个 `.md` 文件自动对应一个 HTML 页面。例如：

- `docs/index.md` → `/index.html`（访问 `/`）
- `docs/api-examples.md` → `/api-examples.html`

`docs` 目录是 VitePress 的**项目根目录**，`.vitepress` 目录是**保留目录**，存放配置文件、缓存和构建输出。

---

## 第五步：启动开发服务器

### 5.1 运行开发服务器

**操作**：在 VS Code 终端中执行：

```bash
npm run docs:dev
```

**原理**：`npm run docs:dev` 会去 `package.json` 的 `scripts` 中查找 `docs:dev` 对应的命令（即 `vitepress dev docs`）并执行。VitePress 会启动一个**开发服务器**（默认端口 `5173`），提供以下能力：

- **热模块替换（HMR）** ：修改 Markdown 文件后页面自动刷新，无需手动重启
- **即时预览**：在浏览器中实时看到写作效果
- **文件监听**：监听 `docs` 目录下所有文件的变化

### 5.2 在浏览器中预览

**操作**：打开浏览器，访问 `http://localhost:5173`。你应该能看到 VitePress 默认主题的示例首页。

**原理**：开发服务器将 Markdown 文件实时编译为 HTML 并提供给浏览器。`localhost:5173` 是 Vite 开发服务器的默认地址和端口。

---

## 第六步：编写第一篇博客文章

### 6.1 创建博客文章

**操作**：在 `docs/` 目录下新建一个 `.md` 文件，例如 `my-first-blog.md`。在文件中写入以下内容：

```markdown
---
title: 我的第一篇博客
date: 2026-09-09
tags: [VitePress, 博客]
---

# 我的第一篇博客

欢迎来到我的 VitePress 博客！

## 什么是 VitePress

VitePress 是一个基于 Vite 和 Vue 3 的静态站点生成器。

## Markdown 语法示例

- **加粗文字**
- *斜体文字*
- [链接文字](https://vitepress.dev)
- ![图片描述](/images/example.png)

> 这是一段引用文字
```

**原理**：文件开头的 `---` 包裹的部分叫做 **Frontmatter**。它是 YAML 格式的元数据，VitePress 会解析这些信息并注入到页面中，可用于：

- `title`：页面标题（显示在浏览器标签栏和导航中）
- `date`：发布日期（可用于归档排序）
- `tags`：文章标签（可用于分类筛选）

## 第七步：配置站点（基础）

### 7.1 修改站点配置

**操作**：打开 `docs/.vitepress/config.js`（或 `config.ts`），修改配置：

```js
export default {
  title: '我的技术博客',
  description: '记录技术与思考',
  themeConfig: {
    // 导航栏配置
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/my-first-blog' },
      { text: '关于', link: '/about' }
    ],
    // 侧边栏配置
    sidebar: [
      {
        text: '文章列表',
        items: [
          { text: '我的第一篇博客', link: '/my-first-blog' }
        ]
      }
    ],
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/你的用户名' }
    ]
  }
}
```

**原理**：`themeConfig` 是**默认主题的配置对象**，控制站点的外观和导航结构：

- `nav`：顶部导航栏菜单
- `sidebar`：左侧侧边栏菜单
- `socialLinks`：社交图标链接

保存后开发服务器会自动热更新，刷新浏览器即可看到变化。

### 7.2 修改首页

**操作**：打开 `docs/index.md`，自定义首页内容：

```markdown
---
# 使用 layout: home 启用首页特殊布局
layout: home

hero:
  name: "我的技术博客"
  text: "记录学习与成长"
  tagline: 用 VitePress 构建的静态博客
  actions:
    - theme: brand
      text: 开始阅读 →
      link: /my-first-blog
    - theme: alt
      text: GitHub
      link: https://github.com/你的用户名

features:
  - title: 📝 纯 Markdown 写作
    details: 使用 Markdown 编写所有内容，专注创作
  - title: ⚡ 极速加载
    details: 基于 Vite 构建，页面秒开
  - title: 🎨 Vue 驱动
    details: 可在 Markdown 中嵌入 Vue 组件
---
```

**原理**：`layout: home` 告诉 VitePress 使用默认主题的**首页布局**（Hero + Features 风格）。`hero` 定义大标题和行动按钮，`features` 定义特色卡片。

---

## 第八步：配置 VS Code 工作区（优化写作体验）

### 8.1 创建工作区配置文件

**操作**：在项目根目录创建 `.vscode` 文件夹，在其中新建两个文件：

**① `.vscode/extensions.json`** —— 只是列出推荐团队成员安装的插件：

```json
{
  "recommendations": [
    "vue.volar",
    "yzhang.markdown-all-in-one",
    "davidanson.vscode-markdownlint"
  ]
}
```

**② `.vscode/settings.json`** —— 项目专属的 VS Code 设置：

```json
{
  "files.associations": {
    "*.vitepress/config.*": "jsonc"
  },
  "markdownlint.ignore": ["**/*.md"],
  "editor.formatOnSave": true,
  "markdown.editor.filePaste.enabled": true,
  "markdown.editor.filePaste.path": "/public/images/${fileName}"
}
```

**原理**：

- `files.associations`：让 VS Code 正确识别 `.vitepress/config` 文件为 JSON 格式并高亮
- `markdownlint.ignore`：关闭 markdownlint 对 Frontmatter（`---` 块）的报错
- `editor.formatOnSave`：保存时自动格式化 Markdown 文件
- `markdown.editor.filePaste.enabled`：启用拖拽粘贴图片功能，自动生成图片路径

### ~~8.2 创建代码片段（快速生成 Frontmatter）~~

**操作**：

1. 按 `Ctrl+Shift+P`，输入 `Configure User Snippets`，选择 `markdown.json`
2. 粘贴以下配置：

```json
{
  "Blog Frontmatter": {
    "prefix": "fm",
    "body": [
      "---",
      "title: $1",
      "date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "tags: [$2]",
      "description: $3",
      "---",
      "$4"
    ],
    "description": "生成 VitePress 博客文章头部信息"
  }
}
```

**原理**：新建 `.md` 文件后输入 `fm` 按 `Tab`，自动生成带有**当前日期**的 Frontmatter 模板，提升写作效率。

---

## 第九步：构建与验证

### 9.1 构建静态文件

**操作**：在 VS Code 终端中执行：

```bash
npm run docs:build
```

**原理**：这一步就像编译成网页代码

`docs:build` 对应 `vitepress build docs` 命令。VitePress 会将所有 Markdown 文件编译为**静态 HTML 文件**，输出到 `docs/.vitepress/dist` 目录。这些文件是纯静态的，可以部署到任何静态托管服务。

### 9.2 预览构建结果

**操作**：在 VS Code 终端中执行：

```bash
npm run docs:preview
```

**原理**：`docs:preview` 对应 `vitepress preview docs` 命令，启动一个本地服务器预览构建后的静态文件，效果与线上部署一致，用于在部署前做最终检查。

按照以上步骤，你已经成功在 VS Code 中基于 **npm** 搭建了一个完整的 VitePress 博客项目，并理解了每一步背后的原理。现在可以开始自由写作了！


# 附录：

没错，你已经摸到前端开发（以及任何网页样式修改）的核心法门了！**浏览器 F12 开发者工具（DevTools）就是修改样式的“终极武器”**。

以后无论你想改什么网站的样式，都可以遵循下面这套**“标准四步法”**：

### 第一步：定位元素（找出它叫什么名字）

1. 在浏览器中按 `F12` 键（或右键页面空白处 -> “检查” / “Inspect”）。
2. 点击开发者工具左上角的 **小箭头图标**（Select an element / 选择元素）。
3. 鼠标移动到页面上你想修改的地方（比如那个白色长条），它会高亮显示，然后**点击一下**。
4. 这时，右侧的 `Elements`（元素）面板会高亮出对应的 HTML 代码，你一眼就能看到它的类名，比如 `<div class="VPLocalNav" data-v-74b974be>`。

### 第二步：寻找样式（找出是谁写了白色背景）

1. 保持该元素被选中，看开发者工具右侧的 **`Styles`（样式）** 面板。
2. 向下滚动，你会看到很多 CSS 规则。**注意：被划上横线的属性表示被更高优先级的规则覆盖了，不是最终生效的。**
3. 仔细找，直到你看到生效的那一行（比如你刚才看到的）：
   ```css
   .VPLocalNav[data-v-74b974be] {
       background-color: var(--vp-local-nav-bg-color);
   }
   ```
4. 鼠标悬停在这个规则上，右上角会显示它是从哪个文件来的（比如 `VPLocalNav.vue`）。你可以点开，了解它的原本写法。

### 第三步：临时测试（在浏览器里改着玩）

在 `Styles` 面板里，你可以**直接修改**：

* **修改颜色**：点击 `var(--vp-local-nav-bg-color)`，把它改成 `transparent` 或 `red`。
* **增加样式**：点击花括号 `{` 的空白处，直接输入 `border-bottom: none;`。
* **取消勾选**：把某些属性前面的小勾去掉，可以直接禁用该样式。

**这时候页面会立刻变化！** 这个阶段你可以随便试，直到试出你想要的效果。（注意：在 F12 里的修改只是临时的，刷新页面就没了，也不会影响真实文件）。

### 第四步：落实到你的代码里（永久生效）

当你找到满意的效果后，就需要把它写进你项目的 `style.css` 里。**重要原则**：尽量用你自定义的 CSS 去覆盖 VitePress 的默认 CSS。

* **复制类名**：把 F12 里看到的类名（如 `.VPLocalNav`）复制过来。
* **覆盖属性**：加上 `!important` 提高优先级（因为 VitePress 自带的样式权重可能很高）。
* **处理特殊后缀**：像 `[data-v-74b974be]` 这种叫“作用域哈希”，你通常不需要写它，直接写 `.VPLocalNav { ... }` 通常就能覆盖（如果覆盖不了，再加上它）。
* **深色模式**：如果你开启了深色模式（暗色主题），记得在 `.dark` 下再改一遍（比如 `.dark .VPLocalNav { ... }`）。

---

### 💡 进阶技巧（针对 VitePress）

你刚才发现背景色是 `var(--vp-local-nav-bg-color)`。这说明 VitePress 使用了 **CSS 变量**。比起直接写 `background-color: transparent !important;`，更优雅的做法是**直接修改变量**：

```css
:root {
  /* 在全局覆盖这个变量，改起来更干净 */
  --vp-local-nav-bg-color: transparent;
}
```

**总结一下你的日常操作流：**

1. 效果不对 -> 2. F12 找到对应元素和样式 -> 3. 在 F12 里临时改爽 -> 4. 把改动抄进自己的 `style.css`（记得加 `!important` 或修改变量） -> 5. 刷新页面验证。

多试几次，你就会发现任何页面的样式都在你的掌控之中了！如果遇到覆盖不掉的情况，再截图发我，我帮你分析权重和覆盖问题。
