import { createContext, useReducer, ReactNode } from "react"
import { ObjectId } from "mongodb"

export const enum CommandState {
	Empty,
	Searching,
	CommandPending,
	CommandValid,
	CommandInvalid
}

interface AppState {
	command: string							// The command bar input
	commandState: CommandState	// The state of the command bar input
	editFormMode: EditFormMode, // Whether the edit form is in add or edit mode
	editFormId?: ObjectId,			// The id of the item being edited
	tagFilter?: string,				  // The tag being filtered	
	showAll: boolean					  // Whether all items should be shown
	editMode: boolean						// Whether the edit mode is active
	setCommand: (cmd: string) => void					// Sets the command bar input
	executeCommand: (cmd: string) => boolean	// Executes a command
}

interface AppStateProviderProps {
	children: ReactNode;
}

const enum ActionType {
	SetCommand,
	SetEditFormMode,
	Reset,
	ShowAll,
	ShowTag,
	SetEditMode,
	SetCommandIssuedState
}

export const enum EditFormMode {
	Inactive,
	Add,
	Edit
}

type Action = {
	type: ActionType,
	payload?: any
}

const initialState: AppState = {
	command: "",
	commandState: CommandState.Empty,
	editFormMode: EditFormMode.Inactive,
	editFormId: undefined,
	tagFilter: undefined,
	showAll: false,
	editMode: false,
	setCommand: () => { },
	executeCommand: (cmd: string): boolean => { console.log(cmd); return true },
}

const reducer = (state: AppState, action: Action): AppState => {
	let newAppState: AppState
	switch (action.type) {
		case ActionType.SetCommand:
			const payloadIsCommand = action.payload.startsWith("/")
			const payloadIsEmpty = action.payload === ""
			newAppState = {
				...state,
				command: action.payload,
				commandState: payloadIsEmpty
					? CommandState.Empty
					: payloadIsCommand
						? CommandState.CommandPending
						: CommandState.Searching,
			}
			break

		case ActionType.SetEditFormMode:
			newAppState = {
				...state,
				editFormMode: action.payload.mode,
				editFormId: action.payload.editFormId,
				editMode: false,
				showAll: false
			}
			break

		case ActionType.Reset:
			newAppState = { ...state, ...initialState }
			break

		case ActionType.ShowAll:
			newAppState = {
				...state,
				tagFilter: undefined,
				showAll: true,
				editMode: false,
				editFormMode: EditFormMode.Inactive,
			}
			break

		case ActionType.ShowTag:
			newAppState = {
				...state,
				tagFilter: action.payload,
				showAll: false,
				editMode: false,
				editFormMode: EditFormMode.Inactive,
			}
			break

		case ActionType.SetEditMode:
			newAppState = {
				...state,
				editMode: action.payload,
				showAll: action.payload,
				editFormMode: EditFormMode.Inactive,
			}
			break

		case ActionType.SetCommandIssuedState:
			newAppState = {
				...state,
				commandState: action.payload.isPending
					? CommandState.CommandPending
					: action.payload.isValid
						? CommandState.CommandValid
						: CommandState.CommandInvalid,
			}
			break

		default:
			newAppState = { ...state }
	}

	return newAppState
}

export const AppStateContext = createContext<AppState>(initialState);

const AppStateProvider = ({ children }: AppStateProviderProps) => {

	const [state, dispatch] = useReducer(reducer, initialState)

	const setCommand = (cmd: string) => {
		dispatch({ type: ActionType.SetCommand, payload: cmd })
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
				dispatch({ type: ActionType.SetEditFormMode, payload: { state: true, mode: EditFormMode.Add, editFormId: undefined } })
				break
			case "/reset":
				dispatch({ type: ActionType.Reset })
				break
			case "/list":
				if (args.length === 0) {
					dispatch({ type: ActionType.ShowAll })
				} else {
					dispatch({ type: ActionType.ShowTag, payload: args[0] })
				}
				break
			case "/edit":
				if (args.length === 0) {
					dispatch({ type: ActionType.SetEditMode, payload: true })
				} else {
					dispatch({ type: ActionType.SetEditFormMode, payload: { state: true, mode: EditFormMode.Edit, editFormId: args[0] } })
				}
				break
			default:
				commandIsValid = false
		}

		dispatch({ type: ActionType.SetCommandIssuedState, payload: { isPending: false, isValid: commandIsValid } })

		return commandIsValid;
	}

	return (
		<AppStateContext.Provider value={{
			...state,
			setCommand,
			executeCommand
		}}>
			{children}
		</AppStateContext.Provider>
	);
};

export default AppStateProvider