var Observable = (function() {
    return observable;
    
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
                len = fns.length,
                i;
    
            for (i = 0;
                fns[i] && fns[i].apply(this.ctx, arguments) !== false;
                ++i);
    
    }
    
    function observable( ctx ) {
        function self ( fn ) {
            if( fn && fn.call ) {
                observe.call( self, fn);
                return self;
            }
            update.apply( self, arguments );
            return self;
        }

        self.fns = [];
        self.ctx = ctx;
        self.remove = unobserve;
        return self;
    }
        
})();