import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('country-button', class CountryButton extends BaseElement {
    static get properties() {
        return {
            label: { type: String, default: '' },
            logotype: { type: String, default: '/images/home/project-avatar.svg' },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 1px;
                    height: 60px;
                    user-select: none;
                }
                .container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    gap: 10px;
                }
                .content {
                    display: flex;
                    overflow: hidden;
                    flex-direction: column;

                }
                .logotype {
                    position: relative;
                    height: var(--logotype-height, 80%);
                    aspect-ratio: 1 / 1;
                    margin-left: 2px;
                }
                .status-icon {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 20px;
                    height: 20px;
                    background-color: red;
                }
                h1 {
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                }
                h2 {
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.8rem;
                    color: lightgray;
                }
                img {
                    display: block;
                    line-height: 0;
                    border-radius: 50%;
                    position: relative;
                    height: 100%;
                    aspect-ratio: 1 / 1;
                }
                simple-icon {
                    width: 1rem;
                    height: 1rem;
                    background-color: red;
                    border-radius: 50%;
                }
            `
        ];
    }

    render() {
        return html`
            <div class="container">
                <div class="logotype">
                    <img src=${this.logotype || '/images/home/project-avatar.svg'} alt="Логотип" />
                </div>
                <div class="content">
                    <h1>${this.label}</h1>
                </div>
            </div>
        `;
    }
});
