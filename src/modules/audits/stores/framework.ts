import { defineStore } from 'pinia';
import { FrameworkService } from '../services/framework';
import type {
  StructureCategory,
  StructureFunction,
  StructureResponse,
  SubCategoryDetail
} from '../models/framework';
import type { AxiosError } from 'axios';
import { Loading } from 'quasar';
import { toRaw } from 'vue';

interface FrameworkStore {
  loading: boolean;
  structure: null | StructureResponse;
  error: string | null;
  pickedFunctionIndex: number;
  pickedCategoryIndex: number;
  subcategoryDetail: null | SubCategoryDetail;
}

export const useFrameworkStore = defineStore('framework', {
  state: (): FrameworkStore => ({
    loading: false,
    structure: null,
    error: null,
    pickedFunctionIndex: 0,
    pickedCategoryIndex: 0,
    subcategoryDetail: null
  }),
  getters: {
    isStructureLoaded: state => state.structure !== null,
    currentStructureFunctions: state => {
      const auxArray = toRaw(state.structure?.functions ?? []).map((obj: StructureFunction) => {
        const auxObj = { ...obj };
        // @ts-expect-error: 'categories' might not be a known key on StructureFunction
        delete auxObj['categories'];
        return auxObj;
      });

      return auxArray ?? [];
    },
    currentStructureCategories: state => {
      const auxArray = toRaw(
        state.structure?.functions[state.pickedFunctionIndex ?? 0]?.categories
      )?.map((obj: StructureCategory) => {
        const auxObj = { ...obj };
        // @ts-expect-error: 'categories' might not be a known key on StructureFunction
        delete auxObj['subcategories'];
        return auxObj;
      });
      return auxArray ?? [];
    },
    currentStructureSubcategories: state =>
      state.structure?.functions[state.pickedFunctionIndex ?? 0]?.categories[
        state.pickedCategoryIndex ?? 0
      ]?.subcategories ?? [],
    currentCategoryIndex: state => state.pickedCategoryIndex
  },
  actions: {
    async fetchStructure(): Promise<void> {
      if (this.loading) {
        console.warn('Framework structure fetch already in progress. Aborting.');
        return;
      }

      if (this.isStructureLoaded) {
        console.warn('Framework structure already loaded. Aborting fetch.');
        return;
      }

      Loading.show();
      this.error = null;
      this.loading = true;

      try {
        const response = await FrameworkService.getStructure();
        this.structure = response.data;
      } catch (err: unknown) {
        const message = (err as AxiosError).message;
        console.error('Failed to fetch framework structure:', message);
        this.error = message || 'An unknown error occurred while fetching data.';
        this.structure = null;
      } finally {
        this.loading = false;
        Loading.hide();
      }
    },

    clearStructure(): void {
      this.structure = null;
      this.error = null;
    },

    clearPickedFunctionAndCategoryIndex(): void {
      this.pickedFunctionIndex = 0;
      this.pickedCategoryIndex = 0;
    },

    pickFunctionIndex(index: number): void {
      this.pickedFunctionIndex = index;
    },

    pickCategoryIndex(index: number): void {
      this.pickedCategoryIndex = index;
    },

    async setSubCategoryDetailData(id: string): Promise<SubCategoryDetail> {
      let data = {} as SubCategoryDetail;
      if (this.subcategoryDetail?.code === id) {
        data = this.subcategoryDetail;
      } else {
        data = (await FrameworkService.getSubcategoryByCode(id)).data;
        this.subcategoryDetail = data;
      }
      return data;
    }
  }
});
