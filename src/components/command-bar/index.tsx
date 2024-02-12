import React, { useContext } from 'react'
import { CommandContext, CommandState } from '../../contexts/command-context'
import css from './index.module.css'

function CommandBar({ }, ref: React.Ref<HTMLInputElement>) {

	const { commandSource, commandState, executeCommand, setCommand } = useContext(CommandContext)

	const handleCommandBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommand(e.target.value)
		if (e.target.value === '') {
			executeCommand('/reset')
		}
	}

	const handleCommandBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'Enter':
				if (commandState === CommandState.CommandPending) {
					executeCommand(commandSource, true)
				}
				break
			case 'Escape':
				executeCommand('/reset')
				break
		}
	}

	return (
		<div className={css.commandBar}>
			<input type="text" value={commandSource} onChange={handleCommandBarChange} onKeyDown={handleCommandBarKeyDown} ref={ref} />
			{commandState === CommandState.CommandInvalid && <div className={css.commandBarError}>Invalid command</div>}
		</div>
	)
}

export default React.forwardRef<HTMLInputElement/*, CommandBarProps*/>(CommandBar)