import css from './index.module.css'

type TagListProps = {
	tags: string[],
	tagClickHandler: (tag: string) => void
}

function TagList({ tags, tagClickHandler }: TagListProps) {

	return (
		<>
			<div className={css.tagList}>
				{tags.map(tag => (
					<button
						key={tag}
						className={css.tag}
						onClick={() => tagClickHandler(tag)}
					>{tag}</button>
				))}
				{tags.length === 0 && (
					<div className={css.noResults}>No matching tags!</div>
				)}
			</div>
		</>
	)
}

export default TagList