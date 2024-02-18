import { useRef } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import useBookmarks from './hooks/use-bookmarks'
import CommandProvider from './contexts/command-context'
import CommandBar from './components/command-bar'
import SearchResults from './components/search-results'
import TagSuggestions from './components/tag-suggestions'
import EditBookmarkForm from './components/edit-bookmark-form'
import { Toaster } from "react-hot-toast";
import css from './App.module.css'

function App() {

	const { bookmarks, fetchBookmarks } = useBookmarks()
	const commandBarRef = useRef<HTMLInputElement>(null)

	const tags : string[] = bookmarks.reduce<string[]>((acc, bookmark) => {
		bookmark.tags.forEach(tag => {
			if (!acc.includes(tag)) {
				acc.push(tag)
			}
		})
		return acc
	}
	, [])

	useEffectOnce(() => {
		commandBarRef.current?.focus()
		fetchBookmarks()
	})

	return (
		<CommandProvider>
			<div className={css.appRoot}>
				<CommandBar ref={commandBarRef} />
				<TagSuggestions tags={tags} />
				<SearchResults bookmarks={bookmarks} />
				<EditBookmarkForm />
			</div>
			<Toaster />
		</CommandProvider>
	)
}

export default App