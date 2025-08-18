import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import lang from '../../polyathlon-dictionary.mjs'

class MySportsCategoriesSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }
                .container {
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="sports-category-solid" label="${lang`Sports category`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="shortName" icon-name="short-sports-category-solid" label="${lang`Short name`}:" .value=${this.item?.shortName} @input=${this.validateInput}></simple-input>
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

            if (e.target.id === 'name' || e.target.id === 'flag') {
                this.parentNode.parentNode.host.requestUpdate()
            }

            this.isModified = this.oldValues.size !== 0;
        }
    }

}

customElements.define("my-sports-categories-section-1-page-1", MySportsCategoriesSection1Page1);