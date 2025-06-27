document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('add-item-form');
    const itemList = document.getElementById('item-list');
    const itemNameInput = document.getElementById('item-name');
    const itemUrlInput = document.getElementById('item-url');
    const itemTypeInput = document.getElementById('item-type');

    let items = JSON.parse(localStorage.getItem('items')) || [];
    let editIndex = null;

    const saveItems = () => {
        localStorage.setItem('items', JSON.stringify(items));
    };

    const renderItems = () => {
        itemList.innerHTML = '';
        items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'tool-item'; // 'tool-item' class is kept for styling
            itemEl.innerHTML = `
                <div>
                    <input type="checkbox" data-index="${index}">
                    <span>[${item.type}] ${item.name} - ${item.url}</span>
                </div>
                <div>
                    <button class="edit-button" data-index="${index}">編集</button>
                    <button class="delete-button" data-index="${index}">削除</button>
                </div>
            `;
            itemList.appendChild(itemEl);
        });
    };

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newItem = {
            name: itemNameInput.value,
            url: itemUrlInput.value,
            type: itemTypeInput.value
        };

        if (editIndex === null) {
            items.push(newItem);
        } else {
            items[editIndex] = newItem;
            editIndex = null;
            addItemForm.querySelector('button').textContent = '登録';
        }

        saveItems();
        renderItems();
        addItemForm.reset();
    });

    itemList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-button')) {
            const index = e.target.dataset.index;
            const item = items[index];
            itemNameInput.value = item.name;
            itemUrlInput.value = item.url;
            itemTypeInput.value = item.type;
            editIndex = index;
            addItemForm.querySelector('button').textContent = '更新';
        }

        if (e.target.classList.contains('delete-button')) {
            const index = e.target.dataset.index;
            items.splice(index, 1);
            saveItems();
            renderItems();
        }
    });

    const generateButton = document.getElementById('generate-button');
    const outputTextarea = document.getElementById('output-textarea');
    const copyButton = document.getElementById('copy-button');

    const selectAllButton = document.getElementById('select-all-button');
    const deselectAllButton = document.getElementById('deselect-all-button');

    selectAllButton.addEventListener('click', () => {
        document.querySelectorAll('#item-list input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    });

    deselectAllButton.addEventListener('click', () => {
        document.querySelectorAll('#item-list input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });

    generateButton.addEventListener('click', () => {
        const selectedItems = [];
        document.querySelectorAll('#item-list input[type="checkbox"]:checked').forEach(checkbox => {
            selectedItems.push(items[checkbox.dataset.index]);
        });

        if (selectedItems.length === 0) {
            outputTextarea.value = 'アイテムが選択されていません。';
            return;
        }

        const groupedItems = selectedItems.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, {});

        let outputText = '';
        for (const type in groupedItems) {
            outputText += `【使用した${type}】\n`;
            groupedItems[type].forEach(item => {
                outputText += `・${item.name}\n  ${item.url}\n`;
            });
            outputText += '\n';
        }

        outputTextarea.value = outputText.trim();
    });

    copyButton.addEventListener('click', () => {
        outputTextarea.select();
        document.execCommand('copy');
        alert('クリップボードにコピーしました！');
    });

    renderItems();
});
