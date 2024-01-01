import { useContext } from 'react'
import { CommandContext, CommandState } from '../../contexts/command-context'
import css from './index.module.css'

type TagListProps = {
	tags: string[]
}

function TagList({ tags }: TagListProps) {

	const {
		commandSource,
		commandState,
		setCommand,
		executeCommand,
	} = useContext(CommandContext)

	if (commandState !== CommandState.CommandPending) {
		return null
	}

	const commandSegments: string[] = commandSource.split(' ')
	if (commandSegments.length < 2 || commandSegments[0] !== '/list') {
		return null
	}

	const search = commandSegments.slice(1).join(' ')

	const tagFilterFn = (tag: string) => {
		return tag.toLowerCase().includes(search.toLowerCase())
	}

	const filteredTags = tags
		.filter(tagFilterFn)
		.sort()
	

	const execListTagCommand = (tag: string) => {
		if (tag.indexOf(' ') !== -1) {
			tag = `"${tag}"`
		}
		setCommand(`/list ${tag}`)
		executeCommand(`/list ${tag}`)
	}

	return (
		<>
			<div className={css.tagList}>
				{filteredTags.map(tag => (
					<button
						key={tag}
						className={css.tag}
						onClick={() => execListTagCommand(tag)}
					>{tag}</button>
				))}
			</div>
		</>
	)
}

export default TagList