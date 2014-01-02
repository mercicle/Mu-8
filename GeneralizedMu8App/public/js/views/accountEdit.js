window.AccountEditView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this;
    },
    
    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .cancel" : "cancel",
    },
    
    cancel: function(event) {
        event.preventDefault();
        //event.stopPropagation();
        app.navigate("users/account", true);
    },
            
    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        
        change[target.name] = target.value;
        this.model.set(change);                

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        //console.log(check);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;        
        var check;
        
        check = this.model.validateItem("firstname");
        
        if (check.isValid === false) {
            utils.displayValidationErrors(check.message);
            return false;
        }
        
        check = this.model.validateItem("lastname");
        console.log(check);
        if (check.isValid === false) {
            utils.displayValidationErrors(check.message);
            return false;
        }
        
        this.saveUser();
        return false;
    },

    saveUser: function () {
        var self = this;
        console.log('before save user');
        
        this.model.save(null, {
            success: function (model) {
                self.render();
                console.log(self.model);
                app.navigate('users/account', true);
                utils.showAlert('Success!', 'Updated account successfully!', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'Sorry, an error occurred while trying to update account!', 'alert-error');
            }
        });
    },
});