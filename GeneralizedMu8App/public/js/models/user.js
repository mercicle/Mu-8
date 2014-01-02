window.User = Backbone.Model.extend({

    urlRoot: "/users",

    idAttribute: "_id",

    initialize: function () {
        var self = this;
        
        this.validators = {};

        this.validators.firstname = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "First name is required."};
        };

        this.validators.lastname = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "Last name is required."};
        };

        this.validators.email = function (value) {
            var email_filter    = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var check = null;
            
            if (value.length == 0) {
                return {isValid: false, message: "A valid email address is required."};
            }
            else if (!email_filter.test(value)) {
                return {isValid: false, message: "A valid email address is required."};
            }
            else {
                
                $.ajax({
                    url: 'users/checkEmail/' + value,
                    success: function(res) {
                        if (res === "ok") {
                            check = {isValid: true};
                        }
                        else {                            
                            check = {isValid: false, message: "This email address is already used. Are you sure you haven't signed up?"};
                        }
                    },
                    async: false
                });
            }                        
            
            return check;
        };

        this.validators.username = function (value) {
            var username_filter = /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/;
            var check = null;
            
            if (value.length == 0) {
                return {isValid: false, message: "A username is required."};
            }
            else if (!username_filter.test(value)) {
                return {isValid: false, message: "Your username contains invalid characters: only use letters and numbers"};
            }
            else {
                $.ajax({
                    url: 'users/checkUsername/' + value,
                    success: function(res) {
                        if (res === "ok") {                            
                            check = {isValid: true};
                        }
                        else {                            
                            check = {isValid: false, message: "This user name is already taken. Are you sure you haven't signed up?"};
                        }
                    },
                    async: false
                });
            }
            
            return check;
        };
        
        
        this.validators.password = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a password"};
        };
        
        this.validators.password2 = function(value) {
            return  (self.get('password') === value) ? {isValid: true} : {isValid: false, message: "Re type the password"};
        };

        this.validators.affiliation = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "Affiliation is required."};
        };
    },
    
    validateItem: function (key) {        
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        firstname: "",
        lastname: "",
        affiliation: "",
        username: "",
        password: "",
        email: "",
        vizData: null
    }
});

window.UserCollection = Backbone.Collection.extend({

    model: User,

    url: "/users"
});
