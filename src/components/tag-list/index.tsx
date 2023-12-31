import { useContext } from 'react'
import { CommandContext, Command } from '../../contexts/command-context'

type TagListProps = {
	tags: string[]
}

function TagList({ tags }: TagListProps) {

	const {
		command: command
	} = useContext(CommandContext)

	if (command !== Command.List) {
		return null
	}

	return (
		<div>
			{tags.map(tag => (
				<span key={tag}>{tag}</span>
			))}
		</div>
	)
}

export default TagList