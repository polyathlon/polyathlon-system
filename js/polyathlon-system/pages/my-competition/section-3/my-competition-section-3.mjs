import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'

import '../../../../../components/buttons/aside-button.mjs';
import '../../../../../components/buttons/simple-button.mjs';

import lang from '../../../polyathlon-dictionary.mjs'

import { isAuth, States } from '../../../../utils.js'

import './my-competition-section-3-page-1.mjs'

import './my-competition-section-3-list-1.mjs'

import './my-competition-section-3-page-search.mjs'

import './my-competition-section-3-page-filter.mjs'

import DataSet from './my-competition-section-3-dataset.mjs'
import DataSource from './my-competition-section-3-datasource.mjs'

import CompetitionDataSource from '../section-1/my-competition-datasource.mjs'

class MyCompetitionSection3 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null, local: true },
            currentItemRefresh: { type: Boolean, default: false, local: true },
            isModified: { type: Boolean, default: false, local: true },
            sortDirection: { type: Boolean, default: undefined, local: true},
            currentFilter: { type: Object, default: {} },
            isFiltered: { type: Boolean, default: false },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            parent: { type: Object, default: {} },
            isFilterModified: { type: Boolean, default: false, local: true },
            oldFilterValues: { type: Map, default: null },
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
        this.$partid = 'MyCompetitionSection3'
        this.statusDataSet = new Map()
        this.currentPage = 0
        this.oldValues = new Map()
        this.oldFilterValues = new Map()
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-referee-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'pdf-make',  page: 'my-referee-categories', title: lang`Make in PDF`, click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-referee-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
        this.pages = [
            {iconName: 'referee-solid', page: () => this.#page1(), title: lang`Referees`, click: () => this.gotoPage(0)},
            {iconName: 'search-regular', page: () => this.#pageSearch(), title: lang`Search`, click: () => this.gotoPage(1)},
            {iconName: 'filter-regular', page: () => this.#pageFilter(), title: lang`Filter`, click: () => this.gotoPage(2)},
        ]
    }

    showPage(page) {
        location.hash = page;
    }

    gotoBack(page) {
        history.back();
    }

    #competitionDate(parent) {
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

        if (parent.startDate) {
            const start = parent.startDate.split("-")
            const end = parent.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            return `${start[2]} ${monthNames[start[1]-1]} - ${end[2]} ${monthNames[end[1] - 1]} ${start[0]} года`
        }
        return ''
    }

    pdfMethod() {
        const mainReferee = this.dataSource.items.find((item) => item.position.name === "Главный судья")
        const mainSecretary = this.dataSource.items.find((item) => item.position.name === "Главный секретарь")
        const docInfo = {
          info: {
            title: "Referees",
            author: "Polyathlon systems",
          },

          pageSize: "A4",
          pageOrientation: 'portrait',
          pageMargins: [50, 50, 30, 60],

          content: [
            {
              text: "Министерство спорта Российской федерации",
              fontSize: 14,
              alignment: "center",
              margin: [0, -30, 0, 0],
            },
            {
                text: "Всероссийская федерация Полиатлона",
                fontSize: 14,
                alignment: "center",
            },
            {
                text: this.parent.name.name,
                fontSize: 18,
                bold:true,
                alignment: "center",
                margin: [0, 15, 0, 0],
            },
            {
                text: "по полиатлону в спортивной дисциплине",
                fontSize: 18,
                alignment: "center",
            },
            {
                text: this.parent?.sportsDiscipline1?.name,
                fontSize: 18,
                bold:true,
                alignment: "center",
            },
            {
                columns: [

                    {
                        width: 'auto',
                        text: this.#competitionDate(this.parent),
                        margin: [0, 15, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`,
                        alignment: "right",
                        margin: [0, 15, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                text: "Справка о составе и квалификации",
                fontSize: 16,
                bold:true,
                alignment: "center",
                margin: [0, 20, 0, 0],
            },
            {
                text: "Главной судейской коллегии",
                fontSize: 18,
                bold:true,
                alignment: "center",
                margin: [0, 0, 0, 15],
            },
            {
                table:{
                    width:['auto','*'],
                    body: this.dataSource.items.map( (item, index) => [
                        {margin: [0, 5, 0, 0], text: item.position.name, alignment: "center"}, `${item.category.name} ${item.lastName} ${item.firstName} ${item.middleName} (${item?.city?.name}, ${item?.city?.region?.name})`
                    ]),
                    headerRows:1
                },
            },
            {
                columns: [
                    {
                        width: 300,
                        text: mainReferee?.position.name,
                        margin: [20, 20, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `${mainReferee?.firstName[0]}.${mainReferee?.middleName[0]}. ${mainReferee?.lastName}`,
                        alignment: "left",
                        margin: [0, 20, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                columns: [

                    {
                        width: 300,
                        text: mainReferee?.category.name,
                        margin: [20, 0, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`,
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                columns: [

                    {
                        width: 300,
                        text: mainSecretary?.position.name,
                        margin: [20, 15, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `${mainSecretary?.firstName[0]}.${mainSecretary?.middleName[0]}. ${mainSecretary?.lastName}`,
                        alignment: "left",
                        margin: [0, 20, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                columns: [

                    {
                        width: 300,
                        text: mainSecretary?.category.name,
                        margin: [20, 0, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `(г. ${mainSecretary?.city?.name}, ${mainSecretary?.city?.region?.name})`,
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
          ],

          styles: {
            header0:{
            }
          }
        };

        pdfMake.createPdf(docInfo).open();
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
    //         const modalResult = await this.confirmDialog('Запись была изменена. Сохранить изменения?')
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
        return this.pages[this.currentPage].page();
    }

    #page1() {
        return html`
            <my-competition-section-3-page-1 .parent=${this.parent} .item=${this.currentItem} .oldValues=${this.oldValues}></my-competition-section-3-page-1>
        `
    }

    #pageSearch() {
        return html`
            <my-competition-section-3-page-search .item=${this.currentSearch}></my-competition-section-3-page-search>
        `;
    }


    #pageFilter() {
        return html`
            <my-competition-section-3-page-filter .item=${this.currentFilter} .oldValues=${this.oldFilterValues}></my-competition-section-3-page-filter>
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
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        return result
    }

    newRecord() {
        return html `
            ${this.currentItemRefresh ? '' : ''}
            <icon-button
                label=${ this.fio(this.currentItem) || "Новый судья" }
                title=''
                icon-name=${ this.currentItem?.gender == 0 ? "referee-man-solid" : "referee-woman-solid" }
                ?selected=${ true }
                .status=${{ name: this.currentItem.position?.name || 'Не задано', icon: 'referee-position-solid' }}
            >
            </icon-button>
        `
    }

    #list1() {
        return html`
            <my-competition-section-3-list-1 .item=${this}></my-competition-section-3-list-1>
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

    get #addItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.addNewItem}>${lang`Add`}</simple-button>
                <simple-button @click=${this.deleteItem}>${lang`Delete`}</simple-button>
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

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        if (!this.dataSource?.items)
            return ''
        if (this.currentPage === 2) {
            return this.#filterFooter
        }
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

    sectionName(section) {
        if (this.currentPage == 0 ) {
            return section
        } else if (this.currentPage == 1 ) {
            return { name: "section3", label: lang`Search`, iconName: 'search-regular' }
        } else {
            return { name: "section3", label: lang`Filter`, iconName: 'filter-regular' }
        }
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Referees`  + (this.dataSource?.items?.length ? ' ('+ this.dataSource?.items?.length +')' : '')}</p>
                <p>
                    <aside-button icon-name=${ this.sortDirection ? "arrow-up-a-z-regular" : this.sortDirection === false  ? "arrow-up-z-a-regular" : "arrow-up-down-regular"} @click=${this.sortPage}></aside-button>
                    <aside-button icon-name="filter-regular" ?active=${this.isFiltered} @click=${this.filterPage}></aside-button>
                </p>
            </header>
            <header class="right-header">
                ${this.sections.map( (section, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection && this.sections.length !== 1} icon-name=${index === this.currentSection ? this.sectionName(section).iconName : section.iconName} label=${index === this.currentSection ? this.sectionName(section).label : section.label} @click=${() => this.gotoSection(index)}></icon-button>
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
            ${isAuth() ? html`
                <footer class="right-footer">
                    ${this.#rightFooter}
                </footer>
            ` : ''}
            <input type="file" id="fileInput" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv" @input=${this.importFromExcel}/>
        `;
    }

    addFirstItem() {
        const page = this.renderRoot.querySelector('my-sportsmen-section-3-page-1')
        page.startEdit()
    }

    gotoSection(index) {
        this.$root.currentSection = index;
    }

    gotoPage(index) {
        this.currentPage = index
    }

    nextPage() {
        this.currentPage++
    }

    prevPage() {
        this.currentPage--
    }

    searchPage() {
        this.currentSearch = {}
        this.currentPage = this.currentPage === 1 ? 0 : 1
    }

    filterPage() {
        this.currentPage = this.currentPage === 2 ? 0 : 2
    }

    async applyFilter() {
        const result = await this.dataSource.filter(this.currentFilter)
        this.oldFilterValues.clear();
        this.isFilterModified = false;
        this.currentItemRefresh = !this.currentItemRefresh
        this.dataSource.setCurrentItem(result)
        this.isFiltered = true
    }

    async clearFilter() {
        const result = await this.dataSource.clearFilter()
        this.currentFilter = {}
        this.oldFilterValues?.clear();
        this.isFilterModified = false;
        this.dataSource.setCurrentItem(result)
        this.currentItemRefresh = !this.currentItemRefresh
        this.isFiltered = false
        this.closeFilter()
    }

    async cancelFilter() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить сделанные изменения в фильтре?')
        if (modalResult !== 'Ok')
            return modalResult
        this.oldFilterValues.forEach( (value, key) => {
            if (key.id === 'avatar') {
                window.URL.revokeObjectURL(value);
                this.avatar = value;
                this.avatarFile = null;
            } else {
                if (key.currentObject) {
                    key.currentObject[key.id?.split('.').at(-1)] = value
                }
                else {
                    this.currentFilter[key.id] = value;
                }
                key.value = value;
            }
        });
        this.oldFilterValues.clear();
        this.isFilterModified = false;
        return 'Ok'
    }

    closeFilter() {
        this.filterPage()
    }

    get #filterFooter() {
        if (this.isFilterModified) {
            return html`
                <nav class='save'>
                    <simple-button @click=${this.applyFilter}>${lang`Apply`}</simple-button>
                    <simple-button @click=${this.cancelFilter}>${lang`Cancel`}</simple-button>
                </nav>
            `
        } else if (this.isFiltered){
            return html`
                <nav class='save'>
                    <simple-button @click=${this.clearFilter}>${lang`Clear`}</simple-button>
                    <simple-button @click=${this.closeFilter}>${lang`Close`}</simple-button>
                </nav>
            `
        } else {
            return html`
                <nav class='save'>
                    <simple-button @click=${this.closeFilter}>${lang`Close`}</simple-button>
                </nav>
            `
        }

    }

    sortPage() {
        if (this.sortDirection) {
            this.sortDirection = false
        }
        else if (this.sortDirection === false) {
            this.sortDirection = undefined
        } else {
            this.sortDirection = true
        }
        this.dataSource.sort(this.sortDirection)
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message)
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async addNewItem() {
        this.renderRoot.querySelector('.left-layout')?.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        this.renderRoot.querySelector('.right-layout')?.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        this.dataSource.addNewItem(this.currentItem);
        // const page = this.renderRoot.querySelector('my-sportsmen-section-3-page-1')
        // page.startEdit()
    }

    async addItem() {
        this.dataSource.addItem(this.currentItem)
    }

    async saveFirstItem() {
        await this.dataSource.addItem(this.currentItem)
        this.oldValues?.clear()
        this.isModified = false
    }

    async saveNewItem() {
        await this.dataSource.saveNewItem(this.currentItem)
        this.oldValues?.clear();
        this.isModified = false;
    }

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem)
        this.oldValues?.clear()
        this.isModified = false
    }

    async cancelNewItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить добавление?')
        if (modalResult !== 'Ok')
            return modalResult
        this.dataSource.cancelNewItem()
        this.oldValues.clear()
        this.isModified = false
        return 'Ok'
    }

    async cancelItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
        if (modalResult !== 'Ok')
            return modalResult
        this.oldValues.forEach( (value, key) => {
            if (key.id === 'avatar') {
                window.URL.revokeObjectURL(value);
                this.avatar = value;
                this.avatarFile = null;
            } else {
                if (key.currentObject) {
                    key.currentObject[key.id?.split('.').at(-1)] = value
                }
                else {
                    this.currentItem[key.id] = value;
                }
                key.value = value;
            }
        });
        this.oldValues.clear()
        this.isModified = false
        return 'Ok'
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
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить этого тренера?')
        if (modalResult !== 'Ok')
            return modalResult
        this.dataSource.deleteItem(this.currentItem)
        return 'Ok'
    }

    async firstUpdated() {
        super.firstUpdated();
        const parentId = sessionStorage.getItem('competition').split(':')[1]
        this.competitionDataSource = new CompetitionDataSource(this)
        this.parent = await this.competitionDataSource.getItem()
        this.dataSource = new DataSource(this, await DataSet.getDataSet(parentId))
    }
}

customElements.define("my-competition-section-3", MyCompetitionSection3);