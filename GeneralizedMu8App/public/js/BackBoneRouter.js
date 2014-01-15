var AppRouter = Backbone.Router.extend({

    routes: {
        ""                              : "home",
        "users/login"                   : "login",
        "users/signup"                  : "signup",
        "users/account"                 : "account",
        "users/account/edit"            : "editAccount",
        "users/password/change"         : "changePassword",
        "users/logout"                  : "logout",
        "users/userguide"               : "userguide",

        "visualize/:computationId"        : "visualize",

        "computations"                       : "listComputation",
        "computations/page/:page"            : "listComputation",
        "computations/add"                   : "addComputation",
        "computations/:computationId/:isSearch"  : "browseComputation",

        "about"             : "about"
    },

    initialize: function () {
        var self = this;
        this.user = new User();
        
        this.headerView = new HeaderView({model: this.user});
        
        $.ajax({
            url: "users/get/session",
            success: function(data, textStatus, xhr) {
                if (data !== "none") {
                    self.user.set({"_id": data});
                    self.user.fetch();
                }
            },
            async: false
        });
        
        $('.header').html(this.headerView.el);
    },
    
    home: function () {

        if (this.user.get("_id")) {            

            var p = 1;//page ? parseInt(page, 10) : 1;

            var computationList = new ComputationCollection();
            
            computationList.url = "/computations/user/" + this.user.get("_id");            
            console.log('inside listComputation: '+computationList.url);
            
            computationList.fetch({
                success: function() {
                    $('#content').html(new ComputationListView({model: computationList, page: p}).el);
                }
            });


        }
        else {
            if (!this.homeView) {
                this.homeView = new HomeView();
            }
            
            this.homeView.render();
            $('#content').html(this.homeView.el);
            
        }
    },

    visualize: function(computationId){

        if (!this.user.get("_id")){
            this.navigate("users/account", true);
        }
        else {

            if (!this.visualizeView) {
                this.visualizeView = new VisualizeView();
            }

            //inject the SVG template with the svgView wrapper
            $('#content').html(this.visualizeView.el);
 
            $("#spinningWheelTitle").html("Loading Visualization");
            $('#spinningWheel').modal('show');
            
            $.get( '/staticvisualdata/' + computationId, function( data, textStatus, jqxhr ) {
            
                console.log( 'processedPDBFiles/lines_' + computationId + '.js' );

                $( "#lines" ).text( data );

                $.getJSON("/visualdata/" + computationId,
                
                    function(data){

                        $.each( data , function( i , item ) { 
                           defaultIndexData.push(data[i]);
                        }); 

                        seqLength = defaultIndexData[0][0].length;
                        prepareData();
                        setupVisualization();
                        webGLStart();

                    }

                ).done(function(){  

                                    $('#spinningWheel').modal('hide');

                                 });
 
            });//$.getScript

        }
    },
 
    signup: function() {
        if (this.user.get("_id")) {
            this.navigate("users/account", true);
        }
        else {
            if (!this.signupView) {
                this.signupView = new SignupView();
            }

            this.signupView.render();

            $('#content').html(this.signupView.el);

            //$('#firstname').attr('disabled', true);
            //$('#lastname').attr('disabled', true);
            //$('#email').attr('disabled', true);
            //$('#username').attr('disabled', true);
            //$('#password').attr('disabled', true);
            //$('#password2').attr('disabled', true);
            //$('#affiliation').attr('disabled', true);
            //$('#signup').attr('disabled', true);
        }
    },
            
    login: function() {
 
        if (this.user.get("_id")) {
            this.navigate("users/account", true);
        }
        else {
 
            if (this.loginView) {
                this.loginView.remove();
            }
            this.loginView = new LoginView();
            //this.loginView.render();

            $('#content').html(this.loginView.el);
        }
    },
            
    account: function() {
        if (!this.user.get("_id")) {            
            this.navigate("users/login", true);
        }
        else {
            if (!this.accountView) {
                this.accountView = new AccountView({model: this.user});
            }
            $('#content').html(this.accountView.el);
        }
    },
    
    editAccount: function() {
        if (!this.user.get("_id")) {
            this.navigate("users/login", true);
        }
        else {
            if (!this.accountEditView) {
                this.accountEditView = new AccountEditView({model: this.user});
            }
            this.accountEditView.render();
            
            $('#content').html(this.accountEditView.el);
        }
    },
    
    changePassword: function() {
        if (!this.user.get("_id")) {
            this.navigate("users/login", true);
        }
        else {
            if (!this.passwordChangeView) {
                this.passwordChangeView = new PasswordChangeView({model: this.user});
            }
            
            this.passwordChangeView.render();
            
            $('#content').html(this.passwordChangeView.el);            
        }
    },
    
    logout: function() {

        if (this.user.get("_id")) {
            var self = this;                    

            $.ajax({url: "users/logout",
                    type: "post",
                    success: function(data, textStatus, xhr) {
                        if (data === "success") {                    
                            self.user.unset("_id");
                            self.user.set("username", "");
                            
                            self.navigate("", true);
                            utils.showAlert("Logged out successfully");
                        }
                    },
                    async: false
            });
        }
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },
    
    userguide: function () {
        if (!this.userguideView) {
            this.userguideView = new UserGuideView();
        }
        $('#content').html(this.userguideView.el);
    },

    addComputation: function() {
        if (!this.user.get("_id")) {            
            this.navigate("users/login", true);
        }
        else {
            var computation = new Computation();
            $('#content').html(new ComputationCreateView({model: computation}).el);
        }
    },

    listComputation: function(page) {
        if (!this.user.get("_id")) {
            this.navigate("users/login", true);
        }
        else {

            var p = page ? parseInt(page, 10) : 1;

            var computationList = new ComputationCollection();
            
            computationList.url = "/computations/user/" + this.user.get("_id");            
            console.log('inside listComputation: '+computationList.url);
            
            computationList.fetch({
                success: function() {
                    $('#content').html(new ComputationListView({model: computationList, page: p}).el);
                }
            });
        }
    }

});

utils.loadTemplate(
    [
        'HomeView',
        'HeaderView',
        'AboutView',
        'LoginView',
        'SignupView',
        'AccountView',
        'AccountEditView',
        'PasswordChangeView',

        'UserGuideView',

        'VisualizeView',

        'ComputationCreateView',
        'ComputationListView',
        'ComputationListItemView', 
 
        'AAIndexListView',
        'AAIndexListItemView',

        'SVGView',

    ],
            
    function() {
        //start the backbone router
        app = new AppRouter();
        Backbone.history.start();
    }
);