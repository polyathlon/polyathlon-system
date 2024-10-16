import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/modal-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/icon-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import '../../../../components/buttons/aside-button.mjs';
import { States } from "../../../utils.js"

import './my-sportsmen-section-1-page-1.mjs'

import DataSet from './my-sportsmen-dataset.mjs'
import DataSource from './my-sportsmen-datasource.mjs'

class MySportsmenSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: {type: Object, default: null},
            statusDataSet: {type: Map, default: null },
            oldValues: {type: Map, default: null },
            currentItem: {type: Object, default: null},
            listItem: {type: Object, default: null},
            isModified: {type: Boolean, default: "", local: true},
            isReady: {type: Boolean, default: true},
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: {type: BigInt, default: 0},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr 50px;
                    grid-template-areas:
                        "header1 header2"
                        "sidebar content"
                        "footer1  footer2";
                    gap: 0 20px;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .left-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                    }
                }

                .right-header{
                    grid-area: header2;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: var(--layout-background-color);
                    icon-button {
                    width: 100%;
                    height: 40px;
                        flex: 0 0 40px;
                    }
                }

                .right-layout {
                    overflow-y: auto;
                    overflow-x: hidden;
                    grid-area: content;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
                    /* overflow: hidden; */
                    gap: 10px;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                .left-footer {
                    grid-area: footer1;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    gap: 10px;
                    nav {
                        background-color: rgba(255, 255, 255, 0.1);
                        width: 100%;
                        height: 70%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        /* padding-right: 10px; */
                        gap: 1vw;
                    }
                }

                .right-footer {
                    grid-area: footer2;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;

                    simple-button {
                        height: 36px;
                        &:hover {
                            background-color: red;
                }
                    }
                }

                icon-button[selected] {
                    background: rgba(255, 255, 255, 0.1)
                }

                icon-button:hover {
                    background: rgba(255, 255, 255, 0.1)
                }

                 /* width */
                 ::-webkit-scrollbar {
                    width: 10px;
                }

                /* Track */
                ::-webkit-scrollbar-track {
                    box-shadow: inset 0 0 5px grey;
                    border-radius: 5px;
                }

                /* Handle */
                ::-webkit-scrollbar-thumb {
                    background: red;
                    border-radius: 5px;
                }

                #fileInput {
                    display: none;
                }
            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.pageNames = ['Property']
        this.oldValues = new Map();
        this.buttons = [
            // {iconName: 'region-solid', page: 'my-regions', title: 'Regions', click: () => this.showPage('my-regions')},
            // {iconName: 'club-solid', page: 'my-clubs', title: 'Clubs', click: () => this.showPage('my-clubs')},
            // {iconName: 'sports-category-solid', page: 'my-sports-categories', title: 'Sports Categories', click: () => this.showPage('my-sports-categories')},
            {iconName: 'qrcode-solid', page: 'my-sportsmen', title: 'qrcode', click: () => this.getQRCode()},
            {iconName: 'excel-import-solid', page: 'my-sportsmen', title: 'Import from Excel', click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-sportsmen', title: 'Back', click: () => this.gotoBack()},
        ]
    }

    showPage(page) {
        location.hash = page;
    }

    gotoBack(page) {
        history.back();
    }

    async getQRCode() {
        const dataURI = await DataSet.getQRCode(this.currentItem._id)
        const blob = await (await fetch(dataURI)).blob();
        window.open(URL.createObjectURL(blob))
        // window.open(dataURI)
        // const image = new Image();
        // image.src = dataURI;
        // const w = window.open("");
        // w.document.write(image.outerHTML);
    }

    async getNewFileHandle() {
        const options = {
          types: [
            {
              description: 'Excel files',
              accept: {
                'application/octet-stream': ['.xslx'],
              },
            },
            {
              description: 'Neural Models',
              accept: {
                'application/octet-stream': ['.pkl'],
              },
            },

          ],
        };
        const handle = await window.showSaveFilePicker(options);
        return handle;
    }

    ExcelFile() {
        this.renderRoot.getElementById("fileInput").click();
    }

    async importFromExcel(e) {
        const file = e.target.files[0];
        const modalResult = await this.showDialog('Вы действительно хотите импортировать эти данные?', 'confirm')
        if (modalResult === 'Ok') {
            const workbook = XLSX.read(await file.arrayBuffer());
            const worksheet = workbook.Sheets[workbook.SheetNames[2]];
            const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
            const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
            const regionDataset = RegionDataset.default;
            const SportsCategoryDataset = await import('../my-sports-categories/my-sports-categories-dataset.mjs');
            const sportsCategoryDataset = SportsCategoryDataset.default;
            this.dataSource.lock();
            const promises = new Array(raw_data.length)
            raw_data.forEach((r, index) => {
                if(index !== 0){
                    const newItem = {
                        lastName: r[1].split(' ')[0].toLowerCase()[0].toUpperCase() + r[1].split(' ')[0].toLowerCase().slice(1),
                        firstName: r[1].split(' ')[1],
                        middleName: r[1].split(' ')[2],
                        gender: r[10],
                        category: sportsCategoryDataset.find("shortName", r[2]),
                        region: regionDataset.find("name", r[3]),
                        order: {
                            number: r[4],
                            link: r[6]
                        },
                        link: r[5],

                    }
                    promises[index] = this.dataSource.addItem(newItem);
                }
            });
            try {
                await Promise.allSettled(promises)
                await this.showDialog('Все данные были успешно импортированы!')
            } catch(e) {
                await this.showDialog('Не все данные успешно импортированы')
            }
            this.dataSource.unlock();
        }
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentSportsmanItem')) {
            this.currentPage = 0;
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
    }

    async showItem(item) {
        if (this.currentItem?._id === item.id)
        {
            this.copyToClipboard(item.value.hashNumber || item.id)
            return
        }
        if (this.isModified) {
            const modalResult = await this.showDialog('Запись была изменена. Сохранить изменения?', 'confirm')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(this.currentItem, item);
            }
            else {
                await this.cancelItem()
            }
        }
        else {
            this.dataSource.setCurrentItem(item)
        }
    }

    get #page() {
        return cache(this.currentPage === 0 ? this.#page1() : this.#page2());
    }

    #page1() {
        return html`
            <my-sportsmen-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-sportsmen-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-sportsmen-section-1-page-2 .item=${this.currentItem}></my-sportsmen-section-1-page-2>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    newRecord() {
        return html `<icon-button
                label=${ this.listItem.key }
                title=${ this.listItem.id }
                icon-name=${ this.listItem.value?.gender == 0 ? "sportsman-boy-solid" : "sportsman-girl-solid" }
                ?selected=${ this.currentItem?._id === this.listItem?.id }
                .status=${{ name: this.listItem.value?.hashNumber, icon: 'hash-number-solid'} }
            >
            </icon-button>
        `
    }

    makeList() {
        if (!this.dataSource?.items || this.dataSource?.items.length === 0)
            return;
        const itemTemplates = new Array(this.dataSource.items.length)
        for( let i = 0; i < this.dataSource.items.length; i++) {
            const item = this.dataSource?.items[i]
            itemTemplates[i] =
                html `<icon-button
                    label=${ item.key }
                    title=${ item.id }
                    icon-name=${ item.value?.gender == 0 ? "sportsman-boy-solid" : "sportsman-girl-solid" }
                    ?selected=${ this.currentItem?._id === item.id }
                    .status=${{ name: item.value?.hashNumber || item?.id, icon: 'hash-number-solid'} }
                    @click=${() => this.showItem(item)}
                >
                </icon-button>
            `
        }
        return itemTemplates
    }

    // .status=${ item.hashNumber ? { name: item.hashNumber, icon: 'hash-number-solid'} : '' }
    get #list() {
        return html`
            ${this.makeList()}
        `
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }
    // ${this.#page()}

    get #firstItemFooter() {
        return html`
            <simple-button label=${"Сохранить"} @click=${this.saveFirstItem}></simple-button>
            <simple-button label=${"Отменить"} @click=${this.cancelItem}></simple-button>
        `
    }

    get #newItemFooter() {
        return html`
            <simple-button label="Сохранить" @click=${this.saveNewItem}></simple-button>
            <simple-button label="Отменить" @click=${this.cancelNewItem}></simple-button>
        `
    }
    get #itemFooter() {
        return html`
            <simple-button label=${this.isModified ? "Сохранить": "Удалить"} @click=${this.isModified ? this.saveItem: this.deleteItem}></simple-button>
            <simple-button label=${this.isModified ? "Отменить": "Добавить"} @click=${this.isModified ? this.cancelItem: this.addNewItem}></simple-button>
        `
    }

    get #rightFooter() {
        if (!this.dataSource?.items)
            return ''
        if (this.dataSource.items.length) {
            if (this.dataSource.state === States.NEW) {
                return this.#newItemFooter
            } else {
                return this.#itemFooter
            }

        } else  if (this.dataSource.state === States.NEW) {
            return this.#newItemFooter
        } else {
            if (this.isModified) {
                return this.#firstItemFooter
            } else {
                return html`
                    <simple-button label=${"Добавить"} @click=${this.addNewItem}></simple-button>
                `
            }
        }
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header"><p>Sportsmen</p></header>
            <header class="right-header">${this.#pageName}</header>
            <div class="left-layout">
                ${this.dataSource?.state === States.NEW ? this.newRecord() : ''}
                ${this.#list}
            </div>
            <div class="right-layout">
                ${this.#page}
            </div>
            <footer class="left-footer">
                ${this.#task}
            </footer>
            <footer class="right-footer">
                ${this.#rightFooter}
            </footer>
            <input type="file" id="fileInput" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv" @input=${this.importFromExcel}/>
        `;
    }

    addFirstItem() {
        const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        page.startEdit()
    }

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    async addNewItem() {
        this.dataSource.addNewItem(this.currentItem);
        const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        page.startEdit()
    }

    async addItem() {
        this.dataSource.addItem(this.currentItem);
    }

    saveFirstItem() {
        this.dataSource.addItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async saveNewItem() {
        this.dataSource.saveNewItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem, this.listItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelNewItem() {
        const modalResult = await this.showDialog('Вы действительно хотите отменить добавление?', 'confirm')
        if (modalResult !== 'Ok')
            return
        this.dataSource.cancelNewItem()
        this.oldValues.clear();
        this.isModified = false;
    }

    async cancelItem() {
        if (this.oldValues.size === 0) {
            this.isModified = false;
        } else {
            const modalResult = await this.showDialog('Вы действительно хотите отменить все изменения?', 'confirm')
            if (modalResult !== 'Ok')
                return
            this.oldValues.forEach( (value, key) => {
                let id = key.id
                let currentItem = this.currentItem
                if (id == "order.number") {
                    id = "number"
                    currentItem = this.currentItem.order
                }
                if (id == "order.link") {
                    id = "link"
                    currentItem = this.currentItem.order
                }
                currentItem[id] = value;
                key.value = value;
            });
            this.oldValues.clear();
            this.isModified = false;
        }
    }

    async deleteItem() {
        const modalResult = await this.showDialog('Вы действительно хотите удалить этого спортсмена?', 'confirm')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem, this.listItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
        await this.dataSource.init();
    }
}

customElements.define("my-sportsmen-section-1", MySportsmenSection1)