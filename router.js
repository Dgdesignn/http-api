class Router{
    constructor(){
        this.routes = [];
    }

    get(path, handler){
        this.addRoute('GET',path, handler);
    }

    post(path,handler){
        this.addRoute('POST',path, handler);
    }

    put(path, handler){
        this.addRoute('PUT',path, handler);
    }

    delete(path,handler){
        this.addRoute('DELETE',path, handler);
    }

    addRoute(method, path, handler){
        let paramName = null;
        let regexPath = path;

        if(path.includes(':')){
            const parts = path.split('/');
            const paramIndex = parts.findIndex(p=>p.startsWidth(':'));
            if(paramIndex !==-1){
                paramName = parts[paramIndex].slice(1);
                parts[paramIndex]='([^/]+)';
                regexPath = parts.join('/');
            }
        }

        this.routes.push({
            method, 
            path:regexPath,
            handler,
            paramName,
            isRegex:!!paramName,
        });
    }

    async handler(req, res){
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;

        for(const rout of this.routes){
            if(this.routes.method !== req.method)continue;

            if(!this.routes.isRegex){
                if(this.routes.path == path){
                    return this.routes.handler(req,res);
                }
            }else{
                const regex = new RegExp(`^${this.routes.path}$`);
                const match = path.match(regex);
                if(match){
                    req.params = req.params || {};
                    req.params[this.routes.paramName]=match[1];
                    return this.routes.handler(req,res);
                }
            }
        }

        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.striginfy({error:'Route not found.'}))
    }
}