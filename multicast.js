(function( window, undefined ) {

    var rundefined = /^[\D\d]*?undefined/,
        rmatchname = /function\s*([a-zA-Z$_][a-zA-Z0-9$_]*)/;

    window.delegate = action;
    
    var getFnName = function() {
    
        function nameGetter(fn) {
            return fn.name || "";
        }
        
        if( nameGetter.name && nameGetter.name === "nameGetter" ) {
            return nameGetter;
        }
        
        return function(fn) {
            return (((fn+"").match( rmatchname ) || [] )[1] || "");
        }
    
    }();
    
    var isArray = function() {
        var toString = {}.toString;
        if( Array.isArray ) {
            return Array.isArray;
        }
        else {
            return function( obj ) {
                return toString.call( obj, obj ) === "[object Array]";
            };
        }
    }();
    
    var defineGetterAndSetter = function() {
    
        if( Object.defineProperty ) {
            return function(obj, name, getter, setter) {
                Object.defineProperty( obj, name, {
                    set: setter,
                    get: getter
                });
            };
        }
        
        else if( obj.__defineSetter__ ) {
            return function(obj, name, getter, setter) {
                obj.__defineGetter__( name, getter );
                obj.__defineSetter__( name, setter );
            };
        }
        
        else {
            return function(){};
        }
            
    }();
    

    function observe(fn) {
        this.listeners.push(fn);
    }
    
    function unobserve(fn) {
        var index, name = fn.call ? getFnName(fn) : fn,
            listeners = this.listeners,
            listener,
            i, len = listeners.length;
            
        if( !fn ) {
            return null;
        }

        for( i = 0; i < len; ++i ) {
            listener = listeners[i];
            if( listener === fn || ( name && getFnName( listener ) === name ) ) {
                return listeners.splice( i, 1 )[0];
            }
        }
        return null;

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

        this.observe(new Function("return " + fn.replace(rundefined, ""))());    
    }
    

    
    function toString() {
        return "";
    }

    function action( context, name ) {
        if( isArray( name ) ) {
            return actions( context, name );
        }
        var self = function() {
            self.update.apply( self, arguments );
        };

        self.listeners = [];
        self.context = context;

        self.observe = observe;
        self.unobserve = unobserve;
        self.update = update;
        self.toString = toString;

        defineGetterAndSetter( context, name, getter.bind(self), setter.bind(self) );

        return self;   
    }
    
    function actions( context, names ) {
        names.forEach( function( name ){
            action( context, name );
        });
    }

})( this );


function Widget() {
    delegate(this, "onClose");
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

a.onClose += function named(){}