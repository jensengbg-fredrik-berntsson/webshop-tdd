import { mount } from '@vue/test-utils';
import FilterSearch from '@/components/FilterSearch.vue';
import Products from '@/components/Products.vue';
import jsonProducts from '@/assets/products.json';
//Searchfield
//1. Sökfältet skall vara "" vid rendering
//2. Testa att input filtrerar skorna korrekt
//3.

describe('FilterSearch.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Products);
  });

  it('should have certain values when rendered', () => {
    const filter = wrapper.findComponent(FilterSearch);

    let inputField = filter.find('.input').element.value,
      sizeSelect = filter.find('.size').findAll('option'),
      priceSelect = filter.find('.price').findAll('option');

    sizeSelect = sizeSelect.at(0).attributes('value');
    priceSelect = priceSelect.at(0).attributes('value');

    expect(inputField).toStrictEqual('');
    expect(sizeSelect).toBe('Size');
    expect(priceSelect).toBe('Price');
  });

  // INPUT FILTER
  it('Should only display products of a certain brand when user enters a brand in input', async () => {
    const filter = wrapper.findComponent(FilterSearch),
      input = filter.find('.input'),
      filterBtn = filter.find('.filter_button'),
      products = jsonProducts.products,
      expected = products.filter((product) => {
        const str = product.brand.toLowerCase();
        return str.includes('dkny');
      });

    await input.setValue('vans');
    await filterBtn.trigger('click');
    const productsArray = wrapper.findAll('li'),
      actual = productsArray.length;

    expect(actual).toBe(expected.length);
  });

  // SIZE FILTER
  it('should display products of a certain size when user selects a size-option', async () => {
    const filter = wrapper.findComponent(FilterSearch),
      sizeSelect = filter.find('.size').findAll('option'),
      filterBtn = filter.find('.filter_button'),
      products = jsonProducts.products,
      expected = products.filter((product) => {
        for (let i = 0; i < product.sizes.length; i++) {
          let stock = parseInt(product.sizes[i].stock);
          if (product.sizes[i].size === 43 && stock > 0) {
            return product;
          }
        }
      });

    await sizeSelect.at(3).setSelected();
    await filterBtn.trigger('click');
    const productsArray = wrapper.findAll('li'),
      actual = productsArray.length;

    expect(actual).toBe(expected.length);
  });

  // PRICE FILTER
  it('should display products withing a certain price range', async () => {
    const filter = wrapper.findComponent(FilterSearch),
      priceSelect = filter.find('.price').findAll('option'),
      filterBtn = filter.find('.filter_button'),
      products = jsonProducts.products,
      expected = products.filter((product) => {
        if (parseInt(product.price) >= 700 && parseInt(product.price) <= 899) {
          return product;
        }
      });

    await priceSelect.at(3).setSelected();
    await filterBtn.trigger('click');
    const productsArray = wrapper.findAll('li'),
      actual = productsArray.length;

    expect(actual).toBe(expected.length);
  });
});
