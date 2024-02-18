import { useState, useContext, useEffect } from 'react'
import { CommandContext, Command, CommandArg } from '../../contexts/command-context'
import { ObjectId } from "mongodb"
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

const getEditObjectId = (args: CommandArg[]) : ObjectId => {
	const idArg = args.find(a => a.switch === 'i')

	//return new ObjectId(idArg?.value[0]) // this should work?
	return idArg?.value[0] as unknown as ObjectId
}

function EditBookmarkForm() {

	const { command, commandArgs, executeCommand, commandHistory } = useContext(CommandContext)
	const [formData, setFormData] = useState<FormData>(emptyFormData)
	const { bookmarks, addBookmark, updateBookmark } = useBookmarks()

	useEffect(() => {
		if (command === Command.Add) {
			setFormData(emptyFormData)
		} else if (command === Command.Edit && commandArgs.length === 1) {
			const bookmark = bookmarks.find(b => b._id === getEditObjectId(commandArgs))
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
	}, [command, commandArgs, bookmarks])

	const showForm = command === Command.Add || (command === Command.Edit && commandArgs.some(a => a.switch === 'i'))
	if (!showForm) {
		return null
	}

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
		if (command === Command.Add) {
			addBookmark({
				name: formData.name,
				link: formData.link,
				tags: formData.tags,
			})
			executeCommand('/reset')
			setFormData(emptyFormData)
			toast.success('Bookmark added!')
		} else if (command === Command.Edit) {
			updateBookmark({
				_id: getEditObjectId(commandArgs),
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
		if (command === Command.Add) {
			executeCommand('/reset')
		} else if (command === Command.Edit) {
			if (commandHistory.length > 0) {
				const lastCommand = commandHistory[commandHistory.length - 1]
				console.log('lastCommand', lastCommand)
				executeCommand(lastCommand)
			} else {
				// this should never happen, but just in case...
				console.error('No command history found')
				executeCommand('/edit')
			}
		}
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
				<button>{command === Command.Add ? "Add" : "Save" } Bookmark</button>
				<button type="button" onClick={handleCancel}>Cancel</button>
			</div>
		</form>
	)
}

export default EditBookmarkForm