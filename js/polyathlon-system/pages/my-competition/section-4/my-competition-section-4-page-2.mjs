import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/tables/simple-table.mjs'
import '../../../../../components/tables/simple-table-header.mjs'
import lang from '../../../polyathlon-dictionary.mjs'

class MyCompetitionSection4Page2 extends BaseElement {
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
        this.columns = [[
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
        ]]
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
                    gender: item.gender,
                    category: item.category.shortName,
                    year: new Date(item.birthday).getFullYear(),
                    region: item.region.shortName ?? item.region.name,
                    club: item.club.name,
                    points: +(item.shooting?.points ?? 0) + +(item.pushUps?.points ?? 0) + +(item.skiing?.points ?? 0),
                    completedCategory: item.completedCategory ?? item.category.shortName,
                }
            }).sort((a, b) => +(a.gender) - b.gender || b.points - a.points).map((item, index) => {item.place = index + 1; return item});
        }
    }

    render() {
        return html`
            <!-- <simple-table-header .columns=${this.columns}></simple-table-header> -->
            <div class="table">
                <!-- <simple-table @click=${this.tableClick} .hideHead=${true} .columns=${this.columns} .rows=${this.items}></simple-table> -->
                <simple-table @click=${this.tableClick} .columns=${this.columns} .rows=${this.items}></simple-table>
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
    #competitionDate(parent) {
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

        if (parent.startDate) {
            const start = parent.startDate.split("-")
            const end = parent.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            return `${start[2]} ${monthNames[start[1]-1]} - ${end[2]} ${monthNames[end[1] - 1]} ${start[0]} года`
        }
        return ''
    }
    pdfMethod(refereeDataSource) {
        //const mainReferee = refereeDataSource.items.find((item) => item.position.name === "Главный судья")
        //const mainSecretary = refereeDataSource.items.find((item) => item.position.name === "Главный секретарь")
        const docInfo = {
          info: {
            title: "clubs",
            author: "Polyathlon systems",
          },

          pageSize: "A4",
          pageOrientation: 'landscape',
          pageMargins: [10, 20, 30, 60],

          content: [
            {
                text: "Министерство спорта Российской Федерации",
                fontSize: 10,
                alignment: "center",
                margin: [10, 0, 0, 0],
            },
            {
                text: "Всероссийская Федерация Полиатлона",
                fontSize: 10,
                alignment: "center",
                margin: [10, 0, 0, 0],
            },
            {
                text: "`${this.parent.name.name}${this.parent.stage ? ' ' + this.parent.stage.name: ''} по полиатлону` в спортивной дисциплине ${this.parent?.sportsDiscipline1?.name}`",
                fontSize: 12,
                bold:true,
                alignment: "center",
                margin: [10, 10, 0, 0],
            },
            {
                text: "`№ СМ ${this.parent?.ekpNumber} в ЕКП`",
                fontSize: 12,
                bold:true,
                alignment: "center",
                margin: [10, 0, 0, 5],
            },
            {
                columns: [
                    {
                        text: "this.#competitionDate(this.parent)",
                        margin: [70, 0, 0, 0],
                        fontSize: 10,
                        alignment: "left",
                    },
                    {
                        text: "`г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`",
                        alignment: "right",
                        margin: [0, 0, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                text: "Протокол командного зачета среди команд спортивных клубов",
                fontSize: 12,
                bold:true,
                alignment: "center",
                margin: [10, 10, 0, 5],
            },
            {
                table:{
                    widths: [15, 100, 25, 30, 90, 130, 25,25,25,25,25,25,25,25,25,15],
                    body:[
                        [{text: 'Место', rowSpan: 2, fontSize: 8}, {text: 'Спортсмен', rowSpan: 2, fontSize: 10}, {text: 'Год рожд', rowSpan: 2, fontSize: 8}, {text: 'Звание, разряд', rowSpan: 2, fontSize: 8}, {text: 'Суъект РФ', rowSpan: 2, fontSize: 10}, {text: 'Спортивный клуб', rowSpan: 2, fontSize: 10}, {text: 'Бег 60м', colSpan: 2, fontSize: 9}, '', {text: 'Стрельба - упражнение lll-ВП', colSpan: 2, fontSize: 8}, '', {text: 'Плавание 100 м', colSpan: 2, fontSize: 9}, '', {text: 'Бег 2000 м', colSpan: 2, fontSize: 9}, '', {text: 'Сумма очков', rowSpan: 2, fontSize: 8}, {text: 'Вып. разряд', rowSpan: 2, fontSize: 8}],
                        ['', '', '', '', '', '', {text: 'рез-т', fontSize: 10}, {text: 'очки', fontSize: 10}, {text: 'рез-т', fontSize: 10}, {text: 'очки', fontSize: 10}, {text: 'рез-т', fontSize: 10}, {text: 'очки', fontSize: 10}, {text: 'рез-т', fontSize: 10}, {text: 'очки', fontSize: 10}, '', ''],
                        [{text: '(пол)', colSpan: 16, fontSize: 10, alignment: "center"}, '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                      ],
                    headerRows: 1,
                }
            },
            {
                columns: [
                    {
                        text: "mainReferee?.position.name",
                        margin: [70, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`${mainReferee?.firstName[0]}.${mainReferee?.middleName[0]}. ${mainReferee?.lastName}`",
                        alignment: "left",
                        margin: [70, 20, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [

                    {
                        text: "mainReferee?.category.name",
                        margin: [70, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`",
                        alignment: "left",
                        margin: [70, 0, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [
                    {
                        text: "mainSecretary?.position.name",
                        margin: [70, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`${mainSecretary?.firstName[0]}.${mainSecretary?.middleName[0]}. ${mainSecretary?.lastName}`",
                        alignment: "left",
                        margin: [70, 20, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
            {
                columns: [

                    {
                        text: "mainSecretary?.category.name",
                        margin: [70, -10, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: "`(г. ${mainSecretary?.city?.name}, ${mainSecretary?.city?.region?.name})",
                        alignment: "left",
                        margin: [70, -10, 0, 0],
                        fontSize: 10,
                    },
                ],
                columnGap: 90
            },
          ],

          styles: {
            header0:{
            }
          }
        };

        pdfMake.createPdf(docInfo).open();
    }
}

customElements.define("my-competition-section-4-page-2", MyCompetitionSection4Page2);