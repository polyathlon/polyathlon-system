import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-referees-section-1.mjs';

import lang from '../../polyathlon-dictionary.mjs'

class MyReferees extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0, local: true},
            sections: { type: Array, default: null },
            version: { type: String, default: '1.0.0', save: true },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    height: 100%
                }
            `
        ]
    }

    constructor() {
        super();
        this.sections = [
            {name: "section1", label: lang`Referee`, iconName: 'referee-solid'},
        ]
        this.version = "1.0.0";
    }

    render() {
        return html`
            <my-referees-section-1 .sections=${this.sections}></my-referees-section-1>
        `;
    }
}

customElements.define("my-referees", MyReferees);