import { useEffect, useRef } from 'react'
import useBookmarks from './hooks/use-bookmarks'
import AppStateProvider from './contexts/app-state-context'
import CommandBar from './components/command-bar'
import BookmarkList from './components/bookmark-list'
import EditBookmarkForm from './components/edit-bookmark-form'
import toast, { Toaster } from "react-hot-toast";
import css from './App.module.css'

function App() {

	const { bookmarks, fetching } = useBookmarks()
	const commandBarRef = useRef<HTMLInputElement>(null)
	const loadingToastRef = useRef<string>('')

	useEffect(() => {
		if (fetching)
			loadingToastRef.current = toast.loading('Loading bookmarks...')
		else
			toast.dismiss(loadingToastRef.current)
	}, [fetching])

	useEffect(() => {
		commandBarRef.current?.focus()
	})

	return (
		<AppStateProvider>
			<div className={css.appRoot}>
				<CommandBar ref={commandBarRef} />
				<BookmarkList bookmarks={bookmarks} />
				<EditBookmarkForm />
			</div>
			<Toaster />
		</AppStateProvider>
	)
}

export default App