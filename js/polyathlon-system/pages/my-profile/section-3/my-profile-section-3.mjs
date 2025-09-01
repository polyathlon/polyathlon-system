import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'
import '../../../../../components/buttons/aside-button.mjs'
import '../../../../../components/buttons/simple-button.mjs'
import '../../../../../components/inputs/upload-input.mjs'

import lang from '../../../polyathlon-dictionary.mjs';

import { isAuth, States } from '../../../../utils.js'

import './my-profile-section-3-page-1.mjs'
import './my-profile-section-3-page-2.mjs'
import './my-profile-section-3-page-3.mjs'
import './my-profile-section-3-page-4.mjs'

import DataSet from './my-profile-section-3-dataset.mjs'
import DataSource from './my-profile-section-3-datasource.mjs'

import ProfileDataSet from '../section-1/my-profile-dataset.mjs'
// import ProfileDataSource from '../section-1/my-profile-datasource.mjs'

class MyProfileSection3 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            sortDirection: { type: Boolean, default: true},
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            currentFilter: { type: Object, default: {} },
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
                        "aside main"
                        "footer1 footer2";
                    gap: 0 20px;
                    width: 100%;
                    height: 100%;
                }

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .left-header {
                    grid-area: header1;
                    overflow: hidden;
                    min-width: 230px;
                    p {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin: 0;
                        font-weight: 700;
                    }
                    icon-button {
                        height: 100%;
                        padding: 0 1vw;
                        font-weight: 400;
                        &:not(:only-child):active {
                            background-color: var(--layout-background-color);
                        }
                        &:not(:only-child):hover {
                            background-color: var(--layout-background-color);
                        }
                    }
                }

                .right-header {
                    grid-area: header2;
                    display: flex;
                    justify-content: space-between;
                    .left-aside {
                        height: 100%;
                        icon-button {
                            height: 100%;
                            padding: 0 1vw;
                            /* --icon-height: 100%; */
                            &[active] {
                                background-color: var(--layout-background-color);
                                font-weight: bold;
                            }
                            &:hover {
                                background-color: var(--layout-background-color);
                                &:only-of-type {
                                    background-color: inherit;
                                }
                            }
                            &:first-of-type {
                                padding-left: 0;
                                font-weight: 700;
                            }
                        }
                    }
                    .right-aside {
                        display: flex;
                        justify-content: right;
                        align-items: center;
                        height: 100%;
                        padding-right: 10px;
                    }
                }

                .left-layout {
                    grid-area: aside;
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
                        --icon-height: 100%;
                        /* --simple-icon-height: 100%; */
                    }
                }

                .right-layout {
                    grid-area: main;
                    overflow-y: auto;
                    overflow-x: hidden;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: safe center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
                    gap: 10px;
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
                    gap: 10px;
                    nav {
                        width: 100%;
                        height: 70%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding: 0 10px;
                        gap: 1.5vw;
                        simple-button {
                            height: 100%;
                        }
                        &.buttons {
                            justify-content: center;
                        }
                    }
                }

                icon-button[selected] {
                    border-radius: 5px;
                    background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                }

                icon-button:hover {
                    background: var(--list-icon-button-hover, rgba(255, 255, 255, 0.1));
                    &[selected] {
                        border-radius: 5px;
                        background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                    }
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

        this.oldValues = new Map();

        this.pages = [
            {name: 'page0', id: '', iconName: 'user', page: 0, title: lang`User`, click: () => this.gotoPage(0), visible: true},
            {name: 'page1', id: "passport", iconName: 'passport-solid', page: 1, title: lang`Passport`, click: () => this.gotoPage(1)},
            {name: 'page2', id: "insurance", iconName: 'medical-insurance-solid', page: 2, title: lang`Medical insurance`, click: () => this.gotoPage(2)},
            {name: 'page3', id: "snils", iconName: 'snils-solid', page: 3, title: lang`SNILS`, click: () => this.gotoPage(3)},
            {name: 'page4', id: "birth", iconName: 'birth-certificate-solid', page: 4, title: lang`Birth certificate`, click: () => this.gotoPage(4)},
        ]

        this.buttons = [
            {iconName: 'telegram-bot-solid', page: 'my-referee-categories', title: lang`Telegram bot`, click: () => this.telegramBot()},
            {iconName: 'excel-import-solid', page: 'my-referee-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-referee-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
    }

    showPage(page) {
        location.hash = page;
    }

    gotoBack(page) {
        history.back();
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
        const workbook = XLSX.read(await file.arrayBuffer());
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
        const RegionDataset = await import('../../my-regions/my-regions-dataset.mjs');
        const regionDataset = RegionDataset.default
        raw_data.forEach((r, index) => {
            if(index !== 0){
                const newItem = {
                    lastName: r[1].split(' ')[0].toLowerCase()[0].toUpperCase() + r[1].split(' ')[0].toLowerCase().slice(1),
                    firstName: r[1].split(' ')[1],
                    middleName: r[1].split(' ')[2],
                    category: {
                        "_id": "referee-category:01J7NQ2NX0G3Y1R4D0GY1FFJT1",
                        "_rev": "3-ef23dd9cc44affc2ec440951b1d527d9",
                        "name": "Судья всероссийской категории",
                    },
                    region: regionDataset.find("name", r[4]),
                    order: {
                        number: r[5],
                        link: r[6]
                    },
                    link: r[7],
                }
                this.dataSource.addItem(newItem);
            }
        });
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentProfileDocumentItem')) {
            this.currentPage = 0;
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
    }

    async showItem(item) {
        if (this.currentPage != item.type) {
            this.currentPage = item.type
        }
        if (this.currentItem?._id === item._id) {
            this.copyToClipboard(item.id || item._id)
            return
        }
        if (this.isModified) {
            const modalResult = await this.confirmDialog('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(item);
            }
            else {
                await this.cancelItem()
            }
        }
        else if (this.currentItem !== item) {
            this.dataSource.setCurrentItem(item)
        }
    }

    get #page() {
        return this[this.pages[this.currentPage].name]
    }

    get page0() {
        return html`
            <my-profile-section-3-page-0 .item=${this.currentItem} .oldValues=${this.oldValues}></my-profile-section-3-page-0>
        `;
    }

    get page1() {
        return html`
            <my-profile-section-3-page-1 .item=${this.currentItem} .oldValues=${this.oldValues}></my-profile-section-3-page-1>
        `;
    }

    get page2() {
        return html`
            <my-profile-section-3-page-2 .item=${this.currentItem} .oldValues=${this.oldValues}></my-profile-section-3-page-2>
        `;
    }

    get page3() {
        return html`
            <my-profile-section-3-page-3 .item=${this.currentItem} .oldValues=${this.oldValues}></my-profile-section-3-page-3>
        `;
    }

    get page4() {
        return html`
            <my-profile-section-3-page-4 .item=${this.currentItem} .oldValues=${this.oldValues}></my-profile-section-3-page-4>
        `;
    }

    get page5() {
        return html`
            <my-profile-section-2-page-5 .item=${this.currentItem} .oldValues=${this.oldValues}></my-profile-section-2-page-5>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    documentIcon(type) {
        switch (type) {
            case 1:
                return "passport-solid"
            case 2:
                return "medical-insurance-solid"
            case 3:
                return "snils-solid"
            case 4:
                return "birth-certificate-solid"
            default:
                return "documents-solid"
        }
    }

    documentName(type) {
        switch (type) {
            case 1:
                return lang`Passport`
            case 2:
                return lang`Medical insurance`
            case 3:
                return lang`SNILS`
            case 4:
                return lang`Birth certificate`
            default:
                return '';
        }
    }

    get #list1() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${ this.documentName(item?.type) }
                        title=${ new Date(item?.date).toLocaleString() }
                        icon-name=${ item?.icon || this.documentIcon(item?.type)}
                        ?selected=${this.currentItem === item}
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    get #list() {
        switch(this.currentList) {
            case 0: return cache(this.#list1)
            default: return cache(this.#list1)
        }
    }

    newRecord() {
        return html `<icon-button
                label=${ this.documentName(this.currentItem?.type) }
                title=${ this.documentName(this.currentItem?.type) }
                icon-name=${ this.documentIcon(this.currentItem?.type) }
                ?selected=${ true }
            >
            </icon-button>
        `
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    cancelFind() {
        this.currentPage = 0
    }

    find() {
        // alert(JSON.stringify(this.dataSource.findIndex(this.currentFilter)))
        const result = this.dataSource.find(this.currentFilter)
        this.currentPage = 0
        this.dataSource.setCurrentItem(result)
    }

    async saveNewItem() {
        this.dataSource.saveNewItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    get #newItemFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.saveNewItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelNewItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    async cancelNewItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить добавление?')
        if (modalResult !== 'Ok')
            return
        this.dataSource.cancelNewItem()
        this.oldValues.clear();
        this.isModified = false;
    }

    get #itemFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.isModified ? this.saveItem: this.addNewItem}>${this.isModified ? lang`Save`: lang`Add`}</simple-button>
                <simple-button @click=${this.isModified ? this.cancelItem: this.deleteItem}>${this.isModified ? lang`Cancel`: lang`Delete`}</simple-button>
            </nav>
        `
    }

    async addNewItem() {
        if (this.currentPage === 0) {
            return
        }
        await this.dataSource.addNewItem(this.currentItem)
        this.currentItem.type = this.currentPage
        this.currentItem._id = this.pages[this.currentPage].id
        this.currentItem.payload = {}
        this.isModified = true
    }

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        // if (this.dataSource.items.length) {
        //     return (this.dataSource.state === States.NEW) ? this.#newItemFooter : this.#itemFooter
        // }

        if (this.isModified) {
            return (this.dataSource.state === States.NEW) ? this.#newItemFooter : this.#itemFooter
        } else {
            return html`
                <nav class="buttons">
                    ${this.pages.map( (button, index) =>
                        button.visible ? '' : html`<aside-button icon-name=${button.iconName instanceof Function ? button.iconName() : button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page}></aside-button>`)
                    }
                </nav>
            `
        }
    }

    //  <!-- ${this.pageNames.map( (page, index) =>
    //                 html `
    //                     <icon-button ?active=${index === this.currentPage} icon-name=${page.iconName} label=${page.label} @click=${() => this.currentPage = index}></icon-button>
    //                 `
    //             )} -->
    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Documents` + (this.dataSource?.items?.length ? ' ('+ this.dataSource?.items?.length +')': '')}<p>
                <aside-button icon-name=${ this.sortDirection ? "arrow-up-a-z-regular" : "arrow-up-z-a-regular"} @click=${this.sortPage}></aside-button>
                <aside-button icon-name="filter-regular" @click=${this.filterPage}></aside-button>
            </header>
            <header class="right-header">
                <div class="left-aside">
                    ${this.sections.map( (section, index) =>
                        html `
                            <icon-button ?active=${index === this.currentSection && this.sections.length !== 1} icon-name=${section.iconName || nothing} label=${section.name === 'section2'? lang`Request`: section.label} @click=${() => this.gotoSection(index)}></icon-button>
                        `
                    )}
                </div>
                <div class="right-aside">
                    <aside-button icon-name="search-regular" @click=${this.searchPage}></aside-button>
                </div>
            </header>
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


    gotoSection(index) {
        this.parentNode.host.currentSection = index;
    }

    gotoPage(index) {
        const item = DataSet.find('type', index)
        if (item) {
            this.showItem(item)
            return
        }
        this.currentPage = index
        this.addNewItem()
    }

    gotoList(index) {
        this.currentList = index
    }

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    searchPage() {
        this.currentFilter = {}
        this.currentPage = this.currentPage === 1 ? 0 : 1
    }

    sortPage() {
        this.sortDirection = !this.sortDirection
        this.dataSource.sort(this.sortDirection)
    }

    filterPage() {

    }

    async getQRCode() {
        const dataURI = await DataSet.getQRCode(this.currentItem._id)
        const blob = await (await fetch(dataURI)).blob();
        window.open(URL.createObjectURL(blob))
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async addItem() {
        const newItem = { name: "Новый член федерации" }
        this.dataSource.addItem(newItem);
    }

    async saveItem() {
        if (this.currentItem.filename instanceof File) {
            let result = await DataSet.uploadDocument(this.currentItem.filename, this.pages[this.currentPage].id);
            if (!result) return;
            this.currentItem.filename = this.currentItem.filename.name
        }

        await this.dataSource.saveItem(this.currentItem);
        this.oldValues.forEach( (value, key) => {
            if (key.oldValue)
                key.oldValue = null;
        })
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
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
            key.oldValue = null;
            key.value = value;
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить эту заявку?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
        this.profileDataSet = await ProfileDataSet.getDataSet()
        this.parent = this.profileDataSet[0]
        await this.dataSource.init();
        this.currentPage = this.currentItem?.type || 0
    }
}

customElements.define("my-profile-section-3", MyProfileSection3);