import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './my-competition-section-1.mjs';
import './my-competition-section-2.mjs';
import '../../../../components/buttons/aside-button.mjs';

class MyCompetition extends BaseElement {
    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    box-sizing: border-box;
                    height: 100%
                }
                aside {
                    display: flex;
                    flex-direction: column;
                }
            `
        ]
    }


    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0, local: true },
            version: { type: String, default: '1.0.0', save: true },
        }
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    #section() {
        switch(this.currentSection) {
            case 0: return cache(this.#section1())
            case 1: return cache(this.#section2())
        }
    }

    #section1() {
        return html`
            <my-competition-section-1></my-competition-section-1>
        `;
    }

    #section2() {
        return html`
            <my-competition-section-2></my-competition-section-2>
        `;
    }

    render() {
        return html`
            ${this.#section()}
        `;
    }
}

customElements.define("my-competition", MyCompetition);