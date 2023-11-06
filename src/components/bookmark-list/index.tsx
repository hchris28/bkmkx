import { useEffect } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import Bookmark from '../bookmark'
import css from './index.module.css'

function BookmarkList() {

	const [bookmarks, setBookmarks] = useSessionStorage('bkmkx', [])

	useEffect(() => {
		if (!bookmarks || bookmarks.length === 0) {
			console.log('fetching bookmarks from server')
			fetch('/api/list')
				.then(response => response.json())
				.then(data => setBookmarks(data))
				.catch(error => console.error('Error:', error))
		}
	}, [])

	return (
		<div className={css.bookmarkList}>
			{bookmarks.map((bookmark: Bookmark) => (
				<Bookmark 
					key={bookmark._id} 
					text={bookmark.name} 
					url={bookmark.link} 
				/>
			))}
		</div>
	)
}

export default BookmarkList