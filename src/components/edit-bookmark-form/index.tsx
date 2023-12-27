import { useState, useContext, useEffect } from 'react'
import { AppStateContext, EditFormMode } from '../../contexts/app-state-context'
import useBookmarks from '../../hooks/use-bookmarks'
import toast from "react-hot-toast";
import InlineErrorMessage from '../inline-error-message';
import css from './index.module.css'

interface FormData {
	name: string
	link: string
	tags: string[]
}

const emptyFormData: FormData = {
	name: '',
	link: '',
	tags: []
}

function EditBookmarkForm() {

	const { editFormVisible, editFormMode, editFormId, executeCommand } = useContext(AppStateContext)

	const [formData, setFormData] = useState<FormData>(emptyFormData)
	const { bookmarks, addBookmark, updateBookmark } = useBookmarks()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === 'tags') {
			setFormData({
				...formData,
				[name]: value.split(',').map(tag => tag.trim())
			})
		} else {
			setFormData({
				...formData,
				[name]: value
			})
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (editFormMode === EditFormMode.Add) {
			addBookmark({
				name: formData.name,
				link: formData.link,
				tags: formData.tags,
			})
			executeCommand('/reset')
			setFormData(emptyFormData)
			toast.success('Bookmark added!')
		} else if (editFormMode === EditFormMode.Edit) {
			if (editFormId === undefined) {
				throw new Error('editFormId is undefined')
			}
			updateBookmark({ 
				_id: editFormId,
				name: formData.name,
				link: formData.link,
				tags: formData.tags,
			})
			executeCommand('/edit')
			setFormData(emptyFormData)
			toast.success('Bookmark saved!')
		}
	}

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		if (editFormMode === EditFormMode.Add) {
			executeCommand('/reset')
		} else if (editFormMode === EditFormMode.Edit) {
			executeCommand('/edit')
		}
	}

	useEffect(() => {
		if (editFormMode === EditFormMode.Add) {
			setFormData(emptyFormData)
		} else if (editFormMode === EditFormMode.Edit && editFormId) {
			const bookmark = bookmarks.find(b => b._id === editFormId)
			if (bookmark) {
				setFormData({
					name: bookmark.name,
					link: bookmark.link,
					tags: bookmark.tags
				})
			} else {
				setFormData({
					name: 'ERROR: Bookmark not found',
					link: '',
					tags: []
				})
			}
		}
	}, [editFormMode, editFormId])

	if (!editFormVisible) {
		return null
	}

	if (formData.name === 'ERROR: Bookmark not found') {
		return (
			<div className={css.formContainer}>
				<InlineErrorMessage>Bookmark not found</InlineErrorMessage>
			</div>
		)
	}

	return (
		<form className={css.formContainer} onSubmit={handleSubmit}>
			<input type="text" name="name" onChange={handleInputChange} value={formData.name} placeholder="Name" />
			<input type="text" name="link" onChange={handleInputChange} value={formData.link} placeholder="URL" />
			<input type="text" name="tags" onChange={handleInputChange} value={formData.tags.join(',')} placeholder="Tags (optional)" />
			<div className={css.buttonContainer}>
				<button>{editFormMode === EditFormMode.Add ? "Add" : "Save" } Bookmark</button>
				<button type="button" onClick={handleCancel}>Cancel</button>
			</div>
		</form>
	)
}

export default EditBookmarkForm