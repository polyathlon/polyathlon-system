import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import DataSet from './my-sportsmen/my-sportsmen-dataset.mjs'
import DataSource from './my-sportsmen/my-sportsmen-datasource.mjs'

class MyCompetitionSection1List3 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSource: {type: Object, default: null},
            currentItem: {type: Object, default: null},
            parent: {type: Object, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                    }
                }
            `
        ]
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



    render() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `<icon-button
                        label=${ this.fio(item) }
                        title=${ item._id }
                        icon-name=${ item.gender == 0 ? "sportsman-boy-solid" : "sportsman-girl-solid" }
                        .status=${ item.hashNumber ? { name: item.hashNumber, icon: 'hash-number-solid'} : '' }
                        ?selected=${ this.currentItem === item }
                        @click=${() => this.showItem(index, item._id)}
                    >
                    </icon-button>
                `
            )}
        `
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

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet(this.parent._id.split(':')[1]))
    }
}

customElements.define("my-competition-section-1-list-3", MyCompetitionSection1List3);