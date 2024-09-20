import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'

class MyAgeGroupsSection1Page1 extends BaseElement {
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
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    gap: 10px;
                }
            `
        ]
    }

    render() {
        return html`
            <div>
                <simple-input id="name" icon-name="age-group-solid" label="Age group:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="minAge" icon-name="user" label="Min Age:" .value=${this.item?.minAge} @input=${this.validateInput}></simple-input>
                <simple-input id="maxAge" icon-name="max-age-solid" label="Max Age:" .value=${this.item?.maxAge} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item
            if (!this.oldValues.has(e.target)) {
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[e.target.id] = e.target.value
            if (e.target.id === 'name') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

}

customElements.define("my-age-groups-section-1-page-1", MyAgeGroupsSection1Page1);