import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import lang from '../../polyathlon-dictionary.mjs'

import './section-1/my-sports-disciplines-section-1.mjs';

class MySportsDisciplines extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
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
                    {name: "section1", label: lang`User`, iconName: 'user'},
                    {name: "section2", label: lang`Requests`, iconName: 'registration-solid'},
        this.sections = [
            {name: "section1", label: lang`Sports discipline`, iconName: 'category-solid'},
            {name: "section2", label: lang`Component`, iconName: 'puzzle-solid'},
            {name: "section3", label: lang`Categories table`, iconName: 'sportsman-man-solid'},
            {name: "section4", label: lang`Categories table`, iconName: 'sportsman-woman-solid'},
        ]
    }

    get section1() {
        return html`
            <my-sports-disciplines-section-1 .sections=${this.sections}></my-sports-disciplines-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-sports-disciplines-section-2.mjs');
        return html`
            <my-sports-disciplines-section-2 .sections=${this.sections}></my-sports-disciplines-section-2>
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
        if (params.has('sports-disciplines')) {
            localStorage.setItem('currentSportsDisciplineComponent', params.get('sports-disciplines'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-sports-disciplines", MySportsDisciplines)