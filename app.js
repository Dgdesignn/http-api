import {createServer} from "node:http";


const hostname = 'localhost';
const port = 3000;

let products = [
    {id:1, name:'Dell xps 15', price:675000},
    {id:2, name:'Galaxy S26 Ultra', price:186000000},
]

function listProducts(req, res){
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify(products));
}

function getProduct(req, res, id){
    const product = products.find(p=>p.id ===id);
    if(product){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify(product));
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({error:'Product not found!'}));
    }

}

async function createProduct(req, res){
    const body = await readBody(req);
    const newProduct = JSON.parse(body);
    newProduct.id = products.length + 1;
    products.push(newProduct);
    res.statusCode = 201;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({code:"201", message:"Product created successfully!", product:newProduct}));
}

async function updateProduct(req, res, id){
    const body = await readBody(req);
    const updatedProduct = JSON.parse(body);
    const index = products.findIndex(p=>p.id===id);
    if(index !== -1){
        products[index] = {...products[index], ...updatedProduct};
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify(products[index]));
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({error:'Product not found!'}));
    }
}

async function deleteProduct(req, res, id){       
    const index = products.findIndex(p=>p.id===id);
    if(index !== -1){
        products.splice(index, 1);
        res.statusCode = 204;
        res.end();
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({error:'Product not found!'}));
    }
}

function readBody(req){
    return new Promise((resolve, reject)=>{
        let body = '';
        req.on('data', chunk=>body+=chunk);
        req.on('end', ()=>resolve(body));
        req.on('error', err=>reject(err));
    });
}


const server = createServer(async(req, res)=>{
    const {method,url} = req;
    const parsedUrl = new URL(url, `http://${hostname}:${port}`);
    const path = parsedUrl.pathname;
    const id = parseInt(path.split('/').pop(), 10);

    res.setHeader('Content-Type','application/json');

    if(path==='/api/v2/products/'){
        if(method === 'GET')return listProducts(req, res);
        if(method === 'POST')return await createProduct(req, res);
    }else if(path.startsWith('/api/v2/products/')&& !isNaN(id)){
        if(method === 'GET')return getProduct(req, res, id);
        if(method === 'PUT')return await updateProduct(req, res, id);
        if(method === 'DELETE')return await deleteProduct(req, res, id);
    }


    res.statusCode = 404;
    res.end(JSON.stringify({error:'Route not found!'}));

});

server.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`)
});