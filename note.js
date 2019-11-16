class Note {
	constructor (id = null, content = '') {
		const element = this.element = document.createElement('div')
		element.classList.add('note')
		element.setAttribute('draggable', 'true')
		element.textContent = content

		if (id) {
			element.setAttribute('data-note-id', id)
		}
		else {
			element.setAttribute('data-note-id', Note.idCounter)
			Note.idCounter++
		}

		// прослушка на заметке dblclick для редактирования и blur для прекращения
		element.addEventListener('dblclick', function (event) {
			element.setAttribute('contenteditable', 'true')
			element.removeAttribute('draggable')
			// ищем колонку по родительским элементам
			element.closest('.column').removeAttribute('draggable')
			element.focus()
		})
		
		element.addEventListener('blur', function (event) {
			element.removeAttribute('contenteditable')
			element.setAttribute('draggable', 'true')
			element.closest('.column').setAttribute('draggable', 'true')
		
			// если при потере фокуса у карточки нет контента, то она удаляется
			if (!element.textContent.trim().length) {
				element.remove()
			}

			// создали заметку - сохранили
			Application.save()
		})
		
		// привязываем this через bind чтобы this ссылался на экземпляр класса, а не на DOM элемент
		element.addEventListener('dragstart', this.dragstart.bind(this)) 
		element.addEventListener('dragend', this.dragend.bind(this)) 
		element.addEventListener('dragenter', this.dragenter.bind(this)) 
		element.addEventListener('dragover', this.dragover.bind(this)) 
		element.addEventListener('dragleave', this.dragleave.bind(this)) 
		element.addEventListener('drop', this.drop.bind(this))

	}

	// начало перетаскивания элемента
	dragstart (event) {
		Note.dragged = this.element
		this.element.classList.add('dragged')

		event.stopPropagation()
	}
	
	// конец перетаскивания элемента
	dragend (event) {
		event.stopPropagation()

		Note.dragged = null
		this.element.classList.remove('dragged')
		
		document
			.querySelectorAll('.note')
			.forEach(x => x.classList.remove('under'))

		// перетащили карточку - сохранили
		Application.save()
	}
	
	// заносим перетаскиваемый элемент над другим элементом
	dragenter (event) {
		// Если перетаскиваем не карточку, 
		// либо если карточку перетаскиваем над той же самой карточкой
		if (!Note.dragged || this.element === Note.dragged) {
			return
		}
		
		this.element.classList.add('under')
	}
	
	dragover (event) {
		event.preventDefault()
		if (!Note.dragged || this.element === Note.dragged) {
			return
		}
		event.stopPropagation()
	}
	
	// выносим перетаскиваемый элемент из другого элемента
	dragleave (event) {
		if (!Note.dragged || this.element === Note.dragged) {
			return
		}
		
		this.element.classList.remove('under')
	}
	
	// отпускаем мышку над этим элементом
	drop (event) {
		if (!Column.dragged) {
			// если бросаем на карточку другую карточку
			event.stopPropagation()
		}
		else { 
			// если бросаем на карточку колонку
			return
		}
		
		if (this.element === Note.dragged) {
			return
		}
		// если переносим в этот же столбец - меняем порядок карточек
		if (this.element.parentElement === Note.dragged.parentElement) {
			// находим все элементы в столбце и превращаем в массив
			const note = Array.from(this.element.parentElement.querySelectorAll('.note'))
			const indexA = note.indexOf(this.element)
			const indexB = note.indexOf(Note.dragged)
		
			// меняем порядок соседних карточек в зависимости от перетаскивания 
			if (indexA < indexB) {
				this.element.parentElement.insertBefore(Note.dragged, this.element)
			}
			else {
				this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling)
			}
		}
		// если другой столбец, то вставляем перед той карточкой, над которой дропнули
		else {
			this.element.parentElement.insertBefore(Note.dragged, this.element)
		}
	}
}

// записываем статические поля
// id для следующих заметок
Note.idCounter = 8
// элемент, который перетаскиваем
Note.dragged = null