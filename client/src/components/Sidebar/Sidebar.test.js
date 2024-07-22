import React from 'react';
import { shallow } from 'enzyme';
import { Sidebar, SIDEBAR_TRANSITION_DURATION } from './Sidebar';
import { ModuleDefinition } from './Sidebar';

describe('Sidebar', () => {
  it('should render with the minimum required props', () => {
    const wrapper = shallow(<Sidebar modules={[]} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle the slim mode in the sidebar when outer button clicked', () => {
    const onExpandCollapse = jest.fn();

    const wrapper = shallow(
      <Sidebar modules={[]} onExpandCollapse={onExpandCollapse} />,
    );

    // default expanded (non-slim)
    expect(
      wrapper.find('.sidebar__collapse-toggle').prop('aria-expanded'),
    ).toEqual('true');
    expect(wrapper.find('.sidebar--slim')).toHaveLength(0);
    expect(onExpandCollapse).not.toHaveBeenCalled();

    // toggle slim mode
    wrapper.find('.sidebar__collapse-toggle').simulate('click');

    expect(
      wrapper.find('.sidebar__collapse-toggle').prop('aria-expanded'),
    ).toEqual('false');
    expect(wrapper.find('.sidebar--slim')).toHaveLength(1);
    expect(onExpandCollapse).toHaveBeenCalledWith(true);
  });

  it('should toggle the sidebar visibility on click (used on mobile)', () => {
    const onExpandCollapse = jest.fn();

    const wrapper = shallow(
      <Sidebar modules={[]} onExpandCollapse={onExpandCollapse} />,
    );

    // default not expanded
    expect(wrapper.find('.sidebar-nav-toggle').prop('aria-expanded')).toEqual(
      'false',
    );
    expect(wrapper.find('.sidebar-nav-toggle--open')).toHaveLength(0);

    // toggle expanded mode
    wrapper.find('.sidebar-nav-toggle').simulate('click');

    // check it is expanded
    expect(wrapper.find('.sidebar-nav-toggle').prop('aria-expanded')).toEqual(
      'true',
    );
    expect(wrapper.find('.sidebar-nav-toggle--open')).toHaveLength(1);
  });

  it('should render modules correctly', () => {
    const mockModules: ModuleDefinition[] = [
      {
        render: (context) => <div key={context.key}>Module {context.key}</div>,
      },
      {
        render: (context) => <div key={context.key}>Module {context.key}</div>,
      },
    ];

    const wrapper = shallow(
      <Sidebar modules={mockModules} />,
    );

    expect(wrapper.find('div').at(3).text()).toEqual('Module 0');
  });

  it('should handle focus and blur states', () => {
    const wrapper = shallow(
      <Sidebar modules={[]} />,
    );

    const sidebarInner = wrapper.find('.sidebar__inner');

    // Simulate focus
    sidebarInner.simulate('focus');
    expect(wrapper.find('.sidebar--slim')).toHaveLength(0); // Should be expanded on focus

    // Simulate blur
    sidebarInner.simulate('blur');
  });

  it('should handle window resize', () => {
    const onExpandCollapse = jest.fn();

    // Mock window.innerWidth
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const wrapper = shallow(
      <Sidebar modules={[]} onExpandCollapse={onExpandCollapse} />,
    );

    expect(wrapper.find('.sidebar--mobile')).toHaveLength(1);

    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));

    setTimeout(() => {
      expect(wrapper.find('.sidebar--mobile')).toHaveLength(0);
    }, SIDEBAR_TRANSITION_DURATION);
  });

  it('should handle navigation', async () => {
    const navigate = jest.fn();
    const mockModules: ModuleDefinition[] = [
      {
        render: (context) => (
          <div key={context.key} onClick={() => context.navigate('/new-path')}>
            Module {context.key}
          </div>
        ),
      },
    ];

    const wrapper = shallow(
      <Sidebar modules={mockModules} navigate={navigate} />,
    );

    wrapper.find('div').at(2).simulate('click');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
