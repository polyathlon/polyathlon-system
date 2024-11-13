import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'

class MyCompetitionSection2List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null, attribute: "old-values" },
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
                    gap: 10px;
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

    sportsmanName(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName[0]}.`
        }
        return result
    }

    render() {
        return html`
            ${this.item.dataSource?.items?.map((item, index) =>
                html `<icon-button
                        label=${this.sportsmanName(item)}
                        title=${item._id}
                        image-name=${item.gender == 0 ? "../../../../images/sportsman-boy-solid.svg" : "../../../../images/sportsman-girl-solid.svg"}
                        ?selected=${this.currentItem === item}
                        .status=${ { name: item.category?.name || item?._id, icon: 'referee-category-solid'} }
                        @click=${() => this.showItem(item)}
                    ></icon-button>                `

            )}
        `
    }

    async showItem(item) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.item.dataSource.saveItem(this.currentItem);
            }
            else {
                await this.cancelItem()
            }
        }
        else {
            this.item.dataSource.setCurrentItem(item)
        }
    }

    async firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("my-competition-section-2-list-1", MyCompetitionSection2List1);