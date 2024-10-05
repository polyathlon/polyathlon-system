import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../buttons/simple-button.mjs'

// import styles from './input-css.mjs'

customElements.define("competition-card", class CompetitionCard extends BaseElement {
    static get properties() {
        return {
            item: { type: Object, default: undefined},
        }
    }

    static get styles() {
        return [
            // styles,
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 4fr 8fr;
                    grid-template-rows: 35px 1fr 25px;
                    grid-template-areas:
                        "header header"
                        "aside main"
                        "footer  footer";
                    gap: 0 10px;
                    min-width: 320px;
                    max-width: 320px;
                    font-size: 12px;
                    padding: 5px;
                    background-color: rgba(0, 0, 0, 0.1);
                }
                header {
                    grid-area: header;
                    display: flex;
                    flex-direction: row-reverse;
                    align-items: center;
                    background-color: #6001d2;
                    font-size: 14px;
                    font-weight: bold;
                    padding: 5px;
                    .competition-number {
                        white-space: nowrap;
                        user-select: text;
                    }
                    .competition-name {
                        width: 100%;
                        text-align: center;
                        user-select: text;
                    }
                }
                aside {
                    grid-area: aside;
                    padding: 5px;
                    .dates {
                        background-color: #6001d2;
                        width: 100%;
                        color: white;
                        font-weight: 600;
                        text-align: center;
                        padding: 5px 0;
                    }
                    .place {
                        text-align: center;
                    }
                    .image {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        max-width: 100%;
                        padding: 10px 5px 5px;
                        img {
                            max-width: 100%;
                            max-height: 150px;
                        }
                    }
                }
                main {
                    grid-area: main;
                    flex: 1;
                    padding: 5px 0px 5px 5px;
                    .title {
                        width: 100%;
                        background: darkgray;
                        text-align: center;
                        font-weight: 600;
                        color: white;
                        border-radius: 5px;
                        padding: 5px 0;
                    }
                    .age-groups {
                        display: flex;
                        justify-items: center;
                        flex-direction: column;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        margin-left: 10px;
                    }
                }
                footer {
                    grid-area: footer;
                    display: flex;
                    justify-content: space-evenly;
                    flex: 0 0 auto;
                    font-size: 16px;
                    color: white;
                    line-height: 25px;
                    box-sizing: border-box;
                    font-weight: 400;
                    text-align: center;
                }
            `
        ]
    }

    render() {
        return html`
            <header>
                <div class="competition-number">26484</div>
                <div class="competition-name">Кубок России 1 этап</div>
            </header>
            <aside>
                <div class="dates">
                    12-15 января
                </div>
                <div class="image">
                    <img src="https://polyathlon.ru/wp-content/uploads/2023/02/Kovrov-240x300.png">
                </div>
                <div class="place">
                    Ковров, Владимирская область, Россия
                </div>
            </aside>
            <main>
                <div class="title">
                    3-борье с лыжной гонкой, командные соревнования
                </div>
                <div class="age-groups">
                    <div class="age-group">
                        Мужчины, женщины
                    </div>
                    <div class="age-group">
                        Мужчины, женщины
                    </div>
                </div>
            </main>
            <footer>
                <simple-button label="Регламент" @click=${this.saveItem}></simple-button>
                <simple-button label="Протоколы" @click=${this.saveItem}></simple-button>
                <simple-button label="Подробнее" @click=${this.saveItem}></simple-button>
            </footer>
        `;
    }

    saveItem() {
        alert("111")
    }
});