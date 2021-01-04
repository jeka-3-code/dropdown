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
    this.element = document.querySelector(selector);
    this.options = options;
    this.selectedId = 0;

    this.#render()
    this.#setup()
    this.#search()
    this.#dropdownOpen()
  }

  #render() {
    const {data} = this.options
    this.element.classList.add('select')
    this.element.innerHTML = getTemplate(data);
  }

  #setup() {
    this.clickHendler = this.clickHendler.bind(this);
    this.element.addEventListener('click', this.clickHendler)
    this.arrow = this.element.querySelector('[data-type="arrow"]')
    this.text = this.element.querySelector('[data-type="text"]')
    this.item = this.element.querySelectorAll('[data-type="item"]')
    this.dropdown = this.element.querySelector('[data-type="dropdown"]')
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
  }  

  #search() {
    this.searchInput = this.element.querySelector('[data-type="search"]')    
    const list = this.item;

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
    let sizeWindow = window.screen.height;
    let topPosition = this.element.offsetTop;
    let bottomPosition = sizeWindow - topPosition - 46;

    if (topPosition === 0) {
      this.dropdown.classList.add('select__dropdown_bottom');
    } 

    if (bottomPosition < 440) {
      this.dropdown.classList.add('select__dropdown_top');
    } 

  }

  clickHendler(event) {
    const {type} = event.target.dataset;
    
    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      const id = event.target.dataset.id
      this.select(id);
    } else if (type === "backdrop") {
      this.close()
    }
  }

  get isOpen() {
    return this.element.classList.contains('open');
  }

  get current() {
    return this.options.data.find(item => item.id == this.selectedId)
  }

  select(id) {
    this.selectedId = id
    this.text.textContent = this.current.label
    this.close()
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.element.classList.add('open');
    this.arrow.classList.remove('fa-chevron-down')
    this.arrow.classList.add('fa-chevron-up')
  }

  close() {
    this.element.classList.remove('open');
    this.arrow.classList.add('fa-chevron-down')
    this.arrow.classList.remove('fa-chevron-up')
    this.searchInput.value = ""
    this.item.forEach(item => {
      item.classList.remove('hide');
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
