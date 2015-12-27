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
        "Фраза на русском": {
            'en': 'Phrase in English'
        }
    };

    var self = this;
};