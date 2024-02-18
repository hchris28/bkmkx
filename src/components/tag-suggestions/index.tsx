import { useContext } from 'react'
import { CommandContext, CommandState } from '../../contexts/command-context'
// import css from './index.module.css'
import TagList from "../tag-list"

type TagSuggestionsProps = {
	tags: string[]
}

function TagSuggestions({ tags }: TagSuggestionsProps) {

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
	const pendingCommand = commandSegments[0]
	if (commandSegments.length < 2 || !['/list', '/edit'].includes(pendingCommand)) {
		return null
	}

	const search = commandSegments.slice(1).join(' ')
	const tagFilterFn = (tag: string) => {
		return tag.toLowerCase().includes(search.toLowerCase())
	}

	const filteredTags = tags
		.filter(tagFilterFn)
		.sort()

	const tagClickHandler = (tag: string) => {
		if (tag.indexOf(' ') !== -1) {
			tag = `"${tag}"`
		}
		setCommand(`${pendingCommand} ${tag}`)
		executeCommand(`${pendingCommand} ${tag}`, true)
	}

	return (
		<TagList tags={filteredTags} tagClickHandler={tagClickHandler} />
	)
}

export default TagSuggestions