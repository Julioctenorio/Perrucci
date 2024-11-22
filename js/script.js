const menu = document.querySelector(".menu");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCounter = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const dateSpan = document.getElementById("date-span");
const addressInput = document.getElementById("address");
const dateScheduling = document.getElementById("date-scheduling");
const timeScheduling = document.getElementById("time-scheduling");
const addressWarn = document.getElementById("address-warn");
const nav = document.querySelectorAll('.nav-item');

let cart = [];

// Menu
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll('nav ul li a');

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener('click', function (event) {
      event.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const allSections = document.querySelectorAll('.page-menu');
        allSections.forEach(function (section) {
          section.classList.add('hidden');
        });

        targetSection.classList.remove('hidden');
      }
    });
  });
});


function mostrarSecao(id) {
  var secoes = document.querySelectorAll('.page-menu');

  secoes.forEach(function (secao) {
    if (secao.id === id) {
      secao.classList.remove('hidden');
    } else {
      secao.classList.add('hidden');
    }
  });
}


// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal()
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal ao clicar o botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest('.add-to-cart-btn');

  if (parentButton) {
    const name = parentButton.getAttribute('data-name');
    const price = parseFloat(parentButton.getAttribute('data-price'));

    // Busca o <select> que está no mesmo nível do botão
    const sizeSelector = parentButton.closest('.flex').querySelector('select[name="size"]');
    const size = sizeSelector ? sizeSelector.value : null;

    console.log(`Adicionando ao carrinho: ${name}, Tamanho: ${size}, Preço: €${price}`);

    if (!size) {
      alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
      return; // Não adiciona ao carrinho se o tamanho não for selecionado
    }

    addToCart(name, price, size);
  }
});


// Função para adicionar no carrinho
function addToCart(name, price, size) {
  // Verifica se já existe um item com o mesmo nome e tamanho
  const existingItem = cart.find(item => item.name === name && item.size === size);

  if (existingItem) {
    // Se o item já existe, apenas aumenta a quantidade
    existingItem.quantity += 1;
    navigator.vibrate(200); // Vibração para feedback
  } else {
    // Caso contrário, adiciona o novo item ao carrinho
    cart.push({
      name,
      price,
      size,
      quantity: 1
    });
  }

  updateCartModal(); // Atualiza o modal do carrinho
}


// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>  
          <p>Qtd: ${item.quantity}</p>
          <p>Tamanho: ${item.size}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}" data-size="${item.size}">
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Atualiza o total
  cartTotal.textContent = total.toLocaleString("pt-PT", {
    style: 'currency',
    currency: "EUR"
  });

  cartCounter.innerHTML = cart.length; // Atualiza o contador de itens
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-from-cart-btn')) {
    const name = event.target.getAttribute('data-name');
    const size = event.target.getAttribute('data-size'); // Captura o tamanho

    removeCartItemCart(name, size);
  }
});


function removeCartItemCart(name, size) {
  const index = cart.findIndex(item => item.name === name && item.size === size);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1; // Apenas reduz a quantidade
    } else {
      cart.splice(index, 1); // Remove completamente o item
    }

    updateCartModal();
  }
}

function removeCartItemCart(name, size) {
  const index = cart.findIndex(item => item.name === name && item.size === size);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1; // Apenas reduz a quantidade
    } else {
      cart.splice(index, 1); // Remove completamente o item
    }

    updateCartModal();
  }
}

addressInput.addEventListener('input', function (event) {
  let inputValue = event.target.value;

  if (inputValue !== '') {
    addressInput.classList.remove('border-red-500')
    addressWarn.classList.add('hidden')
  }
})


// Finalizar pedido
checkoutBtn.addEventListener('click', function () {

  const isOpen = checkIsOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, as maquinas estão descansando neste momento!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
      onClick: function () { } // Callback after click
    }).showToast();

    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === '') {
    addressWarn.classList.remove('hidden')
    addressInput.classList.add('border-red-500')
    return
  }


  const dateInput = document.querySelector('input[type="date"]');
  const timeInput = document.querySelector('input[type="time"]');
  const date = dateInput.value;
  const time = timeInput.value;

  // Função para formatar a data
  function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // Obter a data atual no formato yyyy-mm-dd
  const today = new Date().toISOString().split('T')[0];

  // Verificar se a data selecionada é anterior à data atual
  if (date < today) {
    alert("Não é possível selecionar uma data anterior à atual.");
    return;
  }

// Função para calcular o total do carrinho
const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calcula o total do carrinho
const cartTotal = calculateCartTotal(cart).toFixed(2);

// Construir a mensagem dos itens do carrinho
const cartItems = cart.map((item) => {
  return (
    `${item.name}\n Quantidade: (${item.quantity})\n Tamanho: ${item.size} Preço: R$${item.price} \n\n`
  );
}).join('');

  // Mensagem completa
  const finalMessage =
    `>> NOVO AGENDAMENTO << \n` +
    ` Data: ${date}\n Hora: (${time})\n\n` +
    cartItems +
    `Total: R$${cartTotal}`;

  const message = encodeURIComponent(finalMessage);
  const phone = '+351911777657'

  window.open(`https://wa.me/${phone}?text=${message}`, '_blank')

  cart.length = 0;
  updateCartModal();
})


// Verificar a hora e manipular o card horario
function checkIsOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 10 && hora < 22;
}


const spanItem = document.getElementById('date-span')
const isOpen = checkIsOpen()

if (isOpen) {
  spanItem.classList.remove('border-red-500');
  spanItem.classList.remove('text-red-500');
  spanItem.classList.add('border-green-500');
  spanItem.classList.add('text-green-500');
} else {
  spanItem.classList.remove('border-green-600');
  spanItem.classList.remove('text-green-600');
  spanItem.classList.add('border-red-500');
  spanItem.classList.add('text-red-500');
}