import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/upload-input.mjs'
import '../../../../../components/inputs/download-input.mjs'
import '../../../../../components/buttons/icon-button.mjs'
import '../../../../../components/inputs/avatar-input.mjs'
import '../../../../../components/buttons/aside-button.mjs';
import '../../../../../components/buttons/simple-button.mjs';

import lang from '../../../polyathlon-dictionary.mjs'

import './my-competition-section-4-page-1.mjs'
import './my-competition-section-4-list-1.mjs'
//import './my-competition-section-4-page-2.mjs'
// import './my-competition-section-2-page-1.mjs'
// import './my-competition-section-2-list-1.mjs'

import DataSet from './my-competition-dataset.mjs'
//import SportsmenDataSet from './my-sportsmen/my-sportsmen-dataset.mjs'
import DataSource from './my-competition-datasource.mjs'

class MyCompetitionSection4 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default: "", local: true },
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            isFirst: { type: Boolean, default: false },
            currentSection: { type: BigInt, default: 0, local: true},
            currentList: { type: BigInt, default: 0, local: true},
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

                .avatar {
                    width: 100%;
                }

                avatar-input {
                    width: 80%;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }

                img {
                    width: 100%;
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
                        gap: 1vw;
                        simple-button {
                            height: 100%;
                        }
                    }
                }

                /* icon-button[selected] {
                    background: rgba(255, 255, 255, 0.1)
                }

                icon-button:hover {
                    background: rgba(255, 255, 255, 0.1)
                } */

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
        this.listNames = [
            {label: 'Competition', iconName: ''},
        ]
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: 'Import from Excel', click: () => this.ExcelFile()},
            {iconName: 'pdf-make',  page: 'my-referee-categories', title: 'Make in PDF', click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: 'Back', click: () => this.gotoBack()},
        ]
    }
    pdfMethod() {
        const docInfo = {
          info: {
            title: "Referees",
            author: "Polyathlon systems",
          },

          pageSize: "A4",
          pageOrientation: 'portrait',
          pageMargins: [80, 30, 70, 60],

          content: [
            {
                text: "Всероссийская федерация Полиатлона",
                fontSize: 14,
                alignment: "center",
                margin: [10, 0, 0, 0],
            },
            {
                text: "Справка о проведённом общероссийской спортивной федерацией всероссийских и межрегиональных спортивных мероприятиях по полиатлону за (year) год",
                fontSize: 14,
                bold:true,
                alignment: "center",
                margin: [10, 20, 0, 0],
            },
            {
                text: "(stage)(name) - (year) по полиатлону в спортивной дисциплине (sport discipline)",
                fontSize: 14,
                bold:true,
                alignment: "center",
                margin: [60, 20, 50, 0],
            },
            {
                text: "Сроки и место проведения: (competition date), г.(city) (region)",
                fontSize: 11,
                alignment: "left",
                margin: [10, 20, 0, 0],
            },
            {
                text: "(gender)",
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                text: "Вид программы: (sport discipline)",
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                text: "Приняли участие: общее количество спортсменов - (menNumber+womenNumber) чел., в том числе:",
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                columns: [
                    {
                        text: "мужчин",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: "- (menNumber) чел.;",
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                columns: [
                    {
                        text: "женщин",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: "- (womenNumber) чел.;",
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                columns: [
                    {
                        text: "количество субъектов РФ",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: "- (regionNumber);",
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                columns: [
                    {
                        text: "количество клубов",
                        fontSize: 11,
                        alignment: "left",
                        margin: [85, 0, 0, 0],
                    },
                    {
                        text: "- (clubNumber).",
                        alignment: "left",
                        fontSize: 11,
                    },
                ],
            },
            {
                text: "Награждены медалями Минспорта России за:",
                fontSize: 11,
                alignment: "left",
                margin: [10, 0, 0, 0],
            },
            {
                text: "1 место мужчины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "2 место мужчины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "3 место мужчины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "1 место женщины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "2 место женщины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "3 место женщины - (sportsman)",
                fontSize: 11,
                alignment: "left",
                margin: [85, 0, 0, 0],
            },
            {
                text: "Сведения о командном зачёте среди субъектов РФ",
                fontSize: 11,
                alignment: "left",
                margin: [10, 10, 0, 5],
            },
            {
                table:{
                    widths: [ 20, 140, 50, 67, 67, 67 ],
                    body: [
                    [ {fontSize: 11, text: 'Место', alignment: "center"}, {fontSize: 11, text: 'Субъект РФ', alignment: "center"}, {fontSize: 11, text: 'Количество медалей', alignment: "center"}, {fontSize: 11, text: 'Сумма очков, набранная медалистами', alignment: "center"}, {fontSize: 11, text: 'Количество спортсменов в сборной команде', alignment: "center"}, {fontSize: 11, text: 'Количество спортсменов-медалистов', alignment: "center"} ],
                    [ {fontSize: 11, text: '1', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "left"}, {fontSize: 11, text: 'Value', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "center"}, {fontSize: 11, text: 'Value', alignment: "center"} ],
                    ],
                    headerRows: 1,
                }
            },
            {
                columns: [
                    {
                        text: "(position.name)",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "(name)",
                        alignment: "left",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [

                    {
                        text: "(category.name)",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`",
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [
                    {
                        text: "(position.name)",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "(name)",
                        alignment: "left",
                        margin: [0, 20, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [

                    {
                        text: "(category.name)",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`",
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
          ],

          styles: {
            header0:{
            }
          }
        };

        pdfMake.createPdf(docInfo).open();
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

    get #page() {
        switch(this.currentPage) {
            case 0: return cache(this.#page1())
            case 1: return cache(this.#page2())
            case 2: return cache(this.#page3())
        }
    }

    #page1() {
        return html`
            <my-competition-section-4-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-4-page-1>
        `;
    }

    #page2() {
        return html`
            <my-competition-section-4-page-2 .item=${this.currentItem}></my-competition-section-4-page-2>
        `;
    }

    #page3() {
        return html`
            <my-competition-section-4-page-3 .item=${this.currentItem}></my-competition-section-4-page-3>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    #list1() {
        return html`
            <my-competition-section-4-list-1 .avatar=${this.avatar} .name=${this.currentItem?.name} .startDate=${this.currentItem?.startDate} .endDate=${this.currentItem?.endDate} .stage=${this.currentItem?.stage}></my-competition-section-4-list-1>
        `;
    }

    #list2() {
        return html`
            <my-competition-section-4-list-2 .avatar=${this.avatar} .item=${this}></my-competition-section-4-list-2>
        `;
    }

    get #list() {
        switch(this.currentList) {
            case 0: return cache(this.#list1())
            case 1: return cache(this.#list2())
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



    get #rightFooter() {
        if (this.isModified) {
            return html`
                <nav>
                    <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                    <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
                </nav>
            `
        }
        else {
            return ''
        }
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить это соревнование?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                ${this.listNames.map( (list, index) =>
                    html `
                        <icon-button ?active=${index === this.currentList} icon-name=${list.iconName || nothing} label=${list.label} @click=${() => this.gotoList(index)}></icon-button>
                    `
                )}
            </header>
            <header class="right-header">
                ${this.sectionNames.map( (section, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection} icon-name=${section.iconName || nothing} label=${section.label} @click=${() => this.gotoPage(index)}></icon-button>
                    `
                )}
            </header>
            <div class="left-layout">
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

    gotoPage(index) {
        this.currentSection = index
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
            if (key.id === 'avatar') {
                window.URL.revokeObjectURL(value);
                this.avatar = value;
                this.avatarFile = null;
            } else {
                const currentItem = key.currentObject ?? this.currentItem
                currentItem[key.id] = value;
                key.oldValue = null;
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

    async firstUpdated() {
        super.firstUpdated();
        this.isFirst  = false;
        this.dataSource = new DataSource(this)
        await this.dataSource.getItem()
        if (this.currentItem._id) {
            this.avatar = await DataSet.downloadAvatar(this.currentItem._id);
        }
        this.isFirst = true;
    }
}

customElements.define("my-competition-section-4", MyCompetitionSection4);