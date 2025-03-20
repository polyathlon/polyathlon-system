import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/tables/simple-table.mjs'
import '../../../../../../components/tables/simple-table-header.mjs'
import lang from '../../../polyathlon-dictionary.mjs'

class MyCompetitionSection4Page3 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            items: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            sportsmenDataSource: { type: Object, default: null },
        }
    }
    constructor() {
        super()
        this.columns = [
            {
                name: "place",
                label: lang`Place`,
            },
            {
                name: "sportsman",
                label: lang`Sportsman`,
            },
            {
                name: "category",
                label: lang`Short sports category`,
            },
            {
                name: "year",
                label: lang`Year of birth`,
            },
            {
                name: "region",
                label: lang`Region RF`,
            },
            {
                name: "club",
                label: lang`Sports club`,
            },
            {
                name: "points",
                label: lang`Total points`,
            },
            {
                name: "completedCategory",
                label: lang`Completed category`,
            },
        ]
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    gap: 0px;
                    height: 100%;
                    width: 100%;
                    flex-direction: column;
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #item-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #item-header p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                }

                #property-header{
                    grid-area: header2;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;

                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }

                .left-layout item-button {
                    width: 100%;
                    height: 40px;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    gap: 10px;
                }

                h1 {
                    font-size: 3.4375rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 20px 0 0;
                }

                h2 {
                    font-weight: 300;
                    line-height: 1.2;
                    font-size: 1.25rem;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                a {
                    display: inline-block;
                    text-transform: uppercase;
                    color: var(--native-color);
                    margin: 20px auto 0 0;
                    background-color: var(--background-green);
                    letter-spacing: 1px;
                    text-decoration: none;
                    white-space: nowrap;
                    padding: 10px 30px;
                    border-radius: 0;
                    font-weight: 600;
                }

                a:hover {
                    background-color: var(--button-hover-color);
                }

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                footer simple-button {
                    height: 40px;
                }
                #drop_zone {
                    border: 5px solid blue;
                    width: 200px;
                    height: 100px;
                }
                avatar-input {
                    height: 50px;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .left-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                .right-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }

                .table {
                    overflow-y: auto;
                    overflow-x: auto;
                    height: 100%;
                    width: 100%;
                    /* width */
                    &::-webkit-scrollbar {
                        width: 10px;
                    }

                    /* Track */
                    &::-webkit-scrollbar-track {
                        box-shadow: inset 0 0 5px grey;
                        border-radius: 5px;
                    }

                    /* Handle */
                    &::-webkit-scrollbar-thumb {
                        background: red;
                        border-radius: 5px;
                    }

                }
            `
        ]
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
        if (changedProps.has('sportsmenDataSource')) {
            this.items = this.sportsmenDataSource.items.map(item => {
                return {
                    place: item.place ?? 0,
                    sportsman: `${item.lastName} ${item.firstName}`,
                    category: item.category.shortName,
                    year: item.birthday.split('.')[2],
                    region: item.region.shortName ?? item.region.name,
                    club: item.club.name,
                    points: +(item.shooting?.points ?? 0) + +(item.pushUps?.points ?? 0) + +(item.skiing?.points ?? 0),
                    completedCategory: item.completedCategory ?? item.category.shortName,
                }
            });
        }
    }

    render() {
        return html`
            <simple-table-header .columns=${this.columns}></simple-table-header>
            <div class="table">
                <simple-table @click=${this.tableClick} .hideHead=${true} .columns=${this.columns} .rows=${this.items}></simple-table>
            </div>
        `;
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item
            if (!this.oldValues.has(e.target)) {
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[e.target.id] = e.target.value
            if (e.target.id === 'name') {
                this.parentNode.parentNode.host.requestUpdate()
            }
            this.isModified = this.oldValues.size !== 0;
        }
    }

}

customElements.define("my-competition-section-4-page-3", MyCompetitionSection4Page3);