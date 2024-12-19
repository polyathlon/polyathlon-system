import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'
import '../../../../../components/buttons/aside-button.mjs'
import '../../../../../components/buttons/simple-button.mjs'

import lang from '../../../polyathlon-dictionary.mjs'

import { States } from "../../../../utils.js"

import './tab-1/my-discipline-names-section-1-tab-1-page-1.mjs'
import './tab-2/my-discipline-names-section-1-tab-2-page-1.mjs'
import './tab-2/my-discipline-names-section-1-tab-2-page-2.mjs'

import DataSet from './my-discipline-names-dataset.mjs'
import DataSource from './my-discipline-names-datasource.mjs'

class MyDisciplineNamesSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default: "", local: true },
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0, local: true },
            currentTab: { type: BigInt, default: 0, local: true},
            currentRow: { type: BigInt, default: 0, local: true },
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
                        "footer1  footer2";
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
                    justify-content: flex-start;
                    p {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin: 0;
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
                    justify-content: flex-start;
                    icon-button {
                        height: 100%;
                        padding: 0 1vw;
                        &[active] {
                            background-color: var(--layout-background-color);
                            font-weight: bold;
                        }
                        &:hover {
                            background-color: var(--layout-background-color);
                        }
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
                        gap: 1vw;
                        simple-button {
                            height: 100%;
                        }
                        &.buttons {
                            justify-content: center;
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
        this.pageNames = [lang`Component`]
        this.oldValues = new Map();
        this.currentTab = 0
        this.tabNames = [
            {label: lang`Component`, iconName: 'puzzle-solid'},
            {label: lang`Points Table`, iconName: 'sportsman-man-solid'},
            {label: lang`Points Table`, iconName: 'sportsman-woman-solid'},
        ]
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: 'Import from Excel', click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: 'Back', click: () => this.gotoBack()},
        ]
        this.pages = [
            {iconName: 'competition-solid', page: 0, title: lang`Competition`, click: () => this.gotoPage(0)},
            {iconName: 'age-group-solid', page: 1, title: lang`Location`, click: () => this.gotoPage(1)},
            {iconName: 'location-circle-solid', page: 2, title: lang`Location`, click: () => this.gotoPage(2)},
            // {iconName: 'map-solid', page: 3, title: lang`Swimming`, click: () => this.gotoPage(3)},
            {iconName: 'registration-solid', page: 5, title: lang`Swimming`, click: () => this.gotoPage(5)},
            {iconName: 'circle-trash-sharp-solid', page: -2, title: lang`Delete`, click: this.deleteItem},
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
        const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
        const regionDataset = await RegionDataset.RegionDataset()
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
        if (changedProps.has('currentDisciplineNameItem')) {
            this.currentPage = 0;
        }
    }

    async showItem(item) {
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
        switch(this.currentTab) {
            case 0:
                return cache(this.#page1())
            case 1:
                switch(this.currentPage) {
                    case 0: return cache(this.#page21())
                    case 1: return cache(this.#page22())
                    default: return cache(this.#page21())
                }
            case 2:
                switch(this.currentPage) {
                    case 0: return cache(this.#page31())
                    case 1: return cache(this.#page32())
                    default: return cache(this.#page21())
                }
            default: return cache(this.#page1())
        }
    }

    #page1() {
        return html`
            <my-discipline-names-section-1-tab-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-discipline-names-section-1-tab-1-page-1>
        `;
    }

    #page21() {
        return html`
            <my-discipline-names-section-1-tab-2-page-1 .item=${this.currentItem}></my-discipline-names-section-1-tab-2-page-1>
        `;
    }
    #page22() {
        return html`
            <my-discipline-names-section-1-tab-2-page-2 .item=${this.currentItem}></my-discipline-names-section-1-tab-2-page-2>
        `;
    }
    #page31() {
        return html`
            <my-discipline-names-section-1-tab-3-page-1 .item=${this.currentItem}></my-discipline-names-section-1-tab-3-page-1>
        `;
    }
    #page32() {
        return html`
            <my-discipline-names-section-1-tab-3-page-2 .item=${this.currentItem}></my-discipline-names-section-1-tab-2-page-2>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    get #list() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${item.name}
                        title=${item._id}
                        icon-name=${item.icon || nothing}
                        ?selected=${this.currentItem === item}
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    newRecord() {
        return html `<icon-button
                label=${ this.currentItem?.name }
                title=${ this.currentItem?.name }
                icon-name=${ this.currentItem?.icon || "picture-circle-solid" }
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
        this.dataSource.addNewItem(this.currentItem);
        // const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        // page.startEdit()
    }


    get #rightFooterTab1Page1() {
        if (!this.dataSource?.items)
            return ''
        if (this.dataSource.items.length) {
            return (this.dataSource.state === States.NEW) ? this.#newItemFooter : this.#itemFooter
        }

        if (this.isModified) {
            return this.#newItemFooter
        }
    }

    get #rightFooterTab2Page1() {
        if (!this.dataSource?.items)
            return ''
        return html`
            <nav class='save'>
                <simple-button @click=${this.addNewRow}>${lang`Add`}</simple-button>
            </nav>
        `
    }

    addNewRow() {
        this.currentPage = 1;
    }

    get #rightFooterTab2Page2() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.isModified ? this.saveItem: this.addNewItem}>${this.isModified ? lang`Save`: lang`Add`}</simple-button>
                <simple-button @click=${this.isModified ? this.cancelItem: this.deleteItem}>${this.isModified ? lang`Cancel`: lang`Delete`}</simple-button>
            </nav>
        `
    }

    get #rightFooter() {
        switch(this.currentTab) {
            case 0:
                return this.#rightFooterTab1Page1
            case 1:
                switch(this.currentPage) {
                    case 0: return this.#rightFooterTab2Page1
                    case 1: return this.#rightFooterTab2Page2
                    default: return this.#rightFooterTab2Page1
                }
            case 2:
                switch(this.currentPage) {
                    case 0: return this.#rightFooterTab2Page1
                    default: return this.#rightFooterTab2Page1
                }
            default: this.#rightFooterTab1Page1
        }
    }

    // get #rightFooter() {
    //     if (this.isModified) {
    //         return html`
    //             <nav>
    //                 <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
    //                 <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
    //             </nav>
    //         `
    //     } else {
    //         return html`
    //             <nav>
    //                 <simple-button @click=${this.addItem}>${lang`Add`}</simple-button>
    //                 <simple-button @click=${this.deleteItem}>${lang`Delete`}</simple-button>
    //             </nav>
    //         `
    //     }

    // }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header"><p>${lang`Components`}</p></header>
            <header class="right-header">
                ${this.tabNames.map( (tab, index) =>
                    html `
                        <icon-button ?active=${index === this.currentTab} icon-name=${tab.iconName || nothing} label=${tab.label} @click=${() => this.gotoTab(index)}></icon-button>
                    `
                )}

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

    gotoSelection(index) {
        this.currentSection = index
    }

    gotoTab(index) {
        this.currentTab = index
    }

    gotoPage(index) {
        this.currentPage = index
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

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async addItem() {
        const newItem = { name: "Новая группа дисциплин" }
        this.dataSource.addItem(newItem);
    }

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
        if (modalResult !== 'Ok')
            return
        this.oldValues.forEach( (value, key) => {
            const currentItem = key.currentObject ?? this.currentItem
            currentItem[key.id] = value;
            key.value = value;
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить эту дисциплину?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
        await this.dataSource.init();
    }
}

customElements.define("my-discipline-names-section-1", MyDisciplineNamesSection1);