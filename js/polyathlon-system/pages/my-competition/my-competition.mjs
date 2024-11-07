import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-competition-section-1.mjs';
// import './section-2/my-competition-section-2.mjs';

import '../../../../components/buttons/icon-button.mjs'

class MyCompetition extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0, local: true},
            sectionNames: { type: Array, default: 0 },
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
        this.sectionNames = [
            {label: 'Competition', iconName: 'competition-solid'},
            {label: 'Sportsman', iconName: 'user'},
            {label: 'Referee', iconName: 'judge1-solid'},
            {label: 'Statistic', iconName: 'statistic-solid'},
        ]
    }

    get #section1() {
        return html`
            <my-competition-section-1 .sectionNames=${this.sectionNames}></my-competition-section-1>
        `;
    }

    get #section2() {
        import('./section-2/my-competition-section-2.mjs');
        return html`
            <my-competition-section-2 .sectionNames=${this.sectionNames}></my-competition-section-2>
        `;
    }

    get #section() {
        switch(this.currentSection) {
            case 0: return cache(this.#section1)
            case 1: return cache(this.#section2)
            default: return cache(this.#section2)
        }
    }

    render() {
        return html`
            ${this.#section}
        `;
    }

    async firstUpdated() {
        super.firstUpdated();
        let params = new URLSearchParams(window.location.search)
        if (params.has('competition')) {
            localStorage.setItem('currentCompetition', params.get('competition'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-competition", MyCompetition)