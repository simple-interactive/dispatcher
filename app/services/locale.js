window.services.locale = function() {

    this.locale = navigator.language || navigator.userLanguage;
    this.locale = 'ru';

    this.setLocale = function (localeKey) {
        self.locale = localeKey;
    };

    this.getLocale = function () {
        return self.locale;
    };

    this.translate = function (phraseKey) {
        if (!self.phrases[phraseKey] || !self.phrases[phraseKey][self.locale]) {
            return phraseKey;
        }
        return self.phrases[phraseKey][self.locale];
    };

    this.phrases = {
        "menu-content": {'ru': 'Главное меню'},
        "menu-orders": {'ru': 'Заказы'},
        "menu-tablets": {'ru': 'Планшеты'},
        "menu-settings": {'ru': 'Настройки'},
        "menu-contact-administrator": {'ru': 'Поддержка'},
        "tablets-header": {'ru': 'Планшеты'},
        "tab-table-add-new-table": {'ru': 'Добавить планшет'},
        "settings": {'ru': 'Настройки'},
        "edit": {'ru': 'Изменить'},
        "remove": {'ru': 'Удалить'},
        "table-manage-header": {'ru': 'Управление планшетами'},
        "table-temp-name": {'ru': 'Стол №'},
        "save": {'ru': 'Сохранить'},
        "cancel": {'ru': 'Отмена'},
        "token-invalid": {'ru': 'Неверный PIN или такой PIN уже существует'},
        "status-invalid": {'ru': 'Что-то пошло не так, советую обратиться в тех поддержку'},
        "name-invalid": {'ru': 'Неверное названия'},
        "confirm-action": {'ru': 'Подтвердите действие'},
        "tablet-removing": {'ru': 'Удалить планшет?'},
        "yes": {'ru': 'Да'},
        "no": {'ru': 'Нет'},
        "order-details-number": {'ru': 'Заказ №'},
        "order-status": {'ru': 'Заказ подан'},
        "order-payStatus": {'ru': 'Заказ оплачен'},
        "done": {'ru': 'Готово'},
        "amount": {'ru': 'шт.'},
        "currency": {'ru': 'грн.'},
        "amount-label": {'ru': 'Итого по заказу'},
        "amount-all-orders": {'ru': 'Итого по всем заказам'},
        "not-orders": {'ru': 'Нет заказов'},
        "table-waiting": {'ru': 'Вызов официанта'},
        "table-name": {'ru': 'Назвние или номер стола'},
        "table-token": {'ru': 'PIN'},
        "order-cancel": {'ru': 'Отменить заказ'},
        "order-paymentMethod-card": {'ru': '(по безналу)'},
        "dispatcher-sign-in": {'ru': 'Вход в Диспетчерскую'},
        "login": {'ru': 'Логин'},
        "password": {'ru': 'Пароль'},
        "sign-in": {'ru': 'Вход'},
        "sign-in-error": {'ru': 'Логин или пароль указаны неверно'},
        "menu-logout": {'ru': 'Выход'},
        "any-questions": {'ru': 'Возникли вопросы?'},
        "call-us": {'ru': 'Позвоните нам'},
        "ok": {'ru': 'OK'},
    };

    var self = this;
};