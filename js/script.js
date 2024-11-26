const body = document.body;
const menu = document.getElementById("menu");
const secondMenu = document.getElementById("secondMenu");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCounter = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const dateSpan = document.getElementById("date-span");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const nav = document.querySelectorAll(".nav-item");
const nameSchedulingInput = document.querySelector("#nameScheduling")
const nameScheduling = nameSchedulingInput.value

let cart = [];

// Menu
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll("nav ul li a");

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const allSections = document.querySelectorAll(".page-menu");
        allSections.forEach(function (section) {
          section.classList.add("hidden");
        });

        targetSection.classList.remove("hidden");
      }
    });
  });
});

function mostrarSecao(id) {
  var secoes = document.querySelectorAll(".page-menu");

  secoes.forEach(function (secao) {
    if (secao.id === id) {
      secao.classList.remove("hidden");
    } else {
      secao.classList.add("hidden");
    }
  });
}

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal(); // Atualiza os itens do carrinho no modal
  cartModal.style.display = "flex"; // Exibe o modal
  body.classList.add("body-fixed"); // Bloqueia o scroll no body
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"; // Esconde o modal
    body.classList.remove("body-fixed"); // Libera o scroll no body
  }
});

// Fechar o modal ao clicar o botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"; // Esconde o modal
  body.classList.remove("body-fixed"); // Libera o scroll no body
});

function handleMenuClick(menu) {
  menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
      const name = parentButton.getAttribute("data-name");
      const price = parseFloat(parentButton.getAttribute("data-price"));

      // Busca o <select> que está no mesmo nível do botão
      const sizeSelector = parentButton
        .closest(".flex")
        .querySelector('select[name="size"]');
      const size = sizeSelector ? sizeSelector.value : null;

      console.log(
        `Adicionando ao carrinho: ${name}, Tamanho: ${size}, Preço: €${price}`
      );

      if (!size) {
        alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.");
        return; // Não adiciona ao carrinho se o tamanho não for selecionado
      }

      addToCart(name, price, size);
    }
  });
}

// Adiciona o evento às duas constantes
handleMenuClick(menu);
handleMenuClick(secondMenu);

// Função para adicionar no carrinho
function addToCart(name, price, size) {
  // Verifica se já existe um item com o mesmo nome e tamanho
  const existingItem = cart.find(
    (item) => item.name === name && item.size === size
  );

  if (existingItem) {
    // Se o item já existe, apenas aumenta a quantidade
    existingItem.quantity += 1;
  } else {
    // Caso contrário, adiciona o novo item ao carrinho
    cart.push({
      name,
      price,
      size,
      quantity: 1,
    });
  }

  updateCartModal(); // Atualiza o modal do carrinho
}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>  
          <p>Quantidade: ${item.quantity}</p>
          <p>Tamanho: ${item.size}</p>
          <p class="font-medium mt-2">€${item.price.toFixed(2)}</p>
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
    style: "currency",
    currency: "EUR",
  });

  cartCounter.innerHTML = cart.length; // Atualiza o contador de itens
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    const size = event.target.getAttribute("data-size"); // Captura o tamanho

    removeCartItemCart(name, size);
  }
});

function removeCartItemCart(name, size) {
  const index = cart.findIndex((item) => item.name === name && item.size === size);

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

// Evento de input para o endereço
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener('click', function () {
  // Verifica se o carrinho está vazio
  if (cart.length === 0) return;

  // Verifica se o endereço foi preenchido
  const addressInputValue = document.getElementById("time-scheduling").value;
  if (addressInputValue === '') {
    addressWarn.classList.remove('hidden');
    document.getElementById("time-scheduling").classList.add('border-red-500');
    return;
  }

  // Calcula o total do carrinho
  const calculateCartTotal = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const cartTotalAmount = calculateCartTotal(cart).toFixed(2);

  // Itens do carrinho
  const cartItems = cart.map((item) => {
    return (
      `${item.name}\n Quantidade: (${item.quantity})\n Tamanho: ${item.size} Preço: €${item.price} \n\n`
    );
  }).join('');  

  // Formatar a mensagem final para o WhatsApp incluindo a morada
  const finalMessage =
    `>> NOVA ENCOMENDA << \n` +
    `Data: ${new Date().toLocaleString("pt-PT")}\n\n` +
    `Nome: ${nameScheduling} \n` +
    `Morada: ${addressInputValue}\n\n` +
    cartItems +
    `Total: €${cartTotalAmount}`;

  const message = encodeURIComponent(finalMessage);
  const phone = '+351911777657';

  // Redireciona para o WhatsApp com a mensagem formatada
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');

  // Limpar o carrinho após o pedido ser feito
  cart.length = 0;
  updateCartModal();

  // Mostrar Toastify informando que o pedido foi recebido
  Toastify({
    text: "Seu pedido foi realizado com sucesso! Ele será concluído assim que nossa loja abrir. Obrigado pela compreensão!",
    duration: 5000,
    close: true,
    gravity: "top", // `top` ou `bottom`
    position: "right", // `left`, `center` ou `right`
    stopOnFocus: true, // Evita fechar ao passar o mouse
    style: {
      background: "#4caf50", // Cor verde para sucesso
    },
    onClick: function () { } // Callback ao clicar
  }).showToast();
});




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