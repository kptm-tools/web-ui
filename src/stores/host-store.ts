import { defineStore } from 'pinia';
import { Host } from 'src/models/hosts.models';

interface HostFilter {
  created_at?: string;
  searchText?: string;
}

export const useHosthStore = defineStore('host', {
  state: () => ({
    originalList: [] as Host[],
    filteredList: [] as Host[],
    filter: {} as HostFilter
  }),
  actions: {
    setInitialList(hosts: Host[]) {
      this.originalList = hosts;
      this.filteredList = hosts; // Initialize filteredList with originalList
    },
    resetList() {
      this.filteredList = this.originalList;
      this.filter = {}; // Optionally reset filters
    },
    setFilter(filter: HostFilter) {
      this.filter = filter;
      this.applyFilters(); // Automatically apply filters
    },
    applyFilters() {
      this.filteredList = [...this.originalList].filter(host =>
        Object.entries(this.filter).every(([key, filterValue]) => {
          if (!filterValue) return true; // Skip undefined or empty filters

          if (key === 'searchText' && filterValue !== '') {
            return (
              host.alias?.toLowerCase().includes(filterValue.toLowerCase()) ||
              host.domain?.toLowerCase().includes(filterValue.toLowerCase()) ||
              host.ip?.toLowerCase().includes(filterValue.toLowerCase()) ||
              host.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
              host.hostName?.toLowerCase().includes(filterValue.toLowerCase())
            );
          }

          if (key === 'created_at') {
            return host.creationDate?.slice(0, 10) === filterValue.slice(0, 10);
          }

          return host[key as keyof Host] === filterValue;
        })
      );
    }
  },
  getters: {
    getFilteredList(state) {
      return state.filteredList;
    }
  }
});
