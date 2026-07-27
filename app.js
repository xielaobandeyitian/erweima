const STORAGE_KEY = 'qrTreeDataV2';
const DEFAULT_DATA = {
  modules: [
    {
      id: 'module-01',
      title: '模块 1',
      description: '扫码后即可查看文字、图片和视频内容。',
      summary: '适合展示项目介绍、宣传图和操作说明。',
      scanCount: 0,
      children: [
        {
          id: 'dir-word',
          type: 'folder',
          title: '类别 1',
          description: '文字类内容目录',
          children: [
            {
              id: 'item-word-1',
              type: 'word',
              title: '项目说明',
              summary: '项目背景介绍',
              content: '这是第一个文字内容，可替换为真实的项目说明、流程说明或使用指南。'
            }
          ]
        },
        {
          id: 'dir-image',
          type: 'folder',
          title: '类别 2',
          description: '图片类内容目录',
          children: [
            {
              id: 'item-image-1',
              type: 'image',
              title: '示例图片',
              summary: '展示宣传图或流程图',
              src: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#f5f9ff"/><circle cx="300" cy="200" r="120" fill="#2563eb" fill-opacity="0.2"/><rect x="150" y="120" width="300" height="160" rx="20" fill="white" stroke="#2563eb" stroke-width="4"/><text x="300" y="210" text-anchor="middle" font-size="28" fill="#1d4ed8" font-family="Microsoft YaHei">示例图片</text></svg>')
            }
          ]
        },
        {
          id: 'dir-video',
          type: 'folder',
          title: '类别 3',
          description: '视频类内容目录',
          children: [
            {
              id: 'item-video-1',
              type: 'video',
              title: '演示视频',
              summary: '可替换为真实视频链接',
              description: '这是示例视频占位，后续可上传真实视频文件。'
            }
          ]
        }
      ]
    }
  ]
};

function makeId(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 8);
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function convertModuleData(pythonModules) {
  if (!pythonModules || !Array.isArray(pythonModules)) return DEFAULT_DATA;
  const modules = [];
  for (const mod of pythonModules) {
    const module = {
      id: mod.id,
      title: mod.title,
      description: mod.description || '',
      summary: mod.summary || '',
      scanCount: 0,
      children: []
    };
    if (mod.categories && Array.isArray(mod.categories)) {
      for (const cat of mod.categories) {
        const folder = {
          id: makeId('dir'),
          type: 'folder',
          title: cat.name,
          description: cat.name,
          children: []
        };
        if (cat.children && Array.isArray(cat.children)) {
          for (const child of cat.children) {
            const node = {
              id: makeId('item'),
              type: child.type,
              title: child.title,
              summary: child.caption || child.description || '',
              description: child.description || ''
            };
            if (child.type === 'image') {
              node.src = child.src || '';
            } else if (child.type === 'video') {
              node.src = child.video_url || '';
            } else if (child.type === 'word') {
              node.content = child.content || '';
            }
            folder.children.push(node);
          }
        }
        module.children.push(folder);
      }
    }
    modules.push(module);
  }
  return { modules };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('loadData failed', e);
  }
  if (window.MODULE_DATA) {
    return clone(convertModuleData(window.MODULE_DATA));
  }
  return clone(DEFAULT_DATA);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function exportData() {
  return JSON.stringify(loadData(), null, 2);
}

function createNode(type, title, extra = {}) {
  return {
    id: makeId(type === 'folder' ? 'dir' : 'item'),
    type,
    title,
    ...extra
  };
}

function createModule(title, extra = {}) {
  return {
    id: makeId('module'),
    title,
    description: extra.description || '新增模块',
    summary: extra.summary || '',
    scanCount: 0,
    children: []
  };
}

function addModule(data, module) {
  data.modules.push(module);
  return true;
}

function deleteModule(data, moduleId) {
  const index = data.modules.findIndex((item) => item.id === moduleId);
  if (index < 0) return false;
  data.modules.splice(index, 1);
  return true;
}

function addNodeToParent(data, moduleId, parentId, node) {
  const module = data.modules.find((m) => m.id === moduleId);
  if (!module) return false;
  const target = parentId ? findNodeById(module.children || [], parentId) : module;
  if (!target) return false;
  if (!target.children) target.children = [];
  target.children.push(node);
  return true;
}

function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const nested = findNodeById(node.children, id);
      if (nested) return nested;
    }
  }
  return null;
}

function findParentAndIndex(nodes, id, parent = null) {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.id === id) {
      return { parent: nodes, index };
    }
    if (node.children) {
      const nested = findParentAndIndex(node.children, id, node);
      if (nested) return nested;
    }
  }
  return null;
}

function updateNode(data, moduleId, nodeId, patch) {
  const module = data.modules.find((m) => m.id === moduleId);
  if (!module) return false;
  const target = findNodeById(module.children || [], nodeId);
  if (!target) return false;
  Object.assign(target, patch);
  return true;
}

function deleteNode(data, moduleId, nodeId) {
  const module = data.modules.find((m) => m.id === moduleId);
  if (!module) return false;
  const parentInfo = findParentAndIndex(module.children || [], nodeId);
  if (!parentInfo) return false;
  parentInfo.parent.splice(parentInfo.index, 1);
  return true;
}

function getRouteParts() {
  const hash = (location.hash || '').replace(/^#/, '').trim();
  return hash.split('/').filter(Boolean);
}

function getState() {
  const data = loadData();
  const parts = getRouteParts();
  const moduleId = parts[0] || window.DEFAULT_MODULE_ID || data.modules[0].id;
  const module = data.modules.find((m) => m.id === moduleId) || data.modules[0];
  const pathIds = parts.slice(1);
  const pathNodes = [];
  let current = module;
  for (const id of pathIds) {
    if (!current.children) break;
    const next = current.children.find((child) => child.id === id);
    if (!next) break;
    pathNodes.push(next);
    current = next;
  }
  return { data, module, current, pathNodes };
}

function buildHref(moduleId, pathIds, childId) {
  const parts = [moduleId, ...pathIds, childId].filter(Boolean);
  return '#' + parts.join('/');
}

function renderBreadcrumb(module, pathNodes) {
  const crumbs = [{ title: module.title, href: buildHref(module.id, [], '') }];
  let currentPath = [];
  for (const node of pathNodes) {
    currentPath.push(node.id);
    crumbs.push({ title: node.title, href: buildHref(module.id, currentPath, '') });
  }
  return crumbs.map((item, index) => {
    const isLast = index === crumbs.length - 1;
    if (isLast) {
      return `<span>${item.title}</span>`;
    }
    return `<a href="${item.href}">${item.title}</a>`;
  }).join(' / ');
}

function getNodeTypeLabel(node) {
  if (node.type === 'folder') return '分类';
  if (node.type === 'word') return '文字';
  if (node.type === 'image') return '图片';
  if (node.type === 'video') return '视频';
  return '内容';
}

function countChildren(nodes) {
  return (nodes || []).filter(Boolean).length;
}

function bumpScanCount(moduleId) {
  const data = loadData();
  const module = data.modules.find((item) => item.id === moduleId);
  if (!module) return;
  module.scanCount = (module.scanCount || 0) + 1;
  saveData(data);
}

function renderModuleCards() {
  const data = loadData();
  const container = document.getElementById('app');
  if (!container) return;
  const html = `
    <div class="shell">
      <div class="hero">
        <h1>内容目录</h1>
        <p>扫码二维码后即可浏览文字、图片和视频内容，适合手机端展示。</p>
      </div>
      <div class="stack">
        ${data.modules.map((module, index) => `
          <a class="card" href="pages/page-${String(index + 1).padStart(2, '0')}.html?module=${module.id}">
            <strong>${module.title}</strong>
            <span>${module.description}</span>
            <div class="mini-bar"><span>${countChildren(module.children || [])} 个分类</span><span>扫码 ${module.scanCount || 0}</span></div>
          </a>
        `).join('')}
      </div>
      <div class="actions">
        <a class="btn" href="manage.html">内容管理</a>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function renderModulePage() {
  const container = document.getElementById('app');
  if (!container) return;
  const { module, current, pathNodes } = getState();
  const children = (current.children || []).filter(Boolean);
  const renderChildren = children.map((child) => {
    const isFolder = child.type === 'folder';
    const href = buildHref(module.id, pathNodes.map((node) => node.id).concat(child.id), '');
    return `
      <a class="node-card ${isFolder ? 'folder' : child.type}" href="${href}">
        <strong>${child.title}</strong>
        <span>${isFolder ? '分类目录' : getNodeTypeLabel(child)}</span>
        ${child.summary ? `<span>${child.summary}</span>` : ''}
      </a>
    `;
  }).join('');

  const parentHref = pathNodes.length ? buildHref(module.id, pathNodes.slice(0, -1).map((node) => node.id), '') : '../index.html';

  container.innerHTML = `
    <div class="shell">
      <div class="hero">
        <h1>${module.title}</h1>
        <p>${module.description}</p>
      </div>
      <div class="mini-bar"><span>${module.summary || '可继续新增更多内容'}</span><span>扫码 ${module.scanCount || 0}</span></div>
      <div class="crumbs">${renderBreadcrumb(module, pathNodes)}</div>
      <div class="stack">
        ${renderChildren || '<div class="empty">这里还没有内容，建议在管理页中补充。</div>'}
      </div>
      <div class="actions">
        ${pathNodes.length ? `<a class="btn" href="${parentHref}">返回上级</a>` : ''}
        <a class="btn" href="../index.html">返回入口</a>
        <a class="btn" href="../manage.html">内容管理</a>
      </div>
    </div>
  `;
}

function renderDetailPage() {
  const container = document.getElementById('app');
  if (!container) return;
  const { module, current, pathNodes } = getState();
  const parentNode = pathNodes[pathNodes.length - 1];
  const parentHref = parentNode ? buildHref(module.id, pathNodes.slice(0, -1).map((node) => node.id), '') : buildHref(module.id, [], '');
  let bodyHtml = '';
  if (current.type === 'word') {
    bodyHtml = `<div class="detail-box"><div class="badge">${getNodeTypeLabel(current)}</div><h2>${current.title}</h2><p>${(current.summary || '').replace(/\n/g, '<br>')}</p><p>${(current.content || '').replace(/\n/g, '<br>')}</p></div>`;
  } else if (current.type === 'image') {
    bodyHtml = `<div class="detail-box"><div class="badge">${getNodeTypeLabel(current)}</div><h2>${current.title}</h2><p>${current.summary || '图片内容'}</p><img class="preview" src="${current.src || ''}" alt="${current.title}" /></div>`;
  } else if (current.type === 'video') {
    bodyHtml = `<div class="detail-box"><div class="badge">${getNodeTypeLabel(current)}</div><h2>${current.title}</h2><p>${current.summary || '视频内容'}</p><p>${current.description || '暂无视频内容'}</p>${current.src ? `<video class="preview" controls src="${current.src}"></video>` : ''}</div>`;
  } else {
    bodyHtml = `<div class="empty">请选择一个内容项</div>`;
  }
  container.innerHTML = `
    <div class="shell">
      <div class="hero">
        <h1>${module.title}</h1>
        <p>${module.description}</p>
      </div>
      <div class="crumbs">${renderBreadcrumb(module, pathNodes)}</div>
      ${bodyHtml}
      <div class="actions">
        <a class="btn" href="${parentHref}">返回上级</a>
        <a class="btn" href="../index.html">返回入口</a>
      </div>
    </div>
  `;
}

function render() {
  const container = document.getElementById('app');
  if (!container) return;
  const { module, current } = getState();
  if (!module) return;
  bumpScanCount(module.id);
  if (!current) return;
  const isFolderView = current === module || current.type === 'folder';
  if (isFolderView) {
    renderModulePage();
  } else {
    renderDetailPage();
  }
}

function initApp() {
  if (!document.getElementById('app')) return;
  window.addEventListener('hashchange', render);
  render();
}

window.addEventListener('DOMContentLoaded', initApp);

window.qrTree = {
  loadData,
  saveData,
  exportData,
  createNode,
  createModule,
  addModule,
  deleteModule,
  addNodeToParent,
  updateNode,
  deleteNode,
  findNodeById,
  getState,
  renderModuleCards,
  render
};
