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
    };

    var self = this;
};