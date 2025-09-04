import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { nextTick } from 'vue';

// Mock the external service and models.
// It's crucial to mock both modules separately and before the component is imported.
vi.mock('../../services/framework', () => ({
  FrameworkService: {
    getScopeQuestions: vi.fn().mockResolvedValue({
      data: {
        questions: [
          {
            code: 'project_name',
            label: 'Nombre del Proyecto',
            question_type: 0, // TEXT
            validation_rules: { max_length: 50 }
          },
          {
            code: 'budget',
            label: 'Presupuesto',
            question_type: 1, // NUMBER
            validation_rules: { min: 1000, max: 100000 }
          },
          {
            code: 'is_urgent',
            label: 'Es Urgente?',
            question_type: 2, // CHECKBOX
            validation_rules: null
          },
          {
            code: 'project_files',
            label: 'Archivos del Proyecto',
            question_type: 3, // FILE
            validation_rules: { max_files: 2, file_type: 'pdf' }
          },
          {
            code: 'evaluation_functions',
            label: 'Funciones a Evaluar',
            question_type: 4, // MULTI_TEXT
            validation_rules: { max_length_per_item: 20 }
          }
        ]
      }
    })
  }
}));

vi.mock('../../models/framework', () => ({
  QuestionType: {
    TEXT: 0,
    NUMBER: 1,
    CHECKBOX: 2,
    FILE: 3,
    MULTI_TEXT: 4
  }
}));

// Install Quasar and mock services
installQuasarPlugin();

describe('FormularioAlcance.vue', () => {
  let wrapper: any;

  beforeEach(async () => {
    // The import for the component should be here to ensure the mocks are applied
    const FormularioAlcance = (await import('../form/ScopeQuestions.vue')).default;
    wrapper = mount(FormularioAlcance);
    // Wait for the onMounted hook to finish fetching data
    await nextTick();
  });

  it('should mount the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render the form title', () => {
    const title = wrapper.find('h4');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Formulario de Alcance');
  });

  it('should render a text input for question_type text', async () => {
    const textInput = wrapper.findComponent({
      name: 'q-input',
      props: { label: 'Nombre del Proyecto' }
    });
    expect(textInput.exists()).toBe(true);

    // Test v-model binding
    await textInput.setValue('Test Project');
    expect(wrapper.vm.answers.project_name).toBe('Test Project');
  });

  it('should render a number input for question_type number', async () => {
    const numberInput = wrapper.findComponent({ name: 'q-input', props: { label: 'Presupuesto' } });
    expect(numberInput.exists()).toBe(true);
  });

  it('should render a checkbox for question_type checkbox', async () => {
    const checkbox = wrapper.findComponent({ name: 'q-checkbox' });
    expect(checkbox.exists()).toBe(true);
    expect(wrapper.vm.answers.is_urgent).toBeUndefined();

    // Test v-model binding
    await checkbox.trigger('click');
    await nextTick();
    expect(wrapper.vm.answers.is_urgent).toBe(true);
  });

  it('should render a file input for question_type 3 (FILE)', () => {
    const fileInput = wrapper.findComponent({ name: 'q-file' });
    expect(fileInput.exists()).toBe(true);
  });

  it('should render multi-text input and handle addition of items', async () => {
    const multiTextInput = wrapper.findComponent({
      name: 'q-input',
      props: { label: 'Funciones a Evaluar' }
    });
    const addButton = wrapper.findComponent({ name: 'q-btn', props: { icon: 'add' } });

    expect(multiTextInput.exists()).toBe(true);
    expect(addButton.exists()).toBe(true);

    // Simulate user input and click
    await multiTextInput.setValue('Function A');
    await addButton.trigger('click');

    // Wait for the next DOM update cycle to ensure the <li> element is rendered
    await nextTick();

    expect(wrapper.vm.auxInputText).toBe('');
  });

  it('should render the "Funciones a Evaluar" title at the correct index', () => {
    const header = wrapper.find('div.text-weight-bold');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe('Funciones a Evaluar');
  });
});
