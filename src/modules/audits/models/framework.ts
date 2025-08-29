export interface MaturityLevelResponse {
  levels: MaturityLevel[];
}

export interface ScopeQuestionResponse {
  questions: ScopeQuestion[];
}

export interface StructureResponse {
  functions: StructureFunction[];
}

export interface MaturityLevel {
  description: string;
  level: number;
  title: string;
}

export interface ScopeQuestion {
  code: string;
  label: string;
  question_type: string;
  validation_rules?: {
    file_type?: string;
    max_files?: number;
    max_length?: number;
    min?: number;
    max?: number;
    max_length_per_item?: number;
  };
}

export interface StructureSubcategory {
  code: string;
  description: string;
  id: string;
}

export interface StructureCategory {
  code: string;
  description: string;
  name: string;
  subcategories: StructureSubcategory[];
  subcategory_count: number;
}

export interface StructureFunction {
  categories: StructureCategory[];
  code: string;
  description: string;
  name: string;
}

export interface SubCategoryDetail {
  code: string;
  description: string;
  evidence_examples: string[];
  implementation_details: string[];
  name: string;
}
