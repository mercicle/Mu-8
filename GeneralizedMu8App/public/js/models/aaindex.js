window.AAIndex = Backbone.Model.extend({

	urlRoot: "/aaIndices",

	idAttribute:"_id",

	defaults:
    {   _id : null, 
        name: "",
        aaindexIndex:null,
    }
});

window.AAIndexCollection = Backbone.Collection.extend({

	model: AAIndex,

	url: "/aaIndices",

});
