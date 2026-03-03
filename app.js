import {createServer} from "node:http";


const hostname = 'localhost';
const port = 3000;

let products = [
    {id:1, name:'Dell xps 15', price:675000},
    {id:2, name:'Galaxy S26 Ultra', price:186000000},
]


const server = createServer((req, res)=>{
    const {method,url} = req;
    const parsedUrl = new URL(url, `http://${hostname}:${port}`);
    const path = parsedUrl.pathname;
    const id = parseInt(path.split('/').pop(), 10);

    res.setHeader('Content-Type','application/json');

    if(path.startsWith(`/products/`)){
        if(method === 'GET' && path === `/products/`){
            res.statusCode = 200;
            res.end(JSON.stringify(products));
        }else if(method==='GET'&&path===`/products/${id}`){
            const product = products.find(p=>p.id ===id);
            if(product){
                res.statusCode = 200;
                res.end(JSON.stringify(product));
            }else{
                res.statusCode = 404;
                res.end(JSON.stringify({error:'Product not found!'}))
            }
        }else if(method === 'POST' && path === '/products/'){
            console.log('Cocluido')

            let body = '';
            req.on('data', chunk=>{body+=chunk});
            req.on('end',()=>{
                const newP = JSON.parse(body);
                newP.id = products.length+1;
                products.push(newP);
                res.statusCode=201;
                console.log(newP)
                res.end(JSON.stringify({code:"201", message:"Product created successfully!", product:newP}));
            });
        }else if(method === 'PUT' && path === `/products/${id}`){
            let body ='';
            req.on('data', chunk=>body+=chunk);
            req.on('end',()=>{
                const updated = JSON.parse(body);
                const index = products.findIndex(p=>p.id===id)
                console.log(id)
                console.log(updated)
                if(id!==-1){
                    products[index]={...products[index], ...updated};
                    res.statusCode=200;
                    console.log(products[index])
                    res.end(JSON.stringify(products[index]));
                }else{
                    res.statusCode ==404;
                    res.end(JSON.stringify({error:"Product not founded"}))
                }
            });

        }else if(method === 'DELETE' && path === `/products/${id}`){
            const index = products.findIndex(p=>p.id===id);
            if(index!==-1){
                products.splice(index, 1);
                res.statusCode = 204;
                res.end()
            }else{
                res.statusCode = 404;
                res.end(JSON.stringify({error:"Product not found"}))
            }
        }else{
            res.statusCode = 404;
            res.end(JSON.stringify({error:"method not found!"}))
        }
    }else{
        res.statusCode = 404;
        res.end(JSON.stringify({error:"Endpoint not found!"}))
    }
   


    res.end()

});

server.listen(port, hostname, ()=>{
    console.log(`API is running at http://${hostname}:${port}/`)
});