import { useState } from 'react'
import css from './index.module.css'

type FormData = {
	name: '',
	url: '',
	tags: string[]
}

interface AddBookmarkFormProps {
	addBookmark: (bookmark: FormData) => void	
}

function AddBookmarkForm({ addBookmark }: AddBookmarkFormProps) {

	const [formData, setFormData] = useState<FormData>({ name: '', url: '', tags: [] })

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

export default AddBookmarkForm