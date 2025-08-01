import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

class MyFederationMemberSection2List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            currentItem: {type: Object, default: null, local: true },
            currentPage: {type: Object, default: null, local: true },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    /* justify-content: center; */
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                        --icon-height: 100%;
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

    requestIcon(item) {
        switch (item.type) {
            case 1:
                return "sportsman-solid"
            case 2:
                return "judge1-solid"
            case 3:
                return "trainer-solid"
            case 4:
                return "federation-member-solid"
            default:
                return "sportsman-solid"
        }
    }

    render() {
        return html`
            ${this.item?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${ item?.name }
                        title=${ new Date(item?.date).toLocaleString() }
                        icon-name=${ item?.icon || this.requestIcon(item)}
                        ?selected=${this.currentItem === item}
                        .status=${ { name: item?.status?.name || 'Не определен', icon: 'status1-solid'} }
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    async showItem(item) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.item.saveItem(this.currentItem);
            }
            else {
                await this.cancelItem()
            }
        }
        else {
            this.item.setCurrentItem(item)
        }
    }

    // async firstUpdated() {
    //     super.firstUpdated();
    //     this.isFirst  = false;
    //     this.avatar = null; // await this.downloadAvatar();
    //     this.isFirst = true;
    // }
}

customElements.define("my-federation-member-section-2-list-1", MyFederationMemberSection2List1);