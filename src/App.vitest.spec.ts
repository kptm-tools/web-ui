import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import App from './App.vue'; // Adjust the import path as needed

describe('App.vue', () => {
  it('should render the router-view component', () => {
    const wrapper = mount(App);
    expect(wrapper.html()).toContain('<router-view></router-view>');
  });
});
