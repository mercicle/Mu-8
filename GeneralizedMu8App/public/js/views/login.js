window.LoginView = Backbone.View.extend({

    initialize: function () {        
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    },

    events: {
        "change" : "change",
        "click .login"      : "validateLogin", //when the login button is cliked
        "click .register"   : "registerUser",
    },
    
    change: function(event){
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        
        change[target.name] = target.value;
        console.log("change");

        if(target.name=="username"){

                $.ajax({
                    url: 'users/checkUsernameAtLogin/' + target.value,
                    success: function(res) {
                        if (res !== "ok") {
                            utils.showAlert('Error', 'This username is not found, typo perhaps?');  
                        }
                    },
                    async: false
                });
        }

    },

    registerUser: function(event) {
        event.preventDefault();
        app.navigate("users/signup", true);
    },
    
    validateAll: function() {
        var username = this.$('input[name="username"]').val();
        var password = this.$('input[name="password"]').val();
        
        var messages = {};
        
        if (username.length === 0) {
            messages['username'] = "You must input username";
        }
        else {
            utils.removeValidationError('username');
        }
        
        if (password.length === 0) {
            messages['password'] = "You must input password";
        }
        else {
            utils.removeValidationError('password');
        }
        
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
            
    validateLogin: function (event) {        
        var check = this.validateAll();
        
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
                
        this.login();
        return false;
    },

    login: function () {

        utils.hideAlert();                
        console.log("LoginView login event");
        $.ajax({
            url: "users/login",
            type: "post",
            data: this.$('form').serialize(),
            success: function (data, textStatus, xhr) {
                console.log("success $.ajax post users/login");
                console.log('data='+data);
                app.user.set({_id: data});
                app.user.fetch();
                //if the login was successful then redirect to the user main page
                app.navigate("", true);
            },
            error: function (xhr, textStatus, errorThrown) {                
                utils.showAlert('Error', 'Invalid username or password');      
            },
        });
    },
});