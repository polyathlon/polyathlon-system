import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../polyathlon-dictionary.mjs'
import { runningMask } from './masks.mjs'
import { isRunningValid } from './validation.mjs'

class MyCompetitionSection6Page7 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
            findDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }
                .container {
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
            `
        ]
    }

    sportsmanName(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        return result
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <div class="container">
                <simple-input id="sportsman" icon-name=${this.item?.gender == 0 ? "sportsman-man-solid" : "sportsman-woman-solid"} label="${lang`Sportsman`}:" .value=${this.sportsmanName(this.item)}></simple-input>
                <simple-input id="ageGroup" icon-name=${this.item?.gender == 1 ? "age-group-women-solid" : "age-group-solid"} label="${lang`Age group`}:" .value=${this.item?.ageGroup?.name}></simple-input>
                <simple-input id="sportsNumber" label="${lang`Sports number`}:" icon-name="sports-number-solid" .value=${this.item?.sportsNumber} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                <div class="name-group">
                    <simple-input id="race" icon-name="race-solid" label="${lang`Race`}:" .currentObject=${this.item?.running} .value=${this.item?.running?.race} @input=${this.validateInput}></simple-input>
                    <simple-input id="track" icon-name="race-track-solid" label="${lang`Track`}:" .currentObject=${this.item?.running} .value=${this.item?.running?.track} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="result" icon-name="timer-solid" .mask=${runningMask} label="${lang`Result`}:" .currentObject=${this.item?.running} .value=${this.item?.running?.result} @input=${this.validateInput}></simple-input>
                    <simple-input id="points" icon-name="hundred-points-solid" label="${lang`Points`}:" .currentObject=${this.item?.running} .value=${this.item?.running?.points} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="place" icon-name="places-solid" label="${lang`Place`}:" .currentObject=${this.item?.running} .value=${this.item?.running?.place} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    resultToValue(result) {
        const parts = result.split(':')
        const minutes = parts[1].split(',')
        return (+parts[0] * 60 + +minutes[0]) * 10 + +minutes[1];
    }

    pointsFind(result, table) {
        let value = this.resultToValue(result)
        return table.reduce( (last, item) =>
            value <= item.value && item.points > last ? item.points : last
        , 0)
    }

    setPoints(target) {
        if (isRunningValid(target.value)) {
            let a = this.parent.sportsDiscipline1.ageGroups.find( item => item.ageGroup._id === this.item.ageGroup._id)
            let b = a.sportsDisciplineComponents.find( item => item.group.name === "Бег")
            this.$id("points").value = this.pointsFind(target.value, this.item.gender == 0 ? b.men : b.women)
            this.$id("points").fire('input')
        }
        else {
            this.$id("points").value = ''
            this.$id("points").fire('input')
        }
    }

    setResult() {
        const start = this.$id("start").value;
        const finish = this.$id("finish").value;
        if (isRunningValid(start) && isRunningValid(finish)) {
            const startValue = this.resultToValue(start)
            const finishValue = this.resultToValue(finish)
            if (finishValue >= startValue) {
                const resultValue = finishValue - startValue;
                const a = (resultValue % 10).toString();
                const b = (Math.floor(resultValue / 10) % 60).toString().padStart(2, "0");
                const c = Math.floor(resultValue / 10 / 60).toString().padStart(2, "0");
                this.$id("result").value = `${c}:${b},${a}`
                this.$id("result").fire('input')
            }
        }
    }

    validateInput(e) {
        if (e.target.value !== "") {
            const currentItem = e.target.currentObject ?? this.item.running ?? {}
            if (!this.oldValues.has(e.target)) {
                this.item.running ??= currentItem
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }

            currentItem[e.target.id] = e.target.value

            if (e.target.id === "result")
            {
                this.setPoints(e.target)
            }

            this.isModified = this.oldValues.size !== 0;
        }
    }

    async showDialog(message, type='message', title='') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        if (title) {
            modalDialog.title = title
        }
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async errorDialog(message) {
        return this.showDialog(message, 'error', 'Ошибка')
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
        const mainReferee = refereeDataSource.items.find( item => item.position.name === "Главный судья");
        const mainSecretary = refereeDataSource.items.find(item => item.position.name === "Главный секретарь");

        const tableBody = [
            [
                { text: 'Место', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Спортсмен', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Год рожд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Звание, разряд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Субъект РФ', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Спортивный клуб', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Очки', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Вып. разряд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
            ],
            [
                '', '', '', '', '', '', '', ''
            ].map(cell => ({ text: cell, fillColor: '#eeeeee' })),
        ];

        tableBody.push(...this.items.map((item, index) => ([
            { text: item.place ?? index + 1, fontSize: 8 },
            { text: item.sportsman ?? '', fontSize: 8 },
            { text: item.year ?? '', fontSize: 8 },
            { text: item.category ?? '', fontSize: 8 },
            { text: item.region ?? '', fontSize: 8 },
            { text: item.club ?? '', fontSize: 8 },
            { text: item.points ?? '', fontSize: 8 },
            { text: item.completedCategory ?? '', fontSize: 8 }
        ])));

        const docInfo = {
            info: {
                title: "sportsmen",
                author: "Polyathlon systems",
            },
            pageSize: "A4",
            pageOrientation: 'landscape',
            pageMargins: [20, 15, 20, 40],
            content: [
                { text: "Министерство спорта Российской Федерации", fontSize: 9, alignment: "center", margin: [0, 2, 0, 2] },
                { text: "Всероссийская Федерация Полиатлона", fontSize: 9, alignment: "center", margin: [0, 2, 0, 2] },
                {
                    text: `${this.parent.name.name}${this.parent.stage ? ' ' + this.parent.stage.name : ''} по полиатлону в спортивной дисциплине ${this.parent?.sportsDiscipline1?.name}`,
                    fontSize: 11, bold: true, alignment: "center", margin: [0, 4, 0, 2]
                },
                {
                    text: `№ СМ ${this.parent?.ekpNumber} в ЕКП`,
                    fontSize: 11, bold: true, alignment: "center", margin: [0, 0, 0, 4]
                },
                {
                    columns: [
                        {
                            text: this.#competitionDate(this.parent),
                            margin: [20, 0, 0, 0],
                            fontSize: 9,
                            alignment: "left",
                        },
                        {
                            text: `г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`,
                            alignment: "right",
                            margin: [0, 0, 20, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    text: "Протокол командного зачета среди команд спортивных клубов",
                    fontSize: 11,
                    bold: true,
                    alignment: "center",
                    margin: [0, 6, 0, 6],
                },
                {
                    table: {
                        widths: [25, 150, 35, 60, 120, 170, 75, 90],
                        body: tableBody,
                        headerRows: 2
                    },
                },
                {
                    columns: [
                        {
                            text: mainReferee?.position.name ?? '',
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `${mainReferee?.firstName?.[0] ?? ''}.${mainReferee?.middleName?.[0] ?? ''}. ${mainReferee?.lastName ?? ''}`,
                            alignment: "left",
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainReferee?.category?.name ?? '',
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `(г. ${mainReferee?.city?.name ?? ''}, ${mainReferee?.city?.region?.name ?? ''})`,
                            alignment: "left",
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainSecretary?.position.name ?? '',
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `${mainSecretary?.firstName?.[0] ?? ''}.${mainSecretary?.middleName?.[0] ?? ''}. ${mainSecretary?.lastName ?? ''}`,
                            alignment: "left",
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainSecretary?.category?.name ?? '',
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `(г. ${mainSecretary?.city?.name ?? ''}, ${mainSecretary?.city?.region?.name ?? ''})`,
                            alignment: "left",
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
            ]
        };

        pdfMake.createPdf(docInfo).open();
    }

    startEdit() {
        let input = this.$id("result")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("my-competition-section-6-page-7", MyCompetitionSection6Page7);