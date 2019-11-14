// id для следующих заметки и клонки
let noteIdCounter = 9
let columnIdCounter = 4
// элемент, который перетаскиваем
let draggedNote = null

document
	.querySelectorAll('.column')
	.forEach(columnProcess)

document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function (event) {
		// создаём элемент колонку
		const columnElement = document.createElement('div')
		columnElement.classList.add('column')
		columnElement.setAttribute('draggable', 'true')
		columnElement.setAttribute('data-columb-id', columnIdCounter)

		columnElement.innerHTML = 
`<p class="column-header">В плане</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`

		columnIdCounter++

		document.querySelector('.columns').append(columnElement)

		columnProcess(columnElement)
	})

document
	.querySelectorAll('.note')
	.forEach(noteProcess)

// прослушка кнопки добавления карточки
function columnProcess (columnElement) {
	const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

	spanAction_addNote.addEventListener('click', function (event) {
		// создаём элемент заметку
		const noteElement = document.createElement('div')
		noteElement.classList.add('note')
		noteElement.setAttribute('draggable', 'true')
		noteElement.setAttribute('data-note-id', noteIdCounter)

		noteIdCounter++
		columnElement.querySelector('[data-notes]').append(noteElement)

		noteProcess(noteElement)

	})

	// редактирование заголовка столбца
	const headerElement = columnElement.querySelector('.column-header')
	headerElement.addEventListener('dblclick', function (event) {
		headerElement.setAttribute('contenteditable', 'true')
		headerElement.focus()
	})
	headerElement.addEventListener('blur', function (event) {
		headerElement.removeAttribute('contenteditable')
	})
}

// прослушка на заметке dblclick для редактирования и blur для прекращения
function noteProcess (noteElement) {
	noteElement.addEventListener('dblclick', function (event) {
		noteElement.setAttribute('contenteditable', 'true')
		noteElement.focus()
	})

	noteElement.addEventListener('blur', function (event) {
		noteElement.removeAttribute('contenteditable')
	})

	noteElement.addEventListener('dragstart', dragstart_noteHandler) 
	noteElement.addEventListener('dragend', dragend_noteHandler) 
	noteElement.addEventListener('dragenter', dragenter_noteHandler) 
	noteElement.addEventListener('dragover', dragover_noteHandler) 
	noteElement.addEventListener('dragleave', dragleave_noteHandler) 
	noteElement.addEventListener('drop', drop_noteHandler) 
}

// начало перетаскивания элемента
function dragstart_noteHandler (event) {
	// console.log('dragstart')
	draggedNote = this
	this.classList.add('dragged')
}

// конец перетаскивания элемента
function dragend_noteHandler (event) {
	draggedNote = null
	this.classList.remove('dragged')

	document
		.querySelectorAll('.note')
		.forEach(x => x.classList.remove('under'))
}

// заносим перетаскиваемый элемент над другим элементом
function dragenter_noteHandler (event) {
	if (this === draggedNote) {
		return
	}

	this.classList.add('under')
}

function dragover_noteHandler (event) {
	event.preventDefault()
	if (this === draggedNote) {
		return
	}
	event.stopPropagation()
	// console.log(this)
}

// выносим перетаскиваемый элемент из другого элемента
function dragleave_noteHandler (event) {
	if (this === draggedNote) {
		return
	}
	this.classList.remove('under')
}

// отпускаем мышку над этим элементом
function drop_noteHandler (event) {ё
	// event.stopPropagation()
	if (this === draggedNote) {
		return
	}
	// если переносим в этот же столбец - меняем порядок карточек
	if (this.parentElement === draggedNote.parentElement) {

	}
	// если другой столбец, то вставляем перед той карточкой, над которой дропнули
	else {
		this.parentElement.insertBefore(draggedNote, this)
	}
}