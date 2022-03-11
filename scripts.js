const Modal = {
    toggle(){
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("supermarket.list:products")) || [] // parse - transform string into array
    },

    set(product) {
        localStorage.setItem("supermarket.list:products", JSON.stringify(product)) //stringify - transform array into string

    }
}

const Calculator = {
    
    totalProduct(quantity, price){
        return quantity*price;
    },

    totalList(){
        let totalList = 0   
        Transaction.all.forEach(item => {
            totalList += (item.quantity*item.price)
        })        
        
        return totalList;
    }
}

const Transaction = {
    all: Storage.get(),

    addProduct(product){
        Transaction.all.push(product)

        App.reload()
    },

    removeProduct(index){
        Transaction.all.splice(index, 1)
        App.reload()
    }
}


const DOM = {
    myListContainer: document.querySelector('#data-table tbody'),

    newHTMLElement(list, index){
        tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLProduct(list, index)
        tr.dataset.index = index
        DOM.myListContainer.appendChild(tr)
    },

    innerHTMLProduct(list, index){

        const totalPrice = Utils.formatCurrency(Calculator.totalProduct(list.quantity, list.price))
        const listPrice = Utils.formatCurrency(list.price)

        const html = `
        <td>${list.product}</td>
        <td>${list.quantity}</td>
        <td>${listPrice}</td>
        <td>${totalPrice}</td>
        <td><img onclick="Transaction.removeProduct(${index})" src="./photos/minus.svg" alt="button remove"></td>
        `
        return html
    },

    updateTotal(){
        const tot = document.getElementById('totalList')
        document.getElementById('totalList').innerHTML = Utils.formatCurrency(Calculator.totalList())
    },

    clearProduct(){
        DOM.myListContainer.innerHTML= ""
    }
}

const Utils = {
   
    formatPrice(value){
        
        return value = Number(value).toFixed(2)
    },

    formatCurrency(value){
        
        value = Number(value)
        value= value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return value
    }
}



const Form = {
    product: document.querySelector('input#product'),
    quantity: document.querySelector('input#quantity'),
    price: document.querySelector('input#price'),

    //get values

    getValues(){
        return {
            product: Form.product.value,
            quantity: Form.quantity.value,
            price: Form.price.value
        }
    },
    // validate 
    validateFields() {
        const { product, quantity, price } = Form.getValues()

        if (product.trim() === "" || quantity.trim() === "" || price.trim() === "") {
            throw new Error('Please, fill in all spaces')
        }
    },

    formatValues(){
        let {product, quantity, price} = Form.getValues()
        price = Utils.formatPrice(price)
        return {product, quantity, price}
    },

    clearFields(){
        Form.product.value = "",
        Form.quantity.value = "",
        Form.price.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            Form.validateFields()
            const product = Form.formatValues()
            Transaction.addProduct(product)
            Form.clearFields()
            Modal.toggle()

           
        } catch(error){
            alert(error.message)
        }
    }

}


const App = {
    init(){
        Transaction.all.forEach((list, index) =>{
            DOM.newHTMLElement(list, index)
        })
        
        DOM.updateTotal()

        Storage.set(Transaction.all)
    },

    reload(){
        DOM.clearProduct()

        App.init()
    }
}

App.init()






