window.AAIndexListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var aaindices = this.model.models;
        
        $(this.el).html(this.template());                
        
        for (var i = 0; i < aaindices.length; i++) {
            this.$('#aaindicesTable tbody').append(new AAIndexListItemView({model: aaindices[i], no: i+1}).render().el);
        }
         
        this.$('#aaindicesTable').dataTable({"bAutoWidth": false,"aaSorting": [], "bPaginate": false,"bFilter": false});        

        return this;
    }
});

window.AAIndexListItemView = Backbone.View.extend({

    tagName: "tr",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.render();
    },

    render: function () {
        //the table needs to have this many elements in the template!
        $(this.el).html(this.template({
                no: this.options.no,
                id: this.model.get("_id"),
                name: this.model.get("name"), 
                description: this.model.get("description"), 
                category: this.model.get("category"), 
                aaindexIndex: this.model.get("aaindexIndex"),
        }));
        
        return this;
    },
    
    events: {
        "click .add"        : "addAAIndex",
        "click .remove"     : "removeAAIndex",
    },
    
    addAAIndex: function(event){

        event.preventDefault();
        
        var thisAAIndex = this.model.get("name");
        
        var rowID = 'row'+this.model.get("aaindexIndex");
        var aaindexIndex = this.model.get("aaindexIndex");

        $(this.$el).attr('id',rowID);

        var thisButton = d3.select("#i"+this.model.get("aaindexIndex"));

        thisButton.classed("add",false);
        thisButton.classed("remove",true);

        thisButton.text("Remove");

        var that = this;
 
        var aaindexGenes = [];
        $.getJSON('/aaIndices/' + thisAAIndex,
            function(data){ jQuery.each( data.genes , function( i , item ) { }); 
        }).done(function() {  });

        return false;
    },

    removeAAIndex: function(event){

        event.preventDefault();
        
        var thisAAIndex = this.model.get("name");
 
        var rowID = 'row' + this.model.get("aaindexIndex");
        var aaindexIndex = this.model.get("aaindexIndex");
        $(this.$el).attr('id',rowID);

        var thisButton = d3.select("#i"+this.model.get("aaindexIndex"));

        thisButton.text("Add");
        thisButton.classed("add",true);
        thisButton.classed("remove",false);

        var that = this;
 
        $.getJSON('/aaIndices/' + thisAAIndex,
            function(data){ jQuery.each( data.genes , function( i , item ) {  }); 
        }).done(function() {  });

        return false;
    }
});