const getTemplate = (data) => {
  const selectItems = data.map(item => {
    return `
      <li class="select__item" data-type="item" data-id="${item.id}">${item.label}</li>
    `
  })

  return `
    <div class="select__wrap" data-type="backdrop"></div>
    <div class="select__input" data-type="input">
      <span data-type="text">Выберите элемент из списка</span>
      <i class="fas fa-chevron-down" data-type="arrow"></i>
    </div>
    <div class="select__dropdown" data-type="dropdown">      
      <div class="select__search">
        <input type="text" class="search" data-type="search">
      </div>
      <ul class="select__list">
        ${selectItems.join('')}
      </ul>
    </div>  
  `
}

class Select {
  constructor(selector, options) {
    this.elements = document.querySelectorAll(selector);
    this.options = options;
    this.selectedId = 0;

    this.#render()
    this.#setup()
    this.#dropdownOpen()
  }

  #render() {
    const { data } = this.options;
    this.elements.forEach(element => {
      element.classList.add('select');
      element.innerHTML = getTemplate(data);
    })
  }

  #setup() {
    this.elements.forEach(element => {
      this.clickHendler = this.clickHendler.bind(this);
      this.item = element.querySelectorAll('[data-type="item"]');
      this.dropdown = element.querySelector('[data-type="dropdown"]');
      element.addEventListener('click', (event) => {
        this.clickHendler(event, element)
      });
      const closeDropdown = () => {
        this.close()
      }
      let time;
      window.addEventListener('scroll', closeDropdown);
      window.onresize = () => {
        if (time)
          clearTimeout(time);
        time = setTimeout(() => {
          closeDropdown();
        }, 100);
      }
    })
  }

  #search(dropdown) {
    this.searchInput = dropdown.querySelector('[data-type="search"]')
    this.list = dropdown.querySelectorAll('[data-type="item"]');
    const list = this.list;

    this.searchInput.oninput = function () {
      const value = this.value.trim();
      if (value) {
        list.forEach(item => {
          if (item.innerText.search(RegExp(value, "gi")) == -1) {
            item.classList.add('hide');
          }
        })
      } else {
        list.forEach(item => {
          item.classList.remove('hide');
        })
      }
    }
  }

  #dropdownOpen() {
    this.elements.forEach(element => {
      let sizeWindow = window.screen.height;
      let topPosition = element.offsetTop;
      let bottomPosition = sizeWindow - topPosition - 46;

      if (topPosition === 0) {
        this.dropdown.classList.add('select__dropdown_bottom');
      }
      if (bottomPosition < 440) {
        this.dropdown.classList.add('select__dropdown_top');
      }
    })
  }

  clickHendler(event, element) {
    const { type } = event.target.dataset;

    if (type === "input") {
      this.toggle(element);
    } else if (type === "item") {
      const id = event.target.dataset.id
      this.select(id, element);
    } else if (type === "backdrop") {
      this.close()
    }
  }

  get isOpen() {
    this.elements.forEach(element => {
      return element.classList.contains('open');
    })
  }

  get current() {
    return this.options.data.find(item => item.id == this.selectedId)
  }

  select(id, element) {
    this.selectedId = id
    this.text = element.querySelector('[data-type="text"]');
    this.text.textContent = this.current.label
    this.close()
  }

  toggle(element) {
    this.isOpen ? this.close(element) : this.open(element);
  }

  open(element) {
    this.#search(element);
    element.classList.add('open');
    this.arrow = element.querySelector('[data-type="arrow"]');
    this.arrow.classList.remove('fa-chevron-down')
    this.arrow.classList.add('fa-chevron-up')
  }

  close() {
    this.elements.forEach(element => {
      element.classList.remove('open');
      this.arrow = element.querySelector('[data-type="arrow"]');
      this.searchInput = element.querySelector('[data-type="search"]')
      this.arrow.classList.add('fa-chevron-down')
      this.arrow.classList.remove('fa-chevron-up')
      this.searchInput.value = ""
      this.item.forEach(item => {
        item.classList.remove('hide');
      })
    })
  }
}

new Select("#select", {
  data: [
    { "label": "Bawcomville", "id": 0 },
    { "label": "Rushford", "id": 1 },
    { "label": "Bayview", "id": 2 },
    { "label": "Car", "id": 3 },
    { "label": "Sport", "id": 4 },
    { "label": "Picture", "id": 5 },
    { "label": "Images", "id": 6 },
    { "label": "JavaScript", "id": 7 },
    { "label": "Js", "id": 8 },
    { "label": "Html", "id": 9 },
    { "label": "Css", "id": 10 },
    { "label": "Scss", "id": 11 },
  ]
})