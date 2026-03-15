let products =[];

export function getAll(){
    return products;
}

export function getById(id){
    return products.find(p=>p.id === id);
}

export function create(product){
    const newProduct = {
        id: Date.now().toString(),
        ...product,
    };
    products.push(newProduct);
    return newProduct;
}

export function update(id, product){
    const index = products.findIndex(p=>p.id === id);
    if(index === -1) return null;

    products[index] = {
        ...products[index],
        ...product,
    };
    return products[index];
}

export function remove(id){
    const index = products.findIndex(p=>p.id === id);
    if(index === -1) return false;

    products.splice(index,1);
    return true;
}