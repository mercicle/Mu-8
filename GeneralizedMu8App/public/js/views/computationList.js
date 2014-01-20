window.ComputationListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var computations = this.model.models;
        
        $(this.el).html(this.template());                
        
        for (var i = 0; i < computations.length; i++) {
             
            this.$('#computationsTable tbody').append(new ComputationListItemView({model: computations[i], no: i+1}).render().el);
        }
        
        this.$('#computationsTable').dataTable({"bAutoWidth": false});        

        return this;
    }
});

window.ComputationListItemView = Backbone.View.extend({

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
                computationName: this.model.get("computationName"),
                status: this.model.get("status"),
                description: this.model.get("description"),
                isPublic: this.model.get("isPublic")
        }));
        
        return this;
    },
    
    events: {
        "click .delete"        : "deleteComputation",
        "click .visualize"     : "visualizeComputation",
    },
    
    visualizeComputation: function () {

        $('#spinningWheel').modal('show');
        var thisID = this.model.get("_id");
        
        app.navigate("visualize/"+thisID, true);
    },

    deleteComputation: function(event){
        event.preventDefault();
        
        if (confirm("Are you sure to delete the computation!?")) {            
            this.model.destroy({
                success: function () {
                    alert('Computation deleted successfully');
                    location.reload();
                }
            });
        }
        return false;
    }
});