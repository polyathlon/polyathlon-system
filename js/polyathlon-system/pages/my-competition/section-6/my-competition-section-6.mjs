import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'

import '../../../../../components/buttons/aside-button.mjs';
import '../../../../../components/buttons/simple-button.mjs';

import lang from '../../../polyathlon-dictionary.mjs'

import { States } from "../../../../utils.js"

import './my-competition-section-6-list-1.mjs'
import './my-competition-section-6-page-1.mjs'
import './my-competition-section-6-page-2.mjs'
import './my-competition-section-6-page-3.mjs'
import './my-competition-section-6-page-4.mjs'
import './my-competition-section-6-page-5.mjs'
import './my-competition-section-6-page-6.mjs'
import './my-competition-section-6-page-7.mjs'
import './my-competition-section-6-page-8.mjs'
import './my-competition-section-6-page-9.mjs'
import './my-competition-section-6-page-10.mjs'

import DataSet from './my-competition-section-6-dataset.mjs'
import DataSource from './my-competition-section-6-datasource.mjs'

import CompetitionDataSource from '../section-1/my-competition-datasource.mjs'

class MyCompetitionSection6 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null, local: true },
            isModified: { type: Boolean, default: "", local: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            currentSection: { type: BigInt, default: 1, local: true},
            parent: { type: Object, default: {} },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: grid;
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
                    justify-content: center;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: var(--layout-background-color);
                    gap: 10px;
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                    }
                    .label {
                        text-align: center;
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
                    /* overflow: hidden; */
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
        this.currentPage = 0;
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: 'Import from Excel', click: () => this.ExcelFile()},
            {iconName: 'competition-solid', page: 'my-coach-categories', title: 'Sports place', click: () => this.sportsPlace()},
            {iconName: 'drawing-lots-solid', page: 'my-coach-categories', title: 'Drawing lots', click: () => this.drawingLots()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: 'Back', click: () => this.gotoBack()},
        ]
        this.pages = [
            {name: 'page1', iconName: 'shooting-solid', page: 0, title: lang`Shooting`, click: () => this.gotoPage(0)},
            {name: 'page2', iconName: 'swimming-solid', page: 3, title: lang`Swimming`, click: () => this.gotoPage(3)},
            {name: 'page3', iconName: 'sprinting-solid', page: 5, title: lang`Sprinting`, click: () => this.gotoPage(5)},
            {name: 'page4', iconName: 'throwing-solid', page: 4, title: lang`Throwing`, click: () => this.gotoPage(4)},
            {name: 'page5', iconName: 'running-solid', page: 6, title: lang`Running`, click: () => this.gotoPage(6)},
            {name: 'page6', iconName: 'pull-ups-solid', page: 1, title: lang`Pull-ups`, click: () => this.gotoPage(1)},
            {name: 'page7', iconName: 'push-ups-solid', page: 2, title: lang`Push-ups`, click: () => this.gotoPage(2)},
            {name: 'page8', iconName: 'skiing-solid', page: 7, title: lang`Skiing`, click: () => this.gotoPage(7)},
            {name: 'page9', iconName: 'roller-skiing-solid', page: 8, title: lang`Roller skiing`, click: () => this.gotoPage(8)},
            {name: 'page10', iconName: 'jumping-solid', page: 9, title: lang`Jumping`, click: () => this.gotoPage(9)},
        ]
    }

    allPoints() {

    }

    sportsPlace() {
        const item = this.dataSource.items.map(item => item).sort( (a, b) =>
            a.points - b.points
        )
        item.reduce((a, b) => {
            if (b.place != a + 1) {
                b.place = a + 1
                this.dataSource.saveItem(b);
            }
            return a + 1
        }, 0)
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
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
    }

    // async showItem(index, itemId) {
    //     if (this.isModified) {
    //         const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
    //         if (modalResult === 'Ok') {
    //             await this.dataSource.saveItem(this.currentItem);
    //         }
    //         else {
    //             await this.cancelItem()
    //         }
    //     }
    //     else {
    //         this.dataSource.setCurrentItem(this.dataSource.items[index])
    //     }
    // }

    get page() {
        return cache(this[this.pages[this.currentPage].name])
    }

    get page1() {
        return html`
            <my-competition-section-6-page-1 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-1>
        `;
    }

    get page2() {
        return html`
            <my-competition-section-6-page-2 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-2>
        `;
    }

    get page3() {
        return html`
            <my-competition-section-6-page-3 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-3>
            `;
    }

    get page4() {
        return html`
            <my-competition-section-6-page-4 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-4>
            `;
    }

    get page5() {
        return html`
            <my-competition-section-6-page-5 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-5>
        `;
    }

    get page6() {
        return html`
            <my-competition-section-6-page-6 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-6>
        `;
    }

    get page7() {
        return html`
            <my-competition-section-6-page-7 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-7>
        `;
    }

    get page8() {
        return html`
            <my-competition-section-6-page-8 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-8>
        `;
    }

    get page9() {
        return html`
            <my-competition-section-6-page-9 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-9>
        `;
    }

    get page10() {
        return html`
            <my-competition-section-6-page-10 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-10>
        `;
    }

    fio(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName[0]}.`
        }
        if (item.middleName) {
            result += `${item.middleName[0]}.`
        }
        return result
    }

    newRecord() {
        return html `<icon-button
                label=${ this.fio(this.currentItem) || "Новый спортсмен" }
                title=''
                icon-name=${ this.currentItem?.gender == 0 ? "sportsman-man-solid" : "sportsman-woman-solid" }
                ?selected=${ true }
                .status=${{ name: this.currentItem?.sportsmanId || this.currentItem?.sportsmanUlid || "sportsman:new", icon: 'id-number-solid'} }
            >
            </icon-button>
        `
    }

    #list1() {
        return html`
            <my-competition-section-6-list-1 .item=${this}></my-competition-section-6-list-1>
        `;
    }

    #list3() {
        return html`
            <my-competition-section-6-list-1 .parent=${this.currentItem}></my-competition-section-6-list-3>
        `;
    }

    get #list() {
        switch (this.currentPage) {
            // case 6: return cache(this.#list2())
            default: return cache(this.#list1())
        }
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    get #firstItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveFirstItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #newItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveNewItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelNewItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #itemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #addItemFooter() {
        return html`
            <nav class="buttons">
                ${this.pages.map( (button, index) =>
                    html`<aside-button icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page} size="34"></aside-button>`)
                }
            </nav>
        `
    }

    get #rightFooter() {
        if (!this.dataSource?.items)
            return ''
        if (this.dataSource.items.length) {
            if (this.dataSource.state === States.NEW) {
                return this.#newItemFooter
            }
            if (this.isModified) {
                return this.#itemFooter
            }
            return this.#addItemFooter
        }
        if (this.dataSource.state === States.NEW) {
            return this.#newItemFooter
        }
        if (this.isModified) {
            return this.#firstItemFooter
        }
        return ''
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Sportsmen` + ' ('+ this.dataSource?.items?.length +')'}</p>
                <!-- <aside-button icon-name="search-regular" @click=${() => this.currentPage = this.currentPage === 1 ? 0 : 1}></aside-button> -->
                <aside-button icon-name="filter-regular" @click=${() => this.currentPage = this.currentPage === 1 ? 0 : 1}></aside-button>
            </header>
            <header class="right-header">
                ${this.sections.map( (page, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection} icon-name=${page.iconName} label=${page.label} @click=${() => this.gotoSelection(index)}></icon-button>
                    `
                )}
            </header>
            <div class="left-layout">
                ${this.dataSource?.state === States.NEW ? this.newRecord() : ''}
                ${this.#list}
            </div>
            <div class="right-layout">
                ${this.page}
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

    gotoSelection(index) {
        this.currentSection = index
    }

    gotoPage(index) {
        this.currentPage = index
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

    async addNewItem() {
        this.dataSource.addNewItem(this.currentItem);
        // const page = this.renderRoot.querySelector('my-sportsmen-section-6-page-1')
        // page.startEdit()
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
        if ('_id' in this.currentItem) {
            await this.dataSource.saveItem(this.currentItem);
        } else {
            await this.dataSource.addItem(this.currentItem);
        }
        if (this.avatarFile) {
            let result = await DataSet.uploadAvatar(this.avatarFile, this.currentItem._id);
            if (!result) return;
        }
        this.avatarFile = null;
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelNewItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить добавление?')
        if (modalResult !== 'Ok')
            return
        this.dataSource.cancelNewItem()
        this.oldValues.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
        if (modalResult !== 'Ok')
            return
        this.oldValues.forEach( (value, key) => {
            if (key.id === 'avatar') {
                window.URL.revokeObjectURL(value);
                this.avatar = value;
                this.avatarFile = null;
            } else {
                const currentItem = key.currentObject ?? this.currentItem
                currentItem[key.id] = value;
                key.value = value;
            }
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    validateAvatar(e) {
        this.oldValues ??= new Map();
        if (!this.oldValues.has(e.target)) {
            this.oldValues.set(e.target, e.target.avatar)
            this.avatar = window.URL.createObjectURL(e.target.value);
            this.avatarFile = e.target.value;
            this.requestUpdate();
        }
        else if (this.oldValues.get(e.target) === e.target.avatar) {
            this.oldValues.delete(e.target.id)
            this.avatarFile = null;
        } else {
            this.avatar = window.URL.createObjectURL(e.target.value);
            this.avatarFile = e.target.value;
            this.requestUpdate();
        }
        this.isModified = this.oldValues.size !== 0;
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить этого спортсмена?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem, this.listItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        const parentId = localStorage.getItem('currentCompetition').split(':')[1]
        this.competitionDataSource = new CompetitionDataSource(this)
        this.parent = await this.competitionDataSource.getItem()
        this.dataSource = new DataSource(this, await DataSet.getDataSet(parentId))
    }
}

customElements.define("my-competition-section-6", MyCompetitionSection6);