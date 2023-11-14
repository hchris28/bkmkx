import { useState, useContext } from 'react'
import { AppStateContext } from '../../contexts/app-state-context'
import useBookmarks from '../../hooks/use-bookmarks'
import toast from "react-hot-toast";
import type { NewBookmark } from '../../../types/new-bookmark'
import css from './index.module.css'

interface FormData extends NewBookmark{
}

function EditBookmarkForm() {

	const { editFormVisible, executeCommand } = useContext(AppStateContext)
	
	if (!editFormVisible) {
		return null
	}

	const [formData, setFormData] = useState<FormData>({ name: '', url: '', tags: [] })
	const { addBookmark } = useBookmarks()

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
		addBookmark(formData)
		executeCommand('/reset')
		toast.success('Bookmark added!')
	}

	return (
		<form className={css.formContainer} onSubmit={handleSubmit}>
			<input type="text" name="name" onChange={handleInputChange} placeholder="Name" />
			<input type="text" name="url" onChange={handleInputChange} placeholder="URL" />
			<input type="text" name="tags" onChange={handleInputChange} placeholder="Tags (optional)" />
			<button>Add Bookmark</button>
		</form>
	)
}

export default EditBookmarkForm