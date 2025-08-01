import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-trainer-section-1.mjs';
// import './section-2/my-trainer-section-2.mjs';

import '../../../../components/buttons/icon-button.mjs'

class MyCompetition extends BaseElement {
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
            {label: 'Competition', iconName: 'competition-solid'},
            {label: 'Sportsman', iconName: 'user'},
            {label: 'Referee', iconName: 'judge1-solid'},
            {label: 'Statistic', iconName: 'statistic-solid'},
        ]
    }

    get section1() {
        return html`
            <my-trainer-section-1 .sections=${this.sections} .currentSection=0></my-trainer-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-trainer-section-2.mjs');
        return html`
            <my-trainer-section-2 .sections=${this.sections} .currentSection=1></my-trainer-section-2>
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
        if (params.has('competition')) {
            localStorage.setItem('currentCompetition', params.get('competition'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-trainer", MyCompetition)