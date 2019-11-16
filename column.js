class Column {
	constructor (id = null) {
		const element = this.element = document.createElement('div')
		element.classList.add('column')
		element.setAttribute('draggable', 'true')

		if (id) {
			element.setAttribute('data-column-id', id)
		}

		else {
			element.setAttribute('data-column-id', Column.idCounter)
			Column.idCounter++
		}

		element.innerHTML = 
`<p class="column-header">В плане</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`

		// прослушка кнопки добавления карточки
		const spanAction_addNote = element.querySelector('[data-action-addNote]')

		spanAction_addNote.addEventListener('click', function (event) {
			// создаём элемент заметку
			const noteElement = Note.create()
			
			element.querySelector('[data-notes]').append(noteElement)

			// при создании карточки сразу идёт её редактирование
			noteElement.setAttribute('contenteditable', 'true')
			noteElement.focus()
		})

		// Если тащим над пустым местом - снимаем класс UNDER у всех колонок
		// Если тащим над колонкой, то event.stopPropagation() не позволяет
		// документу видеть событие
		document.addEventListener('dragover', Column.hover)

		// редактирование заголовка столбца
		const headerElement = element.querySelector('.column-header')

		headerElement.addEventListener('dblclick', function (event) {
			headerElement.setAttribute('contenteditable', 'true')
			headerElement.focus()
		})

		headerElement.addEventListener('blur', function (event) {
			headerElement.removeAttribute('contenteditable')

			// изменили заголовок - сохранили
			Application.save()
		})

		// Прослушка перетаскивания колонки
		element.addEventListener('dragstart', this.dragstart.bind(this))
		element.addEventListener('dragend', this.dragend.bind(this))

		// Слушаем над чем тащим
		element.addEventListener('dragover', this.dragover.bind(this))

		// Слушаем куда бросаем
		element.addEventListener('drop', this.drop.bind(this))
	}

	dragstart (event) {
		// запоминатем перетаскиваемый элемент
		Column.dragged = this.element
		Column.dragged.classList.add('dragged')

		event.stopPropagation()

		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.removeAttribute('draggable'))
	}

	dragend (event) {
		event.stopPropagation()
		// забываем перетаскиваемый элемент
		Column.dragged.classList.remove('dragged')
		Column.dragged = null
		Column.dropped = null

		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.setAttribute('draggable', 'true'))

		// убираем класс у всех когда бросили колонку
		document
		.querySelectorAll('.column')
		.forEach(columnElement => columnElement.classList.remove('under'))

		// перетащили колонку - сохранили
		Application.save()
	}

	dragover (event) {
		event.stopPropagation()
		// отменяем стандартную обработку при перетаскивании карточки в пустую колонку
		event.preventDefault()

		// Если перетаскиваем колонку над собой
		if (Column.dropped === this.element) {
			if (Column.dropped) {
				Column.dropped.classList.remove('under')
			}
			Column.dropped = null
		}
		
		if (!Column.dragged || Column.dragged === this.element) {
			return
		}
		
		Column.dropped = this.element

		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'))

		this.element.classList.add('under')
	}

	drop () {

		// если бросаем карточку
		if (Note.dragged) {
			return this.element.querySelector('[data-notes]').append(Note.dragged)
		}
		// если бросаем колонку
		else if (Column.dragged) {
			const children = Array.from(document.querySelector('.columns').children)
			const indexA = children.indexOf(this.element)
			const indexB = children.indexOf(Column.dragged) 

			// меняем порядок соседних колонок в зависимости от перетаскивания 
			if (indexA < indexB) {
				document.querySelector('.columns').insertBefore(Column.dragged, this.element)
			}
			else {
				document.querySelector('.columns').insertBefore(Column.dragged, this.element.nextElementSibling)
			}

		}
	}

	hover(event) {
		event.stopPropagation()
		// Если тащим над пустым местом - снимаем класс UNDER у всех колонок
		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'))
	}
}

// статическиек методы
// id для следующих клонок
Column.idCounter = 4

// перетаскиваемая колонка
Column.dragged = null

// колонка, над которой бросили
Column.dropped = null

// const Column = {
// 	// id для следующих клонок
// 	idCounter: 4,

// 	// перетаскиваемая колонка
// 	dragged: null,

// 	// колонка, над которой бросили
// 	dropped: null,

	// прослушка кнопки добавления карточки
	// process (columnElement) {
		// const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

		// spanAction_addNote.addEventListener('click', function (event) {
		// 	// создаём элемент заметку
		// 	const noteElement = Note.create()
			
		// 	columnElement.querySelector('[data-notes]').append(noteElement)

		// 	// при создании карточки сразу идёт её редактирование
		// 	noteElement.setAttribute('contenteditable', 'true')
		// 	noteElement.focus()
		// })

		// // Если тащим над пустым местом - снимаем класс UNDER у всех колонок
		// // Если тащим над колонкой, то event.stopPropagation() не позволяет
		// // документу видеть событие
		// document.addEventListener('dragover', Column.hover)

		// // редактирование заголовка столбца
		// const headerElement = columnElement.querySelector('.column-header')

		// headerElement.addEventListener('dblclick', function (event) {
		// 	headerElement.setAttribute('contenteditable', 'true')
		// 	headerElement.focus()
		// })

		// headerElement.addEventListener('blur', function (event) {
		// 	headerElement.removeAttribute('contenteditable')

		// 	// изменили заголовок - сохранили
		// 	Application.save()
		// })

		// // Прослушка перетаскивания колонки
		// columnElement.addEventListener('dragstart', Column.dragstart)
		// columnElement.addEventListener('dragend', Column.dragend)

		// // Слушаем над чем тащим
		// columnElement.addEventListener('dragover', Column.dragover)

		// // Слушаем куда бросаем
		// columnElement.addEventListener('drop', Column.drop)
	// },

	// создаём элемент колонку
	// create (id = null) {
// 		const columnElement = document.createElement('div')
// 		columnElement.classList.add('column')
// 		columnElement.setAttribute('draggable', 'true')

// 		if (id) {
// 			columnElement.setAttribute('data-column-id', id)
// 		}

// 		else {
// 			columnElement.setAttribute('data-column-id', Column.idCounter)
// 			Column.idCounter++
// 		}

// 		columnElement.innerHTML = 
// `<p class="column-header">В плане</p>
// <div data-notes></div>
// <p class="column-footer">
// 	<span data-action-addNote class="action">+ Добавить карточку</span>
// </p>`
	
// 		Column.process(columnElement)

// 		return columnElement
	// },

	// dragstart (event) {
	// 	// запоминатем перетаскиваемый элемент
	// 	Column.dragged = this
	// 	Column.dragged.classList.add('dragged')

	// 	event.stopPropagation()

	// 	document
	// 		.querySelectorAll('.note')
	// 		.forEach(noteElement => noteElement.removeAttribute('draggable'))
	// },

	// dragend (event) {
	// 	event.stopPropagation()
	// 	// забываем перетаскиваемый элемент
	// 	Column.dragged.classList.remove('dragged')
	// 	Column.dragged = null
	// 	Column.dropped = null

	// 	document
	// 		.querySelectorAll('.note')
	// 		.forEach(noteElement => noteElement.setAttribute('draggable', 'true'))

	// 	// убираем класс у всех когда бросили колонку
	// 	document
	// 	.querySelectorAll('.column')
	// 	.forEach(columnElement => columnElement.classList.remove('under'))

	// 	// перетащили колонку - сохранили
	// 	Application.save()
	// },

	// dragover (event) {
	// 	event.stopPropagation()
	// 	// отменяем стандартную обработку при перетаскивании карточки в пустую колонку
	// 	event.preventDefault()

	// 	// Если перетаскиваем колонку над собой
	// 	if (Column.dropped === this) {
	// 		if (Column.dropped) {
	// 			Column.dropped.classList.remove('under')
	// 		}
	// 		Column.dropped = null
	// 	}
		
	// 	if (!Column.dragged || Column.dragged === this) {
	// 		return
	// 	}
		
	// 	Column.dropped = this

	// 	document
	// 		.querySelectorAll('.column')
	// 		.forEach(columnElement => columnElement.classList.remove('under'))

	// 	this.classList.add('under')
	// },

	// drop () {

	// 	// если бросаем карточку
	// 	if (Note.dragged) {
	// 		return this.querySelector('[data-notes]').append(Note.dragged)
	// 	}
	// 	// если бросаем колонку
	// 	else if (Column.dragged) {
	// 		const children = Array.from(document.querySelector('.columns').children)
	// 		const indexA = children.indexOf(this)
	// 		const indexB = children.indexOf(Column.dragged) 

	// 		// меняем порядок соседних колонок в зависимости от перетаскивания 
	// 		if (indexA < indexB) {
	// 			document.querySelector('.columns').insertBefore(Column.dragged, this)
	// 		}
	// 		else {
	// 			document.querySelector('.columns').insertBefore(Column.dragged, this.nextElementSibling)
	// 		}

	// 	}
	// },

	// hover(event) {
	// 	event.stopPropagation()
	// 	// Если тащим над пустым местом - снимаем класс UNDER у всех колонок
	// 	document
	// 		.querySelectorAll('.column')
	// 		.forEach(columnElement => columnElement.classList.remove('under'))
	// }
	
// }