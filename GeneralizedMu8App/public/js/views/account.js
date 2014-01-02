window.AccountView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, 'render');
        
        if (this.model) {
            //renders when any attribute of user changes
            this.model.on('change', this.render, this);
        }
        this.render();
    },

    render: function () {        
        $(this.el).html(this.template(this.model.toJSON()));     
        return this;
    },
    change: function(){
        utils.hideAlert();
    }
});