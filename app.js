function updateButton(id, isInCart) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    const addButton = card.querySelector('.add-to-cart');
    const removeButton = card.querySelector('.remove-from-cart');

    if (addButton && removeButton) {
      if (isInCart) {
        addButton.style.display = 'none';
        removeButton.style.display = 'flex';
      } else {
        addButton.style.display = 'flex';
        removeButton.style.display = 'none';
      }
    }
  }
}

function toggleCart(item) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(i => i.id === item.id);

  if (existingItemIndex > -1) {
    // Удалить из корзины
    cart.splice(existingItemIndex, 1);
    updateButton(item.id, false);
  } else {
    // Добавить в корзину
    cart.push(item);
    updateButton(item.id, true);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}


document.addEventListener('DOMContentLoaded', () => {
  // === Инициализация счетчиков ===
  const cardCounters = new Map();
  let nothing = document.querySelector('.nothing');
  let chosenFoods = document.querySelector('.chosen-foods');
  const button = document.querySelector('.burger-menu')
  const burgerMenu = document.querySelector('.burger-menu');
  const burger = document.getElementById('burger-menu');
  // const morebtn = document.querySelector('.burger-menu'); 


  if (burgerMenu) {
    burgerMenu.addEventListener('click', function() {
      // Добавляем класс с анимацией
      this.classList.add('clicked');
      
      // Убираем класс через 200ms
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 200);
      
      // Здесь можно добавить остальную логику кнопки
      // например: открытие меню и т.д.
    });
  }

  button.addEventListener('click', function(){
    console.log('pressed!')
  })
  class CardCounter {
    constructor(cardElement, id) {
      this.card = cardElement;
      this.id = id;
      this.amount = cardElement.querySelector('.amount');
      this.addBtn = cardElement.querySelector('.add');
      this.removeBtn = cardElement.querySelector('.remove');
      this.value = 0;
      this.name = cardElement.querySelector('h3')?.innerText || `Еда ${id}`;
      this.price = cardElement.querySelector('.price')?.innerText || '';

      this.update();

      if (this.addBtn) {
        this.addBtn.addEventListener('click', () => {
          this.value++;
          this.update();
          this.syncChosen();
        });
      }

      if (this.removeBtn) {
        this.removeBtn.addEventListener('click', () => {
          if (this.value > 0) {
            this.value--;
            this.update();
            this.syncChosen();
          }
        });
      }
    }

    update() {
      if (this.amount) {
        this.amount.innerHTML = `${this.value} шт.`;
        console.log(`${this.id}: ${this.value}`);
      } 
    }

    syncChosen() {
    let existing = chosenFoods.querySelector(`[data-food="${this.id}"]`);

    if (this.value > 0) {
      if (!existing) {
        // создаём новый пункт чека
        let p = document.createElement('p');
        p.setAttribute('data-food', this.id);
        p.innerHTML = `${this.name} ${this.price} — <span class="qty">${this.value}</span> шт. </br>`;
        chosenFoods.appendChild(p);
      } else {
        // обновляем количество
        existing.querySelector('.qty').innerText = this.value;
      }
    } else {
        // если value = 0, удаляем строчку из чека
        if (existing) existing.remove();
    }

    // скрыть/показать "ничего не выбрано"
    if (chosenFoods.children.length > 0) {
      nothing.style.display = 'none';
    } else {
      nothing.style.display = '';
    }}
    

    getValue() {
      return this.value;
    }

    setValue(newValue) {
      this.value = newValue;
      this.update();
    }
  }

  document.querySelectorAll('.card').forEach((card, index) => {
    const uniqueId = `card_${index + 1}`;
    const counter = new CardCounter(card, uniqueId);
    cardCounters.set(uniqueId, counter);
  });
  


  

  // === Аккордеоны ===
  const accordions = document.querySelectorAll('.list-menu');
  accordions.forEach(acc => {
    const header = acc.querySelector('.list-header');
    const content = acc.querySelector('.list-body');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        accordions.forEach(a => {
          const c = a.querySelector('.list-body');
          const h = a.querySelector('.list-header');
          if (c && h) {
            c.style.maxHeight = null;
            c.classList.remove('open');
            h.classList.remove('active');
          }
        });

        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.classList.add('open');
          header.classList.add('active');
        }
      });
    }
  });

  

  // === Карусель ===
  const leftBtn = document.querySelector('.carousel-btn.left');
  const rightBtn = document.querySelector('.carousel-btn.right');

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });

    rightBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % cards.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // === Анимация текста ===
  const spans = Array.from(document.querySelectorAll('#meet > span'));
  if (spans.length) {
    const stepSeconds = 0.08;
    let order = 0;

    spans.forEach((el) => {
      if (el.id === 'lSPACE') return;
      el.classList.add('drop-letter');
      el.style.animationDelay = `${(order * stepSeconds).toFixed(2)}s`;
      order++;
    });
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach(item => updateButton(item.id, true));

  // Обработчики для кнопок
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      const id = card.getAttribute('data-id');
      const name = card.querySelector('h3').textContent;
      const priceText = card.querySelector('.price').textContent;
      const price = parseFloat(priceText.match(/\d+/)[0]); // Простой парсинг цены
      const imgSrc = card.querySelector('img').src; // можно сохранить путь к фото

      toggleCart({ id, name, price, imgSrc });
    });
  });

  document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', () => {
      const item = button.closest('.card');
      const id = item.dataset.id;

      toggleCart({ id }); // вызываем ту же функцию, что и на главной
      this.style.display = "none";
      addButton.style.display = "flex"
      });
  });

});





