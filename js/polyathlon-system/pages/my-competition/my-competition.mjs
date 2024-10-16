import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './my-competition-section-1.mjs';
import './my-competition-section-2.mjs';

import '../../../../components/buttons/icon-button.mjs'

import DataSource from './my-competition-datasource.mjs'

class MyCompetition extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0},
            parent: { type: Object, default: null, local: true },
            version: { type: String, default: '1.0.0', save: true },
        }
    }

    static get styles() {
        return [
            css`
                :host {
                    display: grid;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr;
                    grid-template-areas:
                        "header1 header2"
                        "main main";
                    gap: 0 20px;
                    width: 100%;
                    height: 100%;
                }
                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .left-header {
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    p {
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 1rem;
                        margin: 0;
                    }
                }
                .right-header {
                    grid-area: header2;
                    justify-content: flex-start;
                    icon-button {
                        height: 100%;
                        padding: 0 1vw;
                        &[active] {
                            background-color: var(--layout-background-color);
                        }
                        &hover {
                            background-color: var(--layout-background-color);
                        }
                    }
                }
                main {
                    grid-area: main;
                }
            `
        ]
    }

    constructor() {
        super()
        this.version = "1.0.0"
        this.sectionNames = [
            {label: 'Competition', iconName: 'competition-solid'},
            {label: 'Sportsman', iconName: 'user'},
            {label: 'Judges', iconName: 'judge1-solid'},
            {label: 'Statistic', iconName: 'statistic-solid'},
        ]
    }

    get #section1() {
        return html`
            <my-competition-section-1 .parent=${this.parent}></my-competition-section-1>
        `;
    }

    get #section2() {
        return html`
            <my-competition-section-2 .parent=${this.parent}></my-competition-section-2>
        `;
    }
   
    get #section() {
        switch(this.currentSection) {
            case 0: return cache(this.#section1)
            case 1: return cache(this.#section2)
            case 2: return cache(this.#section2)
        }
    }

    render() {
        return html`
            <header class="left-header">
                <p>Competition ${this.parent?.name}</p>
            </header>
            <header class="right-header">
                ${this.sectionNames.map( (page, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection} icon-name=${page.iconName} label=${page.label} @click=${() => this.gotoPage(index)}></icon-button>
                    `
                )}
            </header>
            <main>
                ${this.#section}
            </main>
        `;
    }

    gotoPage(index) {
        this.currentSection = index
    }

    async firstUpdated() {
        super.firstUpdated();
        let params = new URLSearchParams(window.location.search)
        if (params.size > 0) {
            localStorage.setItem('currentCompetition', params.get('competition'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
        this.dataSource = new DataSource(this)
        this.parent = await this.dataSource.getItem()
    }
}

customElements.define("my-competition", MyCompetition)