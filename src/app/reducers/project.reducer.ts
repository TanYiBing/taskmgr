import * as projectActions from '../actions/project.action';
import { Project } from '../domain';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<Project> {
  // additional entities state properties
  selectedId: string | null;
}

export function sortByName(a: Project, b: Project): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<Project> = createEntityAdapter<Project>(({
  selectId: (project: Project) => <string>project.id,
  sortComparer: sortByName,
}));

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedId: null,
});

export function reducer(state: State = initialState, action: projectActions.ProjectActions): State {
  switch (action.type) {
    case projectActions.ProjectActionTypes.ADD_SUCCESS: {
      // return adapter.addOne(action.payload, state);
      return { ...adapter.addOne(action.payload, state), selectedId: null };
    }

    case projectActions.ProjectActionTypes.DELETE_SUCCESS: {
      return { ...adapter.removeOne(action.payload.id, state), selectedId: null };
    }

    case projectActions.ProjectActionTypes.INVITE_SUCCESS:
    case projectActions.ProjectActionTypes.UPDATE_SUCCESS: {
      return { ...adapter.updateOne({ id: <string>action.payload.id, changes: action.payload }, state), selectedId: null };
    }

    case projectActions.ProjectActionTypes.LOAD_SUCCESS: {
      return { ...adapter.addMany(action.payload, state), selectedId: null };
    }

    case projectActions.ProjectActionTypes.SELECT_PROJECT: {
      return { ...state, selectedId: <string>action.payload.id };
    }

    // case projectActions.ProjectActionTypes.ADD_FAIL: {
    // }
    // case projectActions.ProjectActionTypes.DELETE_FAIL: {
    // }
    // case projectActions.ProjectActionTypes.UPDATE_FAIL: {
    // }
    // case projectActions.ProjectActionTypes.LOAD_FAIL: {
    // }
    // case projectActions.ProjectActionTypes.INVITE_FAIL: {
    // }
    // case projectActions.ProjectActionTypes.SELECT_PROJECT: {
    //   return { ...state, selectedId: <string>action.payload.id };
    // }

    default: {
      return state;
    }
  }
}

export const getSelectedId = (state: State) => state.selectedId;
