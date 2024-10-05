import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'

class MyCompetitionKindsSection1Page1 extends BaseElement {
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
                <simple-input id="name" icon-name="user" label="Competition Kind name:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="running" icon-name="user" label="Бег:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="throwing" icon-name="user" label="Метание:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="shooting" icon-name="user" label="Стрельба:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="swimming" icon-name="user" label="Плавание:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="running2" icon-name="user" label="Бег:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="pull-up" icon-name="user" label="Подтягивание:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="bend-arms" icon-name="user" label="Сгибание и разгибание рук в упоре лежа:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="cross-country-skiing" icon-name="user" label="Лыжная гонка:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="jump" icon-name="user" label="Прыжок в длину:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="roller-ski-race" icon-name="user" label="Гонка на лыжероллерах:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="ski-relay" icon-name="user" label="Лыжная эстафета:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>

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

customElements.define("my-competition-kinds-section-1-page-1", MyCompetitionKindsSection1Page1);