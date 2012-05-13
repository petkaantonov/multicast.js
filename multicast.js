(function( window, undefined ) {

    window.Observable = observable;

    function observe(fn) {
        this.listeners.push(fn);
    }
    
    function unobserve(fn) {
        var index,
            listeners = this.listeners,
            listener,
            i,
            len = listeners.length;
            
        if( !fn ) {
            return null;
        }

        for( i = 0; i < len; ++i ) {
            listener = listeners[i];
            if( listener === fn ) {
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
    
    
    function observable( context ) {
        if( !context ) {
            context = this;
        }
        
        function self ( fn ) {
            if( fn && fn.call ) {
                return observe.call( self, fn);
            }
            return update.apply( self, arguments );
        };

        self.listeners = [];
        self.context = context;
        self.remove = unobserve;
        return self;
    }
    
})( this );

var obj = {};
obj.clicked = Observable(obj);

obj.clicked( function(data, hi){
    console.log( this, arguments );
} );

obj.clicked("hi");