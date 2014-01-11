window.AAIndex = Backbone.Model.extend({

	urlRoot: "/aaIndices",

	idAttribute:"_id",

	defaults:
    {   _id : null, 
        name: "",
        accession: "",
	    description: "",
	    category: "",
        aaindexIndex:null,

    }
});

window.AAIndexCollection = Backbone.Collection.extend({

	model: AAIndex,

	url: "/aaIndices",

});
