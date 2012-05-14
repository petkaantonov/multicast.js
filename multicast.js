;(function(global) {
"use strict";

    function observe(fn) {
        this.fns.push(fn);
    }
    
    function unobserve(fn) {
        var fns = this.fns, 
            index = fns.indexOf(fn);
            
        ~index && fns.splice( index, 1 );
    }
    
    function update() {
        var fns = this.fns,
            i;

        for (i = 0;
            fns[i] && fns[i].apply(this.ctx, arguments) !== false;
            ++i){}
    
    }
    
    function toString() {
        return "Observable";
    }
    
    function observable( ctx ) {
        function self ( fn ) {
            if( fn && fn.call === toString.call && arguments.length === 1 ) {
                observe.call( self, fn);
                return self;
            }
            update.apply( self, arguments );
            return self;
        }

        self.fns = [];
        self.toString = toString;
        self.ctx = ctx;
        self.remove = unobserve;
        return self;
    }
    
    if( typeof module !== "undefined" && module.exports ) {
        module.exports = observable;
    }
    else if ( global ) {
        global.Observable = observable;
    }
        
})(this);