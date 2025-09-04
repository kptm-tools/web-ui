import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { nextTick } from 'vue';
import { QuestionType } from '../../models/framework';

vi.mock('../../services/framework', () => ({
  FrameworkService: {
    getScopeQuestions: vi.fn().mockResolvedValue({
      data: {
        questions: [
          {
            code: 'project_name',
            label: 'Nombre del Proyecto',
            question_type: QuestionType.TEXT,
            validation_rules: { max_length: 50 }
          },
          {
            code: 'budget',
            label: 'Presupuesto',
            question_type: QuestionType.NUMBER, // NUMBER
            validation_rules: { min: 1000, max: 100000 }
          },
          {
            code: 'is_urgent',
            label: 'Es Urgente?',
            question_type: QuestionType.CHECKBOX,
            validation_rules: null
          },
          {
            code: 'project_files',
            label: 'Archivos del Proyecto',
            question_type: QuestionType.FILE,
            validation_rules: { max_files: 2, file_type: 'pdf' }
          },
          {
            code: 'evaluation_functions',
            label: 'Funciones a Evaluar',
            question_type: QuestionType.MULTI_TEXT,
            validation_rules: { max_length_per_item: 20 }
          }
        ]
      }
    })
  }
}));

vi.mock('../../models/framework', () => ({
  QuestionType: {
    NUMBER: 'number',
    TEXT: 'text',
    CHECKBOX: 'checkbox',
    FILE: 'file',
    MULTI_TEXT: 'multi-text'
  }
}));

installQuasarPlugin();

describe('FormularioAlcance.vue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any;

  beforeEach(async () => {
    const FormularioAlcance = (await import('../form/ScopeQuestions.vue')).default;
    wrapper = mount(FormularioAlcance);
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
    await textInput.setValue('Test Project');
    expect(wrapper.vm.answers.project_name).toBe('Test Project');
  });

  it('should render a number input for question_type number', async () => {
    const numberInput = await wrapper.findComponent({
      name: 'q-input',
      props: { label: 'Presupuesto' }
    });
    expect(numberInput.exists()).toBe(true);
  });

  it('should render a checkbox for question_type checkbox', async () => {
    const checkbox = wrapper.findComponent({ name: 'q-checkbox' });
    expect(checkbox.exists()).toBe(true);
    expect(wrapper.vm.answers.is_urgent).toBeUndefined();

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

    await multiTextInput.setValue('Function A');
    await addButton.trigger('click');
    await nextTick();

    expect(wrapper.vm.auxInputText).toBe('');
  });

  it('should render the "Funciones a Evaluar" title at the correct index', () => {
    const header = wrapper.find('div.text-weight-bold');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe('Funciones a Evaluar');
  });
});
