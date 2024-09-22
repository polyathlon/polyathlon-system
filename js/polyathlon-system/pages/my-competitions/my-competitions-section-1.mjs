import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/country-button.mjs'
import '../../../../components/buttons/project-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import '../../../../components/buttons/aside-button.mjs';

import './my-competitions-section-1-page-1.mjs'
// import './my-competitions-section-1-page-2.mjs'
import DataSet from './my-competitions-dataset.mjs'
import DataSource from './my-competitions-datasource.mjs'

class MyCompetitionsSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: {type: Array, default: []},
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
            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.pageNames = ['Competition property']
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'type-solid', page: 'my-competition-types', title: 'Competition Types', click: () => this.showPage('my-competition-types')},
            {iconName: 'category-solid', page: 'my-competition-kinds', title: 'Competition Kinds', click: () => this.showPage('my-competition-kinds')},
            {iconName: 'earth-americas-solid', page: 'my-countries', title: 'Countries', click: () => this.showPage('my-countries')},
            {iconName: 'city-solid', page: 'my-cities', title: 'Cities', click: () => this.showPage('my-cities')},
            {iconName: 'regions-solid', page: 'my-regions', title: 'Regions', click: () => this.showPage('my-regions')},
            {iconName: 'club-solid', page: 'my-clubs', title: 'Clubs', click: () => this.showPage('my-clubs')},
            {iconName: 'age-group-solid', page: 'my-age-groups', title: 'Gender Ages', click: () => this.showPage('my-age-groups')},
            {iconName: 'pdf-make', title: 'Make in PDF', click: () => this.pdfMethod()},

        ]
    }

    pdfMethod() {
            
        var docInfo = {
            
            info: {
                title:'Тестовый документ PDF',
                author:'Viktor',
                subject:'Theme',
                keywords:'Ключевые слова'
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
            
            footer:[
                {
                    text:'нижний колонтитул',
                    alignment:'center',//left  right
                }
            ],
            
            content: [
            
                {
                    text:'Медведев',
                    fontSize:20,
                    margin:[150,80, 30,0]
                    //pageBreak:'after'
                },
                
                {
                    text:'Сергей',
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

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCompetitionItem')) {
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
            <my-competitions-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competitions-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-competitions-section-1-page-2 .item=${this.currentItem}></my-competitions-section-1-page-2>
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
                        .logotype=${item.flag && 'https://hatscripts.github.io/circle-flags/flags/' + item.flag + '.svg' }
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
            <header id="competition-header"><p>Competition ${this.currentItem?.name}</p></header>
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

customElements.define("my-competitions-section-1", MyCompetitionsSection1)