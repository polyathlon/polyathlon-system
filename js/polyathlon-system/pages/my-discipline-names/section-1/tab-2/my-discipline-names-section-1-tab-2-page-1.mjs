import { BaseElement, html, css, nothing } from '../../../../../base-element.mjs'

import lang from '../../../../polyathlon-dictionary.mjs'

import '../../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/tables/simple-table.mjs'

class MyDisciplineNamesSection1Tab2Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null, attribute: "old-values" },
            currentPage: { type: BigInt, default: 0, local: true },
            currentRow: { type: BigInt, default: 0, local: true },
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
                    color: white;
                }
            `
        ]
    }

    constructor () {
        super()
        this.columns = [
            {
                name: "point",
            },
            {
                name: "result",
            },
            {
                name: "value",
            },
        ]
        this.rows = [
            {
                point: "Строка 1",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 2",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
            {
                point: "Строка 3",
                result: "1:12:12",
                value: "11212",
            },
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-table @click=${this.tableClick} .columns=${this.columns} .rows=${this.rows}></simple-table>
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

            if (e.target.id === 'name' || e.target.id === 'icon') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            if (e.target.id === 'icon') {
                 this.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

    tableClick(e) {
        this.currentPage = 1
        this.currentRow = e.details
    }

}

customElements.define("my-discipline-names-section-1-tab-2-page-1", MyDisciplineNamesSection1Tab2Page1);