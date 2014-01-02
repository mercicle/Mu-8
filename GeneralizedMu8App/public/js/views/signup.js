window.SignupView = Backbone.View.extend({

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
        "change"        : "change",
        "click .save"   : "validateUser"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        
        change[target.name] = target.value;

        this.user.set(change);

        // Run validation rule (if any) on changed item
        var check = this.user.validateItem(target.id);
        //console.log(check);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    validateUser: function () {
        var self = this;
        
        var check = this.user.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }

        //if the validation was successful then save the user 
        this.saveUser();
        
        return false;
    },

    saveUser: function () {

        var that = this;              
        
        this.user.save(null, {
            success: function (user){
                utils.showAlert('Success!', 'Signed up! :-)', 'alert-success');
                $.ajax({
                    url: "users/login",
                    type: "post",
                    data: {username: that.user.get("username"), 
                           password: that.user.get("password")},
                    success: function (data, textStatus, xhr) {
                        app.user.set({_id: data});
                        app.user.fetch();
                        app.navigate("users/account", true);
                        utils.showAlert('Success!', 'Logged in successfully', 'alert-success');
                    }
                });
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to sign up!', 'alert-error');
            }
        });
    },
    
});