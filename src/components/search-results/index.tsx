import { useContext } from 'react'
import { CommandContext, CommandState, Command } from '../../contexts/command-context'
import type { Bookmark } from '../../../types/bookmark'
import BookmarkList from '../bookmark-list'
import css from './index.module.css'

type SearchResultsProps = {
	bookmarks: Bookmark[]
}

function SearchResults({ bookmarks }: SearchResultsProps) {

	const {
		commandSource,
		commandState,
		command,
		commandArgs,
	} = useContext(CommandContext)

	const searching: boolean = (commandState === CommandState.FreeText)
	const listing: boolean = (command === Command.List)
	const editing: boolean = (command === Command.Edit)

	if (!(searching || listing || editing)) {
		return null
	}

	// for listing and editing, the default argument is a tag name
	const hasDefaultArg = commandArgs.some(a => a.type === 'default')
	const showAll = (listing || editing) && !hasDefaultArg
	const showTag = (listing || editing) && hasDefaultArg
	
	const bkmkFilterFn = (bookmark: Bookmark) => {
		if (showAll) {
			return true
		} else if (showTag) {
			return bookmark.tags.includes(commandArgs[0].value)
		} else if (commandState === CommandState.FreeText) {
			const lowerSearch = commandSource.toLowerCase()
			const lowerName = bookmark.name.toLowerCase()
			const lowerLink = bookmark.link.toLowerCase()
			return lowerName.includes(lowerSearch) || lowerLink.includes(lowerSearch)
		} else {
			return false
		}
	}

	const bkmkCompareFn = (a: Bookmark, b: Bookmark) => {
		const normalizedAName = a.name.toLowerCase();
		const normalizedBName = b.name.toLowerCase();
		if (normalizedAName === normalizedBName) {
			return 0
		}
		if (normalizedAName < normalizedBName) {
			return -1
		}
		return 1
	}

	const filteredBookmarks = bookmarks
		.filter(bkmkFilterFn)
		.sort(bkmkCompareFn)

	const emptyResults = (commandState === CommandState.FreeText && filteredBookmarks.length === 0)
		|| (command === Command.List && commandArgs.length === 1 && filteredBookmarks.length === 0)

	return (
		<div className={css.bookmarkList}>
			{emptyResults && filteredBookmarks.length === 0 && (
				<div className={css.noBookmarks}>
					No bookmarks found
				</div>
			)}
			<BookmarkList 
				bookmarks={filteredBookmarks} 
				filter={(showTag ? commandArgs[0].value : undefined)}
			/>
		</div>
	)

}

export default SearchResults