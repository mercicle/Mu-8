window.PasswordChangeView = Backbone.View.extend({

    initialize: function () {
        this.user = new User();
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.user.toJSON()));
        this.delegateEvents();
        return this;
    },

    events: {        
        "click .change"     : "beforeChange",
        "click .cancel"     : "cancel",
    },

    cancel: function(event) {
        event.preventDefault();
        app.navigate("users/account", true);
    },
            
    validateAll: function() {        
        var password = this.$('input[name="password"]').val();
        var newpassword = this.$('input[name="newpassword"]').val();
        var newpassword2 = this.$('input[name="newpassword2"]').val();
        
        var messages = {};
        
        if (password.length === 0) {
            messages['password'] = "You must enter your password";
        }
        else {
            utils.removeValidationError('password');
        }
        
        if (newpassword.length === 0) {
            messages['newpassword'] = "You must enter a new password";
        }
        else {
            utils.removeValidationError('newpassword');
        }
        
        if (newpassword2 !== newpassword) {
            messages['newpassword2'] = "Sorry, you have to confirm your new password";
        }
        else {
            utils.removeValidationError('newpassword2');
        }
        
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    beforeChange: function () {
        var check = this.validateAll();
        
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
                
        this.changePassword();
        return false;
    },

    changePassword: function () {
        var self = this;
        console.log('before change password');
        
        $.ajax({
            url: "users/changePassword/" + app.user.get("_id"),
            type: "put",
            data: {
                "oldpass": self.$('input[name="password"]').val(),
                "newpass": self.$('input[name="newpassword"]').val()
            },
            success: function(data, textStatus, xhr) {
                app.user.set("password", data);
                app.navigate("users/account", true);
                utils.showAlert('Success!', 'Changed password successfully', 'alert-success');
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                utils.showAlert("Error", xhr.responseText, "alert-error");
            }
        });        
    },

});