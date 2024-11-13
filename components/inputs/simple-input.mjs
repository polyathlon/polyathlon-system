import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'

customElements.define("simple-input", class SimpleInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            imageName: { type: String, default: '', attribute: 'image-name'},
            errorImage: { type: String, default: 'error-image', attribute: 'error-image'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            dataSource: {type: Object, default: null},
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            currentObject: { type: Object, default: undefined},
            lang: { type: String, default: ''},
            listLabel: { type: Function, default: null, attribute: 'list-name'},
            isShowList: {type: Boolean, default: false},
        }
    }

    static get styles() {
        return [
            styles,
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    position: relative;
                    width: 100%;
                    color: var(--form-input-color, gray);
                }
                .options-list {
                    padding: 8px;
                    position: absolute;
                    bottom: -12px;
                    box-sizing: border-box;
                    width: calc(100% + 2px);
                    border-radius: 12px;
                    z-index: 999;
                    background: var(--control-overlay-bg, white);
                    color: var(--text-primary, black);
                    overflow: hidden;
                    transition: opacity .2s ease-in-out,border .2s ease-in-out;
                    transform: translateY(100%);
                    /* box-shadow: var(--shadow-overlay, 10px 5px 5px black); */
                    display: flex;
                    flex-direction: column;
                    icon-button {
                        height: 40px;
                        border-radius: 10px;
                        color: red;
                    }
                    icon-button:hover {
                        background-color: red;
                        color: white;
                    }
                }
                img {
                    display: block;
                    line-height: 0;
                    border-radius: 50%;
                    position: relative;
                    height: 28px;
                    aspect-ratio: 1 / 1;
                    position: absolute;
                    left: 8px;
                }


            `
        ]
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        if (!this.iconName) {
            return ''
        }
        return html`
            <simple-icon class="icon" icon-name=${this.iconName} @click=${() => this.fire("icon-click")}></simple-icon>
        `
    }

    get #image() {
        if (!this.imageName) {
            return this.#icon
        }
        return html`
            <img src=${this.imageName} alt="" title=${this.title || nothing} @error=${this.defaultImage} @click=${() => this.fire("icon-click")}/>
        `
    }

    defaultImage(e) {
        e.target.src = `../../images/${this.errorImage}.svg`
        e.onerror = null
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName} @click=${() => this.fire("button-click")}></simple-icon>
        `
    }

    fio(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName[0]}.`
        }
        if (item.middleName) {
            result += `${item.middleName[0]}.`
        }
        return result
    }

    get #list() {
        return html`
          <div class="options-list" @mouseenter=${this.listInFocus} @mouseleave=${this.listOutFocus}>
              ${this.dataSource?.items?.map((item, index) =>
                  html `
                    <icon-button
                        label=${ this.fio(item) }
                        title=${ item.sportsmanId || item?._id }
                        icon-name=${ item.gender == 0 ? "sportsman-boy-solid" : "sportsman-girl-solid" }
                        image-name=${ item.gender == 0 ? "../../../../images/sportsman-boy-solid.svg" : "../../../../images/sportsman-girl-solid.svg" }
                        .status=${{ name: item.sportsmanId || item?._id, icon: 'cake-candles-solid'} }
                        @click=${() => this.selectItem(index, item)}
                    >
                    </icon-button>
              `)}
          </div>
        `
    }

    setValue(value) {
        this.value = value;
        this.fire('input')
    }

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <input type=${this.type}
                    placeholder=${this.placeholder || nothing}
                    ${this.required ? 'required' : ''}
                    .value=${this.value || ''} @input=${this.changeValue}
                    lang=${this.lang || nothing}
                    @focus=${this.changeFocus}
                    @blur=${this.changeBlur}
                >
                ${this.#image}
                ${this.buttonName ? this.#button : ''}
            </div>
            <slot name="informer"></slot>
            ${this.isShowList ? this.#list : ''}
        `;
    }

    focus() {
        this.#input.focus()
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeFocus(e) {
        this.isShowList = false;
    }

    changeBlur(e) {
        if (this.isShowList)
            return
    }

    selectItem(index, item) {
        this.isShowList = false;
        this.fire('select-item', item)
    }

    changeValue(e) {
        this.value = e.target.value;
    }
});