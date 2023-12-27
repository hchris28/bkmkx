import { createContext, useReducer, ReactNode } from "react"
import { ObjectId } from "mongodb"

interface AppState {
	command: string							// The command bar input
	searchActive: boolean				// Whether the command bar input is a search
	commandActive: boolean			// Whether the command bar input is a command
	commandIsPending: boolean			// Whether the command is pending
	commandIsValid?: boolean		// Whether the last issued command was valid
	editFormVisible: boolean		// Whether the edit form is visible
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
	ShowEditForm,
	Reset,
	ShowAll,
	ShowTag,
	SetEditMode,
	SetCommandIssuedState
}

export const enum EditFormMode {
	Add,
	Edit
}

type Action = {
	type: ActionType,
	payload?: any
}

const initialState: AppState = {
	command: "",
	searchActive: false,
	commandActive: false,
	commandIsPending: false,
	commandIsValid: undefined,
	editFormVisible: false,
	editFormMode: EditFormMode.Add,
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
				searchActive: !payloadIsEmpty && !payloadIsCommand,
				commandActive: payloadIsCommand,
				commandIsPending: payloadIsCommand,
				commandIsValid: undefined
			}
			break

		case ActionType.ShowEditForm:
			newAppState = {
				...state,
				editFormVisible: action.payload.state,
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
				editFormVisible: false
			}
			break

		case ActionType.ShowTag:
			newAppState = {
				...state,
				tagFilter: action.payload,
				showAll: false,
				editMode: false,
				editFormVisible: false
			}
			break

		case ActionType.SetEditMode:
			newAppState = {
				...state,
				editMode: action.payload,
				showAll: action.payload,
				editFormVisible: false
			}
			break

		case ActionType.SetCommandIssuedState:
			newAppState = {
				...state,
				commandIsPending: action.payload.isPending,
				commandIsValid: action.payload.isValid
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
				dispatch({ type: ActionType.ShowEditForm, payload: { state: true, mode: EditFormMode.Add, editFormId: undefined } })
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
					dispatch({ type: ActionType.ShowEditForm, payload: { state: true, mode: EditFormMode.Edit, editFormId: args[0] } })
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