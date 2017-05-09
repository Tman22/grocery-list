import React from 'react';
import { shallow, mount } from 'enzyme';
import fetchMock from 'fetch-mock';

import AddGroceryForm from './AddGroceryForm';

describe('AddGroceryForm', () => {
  afterEach(() => {
    expect(fetchMock.calls().unmatched).toEqual([]);
    fetchMock.restore();
  });

  const mockGroceries = [
    { id: 1, name: 'Pineapples', quantity: 10 },
    { id: 2, name: 'Coconuts', quantity: 1000 },
    { id: 3, name: 'Pears', quantity: 5 }
  ];

  it.skip('submits the correct data when adding a new grocery', async () => {

    fetchMock.post('/api/v1/groceries', {
      status: 200,
      body: mockGroceries
    });

    const mockFn = jest.fn()
    const wrapper = mount(
      <AddGroceryForm updateGroceryList={ mockFn } />
    )
    const nameInput = wrapper.find('input[name="name"]');
    const qtyInput = wrapper.find('input[name="quantity"]');
    const formElem = wrapper.find('form');

    nameInput.simulate('change', {
      target: { name: 'name', value: 'Foo' }
    });

    qtyInput.simulate('change', {
      target: { name: 'quantity', value: '1000' }
    });

    formElem.simulate('submit');

    await wrapper.update();

    expect(fetchMock.called()).toEqual(true);
    expect(fetchMock.lastUrl()).toEqual('/api/v1/groceries');
    expect(fetchMock.lastOptions()).toEqual({
          method: 'POST',
          body: '{"grocery":{"name":"Foo","quantity":"1000"}}',
          headers: { 'Content-Type': 'application/json' }
    });
    expect(wrapper.state()).toEqual('')
  });

  it('submits the incorrect data when adding a new grocery', async () => {

    fetchMock.post('/api/v1/groceries', {
      status: 400
    });

    const mockFn = jest.fn()
    const wrapper = mount(
      <AddGroceryForm updateGroceryList={ mockFn } />
    )
    const formElem = wrapper.find('form');

    formElem.simulate('submit');

    await wrapper.update();

    expect(fetchMock.called()).toEqual(true);
    expect(fetchMock.lastUrl()).toEqual('/api/v1/groceries');
    expect(fetchMock.lastOptions()).toEqual({
          method: 'POST',
          body: '{"grocery":{"name":"","quantity":""}}',
          headers: { 'Content-Type': 'application/json' }
    });
    expect(wrapper.state('errorStatus')).toEqual('Error adding grocery');
  });
});
