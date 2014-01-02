window.HeaderView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, 'render');
        
        if (this.model) {
            this.model.on('change:username', this.render, this);
        }
        this.render();
    },

    render: function () {
        this.delegateEvents();        
        
        if (this.model.get("_id")) {
            $(this.el).html(this.template({username: this.model.get("username")}));
        }
        else {            
            $(this.el).html(this.template({username: ""}));
        }
        
        return this;
    },
    
    selectMenu: function(menuType) {
        $('.nav-collapse').hide();
        
        if (menuType) {
            $('.' + menuType).show();
        }
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});