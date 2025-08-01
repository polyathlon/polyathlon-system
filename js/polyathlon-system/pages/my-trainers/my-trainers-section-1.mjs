import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/modal-dialog.mjs'
import '../../../../components/buttons/icon-button.mjs'
import '../../../../components/buttons/aside-button.mjs'
import '../../../../components/buttons/simple-button.mjs'

import lang from '../../polyathlon-dictionary.mjs'

import './my-trainers-section-1-page-1.mjs'

import DataSet from './my-trainers-dataset.mjs'
import DataSource from './my-trainers-datasource.mjs'

class MyTrainersSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: {type: Object, default: null},
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
        this.pageNames = [lang`Information`]
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-trainers', title: lang`Export to Excel`, click: () => this.ExportToExcel()},
            {iconName: 'arrow-up-from-bracket-sharp-solid', page: 'my-trainers', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'pdf-make',  page: 'my-trainer-categories', title: lang`Make in PDF`, click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-trainer-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
    }

    pdfMethod() {

        var docInfo = {

            info: {
                title:'Referees',
                author:'Polyathlon systems',
            },

            pageSize:'A4',
            pageOrientation:'landscape',//'portrait'
            pageMargins:[50,50,30,60],

            header:function(currentPage,pageCount) {
                return {
                    text: currentPage.toString() + 'из' + pageCount,
                    alignment:'right',
                    margin:[0,30,10,50]
                }
            },

            content: [

                {
                    text:'Дмитрий',
                    fontSize:20,
                    margin:[150, 80, 30,0]
                    //pageBreak:'after'
                },

                {
                    text:'Гуськов',
                    style:'header'
                    //pageBreak:'before'
                }
            ]
        }
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

    async exportToExcel(e) {
        const modalResult = await this.showDialog('Вы действительно хотите экспортировать всех тренеров в файл Excel?', 'confirm')
        if (modalResult === 'Ok') {
            const raw_data = await this.dataSource.items
            const rows = raw_data.map(row => ({
                lastName: row.lastName,
                firstName: row.firstName,
                middleName: row.middleName,
                category: row.category?.shortName,
                region: row.region?.name,
                trainerId: row.trainerId,
                orderNumber: row.order?.number,
                link: row.link,
                orderLink: row.order?.link,
                gender: row.gender,
            })).sort((l, r) => {
                let a = l.lastName?.localeCompare(r.lastName)
                if (a) {
                    return a
                }
                a = l.firstName?.localeCompare(r.firstName)
                if (a) {
                    return a
                }
                a = l.middleName?.localeCompare(r.middleName)
                if (a) {
                    return a
                }
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Тренеры");

            /* fix headers */
            XLSX.utils.sheet_add_aoa(worksheet, [[
                "Фамилия",
                "Имя",
                "Отчество",
                "Разряд",
                "Регион",
                "Персональный код тренера",
                "Дата приказа",
                "Персональная ссылка",
                "Ссылка на приказ",
                "Пол",
            ]], { origin: "A1" });

            /* calculate column width */
            const max_width_1 = rows.reduce((w, r) => Math.max(w, r.lastName?.length), 10);
            const max_width_2 = rows.reduce((w, r) => r.firstName?.length ? Math.max(w, r.firstName?.length) : w, 10);
            const max_width_3 = rows.reduce((w, r) => r.middleName?.length ? Math.max(w, r.middleName?.length) : w, 10);
            const max_width_4 = rows.reduce((w, r) => r.category?.length ? Math.max(w, r.category?.length) : w, 6);
            const max_width_5 = rows.reduce((w, r) => r.region?.length ? Math.max(w, r.region?.length) : w, 10);

            const LightBlue = {
                fgColor: { rgb: "BDD7EE" }
            };

            worksheet["!cols"] = [ { wch: max_width_1 },  { wch: max_width_2 }, { wch: max_width_3 }, { wch: max_width_4 }, { wch: max_width_5 }, ];

            XLSX.writeFile(workbook, "Trainers.xlsx", { compression: true });
        }
    }

    async exportFromExcel(e) {
        const file = e.target.files[0];
        const workbook = XLSX.read(await file.arrayBuffer());
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
        const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
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
                    region: regionDataset.find("name", r[3]),
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
        if (changedProps.has('currentTrainerItem')) {
            this.currentPage = 0;
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
    }

    async showItem(item) {
        if (this.currentItem?._id === item._id) {
            this.copyToClipboard(item.id || item._id)
            return
        }
        if (this.isModified) {
            const modalResult = await this.confirmDialog('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(this.currentItem);
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
            <my-trainers-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-trainers-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-trainers-section-1-page-2 .item=${this.currentItem}></my-trainers-section-1-page-2>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
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

    get #list() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `<icon-button
                        label=${this.fio(item)}
                        title=${item._id}
                        image-name=${ item.gender == 0 ? "images/trainer-boy-solid.svg" : "images/trainer-girl-solid.svg" }
                        ?selected=${this.currentItem === item}
                        .status=${ { name: item.category?.name || item?._id, icon: 'referee-category-solid'} }
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
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
        } else {
            return html`
                <nav>
                    <simple-button @click=${this.addItem}>${lang`Add`}</simple-button>
                    <simple-button @click=${this.deleteItem}>${lang`Delete`}</simple-button>
                </nav>
            `
        }

    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header"><p>${lang`Trainers` + ' ('+ this.dataSource?.items?.length +')'}<p></header>
            <header class="right-header">
                ${this.#pageName}
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
            <input type="file" id="fileInput" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv" @input=${this.exportFromExcel}/>
        `;
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
        const newItem = { name: "Новый регион" }
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

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить этот регион?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
    }
}
customElements.define("my-trainers-section-1", MyTrainersSection1)