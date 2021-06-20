// Variavel
let modalQTD = 1;
let cart = [];
let modalKey = 0;

// Criando Função que faz o querySelector pra eu escrever só C ou CA
const c = (el) => document.querySelector(el);
const ca = (el)=> document.querySelectorAll(el);





///////////////////////////// Listagem das Pizzas /////////////////////////////
pizzaJson.map((item, indice)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Adicionando os dados das pizzas no html
    pizzaItem.setAttribute('data-key', indice);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    

    // Fazendo abrir o modal 
    pizzaItem.querySelector('a').addEventListener('click', function(e) {
        // Cancelar evento padrão do link para não recarregar a página
        e.preventDefault();
        
        // Pegando o dado para ver qual pizza que foi clicada
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQTD = 1;
        modalKey = key;

        // Adicionando os dados com base na pizza Clicada armazenada na KEY
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        ca('.pizzaInfo--size').forEach(function(size, sizeIndice) {
            if (sizeIndice == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndice];
        });

        c('.pizzaInfo--qt').innerHTML = modalQTD;

        // Mostrar o Modal
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(function () {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 100)
        c('.pizzaWindowArea').style.display = 'flex';
    });
    
    // Adicionando a area da pizza no html
    c('.pizza-area').append(pizzaItem);
});





///////////////////////////// Eventos do Modal /////////////////////////////
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(function () {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
}

ca('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item) {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', function () {
    if (modalQTD > 1) {
        modalQTD--
        c('.pizzaInfo--qt').innerHTML = modalQTD;
    } 
});

c('.pizzaInfo--qtmais').addEventListener('click', function () {
    if (modalQTD < 20) {
        modalQTD++
        c('.pizzaInfo--qt').innerHTML = modalQTD;  
    }
});

ca('.pizzaInfo--size').forEach(function(size, sizeIndice) {
    size.addEventListener('click', function () {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    })
})





///////////////////////////// Carrinho de Compras /////////////////////////////
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item)=> item.identifier == identifier);
    if (key > -1) {
        cart[key].qt += modalQTD;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQTD
        });
    }
    updateCart();
    closeModal();
});


c('.menu-openner').addEventListener('click', function () {
    if (cart.length > 0) {
        c('aside').style.left = '0vw' 
    }
})
c('.menu-closer').addEventListener('click', function () {
    c('aside').style.left = '100vw'
})

///////////////////////////// ATUALIZAR CARRINHO DE COMPRAS /////////////////////////////
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if (cart[i].qt > 1) {
                    cart[i].qt--
                    
                } else{
                    cart.splice(i , 1);
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++
                updateCart()
            })
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
