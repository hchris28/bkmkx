import React, { useEffect, useRef } from 'react'
import useBookmarks from './hooks/use-bookmarks'
import { useUIState } from './hooks/use-ui-state'
import CommandBar from './components/command-bar'
import BookmarkList from './components/bookmark-list'
import AddBookmarkForm from './components/add-bookmark-form'
import type { Bookmark } from '../types/bookmark'
import css from './App.module.css'

function App() {

	const { bookmarks, addBookmark, fetching } = useBookmarks()
	const uiState = useUIState()
	const commandBarRef = useRef<HTMLInputElement>(null)

	const handleCommandBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		uiState.setCommand(e.target.value)
		if (e.target.value === '') {
			uiState.executeCommand('/reset')
		}
	}

	const handleCommandBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			uiState.executeCommand(uiState.command)
		}
		if (e.key === 'Escape') {
			uiState.executeCommand('/reset')
		}
	}

	const filteredBookmarks = bookmarks.filter((bookmark: Bookmark) => {
		if (uiState.showAll) {
			return true
		}
		if (!uiState.command) {
			return false
		}
		const lowerSearch = uiState.command.toLowerCase()
		const lowerName = bookmark.name.toLowerCase()
		const lowerLink = bookmark.link.toLowerCase()
		
		return lowerName.includes(lowerSearch) || lowerLink.includes(lowerSearch)
	})

	useEffect(() => {
		if (filteredBookmarks.length === 1) {
			window.open(filteredBookmarks[0].link, '_blank')
			uiState.executeCommand('/reset')
		}
	}, [filteredBookmarks])

	useEffect(() => { 
		commandBarRef.current?.focus()
	})

  return (
    <div className={css.appRoot}>
			<CommandBar command={uiState.command} onChange={handleCommandBarChange} onKeyDown={handleCommandBarKeyDown} ref={commandBarRef} />
      {(uiState.searchActive || uiState.showAll) && <BookmarkList bookmarks={filteredBookmarks} />}
      {uiState.addFormVisible && <AddBookmarkForm addBookmark={addBookmark} />}
			{fetching && 'Working...'}
    </div>
  )
}

export default App
