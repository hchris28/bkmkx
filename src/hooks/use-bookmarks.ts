import { useEffect, useState } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import type { Bookmark } from '../../types/bookmark'
import type { NewBookmark } from '../../types/new-bookmark'
import { ObjectId } from 'mongodb'

export default function useBookmarks() {

	const [bookmarks, setBookmarks] = useSessionStorage<Bookmark[]>('bkmkx', [])
	const [fetching, setFetching] = useState(false)

	useEffect(() => {
		// IIFE to avoid async useEffect
		(async () => {
			if (!bookmarks || bookmarks.length === 0) {
				await fetchBookmarks()
			}
		})()
	}, [])

	const fetchBookmarks = async () => {
		console.log('fetching bookmarks from server')
		setFetching(true)
		fetch('/api/list')
			.then(response => response.json())
			.then(data => setBookmarks(data))
			.catch(error => console.error('Error:', error))
			.finally(() => setFetching(false))
	}

	const addBookmark = async (data: NewBookmark) => {
		const response = await fetch('/api/add', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		await response.json();
		await fetchBookmarks()
	}

	const editBookmark = async (data: Bookmark) => {
		// TODO: implement
		console.log('editBookmark', data)
	}

	const deleteBookmark = async (_id: ObjectId) => {
		// TODO: implement
		console.log('deleteBookmark', _id)
	}

	return { bookmarks, addBookmark, editBookmark, deleteBookmark, fetching }
}