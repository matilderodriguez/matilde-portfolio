const landing = document.getElementById('mode-landing');
const reader = document.getElementById('record-reader');
const frame = document.getElementById('original-reader');
const originalLink = document.getElementById('open-original');
const returnButton = document.getElementById('return-to-mode');
const recordsURL = new URL('system-notes.html', location.href);
const recordURL = id => new URL('#' + encodeURIComponent(id), recordsURL);
const readingPrefix = '#read/';
let opener;

function renderLocation() {
    if (!location.hash.startsWith(readingPrefix)) {
        const wasReading = !reader.hidden;
        reader.hidden = true;
        landing.hidden = false;
        if (wasReading) opener?.focus();
        return;
    }

    const id = location.hash.slice(readingPrefix.length);
    const target = recordURL(id);
    if (reader.hidden || originalLink.href !== target.href) {
        if (frame.getAttribute('src')) frame.contentWindow.location.replace(target);
        else frame.src = target;
    }
    originalLink.href = target;
    landing.hidden = true;
    reader.hidden = false;
    returnButton.focus();
}

function openRecord(id, link) {
    opener = link;
    history.pushState(null, '', readingPrefix + id);
    renderLocation();
}

function syncOriginalLocation() {
    if (reader.hidden) return;
    let url;
    try {
        url = new URL(frame.contentWindow.location.href);
    } catch {
        return;
    }
    if (url.pathname !== recordsURL.pathname) return;
    const id = url.hash.slice(1) || 'map';
    originalLink.href = recordURL(id);
    history.replaceState(null, '', readingPrefix + id);
}

frame.addEventListener('load', () => {
    frame.contentWindow.addEventListener('hashchange', syncOriginalLocation);
    syncOriginalLocation();
});

document.addEventListener('click', event => {
    const link = event.target.closest('a[data-record]');
    if (!link || event.defaultPrevented || event.button || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openRecord(link.dataset.record, link);
});

returnButton.addEventListener('click', () => {
    history.pushState(null, '', location.pathname + location.search);
    renderLocation();
});
window.addEventListener('hashchange', renderLocation);
renderLocation();

const directories = [
    { name: 'DISCOVERY', index: 'Discovery Mode', records: ['mercury', 'pallas', 'invariance-lab', 'pattern-engine', 'code-lab', 'quick-interactive'] },
    { name: 'METHODS', index: 'Methods', records: ['patterns', 'architecture', 'explanation', 'clarity', 'reusable', 'bridge', 'technical-writing', 'knowledge-design'] },
    { name: 'TOOLS', index: 'Tools', records: ['tools', 'code-lab', 'response-systems', 'quick-interactive'] },
    { name: 'PROJECTS', index: 'Projects', records: ['pixel-to-teach', 'curriculum-design', 'learning-design', 'before-learning', 'learning'] },
    { name: 'ARCHIVE', index: 'Archive', records: ['failure-to-communicate', 'scale', 'map'] }
];

async function initialiseBIOS() {
    const response = await fetch(recordsURL);
    if (!response.ok) throw new Error('Original System Notes could not be loaded.');
    const originalDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
    const articles = new Map([...originalDocument.querySelectorAll('article.note')].map(article => [article.id, {
        title: article.querySelector('h2').textContent,
        summary: article.querySelector('.summary').textContent,
        icon: originalDocument.querySelector('.map a[href="#' + article.id + '"] img')
    }]));
    const activities = new Map([...originalDocument.querySelectorAll('.activity-tile')].map(link => [
        link.hash.slice(1), { title: link.querySelector('strong').textContent, summary: link.querySelector('small').textContent }
    ]));
    const directoryList = document.getElementById('bios-directories');
    const fileList = document.getElementById('bios-records');
    const index = document.getElementById('bios-index');
    const preview = document.getElementById('bios-preview');
    const open = document.getElementById('bios-open');
    const help = document.getElementById('bios-help');
    let currentDirectory = 0;
    let currentRecord = 'mercury';

    const serial = position => String(position + 1).padStart(2, '0');
    function filename(id) {
        const command = activities.get(id);
        const source = originalDocument.querySelector('.activity-tile[href="#' + id + '"] .activity-command');
        return (id === 'map' ? 'SYSTEM-DIRECTORY' :
            command && id !== 'code-lab' ? source.textContent.split(' / ')[1] : id.toUpperCase()) + '.TXT';
    }

    function drawRecord(id) {
        currentRecord = id;
        const article = articles.get(id) || activities.get(id) || {
            title: originalDocument.querySelector('#entry-directory-title').textContent,
            summary: originalDocument.querySelector('.directory-intro').textContent
        };
        fileList.querySelectorAll('a[data-item]').forEach(link => { if (link.dataset.item === id) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
        document.getElementById('bios-preview-title').textContent = 'PREVIEW: ' + filename(id);
        const copy = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = article.title;
        const description = document.createElement('p');
        description.textContent = article.summary;
        copy.append(title, description);
        const icon = article.icon?.cloneNode();
        if (icon) icon.className = 'pixel-icon';
        preview.replaceChildren(...(icon ? [icon, copy] : [copy]));
        open.href = recordURL(id);
    }

    function selectionButton(label, kind, item, handler) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.item = item;
        const name = document.createElement('span');
        name.textContent = label;
        button.append(name);
        if (kind) {
            const type = document.createElement('span');
            type.textContent = kind;
            button.append(type);
        }
        button.addEventListener('click', handler);
        return button;
    }

    function drawDirectory(position) {
        currentDirectory = position;
        const directory = directories[position];
        const path = serial(position) + '_' + directory.name;
        document.getElementById('bios-files-title').textContent = 'A:\\' + path + '\\*.*';
        for (const list of [directoryList, index]) {
            list.querySelectorAll('button[data-item]').forEach(button =>
                button.setAttribute('aria-pressed', Number(button.dataset.item) === position));
        }
        fileList.replaceChildren(...directory.records.map(id => {
            const link = document.createElement('a');
            link.dataset.item = id;
            link.href = recordURL(id);
            const name = document.createElement('span');
            name.textContent = filename(id);
            const type = document.createElement('span');
            type.textContent = 'TXT';
            link.append(name, type);
            link.addEventListener('focus', () => drawRecord(id));
            link.addEventListener('pointerenter', () => drawRecord(id));
            return link;
        }));
        drawRecord(directory.records[0]);
    }

    directories.forEach((entry, position) => {
        directoryList.append(selectionButton(serial(position) + '_' + entry.name, '<DIR>', position, () => drawDirectory(position)));
        index.append(selectionButton(entry.index, '', position, () => drawDirectory(position)));
    });
    for (const list of [directoryList, fileList, index]) {
        list.addEventListener('keydown', event => {
            if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
            const buttons = [...list.querySelectorAll('button, a[data-item]')];
            if (!buttons.length) return;
            const next = (buttons.indexOf(event.target) + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
            event.preventDefault();
            buttons[next].focus();
            if (list !== fileList) buttons[next].click();
        });
    }
    const actions = {
        directories: () => directoryList.querySelector('[aria-pressed="true"]').focus(),
        records: () => fileList.querySelector('[aria-current="true"]')?.focus(),
        index: () => index.querySelector('[aria-pressed="true"]').focus(),
        preview: () => { preview.parentElement.scrollIntoView({block:'nearest'}); open.focus({preventScroll:true}); },
        help: () => help.showModal()
    };
    document.querySelectorAll('[data-bios-action]').forEach(button =>
        button.addEventListener('click', actions[button.dataset.biosAction]));
    document.addEventListener('keydown', event => {
        if (landing.hidden || help.open || !['F1', 'F2', 'F3', 'F4'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'F1') actions.help();
        if (event.key === 'F2') location.assign(recordURL(currentRecord));
        if (event.key === 'F3') actions.preview();
        if (event.key === 'F4') location.assign(recordURL('map'));
    });
    drawDirectory(currentDirectory);
}

if (document.body.classList.contains('bios')) {
    initialiseBIOS().catch(() => { document.getElementById('bios-error').hidden = false; });
}
