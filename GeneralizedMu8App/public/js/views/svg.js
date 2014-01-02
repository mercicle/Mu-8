window.CircleView = Backbone.View.extend({
  initialize: function() {
    this.d3 = d3.select(this.el);
  },
  render: function() {
    // randomly make up numbers for cx, cy, and r
    var cx = Math.random() * 200,
        cy = Math.random() * 200,
        r = Math.random() * 50;
    
    this.d3.attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r);
  }
});

/*
window.SVGView = Backbone.View.extend({

  el: "svg",
  initialize: function(data) {
  	console.log(data);
    this.d3 = d3.select(this.el);
    this.d3.append("circle").attr("fill", "#08c").attr("r", 10).attr("cx",50).attr("cy",50);
  }
});
*/

window.SVGView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
      /*
        console.log('inside SVGView render and $(this.el) is:');
        console.log($(this.el));
         

        var thisTemplate  = this.template();
        console.log('this.template()');
        console.log(this.template());

        console.log('thisTemplate svg');
        console.log(thisTemplate);

        */
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    },
});