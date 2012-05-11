(function( window, undefined ) {

    window.action = action;
    window.actions = actions;

    function observe(fn) {
        this.listeners.push(fn);
    }
    
    function unobserve(fn) {
        var index;

        index = this.listeners.indexOf(fn);

        if (index > -1) {
            this.listeners.splice(index, 1);
        }

    }
    
    function update() {
            var listeners = this.listeners,
                len = listeners.length,
                i;
    
    
            for (i = 0; i < len; ++i) {
                listeners[i].apply(this.context, arguments);
            }
    
    }
    
    function getter() {
        return this;
    }
    
    function setter( fn ) {
        if (fn === this) {
            return;
        }
        this.observe(new Function("return " + fn.replace(/^undefined/, ""))());    
    }
    
    
    function toString() {
        return "undefined";
    }

    function action( context, name ) {
        var self = function() {
            self.update.apply( self, arguments );
        };

        self.listeners = [];
        self.context = context;

        self.observe = observe;
        self.unobserve = unobserve;
        self.update = update;
        self.toString = toString;

        self.context.__defineGetter__(name, getter.bind(self) );
        self.context.__defineSetter__(name, setter.bind(self) );

        return self;   
    }
    
    function actions( context, names ) {
        names.forEach( function( name ){
            action( context, name );
        });
    }

})( this );


function Widget() {
    action(this, "onClose");
}

Widget.prototype = {

    method1: (function() {
        return function(a) {
            alert(a);
        };
    })(),

    method2: function(a) {
        alert(a);
    },

    constructor: Widget
};
var a = new Widget();

var a = new Widget();

a.onClose += function() {
  console.log( this, arguments);  
};

a.onClose("hai");