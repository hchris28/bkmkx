import { useState, useRef } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import type { Bookmark } from '../../types/bookmark'
import { ObjectId } from 'mongodb'
import toast from "react-hot-toast";

export default function useBookmarks() {

	const [bookmarks, setBookmarks] = useSessionStorage<Bookmark[]>('bkmkx', [])
	const [fetching, setFetching] = useState(false)
	const loadingToastRef = useRef<string>('')

	const fetchBookmarks = async () => {
		if (loadingToastRef.current) return
		loadingToastRef.current = toast.loading('Loading bookmarks...')
		setFetching(true)
		fetch('/api/list')
			.then(response => response.json())
			.then(data => setBookmarks(data))
			.catch(error => console.error('Error:', error))
			.finally(() => {
				setFetching(false)
				toast.dismiss(loadingToastRef.current)
			})
	}

	const addBookmark = async (data: NewBookmarkData) => {
		const response = await fetch('/api/add', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		await response.json()
		await fetchBookmarks()
	}

	const updateBookmark = async (data: UpdateBookmarkData) => {
		
		const response = await fetch('/api/update', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		await response.json()
		await fetchBookmarks()
		
	}

	const deleteBookmark = async (_id: ObjectId) => {
		const response = await fetch('/api/delete', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ _id })
		});
		await response.json()
		await fetchBookmarks()
	}

	return { bookmarks, fetching, fetchBookmarks, addBookmark, updateBookmark, deleteBookmark }
}

export interface NewBookmarkData {
	name: string,
	link: string,
	tags: string[]
}

export interface UpdateBookmarkData extends NewBookmarkData {
	_id: ObjectId
}