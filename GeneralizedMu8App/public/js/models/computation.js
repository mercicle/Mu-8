window.Computation = Backbone.Model.extend({

	urlRoot: "/computations",

	idAttribute:"_id",

	initialize: function() {
		var self = this;
        
        this.validators = {};       

        this.validators.computationName = function (value) {
            var computationName_filter = /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/;
            var check = null;
            
            if (value.length == 0) {
                return {isValid: false, message: "Sorry, you have to enter a computation name."};
            }
            else if (!computationName_filter.test(value)) {
                return {isValid: false, message: "Computation name contains invalid characters: only use letters and numbers :)"};
            }
            else {
                $.ajax({
                    url: 'computations/checkComputationName/' + value,
                    success: function(res) {
                        if (res === "ok") {
                            check = {isValid: true};
                        }
                        else {                            
                            check = {isValid: false, message: 'This computation name is already taken.'};
                        }
                    },
                    async: false
                });
            }
            
            return check;
        };
        
        this.validators.description = function(value) {
            return  value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a description - you will thank me later!"};
        }
    },

	validateItem: function(key){
		 return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
	},

	validateAll: function(){
        var messages = {};

        for (var key in this.validators){
            if(this.validators.hasOwnProperty(key)){
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
	},

	defaults:
    {   _id : null, 
        userThatCreatedMe: "",
        computationName: "",
        isPublic: "public",
        description: "",
        status:"Not Started",
        geneListID : "",
        networkID : ""
    }
});

window.ComputationCollection = Backbone.Collection.extend({

	model: Computation,

	url: "/computations/user/",

});
