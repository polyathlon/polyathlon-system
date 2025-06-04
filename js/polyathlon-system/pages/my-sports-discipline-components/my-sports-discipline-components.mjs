import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import lang from '../../polyathlon-dictionary.mjs'

import './section-1/my-sports-discipline-components-section-1.mjs';

class MySportsDisciplineComponents extends BaseElement {
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
            {label: lang`Discipline`, iconName: 'competition-solid'},
            {label: lang`Points Table`, iconName: 'sportsmen-solid'},
        ]
    }

    get #section1() {
        return html`
            <my-sports-discipline-components-section-1 .sectionNames=${this.sectionNames}></my-sports-discipline-components-section-1>
        `;
    }

    get #section2() {
        import('./section-2/my-sports-discipline-components-section-2.mjs');
        return html`
            <my-sports-discipline-components-section-2 .sectionNames=${this.sectionNames}></my-sports-discipline-components-section-2>
        `;
    }

    get #section() {
        switch(this.currentSection) {
            case 0: return cache(this.#section1)
            case 1: return cache(this.#section1)
            default: return cache(this.#section1)
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
        if (params.has('sports-discipline-components')) {
            localStorage.setItem('currentSportsDisciplineComponent', params.get('sports-discipline-components'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-sports-discipline-components", MySportsDisciplineComponents)