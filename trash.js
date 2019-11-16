const Trash = {
	process () {
		const trashElement = document.querySelector('[data-action-delete]')

		trashElement.addEventListener('dragover', Trash.dragover)
		trashElement.addEventListener('drop', Trash.drop)
	},

	dragover (event) {
		//обязательно прописать данную строчку чтобы работал drop()
		event.preventDefault()
	},

	drop () {
		// удаляем либо заметку, либо колонку
		Trash.delete(Note.dragged || Column.dragged)
		Application.save()
	},

	delete (elem) {
		// удаляем элемент разметки
		elem.parentNode.removeChild(elem)
	}
}

