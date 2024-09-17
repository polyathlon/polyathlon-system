import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/country-button.mjs'
import '../../../../components/buttons/project-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import '../../../../components/buttons/aside-button.mjs';

import './my-referees-section-1-page-1.mjs'
// import './my-competitions-section-1-page-2.mjs'
import DataSet from './my-referees-dataset.mjs'
import DataSource from './my-referees-datasource.mjs'

class MyRefereesSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: {type: Object, default: []},
            statusDataSet: {type: Map, default: null },
            oldValues: {type: Map, default: null },
            currentItem: {type: Object, default: null},
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

                #competition-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #competition-header p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                }

                #property-header{
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
                }

                .left-layout country-button,
                .left-layout project-button
                {
                    width: 100%;
                    height: 40px;
                }

                .right-layout {
                    overflow-y: auto;
                    overflow-x: hidden;
                    grid-area: content;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: flex-start;
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
                }

                .right-footer {
                    grid-area: footer2;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                .left-footer nav{
                    background-color: rgba(255, 255, 255, 0.1);
                    width: 100%;
                    height: 70%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* padding-right: 10px; */
                    gap: 10px;
                }

                .right-footer {
                    simple-button {
                        height: 36px;
                        &:hover {
                            background-color: red;
                        }
                    }
                }


                country-button[selected],
                project-button[selected]
                {
                    background: rgba(255, 255, 255, 0.1)
                }

                country-button:hover,
                project-button:hover
                {
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
        this.pageNames = ['Referee property']
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'referee-solid', page: 'my-referee-positions', title: 'Referee Positions', click: () => this.showPage('my-referee-positions')},
            {iconName: 'judge-rank-solid', page: 'my-referee-categories', title: 'Referee Categories', click: () => this.showPage('my-referee-categories')},
            {iconName: 'excel-import-solid', page: 'my-referee-categories', title: 'Import from Excel', click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-referee-categories', title: 'Back', click: () => this.gotoBack()},
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
        // raw_data.forEach(r => console.log(r[0],r[1], r[2], r[3], r[4], r[5]));
        <simple-input id="lastName" icon-name="user" label="Referee LastName:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
        <simple-input id="firstName" icon-name="user-group-solid" label="Referee FistName:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
        <simple-input id="middleName" icon-name="users-solid" label="Referee MiddleName:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
        <simple-select id="category" icon-name="judge-rank-solid" label="Category name:" .dataSource=${this.refereeCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
        <simple-input id="order" icon-name="flag-solid" label="Order number:" .value=${this.item?.order} @input=${this.validateInput}></simple-input>
        <simple-input id="orderLink" icon-name="flag-solid" label="Order link:" .value=${this.item?.orderLink} @input=${this.validateInput}></simple-input>
        raw_data.forEach( (r, index) => {
            if (index !== 0) {
                const newItem = {
                    lastName: r[1].split(' ')[0].toLowerCase()[0].toUpperCase() + r[1].split(' ')[0].toLowerCase().slice(1),
                    firstName: r[1].split(' ')[1],
                    middleName: r[1].split(' ')[2],
                    category: {
                        "_id": "referee-category:01J7NQ2NX0G3Y1R4D0GY1FFJT1",
                        "_rev": "3-ef23dd9cc44affc2ec440951b1d527d9",
                        "name": "Судья всероссийской категории",
                        "owner": "01J6VY01Y135G76YA7NB6HXXX8",
                        "short-name": "ВК"
                      },
                      
                }
                this.dataSource.addItem(newItem);
                console.log(r[0],r[1])
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
        if (changedProps.has('currentRefereeItem')) {
            this.currentPage = 0;
        }
    }

    async showItem(index, itemId) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(this.currentItem);
            }
            else {
                await this.cancelItem()
            }
        }
        else {
            this.dataSource.setCurrentItem(this.dataSource.items[index])
        }
    }

    #page() {
        return cache(this.currentPage === 0 ? this.#page1() : this.#page2());
    }

    #page1() {
        return html`
            <my-referees-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-referees-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-referees-section-1-page-2 .item=${this.currentItem}></my-referees-section-1-page-2>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    get #list() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `<project-button
                        label=${item.lastName}
                        title=${item._id}
                        icon-name="judge1-solid"
                        .status=${item.category}
                        ?selected=${this.currentItem === item}
                        @click=${() => this.showItem(index, item._id)}
                    >
                    </project-button>
            `)}
        `
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    render() {
        return html`
            <confirm-dialog></confirm-dialog>
            <header id="competition-header"><p>Referee</p></header>
            <header id="property-header">${this.#pageName}</header>
            <div class="left-layout">
                ${this.#list}
            </div>
            <div class="right-layout">
                ${this.#page()}
            </div>
            <footer class="left-footer">
                ${this.#task}
            </footer>
            <footer class="right-footer">
                <simple-button label=${this.isModified ? "Сохранить": "Удалить"} @click=${this.isModified ? this.saveItem: this.deleteItem}></simple-button>
                <simple-button label=${this.isModified ? "Отменить": "Добавить"} @click=${this.isModified ? this.cancelItem: this.addItem}></simple-button>
            </footer>
            <input type="file" id="fileInput" accept="accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv" @input=${this.importFromExcel}/>
        `;
    }

    nextPage() {
        this.currentPage++;
    }
    prevPage() {
        this.currentPage--;
    }

    async confirmDialogShow(message) {
        return await this.renderRoot.querySelector('confirm-dialog').show(message);
    }

    async addItem() {
        this.dataSource.addItem();
    }

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialogShow('Вы действительно хотите отменить все изменения?')
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
        const modalResult = await this.confirmDialogShow('Вы действительно хотите удалить этот проект?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
    }
}

customElements.define("my-referees-section-1", MyRefereesSection1)