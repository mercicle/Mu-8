window.ComputationCreateView = Backbone.View.extend({
	
	initialize: function(){
		this.render();
	},

	render: function(){

		$(this.el).html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this;
	},

	events:{
		"change" : "change",
		"click .compute"  : "beforeCompute",
		"click .cancel" : "backUrl",
	},

	change: function(){
		// Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
	},

	backUrl: function(){
        event.preventDefault();
        app.navigate("computations", true);
	},

	beforeCompute: function(){

        var check = this.model.validateAll();
        
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        
        this.compute();
	},

	compute: function(){

        console.log("made it into compute event in ComputationCreateView");
        var fd = new FormData(this.$('form').get(0));

        fd.append("userThatCreatedMe", app.user.get("_id")); 

        //console.log("fd = "+fd);

        //need the networkID and genesetID in the form at this point
        $.ajax({
            url: "computations",
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: function (data, textStatus, xhr) {
                app.navigate("#computations", true);
            },
            error: function (xhr, textStatus, errorThrown) {
                utils.showAlert('Error', xhr.responseText, 'alert-error');
            },
            async: true
        });

        utils.showAlert("Computing...", "When completed ", "alert-info");
    }
});



