import useBookmarks from './hooks/use-bookmarks'
import BookmarkList from './components/bookmark-list'
import AddBookmarkForm from './components/add-bookmark-form'
import './App.css'

function App() {

	const { bookmarks, addBookmark, fetching } = useBookmarks()

  return (
    <div>
      <BookmarkList bookmarks={bookmarks} />
      <br /><br />
      <AddBookmarkForm addBookmark={addBookmark} />
			{fetching && 'Loading...'}
    </div>
  )
}

export default App
