import { createContext, useReducer, ReactNode } from "react"
import { ObjectId } from "mongodb"

interface AppState {
	command: string
	searchActive: boolean
	commandActive: boolean
	editFormVisible: boolean
	editFormMode: EditFormMode,
	editFormId?: ObjectId,
	showAll: boolean
	editMode: boolean
	setCommand: (cmd: string) => void
	executeCommand: (cmd: string) => void
}

interface AppStateProviderProps {
	children: ReactNode;
}

const enum ActionType {
	SetCommand,
	ShowEditForm,
	Reset,
	ShowAll,
	SetEditMode
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
	editFormVisible: false,
	editFormMode: EditFormMode.Add,
	editFormId: undefined,
	showAll: false,
	editMode: false,
	setCommand: () => { },
	executeCommand: (cmd: string) => { console.log(cmd) },
}

const reducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case ActionType.SetCommand:
			return {
				...state,
				command: action.payload,
				searchActive: action.payload !== "" && !action.payload.startsWith("/"),
				commandActive: action.payload.startsWith("/"),
			}

		case ActionType.ShowEditForm:
			return { 
				...state, 
				editFormVisible: action.payload.state, 
				editFormMode: action.payload.mode, 
				editFormId: action.payload.editFormId,
				editMode: false,
				showAll: false 
			}

		case ActionType.Reset:
			return { ...state, ...initialState }

		case ActionType.ShowAll:
			return { ...state, showAll: true, editMode: false, editFormVisible: false }

		case ActionType.SetEditMode:
			return { 
				...state, 
				editMode: action.payload, 
				showAll: action.payload, 
				editFormVisible: false 
			}

		default:
			return state
	}
}

export const AppStateContext = createContext<AppState>(initialState);

const AppStateProvider = ({ children }: AppStateProviderProps) => {

	const [state, dispatch] = useReducer(reducer,initialState)

	const setCommand = (cmd: string) => {
		dispatch({ type: ActionType.SetCommand, payload: cmd })
	}

	const executeCommand = (cmd: string) => {

		const cmdSegments = cmd.split(" ")
		cmd = cmdSegments[0]
		const args = cmdSegments.slice(1)

		switch (cmd) {
			case "/add":
				dispatch({ type: ActionType.ShowEditForm, payload: { state: true, mode: EditFormMode.Add, editFormId: undefined } })
				break
			case "/reset":
				dispatch({ type: ActionType.Reset })
				break
			case "/list":
				dispatch({ type: ActionType.ShowAll })
				break
			case "/edit":
				if (args.length === 0) {
					dispatch({ type: ActionType.SetEditMode, payload: true })
				} else {
					dispatch({ type: ActionType.ShowEditForm, payload: { state: true, mode: EditFormMode.Edit, editFormId: args[0] } })
				}
				break
			default:
				break
		}
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