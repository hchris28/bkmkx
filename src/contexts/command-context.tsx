import { createContext, useReducer, ReactNode } from "react"

export const enum Command {
	None,
	Reset,
	List,
	Add,
	Edit,
}

export const enum CommandState {
	Empty,
	FreeText,
	CommandPending,
	CommandValid,
	CommandInvalid
}

export interface CommandArg {
	value: string[]
	type: 'default' | 'option',
	switch?: string
}

interface CommandContextState {
	commandSource: string				// The source input string
	commandState: CommandState	// The state of the input
	command: Command						// The active command
	commandArgs: CommandArg[]		// The arguments of the active command
	setCommand: (cmd: string) => void					// Sets the command bar input
	executeCommand: (cmd: string, log?: boolean) => boolean	// Executes a command
	commandHistory: string[]		// The history of commands issued with log = true 
}

interface CommandProviderProps {
	children: ReactNode;
}

const enum ActionType {
	SetCommandSource,
	SetCommand,
	SetCommandInvalid,
	Reset,
}

type Action = {
	type: ActionType,
	payload?: any
}

const initialState: CommandContextState = {
	commandSource: "",
	commandState: CommandState.Empty,
	command: Command.None,
	commandArgs: [],
	setCommand: () => { },
	executeCommand: (cmd: string): boolean => { console.log(cmd); return true },
	commandHistory: []
}

const reducer = (state: CommandContextState, action: Action): CommandContextState => {
	let newAppState: CommandContextState
	switch (action.type) {

		case ActionType.SetCommandSource:
			const payloadIsCommand = action.payload.startsWith("/")
			const payloadIsEmpty = action.payload === ""
			newAppState = {
				...state,
				commandSource: action.payload,
				commandState: payloadIsEmpty
					? CommandState.Empty
					: payloadIsCommand
						? CommandState.CommandPending
						: CommandState.FreeText,
					command: Command.None,
					commandArgs: [],
			}
			break

		case ActionType.SetCommand:
			newAppState = {
				...state,
				command: action.payload.command,
				commandArgs: action.payload.args,
				commandState: CommandState.CommandValid,
				commandHistory : action.payload.log 
					? [...state.commandHistory, state.commandSource] 
					: state.commandHistory
			}
			break

		case ActionType.SetCommandInvalid:
			newAppState = {
				...state,
				commandState: CommandState.CommandInvalid,
				command: Command.None,
				commandArgs: [],
			}
			break

		case ActionType.Reset:
			newAppState = { ...state, ...initialState }
			break

		default:
			newAppState = { ...state }
	}

	return newAppState
}

export const CommandContext = createContext<CommandContextState>(initialState);

const CommandProvider = ({ children }: CommandProviderProps) => {

	const [state, dispatch] = useReducer(reducer, initialState)

	const setCommand = (cmd: string) => {
		dispatch({ type: ActionType.SetCommandSource, payload: cmd })
	}

	const executeCommand = (cmd: string, log: boolean = false): boolean => {

		const cmdSegments = cmd.split(" ")
		cmd = cmdSegments.shift() ?? ""

		let args: CommandArg[] = []
		if (cmdSegments.length > 0) {
			// we need re-join the args with spaces, but not the spaces inside quotes
			// NOTE: is there a better way to do this that doesn't require a regex and re-join?
			const argsRegex = /"[^"]+"|[^\s]+/g
			const argsSegments = cmdSegments.join(" ").match(argsRegex) ?? []

			let inOption = false
			for (let i = 0; i < argsSegments.length; i++) {
				const segVal = argsSegments[i].replace(/"(.+)"/, "$1") // remove quotes
				const segIsSwitch = segVal.startsWith("-")

				if (!segIsSwitch && !inOption) {
					// if it's not a switch and we're not in an option, it's a new default arg
					args.push({ value: [segVal], type: 'default' })
				} else if (segIsSwitch) {
					// if it's a switch, we need to start a new option
					args.push({ value: [], type: 'option', switch: segVal.substring(1) })
					inOption = true
				} else {
					// if it's not a switch and we're in an option, it's a value for the current option
					args[args.length - 1].value.push(segVal)
				}
			}
		}

		let commandIsValid = true

		switch (cmd) {
			case "/add":
				dispatch({ type: ActionType.SetCommand, payload: { command: Command.Add, args: [], log } })
				break
			case "/reset":
				dispatch({ type: ActionType.Reset })
				break
			case "/list":
				if (args.length === 0) {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.List, args: [], log } })
				} else {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.List, args, log } })
				}
				break
			case "/edit":
				if (args.length === 0) {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.Edit, args: [], log } })
				} else {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.Edit, args, log } })
				}
				break
			default:
				dispatch({ type: ActionType.SetCommandInvalid })
				commandIsValid = false
		}

		return commandIsValid;
	}

	return (
		<CommandContext.Provider value={{
			...state,
			setCommand,
			executeCommand
		}}>
			{children}
		</CommandContext.Provider>
	);
};

export default CommandProvider