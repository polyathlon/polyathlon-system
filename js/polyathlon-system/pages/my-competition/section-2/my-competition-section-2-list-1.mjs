import { BaseElement, html, css } from '../../../../base-element.mjs'

import { States } from '../../../../utils.js'

import '../../../../../components/inputs/simple-input.mjs'

class MyCompetitionSection2List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            oldValues: { type: Map, default: null },
            currentItemRefresh: { type: Boolean, default: false, local: true },
            currentItem: { type: Object, default: null, local: true },
            sortDirection: { type: Boolean, default: undefined, local: true },
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
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        return result
    }

    render() {
        return html`
            ${this.currentItemRefresh || this.sortDirection? '' : ''}
            ${this.item.dataSource?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${this.sportsmanName(item) + (item.category ? ' (' + item.category?.shortName + ')' : '')}
                        title=${item._id}
                        image-name=${item.gender == 0 ? "images/sportsman-man-solid.svg" : "images/sportsman-woman-solid.svg"}
                        ?selected=${this.currentItem === item}
                        .status=${{ name: item.region?.name || item.category?.name || item?._id, icon: 'region-solid'} }
                        @click=${() => this.showItem(item)}
                        @dblclick=${this.gotoPersonalPage}
                    ></icon-button>
                `
            )}
        `
    }

    async showItem(item) {
        if (this.item.isModified) {
            const modalResult = await this.item.confirmDialog('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                if (this.item.dataSource.state === States.NEW) {
                    await this.item.saveNewItem()
                } else {
                    await this.item.saveItem()
                }
                this.item.dataSource.setCurrentItem(item)
            }
            else {
                const result = this.item.dataSource.state === States.NEW ?
                    await this.item.cancelNewItem() : await this.item.cancelItem()
                if (result == "Ok") {
                    this.item.dataSource.setCurrentItem(item)
                }
            }
        } else {
            this.item.dataSource.setCurrentItem(item)
        }
    }

    gotoPersonalPage() {
        if (!this.currentItem?.refereeId) {
            return
        }
        location.hash = "#my-referee";
        location.search = `?referee=${this.currentItem.refereeId.split(':')[1]}`
    }
}

customElements.define("my-competition-section-2-list-1", MyCompetitionSection2List1);