import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'

class MySportsDisciplinesSection2List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            currentItem: {type: Object, default: null, local: true }
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    icon-button {
                        flex: 0 0 40px;
                    }
                    icon-button[selected] {
                       background: rgba(255, 255, 255, 0.1)
                    }

                    icon-button:hover {
                        background: rgba(255, 255, 255, 0.1)
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
                        label=${item.ageGroup?.name}
                        title=${item._id}
                        icon-name=${item.ageGroup?.gender=="1"  ? "age-group-women-solid" : "age-group-solid"}
                        ?selected=${this.currentItem === item}
                        @click=${() => this.showItem(item)}
                    ></icon-button>                `

            )}
        `
    }

    async showItem(item) {
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
            this.dataSource.setCurrentItem(item)
        }
    }

    // async firstUpdated() {
    //     super.firstUpdated();
    // }
}

customElements.define("my-sports-disciplines-section-2-list-1", MySportsDisciplinesSection2List1);