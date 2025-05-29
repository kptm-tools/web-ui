import { defineStore } from 'pinia';
import type { DENY_ACTIONS_TYPES } from 'src/constants/deny-actions.constants';

type DenyActionObject = {
  [key in DENY_ACTIONS_TYPES]?: null;
};

export const denyActionsStore = defineStore('deny-actions', {
  state: () => ({
    denyActions: {} as DenyActionObject
  }),
  actions: {
    setInitialList(denyActionsList: DENY_ACTIONS_TYPES[]) {
      denyActionsList.forEach((value: DENY_ACTIONS_TYPES) => {
        this.denyActions[value] = null;
      });
    }
  },
  getters: {
    isAbleToHandleAction: state => (denyAction: DENY_ACTIONS_TYPES) => {
      return state.denyActions[denyAction] == undefined;
    }
  }
});
