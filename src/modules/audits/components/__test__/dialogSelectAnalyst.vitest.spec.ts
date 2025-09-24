import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { nextTick } from 'vue';
import Quasar from 'quasar';

vi.mock('src/boot/i18n.ts', () => ({
  default: () => {}
}));

installQuasarPlugin();

describe('DialogSelectAnalyst', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any;

  beforeEach(async () => {
    const DialogSelectAnalyst = (await import('../dialog/DialogSelectAnalyst.vue')).default;
    wrapper = mount(DialogSelectAnalyst, {
      global: {
        plugins: [Quasar]
      },
      props: {
        modelValue: true,
        audit: 'Audit 123',
        id: '',
        analysts: [
          {
            id: 'analyst1',
            display_name: 'John Doe',
            workload: { active_audits: 2, completed_audits: 0 }
          },
          {
            id: 'analyst2',
            display_name: 'John Doe 2',
            workload: { active_audits: 2, completed_audits: 0 }
          }
        ]
      }
    });
    await nextTick();
  });

  it('should mount the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render the component with the correct title and analyst list', async () => {
    await nextTick();
    const body = document.body;
    expect(body.querySelector('.text-h5')?.textContent).contain('Asignar Analista a Audit 123');
  });
});
