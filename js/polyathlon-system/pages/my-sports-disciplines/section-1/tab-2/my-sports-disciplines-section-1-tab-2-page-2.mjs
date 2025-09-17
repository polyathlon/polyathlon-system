import { BaseElement, html, css } from '../../../../../base-element.mjs'

import lang from '../../../../polyathlon-dictionary.mjs'

import '../../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/selects/simple-select.mjs'

import SportsCategoriesDataset from '../../../my-sports-categories/my-sports-categories-dataset.mjs'
import SportsCategoriesDataSource from '../../../my-sports-categories/my-sports-categories-datasource.mjs'

class MySportsDisciplinesSection1Tab2Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            sportsCategoriesDataSource: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            currentPage: { type: BigInt, default: 1, local: true },
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
                }
            `
        ]
    }

    isNew = true;

    render() {
        return html`
            <div class="container">
                <simple-select id="category" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} label="${lang`Sports category`}:" .dataSource=${this.sportsCategoriesDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-input id="points" icon-name="hundred-points-solid" label="${lang`Points`}:" .value=${this.item?.points} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item

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

    async firstUpdated() {
        super.firstUpdated();
        this.sportsCategoriesDataSource = new SportsCategoriesDataSource(this, await SportsCategoriesDataset.getDataSet())
    }

}

customElements.define("my-sports-disciplines-section-1-tab-2-page-2", MySportsDisciplinesSection1Tab2Page2);