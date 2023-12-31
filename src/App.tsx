import { useRef } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import useBookmarks from './hooks/use-bookmarks'
import CommandProvider from './contexts/command-context'
import CommandBar from './components/command-bar'
import BookmarkList from './components/bookmark-list'
import EditBookmarkForm from './components/edit-bookmark-form'
import { Toaster } from "react-hot-toast";
import css from './App.module.css'

function App() {

	const { bookmarks, fetchBookmarks } = useBookmarks()
	const commandBarRef = useRef<HTMLInputElement>(null)

	useEffectOnce(() => {
		commandBarRef.current?.focus()
		fetchBookmarks()
	})

	return (
		<CommandProvider>
			<div className={css.appRoot}>
				<CommandBar ref={commandBarRef} />
				<BookmarkList bookmarks={bookmarks} />
				<EditBookmarkForm />
			</div>
			<Toaster />
		</CommandProvider>
	)
}

export default App