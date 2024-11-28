const dictionary = {
    'Competition': {
        "ru-RU": 'Соревнование',
        "en-EN": 'Competition'
    },
    'Competitions': {
        "ru-RU": 'Соревнования',
        "en-EN": 'Competitions'
    },
    'Referee': {
        "ru-RU": 'Судья',
        "en-EN": 'Referee'
    },
    'Referees': {
        "ru-RU": 'Судьи',
        "en-EN": 'Referees'
    },
    'Sportsman': {
        "ru-RU": 'Спортсмен',
        "en-EN": 'Sportsman'
    },
    'Sportsmen': {
        "ru-RU": 'Спортсмены',
        "en-EN": 'Sportsmen'
    },
    'Trainer': {
        "ru-RU": 'Тренер',
        "en-EN": 'Trainer'
    },
    'Trainers': {
        "ru-RU": 'Тренеры',
        "en-EN": 'Trainers'
    },
    'Statistic': {
        "ru-RU": 'Статистика',
        "en-EN": 'Statistic'
    },
    'Log out': {
        "ru-RU": 'Выйти',
        "en-EN": 'Log out'
    },
    'Log in': {
        "ru-RU": 'Войти',
        "en-EN": 'Log in'
    },
    'Add': {
        "ru-RU": 'Добавить',
        "en-EN": 'Add'
    },
    'Delete': {
        "ru-RU": 'Удалить',
        "en-EN": 'Delete'
    },
    'Save': {
        "ru-RU": 'Сохранить',
        "en-EN": 'Save'
    },
    'Cancel': {
        "ru-RU": 'Отменить',
        "en-EN": 'Cancel'
    },
    'Sign in': {
        "ru-RU": 'Войти',
        "en-EN": 'Sign in'
    },
}

const language = navigator.language

export default function lang(strings, ...values) {
    return dictionary[strings]?.[language] || strings
}
