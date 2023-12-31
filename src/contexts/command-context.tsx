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

interface CommandContextState {
	commandSource: string				// The source input string
	commandState: CommandState	// The state of the input
	command: Command						// The active command
	commandArgs: string[]				// The arguments of the active command
	setCommand: (cmd: string) => void					// Sets the command bar input
	executeCommand: (cmd: string) => boolean	// Executes a command
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

	const executeCommand = (cmd: string): boolean => {

		const cmdSegments = cmd.split(" ")
		cmd = cmdSegments.shift() ?? ""

		let args: string[] = []
		if (cmdSegments.length > 0) {
			const argsRegex = /"[^"]+"|[^\s]+/g
			args = cmdSegments.join(" ").match(argsRegex)?.map(e => e.replace(/"(.+)"/, "$1")) ?? []
		}

		let commandIsValid = true

		switch (cmd) {
			case "/add":
				dispatch({ type: ActionType.SetCommand, payload: { command: Command.Add, args: [] } })
				break
			case "/reset":
				dispatch({ type: ActionType.Reset })
				break
			case "/list":
				if (args.length === 0) {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.List, args: [] } })
				} else {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.List, args } })
				}
				break
			case "/edit":
				if (args.length === 0) {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.Edit, args: [] } })
				} else {
					dispatch({ type: ActionType.SetCommand, payload: { command: Command.Edit, args } })
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