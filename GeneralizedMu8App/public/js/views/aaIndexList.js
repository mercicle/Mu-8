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
         
        this.$('#aaindicesTable').dataTable({"bAutoWidth": false});        

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
                accession: this.model.get("accession"), 
                description: this.model.get("description"), 
                category: this.model.get("category"),
                aaIndexIndex: this.model.get("aaIndexIndex"),
        }));
        
        return this;
    },
    
    events: {
        "click .add"        : "addAAIndex",
        "click .remove"     : "removeAAIndex",
        "click"             :  "exchangeIndices",
    },
    
    exchangeIndices: function(event){
        
        accessionOfNewIndex = this.model.get("accession");

        var desc = this.model.get("description");

        var splitDesc = desc.split("(");

        if (splitDesc.length==2){
            authorYearOfNewIndex = splitDesc[1].replace(')', '');
        }else if (splitDesc.length==3){
            authorYearOfNewIndex = splitDesc[2].replace(')', '');
        }else{
            authorYearOfNewIndex = desc.splice(0,Math.round(desc.length/2)).replace(')', ''); + "..."
        }
 
        //authorYearOfNewIndex


        console.log("exchanging " + accessionOfNewIndex);

        var thisRoute = Backbone.history.fragment;
        var computationId = thisRoute.split("/")[1];

        console.log('computationId'+computationId);

        newIndexData = [];
        if(typeof computationId != 'undefined'){

              ///visualdata/:computationId/:accession
              $.getJSON('/visualdata/' + computationId + '/' + accessionOfNewIndex,
                function(data){ 

                        $.each( data , function( i , item ) { 
                           newIndexData.push(data[i]);
                        }); 

              }).done(function() { console.log( "Done getting new AA index data" ); 
                                   $( "#dialogAAIndexSelector" ).remove();
                                   updateData();
                                   updateVizWithNewAAIndex();
                                   updateHistogramData();
                                   updateHistogramViz();

                                   updateHeatData();
                                   updateHeatMaps();
                                 });
        } 

    },

    addAAIndex: function(event){

        event.preventDefault();
       
        var thisAAIndex = this.model.get("accession");
        
        var rowID = 'row'+this.model.get("aaIndexIndex");
        var aaindexIndex = this.model.get("aaIndexIndex");

        $(this.$el).attr('id',rowID);

        var thisButton = d3.select("#i"+this.model.get("aaIndexIndex"));

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
  
        var thisAAIndex = this.model.get("accession");
 
        var rowID = 'row' + this.model.get("aaIndexIndex");
        var aaindexIndex = this.model.get("aaIndexIndex");
        $(this.$el).attr('id',rowID);

        var thisButton = d3.select("#i"+this.model.get("aaIndexIndex"));

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