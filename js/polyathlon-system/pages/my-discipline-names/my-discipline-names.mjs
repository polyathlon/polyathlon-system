import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import lang from '../../polyathlon-dictionary.mjs'

import './section-1/my-discipline-names-section-1.mjs';

class MyDisciplineNames extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
            version: { type: String, default: '1.0.0', save: true },
        }
    }

    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    height: 100%
                }
            `
        ]
    }

    constructor() {
        super()
        this.version = "1.0.0"
        this.sections = [
            {name: 'section1', label: lang`Discipline`, iconName: 'competition-solid'},
            {name: 'section2', label: lang`Points Table`, iconName: 'sportsmen-solid'},
        ]
    }

    get section1() {
        return html`
            <my-discipline-names-section-1 .sections=${this.sections} .currentSection=${0}></my-discipline-names-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-discipline-names-section-2.mjs');
        return html`
            <my-discipline-names-section-2 .sections=${this.sections} .currentSection=${1}></my-discipline-names-section-2>
        `;
    }

    get #section() {
        return cache(this[this.sections[this.currentSection].name])
    }

    render() {
        return html`
            ${this.#section}
        `;
    }

    async firstUpdated() {
        super.firstUpdated();
        let params = new URLSearchParams(window.location.search)
        if (params.has('discipline-name')) {
            localStorage.setItem('currentDisciplineName', params.get('discipline-name'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-discipline-names", MyDisciplineNames)