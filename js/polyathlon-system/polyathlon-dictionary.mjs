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
        "ru-RU": 'Вход',
        "en-EN": 'Sign in'
    },
    'Login': {
        "ru-RU": 'Логин',
        "en-EN": 'Login'
    },
    'Password': {
        "ru-RU": 'Пароль',
        "en-EN": 'Password'
    },
    'Remember me': {
        "ru-RU": 'Запомнить меня',
        "en-EN": 'Remember me'
    },
    'Forgot password?': {
        "ru-RU": 'Забыли пароль?',
        "en-EN": 'Forgot password?'
    },
    'Registration': {
        "ru-RU": 'Зарегистрироваться',
        "en-EN": 'Registration'
    },
    'E-mail': {
        "ru-RU": 'Электронная почта',
        "en-EN": 'E-mail'
    },
    'Email': {
        "ru-RU": 'Электронная почта',
        "en-EN": 'Email'
    },
    'Confirm': {
        "ru-RU": 'Подтвердите пароль',
        "en-EN": 'Confirm'
    },
    'Sign Up': {
        "ru-RU": 'Регистрация',
        "en-EN": 'Sign Up'
    },
    'First name': {
        "ru-RU": 'Имя',
        "en-EN": 'First name'
    },
    'Last name': {
        "ru-RU": 'Фамилия',
        "en-EN": 'Last name'
    },
    'Middle name': {
        "ru-RU": 'Отчество',
        "en-EN": 'Middle name'
    },
    'Nickname': {
        "ru-RU": 'Никнейм',
        "en-EN": 'Nickname'
    },
    'Gender': {
        "ru-RU": 'Пол',
        "en-EN": 'Gender'
    },
    'Male': {
        "ru-RU": 'Мужской',
        "en-EN": 'Male'
    },
    'Female': {
        "ru-RU": 'Женский',
        "en-EN": 'Female'
    },
    'Data of birth': {
        "ru-RU": 'Дата рождения',
        "en-EN": 'Data of birth'
    },
    'Region name': {
        "ru-RU": 'Регион',
        "en-EN": 'Region name'
    },
    'Club name': {
        "ru-RU": 'Клуб',
        "en-EN": 'Club name'
    },
    'Sportsman Ulid': {
        "ru-RU": 'Ulid спортсмена',
        "en-EN": 'Sportsman Ulid'
    },
    'Sportsman number': {
        "ru-RU": 'Номер спортсмена',
        "en-EN": 'Sportsman number'
    },
    'Category': {
        "ru-RU": 'Категория',
        "en-EN": 'Category'
    },
    'Order number': {
        "ru-RU": 'Номер приказа',
        "en-EN": 'Order number'
    },
    'Order link': {
        "ru-RU": 'Ссылка на приказ',
        "en-EN": 'Order link'
    },
    'Person link': {
        "ru-RU": 'Личная ссылка',
        "en-EN": 'Person link'
    },
    'Send Email': {
        "ru-RU": 'Отправить письмо на почту',
        "en-EN": 'Send Email'
    },
    'Recovery code': {
        "ru-RU": 'Код подтверждения',
        "en-EN": 'Recovery code'
    },
    'Recover Password': {
        "ru-RU": 'Восстановить пароль',
        "en-EN": 'Recover Password'
    },
    'Password recovery': {
        "ru-RU": 'Восстановление пароля',
        "en-EN": 'Password recovery'
    },
    'Age group': {
        "ru-RU": 'Возрастная группа',
        "en-EN": 'Age group'
    },
    'Sports category': {
        "ru-RU": 'Спортивный разряд',
        "en-EN": 'Sports category'
    },
    'Profile': {
        "ru-RU": 'Профиль',
        "en-EN": 'Profile'
    },

}

//const language = navigator.language
const language = 'ru-RU'
export default function lang(strings, ...values) {
    return dictionary[strings]?.[language] || strings
}