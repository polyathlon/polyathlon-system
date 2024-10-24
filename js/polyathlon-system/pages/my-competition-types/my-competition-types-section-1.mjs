import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/country-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import './my-competition-types-section-1-page-1.mjs'
import DataSet from './my-competition-types-dataset.mjs'
import DataSource from './my-competition-types-datasource.mjs'
// import './my-competitions-section-1-page-2.mjs'

class MyCompetitionTypesSection1 extends BaseElement {
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
                        "footer  footer";
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

                .left-layout country-button {
                    width: 100%;
                    height: 40px;
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
                    overflow: hidden;
                    gap: 10px;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                footer simple-button {
                    height: 40px;
                }

                country-button[selected] {
                    background: rgba(255, 255, 255, 0.1)
                }

                country-button:hover {
                    background: rgba(255, 255, 255, 0.1)
                }
            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.pageNames = ['Competition types property']
        this.oldValues = new Map();
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCompetitionTypesItem')) {
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
            <my-competition-types-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-types-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-competition-types-section-1-page-2 .item=${this.currentItem}></my-competition-types-section-1-page-2>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    render() {
        return html`
            <confirm-dialog></confirm-dialog>
            <header id="competition-header"><p>Competition types ${this.currentItem?.name}</p></header>
            <header id="property-header">${this.#pageName}</header>
            <div class="left-layout">
                ${this.dataSource?.items?.map((item, index) =>
                    html `<country-button
                                label=${item.name}
                                title=${item._id}
                                .logotype=${item.flag && 'https://hatscripts.github.io/circle-flags/flags/' + item.flag + '.svg' }
                                .status=${this.statusDataSet.get(item._id)}
                                ?selected=${this.currentItem === item}
                                @click=${() => this.showItem(index, item._id)}
                            >
                            </country-button>
                `)}
            </div>
            <div class="right-layout">
                ${this.#page()}
            </div>
            <footer>
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

customElements.define("my-competition-types-section-1", MyCompetitionTypesSection1);